# TODO — Ópticas Fausto · hoja de ruta hasta entrega
*Generado: agosto 2026 — actualizado tras sesión de contenido y CSS (Nosotros + cover-fit)*

---

## ESTADO REAL DEL PROYECTO

### ✅ Completado y validado

- 30 páginas de contenido migradas a Hugo front matter
- **150 preguntas FAQ** distribuidas (schema FAQPage generado y validado)
- Schema @graph completo (Organization + 2 Optician + BreadcrumbList + FAQPage por página)
- f1-theme: bloques, section-renderer, shortcodes, iconos SVG inline
- hero, cta, cards autodescubiertas
- breadcrumb corregido
- **site.yaml v04** — fuente única de horarios: `contact.hours` (footer/contacto) + `contact.hoursSpec` (schema.org heredado por ambas sedes)
- Aviso legal unificado en `/aviso-legal/`
- 404.html personalizado
- **FAQ de Visión landing** (6 preguntas) y **FAQ de Audición landing** (6 preguntas)
- **Testimonios reales** integrados en Inicio y Nosotros
- **Equipo completo** en Nosotros: tres generaciones (Fausto → Leonor y Anabel → Juan) + 4 auxiliares individuales con antigüedad (María José 30 años, Melania 25 años, Victoria — reincorporada tras Alemania, Lourdes 5 años). Nombres corregidos: se elimina "Vanesa" y "Conchi" (no forman parte del equipo real, quedaron de un borrador anterior)
- **Nosotros `_index.md` v3** completo: front matter con `page_type`/`content_type`/`seo{}`, foto de grupo (`image_text featured`) + grid `team` de 7 + galería de 2 locales con dirección hardcoded (decisión consciente, no cambia) + pull-quotes del cliente vía `{{< banner >}}`. Pendiente solo de que Foco suba los assets finales a las rutas `/images/equipo/*.webp` y `/images/nosotros/*.webp` (zip `ASSETS-nosotros.zip` ya entregado con nombre+dimensiones)
- **CSS cover-fit** para `.card img` y `.team-card img` (aspect-ratio + object-fit:cover) añadido a `main.css` — resuelve la mezcla de aspect ratios entre fuentes de imagen distintas (IA, stock antiguo, fotografía real) en cards de 200/300 y en el grid de equipo. `.gallery-open img` ajustado a `object-position:top` para no cortar rótulos de fachada en fotos verticales
- **Horarios correctos** en site.yaml, nosotros, contacto — L-V 10-13:30 / 17:30-21:00 · Sáb 10-13:30
- **CIF confirmado**: 52582059B (Ana Isabel Santaolalla Gámez) — listo para ofuscación JS
- FAQ seguros: "No trabajamos con mutuas" en home, Visión y Audición

---

## CONVENCIÓN DE NOMBRES DE IMAGEN (`static/images/`, root plano)

Formato: `xxx-aaaa_bbb_ccc.webp`

- `xxx` — page_id de 3 dígitos de la página a la que pertenece la imagen (000, 100, 211, 213...)
- `aaaa` — categoría (`equipo`, `instalaciones`, etc.)
- `bbb` — subcategoría (rol, sede, tipo de foto — `optometrista`, `auxiliar`, `avenida`, `duque`...)
- `ccc` — descripción adicional cuando haga falta desambiguar (nombre propio, `fachada`/`interior`, etc.)

Ejemplos reales ya en uso: `100-equipo_optometrista_leonor.webp` · `100-instalaciones_fausto_avenida_fachada.webp`

Sin subcarpetas para `hero/` `gallery` (solo `og/` y `cards/`) — el prefijo de page_id ya agrupa por página al ordenar alfabéticamente, y evita el problema de una misma foto sirviendo de hero y de card a la vez (con `.card img`/`object-fit:cover` ya no hace falta un recorte distinto por rol). Excepción: si una imagen necesita un recorte físicamente distinto para OG (formato ancho fijo, y en JPG según la convención del proyecto — ver más abajo), esa sí puede llevar sufijo `-og.jpg` como variante aparte del mismo archivo base.

--



### FASE B — Imágenes (cliente + Claude)

| # | Tarea | Quién | Prioridad |
|---|---|---|---|
| B1 | Fotografías reales disponibles — organizar y nombrar según rutas del front matter: `/images/cards/*.webp` · `/images/og/*.webp` · `/images/*.webp` · `/images/*.webp` | Hecho | **Alta — desbloquea D0** |
| B1.1 | ✅ Nosotros (100): equipo (7 individuales + grupo) y locales (2 fachadas + 2 interiores) resueltos, empaquetados en `ASSETS-nosotros.zip`. Pendiente solo subir a rutas finales | Cliente | Hecho |
| B1.2 | Páginas de servicio con hero asignado (211-215, 227, 300, 311-312, 314-315, 321): heroes generados con IA con la cara del equipo — **decisión pendiente de confirmar** si se publica así o se sustituye por fotografía real, dado el principio de marca "fotos reales, no stock" | Foco | Hecho |
| B1.3 | Páginas de producto puro sin foto nueva (216, 222-226, 322-323): se quedan con stock antiguo de la web previa, por decisión explícita — sin acción pendiente salvo homogeneización visual en D0 | — | Cerrado por decisión |
| B1.4 | Página Contacto (400): patrón de card definido (fachada 50% sup. + captura de mapa auto-alojada 50% inf., ambas `<img>` separadas dentro de un único `<a>` a Google Maps; teléfono fuera del enlace). Pendiente: aspect ratio/recorte final, y decidir servicio de captura de mapa (riesgo ToS de atribución con Google Maps — alternativa OSM/Mapbox si el logo obligatorio molesta) | Foco | Hecho |
| B2 | Optimizar imágenes para web: WebP, tamaños responsive, lazy loading | Claude Code | Media |

### FASE C — Desarrollo técnico (Claude Code · sesión separada)

**Alta:**
| # | Tarea |
|---|---|
| C1 | Formulario de contacto: php Hostinger. Dual móvil/desktop. Confirmación inline. Checkbox RGPD → `/aviso-legal/` |
| C2 | Ofuscación JS de CIF (52582059B) y domicilio en `/aviso-legal/` — spans con `data-obf` |
| C3 | `.gitignore`: excluir `public/` y `resources/_gen/` |
| C4 | Sticky footer móvil: Llamada / WhatsApp / Ubicación con icons.html y datos de site.yaml |
| C5 | Hero responsive: variante móvil `bgMobile` (replicar patrón de cta) |
 Falta: (1) `footer.html` lea `contact.hours`; (2) `schema.html` cambie `$loc.hoursSpec` por `or $loc.hoursSpec $contact.hoursSpec`; (3) crear shortcode `{{< hours >}}` y sustituir el horario hardcoded del body de Contacto. Objetivo: cambiar horario de verano/invierno editando solo site.yaml |

**Media:**
| # | Tarea |
|---|---|
| C7 | `.htaccess` Hostinger (Apache, `Redirect 301`): dominio viejo → nuevo, 4 subdominios landing, mapeo de URLs WordPress a partir del sitemap del sitio viejo recuperado de Wayback Machine. **Ahora mismo en 302 a propósito**, a la espera de lanzar el sitio nuevo; al lanzar se pasan a 301 |
| C8 | Verificar 404 en Hostinger: `ErrorDocument 404 /404.html` en el `.htaccess` para que devuelva HTTP 404 real (sin eso Apache lo sirve con 200 y Google lo trata como soft 404) + `noindex` al `<head>` |
| C9 | Tipografía con `clamp()` y espaciados en `em` |
| C10 | Indicador de scroll en heros + botón volver-arriba global (coordinar con sticky footer) |

**Baja / al recibir material:**
| # | Tarea |
|---|---|
| C11 | Sección equipo en Nosotros: fotos integradas + `employee`/`Person` en schema Organization |
| C12 | `memberOf` (Sociedad Española de Baja Visión) y `hasCredential` (Centro Auditivo Homologado) en Organization |
| C13 | CSS crítico inline en home; objetivo PageSpeed móvil >85 |
| C14 | Medir el contraste del foco de teclado de `.btn:focus-visible` (`color-mix(currentColor 45%, transparent)`, `outline-offset: 2px`). Se dibuja sobre el fondo de la página, no sobre el botón, y probablemente no llegue a 3:1 (WCAG 2.4.11 / 1.4.11) en varios contextos (bandas de color, hero, footer). Medir con foco de teclado real sobre los mismos 8 fondos que se usaron para el anillo del volver-arriba (crema, blanco, beige, footer, navy, verde, dorado, gris medio). Si falla, la técnica de dos capas (clara por dentro, oscura por fuera) está en `critical.css`, `.back-to-top:focus-visible`. Detectado al corregir el foco de la barra fija móvil; fuera de su alcance. |

### FASE D — Revisión visual y pre-lanzamiento

| # | Tarea | Quién | Condición |
|---|---|---|---|
| **D0** | **Revisión visual con skill frontend** — componente a componente: hero inicio, Why Us/banner, cards de servicios, formulario. Brief ya preparado en proyecto. | Claude (Proyecto) | **Después de B1 + C1 + C4** (fotos reales + formulario + sticky footer) |
| D1 | Build limpio sin warnings: `hugo build` | Claude Code | — |
| D2 | Validación schema en validator.schema.org (WebPage, Service, Product, FAQPage) | Claude Code | — |
| D3 | Verificar 0 hrefs a rutas inexistentes en `/public/` | Claude Code | — |
| D4 | Prueba en móvil iOS y Android (Chrome + Safari): CTA clickable, texto ≥18px, sin modales | Cliente | Tras D0 |
| D5 | Google Search Console: añadir propiedad, verificar, enviar sitemap | Cliente | — |
| D6 | Google Business Profile: actualizar URL + horarios en ambos perfiles | Cliente | Horarios ya confirmados |
| D7 | Auditoría NAP: citaciones en directorios locales apuntan al dominio correcto | Cliente | — |
| D8 | Deploy en Cloudflare Pages: dominio, variables de entorno Worker (API key Resend) | Cliente + Claude Code | — |
| D9 | Activar redirect 301 opticafausto.com → opticasfausto.com | Cliente | — |

### FASE E — Post-lanzamiento (Fase 2, cuando se active SEM/Meta Ads)

| # | Tarea |
|---|---|
| E1 | Banner de consentimiento de cookies (barra inferior, no modal, AEPD-compliant) — NO antes del primer píxel |
| E2 | Actualizar Política de Cookies con tabla real de cookies instaladas |
| E3 | Meta Pixel y/o Google Ads conversion tag (solo tras consentimiento explícito) |
| E4 | Revisar logs 404 post-lanzamiento: cada 404 recurrente = 301 pendiente |
| E5 | Multilingüe EN/DE (no presupuestado en Fase 1) |

---

## DEPENDENCIAS CRÍTICAS

```
Fotografías reales (B1) ──────────────────────────────┐
                                                       ↓
Formulario (C1) + Sticky footer (C4) ─────────→ D0 REVISIÓN VISUAL (frontend skill)
                                                       ↓
CIF ofuscado (C2) + 404 real (C8) + Schema OK ──→ PRE-LAUNCH CHECK
                                                       ↓
Redirects (C7) + GBP (D6) + NAP (D7) ──────────→ DEPLOY
```

---

## SIGUIENTE ACCIÓN

**Cliente:** subir `ASSETS-nosotros.zip` a las rutas finales (B1.1); decidir B1.2 (¿heroes IA se publican o se sustituyen?) y B1.4 (aspect ratio + servicio de mapa para Contacto).
**Claude Code:** C1 (formulario) + C4 (sticky footer) + C6 (horarios desde site.yaml — spec ya detallada arriba) — una sesión.
**Claude Proyecto:** D0 revisión visual con skill frontend en cuanto estén B1 + C1 + C4. CSS cover-fit de cards/team ya entregado, no bloquea D0.
