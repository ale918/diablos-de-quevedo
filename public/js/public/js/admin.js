const API = {
  async content() {
    const r = await fetch('/api/content');
    return r.json();
  },
  headers() {
    return { 'x-admin-password': sessionStorage.getItem('adminPassword') || '' };
  },
  async login(password) {
    const r = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!r.ok) throw new Error((await r.json()).error || 'Error al iniciar sesión');
    return true;
  },
  async putGeneral(payload) {
    const r = await fetch('/api/admin/general', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...this.headers() },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error((await r.json()).error || 'Error al guardar');
    return r.json();
  },
  async uploadGeneralImage(campo, file) {
    const fd = new FormData();
    fd.append('archivo', file);
    fd.append('campo', campo);
    const r = await fetch('/api/admin/general/imagen', { method: 'POST', headers: this.headers(), body: fd });
    if (!r.ok) throw new Error((await r.json()).error || 'Error al subir imagen');
    return r.json();
  },
  async addGaleria(file, alt) {
    const fd = new FormData();
    fd.append('archivo', file);
    fd.append('alt', alt || '');
    const r = await fetch('/api/admin/galeria', { method: 'POST', headers: this.headers(), body: fd });
    if (!r.ok) throw new Error((await r.json()).error || 'Error al subir archivo');
    return r.json();
  },
  async deleteGaleria(id) {
    const r = await fetch('/api/admin/galeria/' + id, { method: 'DELETE', headers: this.headers() });
    if (!r.ok) throw new Error('Error al borrar');
    return r.json();
  },
  async addEvento(payload) {
    const r = await fetch('/api/admin/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.headers() },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error((await r.json()).error || 'Error al agregar evento');
    return r.json();
  },
  async deleteEvento(id) {
    const r = await fetch('/api/admin/eventos/' + id, { method: 'DELETE', headers: this.headers() });
    if (!r.ok) throw new Error('Error al borrar');
    return r.json();
  },
  async addMiembro(nombre, rol, file) {
    const fd = new FormData();
    fd.append('nombre', nombre);
    fd.append('rol', rol);
    if (file) fd.append('foto', file);
    const r = await fetch('/api/admin/miembros', { method: 'POST', headers: this.headers(), body: fd });
    if (!r.ok) throw new Error((await r.json()).error || 'Error al agregar miembro');
    return r.json();
  },
  async deleteMiembro(id) {
    const r = await fetch('/api/admin/miembros/' + id, { method: 'DELETE', headers: this.headers() });
    if (!r.ok) throw new Error('Error al borrar');
    return r.json();
  }
};

function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => { t.className = 'toast'; }, 3200);
}

const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');

async function tryShowDashboard() {
  const saved = sessionStorage.getItem('adminPassword');
  if (!saved) return;
  loginScreen.style.display = 'none';
  dashboard.style.display = 'block';
  await loadAll();
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('passwordInput').value;
  const errorEl = document.getElementById('loginError');
  errorEl.textContent = '';
  try {
    await API.login(password);
    sessionStorage.setItem('adminPassword', password);
    loginScreen.style.display = 'none';
    dashboard.style.display = 'block';
    await loadAll();
  } catch (err) {
    errorEl.textContent = err.message;
  }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('adminPassword');
  dashboard.style.display = 'none';
  loginScreen.style.display = 'flex';
});

document.getElementById('adminTabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
});

let currentData = null;

async function loadAll() {
  currentData = await API.content();
  fillGeneralForm(currentData.general);
  renderGaleria(currentData.galeria);
  renderEventos(currentData.eventos);
  renderMiembros(currentData.miembros);
}

function fillGeneralForm(general) {
  const form = document.getElementById('generalForm');
  Object.keys(general || {}).forEach(key => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) input.value = general[key] || '';
  });
  setPreview('heroPreview', general.heroImagen);
  setPreview('logoPreview', general.logo);
}

function setPreview(elId, url) {
  const el = document.getElementById(elId);
  el.innerHTML = url ? `<img src="${url}" alt="">` : 'Sin imagen';
}

document.getElementById('generalForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  try {
    await API.putGeneral(payload);
    showToast('Información guardada.');
  } catch (err) {
    showToast(err.message, true);
  }
});

document.getElementById('heroUploadBtn').addEventListener('click', async () => {
  const file = document.getElementById('heroFile').files[0];
  if (!file) return showToast('Selecciona una imagen primero.', true);
  try {
    const { url } = await API.uploadGeneralImage('heroImagen', file);
    setPreview('heroPreview', url);
    showToast('Imagen principal actualizada.');
  } catch (err) {
    showToast(err.message, true);
  }
});

document.getElementById('logoUploadBtn').addEventListener('click', async () => {
  const file = document.getElementById('logoFile').files[0];
  if (!file) return showToast('Selecciona una imagen primero.', true);
  try {
    const { url } = await API.uploadGeneralImage('logo', file);
    setPreview('logoPreview', url);
    showToast('Logo actualizado.');
  } catch (err) {
    showToast(err.message, true);
  }
});

function renderGaleria(items) {
  const el = document.getElementById('galeriaList');
  el.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'admin-item';
    const mediaHtml = item.tipo === 'video'
      ? `<video src="${item.url}" muted></video>`
      : `<img src="${item.url}" alt="">`;
    div.innerHTML = `
      <div class="media">${mediaHtml}</div>
      <div class="meta"><span>${item.alt || '(sin descripción)'}</span></div>
      <button class="delete-btn">Eliminar</button>
    `;
    div.querySelector('.delete-btn').addEventListener('click', async () => {
      if (!confirm('¿Eliminar este elemento de la galería?')) return;
      try {
        await API.deleteGaleria(item.id);
        await loadAll();
        showToast('Elemento eliminado.');
      } catch (err) {
        showToast(err.message, true);
      }
    });
    el.appendChild(div);
  });
}

document.getElementById('galeriaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = document.getElementById('galeriaFile').files[0];
  const alt = e.target.querySelector('[name="alt"]').value;
  const progressEl = document.getElementById('galeriaProgress');
  if (!file) return showToast('Selecciona un archivo.', true);
  progressEl.textContent = 'Subiendo... esto puede tardar unos segundos si es un video.';
  try {
    await API.addGaleria(file, alt);
    await loadAll();
    e.target.reset();
    progressEl.textContent = '';
    showToast('Agregado a la galería.');
  } catch (err) {
    progressEl.textContent = '';
    showToast(err.message, true);
  }
});

function renderEventos(items) {
  const el = document.getElementById('eventosList');
  el.innerHTML = '';
  const ordenados = [...items].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  ordenados.forEach(ev => {
    const div = document.createElement('div');
    div.className = 'admin-list-item';
    div.innerHTML = `
      <div class="info">
        <strong>${ev.titulo}</strong>
        <span>${ev.fecha} — ${ev.lugar || 'sin lugar especificado'}</span>
      </div>
      <button class="delete-btn">Eliminar</button>
    `;
    div.querySelector('.delete-btn').addEventListener('click', async () => {
      if (!confirm('¿Eliminar este evento?')) return;
      try {
        await API.deleteEvento(ev.id);
        await loadAll();
        showToast('Evento eliminado.');
      } catch (err) {
        showToast(err.message, true);
      }
    });
    el.appendChild(div);
  });
}

document.getElementById('eventosForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  try {
    await API.addEvento(payload);
    await loadAll();
    e.target.reset();
    showToast('Evento agregado.');
  } catch (err) {
    showToast(err.message, true);
  }
});

function renderMiembros(items) {
  const el = document.getElementById('miembrosList');
  el.innerHTML = '';
  items.forEach(m => {
    const div = document.createElement('div');
    div.className = 'admin-item';
    div.innerHTML = `
      <div class="media">${m.foto ? `<img src="${m.foto}" alt="">` : '👤'}</div>
      <div class="meta"><strong>${m.nombre}</strong><span>${m.rol}</span></div>
      <button class="delete-btn">Eliminar</button>
    `;
    div.querySelector('.delete-btn').addEventListener('click', async () => {
      if (!confirm('¿Eliminar este miembro?')) return;
      try {
        await API.deleteMiembro(m.id);
        await loadAll();
        showToast('Miembro eliminado.');
      } catch (err) {
        showToast(err.message, true);
      }
    });
    el.appendChild(div);
  });
}

document.getElementById('miembrosForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = e.target.querySelector('[name="nombre"]').value;
  const rol = e.target.querySelector('[name="rol"]').value;
  const file = e.target.querySelector('[name="foto"]').files[0];
  try {
    await API.addMiembro(nombre, rol, file);
    await loadAll();
    e.target.reset();
    showToast('Miembro agregado.');
  } catch (err) {
    showToast(err.message, true);
  }
});

tryShowDashboard();