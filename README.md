<div align="center">

# 🌻 ÑawzApp 🌻

### *Tu espacio de bienestar en pareja*

<br>

![🌸](https://img.shields.io/badge/🌸-Emocional-FDA4AF?style=for-the-badge&labelColor=FFF1F2&color=FDA4AF)
![🫂](https://img.shields.io/badge/🫂-Físico-FDBA74?style=for-the-badge&labelColor=FFF7ED&color=FDBA74)
![🌱](https://img.shields.io/badge/🌱-Crecimiento-6EE7B7?style=for-the-badge&labelColor=ECFDF5&color=6EE7B7)
![🌟](https://img.shields.io/badge/🌟-Conexión-C4B5FD?style=for-the-badge&labelColor=F5F3FF&color=C4B5FD)

<br>

![Firebase](https://img.shields.io/badge/Firebase-FF6F00?style=flat-square&logo=firebase&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)

</div>

---

<br>

## 🌺 ¿Qué es ÑawzApp?

ÑawzApp es una aplicación web privada para parejas que quieren **medir y registrar su bienestar mensual** en cuatro dimensiones de la relación. Cada persona completa su propia encuesta, y juntos visualizan la evolución de su vínculo a lo largo del tiempo.

Los datos son privados, compartidos únicamente entre los dos integrantes de cada pareja, y solo accesibles para el administrador de la app.

<br>

## 💗 Áreas de bienestar

<table>
  <tr>
    <td align="center" width="200">
      <strong>🥰 Vínculo Emocional</strong><br>
      <sub>Plenitud · Escucha · Valoración<br>Estabilidad · Conexión</sub>
    </td>
    <td align="center" width="200">
      <strong>🫂 Bienestar Físico</strong><br>
      <sub>Seguridad · Afecto · Cuidado<br>Comodidad · Detalles</sub>
    </td>
    <td align="center" width="200">
      <strong>🌱 Crecimiento Personal</strong><br>
      <sub>Desafío intelectual · Metas<br>Motivación · Libertad</sub>
    </td>
    <td align="center" width="200">
      <strong>🌟 Diversión & Conexión</strong><br>
      <sub>Alegría · Romance · Comunicación<br>Trabajo en equipo · Futuro</sub>
    </td>
  </tr>
</table>

Cada área contiene **5 preguntas** con escala del 1 al 10, con variantes genéricadas para ella y para él.

<br>

## 🌼 Funcionalidades

### 🔐 Autenticación de parejas
- Registro con email, contraseña y rol fijo (💗 Ella / 💙 Él)
- Las parejas se **enlazan automáticamente** al registrarse con el email del otro
- Mientras la pareja no se registre, cada uno puede completar encuestas de forma individual
- Recuperación de contraseña por email

### 📋 Encuesta mensual
- 20 preguntas en 4 áreas · escala 1–10
- Preguntas con redacción genéricada por rol
- Guardado automático en la nube al finalizar

### 📊 Dashboard compartido
- Gráfica de línea — evolución temporal por área
- Gráfica de radar — comparativa de la última encuesta
- Cards con score actual y tendencia vs. encuesta anterior
- Filtros cruzados por **área** y por **rol** (Ella · Él · Ambos)
- Tabla de historial completo

### 🛡️ Panel de administración
- Vista de todas las parejas registradas (activas y pendientes)
- Conteo de encuestas por pareja
- Gestión de cuentas
- Importación de datos históricos desde dispositivo

### 📦 Migración de datos
- Importar encuestas guardadas en `localStorage` (versiones anteriores de la app)
- Exportar / importar datos como JSON

<br>

## 🌸 Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML · CSS · JavaScript (sin frameworks) |
| Auth | Firebase Authentication (email + contraseña) |
| Base de datos | Cloud Firestore (`southamerica-west1`) |
| Gráficas | Chart.js 4.4 |
| Tipografías | Comfortaa · Nunito (Google Fonts) |
| Deploy | Netlify (static hosting) |

<br>

## 🌻 Estructura de datos

```
users/{uid}
  ├── email, name, role (ella | el)
  ├── partnerEmail, coupleId
  └── createdAt

couples/{coupleId}
  ├── ellaUid, ellaEmail
  ├── elUid, elEmail
  ├── status (pending | active)
  └── createdAt

couples/{coupleId}/surveys/{surveyId}
  ├── uid, role, name
  ├── dateISO, date
  ├── answers, areaScores
  ├── overall
  └── createdAt
```

<br>

## 💐 Cómo registrarse

1. La primera persona de la pareja entra a la app y crea su cuenta indicando el **email de su pareja**
2. La segunda persona crea su cuenta indicando el **email de la primera**
3. El sistema detecta la coincidencia y **enlaza la pareja automáticamente**
4. A partir de ese momento comparten el dashboard y el historial de encuestas

> Si la segunda persona aún no se registró, la primera puede igual completar encuestas — sus datos se transfieren automáticamente al coupleId compartido cuando la pareja se una.

<br>

## 🌺 Paleta de colores

<div align="center">

![Rosa](https://img.shields.io/badge/-%20%20-F472B6?style=for-the-badge&color=F472B6)
![Rosa claro](https://img.shields.io/badge/-%20%20-FBCFE8?style=for-the-badge&color=FBCFE8)
![Rosa pálido](https://img.shields.io/badge/-%20%20-FDF2F8?style=for-the-badge&color=FDF2F8)
![Rosa profundo](https://img.shields.io/badge/-%20%20-BE185D?style=for-the-badge&color=BE185D)
![Rose](https://img.shields.io/badge/-%20%20-FDA4AF?style=for-the-badge&color=FDA4AF)
![Peach](https://img.shields.io/badge/-%20%20-FDBA74?style=for-the-badge&color=FDBA74)
![Mint](https://img.shields.io/badge/-%20%20-6EE7B7?style=for-the-badge&color=6EE7B7)
![Lavender](https://img.shields.io/badge/-%20%20-C4B5FD?style=for-the-badge&color=C4B5FD)

</div>

<br>

---

<div align="center">

*Hecho con 💕 para medir lo que más importa*

🌸 🌻 🦋 🌼 🌺

</div>
