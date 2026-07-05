const express = require('express');
const compression = require('compression');
const path = require('path');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
app.use(compression());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 0, etag: false, lastModified: false }));
 
// Cualquier ruta no encontrada devuelve el index (útil si luego agregan más páginas/rutas)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
 
app.listen(PORT, () => {
  console.log(`Diablos de Quevedo corriendo en el puerto ${PORT}`);
});
 