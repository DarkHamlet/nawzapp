# ÑawzApp — Registro de conversación completa
**Fecha:** 19 de abril de 2026  
**Participantes:** Usuario (esposo) · Claude Code (Sonnet 4.6)

---

## Solicitud original

Crear una WebApp simple llamada ÑawzApp para medir métricas de performance de la relación de pareja. La esposa interactúa con una encuesta que mide del 1 al 10. Estética pastel femenina.

---

## Decisiones clave tomadas en la conversación

| Tema | Decisión |
|---|---|
| Almacenamiento | localStorage + export/import JSON |
| Deploy | Netlify (estático, sin backend) |
| Autenticación | Contraseña simple `teamogat@` en pantalla de inicio |
| Email | Eliminado — solo nombre |
| Frecuencia | Mensual |
| Preguntas | 5 por área × 4 áreas = 20 preguntas |
| Stack | HTML + CSS + JS puro · Chart.js CDN |
| Fuentes | Comfortaa (títulos) + Nunito (cuerpo) |
| Responsivo | Mobile-first (Xiaomi) + desktop 2 columnas |

---

## Estructura de archivos

```
nawzapp/
├── index.html          # App completa: 4 vistas (login, encuesta, gracias, dashboard)
├── style.css           # Diseño pastel femenino, mobile-first, responsive
├── app.js              # Toda la lógica: login, encuesta, storage, dashboard, charts
├── decorations.js      # Elementos voladores y fondo decorativo
├── netlify.toml        # Config de deploy
├── CONVERSACION.md     # Este archivo
└── images/
    ├── favicon.png
    ├── BadFont.png
    └── FiltroRolesBad.png
```

---

## 4 Áreas psicológicas · 20 preguntas (5 por área)

### 🥰 Área 1 — Vínculo Emocional
*(Sternberg — Intimidad · Apego seguro)*
1. ¿Qué tan contenta/contento y plena/pleno te sientes con la relación en general?
2. ¿Qué tan escuchada/escuchado y comprendida/comprendido te sientes por él/ella?
3. ¿Qué tan valorada/valorado y apreciada/apreciado te sientes cada día?
4. ¿Qué tan estable y segura sientes la relación emocionalmente?
5. ¿Qué tan profunda y genuina sientes la conexión emocional entre ustedes?

### 🫂 Área 2 — Seguridad & Bienestar Físico
*(Maslow — Seguridad · Lenguajes del amor — Toque físico)*
1. ¿Qué tan segura/comprometido físicamente te sientes con él/ella a tu lado?
2. ¿Qué tan satisfecha/satisfecho estás con el afecto físico y la intimidad?
3. ¿Qué tan cuidada/cuidado te sientes en tu bienestar y salud por él/ella?
4. ¿Qué tan cómoda/cómodo y relajada/relajado te sientes en su presencia física?
5. ¿Qué tan satisfecha/satisfecho estás con los gestos y detalles de amor?

### 🌱 Área 3 — Crecimiento & Desafío Personal
*(Teoría de la Autodeterminación — Autonomía · Autorrealización)*
1. ¿Qué tan desafiada/desafiado intelectualmente te hace sentir él/ella?
2. ¿Qué tan apoyada/apoyado te sientes en tus metas y sueños?
3. ¿Qué tan motivada/motivado te sientes a crecer gracias a él/ella?
4. ¿Qué tan libre te sientes de ser tú misma/mismo dentro de la relación?
5. ¿Qué tan orgullosa/orgulloso te sientes de la persona que eres junto a él/ella?

### 🌟 Área 4 — Diversión & Conexión
*(Gottman — Significado compartido · Amistad)*
1. ¿Qué tan divertida/divertido y alegre te sientes a su lado?
2. ¿Qué tan romántica y especial sientes la relación?
3. ¿Qué tan satisfecha/satisfecho estás con cómo se comunican?
4. ¿Qué tan bien funcionan como equipo en el día a día?
5. ¿Qué tan ilusionada/ilusionado te sientes con el futuro que están construyendo juntos?

---

## Funcionalidades implementadas

### Login
- Selector de rol: 💗 Ella / 💙 Él (toggle obligatorio)
- Campo de nombre
- Contraseña: `teamogat@`
- Enlace al dashboard en el footer

### Encuesta
- 4 pantallas (una por área)
- 5 preguntas por área con botones de rating 1–10
- Preguntas adaptadas según género (Ella/Él)
- Barra de progreso
- Validación: no avanza sin responder todo

### Pantalla de Gracias
- Puntaje por área
- Puntaje global en burbuja
- Botones: Nueva encuesta / Ver Dashboard

### Dashboard
- **Filtros cruzados Área × Rol:**
  - Área: Global | 🥰 | 🫂 | 🌱 | 🌟
  - Rol: 💗 Ella y 💙 Él como **toggles independientes** (ambos pueden estar activos)
- Cards de área con score y tendencia vs. encuesta anterior
- **Gráfica "El pulso de nuestra relación":** línea(s) de evolución con fecha en eje X
- **Gráfica Radar:** comparativa por área de la última encuesta
- **Tabla historial:** columna Quién (💗/💙), fecha, nombre, scores por área
- Exportar JSON / Importar JSON / Borrar todo

---

## Decoraciones animadas

**Fondo estático:** girasoles 🌻, flores 🌼🌸, libros 📖📚 con animación CSS (swaying/floating)

**Elementos voladores** (cruzan la pantalla de lado a lado):

| Elemento | Velocidad | Frecuencia |
|---|---|---|
| 🦋 Mariposa | 8–13 s | Media |
| 🌻🌼🌸 Flores | 9–14 s | Media |
| 💗🩷💕 Corazones | 6–10 s | Alta |
| 📖📚 Libros | 10–16 s | Baja |
| 🐱🐈 Gatitos | 22–38 s (muy lento) | Muy baja |

---

## Historial de cambios principales

| Commit | Descripción |
|---|---|
| Initial commit | App base: login, encuesta 4 áreas, gracias, dashboard |
| Add .gitignore | — |
| Add animated background | Fondo con flores, libros, mariposas |
| Fix butterfly animation | Corrección posicionamiento CSS variables |
| Add flowers and books back | Refactor sin CSS variables en inline style |
| Add favicon | images/favicon.png |
| Switch to Comfortaa + Nunito | Primer cambio de fuentes |
| Switch to Pacifico + Quicksand | Segundo cambio (revertido) |
| Revert to Comfortaa + Nunito | Fuentes finales |
| Increase line chart height | 420px para mejor legibilidad móvil |
| Expand to 5 questions per area | 20 preguntas totales con base psicológica |
| Update area icons | 💗→🥰 🌼→🫂 ✨→🌱 💜→🌟 |
| Full desktop responsive layout | Login 2 columnas, dashboard 1140px, charts lado a lado |
| Fix JS/CSS cache headers | `must-revalidate` en netlify.toml |
| Add gender-aware questions | Preguntas duales Ella/Él |
| Fix nextArea crash | `area.questions` → `questionsElla/questionsEl` |
| Add role filter to dashboard | Filtro por rol en gráfica |
| Redesign dashboard filters | Filtros cruzados Área × Rol |
| Role filters as independent toggles | Ella y Él activables simultáneamente |
| Fix dual-role chart spanGaps | `spanGaps: true` para fechas distintas |
| Add flying sunflowers, hearts, books, cats | Sistema de vuelo generalizado |
| Revert to date-only dateISO | Fecha sin hora, eje X legible `19 abr` |
| Change password, remove email | Pass: `teamogat@`, sin campo email |

---

## Notas técnicas

- **Cross-device:** datos en localStorage. Usar Exportar/Importar JSON para sincronizar entre dispositivos.
- **Sin backend:** app 100% estática. Funciona offline tras la primera carga.
- **Cache:** `netlify.toml` usa `must-revalidate` para que los cambios se reflejen inmediatamente. Los scripts tienen `?v=6` para invalidar caché existente.
- **Agregar preguntas:** editar array `AREAS` en `app.js` — campos `questionsElla` y `questionsEl`.
- **Agregar elementos voladores:** editar array `FLYING_CONFIGS` en `decorations.js`.
- **Dashboard:** accesible desde el footer del login o navegando a `#dashboard`.
- **dateISO:** formato `YYYY-MM-DD`. Dos encuestas del mismo día para el mismo rol se condensan en el gráfico (se muestra la primera del día).

---

## Deploy en Netlify

Conectado al repositorio GitHub `darkhamlet/nawzapp`. Cada `git push` a `main` redespliega automáticamente.

URL: **https://nawzapp.netlify.app**

---

*Generado con Claude Code · ÑawzApp v2.0 · 19 abril 2026*
