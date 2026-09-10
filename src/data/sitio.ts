/**
 * Datos fijos del portafolio (nombre, enlaces, textos del <head>).
 *
 * EXPLICACIÓN:
 * En vez de copiar el correo o el GitHub en 5 archivos, los dejamos aquí.
 * Si cambias un valor, se actualiza en Header, Hero, Contacto y el SEO.
 * TypeScript `as const` congela el objeto: nadie puede agregar campos a lo loco.
 */
export const sitio = {
  nombre: "Jorge Luis Magos Alvarez",
  nombreCorto: "Jorge Luis Magos",
  iniciales: "JM",
  handle: "maggots555",
  oficio: "Desarrollador",
  ciudad: "Nicolás Romero, MX",
  email: "jorgemahos@gmail.com",
  url: "https://maggots555.github.io/",
  github: "https://github.com/maggots555",
  sigmaRepo: "https://github.com/maggots555/inventario-calidad-django",
  descripcion:
    "Portafolio de Jorge Luis Magos Alvarez, desarrollador. Proyecto insignia: SIGMA (Django).",
  ogDescripcion:
    "Desarrollador. Proyecto insignia: SIGMA, un sistema Django en producción.",
  ogImagen: "https://avatars.githubusercontent.com/u/178110991?v=4",
  themeColor: "#0c0b0a",
} as const;
