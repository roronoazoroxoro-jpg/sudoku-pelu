const CONFIG = window.APP_CONFIG || {};
const SIZE = 9;
const BOX = 3;
const MAP_COUNT = CONFIG.mapCount || 6;
const LEVELS_PER_MAP = CONFIG.levelsPerMap || 100;
const BOSS_LEVELS = CONFIG.bossLevels || [50, 100];
const MAP_NAMES = CONFIG.mapNames || Array.from({ length: MAP_COUNT }, (_, i) => `Mapa ${i + 1}`);
const SHOP_PACKS = CONFIG.shopPacks || [];
const PAYMENT_CURRENCY = CONFIG.paymentCurrency || 'ARS';
const PAYMENT_ALIAS = CONFIG.paymentAlias || 'FLECO.CRUCE.CINTO';
const PAYMENT_BANK = CONFIG.paymentBank || 'Banco Macro';
const PAYMENT_POLL_INTERVAL = CONFIG.paymentPollIntervalMs || 3000;
const FREE_HEART_HOURS = CONFIG.freeHeartIntervalHours || 12;
const FREE_HEART_MS = FREE_HEART_HOURS * 60 * 60 * 1000;
const MP_API_BASE = '/.netlify/functions';
const MAP_COLS = 4;
const MAP_ROW_HEIGHT = 100;
const MAP_WIDTH = 360;

const mainMenu = document.querySelector('#main-menu');
const worldMapScreen = document.querySelector('#world-map-screen');
const worldsGrid = document.querySelector('#worlds-grid');
const levelMapScreen = document.querySelector('#level-map-screen');
const neonNav = document.querySelector('.neon-nav');
const btnBackWorlds = document.querySelector('#btn-back-worlds');
const btnBackMenuFromWorlds = document.querySelector('#btn-back-menu-from-worlds');
const mapNameLabel = document.querySelector('#map-name-label');
const mapLevelSub = document.querySelector('#map-level-sub');
const playArea = document.querySelector('#play-area');
const bossPanel = document.querySelector('#boss-panel');
const bossBoard = document.querySelector('#boss-board');
const bossStatus = document.querySelector('#boss-status');
const playerRaceFill = document.querySelector('#player-race-fill');
const bossRaceFill = document.querySelector('#boss-race-fill');
const playerRacePct = document.querySelector('#player-race-pct');
const bossRacePct = document.querySelector('#boss-race-pct');
const bossDefeatModal = document.querySelector('#boss-defeat-modal');
const btnBossRetry = document.querySelector('#btn-boss-retry');
const btnBossToMap = document.querySelector('#btn-boss-to-map');
const btnMapShop = document.querySelector('#btn-map-shop');
const btnBackMap = document.querySelector('#btn-back-map');
const btnHomeMenu = document.querySelector('#btn-home-menu');
const settingsModal = document.querySelector('#settings-modal');
const settingsMusic = document.querySelector('#settings-music');
const settingsSfx = document.querySelector('#settings-sfx');
const btnCloseSettings = document.querySelector('#btn-close-settings');
const menuCompleted = document.querySelector('#menu-completed');
const menuUnlocked = document.querySelector('#menu-unlocked');
const menuStreak = document.querySelector('#menu-streak');
const mapProgressLabel = document.querySelector('#map-progress-label');
const neonPathSvg = document.querySelector('#neon-path-svg');
const levelNodes = document.querySelector('#level-nodes');
const neonPathScroll = document.querySelector('#neon-path-scroll');
const levelCompleteModal = document.querySelector('#level-complete-modal');
const completeTitle = document.querySelector('#complete-title');
const completeMessage = document.querySelector('#complete-message');
const completeTime = document.querySelector('#complete-time');
const completeStreak = document.querySelector('#complete-streak');
const btnGoMap = document.querySelector('#btn-go-map');
const btnPlayNext = document.querySelector('#btn-play-next');
const appShell = document.querySelector('#app-shell');
const levelSelect = document.querySelector('#level-select');
const levelLabel = document.querySelector('#level-label');
const difficultyLabel = document.querySelector('#difficulty-label');
const cluesLabel = document.querySelector('#clues-label');
const livesDisplay = document.querySelector('#lives-display');
const streakBadge = document.querySelector('#streak-badge');
const timerLabel = document.querySelector('#timer-label');
const globalProgressFill = document.querySelector('#global-progress-fill');
const boardFillBar = document.querySelector('#board-fill-bar');
const fillPercent = document.querySelector('#fill-percent');
const boardElement = document.querySelector('#sudoku-board');
const messageElement = document.querySelector('#message');
const btnNext = document.querySelector('#btn-next');
const btnPrev = document.querySelector('#btn-prev');
const btnReset = document.querySelector('#btn-reset');
const btnSolve = document.querySelector('#btn-solve');
const btnShop = document.querySelector('#btn-shop');
const btnShare = document.querySelector('#btn-share');
const btnInstall = document.querySelector('#btn-install');
const btnBuySidebar = document.querySelector('#btn-buy-sidebar');
const footerShop = document.querySelector('#footer-shop');
const footerAlias = document.querySelector('#footer-alias');
const footerBank = document.querySelector('#footer-bank');
const shopPaymentAlias = document.querySelector('#shop-payment-alias');
const SUPPORT_EMAIL = CONFIG.supportEmail || 'sudokupelu@gmail.com';
const paymentWaitModal = document.querySelector('#payment-wait-modal');
const paymentWaitStatus = document.querySelector('#payment-wait-status');
const waitBank = document.querySelector('#wait-bank');
const waitAlias = document.querySelector('#wait-alias');
const waitAmount = document.querySelector('#wait-amount');
const waitRef = document.querySelector('#wait-ref');
const btnCancelPaymentWait = document.querySelector('#btn-cancel-payment-wait');
const musicToggle = document.querySelector('#music-toggle');
const padTop = document.querySelector('#pad-top');
const padLeft = document.querySelector('#pad-left');
const padRight = document.querySelector('#pad-right');
const padBottom = document.querySelector('#pad-bottom');
const gameOverModal = document.querySelector('#game-over-modal');
const shopModal = document.querySelector('#shop-modal');
const purchaseBoxGameover = document.querySelector('#purchase-box-gameover');
const purchaseBoxShop = document.querySelector('#purchase-box-shop');
const packCardTemplate = document.querySelector('#pack-card-template');
const freeHeartTemplate = document.querySelector('#free-heart-template');
const btnRestartLevel = document.querySelector('#btn-restart-level');
const btnCloseModal = document.querySelector('#btn-close-modal');
const btnCloseShop = document.querySelector('#btn-close-shop');
const confettiCanvas = document.querySelector('#confetti-canvas');
const mobileHud = document.querySelector('#mobile-hud');
const mobileLevel = document.querySelector('#mobile-level');
const mobileLivesDisplay = document.querySelector('#mobile-lives-display');
const mobileTimer = document.querySelector('#mobile-timer');
const mobileStreak = document.querySelector('#mobile-streak');
const mobileDock = document.querySelector('#mobile-dock');
const mobileDockGrid = document.querySelector('#mobile-dock-grid');
const btnMoreMobile = document.querySelector('#btn-more-mobile');
const mobileMenuModal = document.querySelector('#mobile-menu-modal');
const btnCloseMobileMenu = document.querySelector('#btn-close-mobile-menu');
const mobileMenuReset = document.querySelector('#mobile-menu-reset');
const mobileMenuSolve = document.querySelector('#mobile-menu-solve');
const mobileMenuShare = document.querySelector('#mobile-menu-share');
const mobileMenuInstall = document.querySelector('#mobile-menu-install');
const mobileMusicToggle = document.querySelector('#mobile-music-toggle');

let deferredInstallPrompt = null;
let gameStarted = false;
let sfxEnabled = true;
let mapProgress = {};
let unlockedMaps = 1;
let currentMapId = 1;
let currentLevelInMap = 1;
let viewingMapId = 1;
let highlightNextLevel = null;
let pendingNextLevel = null;
let pendingNextMap = null;
let bossInterval = null;
let bossCellsFilled = 0;
let bossSolveOrder = [];
let bossActive = false;
let bossDefeated = false;

let lives = 3;
let infiniteLives = false;
let freeHeartTimerInterval = null;
let currentPaymentIntent = null;
let paymentPollInterval = null;
let streak = 0;
let timerSeconds = 0;
let timerInterval = null;
let audioContext = null;
let musicInterval = null;
let currentMusicIndex = 0;
let selectedCell = { cell: null, input: null, row: null, col: null };
let isTransitioning = false;
let isBoardDisabled = false;
let confettiParticles = [];
let confettiAnimating = false;

const baseSolution = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 4, 5, 6, 7, 8, 9, 1],
  [5, 6, 7, 8, 9, 1, 2, 3, 4],
  [8, 9, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 8, 9, 1, 2],
  [6, 7, 8, 9, 1, 2, 3, 4, 5],
  [9, 1, 2, 3, 4, 5, 6, 7, 8],
];

let currentLevel = null;
let currentBoard = [];
let currentSolution = [];

const CONFETTI_COLORS = ['#a855f7', '#22d3ee', '#fbbf24', '#4ade80', '#f472b6', '#fb7185'];

function haptic(type = 'light') {
  if (!navigator.vibrate) return;
  const patterns = { light: 8, medium: [12, 40, 12], heavy: [20, 60, 30], success: [10, 30, 10, 30, 20] };
  const pattern = typeof type === 'string' ? (patterns[type] || patterns.light) : type;
  navigator.vibrate(pattern);
}

function touchPress(element) {
  if (!element) return;
  element.classList.add('touch-pressed');
  clearTimeout(element._pressTimer);
  element._pressTimer = setTimeout(() => element.classList.remove('touch-pressed'), 180);
}

function syncMobileHud() {
  if (mobileLevel) mobileLevel.textContent = levelLabel?.textContent || '1';
  if (mobileTimer && timerLabel) mobileTimer.textContent = timerLabel.textContent;
  if (mobileStreak && streakBadge) mobileStreak.textContent = streakBadge.textContent;
}

function xmur3(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createRng(seedText) {
  const seed = xmur3(seedText)();
  return mulberry32(seed);
}

function cloneGrid(grid) {
  return grid.map(row => row.slice());
}

function shuffle(array, rng) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function swapRowsWithinBand(board, rng) {
  for (let band = 0; band < SIZE; band += BOX) {
    const rows = board.slice(band, band + BOX);
    const order = shuffle([0, 1, 2], rng);
    for (let i = 0; i < BOX; i += 1) board[band + i] = rows[order[i]];
  }
}

function swapColsWithinStack(board, rng) {
  for (let stack = 0; stack < SIZE; stack += BOX) {
    const columns = [];
    for (let c = 0; c < BOX; c += 1) columns.push(board.map(row => row[stack + c]));
    const order = shuffle([0, 1, 2], rng);
    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < BOX; c += 1) board[r][stack + c] = columns[order[c]][r];
    }
  }
}

function swapBandRows(board, rng) {
  const bands = [];
  for (let band = 0; band < SIZE; band += BOX) bands.push(board.slice(band, band + BOX));
  const order = shuffle([0, 1, 2], rng);
  for (let i = 0; i < BOX; i += 1) board.splice(i * BOX, BOX, ...bands[order[i]]);
}

function swapBandCols(board, rng) {
  const stacks = [[], [], []];
  for (let c = 0; c < SIZE; c += BOX) {
    for (let r = 0; r < SIZE; r += 1) stacks[c / BOX].push(board[r].slice(c, c + BOX));
  }
  const order = shuffle([0, 1, 2], rng);
  for (let r = 0; r < SIZE; r += 1) {
    const newRow = [];
    for (let block = 0; block < BOX; block += 1) newRow.push(...stacks[order[block]][r]);
    board[r] = newRow;
  }
}

function applyDigitMapping(grid, rng) {
  const map = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
  return grid.map(row => row.map(value => map[value - 1]));
}

function generateCompleteGrid(seedText) {
  const rng = createRng(seedText);
  let board = cloneGrid(baseSolution);
  swapRowsWithinBand(board, rng);
  swapBandRows(board, rng);
  swapColsWithinStack(board, rng);
  swapBandCols(board, rng);
  board = applyDigitMapping(board, rng);
  return board;
}

function isValidValue(board, row, col, value) {
  if (board[row][col] !== 0) return false;
  for (let x = 0; x < SIZE; x += 1) {
    if (board[row][x] === value || board[x][col] === value) return false;
  }
  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  for (let r = 0; r < BOX; r += 1) {
    for (let c = 0; c < BOX; c += 1) {
      if (board[boxRow + r][boxCol + c] === value) return false;
    }
  }
  return true;
}

function removeCells(grid, removals, seedText) {
  const puzzle = cloneGrid(grid);
  const rng = createRng(`${seedText}-remove`);
  const positions = [];
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) positions.push([r, c]);
  }
  const shuffled = shuffle(positions, rng);
  let removed = 0;
  for (const [r, c] of shuffled) {
    if (removed >= removals) break;
    puzzle[r][c] = 0;
    removed += 1;
  }
  return puzzle;
}

function getGlobalLevelIndex(mapId, levelInMap) {
  return (mapId - 1) * LEVELS_PER_MAP + levelInMap;
}

function isBossLevel(levelInMap) {
  return BOSS_LEVELS.includes(levelInMap);
}

function getDifficultyLabel(mapId, levelInMap) {
  const global = getGlobalLevelIndex(mapId, levelInMap);
  if (global <= 120) return 'Fácil';
  if (global <= 360) return 'Intermedio';
  return 'Desafiante';
}

function getDifficultyClass(mapId, levelInMap) {
  const global = getGlobalLevelIndex(mapId, levelInMap);
  if (global <= 120) return 'easy';
  if (global <= 360) return 'medium';
  return 'hard';
}

function generateLevel(mapId, levelInMap) {
  const seedText = `sudoku-pelu-m${mapId}-l${levelInMap}`;
  const solution = generateCompleteGrid(seedText);
  const global = getGlobalLevelIndex(mapId, levelInMap);
  const removals = 35 + Math.min(22, Math.floor((global - 1) / 3));
  const puzzle = removeCells(solution, removals, seedText);
  return {
    mapId,
    levelInMap,
    number: levelInMap,
    puzzle,
    solution,
    clues: SIZE * SIZE - removals,
    isBoss: isBossLevel(levelInMap),
  };
}

function defaultMapProgress() {
  return { completedLevels: [], maxUnlocked: 1 };
}

function getMapProgress(mapId) {
  const key = String(mapId);
  if (!mapProgress[key]) mapProgress[key] = defaultMapProgress();
  return mapProgress[key];
}

function getCompletedSet(mapId) {
  const mp = getMapProgress(mapId);
  if (mp.completedLevels instanceof Set) return mp.completedLevels;
  mp.completedLevels = new Set(mp.completedLevels || []);
  return mp.completedLevels;
}

function isMapUnlocked(mapId) {
  return mapId <= unlockedMaps;
}

/* ── Timer ── */

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function startTimer() {
  stopTimer();
  timerSeconds = 0;
  if (timerLabel) timerLabel.textContent = '00:00';
  if (mobileTimer) mobileTimer.textContent = '00:00';
  timerInterval = setInterval(() => {
    timerSeconds += 1;
    const formatted = formatTime(timerSeconds);
    if (timerLabel) timerLabel.textContent = formatted;
    if (mobileTimer) mobileTimer.textContent = formatted;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/* ── Confetti ── */

function launchConfetti() {
  if (!confettiCanvas) return;
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.4;

  confettiParticles = Array.from({ length: 120 }, () => ({
    x: cx + (Math.random() - 0.5) * 200,
    y: cy,
    vx: (Math.random() - 0.5) * 14,
    vy: Math.random() * -16 - 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    spin: (Math.random() - 0.5) * 12,
    life: 1,
  }));

  if (!confettiAnimating) {
    confettiAnimating = true;
    animateConfetti(ctx);
  }
}

function animateConfetti(ctx) {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  confettiParticles = confettiParticles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.35;
    p.vx *= 0.99;
    p.rotation += p.spin;
    p.life -= 0.012;

    if (p.life <= 0) return false;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
    return true;
  });

  if (confettiParticles.length > 0) {
    requestAnimationFrame(() => animateConfetti(ctx));
  } else {
    confettiAnimating = false;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}

window.addEventListener('resize', () => {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
});

/* ── Board fill progress ── */

function updateBoardFillProgress() {
  let filled = 0;
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (currentBoard[r][c] !== 0) filled += 1;
    }
  }
  const pct = Math.round((filled / 81) * 100);
  if (boardFillBar) boardFillBar.style.width = `${pct}%`;
  if (fillPercent) fillPercent.textContent = `${pct}%`;
  if (bossActive) updateRaceBars();
}

function updateGlobalProgress(levelInMap) {
  const pct = (levelInMap / LEVELS_PER_MAP) * 100;
  if (globalProgressFill) globalProgressFill.style.width = `${pct}%`;
}

function updateMapLevelLabels() {
  const mapName = MAP_NAMES[currentMapId - 1] || `Mapa ${currentMapId}`;
  if (levelLabel) levelLabel.textContent = String(currentLevelInMap);
  if (mapLevelSub) mapLevelSub.textContent = `${mapName} · Nivel ${currentLevelInMap}`;
  if (mobileLevel) mobileLevel.textContent = String(currentLevelInMap);
}

/* ── Number pads ── */

function buildNumberPads() {
  const createButtons = () => {
    const fragment = document.createDocumentFragment();
    for (let n = 1; n <= 9; n += 1) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'key-button';
      btn.dataset.value = String(n);
      btn.textContent = String(n);
      btn.setAttribute('aria-label', `Número ${n}`);
      fragment.appendChild(btn);
    }
    return fragment;
  };

  padTop.innerHTML = '';
  padLeft.innerHTML = '';
  padRight.innerHTML = '';
  padTop.appendChild(createButtons());
  padLeft.appendChild(createButtons());
  padRight.appendChild(createButtons());

  if (mobileDockGrid) {
    mobileDockGrid.innerHTML = '';
    mobileDockGrid.appendChild(createButtons());
  }

  const handlePadClick = event => {
    const button = event.target.closest('button');
    if (!button || button.classList.contains('exhausted')) return;
    touchPress(button);
    handleNumberPadClick(button.dataset.value);
  };

  [padTop, padLeft, padRight, padBottom, mobileDockGrid].forEach(pad => {
    if (!pad) return;
    pad.addEventListener('click', handlePadClick);
    pad.addEventListener('pointerdown', event => {
      const button = event.target.closest('button');
      if (button && !button.classList.contains('exhausted')) touchPress(button);
    });
  });

  const mobileClear = mobileDock?.querySelector('.mobile-dock-clear');
  if (mobileClear) {
    mobileClear.addEventListener('click', () => handleNumberPadClick('clear'));
    mobileClear.addEventListener('pointerdown', () => touchPress(mobileClear));
  }
}

function isCellFixed(input) {
  return input.dataset.fixed === 'true';
}

function bindCellEvents(cell, row, col, input) {
  const activate = event => {
    if (event.type === 'pointerdown' && event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    touchPress(cell);
    haptic('light');
    selectCell(cell, row, col, input);
  };

  cell.addEventListener('pointerdown', activate);
  input.setAttribute('tabindex', '-1');
  input.setAttribute('readonly', 'true');
}

function createBoardInputs(level) {
  boardElement.innerHTML = '';
  currentBoard = cloneGrid(level.puzzle);
  currentSolution = level.solution;
  selectedCell = { cell: null, input: null, row: null, col: null };

  let cellIndex = 0;
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const value = level.puzzle[row][col];
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.style.animationDelay = `${cellIndex * 12}ms`;
      cellIndex += 1;

      const input = document.createElement('input');
      input.type = 'text';
      input.inputMode = 'numeric';
      input.maxLength = 1;
      input.dataset.row = row;
      input.dataset.col = col;
      input.value = value === 0 ? '' : String(value);
      input.autocomplete = 'off';
      input.setAttribute('aria-label', `Casilla fila ${row + 1} columna ${col + 1}`);

      if (value !== 0) {
        cell.classList.add('fixed');
        input.dataset.fixed = 'true';
      }

      input.addEventListener('input', handleCellInput);
      input.addEventListener('keydown', event => {
        if (isBoardDisabled || isTransitioning) return;
        const key = event.key;
        if (key >= '1' && key <= '9') {
          event.preventDefault();
          if (isCellFixed(input)) return;
          input.value = key;
          handleCellInput({ target: input });
          return;
        }
        if (key === 'Backspace' || key === 'Delete') {
          event.preventDefault();
          if (isCellFixed(input)) return;
          input.value = '';
          handleCellInput({ target: input });
        }
      });

      cell.appendChild(input);
      bindCellEvents(cell, row, col, input);
      boardElement.appendChild(cell);
    }
  }

  updateNumberPadVisibility();
  updateBoardFillProgress();
  highlightActiveNumber(null);
}

function highlightActiveNumber(value) {
  document.querySelectorAll('.key-button[data-value]').forEach(btn => {
    const num = Number(btn.dataset.value);
    btn.classList.toggle('active-num', value !== null && num === value);
  });
}

function selectCell(cell, row, col, input) {
  if (isBoardDisabled || isTransitioning) return;

  boardElement.querySelectorAll('.cell').forEach(c => {
    c.classList.remove('selected', 'highlight-row', 'highlight-col', 'highlight-box', 'highlight-match');
  });

  selectedCell = { row, col, cell, input };
  cell.classList.add('selected');

  const boxRow = Math.floor(row / BOX) * BOX;
  const boxCol = Math.floor(col / BOX) * BOX;
  const selectedValue = currentBoard[row][col];

  boardElement.querySelectorAll('.cell').forEach(c => {
    const r = Number(c.dataset.row);
    const colIndex = Number(c.dataset.col);
    if (r === row) c.classList.add('highlight-row');
    if (colIndex === col) c.classList.add('highlight-col');
    if (r >= boxRow && r < boxRow + BOX && colIndex >= boxCol && colIndex < boxCol + BOX) {
      c.classList.add('highlight-box');
    }
    if (selectedValue && currentBoard[r][colIndex] === selectedValue) {
      c.classList.add('highlight-match');
    }
  });

  highlightActiveNumber(selectedValue || null);
  input.focus();
}

function handleNumberPadClick(value) {
  if (isBoardDisabled || isTransitioning) return;

  if (!selectedCell.input) {
    setMessage('Tocá primero una casilla del tablero.', 'danger');
    haptic('medium');
    return;
  }

  if (value === 'clear') {
    if (isCellFixed(selectedCell.input)) return;
    haptic('light');
    selectedCell.input.value = '';
    handleCellInput({ target: selectedCell.input });
    return;
  }

  if (isCellFixed(selectedCell.input)) return;
  haptic('light');
  selectedCell.input.value = value;
  handleCellInput({ target: selectedCell.input });
}

function updateBoardFromInput(row, col, value) {
  currentBoard[row][col] = value;
  updateNumberPadVisibility();
  updateBoardFillProgress();
}

function countDigitOnBoard(digit) {
  let count = 0;
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (currentBoard[row][col] === digit) count += 1;
    }
  }
  return count;
}

function updateNumberPadVisibility() {
  document.querySelectorAll('.key-button[data-value]').forEach(button => {
    const val = Number(button.dataset.value);
    if (!Number.isInteger(val)) return;
    const exhausted = countDigitOnBoard(val) >= 9;
    button.classList.toggle('exhausted', exhausted);
    button.disabled = exhausted;
  });
}

function handleCellInput(event) {
  if (isBoardDisabled || isTransitioning) return;

  const input = event.target;
  const row = Number(input.dataset.row);
  const col = Number(input.dataset.col);
  const value = parseInt(input.value, 10);
  const parent = input.parentElement;

  parent.classList.remove('invalid', 'correct', 'pop');

  if (!input.value) {
    updateBoardFromInput(row, col, 0);
    selectCell(parent, row, col, input);
    setMessage('Seguí completando el tablero.', 'info');
    return;
  }

  if (!Number.isInteger(value) || value < 1 || value > 9) {
    input.value = '';
    updateBoardFromInput(row, col, 0);
    setMessage('Solo números del 1 al 9.', 'danger');
    return;
  }

  if (!isValidPlacement(row, col, value)) {
    parent.classList.add('invalid');
    input.value = '';
    updateBoardFromInput(row, col, 0);
    playSound('error');
    haptic('heavy');
    loseLife('Ese número rompe las reglas del Sudoku.');
    return;
  }

  updateBoardFromInput(row, col, value);
  parent.classList.add('correct', 'pop');
  playSound('place');
  haptic('light');
  haptic(12);
  selectCell(parent, row, col, input);
  setMessage('¡Excelente movimiento!', 'success');

  requestAnimationFrame(() => checkLevelCompletion());
}

function isValidPlacement(row, col, value) {
  const boardCopy = cloneGrid(currentBoard);
  boardCopy[row][col] = 0;
  return isValidValue(boardCopy, row, col, value);
}

function isBoardCompleteAndCorrect() {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const value = currentBoard[row][col];
      if (value === 0) return false;
      if (currentSolution[row][col] !== value) return false;
    }
  }
  return true;
}

function checkLevelCompletion() {
  if (!isBoardCompleteAndCorrect() || isTransitioning || bossDefeated) return;
  stopBoss();
  completeCurrentLevel();
}

function completeCurrentLevel() {
  if (isTransitioning) return;
  isTransitioning = true;
  stopTimer();
  streak += 1;
  updateStreakDisplay();
  playSound('win');
  haptic('success');
  launchConfetti();

  const completedMap = currentMapId;
  const completedLevel = currentLevelInMap;
  markLevelCompleted(completedMap, completedLevel);
  saveProgress();
  updateMenuStats();

  let nextMap = completedMap;
  let nextLevel = completedLevel + 1;
  if (nextLevel > LEVELS_PER_MAP) {
    nextLevel = 1;
    nextMap = completedMap + 1;
  }
  const actuallyHasNext = nextMap <= MAP_COUNT && (
    (nextMap === completedMap && nextLevel <= getMapProgress(nextMap).maxUnlocked) ||
    (nextMap > completedMap && isMapUnlocked(nextMap))
  );

  const mapName = MAP_NAMES[completedMap - 1] || `Mapa ${completedMap}`;
  completeTitle.textContent = `¡Nivel ${completedLevel} completado!`;
  if (isBossLevel(completedLevel)) {
    completeMessage.textContent = `¡Venciste al Jefe en ${mapName}! Elegí tu próximo desafío.`;
  } else if (actuallyHasNext && nextMap <= MAP_COUNT) {
    const nextMapName = MAP_NAMES[nextMap - 1] || `Mapa ${nextMap}`;
  completeMessage.textContent = nextMap > completedMap
      ? `¡Desbloqueaste ${nextMapName}! Elegí tu próximo desafío.`
      : `Desbloqueaste el nivel ${nextLevel} en ${mapName}. Elegí tu próximo desafío.`;
  } else {
    completeMessage.textContent = completedMap >= MAP_COUNT
      ? '¡Completaste los 600 niveles! Sos una leyenda del Sudoku.'
      : `¡Completaste ${mapName}! Seguí explorando otros mundos.`;
  }
  completeTime.textContent = formatTime(timerSeconds);
  completeStreak.textContent = `${streak} 🔥`;

  btnPlayNext.hidden = !actuallyHasNext;
  if (actuallyHasNext) {
    const label = nextMap > completedMap
      ? `Jugar ${MAP_NAMES[nextMap - 1] || `Mapa ${nextMap}`} →`
      : `Jugar nivel ${nextLevel} →`;
    btnPlayNext.textContent = label;
  }
  pendingNextMap = actuallyHasNext ? nextMap : null;
  pendingNextLevel = actuallyHasNext ? nextLevel : null;
  highlightNextLevel = actuallyHasNext ? nextLevel : null;
  viewingMapId = completedMap;

  showLevelCompleteModal();
}

function showLevelCompleteModal() {
  levelCompleteModal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => levelCompleteModal.classList.add('visible'));
}

function hideLevelCompleteModal() {
  levelCompleteModal.classList.remove('visible');
  levelCompleteModal.hidden = true;
  if (!document.querySelector('.modal-backdrop.visible')) {
    document.body.classList.remove('modal-open');
  }
  isTransitioning = false;
}

function goToMapFromComplete() {
  hideLevelCompleteModal();
  showLevelMap(viewingMapId, highlightNextLevel);
}

function playNextLevelFromComplete() {
  if (!pendingNextLevel || !pendingNextMap) return;
  hideLevelCompleteModal();
  startLevelFromMap(pendingNextMap, pendingNextLevel);
}

function loadLevel(mapId, levelInMap, options = {}) {
  const { resetLives = true, keepMessage = false } = options;
  isTransitioning = false;
  bossDefeated = false;
  currentMapId = mapId;
  currentLevelInMap = levelInMap;
  currentLevel = generateLevel(mapId, levelInMap);
  createBoardInputs(currentLevel);

  updateMapLevelLabels();
  difficultyLabel.textContent = getDifficultyLabel(mapId, levelInMap);
  difficultyLabel.className = `difficulty-pill ${getDifficultyClass(mapId, levelInMap)}`;
  cluesLabel.textContent = String(currentLevel.clues);
  if (levelSelect) levelSelect.value = String(levelInMap);
  updateGlobalProgress(levelInMap);

  if (resetLives && !hasInfiniteLives()) setLives(3);

  isBoardDisabled = false;
  enableBoard();
  hideGameOverModal();
  hideBossDefeatModal();
  startTimer();
  initBossMode(currentLevel);

  if (!keepMessage) {
    const msg = currentLevel.isBoss
      ? '¡Jefe Sudoku! Completá antes que él o perdés el nivel.'
      : 'Tocá una casilla y completá el tablero.';
    setMessage(msg, currentLevel.isBoss ? 'danger' : 'info');
  }

  saveProgress();
}

function renderLevel(mapId, levelInMap) {
  streak = 0;
  updateStreakDisplay();
  loadLevel(mapId, levelInMap, { resetLives: true });
}

function stopBoss() {
  bossActive = false;
  if (bossInterval) {
    clearInterval(bossInterval);
    bossInterval = null;
  }
  if (bossPanel) bossPanel.hidden = true;
  if (playArea) playArea.classList.remove('boss-active');
}

function getBossSolveOrder(puzzle) {
  const order = [];
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (puzzle[r][c] === 0) order.push([r, c]);
    }
  }
  return order;
}

function buildBossBoard(puzzle) {
  if (!bossBoard) return;
  bossBoard.innerHTML = '';
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      const cell = document.createElement('div');
      cell.className = 'boss-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (puzzle[r][c] !== 0) {
        cell.classList.add('fixed');
        cell.textContent = String(puzzle[r][c]);
      }
      bossBoard.appendChild(cell);
    }
  }
}

function fillBossCell(row, col, value) {
  if (!bossBoard) return;
  const idx = row * SIZE + col;
  const cell = bossBoard.children[idx];
  if (!cell) return;
  cell.textContent = String(value);
  cell.classList.add('filled');
}

function countFilledCells() {
  let filled = 0;
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (currentBoard[r][c] !== 0) filled += 1;
    }
  }
  return filled;
}

function updateRaceBars() {
  if (!bossActive || !currentLevel) return;
  const playerFilled = countFilledCells();
  const bossFilled = currentLevel.clues + bossCellsFilled;
  const playerPct = Math.round((playerFilled / 81) * 100);
  const bossPct = Math.round((bossFilled / 81) * 100);
  if (playerRaceFill) playerRaceFill.style.width = `${playerPct}%`;
  if (bossRaceFill) bossRaceFill.style.width = `${bossPct}%`;
  if (playerRacePct) playerRacePct.textContent = `${playerPct}%`;
  if (bossRacePct) bossRacePct.textContent = `${bossPct}%`;
}

function getBossIntervalMs() {
  const mapFactor = (currentMapId - 1) * 45;
  const levelFactor = currentLevelInMap === 100 ? 0.6 : 0.8;
  return Math.max(500, (2600 - currentLevelInMap * 18 - mapFactor) * levelFactor);
}

function initBossMode(level) {
  stopBoss();
  if (!level.isBoss) return;

  bossActive = true;
  bossCellsFilled = 0;
  bossSolveOrder = getBossSolveOrder(level.puzzle);
  buildBossBoard(level.puzzle);
  updateRaceBars();

  if (playArea) playArea.classList.add('boss-active');
  if (bossPanel) bossPanel.hidden = false;
  if (bossStatus) bossStatus.textContent = 'Compitiendo...';

  const intervalMs = getBossIntervalMs();
  bossInterval = setInterval(() => {
    if (!bossActive || isTransitioning || bossDefeated) return;
    if (bossCellsFilled >= bossSolveOrder.length) {
      bossWins();
      return;
    }
    const [row, col] = bossSolveOrder[bossCellsFilled];
    fillBossCell(row, col, level.solution[row][col]);
    bossCellsFilled += 1;
    updateRaceBars();
    if (bossCellsFilled >= bossSolveOrder.length) bossWins();
  }, intervalMs);
}

function bossWins() {
  if (isTransitioning || bossDefeated) return;
  bossDefeated = true;
  stopBoss();
  isTransitioning = true;
  stopTimer();
  disableBoard();
  streak = 0;
  updateStreakDisplay();
  if (bossStatus) bossStatus.textContent = '¡Ganó!';
  setMessage('El Jefe terminó primero. Reintentá el nivel.', 'danger');
  showBossDefeatModal();
}

function showBossDefeatModal() {
  if (!bossDefeatModal) return;
  bossDefeatModal.hidden = false;
  requestAnimationFrame(() => bossDefeatModal.classList.add('visible'));
}

function hideBossDefeatModal() {
  if (!bossDefeatModal) return;
  bossDefeatModal.classList.remove('visible');
  bossDefeatModal.hidden = true;
  isTransitioning = false;
  bossDefeated = false;
}

function formatPriceARS(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: PAYMENT_CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPackById(packId) {
  return SHOP_PACKS.find(p => p.id === packId) || null;
}

function hasInfiniteLives() {
  return infiniteLives === true;
}

function getProcessedPayments() {
  try {
    return JSON.parse(localStorage.getItem('sudoku-pelu-processed-payments') || '[]');
  } catch {
    return [];
  }
}

function isPaymentProcessed(paymentId) {
  return getProcessedPayments().includes(String(paymentId));
}

function markPaymentProcessed(paymentId) {
  const list = getProcessedPayments();
  if (!list.includes(String(paymentId))) {
    list.push(String(paymentId));
    localStorage.setItem('sudoku-pelu-processed-payments', JSON.stringify(list.slice(-200)));
  }
}

function getFreeHeartData() {
  try {
    return JSON.parse(localStorage.getItem('sudoku-pelu-free-heart') || 'null') || { lastClaim: null };
  } catch {
    return { lastClaim: null };
  }
}

function saveFreeHeartData(data) {
  localStorage.setItem('sudoku-pelu-free-heart', JSON.stringify(data));
}

function getFreeHeartRemainingMs() {
  const data = getFreeHeartData();
  if (!data.lastClaim) return 0;
  const elapsed = Date.now() - new Date(data.lastClaim).getTime();
  return Math.max(0, FREE_HEART_MS - elapsed);
}

function canClaimFreeHeart() {
  if (hasInfiniteLives()) return false;
  return getFreeHeartRemainingMs() <= 0;
}

function formatCountdown(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

function claimFreeHeart() {
  if (!canClaimFreeHeart()) {
    setMessage(`Podés reclamar otro corazón en ${formatCountdown(getFreeHeartRemainingMs())}.`, 'info');
    return;
  }
  saveFreeHeartData({ lastClaim: new Date().toISOString() });
  setLives(lives + 1);
  playSound('purchase');
  haptic('success');
  setMessage('¡Corazón gratis reclamado! +1 vida.', 'success');
  updateFreeHeartUI();
  if (lives > 0) {
    hideGameOverModal();
    enableBoard();
    if (!timerInterval && gameStarted) startTimer();
  }
}

function updateFreeHeartUI(root = document) {
  root.querySelectorAll('[data-free-status]').forEach(el => {
    if (hasInfiniteLives()) {
      el.textContent = 'Premium activo — vidas ilimitadas';
      return;
    }
    if (canClaimFreeHeart()) {
      el.textContent = '¡Tenés un corazón gratis disponible!';
    } else {
      el.textContent = `Próximo en ${formatCountdown(getFreeHeartRemainingMs())}`;
    }
  });

  root.querySelectorAll('[data-claim-free]').forEach(btn => {
    btn.hidden = !canClaimFreeHeart();
  });

  root.querySelectorAll('[data-free-timer]').forEach(el => {
    if (canClaimFreeHeart() || hasInfiniteLives()) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    el.textContent = formatCountdown(getFreeHeartRemainingMs());
  });
}

function startFreeHeartTimer() {
  if (freeHeartTimerInterval) clearInterval(freeHeartTimerInterval);
  freeHeartTimerInterval = setInterval(() => updateFreeHeartUI(), 1000);
}

function applyPack(pack) {
  if (!pack) return;

  if (pack.infinite || pack.premium) {
    infiniteLives = true;
    localStorage.setItem('sudoku-pelu-premium', JSON.stringify({ active: true, date: new Date().toISOString() }));
    renderLives();
    setMessage('¡Premium activado! Vidas ilimitadas para siempre.', 'success');
  } else {
    setLives(lives + (pack.lives || 0));
    setMessage(`¡Pack "${pack.name}" activado! +${pack.lives} vidas.`, 'success');
  }

  enableBoard();
  hideGameOverModal();
  hideShopModal();
  if (!timerInterval && gameStarted) startTimer();
  playSound('purchase');
  haptic('success');

  const purchases = JSON.parse(localStorage.getItem('sudoku-pelu-purchases') || '[]');
  purchases.push({
    date: new Date().toISOString(),
    packId: pack.id,
    name: pack.name,
    lives: pack.lives || 0,
    infinite: !!pack.infinite,
    price: pack.price,
  });
  localStorage.setItem('sudoku-pelu-purchases', JSON.stringify(purchases));
  saveProgress();
}

function applyPackById(packId) {
  const pack = getPackById(packId);
  if (pack) applyPack(pack);
}

async function copyText(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    setMessage(`${label} copiado.`, 'success');
  } catch {
    setMessage(`Copiá: ${text}`, 'info');
  }
}

function generateLocalTransferRef(packId) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return `PEL-${packId.replace('pack-', '')}-${code}`;
}

function stopPaymentPolling() {
  if (paymentPollInterval) {
    clearInterval(paymentPollInterval);
    paymentPollInterval = null;
  }
}

function hidePaymentWaitModal() {
  if (!paymentWaitModal) return;
  stopPaymentPolling();
  paymentWaitModal.classList.remove('visible');
  paymentWaitModal.hidden = true;
  if (!document.querySelector('.modal-backdrop.visible')) {
    document.body.classList.remove('modal-open');
  }
}

function showPaymentWaitModal(pack, ref) {
  if (waitBank) waitBank.textContent = PAYMENT_BANK;
  if (waitAlias) waitAlias.textContent = PAYMENT_ALIAS;
  if (waitAmount) waitAmount.textContent = formatPriceARS(pack.price);
  if (waitRef) waitRef.textContent = ref;
  if (paymentWaitStatus) {
    paymentWaitStatus.textContent = 'Transferí el monto exacto y poné el código en el motivo. Activación automática al impactar.';
  }
  paymentWaitModal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => paymentWaitModal.classList.add('visible'));
}

async function checkPaymentApproved({ ref, paymentId }) {
  const params = new URLSearchParams();
  if (paymentId) params.set('payment_id', paymentId);
  else if (ref) params.set('ref', ref);
  else return false;

  try {
    const res = await fetch(`${MP_API_BASE}/check-payment-status?${params}`);
    const data = await res.json();
  if (data.approved && data.packId) {
      if (paymentWaitStatus) {
        paymentWaitStatus.textContent = '¡Pago confirmado! Activando tu pack…';
      }
      if (paymentId) markPaymentProcessed(paymentId);
      applyPackById(data.packId);
      localStorage.removeItem('sudoku-pelu-pending-payment');
      hidePaymentWaitModal();
      hideShopModal();
      hideGameOverModal();
      return true;
    }
  } catch {
    /* sin servidor */
  }
  return false;
}

function startPaymentPolling(ref) {
  stopPaymentPolling();
  paymentPollInterval = setInterval(async () => {
    const approved = await checkPaymentApproved({ ref });
    if (approved) stopPaymentPolling();
  }, PAYMENT_POLL_INTERVAL);
}

async function startPackPayment(packId) {
  const pack = getPackById(packId);
  if (!pack) return;

  if (pack.infinite && hasInfiniteLives()) {
    setMessage('Ya tenés Premium con vidas ilimitadas.', 'info');
    return;
  }

  let ref = generateLocalTransferRef(pack.id);
  try {
    const res = await fetch(`${MP_API_BASE}/create-transfer-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packId }),
    });
    const data = await res.json();
    if (res.ok && data.ref) ref = data.ref;
  } catch {
    /* local */
  }

  currentPaymentIntent = { ref, packId: pack.id, amount: pack.price, packName: pack.name };
  localStorage.setItem('sudoku-pelu-pending-payment', JSON.stringify({ ...currentPaymentIntent, createdAt: new Date().toISOString() }));

  showPaymentWaitModal(pack, ref);
  startPaymentPolling(ref);
  setMessage('Esperando pago… el pack se activa solo al impactar en Macro.', 'info');
}

function initPaymentWaitModal() {
  btnCancelPaymentWait?.addEventListener('click', () => {
    stopPaymentPolling();
    hidePaymentWaitModal();
  });
  paymentWaitModal?.addEventListener('click', e => {
    if (e.target === paymentWaitModal) hidePaymentWaitModal();
  });
  paymentWaitModal?.querySelectorAll('.btn-copy-wait').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.copyTarget);
      if (el) copyText(el.textContent.trim(), 'Dato');
    });
  });
}

async function resumePendingPayment() {
  try {
    const pending = JSON.parse(localStorage.getItem('sudoku-pelu-pending-payment') || 'null');
    if (!pending?.ref) return;
    currentPaymentIntent = pending;
    const pack = getPackById(pending.packId);
    if (pack) showPaymentWaitModal(pack, pending.ref);
    startPaymentPolling(pending.ref);
  } catch {
    /* ignore */
  }
}


function clearPaymentUrlParams() {
  const url = new URL(window.location.href);
  ['payment_id', 'collection_id', 'status', 'external_reference', 'merchant_order_id', 'preference_id', 'mp_return'].forEach(
    key => url.searchParams.delete(key)
  );
  window.history.replaceState({}, '', url.pathname + (url.search || ''));
}

async function handlePaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const paymentId = params.get('payment_id') || params.get('collection_id');
  const mpReturn = params.get('mp_return');
  const status = params.get('status');

  if (!paymentId) {
    if (mpReturn === 'failure') {
      setMessage('El pago no se completó. Intentá de nuevo.', 'danger');
      clearPaymentUrlParams();
    } else if (mpReturn === 'pending') {
      setMessage('Pago pendiente. Las vidas se activan cuando Mercado Pago lo apruebe.', 'info');
      clearPaymentUrlParams();
    }
    return;
  }

  if (isPaymentProcessed(paymentId)) {
    clearPaymentUrlParams();
    return;
  }

  setMessage('Verificando tu pago con Mercado Pago...', 'info');

  try {
    const res = await fetch(`${MP_API_BASE}/mp-verify-payment?payment_id=${encodeURIComponent(paymentId)}`);
    const data = await res.json();

    if (data.approved && data.packId) {
      markPaymentProcessed(paymentId);
      applyPackById(data.packId);
    } else if (status === 'approved' || mpReturn === 'success') {
      setMessage('Pago recibido pero aún no aprobado. Esperá unos segundos y recargá la página.', 'info');
    } else {
      setMessage('El pago no fue aprobado. No se otorgaron vidas.', 'danger');
    }
  } catch {
    setMessage('No se pudo verificar el pago. Si ya pagaste, recargá en unos segundos.', 'danger');
  }

  clearPaymentUrlParams();
}

function loadPremiumStatus() {
  try {
    const premium = JSON.parse(localStorage.getItem('sudoku-pelu-premium') || 'null');
    infiniteLives = premium?.active === true;
  } catch {
    infiniteLives = false;
  }
}

function buildShop(container) {
  if (!container) return;
  container.innerHTML = '';
  container.classList.add('shop-packs-grid');

  if (freeHeartTemplate) {
    const freeNode = freeHeartTemplate.content.cloneNode(true);
    const claimBtn = freeNode.querySelector('[data-claim-free]');
    claimBtn?.addEventListener('click', () => {
      haptic('light');
      claimFreeHeart();
    });
    container.appendChild(freeNode);
    updateFreeHeartUI(container);
  }

  if (!packCardTemplate) return;

  SHOP_PACKS.forEach(pack => {
    const node = packCardTemplate.content.cloneNode(true);
    const card = node.querySelector('.pack-card');
    card.dataset.packId = pack.id;
    if (pack.premium || pack.infinite) card.classList.add('pack-premium');

    const badge = node.querySelector('[data-pack-badge]');
    if (pack.premium) badge.hidden = false;

    node.querySelector('[data-pack-icon]').textContent = pack.icon || '❤️';
    node.querySelector('[data-pack-name]').textContent = pack.name;
    node.querySelector('[data-pack-desc]').textContent = pack.description;
    node.querySelector('[data-pack-price]').textContent = formatPriceARS(pack.price);

    const payBtn = node.querySelector('.btn-pay-pack');

    if (pack.infinite && hasInfiniteLives()) {
      payBtn.textContent = 'Ya activado';
      payBtn.disabled = true;
    } else {
      payBtn.addEventListener('click', () => {
        haptic('light');
        startPackPayment(pack.id);
      });
    }

    container.appendChild(node);
  });
}

function renderLives() {
  const renderInto = container => {
    if (!container) return;
    container.innerHTML = '';
    if (hasInfiniteLives()) {
      const badge = document.createElement('span');
      badge.className = 'heart infinite-heart';
      badge.textContent = '♾️';
      badge.title = 'Premium — vidas ilimitadas';
      container.appendChild(badge);
      const label = document.createElement('span');
      label.className = 'premium-label';
      label.textContent = 'PREMIUM';
      container.appendChild(label);
      return;
    }
    const slots = Math.max(3, lives);
    for (let i = 0; i < slots; i += 1) {
      const heart = document.createElement('span');
      heart.className = `heart${i < lives ? '' : ' lost'}`;
      heart.textContent = i < lives ? '❤️' : '🖤';
      container.appendChild(heart);
    }
  };
  renderInto(livesDisplay);
  renderInto(mobileLivesDisplay);
}

function setLives(count) {
  if (hasInfiniteLives()) {
    renderLives();
    return;
  }
  lives = Math.max(0, count);
  renderLives();
}

function updateStreakDisplay() {
  const text = `${streak} 🔥`;
  if (streakBadge) streakBadge.textContent = text;
  if (mobileStreak) mobileStreak.textContent = text;
}

function loseLife(reason) {
  if (hasInfiniteLives() || lives <= 0 || isTransitioning) return;

  lives -= 1;
  renderLives();
  streak = 0;
  updateStreakDisplay();
  haptic('medium');

  const livesCard = document.querySelector('.lives-card');
  if (livesCard) {
    livesCard.classList.add('shake');
    setTimeout(() => livesCard.classList.remove('shake'), 500);
  }

  if (lives <= 0) {
    disableBoard();
    stopTimer();
    haptic('heavy');
    buildShop(purchaseBoxGameover);
    showGameOverModal();
    setMessage('Sin vidas. Reclamá un corazón gratis o comprá un pack.', 'danger');
    return;
  }

  setMessage(`${reason} Te quedan ${lives} vidas.`, 'danger');
}

function enableBoard() {
  isBoardDisabled = false;
  boardElement.querySelectorAll('input').forEach(input => {
    if (!isCellFixed(input)) input.disabled = false;
  });
}

function disableBoard() {
  isBoardDisabled = true;
  boardElement.querySelectorAll('input').forEach(input => {
    input.disabled = true;
  });
}

function showGameOverModal() {
  buildShop(purchaseBoxGameover);
  gameOverModal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => gameOverModal.classList.add('visible'));
}

function hideGameOverModal() {
  gameOverModal.classList.remove('visible');
  gameOverModal.hidden = true;
  if (!document.querySelector('.modal-backdrop.visible')) {
    document.body.classList.remove('modal-open');
  }
}

function closeGameOverModal() {
  if (!hasInfiniteLives() && lives <= 0) {
    setMessage('Sin vidas: reclamá un corazón gratis o comprá un pack.', 'danger');
    return;
  }
  hideGameOverModal();
  enableBoard();
}

function showShopModal() {
  buildShop(purchaseBoxShop);
  shopModal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => shopModal.classList.add('visible'));
}

function hideShopModal() {
  shopModal.classList.remove('visible');
  shopModal.hidden = true;
  if (!document.querySelector('.modal-backdrop.visible')) {
    document.body.classList.remove('modal-open');
  }
}

function showMobileMenuModal() {
  if (!mobileMenuModal) return;
  if (mobileMusicToggle) mobileMusicToggle.checked = musicToggle.checked;
  if (mobileMenuInstall) mobileMenuInstall.hidden = btnInstall?.hidden ?? true;
  mobileMenuModal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => mobileMenuModal.classList.add('visible'));
}

function hideMobileMenuModal() {
  if (!mobileMenuModal) return;
  mobileMenuModal.classList.remove('visible');
  mobileMenuModal.hidden = true;
  if (!document.querySelector('.modal-backdrop.visible')) {
    document.body.classList.remove('modal-open');
  }
}

function initMobileMenu() {
  btnMoreMobile?.addEventListener('click', () => {
    haptic('light');
    showMobileMenuModal();
  });
  btnCloseMobileMenu?.addEventListener('click', hideMobileMenuModal);
  mobileMenuModal?.addEventListener('click', event => {
    if (event.target === mobileMenuModal) hideMobileMenuModal();
  });
  mobileMenuReset?.addEventListener('click', () => {
    hideMobileMenuModal();
    renderLevel(currentMapId, currentLevelInMap);
  });
  mobileMenuSolve?.addEventListener('click', () => {
    hideMobileMenuModal();
    revealSolution();
  });
  mobileMenuShare?.addEventListener('click', async () => {
    hideMobileMenuModal();
    btnShare?.click();
  });
  mobileMenuInstall?.addEventListener('click', async () => {
    hideMobileMenuModal();
    btnInstall?.click();
  });
  mobileMusicToggle?.addEventListener('change', event => {
    musicToggle.checked = event.target.checked;
    if (event.target.checked) startAmbientMusic();
    else stopAmbientMusic();
    if (settingsMusic) settingsMusic.checked = event.target.checked;
    saveSettings();
  });
}

function updateSplashStats() {
  updateMenuStats();
}

function initMainMenu() {
  updateMenuStats();
  loadSettings();

  if (neonNav) {
    neonNav.querySelectorAll('.neon-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => playMenuSound('menuHover'));
      btn.addEventListener('click', () => {
        if (audioContext?.state === 'suspended') audioContext.resume();
        handleMenuAction(btn.dataset.action, btn);
      });
    });
  }

  btnBackWorlds?.addEventListener('click', () => {
    playMenuConfirmSound();
    showWorldMap();
  });
  btnBackMenuFromWorlds?.addEventListener('click', () => {
    playMenuConfirmSound();
    showMainMenu();
  });
  btnMapShop?.addEventListener('click', () => {
    playMenuConfirmSound();
    showShopModal();
  });
  btnBackMap?.addEventListener('click', () => {
    playMenuConfirmSound();
    stopBoss();
    showLevelMap(currentMapId);
  });
  btnBossRetry?.addEventListener('click', () => {
    playMenuConfirmSound();
    hideBossDefeatModal();
    renderLevel(currentMapId, currentLevelInMap);
  });
  btnBossToMap?.addEventListener('click', () => {
    playMenuConfirmSound();
    hideBossDefeatModal();
    showLevelMap(currentMapId);
  });
  bossDefeatModal?.addEventListener('click', event => {
    if (event.target === bossDefeatModal) hideBossDefeatModal();
  });
  if (btnHomeMenu) {
    btnHomeMenu.addEventListener('click', () => {
      playMenuConfirmSound();
      stopTimer();
      stopBoss();
      showMainMenu();
    });
  }
  btnGoMap.addEventListener('click', () => {
    playMenuConfirmSound();
    goToMapFromComplete();
  });
  btnPlayNext.addEventListener('click', () => {
    playMenuConfirmSound();
    playNextLevelFromComplete();
  });

  if (btnCloseSettings) {
    btnCloseSettings.addEventListener('click', () => {
      playMenuSound('menu');
      hideSettingsModal();
    });
  }
  if (settingsModal) {
    settingsModal.addEventListener('click', event => {
      if (event.target === settingsModal) hideSettingsModal();
    });
  }

  if (settingsMusic) {
    settingsMusic.addEventListener('change', event => {
      musicToggle.checked = event.target.checked;
      if (event.target.checked) startAmbientMusic();
      else stopAmbientMusic();
      saveSettings();
      playMenuSound('menu');
    });
  }

  if (settingsSfx) {
    settingsSfx.addEventListener('change', event => {
      sfxEnabled = event.target.checked;
      saveSettings();
      if (sfxEnabled) playMenuSound('menuConfirm');
    });
  }

  showMainMenu();
}

function initShare() {
  btnShare.addEventListener('click', async () => {
    const shareData = {
      title: CONFIG.appName || 'Sudoku Pelu',
      text: `¡Probá Sudoku Pelu! ${MAP_COUNT * LEVELS_PER_MAP} niveles con jefes y camino neón.`,
      url: CONFIG.siteUrl || window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setMessage('Link copiado. ¡Compartilo con tus amigos!', 'success');
      }
    } catch {
      /* usuario canceló */
    }
  });
}

function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    btnInstall.hidden = false;
    if (mobileMenuInstall) mobileMenuInstall.hidden = false;
  });

  const runInstall = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    btnInstall.hidden = true;
    if (mobileMenuInstall) mobileMenuInstall.hidden = true;
  };

  btnInstall.addEventListener('click', runInstall);
  mobileMenuInstall?.addEventListener('click', () => {
    hideMobileMenuModal();
    runInstall();
  });

  window.addEventListener('appinstalled', () => {
    btnInstall.hidden = true;
    if (mobileMenuInstall) mobileMenuInstall.hidden = true;
    setMessage('¡App instalada! Jugá desde tu pantalla de inicio.', 'success');
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) await reg.unregister();
      await navigator.serviceWorker.register('./sw.js?v=6');
    } catch {
      /* sin SW */
    }
  });
}

function applyBranding() {
  if (footerAlias) footerAlias.textContent = PAYMENT_ALIAS;
  if (footerBank) footerBank.textContent = PAYMENT_BANK;
  if (shopPaymentAlias) shopPaymentAlias.textContent = PAYMENT_ALIAS;
  const totalLevels = MAP_COUNT * LEVELS_PER_MAP;
  document.title = `${CONFIG.appName || 'Sudoku Pelu'} — ${totalLevels} Niveles`;
}

function setMessage(text, type) {
  messageElement.textContent = text;
  messageElement.className = 'toast-bar';
  if (type) messageElement.classList.add(type);
}

function revealSolution() {
  if (isTransitioning) return;
  boardElement.querySelectorAll('input').forEach(input => {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    if (isCellFixed(input)) return;
    input.value = String(currentSolution[row][col]);
    input.parentElement.classList.add('correct');
    currentBoard[row][col] = currentSolution[row][col];
  });
  updateNumberPadVisibility();
  updateBoardFillProgress();
  setMessage('Solución revelada.', 'info');
}

function playSound(type) {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();

  if (type === 'win') {
    playWinFanfare();
    return;
  }

  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);

  const presets = {
    place: { freq: 587, duration: 0.1, volume: 0.05, wave: 'sine' },
    error: { freq: 160, duration: 0.3, volume: 0.07, wave: 'sawtooth' },
    purchase: { freq: 523, duration: 0.25, volume: 0.06, wave: 'triangle' },
    menu: { freq: 880, duration: 0.08, volume: 0.06, wave: 'square' },
    menuHover: { freq: 660, duration: 0.05, volume: 0.03, wave: 'sine' },
    menuConfirm: { freq: 1047, duration: 0.15, volume: 0.07, wave: 'triangle' },
  };

  const p = presets[type] || presets.place;
  osc.type = p.wave;
  osc.frequency.setValueAtTime(p.freq, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(p.volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + p.duration);
  osc.start(now);
  osc.stop(now + p.duration);
}

function playMenuSound(kind = 'menu') {
  if (!sfxEnabled) return;
  playSound(kind);
}

function playMenuConfirmSound() {
  if (!sfxEnabled) return;
  playSound('menuConfirm');
  if (!audioContext) return;
  const now = audioContext.currentTime + 0.1;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'square';
  osc.frequency.value = 1318;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

function animateNeonClick(button) {
  button.classList.remove('clicked');
  void button.offsetWidth;
  button.classList.add('clicked');
  setTimeout(() => button.classList.remove('clicked'), 350);
}

function handleMenuAction(action, button) {
  animateNeonClick(button);
  playMenuConfirmSound();

  switch (action) {
    case 'play': {
      const cont = getContinueLevel();
      startLevelFromMap(cont.mapId, cont.levelInMap);
      break;
    }
    case 'map':
      showWorldMap();
      break;
    case 'store':
      showShopModal();
      break;
    case 'settings':
      showSettingsModal();
      break;
    case 'share':
      shareGame();
      break;
    default:
      break;
  }
}

function getContinueLevel() {
  for (let m = 1; m <= MAP_COUNT; m += 1) {
    if (!isMapUnlocked(m)) continue;
    const mp = getMapProgress(m);
    for (let l = 1; l <= mp.maxUnlocked; l += 1) {
      if (!isLevelCompleted(m, l)) return { mapId: m, levelInMap: l };
    }
  }
  const m = Math.min(unlockedMaps, MAP_COUNT);
  const mp = getMapProgress(m);
  return { mapId: m, levelInMap: Math.min(mp.maxUnlocked, LEVELS_PER_MAP) };
}

function getTotalCompletedCount() {
  let total = 0;
  for (let m = 1; m <= MAP_COUNT; m += 1) {
    total += getCompletedSet(m).size;
  }
  return total;
}

function getTotalUnlockedCount() {
  let total = 0;
  for (let m = 1; m <= unlockedMaps; m += 1) {
    total += getMapProgress(m).maxUnlocked;
  }
  return total;
}

async function shareGame() {
  const shareData = {
    title: CONFIG.appName || 'Sudoku Pelu',
    text: `¡Probá Sudoku Pelu! ${MAP_COUNT * LEVELS_PER_MAP} niveles con jefes.`,
    url: CONFIG.siteUrl || window.location.href,
  };
  try {
    if (navigator.share) await navigator.share(shareData);
    else {
      await navigator.clipboard.writeText(shareData.url);
      playMenuSound('menuConfirm');
    }
  } catch {
    /* cancelado */
  }
}

function showSettingsModal() {
  if (settingsMusic) settingsMusic.checked = musicToggle.checked;
  if (settingsSfx) settingsSfx.checked = sfxEnabled;
  settingsModal.hidden = false;
  requestAnimationFrame(() => settingsModal.classList.add('visible'));
}

function hideSettingsModal() {
  settingsModal.classList.remove('visible');
  settingsModal.hidden = true;
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('sudoku-pelu-settings') || 'null');
    if (saved) {
      sfxEnabled = saved.sfx !== false;
      if (settingsSfx) settingsSfx.checked = sfxEnabled;
      if (saved.music === false) {
        musicToggle.checked = false;
        stopAmbientMusic();
      }
    }
  } catch {
    sfxEnabled = true;
  }
}

function saveSettings() {
  localStorage.setItem(
    'sudoku-pelu-settings',
    JSON.stringify({ sfx: sfxEnabled, music: musicToggle.checked })
  );
}

function playWinFanfare() {
  const notes = [523, 659, 784, 1047];
  const now = audioContext.currentTime;
  notes.forEach((freq, i) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = now + i * 0.12;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.07, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  });
}

function startAmbientMusic() {
  if (!window.AudioContext && !window.webkitAudioContext) return;
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
  if (musicInterval) return;

  const notes = [196, 220, 247, 277, 330, 370, 415];
  musicInterval = setInterval(() => {
    if (audioContext.state !== 'running') return;
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.value = notes[currentMusicIndex % notes.length];
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.06);
    gain.gain.linearRampToValueAtTime(0, now + 0.9);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.95);
    currentMusicIndex += 1;
  }, 1100);
}

function stopAmbientMusic() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}

function saveProgress() {
  const mapsData = {};
  for (let m = 1; m <= MAP_COUNT; m += 1) {
    const mp = getMapProgress(m);
    mapsData[String(m)] = {
      completedLevels: [...getCompletedSet(m)],
      maxUnlocked: mp.maxUnlocked,
    };
  }
  localStorage.setItem(
    'sudoku-pelu-progress',
    JSON.stringify({
      maps: mapsData,
      unlockedMaps,
      currentMap: currentMapId,
      currentLevel: currentLevelInMap,
      lives: hasInfiniteLives() ? -1 : lives,
      infiniteLives: hasInfiniteLives(),
      streak,
      bestStreak: Math.max(streak, loadBestStreak()),
    })
  );
  updateMenuStats();
}

function markLevelCompleted(mapId, levelInMap) {
  getCompletedSet(mapId).add(levelInMap);
  const mp = getMapProgress(mapId);
  mp.maxUnlocked = Math.min(LEVELS_PER_MAP, Math.max(mp.maxUnlocked, levelInMap + 1));
  if (levelInMap === LEVELS_PER_MAP && mapId < MAP_COUNT) {
    unlockedMaps = Math.max(unlockedMaps, mapId + 1);
  }
}

function isLevelUnlocked(mapId, levelInMap) {
  if (!isMapUnlocked(mapId)) return false;
  return levelInMap <= getMapProgress(mapId).maxUnlocked;
}

function isLevelCompleted(mapId, levelInMap) {
  return getCompletedSet(mapId).has(levelInMap);
}

function migrateProgress(saved) {
  if (saved.maps) {
    mapProgress = {};
    for (const [key, val] of Object.entries(saved.maps)) {
      mapProgress[key] = {
        completedLevels: val.completedLevels || [],
        maxUnlocked: val.maxUnlocked || 1,
      };
    }
    unlockedMaps = saved.unlockedMaps || 1;
    return {
      mapId: saved.currentMap || 1,
      levelInMap: saved.currentLevel || 1,
    };
  }

  mapProgress = { '1': defaultMapProgress() };
  const mp = mapProgress['1'];
  mp.completedLevels = saved.completedLevels || [];
  mp.maxUnlocked = saved.maxUnlocked || 1;
  unlockedMaps = 1;

  if (mp.completedLevels.length === 0 && saved.level > 1) {
    for (let i = 1; i < saved.level; i += 1) mp.completedLevels.push(i);
    mp.maxUnlocked = Math.max(mp.maxUnlocked, saved.level);
  }

  return {
    mapId: 1,
    levelInMap: Math.min(Math.max(1, saved.level || 1), LEVELS_PER_MAP),
  };
}

function recalcUnlockedMaps() {
  unlockedMaps = 1;
  for (let m = 1; m < MAP_COUNT; m += 1) {
    if (getCompletedSet(m).has(LEVELS_PER_MAP)) {
      unlockedMaps = Math.max(unlockedMaps, m + 1);
    }
  }
}

function loadProgressData() {
  loadPremiumStatus();
  try {
    const saved = JSON.parse(localStorage.getItem('sudoku-pelu-progress') || 'null');
    if (!saved) {
      mapProgress = { '1': defaultMapProgress() };
      unlockedMaps = 1;
      if (!hasInfiniteLives()) setLives(3);
      else renderLives();
      return { mapId: 1, levelInMap: 1 };
    }
    const pos = migrateProgress(saved);
    recalcUnlockedMaps();
    if (saved.infiniteLives) {
      infiniteLives = true;
      renderLives();
    } else {
      const savedLives = saved.lives !== undefined ? saved.lives : 3;
      setLives(savedLives <= 0 ? 3 : savedLives);
    }
    if (saved.streak !== undefined) {
      streak = saved.streak;
      updateStreakDisplay();
    }
    currentMapId = pos.mapId;
    currentLevelInMap = pos.levelInMap;
    viewingMapId = pos.mapId;
    return pos;
  } catch {
    mapProgress = { '1': defaultMapProgress() };
    unlockedMaps = 1;
    if (!hasInfiniteLives()) setLives(3);
    return { mapId: 1, levelInMap: 1 };
  }
}

function loadBestStreak() {
  try {
    const saved = JSON.parse(localStorage.getItem('sudoku-pelu-progress') || 'null');
    return saved?.bestStreak || 0;
  } catch {
    return 0;
  }
}

function loadSavedProgress() {
  return loadProgressData();
}

function getLevelPosition(levelNum) {
  const index = levelNum - 1;
  const row = Math.floor(index / MAP_COLS);
  const colInRow = index % MAP_COLS;
  const col = row % 2 === 0 ? colInRow : MAP_COLS - 1 - colInRow;
  const x = MAP_WIDTH * 0.12 + col * (MAP_WIDTH * 0.76 / (MAP_COLS - 1));
  const y = row * MAP_ROW_HEIGHT + 52;
  return { x, y, row };
}

function buildLevelMap(mapId, scrollToLevel) {
  if (!levelNodes || !neonPathSvg) return;
  viewingMapId = mapId;
  const completed = getCompletedSet(mapId);
  const maxUnlocked = getMapProgress(mapId).maxUnlocked;
  const mapName = MAP_NAMES[mapId - 1] || `Mapa ${mapId}`;

  if (mapNameLabel) mapNameLabel.textContent = mapName;

  const rows = Math.ceil(LEVELS_PER_MAP / MAP_COLS);
  const totalHeight = rows * MAP_ROW_HEIGHT + 60;
  levelNodes.innerHTML = '';
  neonPathSvg.innerHTML = '';
  levelNodes.style.height = `${totalHeight}px`;
  neonPathSvg.setAttribute('viewBox', `0 0 ${MAP_WIDTH} ${totalHeight}`);
  neonPathSvg.style.height = `${totalHeight}px`;

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  grad.setAttribute('id', 'neonGradient');
  grad.setAttribute('x1', '0%');
  grad.setAttribute('y1', '0%');
  grad.setAttribute('x2', '100%');
  grad.setAttribute('y2', '0%');
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#a855f7');
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#22d3ee');
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  neonPathSvg.appendChild(defs);

  for (let n = 1; n < LEVELS_PER_MAP; n += 1) {
    const from = getLevelPosition(n);
    const to = getLevelPosition(n + 1);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', from.x);
    line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x);
    line.setAttribute('y2', to.y);
    line.classList.add('neon-line', n < maxUnlocked ? 'neon-line-active' : 'neon-line-bg');
    neonPathSvg.appendChild(line);
  }

  for (let n = 1; n <= LEVELS_PER_MAP; n += 1) {
    const pos = getLevelPosition(n);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'level-node';
    if (isBossLevel(n)) btn.classList.add('boss-node');
    btn.textContent = String(n);
    btn.style.left = `${(pos.x / MAP_WIDTH) * 100}%`;
    btn.style.top = `${pos.y}px`;
    btn.setAttribute('aria-label', `Nivel ${n}${isBossLevel(n) ? ' — Jefe' : ''}`);

    if (isLevelCompleted(mapId, n)) btn.classList.add('completed');
    else if (isLevelUnlocked(mapId, n)) btn.classList.add('unlocked');
    else btn.classList.add('locked');

    if (scrollToLevel && n === scrollToLevel) btn.classList.add('highlight-next');

    btn.addEventListener('click', () => {
      touchPress(btn);
      haptic('light');
      selectLevelFromMap(mapId, n);
    });
    levelNodes.appendChild(btn);
  }

  if (mapProgressLabel) {
    mapProgressLabel.textContent = `${completed.size} / ${LEVELS_PER_MAP} niveles`;
  }

  if (scrollToLevel && neonPathScroll) {
    requestAnimationFrame(() => {
      const pos = getLevelPosition(scrollToLevel);
      neonPathScroll.scrollTo({ top: Math.max(0, pos.y - 120), behavior: 'smooth' });
    });
  }
}

function selectLevelFromMap(mapId, levelNum) {
  if (!isMapUnlocked(mapId)) {
    showMapMessage('🔒 Completá el mapa anterior para desbloquear');
    return;
  }
  if (!isLevelUnlocked(mapId, levelNum)) {
    showMapMessage('🔒 Completá el nivel anterior para desbloquear');
    return;
  }
  startLevelFromMap(mapId, levelNum);
}

function showMapMessage(text) {
  if (!mapProgressLabel) return;
  const completed = getCompletedSet(viewingMapId);
  const original = `${completed.size} / ${LEVELS_PER_MAP} niveles`;
  mapProgressLabel.textContent = text;
  mapProgressLabel.style.color = 'var(--danger)';
  setTimeout(() => {
    mapProgressLabel.textContent = original;
    mapProgressLabel.style.color = '';
  }, 2800);
}

function startLevelFromMap(mapId, levelNum) {
  highlightNextLevel = null;
  viewingMapId = mapId;
  stopBoss();
  showScreen('game');
  gameStarted = true;
  loadLevel(mapId, levelNum, { resetLives: false });
  if (musicToggle.checked) startAmbientMusic();
}

function buildWorldsGrid() {
  if (!worldsGrid) return;
  worldsGrid.innerHTML = '';

  for (let m = 1; m <= MAP_COUNT; m += 1) {
    const completed = getCompletedSet(m);
    const unlocked = isMapUnlocked(m);
    const mapName = MAP_NAMES[m - 1] || `Mapa ${m}`;
    const pct = Math.round((completed.size / LEVELS_PER_MAP) * 100);

    const card = document.createElement('button');
    card.type = 'button';
    card.className = `world-card${unlocked ? '' : ' locked'}`;
    card.disabled = !unlocked;
    card.innerHTML = `
      <h3>${mapName}</h3>
      <p>${unlocked ? `${completed.size} / ${LEVELS_PER_MAP} niveles` : '🔒 Completá el mapa anterior'}</p>
      <div class="world-progress"><div class="world-progress-fill" style="width:${pct}%"></div></div>
    `;
    card.addEventListener('click', () => {
      if (!unlocked) return;
      playMenuConfirmSound();
      showLevelMap(m, getMapProgress(m).maxUnlocked);
    });
    worldsGrid.appendChild(card);
  }
}

function showWorldMap() {
  buildWorldsGrid();
  showScreen('worlds');
}

function showScreen(screen) {
  const isMenu = screen === 'menu';
  const isWorlds = screen === 'worlds';
  const isMap = screen === 'map';
  const isGame = screen === 'game';

  if (mainMenu) {
    mainMenu.classList.toggle('hidden', !isMenu);
    mainMenu.hidden = !isMenu;
  }
  if (worldMapScreen) {
    worldMapScreen.classList.toggle('hidden', !isWorlds);
    worldMapScreen.hidden = !isWorlds;
  }
  if (levelMapScreen) {
    levelMapScreen.classList.toggle('hidden', !isMap);
    levelMapScreen.hidden = !isMap;
  }
  if (appShell) {
    if (isGame) appShell.classList.remove('app-hidden');
    else {
      appShell.classList.add('app-hidden');
      stopBoss();
    }
  }
}

function showMainMenu() {
  updateMenuStats();
  stopBoss();
  showScreen('menu');
  if (musicToggle?.checked) startAmbientMusic();
}

function showLevelMap(mapId, scrollToLevel) {
  const id = mapId || viewingMapId || 1;
  if (!isMapUnlocked(id)) {
    showWorldMap();
    return;
  }
  buildLevelMap(id, scrollToLevel || null);
  showScreen('map');
}

function updateMenuStats() {
  if (menuCompleted) menuCompleted.textContent = String(getTotalCompletedCount());
  if (menuUnlocked) menuUnlocked.textContent = String(getTotalUnlockedCount());
  if (menuStreak) menuStreak.textContent = String(loadBestStreak());
}

function changeLevel(delta) {
  if (isTransitioning) return;
  let next = currentLevelInMap + delta;
  if (next < 1) next = 1;
  if (next > LEVELS_PER_MAP) next = LEVELS_PER_MAP;
  if (!isLevelUnlocked(currentMapId, next)) {
    setMessage('Nivel bloqueado. Completá los anteriores en el mapa.', 'danger');
    return;
  }
  streak = 0;
  updateStreakDisplay();
  loadLevel(currentMapId, next, { resetLives: false });
}

function initLevelSelector() {
  for (let i = 1; i <= LEVELS_PER_MAP; i += 1) {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = `Nivel ${i}`;
    levelSelect.appendChild(option);
  }
  levelSelect.addEventListener('change', event => {
    if (isTransitioning) {
      levelSelect.value = String(currentLevelInMap);
      return;
    }
    const num = Number(event.target.value);
    if (!isLevelUnlocked(currentMapId, num)) {
      levelSelect.value = String(currentLevelInMap);
      setMessage('Ese nivel está bloqueado. Desbloquealo desde el mapa.', 'danger');
      return;
    }
    streak = 0;
    updateStreakDisplay();
    loadLevel(currentMapId, num, { resetLives: false });
  });
}

btnNext.addEventListener('click', () => changeLevel(1));
btnPrev.addEventListener('click', () => changeLevel(-1));
btnReset.addEventListener('click', () => renderLevel(currentMapId, currentLevelInMap));
btnSolve.addEventListener('click', revealSolution);

musicToggle.addEventListener('change', event => {
  if (event.target.checked) startAmbientMusic();
  else stopAmbientMusic();
  if (settingsMusic) settingsMusic.checked = event.target.checked;
  saveSettings();
});

btnShop.addEventListener('click', showShopModal);
btnBuySidebar.addEventListener('click', showShopModal);
footerShop.addEventListener('click', event => {
  event.preventDefault();
  showShopModal();
});
btnCloseShop.addEventListener('click', hideShopModal);
shopModal.addEventListener('click', event => {
  if (event.target === shopModal) hideShopModal();
});

btnRestartLevel.addEventListener('click', () => {
  hideGameOverModal();
  renderLevel(currentMapId, currentLevelInMap);
});
btnCloseModal.addEventListener('click', closeGameOverModal);

gameOverModal.addEventListener('click', event => {
  if (event.target === gameOverModal) closeGameOverModal();
});

function initApp() {
  if (mainMenu) {
    mainMenu.classList.remove('hidden');
    mainMenu.hidden = false;
  }
  if (appShell) appShell.classList.add('app-hidden');

  applyBranding();
  loadPremiumStatus();
  buildNumberPads();
  initLevelSelector();
  loadProgressData();
  initMainMenu();
  initShare();
  initInstallPrompt();
  initMobileMenu();
  initPaymentWaitModal();
  resumePendingPayment();
  startFreeHeartTimer();
  handlePaymentReturn();
  registerServiceWorker();
}

initApp();
