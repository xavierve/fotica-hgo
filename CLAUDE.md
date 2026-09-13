# CLAUDE.md — Ópticas Fausto (opticasfausto.com)

## Contexto del proyecto

Sitio estático **Hugo 0.163** para Ópticas Fausto, negocio familiar de óptica y audiología en Torre del Mar (Málaga), fundado en 1982, con dos centros: **Centro Fausto Andalucía** y **Centro Fausto Duque**. Deploy en **Hostinger** (cambio de decisión, 6 sep: los bloqueos de IP de Cloudflare durante partidos de fútbol hacían el sitio intermitentemente inaccesible — decisión cerrada, no reabrir). Dominio nuevo `opticasfausto.com`; el viejo `opticafausto.com` (WordPress) redirigirá con 301.

Objetivo: SEO local (Torre del Mar / Axarquía) + conversión a llamada/WhatsApp/visita física. Público 45–75+ años: **legibilidad y simplicidad son requisitos, no preferencias** (cuerpo ≥18px, contraste WCAG AA, sin modales ni pop-ups, nunca).

**Reparto de trabajo:** el contenido (front matter + copys de `content/`) se gestiona en la conversación del Proyecto de Claude.ai — NO reescribir copys, titles, descriptions ni FAQs desde Claude Code salvo petición explícita. Claude Code se ocupa de: tema, CSS/JS, build, schema, formulario, deploy.

## Arquitectura

- **Tema:** `themes/f1-theme`. Sistema de bloques: `sections:` en front matter → `partials/section-renderer.html` → `partials/blocks/*.html`. Docs del tema en `themes/f1-theme/docs/FRONTMATTER.md` (mantener actualizado al añadir bloques o parámetros).
- **Orden de render** (single/list): breadcrumb → hero (clave `hero:` del front matter) → body markdown (contenedor `prose`) → sections. Las FAQ y el CTA de cierre viven en `sections:` (el schema FAQPage solo lee de ahí); el desarrollo largo va en body markdown con shortcodes intercalados.
- **Shortcodes** (`layouts/shortcodes/`): `cta`, `banner`, `cards` — delegan en los blocks correspondientes para paridad HTML/CSS total. `cards` autodescubre las páginas hijas de una sección leyendo `linkTitle`, `card.description`, `card.image`, `weight`.
- **Datos de negocio centralizados:** `data/site.yaml` (contacto, locations, navegación, social). Los teléfonos NUNCA se escriben en contenido ni templates: siempre desde site.yaml (`preset: contact` en CTAs, `ctaPreset: contact` en heros).
- **Iconos:** `partials/icons.html` (phone, whatsapp, location, mail), SVG inline con `currentColor`.
- Las carpetas `content/*/servicios/` y `content/*/productos/` usan `build.render: never`: organizan slugs, no son páginas. Breadcrumbs (visual y schema) las excluyen filtrando por `RelPermalink` vacío — **no volver a filtros por título**.

## Convenciones fijadas (no cambiar sin consultar)

- Slugs canon: `vision-40`, `lentes-de-contacto`, `filtros-solares-luz-azul`, `lentes-oftalmicas` (femenino en slug, H1, title y enlaces).
- **Única página legal:** `/aviso-legal/` con anclas `#privacidad` y `#cookies`. No existen `/politica-privacidad/` ni `/politica-de-cookies/`.
- Denominaciones: "Centro Fausto Andalucía" / "Centro Fausto Duque". **Nunca** "Fausto I" / "Fausto II" (deprecadas).
- Schema: @graph con Organization + 2 Optician (`parentOrganization`), sin tipos médicos (`MedicalBusiness`, `medicalSpecialty` prohibidos — dan errores en Search Console). No usar `Product` con `offers` vacíos (no se publican precios).
- Marca: "44 años, desde 1982". La frase «Nos conocemos de toda la vida. Y eso se nota.» solo aparece literal en home y Nosotros.
- Fase 1 sin cookies de terceros: NO añadir analítica, píxeles ni banner de consentimiento.

## Convenciones de Git

- **Nunca commitear ni hacer push directo a `main`.** `main` es siempre la última versión que Foco aprueba para desplegar.
- **Una rama por tarea**, con prefijo `claude/` (ej. `claude/footer-hours`, `claude/text-split`). Esto deja rastro claro de qué cambios vinieron de una sesión de Claude Code frente a los commits manuales de Foco.
- **Confirmar antes de hacer push a remoto** — no asumir permiso implícito para `git push` salvo que se pida explícitamente en la tarea.
- **Commits descriptivos**, en español, resumiendo el qué y el porqué del cambio (no hace falta Conventional Commits salvo que se indique lo contrario).
- Al terminar una tarea: dejar la rama lista para que Foco revise el diff y decida si mergea a `main` — no mergear de forma autónoma.
- Si una tarea toca `themes/f1-theme/docs/FRONTMATTER.md` (nuevo bloque o parámetro), el commit debe incluir esa actualización de docs, no dejarla para después.

## Estado actual (verificado con build)

Hecho y validado: `schema.html` v02 (@graph completo, BreadcrumbList, FAQPage — 127 preguntas en el sitio), `breadcrumb.html` corregido, `site.yaml` v03 (legal unificada), 30 páginas de contenido migradas, shortcodes + iconos + `cta` v2 (bg/bgMobile/bgColor/preset/microcopy), `404.html`, attributes de Goldmark activados, CSS de utilidades (`fs-xs/s/l`, `has-bg-image/color`, banner). Hero con `bg`/`bgMobile` real en las 4 páginas principales (falta Contacto — no lleva hero). Las 21 páginas de servicio/producto tienen `card.image` apuntando a un archivo real existente (verificado, ninguna en fallback).

Shortcodes añadidos (validados con `hugo build` real, sin warnings):
- `testimonial` (cita suelta con wrapper propio), `testimonials` + `testimonial-item` (grid de citas anidadas, reutiliza `.cards-grid`/`.block-testimonials` — mismo CSS que el bloque `type: testimonials` de `sections:`).
- `text-split` + `text-split-item`: grid simétrico 2 columnas para pares texto+texto (o texto+vídeo a futuro — Goldmark `unsafe=true` ya permite HTML embebido sin tratamiento especial). Reutiliza la mecánica de `.image-text-inner` (1fr → 1fr 1fr en desktop). Modificadores por item: `textSize` (reutiliza `block-text-*`), `align` (reutiliza `block-align-*`), `pad` (tokens propios `has-pad-s/m/l` sobre `--space-s/m/l`, más pequeños que el pad de sección), `margin` (CSS libre vía `safeCSS`, sin tokens — como `bgColor`). El wrapper admite `width="wide|full"` como cualquier bloque.
- Sección equipo en `/nosotros/`: completa con 7 personas, fotos y bios (el bio se despliega con `<details>`, nunca modal). Schema `Person` de los 7 generado desde el array `team:`, con `hasCredential`/`licenseNumber` leídos del front matter — sin nombres hardcodeados en el tema.

## TAREAS PENDIENTES (Claude Code)

Orden fijado por Foco (10 sep). Las tareas 1-3 son de layout y comparten
zona de pantalla: conviene hacerlas seguidas y en este orden, porque la 2 y
la 3 tienen que coordinar posiciones entre sí.

### 1. Layout del hero — `stacked` (defecto) y `overlay` (opt-in)

**Qué está decidido y no se reabre:** el hero nunca lleva texto encima de la
imagen en móvil. Motivo: legibilidad para el público 45-75+ (sesión 21 ago).

**Qué cambió el 10 sep:** originalmente apilado era solo para móvil y desktop
siempre iba con overlay. Tras 4 pruebas visuales en desktop, **apilado pasa a
ser el modo por defecto en todos los anchos**, y overlay queda como excepción
puntual. El diagnóstico que lo justifica: el problema no es la técnica de
overlay, es la foto. Un overlay tiene que oscurecer lo suficiente para que el
texto se lea sobre las zonas claras, y con eso la foto muere; no hay opacidad
que sirva a las dos cosas, y ninguna técnica hace que un H1 viva bien encima
de una cara. Las fotos con espacio negativo (las generadas con IA, que se
pidieron así) aguantan overlay ligero; las fotos reales de sesión, con
sujetos por todo el encuadre (ej. `215_vision_40_hero.webp`), no aguantan
ninguna — y son la mayoría del sitio.

| Modo | Cuándo | Cómo |
|---|---|---|
| `stacked` (**defecto**, `hero.layout` ausente) | La norma | Foto sola arriba, bloque de color debajo con el texto. Mismo patrón en móvil y desktop. |
| `overlay` (opt-in, `hero.layout: overlay`) | Excepción puntual | Texto sobre la imagen, con `scrim` (degradado solo sobre el lado del texto) en vez de overlay plano. `.scrim` ya existe. Previsto para Contacto y quizá alguna otra. |

**Un solo bloque `hero`, no dos.** Son la misma pieza (imagen + H1 +
subtítulo + CTAs, con su schema) en dos presentaciones: eso es un parámetro
de layout, igual que `cta-layout-split` es una variante de `cta`. Duplicar el
bloque duplicaría el mantenimiento del preload LCP, `responsive-img`,
`ctaPreset` y `bgMobile`. Decidido con Foco (10 sep) al plantear si convenía
separarlos de cara a reutilizar el tema: no conviene — un tema reutilizable
mejora por tener pocas piezas con parámetros claros, no por acumular
variantes hermanas con nombres parecidos.

**Ventaja del defecto:** ninguna página declara hoy `layout:`, así que todas
pasan a apilado solas, sin migrar ni un `.md`. Solo se añade
`layout: overlay` donde se quiera la excepción.

**Punto de partida real:** `hero.html` tiene hoy dos modos que conviven — (a)
`bg`/`bgMobile` como `background-image` de sección completa (Nosotros, Visión,
Audición), y (b) `.image` como `<img>` real en split a dos columnas (Home). El
(a) queda sustituido por `stacked` + `overlay`. **Pendiente de decidir con
Foco:** qué pasa con el (b) — si el split de Home se absorbe dentro de
`stacked` como variante, o sigue siendo un tercer modo. No asumir, preguntar.

**Spec de `stacked`** (la variante que mejor funcionó en las pruebas):

- **Banda de foto arriba**, a sangre completa. Altura por `aspect-ratio`, no
  `min-height` fijo, para que escale con el ancho (el prototipo usaba
  `min-height:500px` y se quedaba igual en cualquier pantalla). Recorte
  configurable: el prototipo necesitó `center 30%` para no cortar caras, así
  que hace falta un parámetro (`hero.imagePosition` o similar) — el punto de
  interés cambia con cada foto.
- **Altura de la banda en móvil:** no usar el `70svh` de presencia de
  banner/CTA. Con esa altura la imagen empuja H1 y subtítulo fuera del
  viewport inicial, y hay que hacer scroll para ver el titular de la propia
  página. Punto de partida: `50svh`, con fallback `50vh` (mismo motivo que en
  banner/CTA — ver 3.1 en `DESIGN_TOKENS.md`), a ajustar mirando el conjunto
  imagen+H1+subtítulo+botones en un móvil real.
- **Bloque de color debajo**, `bg-color2` (navy), a sangre completa. Dentro,
  contenido en **dos columnas** (flex) en desktop: H1 a la izquierda
  (`flex-basis` ~50%), subtítulo + CTAs a la derecha, `gap` ~3em. Reduce el
  bloque de ~800px (una columna) a ~500px y elimina el muro vacío de la
  derecha. En móvil colapsa a una columna: foto, H1, subtítulo, botones.
- **Ancho del contenedor: `wide` (`--container-wide`, 1440px)**, no el
  default de 1120px. Motivo: el H1 y el subtítulo son largos en **todos** los
  heros del sitio (es el tono de la marca, no un caso puntual), y en 1120px a
  dos columnas no caben con dignidad. El prototipo usó `width:100vw` (full) —
  **eso hay que evitarlo**: saca el H1 de la rejilla (arrancaba a 22px del
  borde mientras logo, nav, breadcrumb y H2 alinean a ~340px) y parece un
  descuido. `wide` mantiene la alineación con el resto de la página (los
  `cards` de los hubs ya usan `width="wide"`). Si Code ve motivo para `full`,
  que el contenido interior siga en `.container` aunque el fondo vaya a sangre.
- **`text-wrap: balance` en el H1.** Al ganar ancho la columna, el titular
  parte dejando un "que" colgando tras los dos puntos y "lince" huérfano en
  la última línea. `balance` lo reparte sin tocar el texto, y es mejora
  progresiva (quien no lo soporta lo ignora). Alternativa: `max-width` en el H1.
- **Padding inferior del bloque navy: recortar ~30%** — quedaban ~150px de
  navy vacío bajo los botones.
- Alineación vertical de las dos columnas: el prototipo las alinea arriba y
  queda aire bajo el H1 (la derecha es más alta). `align-items:center` es la
  alternativa. Decidir a propósito, no por defecto — a Foco le vale como está.

**Aviso de color de texto (bug real, detectado revisando `.hero-subtitle`):**
`.has-bg-image` aplica hoy `color:#fff`/`--subtitle-color` a TODA la sección,
sin distinguir si el texto está encima de la foto o no. En `stacked` el texto
ya no está sobre la imagen — si hereda ese blanco, queda blanco sobre fondo
claro, invisible. El bloque de texto necesita color explícito propio, con
independencia de si la sección padre tiene `has-bg-image`.

**Mecanismos a reutilizar, no reinventar:**
- Densidad `_hd` vía `os.FileExists` sobre la ruta física — mismo patrón que
  `partials/responsive-img.html`. Nunca debe dar error si falta la variante.
- Descriptor `w` + `sizes` (no `x`): el hero es candidato a LCP, aquí la
  precisión de tamaño de renderizado importa más que en ningún otro bloque.
- Recorte distinto móvil/desktop (hoy `bg`/`bgMobile`) → `<picture>` con
  `<source media>`. Breakpoint: el tema usa **821px** de forma consistente;
  la nota vieja de "768×400px" es de la sesión del 21 ago y queda descartada.
- Preload no bloqueante (`<link rel="preload" as="image" fetchpriority="high">`)
  solo en páginas que tengan hero — condicional en el `<head>`, nunca
  precargar algo que la página no use. Con `srcset`, evaluar
  `imagesrcset`/`imagesizes`; Safari va por detrás, degrada al `href` simple.

**Sobre el prototipo de Foco:** lo hizo con estilos inline y
`background-image` para probar rápido — no es la implementación. La banda de
foto en `stacked` es justo donde `<picture>`/`<img>` con `object-fit:cover` +
`object-position` (equivalente al `background-position` del prototipo) encaja
mejor que `background-image`: no hay texto encima, así que no hay motivo para
conservar `background-attachment`, y se gana `srcset`/`sizes` real. Si Code
prefiere `background-image` por coherencia con banner/CTA,
`bg-image-style.html` ya da `image-set()`. Cualquiera vale: que elija con
criterio y lo documente.

**CTA y Banner se quedan en `background-image` a propósito** — ya tienen
`image-set()` vía `_hd` (`partials/bg-image-style.html`) y así conservan la
opción de `background-attachment:fixed`, que no existe para `<img>`.

**`bg-image-style.html` NO se retira ni se deja morir.** Aunque `stacked` use
`<img>`, el tratamiento responsive de `background-image` (`image-set()` con
`_hd`, más `--section-bg-mobile` para el recorte vertical) tiene que seguir
**funcional y probado**, porque lo usa el modo `overlay` — y porque el tema es
reutilizable: otro proyecto puede elegir `overlay` como defecto. Si `stacked`
deja de invocarlo, asegurarse igualmente de que `overlay` lo sigue
ejercitando, y de que la página de demo cubre ese caso. No dar por muerta una
rama solo porque este proyecto la use poco.

**Cuestiones abiertas para Code:** (a) si las dos columnas de `stacked` deben
ser automáticas o un parámetro aparte; (b) proporción 50/50 vs 40/60 — con
40/60 el subtítulo respira más y el H1 sigue en 2-3 líneas; (c) si `scrim`
debe ser el tratamiento por defecto de `overlay` o seguir siendo opt-in.

**Criterio de aceptación:** build limpio con y sin variantes `_hd`/recortes
móvil; ninguna imagen rota si falta un archivo opcional; el texto se lee bien
en todos los anchos, sin heredar blanco donde ya no hay foto detrás; H1 y
subtítulo visibles sin scroll en un móvil estándar; en desktop el contenido
alinea con la rejilla del resto de la página y el H1 no deja huérfanos.
Verificar con la skill `visual-qa`, no a ojo.

### 2. Indicador de scroll + botón volver-arriba

(a) En heros de landings (home, `/vision/`, `/audicion/`, progresivas,
lentes-de-contacto, gafas-infantiles): indicador de scroll con
`icon: arrow-down` (`icons.html`), animación sutil, dentro de `<a>`/`<button>`
con `aria-label`.

(b) Botón global "volver arriba" con `arrow-up`, visible solo tras ~1.5
viewports de scroll, `aria-label="Volver arriba"`, desplazamiento suave vía
CSS `scroll-behavior: smooth` (respetando `prefers-reduced-motion`).

**También en móvil** (corregido 13 sep — el 10 sep se había descartado por
miedo al solape con el sticky footer, pero Foco aportó una referencia real que
lo desmiente: Instituto Levilaser). Conviven bien si el botón es un círculo
pequeño en la esquina inferior derecha, **por encima** de la barra, no dentro
de ella. Ojo a un detalle visible en esa misma referencia: el botón tapaba
parcialmente la etiqueta "Ubicación" del último ítem del sticky footer. Dejar
holgura suficiente o reservar espacio en la propia barra para que nada quede
cubierto. Verificar con la skill `visual-qa` a 359px de ancho, que es donde
más aprieta.

### 3. Sticky footer móvil

Llamada / WhatsApp / Ubicación (requisito ap8.1), usando `icons.html` y datos
de `site.yaml`. Coordinar con el botón volver-arriba de la tarea 2.

Referencia útil: el header ya resolvió problemas equivalentes (iconos-solo en
pantallas estrechas, breakpoints medidos, `white-space:nowrap` en `.btn` para
que el número no parta el botón). Mirar `critical.css` antes de reinventar.

### 4. Optimización de imágenes

**Estado real (verificado 10-13 sep): no existe ninguna variante alternativa
todavía.** El mecanismo está conectado y funcionando (`responsive-img.html` en
7 bloques, `bg-image-style.html` en banner/cta), pero sin archivos que servir —
todo cae al tamaño único, sin error, que es justo como está diseñado.

**El giro que define esta tarea (Foco, 13 sep): la ganancia está en generar
variantes MÁS PEQUEÑAS, no un `_hd` más grande.** Las fotos con código de
cámara (`D3A####`) existen en alta calidad, pero **la mayoría de los heros son
generados con IA a ~1440px, y ese es su techo de detalle real**. Regenerar a
más resolución no vale: la IA no es determinista, saldría otra imagen distinta,
no la misma más grande — y esas ya están elegidas y colocadas. Pero hoy todos
los dispositivos se descargan el archivo completo, incluidos móviles que
necesitan la mitad. Ahí está el ahorro, y no hace falta ningún archivo que no
se pueda derivar de los que ya hay.

Encaja bien con Code: script sobre `static/images/` (PIL o ImageMagick), con
reglas según el tamaño del slot donde se usa cada imagen.

- **Imágenes en slots pequeños** (fotos de equipo 750×1125 que se ven a
  ~370px, cards, avatares de testimonios, logos): el archivo actual **ya es el
  2x** del slot. Generar la variante reducida da ganancia inmediata en móviles
  sin pantalla retina, sin perder nada en los que sí la tienen.
- **Heros y banners a ancho completo (1440×960).** Pesos reales medidos sobre
  `215_vision_40_hero.webp` (calidad 78): 640px→50KB · 960px→84KB ·
  1280px→112KB · **1440px (actual)→139KB** · 1920px→171KB · 2880px→261KB.

  Hoy **todos** los dispositivos descargan los 139KB. Con una escalera
  640/960/1280/1440 y descriptores `w`+`sizes`, el navegador elige solo:

  | Dispositivo | Necesita | Elige | Ahorro |
  |---|---|---|---|
  | iPhone SE (375, DPR2) | 750px | 960w | **55 KB** |
  | Android medio (360, DPR2) | 720px | 960w | **55 KB** |
  | iPhone 14 (390, DPR3) | 1170px | 1280w | **27 KB** |
  | iPad (820, DPR2) / Desktop | 1440px+ | 1440w | 0 KB |

  Ahorro directo en el LCP con conexión móvil, sin perder calidad en ningún
  dispositivo.

  - **Techo: 1440px** para heros de IA (su resolución nativa). Para los que
    vengan de cámara, 1920px como máximo razonable — más no compensa.
  - `responsive-img.html` ya usa `w`+`sizes`, pero solo genera dos peldaños
    (1x y 2x). **Ampliarlo a escalera descendente es el núcleo de esta
    tarea**, y aplica por igual a fotos de IA y de cámara.
  - **Aviso sobre `bg-image-style.html` (overlay, banner, CTA):** usa
    `image-set(... 1x, ... 2x)`, descriptores de **densidad pura**. Un móvil
    con DPR 3 se descarga el archivo 2x entero para una pantalla que
    necesitaba mucho menos — justo lo que penaliza PageSpeed móvil, y donde
    más duele porque el hero es el LCP. Para afinarlo hacen falta media
    queries por ancho, no solo por densidad.
  - **No generar `_hd` por upscaling (ni con IA).** Añade peso sin detalle
    real, y en fotos de personas mete artefactos — ya se vio con el bordado de
    una bata ("YAUSTO", "OPTOMETIDRTA"). Para las fotos `D3A####` que sí
    tienen original de cámara, generar desde ese original, no ampliando.
- **Encuadre / arte móvil (`_m`)**: recortes verticales donde el encuadre de
  escritorio no funcione en vertical. No por sistema — solo donde visualmente
  haga falta (caras cortadas, sujeto descentrado, elemento clave fuera de
  plano). Hoy solo `215_vision_40_hero_m.webp` y
  `314-mantenimiento_audifonos_hero_m.webp` tienen variante móvil. **Qué
  imágenes lo necesitan es juicio visual, no automatizable:** lo decide Foco
  (o se revisa en el Proyecto de Claude.ai), no un script.

Pendiente aparte, no bloqueante: el lightbox de `gallery.html` rellena el
`<img>` vía JS desde el JSON de `.items`, sin pasar por Hugo — para que la
vista ampliada use `_hd` habría que tocar ese JS. Valorar si compensa.

### 5. Formulario de contacto (`/contacto/`)

Backend: **PHP `mail()`** servido por el propio hosting (Hostinger). Campos:
nombre, teléfono, mensaje. Dual por dispositivo (spec en comentario HTML de
`content/contacto/_index.md` y ap7.5 del proyecto): móvil = mailto principal +
formulario colapsado; desktop = formulario principal. Confirmación inline sin
redirección. Checkbox RGPD → `/aviso-legal/`.

**Texto legal:** ya actualizado a PHP mail() (6 sep) en `contacto` y
`aviso-legal`, pero queda una nota `<!-- PENDIENTE -->` en ambos: confirmar la
redacción exacta una vez el mecanismo esté implementado de verdad. Si el
hosting interviene como encargado de tratamiento técnico, hay que ajustarla.

**Email del dominio, verificado (6 sep):** SPF
(`v=spf1 include:_spf.mail.hostinger.com...`) y DKIM (3 CNAME
`hostingermail-a/b/c.dkim...`) ya configurados — listos para que `mail()` no
caiga en spam. DMARC en modo monitor:
`v=DMARC1; p=none; rua=mailto:web@opticasfausto.com;`. **No cerrar esta
pieza:** `p=none` es solo el arranque — monitorizar ~1 mes los informes
agregados y solo entonces decidir si se sube a `p=quarantine`/`p=reject`.

### 6. Ofuscación JS de CIF y domicilio en `/aviso-legal/`

Spans marcados con `data-obf` en el contenido, render vía JS en cliente
(anti-scraping). El CIF real lo aporta el cliente (placeholder actual).

### 7. Verificar 404 en Hostinger

`/404.html` debe servirse con estado HTTP 404 real — comprobar cómo lo
resuelve Hostinger (Cloudflare Pages lo hacía por defecto; hosting tradicional
puede necesitar `ErrorDocument 404` en `.htaccess`). El template ya lleva
`noindex`, pero el meta se emite dentro de `main` — moverlo al `<head>` vía
mecanismo del tema (p. ej. `.Store` leído en `header-meta.html`).

### 8. Redirecciones

En Hostinger es `.htaccess` (Apache, `RewriteRule`/`Redirect 301`), no el
`_redirects` de Cloudflare Pages. Del dominio viejo → nuevo, incluyendo los 4
subdominios landing (`audicion.`, `lentes-graduadas.` →
`/vision/productos/gafas-progresivas/`, `lentillas.` →
`/vision/productos/lentes-de-contacto/`, `vueltaalcole.` →
`/vision/productos/gafas-infantiles/`) y el mapeo de URLs del WordPress
antiguo. Revisar logs de 404 tras el lanzamiento: cada 404 recurrente es una
301 pendiente.

### 9. Espaciados internos de blocks en `em`

No rem/px, para que `fs-s`/`fs-l` y `textSize` escalen el bloque completo.
Revisar de paso la escala tipográfica base hacia `clamp()`.

### 10. `title`/`description` de 214 (Baja Visión)

`title`, `description` y `og.*` de `baja-vision.md` no mencionan la credencial
de Juan (Máster en Rehabilitación Visual, U. de Valladolid) — señal de
autoridad real (E-E-A-T) que hoy solo vive en el copy del body. La parte de
schema ya está resuelta (Juan es `provider` con `hasCredential` e
`identifier`). **No tocar el copy del body sin permiso.**

### Prioridad baja / al recibir material

11. `memberOf` (Sociedad Española de Baja Visión) y `hasCredential` (Centro
    Auditivo Homologado, si hay denominación oficial) en Organization.
12. CSS crítico inline en home; objetivo PageSpeed móvil >85.
13. hreflang / preparación multilingüe (diferido, no presupuestado).

## Flujo de imágenes

`draft-images/` en la raíz del repo (hermana de `static/`, NO dentro de
`static/images/`) — Hugo no la ve, cero riesgo de publicar candidatas sin
elegir. Git trackea el historial de qué entra y sale. Al elegir una candidata
se mueve con `mv` a `static/images/` con su nombre final — sin tocar
configuración de Hugo.

**Asignación de imágenes al copy: ✅ completada (6 sep).** Los 22 archivos de
Visión y Audición (hubs 200/300 y todas sus páginas hijas) tienen al menos
una imagen en el copy. Lo que queda sobre imágenes es la tarea 4
(optimización), no la asignación.

Reglas que siguen vigentes para cualquier imagen nueva:
- No cambiar textos existentes sin permiso.
- El path en el `.md` es siempre `/images/(filename).webp` — Foco mueve el
  archivo desde `draft-images/` después.
- Si no hay candidata razonable, dar un **prompt en inglés** para generarla
  en vez de forzar una imagen que no encaje.
- `.webp` para todo salvo OG (que va en `.jpg`).

## Cómo verificar

```bash
hugo build          # debe compilar sin errores ni warnings
node -c themes/f1-theme/assets/js/main.js   # el build NO detecta JS roto
# JSON-LD: validar una página de cada tipo en https://validator.schema.org
# Enlaces internos: no debe haber hrefs a rutas inexistentes en public/
```

Antes de commitear cambios del tema: build limpio + revisar home, un hub
(`/vision/`), una página estándar (`/vision/servicios/optometria/`) y una
landing (`/vision/productos/lentes-de-contacto/`).

### QA visual: medir, no mirar

**Para cambios de CSS/layout el build limpio no basta.** Varios bugs reales de
este proyecto compilaban sin un solo warning: un `white-space` que se pisaba a
sí mismo, un `main.js` roto entero (slider, galería y contador caídos), un
botón que se deformaba solo entre dos breakpoints concretos.

Usar la skill **`visual-qa`** (`.claude/skills/visual-qa/SKILL.md`): mide el
resultado renderizado con Playwright en varios anchos en lugar de comprobarlo
a ojo, e incluye el método para elegir un breakpoint midiendo dónde rompe de
verdad — de ahí salieron los del header (840/1100px).

Primera vez en una máquina nueva:

```bash
pip install playwright --break-system-packages && playwright install chromium
```

**Si Claude Code tiene otra vía mejor para inspeccionar el render** (un MCP de
navegador, capacidad nativa de captura, o herramienta equivalente), usarla y
decirlo — lo que importa es *medir el resultado*, no la herramienta concreta.
Playwright es lo que ya está probado funcionando en este proyecto, no un
requisito.

### Comprobar en deploy real, no solo en local

`hugo server` y el `public/` local no reproducen todo. Tras desplegar en
Hostinger, comprobar sobre el dominio real:

- **HTTP 404 de verdad** en una URL inexistente (tarea 7) — no basta con que
  se vea la página bonita: mirar el código de estado.
- **Redirecciones 301** del dominio viejo y de los 4 subdominios (tarea 8),
  comprobando que la cadena no pasa por un 302 intermedio.
- **Formulario**: envío real y que el correo llegue a bandeja, no a spam
  (tarea 5). Probar desde Gmail y desde Outlook, que filtran distinto.
- **Certificado SSL** válido en `opticasfausto.com` y en `www.` (los CAA
  aplicados el 10 sep limitan qué autoridades pueden emitirlo).
- **PageSpeed Insights móvil** contra la URL real, no local: el objetivo >85
  depende de latencia y compresión del servidor, que en local no existen.
- **Cabeceras de caché** de Hostinger para `static/`: si sirve imágenes y CSS
  sin `Cache-Control` razonable, las visitas repetidas pagan de más.
