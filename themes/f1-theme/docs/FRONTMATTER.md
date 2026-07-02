# F1 Theme · Front Matter

Estructura base recomendada:

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

sections: []

faq:
  - question: ""
    answer: ""
---
```

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
