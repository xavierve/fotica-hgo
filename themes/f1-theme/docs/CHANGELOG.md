# F1 Theme · Changelog

## Sin versión — bloque locations, partial hours y fuente única de horarios

- Nuevo bloque `locations` (+ shortcode) que pinta las sedes desde
  `site.yaml` → `locations[]`, con `layout: compact|full` y `showCommon`.
  Elimina las direcciones, teléfonos y enlaces de mapa escritos a mano en
  la página de Contacto.
- Nuevo partial `hours.html` + shortcode `{{< hours >}}`, fuente única desde
  `contact.hours`. El footer pasa a mostrar horario (antes no lo hacía).
- `schema.html`: `openingHoursSpecification` hereda de `contact.hoursSpec`
  cuando la sede no define el suyo — `or $loc.hoursSpec $contact.hoursSpec`.
- `contact.hoursSpec` normalizado de `dayOfWeek:` a `days:`, que es la clave
  que schema.html lee realmente; con `dayOfWeek` los días salían vacíos.
  Eliminados los `hoursSpec` duplicados dentro de cada location.
- `image-text`: nuevo parámetro `caption` (figcaption bajo la imagen) y clase
  `is-textonly` cuando no hay imagen, para que el grid no deje media página
  vacía.
- `block-classes.html` emite `has-surface` cuando el bloque pinta fondo propio;
  el ritmo vertical pasa a margin en los bloques sin fondo, que colapsa entre
  hermanos y evita sumar el doble de padding entre dos sections seguidas.

## Sin versión — convención de type: a guión alto, fix <p> y div duplicado

- Eliminado el normalizador `replace $type "_" "-"` de `section-renderer.html`
  — ya no hace falta, todos los `type:` usan guión alto directamente
  (`image-text`, `brands-logos`), coincidiendo con el nombre real del archivo
  del partial. 11 archivos de `content/` y 3 docs actualizados.
- Corregido `<div class="cta-inner">` duplicado en `blocks/cta.html`
  (arrastrado desde el rename de `cta-banner`, sin cerrar correctamente).
- `banner`, `testimonial`, `testimonial-item`, `text`, `text-split-item`:
  cambiado `markdownify` por `.Page.RenderString (dict "display" "block")`
  — Hugo elimina el `<p>` envolvente cuando el resultado es un único párrafo,
  lo que impedía controlar line-height/margin por párrafo vía CSS. Con
  `display: "block"` el `<p>` se mantiene siempre.

## v0.1 borrador +

- Añadida documentación mínima funcional del theme.
- Añadido `header-meta.html` para diferenciar metadatos de `header.html` visual.
- Añadidos layouts base: `baseof.html`, `single.html`, `list.html`, `index.html`.
- Añadidos partials funcionales para los 21 bloques.
- Añadido CSS base en `critical.css` y `main.css`.
- Añadido `data/site.yaml` con datos globales de negocio, header y footer.
- Añadido front matter base a las páginas vacías de `content/`.
- Configuradas carpetas técnicas `servicios` y `productos` como no renderizables mediante `_build.render: never`.
