/* ══════════════════════════════════════════════════════════
   ÑawzApp — decorations.js
   Fondo estático: flores · libros
   Elementos voladores: mariposas · girasoles · corazones · libros · gatitos
══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════════════════
   FONDO ESTÁTICO
══════════════════════════════════════════════════════════ */

function createBgLayer() {
  const layer = document.createElement('div');
  layer.style.position      = 'fixed';
  layer.style.inset         = '0';
  layer.style.pointerEvents = 'none';
  layer.style.zIndex        = '0';
  layer.style.overflow      = 'hidden';
  document.body.prepend(layer);
  return layer;
}

function addFlowers(layer) {
  const EMOJIS = ['🌻', '🌻', '🌻', '🌼', '🌸', '🌺'];
  const count  = window.innerWidth < 480 ? 12 : 20;
  for (let i = 0; i < count; i++) {
    const el      = document.createElement('span');
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const size    = (1.0 + Math.random() * 1.6).toFixed(1);
    const opacity = (0.20 + Math.random() * 0.28).toFixed(2);
    const dur     = (3.5 + Math.random() * 4.5).toFixed(1);
    const delay   = -(Math.random() * 6).toFixed(1);
    el.style.position        = 'absolute';
    el.style.left            = (Math.random() * 96).toFixed(1) + '%';
    el.style.top             = (Math.random() * 94).toFixed(1) + '%';
    el.style.fontSize        = size + 'rem';
    el.style.opacity         = opacity;
    el.style.userSelect      = 'none';
    el.style.transformOrigin = '50% 90%';
    el.style.animation       = `flower-sway ${dur}s ease-in-out ${delay}s infinite alternate`;
    el.style.filter          = 'drop-shadow(0 2px 4px rgba(244,114,182,0.15))';
    layer.appendChild(el);
  }
}

function addBooks(layer) {
  const EMOJIS = ['📖', '📚', '📕', '📗', '📘'];
  const count  = window.innerWidth < 480 ? 5 : 9;
  for (let i = 0; i < count; i++) {
    const el      = document.createElement('span');
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const size    = (0.9 + Math.random() * 0.7).toFixed(1);
    const opacity = (0.10 + Math.random() * 0.12).toFixed(2);
    const dur     = (5.0 + Math.random() * 6.0).toFixed(1);
    const delay   = -(Math.random() * 8).toFixed(1);
    el.style.position  = 'absolute';
    el.style.left      = (Math.random() * 96).toFixed(1) + '%';
    el.style.top       = (Math.random() * 94).toFixed(1) + '%';
    el.style.fontSize  = size + 'rem';
    el.style.opacity   = opacity;
    el.style.userSelect = 'none';
    el.style.animation = `book-float ${dur}s ease-in-out ${delay}s infinite alternate`;
    layer.appendChild(el);
  }
}

/* ══════════════════════════════════════════════════════════
   ELEMENTOS VOLADORES
══════════════════════════════════════════════════════════ */

/*
  Configuración de cada tipo:
  - emojis:  lista de emojis posibles
  - dur:     [min, max] duración en ms para cruzar la pantalla
  - size:    [min, max] tamaño en px
  - amp:     [min, max] amplitud vertical de la ola (px)
  - waves:   [min, max] ciclos de ola
  - weight:  frecuencia relativa de aparición
*/
const FLYING_CONFIGS = [
  {
    type:    'butterfly',
    emojis:  ['🦋'],
    dur:     [8000, 13000],
    size:    [24, 40],
    amp:     [30, 55],
    waves:   [1.5, 3.5],
    weight:  3,
  },
  {
    type:    'sunflower',
    emojis:  ['🌻', '🌻', '🌼', '🌸'],
    dur:     [9000, 14000],
    size:    [22, 38],
    amp:     [25, 45],
    waves:   [1.0, 2.5],
    weight:  3,
  },
  {
    type:    'heart',
    emojis:  ['💗', '🩷', '💕', '💖', '💓'],
    dur:     [6000, 10000],
    size:    [18, 32],
    amp:     [40, 65],
    waves:   [2.0, 4.5],
    weight:  4,
  },
  {
    type:    'book',
    emojis:  ['📖', '📚'],
    dur:     [10000, 16000],
    size:    [20, 34],
    amp:     [18, 35],
    waves:   [0.8, 2.0],
    weight:  2,
  },
  {
    type:    'cat',
    emojis:  ['🐱', '🐈'],
    dur:     [22000, 38000],   /* muy lento */
    size:    [28, 46],
    amp:     [8, 20],          /* trayectoria casi recta */
    waves:   [0.3, 0.8],
    weight:  1,
  },
];

/* Tabla de pesos acumulados para selección aleatoria ponderada */
const TOTAL_WEIGHT = FLYING_CONFIGS.reduce((s, c) => s + c.weight, 0);

function pickConfig() {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const cfg of FLYING_CONFIGS) {
    r -= cfg.weight;
    if (r <= 0) return cfg;
  }
  return FLYING_CONFIGS[0];
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

/* ── Lanzar un elemento volador ──────────────────────────── */
function launchElement(cfg) {
  const emoji    = cfg.emojis[Math.floor(Math.random() * cfg.emojis.length)];
  const fromLeft = Math.random() > 0.5;
  const sizePx   = rand(cfg.size[0],  cfg.size[1]);
  const duration = rand(cfg.dur[0],   cfg.dur[1]);
  const startYpct= rand(8, 68);
  const amplitude= rand(cfg.amp[0],   cfg.amp[1]);
  const waves    = rand(cfg.waves[0], cfg.waves[1]);

  const vw     = window.innerWidth;
  const startX = fromLeft ? -80 : vw + 80;
  const endX   = fromLeft ? vw + 80 : -80;
  const baseY  = window.innerHeight * startYpct / 100;

  const el = document.createElement('span');
  el.textContent         = emoji;
  el.style.position      = 'fixed';
  el.style.pointerEvents = 'none';
  el.style.zIndex        = '10';
  el.style.fontSize      = sizePx + 'px';
  el.style.left          = startX + 'px';
  el.style.top           = baseY  + 'px';
  el.style.userSelect    = 'none';
  el.style.willChange    = 'left, top, transform';
  el.style.filter        = 'drop-shadow(0 2px 5px rgba(244,114,182,0.2))';
  document.body.appendChild(el);

  const startTime = performance.now();

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    if (t >= 1) { el.remove(); return; }

    const x      = startX + (endX - startX) * t;
    const y      = baseY  + Math.sin(t * Math.PI * waves) * amplitude;
    const rot    = Math.sin(t * Math.PI * waves * 2) * 14;
    const scaleX = fromLeft ? 1 : -1;

    el.style.left      = x + 'px';
    el.style.top       = y + 'px';
    el.style.transform = `scaleX(${scaleX}) rotate(${rot}deg)`;

    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Programador de elementos voladores ─────────────────── */
function scheduleFlying() {
  /* Primer elemento entre 2–4 s */
  setTimeout(function fly() {
    launchElement(pickConfig());
    /* Siguiente entre 4–8 s */
    setTimeout(fly, rand(4000, 8000));
  }, rand(2000, 4000));
}

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
const bgLayer = createBgLayer();
addFlowers(bgLayer);
addBooks(bgLayer);
scheduleFlying();
