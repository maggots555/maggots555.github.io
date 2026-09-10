/**
 * Portafolio — TypeScript mínimo (corre en el navegador).
 *
 * EXPLICACIÓN PARA PRINCIPIANTES:
 * Astro genera HTML. Este archivo se empaqueta y se manda al visitante.
 * No habla con Django ni con una base de datos.
 *  1) Fecha de hoy (larga, en español), clima de Nicolás Romero y año del pie.
 *  2) Galería + lightbox.
 *  3) Barra de luz + parallax (figura, título, recorrido).
 *  4) Revelar títulos al entrar en pantalla (Intersection Observer).
 *
 * TypeScript nos obliga a preguntar “¿existe este elemento?” antes de usarlo.
 * Por eso ves `if (fechaNodo)` y `instanceof HTMLDialogElement`.
 */

/**
 * ISO (2026-09-10) es el formato que entienden buscadores y lectores de pantalla.
 * Va en el atributo datetime del <time>, no en el texto que ve la gente.
 */
function fechaIso(fecha: Date): string {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Meses con mayúscula inicial: el look editorial del portafolio,
 * no el “septiembre” en minúscula que pondría toLocaleDateString.
 */
const MESES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

/** Texto visible: “10 de Septiembre del 2026”. */
function fechaLarga(fecha: Date): string {
  const dia = fecha.getDate();
  const mes = MESES_ES[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} de ${mes} del ${anio}`;
}

function iniciarFecha(): void {
  const fechaNodo = document.getElementById("folio-fecha");
  if (fechaNodo) {
    const hoy = new Date();
    fechaNodo.textContent = fechaLarga(hoy);
    fechaNodo.setAttribute("datetime", fechaIso(hoy));
  }

  const anioNodo = document.getElementById("anio");
  if (anioNodo) {
    anioNodo.textContent = String(new Date().getFullYear());
  }
}

/**
 * Open-Meteo usa códigos WMO (números), no palabras.
 * Aquí los traducimos a un cielo corto en español.
 */
function cieloDesdeCodigo(codigo: number): string {
  if (codigo === 0) {
    return "Despejado";
  }
  if (codigo === 1) {
    return "Mayormente despejado";
  }
  if (codigo === 2) {
    return "Parcialmente nublado";
  }
  if (codigo === 3) {
    return "Nublado";
  }
  if (codigo === 45 || codigo === 48) {
    return "Niebla";
  }
  if (codigo >= 51 && codigo <= 57) {
    return "Llovizna";
  }
  if (codigo >= 61 && codigo <= 67) {
    return "Lluvia";
  }
  if (codigo >= 71 && codigo <= 77) {
    return "Nieve";
  }
  if (codigo >= 80 && codigo <= 82) {
    return "Chubascos";
  }
  if (codigo >= 85 && codigo <= 86) {
    return "Nieve";
  }
  if (codigo >= 95 && codigo <= 99) {
    return "Tormenta";
  }
  return "Cielo variable";
}

type ClimaActual = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
};

/**
 * Clima de Nicolás Romero.
 *
 * EXPLICACIÓN:
 * GitHub Pages no tiene servidor propio: no podemos guardar una contraseña
 * de clima. Open-Meteo es gratuito y no pide clave; el navegador lo llama
 * directo. Si no hay red, no mostramos nada: la fecha ya está.
 */
async function iniciarClima(): Promise<void> {
  const folio = document.querySelector(".folio");
  const climaNodo = document.getElementById("folio-clima");
  if (!(folio instanceof HTMLElement) || !climaNodo) {
    return;
  }

  const lat = folio.getAttribute("data-lat");
  const lon = folio.getAttribute("data-lon");
  if (!lat || !lon) {
    return;
  }

  const url =
    "https://api.open-meteo.com/v1/forecast?" +
    new URLSearchParams({
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,weather_code",
      timezone: "America/Mexico_City",
    }).toString();

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      return;
    }

    const datos = (await respuesta.json()) as ClimaActual;
    const temp = datos.current?.temperature_2m;
    const codigo = datos.current?.weather_code;
    if (typeof temp !== "number" || typeof codigo !== "number") {
      return;
    }

    climaNodo.textContent = `${Math.round(temp)}° · ${cieloDesdeCodigo(codigo)}`;
    climaNodo.removeAttribute("hidden");
    requestAnimationFrame(() => {
      climaNodo.classList.add("is-listo");
    });
  } catch {
    // Silencio a propósito: el folio sigue mostrando la fecha.
  }
}

/**
 * Recorre cada figura de la galería.
 * - Si la imagen no carga, pinta un placeholder.
 * - Si carga, un clic abre el <dialog> con la foto grande.
 */
function iniciarGalería(): void {
  const dialogo = document.getElementById("lightbox");
  const dialogoImg = document.getElementById("lightbox-img");
  const dialogoCap = document.getElementById("lightbox-cap");
  const figuras = document.querySelectorAll<HTMLElement>(".shot");

  figuras.forEach((figura) => {
    const img = figura.querySelector("img");
    if (!(img instanceof HTMLImageElement)) {
      return;
    }

    img.addEventListener("error", () => {
      mostrarPlaceholder(figura, img);
    });

    if (img.complete && img.naturalWidth === 0) {
      mostrarPlaceholder(figura, img);
    }

    figura.addEventListener("click", () => {
      if (
        figura.classList.contains("is-empty") ||
        !(dialogo instanceof HTMLDialogElement) ||
        !(dialogoImg instanceof HTMLImageElement)
      ) {
        return;
      }

      dialogoImg.src = img.currentSrc || img.src;
      dialogoImg.alt = img.alt || "";
      if (dialogoCap) {
        dialogoCap.textContent = figura.getAttribute("data-caption") || "";
      }
      if (typeof dialogo.showModal === "function") {
        dialogo.showModal();
      }
    });
  });

  if (dialogo instanceof HTMLDialogElement) {
    dialogo.addEventListener("click", (evento) => {
      if (evento.target === dialogo) {
        dialogo.close();
      }
    });
  }
}

function mostrarPlaceholder(figura: HTMLElement, img: HTMLImageElement): void {
  if (figura.classList.contains("is-empty")) {
    return;
  }

  figura.classList.add("is-empty");
  const pie = figura.querySelector("figcaption");
  const titulo = pie?.textContent ?? "Captura";
  const caja = document.createElement("div");
  caja.className = "shot-ph";
  caja.setAttribute("aria-hidden", "true");
  caja.textContent = "Pendiente: " + titulo.trim() + "\n(assets/sigma/)";
  img.replaceWith(caja);
}

/**
 * Barra de luz + parallax.
 *
 * EXPLICACIÓN:
 * Parallax = las capas no se mueven al mismo ritmo que el scroll.
 * La figura se atrasa (parece fondo). El título se atrasa menos.
 * El recorrido se mueve según su lugar en la pantalla, no desde el tope.
 * Solo transform (GPU). Si piden menos movimiento, esto no corre.
 */
function iniciarScroll(sinMovimiento: boolean): void {
  const barra = document.getElementById("scroll-ink-bar");
  const capas = document.querySelectorAll<HTMLElement>("[data-parallax]");

  if (sinMovimiento) {
    return;
  }

  let pendiente = false;

  function pintar(): void {
    pendiente = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    let p = max > 0 ? window.scrollY / max : 0;
    if (p < 0) {
      p = 0;
    }
    if (p > 1) {
      p = 1;
    }
    if (barra) {
      barra.style.transform = "scaleX(" + p + ")";
    }

    const yDoc = window.scrollY;
    const altoVista = window.innerHeight;

    capas.forEach((capa) => {
      const minimo = Number(capa.getAttribute("data-parallax-min") || "0");
      if (minimo > 0 && window.innerWidth < minimo) {
        capa.style.transform = "";
        return;
      }

      const velocidad = Number(capa.getAttribute("data-parallax") || "0");
      if (!velocidad) {
        return;
      }

      const local = capa.hasAttribute("data-parallax-local");
      let y = 0;
      if (local) {
        const caja = capa.getBoundingClientRect();
        const centro = caja.top + caja.height / 2;
        y = (centro - altoVista / 2) * velocidad;
      } else {
        y = yDoc * velocidad;
      }
      capa.style.transform = "translate3d(0, " + y.toFixed(1) + "px, 0)";
    });
  }

  function enScroll(): void {
    if (!pendiente) {
      pendiente = true;
      requestAnimationFrame(pintar);
    }
  }

  pintar();
  window.addEventListener("scroll", enScroll, { passive: true });
  window.addEventListener("resize", enScroll, { passive: true });
}

/**
 * Cuando un bloque .reveal entra en pantalla, le ponemos .is-in.
 * El CSS hace el fade. Solo una vez (unobserve).
 */
function iniciarRevelado(sinMovimiento: boolean): void {
  const nodos = document.querySelectorAll(".reveal");
  if (sinMovimiento || !("IntersectionObserver" in window)) {
    nodos.forEach((nodo) => {
      nodo.classList.add("is-in");
    });
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("is-in");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  nodos.forEach((nodo) => {
    observador.observe(nodo);
  });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  document.documentElement.classList.add("js-motion");
}

iniciarFecha();
void iniciarClima();
iniciarGalería();
iniciarScroll(reduceMotion);
iniciarRevelado(reduceMotion);
