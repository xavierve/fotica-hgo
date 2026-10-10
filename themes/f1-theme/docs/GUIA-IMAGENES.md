# Guía de imágenes — Ópticas Fausto
*Medidas, recorte y entrega de fotografías. Verificada contra el repo.*

---

## Tabla de formatos

> **Las proporciones marcadas en negrita las fuerza el CSS** con
> `aspect-ratio` + `object-fit:cover`: si el archivo llega con otra
> proporción, el navegador recorta y se pierde lo que sobre. Entregar ya en
> la proporción correcta evita sorpresas. Verificado en `main.css`:
> `.card img` → 4/3 · `.team-card img` → 1/1 · `.gallery-open img` → 4/3.
> Ningún otro bloque fuerza proporción.


| Uso | Clave front matter | Base | `_hd` (2x) | Proporción | Formato |
|---|---|---|---|---|---|
| **Hero** (los tres layouts) | `hero.image` | 1440×960 | `_hd` 1920×1280 *(solo cámara)* | 3:2 | WebP |
| **Hero móvil** | *(sin clave: `_m` por convención)* | 768×512 | `_m_hd` 1536×1024 | 3:2 | WebP |
| **OG / Social** | `og.image` | 1200×630 | — | 1.91:1 | **JPG** |
| **Cards** | `card.image` | **800×600** | 1600×1200 | **4:3** | WebP |
| **Equipo** | `team.items[].image` | **750×750** | 1500×1500 | **1:1 cuadrado** | WebP |
| **Galería** | `gallery.items[].image` | 1200×900 | 2400×1800 | **4:3** | WebP |
| **image-text** | en el shortcode | **700 ancho** | 1400 *(`full`: 2000-2200 si hay original)* | libre | WebP |
| **Imagen suelta en el prose** | shortcode `figure` | **800 ancho** | hasta 2240 *(el original, sin ampliar)* | libre | WebP |
| **Slider** | `slider.items[].image` | **780 ancho** | — | libre | WebP |
| **Logos de marca** | `items[].image` (bloque `brands-logos`) | **320×160** | 640×320 | **2:1** | **SVG** o WebP con transparencia |

> **Logos de marca.** Todos en el mismo lienzo 2:1 (320×160), fondo
> transparente, logo centrado y dentro de una zona segura de ~80% del ancho y
> ~70% del alto. Así un logo apaisado y uno cuadrado pesan lo mismo en la
> rejilla: el CSS los muestra en una caja 2:1 de 160×80 como máximo con
> `object-fit: contain`, y un archivo en otra proporción no se deforma, pero
> queda más pequeño. Mejor SVG (no necesita `_hd`); en WebP, `_hd` a 640×320
> solo si el logo tiene detalle fino. Los logos son marcas registradas: usar
> los que facilite el fabricante o el distribuidor, no capturas de su web.

> **Hero móvil (`_m`).** La banda móvil es `100vw × 40svh` en `stacked` y en
> `overlay` apilado, con `object-fit: cover`: el CSS no fuerza una proporción,
> la proporción la pone el teléfono (~1.35:1 a ~1.7:1 en navegadores reales).
> 3:2 es el centro de ese rango; dejar el sujeto y lo que importe (en 3.2.1, la
> mano con el audífono) dentro del 85% central. Detalle en DESIGN_TOKENS.md,
> 1.3.1. La fila anterior decía 768×420 con 3:2, que no cuadraba: 768×420 es
> 1.83:1.

> El prefijo `100-` agrupa cosas distintas: solo las `100-equipo_<nombre>` son
> fichas de equipo. `100-equipo_fausto_completo` es el hero de la home y las
> `100-instalaciones_*` son galería — esas siguen las medidas de su propio
> tipo, no las de equipo.

---

## De dónde salen estos números

Cada bloque del theme declara un `sizes` que dice **a qué ancho se muestra
realmente** la imagen. Ancho mostrado × densidad de pantalla = ancho de
archivo necesario. No son cifras redondas elegidas a ojo.

| Bloque | `sizes` del theme | Se muestra a | DPR2 | DPR3 |
|---|---|---|---|---|
| Hero (stacked) | `(min-width:1440px) 1440px, 100vw` | hasta 1440px (banda con tope) | 2880px | — |
| Cards / Equipo | `(min-width:1100px) 33vw, (min-width:600px) 50vw, 100vw` | ~370px desktop · ~400px móvil | ~740px | ~1200px |
| image-text | por `width` (ver abajo; `blocks/image-text.html`) | 510px (`default`) · hasta 773px (`wide`) · hasta 1099px a 1920 (`full`) | ~1020-2200px | — |
| Hero split (Home) | `(min-width:1440px) 620px, (width > 51.25em) 45vw, 100vw` | ~475px (columna `.9fr`) | ~950px | — |
| Imagen del prose (`figure`) | `(width > 72em) 1120px, calc(100vw - 2rem)` | 343px (móvil 375) · 1120px (escritorio) | ~690px · 2240px | ~1075px |
| Slider | `min(80vw, 420px)` | 388px (420 − 32 de padding) | ~776px | — |
| Logos | `160px` | 160px | 320px | — |
| Avatar testimonio | `56px` | 56px | 112px | — |

**image-text no ocupa el ancho del contenedor, y desde oct 2026 tampoco la
mitad exacta.** Son dos columnas con un `gap` de hasta 67px. La de texto se
para en la medida de lectura (`--measure-col`, 600px con la letra de 20px) y
la imagen se lleva todo el ancho que sobre (DESIGN_TOKENS.md, 3.5). Hasta que
la mitad del espacio llega a 600px, las dos columnas siguen siendo iguales.
Medido con Playwright (oct 2026):

| `width` del bloque | Contenedor | Imagen | DPR2 necesita |
|---|---|---|---|
| `default` | 1120px | **~510px** (no cambia: el texto no llega a 600) | ~1020px |
| `wide` | 1440px | 592px a 1280 · **741px** a 1440 · **773px** desde 1472 | ~1550px |
| `full` | ventana − 4vw por lado | 557px a 1280 · 658px a 1440 · **1099px** a 1920 · 1733px a 2560 | ~2200px a 1920 |

`sizes` del partial, por `width` (solo media queries y `calc()`; `min()`/`max()`
dentro de `sizes` no tienen el mismo soporte en todos los navegadores):

- `default`: `(width > 51.25em) 50vw, 100vw` (sobrestima: pide ~720px donde se pintan ~510)
- `wide`: `(width > 92em) 775px, (width > 81em) calc(100vw - 43.5rem), (width > 51.25em) 50vw, 100vw`
- `full`: `(width > 125em) calc(100vw - 52rem), (width > 86em) calc(92vw - 41.5rem), (width > 51.25em) 50vw, 100vw`

Con **700 de ancho base y 1400 en `_hd`**: `default` queda cubierto también a
DPR2. En `wide`, DPR1 siempre, y DPR2 se queda un ~10% corto en pantallas
grandes (1400 para 1550): aceptable. **En `full`**, a 1920 con DPR2 harían falta
~2200px. Si la foto tiene original de cámara (`D3A####`), conviene un `_hd` de
2000-2200 generado desde el original; nunca ampliando el WebP. Hoy usa `full`
solo `/nosotros/` (las dos fotos de equipo, `_hd` de 1440).
En móvil el bloque colapsa a una columna y la imagen pasa a ~100vw; ahí el
`_hd` de 1400 da de sobra incluso a DPR3.

**El mismo cuidado con otros bloques:** el ancho del contenedor no es el ancho
de la imagen cuando hay columnas o padding de por medio. En el slider, la
`.slide` mide 420px pero tiene `padding:1rem`, así que la imagen real son
388px. En el hero split de la home, la columna de imagen es `.9fr` de 2fr
sobre 1120px: ~475px, no los ~500 que daría un 45vw teórico.

**Ojo con las cards: el caso exigente es móvil, no desktop.** En desktop van a
3 columnas (~350px cada una), pero en móvil ocupan una sola columna a casi
todo el ancho: en un iPhone de 430px con DPR3 son ~1200px. Por eso el `_hd` de
cards es 1600 y no 700 — lo justifica el teléfono, no el monitor.

**Imagen suelta en el prose (`figure`): base 800 para el móvil.** Ocupa el
ancho del prose: 343px en un móvil de 375 y 1120px en escritorio. Con dos
peldaños, la base de 800 cubre el móvil DPR2 (~690px) y todo lo demás tira del
`_hd`. Para el `_hd` sirve el original **tal cual** (renombrado a `_hd`, sin
recomprimir ni ampliar). La base sale de él reduciendo a calidad 78. Medido
(oct 2026): `222-lentes_progresivas_calidades` baja de 95 a 33 KB en móvil y
`321-audifonos_tipos` de 29 a 7 KB.

**Ojo con las imágenes que llevan texto dentro** (infografías, comparativas
con rótulos): a 343px de ancho, una tira apaisada se queda en ~90px de alto y
el texto deja de leerse. Para esas hace falta un `_m` recompuesto (los paneles
apilados en vertical), no una base más pequeña. Caso abierto:
`222-lentes_progresivas_calidades` (1812×476, tres paneles con rótulos).

**Equipo: cuadrado, no vertical.** El CSS aplica `aspect-ratio:1/1` +
`object-fit:cover` + `object-position:top center`. Recortar el cuadrado **en el
archivo**, no dejárselo al navegador: con un vertical 750×1125, el tercio
inferior se descarga y no se ve nunca. 750×750 cubre DPR2 exactamente;
1500×1500 cubre DPR3.

Al recortar, encuadrar **busto (cabeza y hombros)** sabiendo que el recorte va
desde arriba: lo que quede por debajo del pecho se pierde.

### Convención de nombres

```
foto.webp       ← tamaño base (1x)
foto_hd.webp    ← doble de ancho (2x)
foto_m.webp     ← recorte móvil (composición distinta, no escalado)
```

`_hd` y `_m` son **siempre opcionales**: si no existen, el theme sirve la base
sin error. Se pueden ir añadiendo por lotes.

---

## Heros: la ganancia está en BAJAR, no en subir

**La mayoría de los heros son imágenes generadas con IA a ~1440px. Esa es su
resolución nativa: no hay más detalle que extraer.** Regenerar a más
resolución no sirve — la IA no es determinista, saldría otra imagen distinta,
y las actuales ya están elegidas y colocadas.

**No pasarlas por un upscaler (ni de IA).** Añade peso sin detalle real, y en
fotos con personas mete artefactos: ya ocurrió con el bordado de una bata, que
salió como "YAUSTO" y "OPTOMETIDRTA".

Lo que sí da ganancia es generar **variantes más pequeñas**, porque hoy todos
los dispositivos descargan el archivo completo. Pesos medidos sobre
`215_vision_40_hero.webp` a calidad 78:

| Ancho | Peso | Quién lo usaría |
|---|---|---|
| 640px | 50 KB | — |
| 960px | 84 KB | iPhone SE, Android medio (DPR2) |
| 1280px | 112 KB | iPhone 14 (DPR3) |
| **1440px (actual)** | **139 KB** | iPad, desktop |
| 1920px | 171 KB | solo fotos de cámara |
| 2880px | 261 KB | no compensa |

Ahorro por hero en móvil: **entre 27 y 55 KB**, sin perder calidad en ningún
dispositivo. En el LCP con conexión móvil eso se nota en PageSpeed.

**Excepción — fotos con código de cámara (`D3A####`):** existen en alta calidad
original. Para esas sí se puede generar `_hd` de verdad, partiendo del archivo
original, nunca ampliando el WebP ya reducido. Techo razonable: 1920px.

---

## Heros: layout apilado ya implementado, reencuadre pendiente de decisión

> **Actualización:** el layout `stacked` ya está en el tema y la banda se puede
> medir. Las medidas reales están en la tabla siguiente y sustituyen a la
> estimación de más abajo (que se conserva por su razonamiento). El reencuadre
> de imágenes sigue en pausa hasta que Foco lo retome.

| Ancho de pantalla | Banda (ancho × alto) | Proporción |
|---|---|---|
| Móvil 359–390 | 359–390 × 256–338 (`40svh` de 640–844) | ~1.4:1 a 1.15:1 (emulador; en un móvil real ~1.35:1 a ~1.7:1, ver nota de la tabla de formatos) |
| 821 | 821 × 288 | ~2.85:1 |
| 1024 | 1024 × 341 | 3:1 |
| 1440 | 1440 × 480 | 3:1 |
| 1920 | 1920 × 540 (tope `60svh` de 900) | 3.55:1 |

**Tope de ancho: 1440px.** Desde 1440px de viewport la banda no crece (los laterales son el navy del bloque), así que ningún archivo se amplía por CSS más allá de su tamaño y el recorte no empeora en pantallas grandes. Consecuencias sobre las imágenes:

- Un monitor retina de 1440px (DPR 2) pide 2880px. Ninguna imagen actual llega ahí; las únicas con `_hd` son Nosotros (2399px) y el hub de Visión (1440px). El resto se sirve a ~1440px y el navegador la estira ×2 (inevitable sin regenerar; ver el aviso sobre IA más abajo).
- **Inventario de `hero.bg` (stacked):** 25 imágenes, anchos de 700 a 2508px. **10 miden menos de 1440** (1200–1402px; la más estrecha es `322-ayudas_auditivas_hero`, 1200), así que ya se amplían un poco en un 1440 sin retina. **4 miden más** (1680, 1920, 2400, 2508): el tope les quita nitidez que sí tienen. Solo 3 tienen `_hd`.
- El `srcset` usa el ancho **real** de cada archivo, no «el doble de la base» (ver más abajo).

Con `object-fit: cover`, la foto se recorta arriba y abajo en desktop; en
móvil, a los lados o arriba y abajo según el teléfono (ver la nota de la tabla
de formatos). Ese es el recorte que hay que mirar al reencuadrar;
`hero.imagePosition` fija el punto de interés.

**Antes de implementar el layout se decía:** no reencuadrar ni regenerar heros
todavía, porque el recorte final depende de la proporción de la banda.
Reencuadrar 24 imágenes contra una especificación teórica significa
reencuadrarlas dos veces.

**Inventario actual** (salida de `scripts/recoge-imagenes-hero.ps1`):
25 `hero.image` (tras unificar: ya no hay `hero.bg`) · 3 variantes `_m` ·
solo 2 con variante `_hd`.

**Dos cosas cambian con el apilado y no estaban contempladas antes:**

1. En split la foto ocupa media columna (~560px en portátil); **en apilado pasa
   a ancho completo**, así que necesita 1440–1920 de ancho real. Es un
   requisito distinto y cambia qué variantes compensa generar.
2. La altura de la banda es una decisión de CSS, **no** la proporción del
   archivo: `object-fit: cover` recorta. El archivo solo necesita píxeles para
   llenarla a DPR2.

**Estimación de partida** (a confirmar midiendo en el inspector, no aquí):

```css
.hero-band { height: clamp(200px, 55vw, 280px); }            /* móvil  */
@media (width > 51.25em){ .hero-band{ height: clamp(260px, 26vw, 380px); } }
```

Sale de restar a la altura útil del viewport el header (~72px desktop, ~60
móvil) y el bloque de copy completo (~350px desktop, ~300 móvil, contando
eyebrow + H1 + dos o tres líneas de subtítulo + fila de CTA). El criterio es
que **el H1 se vea sin scroll**: si entra, no hace falta ningún chevron ni
indicador de scroll, que además competiría por la atención con los botones de
llamada y WhatsApp.

**Qué sí se puede hacer ya**, porque no depende del layout:
- Variantes **hacia abajo** de los `bg` (1280 y 960): cambian el ancho, no el
  encuadre. Es el ahorro grande de LCP en móvil.
- Corregir nombres de variantes `_hd` mal formados.
- Inventariar qué heros vienen de cámara (`D3A####`, tienen original y admiten
  `_hd` real hasta 1920) y cuáles de IA (nativos a ~1440, no se suben).

**Qué queda bloqueado hasta el layout:**
- Reencuadrar las 3 variantes `_m` del hero: hoy son 843×1264 (retrato 2:3), formato pensado
  para texto **encima** del fondo. Con el texto debajo, esa proporción se come
  el viewport antes del H1.
- Fijar el `hero.imagePosition` de cada imagen: es un juicio visual sobre el
  recorte real, no un cálculo.

## DECISIÓN ABIERTA · nitidez de los heros en desktop

Ninguna de estas tres opciones está tomada. La página de inicio ya va en
`split`; las 24 páginas de contenido son `stacked` por defecto.

**El problema, en una línea:** en `stacked` la banda mide 1440px, así que un
portátil retina pide 2880 y el archivo que existe es de 1440. Esas 24 páginas
se sirven a 1x. En `split` la figura mide ~672px y el mismo archivo de 1440 da
2.1x de sobra. La nitidez, con la fototeca actual, solo se cobra en `split`.

**El conflicto:** los subtítulos de esas 24 páginas son largos (el de Audición
ronda los 460 caracteres). En `split` el copy supera en altura a la foto, que
es lo que descartó poner la foto a la izquierda. `stacked` absorbe el texto
largo sin desequilibrio.

| Opción | Qué cuesta | Qué se gana | Qué se pierde |
|---|---|---|---|
| **A. Dejar `stacked` a 1x** | nada | cero trabajo | heros suaves en retina, en las 24 |
| **B. Bajar `--hero-band-max`** de 1440 a ~1200 | una línea en `critical.css` | el estiramiento pasa de 2x a 1.66x | heros más estrechos en desktop; no resuelve, atenúa |
| **C. Pasar páginas a `split`** | acortar el subtítulo de cada una y mover el resto al primer bloque de texto | 2.1x real, sin regenerar ni una imagen | trabajo de copy página a página |
| **D. Regenerar a 2880** | pedir o rehacer 24 fotos | `stacked` nítido | coste y, en las de IA, no siempre es posible |

Si se va a C no hace falta hacerlo de golpe: `layout` es por página.

### ¿Queda mal variar el layout del hero según la página?

Depende de si hay regla o no la hay.

Variar **por tipo de página** es un sistema, y se lee como intención: inicio en
`split`, páginas de servicio y producto en `stacked`, alguna portada de sección
en `overlay` si la foto tiene espacio negativo. El visitante percibe jerarquía,
no desorden, y quien edite mañana sabe qué poner sin preguntar.

Variar **caso a caso**, según qué quedó mejor ese día, sí queda mal: con un
público de 45-75 años la previsibilidad de la página es parte de la
accesibilidad, y en un tema pensado para reutilizarse deja una decisión
implícita que nadie puede reconstruir.

La regla, si se adopta C, debería quedar escrita en PAGE_TYPES.md como «layout
de hero por tipo de página», no elegirse página a página. Y el criterio que
decide no es estético sino de contenido: **`split` mientras el subtítulo quepa
en la altura de la foto; `stacked` cuando no quepa.**

---

## Las `_hd` no miden el doble (aviso de auditoría)

`img-srcset.html` lee el ancho real de la base y de la `_hd` y declara ambos en el `srcset` (antes asumía `_hd` = 2× la base y sobredeclaraba). Al hacerlo salió que **ninguna `_hd` del sitio mide 2×**: van de 1.1× a 1.6×, y hay casos peores:

| Archivo | Base → `_hd` | Problema |
|---|---|---|
| `322-ayudas_auditivas_transmisor_telefono_hd` | 700 → 407 | La `_hd` es **más pequeña** que la base |
| `322-ayudas_auditivas_sistemas_infrarojos_hd` | 700 → 567 | Ídem |
| `311-audiometria_hd` (card) | 1003 → 1003 | Igual que la base; no aporta nada |
| `223-lentillas_hd` (card) | 949 → 949 | Ídem |

Con los anchos reales el navegador ya no elige la «hd» pequeña en retina (antes la elegía creyéndola 1400w), pero estas cuatro conviene regenerarlas o retirarlas en la tarea de optimización de imágenes.

## Qué se puede automatizar y qué no

Un script de lote (PIL, ImageMagick, o Claude Code ejecutándolos) **trabaja a
ciegas sobre el contenido**: no evalúa si una cara queda cortada ni si el
sujeto sigue centrado. Eso divide las operaciones en dos grupos:

**Seguro en lote, sin revisar:**
- Reescalado proporcional (mismo encuadre, menos píxeles).
- Cambio de calidad/compresión.
- Conversión de formato.
- Generar la escalera descendente de anchos.

**Requiere ojo humano antes de dar por bueno:**
- Cualquier **recorte que cambie la proporción** — el cuadrado de equipo, los
  `_m` móviles. Ahí es donde se cortan cabezas.
- Elegir el punto de interés (`hero.imagePosition`).
- Decidir **qué** imágenes necesitan variante `_m`: es criterio visual, no una
  regla que un script pueda aplicar.

En la práctica: que el lote haga reescalado y compresión, y que los recortes
pasen por revisión **mirando el resultado**, no confiando en que el recuadro
cayó donde debía. Claude Code puede abrir una imagen y verla, pero no lo hará
sobre 100 archivos en un bucle salvo que se le pida explícitamente.

---

## Rutas en el proyecto

```
static/
  images/
    (page-code)-nombre_descripcion.webp        ← imagen principal
    (page-code)-nombre_descripcion_hd.webp     ← variante 2x (opcional)
    (page-code)-nombre_descripcion_m.webp      ← recorte móvil (opcional)
    og/
      (page-code)-slug.jpg                     ← OG siempre JPG, 1200×630
    cards/
      (page-code)-slug.webp                    ← miniatura de listado
```

`draft-images/` (raíz del repo, hermana de `static/`) es la **biblioteca de
candidatas**: Hugo no la ve. Al elegir una se mueve con `mv` a
`static/images/` con su nombre final. Nunca se referencia `draft-images/` en
un `.md`.

---

## Calidad de exportación

| Formato | Calidad | Notas |
|---|---|---|
| WebP | **78** | Con este valor se midieron los pesos de la tabla de arriba |
| JPG (solo OG) | 85 | Suficiente para previsualizaciones sociales |

Un hero de 1440px de ancho a calidad 78 debe pesar **entre 100 y 150 KB**. Si
pasa de 200 KB, bajar a 70 antes que reducir dimensiones.

---

## Criterios de encuadre por tipo

**Hero (modo `stacked`, el habitual)**
— La imagen va **sola en una banda superior**, sin texto encima: no hace falta
reservar zona neutra, el texto va debajo sobre fondo de color.
— Sí importa el **punto de interés**: la banda recorta arriba y abajo, así que
el sujeto debe quedar centrado verticalmente o indicarse con
`hero.imagePosition`.
— Para móvil: **reencuadrar, no escalar.** Composición distinta de la misma
escena, priorizando caras o elemento principal.

**Hero (modo `overlay`, excepcional)**
— Aquí sí hace falta zona neutra donde caiga el texto.
— Evitar fotos con sujetos repartidos por todo el encuadre: ninguna opacidad
de overlay hace que un H1 se lea bien encima de una cara.

**Cards**
— **Proporción 4:3** (`800×600`), forzada por CSS. Con otra proporción el
navegador recorta desde el centro y se pierde lo que sobre.
— Elemento principal reconocible a 200px de ancho.
— Mismo tipo de encuadre en todas las de una misma sección, para que la
cuadrícula se vea coherente.

**Equipo**
— Cuadrado, encuadre de busto, recorte desde arriba.
— Fondo neutro o desenfocado, iluminación homogénea entre todos.

**OG / Social**
— Margen en los bordes: algunas redes recortan.
— Sin texto en la foto: se duplicaría con el título OG que genera el theme.
— Legible en miniatura pequeña (es como aparece en WhatsApp).

---

## WebP: soporte

~97% del tráfico global. Safari desde iOS 14 / macOS Big Sur (2020). Válido
como formato único para todo el sitio **excepto OG**, donde se mantiene JPG
por compatibilidad con rastreadores externos.

No hace falta fallback JPEG para el público objetivo (España, dispositivos
actuales).
