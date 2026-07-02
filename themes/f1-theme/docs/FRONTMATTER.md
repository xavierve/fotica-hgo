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
  imageBackground: ""
  primaryCTA:
    text: ""
    url: ""
  secondaryCTA:
    text: ""
    url: ""

sections:
  - type: counter
    items:
      - number: ""
        label: ""
  - type: trustbar
    items:
      - icon: ""
        text: ""
  - type: image_text
    title: ""
    text: ""
    image: ""
    imageAlt: ""
    reverse: false
  - type: cards
    title: ""
    subtitle: ""
    cards: []
  - type: cta_banner
    title: ""
    subtitle: ""
    button1:
      text: ""
      url: ""
    button2:
      text: ""
      url: ""
  - type: faq
    title: "Preguntas frecuentes"
    items:
      - question: ""
        answer: ""
---
```

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
