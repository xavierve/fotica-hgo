document.documentElement.classList.add('js');

/* === Slider: desplazar una tarjeta por clic. Sin JS, la pista sigue siendo
   scrollable por arrastre/rueda (scroll-snap CSS). === */
document.querySelectorAll('.block-slider').forEach(function (bloque) {
  var track = bloque.querySelector('.slider-track');
  if (!track) return;
  function paso() {
    var slide = track.querySelector('.slide');
    return slide ? slide.offsetWidth + 16 : 320;
  }
  bloque.querySelector('[data-slider-prev]')?.addEventListener('click', function () {
    track.scrollBy({ left: -paso(), behavior: 'smooth' });
  });
  bloque.querySelector('[data-slider-next]')?.addEventListener('click', function () {
    track.scrollBy({ left: paso(), behavior: 'smooth' });
  });
});

/* === Gallery lightbox: <dialog> nativo (foco, Escape y backdrop gratis).
   Flechas de teclado para navegar; los datos vienen del JSON embebido. === */
document.querySelectorAll('.block-gallery').forEach(function (bloque) {
  var dlg = bloque.querySelector('.gallery-lightbox');
  if (!dlg || !dlg.showModal) return; // navegador sin <dialog>: la imagen queda como está
  var items = JSON.parse(dlg.querySelector('script[type="application/json"]').textContent);
  var img = dlg.querySelector('img'), cap = dlg.querySelector('figcaption'), i = 0;

  function mostrar(n) {
    i = (n + items.length) % items.length;
    img.src = items[i].image;
    img.alt = items[i].imageAlt || '';
    cap.textContent = items[i].legend || '';
  }
  bloque.addEventListener('click', function (e) {
    var btn = e.target.closest('.gallery-open');
    if (!btn) return;
    mostrar(+btn.dataset.galleryIndex);
    dlg.showModal();
  });
  dlg.querySelector('[data-lightbox-close]').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('[data-lightbox-prev]').addEventListener('click', function () { mostrar(i - 1); });
  dlg.querySelector('[data-lightbox-next]').addEventListener('click', function () { mostrar(i + 1); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') mostrar(i - 1);
    if (e.key === 'ArrowRight') mostrar(i + 1);
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // clic en el fondo
});

/* === Efectos de visualización (reveal on scroll + counter) ===
   Orquestación: IntersectionObserver marca .is-visible al entrar en viewport;
   el CSS hace el resto. Hijos designados reciben retardo escalonado (stagger).
   Todo desactivado si el usuario pide movimiento reducido. === */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var STAGGER = ['.card', '.counter-item', '.team-card', '.testimonial', '.timeline-list li'];

  // preparar objetivos: cada bloque + su interior escalonado
  document.querySelectorAll('.block, .hero-copy').forEach(function (el) {
    el.classList.add('reveal');
    STAGGER.forEach(function (sel) {
      el.querySelectorAll(sel).forEach(function (hijo, i) {
        hijo.classList.add('reveal-child');
        hijo.style.setProperty('--reveal-delay', Math.min(i * 90, 450) + 'ms');
      });
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      if (entry.target.matches('.block-counter.is-animated')) contar(entry.target);
      io.unobserve(entry.target); // una sola vez: sin re-animar al hacer scroll arriba
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* Counter: cuenta de 0 al valor, conservando el formato original
     (separador de miles, sufijos como “+”). */
  function contar(bloque) {
    bloque.querySelectorAll('.counter-item strong').forEach(function (el) {
      var texto = el.textContent.trim();
      var digitos = texto.replace(/[^\d]/g, '');
      if (!digitos) return;
      var objetivo = parseInt(digitos, 10);
      var t0 = null, DURACION = 1200;
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / DURACION, 1);
        p = 1 - Math.pow(1 - p, 3); // easeOutCubic
        var actual = Math.round(objetivo * p).toString();
        // re-inyectar el valor en el formato original, dígito a dígito de derecha a izquierda
        var res = '', j = actual.length - 1;
        for (var k = texto.length - 1; k >= 0; k--) {
          res = (/\d/.test(texto[k]) ? (j >= 0 ? actual[j--] : '') : texto[k]) + res;
        }
        // separadores de miles huérfanos en valores intermedios (".800" → "800")
        res = res.replace(/(^|[^\d])[.,](?=\d)/g, '$1');
        el.textContent = res;
        if (p < 1) requestAnimationFrame(frame);
        else masUno(el, texto, objetivo);
      }
      requestAnimationFrame(frame);
    });
  }

  /* plusOne: pausa dramática y sube 1 más, con burbuja explicativa.
     El texto viene del contenido (data-plus-one), no del tema. */
  function masUno(el, formato, valor) {
    var item = el.closest('[data-plus-one]');
    if (!item) return;
    setTimeout(function () {
      el.classList.add('counter-tick');
      // re-usar el formateo: inyectar valor+1 en el formato original
      var nuevo = (valor + 1).toString(), res = '', j = nuevo.length - 1;
      for (var k = formato.length - 1; k >= 0; k--) {
        res = (/\d/.test(formato[k]) ? (j >= 0 ? nuevo[j--] : '') : formato[k]) + res;
      }
      if (j >= 0) res = nuevo.slice(0, j + 1) + res; // el +1 añade dígito (999→1000)
      el.textContent = res;
      var globo = document.createElement('span');
      globo.className = 'counter-plus';
      globo.textContent = item.dataset.plusOne;
      item.appendChild(globo);
      requestAnimationFrame(function () { globo.classList.add('is-shown'); });
    }, 1100);
  }
})();
