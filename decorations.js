/* ══════════════════════════════════════════════════════════
   ÑawzApp — decorations.js
   Fondo animado: girasoles · libros · mariposas pastel
══════════════════════════════════════════════════════════ */

'use strict';

const FLOWERS = ['🌻', '🌻', '🌻', '🌼', '🌸', '🌺'];
const BOOKS   = ['📖', '📚', '📕', '📗', '📘'];

/* ── Capa de fondo ───────────────────────────────────────── */
function createBgLayer() {
  const layer = document.createElement('div');
  layer.id = 'bg-layer';
  document.body.prepend(layer);
  return layer;
}

/* ── Girasoles y flores ──────────────────────────────────── */
function addFlowers(layer) {
  const count = window.innerWidth < 480 ? 14 : 22;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'bg-flower';
    el.textContent = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];

    const size    = (1.0 + Math.random() * 1.8).toFixed(1);
    const opacity = (0.20 + Math.random() * 0.30).toFixed(2);
    const dur     = (3.5 + Math.random() * 4.5).toFixed(1);
    const delay   = -(Math.random() * 6).toFixed(1);

    el.style.cssText = `
      left:      ${(Math.random() * 98).toFixed(1)}%;
      top:       ${(Math.random() * 96).toFixed(1)}%;
      --size:    ${size}rem;
      --opacity: ${opacity};
      --dur:     ${dur}s;
      --delay:   ${delay}s;
    `;
    layer.appendChild(el);
  }
}

/* ── Libros ──────────────────────────────────────────────── */
function addBooks(layer) {
  const count = window.innerWidth < 480 ? 6 : 10;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'bg-book';
    el.textContent = BOOKS[Math.floor(Math.random() * BOOKS.length)];

    const size    = (0.9 + Math.random() * 0.8).toFixed(1);
    const opacity = (0.10 + Math.random() * 0.12).toFixed(2);
    const dur     = (5.0 + Math.random() * 6.0).toFixed(1);
    const delay   = -(Math.random() * 8).toFixed(1);

    el.style.cssText = `
      left:      ${(Math.random() * 97).toFixed(1)}%;
      top:       ${(Math.random() * 95).toFixed(1)}%;
      --size:    ${size}rem;
      --opacity: ${opacity};
      --dur:     ${dur}s;
      --delay:   ${delay}s;
    `;
    layer.appendChild(el);
  }
}

/* ── Mariposa ────────────────────────────────────────────── */
function launchButterfly() {
  const el = document.createElement('span');
  el.className = 'butterfly';
  el.textContent = '🦋';

  const fromLeft  = Math.random() > 0.5;
  const size      = (1.4 + Math.random() * 0.8).toFixed(1);
  const duration  = 10000 + Math.random() * 7000;  // 10–17 s
  const startYpct = 12 + Math.random() * 58;        // 12–70 % viewport
  const amplitude = 35 + Math.random() * 35;        // px de ola
  const waves     = 2 + Math.random() * 2;          // ciclos de ola

  el.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 10;
    font-size: ${size}rem;
    top: ${startYpct}vh;
    ${fromLeft ? 'left: -70px' : 'right: -70px'};
  `;
  document.body.appendChild(el);

  const startTime = performance.now();
  const vw        = window.innerWidth;
  const startX    = fromLeft ? -70 : vw + 70;
  const endX      = fromLeft ? vw + 70 : -70;
  const baseY     = window.innerHeight * startYpct / 100;

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);

    if (t >= 1) { el.remove(); return; }

    const x   = startX + (endX - startX) * t;
    const y   = baseY  + Math.sin(t * Math.PI * waves) * amplitude;
    const rot = Math.sin(t * Math.PI * waves * 2) * 18;
    const scaleX = fromLeft ? 1 : -1;

    el.style.left      = x + 'px';
    el.style.top       = y + 'px';
    el.style.transform = `scaleX(${scaleX}) rotate(${rot}deg)`;

    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function scheduleButterflies() {
  /* Primera mariposa entre 6–14 s */
  setTimeout(function fly() {
    launchButterfly();
    /* Siguiente entre 22–50 s */
    setTimeout(fly, 22000 + Math.random() * 28000);
  }, 6000 + Math.random() * 8000);
}

/* ── Init ────────────────────────────────────────────────── */
(function init() {
  const layer = createBgLayer();
  addFlowers(layer);
  addBooks(layer);
  scheduleButterflies();
})();
