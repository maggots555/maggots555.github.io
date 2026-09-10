/**
 * Portafolio — TypeScript mínimo (corre en el navegador).
 *
 * EXPLICACIÓN PARA PRINCIPIANTES:
 * Astro genera HTML. Este archivo se empaqueta y se manda al visitante.
 * No habla con Django ni con una base de datos.
 *  1) Fecha de hoy y año del pie.
 *  2) Galería + lightbox.
 *  3) Barra de luz según cuánto has bajado.
 *
 * TypeScript nos obliga a preguntar “¿existe este elemento?” antes de usarlo.
 * Por eso ves `if (fechaNodo)` y `instanceof HTMLDialogElement`.
 */

function fechaIso(fecha: Date): string {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function iniciarFecha(): void {
  const fechaNodo = document.getElementById("folio-fecha");
  if (fechaNodo) {
    const iso = fechaIso(new Date());
    fechaNodo.textContent = iso;
    fechaNodo.setAttribute("datetime", iso);
  }

  const anioNodo = document.getElementById("anio");
  if (anioNodo) {
    anioNodo.textContent = String(new Date().getFullYear());
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
 * La barra de luz usa scaleX (GPU). 0 = arriba, 1 = final de la página.
 */
function iniciarTinta(sinMovimiento: boolean): void {
  const barra = document.getElementById("scroll-ink-bar");
  if (!barra || sinMovimiento) {
    return;
  }

  function pintar(): void {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    let p = max > 0 ? window.scrollY / max : 0;
    if (p < 0) {
      p = 0;
    }
    if (p > 1) {
      p = 1;
    }
    barra.style.transform = "scaleX(" + p + ")";
  }

  pintar();
  window.addEventListener("scroll", pintar, { passive: true });
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

iniciarFecha();
iniciarGalería();
iniciarTinta(reduceMotion);
