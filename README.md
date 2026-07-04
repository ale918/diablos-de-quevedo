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

## 1. Editar el contenido (lo más importante)

Todo el contenido del sitio vive en **`public/js/content.js`**. No necesitas tocar
HTML ni CSS para:

- Cambiar el número de WhatsApp, redes sociales, email.
- Agregar/quitar eventos.
- Agregar fotos y videos a la galería.
- Agregar miembros del grupo.
- Cambiar la historia y valores de "Nosotros".

Cada campo `url` o `foto` vacío (`""`) se muestra como un recuadro con un ícono de
"agregar foto/video" — apenas pegues el link de Cloudinary ahí, aparece la imagen real.

## 2. Subir tus fotos y videos a Cloudinary

1. Crea una cuenta gratis en [cloudinary.com](https://cloudinary.com).
2. En el **Dashboard**, ve a **Media Library** → botón **Upload** → sube tus fotos
   y videos (puedes organizarlos en una carpeta, ej. `diablos-quevedo`).
3. Al subir cada archivo, Cloudinary te da una URL pública, algo como:
   ```
   https://res.cloudinary.com/tu_cloud_name/image/upload/v1234567890/diablos-quevedo/foto1.jpg
   https://res.cloudinary.com/tu_cloud_name/video/upload/v1234567890/diablos-quevedo/video1.mp4
   ```
4. Copia esa URL y pégala en el campo correspondiente dentro de `content.js`
   (por ejemplo en `galeria`, `miembros[].foto`, o `general.heroImagen`).

**Tip:** para que las fotos carguen más rápido y del tamaño correcto, puedes agregar
parámetros de transformación de Cloudinary directo en la URL, por ejemplo:
```
.../upload/w_800,h_800,c_fill,g_auto,q_auto,f_auto/diablos-quevedo/foto1.jpg
```
- `w_800,h_800,c_fill` → recorta y ajusta tamaño
- `g_auto` → enfoque automático inteligente (detecta caras/sujeto)
- `q_auto,f_auto` → calidad y formato optimizados automáticamente

Para tu logo, súbelo también a Cloudinary y pega la URL en `general.logo`.

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

## 6. Actualizaciones futuras

Cada vez que quieras cambiar contenido (nuevo evento, nueva foto, nuevo miembro):

1. Edita `public/js/content.js`.
2. `git add . && git commit -m "actualizo contenido" && git push`
3. Railway vuelve a desplegar automáticamente en 1-2 minutos.

No necesitas tocar Railway ni Cloudinary de nuevo salvo que subas material nuevo
(en ese caso solo repites el paso 2 de este documento).
