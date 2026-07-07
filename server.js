require('dotenv').config();
const express = require('express');
const compression = require('compression');
const multer = require('multer');
const path = require('path');

const { readData, writeData, newId } = require('./dataStore');
const { uploadBuffer, isConfigured } = require('./cloudinary');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'diablos2026';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB máx (videos pesan más que fotos)
});

app.use(compression());
app.use(express.json());

// Sin caché: los cambios se ven al instante (útil mientras se edita el sitio)
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0, etag: false, lastModified: false }));

// ---------------------------------------------------------------------------
// AUTENTICACIÓN DEL ADMIN
// Simple: cada request a /api/admin/* debe traer el header x-admin-password
// con la contraseña correcta (definida en la variable de entorno ADMIN_PASSWORD).
// ---------------------------------------------------------------------------
function requireAdmin(req, res, next) {
  const pass = req.get('x-admin-password');
  if (pass && pass === ADMIN_PASSWORD) return next();
  return res.status(401).json({ error: 'Contraseña incorrecta o sesión expirada.' });
}

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) return res.json({ ok: true });
  return res.status(401).json({ error: 'Contraseña incorrecta.' });
});

// ---------------------------------------------------------------------------
// CONTENIDO PÚBLICO (lo consume el sitio principal)
// ---------------------------------------------------------------------------
app.get('/api/content', (req, res) => {
  try {
    res.json(readData());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------------------------------------------------------------
// GENERAL (datos del grupo, redes, hero, logo)
// ---------------------------------------------------------------------------
app.put('/api/admin/general', requireAdmin, async (req, res) => {
  try {
    const data = readData();
    data.general = { ...data.general, ...req.body };
    writeData(data);
    res.json(data.general);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/general/imagen', requireAdmin, upload.single('archivo'), async (req, res) => {
  try {
    if (!isConfigured()) return res.status(400).json({ error: 'Cloudinary no está configurado (faltan variables de entorno).' });
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo.' });
    const campo = req.body.campo; // "heroImagen" o "logo"
    if (!['heroImagen', 'logo'].includes(campo)) return res.status(400).json({ error: 'Campo inválido.' });

    const result = await uploadBuffer(req.file.buffer, { folder: 'diablos-de-quevedo/general', resourceType: 'image' });
    const data = readData();
    data.general[campo] = result.secure_url;
    writeData(data);
    res.json({ url: result.secure_url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------------------------------------------------------------------
// GALERÍA
// ---------------------------------------------------------------------------
app.post('/api/admin/galeria', requireAdmin, upload.single('archivo'), async (req, res) => {
  try {
    if (!isConfigured()) return res.status(400).json({ error: 'Cloudinary no está configurado (faltan variables de entorno).' });
    if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo.' });

    const tipo = req.file.mimetype.startsWith('video') ? 'video' : 'imagen';
    const result = await uploadBuffer(req.file.buffer, {
      folder: 'diablos-de-quevedo/galeria',
      resourceType: tipo === 'video' ? 'video' : 'image'
    });

    const data = readData();
    const item = { id: newId(), tipo, url: result.secure_url, alt: req.body.alt || '' };
    data.galeria.unshift(item);
    writeData(data);
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/galeria/:id', requireAdmin, (req, res) => {
  const data = readData();
  data.galeria = data.galeria.filter(item => item.id !== req.params.id);
  writeData(data);
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// MIEMBROS
// ---------------------------------------------------------------------------
app.post('/api/admin/miembros', requireAdmin, upload.single('foto'), async (req, res) => {
  try {
    const { nombre, rol } = req.body;
    if (!nombre || !rol) return res.status(400).json({ error: 'Falta nombre o rol.' });

    let fotoUrl = '';
    if (req.file) {
      if (!isConfigured()) return res.status(400).json({ error: 'Cloudinary no está configurado (faltan variables de entorno).' });
      const result = await uploadBuffer(req.file.buffer, { folder: 'diablos-de-quevedo/miembros', resourceType: 'image' });
      fotoUrl = result.secure_url;
    }

    const data = readData();
    const item = { id: newId(), nombre, rol, foto: fotoUrl };
    data.miembros.push(item);
    writeData(data);
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/miembros/:id', requireAdmin, (req, res) => {
  const data = readData();
  data.miembros = data.miembros.filter(m => m.id !== req.params.id);
  writeData(data);
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// EVENTOS
// ---------------------------------------------------------------------------
app.post('/api/admin/eventos', requireAdmin, (req, res) => {
  const { titulo, fecha, lugar, descripcion } = req.body;
  if (!titulo || !fecha) return res.status(400).json({ error: 'Falta título o fecha.' });
  const data = readData();
  const item = { id: newId(), titulo, fecha, lugar: lugar || '', descripcion: descripcion || '' };
  data.eventos.push(item);
  writeData(data);
  res.json(item);
});

app.delete('/api/admin/eventos/:id', requireAdmin, (req, res) => {
  const data = readData();
  data.eventos = data.eventos.filter(e => e.id !== req.params.id);
  writeData(data);
  res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Página del sitio (cualquier ruta no reconocida devuelve el index)
// ---------------------------------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Diablos de Quevedo corriendo en el puerto ${PORT}`);
  if (!isConfigured()) {
    console.log('Cloudinary no está configurado: define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET para poder subir fotos/videos desde el admin.');
  }
});
