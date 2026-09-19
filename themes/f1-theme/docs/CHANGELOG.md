# F1 Theme · Changelog

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
- `hero.mediaFirst` (solo `split`): figura antes del copy **en el DOM**.

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
