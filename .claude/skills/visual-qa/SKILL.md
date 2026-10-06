---
name: visual-qa
description: Verificar cambios de CSS/layout midiendo el resultado renderizado con Playwright, en vez de a ojo. Usar al tocar header, hero, breakpoints, botones, o cualquier cambio responsive del theme f1-theme. También al elegir un breakpoint nuevo — medir dónde rompe de verdad en lugar de escoger un número redondo.
---

# QA visual con Playwright

El build limpio de Hugo **no prueba que algo se vea bien**. En este proyecto
varios bugs reales compilaban sin un solo warning. Para cambios de CSS/layout,
medir el resultado renderizado.

## Preparación

```bash
pip install playwright --break-system-packages && playwright install chromium
hugo --minify -D -d /tmp/qa
cd /tmp/qa && (python3 -m http.server 8000 &)
```

Servir por HTTP, no abrir con `file://` — el JS del theme (menú móvil,
slider, galería) no se comporta igual desde el sistema de archivos.

Levantar el servidor y lanzar Playwright **en el mismo comando**: si se
separan en dos llamadas, el proceso del servidor puede haber muerto.

## Qué medir, no solo mirar

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in [359, 700, 820, 840, 900, 1099, 1100, 1280]:
        page = b.new_page(viewport={'width': w, 'height': 200})
        page.goto('http://localhost:8000/')
        overflow = page.evaluate('document.documentElement.scrollWidth > window.innerWidth')
        h = page.eval_on_selector('.header-actions .btn', 'el => el.getBoundingClientRect().height')
        print(w, 'overflow:', overflow, '| altura:', round(h, 1))
        page.close()
    b.close()
```

**Dos comprobaciones, no una.** El desbordamiento horizontal
(`scrollWidth > innerWidth`) NO detecta que un texto se parta en varias
líneas: eso hace el elemento más alto, no la página más ancha. Vigilar
también la **altura** del elemento: si cambia en un ancho donde no hay
cambio de breakpoint, hay un wrap oculto. Así se encontró que
`white-space: normal` en `.btn-label` pisaba el `nowrap` de `.btn` justo al
hacerse visible el texto.

## Elegir un breakpoint: medir, no redondear

Los breakpoints del header (840px, 1100px) salieron de bracketing, no de
números bonitos. El método: probar un rango, estrechar hasta encontrar el
punto exacto donde deja de romper, y dejar margen.

```python
for w in [821, 830, 840, 850]:   # primero grueso
for w in [836, 838, 840, 842]:   # luego fino
```

Si se toca un breakpoint existente, volver a medir: el valor correcto
cambia en cuanto cambia cualquier otra cosa del header. Al hacer el
`nowrap` efectivo de verdad, el corte real subió de 1020 a 1090.

**`scrollWidth` no lo ve todo.** El tema lleva `html{overflow-x:clip}`: un
elemento que se sale de la pantalla queda recortado y `scrollWidth` sigue
igual a `clientWidth`. Así pasó con dos botones del home a 320px (322px en una
columna de 288) durante meses. Para detectar desbordes de verdad, comparar el
borde derecho de cada elemento con el viewport, ignorando los que viven dentro
de un contenedor con scroll o recorte propio (slider, galería):

```python
page.evaluate("""() => { const cw = document.documentElement.clientWidth;
  const clipped = e => { let a = e.parentElement; while (a && a !== document.body)
    { if (/(hidden|auto|scroll|clip)/.test(getComputedStyle(a).overflowX)) return true; a = a.parentElement } return false };
  return [...document.querySelectorAll('body *')]
    .filter(e => e.getBoundingClientRect().right > cw + 1 && !clipped(e)).length }""")
```

## Probar con otra letra por defecto

Quien sube el tamaño de letra del navegador (no el zoom) no cambia el ancho del
viewport: crece el texto y todo lo que va en `rem`/`em`, y los breakpoints en
`em` se desplazan. Chromium lo simula con un flag al lanzar:

```python
b = p.chromium.launch(args=['--blink-settings=defaultFontSize=20'])   # 125%
# 24 = 150%. Comprobar: getComputedStyle(document.documentElement).fontSize
```

Qué barrer, con 16, 20 y 24: (1) desbordes en todas las páginas a 320, 359, 390,
820, 821, 1100 y 1440; (2) la cabecera en un barrido fino de 780 a 1720 de 20
en 20: nav partido en dos líneas, logo comprimido (`.site-logo` por debajo de
su ancho natural, 208px) o hijos fuera de `.header-inner`; (3) a 16px, que una
instantánea de geometría y color de todos los elementos sea idéntica a la
anterior al cambio (así se comprueba que una refactorización de unidades no
mueve nada). Con 16px no debe cambiar nada; con 20 y 24, ninguna página
desborda ni la cabecera se comprime.

Al reescribir comentarios en `critical.css`: un `*/` dentro del texto cierra el
comentario y el resto se lee como CSS roto, que se lleva por delante la regla
siguiente (pasó con el nav de escritorio). Comprobar `/*` y `*/` balanceados.

## Interacción: probar con clic real

`aria-expanded` y las clases de estado se comprueban pulsando, no leyendo
el CSS:

```python
page.click('.nav-toggle')
page.wait_for_timeout(200)
print(page.locator('.nav-toggle').get_attribute('aria-expanded'))
```

## Comprobar que el JS sigue vivo

Un `str_replace` mal encajado puede romper `main.js` entero (slider,
galería, contador, menú), y Hugo compila igual sin avisar:

```bash
node -c themes/f1-theme/assets/js/main.js
```

Y capturar errores de consola en la propia página:

```python
page.on('pageerror', lambda e: print('PAGEERROR:', e))
```

## Inspeccionar el JSON-LD generado

```python
import json
s = open('/tmp/qa/nosotros/index.html').read()
i = s.find('application/ld+json>') + len('application/ld+json>')
data = json.loads(s[i:s.find('</script>', i)])
```

Ojo: con `--minify`, el atributo va sin comillas
(`application/ld+json>`), así que un regex que las espere no encuentra nada.

## Regla de fondo

Comprobar antes de afirmar. En esta sesión se dieron por buenos cambios que
no lo estaban (un `white-space` que se pisaba solo, un JS roto entero, un
icono que "no tenía círculo" cuando la forma venía en el propio SVG). En
los tres casos la diferencia la marcó ejecutar la comprobación en lugar de
razonar sobre el código.
