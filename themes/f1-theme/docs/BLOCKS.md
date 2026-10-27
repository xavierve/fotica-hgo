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
- `hero.html` (+ `hero-config.html`, `hero-copy.html`, `hero-preload.html`, `img-srcset.html`)
- `section-renderer.html`
- `footer.html`
- `back-to-top.html`
- `sticky-cta.html`

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

- `width`: `narrow` (860px, `--container-narrow`), `default`, `wide`, `full`
- `variant`: `default`, `soft`, `featured`, `contrast`
- `textSize`: `xs`, `s`, `m`, `l`, `xl` — ver "Talla de bloque vs talla de prosa" en FRONTMATTER.md
- `align`: `left`, `center`, `right`
- `class`: string opcional
- `eyebrow`: antetítulo opcional sobre el H2 (shortcode: `eyebrow="…"`). Ver «Cabecera de bloque».
- `surface`: `bleed` (defecto) | `card`, para bloques con fondo. Ver «Fondo: banda o tarjeta».
- `cols`: solo en los bloques con rejilla auto-fit (`cards`, `team`, `testimonials`, `gallery`,
  `brands-logos`, `counter`). Ver «Columnas máximas (`cols`)».

## Columnas máximas (`cols`)

Las rejillas se reparten solas: caben tantas columnas como permita el ancho. Con 8 logos eso
da 6+2 en un escritorio; con `cols: 4`, 4+4.

```yaml
- type: brands-logos
  cols: 4          # máximo 4 columnas
```

- **Sin `cols`** (o `cols: auto`): comportamiento de siempre. El HTML no cambia.
- **`cols: N`** (entero 1–12): **máximo** N columnas. Sigue siendo auto-fit hacia abajo: en
  pantallas estrechas caben menos y baja solo (nunca fuerza N columnas apretadas). Es un techo,
  no un número fijo: con menos elementos que N se reparten como siempre.
- Cualquier otro valor (`0`, `13`, `abc`) → el build falla con la ruta de la página.
- Aplica a los bloques `cards`, `team`, `testimonials`, `gallery`, `brands-logos`, `counter`
  y a los shortcodes `cards`, `testimonials`, `brands-logos` (`cols="4"`).
- `counter`: en móvil (≤ 820 px) sigue siendo una columna, con o sin `cols`.
- `testimonials`: por defecto son 3 columnas fijas en escritorio; `cols: 2` baja el techo a 2.
- **`cards` ya tiene `columns`** (2|3|4, número *fijo* de columnas en escritorio). No se
  mezclan: usar `columns` y `cols` a la vez falla el build. `cols` es el techo flexible;
  `columns` el reparto fijo clásico.
- Limitación asumida: a anchos intermedios el máximo no garantiza el reparto bonito (8 logos
  con `cols: 4` son 3+3+2 en torno a 600 px, porque no caben 4). Es el auto-fit.

## Fondo: banda o tarjeta (`surface`)

Un bloque con fondo de color (`class: bg-colorN`, `bgColor`, `variant` soft/featured/contrast,
`counter`, `trustbar`) dice una de dos cosas, nunca una intermedia:

| `surface` | Aspecto | Dice |
|---|---|---|
| `bleed` (defecto) | Color de borde a borde del viewport, esquinas rectas; el contenido, en su ancho | «Empieza otra sección» |
| `card` | Dentro de la columna, radio `--radius`, padding `--block-pad-compact`, margen propio | «Pieza destacada de esta sección» |

- **Sections de página:** ya iban a sangre; `bleed` no cambia nada. `card` las para en el ancho
  del bloque (`default` 1120, `wide` 1440, `narrow` 860) con 16px de margen mínimo a los lados.
- **Shortcodes en el prose:** antes medían su ancho y se leían como una caja flotante (cuadrada, ni
  banda ni tarjeta). Ahora `bleed` lleva el color al viewport con un `::before` que hereda el fondo
  del bloque, y `html{overflow-x:clip}` evita el scroll horizontal. El contenido se alinea con el
  de la página (en móvil, x=16 dentro y fuera de la banda); la tarjeta conserva su margen interior.
  Medido sin scroll a 375, 1440, 1920 y 2560.
- **Con foto** (`has-bg-image`: CTA, banner, counter con `bg`) no se aplica: siguen como estaban.
- **No usar `card` con bloques que ya pintan tarjetas** (`list-grid`, `testimonials`, `faq`,
  `cards`): tarjeta dentro de tarjeta, dos niveles de borde y radio. Esos van con `bleed`. Por eso
  `card` no lleva sombra: si se usa mal, pesa lo menos posible.
- No hay variante «caja» (cuadrada, sin sangrar): era la forma ambigua que esto quita.
- `card` + `width: full` se contradicen y rompen el build (`errorf`), como un valor desconocido.
- Demo: p16 (prose) y 17.x (sections).

## Cabecera de bloque (`eyebrow`, `title`, `subtitle`)

Todos los bloques con título pintan su cabecera con `partials/block-heading.html`:
`text`, `cards`, `testimonials`, `team`, `text-split`, `brands-logos`, `locations`, `gallery`,
`slider`, `timeline`, `trustbar` e `image-text` (en este, dentro de la columna de texto y sin
subtítulo). Bloque y shortcode pasan por el mismo partial: paridad por construcción. `cta` y
el hero conservan su cabecera propia (ya tenían `eyebrow`).

- **`eyebrow`, solo donde el H2 no define el bloque.** Si el titular es evocador («Nos
  conocemos de toda la vida…»), el eyebrow dice qué es la sección («Opiniones de clientes»).
  Con un H2 descriptivo («Preguntas frecuentes») sobra. En todas las secciones dejaría de
  orientar.
- **Si el antetítulo ya dice qué es el bloque, es el `title`, no un eyebrow** («Nuestros
  compromisos» en `/nosotros/`). Un eyebrow sin H2 deja la sección sin encabezado (el lector de
  pantalla no la encuentra navegando por títulos) y se ve huérfano. Si aun así va solo, el partial
  le pone `is-solo` y el CSS le da el hueco hasta el contenido que dejaría el H2.
- Se escribe en minúsculas de frase: las mayúsculas las pone el CSS (`.eyebrow`), y el lector de
  pantalla lee el texto tal cual.
- HTML: `<p class="eyebrow block-eyebrow">` antes del `<h2>`, sin envoltorio. **Sin eyebrow el
  HTML es idéntico al anterior** (comprobado en las 30 páginas y la demo). El H2 sigue siendo
  cabecera de bloque detrás del eyebrow: `h2:is(:first-child, .block-eyebrow + h2)`.
- Color `--color-eyebrow` (dorado `--color-accent-text`, 4,9:1 sobre `bg-color1`), que pasa a
  `-inverse` en fondos oscuros como en el hero.
- Al unificar, `gallery`, `slider`, `testimonials` y `timeline` muestran también `subtitle` si se
  pasa (antes lo ignoraban: la galería de `/nosotros/` tenía uno que no salía).

**Bloques dentro del body (shortcodes).** Un bloque intercalado en el texto
vive dentro de `.container.prose`, que ya pone el margen lateral. Sin fondo
propio, su contenido se alinea con el texto de la prosa (su `.container` ocupa
el ancho del padre; `default`/`narrow` siguen limitando con `max-width`). Con
fondo (`.has-surface`) conserva 1rem por lado entre el borde del fondo y el
texto. Hasta oct 2026 se restaba ese margen dos veces y en móvil el contenido
quedaba 16px hacia dentro respecto al texto.

**Cadenas largas.** `main` y el footer llevan `overflow-wrap: anywhere`: un
correo, una URL o un nombre de archivo se parte antes que desbordar, también
dentro de filas flex o grid (`break-word` no reduce el ancho mínimo de un
item; `anywhere` sí). El header queda en `break-word`: ahí encoge el logo. Los
`.icon` llevan `flex-shrink: 0` para que el que se parte sea el texto, no el
icono.

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
    bg:            # + bgColor (sistema unificado de fondos; recorte movil por convencion _m)
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
    valign: top       # top | center (default) | bottom
    sticky: true      # la foto acompaña el scroll (solo escritorio)
```

Si `reverse: true`, añade `is-reverse`.

`valign` alinea verticalmente **las dos columnas** del grid cuando una es más
alta que la otra: `top` → `is-top`, `bottom` → `is-bottom`, ambas con
`align-items` sobre `.image-text-inner`. El default es `center` (el elemento más
corto queda centrado contra el más alto) y **no emite clase** — escribir
`valign: center` es válido y equivale a omitirlo. Solo tiene efecto en escritorio
(> 51.25em): por debajo el grid es de una columna. Un valor fuera de la terna aborta
el build con `errorf`.

No confundir con `align` de Campos Comunes, que es `text-align` (horizontal).

`sticky: true` (shortcode: `sticky="true"`) añade `is-sticky`. En escritorio la foto empieza
alineada con el titular y **se queda fija bajo la cabecera** mientras dura el texto; al acabar el
texto se va con él. Para bloques de texto largo, donde la foto centrada dejaba huecos arriba y
abajo (`/nosotros/`). Implica alineación arriba (`align-items: start`; un elemento estirado no
puede fijarse), así que con `valign: center` o `bottom` el build falla con `errorf`;
`valign: top` es redundante pero válido. `top: 6.5rem` (cabecera fija de escritorio + aire). Por
debajo de 51.25em no hace nada: el bloque va apilado. Demo 2.13.

**Ancho de las columnas (escritorio):** la columna de texto no pasa de la medida de
lectura (`--measure-col`, 33.5em ≈ 70-74 caracteres). Hasta ahí las dos columnas son
iguales; a partir de ahí la imagen se lleva el ancho extra. En `default` no llega a
actuar; en `wide`, desde ~1440px; en `full`, desde ~1530px. En `full` el fondo va a sangre,
pero el contenido no pasa de 120rem (1920px): por encima, el bloque es el de 1920, centrado. El `sizes` de la imagen
depende de `width` por eso. Detalle y medidas: DESIGN_TOKENS.md 3.5 y GUIA-IMAGENES.md.

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

En escritorio, el texto de cada columna (`p`, `ul`, `ol`) no pasa de
`--measure-col` (33.5em ≈ 70-74 caracteres), alineado según el `align` del item.
Solo actúa en columnas anchas (`wide`/`full` en pantallas grandes, o `textSize`
pequeño); con letra grande el tope crece con ella. DESIGN_TOKENS.md 3.5.

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
    width: default      # narrow | default | wide | full
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

## Brands Logos

Rejilla de logos (marcas que se trabajan, certificaciones, colaboradores).

```yaml
- type: brands-logos
  title: "Marcas con las que trabajamos"   # opcional
  subtitle:                                # opcional
  items:
    - image: "/images/321-marca_phonak.svg"
      imageAlt: "Phonak"                   # el nombre de la marca: el logo ES el texto
      text: "Phonak"                       # opcional, pie bajo el logo
```

- **Formato fijo:** cada logo va en una caja 2:1 de 160×80 como máximo, con
  `object-fit: contain`. El archivo se entrega en lienzo 320×160 con el logo
  centrado (detalle en GUIA-IMAGENES.md). Alto conocido antes de cargar: sin
  salto de layout aunque sea SVG.
- Columnas automáticas (`minmax(8rem, 1fr)`): dos por fila a 320px, hasta
  siete en escritorio; con pocos logos, las columnas se reparten el ancho.
- `imageAlt` es obligatorio en la práctica: un logo sin alt es una marca que
  el lector de pantalla no nombra.

**También existe como shortcode** (`{{< brands-logos >}}` +
`{{< brands-logos-item >}}` anidados, este último sin cierre), con los mismos
parámetros: `title`, `subtitle` y los campos comunes en el wrapper; `image`,
`imageAlt` y `text` en cada item. El markup de cada logo sale de un único
partial (`partials/brands-logos-item.html`) que usan bloque y shortcode.

```
{{</* brands-logos title="Marcas con las que trabajamos" */>}}
{{</* brands-logos-item image="/images/logos/phonak.svg" imageAlt="Phonak" */>}}
{{</* brands-logos-item image="/images/logos/widex.svg" imageAlt="Widex" */>}}
{{</* /brands-logos */>}}
```

El item fuera del wrapper o sin `image` corta el build con la línea exacta;
sin `imageAlt`, aviso (`WARN`).

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

`columns` acepta `2`, `3` o `4` y genera `cards-columns-{columns}`. Alternativa: `cols: N` (techo
flexible, ver «Columnas máximas»); no se usan los dos a la vez.

## CTA

```yaml
sections:
  - type: cta
    title:
    subtitle:
    bg:                  # imagen de fondo; movil: foto_m.webp junto al archivo, si existe
    bgColor:                # color de fondo plano puntual, o tinte del overlay si hay bg
                              # (para la paleta, usar class: "bg-color1".."bg-color4")
    textColor:                # color de texto puntual a juego con bgColor
    preset: contact             # atajo: par Llamar (url: phone) + WhatsApp (url: whatsapp)
    buttons:                     # alternativa a preset: lista de botones {text, url, icon}
                                 # url admite un canal de site.yaml: url: phone
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

| | Desktop (> 51.25em) | Móvil (<= 51.25em) |
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
mecanismo `bg`/`bgColor`/`textColor` que `cta` y `counter` (recorte móvil por
convención `_m`). Existe como
bloque (`type: banner`, sección de página completa) y como shortcode
(`{{< banner >}}`, intercalado dentro del body markdown) — misma lógica en
ambos.

```yaml
sections:
  - type: banner
    bg:             # movil: foto_m.webp junto al archivo, si existe
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

Cada tarjeta lleva `id` = `locations[].id`, de modo que `/contacto/#andalucia`
lleva a esa sede (la cabecera sticky no la tapa: `scroll-padding-top` en `html`).
Es la URL para el campo «sitio web» de cada perfil de Google Business. Un solo
bloque `locations` por página, para no repetir ids.

Claves de `locations[]` que no pinta el bloque pero lee `schema.html`:

| Clave | Uso |
|---|---|
| `schemaName` | Nombre exacto del perfil de Google Business → `name` del schema. Sin él, `name`. Si difiere de `name`, este va como `alternateName`. |
| `offerCatalogs` | Catálogos de la sede → `hasOfferCatalog`. Sin él, hereda `business.offerCatalogs`. Para sedes que no ofrecen todo. |
| `hoursSpec` | Horario propio; sin él, hereda `contact.hoursSpec`. |

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

## Teléfonos y WhatsApp: siempre desde `site.yaml`

Ningún `.md` lleva un número escrito a mano. Se nombra el canal, que es su clave
en `contact`:

| Dónde | Escribe | Sale |
|---|---|---|
| Botones (`cta`: `buttons`, `button1`/`button2`; shortcode `cta`: `b1url`…; hero: `primaryCTA`/`secondaryCTA`) | `url: phone` | `href="tel:+34…"` |
| Prosa de bloques de `sections` (`faq`, `text`, `image-text`, `text-split`, `banner`) | `… llámanos al {phone} …` | enlace con `phoneLabel` |
| `FAQPage` del schema | (la misma respuesta) | texto: `952 54 09 64` |

En `url` el canal va a secas; en el texto, entre llaves, para separarlo de las
palabras de alrededor. Sin ambigüedad en `url`: una URL lleva `/`, `:`, `#` o punto, y
un nombre de canal no. `url: "{phone}"` da error con el aviso de cómo escribirlo.

- **Canales:** `phone` (llamadas) y `whatsapp`, y cualquier clave que empiece por
  `phone` o `whatsapp` con su `…Label`: un `phoneAudicion` nuevo ya funciona como
  `{phoneAudicion}` sin tocar el tema. `phone*` → `tel:`, `whatsapp*` → `wa.me/`.
  Un canal inexistente rompe el build. Lo resuelve `partials/contact-link.html`.
- Cualquier otra `url` (`/vision/`, `https://…`) se usa tal cual.
- `preset: contact` es el atajo de las ~50 páginas con el par Llamar + WhatsApp: dos
  botones con `url: phone` y `url: whatsapp`, etiquetas `i18n` (o `labelCall`/
  `labelWhatsapp`) e iconos. Definido una sola vez, en `partials/contact-buttons.html`,
  para `cta` (bloque y shortcode) y hero.
- Las llaves **no** funcionan en `title`/`subtitle`, en `description`/`og` ni en el body
  del `.md` o de los shortcodes: ahí, no poner números.
- Demo: FAQ (14), CTA 15.13 y shortcode p5.3.
- Footer: junto al fijo de cada sede, icono de WhatsApp (el de la sede si tiene
  `locations[].whatsapp`; si no, el común), con `aria-label` «WhatsApp 717 77 00 90».

```yaml
# data/site.yaml
contact:
  phone: "+34952540964"        # llamadas
  phoneLabel: "952 54 09 64"
  whatsapp: "+34717770090"     # WhatsApp
  whatsappLabel: "717 77 00 90"
```

## Shortcode `figure` (imagen suelta en el prose)

`{{< figure src="/images/foto.webp" alt="…" caption="Leyenda con **markdown**" >}}`

Imagen a todo el ancho del prose (hasta 1120px), con leyenda opcional en `<figcaption>`.
Es la forma de intercalar una imagen suelta en el body: **no escribir `<img>` en HTML crudo**
en un `.md`, que sale sin `srcset`, sin dimensiones y con el estilo en línea.

- `src` y `alt` obligatorios (error de build si faltan). `_hd` y `_m` por convención, vía
  `img-responsive.html`, como cualquier imagen del tema. Medidas: GUIA-IMAGENES.md.
- `caption`: markdown en línea. Aporta el dato que la imagen no dice sola, no repite el `alt`.
- `class`: clase extra en el `<figure>`.
- El `aspect-ratio` se lee del archivo base: el navegador reserva el hueco antes de descargar
  (sin salto de layout). Si hay `_m`, no se fija, porque la variante móvil tiene otra proporción.
- `sizes`: `(width > 72em) 1120px, calc(100vw - 2rem)` (medido: 343px a 375 de ancho, 1120px
  desde 1152).
- Leyenda: misma regla CSS que `.image-text-caption`.
- Sustituye al shortcode interno `figure` de Hugo (mismo nombre a propósito).
- Solo existe como shortcode: en `sections:` las imágenes van dentro de su bloque.
- Demo: p2.1.

## Utilidad de prosa `list-grid` (lista en tarjetas)

Una lista del markdown que son piezas sueltas (compromisos, ventajas), no prosa, se puede
mostrar como tarjetas con atributos de Goldmark en la línea siguiente a la lista:

```markdown
{{< text class="bg-color1" title="…" >}}
- **Título.** Texto de apoyo.
- **Otro título.** Más texto.
{.list-grid role="list"}
{{< /text >}}
```

- **Sigue siendo un `<ul>`**. `role="list"` hace falta: sin viñetas, Safari/VoiceOver deja de
  anunciarlo como lista.
- **El primer `<strong>` de cada item es el título de la tarjeta.** La puntuación va dentro de
  la negrita (`**Título.** Texto`); con `**Título**, texto` la coma abre línea.
- Una columna en móvil, **2×2 fijo** desde escritorio (con cuatro items, una rejilla automática
  daba 3 + 1 huérfana a 821px). Pensado para 2, 4 o 6 items.
- La tarjeta usa `--color-bg-over` (el blanco de `.card`): va sobre un fondo de paleta, p. ej.
  `{{< text class="bg-color1" >}}`.
- Es una clase de prosa, no un bloque: no tiene `type:` en `sections:`. En el campo `text` de
  un bloque `text` funciona igual (es markdown).
- Uso: `/nosotros/` (los cuatro compromisos). Demo p2.2.

## Shortcode `obf` (dato ofuscado en línea)

`{{< obf text="52582059B" >}}` · `{{< obf text="..." fallback="escríbenos y te lo facilitamos" >}}`.
Para datos que no deben salir como texto en el HTML (CIF, domicilio en `/aviso-legal/`): el build
guarda el dato en base64 dentro de `<span data-obf="…">` y `main.js` (bloque «datos ofuscados») lo
decodifica y lo escribe con `textContent`. Anti-scraping básico, no cifrado.

- `text` (obligatorio, error de build si falta): texto plano, se escapa al insertarlo.
- `fallback`: lo que se lee **sin JavaScript** (por defecto «[activa JavaScript para ver este dato]»).
  Para datos de identificación legal, poner una vía alternativa.
- Un base64 inválido deja el texto de reserva y registra el error en consola; no afecta al resto.
- No es un bloque de `sections:` (es en línea), así que no tiene equivalente en front matter.

## Shortcode `contact-form` (formulario de contacto)

`{{< contact-form >}} …markdown… {{< /contact-form >}}`. El markdown de dentro es la **primera
capa** de protección de datos (una línea por epígrafe + enlace a la política completa) y se pinta
sobre la casilla RGPD. Sin parámetros; los textos salen de i18n
(`cf*`, `err*`, `mail*`).

- **Backend:** `static/contacto/enviar.php` (PHP `mail()`). El propio shortcode **genera**
  `public/contacto/config.php` en cada build desde `data/site.yaml` → `contact.form.from` /
  `contact.form.to` (por defecto la dirección decodificada de `contact.emailEnc`) / `contact.form.fromName` y desde i18n: el PHP no
  duplica ningún dato.
- **El build falla** si el dominio de `contact.form.from` no está alineado con `baseURL` (SPF/DKIM).
- Funciona **sin JS** (POST normal → 303 a `#recibido`) y con JS (`fetch`, validación accesible,
  confirmación inline con `aria-live` y foco). Siempre a la vista, también en móvil. Escritorio:
  dos columnas, datos | información + casilla + enviar, con el HTML en ese orden.
- Detalle de diseño, despliegue y verificación: tarea 5 de `CLAUDE.md`.
