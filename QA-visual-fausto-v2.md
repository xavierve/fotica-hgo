# Informe de QA visual v2 — estado tras los arreglos de oct 2026

Sustituye a `QA-visual-fausto-v1.md` (hecho sobre `3cff405`). Rehecho sobre
`main` @ `8fd80d2` más la rama `claude/qa-fixes`.

**Método.** Build con `hugo -D`, servido en local, medido con Playwright
(Chromium): render real, no lectura de CSS. Instantánea de geometría y color
de todos los elementos de header, main y footer en **28 páginas × 6 anchos**
(320, 359, 390, 820, 821, 1440), antes y después del cambio, con las imágenes
forzadas a carga inmediata para que el *lazy-load* no meta ruido. Contraste
calculado sobre el color computado (con alfa y opacidad) contra el primer
fondo opaco. Foco con teclado real (Tab), no con `.focus()`.

---

## Estado de los hallazgos de v1

| # | Hallazgo v1 | Estado | Medida actual |
|---|---|---|---|
| 1 | Hamburguesa deformada < 390px | ✅ Resuelto (antes de oct) | 44×44 en todos los anchos; a 320px encoge el logo |
| 2 | Anillo de foco de `.btn` invisible (C14) | ✅ Resuelto y medido | Capa que contrasta: 4,05:1 (gris medio) a 16:1; igual con `prefers-reduced-motion: reduce` |
| 3 | `/demo/` desborda a 359px | ✅ Resuelto | Ninguna página desborda en ningún ancho (antes: `/contacto/` y `/demo/` a 320) |
| 4 | Eyebrow a 4,28:1 | ✅ Resuelto | `--color-accent-text` #7f6418: 4,91:1 sobre crema, 5,53:1 sobre el fondo |
| 5 | Objetivos táctiles < 44px | ✅ Resuelto | Teléfono de cabecera, hamburguesa e iconos sociales: 44×44 |
| 6 | Casilla RGPD 25,6px | ✅ Resuelto | 32×32; el `<label>` asociado (244×59 a 320px) también la marca |
| 7 | `.bg-color4 .btn-outline` 2,44:1 | ✅ Resuelto | 7,6:1 (`--bg-color4-text`). Demo 15.3 |
| 8 | `.section-subtitle` sobre oscuro 1,78:1 | ✅ Resuelto | 9,7:1 sobre navy. **Corrección a v1:** no era una clase de la demo; la usan `cards`, `text`, `text-split`, `team`, `locations` y `testimonials` |
| — | Aviso obsoleto en GUIA-IMAGENES | ✅ Resuelto | — |

## Hallazgos nuevos (todos resueltos en la misma rama)

### A. `/contacto/` desbordaba a 320px (producción)
El correo del bloque `locations` es un flex item: `overflow-wrap: break-word`
(en body) no reduce su ancho mínimo, y la fila crecía 37px más que la página.
`main` y `.site-footer` pasan a `overflow-wrap: anywhere`; el header se queda
en `break-word` (allí debe encoger el logo, no partirse el nav). A 320px el
correo se parte en dos líneas; desde 359px cabe entero (ver C).

### B. Iconos aplastados en filas flex
Al medir A salió un fallo previo: el reloj del horario del footer medía 13×20
a 320px y 19,7×22 en escritorio (debía ser cuadrado). `.icon` lleva ahora
`flex-shrink: 0`: el que encoge es el texto.

### C. Margen lateral doble en bloques dentro del body
Un bloque intercalado en la prosa (shortcode) restaba su propio 1rem por lado
encima del de `.container.prose`: en móvil su texto empezaba en x=32 y el de
la prosa en x=16. Los bloques sin fondo se alinean ahora con la prosa; los que
tienen fondo (`.has-surface`) conservan ese aire entre borde y texto.
Comprobado en `/contacto/`, `/audicion/productos/audifonos/` y `/demo/`.

### D. `/demo/` no salía en `.dev/`
`hugo server` (entorno development) no construía borradores y la demo es
`draft: true`. `config/development/hugo.toml` activa `buildDrafts`. Producción
no lee ese archivo: comprobado que `hugo` no genera `/demo/`.

## Cambios colaterales verificados

La comparación antes/después solo muestra los cambios esperados: elementos de
bloques sin fondo dentro de la prosa (+32px de ancho), el footer (iconos
sociales, reloj del horario), el header por debajo de 821px (los botones se
desplazan 4px por la hamburguesa de 44), la casilla RGPD y el eyebrow
(único cambio de color en las páginas de producción). Ningún otro elemento
cambia de posición horizontal, ancho o alto.

## Pendiente o asumido

- **Correo partido en dos líneas a 320px** en `/contacto/`. Preferible a
  desbordar; no hay ancho para más.
- **Anillo de foco sobre fondos con foto** (`.has-bg-image`): no medido; la
  medida de C14 fue sobre fondos planos. Sobre foto depende de la imagen.
- **Contraste de la forma de `.btn-fill` sobre dorado** (verde sobre
  `bg-color4`, 2,44:1). El texto del botón se lee (blanco sobre verde, 5,58:1)
  y WCAG 1.4.11 no exige contraste del borde cuando la etiqueta identifica el
  control; se anota por si se quiere el mismo tratamiento que el outline.
