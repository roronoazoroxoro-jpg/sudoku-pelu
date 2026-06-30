/** Configuración comercial — editá acá antes de publicar */

window.APP_CONFIG = {

  appName: 'Sudoku Pelu',

  tagline: '6 mapas · 600 niveles',

  mapCount: 6,

  levelsPerMap: 100,

  bossLevels: [50, 100],

  paymentCurrency: 'ARS',

  /**

   * Cuenta de cobro — Banco Macro (alias CBU).

   * El jugador puede transferir desde CUALQUIER banco o billetera

   * (Galicia, BBVA, Mercado Pago, Ualá, etc.) sin usar Mercado Pago.

   */

  paymentAlias: 'FLECO.CRUCE.CINTO',

  paymentBank: 'Banco Macro',

  supportEmail: 'sudokupelu@gmail.com',

  siteUrl: '',
  paymentPollIntervalMs: 3000,
  freeHeartIntervalHours: 12,

  usdReferenceRate: 1400,

  shopPacks: [

    {

      id: 'pack-3',

      name: 'Pack Inicio',

      description: '3 vidas extras',

      lives: 3,

      price: 5000,

      icon: '❤️',

    },

    {

      id: 'pack-10',

      name: 'Pack Avanzado',

      description: '10 vidas extras',

      lives: 10,

      price: 10000,

      icon: '💖',

    },

    {

      id: 'pack-25',

      name: 'Pack Legendario',

      description: '25 vidas extras',

      lives: 25,

      price: 20000,

      icon: '💝',

    },

    {

      id: 'pack-premium',

      name: 'Premium Infinito',

      description: 'Vidas ilimitadas para siempre',

      infinite: true,

      price: 90000,

      icon: '👑',

      premium: true,

    },

  ],

  mapNames: [

    'Ciudad Neón',

    'Distrito Cyber',

    'Zona Pulse',

    'Sector Matrix',

    'Torre Violeta',

    'Núcleo Final',

  ],

};

