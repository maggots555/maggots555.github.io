/**
 * Tablero de herramientas, agrupado por capa.
 * El HTML se genera recorriendo este array (como un foreach de PHP).
 */
export type CapaHerramientas = {
  titulo: string;
  items: string[];
};

export const herramientas: CapaHerramientas[] = [
  {
    titulo: "Frontend",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Bootstrap",
      "jQuery",
      "DataTables",
    ],
  },
  {
    titulo: "Backend",
    items: ["PHP", "Python", "Django", "MySQL", "PostgreSQL", "SQLite"],
  },
  {
    titulo: "Infraestructura",
    items: ["Celery", "Redis", "XAMPP", "Git / GitHub", "PWA", "FFmpeg"],
  },
];
