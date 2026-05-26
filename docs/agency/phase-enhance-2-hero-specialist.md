# ENHANCE-2 — hero-specialist audit

## Contexto y enfoque

El Hero de Yaya Mariana ya tiene cimentados los gestos clave de E1/E2: grano filmográfico 4%, aura radial cream-rosa, scroll-cue idle, hairline bajo eyebrow, línea vertical draw-in, letter-spacing settle del eyebrow, divisor scaleX 60×3, hamburguesa móvil. El territorio libre para ENHANCE-2 se concentra en tres vectores sin explorar: **calidez temporal** (el Hero respira, no solo aparece), **intención emocional del titular** (la cita de Yaya Mariana merece peso propio), y **micro-feedback de interacción** (CTA y aura reaccionan al contexto del usuario). Todas las propuestas son ADITIVAS o declaran su dimensión MIXTA con precisión.

---

## Propuestas

### HS-01 — Respiración del aura logo (loop idle)

- **Sección:** Hero — columna derecha, aura radial detrás del logo
- **Descripción:** El `radial-gradient` del aura (ya presente, `rgba(245,198,194,0.35)`) anima su opacidad en un loop suave de 9-11 s entre 0.32 y 0.42. Keyframes: 0% → 32%, 50% → 42%, 100% → 32%. Se implementa con una `motion.div` que envuelve el div estático existente del aura, usando `animate={{ opacity: [0.32, 0.42, 0.32] }}` con `repeat: Infinity` y `ease: "easeInOut"`. El `filter: blur(40px)` absorbe todo banding perceptible. Nula interferencia con el resto de capas.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — el halo cálido que "late" encaja exactamente con la calidez de una cantina familiar, no es ajeno al referente.
- **Por qué:** El Hero actual se anima al cargar y luego se congela. Un respiro muy lento convierte el logo en un elemento vivo sin añadir ruido visual. Es el gesto más pequeño con el mayor retorno emocional: da la sensación de que Yaya Mariana está presente, no enmarcada. Prioridad ALTA porque su coste de implementación es mínimo (1 prop de framer-motion sobre un div ya existente) y el impacto perceptual es inmediato.

---

### HS-02 — Settle moment del grano post-carga (micro-bloom)

- **Sección:** Hero — capa de grano filmográfico (div `z-[1]`)
- **Descripción:** Tras la carga inicial, el grano aparece a opacidad 0 y escala a su valor final de 0.04 con un transition de 1.8 s y delay de 1.4 s (cuando el hero-enter-animation ya ha terminado). El efecto: la textura "emerge" suavemente del fondo liso, como si el papel fotográfico se revelara. Se logra convirtiendo el div estático del grano en un `motion.div` con `initial={{ opacity: 0 }}` y `animate={{ opacity: 0.04 }}` + `transition={{ delay: 1.4, duration: 1.8, ease: "easeOut" }}`. Ninguna propiedad de fondo ni paleta se toca.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — el grano como capa que se asienta evoca el revelado de fotografía analógica, coherente con el carácter artesanal de ambos proyectos.
- **Por qué:** El grano hoy aparece de golpe con el resto del hero. El settle diferido rompe esa simultaneidad sin cambiar ningún elemento visible al usuario: el grano solo se vuelve perceptible cuando la mirada ya está orientada por el texto y el logo. Refuerza la sensación de "momento que se asienta" tras la entrada.

---

### HS-03 — Parallax muy sutil en aura al scroll (scroll progress)

- **Sección:** Hero — columna derecha, aura radial
- **Descripción:** Usando `useScroll` + `useTransform` de framer-motion (sin depender de nuevas librerías), el `translateY` del div-contenedor del aura se mueve entre `0px` y `-18px` conforme el hero sale del viewport. El logo en sí no se mueve — solo el halo pierde altura relativamente, como si el calor quedara "atrás" al hacer scroll. El rango de parallax es deliberadamente pequeño (18 px) para que sea perceptible en desktop sin causar vertigo ni desorientar en mobile (donde se desactiva con `useMediaQuery` o simplemente fijando el translateY a 0 si `window.innerWidth < 768`).
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — con matiz: en La Nonna el parallax sería igual de discreto; la referencia Awwwards de calidad lo usa sistemáticamente en halos y auras de fondo, nunca en el texto principal.
- **Por qué:** Añade profundidad de capas sin modificar nada estructural. El aura ya tiene `filter: blur(40px)`, lo que garantiza que cualquier artefacto de movimiento quede absorbido. Fortalece el lenguaje de "capas calientes" establecido por el grano y el aura, sin entrar en scroll-jacking (el contenido no se detiene, solo el halo se desplaza levemente).

---

### HS-04 — Peso tipográfico de la cita: word-reveal escalonado

- **Sección:** Hero — columna izquierda, `<p>` con `t.hero.quoteText`
- **Descripción:** La cita (`"Todo lo bueno de la vida requiere paciencia, trabajo y amor."`) actualmente aparece en bloque con el `motion.div` padre. Propuesta: dividir el texto en palabras con un `.split(" ")` y renderizar cada palabra como `<motion.span>` con `initial={{ opacity: 0, y: 6 }}` y `animate={{ opacity: 1, y: 0 }}`, staggered a `0.04 s` por palabra, con delay base de `0.5 s`. Las palabras "paciencia", "trabajo" y "amor" —las tres cualidades de Yaya— reciben un `delay` adicional de `0.04 s` cada una, haciendo que su llegada sea ligeramente posterior al resto, dando peso emocional sin subrayado ni cambio de color. El `quoteAuthor` no se toca.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — el word-reveal escalonado es exactamente el gesto "masthead being set" aprobado para La Nonna. Es el mismo lenguaje editorial aplicado al titular de tributo.
- **Por qué:** La cita es el núcleo emocional del Hero y actualmente entra como bloque monolítico. El stagger por palabra (con micro-énfasis en las tres palabras clave) convierte la frase en un momento, no en un texto. Respeta la tipografía, el color y el layout sin tocarlos. Prioridad ALTA porque es la propuesta de mayor retorno emocional del conjunto.

---

### HS-05 — Cursor-following gradient shift sobre el logo (hover desktop)

- **Sección:** Hero — columna derecha, logo + aura
- **Descripción:** En desktop (pointer: fine), al mover el cursor sobre la columna derecha del Hero, el centro del `radial-gradient` del aura sigue la posición relativa del cursor con un lag suave (`lerp` a 0.08 por frame, o `useSpring` con `stiffness: 80, damping: 20`). El efecto: el halo "sigue" la mirada con retraso cálido, como si el calor tuviera inercia. El rango de desplazamiento del centro está limitado a ±24 px respecto al centro geométrico del div para evitar que el gradiente salga del contenedor. En mobile (`pointer: coarse`) y `prefers-reduced-motion: reduce` la posición del gradiente queda fija en el centro — sin fallback visual, simplemente sin el efecto.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — con matiz: en La Nonna sería aún más apropiado sobre una fotografía; aquí el logo-imagen ya tiene `mixBlendMode: multiply`, con lo que el cursor-gradient actúa por debajo, invisible desde un ángulo incorrecto pero muy perceptible en interacción activa.
- **Por qué:** Añade interactividad premium sin ningún elemento visible en reposo. Es uno de los patrones de alto impacto del spec de `hero-specialist` ("cursor-following gradient — premium interactive feel"). Refuerza la sensación de que el halo responde a la presencia del visitante, coherente con el tono de tributo vivo.

---

### HS-06 — Ornamento tipográfico en quoteAuthor: em-dash refinado

- **Sección:** Hero — columna izquierda, atribución `— Yaya Mariana`
- **Descripción:** El em-dash actual es un guión de código (`—`) seguido de un espacio. Propuesta: sustituirlo por el glifo Unicode de em-dash largo tipográfico `—` envuelto en un `<span aria-hidden>` con `font-feature-settings: "dlig" 1` y `letter-spacing: -0.02em`, seguido del nombre en un `<span>` separado. El efecto visual es mínimo pero preciso: el em-dash queda más ajustado al nombre, como en composición editorial de citas. No se tocan color, tamaño ni familia tipográfica.
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — en La Nonna se aprobaron los `font-feature-settings` como sistema global (TM-#1 E1). Este gesto es coherente con ese vocabulario.
- **Por qué:** El detalle tipográfico de la atribución es el último centímetro de calidad editorial en el Hero. En un tributo a una persona real, el nombre propio merece la mayor precisión posible. El coste es cero bytes de runtime adicional; el impacto es visible solo para quien lee de cerca, que es exactamente el visitante más implicado emocionalmente.

---

### HS-07 — Motion lift refinado del CTA primario (hero btn1)

- **Sección:** Hero — columna izquierda, botón CTA primario (`href="#productos"`)
- **Descripción:** El CTA primario ya tiene `whileHover` con `scale: 1.04` y `boxShadow`. Propuesta: añadir un `y: -2` en el estado hover (lift vertical de 2 px) y elevar el `boxShadow` a `0 12px 28px rgba(192,57,43,0.38)` para enfatizar la elevación. Adicionalmente, el `motion.span` interior (que hoy hace `x: 4` en hover) añade un `gap` que crece de `gap-1.5` a `gap-2.5` mediante un inline style animado — esto separa ligeramente el texto de la flecha `→`, haciendo el hover más expresivo sin cambiar el copy ni el layout. El botón secundario no se modifica.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — el motion lift sobre CTA primario es el patrón estándar de calidad en el referente La Nonna (el nav button ya lo tiene con `scale: 1.04`). Unificar el vocabulario de elevación entre nav y hero CTA es coherencia de sistema.
- **Por qué:** El CTA primario actual tiene hover funcional pero plano (solo escala y sombra). El lift vertical de 2 px añade la tercera dimensión que convierte el botón en un objeto que "flota" hacia el cursor. La sombra más pronunciada debajo refuerza la lectura de elevación. El gap expansivo del texto+flecha da sensación de impulso hacia la acción.

---

### HS-08 — Hairline horizontal entre columnas en desktop (divisor vertical cromático)

- **Sección:** Hero — entre columna izquierda (55%) y columna derecha (45%)
- **Descripción:** En el layout `md:flex-row` del Hero, insertar entre las dos columnas un divisor vertical de `1 px` de ancho, `60%` de alto, centrado verticalmente, con `background: linear-gradient(to bottom, transparent 0%, rgba(192,57,43,0.12) 40%, rgba(192,57,43,0.12) 60%, transparent 100%)`. El elemento es `aria-hidden`, `pointer-events-none`, y solo visible en `md:`. No existe en mobile (la columna stack es vertical). En `prefers-reduced-motion: reduce` el elemento simplemente está presente sin animación de entrada (el draw-in ya está usado para la línea vertical del eyebrow — este divisor es estático por diseño).
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — con matiz: en La Nonna los separadores verticales entre columnas son un gesto editorial habitual. Aquí el gradiente de fade-in/fade-out en los extremos evita que el divisor parezca un borde de tabla.
- **Por qué:** Las dos columnas del Hero actualmente conviven sin tensión visual explícita. El divisor vertical cromático (apenas perceptible, con fade en extremos) crea una articulación entre el espacio de texto y el espacio del logo sin añadir peso. Es el complemento natural al sistema de hairlines horizontales ya presente (eyebrow, divisor 60×3).

---

### HS-09 — Nav: hairline scroll-fade (opacidad del `borderBottom` según scroll)

- **Sección:** Hero — `<nav>` sticky
- **Descripción:** El nav tiene `borderBottom: "1px solid #f0e0e0"` y `boxShadow` siempre visibles. Propuesta: en scroll `y === 0` la sombra y el border son invisibles (`opacity: 0`); al hacer scroll > 4 px ambos aparecen con transición de 200 ms. Se implementa con un `useEffect` + `useState(scrolled)` que escucha `scroll` del `window`. Cuando `scrollY > 4` → `scrolled = true`. El nav adquiere `borderBottom` y `boxShadow` solo en `scrolled`. En `scrollY = 0` el nav flota sobre el Hero sin línea de separación, reforzando la integración visual hero-nav.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — es la convención de los mejores sitios editoriales: nav transparente en top, nav sólido al bajar. La Nonna tiene una versión similar.
- **Por qué:** Actualmente el nav tiene `borderBottom` y `boxShadow` permanentes, lo que crea una separación visual entre el nav y el Hero incluso cuando el usuario no ha hecho scroll. El scroll-fade unifica nav y Hero en un único above-the-fold cohesivo. Al bajar, el nav se "activa" y señala el cambio de contexto. Es la propuesta de mayor impacto sistémico porque afecta la percepción de todo el Hero desde el primer segundo de carga.

---

### HS-10 — Scroll-cue: fade-out al iniciar scroll (disappear on scroll)

- **Sección:** Hero — scroll-cue `bottom-6` (`motion.div` con chevron + label)
- **Descripción:** El scroll-cue actual aparece a `delay: 1.2 s` y rebota indefinidamente hasta que el usuario hace scroll. Propuesta: añadir un `useEffect` + `useState(visible)` que escucha `scroll`; cuando `scrollY > 40` → `visible = false` con `AnimatePresence` + `exit={{ opacity: 0, y: 6 }}` de 300 ms. Cuando el usuario vuelve a `scrollY < 10` → `visible = true` con fade-in de 400 ms. El scroll-cue desaparece en el momento exacto en que ya cumplió su función, sin dejar ruido visual en la pantalla mientras el usuario navega. El componente de bounce existente queda intacto.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — el scroll-cue que se autodestruye discretamente al ser "usado" es un gesto de UX de calidad que La Nonna usaría exactamente igual.
- **Por qué:** Hoy el scroll-cue no tiene condición de salida: sigue rebotando aunque el usuario haya avanzado tres secciones. El fade-out al scroll convierte el elemento en un gesto de invitación educado que se retira cuando ya no es necesario. Junto con la propuesta HS-09 (nav scroll-fade), establece un vocabulario de "estado de scroll" coherente en todo el above-the-fold.
