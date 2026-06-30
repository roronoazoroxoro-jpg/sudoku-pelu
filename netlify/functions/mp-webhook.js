const { getPack } = require('./shop-packs');
const { savePaymentRecord, parsePackId } = require('./payment-store');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return { statusCode: 200, body: 'OK' };
  }

  let paymentId = null;
  const qs = event.queryStringParameters || {};

  if (qs.topic === 'payment' || qs.type === 'payment') {
    paymentId = qs.id || qs['data.id'];
  }

  if (!paymentId && event.body) {
    try {
      const body = JSON.parse(event.body);
      paymentId = body?.data?.id || body?.id;
    } catch {
      /* ignore */
    }
  }

  if (!paymentId) {
    return { statusCode: 200, body: 'OK' };
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payment = await response.json();
    if (!response.ok) {
      return { statusCode: 200, body: 'OK' };
    }

    const packId = parsePackId(payment.external_reference);
    const pack = getPack(packId);

    if (payment.status === 'approved' && pack) {
      if (Number(payment.transaction_amount) < pack.price) {
        return { statusCode: 200, body: 'OK' };
      }
      await savePaymentRecord(paymentId, {
        approved: true,
        packId,
        paymentId: String(payment.id),
        amount: payment.transaction_amount,
        externalReference: payment.external_reference,
      });
    }
  } catch {
    /* ignore */
  }

  return { statusCode: 200, body: 'OK' };
};
