const fs = require('fs');
const path = require('path');

// DATA_FILE se puede sobreescribir con una variable de entorno para que en
// Railway apunte a un Volume persistente (ver README). Localmente usa el
// archivo dentro de /data.
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'data.json');
const SEED_FILE = path.join(__dirname, 'data', 'data.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const seed = fs.existsSync(SEED_FILE)
      ? fs.readFileSync(SEED_FILE, 'utf-8')
      : JSON.stringify({ general: {}, galeria: [], eventos: [], miembros: [], nosotros: { historia: '', valores: [] } }, null, 2);
    fs.writeFileSync(DATA_FILE, seed);
  }
}

function readData() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error('El archivo de datos está corrupto: ' + e.message);
  }
}

function writeData(data) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  return data;
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

module.exports = { readData, writeData, newId, DATA_FILE };
