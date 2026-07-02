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

El resto de bloques se renderizan desde:

```yaml
sections:
  - type: counter
```

`section-renderer.html` recorre `sections`, normaliza guiones bajos a guiones y resuelve dinámicamente:

```text
blocks/{type}.html
```

Ejemplos:

- `image_text` -> `blocks/image-text.html`
- `cta_banner` -> `blocks/cta-banner.html`
- `brands_logos` -> `blocks/brands-logos.html`

## Counter

```yaml
sections:
  - type: counter
    items:
      - number: "44+"
        label: "años de experiencia"
    text:
    imageBackground:
```

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
    title:
    text:
    image:
    imageAlt:
    reverse: false
```

## Cards

Bloque genérico para servicios, productos o listados editoriales.

```yaml
sections:
  - type: cards
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

## CTA Banner

```yaml
sections:
  - type: cta_banner
    imageBackground:
    title:
    subtitle:
    button1:
      text:
      url:
    button2:
      text:
      url:
```

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
