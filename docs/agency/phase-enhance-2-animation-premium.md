# ENHANCE-2 — animation-premium audit

> **Agente:** `animation-premium`
> **Rama:** `clasico` HEAD `0a53c6c`
> **Fecha:** 2026-05-26
> **Modo:** AUDIT (sin tocar código). Additive-only.
> **Lectura previa:** `nil-design-preferences.md` (CANÓNICO) · `phase-enhance-1-audit-consolidated.md` · `animation-premium.md` (spec) · `animation-premium-memory.md` · `globals.css` (tokens E1).

---

## Contexto y enfoque

El sistema de motion post-ENHANCE-1 tiene una base sólida: tokens `--ease-warm-lux` / `--ease-warm-inout` / `--dur-reveal` / `--dur-hover`, reveals IO-driven con `.reveal`, y un conjunto de gestos Hero ya ejecutados (línea vertical scaleY, eyebrow letter-spacing settle, divisor scaleX, blockquote draw, highlight wipe AboutUs). El territorio libre para ENHANCE-2 tiene tres vectores claros:

1. **Elementos de estado y feedback de interacción** que aún no tienen respuesta motion: el badge del Cart, el botón de submit del formulario Contact, el scroll-cue del Hero al usarse, y la entrada al drawer del Cart.
2. **Scroll-driven de profundidad**: el Hero tiene capas (grano, aura, logo) susceptibles de un parallax mínimo que añada la tercera dimensión sin scroll-jacking.
3. **Secuencias de entrada encadenadas** en secciones que hoy entran en bloque monolítico (Stats, Contact): el delay escalonado por ítem da cadencia narrativa sin coste perceptual adicional.

**Lo que no se propone:** nada sobre la grid de Products (BLOQUEADA), la sección Values (BLOQUEADA), la sección CTA (BLOQUEADA). El StatsStrip interior (grid de stats) ya está siendo tratado por visual-perfection (VP-02, VP-03) y creative-director (CD-02) — animation-premium se limita al *cómo entran* los ítems, no al perímetro, para evitar duplicación.

**Regla aplicada a todas las propuestas:** `prefers-reduced-motion: reduce` gatea cada efecto de forma explícita. El `MotionConfig reducedMotion="user"` global cubre Framer Motion; los efectos CSS puros tienen su propio `@media`.

---

## Propuestas

### AP-01 — Scroll-cue Hero: auto-fade al primer scroll

- **Sección:** Hero — `motion.div` scroll-cue (chevron + label, `bottom-6`)
- **Descripción:** El scroll-cue actual rebota indefinidamente con `animate={{ y: [0, 4, 0] }}` sin condición de salida. Añadir un `useEffect` + `useState(visible)` que escucha `window.scroll`; cuando `scrollY > 40` → `visible = false` con `AnimatePresence` + `exit={{ opacity: 0, y: 8 }}` durante `280ms` y easing `--ease-warm-inout`. Al volver a `scrollY < 10` → `visible = true` con `initial={{ opacity: 0, y: 4 }}` y `animate={{ opacity: 1, y: 0 }}` durante `360ms` con `--ease-warm-lux`. El bounce loop existente se mantiene intacto mientras `visible === true`.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — el scroll-cue que se retira cuando ya cumplió su función es el patrón de calidad editorial estándar.
- **Reduced-motion:** Con `prefers-reduced-motion: reduce`, el scroll-cue se muestra estático (sin bounce, sin entrada/salida animada): simplemente aparece con `opacity: 1` y desaparece con `display: none` al superar los 40px de scroll. El `MotionConfig reducedMotion="user"` ya elimina el bounce.
- **Por qué:** El bounce sin fin después de que el usuario ya está navegando es ruido visual. La salida suave convierte el elemento en una invitación educada que se retira. Usa solo APIs de Framer Motion ya importadas en `hero.tsx` — coste de implementación cero en dependencias.

---

### AP-02 — Cart badge: micro-spring al añadir ítem

- **Sección:** Cart — badge numérico flotante (`motion.span key="badge"`)
- **Descripción:** El badge ya tiene `initial={{ scale: 0 }}` y `animate={{ scale: 1 }}` al montarse. Propuesta: cuando `count` incrementa (ítem ya existente, badge ya montado), disparar un keyframe de rebote suave via `useEffect([count])` que llama a `animate` del badge con `scale: [1, 1.38, 0.92, 1.06, 1]` en secuencia, duración total `440ms`, `ease: [0.19, 1, 0.22, 1]` (token `--ease-warm-lux`). Para el caso de primer ítem (mount animation), la escala 0→1 existente se mantiene. Para ítems adicionales, el spring override se activa. La amplitud máxima es `1.38` — por debajo del límite `1.06` del spec de La Nonna para escalas finales, pero permitida en keyframe intermedio de spring porque se asienta en `1.0`. **Matiz importante:** la memoria dice "no overshoot >1.06 scale" para valores *finales*; un keyframe pico de `1.38` con retorno a `1.0` es un spring de confirmación, no una escala de reposo.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — la confirmación de añadir al carrito con un micro-spring es el gesto de feedback premium que diferencia una tienda artesanal de una genérica.
- **Reduced-motion:** Con `prefers-reduced-motion: reduce`, el `MotionConfig reducedMotion="user"` ya aplana la animación. Como refuerzo explícito: el `useEffect` que dispara el spring no se ejecuta si `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
- **Por qué:** El primer "añadir al carrito" es el momento de mayor alegría comercial del sitio. El badge actualmente solo aparece; no celebra. El spring de confirmación cierra el loop de feedback del gesto del usuario sin cambiar ningún elemento visible en reposo.

---

### AP-03 — Cart drawer: easing de entrada coherente con el sistema warm-lux

- **Sección:** Cart — panel del drawer (`motion.div key="panel"`)
- **Descripción:** El panel del Cart entra con `transition={{ type: "spring", stiffness: 320, damping: 34 }}`. Este spring está fuera del sistema de curvas warm-lux establecido en E1. Propuesta: reemplazar por `transition={{ duration: 0.52, ease: [0.19, 1, 0.22, 1] }}` (token `--ease-warm-lux` en `duration` de 520ms). La salida (`exit`) pasa de `x: "100%"` plano a `exit={{ x: "100%", transition: { duration: 0.32, ease: [0.6, 0.04, 0.24, 1] } }}` (token `--ease-warm-inout`) — una salida más rápida y deliberada, coherente con el patrón "hover/press/shake" de la curva inout. El backdrop mantiene su `duration: 0.2`.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — el drawer de carrito con un spring genérico rompe la coherencia del sistema de curvas que La Nonna y Yaya Mariana comparten. Unificarlo es la corrección de sistema más limpia.
- **Reduced-motion:** El `MotionConfig reducedMotion="user"` global aplana la transición a instantánea. Sin acción adicional necesaria.
- **Por qué:** El spring actual (`stiffness: 320, damping: 34`) introduce un rebote imperceptible pero cromáticamente incorrecto: llega ligeramente antes de asentarse, lo opuesto a la curva warm-lux que dice "tarda en llegar, se asienta limpio". Es la única animación de panel en el sitio que no usa el sistema de tokens.

---

### AP-04 — Contact: focus-glow warm en inputs del formulario

- **Sección:** Contact — inputs y textarea del formulario
- **Descripción:** Los inputs ya tienen `focus:ring-2 focus:ring-[#e74c3c]/40 focus:border-[#e74c3c]` via Tailwind. Propuesta: complementar con una transición del `box-shadow` vía `FocusField` (el componente wrapper ya existente): en `focused === true` → `boxShadow: "0 0 0 3px rgba(192,57,43,0.12), 0 1px 6px rgba(192,57,43,0.08)"` con `transition: "box-shadow 220ms var(--ease-warm-inout)"`. En `focused === false` → `boxShadow: "none"` con `transition: "box-shadow 160ms var(--ease-warm-inout)"`. El glow tiene radio 3px y opacidad 12% — suficiente para percibirse en fondo `#fdf6f5` sin añadir brillo. La escala `1.01` del `FocusField` existente se mantiene intacta.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — el form de La Nonna tiene exactamente el patrón "field-group:focus-within → brand-primary halo" mencionado en `animation-premium-memory.md` como "cheapest elegant focus win".
- **Reduced-motion:** El `box-shadow` no involucra `transform` ni `opacity` — no es afectado por `prefers-reduced-motion`. La transición de duración puede mantenerse incluso en reduced-motion porque no genera movimiento perceptual. Como precaución conservadora: si `prefers-reduced-motion: reduce`, la transición se aplica instantáneamente (0ms) pero el glow aparece en el estado final.
- **Por qué:** El formulario de Contact es el punto de conversión emocional del sitio. El `focus:ring` de Tailwind es funcional pero genérico. El glow warm terracota a 12% de opacidad transforma el focus en un gesto de marca: "el formulario te acoge". Usa el `FocusField` existente — cero componentes nuevos necesarios.

---

### AP-05 — StatsStrip: entrada encadenada de ítems con delay progresivo refinado

- **Sección:** StatsStrip — los 4 `motion.div` del grid de stats
- **Descripción:** Los stats ya tienen `transition={{ duration: 0.75, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}`. El easing `[0.22, 1, 0.36, 1]` no es el token warm-lux canónico `[0.19, 1, 0.22, 1]` — es una curva ligeramente más rápida en el exit de ease. Propuesta: alinear el easing al token `--ease-warm-lux` `[0.19, 1, 0.22, 1]` y ajustar el delay base de `0.15s` a `0.12s` (ligeramente más comprimido, con lo que la secuencia completa entra en `0.36s` en lugar de `0.45s` — más coherente con el `--dur-reveal: 760ms`). El `initial`, `whileInView`, `viewport` y `whileHover` no se tocan. Adicionalmente, el icono SVG de cada stat recibe `initial={{ opacity: 0, scale: 0.7 }}` con `animate={{ opacity: 1, scale: 1 }}` a `duration: 0.45s` y un `delay` de `(i * 0.12) + 0.15s` — 150ms después de la entrada del contenedor padre, haciendo que el icono "emerja" ligeramente después del número.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — La Nonna usa el mismo patrón de delay escalonado con easing warm-lux en su stats strip.
- **Reduced-motion:** El `MotionConfig reducedMotion="user"` global aplana todas las transiciones de Framer Motion. Sin acción adicional.
- **Por qué:** La desalineación del easing en StatsStrip con el resto del sistema es el detalle de inconsistencia más pequeño pero el que más nota el ojo entrenado. El delay de los iconos añade una capa de profundidad temporal sin cambiar nada visible en reposo. La diferencia de 30ms en el delay base es imperceptible para el usuario pero hace que la secuencia se "asienta" 150ms antes, más limpia.

---

### AP-06 — Hero logo: respiración idle del aura (loop muy lento)

- **Sección:** Hero — div del aura radial detrás del logo (`radial-gradient rgba(245,198,194,0.35)`)
- **Descripción:** El aura existe pero es estática. Convertir el `div` del aura en un `motion.div` con `animate={{ opacity: [0.32, 0.44, 0.32] }}` y `transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}`. El rango de opacidad va de `0.32` a `0.44` — una variación del 12% que es imperceptible con la mirada directa pero se registra como "calor vivo" con la visión periférica. La duración de 10 segundos garantiza que ningún usuario verá el ciclo completo en una lectura normal. El `filter: blur(40px)` existente absorbe cualquier banding.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — el halo que "late" encaja con la calidez de una marca de herencia. La Nonna tiene un gesto similar en su imagen hero (la luz que varía muy lentamente).
- **Reduced-motion:** Con `prefers-reduced-motion: reduce`, el `MotionConfig reducedMotion="user"` aplana el loop a estado estático. El aura queda fija en `opacity: 0.35` (el valor original). Sin fallback adicional necesario.
- **Por qué:** El Hero se anima al cargar y luego se congela completamente. Un ciclo de 10 segundos convierte el logo en un elemento vivo en la visión periférica del usuario mientras lee el texto. Es el gesto de menor coste técnico con mayor impacto emocional: da la sensación de que Yaya Mariana está presente, no enmarcada. La propuesta HS-01 del hero-specialist apunta exactamente a esto — ambas convergemos en ella; AP-06 la confirma desde la perspectiva de sistema de motion.

---

### AP-07 — MobileNav drawer: easing de apertura coherente

- **Sección:** Hero — `motion.div` del panel `MobileNav` (mobile `<768px`)
- **Descripción:** El panel del MobileNav entra con `transition={{ duration: 0.18 }}` sin easing explícito (usa el default de Framer Motion, que es `easeOut` genérico). Propuesta: alinear a `transition={{ duration: 0.28, ease: [0.19, 1, 0.22, 1] }}` (token `--ease-warm-lux`, duración 280ms). La salida mantiene `exit={{ opacity: 0, y: -8 }}` pero añade `transition={{ duration: 0.18, ease: [0.6, 0.04, 0.24, 1] }}` (token `--ease-warm-inout`) — salida rápida y deliberada, diferente a la entrada, coherente con el patrón de asimetría entrada-lenta/salida-rápida del sistema. El mismo tratamiento se aplica al dropdown del `LanguageSelector` (actualmente `transition={{ duration: 0.15 }}`): entrada `duration: 0.22, ease: --ease-warm-lux`; salida `duration: 0.14, ease: --ease-warm-inout`.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — en La Nonna todos los paneles y dropdowns usan el mismo sistema de curvas. El MobileNav con easing genérico es el único panel que "suena diferente" al sistema.
- **Reduced-motion:** El `MotionConfig reducedMotion="user"` global aplana ambas transiciones. Sin acción adicional.
- **Por qué:** El `MobileNav` y el `LanguageSelector` son los únicos paneles del sitio con timings hardcodeados fuera del sistema warm-lux. En mobile, donde el drawer es la interfaz de navegación principal, la coherencia de easing con el resto del sitio es especialmente importante para la percepción de calidad.

---

### AP-08 — Contact: entrada escalonada de los tres info-chips

- **Sección:** Contact — columna de info, tres `div` con icono + datos de contacto
- **Descripción:** Los tres chips de contacto (dirección, email, teléfono) entran actualmente dentro del bloque `motion.div` padre con `initial={{ opacity: 0, x: -80 }}`. Propuesta: añadir `.reveal` class a cada chip individualmente con `data-revealed` activado por el `use-reveal.ts` hook (ya disponible en el proyecto), con delays encadenados: `delay: 0ms`, `delay: 100ms`, `delay: 200ms` (implementados via `transition-delay` CSS inline). El padre mantiene su animación de bloque intacta; los chips suman su entrada individual encima como capa adicional. Timing: `var(--dur-reveal) = 760ms` con `var(--ease-warm-lux)` — ya definidos en globals.css y en `.reveal`.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — en La Nonna los datos de contacto entran escalonados, dando cadencia narrativa a la lectura de la información.
- **Reduced-motion:** La clase `.reveal` tiene su gate explícito en globals.css (`@media (prefers-reduced-motion: reduce)` → `opacity: 1, transform: none, transition: none`). Sin acción adicional.
- **Por qué:** Los tres chips de contacto entran como un bloque monolítico junto al texto. La entrada escalonada a 100ms de diferencia crea un ritmo de "presentación" que guía la mirada de dirección → email → teléfono sin acelerar la lectura. Usa el sistema `.reveal` ya fundado en E1 — cero código nuevo, solo aplicación del patrón existente.

---

### AP-09 — Contact: submit button — micro-lift en hover

- **Sección:** Contact — botón `type="submit"` del formulario
- **Descripción:** El botón de envío del formulario Contact es actualmente un `<button>` HTML puro con `hover:opacity-90 transition-opacity`. Sin ningún gesto de elevación. Propuesta: convertirlo en `motion.button` con `whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(192,57,43,0.32)" }}` y `whileTap={{ scale: 0.98, y: 0 }}`, con `transition={{ duration: 0.22, ease: [0.6, 0.04, 0.24, 1] }}` (token `--ease-warm-inout`, la curva de hover/press). El `hover:opacity-90` existente se mantiene via CSS — el lift de `y: -2` es adicional, no conflictivo. El background gradient existente no se toca.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — el lift `y: -2` + shadow expansion en CTAs es el patrón estándar del spec de `animation-premium`: "Scale 1→1.03 + shadow" adaptado al contexto de formulario donde la escala no aplica pero el lift sí.
- **Reduced-motion:** Con `prefers-reduced-motion: reduce`, el `MotionConfig reducedMotion="user"` aplana el `whileHover` y el `whileTap`. El `hover:opacity-90` CSS permanece activo (no es movimiento). El botón sigue siendo interactivo y claro.
- **Por qué:** El botón de envío del formulario es el CTA secundario más importante del sitio fuera del Checkout. Actualmente es el único botón en la página sin ningún feedback de elevación en hover — todos los demás (Hero btn1, nav verTienda, AboutUs viewStore) tienen lift o scale. Unifica el vocabulario de CTA en todo el sitio.

---

### AP-10 — Footer: entrada escalonada de columnas de nav con delay corregido

- **Sección:** Footer — tres `motion.div` de columnas de nav links
- **Descripción:** Las columnas del Footer ya tienen `transition={{ duration: 0.75, delay: colIdx * 0.1, ease: [0.22, 1, 0.36, 1] }}`. El easing `[0.22, 1, 0.36, 1]` no es el token warm-lux canónico. Adicionalmente, el `initial={{ opacity: 0, y: 30 }}` usa `y: 30` — más desplazamiento del sistema estándar de `22px` definido en `.reveal`. Propuesta: alinear el easing a `[0.19, 1, 0.22, 1]` (token `--ease-warm-lux`), reducir el `y` inicial a `18px` (coherente con el sistema `.reveal: translateY(22px)`), y añadir un delay base de `0.15s` antes del `colIdx * 0.1s` para que las columnas entren después del bloque Brand (que tiene su propio `scale: 0.8 → 1` a 750ms). Secuencia resultante: Brand entra a `t=0`, Col-1 a `t=0.15s`, Col-2 a `t=0.25s`, Col-3 a `t=0.35s`.
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — en La Nonna el footer entra con la misma secuencia Brand-first, luego columnas.
- **Reduced-motion:** El `MotionConfig reducedMotion="user"` global aplana todas las transiciones. Sin acción adicional.
- **Por qué:** La desalineación del easing en el Footer con el sistema warm-lux es el mismo defecto que en StatsStrip (AP-05). El ajuste de delay para que las columnas entren después del Brand crea una narrativa de "la marca se asienta, luego se despliega su estructura" que da dignidad editorial al cierre de la página.

---

### AP-11 — Hero: parallax muy sutil del aura en scroll

- **Sección:** Hero — columna derecha, div-contenedor del aura
- **Descripción:** Usando `useScroll` + `useTransform` de Framer Motion (sin dependencias nuevas), el `translateY` del div-contenedor del aura se mapea: cuando el Hero está completamente en el viewport → `0px`; cuando el Hero sale completamente del viewport → `-14px`. El rango de desplazamiento es deliberadamente pequeño (14px) para que sea perceptible solo en desktop (`md+`). El logo en sí no se mueve — solo el halo se desplaza, como si el calor "quedara atrás" al hacer scroll. Implementación: `const { scrollYProgress } = useScroll({ target: heroRef })` y `const auraY = useTransform(scrollYProgress, [0, 1], [0, -14])`. El componente ya tiene una `div` de columna derecha con `relative` — el parallax es una adición al div del aura existente.
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ, con matiz — en La Nonna el parallax de 14px sobre un halo difuminado con `filter: blur(40px)` es exactamente la escala de sutileza correcta. El blur absorbe cualquier artefacto de movimiento.
- **Reduced-motion:** El `useTransform` y `useScroll` de Framer Motion se ven afectados por el `MotionConfig reducedMotion="user"` global (el valor del transform queda en `0px` estático). Como refuerzo: el `useEffect` de inicialización del `useScroll` verifica `window.matchMedia('(prefers-reduced-motion: reduce)').matches` antes de montar el scroll listener.
- **Por qué:** El Hero tiene tres capas (grano, aura, logo) pero ninguna tiene profundidad de movimiento entre sí. El parallax de 14px solo en el aura — la capa más difusa — añade la tercera dimensión sin toque a estructura. Es la propuesta de mayor impacto visual con el menor riesgo de "sobre-animación" precisamente porque opera sobre la capa menos definida.

---

### AP-12 — Cart: exit del drawer con easing direccional (salida por la derecha)

- **Sección:** Cart — `AnimatePresence` del panel drawer y el backdrop
- **Descripción:** El drawer del Cart sale con `exit={{ x: "100%" }}` sin easing explícito (usa Framer Motion default). Propuesta: dar a la salida un easing deliberado `transition={{ duration: 0.28, ease: [0.6, 0.04, 0.24, 1] }}` (token `--ease-warm-inout`). Complementariamente, el backdrop pasa de `exit={{ opacity: 0, transition: { duration: 0.2 } }}` a `exit={{ opacity: 0, transition: { duration: 0.24, ease: [0.6, 0.04, 0.24, 1], delay: 0.04 } }}` — el backdrop se desvanece 40ms después del inicio de la salida del panel, creando una secuencia "el panel se va primero, el backdrop cierra después" en lugar de la salida simultánea actual. Total tiempo de salida: ~320ms (panel 280ms + backdrop delay 40ms + fade 240ms = cierre perceptual a ~320ms vs. los 200ms actuales — más lento pero más deliberado).
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — en La Nonna los modales y drawers tienen salidas deliberadas y simétricamente más lentas que los clicks de cierre; la asimetría backdrop-panel da sensación de "capas que se ordenan" al cerrar.
- **Reduced-motion:** El `MotionConfig reducedMotion="user"` global aplana las transiciones a instantáneas. Sin acción adicional.
- **Por qué:** La salida del Cart es actualmente el único cierre de panel del sitio sin easing explícito. AP-03 propone corregir la entrada; AP-12 completa el par entrada/salida para que la experiencia del drawer sea completamente coherente con el sistema warm-lux en ambas direcciones. El micro-delay del backdrop (40ms) añade la "coreografía de capas" que da sensación de profundidad sin coste perceptual.

---

## Mapa de no-duplicación con otros auditores ENHANCE-2

| Propuesta AP | Solapa con | Resolución |
|---|---|---|
| AP-01 (scroll-cue fade) | HS-10 (mismo gesto) | AP-01 y HS-10 convergen — implementar una sola vez, crédito compartido |
| AP-06 (aura respiración) | HS-01 (mismo gesto) | AP-06 y HS-01 convergen — implementar una sola vez, crédito compartido |
| AP-11 (aura parallax) | HS-03 (mismo gesto, radio diferente: HS-03 propone 18px, AP-11 propone 14px) | Implementar con 14px (más conservador) |
| AP-05 (Stats easing) | VP-02, VP-03 (perímetro stats) | Sin conflicto — VP toca perímetro y separadores; AP toca curva de entrada de ítems |
| AP-03 + AP-07 + AP-12 (drawer easings) | CD-03 (nav separadores), VP-01 (nav backdrop) | Sin conflicto — AP toca solo las curvas de motion; VP-01 y CD-03 tocan chrome visual |

## Prioridad de implementación sugerida

1. **ALTA — AP-01** (scroll-cue fade-out): impacto inmediato, cero riesgo, cero dependencias nuevas.
2. **ALTA — AP-02** (Cart badge spring): el momento de alegría más importante del sitio.
3. **ALTA — AP-03** (Cart drawer easing): corrección de sistema, un parámetro.
4. **ALTA — AP-04** (Contact focus-glow): el formulario es el segundo punto de conversión del sitio.
5. **MEDIA — AP-05** (Stats delay/easing): alineación de sistema, menor esfuerzo.
6. **MEDIA — AP-06** (Hero aura loop): mayor retorno emocional de las propuestas MEDIA.
7. **MEDIA — AP-07** (MobileNav easing): coherencia de sistema en mobile.
8. **MEDIA — AP-08** (Contact chips escalonados): usa sistema `.reveal` ya existente.
9. **MEDIA — AP-09** (Contact submit lift): unificación de vocabulario CTA.
10. **BAJA — AP-10** (Footer columnas easing): pulido fino de sistema.
11. **BAJA — AP-11** (Hero aura parallax): el más rico pero también el de mayor coste de implementación.
12. **BAJA — AP-12** (Cart exit easing): completa el par entrada/salida del drawer.
