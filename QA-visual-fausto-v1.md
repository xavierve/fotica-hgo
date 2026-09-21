# Informe de QA visual — `main` @ `3cff405`

Auditoría de solo lectura, sin cambios en el repo. Metodología: build con `hugo -D` (incluye `/demo/` y borradores), servido en local y medido con Playwright/Edge — render real, no lectura de CSS. Anchos 359/820/821/1440px. Antes de auditar, comprobé empíricamente que **`/audicion/` replica la plantilla de `/vision/`**: mismo DOM (header/footer idénticos byte a byte salvo el ítem de nav activo; mismos bloques `block-cards`/`block-image-text`/`block-cta`/`block-faq`). No la auditro por separado; donde cito "vision" vale igual para "audicion".

---

## DEFECTOS

### 1. El botón de menú móvil (hamburguesa) se deforma por debajo de 390px
**Página:** todas · **Ancho:** 359, 820px (no en 821/1440)
`.nav-toggle` declara `width:2.5rem;height:2.5rem` (`critical.css:211-212`), pero medido en `/` a 359px renderiza **27.6×40px** (no cuadrado). Es un flex-item sin `flex-shrink:0` dentro de `.header-inner`: a 359px el logo (218px) + el botón de teléfono (51px) no dejan sitio y el navegador encoge el único elemento que puede encoger. Verificado el umbral exacto: **funciona a 390px (40×40), se rompe por debajo (27.6×40 a 359px)**. Es el único disparador de la navegación en móvil.
**Severidad: ALTA** — afecta a todas las páginas, en el rango de anchos de un iPhone SE o un Android de gama media, aunque el clic sigue funcionando (área táctil reducida, no rota).

### 2. El anillo de foco de `.btn` es casi invisible sobre fondos claros
**Página:** home (botones "Llamar"/"WhatsApp" del hero) · **Ancho:** 359 y 1440px
`.btn:focus-visible{outline:3px solid color-mix(in srgb, currentColor 45%, transparent)}` (`main.css:1168-1171`) se dibuja **fuera** del botón, sobre el fondo de la página. Medido con captura de píxeles real (barrido de la franja donde debe estar el anillo, con teclado real): sobre `--bg-color1` (crema, #f5efe5) el anillo blanco al 45% solo sube la luminosidad de 245→249, contraste **≈1.0-1.1:1** frente al 3:1 mínimo de WCAG 2.4.11/1.4.11. Este era exactamente el hallazgo que quedó **sin verificar** en `docs/todo-fausto.md` (ítem C14, dejado pendiente en una sesión anterior) — queda confirmado.
**Severidad: ALTA** — son los CTA de "Llamar"/"WhatsApp" del hero de portada, presentes en casi todas las páginas.

### 3. `/demo/` desborda horizontalmente a 359px
**Página:** /demo/ · **Ancho:** 359px (no en 700px+)
`document.documentElement.scrollWidth` = 385 vs `clientWidth` = 359 (26px de desbordamiento). Causa raíz localizada: en el banner `textSize="xl"`, el markdown tiene un `<code>textSize="xl"</code>class="bg-color1"` sin espacio entre `</code>` y `class=`, así que el navegador trata `class="bg-color1"` pegado al code como parte del mismo span y no puede partir la línea (`overflow-wrap:normal` en el texto del banner). Es un typo de contenido en `content/demo/_index.md`, no un fallo de CSS.
**Severidad: MEDIA** — `/demo/` es `draft:true`/`noindex`, no la ve un visitante real, pero desborda.

### 4. Contraste del eyebrow por debajo de AA
**Página:** home · **Ancho:** 359/820/821/1440px (igual en los cuatro)
`.eyebrow` ("Desde 1982 en Torre del Mar") sobre el hero split: color `#8a6d20` (`--color-accent-text`) sobre fondo `#f5efe5` (`--bg-color1`), ambos flat (verificado que no hay imagen de por medio). Contraste medido: **4.28:1**, bajo el 4.5:1 que exige WCAG para texto normal (a 13.6px no es "grande"). Nota aparte, no reportada como defecto nuevo porque ya está trackeada: ese 13.6px sale de un `rem` que resuelve contra el `<html>` (16px), no contra el `clamp()` de `<body>` — coincide con la tarea 9 ya pendiente en `CLAUDE.md` (rem/px → em).
**Severidad: MEDIA** — visible en la portada, aunque es texto decorativo, no contenido esencial.

### 5. Objetivos táctiles sistemáticamente por debajo de 44px
**Página:** todas · **Ancho:** 359px
Medido en las 8 páginas: el botón de teléfono de la cabecera móvil (`717 77 00 90`, pill `.btn-small`) mide **51×33.4px**; los iconos de Facebook/Instagram del footer miden **29.4×33.5px**. Ambos pasan el mínimo WCAG 2.5.8 AA (24px), pero quedan por debajo de los 44px que el propio sitio usa en otras piezas (`back-to-top`, `sticky-cta`) y del criterio "enhanced" 2.5.5, relevante dado el público 45-75+ explícito en `CLAUDE.md`.
**Severidad: BAJA-MEDIA** — pasa el mínimo legal, pero es inconsistente con el propio estándar interno del sitio, y aparece en cada página.

### 6. Checkbox RGPD del formulario a 25.6×25.6px
**Página:** contacto · **Ancho:** 359px
`.cf-consent input[type=checkbox]{width:1.6rem;height:1.6rem}` = 25.6px. Es un control obligatorio para poder enviar el formulario (única casilla que bloquea el envío), y mide bastante menos que el resto de controles táctiles del propio sitio (44px).
**Severidad: BAJA-MEDIA** — pasa 24px AA, pero es el punto de fricción de la conversión principal de la página.

### 7. `.bg-color4 .btn-outline` con contraste 2.44:1 (`/demo/` solamente)
**Página:** /demo/ · **Ancho:** cualquiera (color plano, no depende del ancho)
`.btn-outline{color:var(--color-link)}` (verde `#08783e`) no está en la lista de selectores que invierten color sobre fondo oscuro/medio (`main.css:654-657` cubre `has-bg-image`, `bg-color2`, `bg-color3`, pero **no `bg-color4`**). Sobre `--bg-color4` (dorado `#C9A84C`) el verde da 2.44:1, bajo 4.5:1. **Ningún contenido de producción usa hoy `class: bg-color4`** (solo aparece en `content/demo/_index.md`), así que no afecta a ninguna página publicada, pero es un componente reutilizable con el bug latente.
**Severidad: BAJA** — sin impacto en producción hoy; se activaría si alguna página futura combina `bg-color4` con un botón outline/preset.

### 8. `.section-subtitle` sin contraste sobre fondo oscuro (`/demo/` solamente)
**Página:** /demo/ · **Ancho:** cualquiera
`.section-subtitle{color:var(--color-muted)}` (`main.css:47-52`) no tiene variante para fondo oscuro. En la demo del bloque `locations` con `class="bg-color2"`, da 1.78:1 sobre navy — irónicamente la propia leyenda de esa demo dice "no hay que tocar nada para que se lean sobre fondo oscuro", pero medido no se lee. `.section-subtitle`/`.section-note` son clases de anotación **propias de `/demo/`**, no un componente del tema usado en contenido real.
**Severidad: BAJA** — solo afecta al texto explicativo interno de la página de demostración.

---

## VERIFICADO, SIN HALLAZGOS

- **Imágenes:** ningún `alt` ausente; ninguna imagen deformada (`object-fit` correcto en todas las comprobadas).
- **Nombres accesibles:** ningún enlace o botón de solo icono sin texto ni `aria-label`.
- **CLS (salto de layout en carga):** ≤0.0008 en las 5 páginas medidas (home, demo, vision-hub, leaf, contacto) — sin saltos perceptibles.
- **Orden de tabulación:** revisado en home/contacto/demo/nosotros a 359 y 1440px; sigue el orden visual de lectura en las cuatro. Las únicas "inversiones" que detectó el script eran elementos de la misma fila con centrado vertical distinto (diferencia de pocos px), no reordenaciones reales.
- **`/vision/` — secciones "servicios" y "productos":** las dos rejillas de tarjetas (6 y 7 tarjetas) dentro de la página `/vision/` renderizan sin roturas a 1440px.

## Pista falsa investigada y descartada

Al capturar `/` a página completa vi un hueco en blanco enorme a 820px que no aparecía a 821px (altura de captura 7960 vs 5736px). Antes de reportarlo até: **medí el DOM real** (alturas y posiciones de cada sección) y las 10 secciones existen con alturas correctas en ambos anchos — no falta nada. Repetí la captura con `prefers-reduced-motion:reduce` forzado y el hueco desapareció. Es un artefacto de la captura `fullPage` de Playwright combinada con la animación *reveal-on-scroll* del sitio (los bloques quedan en `opacity:0` porque su `IntersectionObserver` no llega a dispararse durante el volcado a imagen), no un bug real para un visitante que hace scroll normal.

---

## OPINIÓN (corta, a título informativo)

- La escala de tamaños táctiles del sitio no es única: 25.6px (checkbox) / 33-40px (botones de cabecera, iconos sociales) / 44px (back-to-top, sticky-cta). Unificarla o no es una decisión de diseño, no la tomo yo.
- `GUIA-IMAGENES.md` conserva un aviso "⚠ Los heros están PENDIENTES de cerrar... todavía no está implementado" que ya no es cierto (el layout `stacked`/`overlay`/`split` está implementado y documentado en `FRONTMATTER.md`). No es un defecto del sitio renderizado, pero puede inducir a error a quien lea solo esa guía.