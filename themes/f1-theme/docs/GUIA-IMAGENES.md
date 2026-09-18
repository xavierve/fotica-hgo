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
| **Hero** | `hero.bg` | 1440×960 | 1920×1280 *(solo cámara)* | 3:2 | WebP |
| **Hero móvil** | `hero.bgMobile` | **768×420** ⚠ | 1536×840 | **3:2** ⚠ | WebP |
| **Hero figura** | `hero.image` | 1440 ancho | 2880 | libre | WebP |
| **OG / Social** | `og.image` | 1200×630 | — | 1.91:1 | **JPG** |
| **Cards** | `card.image` | **800×600** | 1600×1200 | **4:3** | WebP |
| **Equipo** | `team.items[].image` | **750×750** | 1500×1500 | **1:1 cuadrado** | WebP |
| **Galería** | `gallery.items[].image` | 1200×900 | 2400×1800 | **4:3** | WebP |
| **image-text** | en el shortcode | **700 ancho** | 1400 | libre | WebP |
| **Slider** | `slider.items[].image` | **780 ancho** | — | libre | WebP |
| **Logos de marca** | `brands.items[].image` | 320 ancho | — | libre | WebP/SVG |

> ⚠ **Los heros están PENDIENTES de cerrar.** Las medidas de `hero.bg` y
> `hero.bgMobile` de esta tabla son provisionales: dependen de la altura real
> de la banda en el layout `stacked`, que **todavía no está implementado** en
> `partials/hero.html` (hoy solo existen el split de dos columnas y la columna
> única con fondo detrás). No reencuadrar heros hasta entonces — se harían dos
> veces. Qué sí se puede adelantar y qué no: ver «Heros: pendiente del layout
> apilado» más abajo.

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
| image-text | `(min-width:821px) 50vw, 100vw` | 528px (`m`) · 688px (`wide`) · ~704px (`full`) | ~1056-1408px | — |
| Hero split (Home) | `(min-width:821px) 45vw, 100vw` | ~475px (columna `.9fr`) | ~950px | — |
| Slider | `min(80vw, 420px)` | 388px (420 − 32 de padding) | ~776px | — |
| Logos | `160px` | 160px | 320px | — |
| Avatar testimonio | `56px` | 56px | 112px | — |

**image-text no ocupa el ancho del contenedor: ocupa la mitad.** Son dos
columnas `1fr 1fr` con un `gap` de hasta 64px, así que la imagen mide
aproximadamente la mitad del contenedor menos medio gap (medido por Foco en el
inspector, 14 sep, y confirmado con el CSS):

| `width` del bloque | Contenedor | Imagen | DPR2 necesita |
|---|---|---|---|
| default (`m`) | 1120px | **528px** | ~1056px |
| `wide` | 1440px | **688px** | ~1376px |
| `full` | según ventana | ~704px | ~1408px |

Con **700 de ancho base y 1400 en `_hd`** quedan cubiertas las tres variantes.
En móvil el bloque colapsa a una columna y la imagen pasa a ~100vw, pero ahí
el `_hd` de 1400 da de sobra incluso a DPR3.

**El mismo cuidado con otros bloques:** el ancho del contenedor no es el ancho
de la imagen cuando hay columnas o padding de por medio. En el slider, la
`.slide` mide 420px pero tiene `padding:1rem`, así que la imagen real son
388px. En el hero split de la home, la columna de imagen es `.9fr` de 2fr
sobre 1120px: ~475px, no los ~500 que daría un 45vw teórico.

**Ojo con las cards: el caso exigente es móvil, no desktop.** En desktop van a
3 columnas (~350px cada una), pero en móvil ocupan una sola columna a casi
todo el ancho: en un iPhone de 430px con DPR3 son ~1200px. Por eso el `_hd` de
cards es 1600 y no 700 — lo justifica el teléfono, no el monitor.

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
| Móvil 359–390 | 359–390 × 256–338 (`40svh` de 640–844) | ~1.4:1 a 1.15:1 |
| 821 | 821 × 288 | ~2.85:1 |
| 1024 | 1024 × 341 | 3:1 |
| 1440 | 1440 × 480 | 3:1 |
| 1920 | 1920 × 540 (tope `60svh` de 900) | 3.55:1 |

**Tope de ancho: 1440px.** Desde 1440px de viewport la banda no crece (los laterales son el navy del bloque), así que ningún archivo se amplía por CSS más allá de su tamaño y el recorte no empeora en pantallas grandes. Consecuencias sobre las imágenes:

- Un monitor retina de 1440px (DPR 2) pide 2880px. Ninguna imagen actual llega ahí; las únicas con `_hd` son Nosotros (2399px) y el hub de Visión (1440px). El resto se sirve a ~1440px y el navegador la estira ×2 (inevitable sin regenerar; ver el aviso sobre IA más abajo).
- **Inventario de `hero.bg` (stacked):** 25 imágenes, anchos de 700 a 2508px. **10 miden menos de 1440** (1200–1402px; la más estrecha es `322-ayudas_auditivas_hero`, 1200), así que ya se amplían un poco en un 1440 sin retina. **4 miden más** (1680, 1920, 2400, 2508): el tope les quita nitidez que sí tienen. Solo 3 tienen `_hd`.
- El `srcset` usa el ancho **real** de cada archivo, no «el doble de la base» (ver más abajo).

Con `object-fit: cover`, la foto se recorta arriba y abajo (desktop) o a los
lados (móvil, casi cuadrada). Ese es el recorte que hay que mirar al
reencuadrar; `hero.imagePosition` fija el punto de interés.

**Antes de implementar el layout se decía:** no reencuadrar ni regenerar heros
todavía, porque el recorte final depende de la proporción de la banda.
Reencuadrar 24 imágenes contra una especificación teórica significa
reencuadrarlas dos veces.

**Inventario actual** (salida de `scripts/recoge-imagenes-hero.ps1`):
24 `bg` · 3 `bgMobile` · 1 `image` · solo 2 con variante `_hd`.

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
@media(min-width:821px){ .hero-band{ height: clamp(260px, 26vw, 380px); } }
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
- Reencuadrar los 3 `bgMobile`: hoy son 843×1264 (retrato 2:3), formato pensado
  para texto **encima** del fondo. Con el texto debajo, esa proporción se come
  el viewport antes del H1.
- Fijar el `hero.imagePosition` de cada imagen: es un juicio visual sobre el
  recorte real, no un cálculo.

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
