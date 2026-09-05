# CLAUDE.md — Ópticas Fausto (opticasfausto.com)

## Contexto del proyecto

Sitio estático **Hugo 0.163** para Ópticas Fausto, negocio familiar de óptica y audiología en Torre del Mar (Málaga), fundado en 1982, con dos centros: **Centro Fausto Avenida** y **Centro Fausto Duque**. Deploy en **Cloudflare Pages**. Dominio nuevo `opticasfausto.com`; el viejo `opticafausto.com` (WordPress) redirigirá con 301.

Objetivo: SEO local (Torre del Mar / Axarquía) + conversión a llamada/WhatsApp/visita física. Público 45–75+ años: **legibilidad y simplicidad son requisitos, no preferencias** (cuerpo ≥18px, contraste WCAG AA, sin modales ni pop-ups, nunca).

**Reparto de trabajo:** el contenido (front matter + copys de `content/`) se gestiona en la conversación del Proyecto de Claude.ai — NO reescribir copys, titles, descriptions ni FAQs desde Claude Code salvo petición explícita. Claude Code se ocupa de: tema, CSS/JS, build, schema, formulario, deploy.

## Arquitectura

- **Tema:** `themes/f1-theme`. Sistema de bloques: `sections:` en front matter → `partials/section-renderer.html` → `partials/blocks/*.html`. Docs del tema en `themes/f1-theme/docs/FRONTMATTER.md` (mantener actualizado al añadir bloques o parámetros).
- **Orden de render** (single/list): breadcrumb → hero (clave `hero:` del front matter) → body markdown (contenedor `prose`) → sections. Las FAQ y el CTA de cierre viven en `sections:` (el schema FAQPage solo lee de ahí); el desarrollo largo va en body markdown con shortcodes intercalados.
- **Shortcodes** (`layouts/shortcodes/`): `cta`, `banner`, `cards` — delegan en los blocks correspondientes para paridad HTML/CSS total. `cards` autodescubre las páginas hijas de una sección leyendo `linkTitle`, `card.description`, `card.image`, `weight`.
- **Datos de negocio centralizados:** `data/site.yaml` (contacto, locations, navegación, social). Los teléfonos NUNCA se escriben en contenido ni templates: siempre desde site.yaml (`preset: contact` en CTAs, `ctaPreset: contact` en heros).
- **Iconos:** `partials/icons.html` (phone, whatsapp, location, mail), SVG inline con `currentColor`.
- Las carpetas `content/*/servicios/` y `content/*/productos/` usan `build.render: never`: organizan slugs, no son páginas. Breadcrumbs (visual y schema) las excluyen filtrando por `RelPermalink` vacío — **no volver a filtros por título**.

## Convenciones fijadas (no cambiar sin consultar)

- Slugs canon: `vision-40`, `lentes-de-contacto`, `filtros-solares-luz-azul`, `lentes-oftalmicas` (femenino en slug, H1, title y enlaces).
- **Única página legal:** `/aviso-legal/` con anclas `#privacidad` y `#cookies`. No existen `/politica-privacidad/` ni `/politica-de-cookies/`.
- Denominaciones: "Centro Fausto Avenida" / "Centro Fausto Duque". **Nunca** "Fausto I" / "Fausto II" (deprecadas).
- Schema: @graph con Organization + 2 Optician (`parentOrganization`), sin tipos médicos (`MedicalBusiness`, `medicalSpecialty` prohibidos — dan errores en Search Console). No usar `Product` con `offers` vacíos (no se publican precios).
- Marca: "44 años, desde 1982". La frase «Nos conocemos de toda la vida. Y eso se nota.» solo aparece literal en home y Nosotros.
- Fase 1 sin cookies de terceros: NO añadir analítica, píxeles ni banner de consentimiento.

## Convenciones de Git

- **Nunca commitear ni hacer push directo a `main`.** `main` es siempre la última versión que Foco aprueba para desplegar.
- **Una rama por tarea**, con prefijo `claude/` (ej. `claude/footer-hours`, `claude/text-split`). Esto deja rastro claro de qué cambios vinieron de una sesión de Claude Code frente a los commits manuales de Foco.
- **Confirmar antes de hacer push a remoto** — no asumir permiso implícito para `git push` salvo que se pida explícitamente en la tarea.
- **Commits descriptivos**, en español, resumiendo el qué y el porqué del cambio (no hace falta Conventional Commits salvo que se indique lo contrario).
- Al terminar una tarea: dejar la rama lista para que Foco revise el diff y decida si mergea a `main` — no mergear de forma autónoma.
- Si una tarea toca `themes/f1-theme/docs/FRONTMATTER.md` (nuevo bloque o parámetro), el commit debe incluir esa actualización de docs, no dejarla para después.

## Estado actual (verificado con build)

Hecho y validado: `schema.html` v02 (@graph completo, BreadcrumbList, FAQPage — 127 preguntas en el sitio), `breadcrumb.html` corregido, `site.yaml` v03 (legal unificada), 30 páginas de contenido migradas, shortcodes + iconos + `cta` v2 (bg/bgMobile/bgColor/preset/microcopy), `404.html`, attributes de Goldmark activados, CSS de utilidades (`fs-xs/s/l`, `has-bg-image/color`, banner). Hero con `bg`/`bgMobile` real en las 4 páginas principales (falta Contacto — no lleva hero). Las 21 páginas de servicio/producto tienen `card.image` apuntando a un archivo real existente (verificado, ninguna en fallback).

Shortcodes añadidos (validados con `hugo build` real, sin warnings):
- `testimonial` (cita suelta con wrapper propio), `testimonials` + `testimonial-item` (grid de citas anidadas, reutiliza `.cards-grid`/`.block-testimonials` — mismo CSS que el bloque `type: testimonials` de `sections:`).
- `text-split` + `text-split-item`: grid simétrico 2 columnas para pares texto+texto (o texto+vídeo a futuro — Goldmark `unsafe=true` ya permite HTML embebido sin tratamiento especial). Reutiliza la mecánica de `.image-text-inner` (1fr → 1fr 1fr en desktop). Modificadores por item: `textSize` (reutiliza `block-text-*`), `align` (reutiliza `block-align-*`), `pad` (tokens propios `has-pad-s/m/l` sobre `--space-s/m/l`, más pequeños que el pad de sección), `margin` (CSS libre vía `safeCSS`, sin tokens — como `bgColor`). El wrapper admite `width="wide|full"` como cualquier bloque.
- Sección equipo en `/nosotros/` (punto 11 de abajo): ya completa con 7 personas, fotos y bios — eliminar de pendientes.

## TAREAS PENDIENTES (Claude Code)

### Prioridad alta
1. **Formulario de contacto** (`/contacto/`): Cloudflare Worker que recibe POST y envía vía Resend (tier gratuito). Campos: nombre, teléfono, mensaje. Dual por dispositivo (spec en comentario HTML de `content/contacto/_index.md` y ap7.5 del proyecto): móvil = mailto principal + formulario colapsado; desktop = formulario principal. Confirmación inline sin redirección. Checkbox RGPD → `/aviso-legal/`.
2. **Ofuscación JS de CIF y domicilio** en `/aviso-legal/`: spans marcados con `data-obf` en el contenido. Render vía JS en cliente (anti-scraping). El CIF real lo aporta el cliente (placeholder actual).
3. **`.gitignore`**: añadir `public/` (está commiteado) y `resources/_gen/`.
4. **Verificar 404 en Cloudflare Pages**: `/404.html` debe servirse con estado HTTP 404 real (Pages lo hace por defecto; confirmar tras deploy). El template ya lleva `noindex`, pero el meta se emite dentro de `main` — moverlo al `<head>` vía mecanismo del tema (p. ej. `.Store` leído en `header-meta.html`).

### Prioridad media
5. **`hoursSpec` en site.yaml** cuando el cliente valide horarios (sábados/temporada): el soporte en `schema.html` ya existe (formato comentado en el propio partial). Debe coincidir EXACTAMENTE con los dos Google Business Profiles.
6. **Redirecciones**: `_redirects` de Cloudflare Pages para el dominio viejo → nuevo (301), incluyendo los 4 subdominios landing (`audicion.`, `lentes-graduadas.` → `/vision/productos/gafas-progresivas/`, `lentillas.` → `/vision/productos/lentes-de-contacto/`, `vueltaalcole.` → `/vision/productos/gafas-infantiles/`) y el mapeo de URLs del WordPress antiguo. Revisar logs de 404 tras el lanzamiento: cada 404 recurrente es una 301 pendiente.
7. **Espaciados internos de blocks en `em`** (no rem/px) para que `fs-s/fs-l` y `textSize` escalen el bloque completo, y revisar la escala tipográfica base hacia `clamp()`.
8. **Hero: pasar de `background-image` a `<picture>`/`<img>` real, con layout apilado en móvil.**

   **Decisión ya tomada, no reabrir:** en móvil la imagen va SOLA arriba (bloque propio, `<img>` en flujo normal de documento) con el texto debajo sobre fondo de color — nunca overlay con texto encima. Motivo: más seguro/legible para el público objetivo 45-75+ (ver sesión del 21 ago). En desktop se mantiene el patrón actual: imagen de fondo con overlay oscuro y texto encima. Son dos modos de LAYOUT distintos según breakpoint, no solo un recorte distinto — por eso `background-image` no puede resolverlo solo (no hay forma de que un fondo CSS se comporte como "bloque con su propia altura seguido de otro bloque de texto"). CTA y Banner se QUEDAN en `background-image` a propósito (ya tienen soporte `image-set()` vía `_hd` — ver `partials/bg-image-style.html` — y así conservan la opción de `background-attachment:fixed`, que no existe para `<img>`).

   **Punto de partida real:** `hero.html` hoy tiene DOS modos que conviven — (a) `bg`/`bgMobile` como `background-image` de sección completa (usado en Nosotros/Visión/Audición), y (b) `.image` como `<img>` real en layout split a dos columnas (usado en Home). Antes de escribir código, decidir con Foco si el nuevo modo apilado-en-móvil sustituye al (a) completamente, o si conviven los tres modos según la página. No asumir.

   **Mecanismos a reutilizar, no reinventar:**
   - Densidad de píxeles (`_hd`) vía `os.FileExists` sobre la ruta física — mismo patrón que `partials/responsive-img.html` (para el `<img>` en sí) y `partials/bg-image-style.html` (si en algún punto intermedio sigue haciendo falta un `background-image`). Nunca debe dar error si falta la variante `_hd`.
   - Para el `<img>` real: descriptor `w` + `sizes` (no `x`), igual que `responsive-img.html` — el hero es candidato a LCP, aquí sí importa la precisión de tamaño real de renderizado, más que en cualquier otro bloque.
   - Dirección de arte (recorte distinto móvil/desktop, hoy `bg`/`bgMobile`) → traducir a `<picture>` con `<source media="(min-width:821px)">` apuntando al recorte de escritorio, y el `<img>` por defecto (fuera de `<source>`) sirviendo el recorte de móvil — coherente con mobile-first. **Ojo con el breakpoint**: la decisión de diseño original hablaba de 768×400px para el layout apilado, pero el resto del theme usa 821px consistentemente (`min-width:821px` en todo `main.css`/`critical.css`) — decidir un único breakpoint y no mezclar los dos.
   - Preload no bloqueante (`<link rel="preload" as="image" href="..." fetchpriority="high">`) para la imagen del hero, solo en páginas donde exista (condicional en el `<head>`, nunca precargar algo que la página no vaya a usar). Si se usa `srcset`, evaluar `imagesrcset`/`imagesizes` en el preload — Safari va por detrás en soporte, degrada con gracia al `href` simple si no lo entiende.

   **Aviso de color de texto (real, detectado revisando `.hero-subtitle`):** hoy `.has-bg-image` aplica `color:#fff`/`--subtitle-color` a TODA la sección, sin distinguir si el texto está encima de la foto o no. En el nuevo layout apilado, el bloque de texto en móvil deja de estar sobre la imagen (pasa a un bloque en flujo aparte, debajo) — si sigue heredando el blanco de `has-bg-image`, quedará blanco sobre fondo claro, invisible. Hace falta que el bloque de texto en modo apilado-móvil tenga su propio color explícito (oscuro, `--color-text`), independiente de si la sección padre tiene `has-bg-image` o no.

   **Aviso de altura del bloque imagen en móvil (Foco, 5 sep):** en el layout apilado, el bloque de imagen no puede usar el mismo `min-height` de presencia que banner/CTA (`70svh`) — con esa altura, la imagen empujaría el H1 y el subtítulo fuera del viewport inicial, obligando a hacer scroll para ver el titular de la propia página. El hero necesita menos altura de imagen que un banner/CTA, precisamente porque debajo va contenido que sí tiene que verse sin scroll. Punto de partida sugerido: `50svh` (con fallback `50vh`, mismo motivo que en banner/CTA — ver 3.1 en `DESIGN_TOKENS.md`), a ajustar según cómo quede el conjunto imagen+H1+subtítulo+botones en un viewport real de móvil.

   **Dos modos de hero, elegidos por foto — spec para valorar con Code (Foco + Claude, 5 sep, tras 4 pruebas en desktop):**

   El diagnóstico de las pruebas: el problema no es la técnica de overlay, es la foto. Un overlay tiene que oscurecer lo suficiente para que el texto se lea sobre las zonas claras de la foto, y con eso la foto muere; no hay opacidad que sirva a las dos cosas. Y ninguna técnica hace que un H1 viva bien encima de una cara. Las fotos **con espacio negativo** (todas las generadas con IA para hero, que se pidieron así) aguantan un overlay ligero. Las fotos **reales de sesión, con sujetos por todo el encuadre** (ej. `215_vision_40_hero.webp`), no aguantan ninguna. Por tanto:

   | Modo | Cuándo | Cómo |
   |---|---|---|
   | `overlay` (por defecto) | Foto con zona tranquila para el texto | Como hoy, pero con `scrim` (degradado solo sobre el lado del texto) en vez de overlay plano. La clase `.scrim` ya existe. |
   | `stacked` (opt-in, `hero.layout: stacked`) | Foto real sin zona tranquila | Foto sola arriba, bloque de color debajo con el texto. Es el mismo layout que ya se decidió para móvil, extendido a desktop en esa página concreta. |

   **Spec del modo `stacked` en desktop** (la variante que mejor funcionó, img4 de las pruebas):

   - **Banda de foto arriba**, a sangre completa. Altura por `aspect-ratio`, no `min-height` fijo, para que escale con el ancho (el prototipo usaba `min-height:500px` y se queda igual en cualquier pantalla). Recorte configurable — el prototipo necesitó `center 30%` para no cortar caras; hace falta un parámetro (`hero.imagePosition` o similar) porque el punto de interés cambia por foto.
   - **Bloque de color debajo**, `bg-color2` (navy), a sangre completa. Dentro, el contenido en **dos columnas** (flex): H1 a la izquierda (`flex-basis` ~50%), subtítulo + botones CTA a la derecha, `gap` ~3em. Esto reduce el bloque de ~800px (una columna) a ~500px y elimina el muro vacío de la derecha.
   - **Ancho del contenedor: `wide` (`--container-wide`, 1440px), no el default de 1120px.** Motivo real: el H1 y el subtítulo son **largos en todos los heros** del sitio (es el tono de la marca, no un caso puntual), y en 1120px a dos columnas no caben con dignidad. El prototipo usó `width:100vw` (full) — **eso es lo que hay que evitar**: saca el H1 de la rejilla (arrancaba a 22px del borde del viewport mientras logo, nav, breadcrumb y H2 alinean a ~340px) y se ve como un descuido. `wide` mantiene la alineación con el resto de la página (los `cards` de los hubs ya usan `width="wide"`). Si Code ve motivo para `full`, que el contenido interior siga en `.container` aunque el fondo vaya a sangre.
   - **`text-wrap: balance` en el H1.** Al ganar ancho la columna, el titular parte con un "que" colgando tras los dos puntos y "lince" huérfano solo en la última línea. `balance` reparte las líneas y elimina el huérfano sin tocar el texto. Es mejora progresiva: quien no lo soporta lo ignora. Alternativa: `max-width` en el H1.
   - **Padding inferior del bloque navy: recortar ~30%.** Quedaban ~150px de navy vacío bajo los botones.
   - Alineación vertical de las dos columnas: el prototipo las alinea arriba y queda aire bajo el H1 (la columna derecha es más alta). `align-items:center` es la alternativa. Decidir a propósito, no por defecto — a Foco le vale como está.
   - **Móvil:** colapsa a una columna (foto, H1, subtítulo, botones), como ya estaba decidido. Se aplica el aviso de altura de arriba (`50svh`).

   **Sobre el prototipo:** Foco lo hizo con estilos inline y `background-image` para probar rápido — no es la implementación. La banda de foto en modo `stacked` es justo donde `<picture>`/`<img>` con `object-fit:cover` + `object-position` (equivalente al `background-position` del prototipo) encaja mejor que `background-image`: no hay texto encima, así que no hay motivo para conservar `background-attachment`, y se gana `srcset`/`sizes` real vía `responsive-img.html`. Si Code prefiere `background-image` por coherencia con banner/CTA, el partial `bg-image-style.html` ya da `image-set()`. Cualquiera de las dos vale; que Code elija con criterio y lo documente.

   **Cuestiones abiertas para Code:** (a) si las dos columnas del modo `stacked` deben ser automáticas o un parámetro aparte; (b) proporción 50/50 vs 40/60 — con 40/60 el subtítulo respira más y el H1 sigue en 2-3 líneas; (c) si `scrim` debe pasar a ser el overlay por defecto para todos los heros en modo `overlay`, o seguir siendo opt-in.

   **Criterio de aceptación:** build limpio con y sin variantes `_hd`/recortes móvil creados; ninguna imagen rota si falta un archivo opcional; el layout apilado en móvil se ve y se comporta como bloque en flujo normal (no absolute/fixed); el texto se lee bien en ambos breakpoints, sin heredar blanco donde ya no hay foto detrás; el H1 y el subtítulo son visibles sin scroll en un móvil estándar (ver aviso de altura arriba); en modo `stacked` desktop, el contenido alinea con la rejilla del resto de la página y el H1 no deja huérfanos; verificar visualmente en varios anchos de viewport, no solo que compile.

8b. **Imágenes responsive (`srcset`/`w`+`sizes`) en Text-Image, Gallery, Team, Cards, Testimonials, Brands-logos** — ✅ hecho (`partials/responsive-img.html`, conectado en los 7 bloques con `<img>` propio). Patrón: convención de nombre `foto.webp` (1x) + `foto_hd.webp` (2x), `os.FileExists` sobre la ruta física, `w`+`sizes` no `x`. Pendiente aparte, no bloqueante: el lightbox de `gallery.html` rellena el `<img>` vía JS desde el JSON de `.items`, no pasa por Hugo — para que la vista ampliada también use `_hd` haría falta tocar ese JS, ver si compensa el esfuerzo.
9. **Sticky footer móvil** con Llamada / WhatsApp / Ubicación (requisito ap8.1), usando `icons.html` y datos de site.yaml.

## Flujo de imágenes candidatas

`draft-images/` en la raíz del repo (hermana de `static/`, NO dentro de
`static/images/`) — Hugo no la ve, cero riesgo de publicar candidatas sin
elegir. Git trackea el historial de qué entra y sale. Al elegir una candidata,
se mueve con `mv` a `static/images/` con su nombre final en convención — sin
tocar configuración de Hugo.

### Tarea actual: asignar imágenes al copy de cada página

Reglas (Foco, 5 sep):

0. No cambiar los textos existentes sin permiso.
0. Las páginas ya tienen `og.image` y `hero.bg` asignados — esta tarea es solo
   sobre imágenes **dentro del copy** (`image-text`), no toca hero ni OG salvo
   que se detecte y confirme un error puntual (ver caso 215 más abajo).
1. Revisar las candidatas disponibles en `draft-images/` antes de proponer.
2. El path final en el diff del `(page).md` debe ser `/images/(filename).webp`
   — Foco mueve el archivo después, no hace falta usar el prefijo
   `draft-images/`.
3. Si no hay ninguna candidata razonable para una página, o si falta una
   imagen que la página necesitaría, dar un **prompt en inglés** para
   generarla — no forzar una imagen que no encaje.

Progreso: 211, 212, 213, 214, 215, 216 cerradas (Vision servicios completo).
Pendiente: 200 (hub Visión), 221-226 (Vision productos), 3xx (Audición
completo).

15. **Indicador de scroll + botón volver-arriba**: (a) en heros de landings (home, /vision/, /audicion/, progresivas, lentes-de-contacto, gafas-infantiles), indicador de scroll con `icon: arrow-down` (partial icons.html), animación sutil, dentro de `<a>`/`<button>` con `aria-label`; (b) botón global "volver arriba" con `arrow-up`, visible solo tras ~1.5 viewports de scroll, `aria-label="Volver arriba"`, desplazamiento suave vía CSS `scroll-behavior: smooth` (respeta `prefers-reduced-motion`). En móvil no debe solaparse con el sticky footer de contacto (tarea 9): coordinar posiciones.

16. **SEO/Schema de 214 (Baja Visión) sin reforzar con el máster de Juan**
    (detectado 5 sep, al insertar el certificado en el copy). `title`,
    `description`, `og.*` y `schema` de `baja-vision.md` no mencionan la
    credencial (Máster en Rehabilitación Visual, U. de Valladolid) — es una
    señal de autoridad/experiencia real (E-E-A-T) que hoy solo vive en el
    copy del body, no en metadatos. Relacionado con la tarea 11
    (`Person`/`hasCredential` en schema Organization) — cuando se aborde esa
    tarea, revisar si 214 necesita además su propio refuerzo puntual de
    `title`/`description`. No tocar el copy del body sin permiso (regla 0
    arriba).

### Prioridad baja / al recibir material
11. `employee`/`Person` en schema Organization para los 7 miembros del equipo ya publicados en `/nosotros/` (el contenido ya está completo — esto es solo la parte de schema.org, pendiente).
12. `memberOf` (Sociedad Española de Baja Visión) y `hasCredential` (Centro Auditivo Homologado, si hay denominación oficial) en Organization.
13. CSS crítico inline en home; objetivo PageSpeed móvil >85.
14. hreflang / preparación multilingüe (diferido, no presupuestado).

## Cómo verificar

```bash
hugo build          # debe compilar sin errores ni warnings
# JSON-LD: validar una página de cada tipo en https://validator.schema.org
# Enlaces internos: no debe haber hrefs a rutas inexistentes en public/
```

Antes de commitear cambios del tema: build limpio + revisar visualmente home, un hub (`/vision/`), una página estándar (`/vision/servicios/optometria/`) y una landing (`/vision/productos/lentes-de-contacto/`).
