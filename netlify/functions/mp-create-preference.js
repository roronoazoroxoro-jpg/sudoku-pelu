const { getPack } = require('./shop-packs');

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

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return {
      statusCode: 503,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Mercado Pago no está configurado en el servidor.' }),
    };
  }

  let packId;
  try {
    packId = JSON.parse(event.body || '{}').packId;
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  const pack = getPack(packId);
  if (!pack) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Pack no encontrado' }) };
  }

  const baseUrl = (process.env.URL || process.env.SITE_URL || '').replace(/\/$/, '');
  if (!baseUrl) {
    return {
      statusCode: 503,
      headers: CORS,
      body: JSON.stringify({ error: 'URL del sitio no configurada.' }),
    };
  }

  const ref = `PEL-${pack.id.replace('pack-', '')}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const baseUrl = (process.env.URL || process.env.SITE_URL || '').replace(/\/$/, '');

  const preference = {
    items: [
      {
        id: pack.id,
        title: `Sudoku Pelu — ${pack.name}`,
        description: `${pack.description} · Ref ${ref}`,
        quantity: 1,
        currency_id: 'ARS',
        unit_price: pack.price,
      },
    ],
    external_reference: `${pack.id}|${ref}`,
    metadata: { pack_id: pack.id, payment_ref: ref },
    back_urls: {
      success: `${baseUrl}/index.html?mp_return=success&ref=${encodeURIComponent(ref)}`,
      failure: `${baseUrl}/index.html?mp_return=failure&ref=${encodeURIComponent(ref)}`,
      pending: `${baseUrl}/index.html?mp_return=pending&ref=${encodeURIComponent(ref)}`,
    },
    auto_return: 'approved',
    notification_url: `${baseUrl}/.netlify/functions/mp-webhook`,
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        statusCode: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: data.message || 'Error al crear el pago' }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: data.init_point,
        sandboxUrl: data.sandbox_init_point,
        preferenceId: data.id,
        ref,
        packId: pack.id,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'No se pudo conectar con Mercado Pago.' }),
    };
  }
};
