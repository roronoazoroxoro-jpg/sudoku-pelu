/** Catálogo de packs — debe coincidir con config.js (precios en ARS) */
const SHOP_PACKS = {
  'pack-3': {
    id: 'pack-3',
    name: 'Pack Inicio',
    description: '3 vidas extras',
    lives: 3,
    price: 5000,
    infinite: false,
  },
  'pack-10': {
    id: 'pack-10',
    name: 'Pack Avanzado',
    description: '10 vidas extras',
    lives: 10,
    price: 10000,
    infinite: false,
  },
  'pack-25': {
    id: 'pack-25',
    name: 'Pack Legendario',
    description: '25 vidas extras',
    lives: 25,
    price: 20000,
    infinite: false,
  },
  'pack-premium': {
    id: 'pack-premium',
    name: 'Premium Infinito',
    description: 'Vidas ilimitadas para siempre',
    lives: 0,
    price: 90000,
    infinite: true,
  },
};

function getPack(packId) {
  return SHOP_PACKS[packId] || null;
}

module.exports = { SHOP_PACKS, getPack };
