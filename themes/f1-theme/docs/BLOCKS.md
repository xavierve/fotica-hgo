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
