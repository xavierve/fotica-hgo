# BRIEF — Ópticas Fausto · opticasfausto.com
*Documento de referencia rápida para nuevas sesiones de Claude*
*Actualizado: 15 sep 2026 — verificado contra el repo, no de memoria*

> **Precedencia:** este documento es contexto, no fuente de verdad. Si
> contradice al código, a `data/site.yaml`, a `CLAUDE.md` o a los docs del
> tema (`themes/f1-theme/docs/`), manda el código. El estado y la hoja de
> ruta viven en `__todo-fausto.md`, no aquí.

---

## EL NEGOCIO

**Ópticas Fausto** — óptica y audiología familiar en Torre del Mar (Málaga). Fundada 1982. 44 años.
Dos centros: **Centro Fausto Andalucía** (Av. Andalucía, 84 B) · **Centro Fausto Duque** (Av. Duque de Ahumada, 1C).
Tres generaciones: Fausto → Leonor y Anabel → Juan, más cuatro auxiliares con años de antigüedad.
**Anabel** y **Leito** son los nombres que aparecen en el copy (los clientes los conocen).
M�s de 27.000 clientes. Centro Auditivo Homologado.
Atienden en español, inglés y alemán.

---

## STACK TÉCNICO

- **Hugo** · tema propio `f1-theme` (`min_version 0.120.0`)
- **Deploy: Hostinger.** Decisión cerrada el 6 sep — se descartó Cloudflare
  Pages porque sus bloqueos de IP durante partidos de fútbol dejaban el sitio
  intermitentemente inaccesible. No reabrir.
- **Dominio:** el nuevo es `opticasfausto.com` (`baseURL` de `hugo.toml`).
  El viejo `opticafausto.com` (WordPress) redirige con **301 hacia el nuevo**.
  Los redirects van en `.htaccess` (Apache), no en `_redirects`.
- **Formulario:** **PHP `mail()`** del propio hosting. SPF y DKIM ya
  configurados en Hostinger. *(No: Cloudflare Worker ni Resend — descartados
  con el cambio de hosting.)*
- Datos de negocio: `data/site.yaml` (teléfonos, direcciones, horarios, nav,
  social — **nunca en content**)
- Fase 1: **sin cookies de terceros**, sin analytics, sin banner de consentimiento

---

## ARQUITECTURA HUGO

```
content/
  _index.md              → 0.0 Inicio
  nosotros/_index.md     → 1.0 Nosotros
  vision/_index.md       → 2.0 Visión (hub/landing)
    servicios/           → build.render: never (no es página)
      optometria.md      → 2.1.1
      vision-infantil.md → 2.1.2
      control-miopia.md  → 2.1.3
      baja-vision.md     → 2.1.4
      vision-40.md       → 2.1.5
      terapia-visual.md  → 2.1.6
    productos/           → build.render: never
      lentes-oftalmicas.md        → 2.2.1
      gafas-progresivas.md        → 2.2.2
      lentes-de-contacto.md       → 2.2.3
      filtros-solares-luz-azul.md → 2.2.4
      ayudas-visuales.md          → 2.2.5
      gafas-infantiles.md         → 2.2.6
      gafas-deportivas.md         → 2.2.7
  audicion/_index.md     → 3.0 Audición (hub/landing)
    servicios/           → build.render: never
      audiometria.md             → 3.1.1
      adaptacion-audifonos.md    → 3.1.2
      tinnitus.md                → 3.1.3
      mantenimiento-audifonos.md → 3.1.4
      rehabilitacion-auditiva.md → 3.1.5
    productos/           → build.render: never
      audifonos.md             → 3.2.1
      ayudas-auditivas.md      → 3.2.2
      protectores-a-medida.md  → 3.2.3
  contacto/_index.md     → 4.0 Contacto
  aviso-legal/_index.md  → Aviso Legal + Privacidad + Cookies (una sola página)
  demo/_index.md         → página de estilo del tema (todos los bloques y shortcodes)
```

---

## SISTEMA DE BLOQUES (f1-theme)

El contenido de cada página se estructura en **tres capas**:

1. **`hero:`** en front matter → título, subtítulo, imagen de fondo, CTA
2. **Body markdown** → texto largo (con shortcodes intercalados)
3. **`sections:`** en front matter → bloques renderizados por `section-renderer.html`

El dispatcher resuelve `type: X` contra `partials/blocks/X.html`, así que el
nombre del tipo es **exactamente** el del archivo — con guiones, nunca con
guiones bajos.

### Tipos de bloque disponibles en `sections:`

```yaml
- type: banner        # Franja de énfasis con una frase
- type: brands-logos  # Logos de marcas
- type: cards         # Grid de cards (autodescubierto de sección Hugo)
- type: counter       # Contadores animados
- type: cta           # Franja CTA con title, subtitle, microcopy, preset
- type: faq           # Preguntas frecuentes (también genera FAQPage schema)
- type: gallery       # Galería de imágenes con lightbox
- type: image-text    # Imagen + texto en columnas (admite caption)
- type: locations     # Sedes desde data/site.yaml (layout compact|full)
- type: slider        # Slider de mensajes/testimonios
- type: team          # Miembros del equipo
- type: testimonials  # Citas de clientes
- type: text          # Bloque de texto suelto
- type: text-split    # Dos columnas de texto
- type: timeline      # Línea de tiempo
- type: trustbar      # Franja de datos de confianza con iconos
```

### Shortcodes disponibles en body markdown

```
{{< banner text="..." >}}
{{< cards section="/vision/servicios" columns="3" width="wide" >}}
{{< cta title="..." subtitle="..." preset="contact" >}}
{{< hours >}}                     ← horario desde site.yaml
{{< icon "phone" >}}
{{< image-text image="..." imageAlt="..." caption="..." >}}...{{< /image-text >}}
{{< locations layout="compact" showCommon="true" >}}
{{< spacer size="m" >}}           ← s | m | l  (¡no "md"!)
{{< text >}} · {{< text-split >}} + {{< text-split-item >}}
{{< testimonials >}} + {{< testimonial-item >}} · {{< testimonial >}}
```

### Preset `contact`

Con `preset: contact` —**la misma clave en `hero:` y en el bloque `cta`**— el
sistema lee los teléfonos de `data/site.yaml`. **Nunca escribir teléfonos en
content.** (La clave antigua `ctaPreset` del hero ya no existe; sin alias.)

### Horarios

Fuente única en `data/site.yaml`: `contact.hours` (legible → footer, bloque
`locations`, shortcode `{{< hours >}}`) y `contact.hoursSpec` (schema.org,
clave `days`, heredado por ambas sedes salvo que una defina el suyo).
Cambiar el horario de temporada = editar `site.yaml` y nada más.

---

## FRONT MATTER TIPO — página estándar

```yaml
---
title: "Título SEO | Ópticas Fausto"
linkTitle: "Nombre en nav/breadcrumb"
description: "Meta description ≤155 chars"
page_id: "2.1.1"
weight: 10

card:
  description: "Descripción para la card en el hub padre"
  image: "/images/cards/211-optometria.webp"
  imageAlt: "Alt text descriptivo"

og:
  title: "Título Open Graph"
  description: "Descripción OG"
  image: "/images/og/211-optometria.jpg"   # OG siempre .jpg
  type: "article"  # o "website" para hubs

schema:
  type: Service    # Service · Product · WebPage · Organization
  serviceType: "Nombre del servicio"
  includeBreadcrumb: true

hero:
  title: "H1 de la página"
  subtitle: "Párrafo intro del hero"
  preset: contact
  bg: "/images/211-optometria_D3A0064.webp"   # opcional
  # bgMobile: "/images/211-optometria_m.webp"

sections:
  - type: faq
    title: "Preguntas frecuentes sobre X"
    items:
      - question: "¿...?"
        answer: "..."

  - type: cta
    preset: contact
    title: "Frase de confianza/diferenciación"
    subtitle: "Desarrollo de la diferenciación vs. franquicias o del seguimiento"
    microcopy: "Dato práctico · Otro dato · Sin compromiso"
    labelCall: "Llamar ahora"
---

## Título H2 del body

Contenido largo en markdown...
```

---

## CONVENCIONES FIJAS (no cambiar)

| Qué | Valor correcto | Prohibido |
|---|---|---|
| Slug presbicia | `vision-40` | `vision-mas-40` |
| Slug lentillas | `lentes-de-contacto` | `lentillas` |
| Slug filtros | `filtros-solares-luz-azul` | `filtros` |
| Slug lentes | `lentes-oftalmicas` | `lentes-oftalmicos` |
| Nombre centros | "Centro Fausto Andalucía" / "Centro Fausto Duque" | "Fausto I" / "Fausto II" |
| Página legal | `/aviso-legal/` (única) | `/politica-privacidad/` / `/politica-de-cookies/` |
| Anclas legal | `#privacidad` · `#cookies` | rutas separadas |
| Schema tipo | `Optician` | `MedicalBusiness` / `medicalSpecialty` |
| Años empresa | "44 años, desde 1982" | "45 años" / solo "44 años" sin el año |
| Marca tagline | solo en home y Nosotros | resto de páginas |
| Cookies Fase 1 | ninguna de terceros | analytics, píxeles Meta/Google |
| Clave de CTA | `preset` | `ctaPreset` (eliminada) |
| Tipo de bloque | con guion (`image-text`) | con guion bajo (`image_text`) |

---

## TONO Y COPY

- **Tono:** cálido, cercano, profesional. Como un especialista de confianza, no una corporación.
- **Tuteo** consistente en todo el sitio (no usted).
- **Diferenciación central:** mismo equipo desde siempre vs. rotación de franquicias.
- **Especialistas con nombre:** Anabel y Leito aparecen en copy de Inicio y Nosotros.
- **Frase de marca:** «Nos conocemos de toda la vida. Y eso se nota.» → solo en home y Nosotros.
- **Frase de atención:** «Atención humana, de quien quiere conocerte y seguirá atendiéndote durante años.»
- **Banner Why Us:** «Si entras en Fausto, lo más probable es que Anabel o Leito ya sepan que llevas progresivos desde hace tres años.»

### Estructura CTA guiño de confianza (en cada página)

Cada página de servicio/producto tiene su `cta` final con una frase única
que conecta la diferenciación de Fausto con el tema específico de esa página.
**No reutilizar frases entre páginas.**

---

## IMÁGENES — convención de nombres

`static/images/` es **raíz plana**, sin subcarpetas por rol. El prefijo de
`page_id` ya agrupa por página al ordenar alfabéticamente, y evita el problema
de una misma foto sirviendo de hero y de card a la vez.

```
xxx-aaaa_bbb_ccc.webp
 │    │    │    └── desambiguación (nombre propio, fachada/interior…)
 │    │    └─────── subcategoría (rol, sede, tipo de foto)
 │    └──────────── categoría (equipo, instalaciones, atencion…)
 └───────────────── page_id de 3 dígitos (000, 100, 211…)
```

Ejemplos reales: `100-equipo_optometrista_leonor.webp` ·
`211-optometria_D3A0064.webp` · `100-instalaciones_fausto_andalucia_fachada.webp`

**Las dos únicas subcarpetas** son `cards/` y `og/`, porque necesitan un
recorte físicamente distinto:

```
/images/cards/[pageid]-[slug].webp   → card en el hub padre
/images/og/[pageid]-[slug].jpg       → Open Graph 1200×630 (JPG, no WebP)
/images/[pageid]-[nombre].webp       → heros y todo lo demás, en la raíz
```

Variante de alta densidad: **`nombre_hd.webp`**, sin punto antes del guion bajo
(`foto._hd.webp` no la encuentra el tema). La usan `responsive-img.html` y
también `bg-image-style.html` para los fondos vía `image-set()`.

`draft-images/` en la raíz del repo (hermana de `static/`) para candidatas sin
elegir — Hugo no la ve. Al elegir una, se mueve con `mv` a `static/images/`.

**Medidas, proporciones, calidad y criterios de encuadre:**
`themes/f1-theme/docs/GUIA-IMAGENES.md`. Consultarla antes de generar,
recortar o encargar cualquier imagen. Resumen para heros: los originales de IA
están a ~1440 y esa es su resolución nativa — la ganancia está en generar
variantes **más pequeñas** (1280, 960), no en subir a 1920. El techo de 1920
es solo para fotos con código de cámara (`D3A####`), que sí tienen original.

---

## SCHEMA — resumen de tipos por página

| Tipo de página | Schema principal | Extras |
|---|---|---|
| Inicio | WebPage | Organization @graph raíz |
| Nosotros | AboutPage | employee (equipo) |
| Visión / Audición (hubs) | WebPage | — |
| Servicios (2.1.x, 3.1.x) | Service + serviceType | BreadcrumbList · FAQPage |
| Productos (2.2.x, 3.2.x) | Product | BreadcrumbList · FAQPage |
| Contacto | ContactPage | — |
| Aviso Legal | WebPage | — |

**Regla de oro:** sin `medicalSpecialty`, sin `MedicalBusiness`, sin `offers` vacíos.

---

## REPARTO DE TRABAJO

- **Claude Proyecto (claude.ai):** contenido — front matter, copys, titles,
  descriptions, FAQs, estrategia.
- **Claude Code:** tema, CSS/JS, build, schema, formulario, deploy. **No
  reescribe copys** salvo petición explícita.

---

## ESTADO Y HOJA DE RUTA

**No están aquí.** Ver `__todo-fausto.md`, que es el único sitio donde se
mantiene qué está hecho, qué falta y de quién depende cada cosa.

---

## CONTACTO Y DATOS DE NEGOCIO

*(Copia de lectura rápida. La fuente real es `data/site.yaml`.)*

```
WhatsApp/Móvil: +34 717 77 00 90
Email: info@opticafausto.com

Centro Fausto Andalucía
Av. Andalucía, 84 B · Torre del Mar (29740) – Málaga
Tel: +34 952 54 09 64

Centro Fausto Duque
Av. Duque de Ahumada, 1C · Torre del Mar (29740) – Málaga
Tel: +34 952 54 70 90

Horario: L-V 10:00–13:30 y 17:30–21:00 · Sábado 10:00–13:30
CIF: 52582059B (Ana Isabel Santaolalla Gámez) — ofuscado en frontend
```

Google Business:
- Fausto Andalucía: https://share.google/lt3s0XecMBnpr3exH
- Fausto Duque: https://share.google/uotnWlZFT0nfpuVoP

Facebook: https://www.facebook.com/OpticaFaustoTorreDelMar/
Instagram: https://www.instagram.com/opticasfausto/
