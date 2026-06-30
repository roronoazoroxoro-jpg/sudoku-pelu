const { getPack } = require('./shop-packs');
const { getPaymentRecord, parsePackId } = require('./payment-store');
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
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'GET only' }) };
  }

  const paymentId = event.queryStringParameters?.payment_id;
  const ref = event.queryStringParameters?.ref;

  if (paymentId) {
    const cached = await getPaymentRecord(paymentId);
    if (cached?.approved) {
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true, packId: cached.packId, paymentId }),
      };
    }

    const token = process.env.MP_ACCESS_TOKEN;
    if (token) {
      try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payment = await response.json();
        const packId = parsePackId(payment.external_reference);
        const pack = getPack(packId);
        if (response.ok && payment.status === 'approved' && pack && Number(payment.transaction_amount) >= pack.price) {
          return {
            statusCode: 200,
            headers: { ...CORS, 'Content-Type': 'application/json' },
            body: JSON.stringify({ approved: true, packId, paymentId: String(payment.id) }),
          };
        }
      } catch {
        /* ignore */
      }
    }
  }

  if (ref) {
    try {
      const payStore = getStore('payment-status');
      const byRef = await payStore.get(`ref:${ref}`, { type: 'json' });
      if (byRef?.approved) {
        return {
          statusCode: 200,
          headers: { ...CORS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved: true, packId: byRef.packId, ref }),
        };
      }

      const intentStore = getStore('transfer-intents');
      const intent = await intentStore.get(ref, { type: 'json' });
      if (intent?.status === 'approved') {
        return {
          statusCode: 200,
          headers: { ...CORS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ approved: true, packId: intent.packId, ref }),
        };
      }
    } catch {
      /* ignore */
    }
  }

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ approved: false, status: 'pending' }),
  };
};
