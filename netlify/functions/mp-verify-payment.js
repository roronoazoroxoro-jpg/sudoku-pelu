const { getPack } = require('./shop-packs');
const { savePaymentRecord, parsePackId } = require('./payment-store');

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

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return {
      statusCode: 503,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Mercado Pago no está configurado en el servidor.' }),
    };
  }

  const paymentId =
    event.queryStringParameters?.payment_id ||
    event.queryStringParameters?.collection_id;

  if (!paymentId) {
    return {
      statusCode: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Falta payment_id' }),
    };
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payment = await response.json();

    if (!response.ok) {
      return {
        statusCode: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false, error: payment.message || 'Pago no encontrado' }),
      };
    }

    const approved = payment.status === 'approved';
    const packId = parsePackId(payment.external_reference);
    const pack = getPack(packId);

    if (approved && !pack) {
      return {
        statusCode: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false, error: 'Pack desconocido en el pago' }),
      };
    }

    if (approved && pack && Number(payment.transaction_amount) < pack.price) {
      return {
        statusCode: 200,
        headers: { ...CORS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false, status: payment.status, error: 'Monto incorrecto' }),
      };
    }

    if (approved && pack) {
      await savePaymentRecord(String(payment.id), {
        approved: true,
        packId,
        paymentId: String(payment.id),
        amount: payment.transaction_amount,
      });
    }

    return {
      statusCode: 200,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approved,
        status: payment.status,
        packId: approved ? packId : null,
        paymentId: String(payment.id),
        amount: payment.transaction_amount,
      }),
    };
  } catch {
    return {
      statusCode: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Error al verificar el pago' }),
    };
  }
};
