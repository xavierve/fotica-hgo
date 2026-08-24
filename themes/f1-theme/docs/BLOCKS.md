# F1 Theme - Blocks

F1 Theme v0.1 Alpha usa una arquitectura basada en bloques.

## Arquitectura

Los partials globales viven en `themes/f1-theme/layouts/partials/` y no son bloques:

- `header-meta.html`
- `seo.html`
- `og.html`
- `schema.html`
- `header.html`
- `breadcrumb.html`
- `hero.html`
- `section-renderer.html`
- `footer.html`

Todos los bloques renderizables viven exclusivamente en:

```text
themes/f1-theme/layouts/partials/blocks/
```

`hero` es el único bloque especial y permanece fuera de `sections`.

El resto de bloques se renderizan desde `sections`. `section-renderer.html` normaliza guiones bajos a guiones y resuelve dinámicamente `blocks/{type}.html`.

## Campos Comunes

Todos los bloques aceptan:

- `width`: `default`, `wide`, `full`
- `variant`: `default`, `soft`, `featured`, `contrast`
- `textSize`: `small`, `default`, `large`, `xl`
- `align`: `left`, `center`, `right`
- `class`: string opcional

Estos campos generan clases:

```text
block block-{type} block-width-{width} block-variant-{variant} block-text-{textSize} block-align-{align}
```

## Counter

```yaml
sections:
  - type: counter
    animated: false
    items:
      - number: "44+"
        label: "años de experiencia"
    text:
    bg:            # + bgMobile, bgColor (sistema unificado de fondos)
```

Si `animated: true`, añade `is-animated`.

## Trustbar

```yaml
sections:
  - type: trustbar
    items:
      - icon:
        text:
```

## Image Text

```yaml
sections:
  - type: image_text
    width: wide
    variant: soft
    textSize: large
    align: left
    class: home-human
    title:
    text:
    image:
    imageAlt:
    reverse: true
```

Si `reverse: true`, añade `is-reverse`.

## Text Split

```yaml
sections:
  - type: text-split
    width: wide
    title:
    subtitle:
    items:
      - text: "**«Cita o texto destacado»**"
        textSize: xl      # s|small, m|default, l|large, xl
        align: center     # left | center | right
        pad:              # s | m | l — padding interno del item
        margin:           # valor CSS libre, ej. "0 0 1rem 0"
      - text: "Párrafo o texto normal, admite **markdown** completo."
```

Grid simétrico de 2 columnas (misma mecánica que `image-text`: 1fr → 1fr 1fr en
desktop), pero con **ambos** slots de contenido libre en vez de imagen+copy
fijos — pensado para pares texto+texto (cita destacada + explicación) y,
a futuro, texto+vídeo (Goldmark `unsafe: true` ya permite embeber
`<video>`/`<iframe>` sin tratamiento especial).

`textSize`/`align` de cada item reutilizan `block-text-*`/`block-align-*` (los
mismos que Campos Comunes) — no son clases nuevas. `pad` usa tokens propios
del item (`--space-s/m/l`, más pequeños que el pad de sección). Si el texto
usa `textSize: large` o `xl`, se limita automáticamente a `26ch` de ancho y se
centra — evita líneas demasiado largas en una cita grande.

**Solo 2 items por bloque** — el grid no reflowea a más columnas si añades un
tercero, simplemente lo apila fuera de la fila. Para 3+ elementos en grid, usar
`cards` o `testimonials`.

**También existe como shortcode** (`{{< text-split >}}` +
`{{< text-split-item >}}` anidados) para usar dentro del body markdown, con
los mismos parámetros. Útil en páginas como Nosotros donde el resto del
contenido ya vive en prose y no conviene mezclar con `sections:` para un solo
bloque suelto.

## Text

```yaml
sections:
  - type: text
    width: default      # default | wide | full
    variant: default     # default | soft | featured | contrast
    textSize: default    # small | default | large | xl
    align: left           # left | center | right
    pad:                  # compact | default | spacious (o s/m/l)
    bgColor:               # color CSS libre
    title:
    subtitle:
    text: |
      ## Encabezado opcional
      Párrafo con **negrita**, *cursiva*, listas, blockquotes — markdown completo.
```

Bloque de texto libre para `sections:`. Reutiliza `.container.prose`, el mismo
wrapper que ya envuelve el body markdown en `single.html` — mismo ancho de
lectura (`max-width` por elemento, `margin-inline:auto`), mismo tipo, sin CSS
nuevo. Es la pieza que permite mover un tramo de prosa a `sections:` cuando
convenga tenerlo intercalado entre otros bloques (cards, gallery, text-split...)
en vez de vivir en el body markdown, que siempre se renderiza de una sola vez
antes que el array `sections:`.

`title`/`subtitle` son opcionales — si `text` ya trae su propio `##`, no hace
falta duplicar con `title` (quedarían dos H2 seguidos).

**También existe como shortcode** (`{{< text >}}...{{< /text >}}`, mismos
parámetros) para usar dentro del body markdown cuando solo se necesite ese
tramo con un modificador distinto al resto de la prosa (p. ej. un párrafo
`align="center"` en medio de texto alineado a la izquierda), sin tener que
mover todo el contenido a `sections:`.

## Cards

Bloque genérico para servicios, productos o listados editoriales.

```yaml
sections:
  - type: cards
    columns: 3
    title:
    subtitle:
    linkText:
    cards:
      - image:
        imageAlt:
        title:
        description:
        link:
        linkText:
```

`columns` acepta `2`, `3` o `4` y genera `cards-columns-{columns}`.

## CTA Banner

```yaml
sections:
  - type: cta_banner
    tone: vision
    title:
    subtitle:
    button1:
      text:
      url:
    button2:
      text:
      url:
```

`tone` acepta `neutral`, `vision` o `hearing` y genera `cta-tone-{tone}`.

## FAQ

FAQ solo existe como bloque dentro de `sections`.

```yaml
sections:
  - type: faq
    title: "Preguntas frecuentes"
    items:
      - question:
        answer:
```

Cuando existe un bloque `type: faq`, `schema.html` genera automáticamente `FAQPage`.
