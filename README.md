# maggots555.github.io

Portafolio de **Jorge Luis Magos Alvarez** en [GitHub Pages](https://maggots555.github.io/).

Esta página **no ejecuta Django**. Presenta a la persona y el proyecto insignia [SIGMA](https://github.com/maggots555/inventario-calidad-django).

Se construye con **Astro**, **TypeScript** y **Tailwind CSS**. El visitante recibe HTML estático, igual que antes.

## Cómo trabajar en local

Hace falta [Node.js](https://nodejs.org/) (ya viene `npm`).

```bash
npm install          # instala dependencias (solo la primera vez)
npm run dev          # servidor de prueba → http://localhost:4321
npm run build        # genera la carpeta dist/ (lo que se publica)
npm run preview      # mira el build como si fuera el sitio real
```

## Dónde se edita qué

| Qué quieres cambiar | Archivo |
|---|---|
| Nombre, correo, GitHub | `src/data/sitio.ts` |
| Otros proyectos | `src/data/proyectos.ts` |
| Capturas de SIGMA | `src/data/capturas.ts` y `public/assets/sigma/` |
| Lista de herramientas | `src/data/herramientas.ts` |
| Textos de cada sección | `src/components/` (Hero, SobreMi, Sigma…) |
| Colores y tickets | `src/styles/global.css` |
| Fecha, lightbox, scroll | `src/scripts/portfolio.ts` |

`src/pages/index.astro` solo junta las secciones. `src/pages/404.astro` es la página de error.

## Cómo se publica (cuando esta rama esté en `main`)

1. Cada push a `main` dispara `.github/workflows/deploy.yml`.
2. GitHub Actions corre `npm run build` y sube `dist/`.
3. En el repo: **Settings → Pages → Source = GitHub Actions**.

Mientras el sitio público siga sirviendo la raíz de `main` como HTML suelto, **no mezclar** esta rama: rompería lo que se ve en línea.

El CV vive en `cv/` **solo en tu máquina**: está en `.gitignore` y no se publica.
