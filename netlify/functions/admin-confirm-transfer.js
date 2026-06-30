const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return { statusCode: 503, headers: CORS, body: JSON.stringify({ error: 'Admin no configurado' }) };
  }

  let ref;
  let secret;
  try {
    ({ ref, secret } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  if (secret !== adminSecret || !ref) {
    return { statusCode: 403, headers: CORS, body: JSON.stringify({ error: 'No autorizado' }) };
  }

  try {
    const store = getStore('transfer-intents');
    const intent = await store.get(ref, { type: 'json' });
    if (!intent) {
      return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Referencia no encontrada' }) };
    }
    intent.status = 'approved';
    intent.approvedAt = new Date().toISOString();
    await store.setJSON(ref, intent);
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved: true, packId: intent.packId, ref }),
    };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Error al confirmar' }) };
  }
};
