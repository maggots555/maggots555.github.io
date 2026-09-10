/**
 * Lista de proyectos (aparte de SIGMA, que tiene su propia sección).
 *
 * EXPLICACIÓN:
 * Esto es como una tabla de MySQL, pero en un archivo:
 * cada objeto es una fila, y `Proyecto` es la forma de las columnas.
 * Si olvidas el `titulo`, TypeScript te lo marca al construir.
 */

/** Qué color de sello lleva la ficha. */
export type Sello = "origen" | "herramienta" | "produccion";

export type Proyecto = {
  slug: string;
  titulo: string;
  resumen: string;
  sello: Sello;
  selloTexto: string;
  chips: string[];
  url: string;
};

export const proyectos: Proyecto[] = [
  {
    slug: "sistema-reparaciones-php",
    titulo: "Sistema de reparaciones (PHP)",
    resumen:
      "Primer sistema para gestionar reparaciones: PHP, MySQL, HTML, CSS, JavaScript, Bootstrap, jQuery y DataTables. Ahí practiqué folios, estados y clientes, antes de reconstruir el flujo en Django.",
    sello: "origen",
    selloTexto: "Origen",
    chips: ["PHP", "MySQL", "Bootstrap", "jQuery", "DataTables"],
    url: "https://github.com/maggots555/sistema-reparaciones-php",
  },
  {
    slug: "mcp-servers",
    titulo: "Servidor MCP",
    resumen:
      "Servidor MCP en JavaScript para añadir funciones tipo VS Code a Antigravity. Es una pieza chica de mi entorno de desarrollo, no del sistema del taller.",
    sello: "herramienta",
    selloTexto: "Herramienta",
    chips: ["JavaScript", "MCP", "Antigravity"],
    url: "https://github.com/maggots555/mcp-servers",
  },
];
