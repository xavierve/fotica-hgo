# F1 Theme · Design Tokens

Todos los tokens viven en `:root`, dentro de `assets/css/critical.css`.
Nada de color, tamaño o espaciado se escribe a pelo en el CSS del tema: si un
valor se repite o puede cambiar, es un token.

Este documento cubre lo que ya está **estable**. No documenta el hero (su
arquitectura va a cambiar — ver tarea 8 en `CLAUDE.md`) ni los espaciados
internos en `em` (pendientes).

---

## ⚠️ Restricción de marca

> **El logo es del cliente y no se toca.** El color definido es el `#34830b` (verde)
> SVG original (`static/images/logo-fausto-animado-color.svg`)
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
--color-muted: #625d55;            /* texto secundario: captions, ayudas */
--color-dark: #25211d;             /* negro suavizado */
--color-bg: #fffdf8;               /* fondo del LIENZO (body), blanco roto */
--color-bg-over: #fff;             /* fondo de lo que va ENCIMA: cards, controles */
--color-accent: #C9A84C;           /* FONDO de botón primario */
--color-accent-text: #8a6d20;      /* TEXTO de enlaces/acento */
--color-control-bg: var(--color-bg-over);
--color-control-border: rgba(0,0,0,.15);
--color-overlay-base: 27,42,56;    /* RGB suelto, para rgba() del overlay */
--color-backdrop: rgba(15,20,25,.85);
```

**`--color-bg` vs `--color-bg-over`:** el primero es el fondo de la página
(blanco roto). El segundo es blanco puro, para elementos *elevados* que van
encima: cards, testimonios, team-cards, campos de formulario. Esa diferencia
sutil, junto con la sombra, es lo que hace que una card se perciba flotando sin
necesidad de un borde marcado.

**`--color-accent` vs `--color-accent-text`:** son dos tokens porque el acento
hace dos trabajos incompatibles. Como **fondo de botón** necesita ser claro (para
que el texto oscuro encima se lea); como **texto de enlace** necesita ser oscuro
(para leerse sobre fondos claros). Un solo token no puede cumplir ambos — usar
`--color-accent` como color de texto fue un bug real en `.card-link`.

### 1.2 Paleta de marca (pares fondo ↔ texto)

```css
--bg-color1: #f5efe5;  --bg-text-color1: #1c1a17;   /* crema  → texto oscuro */
--bg-color2: #1B3A5C;  --bg-text-color2: #ffffff;   /* navy   → texto blanco */
--bg-color3: #34855B;  --bg-text-color3: #ffffff;   /* verde  → texto blanco */
--bg-color4: #C9A84C;  --bg-text-color4: #1c1a17;   /* dorado → texto oscuro */
```

Cada `--bg-colorN` va **siempre emparejado** con su `--bg-text-colorN`. La
relación es de *contención*: "si pinto la sección de este color, el texto que va
DENTRO es este otro".

**Regla no negociable:** si se repinta un `--bg-colorN`, hay que revisar su
`--bg-text-colorN` en la misma línea. CSS no puede calcular contraste de forma
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

Cinco parámetros, disponibles en hero, cta y banner (los que aceptan imagen de
fondo). `bgColor`/`textColor`/`class` están además en el resto de bloques.

| Parámetro | Qué hace |
|---|---|
| `bg` | Imagen de fondo (desktop, y móvil si no hay `bgMobile`). |
| `bgMobile` | Imagen de fondo sólo en móvil — recorte distinto, no sólo tamaño. |
| `bgColor` | Color de fondo plano. Con `bg`, tiñe el overlay en vez de pintar el fondo. |
| `textColor` | Color del texto, a juego con un `bgColor` puntual. |
| `class` | Clases modificadoras (ver 1.3). |

`bgColor` y `textColor` se escriben **en hexadecimal** y son para colores fuera
de la paleta. Para los colores de marca no se usan: va `class: "bg-colorN"`, que
ya trae el par fondo+texto resuelto.

```yaml
# imagen de fondo, con recorte propio para móvil
- type: cta
  bg: "/images/300-audicion_hero.webp"
  bgMobile: "/images/300-audicion_hero_m.webp"

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
| `bg-top` | `background-position:top center` — evita que un recorte alto corte cabezas o rótulos. En uso en el hero de Nosotros. |

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
body { font-size: clamp(18px, 0.25vw + 17.5px, 20px); }
```

Va en `body`, **no en `html`**, y es deliberado: `rem` sólo mira a `html`, así
que los headings (en `rem`) quedan fijos mientras el cuerpo de texto escala. Si
se moviera a `html`, los titulares se amplificarían de golpe.

El suelo de 18px cumple el requisito de legibilidad del proyecto (ap8.1).

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
--container: 1120px;        --container-wide: 1440px;
--space-s: clamp(1rem,2vw,1.5rem);
--space-m: clamp(2rem,4vw,3rem);
--space-l: clamp(3rem,7vw,5rem);
--block-pad: clamp(3rem,7vw,6rem);
--block-pad-compact: clamp(1.75rem,4vw,3rem);
--block-pad-spacious: clamp(4rem,9vw,8rem);
--fs-highlight: clamp(1.52em,2.7vw,1.8em);
--radius: 18px;
```

**Breakpoint único: `821px`** (`min-width:821px` / `max-width:820px`). Es la
frontera "apilado ↔ dos columnas" en todo el tema. No introducir otros: tener
componentes que cambian de layout antes que el resto crea zonas intermedias
inconsistentes y difíciles de recordar.

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
@media(max-width:820px){
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

## 4. Imágenes responsive

Convención: `foto.webp` (1x) + `foto_hd.webp` (2x, doble de ancho).
La variante `_hd` es **siempre opcional** — si no existe, se sirve la normal sin
error.

- **`<img>` reales** → `partials/responsive-img.html`. Lee el ancho real del
  archivo con `images.Config` (no hay que declararlo), genera `srcset` con
  descriptor `w` + `sizes` para que el navegador elija según tamaño de
  renderizado **y** densidad. Conectado en: cards, team, gallery, slider,
  testimonials, brands-logos, image-text, hero (modo split).
- **`background-image`** → `partials/bg-image-style.html`. Genera `image-set()`
  con descriptor `1x`/`2x` (sólo densidad: no existe equivalente CSS a `sizes`).
  Usado en banner y cta, que se quedan en `background-image` a propósito para
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

