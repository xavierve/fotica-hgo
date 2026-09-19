---
title: "Demo · hero split con la foto primero"
draft: true
url: "/demo/hero-split-mediafirst/"
seo:
  type: WebPage
  includeBreadcrumb: false
  includeFAQ: false

# Misma copy y misma foto que el hero de /demo/, con mediaFirst: true.
# Dos `hero:` en un mismo front matter NO se pueden: YAML rechaza la clave
# duplicada y el build falla. Para comparar los dos ordenes, dos paginas.
hero:
  eyebrow: "hero · split · mediaFirst: true"
  title: "0.1- Hero Layout Overlay que se apila en móvil"
  subtitle: "Una sola clave `image` en los tres layouts. Redimensiona la ventana: por debajo de 820px carga `212-vision_infantil_hero_m.webp`, que existe junto al archivo base — la variante móvil se detecta por convención `_m`, no se declara. El overlay toma el tinte de bgColor vía color-mix."
  image: "/images/212-vision_infantil_hero.webp"
  imageAlt: "Anabel, óptico-optometrista, tapa un ojo a una niña con un oclusor durante una revisión visual infantil"
  preset: contact
  labelCall: "Llamar ahora"
  layout: split
  mediaFirst: true
  class: "bg-color2"
---

Esta página existe solo para comparar el orden del split contra `/demo/`, que
lleva el mismo hero con el copy primero. Abre las dos en pestañas contiguas.

Lo que hay que mirar, en este orden:

1. Dónde cae la vista al cargar, y si desde ahí el recorrido llega al H1 o se
   queda en la foto.
2. Si los botones siguen entrando en el primer viewport a 1440×900.
3. En móvil las dos páginas son idénticas: `mediaFirst` solo cambia el DOM, y
   apilado la foto ya iba primero en las dos.
