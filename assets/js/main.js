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


  /* ------------------------------------------------------------------
     BorderGlow — portado de React Bits (https://reactbits.dev) a JS sin React.
     Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0.
     Se configura con atributos data-* en cada .border-glow-card.
     En móvil (sin hover) hace un barrido una vez cuando la tarjeta entra en pantalla.
     ------------------------------------------------------------------ */
  (function borderGlow() {
    var cards = document.querySelectorAll(".border-glow-card");
    if (!cards.length) return;

    var GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
    var GRADIENT_KEYS = ["--gradient-one", "--gradient-two", "--gradient-three", "--gradient-four", "--gradient-five", "--gradient-six", "--gradient-seven"];
    var COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var noHover = window.matchMedia && window.matchMedia("(hover: none)").matches;

    function parseHSL(str) {
      var m = String(str).match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
      return m ? { h: +m[1], s: +m[2], l: +m[3] } : { h: 212, s: 90, l: 58 };
    }
    function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
    function easeInCubic(x) { return x * x * x; }
    function animateValue(o) {
      var start = o.start || 0, end = o.end == null ? 100 : o.end, duration = o.duration || 1000;
      var delay = o.delay || 0, ease = o.ease || easeOutCubic;
      setTimeout(function () {
        var t0 = performance.now();
        (function tick() {
          var t = Math.min((performance.now() - t0) / duration, 1);
          o.onUpdate(start + (end - start) * ease(t));
          if (t < 1) requestAnimationFrame(tick); else if (o.onEnd) o.onEnd();
        })();
      }, delay);
    }

    function setup(card) {
      var d = card.dataset;
      var colors = (d.colors || "#2f8bf5,#ffbe0b,#7cc4ff").split(",").map(function (c) { return c.trim(); });
      var hsl = parseHSL(d.glowColor || "212 90 58");
      var intensity = parseFloat(d.glowIntensity || "1");
      var base = hsl.h + "deg " + hsl.s + "% " + hsl.l + "%";
      var opac = [100, 60, 50, 40, 30, 20, 10];
      var keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
      for (var i = 0; i < opac.length; i++) {
        card.style.setProperty("--glow-color" + keys[i], "hsl(" + base + " / " + Math.min(opac[i] * intensity, 100) + "%)");
      }
      for (var j = 0; j < 7; j++) {
        var c = colors[Math.min(COLOR_MAP[j], colors.length - 1)];
        card.style.setProperty(GRADIENT_KEYS[j], "radial-gradient(at " + GRADIENT_POSITIONS[j] + ", " + c + " 0px, transparent 50%)");
      }
      card.style.setProperty("--gradient-base", "linear-gradient(" + colors[0] + " 0 100%)");
      if (d.edgeSensitivity) card.style.setProperty("--edge-sensitivity", d.edgeSensitivity);
      if (d.borderRadius) card.style.setProperty("--border-radius", d.borderRadius + "px");
      if (d.glowRadius) card.style.setProperty("--glow-padding", d.glowRadius + "px");
      if (d.coneSpread) card.style.setProperty("--cone-spread", d.coneSpread);

      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        var cx = r.width / 2, cy = r.height / 2;
        var dx = x - cx, dy = y - cy;
        var kx = dx !== 0 ? cx / Math.abs(dx) : Infinity;
        var ky = dy !== 0 ? cy / Math.abs(dy) : Infinity;
        var edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
        var angle = 0;
        if (dx !== 0 || dy !== 0) {
          angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
          if (angle < 0) angle += 360;
        }
        card.style.setProperty("--edge-proximity", (edge * 100).toFixed(3));
        card.style.setProperty("--cursor-angle", angle.toFixed(3) + "deg");
      });
    }

    function sweep(card) {
      var a0 = 110, a1 = 465;
      card.classList.add("sweep-active");
      card.style.setProperty("--cursor-angle", a0 + "deg");
      animateValue({ duration: 500, onUpdate: function (v) { card.style.setProperty("--edge-proximity", v); } });
      animateValue({ ease: easeInCubic, duration: 1500, end: 50, onUpdate: function (v) {
        card.style.setProperty("--cursor-angle", ((a1 - a0) * (v / 100) + a0) + "deg");
      } });
      animateValue({ ease: easeOutCubic, delay: 1500, duration: 2250, start: 50, end: 100, onUpdate: function (v) {
        card.style.setProperty("--cursor-angle", ((a1 - a0) * (v / 100) + a0) + "deg");
      } });
      animateValue({ ease: easeInCubic, delay: 2500, duration: 1500, start: 100, end: 0,
        onUpdate: function (v) { card.style.setProperty("--edge-proximity", v); },
        onEnd: function () { card.classList.remove("sweep-active"); } });
    }

    cards.forEach(setup);

    if (!reduceMotion && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var card = en.target;
          io.unobserve(card);
          if (noHover || card.dataset.animated === "true") sweep(card);
        });
      }, { threshold: 0.6 });
      cards.forEach(function (c) { io.observe(c); });
    }
  })();


  /* ------------------------------------------------------------------
     Counter — portado de React Bits (https://reactbits.dev) a JS sin React.
     Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0.
     Las cifras ruedan desde 0 hasta el valor cuando el contador entra en pantalla.
     ------------------------------------------------------------------ */
  (function counters() {
    var els = document.querySelectorAll("[data-counter]");
    if (!els.length) return;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    els.forEach(function (el) {
      var value = parseInt(el.getAttribute("data-counter"), 10) || 0;
      var places = (el.getAttribute("data-places") || "").split(",").map(function (p) { return parseInt(p, 10); }).filter(Boolean);
      if (!places.length) {
        places = String(value).split("").map(function (_, i, a) { return Math.pow(10, a.length - i - 1); });
      }
      el.textContent = "";
      var cols = [];
      places.forEach(function (place) {
        var digit = document.createElement("span");
        digit.className = "counter-digit";
        var col = document.createElement("span");
        col.className = "counter-col no-anim";
        for (var i = 0; i < 10; i++) {
          var n = document.createElement("span");
          n.textContent = i;
          col.appendChild(n);
        }
        var target = Math.floor(value / place) % 10;
        col.style.setProperty("--n", reduceMotion ? target : 0);
        digit.appendChild(col);
        el.appendChild(digit);
        cols.push({ col: col, target: target });
      });

      function roll() {
        cols.forEach(function (c, idx) {
          c.col.classList.remove("no-anim");
          c.col.style.transitionDelay = (idx * 120) + "ms";
          c.col.style.setProperty("--n", c.target);
        });
      }

      if (reduceMotion) return;
      // Forzar el estado inicial antes de animar
      void el.offsetHeight;
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { io.disconnect(); roll(); }
          });
        }, { threshold: 0.5 });
        io.observe(el);
      } else {
        roll();
      }
    });
  })();

  // Año del pie
  document.querySelectorAll(".year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
