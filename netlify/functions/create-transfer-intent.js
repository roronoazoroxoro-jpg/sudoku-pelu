const { getStore } = require('@netlify/blobs');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function makeRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  let packId;
  try {
    packId = JSON.parse(event.body || '{}').packId;
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'JSON inválido' }) };
  }

  const { getPack } = require('./shop-packs');
  const pack = getPack(packId);
  if (!pack) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Pack no encontrado' }) };
  }

  const ref = `PEL-${pack.id.replace('pack-', '')}-${makeRef()}`;
  const intent = {
    ref,
    packId: pack.id,
    amount: pack.price,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  try {
    const store = getStore('transfer-intents');
    await store.setJSON(ref, intent);
  } catch {
    /* Blobs no disponible en local */
  }

  return {
    statusCode: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ref,
      packId: pack.id,
      amount: pack.price,
      alias: process.env.PAYMENT_ALIAS || 'FLECO.CRUCE.CINTO',
      bank: process.env.PAYMENT_BANK || 'Banco Macro',
    }),
  };
};
