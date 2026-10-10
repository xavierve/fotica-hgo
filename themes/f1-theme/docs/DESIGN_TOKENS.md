# F1 Theme · Design Tokens

Todos los tokens viven en `:root`, dentro de `assets/css/critical.css`.
Nada de color, tamaño o espaciado se escribe a pelo en el CSS del tema: si un
valor se repite o puede cambiar, es un token.

Este documento cubre lo que ya está **estable**. Del hero solo documenta sus
tokens (1.3.1); los layouts están en `FRONTMATTER.md`. Los espaciados internos
en `em` siguen pendientes.

---

## ⚠️ Restricción de marca

> **El logo es del cliente y no se toca.** Verde de marca: `#08783e` (cambio aprobado
> por el cliente; sustituye al `#34830b` original, que daba contraste AA sin margen).
> SVG original (`static/images/logo-fausto-animado-color.svg`).
> Variantes derivadas (mismo tono, 149°): `#1da55f` en el logo claro sobre fondo
> oscuro y `#8cf2be` en el favicon en modo oscuro.
> El verde de paleta `--bg-color3` y `brand.themeColor` (`data/site.yaml`) usan el
> mismo `#08783e`: logo y paleta ya no divergen.
>
> El resto de colores de la paleta son provisionales mientras se cierra el
> diseño. No dar ningún hex por definitivo salvo los del SVG del logo.

---

## 1. Colores

Hay **tres familias** con propósitos distintos. Mezclarlas es la fuente de casi
todos los bugs de contraste que hemos tenido.

### 1.1 Tokens semánticos

```css
--color-text: #1c1a17;             /* texto normal del body */
--color-text-inverse: #ffffff;     /* texto sobre fondo oscuro */
--color-muted: #625d55;            /* texto secundario: captions, ayudas */
--color-muted-inverse: rgba(255,255,255,.90);  /* lo mismo sobre fondo oscuro */
--color-subtitle: var(--color-text);           /* subtitulo de hero y cta */
--color-subtitle-inverse: rgba(255,255,255,.94);
--color-eyebrow: var(--color-accent-text);     /* antetitulo (.eyebrow) */
--color-eyebrow-inverse: var(--color-text-inverse);
--color-dark: #25211d;             /* negro suavizado: footer, bloques contrast */
--color-bg: #fffdf8;               /* fondo del LIENZO (body), blanco roto */
--color-bg-over: #fff;             /* fondo de lo que va ENCIMA: cards, controles */
--color-link: #08783e;             /* ACCIÓN sobre fondo claro (ver 1.1.1) */
--color-link-inverse: var(--color-text-inverse);  /* acción sobre fondo oscuro */
--color-accent: #C9A84C;           /* dorado: fondo de botón sobre oscuro + ornamentos */
--color-accent-text: #7f6418;      /* dorado como TEXTO sobre fondo claro: eyebrow (antes #8a6d20) */
--color-control-bg: var(--color-bg-over);
--color-control-border: rgba(0,0,0,.15);
--color-overlay-base: 27,42,56;    /* RGB suelto, para rgba() del overlay */
--color-error: #a3001d;            /* texto y borde de un error de formulario (>7:1 sobre --color-bg) */
--color-backdrop: rgba(15,20,25,.85);
```

**Convención de nombres** (la misma en cualquier proyecto que reutilice el tema):

| Patrón | Significado |
|---|---|
| `--color-<rol>` | El rol, nunca el nombre del color (`link`, `accent`, `text`) |
| `<algo>-text` | Color del TEXTO que va sobre ese fondo |
| `<algo>-inverse` | El mismo rol, resuelto para fondo oscuro |

**`--color-bg` vs `--color-bg-over`:** el primero es el fondo de la página
(blanco roto). El segundo es blanco puro, para elementos *elevados* que van
encima: cards, testimonios, team-cards, campos de formulario. Esa diferencia
sutil, junto con la sombra, es lo que hace que una card se perciba flotando sin
necesidad de un borde marcado.

#### 1.1.1 `--color-link` es el color de ACCIÓN, no solo de enlaces

Verde de marca. Se usa en:

| Dónde | Propiedad | Archivo |
|---|---|---|
| Enlaces dentro de `.prose` | `color` + subrayado | `main.css` (regla inicial) |
| `.card-link` ("Ver más") | `color` | `main.css` |
| `.team-card summary` | `color` | `main.css` |
| `.location-meta a`, `.locations-common-links a` | `color` | `main.css` |
| `.btn-fill` (fondo de botón relleno) | `--btn-bg` por defecto | `critical.css` |
| `.btn-outline` (texto y borde vía `currentColor`) | `color` | `critical.css` |
| Item activo del nav (`aria-current` / `.is-section`) | `color` + filete | `critical.css` |
| `--bg-color3` | alias | `critical.css` |

**Dos variantes de botón:** `.btn` es la base (forma, tamaño, transición) y
nunca se usa sola; encima va `.btn-fill` (relleno) o `.btn-outline` (contorno).
Tenerlas nombradas evita el `.btn:not(.btn-outline)` que arrastraban los
repintados por contexto.

**Sobre fondo oscuro no se usa.** El verde da 2.09:1 sobre navy y no contrasta
consigo mismo sobre `bg-color3`. Ahí entran `--color-link-inverse` (texto y
`btn-outline`, blanco: lo que distingue el enlace es el subrayado, no el color)
y `--color-accent` (fondo del botón primario, con filete blanco). El repintado
vive en una sola regla de `main.css`, la que agrupa
`.has-bg-image`, `.has-bg-color:not(.bg-claro)`, `.bg-color2` y `.bg-color3`.

**Contextos oscuros.** Los colores secundarios del texto (atenuado, subtítulo,
eyebrow) también se reasignan en una sola regla de `main.css`, que lista los
contextos oscuros: `.has-bg-image`, `.has-bg-color:not(.bg-claro)`,
`.bg-color2`, `.bg-color3`, `.block-variant-contrast` y `.block-counter`. Allí
cada rol pasa a su par `-inverse` (`--color-muted`, `--color-subtitle`,
`--color-eyebrow`), el mismo patrón que `text` y `link`. Los valores viven en
`:root` (`critical.css`); la regla de `main.css` solo reasigna. Los fondos siguen en pareja (`bg-colorN` + `bg-colorN-text`):
no hay un tercer token por fondo. Si un proyecto hace claro `--bg-color2` o
`--bg-color3`, tiene que sacarlos de esa lista.

**`--color-accent` vs `--color-accent-text`:** son dos tokens porque el dorado
hace dos trabajos incompatibles. Como **fondo de botón** necesita ser claro (para
que el texto oscuro encima se lea); como **texto** necesita ser oscuro (para
leerse sobre fondos claros). Un solo token no puede cumplir ambos — usar
`--color-accent` como color de texto fue un bug real en `.card-link` y en
`.btn-outline` (2.25:1 sobre crema).

**Contrastes medidos.** "Fondo" es `--color-bg` (#fffdf8, el lienzo) y "crema"
es `--bg-color1` (#f5efe5). No son el mismo color: la tabla anterior llamaba
"crema" al fondo, y así pasó el eyebrow a 4,28:1 sobre la crema real (QA oct
2026).

| Combinación | Ratio | Uso |
|---|---|---|
| `--color-link` sobre fondo / crema | 5.48:1 / 4.87:1 | Texto y botón: AA ✅ |
| Blanco sobre `--color-link` | 5.58:1 | Texto dentro del botón verde |
| `--color-accent` sobre fondo / crema | 2.25:1 / 2.0:1 | ❌ nunca como texto ni borde |
| `--color-accent-text` sobre fondo / crema | 5.53:1 / 4.91:1 | Eyebrow: AA ✅ |
| `--color-muted` sobre fondo / crema | 6.42:1 / 5.71:1 | Texto secundario: AA ✅ |
| `--color-muted-inverse` sobre navy / verde / `--color-dark` | 9.72:1 / 4.85:1 / 13.16:1 | Secundario en contextos oscuros: AA ✅ |
| `--bg-color4-text` sobre `--bg-color4` | 7.6:1 | `.btn-outline` sobre dorado (el verde daba 2.44:1) |
| `--color-text` sobre `--color-accent` | 7.6:1 | Texto dentro del botón dorado |
| `--color-accent` sobre `--bg-color2` | 5.09:1 | Botón dorado sobre navy |
| `--color-accent` sobre `--bg-color3` | 2.44:1 | Necesita el filete blanco |
| `--color-link` sobre `--bg-color2` | 2.09:1 | ❌ por eso existe el inverse |

### 1.2 Paleta de marca (pares fondo ↔ texto)

```css
--bg-color1: #f5efe5;               --bg-color1-text: var(--color-text);          /* crema  → texto oscuro */
--bg-color2: #1B3A5C;               --bg-color2-text: var(--color-text-inverse);  /* navy   → texto blanco */
--bg-color3: var(--color-link);     --bg-color3-text: var(--color-text-inverse);  /* verde  → texto blanco (5.58:1) */
--bg-color4: var(--color-accent);   --bg-color4-text: var(--color-text);          /* dorado → texto oscuro */
```

3 y 4 son **alias**, no hex repetidos: el mismo color cumple otro rol en el
sistema y no debe poder divergir.

Cada `--bg-colorN` va **siempre emparejado** con su `--bg-colorN-text`. La
relación es de *contención*: "si pinto la sección de este color, el texto que va
DENTRO es este otro".

**Regla no negociable:** si se repinta un `--bg-colorN`, hay que revisar su
`--bg-colorN-text` en la misma línea. CSS no puede calcular contraste de forma
fiable hoy (`color-contrast()` no tiene soporte real), así que el emparejamiento
es manual — por eso viven pegados en `:root`.

**Uso desde el contenido:**

```yaml
# Paleta: una sola clase, fondo y texto ya resueltos
- type: cta
  class: "bg-color2"

# Color puntual fuera de la paleta: bgColor + textColor a mano
- type: cta
  bgColor: "#eef7f4"
  textColor: "#1c1a17"
  class: "bg-claro"     # avisa a los botones de que el fondo es claro
```

### 1.3 Parámetros de fondo y color

Cuatro parámetros, disponibles en cta, banner y counter (los que aceptan imagen
de fondo). `bgColor`/`textColor`/`class` están además en el resto de bloques.

> **El hero no usa `bg`.** Su foto sale siempre de `hero.image`. La variante
> móvil, en el hero y aquí, se detecta igual: por convención `_m` (ver
> FRONTMATTER.md). `bgColor`, `textColor` y `class` sí funcionan igual en el hero.

| Parámetro | Qué hace |
|---|---|
| `bg` | Imagen de fondo. Si existe `foto_m.webp` junto al archivo, en móvil (<= 51.25em) se usa ese recorte; si existe `foto_hd.webp` / `foto_m_hd.webp`, se sirven en pantallas 2x. Nada de eso se declara. |
| `bgColor` | Color de fondo plano. Con `bg`, tiñe el overlay en vez de pintar el fondo. |
| `textColor` | Color del texto, a juego con un `bgColor` puntual. |
| `class` | Clases modificadoras (ver 1.3). |

`bgColor` y `textColor` se escriben **en hexadecimal** y son para colores fuera
de la paleta. Para los colores de marca no se usan: va `class: "bg-colorN"`, que
ya trae el par fondo+texto resuelto.

```yaml
# imagen de fondo; si existe 300-audicion_hero_m.webp, es el recorte móvil
- type: cta
  bg: "/images/300-audicion_hero.webp"

# imagen + tinte de color sobre el overlay
- type: cta
  bg: "/images/300-audicion_hero.webp"
  bgColor: "#1B3A5C"

# color plano puntual, fuera de paleta
- type: cta
  bgColor: "#eef7f4"
  textColor: "#1c1a17"
  class: "bg-claro"
```

### 1.3.1 Tokens del hero

En `:root` (`critical.css`). Los usan el hero `stacked` y el `overlay` apilado en móvil (`params.hero.mobileOverlay = false`, clase `is-stacked-mobile`).

| Token | Valor | Qué controla |
|---|---|---|
| `--hero-band-h` | `40vh`, y `40svh` si el navegador lo soporta | Alto de la banda de foto en móvil. No son los 70svh de banner/CTA (ver 3.1): header + breadcrumb ya ocupan ~120px y con 50svh el H1 de 4 líneas de un 359×640 quedaba en el filo del pliegue. En desktop manda `aspect-ratio: 3/1` (mín. 18rem, máx. 60svh). |
| `--hero-width` | `var(--container-wide)` | Ancho del contenido del bloque de texto en `stacked`. Un solo sitio para cambiarlo a `var(--container)`. |
| `--hero-band-max` | `1440px` | Ancho máximo de la banda de foto en `stacked` (el ancho nativo de las fotos del hero). Por encima la banda no crece y los laterales son el color del bloque (`bg-color2`). Va a la par con `$bandMax` en `hero-config.html`, que fija el `sizes`. |

**Por qué el tope de ancho.** Sin él la foto se amplía (×1.33 a 1920px, ×1.78 a 2560px) y además se recorta más: a 2560px solo se veía el 33% del alto frente al 44% a 1440px. Con el tope, el recorte es siempre el de 1440 y el borde de la foto coincide con el del H1.

**Por qué se queda el `max-height: 60svh` de la banda en desktop.** Con el ancho capado el `aspect-ratio 3/1` da como mucho 480px, pero en una ventana ancha y baja (proporción mayor de 1.8:1, p. ej. 1440×700) esos 480px son más del 60% del alto y sacan el H1 de la primera pantalla. Es una red de seguridad: en 1366×768 o 1920×1080 no interviene.

Padding superior del hero, por clase emitida por el partial: `hero-stacked` → 0 (la banda toca el header o el breadcrumb); `hero-split` / `hero-plain` → `clamp(2rem, 8vw, 7rem)`; `hero-overlay` → el `clamp(4rem, 8vw, 7rem)` base de `.hero`, salvo apilado en móvil (`is-stacked-mobile`) → 0, como `stacked`.

**Banda móvil y proporción del `_m`.** La banda mide `100vw × 40svh`, así que su proporción depende del teléfono: ~1.6:1 en 360×640, ~1.5:1 en 390×844 (Safari, con barras), ~1.35:1 en 412×915 (Chrome). En el emulador de DevTools `svh` es el alto entero de la pantalla, sin barras del navegador, y la banda sale más alta (~1.1–1.4:1) de lo que se verá en un móvil real. Por eso el `_m` se entrega en **3:2**: es el centro del rango real, y lo que `cover` recorta se queda por debajo del ~15% del total (a los lados en las bandas más altas, arriba y abajo en las más bajas). Un `_m` cuadrado pierde entre un 25 y un 40% del alto.

### 1.3.2 Tokens de la barra fija y el volver-arriba

En `:root` (`critical.css`). En móvil el botón volver-arriba es el **cuarto
elemento de la barra**: pegado a su esquina derecha, centrado en vertical y
dentro de ella. Sigue siendo un elemento aparte (`position: fixed`, no hijo de
la barra); en móvil (<= 51.25em) solo cambian sus coordenadas.

| Token | Valor | Qué controla |
|---|---|---|
| `--sticky-cta-h` | `0px`; `3.5rem` en móvil (<= 51.25em) | Alto de la barra. Lo leen la propia barra, el `padding-bottom` del `body` (para que no tape el footer) y el centrado vertical del botón. |
| `--back-to-top-size` | `2.75rem` | Lado del botón (44px, mínimo táctil). |
| `--back-to-top-gap` | `.5rem` | Margen del botón al borde derecho. Debe ser ≥ 6px (anillo de foco de 3px + 3px de offset), o el anillo se sale del viewport. |

La barra reserva el hueco con `padding-right = size + 2 × gap`, **siempre**,
también con el botón oculto: si se colapsara, los tres iconos se desplazarían
cada vez que se cruza el hero. Solo con `html.js` (sin JS el botón no se pinta
y el hueco no tendría sentido). Un filete vertical separa los tres CTAs
(contacto) del botón (navegación).

El `safe-area-inset-bottom` (el notch) no entra en `--sticky-cta-h`: se suma
aparte en cada regla, para que el token siga significando «lo que mide la
barra». **No añadir `viewport-fit=cover` a la meta viewport:** sin él iOS
excluye las áreas seguras y un `fixed; bottom: 0` ya queda sobre el indicador
de inicio, así que esos `env()` valen 0 y son código muerto inofensivo, dejado
a propósito. Con `cover` cambiaría el render del sitio entero en esos
dispositivos sin ganar nada.

### 1.4 Clases modificadoras (`class:`)

**Legibilidad sobre imagen** — las fotos reales no son predecibles; estas clases
son las palancas para que el texto se lea sin cambiar la foto:

| Clase | Efecto | Cuándo |
|---|---|---|
| `scrim` | Degradado direccional sobre el lado del texto. | Preserva la foto donde no hay copy. La opción menos invasiva. |
| `overlay-strong` | Sube el overlay del 55% al 75%. | Fotos claras donde el overlay normal no basta. |
| `panel` | Caja semiopaca con desenfoque tras el texto. | La más segura en fotos imprevisibles: garantiza contraste pase lo que pase. |

**Encuadre:**

| Clase | Efecto |
|---|---|
| `bg-top` | `background-position:top center` — evita que un recorte alto corte cabezas o rótulos. Para `background-image` (cta, banner, counter). El hero no usa `background-image` en ningún layout: su encuadre va por `hero.imagePosition`. |

**Contraste de fondo claro:**

`bg-claro` marca que un `bgColor` **puntual** es claro. Desde que existe
`textColor`, ya no hace falta para el color del texto — pero **sigue siendo
necesaria para los botones**: sin ella el tema asume fondo oscuro y pinta el
`.btn-outline` en blanco, invisible sobre un fondo claro. También corrige el
subtítulo del `cta-layout-split`.

No se usa junto a las clases `bg-colorN`: ésas ya traen su tratamiento de
botones resuelto.

### 1.5 Criterio de contraste

Objetivo del proyecto: **WCAG AA** — 4.5:1 texto normal, 3:1 texto grande.
Público 45-75+, así que se cumple con margen, no al límite.

Al elegir o cambiar cualquier color, comprobar **dos cosas distintas**:

1. **Legibilidad**: el texto *dentro* de un elemento contra su propio fondo.
2. **Contraste de forma**: el elemento (un botón) contra el fondo de la sección
   donde vive. Un botón puede tener el texto perfectamente legible y aun así
   "disolverse" en el fondo como objeto. No lo cubre WCAG AA para texto, pero
   afecta igual a la usabilidad.

Para el segundo caso el tema ya aplica un filete al botón primario cuando cae
sobre fondo oscuro o imagen.

---

## 2. Tipografía

### 2.1 Base

```css
body { font-size: clamp(1.125rem, 0.25vw + 1.09375rem, 1.25rem); }
```

Va en `body`, **no en `html`**, y es deliberado: `rem` sólo mira a `html`, así
que los headings (en `rem`) quedan fijos mientras el cuerpo de texto escala. Si
se moviera a `html`, los titulares se amplificarían de golpe.

**En `rem`, no en `px`** (oct 2026). Con la letra por defecto del navegador
(16px) da exactamente 18-20px, igual que antes; con otra, crece en la misma
proporción. En `px` el texto ignoraba la preferencia de «letra grande» del
usuario, que en un público de 45-75+ años no es un caso raro. El suelo de 18px
cumple el requisito de legibilidad del proyecto (ap8.1) con la letra por defecto.

**Letra grande: qué se midió y qué se arregló.** Con la letra por defecto del
navegador a 20px (125%) y 24px (150%), en 28 páginas y anchos de 320 a 1440:
- Los breakpoints van en `em` (ver 3), así que el layout cambia cuando el texto
  deja de caber. Con `px`, el nav de escritorio a 840-880px y los botones con
  texto desde 1100px ya comprimían el logo a menos de 190px.
- La cabecera usa un ancho en `rem` (`70rem` = `--container` a 16px): su contenido
  crece con la letra, su caja también.
- Un botón del contenido (`main .btn`) parte su etiqueta en dos líneas si no cabe
  en la fila. Con 16px también arreglaba el home a 320px: «Ver soluciones de
  audición» medía 322px en una columna de 288 y se salía de la pantalla.
- Residuo conocido y **decidido**: a 150% y 320px, una palabra larga de un H1 se
  parte a mitad de palabra (`overflow-wrap: anywhere`, sin guion) en vez de
  desbordar. No se usa `hyphens: auto` en titulares: el guion ocupa ancho justo
  donde menos sobra, y en un titular grande cuesta más que el corte.

Cómo reproducirlo: sección «Probar con otra letra por defecto» de la skill
`visual-qa`.

### 2.2 Dos sistemas paralelos, no mezclar

**`fs-*` — utilidades para prose (body markdown).** Se aplican con attributes de
Goldmark:

```markdown
## Un H2 más discreto {.fs-s}
```

```css
.fs-xs{font-size:.75em}  .fs-s{font-size:.875em}
.fs-l{font-size:1.25em}  .fs-xl{font-size:1.5em}
```

Son **escala absoluta**, no moduladores relativos: `fs-s` da el mismo tamaño en
un `<p>` que en un `<h2>`, porque `em` se calcula contra el padre heredado, no
contra el tamaño que tendría el elemento. Por eso los headings tienen su propia
rama:

```css
h2.fs-s  { font-size: 1.5rem;  }   /* ~24px — bajo el H2 normal (28px) */
h2.fs-xs { font-size: 1.25rem; }   /* ~20px */
```

Van en `rem` (fuente única de verdad, `html`) y con selector `tipo.clase`
`(0,1,1)`, que gana siempre a la regla base sin depender del orden del archivo.

> **Sintaxis de los attributes:** funcionan en headings, párrafos y listas
> (verificado con build), pero el atributo va **en la línea siguiente** al
> bloque, no al final de la misma línea:
>
> ```markdown
> Un párrafo destacado, más grande que el resto.
> {.fs-xl}
> ```
>
> Para dar tamaño a *parte* de un párrafo, no al bloque entero, usar
> `<span class="fs-s">` inline — funciona porque `unsafe = true` está activado.

**`block-text-*` — generadas por el parámetro `textSize` de los bloques:**

```css
.block-text-xs{font-size:.8em}   .block-text-s{font-size:.875em}
.block-text-m{font-size:1em}     .block-text-l{font-size:1.15em}
.block-text-xl{font-size:1.6em}
```

Escala canónica: `xs | s | m | l | xl`. **`textSize` no admite alias** (nada de
"small"/"large"); `pad` sí los mantiene.

### 2.3 Especificidad — el error recurrente

Una regla que apunte al tipo de elemento (`.prose>h2`, `(0,1,1)`) gana a una
utilidad de clase suelta (`.fs-s`, `(0,1,0)`) **sin importar el orden en el
archivo**. Solución adoptada: neutralizar la especificidad del tipo con
`:where()`, que no suma peso:

```css
:where(.block .container>h2:first-child),.prose>:where(h2){font-size:1.75rem}
```

Y cuando dos reglas empatan en especificidad, gana **la última del archivo** —
por eso `.block-banner{padding}` tuvo que moverse *antes* de los modificadores
`.block-pad-*`, o pisaba siempre al parámetro `pad`.

---

## 3. Espaciado y medidas

```css
--container-narrow: 860px;  --container: 1120px;        --container-wide: 1440px;
--space-s: clamp(1rem,2vw,1.5rem);
--space-m: clamp(2rem,4vw,3rem);
--space-l: clamp(3rem,7vw,5rem);
--block-pad: clamp(3rem,7vw,6rem);
--block-pad-compact: clamp(1.75rem,4vw,3rem);
--block-pad-spacious: clamp(4rem,9vw,8rem);
--fs-highlight: clamp(1.52em,2.7vw,1.8em);
--radius: 18px;
--measure-col: 32em;        /* medida de lectura de una columna de texto, ver 3.5 */
```

**Breakpoint único: `51.25em`** (820px con la letra por defecto de 16px). Es la
frontera "apilado ↔ dos columnas" en todo el tema: escritorio es
`@media (width > 51.25em)` y móvil `@media (width <= 51.25em)`, complementarios
sin hueco. No introducir otros: tener componentes que cambian de layout antes
que el resto crea zonas intermedias inconsistentes y difíciles de recordar.

Dos cortes más, solo de la cabecera (medidos, ver `visual-qa`): `24.5em` (392px;
`width > 24.5em` muestra WhatsApp en la cabecera móvil) y `68.75em` (1100px;
`width >= 68.75em` da texto a los botones del header).

**Por qué `em` y por qué `>`**
- **`em` en una media query vale siempre el tamaño de letra por defecto del
  navegador** (no el de `html` ni el de `body`). 51.25em son 820px con 16px y
  1025px con 20px: el layout cambia de modo cuando el texto ocupa más. Es lo que
  hacen Bootstrap y Foundation.
- **`>` (y no `>=`) en el de escritorio:** «más ancho que 820px». Deja el iPad
  vertical (820) en móvil y evita el hueco entre `max-width: 820px` y
  `min-width: 821px` a anchos fraccionarios (zoom).
- **Sintaxis de rango** (`width > 51.25em`): Baseline desde 2023, *widely
  available* desde sept 2025. Safari/iOS < 16.4 no la entiende, así que cada
  consulta lleva un **respaldo** con la sintaxis antigua (ver «Respaldo y
  equivalencias» más abajo).
- **Mismo número en todas partes que mire el layout:** CSS, `<source media>` de
  `img-responsive.html`, `media` del preload del hero, `sizes` de las imágenes y
  `matchMedia` en `main.js`. Los `sizes` que describen un tope en px del hueco
  (`(min-width:1440px) 1440px` de la banda del hero) se quedan en px: no
  dependen de la letra.

### Respaldo y equivalencias

Cada consulta de ancho lleva, detrás de una coma, la versión antigua:

```css
@media (width > 51.25em), (min-width: 51.3125em) { /* escritorio: > 820px */
@media (width <= 51.25em), (max-width: 51.25em) { /* movil: <= 820px */
```

La coma es «o» y es sintaxis de siempre. Un navegador nuevo cumple la primera; uno
sin sintaxis de rango la descarta como inválida y decide la segunda (no se usa la
palabra `or`: también es nivel 4 y un Safari antiguo descartaría la consulta
entera). El respaldo va en `em`, no en `px`, para que en esos navegadores el
breakpoint también siga a la letra. Lo llevan el CSS, el `matchMedia` de `main.js`,
los `<source media>` y el `media` del preload.

| Con letra de 16px | Escritorio / «más de» | Móvil / «hasta» | Respaldo |
|---|---|---|---|
| `51.25em` = **820px** | `width > 51.25em` | `width <= 51.25em` | `min-width: 51.3125em` (821px) / `max-width: 51.25em` |
| `68.75em` = **1100px** (botones con texto) | `width >= 68.75em` | — | `min-width: 68.75em` |
| `24.5em` = **392px** (WhatsApp en la cabecera móvil) | `width > 24.5em` | — | `min-width: 24.5625em` (393px) |

Los `sizes` **no** llevan respaldo (una lista de `sizes` no admite listas de
consultas por entrada, y duplicarlas no compensa): son una pista, no layout. En un
Safari < 16.4 la entrada se descarta y el navegador asume `100vw`, es decir, baja el
candidato mayor (`_hd`). Efecto lateral: si base y `_hd` tienen distinta proporción,
la imagen cambia de alto según el archivo elegido. Hoy son 5 parejas
(`100-atencion_personalizada`, `226-infantil`, `215-vision_40` y dos de
`100-instalaciones_*`, estas últimas dentro de la galería, que fuerza 4:3).

**Cuando Safari < 16.4 deje de importar**, quitar el respaldo es una línea
(probado: el resultado es idéntico en 28 páginas × 6 anchos):

```bash
cd themes/f1-theme
sed -i -E 's/, \((min|max)-width: [0-9.]+em\)//g' \
  assets/css/critical.css assets/css/main.css assets/js/main.js \
  layouts/partials/hero-preload.html layouts/partials/img-responsive.html
```

El patrón solo toca respaldos en `em`: los `sizes` con `(min-width:1100px)` en px no
coinciden. Los comentarios `/* escritorio: > 820px */` se pueden dejar.

### 3.1 Separación vs presencia

Son dos conceptos distintos, y el sistema los trata distinto:

- **Separación** (`--block-pad-*`, vía parámetro `pad`): aire para que el bloque
  respire. Escala **ascendente** con el viewport — más espacio disponible en
  desktop, más padding.
- **Presencia** (`min-height`, sólo en bloques con `bg`): superficie para que la
  imagen se lea como escena y no como una tira. Escala **descendente**: 70svh en
  móvil, 420px en desktop. En móvil el ancho es corto y la altura tiene que
  hacer todo el trabajo; en desktop el ancho ya da presencia por sí solo.

Usar `pad` para conseguir presencia no funciona: son palancas distintas.

```css
.block-banner.has-bg-image,
.block-cta.has-bg-image{min-height:70vh;min-height:70svh;display:grid;place-items:center}
```

El doble `min-height` es un fallback deliberado: `svh` (que mide el viewport con
la barra del navegador visible, evitando saltos al hacer scroll) no llega al ~6%
de navegadores antiguos — sobre todo Samsung Internet viejo, frecuente en el
público objetivo. Sin fallback, esos navegadores descartarían la declaración
entera y el bloque colapsaría.

### 3.2 Imágrenes con Breakout en móvil

Un bloque insertado en el body markdown vive dentro de `.container.prose`, que
ya recorta `calc(100% - 2rem)`. Quitarle su propio margen **no basta**: hay que
romper el contenedor padre.

```css
@media (width <= 51.25em){
  .block-banner.has-bg-image,
  .block-cta.has-bg-image,
  .block-image-text{width:100vw;margin-left:calc(50% - 50vw);max-width:none}
}
```

Sólo en móvil, por dos motivos: en desktop estirar la foto a ancho completo
exigiría originales de 2880px+ (retina) con el peso que eso implica, y el texto
quedaría perdido en el centro de una franja enorme. `html{overflow-x:clip}`
—ya presente— evita el scroll horizontal que suele traer `100vw`.

---

### 3.3 Mostrar u ocultar según el ancho

Dos utilidades, en `critical.css`, con el breakpoint general del tema (`51.25em`):

| Clase | Hasta 51.25em (móvil) | Por encima (escritorio) |
|---|---|---|
| `.solo-movil` | visible | oculto |
| `.solo-escritorio` | oculto | visible |

En plantillas: `class="cf-urgente solo-escritorio"`. En markdown, con el attribute de Goldmark:

```markdown
Llámanos y te atendemos al momento. {.solo-movil}
```

**Solo ocultan, nunca muestran.** Volver a mostrar exigiría conocer el `display` de cada
elemento, y `display: revert` lo devuelve al del navegador y rompe cualquier flex o grid. Con la
sintaxis de rango, «móvil» y «escritorio» son `width <= 51.25em` y `width > 51.25em`:
el mismo número, complementarios (antes `not all and (min-width: 821px)`, por soporte
universal; ahora los navegadores sin sintaxis de rango muestran las dos versiones). Llevan `!important` porque su trabajo es ganar a la
regla del componente sin depender del orden de carga.

**Cuándo NO usarlas:** un componente que se reorganiza por ancho oculta sus piezas en su propio
bloque (barra fija, cabecera). Y `display: none` también lo oculta a los lectores de pantalla:
para texto accesible que no se ve, el patrón es `.btn-label`.

### 3.4 Espaciados: `rem` para el ritmo, `em` para el interior

`textSize` (`xs`…`xl`) pone el `font-size` de la `<section>` entre 0,8 y 1,6 veces el
del cuerpo. Todo lo que va en `em` dentro del bloque lo sigue; lo que va en `rem`, no.
De ahí el reparto:

**Va en `rem` (el ritmo de la página):**
- `--block-pad*` y `.section` (padding de sección) y el margen entre bloques del prose (`.prose .block`).
- Márgenes laterales del contenedor y `block-width-*`.
- Cabecera, nav, breadcrumb, footer (incluido `.hours`) y barra fija.
- Formulario (`.cf-*`) y botones (`.btn`): no son bloques con `textSize`.
- Los tokens `--space-s/m/l` (padding del item de `text-split`, altura de `spacer`).

**Va en `em` (el interior del bloque):**
- Huecos de rejillas: `.cards-grid`, `.gallery-grid`, `.logo-grid`, `.locations-grid`,
  `.text-split-inner`, `.image-text-inner`, `.counter-grid`, `.trustbar-inner`, `.slider-track`.
- Padding de tarjetas, testimonios, equipo, FAQ, slides y paneles (`.panel`).
- Márgenes entre titular, texto, pie y enlaces (`.cta-*`, `.location-*`,
  `.team-card details`, `.image-text-caption`…).

**Calibrado.** El `1em` de un bloque en `textSize: m` es el tamaño del cuerpo
(18-20px según el ancho), no 16px: pasar `1rem` a `1em` ensancharía todo un 12-25%.
Por eso cada espaciado se escribe ×0,85 respecto al `rem` que sustituye (`1rem` →
`.85em`, `1.5rem` → `1.25em`, `2rem` → `1.65em`), a pasos de `.05em`. Un elemento con
letra propia (el eyebrow del CTA, el `h3` de una ubicación, un pie de foto) se
calcula contra **su** tamaño, no contra el del bloque. Los `clamp(…, 4vw, …)`
conservan el `vw` central: solo se convierten los extremos.

**Medido** (Playwright, antes y después, 168 combinaciones página × ancho):
- Con `textSize: m`, cada espaciado en píxeles queda entre −5% y +6% del anterior;
  la altura de las páginas varía de media un 0,18% (máximo 0,83%). Cabecera y footer, sin cambio.
- Con `xs`…`xl`, la relación espaciado/letra es constante (hueco de rejilla 1,25×,
  padding de FAQ 0,85×); antes era un valor fijo en px. El ritmo entre bloques sigue
  en 96px para los cinco tamaños.
- Los `clamp` con `vw` limitan el crecimiento en `l`/`xl` en pantallas grandes.

**Para un espaciado nuevo:** si separa un bloque de otro, `rem`; si está dentro de un
bloque, `em` (×0,85 del `rem` que habrías escrito).

### 3.5 Medida de lectura: `--measure-col` (oct 2026)

`--measure-col: 32em` es el ancho máximo de una **columna** de texto en los bloques de
dos columnas: `image-text` y `text-split`. Son unos 66-70 caracteres reales por línea.

**En `em`, no en `ch`.** Con `system-ui`, `1ch` (el ancho del «0») vale ~0,63em, y la
letra media de un texto en castellano ~0,46-0,49em. El `72ch` de `.prose>p` son por
tanto ~92 caracteres, no 72. Medido a 20px: 32em = 640px = 58-68 caracteres por línea
con Inter (Linux, macOS parecido; ~66 de media) y ~70 con Segoe UI (Windows, ~5% más
estrecha; dato de Foco, 75 frente a 71 caracteres en la misma columna de 687px).

**Por qué 32em y no otro valor** (comparado por Foco en `/nosotros/`, bloque «El equipo
que te conoce», a 1745px CSS = 1920 al 110%): con **30em** el titular iba en tres líneas
y el texto quedaba muy por encima de la foto (827 frente a 625px de alto): se leía
estrecho. **32em**: titular en dos líneas, ~70 caracteres en Segoe, lo que Foco había
elegido a ojo al principio. Desde **34em** el bloque ya no baja de altura (688px con 34 y
con 36) y solo se alargan las líneas, hacia las ~77 que Foco descartó por largas. Al ir en `em`, la medida en
caracteres no cambia con `textSize`: con `l`/`xl` el tope crece con la letra y en la
práctica deja de actuar.

**image-text: el tope va en la columna, no en el párrafo.** Un `max-width` en el `<p>`
deja un hueco entre texto y foto. La plantilla es
`min(var(--measure-col), (100% - var(--it-gap)) / 2)` para el texto y `1fr` para la
imagen. Hasta que la mitad del espacio llega a 32em, eso equivale a `1fr 1fr`; a partir
de ahí el texto se queda en 640px y la imagen se lleva todo el ancho extra. **Sin punto
de corte nuevo**: el cambio es continuo. Una primera versión con breakpoint a 80em
hacía saltar la columna de 65 a 52 caracteres en 20px de ventana.

| Bloque | Texto | Imagen | Desde |
|---|---|---|---|
| `default` | ~510px (no llega al tope) | ~510px | nunca actúa |
| `wide` | 640px | 701px a 1440, 733px desde 1472 | ~1380px |
| `full` | 640px | 765px a 1600, 1059px a 1920, 1693px a 2560 | ~1465px |

Antes, a 1:1: `wide` 671-687px de texto (64-71 car.), `full` 850px a 1920 (89 car.) y
1167px a 2560 (95 car.). `--it-gap` es el mismo `gap` de escritorio con nombre, para
poder restarlo en la plantilla.

**text-split: el tope va en el texto.** La rejilla es simétrica por diseño, así que aquí
el `max-width` va en `p`/`ul`/`ol` de la columna, centrado o a la derecha según el
`align` del item. Solo en escritorio: en una columna, el texto sigue la regla de
cualquier prosa (sin esto, `/nosotros/` crecía 63px a 820). La cita (`is-quote`)
conserva su `36ch`.

**`sizes`:** los cortes de `sizes` de `image-text` (86/92em en `wide`, 91.5/125em en
`full`) no son breakpoints de layout: describen dónde cambia la fórmula del ancho de la
imagen. Ver `blocks/image-text.html` y GUIA-IMAGENES.md.

## 4. Imágenes responsive

Convención: `foto.webp` (1x) + `foto_hd.webp` (2x, doble de ancho).
La variante `_hd` es **siempre opcional** — si no existe, se sirve la normal sin
error.

- **`<img>` reales** → `partials/img-responsive.html`. Lee el ancho real del
  archivo con `images.Config` (no hay que declararlo), genera `srcset` con
  descriptor `w` + `sizes` para que el navegador elija según tamaño de
  renderizado **y** densidad. Conectado en: cards, team, gallery, slider,
  testimonials, brands-logos, image-text, hero (los tres layouts).
- **`background-image`** → `partials/img-bg-style.html` (antes
  `bg-image-style.html`). Genera `image-set()`
  con descriptor `1x`/`2x` (sólo densidad: no existe equivalente CSS a `sizes`).
  Usado en cta, banner y counter, que se quedan en `background-image` a propósito para
  conservar la opción de `background-attachment:fixed`, que no existe para
  `<img>`.

Ambos comprueban existencia con `os.FileExists` sobre la **ruta física**
(`static/images/...`, no la URL pública) e ignoran URLs externas.

> Sin la guarda de extensión, `path.Ext` sobre una URL sin extensión devuelve
> cadena vacía y `replace` inserta `_hd` al principio de la URL entera — crashea
> el build en Windows. La guarda no es opcional.

En `url()` **no se usan comillas**: son opcionales en CSS y evitan que el paso
por `delimit`/`safeCSS` las escape a `&#39;`.

---

## 5. Añadir un token nuevo

1. Definirlo en `:root` de `critical.css`, junto a su familia.
2. Si es un color de fondo de marca, crear **a la vez** su pareja de texto.
3. Verificar contraste antes de usarlo (ver 1.5).
4. Documentarlo aquí.
5. Añadir un ejemplo en `content/demo/_index.md` — nunca duplicar el que ya
   exista, extenderlo.

