const { getStore } = require('@netlify/blobs');

function storeName() {
  return 'payment-status';
}

async function savePaymentRecord(key, data) {
  try {
    const store = getStore(storeName());
    await store.setJSON(String(key), { ...data, updatedAt: new Date().toISOString() });
    return true;
  } catch {
    return false;
  }
}

async function getPaymentRecord(key) {
  try {
    const store = getStore(storeName());
    return await store.get(String(key), { type: 'json' });
  } catch {
    return null;
  }
}

function parsePackId(externalReference) {
  if (!externalReference) return null;
  const packId = String(externalReference).split('|')[0];
  return packId || null;
}

module.exports = { savePaymentRecord, getPaymentRecord, parsePackId };
