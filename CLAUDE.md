# CLAUDE.md — Ópticas Fausto (opticasfausto.com)

## Contexto del proyecto

Sitio estático **Hugo 0.163** para Ópticas Fausto, negocio familiar de óptica y audiología en Torre del Mar (Málaga), fundado en 1982, con dos centros: **Centro Fausto Andalucía** y **Centro Fausto Duque**. Deploy en **Hostinger** (cambio de decisión, 6 sep: los bloqueos de IP de Cloudflare durante partidos de fútbol hacían el sitio intermitentemente inaccesible — decisión cerrada, no reabrir). Dominio nuevo `opticasfausto.com`; el viejo `opticafausto.com` (WordPress) redirigirá con 301.

Objetivo: SEO local (Torre del Mar / Axarquía) + conversión a llamada/WhatsApp/visita física. Público 45–75+ años: **legibilidad y simplicidad son requisitos, no preferencias** (cuerpo ≥18px, contraste WCAG AA, sin modales ni pop-ups, nunca).

**Reparto de trabajo:** el contenido (front matter + copys de `content/`) se gestiona en la conversación del Proyecto de Claude.ai — NO reescribir copys, titles, descriptions ni FAQs desde Claude Code salvo petición explícita. Claude Code se ocupa de: tema, CSS/JS, build, schema, formulario, deploy.

## Arquitectura

- **Tema:** `themes/f1-theme`. Sistema de bloques: `sections:` en front matter → `partials/section-renderer.html` → `partials/blocks/*.html`. Docs del tema en `themes/f1-theme/docs/FRONTMATTER.md` (mantener actualizado al añadir bloques o parámetros).
- **Orden de render** (single/list): breadcrumb → hero (clave `hero:` del front matter) → body markdown (contenedor `prose`) → sections. Las FAQ y el CTA de cierre viven en `sections:` (el schema FAQPage solo lee de ahí); el desarrollo largo va en body markdown con shortcodes intercalados.
- **Shortcodes** (`layouts/shortcodes/`): `cta`, `banner`, `cards` — delegan en los blocks correspondientes para paridad HTML/CSS total. `cards` autodescubre las páginas hijas de una sección leyendo `linkTitle`, `card.description`, `card.image`, `weight`.
- **Datos de negocio centralizados:** `data/site.yaml` (contacto, locations, navegación, social). Los teléfonos NUNCA se escriben en contenido ni templates: siempre desde site.yaml (`preset: contact`, misma clave en heros y en CTAs).
- **Iconos:** `partials/icons.html` (phone, whatsapp, location, mail), SVG inline con `currentColor`.
- Las carpetas `content/*/servicios/` y `content/*/productos/` usan `build.render: never`: organizan slugs, no son páginas. Breadcrumbs (visual y schema) las excluyen filtrando por `RelPermalink` vacío — **no volver a filtros por título**.

## Precedencia de las fuentes

Cuando dos documentos se contradigan, el orden de autoridad es:

1. **El código y los datos** — `data/site.yaml`, los partials del tema, el front
   matter de `content/`. Lo que hace el build es lo que es.
2. **Este `CLAUDE.md`** y los docs del tema (`themes/f1-theme/docs/`).
3. **`/docs/`** — brief, TODO, **si contradice algo, No prevalece.** Si
   algo de `/docs/` contradice al código o a una decisión posterior tomada en
   conversación, gana lo nuevo — y lo correcto es actualizar el documento de
   `/docs/`, no seguirlo.
4. `/draft-docs/` es carpeta ignorada por git, no se publica. Es **histórico y contexto humano**. No leas pues puede llevarte a errores o actuaciones desactualizadas

No crear copias de este archivo en `/docs/` ni en ningún otro sitio: dos
CLAUDE.md divergen, y la copia vieja acaba dictando convenciones muertas.

## Convenciones fijadas (no cambiar sin consultar)

- Slugs canon: `vision-40`, `lentes-de-contacto`, `filtros-solares-luz-azul`, `lentes-oftalmicas` (femenino en slug, H1, title y enlaces).
- **Única página legal:** `/aviso-legal/` con anclas `#privacidad` y `#cookies`. No existen `/politica-privacidad/` ni `/politica-de-cookies/`.
- Denominaciones: "Centro Fausto Andalucía" / "Centro Fausto Duque". **Nunca** "Fausto I" / "Fausto II" (deprecadas).
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

Hecho y validado: `schema.html` v02 (@graph completo, BreadcrumbList, FAQPage — 127 preguntas en el sitio), `breadcrumb.html` corregido, `site.yaml` v03 (legal unificada), 30 páginas de contenido migradas, shortcodes + iconos + `cta` v2 (bg/bgColor/preset/microcopy; recorte móvil por convención `_m`), `404.html`, attributes de Goldmark activados, CSS de utilidades (`fs-xs/s/l`, `has-bg-image/color`, banner). Hero con `image` en tres layouts (ver tarea 1). Formulario en producción (tarea 5). QA visual de oct 2026 resuelto; lo que queda abierto o asumido está en `docs/todo-fausto.md` (C15–C17). Las 21 páginas de servicio/producto tienen `card.image` apuntando a un archivo real existente (verificado, ninguna en fallback).
Shortcodes añadidos (validados con `hugo build` real, sin warnings):
- `testimonial` (cita suelta con wrapper propio), `testimonials` + `testimonial-item` (grid de citas anidadas, reutiliza `.cards-grid`/`.block-testimonials` — mismo CSS que el bloque `type: testimonials` de `sections:`).
- `brands-logos` + `brands-logos-item` (rejilla de logos en el prose; el `<figure>` de cada logo sale de `partials/brands-logos-item.html`, compartido con el bloque `type: brands-logos`).
- `obf` (dato en línea ofuscado: base64 en `data-obf`, lo escribe `main.js`; tarea 6).
- `text-split` + `text-split-item`: grid simétrico 2 columnas para pares texto+texto (o texto+vídeo a futuro — Goldmark `unsafe=true` ya permite HTML embebido sin tratamiento especial). Reutiliza la mecánica de `.image-text-inner` (1fr → 1fr 1fr en desktop). Modificadores por item: `textSize` (reutiliza `block-text-*`), `align` (reutiliza `block-align-*`), `pad` (tokens propios `has-pad-s/m/l` sobre `--space-s/m/l`, más pequeños que el pad de sección), `margin` (CSS libre vía `safeCSS`, sin tokens — como `bgColor`). El wrapper admite `width="wide|full"` como cualquier bloque.
- Sección equipo en `/nosotros/`: completa con 7 personas, fotos y bios (el bio se despliega con `<details>`, nunca modal). Schema `Person` de los 7 generado desde el array `team:`, con `hasCredential`/`licenseNumber` leídos del front matter — sin nombres hardcodeados en el tema.
imagenes ya definidas. ultimando diseño y funcionalidades con Claude Code.

## TAREAS (Claude Code)

Numeración histórica: el TODO y otros documentos citan «tarea 5», «tarea 7»…,
así que los números no se reasignan. Las cerradas quedan resumidas con lo que
sigue vigente de ellas; el estado al día de todo el proyecto está en
`docs/todo-fausto.md`. Faltan la 2 y la 3: ya cerradas.

### 1. Hero — ✅ hecho (sep-oct 2026)

**Decisiones que no se reabren:**
- **Nunca texto sobre foto en móvil** (público 45-75+, sesión 21 ago) y
  **apilado por defecto en todos los anchos** (10 sep). El diagnóstico: el
  problema no es la técnica del overlay sino la foto. Para que el texto se
  lea sobre zonas claras hay que oscurecer tanto que la foto muere, y las
  fotos reales de sesión, con sujetos por todo el encuadre (ej.
  `215_vision_40_hero.webp`), no aguantan ninguno. `overlay` queda como
  excepción por página, con `scrim` activo por defecto (`hero.scrim: false`
  lo quita).
- **Es política del sitio, no código del tema** (oct 2026):
  `params.hero.layout = "stacked"` y `params.hero.mobileOverlay = false` en el
  `hugo.toml` de Fausto. Sin esa configuración, el tema usa `overlay` en todos
  los anchos. No hay `layoutMobile` por página.
- **Un solo bloque `hero`** con `hero.layout: stacked | overlay | split`, no
  bloques hermanos (10 sep): duplicarlo duplicaría preload LCP,
  `img-responsive`, `preset` y la variante `_m`.
- **La foto es siempre `<img>`** en los tres layouts, también en `overlay`
  (oct 2026): un `background-image` no tiene `alt`, apilado en móvil estiraba
  la foto, y no admite `srcset` por ancho.

**Cómo quedó** (detalle en FRONTMATTER.md, «Hero: layouts», y DESIGN_TOKENS.md):
`stacked` = banda de foto a sangre (`40svh` en móvil, `aspect-ratio 3/1` con
tope de 1440px en escritorio) y bloque `bg-color2` debajo; en escritorio, dos
columnas 50/50, alineadas arriba, automáticas (si no hay subtítulo ni CTAs,
el H1 ocupa todo). Contenedor `--hero-width` (1440), `text-wrap: balance` en
el H1, padding superior por clase del partial (`hero-stacked` → 0). Imagen
con `_hd` por `srcset` w, `_m` por `<picture>` (breakpoint `51.25em`, 820px con la letra por defecto), preload
con `imagesrcset`/`imagesizes` solo en páginas con hero, `imagePosition` para
el encuadre. Medido en el QA visual de oct 2026.

**CTA, Banner y Counter siguen en `background-image` a propósito:** conservan
la opción de `background-attachment:fixed`. Usan `img-bg-style.html` (antes
`bg-image-style.html`), que resuelve `_hd` y `_m` por convención (la clave
`bgMobile` ya no existe). No retirarlo ni dejarlo morir porque el hero ya no
lo use: tiene que seguir funcional y cubierto en la demo.

### 4. Optimización de imágenes

Medidas, proporciones y criterios: `themes/f1-theme/docs/GUIA-IMAGENES.md`.

**Hecho (14 sep):**
- **OG** — 25 JPG a 1200×630 en `static/images/og/`, `.md` apuntando ahí.
- **Cards** — 21 base a 800×600 (4:3) + sus 21 `_hd` a 1600×1200.
- **Equipo** — 7 fichas recortadas a 750×750 cuadrado (antes 750×1125
  verticales, con un tercio del peso que se descargaba sin verse nunca).

**Hecho (16 sep):**
- **image-text** — completado. Base 700 de ancho, `_hd` 1400. La imagen no
  ocupa el contenedor: hasta ~510px en `default`; en `wide`/`full`, desde oct
  2026 el texto se para en `--measure-col` y la imagen crece (773px en `wide`,
  1099px en `full` a 1920) — ver la tabla de la guía.

**No aplica en Fausto (por ahora):**
- **Slider** (780 de ancho) y **logos de marca** (lienzo 2:1, 320×160) — el
  sitio no usa hoy ninguno de los dos bloques. Los formatos están definidos en
  la guía; si se usan logos (p. ej. marcas de audífonos), ver allí.

**Hecho (16 sep):**
- **Galería** — los 4 `100-instalaciones_*` optimizados, con `_hd` a 2400×1800
  en tres de ellos. La vertical de 1386×1592 quedó reencuadrada a 957×888.
  En paralelo se corrigió el lightbox: `gallery.html` resuelve la variante `_hd`
  en build y la pasa en el JSON, y `mostrar()` usa `imageHd || image`. Antes la
  ampliación servía la versión pequeña mientras la rejilla podía estar sirviendo
  la `_hd` — la foto grande salía con menos resolución que su miniatura.

  Dos cabos sueltos, no bloqueantes: `andalucia_fachada` (957×888) es la única
  sin `_hd`, así que en el lightbox se amplía la base; y las tres bases están a
  1350×900, 1200×900 y 957×888, proporciones distintas entre sí — el recuadro
  4:3 del CSS las recorta de forma desigual. Ojo al `object-position: top` de
  `.gallery-open img`, puesto para no cortar los rótulos de fachada.

**Pendiente:**
- **Heros** — desbloqueado: el layout `stacked` ya existe y la banda se mide
  (ver GUIA-IMAGENES.md y DESIGN_TOKENS.md, «Banda móvil y proporción del
  `_m`»). Lo que sigue es el análisis de pesos, todavía sin aplicar:

  Aquí la ganancia está en generar variantes **más
  pequeñas**, no un `_hd` mayor: la mayoría son imágenes de IA a ~1440px y esa
  es su resolución nativa, no hay más detalle que extraer. Regenerar a más
  resolución no vale (la IA no es determinista: saldría otra imagen), y
  **ampliar con un upscaler tampoco** — añade peso sin detalle y en fotos con
  personas mete artefactos (ya pasó con el bordado de una bata: "YAUSTO",
  "OPTOMETIDRTA").

  Pesos medidos sobre `215_vision_40_hero.webp` a calidad 78: 640→50KB ·
  960→84KB · 1280→112KB · **1440 (actual)→139KB** · 1920→171KB · 2880→261KB.
  Hoy todos los dispositivos descargan los 139KB. Con escalera 640/960/1280/1440
  y descriptores `w`+`sizes`, el navegador elige solo:

  | Dispositivo | Necesita | Elige | Ahorro |
  |---|---|---|---|
  | iPhone SE (375, DPR2) | 750px | 960w | **55 KB** |
  | Android medio (360, DPR2) | 720px | 960w | **55 KB** |
  | iPhone 14 (390, DPR3) | 1170px | 1280w | **27 KB** |
  | iPad (820, DPR2) / Desktop | 1440px+ | 1440w | 0 KB |

  Excepción: las fotos con código de cámara (`D3A####`) tienen original en alta
  calidad — para esas sí cabe un `_hd` real, generado desde el original (nunca
  ampliando el WebP ya reducido), con techo de 1920px.
- **Arte móvil (`_m`)** — recortes en **3:2** (768×512), solo donde el
  encuadre de escritorio no funcione (caras cortadas, sujeto descentrado). Los
  que hay hoy son verticales de 843×1264, de antes de que existiera la banda, y
  hay que reencuadrarlos. Ojo: el `_m` de una foto también lo usa un `cta` o
  `banner` con esa misma foto de fondo. **Qué imágenes lo necesitan es juicio
  visual, no automatizable.**

**Cambios de theme que faltan para aprovechar todo esto:**
- `img-responsive.html` usa `w`+`sizes`, pero solo genera **dos peldaños**
  (base y `_hd`). Ampliarlo a escalera descendente es lo que desbloquea el
  ahorro de la tabla de arriba.
- `img-bg-style.html` (banner, CTA, counter) usa `image-set(... 1x, ... 2x)`,
  descriptores de **densidad pura**: un móvil con DPR3 se descarga el archivo
  2x entero aunque necesite mucho menos. Para afinarlo hacen falta media
  queries por ancho, no solo por densidad.

### 5. Formulario de contacto (`/contacto/`) — ✅ implementado y verificado en producción (27 sep 2026)

Backend: **SMTP autenticado** contra `smtp.hostinger.com` con **PHPMailer**, cuenta
`formulario@opticasfausto.com`. **No `mail()`**: medido en real (sep 2026), `mail()` en el
alojamiento compartido de Hostinger ignora `-f`, reescribe el remitente del sobre
(`noreply@srvXXXX.main-hosting.eu`) y no firma DKIM; DMARC falla y Hostinger lo marca `X-Spam`.
Por SMTP autenticado sale como desde el webmail: DKIM de `opticasfausto.com`, SPF y DMARC en pass. Campos: nombre, teléfono, **correo
(opcional)** y mensaje, más la casilla RGPD. El correo es opcional a propósito: sin
él no hay `Reply-To`, pero el teléfono sigue siendo obligatorio.

**Piezas y dónde viven**

| Pieza | Ruta | Qué es |
|---|---|---|
| Endpoint | `static/contacto/enviar.php` | Versionado. Hugo lo copia a `public/contacto/enviar.php`. |
| Config | `public/contacto/config.php` | **Generado en cada build** por el shortcode `contact-form` desde `data/site.yaml` (`contact.form.from`, `contact.form.to`, teléfonos) e i18n. No está en git. |
| Formulario | shortcode `{{< contact-form >}}…{{< /contact-form >}}` | El markdown de dentro (info RGPD) se pinta sobre la casilla. |
| Front | `main.css` (`.cf-*`), bloque `aislar('formulario de contacto')` de `main.js` | |
| PHPMailer | `static/contacto/lib/PHPMailer/` | 6.10.0, solo `PHPMailer.php`, `SMTP.php`, `Exception.php`, sin modificar. `lib/.htaccess` niega el acceso directo. |
| Credenciales SMTP | **`/home/u204505935/domains/opticasfausto.com/smtp.php`** | **FUERA del repo y FUERA de `public_html`.** Devuelve `['user' => ..., 'pass' => ...]`. Se sube a mano una vez, permisos 600. La sincronización de `public/` no lo toca. **NUNCA se commitea: el repo es público.** Si falta, el formulario responde 500 y lo dice en el log. |

**Despliegue: dónde vive el `.php`.** Va en `static/` para que Hugo lo copie a
`public/` y suba con el resto: forma parte del ciclo de despliegue, no está fuera
de él. `config.php` también acaba en `public/`. Consecuencias:

- El deploy tiene que subir **`public/` completo, incluidos los `*.php`** (si algún día
  filtra por extensión, incluirlos).
- **Nada se sube ni se edita a mano en el hosting.** Un deploy que sincroniza borrando lo
  que sobra (`rsync --delete`, espejo por FTP, «reemplazar carpeta») elimina cualquier
  `.php` colocado a mano en la primera subida. Los dos ficheros sobreviven precisamente
  porque están dentro de `public/`.
- Cambiar destinatario o remitente = editar `data/site.yaml` + build + subir.
- Si `config.php` no llega, `enviar.php` responde 500 y no envía nada (falla cerrado).
- **Despliegue:** WinSCP, sincronización en modo espejo de `public/` → `public_html/`, en
  binario, con borrado y máscara `| error_log; .well-known/`. Antes de subir, `public/` tiene que
  venir de `hugo` (producción): `grep -rl "localhost:1313" public/` no debe devolver nada.
- Requisitos del hosting: PHP ≥ 7.4 con `mbstring` y `openssl`, y el buzón
  `formulario@opticasfausto.com` existente, con reenvío a `web@` para los rebotes.

**Decisiones de diseño (no reabrir sin motivo)**

1. **Cabeceras.** `From:` es SIEMPRE la dirección fija `contact.form.from`, del propio
   dominio; **nunca** la del visitante (rompería la alineación SPF/DKIM y sería suplantación).
   El correo del visitante va en `Reply-To:` (solo la dirección, sin nombre). El **build
   falla** si el dominio de `from` no está alineado con `baseURL` (en localhost no se
   comprueba). El remitente del sobre es el mismo (`setFrom()` de PHPMailer), que además
   es la cuenta SMTP autenticada: por eso `from` tiene que ser un buzón real.
   `nombre`, `teléfono` y `correo` pueden acabar en una cabecera (`Subject`, `Reply-To`): cualquier
   carácter de control, en particular `\r` o `\n`, **rechaza el envío** (400); no se filtra en
   silencio. El asunto va codificado (RFC 2047). El mensaje sí admite saltos de línea (van al
   cuerpo, no a cabeceras).
2. **Sin JS.** El `<form>` hace un POST normal. Éxito → **303 a `/contacto/#recibido`**, donde
   la confirmación se muestra con `:target` (así un F5 no reenvía). Errores → página HTML
   autocontenida (422) con el motivo, enlace de vuelta y llamar/WhatsApp. El JS solo intercepta el
   submit (`fetch` con `Accept: application/json`), valida y pinta la confirmación en su sitio.
   El formulario va siempre a la vista, también en móvil (sep 2026: el plegado en `<details>`
   tras un botón `mailto:` se descartó; con este público no se veía, y el `mailto:` depende de
   tener app de correo). Escritorio: dos columnas, datos | primera capa legal + casilla + enviar,
   con el HTML en ese orden para que teclado y lector lean la información antes de consentir.
3. **Antispam sin captcha.** Honeypot (`sitio_web`, fuera de pantalla) + tiempo mínimo de 3 s
   entre carga y envío. Al honeypot se le responde **exactamente lo mismo que a un envío bueno**, y deja
   una línea en el log: si aparece con envíos de personas reales, el autorrelleno del navegador
   está rellenando el campo.
   El tiempo lo mide el cliente (`_t`, sin desfase de reloj); sin JS llega vacío y no se puede
   comprobar (solo actúa el honeypot). Un envío a <3 s recibe un error recuperable, no un éxito
   falso: un humano con autorrelleno podría llegar ahí. Además se rechaza un `Origin` ajeno.
   **Límite conocido:** un bot que haga POST directo, sin JS y sin tocar el honeypot, pasa; no hay
   limitación por IP (exigiría guardar estado). Si aparece spam, medir antes de añadir nada.
4. **Accesibilidad.** `<label for>` reales (sin placeholders); obligatorio/opcional dicho con texto;
   errores con `aria-invalid` + `aria-describedby` y foco al primer campo con error; confirmación
   en un contenedor `role="status" aria-live="polite"` al que se mueve el foco; errores generales
   en `role="alert"`; el enlace a `/aviso-legal/#privacidad` sin `target="_blank"`. Campos de 48px y
   texto ≥18px; borde de 2px con contraste ≥3:1; el error usa `--color-error` (>7:1) más texto e icono.
5. **No persiste nada.** Ni base de datos, ni archivos, ni log de envíos. El único registro es
   `error_log()` cuando el envío falla, sin datos del visitante.

**Texto legal:** actualizado en `contacto` y `aviso-legal`: Hostinger figura como **encargado de
tratamiento técnico** (aloja la web y el buzón) y se dice explícitamente que el formulario no guarda
nada (sin base de datos ni registro de envíos). Queda una nota `<!-- PENDIENTE -->` mucho más
estrecha, que ya no es de implementación sino del asesor/cliente: denominación social exacta del
encargado y contrato de encargo (DPA) aceptado en la cuenta de hosting.

**✅ Verificado en el dominio real (26-27 sep 2026).** Cabeceras de un envío real del formulario,
en `contacto@`: `dkim=pass header.d=opticasfausto.com header.s=hostingermail-a`,
`spf=pass smtp.mailfrom=formulario@opticasfausto.com`, `dmarc=pass`, y
`Authenticated sender: formulario@opticasfausto.com`. Con y sin correo del visitante (el caso sin
correo llega con «LLAMAR, sin correo» en el asunto). Probado también: servidor SMTP mudo (corta a
los 15 s), credenciales ausentes o con BOM/espacios/error de sintaxis (ver comentarios de
`enviar.php`).

**Spam en el buzón propio:** `X-Spam` lo pone el filtro de entrada de Hostinger (Cloudmark, cabeceras
`X-CM-*`), por **contenido**, no por autenticación: aun con todo en pass, un mensaje de prueba cayó
en spam por parecerse a otro anterior que sí era dudoso. Resuelto con `formulario@opticasfausto.com`
en la **lista blanca** de `contacto@` (webmail de Hostinger). **Si el buzón de destino cambia, repetir
la lista blanca en el nuevo.** El riesgo de que alguien falsifique ese remitente se cierra al pasar
el DMARC de `p=none` a `p=quarantine` (pendiente: cuando los informes que llegan a `web@` salgan
limpios unas semanas).

**Para volver a verificar tras un cambio en el envío:** enviar el formulario y abrir el mensaje
original en `contacto@` (o, para ver cómo lo trata un tercero, poner temporalmente
`contact.form.to` en una cuenta de Gmail, build, subir, *Mostrar original*, y restaurar). Tienen que
salir `dkim=pass` con `header.d=opticasfausto.com`, `spf=pass` con
`smtp.mailfrom=formulario@opticasfausto.com`, `dmarc=pass` y la línea «Authenticated sender». Si el
remitente del sobre sale como `noreply@srv….main-hosting.eu`, el mensaje ha salido por `mail()` y no
por SMTP: revisar.

**Email del dominio, verificado (6 sep):** DONE 17 set - SPF
(`v=spf1 include:_spf.mail.hostinger.com...`) y DKIM (3 CNAME
`hostingermail-a/b/c.dkim...`) ya configurados — listos para que `mail()` no
caiga en spam. DMARC en modo monitor:
`v=DMARC1; p=none; rua=mailto:web@opticasfausto.com;`. **No cerrar esta
pieza:** `p=none` es solo el arranque — monitorizar ~1 mes los informes
agregados y solo entonces decidir si se sube a `p=quarantine`/`p=reject`.

### 6. Ofuscación JS de CIF y domicilio en `/aviso-legal/` — ✅ hecho (oct 2026)

Shortcode `{{< obf text="…" fallback="…" >}}` (BLOCKS.md): el HTML lleva el dato en
base64 en `data-obf` y `main.js` lo escribe al cargar (anti-scraping básico; quien
ejecute JS lo obtiene). Sin JS se lee el `fallback` («consúltalo escribiéndonos»).
**Ojo:** el domicilio ya sale en claro en el footer y en el JSON-LD (`streetAddress`),
así que ofuscarlo en el aviso legal no lo protege; el CIF sí queda fuera del HTML.

### 7. 404 — ✅ HTTP 404 real y `noindex` en el `<head>`

✅ `ErrorDocument 404 /404.html` en `static/.htaccess`, comprobado en el
servidor (TODO, C8). ✅ `partials/seo.html` emite `noindex` cuando `.Kind` es
`404`. No se usa `.Store`: `baseof` pinta el `<head>` antes de ejecutar el block
`main`, así que un valor puesto desde `404.html` llega tarde.

### 8. Redirecciones

**Hoy en 302 a propósito**, hasta lanzar el sitio nuevo; al lanzar se pasan a
301 (TODO, C7, que lleva el mapeo de URLs del WordPress antiguo).
En Hostinger es `.htaccess` (Apache, `RewriteRule`/`Redirect 301`),  Del dominio viejo → nuevo, incluyendo los 4 subdominios landing (`audicion.`, `lentes-graduadas.` →
`/vision/productos/gafas-progresivas/`, `lentillas.` →
`/vision/productos/lentes-de-contacto/`, `vueltaalcole.` →
`/vision/productos/gafas-infantiles/`) y el mapeo de URLs del WordPress
antiguo. Revisar logs de 404 tras el lanzamiento: cada 404 recurrente es una
301 pendiente.

### 9. Espaciados: `rem` para el ritmo, `em` para el interior — ✅ hecho (oct 2026)

Tipografía base en `rem` con `clamp()`; breakpoints en `em`. El **interior** de los
bloques (huecos de rejillas, padding de tarjetas/FAQ/slider/paneles, márgenes entre
titular, texto y enlaces) va en `em`, para que `textSize`, `fs-s`/`fs-l` escalen el
bloque entero; el **ritmo** entre bandas (`--block-pad*`, `.section`, margen entre
bloques del prose, contenedor, cabecera, footer, formulario) se queda en `rem`.
Detalle, calibrado (×0,85 respecto al `rem`: el `1em` de un bloque es el cuerpo, 18-20px)
y mediciones en DESIGN_TOKENS.md, 3.4. Regla para CSS nuevo: si separa bloques, `rem`;
si está dentro de uno, `em`.

### 10. `title`/`description` de 214 (Baja Visión)

`title`, `description` y `og.*` de `baja-vision.md` no mencionan la credencial
de Juan (Máster en Rehabilitación Visual, U. de Valladolid) — señal de
autoridad real (E-E-A-T) que hoy solo vive en el copy del body. La parte de
schema ya está resuelta (Juan es `provider` con `hasCredential` e
`identifier`). **No tocar el copy del body sin permiso.**

### Prioridad baja / al recibir material

11. `memberOf` (Sociedad Española de Baja Visión) y `hasCredential` (Centro
    Auditivo Homologado, si hay denominación oficial) en Organization.
12. CSS crítico inline en home; objetivo PageSpeed móvil >85.
13. hreflang / preparación multilingüe (diferido, no presupuestado).

## Flujo de imágenes

**Medidas, proporciones, calidad de exportación y criterios de encuadre por
tipo de imagen: `themes/f1-theme/docs/GUIA-IMAGENES.md`.** Incluye la tabla de
qué ancho necesita cada bloque (calculada desde los `sizes` que declara el
propio theme), la convención `_hd`/`_m`, y por qué en los heros la ganancia
está en generar variantes más pequeñas y no un `_hd` mayor. Consultarla antes
de generar, recortar o encargar cualquier imagen.

`draft-images/` en la raíz del repo (hermana de `static/`, NO dentro de
`static/images/`) — Hugo no la ve, cero riesgo de publicar candidatas sin
elegir. Git trackea el historial de qué entra y sale. Al elegir una candidata
se mueve con `mv` a `static/images/` con su nombre final — sin tocar
configuración de Hugo.

**Asignación de imágenes al copy: ✅ completada (6 sep).** Los 22 archivos de
Visión y Audición (hubs 200/300 y todas sus páginas hijas) tienen al menos
una imagen en el copy. Lo que queda sobre imágenes es la tarea 4
(optimización), no la asignación.

Reglas que siguen vigentes para cualquier imagen nueva:
- No cambiar textos existentes sin permiso.
- El path en el `.md` es siempre `/images/(filename).webp` — Foco mueve el
  archivo desde `draft-images/` después.
- Si no hay candidata razonable, dar un **prompt en inglés** para generarla
  en vez de forzar una imagen que no encaje.
- `.webp` para todo salvo OG (que va en `.jpg`).

## Cómo verificar

```bash
hugo                # producción: debe compilar sin errores ni warnings
hugo server         # desarrollo, escribe en .dev/ e INCLUYE borradores (/demo/)
node -c themes/f1-theme/assets/js/main.js   # el build NO detecta JS roto
# JSON-LD: validar una página de cada tipo en https://validator.schema.org
# Enlaces internos: no debe haber hrefs a rutas inexistentes en public/
```

Antes de commitear cambios del tema: build limpio + revisar home, un hub
(`/vision/`), una página estándar (`/vision/servicios/optometria/`) y una
landing (`/vision/productos/lentes-de-contacto/`).

### QA visual: medir, no mirar

**Para cambios de CSS/layout el build limpio no basta.** Varios bugs reales de
este proyecto compilaban sin un solo warning: un `white-space` que se pisaba a
sí mismo, un `main.js` roto entero (slider, galería y contador caídos), un
botón que se deformaba solo entre dos breakpoints concretos.

Usar la skill **`visual-qa`** (`.claude/skills/visual-qa/SKILL.md`): mide el
resultado renderizado con Playwright en varios anchos en lugar de comprobarlo
a ojo, e incluye el método para elegir un breakpoint midiendo dónde rompe de
verdad — de ahí salieron los del header (1100px, hoy `68.75em`; el de 840 se unificó con el genérico de 820 en sep 2026).

Primera vez en una máquina nueva:

```bash
pip install playwright --break-system-packages && playwright install chromium
```

**Si Claude Code tiene otra vía mejor para inspeccionar el render** (un MCP de
navegador, capacidad nativa de captura, o herramienta equivalente), usarla y
decirlo — lo que importa es *medir el resultado*, no la herramienta concreta.
Playwright es lo que ya está probado funcionando en este proyecto, no un
requisito.

### Comprobar en deploy real, no solo en local

`hugo server` y el `public/` local no reproducen todo. Tras desplegar en
Hostinger, comprobar sobre el dominio real:

- **HTTP 404 de verdad** en una URL inexistente (tarea 7) — no basta con que
  se vea la página bonita: mirar el código de estado.
- **Redirecciones 301** (una vez publicado el nuevo dominio) del dominio viejo y de los 4 subdominios (tarea 8), comprobando que la cadena no pasa por un 302 intermedio.
- ✅ **Formulario**: verificado el 26-27 sep 2026 (tarea 5): DKIM, SPF y DMARC en pass,
  alineados con el `From`, y en bandeja gracias a la lista blanca de `contacto@`.
- **Certificado SSL** válido en `opticasfausto.com` y en `www.` (los CAA
  aplicados el 10 sep limitan qué autoridades pueden emitirlo).
- **PageSpeed Insights móvil** contra la URL real, no local: el objetivo >85
  depende de latencia y compresión del servidor, que en local no existen.
- **Cabeceras de caché** de Hostinger para `static/`: si sirve imágenes y CSS
  sin `Cache-Control` razonable, las visitas repetidas pagan de más.
