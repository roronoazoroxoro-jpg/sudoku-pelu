/**
 * Webhook para transferencias entrantes a cuenta Macro (Bind / banca empresa).
 * Configurá tu banco para enviar POST acá cuando impacte un pago.
 * Debe incluir monto + código de referencia (PEL-...) en el motivo/descripción.
 */
const { getStore } = require('@netlify/blobs');
const { getPack } = require('./shop-packs');

function extractRef(text) {
  if (!text) return null;
  const match = String(text).match(/PEL-[A-Z0-9-]+/i);
  return match ? match[0].toUpperCase() : null;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'POST only' }) };
  }

  const secret = process.env.WEBHOOK_SECRET;
  const headerSecret = event.headers['x-webhook-secret'] || event.headers['X-Webhook-Secret'];

  if (secret && headerSecret !== secret) {
    return { statusCode: 403, body: JSON.stringify({ error: 'No autorizado' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  let amount = body.amount || body.monto;
  let ref = body.ref || body.reference;

  if (body.data?.charge?.value?.amount) {
    amount = body.data.charge.value.amount;
  }
  if (!ref) {
    ref = extractRef(body.description || body.motivo || body.concept || JSON.stringify(body));
  }

  if (!ref || amount == null) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan ref o amount' }) };
  }

  try {
    const intentStore = getStore('transfer-intents');
    const intent = await intentStore.get(ref, { type: 'json' });

    if (!intent) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Referencia desconocida' }) };
    }

    const pack = getPack(intent.packId);
    if (!pack || Number(amount) < pack.price) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Monto incorrecto' }) };
    }

    intent.status = 'approved';
    intent.approvedAt = new Date().toISOString();
    await intentStore.setJSON(ref, intent);

    const payStore = getStore('payment-status');
    await payStore.setJSON(`ref:${ref}`, {
      approved: true,
      packId: intent.packId,
      ref,
      amount: Number(amount),
      source: 'macro-webhook',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, packId: intent.packId, ref }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Error interno' }) };
  }
};
