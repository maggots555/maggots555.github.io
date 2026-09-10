/**
 * Portafolio — TypeScript mínimo (corre en el navegador).
 *
 * EXPLICACIÓN PARA PRINCIPIANTES:
 * Astro genera HTML. Este archivo se empaqueta y se manda al visitante.
 * No habla con Django ni con una base de datos.
 *  1) Fecha de hoy y año del pie.
 *  2) Galería + lightbox.
 *  3) Barra de luz + parallax (figura, título, recorrido).
 *  4) Revelar títulos al entrar en pantalla (Intersection Observer).
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
iniciarGalería();
iniciarScroll(reduceMotion);
iniciarRevelado(reduceMotion);
