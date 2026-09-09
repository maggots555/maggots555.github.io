/**
 * Bitácora de taller — JavaScript mínimo
 *
 * EXPLICACIÓN PARA PRINCIPIANTES:
 * GitHub Pages solo sirve HTML/CSS/JS. Este archivo no habla con Django.
 * Solo actualiza el folio (fecha de hoy) y el año del pie de página.
 */

(function () {
  "use strict";

  var fechaNodo = document.getElementById("folio-fecha");
  if (fechaNodo) {
    var ahora = new Date();
    var yyyy = ahora.getFullYear();
    var mm = String(ahora.getMonth() + 1).padStart(2, "0");
    var dd = String(ahora.getDate()).padStart(2, "0");
    fechaNodo.textContent = "OS-" + yyyy + "-" + mm + "-" + dd;
    fechaNodo.setAttribute("datetime", yyyy + "-" + mm + "-" + dd);
  }

  var anioNodo = document.getElementById("anio");
  if (anioNodo) {
    anioNodo.textContent = String(new Date().getFullYear());
  }
})();
