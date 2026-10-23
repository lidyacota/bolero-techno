/* BOLERO TECHNO · páginas interiores: menú móvil y video de YouTube bajo demanda */
(function () {
  "use strict";

  var enc = document.querySelector(".encabezado");
  var mb = document.querySelector(".menu-boton");
  if (enc && mb) {
    mb.addEventListener("click", function () {
      var abierto = enc.classList.toggle("menu-abierto");
      mb.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
  }
  if (enc) {
    var marcar = function () { enc.classList.toggle("con-fondo", window.scrollY > 40); };
    window.addEventListener("scroll", marcar, { passive: true });
    marcar();
  }

  // El reproductor de YouTube se carga solo al dar clic: la página abre más rápido.
  document.querySelectorAll(".video-portada").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-video");
      var titulo = btn.getAttribute("data-titulo") || "Bolero Techno";
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1";
      f.title = titulo;
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true;
      f.referrerPolicy = "strict-origin-when-cross-origin";
      btn.replaceWith(f);
    });
  });

  var video = document.querySelector(".fondo-video video");
  if (video && window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.pause();
})();
