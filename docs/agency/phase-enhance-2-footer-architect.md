# ENHANCE-2 — footer-architect audit

> **Agente:** `footer-architect`
> **Fecha:** 2026-05-26
> **Base:** rama `clasico` HEAD `0a53c6c`
> **Modo:** AUDIT (sin tocar código). Additive-only.
> **Referencia canónica:** `nil-design-preferences.md` + `phase-enhance-1-audit-consolidated.md` (sección E5 ya aplicada)

---

## Contexto y enfoque

El footer actual (`src/components/ui/footer.tsx`) incorpora todos los refinamientos de E5: gradient borde superior, hairline editorial doble, wordmark caligráfico Playfair italic, socials reordenados con halo hover, headings terracota con OpenType cpsp, bullet ▪ copyright, línea-tributo italic y claves i18n `footer.inMemory` / `footer.inMemoryHint`. El año del copyright ya usa `new Date().getFullYear()` (no hardcoded). Los enlaces legacy `yayamariana.com` fueron resueltos en E9.

El análisis del JSX actual revela seis zonas con margen real de refinamiento additive que E5 no tocó: (1) el espacio entre columnas de navegación no tiene divisores visuales; (2) el hover de links de navegación hace `x: 4` pero carece de underline draw-in que complete el gesto editorial; (3) el copyright bottom-row no tiene hairline separador propio que le dé peso; (4) el logo-imagen en hover no tiene respuesta háptica visual; (5) el focus-ring de los social icons usa `focus-visible:bg-[#c0392b]` pero no un ring personalizado con la paleta; (6) la línea-tributo `footer.inMemory` no revela el hint `inMemoryHint` visualmente al hover/focus. Por último, el resto del sitio gana micro-grano en Contact (1.2 %) y la coherencia global de textura justifica replicarlo en el footer al 0.8 %.

Todas las propuestas son ADITIVAS puras (capas superpuestas, sin alterar colores base, tipografías, fondos ni estructura de grid). Ninguna toca dimensiones prohibidas.

---

## Propuestas

### FA-01 — Divisores verticales inter-columna

- **Sección:** Footer — zona nav-cols (las 3 columnas de links: Tienda, Empresa, Legal)
- **Descripción:** Añadir entre cada par de columnas de navegación una línea vertical de 1 px, `rgba(255,255,255,0.06)`, altura equivalente al bloque de contenido de la columna (no full-height del contenedor). Se aplica como pseudo-elemento `::before` o como `<div aria-hidden>` de 1 px × 100 % dentro del grid, visible sólo en `md` en adelante (oculto en mobile stack).
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — La Nonna emplea divisores sutiles entre columnas de footer; encaja en cualquier footer editorial premium.
- **Por qué:** El grid de 4 columnas (brand + 3 nav) actualmente respira bien pero las tres columnas de links flotan sin separación visual entre ellas. Un hairline 6 % alpha no añade peso sino articulación tipográfica, coherente con el hairline editorial doble ya presente en el top-row. Refuerza la sensación de "página compuesta" sin saturar.

---

### FA-02 — Underline draw-in en hover de links de navegación

- **Sección:** Footer — zona nav-cols (cada `<motion.a>` de las listas)
- **Descripción:** Añadir, en paralelo al `x: 4` ya existente, un subrayado hairline que se dibuja de izquierda a derecha al hover via `scaleX` desde 0 → 1, `transform-origin: left`, duración 200 ms, color `rgba(192,57,43,0.55)`, grosor 1 px. Se implementa como `::after` (o `<span aria-hidden>` si JSX lo requiere) con `transition: transform`. Al salir, escala de vuelta a 0 de derecha a izquierda (`transform-origin: right`).
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — es el patrón estándar de links editoriales en footers premium; La Nonna lo usa en la navegación principal.
- **Por qué:** El hover actual desplaza el texto (`x: 4`) y cambia color a `#c0392b`, lo que es ya un gesto limpio. El underline draw-in completa el micro-ritual sin sustituirlo: el texto se mueve Y el subrayado aparece, haciendo el interactivo más intencionado y memorable. Coste visual cero en estado reposo.

---

### FA-03 — Hairline separador antes del bottom-row (legal/copyright)

- **Sección:** Footer — zona bottom-row (el `<div>` con `pt-7` que contiene copyright y "Diseño por Okawa")
- **Descripción:** Añadir inmediatamente encima del bottom-row un divisor hairline `1 px solid rgba(255,255,255,0.08)`, de ancho completo dentro del `max-w-6xl`, como elemento `<div aria-hidden>` o via `border-top` en el mismo `<div>` contenedor. Distinto al hairline editorial doble del top-row (que ya existe en el `grid` superior): este define el bloque legal como zona autónoma.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — La Nonna separa su sección de copyright con un divisor fino que le da dignidad sin pesar.
- **Por qué:** El bottom-row actualmente flota visualmente bajo el grid superior; el único separador existente está en el `grid` (hairline doble de E5 con `borderBottom`), pero ese borde pertenece al contenedor del grid, no al espacio previo al bottom-row. Un hairline explícito antes del legal/copyright cierra la composición y hace la zona "pie de imprenta" reconocible de un vistazo, como en cualquier publicación editorial impresa.

---

### FA-04 — Halo cream-rosa en hover del logo

- **Sección:** Footer — zona brand-col (el `<motion.div>` que contiene `<Image src="/logo-nuevo.jpg">`)
- **Descripción:** Al hacer hover sobre el logo (o sobre el `<motion.div>` padre), aplicar un halo radial `radial-gradient(ellipse 80px 28px at center, rgba(232,196,191,0.12) 0%, transparent 70%)` como `box-shadow` o como capa `::after` absolutamente posicionada, con transición `opacity` 0 → 1 en 300 ms `ease-out`. La imagen en sí mantiene su `brightness-0 invert` (logo blanco); el halo es la capa ambiental detrás.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — La Nonna aplica un halo cálido detrás del logo en hero y footer; encaja en la identidad peach-cream de Yaya Mariana.
- **Por qué:** El wordmark caligráfico "Yaya Mariana" ya tiene hover implícito (tooltip `inMemoryHint`). El logo-imagen encima de él no tiene ninguna respuesta. Un halo cream-rosa discreto (12 % alpha, estrictamente dentro de la paleta) hace el bloque brand "vivo" al pasar el cursor sin contradecir el tono homenaje. Coherente con el halo radial ya aplicado a los social icons (E5).

---

### FA-05 — Focus ring personalizado en social icons (paleta terracota)

- **Sección:** Footer — zona socials (los 5 `<a>` del `SOCIALS.map`)
- **Descripción:** Sustituir el actual `focus-visible:bg-[#c0392b]` (que llena el fondo entero) por un focus-ring de doble capa: anillo externo `0 0 0 3px rgba(192,57,43,0.30)` + anillo interno `0 0 0 1px rgba(192,57,43,0.70)`, aplicado sólo en `:focus-visible`, via `box-shadow` (ya se gestiona con `onFocus`/`onBlur`). El fondo en focus puede quedar `bg-white/10` (reposo) o adoptar un tinte más tenue `rgba(192,57,43,0.15)` en vez del rojo pleno, para diferenciarlo visualmente del hover (que sí usa fondo `#c0392b`).
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — La Nonna mantiene focus rings visibles y con paleta coherente; ningún navegador default ring azul.
- **Por qué:** El estado focus-visible actual es idéntico al hover (fondo rojo pleno), lo que colapsa dos estados distintos en la misma señal visual. Un ring exterior terracota translúcido sobre fondo tenue diferencia "focus por teclado" de "hover por ratón", mejora la accesibilidad y refina la paleta. Sin coste visual en reposo.

---

### FA-06 — Micro-fade reveal del `inMemoryHint` en la línea-tributo

- **Sección:** Footer — zona bottom-row (el `<p>` con `t.footer.inMemory`)
- **Descripción:** En estado reposo, la línea-tributo "En memoria de Mariana" muestra sólo el texto principal al 55 % alpha (ya aplicado en E5). Al hacer hover o focus sobre ese elemento `<p>`, mostrar un segundo span con `t.footer.inMemoryHint` que aparece con `opacity` 0 → 1 en 400 ms y un `translateY` de 4 px → 0, posicionado debajo de la línea-tributo como capa B (no tooltip nativo, sino inline). Al salir, desaparece con `opacity` 1 → 0 en 200 ms. El texto del hint hereda el estilo serif italic de la línea principal, a `rgba(232,196,191,0.38)` (más tenue aún).
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** NO directamente (La Nonna no tiene línea-tributo); pero el patrón hover-reveal de texto secundario sí encaja en cualquier footer editorial. La naturaleza homenajeante del hint es exclusiva de Yaya Mariana.
- **Por qué:** En E5 el `inMemoryHint` se añadió como tooltip nativo (`title="..."`) del wordmark caligráfico, no de la línea-tributo del bottom-row. El hint tiene carga emocional y merece una presentación visual controlada, no el tooltip amarillo del OS. Un micro-fade inline hace que quien se detenga sobre la línea descubra algo íntimo, coherente con el tono homenaje. Es el gesto más emotivo de este audit.

---

### FA-07 — Micro-grano 0.8 % en el footer (coherencia textural con Contact)

- **Sección:** Footer — fondo global (`<footer>`)
- **Descripción:** Añadir sobre `bg-[#2d0a0a]` una capa `::before` absolutamente posicionada con SVG turbulence noise (mismo método que Contact a 1.2 %, reducido a 0.8 % para respetar que el footer es más oscuro y el grano se percibiría más). Parámetros: `feTurbulence baseFrequency="0.65" numOctaves="3"`, resultado como `feColorMatrix` con alpha 0.08, `mix-blend-mode: screen`, `pointer-events: none`, z-index por debajo de todo el contenido.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — La Nonna aplica micro-grano en fondos oscuros; es estándar en fotografía gastronómica de alta gama.
- **Por qué:** Contact tiene grano al 1.2 %. El footer comparte la misma función de "cierre de página" pero actualmente tiene un fondo maroon plano que contrasta con la textura del resto del sitio. Un grano al 0.8 % unifica la firma textural del sitio completo y hace el footer sentirse "mismo material" que Contact, no un bloque diferente. Alpha reducido (0.08) vs Contact para compensar el fondo más oscuro.

---

### FA-08 — Ornamento tipográfico tras el año de copyright

- **Sección:** Footer — zona bottom-row, dentro del `<p>` de copyright
- **Descripción:** Tras `{new Date().getFullYear()}` y antes de "Yaya Mariana", insertar un glifo ornamental de Playfair Display: el fleuron `❦` (U+2766) o la mancha `•` en font-serif, `rgba(192,57,43,0.40)`, `font-style: normal`, tamaño 0.85 em, `aria-hidden`. Ejemplo resultante: `© 2026 ❦ Yaya Mariana.`
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — La Nonna usa el fleuron `❦` en su footer y en separadores de carta; es un ornamento editorial clásico.
- **Por qué:** El bullet `▪` en E5 abre el copyright con carácter de marca. Un fleuron o punto ornamental entre el año y el nombre de marca añade un segundo beat tipográfico que hace la línea de copyright sentirse "compuesta" en lugar de generada. Cambio mínimo (un carácter) con resultado editorial desproporcionado. El `▪` inicial y el `❦` central no compiten: son ornamentos en posiciones distintas (prefijo vs. separador).

---

### FA-09 — Tono diferenciado para el link "Diseño por Okawa" en bottom-row

- **Sección:** Footer — bottom-row, el `<a href="https://okawa.es">Okawa</a>`
- **Descripción:** El link "Okawa" actualmente sólo tiene `hover:text-white/60 transition-colors`. Añadir: (a) underline hairline permanente `rgba(255,255,255,0.15)` en reposo (indica que es link), (b) en hover el underline draw-in en terracota `rgba(192,57,43,0.50)` con `scaleX` 0→1 (consistente con FA-02), (c) manteniendo la transición de color a `text-white/60`. El label "Diseño por" antes del link queda al 35 % alpha actual; sólo el anchor "Okawa" recibe el tratamiento.
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — en La Nonna el crédito de agencia es tratado con la misma elegancia que el resto de los links de footer.
- **Por qué:** La asimetría actual entre los links de navegación (con `x: 4` y color hover terracota) y el link de crédito (sólo color hover blanco tenue) hace que la atribución de autoría se sienta como afterthought. Consistencia visual entre todos los links del footer —sin importar su jerarquía— es señal de acabado profesional. El underline permanente en reposo también cumple función de accesibilidad (distingue link de texto plano sin depender del color).

---

## Resumen de prioridades

| ID | Título | Tipo | Prioridad |
|---|---|---|---|
| FA-01 | Divisores verticales inter-columna | ADITIVA | MEDIA |
| FA-02 | Underline draw-in en hover de links | ADITIVA | ALTA |
| FA-03 | Hairline separador antes del bottom-row | ADITIVA | ALTA |
| FA-04 | Halo cream-rosa en hover del logo | ADITIVA | MEDIA |
| FA-05 | Focus ring personalizado en social icons | ADITIVA | MEDIA |
| FA-06 | Micro-fade reveal del `inMemoryHint` | ADITIVA | ALTA |
| FA-07 | Micro-grano 0.8 % en el footer | ADITIVA | MEDIA |
| FA-08 | Ornamento tipográfico tras el año copyright | ADITIVA | BAJA |
| FA-09 | Tono diferenciado para link "Okawa" | ADITIVA | BAJA |

> **Nota:** Ninguna propuesta toca dimensiones prohibidas (fondos, paleta base, tipografía base, layouts, estructura). Las 9 son ADITIVAS puras. Las 3 de prioridad ALTA (FA-02, FA-03, FA-06) son las de mayor impacto perceptivo con el menor riesgo de saturar.
