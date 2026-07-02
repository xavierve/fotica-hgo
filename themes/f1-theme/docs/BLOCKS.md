# F1 Theme · Blocks

## 1. HEADER_META

Partial: `header-meta.html`

Contenedor del `<head>`. Llama a `seo.html`, `og.html` y `schema.html`. Carga CSS crítico, CSS principal, favicon y viewport.

## 2. SEO

Partial: `seo.html`

Campos:

```yaml
seo:
  title:
  description:
  canonical:
  robots:
```

Fallbacks: usa `title`, `description` y `.Permalink` si faltan campos SEO específicos.

## 3. OG

Partial: `og.html`

Campos:

```yaml
og:
  title:
  description:
  image:
  type:
```

Sirve para WhatsApp, Facebook, LinkedIn y Twitter/X.

## 4. SCHEMA

Partial: `schema.html`

Genera JSON-LD básico para página y FAQ. En v0.1 es funcional y simple; en v0.2 se ampliará para LocalBusiness, Service, Product y BreadcrumbList completos.

## 5. HEADER

Partial: `header.html`

Datos desde `data/site.yaml`.

Muestra logo, navegación principal, botón de llamada y botón de WhatsApp.

## 6. BREADCRUMB

Partial: `breadcrumb.html`

Muestra migas en páginas interiores.

Regla Fausto: ignora visualmente `servicios` y `productos` aunque estén en la URL.

## 7. HERO

Partial: `hero.html`

Campos:

```yaml
hero:
  eyebrow:
  title:
  subtitle:
  image:
  imageAlt:
  imageBackground:
  primaryCTA:
    text:
    url:
  secondaryCTA:
    text:
    url:
```

## 8. SECTION_RENDERER

Partial: `section-renderer.html`

No es visual. Recorre `sections` y llama al partial correspondiente según `type`.

## 9. COUNTER

Partial: `counter.html`

Campos:

```yaml
- type: counter
  items:
    - number:
      label:
  text:
  imageBackground:
```

## 10. TRUSTBAR

Partial: `trustbar.html`

Franja compacta de confianza.

```yaml
- type: trustbar
  antiguedad:
  personas_atendidas:
  feature1:
  feature2:
  feature3:
```

## 11. IMAGE_TEXT

Partial: `image-text.html`

```yaml
- type: image_text
  title:
  text:
  image:
  imageAlt:
  reverse: false
```

## 12. CARDS

Partial: `cards.html`

```yaml
- type: cards
  title:
  subtitle:
  cards:
    - image:
      imageAlt:
      title:
      description:
      link:
      linkText:
```

Uso principal: cards de servicios y productos dentro de hubs.

## 13. CTA_BANNER

Partial: `cta-banner.html`

```yaml
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

## 14. FAQ

Partial: `faq.html`

Puede usarse como `faq` de página o como sección.

```yaml
faq:
  - question:
    answer:
```

## 15. TESTIMONIALS

Partial: `testimonials.html`

```yaml
- type: testimonials
  title:
  items:
    - text:
      name:
      image:
      rating:
```

## 16. BRANDS_LOGOS

Partial: `brands-logos.html`

```yaml
- type: brands_logos
  title:
  items:
    - image:
      imageAlt:
      text:
```

## 17. GALLERY

Partial: `gallery.html`

```yaml
- type: gallery
  title:
  items:
    - image:
      imageAlt:
      legend:
```

## 18. SLIDER

Partial: `slider.html`

```yaml
- type: slider
  title:
  items:
    - title:
      text:
      image:
      imageAlt:
      legend:
```

## 19. TIMELINE

Partial: `timeline.html`

```yaml
- type: timeline
  title:
  items:
    - number:
      event_title:
      event_text:
```

## 20. TEAM

Partial: `team.html`

```yaml
- type: team
  title:
  subtitle:
  items:
    - image:
      imageAlt:
      name:
      role:
```

## 21. FOOTER

Partial: `footer.html`

Datos desde `data/site.yaml`.

Tres columnas:
1. Marca: logo + texto.
2. Navegación + RRSS.
3. Contacto por sedes.

Incluye colofón legal con año actual generado por Hugo.
