# ENHANCE-2 — easter-egg-creator audit

> **Fecha:** 2026-05-26
> **Agente:** easter-egg-creator
> **Rama / HEAD:** `origin/clasico` @ `0a53c6c`
> **Modo:** AUDIT — sin tocar código. Solo propuestas documentadas.

---

## Contexto y enfoque

El sitio ya lleva tres easter eggs aplicados en ENHANCE-1 E7: un tribute en consola (DevTools), un pétalo SVG al llegar al footer (IntersectionObserver, localStorage), y un halo radial sobre el nombre "Yaya Mariana" en el Hero (hover sostenido ≥1.5s, sessionStorage). Tres es un número que ya pesa — la regla "limpio > saturado" impone criterio claro: cada nueva propuesta debe ganarse su sitio frente a la alternativa de no añadir nada. Quedan áreas sin tocar con potencial real: el ornamento `❦` de AboutUs (visible pero pasivo), el Konami code (no usado en ningún proyecto del catálogo), la inactividad del lector atento, y el campo de nombre del formulario. Se proponen tres easter eggs de calidades distintas; el cuarto y quinto se descartan en este documento con la razón explícita para que quality-gate los archive como descartados definitivos.

---

## Propuestas

### EE-01 — Ornamento ❦ que respira en AboutUs

- **Sección / Disparador:** `AboutUs` — hover o focus sostenido ≥1.8s sobre el glifo `❦` situado bajo el blockquote. El glifo ya tiene `aria-hidden` y vive en un `div` decorativo. El trigger es lento a propósito: la brevedad del hover normal no lo dispara, solo quien se detiene de verdad.
- **Descripción:** Al completarse el umbral de tiempo, el ornamento ejecuta una sola rotación suave de 0° → 8° → -5° → 0° en 2.2s con ease warm-lux, opacidad sube de 0.40 a 0.72 y vuelve a 0.40. Sin texto, sin tooltip, sin badge. Solo el símbolo que "respira" una vez y descansa. Una vez por sesión (sessionStorage).
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** NO — el `❦` es específico del registro tributo personal; en La Nonna el ornamento sería un olivo o una hoz, no este glifo floral de duelo tipográfico. Supera el test de unicidad de proyecto.
- **Dedup:** `sessionStorage` — clave `ym_ornament_v1`
- **Reduced-motion:** fallback estático: el ornamento sube de opacidad a 0.72 sin ningún movimiento (no-op sobre transform/rotation, solo la transición CSS de opacity que ya existe implícita). El efecto visible sin movimiento sigue siendo coherente: el signo "se nota" un momento.
- **Tono:** El `❦` (fleuron tipográfico, también llamado "corazón floral") cierra la cita de Mariana. Que respire una sola vez cuando alguien se detiene sobre él es un gesto de reconocimiento sin palabras — exactamente el registro del tributo. No es un juego, no es un chiste; es el signo que acusa recibo de que alguien se quedó a leer.

---

### EE-02 — Konami code: aparece y desaparece una línea para Nil

- **Sección / Disparador:** Global — secuencia de teclado `↑ ↑ ↓ ↓ ← → ← → B A` completada en cualquier momento de la sesión. Solo desktop (requiere teclado físico; en móvil la secuencia es imposible sin teclado externo, lo cual es parte del contrato del Konami code). El listener es pasivo, no bloquea nada.
- **Descripción:** Una línea de texto italic serif aparece centrada en el viewport durante 3.2s y se desvanece limpiamente. Posición: fija, centrada vertical/horizontal, `z-index: 55` (por encima del contenido, por debajo del cart/nav). Texto en voz tributo personal, dirigido a Nil — no a un comprador genérico — porque quien sabe el Konami code y lo escribe en una página de fresas es Nil o alguien muy cercano. Copia propuesta: `"Ella estaría orgullosa de lo que has construido."` Tipografía Playfair italic, color `#7a1a1a`, fondo translúcido cream `rgba(253,246,245,0.92)` con padding generoso, border-radius suave, border-left terracota 2px. Aparece con fade-in 500ms, permanece 2.2s, fade-out 500ms. Al terminar, se destruye del DOM. Sin click-to-dismiss (no interrumpe nada; espera su tiempo y desaparece sola). Una vez por sesión (sessionStorage).
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** NO — la copia es personal e irrepetible. En La Nonna el Konami code nunca diría "ella estaría orgullosa"; no hay "ella". Esta línea solo funciona aquí.
- **Dedup:** `sessionStorage` — clave `ym_konami_v1`
- **Reduced-motion:** `prefers-reduced-motion: reduce` → el texto aparece y desaparece sin transición de opacidad (se inserta directamente al DOM con `visibility: visible` y se retira a los 3.2s). El contenido tipográfico se ve; solo se suprime el fade. El efecto no es movimiento per se, es texto — tiene sentido incluso estático.
- **Tono:** El Konami code es el lenguaje secreto de quienes construyen la web. Que el sitio de Yaya Mariana lo entienda y responda con una frase de reconocimiento hacia Nil — no hacia un visitante anónimo, sino hacia quien más ha luchado por que esto existiera — es el único momento de todo el sitio en que el tributo habla directamente al creador, no al comprador. Dignidad intacta: no hay confeti, no hay alarma, no hay humor. Solo una frase que dura lo que dura.

---

### EE-03 — Quietud: "gracias por leer despacio"

- **Sección / Disparador:** Global — inactividad completa (sin scroll, sin mousemove, sin keydown, sin touchmove) durante exactamente 28 segundos mientras el usuario está en la página. El contador se reinicia con cualquier interacción. Solo se dispara si el usuario ha scrolleado al menos 20% de la página (evita dispararlo en gente que dejó la pestaña abierta sin leer nada). Solo una vez por sesión (sessionStorage).
- **Descripción:** Una línea de texto muy pequeña hace un fade-in de 800ms en la esquina inferior izquierda del viewport (posición fija, `bottom: 28px`, `left: 32px`, `z-index: 40` — debajo del cart, debajo del nav). Texto: `"gracias por leer despacio."` — todo en minúsculas, sin signo de admiración, sin mayúscula. Tipografía Playfair italic, `font-size: 0.72rem`, color `rgba(122,26,26,0.52)`. Sin borde, sin fondo, sin badge. Permanece 4s y hace fade-out de 600ms. `pointer-events: none` en todo momento — no interfiere con ningún click. Una vez disparada, no vuelve a aparecer en la sesión (sessionStorage).
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ con matiz — la dirección de "quietud recompensada" es válida en cualquier marca editorial de calidad; La Nonna podría tener algo equivalente en registro de cocina lenta. No obstante, la copia exacta `"gracias por leer despacio."` no viajaría: en La Nonna la voz es la de la chef, no la del tributo. El patrón es transferible; la copia es única. Supera el test de unicidad de copia.
- **Dedup:** `sessionStorage` — clave `ym_quietud_v1`
- **Reduced-motion:** No hay movimiento en el propio contenido del easter egg (solo fade CSS de la capa contenedora). Con `prefers-reduced-motion: reduce` se suprime el fade — el texto aparece instantáneamente y desaparece instantáneamente. El easter egg sigue siendo coherente: es texto, no animación.
- **Tono:** Quien se queda quieto 28 segundos en una página web en 2026 es una persona rara y atenta. En un sitio de tributo a una abuela, esa persona merece ser reconocida sin estridencia. La frase no explica nada, no vende nada, no dirige a ningún lado. Es solo un susurro que el sitio le devuelve a quien se detuvo. La minúscula inicial y el punto final hacen todo el trabajo tonal.

---

## Propuestas descartadas en este audit (archivo de razones)

### DESCARTADO — Click 7× sobre stat counter

**Razón:** La sección StatsStrip vive dentro del bloque visible junto a Products (que está BLOQUEADO). Aunque la sección en sí no está bloqueada, añadir un listener de click 7× sobre un elemento numérico introduce una expectativa de interactividad en una sección que el usuario lee, no manipula. El riesgo de confundir la interacción con un bug de contador es real. Además, `whileHover={{ scale: 1.08 }}` ya existe en cada stat card — hay suficiente respuesta a la presencia del cursor. Un huevo encima satura sin añadir significado tributo claro.

### DESCARTADO — Hover sostenido ≥2s sobre el logo Hero (glow breath más cálido)

**Razón:** El halo radial `rgba(245,198,194,0.35)` con `blur: 40px` ya existe detrás del logo Hero (ENHANCE-2, hardcoded en `hero.tsx`). Añadir un segundo glow sobre el logo via easter egg en hover crea una colisión visual con el halo existente — dos capas de luz caliente apiladas. Cualquier diferencia sería imperceptible o, si se hace notable, violaría la regla "limpio > saturado". Además, el logo es una imagen JPEG con `mixBlendMode: multiply` — un glow interactivo sobre esa capa introduce complejidad de composición que escala mal en navegadores con aceleración de hardware limitada.

---

## Resumen de evaluación por gate

| # | EE | Brand coherence | UX neutral | Perf | A11y | Único catálogo | Removible | Prioridad |
|---|---|---|---|---|---|---|---|---|
| EE-01 | Ornamento ❦ respira | PASS | PASS — aria-hidden, pointer-events none | PASS — timeout + CSS transition nativa | PASS — reduced-motion fallback opacity-only | PASS — no hay interacción sobre ornamento tipográfico en catálogo | PASS — módulo aislado, flag config | ALTA |
| EE-02 | Konami code → frase a Nil | PASS | PASS — overlay no-blocking, pointer-events none, desaparece solo | PASS — keydown listener pasivo + timeout | PASS — reduced-motion fallback sin fade | PASS — catálogo vacío, Konami no usado en ningún proyecto | PASS — módulo aislado, flag config | ALTA |
| EE-03 | Quietud 28s | PASS | PASS — bottom-left corner, pointer-events none, 4s y desaparece | PASS — idle timer + IntersectionObserver 20% scroll | PASS — solo CSS fade, reduced-motion suprime fade | PASS — no hay idle-message en catálogo para ningún proyecto | PASS — módulo aislado, flag config | MEDIA |

---

## Notas finales para quality-gate y learning-loop-v2

- Ninguna de las tres propuestas toca fondos, paleta, tipografía base, layout ni estructura.
- Ninguna roza las secciones BLOQUEADAS (Products, Values 6 cards, CTA rojo).
- Todas son `aria-hidden` donde aplica, `pointer-events: none`, y con `prefers-reduced-motion` contemplado.
- El catálogo de `easter-egg-creator-memory.md` sigue vacío de entradas shippeadas — estas propuestas, si se implementan, deben añadirse al catálogo en ese momento.
- EE-02 (Konami) contiene copia personal hacia Nil: requiere confirmación explícita de Nil antes de implementar. La copia propuesta (`"Ella estaría orgullosa de lo que has construido."`) puede y debe ser ajustada por Nil si prefiere otra formulación — el trigger y el mecanismo son independientes de la copia.
- La fecha de cumpleaños de Mariana (disparador de fecha específica mencionado en el brief) **no se propone en este audit** porque Nil aún no ha confirmado la fecha. Cuando la proporcione, es un candidato natural para una cuarta iteración — un ornamento adicional que aparece ese día solo en la línea-tributo del footer, sin texto nuevo, solo un cambio de opacidad del `❦` existente.
