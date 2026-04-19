/* ══════════════════════════════════════════════════════════
   ÑawzApp — app.js
   Lógica completa: login · encuesta · dashboard · storage
══════════════════════════════════════════════════════════ */

'use strict';

/* ── Contraseña ──────────────────────────────────────────── */
const SECRET_PASS = 'teamogato';

/* ── Estructura de áreas y preguntas ────────────────────── */
const AREAS = [
  {
    id:    'emocional',
    title: 'Vínculo Emocional',
    icon:  '💗',
    badge: 'Área 1 · Emocional',
    desc:  'Cómo te sientes emocionalmente en la relación',
    color: '#FDA4AF',
    bg:    '#FFF1F2',
    textColor: '#BE123C',
    questions: [
      '¿Qué tan contenta te sientes con la relación en general?',
      '¿Qué tan escuchada y comprendida te sientes por él?',
      '¿Qué tan valorada y apreciada te sientes cada día?',
      '¿Qué tan estable y segura sientes la relación emocionalmente?',
    ]
  },
  {
    id:    'fisico',
    title: 'Seguridad & Bienestar Físico',
    icon:  '🌼',
    badge: 'Área 2 · Físico',
    desc:  'Seguridad, afecto físico y cuidado mutuo',
    color: '#FDBA74',
    bg:    '#FFF7ED',
    textColor: '#B45309',
    questions: [
      '¿Qué tan segura físicamente te sientes con él a tu lado?',
      '¿Qué tan satisfecha estás con el afecto físico y la intimidad?',
      '¿Qué tan cuidada te sientes en tu bienestar y salud por él?',
    ]
  },
  {
    id:    'crecimiento',
    title: 'Crecimiento & Desafío Personal',
    icon:  '✨',
    badge: 'Área 3 · Crecimiento',
    desc:  'Cómo él contribuye a tu desarrollo personal',
    color: '#6EE7B7',
    bg:    '#ECFDF5',
    textColor: '#047857',
    questions: [
      '¿Qué tan desafiada intelectualmente te hace sentir él?',
      '¿Qué tan apoyada te sientes en tus metas y sueños?',
      '¿Qué tan motivada te sientes a crecer gracias a él?',
    ]
  },
  {
    id:    'social',
    title: 'Diversión & Conexión',
    icon:  '💜',
    badge: 'Área 4 · Social',
    desc:  'Diversión, romance, comunicación y trabajo en equipo',
    color: '#C4B5FD',
    bg:    '#F5F3FF',
    textColor: '#6D28D9',
    questions: [
      '¿Qué tan divertida y alegre te sientes a su lado?',
      '¿Qué tan romántica y especial sientes la relación?',
      '¿Qué tan satisfecha estás con cómo se comunican?',
      '¿Qué tan bien funcionan como equipo en el día a día?',
    ]
  }
];

/* Etiquetas de valor para el display */
const RATING_LABELS = {
  1: 'Muy poco', 2: 'Poco', 3: 'Bajo', 4: 'Algo bajo', 5: 'Regular',
  6: 'Algo bien', 7: 'Bien', 8: 'Muy bien', 9: 'Excelente', 10: '¡Perfecto! 💕'
};

/* ── Estado de la app ────────────────────────────────────── */
let state = {
  user: { name: '', email: '' },
  currentArea: 0,
  answers: {},        // { areaId: { q0: 7, q1: 5, ... } }
  charts: {}          // chart instances keyed by id
};

/* ── Almacenamiento ──────────────────────────────────────── */
const STORAGE_KEY = 'nawzapp_submissions';

function loadSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveSubmissions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ── Navegación de vistas ────────────────────────────────── */
function goView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const v = document.getElementById(id);
  if (v) {
    v.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (id === 'view-dashboard') renderDashboard();
}

/* ── LOGIN ───────────────────────────────────────────────── */
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name  = document.getElementById('inp-name').value.trim();
  const email = document.getElementById('inp-email').value.trim();
  const pass  = document.getElementById('inp-pass').value;
  const errEl = document.getElementById('login-error');

  if (pass !== SECRET_PASS) {
    errEl.classList.remove('hidden');
    document.getElementById('inp-pass').value = '';
    document.getElementById('inp-pass').focus();
    return;
  }
  errEl.classList.add('hidden');
  state.user = { name, email };
  state.currentArea = 0;
  state.answers = {};
  startSurvey();
});

/* Toggle mostrar/ocultar contraseña */
document.getElementById('eye-btn').addEventListener('click', function () {
  const inp = document.getElementById('inp-pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

/* Ir al dashboard desde el footer */
document.getElementById('go-dashboard-btn').addEventListener('click', function () {
  goView('view-dashboard');
});

/* ── SURVEY ───────────────────────────────────────────────── */
function startSurvey() {
  state.currentArea = 0;
  renderArea(0);
  goView('view-survey');
}

function renderArea(areaIdx) {
  const area = AREAS[areaIdx];
  const total = AREAS.length;

  /* Clase de área en el wrapper */
  const wrap = document.querySelector('.survey-wrap');
  AREAS.forEach(a => wrap.classList.remove('area--' + a.id));
  wrap.classList.add('area--' + area.id);

  /* Progreso */
  const pct = ((areaIdx) / total) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  /* Meta */
  const badge = document.getElementById('area-badge');
  badge.textContent = area.badge;
  badge.style.background = area.bg;
  badge.style.color = area.textColor;

  document.getElementById('step-counter').textContent =
    `${areaIdx + 1} / ${total}`;

  /* Header */
  document.getElementById('area-icon-big').textContent = area.icon;
  document.getElementById('area-title').textContent = area.title;
  document.getElementById('area-desc').textContent  = area.desc;

  /* Preguntas */
  const container = document.getElementById('questions-list');
  container.innerHTML = '';

  const saved = state.answers[area.id] || {};

  area.questions.forEach((qText, qIdx) => {
    const card = document.createElement('div');
    card.className = 'q-card';
    card.id = `qcard-${areaIdx}-${qIdx}`;

    card.innerHTML = `
      <div class="q-number">Pregunta ${qIdx + 1}</div>
      <p class="q-text">${qText}</p>
      <div class="rating-wrap">
        <div class="rating-row" id="rating-${areaIdx}-${qIdx}">
          ${[1,2,3,4,5,6,7,8,9,10].map(n => `
            <button type="button"
              class="rating-btn${saved[qIdx] === n ? ' selected' : ''}"
              style="color: ${area.color}"
              data-val="${n}"
              onclick="selectRating(${areaIdx},${qIdx},${n})"
              aria-label="Valor ${n}"
            ><span>${n}</span></button>
          `).join('')}
        </div>
        <div class="rating-labels">
          <span>Poco 😕</span>
          <span>¡Mucho! 💕</span>
        </div>
        <div class="rating-val ${saved[qIdx] ? 'has-val' : ''}" id="rval-${areaIdx}-${qIdx}">
          ${saved[qIdx] ? RATING_LABELS[saved[qIdx]] : ''}
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  /* Botón anterior */
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  btnPrev.style.visibility = areaIdx === 0 ? 'hidden' : 'visible';

  const isLast = areaIdx === total - 1;
  btnNext.textContent = isLast ? 'Enviar encuesta 💕' : 'Siguiente →';
}

function selectRating(areaIdx, qIdx, val) {
  const area = AREAS[areaIdx];
  if (!state.answers[area.id]) state.answers[area.id] = {};
  state.answers[area.id][qIdx] = val;

  /* Actualizar botones */
  const row = document.getElementById(`rating-${areaIdx}-${qIdx}`);
  row.querySelectorAll('.rating-btn').forEach(btn => {
    btn.classList.toggle('selected', Number(btn.dataset.val) === val);
  });

  /* Actualizar etiqueta de valor */
  const valEl = document.getElementById(`rval-${areaIdx}-${qIdx}`);
  valEl.textContent = RATING_LABELS[val];
  valEl.classList.add('has-val');

  /* Quitar clase de advertencia si estaba */
  document.getElementById(`qcard-${areaIdx}-${qIdx}`).classList.remove('unanswered');
}

function nextArea() {
  const area = AREAS[state.currentArea];

  /* Validar que todas las preguntas están respondidas */
  const saved = state.answers[area.id] || {};
  let allAnswered = true;
  area.questions.forEach((_, qIdx) => {
    if (saved[qIdx] === undefined) {
      allAnswered = false;
      const card = document.getElementById(`qcard-${state.currentArea}-${qIdx}`);
      card.classList.add('unanswered');
      /* Re-trigger animation */
      void card.offsetWidth;
      card.classList.add('unanswered');
    }
  });

  if (!allAnswered) {
    /* Scroll a la primera sin responder */
    const first = document.querySelector('.q-card.unanswered');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (state.currentArea < AREAS.length - 1) {
    state.currentArea++;
    renderArea(state.currentArea);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    submitSurvey();
  }
}

function prevArea() {
  if (state.currentArea > 0) {
    state.currentArea--;
    renderArea(state.currentArea);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ── SUBMIT ──────────────────────────────────────────────── */
function submitSurvey() {
  /* Calcular promedios por área */
  const areaScores = {};
  AREAS.forEach(area => {
    const ans = state.answers[area.id] || {};
    const vals = Object.values(ans);
    areaScores[area.id] = vals.length
      ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
      : 0;
  });

  const overall = +(Object.values(areaScores).reduce((a,b)=>a+b,0) / AREAS.length).toFixed(2);

  const submission = {
    id:         Date.now().toString(36) + Math.random().toString(36).slice(2,6),
    date:       new Date().toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' }),
    dateISO:    new Date().toISOString().split('T')[0],
    name:       state.user.name,
    email:      state.user.email,
    answers:    JSON.parse(JSON.stringify(state.answers)),
    areaScores,
    overall
  };

  const submissions = loadSubmissions();
  submissions.push(submission);
  saveSubmissions(submissions);

  showThanks(submission);
}

/* ── THANKS ──────────────────────────────────────────────── */
function showThanks(submission) {
  document.getElementById('thanks-name').textContent = state.user.name;
  document.getElementById('overall-val').textContent = submission.overall;

  const grid = document.getElementById('area-scores');
  grid.innerHTML = AREAS.map(area => `
    <div class="score-mini-card" style="border-top: 3px solid ${area.color}">
      <span class="score-mini-icon">${area.icon}</span>
      <span class="score-mini-name">${area.title}</span>
      <span class="score-mini-val" style="color:${area.textColor}">
        ${submission.areaScores[area.id]}
      </span>
    </div>
  `).join('');

  goView('view-thanks');
}

/* ── DASHBOARD ───────────────────────────────────────────── */
function renderDashboard() {
  const submissions = loadSubmissions();

  /* Destruir gráficas anteriores para evitar conflictos */
  ['chart-line', 'chart-radar'].forEach(id => {
    if (state.charts[id]) {
      state.charts[id].destroy();
      delete state.charts[id];
    }
  });

  if (submissions.length === 0) {
    document.getElementById('dash-empty').classList.remove('hidden');
    document.getElementById('dash-content').classList.add('hidden');
    return;
  }

  document.getElementById('dash-empty').classList.add('hidden');
  document.getElementById('dash-content').classList.remove('hidden');

  const last = submissions[submissions.length - 1];

  /* Fecha última encuesta */
  document.getElementById('dash-last-date').textContent =
    `Última encuesta: ${last.date} · ${last.name}`;

  /* Área cards */
  renderAreaCards(last, submissions);

  /* Gráfica de línea — evolución global */
  renderLineChart(submissions);

  /* Gráfica de radar — última encuesta por área */
  renderRadarChart(last);

  /* Tabla historial */
  renderHistTable(submissions);
}

/* ─── Cards de área ─────────────────────────────────────── */
function renderAreaCards(last, submissions) {
  const container = document.getElementById('dash-area-cards');

  container.innerHTML = AREAS.map(area => {
    const score = last.areaScores[area.id] ?? '-';
    /* Tendencia vs penúltima */
    let trend = '';
    if (submissions.length >= 2) {
      const prev = submissions[submissions.length - 2];
      const diff = (last.areaScores[area.id] - (prev.areaScores[area.id] || 0)).toFixed(1);
      trend = diff > 0
        ? `↑ +${diff} vs. anterior`
        : diff < 0
          ? `↓ ${diff} vs. anterior`
          : `= igual que anterior`;
    }

    return `
      <div class="dash-area-card" style="background:${area.bg}">
        <span class="dac-icon">${area.icon}</span>
        <div class="dac-info">
          <div class="dac-name" style="color:${area.textColor}">${area.title}</div>
          <div class="dac-score" style="color:${area.textColor}">${score}</div>
          ${trend ? `<div class="dac-trend" style="color:${area.textColor}">${trend}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/* ─── Gráfica de línea ──────────────────────────────────── */
function renderLineChart(submissions) {
  const labels = submissions.map(s => s.dateISO);
  const data   = submissions.map(s => s.overall);

  const areaDatasets = AREAS.map(area => ({
    label: `${area.icon} ${area.title}`,
    data:  submissions.map(s => s.areaScores[area.id]),
    borderColor: area.color,
    backgroundColor: area.color + '22',
    borderWidth: 2,
    tension: 0.35,
    pointRadius: 4,
    pointHoverRadius: 6,
    hidden: true
  }));

  const ctx = document.getElementById('chart-line').getContext('2d');
  state.charts['chart-line'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '🌸 Global',
          data,
          borderColor: '#F472B6',
          backgroundColor: 'rgba(244,114,182,0.12)',
          borderWidth: 3,
          tension: 0.35,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: '#F472B6',
        },
        ...areaDatasets
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Nunito', size: 12 },
            color: '#9D174D',
            padding: 16,
            boxWidth: 14,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: '#FDF2F8',
          titleColor: '#831843',
          bodyColor: '#9D174D',
          borderColor: '#FBCFE8',
          borderWidth: 1,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}`
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#FDF2F8' },
          ticks: { font: { family: 'Nunito', size: 10 }, color: '#C4859E' }
        },
        y: {
          min: 0, max: 10,
          grid: { color: '#FDF2F8' },
          ticks: { font: { family: 'Nunito', size: 10 }, color: '#C4859E', stepSize: 2 }
        }
      }
    }
  });
}

/* ─── Gráfica de radar ──────────────────────────────────── */
function renderRadarChart(last) {
  const labels = AREAS.map(a => a.title);
  const data   = AREAS.map(a => last.areaScores[a.id] ?? 0);

  const ctx = document.getElementById('chart-radar').getContext('2d');
  state.charts['chart-radar'] = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: `${last.name} · ${last.dateISO}`,
        data,
        borderColor: '#F472B6',
        backgroundColor: 'rgba(244,114,182,0.2)',
        borderWidth: 2.5,
        pointBackgroundColor: AREAS.map(a => a.color),
        pointRadius: 5,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: { family: 'Nunito', size: 11 },
            color: '#9D174D',
          }
        }
      },
      scales: {
        r: {
          min: 0, max: 10,
          ticks: {
            stepSize: 2,
            font: { family: 'Nunito', size: 9 },
            color: '#C4859E',
            backdropColor: 'transparent'
          },
          grid:        { color: '#FBCFE8' },
          angleLines:  { color: '#FBCFE8' },
          pointLabels: { font: { family: 'Nunito', size: 11 }, color: '#9D174D' }
        }
      }
    }
  });
}

/* ─── Tabla de historial ────────────────────────────────── */
function renderHistTable(submissions) {
  const tbody = document.getElementById('hist-body');
  tbody.innerHTML = '';

  /* Más reciente primero */
  [...submissions].reverse().forEach(s => {
    const scoreColor = val =>
      val >= 8 ? '#047857' : val >= 6 ? '#B45309' : '#BE123C';
    const pill = (val, areaColor) =>
      `<span class="score-pill" style="background:${areaColor}33;color:${scoreColor(val)}">${val}</span>`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.dateISO}</td>
      <td>${s.name}</td>
      <td>${pill(s.areaScores.emocional,    AREAS[0].color)}</td>
      <td>${pill(s.areaScores.fisico,       AREAS[1].color)}</td>
      <td>${pill(s.areaScores.crecimiento,  AREAS[2].color)}</td>
      <td>${pill(s.areaScores.social,       AREAS[3].color)}</td>
      <td>${pill(s.overall, '#F472B6')}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ── EXPORT / IMPORT ─────────────────────────────────────── */
function exportJSON() {
  const submissions = loadSubmissions();
  if (submissions.length === 0) { alert('No hay datos para exportar.'); return; }

  const blob = new Blob(
    [JSON.stringify({ app: 'ÑawzApp', exportedAt: new Date().toISOString(), submissions }, null, 2)],
    { type: 'application/json' }
  );
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href  = url;
  link.download = `nawzapp_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      const incoming = parsed.submissions || (Array.isArray(parsed) ? parsed : null);
      if (!incoming) throw new Error('Formato inválido');

      const existing = loadSubmissions();
      /* Merge — evitar duplicados por id */
      const existingIds = new Set(existing.map(s => s.id));
      const merged = [...existing, ...incoming.filter(s => !existingIds.has(s.id))];
      saveSubmissions(merged);

      alert(`✅ Importados ${incoming.length} registros. Total: ${merged.length}`);
      renderDashboard();
    } catch (err) {
      alert('Error al importar: archivo JSON inválido.');
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // reset input
}

function clearAllData() {
  if (confirm('¿Segura que quieres borrar TODOS los datos?\nEsta acción no se puede deshacer. 🙈')) {
    localStorage.removeItem(STORAGE_KEY);
    renderDashboard();
  }
}

/* ── INICIALIZACIÓN ──────────────────────────────────────── */
(function init() {
  /* Si la URL tiene #dashboard, ir directo */
  if (window.location.hash === '#dashboard') {
    goView('view-dashboard');
  }
})();
