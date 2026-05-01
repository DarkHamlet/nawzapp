/* ══════════════════════════════════════════════════════════
   ÑawzApp — app.js  v7
   Firebase Auth + Firestore
══════════════════════════════════════════════════════════ */
'use strict';

/* ── Áreas y preguntas ───────────────────────────────────── */
const AREAS = [
  {
    id: 'emocional', title: 'Vínculo Emocional', icon: '🥰',
    badge: 'Área 1 · Emocional', desc: 'Cómo te sientes emocionalmente en la relación',
    color: '#FDA4AF', bg: '#FFF1F2', textColor: '#BE123C',
    questionsElla: [
      '¿Qué tan contenta y plena te sientes con la relación en general?',
      '¿Qué tan escuchada y comprendida te sientes por él?',
      '¿Qué tan valorada y apreciada te sientes cada día?',
      '¿Qué tan estable y segura sientes la relación emocionalmente?',
      '¿Qué tan profunda y genuina sientes la conexión emocional entre ustedes?',
    ],
    questionsEl: [
      '¿Qué tan contento y pleno te sientes con la relación en general?',
      '¿Qué tan escuchado y comprendido te sientes por ella?',
      '¿Qué tan valorado y apreciado te sientes cada día?',
      '¿Qué tan estable y segura sientes la relación emocionalmente?',
      '¿Qué tan profunda y genuina sientes la conexión emocional entre ustedes?',
    ]
  },
  {
    id: 'fisico', title: 'Seguridad & Bienestar Físico', icon: '🫂',
    badge: 'Área 2 · Físico', desc: 'Seguridad, afecto físico y cuidado mutuo',
    color: '#FDBA74', bg: '#FFF7ED', textColor: '#B45309',
    questionsElla: [
      '¿Qué tan segura físicamente te sientes con él a tu lado?',
      '¿Qué tan satisfecha estás con el afecto físico y la intimidad?',
      '¿Qué tan cuidada te sientes en tu bienestar y salud por él?',
      '¿Qué tan cómoda y relajada te sientes en su presencia física?',
      '¿Qué tan satisfecha estás con los gestos y detalles de amor que él tiene contigo?',
    ],
    questionsEl: [
      '¿Qué tan comprometido te sientes con la seguridad y protección de ella?',
      '¿Qué tan satisfecho estás con el afecto físico y la intimidad?',
      '¿Qué tan cuidado te sientes en tu bienestar y salud por ella?',
      '¿Qué tan cómodo y relajado te sientes en su presencia física?',
      '¿Qué tan satisfecho estás con los gestos y detalles de amor que ella tiene contigo?',
    ]
  },
  {
    id: 'crecimiento', title: 'Crecimiento & Desafío Personal', icon: '🌱',
    badge: 'Área 3 · Crecimiento', desc: 'Cómo contribuyen al desarrollo personal mutuo',
    color: '#6EE7B7', bg: '#ECFDF5', textColor: '#047857',
    questionsElla: [
      '¿Qué tan desafiada intelectualmente te hace sentir él?',
      '¿Qué tan apoyada te sientes en tus metas y sueños?',
      '¿Qué tan motivada te sientes a crecer gracias a él?',
      '¿Qué tan libre te sientes de ser tú misma dentro de la relación?',
      '¿Qué tan orgullosa te sientes de la persona que eres junto a él?',
    ],
    questionsEl: [
      '¿Qué tan desafiado intelectualmente te hace sentir ella?',
      '¿Qué tan apoyado te sientes en tus metas y sueños?',
      '¿Qué tan motivado te sientes a crecer gracias a ella?',
      '¿Qué tan libre te sientes de ser tú mismo dentro de la relación?',
      '¿Qué tan orgulloso te sientes de la persona que eres junto a ella?',
    ]
  },
  {
    id: 'social', title: 'Diversión & Conexión', icon: '🌟',
    badge: 'Área 4 · Social', desc: 'Diversión, romance, comunicación y trabajo en equipo',
    color: '#C4B5FD', bg: '#F5F3FF', textColor: '#6D28D9',
    questionsElla: [
      '¿Qué tan divertida y alegre te sientes a su lado?',
      '¿Qué tan romántica y especial sientes la relación?',
      '¿Qué tan satisfecha estás con cómo se comunican?',
      '¿Qué tan bien funcionan como equipo en el día a día?',
      '¿Qué tan ilusionada te sientes con el futuro que están construyendo juntos?',
    ],
    questionsEl: [
      '¿Qué tan divertido y alegre te sientes a su lado?',
      '¿Qué tan romántica y especial sientes la relación?',
      '¿Qué tan satisfecho estás con cómo se comunican?',
      '¿Qué tan bien funcionan como equipo en el día a día?',
      '¿Qué tan ilusionado te sientes con el futuro que están construyendo juntos?',
    ]
  }
];

const RATING_LABELS = {
  1:'Muy poco', 2:'Poco', 3:'Bajo', 4:'Algo bajo', 5:'Regular',
  6:'Algo bien', 7:'Bien', 8:'Muy bien', 9:'Excelente', 10:'¡Perfecto! 💕'
};

/* ── Estado global ───────────────────────────────────────── */
let state = {
  fbUser:   null,   // Firebase Auth user
  profile:  null,   // { name, role, email, coupleId, partnerEmail }
  coupleId: null,
  couple:   null,
  isAdmin:  false,
  currentArea: 0,
  answers:  {},
  charts:   {},
  surveys:  null,   // null = reload needed
};

let _registering       = false;  // suppress onAuthStateChanged during registration
let _adminPrevCoupleId = undefined; // undefined = not in admin-view-couple mode
let dashFilter = { roles: ['ella', 'el'], area: 'global' };

/* ══════════════════════════════════════════════════════════
   AUTH LISTENER
══════════════════════════════════════════════════════════ */
auth.onAuthStateChanged(async user => {
  if (_registering) return;
  if (user) {
    state.fbUser = user;
    try { await _loadProfile(); } catch (e) { console.error(e); }
    if (state.isAdmin) {
      goView('view-admin');
      loadAdminPanel();
    } else {
      _updateDashHeader();
      goView('view-dashboard');
    }
  } else {
    Object.assign(state, { fbUser:null, profile:null, coupleId:null, couple:null, isAdmin:false, surveys:null });
    goView('view-login');
  }
});

async function _loadProfile() {
  const uid  = state.fbUser.uid;
  const snap = await db.collection('users').doc(uid).get();
  state.profile = snap.data() || null;

  try {
    const aSnap = await db.collection('config').doc('admin').get();
    state.isAdmin = aSnap.exists && aSnap.data().email === state.fbUser.email;
  } catch { state.isAdmin = false; }

  state.coupleId = state.profile?.coupleId || null;
  if (state.coupleId) {
    const cSnap = await db.collection('couples').doc(state.coupleId).get();
    state.couple = cSnap.exists ? cSnap.data() : null;
    if (state.couple?.status === 'active') {
      await _migratePendingSurveys(uid, state.coupleId);
    }
  } else {
    state.couple = null;
  }
}

async function _migratePendingSurveys(uid, coupleId) {
  const personalSnap = await db.collection('users').doc(uid).collection('surveys').get();
  if (personalSnap.empty) return;
  const batch = db.batch();
  personalSnap.docs.forEach(s => {
    batch.set(db.collection('couples').doc(coupleId).collection('surveys').doc(s.id), s.data());
    batch.delete(s.ref);
  });
  await batch.commit();
}

/* ══════════════════════════════════════════════════════════
   NAVEGACIÓN
══════════════════════════════════════════════════════════ */
function goView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const v = document.getElementById(id);
  if (v) { v.classList.add('active'); window.scrollTo({ top:0, behavior:'smooth' }); }
  if (id === 'view-dashboard') renderDashboard();
}

/* ══════════════════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════════════════ */
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('inp-email').value.trim();
  const pass  = document.getElementById('inp-pass').value;
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (err) {
    errEl.textContent = _loginMsg(err.code);
    errEl.classList.remove('hidden');
    document.getElementById('inp-pass').value = '';
  }
});

function _loginMsg(code) {
  return ({
    'auth/user-not-found':    'No existe cuenta con ese email 🙈',
    'auth/wrong-password':    'Contraseña incorrecta 🙈',
    'auth/invalid-email':     'Email inválido 📧',
    'auth/too-many-requests': 'Demasiados intentos, esperá un momento ⏳',
    'auth/invalid-credential':'Email o contraseña incorrectos 🙈',
  })[code] || 'Error al ingresar. Intentá de nuevo.';
}

document.getElementById('eye-btn').addEventListener('click', () => {
  const i = document.getElementById('inp-pass');
  i.type = i.type === 'password' ? 'text' : 'password';
});

document.getElementById('go-register-btn').addEventListener('click', () => goView('view-register'));

/* ── Olvidaste tu contraseña ─────────────────────────────── */
const _forgotSection = document.getElementById('forgot-section');
const _loginForm     = document.getElementById('login-form');

document.getElementById('forgot-toggle-btn').addEventListener('click', () => {
  _loginForm.classList.add('hidden');
  _forgotSection.classList.remove('hidden');
  document.getElementById('forgot-email').value =
    document.getElementById('inp-email').value;
  document.getElementById('forgot-msg').classList.add('hidden');
});

document.getElementById('forgot-back-btn').addEventListener('click', () => {
  _forgotSection.classList.add('hidden');
  _loginForm.classList.remove('hidden');
});

document.getElementById('forgot-send-btn').addEventListener('click', async () => {
  const email = document.getElementById('forgot-email').value.trim();
  const msgEl = document.getElementById('forgot-msg');
  const btn   = document.getElementById('forgot-send-btn');

  if (!email) {
    _showForgotMsg('Ingresá tu email primero 📧', false);
    return;
  }

  btn.disabled = true;
  try {
    await auth.sendPasswordResetEmail(email);
    _showForgotMsg('¡Listo! Revisá tu casilla, te enviamos el link 💌', true);
    btn.textContent = 'Enviado ✓';
  } catch (err) {
    const msg = err.code === 'auth/user-not-found'
      ? 'No existe cuenta con ese email 🙈'
      : 'Error al enviar. Verificá el email e intentá de nuevo.';
    _showForgotMsg(msg, false);
    btn.disabled = false;
  }
});

function _showForgotMsg(text, isOk) {
  const el = document.getElementById('forgot-msg');
  el.textContent = text;
  el.style.background = isOk ? 'var(--mint-bg)' : '#FFF1F2';
  el.style.color      = isOk ? '#047857'         : '#E11D48';
  el.classList.remove('hidden');
}

/* ══════════════════════════════════════════════════════════
   REGISTRO
══════════════════════════════════════════════════════════ */
let _regRole = '';

document.querySelectorAll('#view-register .role-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('#view-register .role-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    _regRole = this.dataset.role;
  });
});

document.getElementById('reg-eye-btn')?.addEventListener('click', () => {
  const i = document.getElementById('reg-pass');
  i.type = i.type === 'password' ? 'text' : 'password';
});
document.getElementById('reg-eye-btn2')?.addEventListener('click', () => {
  const i = document.getElementById('reg-pass2');
  i.type = i.type === 'password' ? 'text' : 'password';
});

document.getElementById('go-login-btn').addEventListener('click', () => goView('view-login'));

document.getElementById('register-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name    = document.getElementById('reg-name').value.trim();
  const email   = document.getElementById('reg-email').value.trim().toLowerCase();
  const pass    = document.getElementById('reg-pass').value;
  const pass2   = document.getElementById('reg-pass2').value;
  const partner = document.getElementById('reg-partner').value.trim().toLowerCase();

  if (!name)            return _regErr('Ingresá tu nombre ✨');
  if (!_regRole)        return _regErr('Seleccioná tu rol: Ella o Él 💕');
  if (pass.length < 6)  return _regErr('La contraseña debe tener al menos 6 caracteres');
  if (pass !== pass2)   return _regErr('Las contraseñas no coinciden 🙈');
  if (email === partner) return _regErr('Tu email y el de tu pareja no pueden ser iguales 😅');

  document.getElementById('register-error').classList.add('hidden');
  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled = true;

  try {
    await _doRegister(name, email, pass, _regRole, partner);
    _updateDashHeader();
    goView('view-dashboard');
  } catch (err) {
    _regErr(_registerMsg(err.code) || err.message);
    btn.disabled = false;
  }
});

function _regErr(msg) {
  const el = document.getElementById('register-error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function _registerMsg(code) {
  return ({
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email 📧',
    'auth/invalid-email':        'El email no es válido 📧',
    'auth/weak-password':        'Contraseña débil, usá al menos 6 caracteres',
  })[code];
}

async function _doRegister(name, email, pass, role, partnerEmail) {
  _registering = true;
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, pass);
    const uid  = cred.user.uid;
    state.fbUser = cred.user;

    // Check if partner already registered
    const partnerQ = await db.collection('users')
      .where('email', '==', partnerEmail)
      .get();

    let coupleId = null;

    if (!partnerQ.empty) {
      const partnerDoc  = partnerQ.docs[0];
      const partnerData = partnerDoc.data();
      coupleId = partnerData.coupleId;

      if (coupleId) {
        // Partner already has a pending couple — activate it
        const coupleUpdate = { status: 'active' };
        if (role === 'ella') { coupleUpdate.ellaUid = uid; coupleUpdate.ellaEmail = email; }
        else                 { coupleUpdate.elUid   = uid; coupleUpdate.elEmail   = email; }
        await db.collection('couples').doc(coupleId).update(coupleUpdate);
        // Partner migrates their own surveys on next login (_loadProfile handles it)
      } else {
        // Partner exists but has no couple yet — create one linking both
        const coupleRef = db.collection('couples').doc();
        coupleId = coupleRef.id;
        const coupleData = { status: 'active', createdAt: firebase.firestore.FieldValue.serverTimestamp() };
        if (role === 'ella') {
          coupleData.ellaUid = uid; coupleData.ellaEmail = email;
          coupleData.elUid = partnerDoc.id; coupleData.elEmail = partnerEmail;
        } else {
          coupleData.elUid = uid; coupleData.elEmail = email;
          coupleData.ellaUid = partnerDoc.id; coupleData.ellaEmail = partnerEmail;
        }
        await coupleRef.set(coupleData);
      }

      // Best-effort: update partner's coupleId (already set in normal flow, skipped if permission fails)
      try { await db.collection('users').doc(partnerDoc.id).update({ coupleId }); } catch {}

    } else {
      // Partner not found yet — create pending couple
      const coupleRef  = db.collection('couples').doc();
      coupleId = coupleRef.id;
      const coupleData = { status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp() };
      if (role === 'ella') { coupleData.ellaUid = uid; coupleData.ellaEmail = email; coupleData.elEmail   = partnerEmail; }
      else                 { coupleData.elUid   = uid; coupleData.elEmail   = email; coupleData.ellaEmail = partnerEmail; }
      await coupleRef.set(coupleData);
    }

    // Create user document
    await db.collection('users').doc(uid).set({
      email, name, role, partnerEmail, coupleId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Set local state
    state.profile  = { email, name, role, partnerEmail, coupleId };
    state.coupleId = coupleId;
    state.isAdmin  = false;
    state.surveys  = null;

    if (coupleId) {
      const cSnap = await db.collection('couples').doc(coupleId).get();
      state.couple = cSnap.exists ? cSnap.data() : null;
    }
  } finally {
    _registering = false;
  }
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD HEADER & SESSION BUTTONS
══════════════════════════════════════════════════════════ */
function _updateDashHeader() {
  if (!state.profile) return;
  const roleLabel = state.profile.role === 'el' ? '💙 Él' : '💗 Ella';
  document.getElementById('dash-user-info').textContent =
    `${roleLabel} · ${state.profile.name}`;

  const banner = document.getElementById('couple-pending-banner');
  if (state.couple?.status === 'pending') banner.classList.remove('hidden');
  else banner.classList.add('hidden');
}

document.getElementById('dash-survey-btn')?.addEventListener('click', () => {
  state.currentArea = 0; state.answers = {};
  startSurvey();
});

document.getElementById('dash-logout-btn')?.addEventListener('click', async () => {
  if (_adminPrevCoupleId !== undefined) {
    _exitAdminCoupleView();
  } else {
    state.surveys = null;
    await auth.signOut();
  }
});

document.getElementById('admin-logout-btn')?.addEventListener('click', () => auth.signOut());

/* ══════════════════════════════════════════════════════════
   ENCUESTA
══════════════════════════════════════════════════════════ */
function startSurvey() {
  state.currentArea = 0; state.answers = {};
  renderArea(0);
  goView('view-survey');
}

function renderArea(areaIdx) {
  const area  = AREAS[areaIdx];
  const total = AREAS.length;
  const wrap  = document.querySelector('.survey-wrap');

  AREAS.forEach(a => wrap.classList.remove('area--' + a.id));
  wrap.classList.add('area--' + area.id);

  document.getElementById('progress-fill').style.width = (areaIdx / total * 100) + '%';

  const badge = document.getElementById('area-badge');
  badge.textContent   = area.badge;
  badge.style.background = area.bg;
  badge.style.color      = area.textColor;

  document.getElementById('step-counter').textContent  = `${areaIdx + 1} / ${total}`;
  document.getElementById('area-icon-big').textContent = area.icon;
  document.getElementById('area-title').textContent    = area.title;
  document.getElementById('area-desc').textContent     = area.desc;

  const container = document.getElementById('questions-list');
  container.innerHTML = '';

  const saved     = state.answers[area.id] || {};
  const questions = state.profile?.role === 'el' ? area.questionsEl : area.questionsElla;

  questions.forEach((qText, qIdx) => {
    const card = document.createElement('div');
    card.className = 'q-card';
    card.id = `qcard-${areaIdx}-${qIdx}`;
    card.innerHTML = `
      <div class="q-number">Pregunta ${qIdx + 1}</div>
      <p class="q-text">${qText}</p>
      <div class="rating-wrap">
        <div class="rating-row" id="rating-${areaIdx}-${qIdx}">
          ${[1,2,3,4,5,6,7,8,9,10].map(n => `
            <button type="button" class="rating-btn${saved[qIdx]===n?' selected':''}"
              style="color:${area.color}" data-val="${n}"
              onclick="selectRating(${areaIdx},${qIdx},${n})" aria-label="Valor ${n}">
              <span>${n}</span></button>`).join('')}
        </div>
        <div class="rating-labels"><span>Poco 😕</span><span>¡Mucho! 💕</span></div>
        <div class="rating-val${saved[qIdx]?' has-val':''}" id="rval-${areaIdx}-${qIdx}">
          ${saved[qIdx] ? RATING_LABELS[saved[qIdx]] : ''}</div>
      </div>`;
    container.appendChild(card);
  });

  document.getElementById('btn-prev').style.visibility = areaIdx === 0 ? 'hidden' : 'visible';
  document.getElementById('btn-next').textContent = areaIdx === total - 1 ? 'Enviar encuesta 💕' : 'Siguiente →';
}

function selectRating(areaIdx, qIdx, val) {
  const area = AREAS[areaIdx];
  if (!state.answers[area.id]) state.answers[area.id] = {};
  state.answers[area.id][qIdx] = val;

  document.getElementById(`rating-${areaIdx}-${qIdx}`).querySelectorAll('.rating-btn')
    .forEach(btn => btn.classList.toggle('selected', +btn.dataset.val === val));

  const valEl = document.getElementById(`rval-${areaIdx}-${qIdx}`);
  valEl.textContent = RATING_LABELS[val];
  valEl.classList.add('has-val');
  document.getElementById(`qcard-${areaIdx}-${qIdx}`).classList.remove('unanswered');
}

function nextArea() {
  const area      = AREAS[state.currentArea];
  const saved     = state.answers[area.id] || {};
  const questions = state.profile?.role === 'el' ? area.questionsEl : area.questionsElla;
  let allOk = true;

  questions.forEach((_, qIdx) => {
    if (saved[qIdx] === undefined) {
      allOk = false;
      const card = document.getElementById(`qcard-${state.currentArea}-${qIdx}`);
      card.classList.remove('unanswered'); void card.offsetWidth; card.classList.add('unanswered');
    }
  });

  if (!allOk) {
    document.querySelector('.q-card.unanswered')?.scrollIntoView({ behavior:'smooth', block:'center' });
    return;
  }

  if (state.currentArea < AREAS.length - 1) {
    state.currentArea++;
    renderArea(state.currentArea);
    window.scrollTo({ top:0, behavior:'smooth' });
  } else {
    submitSurvey();
  }
}

function prevArea() {
  if (state.currentArea > 0) {
    state.currentArea--;
    renderArea(state.currentArea);
    window.scrollTo({ top:0, behavior:'smooth' });
  }
}

/* ══════════════════════════════════════════════════════════
   SUBMIT
══════════════════════════════════════════════════════════ */
async function submitSurvey() {
  const areaScores = {};
  AREAS.forEach(area => {
    const vals = Object.values(state.answers[area.id] || {});
    areaScores[area.id] = vals.length
      ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : 0;
  });
  const overall = +(Object.values(areaScores).reduce((a, b) => a + b, 0) / AREAS.length).toFixed(2);

  const now = new Date();
  const submission = {
    dateISO:   now.toISOString().split('T')[0],
    date:      now.toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' }),
    name:      state.profile.name,
    role:      state.profile.role,
    uid:       state.fbUser.uid,
    answers:   JSON.parse(JSON.stringify(state.answers)),
    areaScores, overall,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  const btn = document.getElementById('btn-next');
  btn.disabled = true;

  try {
    const col = state.coupleId
      ? db.collection('couples').doc(state.coupleId).collection('surveys')
      : db.collection('users').doc(state.fbUser.uid).collection('surveys');
    await col.add(submission);
    state.surveys = null;
    showThanks(submission);
  } catch {
    alert('Error al guardar. Verificá tu conexión e intentá de nuevo.');
    btn.disabled = false;
  }
}

/* ══════════════════════════════════════════════════════════
   THANKS
══════════════════════════════════════════════════════════ */
function showThanks(submission) {
  document.getElementById('thanks-name').textContent = state.profile.name;
  document.getElementById('overall-val').textContent = submission.overall;
  document.getElementById('area-scores').innerHTML = AREAS.map(area => `
    <div class="score-mini-card" style="border-top:3px solid ${area.color}">
      <span class="score-mini-icon">${area.icon}</span>
      <span class="score-mini-name">${area.title}</span>
      <span class="score-mini-val" style="color:${area.textColor}">${submission.areaScores[area.id]}</span>
    </div>`).join('');
  goView('view-thanks');
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════ */
async function _loadSurveys() {
  if (state.surveys !== null) return state.surveys;
  if (!state.fbUser) return [];

  let snap;
  if (state.coupleId) {
    snap = await db.collection('couples').doc(state.coupleId)
      .collection('surveys').orderBy('createdAt', 'asc').get();
  } else {
    snap = await db.collection('users').doc(state.fbUser.uid)
      .collection('surveys').orderBy('createdAt', 'asc').get();
  }

  state.surveys = snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id, ...data,
      dateISO: data.dateISO || data.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0] || '',
      date:    data.date    || data.dateISO || '',
    };
  });
  return state.surveys;
}

async function renderDashboard() {
  if (!state.fbUser) return;
  _updateDashHeader();

  let all;
  try { all = await _loadSurveys(); }
  catch { all = []; }

  if (all.length === 0) {
    document.getElementById('dash-empty').classList.remove('hidden');
    document.getElementById('dash-content').classList.add('hidden');
    return;
  }
  document.getElementById('dash-empty').classList.add('hidden');
  document.getElementById('dash-content').classList.remove('hidden');
  renderHistTable(all);
  syncFilterButtons();
  rerenderDashboardCharts(all);
}

function applyDashFilter(changes) {
  if (changes.area !== undefined) dashFilter.area = changes.area;
  syncFilterButtons();
  _loadSurveys().then(all => rerenderDashboardCharts(all));
}

function toggleRoleFilter(role) {
  if (dashFilter.roles.includes(role)) {
    if (dashFilter.roles.length > 1) dashFilter.roles = dashFilter.roles.filter(r => r !== role);
  } else {
    dashFilter.roles = [...dashFilter.roles, role];
  }
  syncFilterButtons();
  _loadSurveys().then(all => rerenderDashboardCharts(all));
}

function syncFilterButtons() {
  document.querySelectorAll('#filter-area .filter-btn')
    .forEach(btn => btn.classList.toggle('active', btn.dataset.area === dashFilter.area));
  document.querySelectorAll('#filter-role .filter-btn')
    .forEach(btn => btn.classList.toggle('active', dashFilter.roles.includes(btn.dataset.role)));
}

function rerenderDashboardCharts(all) {
  ['chart-line','chart-radar'].forEach(id => {
    if (state.charts[id]) { state.charts[id].destroy(); delete state.charts[id]; }
  });

  const roles    = dashFilter.roles;
  const area     = dashFilter.area;
  const byRoles  = all.filter(s => roles.includes(s.role ?? 'ella'));
  if (byRoles.length === 0) return;

  const last     = byRoles[byRoles.length - 1];
  const areaObj  = AREAS.find(a => a.id === area);
  const areaName = area === 'global' ? 'Global' : (areaObj?.title ?? area);
  const rolesLabel = roles.length === 2 ? '💗 Ella  &  💙 Él'
    : roles[0] === 'el' ? '💙 Él' : '💗 Ella';

  document.getElementById('chart-line-label').textContent = `El pulso de nuestra relación — ${areaName}`;
  document.getElementById('dash-last-date').textContent   = `${rolesLabel} · Última: ${last.date} — ${last.name}`;

  renderAreaCards(last, byRoles);
  renderRadarChart(last);
  renderLineChartFiltered(all, roles, area);
}

function renderAreaCards(last, submissions) {
  document.getElementById('dash-area-cards').innerHTML = AREAS.map(area => {
    const score = last.areaScores[area.id] ?? '-';
    let trend = '';
    if (submissions.length >= 2) {
      const prev = submissions[submissions.length - 2];
      const diff = (last.areaScores[area.id] - (prev.areaScores[area.id] || 0)).toFixed(1);
      trend = diff > 0 ? `↑ +${diff} vs. anterior` : diff < 0 ? `↓ ${diff} vs. anterior` : `= igual que anterior`;
    }
    return `
      <div class="dash-area-card" style="background:${area.bg}">
        <span class="dac-icon">${area.icon}</span>
        <div class="dac-info">
          <div class="dac-name"  style="color:${area.textColor}">${area.title}</div>
          <div class="dac-score" style="color:${area.textColor}">${score}</div>
          ${trend ? `<div class="dac-trend" style="color:${area.textColor}">${trend}</div>` : ''}
        </div>
      </div>`;
  }).join('');
}

function getScoreForArea(s, area) {
  return area === 'global' ? s.overall : (s.areaScores[area] ?? null);
}

function lineChartOptions() {
  return {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode:'index', intersect:false },
    plugins: {
      legend: { position:'bottom', labels:{ font:{family:'Nunito',size:12}, color:'#9D174D', padding:16, boxWidth:14, usePointStyle:true } },
      tooltip: {
        backgroundColor:'#FDF2F8', titleColor:'#831843', bodyColor:'#9D174D',
        borderColor:'#FBCFE8', borderWidth:1,
        callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}` }
      }
    },
    scales: {
      x: {
        grid: { color:'#FDF2F8' },
        ticks: {
          font:{family:'Nunito',size:10}, color:'#C4859E', maxRotation:35,
          callback: function(val) {
            const label = this.getLabelForValue(val);
            if (!label) return val;
            const [,mm,dd] = label.split('-');
            const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
            return `${parseInt(dd)} ${months[parseInt(mm)-1]}`;
          }
        }
      },
      y: { min:0, max:10, grid:{color:'#FDF2F8'}, ticks:{font:{family:'Nunito',size:10}, color:'#C4859E', stepSize:2} }
    }
  };
}

function renderLineChartFiltered(all, roles, area) {
  const areaName = area === 'global' ? 'Global' : AREAS.find(a => a.id === area)?.title ?? area;
  const ROLE_CFG = {
    ella: { label:'💗 Ella', color:'#F472B6', fill:'rgba(244,114,182,0.12)' },
    el:   { label:'💙 Él',   color:'#60A5FA', fill:'rgba(96,165,250,0.12)'  },
  };

  let labels, datasets = [];

  if (roles.length === 2) {
    labels = [...new Set(all.map(s => s.dateISO))].sort();
    roles.forEach(role => {
      const subs = all.filter(s => (s.role ?? 'ella') === role);
      const cfg  = ROLE_CFG[role];
      datasets.push({
        label: `${cfg.label} — ${areaName}`,
        data:  labels.map(d => { const m = subs.find(s => s.dateISO === d); return m ? getScoreForArea(m, area) : null; }),
        borderColor:cfg.color, backgroundColor:cfg.fill,
        borderWidth:2.5, tension:0.35, fill:false, spanGaps:true,
        pointRadius:5, pointHoverRadius:8, pointBackgroundColor:cfg.color
      });
    });
  } else {
    const role = roles[0];
    const subs = all.filter(s => (s.role ?? 'ella') === role);
    const cfg  = ROLE_CFG[role];
    labels = subs.map(s => s.dateISO);
    datasets.push({
      label: `${cfg.label} — ${areaName}`,
      data:  subs.map(s => getScoreForArea(s, area)),
      borderColor:cfg.color, backgroundColor:cfg.fill,
      borderWidth:3, tension:0.35, fill:true, spanGaps:false,
      pointRadius:5, pointHoverRadius:8, pointBackgroundColor:cfg.color
    });
  }

  const ctx = document.getElementById('chart-line').getContext('2d');
  state.charts['chart-line'] = new Chart(ctx, { type:'line', data:{labels,datasets}, options:lineChartOptions() });
}

function renderRadarChart(last) {
  const ctx = document.getElementById('chart-radar').getContext('2d');
  state.charts['chart-radar'] = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: AREAS.map(a => a.title),
      datasets: [{
        label: `${last.name} · ${last.dateISO}`,
        data:  AREAS.map(a => last.areaScores[a.id] ?? 0),
        borderColor:'#F472B6', backgroundColor:'rgba(244,114,182,0.2)', borderWidth:2.5,
        pointBackgroundColor: AREAS.map(a => a.color), pointRadius:5, pointHoverRadius:7,
      }]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins: { legend:{ labels:{ font:{family:'Nunito',size:11}, color:'#9D174D' } } },
      scales: {
        r: {
          min:0, max:10,
          ticks: { stepSize:2, font:{family:'Nunito',size:9}, color:'#C4859E', backdropColor:'transparent' },
          grid:{ color:'#FBCFE8' }, angleLines:{ color:'#FBCFE8' },
          pointLabels:{ font:{family:'Nunito',size:11}, color:'#9D174D' }
        }
      }
    }
  });
}

function renderHistTable(submissions) {
  const tbody = document.getElementById('hist-body');
  tbody.innerHTML = '';
  const scoreColor = v => v >= 8 ? '#047857' : v >= 6 ? '#B45309' : '#BE123C';
  const pill = (v, color) => `<span class="score-pill" style="background:${color}33;color:${scoreColor(v)}">${v}</span>`;

  [...submissions].reverse().forEach(s => {
    const roleTag = s.role === 'el'
      ? '<span style="color:#1D4ED8;font-weight:700">💙 Él</span>'
      : '<span style="color:#BE123C;font-weight:700">💗 Ella</span>';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${roleTag}</td>
      <td>${s.dateISO}</td>
      <td>${s.name}</td>
      <td>${pill(s.areaScores.emocional,   AREAS[0].color)}</td>
      <td>${pill(s.areaScores.fisico,      AREAS[1].color)}</td>
      <td>${pill(s.areaScores.crecimiento, AREAS[2].color)}</td>
      <td>${pill(s.areaScores.social,      AREAS[3].color)}</td>
      <td>${pill(s.overall, '#F472B6')}</td>`;
    tbody.appendChild(tr);
  });
}

/* ══════════════════════════════════════════════════════════
   EXPORT / IMPORT JSON
══════════════════════════════════════════════════════════ */
async function exportJSON() {
  const surveys = await _loadSurveys();
  if (surveys.length === 0) { alert('No hay datos para exportar.'); return; }
  const blob = new Blob(
    [JSON.stringify({ app:'ÑawzApp', exportedAt:new Date().toISOString(), submissions:surveys }, null, 2)],
    { type:'application/json' }
  );
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `nawzapp_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const parsed   = JSON.parse(e.target.result);
      const incoming = parsed.submissions || (Array.isArray(parsed) ? parsed : null);
      if (!incoming) throw new Error('Formato inválido');

      const existing    = await _loadSurveys();
      const existingIds = new Set(existing.map(s => s.id));
      const toImport    = incoming.filter(s => !existingIds.has(s.id));
      if (toImport.length === 0) { alert('No hay datos nuevos para importar.'); return; }

      const col   = _surveysCol();
      const batch = db.batch();
      toImport.forEach(s => {
        const { id, createdAt, ...data } = s;
        batch.set(col.doc(id || col.doc().id), {
          ...data, importedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      state.surveys = null;
      alert(`✅ Importados ${toImport.length} registros.`);
      renderDashboard();
    } catch { alert('Error al importar: archivo JSON inválido.'); }
  };
  reader.readAsText(file);
  event.target.value = '';
}

async function clearAllData() {
  if (!confirm('¿Borrar TODAS las encuestas guardadas?\nEsta acción no se puede deshacer. 🙈')) return;
  const surveys = await _loadSurveys();
  const col     = _surveysCol();
  const batch   = db.batch();
  surveys.forEach(s => batch.delete(col.doc(s.id)));
  await batch.commit();
  state.surveys = null;
  renderDashboard();
}

function _surveysCol() {
  return state.coupleId
    ? db.collection('couples').doc(state.coupleId).collection('surveys')
    : db.collection('users').doc(state.fbUser.uid).collection('surveys');
}

/* ══════════════════════════════════════════════════════════
   IMPORTAR DESDE LOCALSTORAGE
══════════════════════════════════════════════════════════ */
function openImportLocalModal() {
  const raw  = localStorage.getItem('nawzapp_submissions');
  const data = raw ? JSON.parse(raw) : [];

  if (data.length === 0) {
    alert('No hay encuestas guardadas en este dispositivo.');
    return;
  }

  document.getElementById('local-count').textContent = data.length;
  document.getElementById('import-error').classList.add('hidden');
  _renderLocalList(data);
  document.getElementById('modal-import').classList.remove('hidden');
}

function _renderLocalList(surveys) {
  const list = document.getElementById('local-surveys-list');
  list.innerHTML = surveys.map((s, i) => `
    <label class="local-survey-item" id="lsi-${i}">
      <input type="checkbox" data-idx="${i}" checked>
      <div class="local-survey-info">
        <strong>${s.role === 'el' ? '💙 Él' : '💗 Ella'} · ${s.name}</strong>
        <span>${s.dateISO} · Global: ${s.overall}</span>
      </div>
    </label>`).join('');

  list.querySelectorAll('.local-survey-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.tagName === 'INPUT') return;
      const cb = item.querySelector('input');
      cb.checked = !cb.checked;
      item.classList.toggle('selected', cb.checked);
    });
    const cb = item.querySelector('input');
    item.classList.toggle('selected', cb.checked);
    cb.addEventListener('change', () => item.classList.toggle('selected', cb.checked));
  });
}

document.getElementById('modal-cancel-btn')?.addEventListener('click', () => {
  document.getElementById('modal-import').classList.add('hidden');
});

document.getElementById('modal-confirm-btn')?.addEventListener('click', async () => {
  const raw  = localStorage.getItem('nawzapp_submissions');
  const data = raw ? JSON.parse(raw) : [];
  const selected = [...document.querySelectorAll('#local-surveys-list input:checked')]
    .map(cb => data[+cb.dataset.idx])
    .filter(Boolean);

  if (selected.length === 0) {
    const errEl = document.getElementById('import-error');
    errEl.textContent = 'Seleccioná al menos una encuesta para importar.';
    errEl.classList.remove('hidden');
    return;
  }

  document.getElementById('modal-confirm-btn').disabled = true;
  try {
    const existing    = await _loadSurveys();
    const existingIds = new Set(existing.map(s => s.id));
    const toImport    = selected.filter(s => !existingIds.has(s.id));

    if (toImport.length > 0) {
      const col   = _surveysCol();
      const batch = db.batch();
      toImport.forEach(s => {
        const { id, createdAt, ...data } = s;
        batch.set(col.doc(id || col.doc().id), {
          ...data, importedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      state.surveys = null;
    }

    document.getElementById('modal-import').classList.add('hidden');
    alert(`✅ Importadas ${toImport.length} encuesta${toImport.length !== 1 ? 's' : ''} nuevas.`);
    if (document.getElementById('view-dashboard').classList.contains('active')) {
      renderDashboard();
    }
  } catch {
    const errEl = document.getElementById('import-error');
    errEl.textContent = 'Error al importar. Verificá tu conexión.';
    errEl.classList.remove('hidden');
  }
  document.getElementById('modal-confirm-btn').disabled = false;
});

/* ══════════════════════════════════════════════════════════
   ADMIN
══════════════════════════════════════════════════════════ */
async function loadAdminPanel() {
  document.getElementById('admin-couples-list').innerHTML =
    '<div class="admin-loading">Cargando parejas… 🌸</div>';

  const couplesSnap = await db.collection('couples').get();
  const couples = couplesSnap.docs.map(d => ({ id:d.id, ...d.data() }));

  // Survey counts (parallel)
  const counts = await Promise.all(
    couples.map(async c => {
      const s = await db.collection('couples').doc(c.id).collection('surveys').get();
      return { id:c.id, count:s.size };
    })
  );
  const countMap = Object.fromEntries(counts.map(x => [x.id, x.count]));

  // Stats
  const active  = couples.filter(c => c.status === 'active').length;
  const pending = couples.filter(c => c.status === 'pending').length;
  const totalS  = Object.values(countMap).reduce((a, b) => a + b, 0);
  document.getElementById('stat-total').textContent   = couples.length;
  document.getElementById('stat-active').textContent  = active;
  document.getElementById('stat-pending').textContent = pending;
  document.getElementById('stat-surveys').textContent = totalS;

  const list = document.getElementById('admin-couples-list');
  if (couples.length === 0) {
    list.innerHTML = '<div class="admin-loading">No hay parejas registradas aún 🌸</div>';
    return;
  }

  list.innerHTML = couples.map(c => _renderCoupleCard(c, countMap[c.id] || 0)).join('');

  // Toggle expand
  list.querySelectorAll('.couple-card-head').forEach(head =>
    head.addEventListener('click', () => head.closest('.couple-card').classList.toggle('open'))
  );

  // Delete buttons
  list.querySelectorAll('.btn-delete-couple').forEach(btn =>
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar esta pareja y todas sus encuestas? No se puede deshacer.')) return;
      await _deleteCouple(btn.dataset.coupleId);
      loadAdminPanel();
    })
  );

  // View surveys buttons
  list.querySelectorAll('.btn-view-couple').forEach(btn =>
    btn.addEventListener('click', () => adminViewCoupleDashboard(btn.dataset.coupleId))
  );

  // Admin's own localStorage import button
  document.getElementById('admin-import-local-btn')?.addEventListener('click', openImportLocalModal);
}

function _renderCoupleCard(couple, surveyCount) {
  const isActive   = couple.status === 'active';
  const statusLbl  = isActive ? 'Activa' : 'Pendiente';
  const statusCls  = isActive ? 'status--active' : 'status--pending';
  const ellaLine   = couple.ellaEmail
    ? `<div class="couple-member-row"><span class="role-dot">💗</span><span class="couple-member-email">${couple.ellaEmail}</span></div>` : '';
  const elLine     = couple.elEmail
    ? `<div class="couple-member-row"><span class="role-dot">💙</span><span class="couple-member-email">${couple.elEmail}</span></div>` : '';
  const createdDate = couple.createdAt?.toDate
    ? couple.createdAt.toDate().toLocaleDateString('es-ES') : '—';

  return `
    <div class="couple-card" data-couple-id="${couple.id}">
      <div class="couple-card-head">
        <div class="couple-members">${ellaLine}${elLine}</div>
        <span class="couple-status-badge ${statusCls}">${statusLbl}</span>
        <span class="couple-chevron">▼</span>
      </div>
      <div class="couple-card-body">
        <div class="couple-meta">
          <span class="couple-meta-pill">📋 ${surveyCount} encuesta${surveyCount !== 1 ? 's' : ''}</span>
          <span class="couple-meta-pill">📅 ${createdDate}</span>
          <span class="couple-meta-pill" style="font-family:monospace;font-size:.65rem">${couple.id.slice(0,12)}…</span>
        </div>
        <div class="couple-actions">
          <button class="btn btn-outline btn-sm btn-view-couple" data-couple-id="${couple.id}">📊 Ver encuestas</button>
          <button class="btn btn-ghost-danger btn-sm btn-delete-couple" data-couple-id="${couple.id}">🗑 Eliminar</button>
        </div>
      </div>
    </div>`;
}

async function _deleteCouple(coupleId) {
  const surveysSnap = await db.collection('couples').doc(coupleId).collection('surveys').get();
  const b1 = db.batch();
  surveysSnap.docs.forEach(d => b1.delete(d.ref));
  await b1.commit();

  const cSnap = await db.collection('couples').doc(coupleId).get();
  if (cSnap.exists) {
    const c   = cSnap.data();
    const b2  = db.batch();
    [c.ellaUid, c.elUid].filter(Boolean).forEach(uid =>
      b2.update(db.collection('users').doc(uid), { coupleId: null })
    );
    await b2.commit();
  }
  await db.collection('couples').doc(coupleId).delete();
}

function adminViewCoupleDashboard(coupleId) {
  _adminPrevCoupleId = state.coupleId;
  state.coupleId     = coupleId;
  state.surveys      = null;

  document.getElementById('dash-survey-btn').classList.add('hidden');
  const logoutBtn = document.getElementById('dash-logout-btn');
  logoutBtn.textContent = '← Admin';

  goView('view-dashboard');
}

function _exitAdminCoupleView() {
  state.coupleId     = _adminPrevCoupleId;
  state.surveys      = null;
  _adminPrevCoupleId = undefined;

  document.getElementById('dash-survey-btn').classList.remove('hidden');
  document.getElementById('dash-logout-btn').textContent = 'Salir';

  goView('view-admin');
  loadAdminPanel();
}
