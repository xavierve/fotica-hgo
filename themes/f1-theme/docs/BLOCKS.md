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

## Nomenclatura

El `type` de un bloque en `sections:` y el nombre de su shortcode equivalente
en body markdown deben coincidir siempre (`type: text` ↔ `{{< text >}}`,
`type: cta` ↔ `{{< cta >}}`, `type: text-split` ↔ `{{< text-split >}}`). Un
mismo componente con dos nombres distintos según el sistema genera confusión
sobre cuál usar dónde — ver CHANGELOG.md, rename `cta-banner` → `cta`.

Todos los `type:` usan guión alto, nunca guión bajo (`image-text`, no
`image_text`) — coincide con el nombre real del archivo del partial
(`blocks/image-text.html`) sin necesidad de ninguna normalización.

## Campos Comunes

Todos los bloques aceptan:

- `width`: `default`, `wide`, `full`
- `variant`: `default`, `soft`, `featured`, `contrast`
- `textSize`: `xs`, `s`, `m`, `l`, `xl` — ver "Talla de bloque vs talla de prosa" en FRONTMATTER.md
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
  - type: image-text
    width: wide
    variant: soft
    textSize: l
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
        textSize: xl      # xs|s|m|l|xl
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
usa `textSize: l` o `xl`, se limita automáticamente a `26ch` de ancho y se
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
    textSize: m          # xs | s | m | l | xl
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

## CTA

```yaml
sections:
  - type: cta
    title:
    subtitle:
    bg:                  # imagen de fondo (desktop)
    bgMobile:              # imagen de fondo (movil), opcional
    bgColor:                # color de fondo plano puntual, o tinte del overlay si hay bg
                              # (para la paleta, usar class: "bg-color1".."bg-color4")
    textColor:                # color de texto puntual a juego con bgColor
    preset: contact             # botones Llamar + WhatsApp desde data/site.yaml
    buttons:                     # alternativa a preset: lista de botones {text, url, icon}
      - text:
        url:
        icon:
    microcopy:                    # linea pequena bajo los botones
    layout: split                  # opcional, columnas con eyebrow
```

`tone` ya no existe (eliminado — `bgColor`/`textColor`/`class` cubren cualquier
combinación de color sin necesitar variantes con nombre fijo).

### Ornamento de marca

Dibujo grande de marca detrás del texto del CTA. **No es un parámetro del
bloque: se activa con clases**, porque hoy solo se usa en los dos CTA de la
home (la bifurcación visión / audición).

```yaml
  - type: cta
    class: "bg-color3 cta-ornamento cta-ornamento-ojo"
  - type: cta
    class: "bg-color2 cta-ornamento cta-ornamento-oreja"
```

- `cta-ornamento` — activa el mecanismo (posicionamiento, recorte, tamaño).
- `cta-ornamento-ojo` / `cta-ornamento-oreja` — eligen el dibujo y el lado.

**Las dos clases de dibujo son propias de este tema**, no genéricas: apuntan a
`/images/ornamento-ojo.svg` y `/images/ornamento-oreja.svg`, extraídos del
logotipo de Fausto (grupos `g71` y `g64` de `logo-fausto.svg`). El mecanismo
`cta-ornamento` sí es reutilizable — la variable `--ornamento` acepta cualquier
SVG. Si el ornamento hace falta en más de un par de páginas, el momento de
convertirlo en parámetro del bloque es ese; con dos CTA no compensa.

**Se pinta con `mask` + `background-color: currentColor`, no con
`background-image`.** Así hereda el par de color de la superficie y funciona
igual sobre `bg-color1` (tinta oscura), `bg-color2` (blanco) o `bg-color3`
(blanco). Un PNG blanco solo habría servido sobre fondo oscuro, y habría hecho
falta una segunda exportación para el resto.

**Dos presentaciones, un archivo:**

| | Desktop (≥821px) | Móvil (<821px) |
|---|---|---|
| Rol | marca de agua | icono |
| Tamaño | 130% de `.cta-inner` ≈ 70% de la banda | `clamp(48px, 13vw, 64px)` |
| Posición | al lado del texto, sangrando por el borde | centrado sobre el titular |
| Opacidad | .20 ojo · .26 oreja | .8 |
| Hueco | `padding` lateral del 30% / 26% | `padding-top` de `.cta-inner` |

El porcentaje de altura se resuelve contra `.cta-inner`, que es solo la caja del
texto — la section añade `--block-pad` arriba y abajo. Por eso 130% y no 70%.

Las opacidades de desktop **no son iguales a propósito**: la tinta oscura sobre
crema empasta antes que el blanco sobre navy o verde. Y la de móvil no
distingue superficie: si algún día vuelve a usarse un CTA con `bg-color1`, ese
.8 sería tinta casi maciza sobre el crema y habría que bajarlo solo en
`cta-ornamento-ojo` dentro de la media query.

Es decorativo puro: va en `::before`, no en el DOM, así que no lo anuncia un
lector de pantalla y no necesita `aria-hidden`. Si algún día pasara a ser
informativo (por ejemplo identificando visión o audición en cada card), ahí sí
tendría que estar en el marcado con su etiqueta.

**El ornamento no debe ir en `--color-accent`.** Un dibujo grande en oro macizo
compite con el botón dorado que tiene debajo en las bandas oscuras — invierte la
jerarquía. Y el contraste no acompaña: el oro da 2.44:1 sobre el verde
`bg-color3` (medido con el verde actual `#08783e`; con el anterior `#34855B`
eran 1.98:1) frente a 5.09:1 sobre navy, así que el mismo valor daría una oreja
rotunda sobre navy y un ojo turbio sobre verde. Para más presencia, subir la
opacidad del `currentColor`, no cambiar el color. Sobre verde, usar opacidad 1:
a .88 el oro pierde la poca separación que tiene.

El color de acción del sitio es `--color-link` (verde) sobre fondo claro y
`--color-accent` (oro) sobre fondo oscuro — ver `DESIGN_TOKENS.md` 1.1.1.

## Banner

Frase destacada / guiño de confianza, sin botones — para eso usa `cta`. Mismo
mecanismo `bg`/`bgMobile`/`bgColor`/`textColor` que `cta`/`hero`. Existe como
bloque (`type: banner`, sección de página completa) y como shortcode
(`{{< banner >}}`, intercalado dentro del body markdown) — misma lógica en
ambos.

```yaml
sections:
  - type: banner
    bg:
    bgMobile:
    bgColor:
    textColor:
    textSize: m     # xs | s | m | l | xl — m por defecto
    align: center   # left | center | right — center por defecto
    text: "Frase destacada en **markdown**."
```

## Locations

Sedes del negocio. **No recibe direcciones ni teléfonos por parámetro**: los lee
de `data/site.yaml` → `locations[]`, la misma fuente que consumen `footer.html`
y `schema.html`. Si cambia un teléfono se edita `site.yaml` y se actualiza en
todo el sitio a la vez.

```yaml
sections:
  - type: locations
    title:
    subtitle:
    layout: compact      # compact (sin imagen) | full (con imagen, por defecto)
    showCommon: true     # añade móvil/WhatsApp, email y horario comunes
    align: center
```

De cada sede usa `name`, `address`, `location`, `phone`, `phoneLabel` y
`mapUrl`; en `layout: full` añade además `image` e `imageAlt`. La dirección
enlaza a `mapUrl` y el teléfono a `tel:`, con iconos `location` y `phone`.

Equivalente en body markdown:

```
{{</* locations layout="compact" showCommon="true" title="…" subtitle="…" */>}}
```

`layout` es un parámetro propio y no tiene nada que ver con `variant`, que sigue
siendo el de fondo (`soft`/`featured`/`contrast`) como en el resto de bloques.

## Hours

Horario de apertura desde `site.yaml` → `contact.hours`. No es un bloque de
`sections:`, es un partial reutilizable con shortcode:

```
{{</* hours */>}}
```

```yaml
# data/site.yaml
contact:
  hours:
    weekdays: "Lunes a viernes: 10:00–13:30 y 17:30–21:00"
    saturday: "Sábados: 10:00–13:30"
    sunday: ""        # vacío = cerrado, no se pinta
```

Lo consumen `footer.html`, el bloque `locations` (con `showCommon: true`) y
cualquier página vía shortcode. El schema.org se alimenta aparte de
`contact.hoursSpec` (clave `days`, no `dayOfWeek`), que cada sede hereda salvo
que defina el suyo propio.

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
