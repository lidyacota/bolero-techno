/* BOLERO TECHNO · portada con hojas flotantes en 3D
   Estado 0 = introducción; estados 1…N = cada poema. */
(function () {
  "use strict";

  var datos = JSON.parse(document.getElementById("datos-poemas").textContent);
  var N = datos.length;
  var body = document.body;
  var mundo = document.getElementById("mundo");
  var hojas = Array.prototype.slice.call(document.querySelectorAll(".hoja"));
  var botones = Array.prototype.slice.call(document.querySelectorAll(".pista-numeros button"));
  var progreso = document.querySelector(".pista-progreso");
  var ficha = {
    caja: document.getElementById("ficha-cambia"),
    num: document.getElementById("ficha-num"),
    titulo: document.getElementById("ficha-titulo"),
    dur: document.getElementById("ficha-dur"),
    pags: document.getElementById("ficha-pags"),
    gen: document.getElementById("ficha-gen"),
    ir: document.getElementById("ficha-ir")
  };
  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var estado = -1;
  var W = window.innerWidth, H = window.innerHeight;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // generador pseudoaleatorio con semilla: cada estado tiene su propia constelación
  function azar(semilla) {
    var t = semilla >>> 0;
    return function () {
      t += 0x6D2B79F5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function entre(r, a, b) { return a + (b - a) * r(); }

  function posiciones(s) {
    var movil = W < 900;
    var res = [];
    var activa = s - 1;
    for (var i = 0; i < N; i++) {
      var r = azar(s * 7919 + i * 104729 + 17);
      var p;
      if (i === activa) {
        p = movil
          ? { x: 0, y: -H * 0.2, z: -40, rx: 2, ry: -4, rz: 0, o: 1 }
          : { x: W * 0.2, y: -H * 0.02, z: 60, rx: 2, ry: -12, rz: 0, o: 1 };
      } else if (s > 0 && Math.abs(i - activa) <= 2) {
        // las vecinas se juntan detrás de la hoja activa, como discos apilados
        var d = i - activa;
        var bx = movil ? 0 : W * 0.2;
        var by = movil ? -H * 0.2 : -H * 0.02;
        p = {
          x: bx + d * (movil ? 46 : 70) + entre(r, -20, 20),
          y: by + d * 18 + entre(r, -24, 24),
          z: -260 * Math.abs(d) - 120,
          rx: entre(r, -6, 6), ry: -12 + d * 7, rz: d * 3,
          o: 0.75 - Math.abs(d) * 0.12
        };
      } else {
        var x, y, z, intento = 0, libre;
        var zmin = s === 0 ? -2600 : -3000, zmax = s === 0 ? -650 : -1100;
        do {
          x = entre(r, -0.8, 0.8) * W;
          y = entre(r, -0.66, 0.66) * H;
          z = entre(r, zmin, zmax);
          intento++;
          // deja libre el centro (título) o la zona de la hoja activa y la ficha
          if (s === 0) {
            libre = !(Math.abs(x) < W * (movil ? 0.42 : 0.36) && Math.abs(y) < H * 0.3);
          } else if (movil) {
            libre = !(Math.abs(x) < W * 0.5 && y > -H * 0.42 && y < H * 0.05);
          } else {
            libre = !(x > -W * 0.1 && x < W * 0.5 && Math.abs(y) < H * 0.4) && !(x < -W * 0.05 && Math.abs(y) < H * 0.32);
          }
        } while (!libre && intento < 20);
        var prof = (z - zmin) / (zmax - zmin); // 0 lejos … 1 cerca
        p = {
          x: x, y: y, z: z,
          rx: entre(r, -14, 14), ry: entre(r, -38, 38), rz: entre(r, -10, 10),
          o: s === 0 ? 0.32 + prof * 0.45 : 0.16 + prof * 0.3
        };
      }
      res.push(p);
    }
    return res;
  }

  function aplicar(s) {
    var pos = posiciones(s);
    hojas.forEach(function (h, i) {
      var p = pos[i];
      h.style.transform =
        "translate3d(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px," + p.z.toFixed(1) + "px)" +
        " rotateX(" + p.rx.toFixed(2) + "deg) rotateY(" + p.ry.toFixed(2) + "deg) rotateZ(" + p.rz.toFixed(2) + "deg)";
      h.style.opacity = p.o.toFixed(2);
      h.style.zIndex = String(Math.round(p.z + 3000));
      h.classList.toggle("activa", i === s - 1);
      h.setAttribute("tabindex", i === s - 1 ? "0" : "-1");
    });
  }

  function actualizarFicha(s) {
    if (s < 1) return;
    var d = datos[s - 1];
    var poner = function () {
      ficha.num.innerHTML = pad(d.n) + "<small>/ " + N + "</small>";
      ficha.titulo.textContent = d.titulo;
      ficha.titulo.classList.toggle("cursiva", !!d.cursiva);
      ficha.dur.textContent = d.dur;
      ficha.pags.textContent = d.pags;
      ficha.gen.textContent = d.generos;
      ficha.ir.href = d.url;
      ficha.ir.setAttribute("aria-label", "Ver y escuchar " + d.titulo);
      ficha.caja.classList.remove("saliendo");
    };
    if (estado > 0 && !reducido) {
      ficha.caja.classList.add("saliendo");
      setTimeout(poner, 380);
    } else {
      poner();
    }
  }

  function ir(s, sinHistoria) {
    s = Math.max(0, Math.min(N, s));
    if (s === estado) return;
    actualizarFicha(s);
    estado = s;
    body.classList.toggle("en-poema", s > 0);
    aplicar(s);
    botones.forEach(function (b, i) { b.setAttribute("aria-current", i === s - 1 ? "true" : "false"); });
    progreso.style.width = (s / N * 100) + "%";
    if (s > 0 && botones[s - 1]) {
      var b = botones[s - 1], lista = b.parentNode.parentNode;
      if (lista.scrollWidth > lista.clientWidth) {
        lista.scrollTo({ left: b.offsetLeft - lista.clientWidth / 2, behavior: reducido ? "auto" : "smooth" });
      }
    }
    if (!sinHistoria) {
      var hash = s > 0 ? "#" + datos[s - 1].slug : " ";
      history.replaceState(null, "", s > 0 ? hash : location.pathname);
    }
    document.title = s > 0
      ? datos[s - 1].titulo + " · Bolero Techno"
      : document.documentElement.getAttribute("data-titulo");
  }

  // ---------- Interacción ----------
  hojas.forEach(function (h, i) {
    h.addEventListener("click", function (e) {
      if (i !== estado - 1) { e.preventDefault(); ir(i + 1); }
    });
  });
  botones.forEach(function (b, i) { b.addEventListener("click", function () { ir(i + 1); }); });
  document.getElementById("anterior").addEventListener("click", function () { ir(estado - 1); });
  document.getElementById("siguiente").addEventListener("click", function () { ir(estado >= N ? 1 : estado + 1); });
  document.getElementById("empezar").addEventListener("click", function (e) { e.preventDefault(); ir(1); });
  document.querySelectorAll("[data-ir-inicio]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); ir(0); cerrarMenu(); });
  });

  var bloqueo = 0;
  window.addEventListener("wheel", function (e) {
    var ahora = Date.now();
    if (ahora < bloqueo || Math.abs(e.deltaY) < 12) return;
    bloqueo = ahora + 1100;
    ir(estado + (e.deltaY > 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener("keydown", function (e) {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); ir(estado + 1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); ir(estado - 1); }
    else if (e.key === "Home") ir(0);
    else if (e.key === "End") ir(N);
    else if (e.key === "Enter" && estado > 0 && document.activeElement === body) location.href = datos[estado - 1].url;
  });

  var toque = null;
  window.addEventListener("touchstart", function (e) {
    if (e.target.closest(".pista, .encabezado")) { toque = null; return; }
    toque = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  window.addEventListener("touchend", function (e) {
    if (!toque) return;
    var dx = e.changedTouches[0].clientX - toque.x, dy = e.changedTouches[0].clientY - toque.y;
    var d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
    if (Math.abs(d) > 45) ir(estado + (d < 0 ? 1 : -1));
    toque = null;
  }, { passive: true });

  // ---------- Paralaje con el ratón ----------
  var mx = 0, my = 0, cx = 0, cy = 0;
  window.addEventListener("mousemove", function (e) {
    mx = e.clientX / W * 2 - 1;
    my = e.clientY / H * 2 - 1;
  });
  function animar() {
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;
    mundo.style.transform =
      "translate3d(" + (-cx * 26).toFixed(2) + "px," + (-cy * 16).toFixed(2) + "px,0)" +
      " rotateY(" + (cx * 6).toFixed(3) + "deg) rotateX(" + (-cy * 4.5).toFixed(3) + "deg)";
    requestAnimationFrame(animar);
  }
  if (!reducido) requestAnimationFrame(animar);

  var temporizador;
  window.addEventListener("resize", function () {
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      W = window.innerWidth; H = window.innerHeight;
      aplicar(estado);
    }, 150);
  });

  // ---------- Menú móvil ----------
  var enc = document.querySelector(".encabezado");
  function cerrarMenu() { enc.classList.remove("menu-abierto"); }
  var mb = document.querySelector(".menu-boton");
  if (mb) mb.addEventListener("click", function () {
    var abierto = enc.classList.toggle("menu-abierto");
    mb.setAttribute("aria-expanded", abierto ? "true" : "false");
  });

  // ---------- Inicio ----------
  function desdeHash() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (!h) return 0;
    if (/^\d+$/.test(h)) return parseInt(h, 10);
    for (var i = 0; i < N; i++) if (datos[i].slug === h) return i + 1;
    return 0;
  }
  // primero todo disperso y lejos; luego entra a su lugar
  hojas.forEach(function (h) {
    h.style.transition = "none";
    h.style.opacity = "0";
    h.style.transform = "translate3d(0,0,-4200px)";
  });
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      hojas.forEach(function (h) { h.style.transition = ""; });
      ir(desdeHash(), true);
    });
  });
  window.addEventListener("hashchange", function () { ir(desdeHash(), true); });

  var video = document.querySelector(".fondo-video video");
  if (video && reducido) video.pause();
})();
