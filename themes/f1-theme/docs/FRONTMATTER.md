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
  robots: "index, follow"   # por defecto; la 404 sale siempre "noindex" (partials/seo.html)

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
    valign: top
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

- `width`: `narrow` (860px, `--container-narrow`), `default`, `wide`, `full`
- `variant`: `default`, `soft`, `featured`, `contrast`
- `textSize`: `xs`, `s`, `m`, `l`, `xl` — solo bloques/shortcodes de bloque (no confundir con la utilidad CSS fs-*, para texto suelto en prosa; ver "Talla de bloque vs talla de prosa" más abajo)
- `align`: `left`, `center`, `right` — es `text-align`, horizontal. La
  alineación vertical no es un campo común: solo la declaran los bloques de dos
  columnas (`image-text`, vía `valign`; ver BLOCKS.md)
- `class`: string opcional

## Hero: layouts

Un solo bloque, tres presentaciones. `hero.layout` elige. El contenido
(eyebrow, H1, subtítulo, CTAs) y sus parámetros son los mismos en las tres, y
la foto es **siempre un `<img>`** (`img-responsive.html`): `alt`, `srcset` con
`_hd`, `<picture>` con `_m` y `object-position` funcionan igual en las tres.

| `layout` | Qué es | Dónde va la foto |
|---|---|---|
| `stacked` | Banda de foto a sangre arriba; debajo, bloque `bg-color2` con H1 a la izquierda y subtítulo + CTAs a la derecha (una columna en móvil). | `<figure class="hero-band">`, en el flujo |
| `overlay` | Texto sobre la foto, con velo y `scrim`. | `<figure class="hero-bg">`, detrás del copy (posición absoluta) |
| `split` | Texto y figura en dos columnas (una en móvil, texto primero). | `<figure class="hero-media">`, segunda columna |

### Defectos: los decide el sitio, no el tema

El tema no impone ninguna política de hero. Cada sitio la declara en su
`hugo.toml`, y la página solo escribe `hero.layout` cuando es una excepción:

```toml
[params.hero]
  layout = "stacked"      # layout de las páginas que no declaran hero.layout
  mobileOverlay = false   # false: overlay se apila en móvil (<= 51.25em)
```

| Parámetro de sitio | Valores | Sin declarar |
|---|---|---|
| `params.hero.layout` | `stacked` \| `overlay` \| `split` | `overlay` |
| `params.hero.mobileOverlay` | `true` \| `false` | `true` |

`mobileOverlay` solo afecta a `overlay`: `stacked` ya es apilado y `split` en
móvil es una columna por construcción. Con `false`, la foto de un `overlay`
pasa en móvil a ser la misma banda que en `stacked` (`--hero-band-h`, recorte
con `object-fit: cover`) y el texto va debajo sobre color liso (`bgColor` si
se da; si no, `bg-color2`). Es una política de sitio, no de página: no existe
`hero.mobileOverlay` en el front matter.

**Ópticas Fausto** declara `layout = "stacked"` y `mobileOverlay = false`:
público 45-75+, nunca texto sobre foto en móvil (decisión del 21 ago) y
apilado por defecto en todos los anchos (10 sep). Esas decisiones son del
sitio; hasta oct 2026 estaban escritas en el código del tema.

Un valor de `layout` fuera de los tres aborta el build (`errorf`) en vez de
degradar en silencio.

La foto sale **siempre de `hero.image`**. `layout` decide dónde se coloca, no
de qué clave se lee ni con qué técnica se pinta. La clave `bg` no existe en el hero (sí en `cta`, `banner` y `counter`, que son otra API); `bgMobile` no existe en ningún bloque: el recorte móvil es siempre la convención `_m`.

Sin imagen utilizable el hero degrada a solo texto (clase `hero-plain`).

Parámetros propios del hero:

- `layout`: `stacked` | `overlay` | `split`. Si se omite, el del sitio.
- `imagePosition`: `object-position` de la foto, ej. `"center 30%"`, `"top"`. Cada foto tiene su punto de interés; por defecto `center`. Vale en `stacked` y `overlay`, y se aplica también al `_m` (es el mismo `<img>`) (en `overlay` sustituye a la antigua clase `bg-top`, que ya no afecta al hero).
- `imageAlt`: alt de la foto. Si se omite queda `alt=""` (decorativa). En `overlay` también se emite: antes, con `background-image`, se perdía.
- `scrim`: (`overlay`) `false` desactiva el degradado direccional, que va activo por defecto.
- `bgColor` / `textColor`: en `stacked` sustituyen el color del bloque de texto (por defecto `bg-color2`); en `overlay` tiñen el velo, y con `mobileOverlay = false` son el fondo del bloque de texto en móvil.
- `class`: clases extra en el `<section>`. `panel` y `overlay-strong` son de `overlay`.

En `stacked` la banda tiene un ancho máximo de 1440px (`--hero-band-max`): en pantallas más anchas la foto no se amplía y los laterales toman el color del bloque de texto. `overlay` no lleva tope: es una excepción a sangre (`sizes="100vw"`). `stacked` y `split` comparten el ancho `--hero-width` (= `--container-wide`, 1440px) en vez del `--container` de 1120px: en dos columnas, 1120 deja el texto en ~580px y la foto en ~480px.

### Variantes de imagen: `_hd` y `_m`

Las dos son **por convención de nombre de archivo, nunca por front matter**, y
las dos son opcionales: si el archivo no está, el markup cae limpio.

| Sufijo | Qué es | Para qué | Cómo se sirve |
|---|---|---|---|
| `foto_hd.webp` | la MISMA foto con más píxeles | densidad (retina) | `srcset` w, en los tres layouts |
| `foto_m.webp` | OTRO encuadre para móvil | art direction en móvil | `<source media="(width <= 51.25em)">` |

No son intercambiables. `srcset` elige candidato por ancho y DPR, así que dos
archivos con el mismo aspecto y distinto recorte le resultan equivalentes y
serviría cualquiera: el cambio de **encuadre** solo lo resuelve `<picture>`.

`_m` funciona en cualquier bloque que pase por `img-responsive.html`, no solo
en el hero: `image-text`, `cards`, `gallery`, `team`, `slider`,
`testimonials`, `brands-logos`, `locations`. El `<picture>` se emite **solo si
el `_m` existe**, así que las imágenes sin variante móvil no pagan markup de
más.

`cta`, `banner` y `counter` siguen la misma convención, aunque pintan la foto
con `background-image`: `img-bg-style.html` detecta `_m` (y `_hd`, y
`_m_hd`) junto al archivo de `bg` y los pasa como variables CSS
(`--section-bg-mobile`, `-hd`). No hay `<picture>`: el cambio lo hace la media
query de `.has-bg-image`. La clave `bgMobile` ya no existe: si un bloque o
shortcode la recibe, el build se detiene con un mensaje.

Ojo con reutilizar una misma foto en dos bloques: su `_m` es uno solo. Si
sirve de hero (banda 3:2) y de fondo de un `cta` (sección más alta), el mismo
recorte móvil tiene que funcionar en las dos cajas.

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
| `img-bg-style.html` | lo mismo para `background-image` (`cta`, `banner`, `counter`): variables CSS con `url()`, `image-set()` si hay `_hd`, y la variante móvil si hay `_m`. Antes `bg-image-style.html`. |

`img-responsive.html` acepta `noMobile: true` para quien monte su propio
`<picture>`. (Antes se llamaba `responsive-img.html`; se renombró para que los
partials de imagen sean la misma familia `img-*`.)

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
