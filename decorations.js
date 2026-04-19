/* ══════════════════════════════════════════════════════════
   ÑawzApp — decorations.js
   Fondo animado: flores · libros · mariposas
══════════════════════════════════════════════════════════ */

'use strict';

/* ── Capa de fondo fija ──────────────────────────────────── */
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

/* ── Flores y girasoles ──────────────────────────────────── */
function addFlowers(layer) {
  const EMOJIS = ['🌻', '🌻', '🌻', '🌼', '🌸', '🌺'];
  const count  = window.innerWidth < 480 ? 12 : 20;

  for (let i = 0; i < count; i++) {
    const el   = document.createElement('span');
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

/* ── Libros ──────────────────────────────────────────────── */
function addBooks(layer) {
  const EMOJIS = ['📖', '📚', '📕', '📗', '📘'];
  const count  = window.innerWidth < 480 ? 5 : 9;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
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

/* ── Mariposa ────────────────────────────────────────────── */
function launchButterfly() {
  const el = document.createElement('span');
  el.textContent = '🦋';

  const fromLeft  = Math.random() > 0.5;
  const sizePx    = 24 + Math.random() * 16;          // 24–40px
  const duration  = 8000 + Math.random() * 5000;      // 8–13 s
  const startYpct = 10 + Math.random() * 60;           // 10–70% viewport height
  const amplitude = 30 + Math.random() * 40;           // px de ola vertical
  const waves     = 1.5 + Math.random() * 2;           // ciclos de ola

  const vw     = window.innerWidth;
  const startX = fromLeft ? -60 : vw + 60;
  const endX   = fromLeft ? vw + 60 : -60;
  const baseY  = window.innerHeight * startYpct / 100;

  /* Posicionar vía style properties directas, sin CSS vars */
  el.style.position      = 'fixed';
  el.style.pointerEvents = 'none';
  el.style.zIndex        = '10';
  el.style.fontSize      = sizePx + 'px';
  el.style.left          = startX + 'px';
  el.style.top           = baseY  + 'px';
  el.style.userSelect    = 'none';
  el.style.willChange    = 'left, top, transform';
  el.style.filter        = 'drop-shadow(0 2px 5px rgba(244,114,182,0.25))';

  document.body.appendChild(el);

  const startTime = performance.now();

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);

    if (t >= 1) {
      el.remove();
      return;
    }

    const x      = startX + (endX - startX) * t;
    const y      = baseY  + Math.sin(t * Math.PI * waves) * amplitude;
    const rot    = Math.sin(t * Math.PI * waves * 2) * 15;
    const scaleX = fromLeft ? 1 : -1;

    el.style.left      = x + 'px';
    el.style.top       = y + 'px';
    el.style.transform = `scaleX(${scaleX}) rotate(${rot}deg)`;

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function scheduleButterflies() {
  /* Primera mariposa entre 2–4 s */
  setTimeout(function fly() {
    launchButterfly();
    /* Siguiente entre 5–10 s */
    setTimeout(fly, 5000 + Math.random() * 5000);
  }, 2000 + Math.random() * 2000);
}

const bgLayer = createBgLayer();
addFlowers(bgLayer);
addBooks(bgLayer);
scheduleButterflies();
