---
# 1.0 — Nosotros
page_id: "1.0"
page_type: "standard"
content_type: "company"
draft: false
title: "Ópticas Fausto: 44 años en Torre del Mar, desde 1982 | Nosotros"
linkTitle: "Nosotros"
description: "Empresa familiar de óptica y audiología en Torre del Mar desde 1982. Tres generaciones del mismo equipo, seguimiento real y asesoramiento sin presión. Conócenos."

seo:
  title: "Ópticas Fausto: 44 años en Torre del Mar, desde 1982 | Nosotros"
  description: "Empresa familiar de óptica y audiología en Torre del Mar desde 1982. Tres generaciones del mismo equipo, seguimiento real y asesoramiento sin presión. Conócenos."
  robots: "index, follow"

og:
  title: "Más de 44 años mirando por ti — Ópticas Fausto"
  description: "Tres generaciones de la familia Fausto en Torre del Mar desde 1982. Conoce al equipo y los dos centros."
  image: "/images/100-equipo_fausto_completo.webp"
  type: "website"

schema:
  type: AboutPage
  includeBreadcrumb: true

hero:
  title: "Más de 44 años mirando por ti"
  subtitle: "A tu servicio en Torre del Mar desde 1982. Tres generaciones de la misma familia, el mismo compromiso: conocerte de verdad y seguir aquí cuando vuelvas."
  ctaPreset: contact
  bg: "/images/100-instalaciones_fausto_duque_fachada.webp"
  class: "bg-top"

sections:
  # ============  — declaración de intenciones antes del grid individual ============
  
  # ============ TEAM — grid individual, 7 personas reales ============
  - type: team
    title: "Cada rostro, una historia con Fausto"
    subtitle: "Óptico-optometristas, audioprotesista y el equipo de atención que hace que todo funcione cada día."
    items:
      - name: "Leonor"
        role: "Óptico-Optometrista · Co-directora"
        image: "/images/100-equipo_optometrista_leonor.webp"
        bio: "Hija del fundador Fausto y madre de Juan. Lleva décadas en la profesión y conoce Torre del Mar palmo a palmo — y Torre del Mar la conoce a ella. Su especialidad es la optometría avanzada y la audiología: es quien más años lleva resolviendo los casos que otros no saben dónde meter."
      - name: "Anabel"
        role: "Óptico-Optometrista · Co-directora"
        image: "/images/100-equipo_optometrista_anabel.webp"
        bio: "Hija del fundador Fausto. Lleva toda la vida rodeada de monturas y lentes — y se nota: tiene la rara habilidad de hacer que un niño de ocho años salga encantado de una revisión visual. Especialista en visión infantil y en sacar el mejor partido a cada paciente, sea cual sea su edad."
      - name: "Juan"
        role: "Óptico-Optometrista y Audioprotesista · Máster en Baja Visión"
        image: "/images/100-equipo_optometrista_audioprotesista_juan.webp"
        bio: "Hijo de Leonor. Tercera generación de la familia en la profesión. Combina la optometría con la audiología — una especialización poco común que permite dar una atención integral a quienes tienen necesidades en ambas áreas."
      - name: "María José"
        role: "Auxiliar de Óptica"
        image: "/images/100-equipo_auxiliar_mariajose.webp"
        bio: "30 años en Fausto. Si no lo sabe ella, es que no lo sabe nadie: ha visto crecer a clientes que empezaron siendo niños y hoy traen a los suyos. La prueba viviente de que en Fausto, si eres buen profesional y buena persona, te quedas."
      - name: "Melania"
        role: "Auxiliar de Óptica"
        image: "/images/100-equipo_auxiliar_melania.webp"
        bio: "25 años atendiendo cada día en Fausto. Conoce el oficio y conoce a la clientela — a estas alturas, las dos cosas van de la mano."
      - name: "Maria Victoria"
        role: "Auxiliar de Óptica"
        image: "/images/100-equipo_auxiliar_victoria.webp"
        bio: "Formó parte del equipo, pasó una temporada en Alemania y, al volver a Torre del Mar, se reincorporó a Fausto sin pensárselo dos veces. Aquí las puertas no se cierran: se quedan abiertas para quien decide volver."
      - name: "Lourdes"
        role: "Auxiliar de Óptica"
        image: "/images/100-equipo_auxiliar_lourdes.webp"
        bio: "Parte del equipo desde hace 5 años — el tiempo exacto que hace falta para demostrar que encajas: en Fausto no hace falta una vida entera para ser de la familia, solo trabajar bien y ser buena gente."

  # ============ LOS DOS LOCALES ============
  # NOTA DE DESARROLLO (v3 — decisión final de Foco):
  # - Nombre + DIRECCIÓN de cada centro: HARDCODED a propósito. No cambian, así que
  #   no se benefician de indirección vía site.yaml — decisión consciente, no descuido.
  # - Teléfono, email, WhatsApp y horario: siguen SIN aparecer aquí. Eso sí cambia
  #   (el horario cada verano/invierno) y sí debe salir de site.yaml — ver TODO abajo.
  # - Fachadas: Avenida vertical, Duque vertical también disponible (alternativa a la
  #   horizontal D3A7496 usada ahora). Foco resuelve el mismatch de aspect ratio con
  #   `object-fit: cover` en CSS en vez de recortar/homogeneizar los archivos — no
  #   hace falta sustituir 100-instalaciones_fausto_avenida_fachada.webp por la vertical salvo que se prefiera
  #   por composición, no por el ratio en sí.
  # - PLACEHOLDER horario: { { < hours > } } aún no existe (pendiente Claude Code, ver
  #   memoria de proyecto). En cuanto exista, valorar si añadirlo aquí o dejarlo solo
  #   en Contacto/footer para no duplicar la misma info dinámica en dos sitios.
  - type: gallery
    title: "Dos centros en Torre del Mar, un mismo equipo"
    subtitle: "Mismo trato, mismo compromiso, distinta esquina del pueblo."
    items:
      - image: "/images/100-instalaciones_fausto_avenida_fachada.webp"
        imageAlt: "Fachada de Centro Fausto Avenida, Torre del Mar"
        legend: "Centro Fausto Avenida — Av. Andalucía, 84 B"
      - image: "/images/100-instalaciones_fausto_avenida_interior.webp"
        imageAlt: "Interior de Centro Fausto Avenida"
        legend: "Centro Fausto Avenida — interior"
      - image: "/images/100-instalaciones_fausto_duque_fachada.webp"
        imageAlt: "Fachada de Centro Fausto Duque, Torre del Mar"
        legend: "Centro Fausto Duque — C/ Duque de Ahumada, 1C"
      - image: "/images/100-instalaciones_fausto_duque_interior.webp"
        imageAlt: "Interior de Centro Fausto Duque, techo abovedado de ladrillo visto"
        legend: "Centro Fausto Duque — interior"

  - type: cta
    preset: contact
    title: "Ven a conocernos"
    subtitle: "No hace falta que traigas nada, ni siquiera cita. Pásate por cualquiera de los dos centros, o llámanos y te contamos cómo podemos ayudarte. [Cómo llegar →](/contacto/)"
    labelCall: "Llamar ahora"
---

## Desde 1982 en Torre del Mar. Y aquí seguimos.

{{< image-text image="/images/100-equipo_fausto_completo.webp" imageAlt="Equipo completo de Ópticas Fausto en el centro de Torre del Mar" width="full" >}}
En 1982, Fausto abrió las puertas del primer Centro Óptico Auditivo en Torre del Mar. No venía con un manual de franquicia ni con una central que le dijera cómo hacer las cosas: venía con vocación, con conocimiento y con la intención de quedarse. Y se quedó.

Hoy, cuatro décadas después, sus hijas **Leonor y Anabel** llevan los dos centros — y Juan, hijo de Leonor, ya representa la **tercera generación** de la familia en la profesión. Tres generaciones. El mismo pueblo. El mismo compromiso.

Muchas de las familias que vinieron con Fausto siguen viniendo hoy con sus hijos y sus nietos. Esa continuidad no se compra con publicidad: se construye visita a visita, año tras año, siendo el sitio al que merece la pena volver.
{{< /image-text >}}

{{< image-text image="/images/100-equipo_fausto_completo_informal.webp" imageAlt="Equipo completo de Ópticas Fausto en el centro Duque de Torre del Mar" width="full" reverse="true" >}}
## El equipo que te conoce — y te trata como persona antes que cliente
Esa continuidad de la que hablamos tiene nombre y cara. En Fausto no te atiende un protocolo: te atiende alguien que lleva años mirando por tu vista y tu oído, y que se acuerda de ti sin necesidad de mirar la ficha.

- **Te conocemos de verdad.** Sabemos qué gafas llevas, qué te costó adaptar la última vez y cuándo te toca la próxima revisión — no hace falta que nos lo recuerdes.
- **Seguimos aquí después de la venta.** Si algo no te funciona, vuelves y lo resolvemos juntos, sin explicar tu caso desde cero.
- **Decidimos aquí, pensando en ti.** No seguimos un guion escrito en una oficina central: cuando hace falta una solución distinta, la buscamos nosotros, en la tienda.
- **Te asesoramos con honestidad**, aunque eso signifique recomendarte la opción más sencilla en lugar de la más cara.

Es la diferencia entre el protocolo de una franquicia y una relación real — y esa diferencia no se compra con publicidad. Se construye con el mismo equipo, año tras año.
{{< /image-text >}}

{{< testimonials title="Nos conocemos de toda la vida. Y eso se nota." >}}
{{< testimonial-item name="Residente de Torre del Mar" rating="5" >}}
Llevo años viniendo y aquí me conocen de verdad. No tengo que explicar nada: saben qué gafas llevo, cómo me fue la última vez, qué me funcionó. Eso no lo encuentras en cualquier sitio.
{{< /testimonial-item >}}

{{< testimonial-item name="Cliente de Torre del Mar" rating="5" >}}
Convencí a mi madre para que se pusiera audífonos y fue la mejor decisión que tomamos juntas. Ahora hablamos por teléfono a diario, disfrutando como hacía tiempo que no podíamos. La paciencia y el seguimiento del equipo de Fausto lo hicieron posible.
{{< /testimonial-item >}}

{{< testimonial-item name="Madre de cliente" rating="5" >}}
Mi hijo tenía problemas de visión y Anabel le trató con una delicadeza increíble. El niño salió de la consulta contento y con ganas de volver — y eso, con un niño, no es fácil de conseguir.
{{< /testimonial-item >}}
{{< /testimonials >}}

{{< text-split width="wide" >}}
{{< text-split-item textSize="xl" align="center" >}}
**«Si trabajas bien y eres buena gente, entras en la familia de Fausto.»**
{{< /text-split-item >}}
{{< text-split-item textSize="s" pad="m" margin="0 0 1rem 0" >}}
Lo dice el propio equipo directivo, y no es una frase para la web: es la razón por la que María José lleva 30 años aquí, por la que Melania lleva 25, y por la que Victoria, después de una temporada en Alemania, volvió a Torre del Mar y a Fausto sin pensárselo. Y también es la razón por la que, con quienes en algún momento dejaron de trabajar aquí, la relación sigue siendo buena. Lo primero es ser personas, respetarnos y valorarnos mutuamente — con el cliente, con el proveedor, con quien trabaja hoy y con quien trabajó ayer.
{{< /text-split-item >}}
{{< /text-split >}}

{{< banner >}}«Si trabajas bien y eres buena gente, entras en la familia de Fausto.»{{< /banner >}}

Lo dice el propio equipo directivo, y no es una frase para la web: es la razón por la que María José lleva 30 años aquí, por la que Melania lleva 25, y por la que Victoria, después de una temporada en Alemania, volvió a Torre del Mar y a Fausto sin pensárselo. Y también es la razón por la que, con quienes en algún momento dejaron de trabajar aquí, la relación sigue siendo buena. Lo primero es ser personas, respetarnos y valorarnos mutuamente — con el cliente, con el proveedor, con quien trabaja hoy y con quien trabajó ayer.

<!-- ## Dos centros en Torre del Mar, un mismo equipo -->

<!-- PLACEHOLDER HORARIO: aquí (o en el CTA de abajo) puede ir { { < hours >}} en cuanto
     el shortcode exista en el tema. Hasta entonces, no hardcodear horario en este
     archivo — cambia cada verano/invierno y su única fuente debe ser site.yaml.
     Ver TODO completo en la memoria del proyecto: "Arquitectura de horarios". -->

<!-- {{< cta title="Cómo llegar y horarios de cada centro" subtitle="Direcciones, teléfonos y horario de Avenida y Duque." b1text="Ver ubicaciones" b1url="/contacto/" b1icon="location" >}}
-->

