# FASE 4.5 — Auditoría QA Visual · Mobile Obsessor
## Entregable del agente `mobile-obsessor`

**Proyecto:** Yaya Mariana — sitio DTC de fresas premium artesanales (Tarragona, ES) · **sitio HOMENAJE**
**Rama:** `clasico` · **Modo:** AUDIT (detección + propuesta — NO se modifica código)
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page trilingüe ES/CA/EN
**Fecha:** 2026-05-22
**Auditor:** `mobile-obsessor` · 9 ejes · umbral 8.5/10
**Alcance:** `src/app/page.tsx` · `src/components/ui/*.tsx` · `src/app/globals.css` · `src/app/layout.tsx` · `next.config.ts` · `/checkout`

---

## Mobile Audit — Yaya Mariana — Site-wide (Home single-page + /checkout)

**Mobile-first posture verified:** **NO** — el sitio está autorizado *desktop-down*. Evidencia concreta abajo (§ Posture).
**Audience mobile-traffic share (expected):** **~70–80%** — DTC de producto fresco artesanal con tono homenaje; el tráfico real llega de Instagram, Google ("fresas Tarragona", "fresa Mágnum"), y enlaces compartidos por WhatsApp/familia. Perfil de cliente: comprador local en Android Chrome de gama media, cliente mayor en iOS Safari comprobando precio/origen, visitante en navegador in-app de Instagram. (Patrón heredado de `mobile-obsessor-memory` — perfil artesanal/heritage; aquí el carrito Stripe es la conversión, no una reserva.)
**Devices tested (real):** **NINGUNO — auditoría ESTÁTICA.** El dev server está apagado a propósito. Todo lo de abajo es análisis estático de clases Tailwind, breakpoints, `next/image`, atributos de formulario y navegación sobre el código fuente. Lo que requiere runtime queda marcado **`pendiente: requiere ejecución en vivo / Lighthouse`**.
**Throttling profile:** Slow 4G + 4× CPU — **pendiente: requiere ejecución en vivo.**
**Overall score:** **6.4 / 10**   **Threshold:** 8.5 → **FAIL**

---

## Posture — ¿mobile-first o desktop-down?

**Veredicto: desktop-down con un parche responsive.** El build NO fue autorizado a 375px primero. Evidencia estática, irrefutable:

1. **Un solo breakpoint en todo el sitio: `md:` (768px).** No existe `sm:`-como-escalado-de-spacing, no hay `lg:` salvo en grids de producto/valores, no hay tablet intermedio. El patrón Tailwind correcto mobile-first es declarar el valor pequeño como base y *subir* (`py-12 md:py-20`). Aquí ocurre lo contrario: el valor de escritorio es la **base** y `md:` no lo rebaja — lo confirma.
2. **`py-20` plano (80px) en CINCO secciones** (`Products`, `AboutUs`, `Values`, `CTA`, `Contact`) sin escalar a móvil. 80px de padding vertical es una decisión de escritorio aplicada tal cual a 375px. El sistema de Fase 3 (`phase-3-design-system.md` §6 G-3) y la memoria de `spacing-perfectionist` exigen `clamp()` con término fluido — aquí no se usa en ninguna sección. Esto es el "mobile-crush" exacto que reporta Nil: en escritorio respira; a 375px el mismo 80px se siente como bloques pesados que no dejan jerarquía.
3. **El Hero usa `pt-16 pb-20` + `min-h-[calc(100vh-72px)]`** — altura completa de viewport heredada de un diseño de escritorio. A 375×667 (iPhone SE) el bloque blanco de variedades 380×380 + la columna de texto no caben en una pantalla y la altura mínima fuerza scroll desde el primer pixel.
4. **Tipografía partida con `md:` de forma binaria, no escalada:** los `<h2>` de sección son `text-4xl md:text-5xl` (36px → 48px). 36px es un H2 móvil aceptable, pero la decisión binaria 36/48 sin paso intermedio confirma que el diseño se concibió a 1440px y se "bajó" un escalón, no que se diseñara a 375px y se subiera.
5. **StatsStrip** mete una cifra `text-[2.6rem]` (41.6px) fija sin reducir en móvil, dentro de `grid-cols-2` — el valor + label de 14ch compiten por ~160px de ancho a 375px.

El input de Nil ("la web se ve junta, mal distribuida, las cosas no están bien colocadas") es **estructuralmente correcto y verificable en el código**: el sitio no tiene un sistema de spacing responsive. En móvil el problema empeora porque el `py-20` de escritorio se mantiene mientras el ancho colapsa — las secciones se aplastan unas contra otras con bloques de relleno desproporcionados.

---

## Per-axis status

| # | Axis | Status | Detail |
|---|------|--------|--------|
| 1 | Mobile-first posture | **FAIL** | Desktop-down: un solo breakpoint `md:`; `py-20` plano en 5 secciones; sin `clamp()` de spacing; sin tablet intermedio. |
| 2 | Tap targets & thumb zone | **PASS (con reservas)** | TANDA 4 (L2) elevó correctamente hamburguesa, flechas carousel, dots, botón cerrar Cart y qty a 44px. Quedan sub-44px: "Eliminar" en Cart, "Volver"/"Ver más" enlaces, botón "Volver al inicio" checkout. CTA principal alcanzable. |
| 3 | Gestures + click parity | **PASS** | Carousel: swipe no implementado pero flechas+dots sí (paridad por tap OK; auto-rotate gateado en `hover:none` — M7/M8 correcto). Easter-egg Mágnum tiene fallback long-press. Sin gestos exclusivos. Falta swipe nativo en carousel (mejora, no defecto). |
| 4 | 4G performance | **FAIL (estático) / pendiente Lighthouse** | 12 JPEG de producto sin optimizar en disco (200–360 KB c/u); primer `next/image` de Products SIN `priority`; sin `loading="lazy"` explícito; `@paper-design/shaders-react` (MeshGradient WebGL) montado above-the-fold. JS bundle real pendiente. |
| 5 | Mobile typography | **FAIL** | Cuerpo base 15px (`--fs-body` 0.9375rem) — bajo el mínimo móvil de 16px. Múltiples textos a 13px y 11px. Inputs heredan `text-sm` (13px) → trampa de auto-zoom iOS. |
| 6 | Mobile forms | **FAIL** | Sin `inputmode`, sin `autocomplete`, sin `enterkeyhint` en NINGÚN campo (Contact + Checkout). CP de checkout es `type="text"` sin `inputmode="numeric"`. Inputs a 13–15px → zoom iOS. |
| 7 | Mobile navigation | **PASS (con reservas)** | Hamburguesa móvil correcta (decisión #2), idioma accesible, links + CTA tienda en panel. Pero el FAB del carrito es el único acceso persistente al carrito; sin `<main>` landmark; nav no respeta safe-area. |
| 8 | iOS / Android / in-app | **FAIL** | `100vh` (vía `calc(100vh-72px)`) en Hero — trampa URL-bar iOS Safari. Sin `env(safe-area-inset-*)` en nav sticky ni FAB. Sin `-webkit-tap-highlight-color`. In-app browser sin verificar (pendiente runtime). |
| 9 | Landscape + orientation | **FAIL (estático) / pendiente runtime** | `min-h-[calc(100vh-72px)]` en Hero → en landscape (375×~390 útil) el contenido del Hero no cabe y la altura mínima fuerza relleno; FAB fijo `bottom-6 right-6` se solapa con la barra de gestos en landscape. Verificación real pendiente. |

**Resultado: 3 PASS · 6 FAIL.** Ejes 1, 4, 5, 6, 8, 9 fallan. El umbral 8.5 no se alcanza.

---

## Verificación de los datos conocidos de Fase 4 (TANDA 4 / L1 / L2)

| Dato esperado | Estado verificado | Comentario |
|---|---|---|
| TANDA 4 (L2): tap targets ≥44px en Hero/Products/Cart | **CORRECTO, parcial** | Hamburguesa `w-11 h-11` ✓ · opción idioma `min-h-[44px]` ✓ · flechas carousel `w-11 h-11` ✓ · dots dentro de botón `h-11` ✓ · cerrar Cart `w-11 h-11` ✓ · qty Cart botón `h-11 w-11` con círculo 32px dentro ✓. **Bien hecho.** Pero quedaron fuera: enlace "Eliminar" del Cart (solo `py-1.5`, ~24px alto), "Ver más" en card, "Volver" y "Volver al inicio" en checkout. |
| `next.config.ts`: `formats: [avif, webp]` | **CORRECTO** | Presente y bien. `localPatterns` añadido, `remotePatterns` retirado correctamente (sin hot-link legacy). |
| Logo Hero ya no es `unoptimized` | **CORRECTO** | `hero.tsx` línea 178-186: `<Image>` con `priority`, sin `unoptimized`, `width/height` reservados (anti-CLS). Bien hecho. |
| Breakpoints | **DEFECTO CONFIRMADO** | Solo `md:` (768px). Sin tablet intermedio — confirmado como falta. |
| Secciones con `py-20` plano | **DEFECTO CONFIRMADO** | `Products`, `AboutUs`, `Values`, `CTA`, `Contact` todas `py-20` sin escalar. Confirmado. |

La TANDA 4 hizo bien lo que tocó (tap targets de los controles principales, formatos de imagen, logo). Lo que **falta** es todo el eje de spacing responsive, la tipografía móvil 16px, los atributos de formulario móviles, y el saneamiento iOS (100dvh, safe-area).

---

## Defects detected

| # | Location | Issue | Viewport / device | Severity | Fix |
|---|----------|-------|-------------------|----------|-----|
| 1 | `globals.css` `--fs-body: 0.9375rem` + inputs en `contact.tsx` / `checkout.tsx` (`text-sm` ≈ 13px) | Tipo de cuerpo a 15px e inputs a 13–15px. iOS Safari auto-zooma cualquier input <16px al enfocar — la queja móvil más citada. Además 15px de cuerpo es el suelo justo, no cómodo para audiencia con franja mayor. | iPhone (todo iOS Safari) | **CRITICAL** | Subir `font-size` de TODOS los `<input>`/`<textarea>` a ≥16px en móvil (`text-base` o `style fontSize:16`). Subir `--fs-body` a 1rem (16px) para móvil — idealmente `clamp(1rem, …, 1.0625rem)`. El `CardElement` de Stripe ya está a 15px → subir a 16px en `CARD_STYLE.base.fontSize`. |
| 2 | `contact.tsx` (4 campos) y `checkout.tsx` (5 campos) | CERO `inputmode`, CERO `autocomplete`, CERO `enterkeyhint` en todo el sitio. Email sin `autocomplete="email"`; "Código postal" es `type="text"` sin `inputmode="numeric"` → teclado QWERTY en vez de numérico; nombre sin `autocomplete="name"`; dirección sin `autocomplete="street-address"`; ciudad sin `autocomplete="address-level2"`. Sin teclado correcto la conversión de checkout se degrada en móvil. | Todo móvil (iOS + Android) | **CRITICAL** | Añadir tokens: email → `type="email" inputmode="email" autocomplete="email"`; nombre → `autocomplete="name"`; dirección → `autocomplete="street-address"`; ciudad → `autocomplete="address-level2"`; CP → `inputmode="numeric" autocomplete="postal-code"`; asunto → `enterkeyhint="next"`, último campo → `enterkeyhint="send"`. |
| 3 | `hero.tsx` línea 256 — `min-h-[calc(100vh-72px)]` | `100vh` incluye la barra de URL de iOS Safari; al colapsar al hacer scroll el viewport "crece" y el Hero da un salto de layout. Trampa de regla endurecida en `mobile-obsessor-memory`. | iOS Safari, todos los modelos con barra dinámica | **HIGH** | Usar `min-h-[calc(100dvh-72px)]` con fallback `100vh`. En Tailwind v4: `min-h-[calc(100dvh-72px)]`. |
| 4 | 5 secciones: `products.tsx`, `about-us.tsx`, `values.tsx`, `cta.tsx`, `contact.tsx` — todas `py-20 px-6` | Mobile-crush: 80px de padding vertical de escritorio aplicado plano a 375px. Sin `clamp()`, sin escalado `md:`. Es la causa estructural del "se ve junta, mal distribuida" que reporta Nil — el ritmo de sección no responde al viewport. | Todo móvil, peor a 360–375px | **HIGH** | Reemplazar `py-20` por spacing responsive fluido, p.ej. `py-14 md:py-20` como mínimo, o idealmente `py-[clamp(3.5rem,8vw,5rem)]`. Aplicar el mismo criterio al `gap` entre columnas (Contact `gap-14`, Hero `gap-10`). Consolidar en una utilidad `.section` (ya existe en `globals.css` pero ningún componente la usa). |
| 5 | `products.tsx` líneas 132-138 — primer `<Image>` del primer ProductCard | El carousel del primer producto (above-the-fold en móvil tras el Hero) NO lleva `priority`; ningún `<Image>` lleva `loading="lazy"` explícito. Las fotos de producto son el LCP probable en móvil tras el Hero. `sizes` está bien puesto. | Todo móvil en Slow 4G | **HIGH** | Pasar `priority` a la primera imagen del primer producto visible (índice 0, slide 0); mantener el resto en lazy por defecto. Verificar el LCP real con Lighthouse (pendiente runtime). |
| 6 | `public/fresas/**` — 12 JPEG de producto, 200–360 KB cada uno en disco; `public/logo-nuevo.jpg` 261 KB | Imágenes fuente sin optimizar. Next sirve AVIF/WebP en runtime (config OK) pero la fuente pesada significa que el optimizador trabaja sobre originales grandes y el primer build/cache es lento; ~3 MB de fotos de producto fuente. El peso AVIF real servido a 375px es **pendiente: requiere ejecución en vivo**. | Todo móvil en Slow 4G | **MEDIUM** | Verificar con Lighthouse el peso AVIF real servido a un viewport de 375px; si una sola foto de producto supera ~120 KB en AVIF a 100vw, recomprimir las fuentes. Borrar `public/Fotos Fresas.zip` (12 MB) y `logo-yaya.png.png` (asset muerto) del directorio público. |
| 7 | `cart.tsx` línea 142-148 — enlace "Eliminar" | Tap target sub-44px: solo `py-1.5` (~24px de alto, fuente 0.65rem). Está en el camino de conversión (editar la cesta antes de pagar). La TANDA 4 amplió qty y cerrar pero dejó "Eliminar" corto. | Todo móvil | **MEDIUM** | Envolver "Eliminar" en un área de toque ≥44×44 (patrón ya usado en los botones de qty del mismo componente: botón `h-11` con contenido visual menor dentro). |
| 8 | `hero.tsx` nav sticky (línea 162) + `cart.tsx` FAB (línea 28, `fixed bottom-6 right-6`) | Sin `env(safe-area-inset-*)`. En iPhone con notch/Dynamic Island y en Android con navegación por gestos, el FAB del carrito a 24px del borde inferior cae sobre la barra de gestos del sistema; la nav sticky no reserva el inset superior. | iPhone 14+/15/16, Android gesture-nav | **MEDIUM** | FAB: `bottom-[calc(1.5rem+env(safe-area-inset-bottom))]` y equivalente a la derecha. Nav: añadir `padding-top: env(safe-area-inset-top)` si alguna vez es full-bleed (hoy bajo barra del navegador, riesgo bajo pero documentar). |
| 9 | `globals.css` — sin regla `-webkit-tap-highlight-color` | Al tocar cualquier enlace/botón en Android Chrome aparece el rectángulo gris de resaltado nativo; rompe la sensación de pulido en un sitio que persigue tono museístico/tributo. | Android Chrome, iOS Safari | **MEDIUM** | Añadir a `globals.css`: `* { -webkit-tap-highlight-color: transparent; }` y `a, button { touch-action: manipulation; }` (esto último elimina además el delay de doble-tap de 300ms). Mantener los `:active`/`whileTap` ya presentes como feedback explícito. |
| 10 | `stats-strip.tsx` línea 88-104 — `grid-cols-2` a 375px con cifra `text-[2.6rem]` (41.6px) | A 375px cada celda tiene ~155px de ancho útil; la cifra de 41.6px + el label `max-w-[14ch]` se aprietan. `gap-x-6` (24px) entre dos columnas estrechas roba ancho. Contribuye al "se ve junta". | 360–375px | **MEDIUM** | Reducir la cifra en móvil (`text-[2rem] md:text-[2.6rem]`) y/o bajar `gap-x` en móvil; verificar que el label de 14ch no se parta a 3 líneas a 360px. |
| 11 | `layout.tsx` — sin elemento `<main>`; `page.tsx` renderiza secciones sueltas; `globals.css` define `.skip-link` pero no se renderiza en ningún sitio | No hay landmark `<main>` ni skip-link en el DOM. En móvil con lector de pantalla (TalkBack/VoiceOver) no hay salto al contenido; el orden de landmarks es plano. La clase `.skip-link` existe pero está muerta. Solapa con `accessibility-perfectionist`. | Todo móvil con lector de pantalla | **MEDIUM** | Envolver el contenido de `page.tsx` en `<main id="contenido">` y añadir un `<a class="skip-link" href="#contenido">` al inicio del layout. |
| 12 | `checkout.tsx` — botón "Volver" (línea 114), "Volver al inicio" (línea 98); `products.tsx` "Ver más" enlace; `contact.tsx` enlaces de info | Tap targets sub-44px en enlaces de navegación secundaria: "Volver" es texto ~20px de alto; "Ver más" ídem; los enlaces de email/teléfono en Contact son texto sin área ampliada. No están en el centro de la conversión pero el de checkout sí está en página de pago. | Todo móvil | **LOW** | Añadir padding para llevar el área de toque a ≥44px de alto en los enlaces de navegación de `/checkout`; los de Contact (email/tel) ampliar a `py-2` mínimo. |
| 13 | `hero.tsx` columna derecha — bloque variedades `maxWidth: 380` `aspectRatio: 1/1` | A 375px el cuadrado de 380px se recorta a ~327px (tras `px-6`) y sigue siendo un bloque alto; sumado al `min-h` del Hero, la primera pantalla móvil es densa. No es defecto de imagen (es tipográfico, anti-CLS correcto) pero contribuye a la sensación de "junta". | 360–414px | **LOW** | Considerar reducir el `aspectRatio` del bloque a algo menos que 1/1 en móvil (`aspect-[4/3]`) o quitar la altura forzada para que respire; revisar junto al fix #3 del `100dvh`. |
| 14 | `cart.tsx` panel — `max-w-[22rem]` (352px) | A 360px de viewport el panel deja solo 8px de backdrop visible; en la práctica ocupa toda la pantalla. No rompe, pero el panel del carrito a pantalla completa en móvil debería ser `w-full` declarado y con su propio scroll seguro. Funciona; es pulido. | 360px | **LOW** | Aceptable. Confirmar en runtime que el scroll interno (`overflow-y-auto`) no choca con el rubber-band de iOS; añadir `overscroll-behavior: contain` al panel. |

**Conteo de defectos:** 2 CRITICAL · 3 HIGH · 6 MEDIUM · 3 LOW = **14 defectos.**

---

## Real-device walkthrough findings

**No ejecutado — `pendiente: requiere ejecución en vivo`.** El dev server está apagado por diseño y esta es una auditoría estática. Cuando se ejecute en vivo, la pasada de dispositivo real debe cubrir, como mínimo:

- **iOS Safari (iPhone reciente):** verificar el salto de layout del Hero por el `100vh` (defecto #3); verificar el auto-zoom de inputs al enfocar en Contact y en `/checkout` (defecto #1/#2); verificar que el FAB del carrito no caiga sobre la barra de gestos (defecto #8); completar el camino de compra completo (añadir al carrito → carrito → checkout → Stripe CardElement).
- **Android Chrome (gama media, p.ej. Pixel 6a / Samsung A):** verificar el rectángulo gris de tap-highlight (defecto #9); verificar rendimiento del MeshGradient WebGL en CPU no-flagship; verificar el teclado correcto en el campo CP del checkout (defecto #2).
- **Navegador in-app de Instagram (iOS):** completar el camino de compra dentro del WebView de IG — es la fuente de tráfico social esperada nº1 para este perfil; verificar que el `CardElement` de Stripe y la confirmación de pago funcionan en in-app (riesgo conocido de WebView).
- **Landscape:** verificar el Hero con `min-h` en orientación horizontal (defecto #13) y el solape del FAB.

---

## Performance run (Slow 4G + 4× CPU)

**`pendiente: requiere ejecución en vivo / Lighthouse`** — ninguna métrica de runtime se puede medir con el server apagado. NO se inventan números.

- LCP / FCP / CLS / INP / TBT: **pendiente Lighthouse.**
- Initial JS gzip / Initial CSS gzip: **pendiente build + análisis de bundle.**
- LCP image (peso AVIF real servido a 375px): **pendiente runtime.**
- Lighthouse Mobile Performance: **pendiente** — es el suelo duro 90 de `quality-gate` fila 3.

**Análisis estático de performance que SÍ se puede hacer ahora:**

1. **Riesgo de bundle JS:** el sitio carga `framer-motion` (usado en casi todos los componentes), `@paper-design/shaders-react` (MeshGradient WebGL, montado above-the-fold en el Hero), `@stripe/stripe-js` + `@stripe/react-stripe-js` (en `/checkout`). MeshGradient WebGL above-the-fold es un coste de JS y GPU notable en móvil de gama media — candidato a `pendiente: verificar peso y considerar diferir / sustituir por gradiente CSS estático en móvil`. El bundle real es **pendiente Lighthouse**, pero el inventario de dependencias indica riesgo de superar el techo de 100 KB gzip en la home.
2. **Imágenes:** `next.config.ts` con `formats: [avif, webp]` está bien. `sizes` en el carousel de Products está bien (`(max-width:640px) 100vw, …`). **Falta `priority`** en la primera imagen de producto y faltan fuentes optimizadas (defectos #5/#6). El `<Image>` del logo del Hero está correcto (`priority`, sin `unoptimized`, dimensiones reservadas).
3. **Fuentes:** `layout.tsx` carga Inter (variable, OK) y Playfair Display con 6 pesos discretos (`400,500,600,700,800,900`) + estilos normal **e italic** → 12 ficheros de fuente. `next/font` aplica `font-display: swap` por defecto (bien), pero cargar 12 cortes de Playfair es excesivo: el sitio usa Playfair sobre todo en italic 400 y bold 700. Candidato a recortar pesos → menos peso de fuente above-the-fold. **MEDIUM de performance, no listado en la tabla de defectos por ser de configuración de fuente; recomendado para el gate.**
4. **CSS:** `globals.css` es razonablemente compacto; importa `tailwindcss` + `tw-animate-css` + `shadcn/tailwind.css`. El peso CSS final es **pendiente build**.

---

## Intentional exceptions (not flagged)

- **Carousel sin swipe nativo:** el `phase-2.5-report` decisión M8 pidió "auto-rotate gateado en `hover:none`, flechas visibles en touch" — implementado correctamente. La ausencia de gesto swipe se considera mejora futura, NO defecto, porque la paridad por tap (flechas + dots de 44px) está completa. No se marca como fallo del eje 3.
- **MeshGradient animado en el Hero:** la disciplina 2-color y el conflicto DSM-1/C-deco quedaron *diferidos a Fase 4 (`visual-perfection`)* por el gate de Fase 3. No se re-marca aquí como defecto de paleta; sí se señala su **coste de performance en móvil** (above-the-fold WebGL) como riesgo a verificar — eso es competencia de este eje.
- **Slot de retrato de Mariana como bloque tipográfico (no imagen):** decisión de tono homenaje ratificada (`phase-2.5-report` ④, "NUNCA imagen IA"). El bloque `Mariana` en Playfair italic es intencional y correcto; no se marca.
- **`handleCheckout` del Cart hace `router.push` misma pestaña:** comportamiento correcto ratificado en Fase 2.5 ⑨ — no se toca.

---

## Status

**FAIL — 6.4 / 10 (umbral 8.5).** Correcciones obligatorias antes de `visual-perfection` y `quality-gate`. Los 2 CRITICAL (tipo de input <16px / auto-zoom iOS, y formularios sin `inputmode`/`autocomplete`) degradan directamente la conversión de checkout en móvil — el camino de compra es el corazón del negocio. Los 3 HIGH (mobile-crush `py-20`, `100vh`, primera imagen sin `priority`) confirman en código el diagnóstico de Nil de que la web "se ve junta y mal distribuida": el sitio carece de un sistema de spacing responsive y fue autorizado desktop-down.

**Nota de scoring:** la TANDA 4 hizo bien su trabajo de tap targets (eje 2 pasa) y la base de navegación móvil es sólida (hamburguesa correcta, eje 7 pasa). Eso sostiene el 6.4 por encima de un suspenso grave. Pero seis de los nueve ejes fallan, dos de ellos en el camino de conversión, y la postura mobile-first no existe. El sitio NO es entregable en su estado actual desde la óptica móvil.

---

## Handoff — lista priorizada para `iteration-agent`

> Modo AUDIT: estos fixes se documentan para el gate de Nil. NO se han escrito en código.

**CRITICAL — bloquean el gate:**
1. `contact.tsx` + `checkout.tsx` + `CARD_STYLE` en `checkout.tsx`: subir TODOS los `<input>`/`<textarea>` y el `CardElement` a `font-size ≥ 16px` en móvil. Subir `--fs-body` en `globals.css` a 16px (idealmente `clamp`). — *defecto #1*
2. `contact.tsx` (4 campos) + `checkout.tsx` (5 campos): añadir `inputmode`, `autocomplete` y `enterkeyhint` correctos por campo (email/name/street-address/address-level2/postal-code; CP con `inputmode="numeric"`). — *defecto #2*

**HIGH:**
3. `hero.tsx` L256: `min-h-[calc(100vh-72px)]` → `min-h-[calc(100dvh-72px)]`. — *defecto #3*
4. `products.tsx` · `about-us.tsx` · `values.tsx` · `cta.tsx` · `contact.tsx`: reemplazar `py-20` plano por spacing responsive (`py-14 md:py-20` mínimo, o `clamp()`); revisar gaps de columna. — *defecto #4*
5. `products.tsx` L132: `priority` en la primera imagen del primer ProductCard. — *defecto #5*

**MEDIUM:**
6. Recomprimir/verificar fuentes de imagen de `public/fresas/**`; borrar `Fotos Fresas.zip` y `logo-yaya.png.png` del directorio público. — *defecto #6*
7. `cart.tsx` L142: ampliar el área de toque de "Eliminar" a ≥44px. — *defecto #7*
8. `cart.tsx` FAB + `hero.tsx` nav: añadir `env(safe-area-inset-*)`. — *defecto #8*
9. `globals.css`: añadir `-webkit-tap-highlight-color: transparent` y `touch-action: manipulation`. — *defecto #9*
10. `stats-strip.tsx`: escalar la cifra (`text-[2rem] md:text-[2.6rem]`) y revisar gaps a 360px. — *defecto #10*
11. `layout.tsx` + `page.tsx`: añadir `<main>` y renderizar el `.skip-link` ya definido en CSS. — *defecto #11*
12. (Performance) `layout.tsx`: recortar los pesos de Playfair Display de 6 a los 2 realmente usados (400 italic, 700).

**LOW:**
13. `checkout.tsx` + `products.tsx` + `contact.tsx`: ampliar áreas de toque de enlaces secundarios a ≥44px. — *defecto #12*
14. `hero.tsx`: revisar el `aspectRatio 1/1` del bloque de variedades en móvil. — *defecto #13*
15. `cart.tsx`: `overscroll-behavior: contain` en el panel. — *defecto #14*

**Pendiente de ejecución en vivo (no resoluble en modo AUDIT estático):**
- Lighthouse Mobile Performance + LCP/FCP/CLS/INP/TBT en Slow 4G + 4× CPU.
- Peso real AVIF servido a 375px y confirmación del LCP móvil.
- Tamaño del bundle JS gzip de la home (verificar el techo de 100 KB; medir el coste del MeshGradient WebGL).
- Pasada de dispositivo real: iOS Safari (salto del Hero, auto-zoom de inputs, FAB sobre barra de gestos), Android Chrome de gama media (tap-highlight, rendimiento WebGL, teclado de CP).
- Camino de compra completo dentro del navegador in-app de Instagram (riesgo de WebView con el `CardElement` de Stripe).
- Comportamiento en landscape del Hero y del FAB.

---

*Auditoría estática `mobile-obsessor` · Fase 4.5 QA Visual · Yaya Mariana · 2026-05-22 · modo AUDIT — sin cambios de código.*
