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

## Estado actual (verificado con build)

Hecho y validado: `schema.html` v02 (@graph completo, BreadcrumbList, FAQPage — 127 preguntas en el sitio), `breadcrumb.html` corregido, `site.yaml` v03 (legal unificada), 30 páginas de contenido migradas, shortcodes + iconos + `cta-banner` v2 (bg/bgMobile/bgColor/preset/microcopy), `404.html`, attributes de Goldmark activados, CSS de utilidades (`fs-xs/s/l`, `has-bg-image/color`, banner).

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
8. **Hero con fondo responsive**: `hero.html` acepta `imageBackground` pero sin variante móvil ni regla CSS que la consuma — replicar el patrón `bg/bgMobile/bgColor` del cta-banner.
9. **Sticky footer móvil** con Llamada / WhatsApp / Ubicación (requisito ap8.1), usando `icons.html` y datos de site.yaml.

15. **Indicador de scroll + botón volver-arriba**: (a) en heros de landings (home, /vision/, /audicion/, progresivas, lentes-de-contacto, gafas-infantiles), indicador de scroll con `icon: arrow-down` (partial icons.html), animación sutil, dentro de `<a>`/`<button>` con `aria-label`; (b) botón global "volver arriba" con `arrow-up`, visible solo tras ~1.5 viewports de scroll, `aria-label="Volver arriba"`, desplazamiento suave vía CSS `scroll-behavior: smooth` (respeta `prefers-reduced-motion`). En móvil no debe solaparse con el sticky footer de contacto (tarea 9): coordinar posiciones.

### Prioridad baja / al recibir material
10. Imágenes reales: cards (`/images/cards/*.jpg`) y OG (`/images/og/*.jpg`) referenciadas en front matter — crear las rutas al recibir la sesión fotográfica; mientras, fallbacks.
11. Sección equipo en `/nosotros/` (TODO en el contenido): fotos + nombres (Anabel, Leito) + `employee`/`Person` en schema Organization.
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
