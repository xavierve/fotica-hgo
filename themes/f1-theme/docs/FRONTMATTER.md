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
  eyebrow: ""
  title: ""
  subtitle: ""
  image: ""
  imageAlt: ""
  bg: ""
  bgMobile: ""
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
    textSize: large
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
- `textSize`: `small`, `default`, `large`, `xl`
- `align`: `left`, `center`, `right`
- `class`: string opcional

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

## Alias de talla (s/m/l/xl)

`pad` y `textSize` aceptan tallas cortas además de sus nombres largos:
`pad: s|m|l` ≡ compact|normal|spacious · `textSize: s|m|l|xl` ≡ small|default|large|xl.
Una sola regla que recordar. Los nombres largos siguen siendo válidos.

## Shortcode `spacer`

`{{</* spacer size="s|m|l" */>}}` — espaciado vertical puntual en el prose (fluido,
tokens `--space-*`). Úsalo como excepción: el ritmo normal lo dan el padding de los
bloques y el `margin-block` de los bloques en prose. Es `aria-hidden` (no es contenido).
