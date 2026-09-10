/**
 * Capturas de SIGMA que se muestran en la galería.
 *
 * EXPLICACIÓN:
 * `src` apunta a /assets/... porque en Astro lo que está en `public/`
 * se copia tal cual a la raíz del sitio publicado.
 */

export type Captura = {
  src: string;
  alt: string;
  pie: string;
  caption: string;
};

export const capturas: Captura[] = [
  {
    src: "/assets/sigma/cotizaciones.png",
    alt: "Gráfico de evolución mensual de cotizaciones en SIGMA: aceptadas, rechazadas y pendientes",
    pie: "Cotizaciones",
    caption:
      "Cotizaciones en el tiempo: aceptadas, rechazadas y pendientes, mes a mes.",
  },
  {
    src: "/assets/sigma/solicitudes.png",
    alt: "Listado de solicitudes de cotización en SIGMA con estados y totales",
    pie: "Solicitudes",
    caption:
      "Solicitudes de cotización: del borrador a la compra, con estado y total.",
  },
  {
    src: "/assets/sigma/almacen.png",
    alt: "Tabla de movimientos de almacén en SIGMA: entradas, salidas y transferencias",
    pie: "Almacén",
    caption:
      "Movimientos de almacén: entradas, salidas y transferencias ligadas a la orden.",
  },
  {
    src: "/assets/sigma/portal.png",
    alt: "Tablero del portal del cliente en SIGMA con accesos, enlaces y tasa de apertura de correos",
    pie: "Portal del cliente",
    caption: "Portal del cliente: enlaces, visitas y correos de seguimiento.",
  },
  {
    src: "/assets/sigma/nps.png",
    alt: "Tablero de encuestas NPS en SIGMA con tendencia semanal y distribución de promotores",
    pie: "Encuestas / NPS",
    caption:
      "Calidad percibida: encuestas enviadas, NPS y calificación promedio.",
  },
];
