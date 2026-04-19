# ÑawzApp — Registro de conversación inicial
**Fecha:** 18 de abril de 2026  
**Participantes:** Usuario (esposo) · Claude Code (Sonnet 4.6)

---

## Solicitud original

> Quisiera que me ayudes a crear una WebApp muy simple llamada 'ÑawzApp' para alojar métricas de performance de la relación con mi esposa, y con la cuál ella pueda interactuar tipo Encuesta, que mida de 1 (poco, bajo) a 10 (mucho, alto), cosas como:
> 1. Qué tan contenta te sientes con la relación?
> 2. Qué tan segura físicamente te sientes? (el esposo puede defenderte?)
> 3. Qué tan divertida te sientes? (el esposo te hace reír?)
> 4. Qué tan desafiada te sientes? (el esposo te pone desafíos?)
>
> La estética debe ser en colores pasteles muy femeninos.
> Debe ser una app muy simple, casi una web con la que pueda interactuar.

---

## Preguntas de Claude y respuestas del usuario

| Pregunta | Respuesta |
|---|---|
| ¿Guardar historial o solo resultado inmediato? | Ver historial, guardar en texto simple |
| ¿Dashboard para ver resultados acumulados? | Sí |
| ¿Frecuencia de llenado? | Mensualmente |
| ¿Dónde se aloja? | Netlify, optimizado para celular Xiaomi |
| ¿Necesita autenticación? | No, solo nombre + mail + clave `teamogato` en pantalla de inicio |
| ¿Agregar preguntas adicionales clasificadas por psicología? | Sí, en 4 áreas psicológicas |

---

## Decisiones de diseño

- **Stack:** HTML + CSS + JS puro. Sin framework. Chart.js (CDN) para gráficas.
- **Almacenamiento:** `localStorage` como JSON. Clave: `nawzapp_submissions`.
- **Portabilidad:** Botones de exportar e importar JSON para compartir datos entre dispositivos.
- **Paleta:** Pasteles femeninos — rosa, lavanda, melocotón, menta.
- **Fuentes:** Playfair Display (títulos) + Poppins (cuerpo) vía Google Fonts.
- **Rating UI:** Fila de 10 botones circulares con grid CSS `repeat(10, 1fr)` — se adapta a cualquier ancho de pantalla.

---

## Áreas psicológicas y preguntas (14 en total)

### 💗 Área 1 — Vínculo Emocional
*(Psicología del apego y bienestar afectivo)*
1. ¿Qué tan contenta te sientes con la relación en general?
2. ¿Qué tan escuchada y comprendida te sientes por él?
3. ¿Qué tan valorada y apreciada te sientes cada día?
4. ¿Qué tan estable y segura sientes la relación emocionalmente?

### 🌼 Área 2 — Seguridad & Bienestar Físico
*(Teoría de necesidades de Maslow — seguridad y fisiológicas)*
5. ¿Qué tan segura físicamente te sientes con él a tu lado?
6. ¿Qué tan satisfecha estás con el afecto físico y la intimidad?
7. ¿Qué tan cuidada te sientes en tu bienestar y salud por él?

### ✨ Área 3 — Crecimiento & Desafío Personal
*(Psicología positiva — autorrealización, flujo)*
8. ¿Qué tan desafiada intelectualmente te hace sentir él?
9. ¿Qué tan apoyada te sientes en tus metas y sueños?
10. ¿Qué tan motivada te sientes a crecer gracias a él?

### 💜 Área 4 — Diversión & Conexión Social
*(Teoría de la inversión en relaciones — satisfacción y compromiso)*
11. ¿Qué tan divertida y alegre te sientes a su lado?
12. ¿Qué tan romántica y especial sientes la relación?
13. ¿Qué tan satisfecha estás con cómo se comunican?
14. ¿Qué tan bien funcionan como equipo en el día a día?

---

## Archivos generados

```
nawzapp/
├── index.html       # App completa: 4 vistas (login, encuesta, gracias, dashboard)
├── style.css        # Diseño pastel femenino, mobile-first, responsive Xiaomi
├── app.js           # Toda la lógica: login, encuesta, storage, dashboard, charts
└── netlify.toml     # Configuración de deploy para Netlify
```

---

## Flujo de la aplicación

```
[Login]
  Nombre + Email + Contraseña (teamogato)
        ↓
[Encuesta]
  Área 1 → Área 2 → Área 3 → Área 4
  (4 pantallas, botones 1-10 por pregunta)
        ↓
[Pantalla de Gracias]
  Puntaje por área + Puntaje global
        ↓
[Dashboard]  ← también accesible desde el footer del login
  • Cards con score por área (+ tendencia vs. anterior)
  • Gráfica de línea: evolución del puntaje global
  • Gráfica de radar: comparativa por área (última encuesta)
  • Tabla histórica de todas las encuestas
  • Exportar JSON · Importar JSON · Borrar todo
```

---

## Cómo hacer deploy en Netlify

1. Ir a [netlify.com](https://netlify.com) → Iniciar sesión
2. Dashboard → **Add new site** → **Deploy manually**
3. Arrastrar la carpeta `nawzapp/` completa al área de drop
4. Netlify genera una URL pública (ej: `https://nawzapp-xxxxx.netlify.app`)
5. Compartir esa URL con la esposa para que acceda desde su Xiaomi

### Acceso al Dashboard
- Desde el footer de la pantalla de login → `Ver Dashboard →`
- O directamente: `https://tu-app.netlify.app/#dashboard`

---

## Notas técnicas importantes

- **Cross-device:** Los datos viven en `localStorage` del navegador donde se llena la encuesta. Para sincronizar entre el celular de ella y el PC del esposo, usar el botón **Exportar JSON** (en el celular) y luego **Importar JSON** (en el PC).
- **Sin backend:** Toda la app es estática. No hay servidor, no hay base de datos. Funciona 100% offline después de cargarse.
- **Contraseña:** Solo protege el formulario de encuesta. El dashboard es de acceso libre (sin auth) por ahora.
- **Agregar preguntas futuras:** Editar el array `AREAS` en `app.js`. Cada área tiene un campo `questions: []`.

---

*Generado con Claude Code · ÑawzApp v1.0*
