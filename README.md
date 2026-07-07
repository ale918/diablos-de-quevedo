# Diablos de Quevedo — Sitio Web

Sitio del grupo de danza **Diablos de Quevedo**. Es un sitio estático (HTML/CSS/JS)
servido con un mini-servidor Express, pensado para desplegarse en **Railway**.
Las fotos y videos se alojan en **Cloudinary**.

## Estructura del proyecto

```
diablos-danza/
├── server.js              ← servidor Express (sirve la carpeta /public)
├── package.json
├── railway.json
└── public/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── content.js      ← AQUÍ EDITAS TODO EL CONTENIDO (textos, eventos, fotos, videos)
        └── script.js        ← lógica del sitio, normalmente no hace falta tocarlo
```

## 1. Editar el contenido (ahora desde el panel admin)

**Ya no se edita `content.js` a mano.** Todo el contenido (fotos, videos,
miembros, eventos, textos, redes sociales) se administra desde el panel
`/admin` del sitio, con formularios y subida de archivos directo a Cloudinary.
Ve a la sección **6. Panel de administración** más abajo para la guía completa
(incluye las variables de entorno que hay que configurar primero).

`content.js` quedó obsoleto — el sitio público ahora carga el contenido desde
`/api/content`, que lee del archivo `data/data.json` (ese sí lo edita el
servidor automáticamente cuando usas el panel, no tú a mano).

## 2. Cloudinary — ya no hace falta copiar/pegar URLs a mano

Antes había que subir a Cloudinary manualmente y pegar la URL en un archivo.
Ahora el panel `/admin` sube directo a tu cuenta de Cloudinary por ti — solo
necesitas tener la cuenta creada y sus credenciales puestas como variables de
entorno (ver sección 6).

## 3. Probar el sitio localmente (opcional)

Necesitas [Node.js](https://nodejs.org) instalado.

```bash
npm install
npm start
```

Abre `http://localhost:3000` en tu navegador.

## 4. Subir el proyecto a GitHub

Railway despliega desde un repositorio de GitHub.

```bash
git init
git add .
git commit -m "Sitio Diablos de Quevedo"
```

Crea un repositorio nuevo en GitHub y luego:
```bash
git remote add origin https://github.com/TU_USUARIO/diablos-de-quevedo.git
git branch -M main
git push -u origin main
```

## 5. Desplegar en Railway

1. Entra a [railway.app](https://railway.app) e inicia sesión con tu cuenta de GitHub.
2. Click en **New Project** → **Deploy from GitHub repo**.
3. Selecciona el repositorio `diablos-de-quevedo`.
4. Railway detecta automáticamente que es un proyecto Node.js (gracias a
   `package.json` y `railway.json`) y lo despliega solo — no hace falta configurar
   nada más.
5. Cuando termine el build, Railway te da una URL pública (algo como
   `diablos-de-quevedo-production.up.railway.app`). Puedes conectar tu propio
   dominio desde **Settings → Networking → Custom Domain** dentro del proyecto en Railway.

## 6. Panel de administración (`/admin`)

Ahora el sitio tiene un panel privado para subir fotos y videos, y editar
eventos/miembros/datos generales **sin tocar código ni Git**. Vive en:

```
https://TU-SITIO.up.railway.app/admin
```

### Variables de entorno necesarias

Antes de que el panel funcione (sobre todo para subir fotos/videos), necesitas
configurar 4 variables de entorno:

| Variable | Para qué sirve |
|---|---|
| `ADMIN_PASSWORD` | La contraseña para entrar a `/admin`. Cámbiala, no dejes la de ejemplo. |
| `CLOUDINARY_CLOUD_NAME` | De tu cuenta de Cloudinary (Dashboard). |
| `CLOUDINARY_API_KEY` | De tu cuenta de Cloudinary (Dashboard). |
| `CLOUDINARY_API_SECRET` | De tu cuenta de Cloudinary (Dashboard). **Nunca la subas a GitHub.** |

Las 3 de Cloudinary las encuentras en tu Dashboard de Cloudinary, sección
**"Product Environment Credentials"** o **"API Keys"**.

### Configurarlas en Railway

1. Entra a tu proyecto en Railway.
2. Ve a la pestaña **Variables**.
3. Agrega las 4, una por una (nombre y valor).
4. Railway va a redesplegar solo tras guardar.

### Configurarlas en tu PC (para probar el admin en localhost)

1. En la carpeta `diablos-danza`, copia el archivo `.env.example` y renombra la
   copia a `.env`.
2. Abre `.env` y reemplaza los valores de ejemplo por los reales.
3. Reinicia el servidor (`Ctrl+C` y `npm start` de nuevo).

**Nota:** `.env` nunca se sube a GitHub (ya está en `.gitignore`) — es solo
para tu computadora.

### ⚠️ Importante: persistencia de datos en Railway (Volume)

El panel admin guarda todo (miembros, galería, eventos) en un archivo llamado
`data.json` dentro del proyecto. El problema: **cada vez que Railway
redespliega** (por ejemplo, cuando haces `git push`), reconstruye el proyecto
desde cero — y si `data.json` no está en un lugar persistente, perderías todo
lo que agregaste desde el panel.

Para evitarlo, agrega un **Volume** en Railway:

1. En tu proyecto de Railway, ve a la pestaña **Settings** del servicio.
2. Busca la sección **Volumes** → **"+ New Volume"**.
3. Ponle un nombre (ej. `data`) y como **Mount Path** escribe:
   ```
   /data
   ```
4. Ve a **Variables** y agrega una nueva:
   ```
   DATA_FILE=/data/data.json
   ```
5. Redespliega (Railway lo hace solo tras guardar variables).

A partir de ahí, todo lo que agregues desde `/admin` sobrevive a futuros
despliegues, aunque vuelvas a hacer `git push` con cambios de código.

**Mientras no configures el Volume:** el panel admin funciona igual, pero
si vuelves a hacer `git push`, los eventos/miembros/galería que agregaste
desde `/admin` en Railway se perderán (localmente en tu PC no hay este
problema, ahí `data.json` sí es permanente).

## 7. Actualizaciones futuras

Cada vez que quieras cambiar contenido (nuevo evento, nueva foto, nuevo miembro):

1. Edita `public/js/content.js`.
2. `git add . && git commit -m "actualizo contenido" && git push`
3. Railway vuelve a desplegar automáticamente en 1-2 minutos.

No necesitas tocar Railway ni Cloudinary de nuevo salvo que subas material nuevo
(en ese caso solo repites el paso 2 de este documento).
