# F1 Theme - Front Matter

Estructura base recomendada para F1 Theme v0.1 Alpha:

```yaml
---
page_id: "0.0"
page_type: "home"
content_type: "company"
title: "Título visible o SEO base"
description: "Descripción breve de la página."
draft: false

seo:
  title: "Meta title"
  description: "Meta description"
  canonical: ""
  robots: "index, follow"

og:
  title: "Open Graph title"
  description: "Open Graph description"
  image: "/images/og/example.jpg"
  type: "website"

schema:
  type: "WebPage"
  includeBreadcrumb: true
  includeFAQ: true

hero:
  layout: ""            # stacked (defecto, si se omite) | overlay | split
  eyebrow: ""
  title: ""
  subtitle: ""
  preset: contact       # botones Llamar + WhatsApp desde data/site.yaml
  image: ""             # la foto del hero, en los TRES layouts
  imageAlt: ""          # obligatorio si hay image
  imagePosition: ""     # stacked: punto de interés del recorte, ej. "center 30%"
  bgColor: ""
  primaryCTA:
    text: ""
    url: ""
  secondaryCTA:
    text: ""
    url: ""

sections:
  - type: image-text
    width: wide
    variant: soft
    textSize: l
    align: left
    class: home-human
    title: ""
    text: ""
    image: ""
    imageAlt: ""
    reverse: false
  - type: cards
    columns: 3
    title: ""
    subtitle: ""
    cards: []
  - type: cta
    tone: neutral
    title: ""
    subtitle: ""
    button1:
      text: ""
      url: ""
    button2:
      text: ""
      url: ""
---
```

## Campos Comunes de Bloque

Todos los bloques de `sections` aceptan:

- `width`: `default`, `wide`, `full`
- `variant`: `default`, `soft`, `featured`, `contrast`
- `textSize`: `xs`, `s`, `m`, `l`, `xl` — solo bloques/shortcodes de bloque (no confundir con la utilidad CSS fs-*, para texto suelto en prosa; ver "Talla de bloque vs talla de prosa" más abajo)
- `align`: `left`, `center`, `right`
- `class`: string opcional

## Hero: layouts

Un solo bloque, tres presentaciones. `hero.layout` elige; si se omite, es
`stacked`. El contenido (eyebrow, H1, subtítulo, CTAs) y sus parámetros son
los mismos en las tres.

| `layout` | Qué es | Imagen | Cuándo |
|---|---|---|---|
| `stacked` (**defecto**) | Banda de foto a sangre arriba; debajo, bloque `bg-color2` con H1 a la izquierda y subtítulo + CTAs a la derecha (una columna en móvil). | `<img>` | La norma. |
| `overlay` | Texto sobre la foto (`background-image` + `scrim`). **Solo desde 821px**: en móvil se apila igual que `stacked` — nunca hay texto sobre foto en móvil. | `background-image` | Excepción, con fotos de espacio negativo. |
| `split` | Texto y figura en dos columnas (una en móvil, texto primero). | `<img>` | Home. |

La foto sale **siempre de `hero.image`**. `layout` decide cómo se pinta, no de
qué clave se lee. Las claves `bg` y `bgMobile` ya no existen en el hero (sí en
`cta` y `banner`, que son otra API): una página con `layout: split` y solo `bg`
degradaba a `plain` sin avisar.

Sin imagen utilizable el hero degrada a solo texto (clase `hero-plain`).

Parámetros propios del hero:

- `layout`: `stacked` | `overlay` | `split`.
- `imagePosition`: (`stacked`) `object-position` de la foto, ej. `"center 30%"`, `"top"`. Cada foto tiene su punto de interés; por defecto `center`.
- `imageAlt`: alt de la foto. Si se omite queda `alt=""` (decorativa).
- `scrim`: (`overlay`) `false` desactiva el degradado direccional, que va activo por defecto.
- `bgColor` / `textColor`: en `stacked` sustituyen el color del bloque de texto (por defecto `bg-color2`); en `overlay` tiñen el velo.
- `class`: clases extra en el `<section>`. `panel`, `overlay-strong` y `bg-top` son de `overlay`; en `stacked` el encuadre va por `imagePosition`.

En `stacked` la banda tiene un ancho máximo de 1440px (`--hero-band-max`): en pantallas más anchas la foto no se amplía y los laterales toman el color del bloque de texto. `overlay` no lleva tope: es una excepción a sangre. `stacked` y `split` comparten el ancho `--hero-width` (= `--container-wide`, 1440px) en vez del `--container` de 1120px: en dos columnas, 1120 deja el texto en ~580px y la foto en ~480px.

### Variantes de imagen: `_hd` y `_m`

Las dos son **por convención de nombre de archivo, nunca por front matter**, y
las dos son opcionales: si el archivo no está, el markup cae limpio.

| Sufijo | Qué es | Para qué | Cómo se sirve |
|---|---|---|---|
| `foto_hd.webp` | la MISMA foto con más píxeles | densidad (retina) | `srcset` w en `stacked`/`split`, `image-set()` en `overlay` |
| `foto_m.webp` | OTRO encuadre, vertical | art direction en móvil | `<source media="(max-width:820px)">` |

No son intercambiables. `srcset` elige candidato por ancho y DPR, así que dos
archivos con el mismo aspecto y distinto recorte le resultan equivalentes y
serviría cualquiera: el cambio de **encuadre** solo lo resuelve `<picture>`.

`_m` funciona en cualquier bloque que pase por `img-responsive.html`, no solo
en el hero: `cta`, `banner`, `image-text`, `cards`, `gallery`, `team`. El
`<picture>` se emite **solo si el `_m` existe**, así que las imágenes sin
variante móvil no pagan markup de más.

Ninguna de las dos funciona con URLs externas: la detección es `os.FileExists`
sobre `static/`.

La imagen del hero se precarga en el `<head>` (`hero-preload.html`) solo en
páginas que la tienen, con un preload por breakpoint si existe el `_m`.

### Partials de imagen

| Partial | Responsabilidad |
|---|---|
| `img-responsive.html` | emite el `<img>`, y el `<picture>` si hay `_m`. Es el que llaman los bloques. |
| `img-srcset.html` | resuelve el `_hd` y devuelve el `srcset` w con los anchos reales. |
| `img-mobile.html` | resuelve el `_m` y devuelve su ruta, o `""`. |

`img-responsive.html` acepta `noMobile: true` para quien monte su propio
`<picture>`. (Antes se llamaba `responsive-img.html`; se renombró para que los
tres partials sean la misma familia `img-*`.)

## Reglas

- `hero` permanece independiente y no forma parte de `sections`.
- Todos los demás bloques visuales se declaran dentro de `sections`.
- `faq:` en raíz no existe en v0.1 Alpha; FAQ solo se declara como `type: faq`.
- `section-renderer.html` es el único partial que renderiza bloques.

## page_type

- `home`
- `standard`
- `hub`
- `single`
- `legal`

## content_type

- `company`
- `vision`
- `hearing`
- `service`
- `product`
- `contact`
- `legal`


## Iconos disponibles (partials/icons.html)

Uso en bloques/botones: `icon: "nombre"`. SVG inline, heredan color del texto (`currentColor`).

`phone` · `whatsapp` · `location` · `mail` (alias `email`) · `clock` · `user` · `star` · `family` · `hearing` · `cog` · `language` · `follow-up` · `arrow-down` · `arrow-up` · `arrow-right` · `info`

Nombre desconocido → no se renderiza nada (degrada a solo texto). Para añadir iconos, mantener el mismo estilo (viewBox 24, path fill=currentColor) en icons.html.

## Neutralidad del tema (framework reutilizable)

El tema NO contiene datos de ningún proyecto. Todo lo específico vive fuera:

- **data/site.yaml** → marca (`brand`, incl. `logoInline` para SVG animado en header),
  contacto, navegación, sedes (`locations`), y `business` (tipo schema.org de sede,
  foundingDate, localidad/CP/región por defecto, areaServed, offerCatalogs).
- **i18n/es.yaml, en.yaml…** → todas las cadenas de UI (botones, aria-labels, títulos
  por defecto). Nuevo idioma = nuevo archivo.
- **CSS custom properties** (`:root` de critical.css) → toda la piel: colores
  (`--color-*`), superficies (`--surface`, `--control-bg`, `--control-border`),
  overlays (`--overlay-base`, `--backdrop`), tipografía, `--container`, `--radius`.
  Re-tematizar = redefinir variables, sin tocar reglas.

Regla para PRs al tema: ningún literal de proyecto (nombres, teléfonos, fechas,
localidades, rutas de assets con nombre propio) en layouts/, assets/ ni i18n/ del tema.

## Modificador `pad` (padding vertical del bloque)

`pad: compact | spacious` (sin declarar = normal). Los tres escalones son fluidos
(clamp móvil→desktop) vía tokens `--block-pad*` en :root. Criterio: `compact` para
CTAs de una frase o bloques encadenados; `spacious` para el bloque protagonista.
Nunca usar alturas fijas: la altura correcta es contenido + padding.

## Talla de bloque vs talla de prosa

pad acepta tallas cortas como alias de sus nombres largos:
pad: s|m|l ≡ compact|normal|spacious.

textSize ya NO tiene alias: xs|s|m|l|xl ES el nombre canónico y genera
block-text-xs|s|m|l|xl directamente. Los nombres largos (small, default,
large) ya no son válidos — no producen ninguna clase con CSS asociado, así
que el bloque se queda sin talla aplicada, sin error visible en el build.

**textSize es exclusivo de bloques y shortcodes-de-bloque** (sections: y
{{< banner >}}/{{< text >}}/etc.). Para **texto suelto dentro de un párrafo**
**o encabezado en prosa** (markdown body), usa la **utilidad CSS class="fs-" fs-xs|fs-s|fs-l|fs-xl**
en su lugar (p. ej. {.fs-s}). Son dos escalas independientes a propósito:
comparten letra pero no necesariamente el mismo valor — un xl de bloque debe
poder crecer mucho más que un xl de prosa suelta.

## Shortcode `spacer`

`{{</* spacer size="s|m|l" */>}}` — espaciado vertical puntual en el prose (fluido,
tokens `--space-*`). Úsalo como excepción: el ritmo normal lo dan el padding de los
bloques y el `margin-block` de los bloques en prose. Es `aria-hidden` (no es contenido).
