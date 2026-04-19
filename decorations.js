/* ══════════════════════════════════════════════════════════
   ÑawzApp — decorations.js
   Mariposas animadas que cruzan la pantalla
══════════════════════════════════════════════════════════ */

'use strict';

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

scheduleButterflies();
