# F1 Theme · Page Types

F1 Theme distingue entre páginas reales y bloques visuales.

Los bloques `Servicios` y `Productos` dentro de Visión y Audición **no son páginas**: son secciones tipo `cards` dentro del hub.

## home

URL: `/`

Uso: landing principal.

Bloques habituales:

```yaml
hero
sections:
  - type: counter
  - type: image-text
  - type: cards
  - type: cta
faq
```

## standard

URLs: `/nosotros/`, `/contacto/`, páginas legales.

Uso: páginas corporativas, contacto o legal.

## hub

URLs: `/vision/`, `/audicion/`

Uso: landing principal de una categoría. Distribuye autoridad hacia sus páginas hijas.

Contiene cards de servicios y productos, pero esos grupos no tienen URL propia como páginas comerciales.

## single

URLs ejemplo:

- `/vision/servicios/optometria/`
- `/vision/productos/gafas-progresivas/`
- `/audicion/servicios/audiometria/`
- `/audicion/productos/audifonos/`

Uso: página hija con SEO propio, CTA propio, FAQ propia y breadcrumb.

Breadcrumb visible correcto:

```txt
Inicio > Visión > Optometría
```

No:

```txt
Inicio > Visión > Servicios > Optometría
```

## legal

Uso: aviso legal, privacidad, cookies.
