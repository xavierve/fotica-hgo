# F1 Theme · Changelog

## Sin versión — prosa de bloques con su `<p>`: `partials/md-block.html`

- **Defecto:** `markdownify` renderiza en modo inline y quita el `<p>` cuando el resultado es
  un único párrafo. Los shortcodes ya se habían corregido (ver «`banner`, `testimonial`…» más
  abajo), pero los bloques de `sections:` seguían con `markdownify`: un copy de un solo párrafo
  salía como texto suelto en el `<div>` (sin `<p>` semántico para lectores de pantalla y modo
  lector, y sin el estilo de enlace de `.prose :is(p, …) a`). Los mismos campos con dos párrafos
  sí llevaban `<p>`, así que el HTML dependía de la longitud del texto.
- **Arreglo:** nuevo `partials/md-block.html` (`page.RenderString (dict "display" "block")`),
  usado por `blocks/image-text`, `text`, `text-split`, `banner` y `faq`. Paridad HTML con los
  shortcodes. Los `markdownify` que quedan están dentro de un `<p>` o `<figcaption>`
  (`cta` y `hero` subtitle, `image-text` caption), donde el modo inline es lo correcto.
- **Alcance medido (build real):** 26 de las 30 páginas tenían texto suelto en `image-text` y/o
  en las 134 respuestas de FAQ; tras el cambio, 0. Los enlaces dentro de una respuesta de FAQ
  ahora reciben el color y el subrayado de enlace del prose (antes solo el subrayado, en el
  color del texto).
- **CSS (2 reglas):** `.block .prose>p:only-child { margin-bottom: 0 }` — el párrafo único
  conserva el espaciado que tenía sin `<p>` (si no, cada `image-text` y cada FAQ crecería ~1em);
  con varios párrafos nada cambia. `.text-split-col>:first-child { margin-top: 0 }` — paridad con
  el shortcode, que dentro de `.prose` ya lo tenía.
- **Medido** (Playwright, 28 páginas × 375/820/1280px, imágenes cargadas, con control de ruido):
  misma altura de página que antes en todas, sin desbordes. Cambia solo `/demo/` (±11px a
  375/820, +43px a 1280, por las columnas de `text-split` de `sections:`). Con la FAQ abierta,
  alguna respuesta larga pasa a una línea más en pantallas anchas: ahora respeta el `72ch` de
  `.prose>p`, como cualquier otro párrafo.
- `shortcodes/text-split-item.html`: comentario corregido (decía que el `<p>` único se eliminaba).

## Sin versión — shortcode `obf` + `data-obf` en `main.js`; `noindex` de la 404 en el `<head>`

- **Shortcode `{{< obf text="…" fallback="…" >}}`:** el dato sale del build en base64 dentro de
  `data-obf`, no como texto; `main.js` lo decodifica (UTF-8) y lo escribe con `textContent`
  (bloque `aislar('datos ofuscados')`). Sin JS se lee el `fallback`. Falta `text` → error de build.
  Aplicado al CIF y al domicilio de `/aviso-legal/`; ejemplo en la demo (p15).
- **404:** `partials/seo.html` emite `noindex` cuando `.Kind` es `404` (un `robots` en el front
  matter sigue ganando). Antes la página llevaba dos `robots` (`index, follow` en el `<head>` y
  `noindex` suelto dentro de `<main>`). No se usa `.Store`: `baseof` pinta el `<head>` antes de
  ejecutar `main`, así que un valor puesto desde `404.html` llegaría tarde.

## Sin versión — espaciados: `rem` para el ritmo, `em` para el interior de los bloques

- 49 declaraciones de `main.css` pasan de `rem` a `em`: huecos de rejillas (cards,
  gallery, logos, locations, text-split, image-text, counter, trustbar, slider),
  padding de tarjetas, testimonios, equipo, FAQ, slides y paneles, y márgenes entre
  titular, texto, pie y enlaces. Así `textSize` escala el interior del bloque, no solo
  la letra. Se quedan en `rem`: `--block-pad*`, `.section`, margen entre bloques del
  prose, contenedor, cabecera, footer (incl. `.hours`), formulario y botones.
- **Calibrado ×0,85:** el `1em` de un bloque es el cuerpo (18-20px), no 16px; cada valor
  se escribe 0,85 veces el `rem` anterior, a pasos de `.05em`. Los elementos con letra
  propia (`.cta-eyebrow`, `h3` de ubicaciones, pies) se calculan contra su tamaño.
- **Medido:** con `textSize: m`, espaciados entre −5% y +6% de los anteriores; altura de
  página, de media un 0,18% (máx. 0,83%); cabecera y footer sin cambio. Con `xs`…`xl` la
  relación espaciado/letra es constante, y el ritmo entre bloques, 96px en los cinco.
  Sin desbordes ni fallos de cabecera con la letra por defecto a 16, 20 y 24px.
- Comentario de convención al inicio de `main.css`; DESIGN_TOKENS.md, 3.4. Demo 4.1 y 4.2.

## Sin versión — shortcode `brands-logos` + `brands-logos-item`

- Nuevo shortcode para intercalar la rejilla de logos en el body markdown, con
  el mismo nombre que el bloque (`type: brands-logos` ↔ `{{< brands-logos >}}`).
  Patrón wrapper + items anidados, como `testimonials`; el item no lleva cierre.
- El `<figure>` de cada logo pasa a un partial único,
  `partials/brands-logos-item.html`, que usan el bloque y el shortcode: la
  paridad HTML es estructural, no copiada. Sin CSS nuevo (`.logo-grid`).
- El bloque gana `subtitle` (`.section-subtitle`), como el resto de bloques con rejilla.
- Validación: item fuera de `{{< brands-logos >}}` o sin `image` → error de
  build con la posición; sin `imageAlt` → `WARN`.
- Demo p14 en el prose (dos variantes: por defecto y `bg-color1` centrado).

## Sin versión — respaldo `min-width`/`max-width` en las consultas de ancho

- Las 27 media queries de ancho del CSS, el `matchMedia` de `main.js`, los
  `<source media>` y el `media` del preload del hero llevan detrás de una coma la
  versión antigua, en `em`: `@media (width > 51.25em), (min-width: 51.3125em)`. Un
  navegador sin sintaxis de rango (Safari/iOS < 16.4) descarta la primera y decide la
  segunda, así que conserva el layout de escritorio, los retoques de móvil y
  `.solo-movil`/`.solo-escritorio`. Cada consulta lleva un comentario con su
  equivalencia en px (`/* escritorio: > 820px */`); tabla en DESIGN_TOKENS.md, 3.
- Medido: en un navegador moderno el resultado es idéntico al anterior; en un
  «navegador viejo» simulado (la parte moderna invalidada en CSS, JS y `media=`) es
  idéntico al moderno. 28 páginas × 6 anchos, incluidos 820 y 821.
- Los `sizes` no llevan respaldo. En esos navegadores se descarta la entrada y se
  baja el candidato mayor; si base y `_hd` tienen distinta proporción (5 parejas hoy),
  la imagen cambia de alto según el archivo.
- Receta para eliminar el respaldo cuando deje de hacer falta: un `sed` en
  DESIGN_TOKENS.md, «Respaldo y equivalencias».

## Sin versión — letra del usuario: body en `rem`, breakpoints en `em` con sintaxis de rango

Medido con la letra por defecto del navegador a 16, 20 y 24px (28 páginas, anchos de
320 a 1440, y un barrido de la cabecera de 780 a 1720).

- **`body` en `rem`:** `clamp(1.125rem, 0.25vw + 1.09375rem, 1.25rem)`. A 16px da
  18-20px, igual que antes; con 20px por defecto, 22,5-25px (antes, 20px fijos:
  el texto ignoraba la preferencia del usuario).
- **Breakpoints en `em` y sintaxis de rango:** 820px → `51.25em` (`width > 51.25em`
  escritorio, `width <= 51.25em` móvil, complementarios sin hueco), 1100px →
  `width >= 68.75em`, 393px → `width > 24.5em`. Mismo número en las 27 media
  queries del CSS, `<source media>`, preload del hero, `sizes` y `matchMedia`
  de `main.js`. Los `sizes` que describen un tope en px (`min-width:1440px`) no se tocan.
  Compatibilidad con Safari/iOS < 16.4: ver «respaldo» en la entrada siguiente.
- **Cabecera:** `.header-inner` con ancho `min(max(var(--container), 70rem), 100% - 2rem)`.
  Con letra grande el nav y los botones con texto crecen, y un contenedor fijo en
  1120px comprimía el logo a menos de 190px a partir de 68.75em.
- **`main .btn` parte la etiqueta** (`white-space: normal`) si no cabe en la fila.
  Corrige un fallo que ya existía con la letra por defecto: en el home a 320px,
  «Ver soluciones de audición» medía 322px en 288 y se salía de la pantalla.
  Cabecera, barra fija y footer conservan `nowrap`.
- **Antes (px) → después, con 20px por defecto:** cabecera con el nav o el logo
  comprimido en 840-860px y 1100-1720px → ninguno; 24px: 840-900px y 1100-1720px →
  ninguno. Páginas con desborde horizontal: 0 → 0 (en el paso intermedio, solo con
  `body` y breakpoints convertidos, aparecieron 1 página a 20px y 6 a 24px, por los
  botones `nowrap` y el contenedor fijo).
- **Con 16px el resultado es idéntico** en 168 combinaciones de página y ancho, salvo
  el home a 320px (los dos botones de arriba).
- **Decidido:** sin guiones en los titulares. A 150% y 320px una palabra larga de un
  H1 se parte a mitad de palabra; el guion ocupa ancho donde menos sobra.

## Sin versión — `brands-logos` con formato fijo

- Cada logo va en una caja 2:1 de 160×80 como máximo (`aspect-ratio`,
  `object-fit: contain`), centrada, con pie opcional en `--color-muted`.
  Antes: `max-height: 40px` sin ancho fijo, así que cada logo medía según su
  proporción y la caja no tenía alto hasta cargar la imagen.
- Columnas `minmax(8rem, 1fr)`: dos por fila a 320px (antes, `minmax(240px)`
  dejaba una sola columna en cualquier móvil).
- Formato de archivo en GUIA-IMAGENES: lienzo 320×160, logo centrado, SVG
  preferente. Documentado en BLOCKS.md (no tenía entrada). Demo 9 actualizada,
  con un caso de archivo cuadrado.

## Sin versión — subtítulo y eyebrow como tokens con par `-inverse`

- `--subtitle-color` y `--eyebrow-color` (variables de contexto definidas solo
  en `main.css`, con el valor claro como fallback en cada consumidor) pasan a
  tokens de `:root`: `--color-subtitle` / `--color-subtitle-inverse` y
  `--color-eyebrow` / `--color-eyebrow-inverse`, como `--color-muted`. La regla
  de contextos oscuros solo reasigna cada rol a su `-inverse`. Refactor puro:
  geometría y color idénticos en 28 páginas × 6 anchos.
- Hamburguesa: 44×44 en todos los anchos (decisión de Foco tras probarla a
  320px; el logo encoge y absorbe los px). Retira el corte de 344px de la
  entrada anterior.

## Sin versión — QA visual (oct 2026): desbordes, márgenes, contraste y zonas táctiles

Medido con Playwright antes y después, 28 páginas × 6 anchos (320 a 1440).

- **Desbordes.** `main` y `.site-footer` pasan a `overflow-wrap: anywhere`. Con
  `break-word` en body, el correo del bloque `locations` desbordaba `/contacto/`
  a 320px: un flex item no encoge por debajo de su palabra más larga. Ahora no
  desborda ninguna página en ningún ancho. El header sigue en `break-word`.
- **`.icon { flex-shrink: 0 }`.** Al medirlo salió un fallo previo: el reloj del
  horario del footer se aplastaba (13×20 a 320px, 19,7×22 en escritorio).
- **Margen doble en bloques dentro del body.** Un bloque sin fondo dentro de
  `.prose` restaba otra vez 1rem por lado; ahora su contenido se alinea con el
  texto. Los que tienen fondo (`.has-surface`) conservan ese aire interior.
- **`--color-muted-inverse`** (nuevo token) y una sola regla de "contextos
  oscuros" para muted, subtítulo y eyebrow. `.bg-color2`/`.bg-color3` ya no
  repiten esas variables. Arregla `.section-subtitle` sobre navy (1,78:1 →
  9,7:1), y `.block-variant-contrast` y `.block-counter` heredan lo mismo.
- **Eyebrow:** `--color-accent-text` #8a6d20 → #7f6418 (4,28 → 4,91:1 sobre
  `--bg-color1`). DESIGN_TOKENS distinguía mal "fondo" y "crema"; corregido.
- **`.bg-color4 .btn-outline`** toma `--bg-color4-text` (2,44 → 7,6:1). Demo 15.3.
- **Zonas táctiles:** hamburguesa a 44 de alto siempre, y a 44 de ancho desde
  344px (medido: por debajo, esos 4px se los quitaría al logo). Iconos sociales
  del footer en cajas de 44×44, con el primer icono alineado con la columna.
  Casilla RGPD a 2rem.
- **Desarrollo:** `config/development` activa `buildDrafts`: `/demo/` (draft)
  sale con `hugo server` a secas, en `.dev/`. Producción no cambia.

## Sin versión — `bgMobile` desaparece: `_m` por convención también en fondos

- `img-bg-style.html` detecta la variante móvil por convención (`foto_m.webp`
  junto al `bg`, vía `img-mobile.html`) y emite `--section-bg-mobile` y, si
  existe `foto_m_hd.webp`, `--section-bg-mobile-hd`. Una sola llamada por
  bloque: `(dict "src" .bg)`; `varName` pasa a opcional.
- **Fuera la clave `bgMobile`** en `cta`, `banner` y `counter` (bloques y
  shortcodes). Si aparece, el build se detiene con un `errorf` que explica la
  convención, en vez de ignorarla en silencio. El hero ya funcionaba así.
- Demo 15.5 migrada: ya no usa picsum con `bgMobile` (las URLs externas no
  tienen variantes), sino `314-mantenimiento_audifonos_hero.webp`, que tiene
  `_m` junto al archivo.
- En el contenido real no había ningún `bgMobile`: el HTML de todas las
  páginas, salvo la demo, es idéntico.

## Sin versión — counter con `img-bg-style`

- `counter` montaba `--section-bg` y `--section-bg-mobile` a mano, sin pasar por
  `img-bg-style.html`: nunca recibía la variante `_hd` (ni de `bg` ni de
  `bgMobile`). Ahora usa el partial, igual que `cta` y `banner`.
- FRONTMATTER: la lista de bloques donde funciona la convención `_m` incluía
  `cta` y `banner`, que no pasan por `img-responsive.html` (usan `bgMobile`).
  Corregida, con los bloques que sí la usan.

## Sin versión — hero: política de sitio, overlay con `<img>` y `img-bg-style`

- **Los defectos del hero salen del tema.** El layout por defecto y si
  `overlay` se apila en móvil pasan a `params.hero.layout` y
  `params.hero.mobileOverlay` en el `hugo.toml` del sitio. Sin declararlos, el
  tema usa `overlay` en todos los anchos. Ópticas Fausto declara
  `layout = "stacked"` y `mobileOverlay = false`, así que su HTML no cambia
  (verificado: las 28 páginas generadas son idénticas salvo el CSS).
- **`overlay` pinta la foto con `<img>`** (`<figure class="hero-bg">` detrás del
  copy) en vez de `background-image`. Arregla tres cosas: en móvil apilado la
  foto se **estiraba** (`background-size: 100% 40svh` no recorta, deforma);
  `imageAlt` no se emitía; y `hero.imagePosition` no tenía efecto. Gana además
  `srcset` w con `_hd` y el mismo preload que `stacked`.
- El apilado en móvil va por la clase `is-stacked-mobile` y
  `@media not all and (min-width: 821px)`: fuera el último `max-width:820px`
  del hero en `main.css`.
- `hero.layout` con un valor desconocido aborta el build (`errorf`). Antes
  caía en la rama de `split` con una clase inventada.
- `hero-preload.html`: sin rama de densidad para `overlay`; los tres layouts
  precargan con `imagesrcset` + `imagesizes`.
- **`bg-image-style.html` → `img-bg-style.html`**, para que los partials de
  imagen sean una sola familia `img-*`. Lo siguen usando `cta` y `banner`.
- GUIA-IMAGENES: el `_m` del hero pasa a 768×512 / 1536×1024 (3:2). La fila
  decía 768×420, que es 1.83:1.

## Sin versión — ancho de bloque `narrow`

- Nuevo valor `width: narrow` para cualquier bloque o shortcode de bloque: tope en
  `--container-narrow` (860px), centrado. En móvil no cambia nada. Primer uso: las dos
  sedes de /contacto/, que a 1120px mostraban las imágenes a casi 600px cada una.

## Sin versión — utilidades de visibilidad y línea de urgencia en el formulario

- Nuevas utilidades `.solo-movil` / `.solo-escritorio` (critical.css, breakpoint 821px). Solo
  ocultan; documentadas en DESIGN_TOKENS.md 3.3.
- `contact-form`: la línea "te respondemos en horario de tienda" pasa a "¿Es urgente? Llámanos
  al … o escríbenos por WhatsApp", con los datos de `site.yaml`. Fuera `cfMicrocopy`.
- `.cf-legal p + p`: separación entre el título y el texto de la primera capa.

## Sin versión — formulario siempre visible y en dos columnas

- `contact-form`: fuera el `<details>` que plegaba el formulario en móvil tras un botón
  `mailto:`. El formulario va siempre a la vista; el correo queda como alternativa bajo él.
- Escritorio (≥821px): dos columnas, `.cf-datos` | `.cf-envio` (primera capa legal +
  casilla + enviar). El botón baja a la altura del final del mensaje. El HTML mantiene el
  orden campos → información → casilla → enviar.
- `.cf-legal` a 16px (1rem), nunca menos. Fuera las cadenas i18n `cfSummary` y `cfMailto`.

## Sin versión — barra fija sin safe-area y main.js con huella

- Fuera los cinco `env(safe-area-inset-bottom)` de la barra fija, el volver-arriba
  y el `padding-bottom` de `body`. Se dieron por inofensivos (sin
  `viewport-fit=cover` deberían valer 0), pero Firefox para Android devuelve
  40,8px con su barra de direcciones visible: la barra fija pasaba de 56 a
  96,8px con los iconos arriba. Medido en dispositivo real.
- `main.js` se sirve con `fingerprint`, como ya se hacía con `main.css`. Sin
  huella, la URL era la misma en cada despliegue y los navegadores con caché
  seguían ejecutando el JS anterior junto al CSS nuevo.

## Sin versión — guiones en columnas estrechas de rejilla

- `.cards-grid > *` (cards, testimonios, equipo) pasa a ser contenedor de
  consulta (`columna-card`). En esas columnas, por debajo de 25rem, `p` y `li`
  usan `hyphens: auto` con el diccionario del `lang` del documento. Consulta de
  contenedor y no de viewport porque una card de rejilla de 3 columnas en
  escritorio es tan estrecha como en móvil. Los títulos no se dividen.
- `body` lleva `overflow-wrap: break-word` como red de seguridad contra el
  desbordamiento horizontal por cadenas sin huecos (URL, correo, código).

## Sin versión — anillo de foco de `.btn` y aparición de la barra fija

- Nuevo token `--focus-ring-outer` en `:root`: capa exterior oscura del anillo de
  foco doble. La comparten `.back-to-top` y `.btn`, para que no puedan divergir.
- `.btn:focus-visible` pasa al anillo doble (claro por dentro con `outline`,
  oscuro por fuera con el token). El anterior, `currentColor` al 45 %, se pintaba
  sobre el fondo de la página y daba ≈1,1:1 sobre crema (QA visual, defecto 2 / C14).
- `prefers-reduced-motion`: el bloque que anula la elevación de `.btn` también
  borraba la capa exterior del anillo. Ahora se devuelve el anillo sin sombra.
- La barra fija móvil aparece cuando el elemento que sigue al hero enseña 40px,
  no cuando el hero sale. Dos señales en `main.js`: por debajo de 821px barra y
  volver-arriba comparten la nueva; desde 821px el volver-arriba sigue con la
  salida del hero, porque en los heros que caben en pantalla lo siguiente ya se
  ve al cargar. El nuevo observer distingue por posición "aún no ha llegado" de
  "ya lo has pasado", que un `isIntersecting` solo no separa.

## Sin versión — formulario de contacto (shortcode `contact-form`)

- Nuevo shortcode `contact-form` + `static/contacto/enviar.php` (PHP `mail()`). `From` fijo del
  propio dominio y correo del visitante en `Reply-To`; cualquier carácter de control en un campo de
  una línea **rechaza** el envío; honeypot (misma respuesta de éxito) + tiempo mínimo; sin persistencia.
- El shortcode genera `public/contacto/config.php` desde `data/site.yaml` (`contact.form.*`); el
  **build falla** si el `From` no está alineado con `baseURL`. `hugo.toml` declara el tipo de medio
  `.php` para poder publicarlo.
- Sin JS: POST normal, 303 a `/contacto/#recibido` (confirmación con `:target`) o página de errores.
  Con JS: `fetch`, validación con `aria-invalid`/`aria-describedby`, foco al primer error y confirmación
  en un contenedor `aria-live="polite"` con el foco. Móvil colapsado con `<details>` nativo.
- Token `--color-error`; estilos `.cf-*` en `main.css`; bloque `aislar('formulario de contacto')` en
  `main.js`; cadenas i18n `cf*`, `err*` y `mail*` (es y en).

## Sin versión — `main.js`: cada bloque independiente aislado

- Nuevo helper `aislar(nombre, fn)` al principio de `main.js`: ejecuta `fn` en
  `try/catch` y registra el fallo con `console.error` nombrando el bloque. Los
  cinco bloques independientes (barra fija y volver-arriba, slider, galería,
  reveal y contador, menú móvil) van dentro. Antes, una excepción en cualquiera
  abortaba el resto del script: la del menú móvil —el único acceso a la
  navegación por debajo de 821px— es la última de todas y caía con cualquier
  fallo anterior.
- El bloque de la barra ya no necesita ir el primero para protegerse de los
  demás; se ha reescrito su comentario. Se queda donde está.
- No cubre errores de sintaxis (el script entero no se parsea y nada corre):
  para eso, `node -c themes/f1-theme/assets/js/main.js` antes de commitear.

## Sin versión — reveal: el contenido nunca se queda oculto si el JS falla

- `main.js`: la preparación y el cableado del *reveal* (desde `var STAGGER` hasta
  `io.observe`) van en `try/catch`. Entre añadir `.reveal` (que el CSS oculta bajo
  `.js`) y cablear el observer que añade `.is-visible` había una ventana en la
  que una excepción dejaba 9 bloques y el hero en `opacity: 0` para siempre. El
  `catch` marca todos los `.reveal` como `.is-visible` (con lo que sus
  `.reveal-child` también vuelven a `opacity: 1`) y registra el fallo con
  `console.error`: se pierde la animación, no el contenido.

## Sin versión — anillos de foco de la barra fija y del volver-arriba, por contexto

- El dorado (`--color-accent`) daba 2.28:1 sobre el blanco de la barra, por debajo
  de 3:1 (WCAG 2.4.11/1.4.11). El alcance era local: solo estaba en estos dos
  selectores; el resto del tema usa el `color-mix` de `.btn:focus-visible`.
- `.sticky-cta a:focus-visible`: viven siempre sobre el fondo claro de la barra →
  anillo navy (11.6:1), por dentro (`outline-offset: -3px`).
- `.back-to-top:focus-visible`: flota sobre fondos que no controla → dos capas,
  clara por dentro y oscura por fuera (0-2px oscura, 2-4px clara, 4-6px oscura;
  6px en total, como antes). Contra 8 fondos (crema, blanco, beige, footer, navy,
  verde, dorado, gris medio) el mejor anillo va de 4.05:1 a 15.98:1. Sigue
  siendo un outline real (en alto contraste forzado los box-shadow desaparecen).
- `.btn:focus-visible` NO se toca aquí; anotado como C14 en `docs/todo-fausto.md`.

## Sin versión — la barra fija aparece cuando el hero sale del viewport

- La barra comparte la señal del volver-arriba: un solo IntersectionObserver,
  una sola clase (`is-visible`) y un solo callback. **Alternan juntos**: sobre
  el hero no hay barra ni botón; fuera del hero aparece la unidad entera (así
  no queda a la vista el hueco reservado con el filete vacío). El criterio es
  posicional y determinista, no de dirección de scroll. En páginas sin hero, el
  centinela de siempre.
- Progresivo: la barra es **visible por defecto** y solo se oculta bajo
  `html.js`; el botón sigue con `html:not(.js){display:none}`. Sin
  IntersectionObserver se muestra ya. Transición opacity + translateY, anulada
  con `prefers-reduced-motion`. El `padding-bottom` del body no se toca.
- Dos señales de JS, con significados distintos: `html.js` la pone `main.js`
  (línea 1) y sigue gobernando `.js .reveal` y `.js .slider-nav`; `html.js-boot`
  la pone un `<script>` inline en el `<head>` y la consume **solo** la regla que
  oculta la barra. Medido con `main.js` tardando 1,5 s, esperar a `main.js`
  dejaba ver la barra a ancho completo y sin hueco 88 frames antes de ocultarla.
  Si `js-boot` se queda puesta sin que nadie muestre la barra, el coste es que
  la barra no aparece, nunca contenido oculto. El `<script>` de `main.js` lleva
  `onerror` que quita `js-boot` (si no carga, se vuelve al estado sin JS con la
  barra visible), y el bloque de la barra va el primero de `main.js`.

## Sin versión — barra fija: anillos de foco enteros y `text-decoration`

- `--back-to-top-gap` sube a `.5rem`: con `.25rem` el anillo de foco del
  botón (3px + 3px de offset) se salía 2px del viewport por la derecha.
  Padding, filete y posición son función del token y se recolocan solos.
- Los enlaces de la barra dibujan el anillo por dentro (`outline-offset: -3px`):
  van pegados a los bordes del viewport y su anillo se cortaba 6px por abajo (y
  por la izquierda el primero).
- `.sticky-cta a` recupera `text-decoration: none` (el tema no tiene reset).
- `sticky-cta.html`: `where` + `index` en vez de `range` sin corte para
  resolver `contact.locationId`.

## Sin versión — barra fija solo iconos, volver-arriba dentro de la barra, Ubicación a una sede

- `sticky-cta.html`: sin texto visible; las cadenas i18n pasan a `aria-label`
  de cada enlace. Iconos en `rem` (1.35rem); el área táctil sigue siendo la
  columna entera por el alto de la barra.
- El volver-arriba pasa a ser el cuarto elemento de la barra (esquina derecha,
  centrado en vertical) sin dejar de ser `position: fixed`. La barra le reserva
  el hueco con `padding-right`, permanente y solo con `html.js`; filete vertical
  separa contacto de navegación. Tokens nuevos `--back-to-top-size` y
  `--back-to-top-gap`.
- Ubicación: `contact.locationId` (id de `locations[]`) → `mapUrl` de esa sede;
  cadena de fallbacks locationId → locationUrl → `/contacto/`. Con sede, el
  `aria-label` la nombra (i18n `locationTo`, parametrizada con
  `locations[].name`); sin `target="_blank"`.

## Sin versión — barra fija de contacto en móvil y botón volver-arriba

- `sticky-cta.html`: barra fija con Llamar / WhatsApp / Ubicación desde
  `data/site.yaml` e `icons.html`, solo por debajo de 821px. «Ubicación»
  apunta a `/contacto/` (hay dos centros; `contact.locationUrl` lo cambia).
- `back-to-top.html`: `<a href="#top">` (el salto funciona sin JS; el suave lo
  pone `scroll-behavior`, anulado con `prefers-reduced-motion`). Aparece
  cuando el hero sale del viewport vía IntersectionObserver — sin listener de
  scroll; en las páginas sin hero observa un centinela de un viewport de alto.
  44px de lado, `aria-label` desde i18n.
- Token compartido `--sticky-cta-h`: el botón se sitúa **sobre** la barra, no
  dentro ni solapada, y el `body` reserva ese espacio para que la barra no
  tape el footer.
- Nuevas cadenas i18n: `backToTop`, `location`, `quickContact`.
- Revisión posterior: el clic del botón ya no navega al ancla (no escribe `#top` ni añade historial; mueve el foco a `<span id="top" tabindex="-1">`); anillo doble claro+oscuro (mín. 3.6:1 sobre cualquier fondo probado, teórico ~4:1 en el peor caso); `@media print` oculta barra y botón.
- `scroll-behavior: smooth` global (afecta también a las anclas de FAQ y
  `aviso-legal`).

## Sin versión — hero: una sola clave `image`, variante móvil `_m` por convención

- **`hero.bg` y `hero.bgMobile` desaparecen.** La foto sale de `hero.image` en
  los tres layouts; `layout` decide cómo se pinta (`background-image` en
  `overlay`, `<img>` en `stacked` y `split`), no de qué clave se lee. Antes una
  página con `layout: split` y solo `bg` degradaba a `plain` en silencio.
  Migradas las 24 páginas con hero, más el archetype y la demo. `cta` y
  `banner` conservan `bg`/`bgMobile`: son otra API.
- **Variante móvil por convención `_m`** (`foto.webp` → `foto_m.webp`), igual
  que `_hd`, en vez de declararse en el front matter. Partial nuevo
  `img-mobile.html`. Funciona en cualquier bloque que pase por
  `img-responsive.html`, no solo en el hero, y el `<picture>` se emite **solo
  si el `_m` existe**. `_hd` resuelve densidad (`srcset` w); `_m` resuelve
  encuadre (`<source media>`): `srcset` no puede hacer lo segundo porque elige
  candidato por ancho y DPR, no por composición.
- `responsive-img.html` → **`img-responsive.html`**, para que los tres partials
  de imagen sean la misma familia (`img-responsive`, `img-srcset`,
  `img-mobile`). Acepta `noMobile: true` para quien monte su propio `<picture>`.
  `hero.html` ya no construye el `<picture>` de `stacked` a mano.
- **`.hero` deja de pintar un degradado.** `background: linear-gradient(...)` es
  un `background-image`, y un `background-image` se pinta SIEMPRE por encima del
  `background-color`: tapaba el navy de `.bg-color2/3` pasara lo que pasara en
  la cascada. Pasa a `background-color: var(--bg-color1)`, que además es lo que
  el degradado parecía (`#fffdf8` → `#f5efe5`, imperceptible a ese tamaño).
- **`split` usa `--hero-width` (1440px) como `stacked`**, en vez del
  `--container` de 1120px: en dos columnas, 1120 dejaba el texto en ~580px y la
  foto en ~480px. Su `sizes` pasa a `620px` por encima de 1440, el ancho real
  de la segunda columna del grid.
- Los 24 heros llevan ya su `imageAlt`.
- **`overlay` alinea su banda como `stacked` y `split`** (`--hero-width`). El
  `max-width: 78ch` estaba sobre el `.container`, y con `margin-inline: auto`
  centraba el bloque entero: el texto del overlay quedaba desalineado de logo,
  nav y breadcrumb. La medida de linea baja a `.hero-copy`, que es su sitio; no
  sube a 1440 porque el texto va sobre la foto.
- **`split`: columnas 50/50** (antes `1.1fr/.9fr`, heredado del hero generico),
  gap a `clamp(1.5rem, 3vw, 2.5rem)` y `padding-bottom` a
  `clamp(2rem, 5vw, 4rem)`. Sobre una banda de 1440 la foto pasa de ~605 a
  ~672px.

## Sin versión — hero: layouts `stacked` (defecto), `overlay` y `split`

- `hero.html` pasa de dos modos superpuestos (`bg` de sección completa / `image`
  en split) a un solo bloque con `hero.layout`: `stacked` (defecto, foto a
  sangre arriba + bloque `bg-color2` debajo, H1 | subtítulo+CTAs en dos
  columnas desde 821px), `overlay` (texto sobre la foto con `scrim`, solo
  desde 821px; en móvil se apila) y `split` (el de la Home). Ninguna página
  con `bg` necesita migrar: pasan a `stacked` solas.
- Parciales nuevos: `hero-config.html` (resuelve layout e imagen; lo comparten
  el markup y el preload), `hero-copy.html` (contenido común),
  `hero-preload.html` (preload LCP no bloqueante, solo con imagen, con
  `imagesrcset` y un preload por breakpoint si hay `bgMobile`) e
  `img-srcset.html` (la lógica de `_hd` que vivía dentro de
  `img-responsive.html`, extraída; salida idéntica).
- `img-responsive.html`: parámetros nuevos `fetchpriority` y `style`.
- Nuevos tokens `--hero-band-h` y `--hero-width`; `hero.imagePosition`
  (`object-position` en `stacked`) y `hero.scrim`.
- Padding superior del hero por modo (`hero-stacked` 0, `hero-split`/
  `hero-plain` aire corto, `hero-overlay` sin cambios).
- Hero `stacked`: banda de foto con tope de ancho `--hero-band-max` (1440px), laterales del color del bloque; el color de fondo pasa al `<section>`. `sizes` calculado en `hero-config.html` (`(min-width:1440px) 1440px, 100vw`) y compartido con el preload. `max-height: 60svh` de la banda se mantiene como red de seguridad en ventanas anchas y bajas.
- `img-srcset.html` declara los anchos **reales** de base y `_hd` (antes asumía `_hd` = 2× base, y ninguna lo es). Cambia los descriptores `w` de todas las imágenes responsive del sitio; ver «Las `_hd` no miden el doble» en `GUIA-IMAGENES.md`.
- Fix: en `main.css` la cadena `--section-bg-mobile-hd → --section-bg-hd →
  --section-bg-mobile` saltaba `bgMobile` en móvil cuando la imagen de
  escritorio tenía `_hd` y la móvil no. Ahora: móvil-hd → móvil →
  escritorio-hd → escritorio (afecta también a cta y banner).

## Sin versión — bloque locations, partial hours y fuente única de horarios

- Nuevo bloque `locations` (+ shortcode) que pinta las sedes desde
  `site.yaml` → `locations[]`, con `layout: compact|full` y `showCommon`.
  Elimina las direcciones, teléfonos y enlaces de mapa escritos a mano en
  la página de Contacto.
- Nuevo partial `hours.html` + shortcode `{{< hours >}}`, fuente única desde
  `contact.hours`. El footer pasa a mostrar horario (antes no lo hacía).
- `schema.html`: `openingHoursSpecification` hereda de `contact.hoursSpec`
  cuando la sede no define el suyo — `or $loc.hoursSpec $contact.hoursSpec`.
- `contact.hoursSpec` normalizado de `dayOfWeek:` a `days:`, que es la clave
  que schema.html lee realmente; con `dayOfWeek` los días salían vacíos.
  Eliminados los `hoursSpec` duplicados dentro de cada location.
- `image-text`: nuevo parámetro `caption` (figcaption bajo la imagen) y clase
  `is-textonly` cuando no hay imagen, para que el grid no deje media página
  vacía.
- `block-classes.html` emite `has-surface` cuando el bloque pinta fondo propio;
  el ritmo vertical pasa a margin en los bloques sin fondo, que colapsa entre
  hermanos y evita sumar el doble de padding entre dos sections seguidas.

## Sin versión — convención de type: a guión alto, fix <p> y div duplicado

- Eliminado el normalizador `replace $type "_" "-"` de `section-renderer.html`
  — ya no hace falta, todos los `type:` usan guión alto directamente
  (`image-text`, `brands-logos`), coincidiendo con el nombre real del archivo
  del partial. 11 archivos de `content/` y 3 docs actualizados.
- Corregido `<div class="cta-inner">` duplicado en `blocks/cta.html`
  (arrastrado desde el rename de `cta-banner`, sin cerrar correctamente).
- `banner`, `testimonial`, `testimonial-item`, `text`, `text-split-item`:
  cambiado `markdownify` por `.Page.RenderString (dict "display" "block")`
  — Hugo elimina el `<p>` envolvente cuando el resultado es un único párrafo,
  lo que impedía controlar line-height/margin por párrafo vía CSS. Con
  `display: "block"` el `<p>` se mantiene siempre.

## v0.1 borrador +

- Añadida documentación mínima funcional del theme.
- Añadido `header-meta.html` para diferenciar metadatos de `header.html` visual.
- Añadidos layouts base: `baseof.html`, `single.html`, `list.html`, `index.html`.
- Añadidos partials funcionales para los 21 bloques.
- Añadido CSS base en `critical.css` y `main.css`.
- Añadido `data/site.yaml` con datos globales de negocio, header y footer.
- Añadido front matter base a las páginas vacías de `content/`.
- Configuradas carpetas técnicas `servicios` y `productos` como no renderizables mediante `_build.render: never`.
