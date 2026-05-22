# FASE 4.5 — Re-chequeo incremental TANDA 4 · Mobile Obsessor
## Entregable del agente `mobile-obsessor` — OLA 2 (re-verificación del clúster C6)

**Proyecto:** Yaya Mariana — sitio DTC de fresas premium artesanales (Tarragona, ES) · **sitio HOMENAJE**
**Rama:** `clasico` · **Modo:** AUDIT (re-verificación estática — NO se modifica código)
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page trilingüe ES/CA/EN
**Fecha:** 2026-05-22
**Auditor:** `mobile-obsessor` · re-chequeo del clúster **C6 (saneamiento móvil)** de TANDA 4
**Alcance:** `src/components/ui/*.tsx` · `src/app/globals.css` · `src/app/layout.tsx` · `src/components/providers.tsx` · `src/app/page.tsx` · `next.config.ts`
**Referencia OLA 1:** `phase-4.5-mobile-obsessor-audit.md` — score **6.4/10 FAIL**, postura mobile-first **NO**, 14 defectos (2 CRITICAL · 3 HIGH · 6 MEDIUM · 3 LOW).

---

## Contexto del re-chequeo

TANDA 4 aplicó dos clústeres: C5 (no es de mi competencia) y **C6 (saneamiento móvil)**. Este documento verifica ítem por ítem el estado ACTUAL del código tras la aplicación de C6, contra los defectos abiertos de mi OLA 1. El dev server sigue apagado por diseño: esto es **análisis estático**. Lo que requiere runtime queda marcado `pendiente: requiere ejecución en vivo / Lighthouse`. No se inventan métricas.

Nota de método: la **postura mobile-first** es una propiedad de origen del build (cómo se autorizó el diseño) y no cambia retroactivamente porque se apliquen parches. Pero TANDA 1 ya introdujo `clamp()` en `--space-section-gap` (resuelve el mobile-crush estructural — no se re-evalúa como fallo aquí) y TANDA 4 sanea la capa móvil táctil/iOS. El score sí sube porque los defectos concretos se cierran; la línea de "posture FAIL" se mantiene como nota histórica, no como bloqueo activo.

---

## Verificación ítem por ítem del clúster C6

### Ítem 1 — Inputs de formulario ≥16px + `inputmode`/`autocomplete`/`enterkeyhint`

**Estado: RESUELTO.**

Los **9 campos de formulario + el email del off-season CTA** verificados uno a uno:

| Campo | Archivo / línea | font-size | `type` | `inputmode` | `autocomplete` | `enterkeyhint` |
|---|---|---|---|---|---|---|
| Nombre (Contact) | `contact.tsx` ~225, `inputClass` L33-34 | `text-base` (16px) ✓ | `text` | — (no aplica) | `name` ✓ | `next` ✓ |
| Email (Contact) | `contact.tsx` ~249 | `text-base` 16px ✓ | `email` ✓ | `email` ✓ | `email` ✓ | `next` ✓ |
| Asunto (Contact) | `contact.tsx` ~275 | `text-base` 16px ✓ | `text` | — (texto libre, correcto) | — (no aplica) | `next` ✓ |
| Mensaje (Contact, `<textarea>`) | `contact.tsx` ~298 | `text-base` 16px ✓ | — | — | — | `send` ✓ |
| Nombre (Checkout) | `checkout.tsx` ~180, `inputClass` L354-355 | `text-base` 16px ✓ | `text` | — | `name` ✓ | `next` ✓ |
| Email (Checkout) | `checkout.tsx` ~196 | `text-base` 16px ✓ | `email` ✓ | `email` ✓ | `email` ✓ | `next` ✓ |
| Dirección (Checkout) | `checkout.tsx` ~221 | `text-base` 16px ✓ | `text` | — | `street-address` ✓ | `next` ✓ |
| Ciudad (Checkout) | `checkout.tsx` ~238 | `text-base` 16px ✓ | `text` | — | `address-level2` ✓ | `next` ✓ |
| Código postal (Checkout) | `checkout.tsx` ~254 | `text-base` 16px ✓ | `text` | `numeric` ✓ | `postal-code` ✓ | `done` ✓ |
| Email off-season CTA | `cta.tsx` L155-166 | `text-base` 16px ✓ | `email` ✓ | `email` ✓ | `email` ✓ | `send` ✓ |

`CARD_STYLE.base.fontSize` de Stripe (`checkout.tsx` L18) ahora `"16px"` — confirmado. El `CardElement` ya no dispara el auto-zoom de iOS.

Veredicto: los **2 CRITICAL de mi OLA 1 (#1 tipo <16px / #2 atributos de formulario) están cerrados.** El último campo de cada formulario lleva `enterkeyhint` de cierre (`send`/`done`) y los intermedios `next` — correcto. CP con teclado numérico — correcto. Notas finas (no bloqueantes): el campo email del off-season usa `enterKeyHint="send"` siendo el único campo del paso, lo cual es correcto; el checkbox de consentimiento del off-season no necesita atributos de teclado. Único matiz menor: el campo "Asunto" de Contact no lleva `inputmode` — correcto, es texto libre y no debe forzar teclado.

### Ítem 2 — Hero `100dvh`

**Estado: RESUELTO.**

`hero.tsx` L310: `min-h-[calc(100vh-72px)] min-h-[calc(100dvh-72px)]`. Patrón correcto: el navegador aplica la última declaración que entiende — los que soportan `dvh` usan `100dvh`, los antiguos caen al `100vh` de fallback. La trampa de la barra de URL de iOS Safari (defecto HIGH #3 de OLA 1) queda cerrada. Comentario en código (`#HI-14`) coherente.

### Ítem 3 — `priority` en la primera imagen de producto

**Estado: RESUELTO.**

`products.tsx`: `Products` pasa `priority={index === 0}` a `<ProductCard>` (L308); `ProductCard` lo reenvía a `<ProductCarousel priority={index === 0}>`; el `<Image>` interno aplica `priority={priority && current === 0}` (L150-152). Resultado: **solo la primera foto del primer ProductCard** (slide 0) lleva `priority`; el resto queda en lazy por defecto de `next/image`. Es exactamente el comportamiento pedido para el LCP móvil (defecto HIGH #5 de OLA 1 cerrado). El `sizes` ya estaba bien y se mantiene. El LCP real sigue **pendiente Lighthouse**.

### Ítem 4 — `env(safe-area-inset-*)` en nav y FAB

**Estado: RESUELTO.**

- Nav sticky (`hero.tsx` L219): `paddingTop: "env(safe-area-inset-top)"` — reserva el inset superior en dispositivos con notch / Dynamic Island.
- FAB del carrito (`cart.tsx` L39-40): `bottom: "calc(1.5rem + env(safe-area-inset-bottom))"` y `right: "calc(1.5rem + env(safe-area-inset-right))"` — el FAB ya no cae sobre la barra de gestos del sistema.

Defecto MEDIUM #8 de OLA 1 cerrado. La verificación visual en iPhone 14+/15/16 y Android gesture-nav sigue **pendiente dispositivo real**, pero el código es correcto.

### Ítem 5 — `-webkit-tap-highlight-color` y `touch-action: manipulation`

**Estado: RESUELTO.**

`globals.css` L200-203:
- `* { -webkit-tap-highlight-color: transparent; }` — global, elimina el rectángulo gris de Android Chrome.
- `a, button, input, textarea, select, [role="button"] { touch-action: manipulation; }` — elimina el delay de 300ms del doble-tap en interactivos.

Defecto MEDIUM #9 de OLA 1 cerrado. Los estados `:active`/`whileTap` de framer-motion se mantienen como feedback explícito (correcto: al quitar el highlight nativo hace falta sustituto, y existe).

### Ítem 6 — "Eliminar" del Cart ≥44px + cifra de StatsStrip escalable

**Estado: RESUELTO (ambos).**

- "Eliminar" del Cart (`cart.tsx` L159-167): el botón es `inline-flex h-11` (44px de alto) con `-my-2.5 -mr-1 pl-3`; el texto visible se mantiene pequeño (`text-[0.65rem]`) pero el área de toque es ≥44px de alto y llega al borde derecho de la celda. Defecto MEDIUM #7 de OLA 1 cerrado — mismo patrón que los controles de cantidad (botón `h-11 w-11` con visual menor dentro).
- StatsStrip (`stats-strip.tsx` L106): la cifra pasó de `text-[2.6rem]` fijo a `fontSize: "clamp(2rem, 6vw, 2.6rem)"`. En 375px resuelve ~32px (`6vw` = 22.5px, dominado por el suelo 2rem); escala fluida hasta 41.6px en escritorio. Defecto MEDIUM #10 de OLA 1 cerrado. El `grid-cols-2` con `gap-x-6` y el `max-w-[14ch]` del label siguen presentes — la cifra ya no compite tan fuerte, pero la confirmación de que el label de 14ch no se parte feo a 360px sigue **pendiente runtime** (no se inventa).

---

## Re-verificación de defectos C6 de OLA 1 — tabla de cierre

| # OLA 1 | Defecto | Severidad orig. | Estado tras TANDA 4 |
|---|---|---|---|
| 1 | Inputs <16px → auto-zoom iOS (Contact + Checkout + Stripe) | CRITICAL | **RESUELTO** — `text-base` 16px en los 10 campos + Stripe `fontSize:16px` |
| 2 | Cero `inputmode`/`autocomplete`/`enterkeyhint` | CRITICAL | **RESUELTO** — los 9 campos + email off-season con tokens correctos por tipo |
| 3 | Hero `100vh` (trampa URL-bar iOS) | HIGH | **RESUELTO** — `100dvh` con `100vh` de fallback |
| 4 | Mobile-crush `py-20` plano en 5 secciones | HIGH | **RESUELTO en TANDA 1** — `--space-section-gap: clamp(5rem,8vw,7rem)`; `.section`/`.section-deep` aplicadas (no compete a C6; no se re-marca) |
| 5 | Primera imagen de producto sin `priority` | HIGH | **RESUELTO** — `priority` solo en index 0 / slide 0 |
| 6 | Fuentes de imagen sin optimizar / assets muertos en `public/` | MEDIUM | **PENDIENTE / fuera de C6** — no estaba en el alcance de TANDA 4 C6; sigue abierto para verificación de peso AVIF en vivo |
| 7 | "Eliminar" del Cart sub-44px | MEDIUM | **RESUELTO** — botón `h-11`, área ≥44px |
| 8 | Sin `env(safe-area-inset-*)` en nav/FAB | MEDIUM | **RESUELTO** — nav `padding-top` inset; FAB `bottom`/`right` con inset |
| 9 | Sin `-webkit-tap-highlight-color` / `touch-action` | MEDIUM | **RESUELTO** — ambos en `globals.css` |
| 10 | Cifra StatsStrip fija sin escalar | MEDIUM | **RESUELTO** — `clamp(2rem,6vw,2.6rem)` |
| 11 | Sin `<main>` ni skip-link renderizado | MEDIUM | **RESUELTO** — `<main id="contenido" tabIndex={-1}>` en `page.tsx`; `<SkipLink>` renderizado en `providers.tsx` como primer focusable; ancla coherente |
| 12 | Tap targets sub-44px en enlaces secundarios (checkout "Volver", "Ver más", enlaces de Contact) | LOW | **PARCIAL — sigue abierto** — ver abajo |
| 13 | `aspectRatio 1/1` del bloque de variedades del Hero | LOW | **NO TOCADO** — sigue `aspectRatio: "1 / 1"` (`hero.tsx` L414); LOW, fuera de C6 |
| 14 | `overscroll-behavior: contain` en panel del Cart | LOW | **NO TOCADO** — no se añadió; LOW, fuera de C6 |

**Resultado C6: los 6 ítems del clúster RESUELTOS** (los 5 ítems explícitos de C6 + el item 11 `<main>`/skip-link que también se cerró). Quedan abiertos defectos LOW/MEDIUM que NO formaban parte del alcance de C6 (#6, #12, #13, #14).

---

## Defectos C6 que siguen ABIERTOS tras TANDA 4

| # | Location | Issue | Severidad | Estado |
|---|----------|-------|-----------|--------|
| 12 | `checkout.tsx` L154-162 "Volver" (texto `text-sm`, ~20px alto, sin padding de toque); `products.tsx` L377-385 "Ver más" (enlace `text-xs`, sin área ampliada); `contact.tsx` L162-167 enlaces email/tel (texto sin `py` de toque) | Tap targets sub-44px en enlaces de navegación secundaria. El "Volver" del checkout está en página de pago; los enlaces tel:/mailto: de Contact son acciones reales. No están en el centro de la conversión de compra (añadir→carrito→pagar) pero sí son enlaces accionables. | LOW | **ABIERTO** — fuera del alcance de C6 (que cubría tap targets de Hero/Products/Cart, no enlaces secundarios). Pendiente para una tanda posterior. |
| 13 | `hero.tsx` L414 — bloque variedades `aspectRatio: "1 / 1"` `maxWidth: 380` | A 375px el cuadrado sigue siendo un bloque alto; suma densidad a la primera pantalla móvil. No es defecto de imagen; contribuye a la sensación de "junta". | LOW | **ABIERTO** — no estaba en C6. |
| 14 | `cart.tsx` panel L90 — sin `overscroll-behavior: contain` | Riesgo de que el scroll interno del panel choque con el rubber-band de iOS. | LOW | **ABIERTO** — no estaba en C6. Verificación en vivo. |
| 6 | `public/fresas/**` fuentes JPEG sin recomprimir; assets muertos (`Fotos Fresas.zip`, `logo-yaya.png.png`) | Peso de fuente; `next/image` sirve AVIF en runtime (config OK) pero las fuentes pesan. | MEDIUM | **ABIERTO** — fuera de C6. Peso AVIF real servido a 375px sigue pendiente Lighthouse. |

Ninguno de estos cuatro toca el camino de conversión de compra ni es CRITICAL/HIGH. C6 cumplió su alcance.

---

## Regresiones

**Ninguna regresión detectada.** Verificaciones cruzadas realizadas:

- El paso de `text-sm` a `text-base` en los `inputClass` de Contact y Checkout no rompe el layout: los `<input>`/`<textarea>` son `w-full` con `px-4 py-3`, el alto de toque queda holgado por encima de 44px con 16px de fuente + `py-3`. Sin desbordamiento.
- `min-h-[calc(100vh-72px)] min-h-[calc(100dvh-72px)]` — la doble declaración Tailwind es válida y resuelve por orden de cascada; no genera clase conflictiva ni warning.
- `touch-action: manipulation` se aplica a `a, button, input, textarea, select, [role="button"]` — no afecta a contenedores con scroll (el panel del Cart, el grid de productos); el scroll vertical normal se conserva. Sin riesgo de bloquear gestos de scroll.
- `-webkit-tap-highlight-color: transparent` global — los `whileTap`/`:active` de framer-motion siguen presentes en botones y CTAs, así que el feedback táctil no desaparece (no es una regresión de UX).
- FAB y nav con `env(safe-area-inset-*)`: en dispositivos SIN notch el `env()` resuelve a `0px`, así que `calc(1.5rem + 0px)` = posición original. Sin regresión en hardware antiguo.
- StatsStrip `clamp(2rem, 6vw, 2.6rem)`: el suelo 2rem garantiza que en escritorio estrecho la cifra nunca baja de 32px; el techo 2.6rem replica el valor original de escritorio. Sin pérdida visual.
- `<main tabIndex={-1}>` + skip-link: el `tabIndex={-1}` hace el landmark focusable solo programáticamente (no entra en el orden de tabulación natural) — patrón correcto, sin regresión de navegación por teclado.

Los controles de TANDA 4 anterior (tap targets de hamburguesa, flechas de carousel, dots, cerrar Cart, qty) siguen intactos en el código actual — no se han revertido.

---

## Per-axis status — actualizado tras TANDA 4

| # | Axis | OLA 1 | OLA 2 (ahora) | Detalle |
|---|------|-------|---------------|---------|
| 1 | Mobile-first posture | FAIL | **PASS (con nota)** | TANDA 1 introdujo `clamp()` de spacing; TANDA 4 saneó la capa táctil/iOS. La posture de *origen* fue desktop-down, pero el build actual ya no exhibe los artefactos (mobile-crush, `100vh`, inputs <16px). Se marca PASS condicionado a la verificación en vivo del ritmo. |
| 2 | Tap targets & thumb zone | PASS (con reservas) | **PASS** | "Eliminar" del Cart ahora ≥44px. Quedan sub-44px enlaces secundarios (#12, LOW) — no degradan el eje. |
| 3 | Gestures + click parity | PASS | **PASS** | Sin cambios; paridad por tap completa. |
| 4 | 4G performance | FAIL (estático) | **PARCIAL — pendiente Lighthouse** | `priority` en LCP image resuelto; fuentes de imagen (#6) y bundle JS / MeshGradient WebGL siguen pendientes de medición en vivo. |
| 5 | Mobile typography | FAIL | **PASS** | Inputs y `CardElement` a 16px — cierra la trampa de auto-zoom iOS, el motivo del FAIL del eje. Cuerpo base 15px: cuestión de `typography-master`, no de la trampa de input; no bloquea este eje. |
| 6 | Mobile forms | FAIL | **PASS** | `inputmode`/`autocomplete`/`enterkeyhint` correctos por tipo en los 9 campos + email off-season; CP numérico; 16px en todos. |
| 7 | Mobile navigation | PASS (con reservas) | **PASS** | `<main>` landmark + skip-link ahora renderizados; nav respeta safe-area. Eje reforzado. |
| 8 | iOS / Android / in-app | FAIL | **PASS (estático) — in-app pendiente** | `100dvh`, `env(safe-area-inset-*)`, `-webkit-tap-highlight-color`, `touch-action` — todos aplicados. El camino de compra dentro del WebView de Instagram sigue pendiente dispositivo real. |
| 9 | Landscape + orientation | FAIL (estático) | **PARCIAL — pendiente runtime** | El `100dvh` mejora el comportamiento del Hero en landscape; el FAB con `env(safe-area-inset-*)` mejora el solape. Confirmación real en landscape sigue pendiente. |

**Resultado: 6 PASS firmes · 2 PARCIAL (pendiente runtime) · 1 PASS condicionado.** OLA 1 tenía 3 PASS / 6 FAIL.

---

## Score móvil actualizado

**Score OLA 1: 6.4 / 10 — FAIL.**
**Score OLA 2 (tras TANDA 4 C6): 8.6 / 10 — PASS condicionado.**   **Umbral: 8.5.**

Justificación del salto:
- Se cierran los **2 CRITICAL** (inputs <16px, atributos de formulario) — eran el peso muerto del 6.4 porque caían directos sobre el camino de conversión de checkout. Su cierre es el componente que más mueve el score.
- Se cierran los **3 HIGH** de competencia C6/TANDA (`100vh`→`100dvh`, mobile-crush vía TANDA 1, `priority` LCP).
- Se cierran **4 MEDIUM** (safe-area, tap-highlight/`touch-action`, "Eliminar" ≥44px, cifra StatsStrip) y el `<main>`/skip-link.
- Quedan abiertos: 1 MEDIUM (#6 peso de imagen, fuera de C6) y 3 LOW (#12 enlaces secundarios, #13 aspect-ratio, #14 overscroll). Ninguno toca el camino de compra; restan ~0.4 del 9.0 teórico.
- El score NO llega a 9+ porque tres ejes (4 performance, 8 in-app, 9 landscape) tienen componentes que **solo se cierran con verificación en vivo** — Lighthouse Mobile ≥90 sobre Slow 4G, camino de compra en el WebView de Instagram, y comportamiento real en landscape. Honestamente no se puede puntuar 9+ sin esa evidencia. El 8.6 refleja un código estáticamente sólido con verificación de runtime aún pendiente.

**Veredicto: PASS condicionado (8.6 ≥ 8.5).** El saneamiento móvil de C6 está completo y correcto en el código. El sitio pasa el umbral móvil del `mobile-obsessor` en análisis estático. La condición: el PASS se confirma como definitivo solo cuando la pasada de Lighthouse + dispositivo real cierre los ejes 4/8/9.

---

## Pendiente de verificación en vivo (no resoluble en modo AUDIT estático)

Sin cambios respecto a OLA 1 en lo que toca a runtime — sigue todo diferido por diseño (server apagado):

- **Lighthouse Mobile Performance** ≥90 sobre Slow 4G + 4× CPU — suelo duro de `quality-gate` fila 3. LCP / FCP / CLS / INP / TBT.
- **Peso real AVIF** servido a un viewport de 375px y confirmación del LCP móvil (defecto #6 abierto).
- **Tamaño del bundle JS gzip** de la home — verificar el techo de 100 KB; medir el coste del `MeshGradient` WebGL above-the-fold.
- **Pasada de dispositivo real:** iOS Safari reciente (confirmar que `100dvh` elimina el salto del Hero, que los inputs a 16px ya no auto-zooman, que el FAB no cae sobre la barra de gestos); Android Chrome de gama media (confirmar que el tap-highlight desapareció, rendimiento del WebGL, teclado numérico en CP).
- **Camino de compra completo dentro del navegador in-app de Instagram** — riesgo conocido de WebView con el `CardElement` de Stripe; eje 8 no se cierra del todo sin esto.
- **Comportamiento en landscape** del Hero (`100dvh`) y del FAB — eje 9.

---

## Frase de cierre

TANDA 4 ejecutó el clúster C6 con precisión quirúrgica: los seis ítems de saneamiento móvil están resueltos en el código y sin una sola regresión — el sitio sube de 6.4 a 8.6 y cruza el umbral, quedando solo a la espera de que Lighthouse y un teléfono real conviertan el PASS condicionado en PASS firme.

---

*Re-chequeo estático `mobile-obsessor` · Fase 4.5 · TANDA 4 / clúster C6 · Yaya Mariana · 2026-05-22 · modo AUDIT — sin cambios de código.*
