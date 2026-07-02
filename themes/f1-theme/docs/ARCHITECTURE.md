# F1 Theme · Architecture

## Sitio

```txt
content/
├── _index.md
├── nosotros/_index.md
├── vision/_index.md
├── vision/servicios/*.md
├── vision/productos/*.md
├── audicion/_index.md
├── audicion/servicios/*.md
├── audicion/productos/*.md
├── contacto/_index.md
├── aviso-legal/_index.md
└── politica-privacidad/_index.md
```

## Tema

```txt
themes/f1-theme/
├── layouts/_default/baseof.html
├── layouts/_default/single.html
├── layouts/_default/list.html
├── layouts/index.html
├── layouts/partials/*.html
├── assets/css/critical.css
├── assets/css/main.css
└── docs/*.md
```

## Regla importante

`servicios` y `productos` son carpetas técnicas para organizar contenido y mejorar los slugs.

No son páginas comerciales, no aparecen en el menú principal y no deben aparecer como nivel visible en breadcrumbs.
