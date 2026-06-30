const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  const ref = event.queryStringParameters?.ref;
  if (!ref) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Falta ref' }) };
  }

  try {
    const store = getStore('transfer-intents');
    const intent = await store.get(ref, { type: 'json' });

    if (!intent) {
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'unknown', approved: false }),
      };
    }

    if (intent.status === 'approved') {
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', approved: true, packId: intent.packId, ref }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'pending',
        approved: false,
        message: 'Transferencia pendiente de confirmación. Revisamos tu Macro y activamos el pack.',
      }),
    };
  } catch {
    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'pending', approved: false }),
    };
  }
};
