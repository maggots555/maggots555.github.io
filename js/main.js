/**
 * Portafolio — JavaScript mínimo
 *
 * EXPLICACIÓN PARA PRINCIPIANTES:
 * GitHub Pages solo sirve HTML/CSS/JS. Este archivo no habla con Django.
 * Hace tres cosas pequeñas:
 *  1) Pone la fecha de hoy en la cabecera.
 *  2) Pone el año en el pie de página.
 *  3) Galería: si falta una captura, muestra un recuadro;
 *     si existe, permite ampliarla en un lightbox.
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

  iniciarGalería();

  /**
   * Recorre cada figura de la galería.
   * - Si la imagen no carga (aún no subiste el archivo), pinta un placeholder.
   * - Si carga bien, un clic abre el <dialog> con la foto grande.
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

      // Si el archivo no existe, el error a veces ocurre ANTES de colgar
      // el listener. complete + naturalWidth 0 = imagen fallida ya.
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

    // Cerrar el lightbox al hacer clic en el fondo oscuro
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
})();
