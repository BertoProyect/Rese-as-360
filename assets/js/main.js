(function () {
  "use strict";

  // Número de WhatsApp al que van todos los botones (sin + ni espacios)
  var PHONE = "34621365147";
  var DEFAULT_MSG = "Hola, quiero información sobre las tarjetas de Reseñas 360 para mi negocio.";

  document.querySelectorAll(".wa-link").forEach(function (a) {
    var msg = a.getAttribute("data-msg") || DEFAULT_MSG;
    a.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg);
  });

  // Patrón decorativo tipo QR en la ilustración (no es un código escaneable)
  var qr = document.getElementById("qr");
  if (qr) {
    var n = 11, seed = 7, html = "";
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var finder = function (r, c) {
      var corners = [[0, 0], [0, n - 5], [n - 5, 0]];
      for (var k = 0; k < corners.length; k++) {
        var R = corners[k][0], C = corners[k][1];
        if (r >= R && r < R + 5 && c >= C && c < C + 5) {
          var dr = r - R, dc = c - C;
          var border = dr === 0 || dr === 4 || dc === 0 || dc === 4;
          var center = dr === 2 && dc === 2;
          return border || center ? 1 : 0;
        }
      }
      return -1;
    };
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        var f = finder(r, c);
        var on = f === -1 ? rnd() > 0.5 : f === 1;
        html += '<i class="' + (on ? "on" : "") + '"></i>';
      }
    }
    qr.innerHTML = html;
  }

  // Botón "Copiar" del número
  var btn = document.getElementById("copyBtn");
  var num = document.getElementById("num");
  if (btn && num) {
    btn.addEventListener("click", function () {
      var txt = num.textContent.trim();
      var done = function () {
        btn.textContent = "Copiado";
        setTimeout(function () { btn.textContent = "Copiar"; }, 1800);
      };
      var fallback = function () {
        var range = document.createRange();
        range.selectNodeContents(num);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        btn.textContent = "Selecciónalo y copia";
      };
      try {
        navigator.clipboard.writeText(txt).then(done, fallback);
      } catch (e) {
        fallback();
      }
    });
  }

  // Año del pie
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
