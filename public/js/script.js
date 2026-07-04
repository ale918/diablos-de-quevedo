document.addEventListener('DOMContentLoaded', () => {
  const C = SITE_CONTENT;

  // ---- Datos generales ----
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('heroTagline').textContent = C.general.lema;
  document.getElementById('heroDesc').textContent = C.general.descripcionCorta;
  document.getElementById('ubicacionText').textContent = C.general.ubicacion;

  const emailLink = document.getElementById('emailLink');
  emailLink.textContent = C.general.email;
  emailLink.href = `mailto:${C.general.email}`;

  const waLink = document.getElementById('whatsappLink');
  waLink.textContent = C.general.telefono;
  waLink.href = C.general.whatsapp;

  if (C.general.logo) {
    const logoImg = document.getElementById('logoImg');
    logoImg.src = C.general.logo;
    logoImg.style.display = 'block';
  }

  if (C.general.heroImagen) {
    const heroVisual = document.getElementById('heroVisual');
    heroVisual.innerHTML = `<img src="${C.general.heroImagen}" alt="Diablos de Quevedo en presentación">`;
  }

  // ---- Redes sociales ----
  const socialsMap = [
    { key: 'facebook', label: 'Facebook', icon: 'f' },
    { key: 'instagram', label: 'Instagram', icon: '◎' },
    { key: 'youtube', label: 'YouTube', icon: '▶' }
  ];
  const socialsEl = document.getElementById('socials');
  socialsMap.forEach(s => {
    if (C.general[s.key]) {
      const a = document.createElement('a');
      a.href = C.general[s.key];
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', s.label);
      a.textContent = s.icon;
      socialsEl.appendChild(a);
    }
  });

  // ---- Galería ----
  const galleryGrid = document.getElementById('galleryGrid');
  C.galeria.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    if (item.url) {
      if (item.tipo === 'video') {
        div.innerHTML = `<video src="${item.url}" muted loop></video><span class="play-badge">▶</span>`;
        div.addEventListener('mouseenter', () => div.querySelector('video').play());
        div.addEventListener('mouseleave', () => div.querySelector('video').pause());
      } else {
        div.innerHTML = `<img src="${item.url}" alt="${item.alt || ''}">`;
      }
      div.addEventListener('click', () => openLightbox(item));
    } else {
      div.innerHTML = `<div class="gallery-placeholder">${item.tipo === 'video' ? '🎬' : '📷'}<br>${item.alt || 'Agregar foto/video'}</div>`;
    }
    galleryGrid.appendChild(div);
  });

  // ---- Eventos ----
  const meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const eventosList = document.getElementById('eventosList');
  const eventosOrdenados = [...C.eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  eventosOrdenados.forEach(ev => {
    const d = new Date(ev.fecha + 'T00:00:00');
    const card = document.createElement('div');
    card.className = 'evento-card';
    card.innerHTML = `
      <div class="evento-fecha">
        <span class="dia">${String(d.getDate()).padStart(2,'0')}</span>
        <span class="mes">${meses[d.getMonth()]} ${d.getFullYear()}</span>
      </div>
      <div class="evento-info">
        <h3>${ev.titulo}</h3>
        <div class="lugar">${ev.lugar}</div>
        <p>${ev.descripcion}</p>
      </div>
    `;
    eventosList.appendChild(card);
  });

  // ---- Nosotros ----
  document.getElementById('historiaTexto').textContent = C.nosotros.historia;
  const valoresList = document.getElementById('valoresList');
  C.nosotros.valores.forEach((v, i) => {
    const div = document.createElement('div');
    div.className = 'valor';
    div.innerHTML = `<span class="num">${String(i + 1).padStart(2, '0')}</span><div><h4>${v.titulo}</h4><p>${v.texto}</p></div>`;
    valoresList.appendChild(div);
  });

  // ---- Miembros ----
  const miembrosGrid = document.getElementById('miembrosGrid');
  C.miembros.forEach(m => {
    const div = document.createElement('div');
    div.className = 'miembro-card';
    div.innerHTML = `
      <div class="miembro-foto">${m.foto ? `<img src="${m.foto}" alt="${m.nombre}">` : '👤'}</div>
      <h4>${m.nombre}</h4>
      <p>${m.rol}</p>
    `;
    miembrosGrid.appendChild(div);
  });

  // ---- Menú móvil ----
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

  // ---- Nav activo al hacer scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav.main-nav a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`nav.main-nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));

  // ---- Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  function openLightbox(item) {
    lightboxContent.innerHTML = item.tipo === 'video'
      ? `<video src="${item.url}" controls autoplay></video>`
      : `<img src="${item.url}" alt="${item.alt || ''}">`;
    lightbox.classList.add('open');
  }
  document.getElementById('lightboxClose').addEventListener('click', () => {
    lightbox.classList.remove('open');
    lightboxContent.innerHTML = '';
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('open');
      lightboxContent.innerHTML = '';
    }
  });

  // ---- Formulario de contacto → WhatsApp ----
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const tipoEvento = document.getElementById('tipoEvento').value;
    const mensaje = document.getElementById('mensaje').value;
    const texto = encodeURIComponent(
      `Hola, soy ${nombre}. Quiero contratarlos para un evento tipo "${tipoEvento}". ${mensaje}`
    );
    window.open(`${C.general.whatsapp}?text=${texto}`, '_blank');
  });
});
