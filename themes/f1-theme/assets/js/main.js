document.documentElement.classList.add('js');

/* Cada bloque independiente de este archivo va dentro de aislar(): si uno lanza
   una excepcion, se registra y los demas siguen. Sin esto, una excepcion (p.ej. el
   JSON.parse de la galeria) abortaba el resto del script y arrastraba bloques
   que no tienen nada que ver: el menu movil, que es el UNICO acceso a la
   navegacion por debajo de 821px, esta el ultimo de todos.
   No cubre los errores de SINTAXIS (el script entero no se parsea y nada corre):
   de esos protege `node -c themes/f1-theme/assets/js/main.js` antes de commitear. */
function aislar(nombre, fn) {
  try {
    fn();
  } catch (e) {
    if (window.console) console.error('main.js: fallo en el bloque "' + nombre + '"; el resto sigue', e);
  }
}

/* La barra fija es una accion de contacto y esta oculta bajo html.js-boot (clase
   puesta en el <head>) hasta que este codigo la muestre. Ya no hace falta que
   este bloque vaya el primero para protegerlo de fallos de los demas: cada
   bloque esta aislado con aislar(). Los fallos de CARGA de main.js los cubre el
   onerror del <script> en baseof.html. */
/* === Barra fija y boton volver-arriba: cuando mostrarlos ===
   UNA sola senal para las dos piezas: un IntersectionObserver (no un listener
   de scroll: solo dispara al cruzar el umbral, sin trabajo en cada pixel).
   Alternan JUNTAS, como una unidad: sobre el hero no hay ni barra ni boton;
   fuera del hero aparecen las dos. Misma clase (is-visible), mismo callback. Si
   solo alternara el boton, al volver al hero quedaria la barra con 60px
   reservados y un filete sin nada dentro.

   El criterio es POSICIONAL y determinista (el hero esta o no en el viewport),
   no un patron de "ocultar segun la direccion del scroll": el mismo scroll da
   siempre el mismo estado.

   Sin hero (paginas futuras; hoy las 28 lo llevan) se observa un centinela
   invisible de un viewport de alto: mismo umbral, mismo efecto.

   Sin IntersectionObserver no hay senal: la barra es una accion de contacto,
   asi que se muestra ya en lugar de quedarse oculta bajo html.js. === */
aislar('barra fija y volver-arriba', function () {
  var boton = document.querySelector('.back-to-top');
  var barra = document.querySelector('.sticky-cta');
  if (!boton && !barra) return;

  if (!('IntersectionObserver' in window)) {
    if (barra) barra.classList.add('is-visible');
    return;
  }

  /* DOS SENALES, porque barra y boton no viven igual en todos los anchos:

     - asoma: el elemento que sigue al hero ya ensena 40px. Es la de MOVIL
       (< 821px): alli barra y boton son una unidad dentro de la barra, y si
       uno apareciera sin el otro quedaria el hueco reservado vacio. La barra
       entra antes que con la salida del hero, cuando empieza lo siguiente.
     - salida: el hero ha salido por arriba. Es la del boton en ESCRITORIO
       (>= 821px), donde no hay barra. Alli no vale "asoma": en los heros que
       caben en pantalla (split) lo siguiente ya se ve al cargar, y el boton
       saldria estando arriba del todo.

     Efecto aceptado: en movil, una pagina cuyo hero quepa en la primera
     pantalla muestra la barra al cargar, porque lo siguiente ya asoma. */
  var escritorio = window.matchMedia('(min-width: 821px)');
  var asoma = false;
  var salida = false;

  function aplicar() {
    if (barra) barra.classList.toggle('is-visible', asoma);
    if (boton) boton.classList.toggle('is-visible', escritorio.matches ? salida : asoma);
  }
  if (escritorio.addEventListener) escritorio.addEventListener('change', aplicar);
  else if (escritorio.addListener) escritorio.addListener(aplicar);

  var hero = document.querySelector('.hero');

  if (!hero) {
    // Sin hero: centinela de un viewport de alto. Las dos senales son la misma.
    var centinela = document.createElement('div');
    centinela.className = 'scroll-sentinel';
    centinela.setAttribute('aria-hidden', 'true');
    centinela.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:100svh;pointer-events:none;visibility:hidden';
    document.body.appendChild(centinela);
    new IntersectionObserver(function (entries) {
      salida = asoma = !entries[0].isIntersecting;
      aplicar();
    }, { threshold: 0 }).observe(centinela);
    return;
  }

  // Primer hermano CON ALTURA tras el hero: un elemento vacio u oculto tiene
  // la caja a cero y nunca llegaria a intersectar.
  var siguiente = hero.nextElementSibling;
  while (siguiente && siguiente.offsetHeight === 0) siguiente = siguiente.nextElementSibling;

  new IntersectionObserver(function (entries) {
    // El hero solo puede salir por arriba: no intersectar = ya lo has pasado.
    salida = !entries[0].isIntersecting;
    if (!siguiente) asoma = salida;
    aplicar();
  }, { threshold: 0 }).observe(hero);

  if (siguiente) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      /* A diferencia del hero, "no intersecta" significa aqui dos cosas
         opuestas: aun no ha llegado (esta por debajo) o ya lo has pasado (esta
         por encima). Sin mirar la posicion, la barra desapareceria al seguir
         bajando. Por encima de la pantalla cuenta como asomado.
         rootMargin -40px abajo: salta cuando el borde superior del elemento ha
         subido 40px por encima del borde inferior de la pantalla. */
      asoma = e.isIntersecting || e.boundingClientRect.top < 0;
      aplicar();
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 }).observe(siguiente);
  }

  if (!boton) return;
  /* El clic NO navega al ancla: un <a href="#top"> deja #top en la URL y una
     entrada de historial por pulsacion, y el boton "atras" acaba dando saltos
     en la misma pagina. Se desplaza a mano y se mueve el foco al destino real
     (#top, tabindex=-1) para que el teclado siga desde arriba. behavior no se
     fija: manda el CSS (scroll-behavior:smooth, o auto con movimiento reducido).
     preventScroll evita que el foco provoque un segundo desplazamiento. */
  boton.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0 });
    var destino = document.getElementById('top');
    if (destino) destino.focus({ preventScroll: true });
  });
});

/* === Slider: desplazar una tarjeta por clic. Sin JS, la pista sigue siendo
   scrollable por arrastre/rueda (scroll-snap CSS). === */
aislar('slider', function () {
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
});

/* === Gallery lightbox: <dialog> nativo (foco, Escape y backdrop gratis).
   Flechas de teclado para navegar; los datos vienen del JSON embebido. === */
aislar('galeria (lightbox)', function () {
  document.querySelectorAll('.block-gallery').forEach(function (bloque) {
    var dlg = bloque.querySelector('.gallery-lightbox');
    if (!dlg || !dlg.showModal) return; // navegador sin <dialog>: la imagen queda como está
    var items = JSON.parse(dlg.querySelector('script[type="application/json"]').textContent);
    var img = dlg.querySelector('img'), cap = dlg.querySelector('figcaption'), i = 0;

    function mostrar(n) {
      i = (n + items.length) % items.length;
      // imageHd si la plantilla la encontro; si no, la base
      img.src = items[i].imageHd || items[i].image;
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
});

/* === Efectos de visualización (reveal on scroll + counter) ===
   Orquestación: IntersectionObserver marca .is-visible al entrar en viewport;
   el CSS hace el resto. Hijos designados reciben retardo escalonado (stagger).
   Todo desactivado si el usuario pide movimiento reducido. === */
aislar('reveal y contador', function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  /* Preparacion y cableado, en try/catch. Todo lo que hay entre añadir la clase
     .reveal (que el CSS oculta bajo .js: opacity:0) y cablear el observer que
     luego añade .is-visible es una ventana en la que una excepcion dejaria el
     contenido oculto para siempre: el CSS lo esconde y nadie lo muestra. Si algo
     falla ahi, se marcan TODOS los .reveal como visibles: .js .reveal.is-visible
     y .js .reveal.is-visible .reveal-child ya devuelven opacity:1, asi que
     perdemos la animacion, no el contenido. */
  try {
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
  } catch (e) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
    if (window.console) console.error('reveal: fallo al preparar la animacion, contenido mostrado sin ella', e);
  }

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
});

/* === Menú móvil: toggle accesible (aria-expanded, cierre con Escape y al
   navegar). Sin él, .site-nav queda inalcanzable por debajo de 821px — no es
   decorativo, es el único acceso a la navegación en móvil. === */
aislar('menu movil', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function cerrar() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var abierto = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') cerrar();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') cerrar();
  });
});

/* === Formulario de contacto: envio por fetch, validacion accesible y confirmacion inline ===
   El <form> funciona SIN este bloque (POST normal, el PHP redirige a /contacto/#recibido):
   esto solo intercepta el submit para no recargar y pintar la confirmacion en su sitio. */
aislar('formulario de contacto', function () {
  var form = document.querySelector('.cf-form');
  if (!form) return;
  var ok = document.getElementById('recibido');
  var alerta = document.getElementById('cf-alert');
  var boton = form.querySelector('.cf-submit');
  var CAMPOS = ['nombre', 'telefono', 'email', 'mensaje', 'acepto'];
  var t0 = Date.now();
  var enviando = false;

  if (ok && location.hash === '#recibido') ok.focus();

  // Con JS se valida aqui, con mensajes propios y accesibles; sin JS queda la validacion nativa.
  form.noValidate = true;

  function texto(clave) { return form.getAttribute('data-msg-' + clave) || ''; }
  function valor(n) { return (form.elements[n].value || '').trim(); }
  function limpiar(n) {
    var c = form.elements[n], e = document.getElementById('cf-' + n + '-error');
    if (!c || !e) return;
    c.removeAttribute('aria-invalid');
    c.removeAttribute('aria-describedby');
    e.hidden = true;
    e.textContent = '';
  }
  function marcar(n, mensaje) {
    var c = form.elements[n], e = document.getElementById('cf-' + n + '-error');
    if (!c || !e) return;
    e.textContent = mensaje;
    e.hidden = false;
    c.setAttribute('aria-invalid', 'true');
    c.setAttribute('aria-describedby', e.id);
  }
  // Pinta los errores y lleva el foco al PRIMER campo con error. Devuelve true si habia alguno.
  function pintar(errores) {
    var primero = null;
    CAMPOS.forEach(function (n) {
      if (errores[n]) { marcar(n, errores[n]); if (!primero) primero = form.elements[n]; } else limpiar(n);
    });
    if (primero) primero.focus();
    return !!primero;
  }
  // Misma validacion que el servidor (enviar.php), que es el que manda.
  function validar() {
    var e = {}, tel = valor('telefono'), m = valor('mensaje').length;
    if (!valor('nombre')) e.nombre = texto('nombre');
    if (!/^[0-9+()\s.\-]{6,30}$/.test(tel) || tel.replace(/\D/g, '').length < 6) e.telefono = texto('telefono');
    if (valor('email') && !/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(valor('email'))) e.email = texto('email');
    if (m < 5 || m > 2000) e.mensaje = texto('mensaje');
    if (!form.elements.acepto.checked) e.acepto = texto('acepto');
    return e;
  }
  function terminar() {
    enviando = false;
    boton.removeAttribute('aria-disabled');
    boton.textContent = form.getAttribute('data-label-send');
  }
  function exito() {
    form.reset();
    ok.classList.add('is-shown');   // oculta el formulario (CSS: .cf-ok.is-shown ~ .cf-main)
    ok.focus();                     // y el foco pasa a la confirmacion (role=status, aria-live=polite)
  }

  form.addEventListener('input', function (ev) { if (CAMPOS.indexOf(ev.target.name) > -1) limpiar(ev.target.name); });
  form.addEventListener('change', function (ev) { if (CAMPOS.indexOf(ev.target.name) > -1) limpiar(ev.target.name); });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (enviando) return;
    alerta.textContent = '';
    if (pintar(validar())) return;

    enviando = true;
    boton.setAttribute('aria-disabled', 'true');
    boton.textContent = form.getAttribute('data-label-sending');
    form.elements._t.value = String(Date.now() - t0);   // ms entre carga y envio (antispam)

    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, credentials: 'same-origin' })
      .then(function (r) {
        return r.json().then(function (j) { return j; }, function () { return null; });
      })
      .then(function (j) {
        if (j && j.ok) { exito(); return; }
        if (j && j.errors && Object.keys(j.errors).length && pintar(j.errors)) return;
        alerta.textContent = (j && j.message) || texto('send');
      }, function () {
        alerta.textContent = texto('network');
      })
      .then(terminar);
  });
});
