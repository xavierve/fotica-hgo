---
# DEMO / STYLE GUIDE — todos los bloques, modificadores y shortcodes del f1-theme.
# draft:true → NUNCA se publica en producción. Visualizar con: hugo server -D
# Imágenes: picsum.photos (requieren conexión al visualizar; no se descargan al build).
draft: true
title: "Demo de bloques — f1-theme"
linkTitle: "Demo"
description: "Página interna de referencia visual: todos los bloques con sus variaciones."
url: "/demo/"

seo:
  robots: "noindex, nofollow"

schema:
  type: WebPage
  includeBreadcrumb: false
  includeFAQ: false

# ============ HERO con todo: eyebrow, bg desktop+móvil, tinte, preset contact ============
hero:
  eyebrow: "hero · bg + bgMobile + bgColor + class: scrim"
  title: "0- Hero con fondo responsive y CTA de contacto"
  subtitle: "Redimensiona la ventana: por debajo de 820px carga la imagen bgMobile. El overlay toma el tinte de bgColor vía color-mix."
  bg: "https://picsum.photos/seed/fausto-hero/1600/700"
  bgMobile: "https://picsum.photos/seed/fausto-hero-m/700/900"
  bgColor: "var(--bg-color2)"
  preset: contact
  labelCall: "Llamar ahora"
  class: "scrim"           # activo aquí — comparar con los 3 CTA de abajo (scrim/overlay-strong/panel)
  
sections:
  # ============ TRUSTBAR usada como CATÁLOGO DE ICONOS ============
  # Cada item muestra el icono y, como texto, su nombre exacto de invocación:
  # se usan con `icon: "nombre"` en bloques/botones. Set completo (16).
  # xxx el Title no aparece
  - type: trustbar
    title: "1- Catálogo de iconos — icon: \"nombre\""
    class: "demo-note"
    items:
      - { icon: "phone", text: "phone" }
      - { icon: "whatsapp", text: "whatsapp" }
      - { icon: "location", text: "location" }
      - { icon: "mail", text: "mail / email" }
      - { icon: "clock", text: "clock" }
      - { icon: "user", text: "user" }
      - { icon: "star", text: "star" }
      - { icon: "family", text: "family" }
      - { icon: "hearing", text: "hearing" }
      - { icon: "cog", text: "cog" }
      - { icon: "language", text: "language" }
      - { icon: "follow-up", text: "follow-up" }
      - { icon: "arrow-down", text: "arrow-down" }
      - { icon: "arrow-up", text: "arrow-up" }
      - { icon: "arrow-right", text: "arrow-right" }
      - { icon: "info", text: "info" }
      - { icon: "home", text: "home" }

  # ============ IMAGE_TEXT — las 4 variants ============
  - type: image-text
    title: "2.1- image_text · variant: default"
    text: "Bloque base, imagen a la derecha. El campo `text` admite **markdown**."
    image: "https://picsum.photos/seed/it1/640/420"
    imageAlt: "Demo"
  - type: image-text
    variant: soft
    reverse: true
    title: "2.2- image_text · variant: soft + reverse"
    text: "Fondo suave e imagen a la izquierda (`reverse: true`)."
    image: "https://picsum.photos/seed/it2/640/420"
    imageAlt: "Demo"
  - type: image-text
    variant: featured
    title: "2.3- image_text · variant: featured"
    text: "Variante destacada, para el bloque protagonista de una página."
    image: "https://picsum.photos/seed/it3/640/420"
    imageAlt: "Demo"
  - type: image-text
    variant: contrast
    title: "2.4- image_text · variant: contrast"
    text: "Variante de contraste (fondo oscuro)."
    image: "https://picsum.photos/seed/it4/640/420"
    imageAlt: "Demo"

  # ============ IMAGE_TEXT — widths y textSize ============
  - type: image-text
    width: wide
    textSize: l
    title: "2.5- width: wide · textSize: l"
    text: "Contenedor ancho y tipografía grande."
    image: "https://picsum.photos/seed/it5/640/420"
    imageAlt: "Demo"
  - type: image-text
    width: full
    textSize: xl
    align: center
    title: "2.6- width: full · textSize: xl · align: center"
    text: "Ancho completo, la escala tipográfica máxima y alineado centrado."
    image: "https://picsum.photos/seed/it6/640/420"
    imageAlt: "Demo"
  - type: image-text
    textSize: s
    align: right
    title: "2.7- textSize: s · align: right"
    text: "La escala mínima de bloque y alineación derecha. Para letra pequeña editorial."
    image: "https://picsum.photos/seed/it7/640/420"
    imageAlt: "Demo"

  # ============ COUNTER — con y sin fondo ============
  - type: counter
    text: "3.1- counter · sin fondo · animated: true"
    animated: true
    items:
      - { number: "44", label: "años de experiencia" }
      - { number: "27.000", label: "clientes atendidos" }
      - { number: "2", label: "centros en Torre del Mar" }
      - { number: "1982", label: "año de apertura" }
  - type: counter
    text: "3.2- counter · bg + bgColor (overlay tintado)"
    bg: "https://picsum.photos/seed/counter/1600/500"
    bgColor: "var(--bg-color3)"
    items:
      - { number: "14", label: "iconos en el set" }
      - { number: "12", label: "bloques disponibles" }
      - { number: "3", label: "shortcodes" }

  # ============ CARDS (items manuales; la versión automática va como shortcode en el prose) ============
  - type: cards
    title: "4- cards · columns: 3 · items manuales"
    subtitle: "El shortcode {{</* cards */>}} del prose las genera automáticamente desde una sección."
    columns: 3
    linkText: "Ver más"
    cards:
      - { title: "Card A", description: "Con imagen, título, descripción y enlace.", image: "https://picsum.photos/seed/c1/480/320", imageAlt: "Demo", link: "/vision/" }
      - { title: "Card B", description: "Segunda card del grid.", image: "https://picsum.photos/seed/c2/480/320", imageAlt: "Demo", link: "/audicion/" }
      - { title: "Card C", description: "Tercera card del grid.", image: "https://picsum.photos/seed/c3/480/320", imageAlt: "Demo", link: "/nosotros/" }

  # ============ SLIDER ============
  - type: slider
    title: "5- slider"
    items:
      - { image: "https://picsum.photos/seed/s1/800/450", imageAlt: "Demo", title: "Slide 1", text: "Título, texto y leyenda.", legend: "leyenda opcional" }
      - { image: "https://picsum.photos/seed/s2/800/450", imageAlt: "Demo", title: "Slide 2", text: "Segundo slide." }
      - { image: "https://picsum.photos/seed/s3/800/450", imageAlt: "Demo", title: "Slide 3", text: "Tercer slide." }

  # ============ GALLERY ============
  - type: gallery
    title: "6- gallery"
    items:
      - { image: "https://picsum.photos/seed/g1/600/400", imageAlt: "Demo", legend: "Con leyenda" }
      - { image: "https://picsum.photos/seed/g2/600/400", imageAlt: "Demo" }
      - { image: "https://picsum.photos/seed/g3/600/400", imageAlt: "Demo", legend: "Otra leyenda" }
      - { image: "https://picsum.photos/seed/g4/600/400", imageAlt: "Demo" }

  # ============ TEAM ============
  - type: team
    title: "7- team"
    subtitle: "Campos: image, imageAlt, name, role"
    items:
      - { image: "https://picsum.photos/seed/t1/400/400", imageAlt: "Demo", name: "Nombre Uno", role: "Óptico-optometrista" }
      - { image: "https://picsum.photos/seed/t2/400/400", imageAlt: "Demo", name: "Nombre Dos", role: "Audioprotesista" }
      - { image: "https://picsum.photos/seed/t3/400/400", imageAlt: "Demo", name: "Nombre Tres", role: "Atención al cliente" }

  # ============ TIMELINE ============
  - type: timeline
    title: "8- timeline"
    items:
      - { number: "1982", event_title: "Apertura", event_text: "Primer centro en Torre del Mar." }
      - { number: "2004", event_title: "Segundo centro", event_text: "Campos: number, event_title, event_text." }
      - { number: "2026", event_title: "Nueva web", event_text: "La que estás viendo." }

  # ============ BRANDS-LOGOS ============
  - type: brands-logos
    title: "9- brands_logos"
    items:
      - { image: "https://picsum.photos/seed/b1/240/120", imageAlt: "Demo", text: "Marca A" }
      - { image: "https://picsum.photos/seed/b2/240/120", imageAlt: "Demo", text: "Marca B" }
      - { image: "https://picsum.photos/seed/b3/240/120", imageAlt: "Demo" }
      - { image: "https://picsum.photos/seed/b4/240/120", imageAlt: "Demo" }

  # ============ TESTIMONIALS ============
  - type: testimonials
    title: "10- testimonials (text, name, rating, image opcional)"
    items:
      - { text: "Con rating e imagen.", name: "Cliente A", rating: 5, image: "https://picsum.photos/seed/p1/80/80" }
      - { text: "Solo texto y nombre.", name: "Cliente B" }
      - { text: "Con rating, sin imagen.", name: "Cliente C", rating: 4 }

  # ============ TEXT — bloque de prosa libre en sections: ============
  - type: text
    title: "11.1- text · width: default"
    text: |
      ## Un H2 dentro del bloque
      Párrafo con **negrita**, *cursiva* y una [lista](/vision/) — markdown completo, igual que el prose. Reutiliza `.container.prose`: mismo ancho de lectura que el body markdown, sin CSS nuevo.

      - Item de lista
      - Otro item
  - type: text
    width: wide
    variant: soft
    textSize: l
    align: center
    pad: compact
    title: "11.2- text · width: wide · variant: soft · textSize: l · align: center · pad: compact"
    text: "Un párrafo simple, sin headers ni listas, para comparar cómo escala `textSize` un bloque de texto normal."
  - type: text
    class: "bg-color4"
    title: "11.3- text · class: bg-color4 (fondo + texto resueltos solos)"
    text: "Las clases de paleta (`bg-color1`..`bg-color4`) ya traen el color de texto correcto emparejado — no hace falta `bgColor` ni ningún interruptor aparte."

  - type: banner
    class: "bg-color2"
    text: "**12.1-** type: banner · class: bg-color2 — frase destacada como sección de página completa, sin botones, bg/bgColor igual a cta."

  # ============ TEXT-SPLIT — grid simétrico 2 columnas, ambos slots libres ============
  - type: text-split
    title: "13.1- text-split · items con textSize/align/pad/margin distintos"
    items:
      - text: "## «H2 Una cita grande, centrada»"
        textSize: xl
        align: center
      - text: "Un párrafo normal al lado, con su propio `pad: m` y `margin` de ajuste fino. El grid es 1fr en móvil, 1fr 1fr desde 821px — reduce la ventana para comprobarlo."
        pad: m
        margin: "0 0 1rem 0"
  - type: text-split
    width: wide
    class: "bg-color2"
    items:
      - text: "13.2- Columna izquierda sin modificadores — hereda el tamaño de texto por defecto del tema."
      - text: "Columna derecha, `textSize: xl` — para texto destacado con peso semántico `p`."
        textSize: xl

  # ============ FAQ ============
  - type: faq
    title: "14- faq"
    items:
      - question: "¿Las respuestas admiten markdown?"
        answer: "Sí — **negritas**, *cursivas* y [enlaces](/contacto/)."
      - question: "¿Y salen en el schema FAQPage?"
        answer: "En esta página no (`includeFAQ: false` para no ensuciar el schema con contenido demo). En páginas reales, sí, automáticamente."

  # ============ cta — todas las variaciones ============
  - type: cta
    title: "15.1- cta · fondo bg-color1· preset: contact"
    subtitle: "El par Llamar + WhatsApp sale de data/site.yaml."
    preset: contact
    microcopy: "Con microcopy bajo los botones"
  - type: cta
    title: "15.2- h2 cta · class: bg-color2"
    class: "bg-color2"
    preset: contact
  - type: cta
    title: "15.3- cta · class: bg-color4 (claro, texto oscuro ya resuelto)"
    subtitle: "Las clases de paleta ya traen el color de texto correcto — no hace falta ningún interruptor aparte."
    class: "bg-color4"
    preset: contact
  - type: cta
    title: "15.4- cta · bg imagen (overlay neutro)"
    bg: "https://picsum.photos/seed/cta1/1600/500"
    preset: contact
  - type: cta
    title: "15.5- cta · bg + bgMobile + class Scrim & Panel"
    subtitle: "Reduce la ventana para ver la imagen móvil."
    bg: "https://picsum.photos/seed/cta2/1600/500"
    bgMobile: "https://picsum.photos/seed/cta2m/700/800"
    class: "scrim panel"
    preset: contact
    labelCall: "Llamar ahora"
    labelWhatsapp: "Escríbenos"
  - type: cta
    title: "15.6- cta · botones personalizados con iconos"
    align: center
    buttons:
      - { text: "Cómo llegar", url: "/contacto/", icon: "location" }
      - { text: "Horario", url: "/contacto/", icon: "clock" }
      - { text: "Escríbenos", url: "mailto:info@opticafausto.com", icon: "email" }
  - type: cta
    title: "15.7- cta · bg + class: scrim (degradado direccional)"
    subtitle: "El texto queda sobre la zona oscurecida; la foto respira a la derecha."
    bg: "https://picsum.photos/seed/cta3/1600/500"
    class: "scrim"
    align: left
    preset: contact
  - type: cta
    title: "15.8- cta · bg + class: overlay-strong (velo denso)"
    subtitle: "Para fotos claras o con mucho detalle."
    bg: "https://picsum.photos/seed/cta4/1600/500"
    class: "overlay-strong"
    preset: contact
  - type: cta
    title: "15.9- cta · bg + class: panel (caja tras el texto)"
    subtitle: "La opción más segura cuando no controlas la foto."
    bg: "https://picsum.photos/seed/cta5/1600/500"
    class: "panel"
    preset: contact
  - type: cta
    layout: split
    eyebrow: "Presupuesto claro, línea a línea"
    title: "15.10- cta · layout: split con eyebrow (antetítulo)"
    subtitle: "La promesa de marca va arriba como antetítulo; el microcopy junto a los botones se reserva para quitar objeciones («sin compromiso»)."
    preset: contact
    microcopy: "Sin compromiso"
  - type: cta
    title: "15.11- cta · bgColor puntual claro + textColor + class: bg-claro"
    subtitle: "Para un color suelto que no está en la paleta: bgColor + textColor a juego + class: bg-claro (avisa a los botones de que el fondo es claro)."
    bgColor: "#eef7f4"
    textColor: "#1c1a17"
    class: "bg-claro"
    preset: contact
  - type: cta
    title: "15.12- cta · bgColor puntual oscuro · textSize: l"
    subtitle: "Un color suelto oscuro no necesita textColor ni bg-claro: el texto blanco es el valor por defecto."
    bgColor: "#4a2f6b"
    textSize: l
    preset: contact

  # ============ LOCATIONS — sedes desde data/site.yaml, NO por parámetro ============
  # Los datos (nombre, dirección, teléfono, mapUrl, image) salen de site.yaml →
  # locations[]. El bloque solo decide cómo se presentan.
  - type: locations
    title: "16.1- locations · layout: compact (solo texto y enlaces)"
    subtitle: "Sin imagen: nombre, dirección enlazada a Maps y teléfono en tel:. Es el layout para intercalar en una home sin cargarla de fotos."
    layout: "compact"

  - type: locations
    title: "16.2- locations · layout: compact · align: center"
    subtitle: "Mismo layout, centrado: los iconos, los enlaces y el horario se alinean al centro vía block-align-center."
    layout: "compact"
    align: "center"

  - type: locations
    title: "16.3- locations · layout: compact · showCommon: true"
    subtitle: "Añade el bloque común a ambas sedes: móvil/WhatsApp, email y horario desde contact.hours."
    layout: "compact"
    showCommon: true

  - type: locations
    title: "16.4- locations · layout: full (con imagen de mapa)"
    subtitle: "Usa location.image + imageAlt de site.yaml y enlaza la imagen a mapUrl. Es el layout de la página de Contacto."
    layout: "full"
    showCommon: true

  - type: locations
    title: "16.5- locations · class: bg-color2 (sobre banda oscura)"
    subtitle: "Los enlaces e iconos heredan el par de color de la superficie: no hay que tocar nada para que se lean sobre fondo oscuro."
    layout: "compact"
    class: "bg-color2"
    align: "center"
---

## P1- El prose: body markdown {.demo}

> Esta página es `draft: true`: se ve con `hugo server -D` y nunca se publica.

Todo lo que sigue es **body markdown** dentro del contenedor `prose`: títulos, listas, tablas, imágenes y shortcodes intercalados.

### Utilidades tipográficas vía attributes de Goldmark

## Un H2 normal, para comparar

## Un H2 con {.fs-s} — más discreto {.fs-s}

## Un H2 con {.fs-xs} — el mínimo (solo titulares) {.fs-xs}

Un párrafo normal, sin variaciones escrito en prose, con Marqdown. **abajo las variaciones**.

Un párrafo con clase `{.fs-sl}` para destacar una cita al tamaño de H2 (clamp 28→34) , encabezando un párrafo sin relevancia semántica de un Header
{.fs-xl}

Un párrafo con clase `{.fs-l}` aplicada al bloque completo, para destacar una entradilla o un párrafo clave sin recurrir a un bloque de sección.
{.fs-l}

Un párrafo con clase `{.fs-s}` aplicada al bloque completo, para destacar una entradilla o un párrafo clave sin recurrir a un bloque de sección.
{.fs-s}

Un párrafo con clase `{.fs-xs}` aplicada al bloque completo, para destacar una entradilla o un párrafo clave sin recurrir a un bloque de sección.
{.fs-xs}


### [H3] Elementos estándar de markdown

Texto con **negrita**, *cursiva*, un [enlace interno](/vision/) y `código inline`.


- Lista sin ordenar
- Con varios elementos
  - Y anidación

1. Lista ordenada
2. Segundo paso

> Un blockquote: útil para citas o destacados suaves dentro del prose.

| Columna A | Columna B |
|---|---|
| Las tablas | también funcionan |
| en el prose | del body |

### p2- Imagen en el prose

![Imagen demo insertada con markdown estándar](https://picsum.photos/seed/prose/900/400)

### p3- Shortcode {{</* spacer */>}}

Espaciado puntual entre dos párrafos. Debajo va un `spacer size="l"`:

Primer párrafo, justo encima del espaciador.

{{< spacer size="l" >}}

Segundo párrafo, tras un espacio grande. (`s`, `m`, `l` disponibles.)

### p4- Shortcode {{</* banner */>}}

{{< banner >}} p4.1- Banner por defecto: frase destacada **con markdown**, centrada. textSize = H2 {{< /banner >}}

{{< banner class="bg-color4" textSize="l" >}}p4.2- Banner con `class: bg-color4` y `textSize: l`.{{< /banner >}}

{{< banner bg="/images/100-instalaciones_fausto_duque_fachada.webp" width="wide" textSize="s" pad="l" class="panel bg-color3" >}}p4.3- Banner con `bg` (imagen de fondo) + `class= panel` (background-color en el copy) y `bg-color` (hace un mix de tinte en overlay `width=wide` `pad=l`.{{< /banner >}}

{{< banner textSize="xl" align="center" class="bg-color1" >}}p4.4- Banner con `textSize="xl"`class="bg-color1" y alineado al centro.{{< /banner >}}

### p5- Shortcode {{</* cta */>}}

Sin parámetros de botones → preset contact automático:

{{< cta title="p5.1- CTA por defecto en mitad del prose" microcopy="Llamar + WhatsApp desde site.yaml" >}}

#### [H4] CTA Con fondo y botones personalizados:

{{< cta title="p5.2- CTA con bg + bgColor y botones propios" bg="https://picsum.photos/seed/ctas/1600/500" bgColor="var(--bg-color2)" b1text="Ver Visión" b1url="/vision/" b1icon="arrow-down" b2text="Ver Audición" b2url="/audicion/" b2icon="hearing" >}}

### Padding de los CTA intermedios — comparativa en contexto

> Así **↓** se ve un CTA intermedio con **pad normal** entre párrafos de una página real:

Una revisión periódica permite actuar a tiempo y prevenir alteraciones en el sistema visual, el cual evoluciona a lo largo de nuestra vida y se ve afectado, entre otros factores, por nuestros hábitos diarios.

{{< cta class="bg-color1" title="p5.3- Pide tu revisión visual" subtitle="En 20–30 minutos sales de dudas." >}}

Si reconoces dos o más señales, no lo dejes pasar: el examen de salud ocular permite detectar signos de posibles patologías, y ante cualquier sospecha te derivamos al oftalmólogo.

> Y ↓ el mismo CTA con **pad: compact** — mismo contenido, menos ceremonia:

Una revisión periódica permite actuar a tiempo y prevenir alteraciones en el sistema visual, el cual evoluciona a lo largo de nuestra vida y se ve afectado, entre otros factores, por nuestros hábitos diarios.

{{< cta class="bg-color1" title="p5.4- Pide tu revisión visual" subtitle="En 20–30 minutos sales de dudas." pad="compact" >}}

Si reconoces dos o más señales, no lo dejes pasar: el examen de salud ocular permite detectar signos de posibles patologías, y ante cualquier sospecha te derivamos al oftalmólogo.

---

### CTA `pad` comparativa — mismo CTA aislado, tres escalones de padding vertical:

{{< cta title="p5.5- pad: s (alias de compact)" pad="s" class="bg-color3" >}}

{{< cta title="p5.6- pad normal (sin declarar)" class="bg-color3" >}}

{{< cta title="p5.7- pad: l (alias de spacious)" pad="l" class="bg-color3" >}}

### CTA `Width` comparativa — mismo CTA, tres anchos, dentro del prose (72ch):

{{< cta class="bg-color1" title="p5.8- width: default (implícito) — recortado a la medida de lectura" >}}

{{< cta class="bg-color1" title="p5.9- width: wide — hasta 1320px, rompe el prose" width="wide" >}}

{{< cta class="bg-color1" title="p5.10 width: full — ancho completo de viewport" width="full" >}}

### p6- Shortcode {{</* image-text */>}}

{{< image-text image="https://picsum.photos/seed/its1/640/420" imageAlt="Demo" title="p6.1- image-text en el prose" >}}
Mismo bloque que el `type: image-text` de `sections:`, pero intercalado en el body markdown — útil cuando el resto de la página ya es prosa (como Nosotros) y solo hace falta un tramo con imagen.
{{< /image-text >}}

{{< image-text image="https://picsum.photos/seed/its2/640/420" imageAlt="Demo" reverse="true" variant="soft" title="p6.2- Con reverse + variant: soft" >}}
`reverse="true"` pasa la imagen a la izquierda. Admite los mismos modificadores que el bloque: `variant`, `width`, `textSize`, `align`, `pad`, `class`.
{{< /image-text >}}

### p7- Shortcode {{</* text */>}}

**Solo tiene sentido con un modificador que lo distinga del prose circundante** — sin `bgColor`/`width`/`pad`/`textSize` sería un `.prose` anidado dentro de otro `.prose`, sin ninguna diferencia visual. Ejemplo real: una caja de aviso destacada en medio de un texto normal.

Un párrafo de prose normal, antes de la caja destacada.

{{< text class="bg-color1" pad="compact" title="p7.1- Aviso destacado" >}}
Esto **sí** se distingue del resto: fondo propio y padding distinto, para una nota o aviso puntual dentro de un tramo largo de texto.
{{< /text >}}

Y otro párrafo de prose normal, después de la caja.

{{< text width="wide" class="bg-color2" align="center" textSize="l">}}
p7.2- texto bg-color2 que rompe el ancho de lectura (`width="wide"`) para un párrafo que quieres que respire más — con fondo oscuro y texto `textSize="l"`centrado.
{{< /text >}}

### p8- Shortcode {{</* text-split */>}}

{{< text-split class="bg-color1" >}}
{{< text-split-item textSize="xl" align="center" >}}
p8.1- H2 Una cita destacada
{{< /text-split-item >}}
{{< text-split-item textSize="s" >}}
Y el texto de acompañamiento al lado, en la columna derecha — `text-split-item` solo funciona anidado dentro de `text-split`.
{{< /text-split-item >}}
{{< /text-split >}}

### p9- Shortcode {{</* testimonial */>}} (cita suelta)

{{< testimonial name="Cliente de ejemplo" rating="5" >}}
Una única cita, con su propio wrapper — para intercalar en el prose sin montar un grid completo. Distinto del bloque `type: testimonials` (grid) que ya viste arriba.
{{< /testimonial >}}

### p10- Shortcode {{</* testimonials */>}} + {{</* testimonial-item */>}} (grid en el prose)

{{< testimonials title="testimonials en el prose — mismo grid que el bloque YAML" >}}
{{< testimonial-item name="Cliente A" rating="5" >}}
Primera cita del grid, escrita como shortcode anidado en vez de item de YAML.
{{< /testimonial-item >}}
{{< testimonial-item name="Cliente B" rating="4" >}}
Segunda cita — mismo `.cards-grid` que usa el bloque de sections, mismo CSS.
{{< /testimonial-item >}}
{{< /testimonials >}}

### p11- Shortcode {{</* cards */>}} — generación automática

Las cards siguientes **no están escritas aquí**: se autodescubren de `/vision/servicios/` leyendo `linkTitle`, `card.description`, `card.image` y `weight` de cada página hija:

{{< cards section="/vision/servicios" columns="3" title="cards automáticas de una sección" >}}

### p12- Shortcode {{</* locations */>}}

Las sedes **no se escriben aquí**: salen de `data/site.yaml` → `locations[]`, la
misma fuente que alimentan el footer y el `schema.org`. Cambiar un teléfono en
`site.yaml` lo cambia en los tres sitios a la vez.

Versión compacta, sin imagen:

{{< locations layout="compact" title="p12.1- locations · layout compact" subtitle="Dirección enlazada a Google Maps y teléfono clicable, sin foto." >}}

Con el bloque común (móvil/WhatsApp, email y horario):

{{< locations layout="compact" showCommon="true" title="p12.2- locations · showCommon" >}}

Versión completa, con la imagen de mapa de cada sede:

{{< locations layout="full" title="p12.3- locations · layout full" subtitle="Usa location.image de site.yaml; la imagen enlaza al mapa." >}}

### p13- Shortcode {{</* hours */>}}

Horario desde `site.yaml` → `contact.hours`. Las claves vacías no se pintan, así
que `sunday: ""` desaparece solo. Lo usan el footer, el bloque `locations` con
`showCommon` y cualquier página que lo intercale en el prose:

{{< hours >}}

Para el `schema.org` **no** se usa este partial: los datos salen de
`contact.hoursSpec` (clave `days`), que cada sede hereda salvo que defina el suyo.

---

**Fin del `PROSE` de la demo. AHORA SE PROCESAN LAS SECTIONS**
