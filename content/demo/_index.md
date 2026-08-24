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
  title: "Hero con fondo responsive y CTA de contacto"
  subtitle: "Redimensiona la ventana: por debajo de 820px carga la imagen bgMobile. El overlay toma el tinte de bgColor vía color-mix."
  bg: "https://picsum.photos/seed/fausto-hero/1600/700"
  bgMobile: "https://picsum.photos/seed/fausto-hero-m/700/900"
  bgColor: "#1B3A5C"
  ctaPreset: contact
  labelCall: "Llamar ahora"
  class: "scrim"           # activo aquí — comparar con los 3 CTA de abajo (scrim/overlay-strong/panel)

sections:
  # ============ TRUSTBAR usada como CATÁLOGO DE ICONOS ============
  # Cada item muestra el icono y, como texto, su nombre exacto de invocación:
  # se usan con `icon: "nombre"` en bloques/botones. Set completo (16).
  - type: trustbar
    title: "Catálogo de iconos — icon: \"nombre\""
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

  # ============ IMAGE_TEXT — las 4 variants ============
  - type: image_text
    title: "image_text · variant: default"
    text: "Bloque base, imagen a la derecha. El campo `text` admite **markdown**."
    image: "https://picsum.photos/seed/it1/640/420"
    imageAlt: "Demo"
  - type: image_text
    variant: soft
    reverse: true
    title: "image_text · variant: soft + reverse"
    text: "Fondo suave e imagen a la izquierda (`reverse: true`)."
    image: "https://picsum.photos/seed/it2/640/420"
    imageAlt: "Demo"
  - type: image_text
    variant: featured
    title: "image_text · variant: featured"
    text: "Variante destacada, para el bloque protagonista de una página."
    image: "https://picsum.photos/seed/it3/640/420"
    imageAlt: "Demo"
  - type: image_text
    variant: contrast
    title: "image_text · variant: contrast"
    text: "Variante de contraste (fondo oscuro)."
    image: "https://picsum.photos/seed/it4/640/420"
    imageAlt: "Demo"

  # ============ IMAGE_TEXT — widths y textSize ============
  - type: image_text
    width: wide
    textSize: large
    title: "width: wide · textSize: large"
    text: "Contenedor ancho y tipografía grande."
    image: "https://picsum.photos/seed/it5/640/420"
    imageAlt: "Demo"
  - type: image_text
    width: full
    textSize: xl
    align: center
    title: "width: full · textSize: xl · align: center"
    text: "Ancho completo, la escala tipográfica máxima y alineado centrado."
    image: "https://picsum.photos/seed/it6/640/420"
    imageAlt: "Demo"
  - type: image_text
    textSize: small
    align: right
    title: "textSize: small · align: right"
    text: "La escala mínima de bloque y alineación derecha. Para letra pequeña editorial."
    image: "https://picsum.photos/seed/it7/640/420"
    imageAlt: "Demo"

  # ============ COUNTER — con y sin fondo ============
  - type: counter
    text: "counter · sin fondo · animated: true"
    animated: true
    items:
      - { number: "44", label: "años de experiencia" }
      - { number: "27.000", label: "clientes atendidos" }
      - { number: "2", label: "centros en Torre del Mar" }
      - { number: "1982", label: "año de apertura" }
  - type: counter
    text: "counter · bg + bgColor (overlay tintado)"
    bg: "https://picsum.photos/seed/counter/1600/500"
    bgColor: "#34855B"
    items:
      - { number: "14", label: "iconos en el set" }
      - { number: "12", label: "bloques disponibles" }
      - { number: "3", label: "shortcodes" }

  # ============ CARDS (items manuales; la versión automática va como shortcode en el prose) ============
  - type: cards
    title: "cards · columns: 3 · items manuales"
    subtitle: "El shortcode {{</* cards */>}} del prose las genera automáticamente desde una sección."
    columns: 3
    linkText: "Ver más"
    cards:
      - { title: "Card A", description: "Con imagen, título, descripción y enlace.", image: "https://picsum.photos/seed/c1/480/320", imageAlt: "Demo", link: "/vision/" }
      - { title: "Card B", description: "Segunda card del grid.", image: "https://picsum.photos/seed/c2/480/320", imageAlt: "Demo", link: "/audicion/" }
      - { title: "Card C", description: "Tercera card del grid.", image: "https://picsum.photos/seed/c3/480/320", imageAlt: "Demo", link: "/nosotros/" }

  # ============ SLIDER ============
  - type: slider
    title: "slider"
    items:
      - { image: "https://picsum.photos/seed/s1/800/450", imageAlt: "Demo", title: "Slide 1", text: "Título, texto y leyenda.", legend: "leyenda opcional" }
      - { image: "https://picsum.photos/seed/s2/800/450", imageAlt: "Demo", title: "Slide 2", text: "Segundo slide." }
      - { image: "https://picsum.photos/seed/s3/800/450", imageAlt: "Demo", title: "Slide 3", text: "Tercer slide." }

  # ============ GALLERY ============
  - type: gallery
    title: "gallery"
    items:
      - { image: "https://picsum.photos/seed/g1/600/400", imageAlt: "Demo", legend: "Con leyenda" }
      - { image: "https://picsum.photos/seed/g2/600/400", imageAlt: "Demo" }
      - { image: "https://picsum.photos/seed/g3/600/400", imageAlt: "Demo", legend: "Otra leyenda" }
      - { image: "https://picsum.photos/seed/g4/600/400", imageAlt: "Demo" }

  # ============ TEAM ============
  - type: team
    title: "team"
    subtitle: "Campos: image, imageAlt, name, role"
    items:
      - { image: "https://picsum.photos/seed/t1/400/400", imageAlt: "Demo", name: "Nombre Uno", role: "Óptico-optometrista" }
      - { image: "https://picsum.photos/seed/t2/400/400", imageAlt: "Demo", name: "Nombre Dos", role: "Audioprotesista" }
      - { image: "https://picsum.photos/seed/t3/400/400", imageAlt: "Demo", name: "Nombre Tres", role: "Atención al cliente" }

  # ============ TIMELINE ============
  - type: timeline
    title: "timeline"
    items:
      - { number: "1982", event_title: "Apertura", event_text: "Primer centro en Torre del Mar." }
      - { number: "2004", event_title: "Segundo centro", event_text: "Campos: number, event_title, event_text." }
      - { number: "2026", event_title: "Nueva web", event_text: "La que estás viendo." }

  # ============ BRANDS-LOGOS ============
  - type: brands_logos
    title: "brands_logos"
    items:
      - { image: "https://picsum.photos/seed/b1/240/120", imageAlt: "Demo", text: "Marca A" }
      - { image: "https://picsum.photos/seed/b2/240/120", imageAlt: "Demo", text: "Marca B" }
      - { image: "https://picsum.photos/seed/b3/240/120", imageAlt: "Demo" }
      - { image: "https://picsum.photos/seed/b4/240/120", imageAlt: "Demo" }

  # ============ TESTIMONIALS ============
  - type: testimonials
    title: "testimonials (text, name, rating, image opcional)"
    items:
      - { text: "Con rating e imagen.", name: "Cliente A", rating: 5, image: "https://picsum.photos/seed/p1/80/80" }
      - { text: "Solo texto y nombre.", name: "Cliente B" }
      - { text: "Con rating, sin imagen.", name: "Cliente C", rating: 4 }

  # ============ FAQ ============
  - type: faq
    title: "faq"
    items:
      - question: "¿Las respuestas admiten markdown?"
        answer: "Sí — **negritas**, *cursivas* y [enlaces](/contacto/)."
      - question: "¿Y salen en el schema FAQPage?"
        answer: "En esta página no (`includeFAQ: false` para no ensuciar el schema con contenido demo). En páginas reales, sí, automáticamente."

  # ============ cta — todas las variaciones ============
  - type: cta
    title: "cta · sin fondo · preset: contact"
    subtitle: "El par Llamar + WhatsApp sale de data/site.yaml."
    preset: contact
    microcopy: "Con microcopy bajo los botones"
  - type: cta
    title: "cta · bgColor plano"
    bgColor: "#1B3A5C"
    preset: contact
  - type: cta
    title: "cta · bgColor claro + class: on-light (texto oscuro)"
    subtitle: "Para fondos de color claros, on-light mantiene el texto oscuro."
    bgColor: "#C9A84C"
    class: "on-light"
    preset: contact
  - type: cta
    title: "cta · bg imagen (overlay neutro)"
    bg: "https://picsum.photos/seed/cta1/1600/500"
    preset: contact
  - type: cta
    title: "cta · bg + bgMobile + bgColor (overlay tintado)"
    subtitle: "Reduce la ventana para ver la imagen móvil."
    bg: "https://picsum.photos/seed/cta2/1600/500"
    bgMobile: "https://picsum.photos/seed/cta2m/700/800"
    bgColor: "#34855B"
    preset: contact
    labelCall: "Llamar ahora"
    labelWhatsapp: "Escríbenos"
  - type: cta
    title: "cta · botones personalizados con iconos"
    align: center
    buttons:
      - { text: "Cómo llegar", url: "/contacto/", icon: "location" }
      - { text: "Horario", url: "/contacto/", icon: "clock" }
      - { text: "Escríbenos", url: "mailto:info@opticafausto.com", icon: "email" }
  - type: cta
    title: "cta · bg + class: scrim (degradado direccional)"
    subtitle: "El texto queda sobre la zona oscurecida; la foto respira a la derecha."
    bg: "https://picsum.photos/seed/cta3/1600/500"
    class: "scrim"
    align: left
    preset: contact
  - type: cta
    title: "cta · bg + class: overlay-strong (velo denso)"
    subtitle: "Para fotos claras o con mucho detalle."
    bg: "https://picsum.photos/seed/cta4/1600/500"
    class: "overlay-strong"
    preset: contact
  - type: cta
    title: "cta · bg + class: panel (caja tras el texto)"
    subtitle: "La opción más segura cuando no controlas la foto."
    bg: "https://picsum.photos/seed/cta5/1600/500"
    class: "panel"
    preset: contact
  - type: cta
    layout: split
    eyebrow: "Presupuesto claro, línea a línea"
    title: "cta · layout: split con eyebrow (antetítulo)"
    subtitle: "La promesa de marca va arriba como antetítulo; el microcopy junto a los botones se reserva para quitar objeciones («sin compromiso»)."
    preset: contact
    microcopy: "Sin compromiso"
  - type: cta
    title: "cta · tone: vision"
    tone: vision
    preset: contact
  - type: cta
    title: "cta · tone: hearing · textSize: large"
    tone: hearing
    textSize: large
    preset: contact
---

## El prose: body markdown {.demo}

Todo lo que sigue es **body markdown** dentro del contenedor `prose`: títulos, listas, tablas, imágenes y shortcodes intercalados.

### Utilidades tipográficas vía attributes de Goldmark

## Un H2 normal, para comparar

## Un H2 con {.fs-s} — más discreto {.fs-s}

## Un H2 con {.fs-xs} — el mínimo (solo titulares) {.fs-xs}

Un párrafo con clase `{.fs-l}` aplicada al bloque completo, para destacar una entradilla o un párrafo clave sin recurrir a un bloque de sección.
{.fs-l}

### Elementos estándar de markdown

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

### Imagen en el prose

![Imagen demo insertada con markdown estándar](https://picsum.photos/seed/prose/900/400)

### Shortcode {{</* spacer */>}}

Espaciado puntual entre dos párrafos. Debajo va un `spacer size="l"`:

Primer párrafo, justo encima del espaciador.

{{< spacer size="l" >}}

Segundo párrafo, tras un espacio grande. (`s`, `m`, `l` disponibles.)

### Shortcode {{</* banner */>}}

{{< banner >}}Banner por defecto: frase destacada **con markdown**, centrada.{{< /banner >}}

{{< banner bgColor="#C9A84C" textSize="large" >}}Banner con `bgColor` y `textSize: large`.{{< /banner >}}

{{< banner class="fs-s" align="left" >}}Banner con utilidad `fs-s` vía class y alineado a la izquierda.{{< /banner >}}

### Shortcode {{</* cta */>}}

Sin parámetros de botones → preset contact automático:

{{< cta title="CTA por defecto en mitad del prose" microcopy="Llamar + WhatsApp desde site.yaml" >}}

Con fondo y botones personalizados:

{{< cta title="CTA con bg + bgColor y botones propios" bg="https://picsum.photos/seed/ctas/1600/500" bgColor="#1B3A5C" b1text="Ver Visión" b1url="/vision/" b1icon="arrow-down" b2text="Ver Audición" b2url="/audicion/" b2icon="hearing" >}}

### Decisión: pad de los CTA intermedios — comparativa en contexto

Así se ve un CTA intermedio con **pad normal** entre párrafos de una página real:

Una revisión periódica permite actuar a tiempo y prevenir alteraciones en el sistema visual, el cual evoluciona a lo largo de nuestra vida y se ve afectado, entre otros factores, por nuestros hábitos diarios.

{{< cta title="Pide tu revisión visual" subtitle="En 20–30 minutos sales de dudas." >}}

Si reconoces dos o más señales, no lo dejes pasar: el examen de salud ocular permite detectar signos de posibles patologías, y ante cualquier sospecha te derivamos al oftalmólogo.

Y el mismo CTA con **pad: compact** — mismo contenido, menos ceremonia:

Una revisión periódica permite actuar a tiempo y prevenir alteraciones en el sistema visual, el cual evoluciona a lo largo de nuestra vida y se ve afectado, entre otros factores, por nuestros hábitos diarios.

{{< cta title="Pide tu revisión visual" subtitle="En 20–30 minutos sales de dudas." pad="compact" >}}

Si reconoces dos o más señales, no lo dejes pasar: el examen de salud ocular permite detectar signos de posibles patologías, y ante cualquier sospecha te derivamos al oftalmólogo.

---

Comparativa de `pad` — mismo CTA aislado, tres escalones de padding vertical:

{{< cta title="pad: s (alias de compact)" pad="s" bgColor="#34855B" >}}

{{< cta title="pad normal (sin declarar)" bgColor="#1B3A5C" >}}

{{< cta title="pad: l (alias de spacious)" pad="l" bgColor="#34855B" >}}

Comparativa de `width` — mismo CTA, tres anchos, dentro del prose (72ch):

{{< cta title="width: default (implícito) — recortado a la medida de lectura" >}}

{{< cta title="width: wide — hasta 1320px, rompe el prose" width="wide" bgColor="#34855B" >}}

{{< cta title="width: full — ancho completo de viewport" width="full" bgColor="#1B3A5C" >}}

### Shortcode {{</* cards */>}} — generación automática

Las cards siguientes **no están escritas aquí**: se autodescubren de `/vision/servicios/` leyendo `linkTitle`, `card.description`, `card.image` y `weight` de cada página hija:

{{< cards section="/vision/servicios" columns="3" title="cards automáticas de una sección" >}}

---

Fin de la demo. Esta página es `draft: true`: se ve con `hugo server -D` y nunca se publica.
