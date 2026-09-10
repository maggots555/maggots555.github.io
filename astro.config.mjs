// @ts-check
/**
 * Configuración de Astro.
 *
 * EXPLICACIÓN:
 * - `site` es la URL pública (repo de usuario: maggots555.github.io).
 *   No hace falta `base` porque el sitio vive en la raíz, no en /nombre-del-repo.
 * - Tailwind v4 entra como plugin de Vite (no uses el paquete viejo @astrojs/tailwind).
 */
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://maggots555.github.io",
  vite: {
    plugins: [tailwindcss()],
  },
});
