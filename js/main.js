/**
 * Portafolio — JavaScript mínimo
 *
 * EXPLICACIÓN PARA PRINCIPIANTES:
 * GitHub Pages solo sirve HTML/CSS/JS. Este archivo no habla con Django.
 *  1) Fecha de hoy y año del pie.
 *  2) Galería + lightbox.
 *  3) Revelar bloques al hacer scroll (Intersection Observer).
 *  4) Barra de tinta según cuánto has bajado.
 */

(function () {
  "use strict";

  var fechaNodo = document.getElementById("folio-fecha");
  if (fechaNodo) {
    var ahora = new Date();
    var yyyy = ahora.getFullYear();
    var mm = String(ahora.getMonth() + 1).padStart(2, "0");
    var dd = String(ahora.getDate()).padStart(2, "0");
    var iso = yyyy + "-" + mm + "-" + dd;
    fechaNodo.textContent = iso;
    fechaNodo.setAttribute("datetime", iso);
  }

  var anioNodo = document.getElementById("anio");
  if (anioNodo) {
    anioNodo.textContent = String(new Date().getFullYear());
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  iniciarGalería();
  iniciarRevelado(reduceMotion);
  iniciarTinta(reduceMotion);

  /**
   * Recorre cada figura de la galería.
   * - Si la imagen no carga, pinta un placeholder.
   * - Si carga, un clic abre el <dialog> con la foto grande.
   */
  function iniciarGalería() {
    var dialogo = document.getElementById("lightbox");
    var dialogoImg = document.getElementById("lightbox-img");
    var dialogoCap = document.getElementById("lightbox-cap");
    var figuras = document.querySelectorAll(".shot");

    figuras.forEach(function (figura) {
      var img = figura.querySelector("img");
      if (!img) {
        return;
      }

      img.addEventListener("error", function () {
        mostrarPlaceholder(figura, img);
      });

      if (img.complete && img.naturalWidth === 0) {
        mostrarPlaceholder(figura, img);
      }

      figura.addEventListener("click", function () {
        if (figura.classList.contains("is-empty") || !dialogo || !dialogoImg) {
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

    if (dialogo) {
      dialogo.addEventListener("click", function (evento) {
        if (evento.target === dialogo) {
          dialogo.close();
        }
      });
    }
  }

  function mostrarPlaceholder(figura, img) {
    if (figura.classList.contains("is-empty")) {
      return;
    }
    figura.classList.add("is-empty");
    var pie = figura.querySelector("figcaption");
    var titulo = pie ? pie.textContent : "Captura";
    var caja = document.createElement("div");
    caja.className = "shot-ph";
    caja.setAttribute("aria-hidden", "true");
    caja.textContent = "Pendiente: " + titulo.trim() + "\n(assets/sigma/)";
    img.replaceWith(caja);
  }

  /**
   * Cuando un bloque .reveal entra en pantalla, le ponemos .is-in.
   * El CSS hace el fade. Solo una vez (unobserve).
   */
  function iniciarRevelado(sinMovimiento) {
    var nodos = document.querySelectorAll(".reveal");
    if (sinMovimiento || !("IntersectionObserver" in window)) {
      nodos.forEach(function (nodo) {
        nodo.classList.add("is-in");
      });
      return;
    }

    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-in");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "40px 0px 40px 0px" }
    );

    nodos.forEach(function (nodo) {
      observador.observe(nodo);
    });
  }

  /**
   * La barra ámbar usa scaleX (GPU). 0 = arriba, 1 = final de la página.
   */
  function iniciarTinta(sinMovimiento) {
    var barra = document.getElementById("scroll-ink-bar");
    if (!barra || sinMovimiento) {
      return;
    }

    function pintar() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
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
})();
