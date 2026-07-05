/* =========================================================================
   CONTENIDO DEL SITIO — DIABLOS DE QUEVEDO
   =========================================================================
   Edita este archivo para actualizar textos, eventos, galería y miembros.
   No necesitas tocar el HTML ni el CSS para cambiar el contenido.

   Para las fotos y videos: subilos a Cloudinary y pega aquí la URL que te
   da Cloudinary (algo como:
   https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567/carpeta/nombre.jpg
   ). Para videos, usa una URL que termine en .mp4 (Cloudinary también las
   genera automáticamente).
   ========================================================================= */

const SITE_CONTENT = {

  // ---- DATOS GENERALES ----
  general: {
    nombreGrupo: "Diablos de Quevedo",
    lema: "PASIÓN. CULTURA. MOVIMIENTO.",
    descripcionCorta:
      "Somos un grupo de danza de Quevedo. Llevamos nuestra cultura a cada tarima, fiesta y escenario con el corazón puesto en cada paso.",
    whatsapp: "https://wa.me/593000000000", // reemplaza con tu número real, formato 593XXXXXXXXX
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    email: "contacto@diablosdequevedo.com",
    telefono: "+593 00 000 0000",
    ubicacion: "Quevedo, Los Ríos, Ecuador",

    // Imagen de fondo del hero (portada). Reemplaza por una foto de una
    // presentación/baile del grupo subida a Cloudinary.
    heroImagen: "https://res.cloudinary.com/debaqsqnb/image/upload/v1783276841/3dc2bcee-7d1a-46d3-bb7d-0d89e8ecdf59_pg4zgs.jpg",

    // Logo del grupo (el que ya tienen). Reemplaza con la URL de Cloudinary.
    logo: "" // ej: "https://res.cloudinary.com/TU_CLOUD/image/upload/v1/logo-diablos.png"
  },

  // ---- GALERÍA (una sola sección, cerca del inicio) ----
  // tipo: "imagen" o "video"
  galeria: [
    { tipo: "imagen", url: "", alt: "Presentación en fiesta patronal" },
    { tipo: "imagen", url: "", alt: "Ensayo del grupo" },
    { tipo: "video",  url: "", alt: "Espectáculo de danza folklórica" },
    { tipo: "imagen", url: "", alt: "Vestuario tradicional" },
    { tipo: "imagen", url: "", alt: "Baile en escenario principal" },
    { tipo: "imagen", url: "", alt: "Grupo completo" },
    { tipo: "video",  url: "", alt: "Coreografía en evento privado" },
    { tipo: "imagen", url: "", alt: "Detalle de vestuario" }
  ],

  // ---- PRÓXIMOS EVENTOS ----
  eventos: [
    {
      titulo: "Fiestas de Quevedo",
      fecha: "2026-10-07",
      lugar: "Malecón de Quevedo",
      descripcion: "Presentación especial por las fiestas de cantonización."
    },
    {
      titulo: "Show privado — Boda García",
      fecha: "2026-08-15",
      lugar: "Salón de eventos El Palacio",
      descripcion: "Espectáculo de danza para cierre de recepción."
    },
    {
      titulo: "Festival Cultural Los Ríos",
      fecha: "2026-09-20",
      lugar: "Coliseo de Quevedo",
      descripcion: "Participación junto a otros grupos de danza de la provincia."
    }
  ],

  // ---- MIEMBROS / BAILARINES ----
  miembros: [
    { nombre: "Nombre Apellido", rol: "Director / Coreógrafo", foto: "" },
    { nombre: "Nombre Apellido", rol: "Bailarina principal", foto: "" },
    { nombre: "Nombre Apellido", rol: "Bailarín principal", foto: "" },
    { nombre: "Nombre Apellido", rol: "Vestuario y producción", foto: "" }
  ],

  // ---- SOBRE NOSOTROS ----
  nosotros: {
    historia:
      "Diablos de Quevedo nació de las ganas de un grupo de amigos por mantener viva la danza y la cultura de nuestra tierra. Con el tiempo nos convertimos en una familia que representa a Quevedo en fiestas patronales, bodas, festivales y todo tipo de eventos.",
    valores: [
      { titulo: "Pasión", texto: "Cada coreografía se ensaya con entrega total." },
      { titulo: "Disciplina", texto: "Ensayos constantes para un espectáculo impecable." },
      { titulo: "Raíces", texto: "Bailamos para mantener viva la cultura de nuestra gente." }
    ]
  }
};
