# FASE 4.5 — Auditoría de Accesibilidad · Yaya Mariana
## Entregable del agente `accessibility-perfectionist`

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE · rama `clasico`
**Modo:** AUDIT — auditoría ESTÁTICA del código. No se ha modificado ningún archivo de código. Los fixes se documentan para el gate de Nil.
**Fecha:** 2026-05-22
**Alcance:** `src/components/ui/*.tsx` · `src/app/globals.css` · `src/app/layout.tsx` · `src/app/page.tsx` · `src/components/providers.tsx` · `src/context/*.tsx` · `src/i18n/translations.ts` · `src/app/checkout/page.tsx`

---

## Accessibility Audit — Yaya Mariana — Site-wide (home single-page + /checkout)

**Tools run:** análisis estático de código (contraste calculado a mano sobre hex reales, semántica HTML, ARIA, focus, `prefers-reduced-motion`, tap targets desde clases).
**Pendiente: requiere ejecución en vivo** (dev server apagado a propósito): axe-core · Lighthouse a11y · WAVE · walkthrough real con lector de pantalla (NVDA) · zoom 200%/400% medido en navegador · simulación de daltonismo · modo `forced-colors`. Marcadas como tales más abajo; no se inventan números de herramienta.

**Canvas colors verificados (contraste calculado contra el fondo REAL, nunca contra blanco por defecto):**
- Cream base `#fdf6f5` (`--color-bg-base`)
- Cream alterno `#fdf0ef` (`--color-bg-subtle`, sección Values)
- Blanco `#ffffff` (cards, panel Cart, inputs, AboutUs, Nav)
- Hero section `#fff5f5` **+ MeshGradient encima** (`#f5d0c8 #e8a090 #f0b8a8 #ffd0c0 #e89888`)
- Maroon-800 `#5c1a1a` (StatsStrip)
- CTA: degradado `#5c1a1a → #962a1f → #7a1f17`
- Maroon-900 `#2d0a0a` (Footer)

**Overall score: 4.6 / 10**
**WCAG level achieved:** por debajo de AA — **FAIL.** Múltiples fallos AA de contraste en cuerpo de texto en 6 componentes (todos por opacidad sobre texto — viola la regla dura G-1 del design system) + dos diálogos sin focus-trap (Cart, MobileNav) + un `<h2>` con salto de jerarquía. Los titulares principales sí alcanzan AA/AAA; el suelo se rompe en cuerpo y en teclado.

---

## Per-axis status

| # | Axis | Status | Detail |
|---|------|--------|--------|
| 1 | Contraste | **FAIL** | Titulares AAA OK. Cuerpo: ~14 superficies por debajo de AA por opacidad sobre texto. Ratio más bajo medido ≈ **1.9:1** (`text-[#7a3a3a]/35` "Eliminar" / placeholders sobre blanco). G-1 del design system incumplida en todo el build. |
| 2 | Teclado | **FAIL** | Focus-visible global correcto en `globals.css`. Pero Cart drawer y MobileNav son diálogos sin focus-trap, sin Esc-close, sin retorno de foco. Filtros de producto sin navegación por flechas. |
| 3 | Screen reader | **FAIL** | Falta `<main>`, falta skip-link en el DOM (la clase existe en CSS pero ningún `<a class="skip-link">` la usa), `<h2>` de Products marca-como-`h2` con `text-4xl` salta el rango pero el problema real es múltiples `<h2>` sin `<h1>` jerárquico arriba en algunas lecturas; Cart sin `role="dialog"`/`aria-modal`/`aria-labelledby`; `lang` no cambia con el idioma; mensajes de éxito de formulario no anunciados (sin `role="status"`). |
| 4 | Cognitiva | **PASS (con reservas)** | Lenguaje llano, etiquetas consistentes, sin límites de tiempo, sin parpadeo. Reserva: errores de formulario nativos del navegador (no hay validación explicada); checkout sin indicador de pasos pero es un solo paso. |
| 5 | Motora | **PASS (con reservas)** | Tap targets ≥44px bien resueltos en nav, carousel, filtros, cart, idioma. Reserva: enlaces de texto inline ("ver más", "Contactar", footer) por debajo de 44px de alto; el carousel auto-rota sin control de pausa accesible. |
| 6 | Baja visión / color | **FAIL parcial / pendiente** | Texto sobre MeshGradient animado: contraste no garantizado contra los stops oscuros. Zoom 200%/400% **pendiente: requiere ejecución en vivo** (riesgo: Hero usa `min-h-[calc(100vh-72px)]` + columnas con `%`). Color no es portador único de significado salvo el botón "Añadido" (verde) — se apoya en icono+texto, OK. |
| 7 | Auditiva | **PASS (N/A)** | Sin vídeo ni audio en el sitio. Sin contenido que requiera subtítulos/transcripción. |
| 8 | Movimiento | **PASS (con 1 reserva)** | `prefers-reduced-motion` bien cableado: `MotionConfig reducedMotion="user"`, `globals.css` media query, MeshGradient `speed=0`, count-up y pétalo gateados con `useReducedMotion()`. Reserva: el "shine" del badge de variedad (`repeat: Infinity`) y el auto-rotate del carousel (`setInterval`) no consultan `useReducedMotion()` — siguen animando. |

---

## Defects detected

> Severidad: **CRITICAL** = fallo AA / sin teclado en ruta primaria / diálogo sin focus-trap. **HIGH** = fallo AAA en titular / alt genérico / icon-button sin label / skip-link ausente / reduced-motion no implementado. **MEDIUM** = texto secundario bajo AAA / verbosidad ARIA / inconsistencia menor de focus. **LOW** = deriva tolerable en decorativo.
> Ratios calculados componiendo el color de texto sobre el fondo REAL al porcentaje de opacidad indicado (así renderiza Tailwind `text-color/NN`).

| # | Location | Issue | WCAG ref | Severidad | Fix |
|---|----------|-------|----------|----------|-----|
| 1 | `stats-strip.tsx:102` | Label de stat `text-white/65` sobre maroon `#5c1a1a` = **≈3.19:1** (cuerpo, AA fail). Viola G-1. | 1.4.3 | CRITICAL | Sustituir por token sólido `--color-text-on-deep` (cream `#fdf6f5`) → ≈11.9:1. Quitar `/65`. |
| 2 | `cta.tsx:31, 141` | Subtítulo `text-white/70` sobre degradado CTA (medio `#962a1f`) = **≈3.55:1** (cuerpo 15px, AA fail). | 1.4.3 | CRITICAL | Token sólido blanco/`text-on-brand`. Quitar `/70`. Sobre el stop más oscuro del degradado pasaría a >7:1. |
| 3 | `cta.tsx:62` | Micro-bloque cold-chain `text-white/55` sobre `#962a1f` = **≈2.49:1** (cuerpo, AA fail). | 1.4.3 | CRITICAL | Token sólido. Quitar `/55`. El separador `·` `/30` puede quedar (decorativo, `aria-hidden`). |
| 4 | `cta.tsx:72` | Trust badges `text-white/60` sobre `#962a1f` = **≈2.85:1** (cuerpo, AA fail). | 1.4.3 | CRITICAL | Token sólido blanco. Quitar `/60`. |
| 5 | `footer.tsx:165, 172` | Copyright y "Diseño por" `text-white/35` sobre footer `#2d0a0a` = **≈2.29:1** (cuerpo, AA fail). Es el fallo H-9 del design system, sin corregir. | 1.4.3 | CRITICAL | Token sólido `--color-text-on-deep` → ≈18:1. Quitar `/35`. |
| 6 | `footer.tsx:111` | Descripción de marca `text-white/50` sobre `#2d0a0a` = **≈3.02:1** (cuerpo, AA fail). | 1.4.3 | CRITICAL | Token sólido. Quitar `/50`. |
| 7 | `footer.tsx:139` | Headings de columna `text-white/40` sobre `#2d0a0a` = **≈2.45:1** (texto 11px uppercase, AA fail). | 1.4.3 | CRITICAL | Token sólido (o `--color-text-on-deep` atenuado nunca por opacidad). Quitar `/40`. |
| 8 | `footer.tsx:147` | Enlaces de navegación `text-white/65` sobre `#2d0a0a` = **≈4.42:1** (cuerpo 14px, AA fail marginal <4.5). | 1.4.3 | CRITICAL | Token sólido `--color-text-on-deep`. Quitar `/65`. |
| 9 | `products.tsx:340` | Descripción de producto `text-[#7a3a3a]/65` sobre card blanca = **≈3.17:1** (cuerpo, AA fail). Fallo H-1. | 1.4.3 | CRITICAL | `--color-text-secondary` (`#5a2a2a` sólido) → ≈10.6:1. Quitar `/65`. |
| 10 | `products.tsx:359` | "/ 500g" `text-[#7a3a3a]/50` sobre blanco = **≈2.5:1** (metadato, AA fail). Fallo H-4. | 1.4.3 | CRITICAL | `--color-text-muted` sólido → ≈8.8:1. Quitar `/50`. |
| 11 | `products.tsx:363` | Link "Ver más" `text-[#962a1f]/70` sobre blanco = **≈3.0:1** (cuerpo 12px, AA fail). Fallo H-6. | 1.4.3 | CRITICAL | `--color-brand-primary` sólido (`#962a1f`) → ≈7.2:1. Quitar `/70`. |
| 12 | `products.tsx:451` | Subtítulo de sección `text-[#7a3a3a]/65` sobre cream `#fdf6f5` = **≈3.1:1** (cuerpo, AA fail). | 1.4.3 | CRITICAL | `--color-text-secondary` sólido → ≈10.6:1. Quitar `/65`. |
| 13 | `values.tsx:52, 73` | Subtítulo de sección y descripción de card `text-[#7a3a3a]/65` sobre `#fdf0ef`/blanco = **≈3.0–3.2:1** (cuerpo, AA fail). | 1.4.3 | CRITICAL | `--color-text-secondary` sólido → ≈10.6:1. Quitar `/65`. |
| 14 | `contact.tsx:103` | Subtítulo `text-[#7a3a3a]/65` sobre cream `#fdf6f5` = **≈3.1:1** (cuerpo, AA fail). | 1.4.3 | CRITICAL | `--color-text-secondary` sólido. Quitar `/65`. |
| 15 | `contact.tsx:114` | Labels de info de contacto `text-[#7a3a3a]/50` sobre cream = **≈2.5:1** (texto 12px, AA fail). | 1.4.3 | CRITICAL | `--color-text-muted` sólido. Quitar `/50`. |
| 16 | `contact.tsx:174,189,205,220` | Labels de formulario `text-[#7a3a3a]/60` sobre blanco = **≈3.4:1** (texto 12px, AA fail). Fallo H-3. | 1.4.3 | CRITICAL | `--color-text-secondary` sólido → ≈10.9:1. Quitar `/60`. |
| 17 | `contact.tsx:185,200,216,230` | Placeholders `placeholder:text-[#7a3a3a]/35` sobre blanco = **≈1.9:1** (AA fail). Fallo H-5. | 1.4.3 | CRITICAL | `--color-text-muted` sólido → ≈9.1:1. Quitar `/35`. (El label sí existe, así que el placeholder es supletorio — pero igualmente debe pasar AA si se muestra.) |
| 18 | `contact.tsx:160` | Subtítulo de mensaje enviado `text-[#7a3a3a]/65` sobre blanco = **≈3.17:1** (AA fail). | 1.4.3 | CRITICAL | `--color-text-secondary` sólido. |
| 19 | `cart.tsx:115,162` | "500g · precio" y "Envío" `text-[#7a3a3a]/60` y `/50` sobre panel blanco = **≈2.5–3.4:1** (AA fail). | 1.4.3 | CRITICAL | `--color-text-secondary` / `--color-text-muted` sólidos. Quitar opacidad. |
| 20 | `cart.tsx:145` | "Eliminar" `text-[#7a3a3a]/40` sobre blanco = **≈1.9:1** (texto 10.4px, AA fail — el ratio más bajo del sitio). | 1.4.3 | CRITICAL | `--color-text-muted` sólido → ≈8.8:1. Subir además el tamaño (10.4px es muy pequeño). Quitar `/40`. |
| 21 | `cart.tsx:159` | "Subtotal" `text-[#7a3a3a]/70` sobre blanco = **≈3.0:1** (AA fail). | 1.4.3 | CRITICAL | `--color-text-secondary` sólido. Quitar `/70`. |
| 22 | `checkout.tsx:94,129,116,260-266` | Múltiples textos `text-[#7a3a3a]/70 /60 /50 /40` y `text-[#962a1f]/60` sobre cream/blanco = **≈2.1–3.6:1** (AA fail) — texto de éxito, subtítulos, resumen del pedido, "Volver". | 1.4.3 | CRITICAL | Tokens sólidos `--color-text-secondary` / `--color-text-muted`. Quitar toda opacidad sobre texto. |
| 23 | `checkout.tsx:14` (CardElement) e `cta.tsx:159` / `checkout.tsx:281` | Placeholder de tarjeta Stripe `#c0a0a0` sobre blanco = **≈2.1:1**; placeholder email CTA `#b08a8a` sobre blanco = **≈2.9:1** (AA fail si se confía en él). | 1.4.3, 3.3.2 | HIGH | Oscurecer el placeholder a un token sólido ≥4.5:1 (p.ej. `--color-text-muted` `#6e3232`). |
| 24 | `cart.tsx` (todo el drawer) | Drawer de cesta es un diálogo modal pero **sin `role="dialog"`, sin `aria-modal`, sin `aria-labelledby`, sin focus-trap, sin cierre con `Esc`, sin retorno de foco al FAB al cerrar.** Es la ruta de conversión. Coincide con el hallazgo M7 del design system, no resuelto. | 4.1.2, 2.4.3, 2.1.2 | CRITICAL | Añadir `role="dialog" aria-modal="true" aria-labelledby="cart-title"` (el `<h2>` ya existe, darle `id`); focus-trap mientras abierto; listener `Escape`→cerrar; al cerrar, devolver foco al `motion.button` del FAB. El backdrop ya cierra al click — bien. |
| 25 | `hero.tsx` MobileNav | El panel móvil desplegable no atrapa el foco, no cierra con `Esc`, no devuelve el foco al botón hamburguesa al cerrar. El `LanguageSelector` igual: cierra con click-fuera pero no con `Esc` ni atrapa foco. | 2.1.2, 2.4.3 | CRITICAL | Focus-trap + `Escape`-close + retorno de foco en ambos overlays. `LanguageSelector` ya tiene `aria-haspopup`/`aria-expanded`/`role="listbox"` — conservar; solo falta el manejo de teclado (`Esc`, flechas entre opciones). |
| 26 | `layout.tsx:30` / `page.tsx` | **No existe `<main>` en el árbol.** `page.tsx` renderiza secciones sueltas dentro de un fragmento; el `<body>` no tiene landmark de contenido principal. Un usuario de SR no puede saltar al contenido. | 1.3.1, 2.4.1 | CRITICAL | Envolver el contenido de `page.tsx` en `<main id="contenido">`. Necesario también para el ancla del skip-link. |
| 27 | `globals.css:283` + ningún componente | La clase `.skip-link` está definida en `globals.css` pero **ningún `<a class="skip-link">` la usa** en el DOM. No hay enlace "Saltar al contenido". | 2.4.1 | HIGH | Añadir como primer elemento focusable del `<body>` (en `layout.tsx`) un `<a href="#contenido" class="skip-link">` con texto traducido (ES/CA/EN). Requiere el `<main id="contenido">` del defecto 26. |
| 28 | `hero.tsx:278` + `products.tsx:441`, `about-us.tsx:21`, `values.tsx:49`, `contact.tsx:100` | Jerarquía de encabezados: hay **un solo `<h1>`** (la cita del Hero — correcto). Pero el Hero NO tiene un `<h2>` antes de las secciones; Products/About/Values/Contact son todos `<h2>` directos. Eso es válido (h1→h2). El problema real: el `<h1>` es una **cita** (`"{quoteText}"`) — semánticamente débil como título de página y sin describir el negocio. Además los `eyebrow` (`<p>`/`<span>`) preceden visualmente a los `<h2>` y podrían leerse como títulos. | 1.3.1, 2.4.6 | MEDIUM | Mantener un `<h1>` pero asegurar que describe el sitio (la cita como `<h1>` es decisión de Hierarchy/Creative — no se re-flagea como defecto duro; se anota la reserva). Verificar con SR que el orden eyebrow→h2 se anuncia bien. **Pendiente: walkthrough SR en vivo.** |
| 29 | `stats-strip.tsx:11-43` | Los 4 iconos SVG de stats no tienen `aria-hidden` ni `<title>`. El valor ("100%", "0", "24h", "3") y el label se anuncian, pero el SVG decorativo puede generar ruido en algunos SR. | 1.1.1 | MEDIUM | Añadir `aria-hidden="true"` a los SVG decorativos de stats (igual que ya se hace en values/contact). Consistencia. |
| 30 | `values.tsx:8-36` | Los 6 iconos SVG de Values no tienen `aria-hidden`. Decorativos. | 1.1.1 | LOW | Añadir `aria-hidden="true"` a los SVG decorativos. |
| 31 | `stats-strip.tsx` | El count-up anima un número que cambia (`24h` cuenta 0→24). El `<span>` no es `aria-live`, así que el SR anuncia el valor una vez (bien), pero si el SR lo coge a mitad puede leer un número intermedio. Riesgo bajo. | 4.1.3 | LOW | Opcional: marcar el contenedor del número con `aria-hidden` durante la animación y exponer el valor final en un nodo `sr-only`. Bajo impacto. |
| 32 | `products.tsx:313-328` | El "shine" del badge de variedad usa `animate={{ x: [...] }}` con `repeat: Infinity` y **no consulta `useReducedMotion()`**. Anima indefinidamente incluso con reduced-motion activo. La media query global de `globals.css` neutraliza animaciones CSS, pero esto es animación JS de Framer sobre `transform`; `MotionConfig reducedMotion="user"` desactiva transform animations — **probablemente cubierto**, pero el `repeat: Infinity` debería gatearse explícitamente. **Pendiente: confirmar en vivo** si `MotionConfig` detiene el loop infinito. | 2.3.3 | MEDIUM | Gatear el shine con `useReducedMotion()` → no montar el `motion.span` animado si reduce-motion. |
| 33 | `products.tsx:80-90` | El carousel auto-rota cada 3s (`setInterval(next, 3000)`) y **no consulta `useReducedMotion()`** — el `setInterval` es JS puro, no Framer, así que `MotionConfig` NO lo detiene. Movimiento automático de contenido sin control de pausa y sin respeto a reduced-motion. | 2.2.2, 2.3.3 | HIGH | Gatear el auto-rotate con `useReducedMotion()` (no iniciar el intervalo si reduce-motion). Añadir además un control de pausa accesible (WCAG 2.2.2: contenido en movimiento >5s necesita pausa). Hoy la pausa solo ocurre on-hover (no por teclado/focus). |
| 34 | `products.tsx:462-478` | El grupo de filtros usa `aria-pressed` en botones sueltos. Correcto como toggle buttons, pero no es un `radiogroup` ni soporta navegación por flechas. Aceptable como botones independientes. | 4.1.2 | LOW | Sin cambio obligatorio. Opcional: `role="group"` con `aria-label` envolviendo los filtros. |
| 35 | `language-context.tsx:21` | `useEffect` solo rehidrata `lang` si el valor guardado es `"es"` o `"ca"` — **`"en"` se ignora**. Un usuario que elige inglés pierde su idioma al recargar. Además `<html lang>` queda fijo en `"es"` (layout.tsx) y **nunca se actualiza** al cambiar de idioma → el SR pronuncia contenido CA/EN con fonética española. | 3.1.1, 3.1.2 | HIGH | (a) Corregir el guard a aceptar `"en"`. (b) Actualizar `document.documentElement.lang` en `setLang` (o vía efecto) para que `<html lang>` siga al idioma activo. |
| 36 | `cta.tsx:150-179` (OffSeasonCTA) | El formulario off-season tiene `<input type="email">` con `aria-label` pero **sin `<label htmlFor>` visible**; el checkbox de consentimiento sí está envuelto en `<label>` (bien). El mensaje de éxito (`sent`) reemplaza el formulario pero **no se anuncia** (sin `role="status"`/`aria-live`). | 3.3.2, 4.1.3 | HIGH | Añadir `<label htmlFor>` visible al email. Envolver el bloque de éxito en `role="status" aria-live="polite"`. |
| 37 | `contact.tsx:143-169` | El estado "mensaje enviado" reemplaza el formulario sin anunciarse al SR. Sin `role="status"`/`aria-live`. | 4.1.3 | HIGH | Envolver el bloque de éxito en `<div role="status" aria-live="polite">`. Mismo patrón para checkout `success` (`checkout.tsx:84`). |
| 38 | `contact.tsx` formulario / `checkout.tsx` formulario | Sin validación de errores accesible. Los `required` se delegan al navegador (burbuja nativa, no asociada con `aria-describedby`). No hay `aria-invalid` ni mensaje de error con `aria-describedby`. El design system §4 especifica este patrón ARIA — no implementado. | 3.3.1, 3.3.3, 4.1.2 | HIGH | Al fallar validación: `aria-invalid="true"` en el input + `<p id="...-error">` con el texto del error + `aria-describedby` apuntando a él. Mensajes que expliquen el fix. |
| 39 | `checkout.tsx:205` / `contact.tsx` inputs | Inputs de checkout y contacto: borde `#f5c6c2` / `#d8b8b4`. `#f5c6c2` sobre blanco ≈ **1.3:1** como borde de UI — falla 3:1. El design system (decisión #4 DSM-2) resolvió esto con fondo blanco + `--color-border-default` `#d8b8b4`; checkout sigue usando `#f5c6c2` hardcodeado. | 1.4.11 | HIGH | Cambiar el borde de input de checkout a `--color-border-default` (`#d8b8b4`, ≈1.9:1 — aún flojo). Para cumplir 3:1 estricto el borde necesita oscurecerse más (p.ej. hacia `#c08a86`). Escalar a `creative-director`. |
| 40 | `hero.tsx:248-253` | El `<h1>` (cita), el subtítulo y los botones del Hero se renderizan sobre un **MeshGradient animado** con stops desde `#f5d0c8` (claro) hasta `#e89888` (medio-oscuro). El `<h1>` es `#962a1f`: sobre `#e89888` ≈ **2.9:1** (falla 3:1 para texto grande); el autor `#7a4a42` sobre `#e89888` ≈ **3.1:1** (falla 4.5:1 cuerpo). El contraste depende de qué stop del gradiente quede debajo en cada frame. | 1.4.3 | CRITICAL | Añadir un scrim/capa de color sólido legible bajo el bloque de texto del Hero, o restringir el MeshGradient a la mitad sin texto, o subir el texto a un fondo sólido. Verificar contra el stop MÁS oscuro del shader, no contra `#fff5f5`. (Relacionado con conflicto DSM-1 diferido.) |
| 41 | `globals.css` import | `globals.css` importa `shadcn/tailwind.css` y `tw-animate-css`; el `button.tsx` (Base UI) tiene clases `dark:` y un focus-visible propio (`focus-visible:ring-3`). El design system retiró dark mode. Sin impacto a11y directo, pero `button.tsx` no se usa en la home (los botones son `<motion.a>`/`<button>` ad-hoc). | — | LOW | No bloqueante. Anotar que `button.tsx` es código muerto en la home. |

### Resumen de defectos por severidad

| Severidad | Recuento |
|---|---|
| CRITICAL | 16 |
| HIGH | 9 |
| MEDIUM | 4 |
| LOW | 5 |
| **TOTAL** | **34** |

> Nota: varios defectos CRITICAL agrupan múltiples ocurrencias (p.ej. #16, #19, #22 cubren varias líneas). El número de instancias de "opacidad sobre texto" individuales supera las 30.

---

## Manual walkthrough findings

### Keyboard (análisis estático del código; walkthrough en navegador **pendiente: requiere ejecución en vivo**)
- Orden de tabulación: el DOM sigue el orden visual (nav → hero → stats → products → about → values → cta → contact → footer → cart FAB). El Cart FAB queda al final del DOM aunque es `position: fixed` arriba — un usuario de teclado lo alcanza al final; aceptable pero no ideal.
- Focus-visible: `globals.css` define `:focus-visible { outline: 2px solid var(--color-border-focus); outline-offset: 2px }` — anillo de marca, ≈ correcto. `button.tsx` (Base UI, no usado en home) tiene su propio focus-visible. Ningún `outline: none` sin reemplazo detectado en componentes. **PASS** en este eje concreto.
- **Trampa/escape:** Cart drawer y MobileNav y LanguageSelector NO atrapan foco ni cierran con `Esc` — al abrir el Cart, `Tab` se escapa al contenido de fondo (defectos 24, 25). La ruta de conversión (añadir al carrito → abrir cesta → checkout) es completable con ratón pero **frágil con solo teclado**: el Cart se puede abrir con Enter, pero el foco no entra en el panel.
- Carousel: flechas y puntos son `<button>` reales con `aria-label` — navegables por teclado. Bien. Pero las flechas tienen `pointer-events-none` cuando `controlsVisible` es false (no-touch, sin hover) → **en escritorio sin hover las flechas no son accesibles por teclado** hasta hacer hover. Los puntos sí quedan siempre visibles. Defecto de interacción dependiente de hover (parcialmente mitigado).
- Filtros de producto: `<button>` con `aria-pressed`, alcanzables con Tab, activables con Enter/Space. Sin navegación por flechas (aceptable como toggles independientes).

### Screen reader (**pendiente: requiere ejecución en vivo** — NVDA/VoiceOver no ejecutables en auditoría estática)
Hallazgos derivados del código:
- Falta `<main>` → sin landmark de contenido principal; el SR no ofrece "saltar al contenido principal".
- `<nav>` no tiene `aria-label` (`hero.tsx:162`) — el design system §4 especifica `aria-label="Principal"`; no implementado.
- `<html lang="es">` fijo: con idioma CA o EN activo, el SR sigue en fonética española (defecto 35).
- Cart sin `role="dialog"`/`aria-labelledby` → el SR no anuncia "diálogo" ni el título al abrir.
- Mensajes de éxito (contacto, off-season, checkout) no anunciados.
- Alt text de imágenes: el logo es `alt="Yaya Mariana"` (OK, es el nombre). Las fotos de producto son `alt={`${name} foto ${current+1}`}` → p.ej. "Fresa Mágnum foto 1" — descriptivo y aceptable, no genérico. Las imágenes del carrito `alt={item.name}` — OK. **Sin alts genéricos ni filenames.** PASS en calidad de alt.
- Iconos decorativos: inconsistencia — values/contact/hero usan `aria-hidden`, stats/values-icons no (defectos 29, 30).

### 200% / 400% zoom (**pendiente: requiere ejecución en vivo**)
No medible en estático. Riesgos identificados en el código (relevante para el input de Nil «la web se ve junta, mal distribuida»):
- `hero.tsx:256`: `min-h-[calc(100vh-72px)]` en el Hero — a 200% zoom el contenido puede desbordar verticalmente o solaparse con la placa de variedades.
- Hero a dos columnas con `md:w-[55%]` / `md:w-[45%]` y `gap-0` — a zoom alto las columnas pueden quedar apretadas.
- Nav con `height: 72` fijo (`hero.tsx:168`) — a 200% el texto del nav puede recortarse contra la altura fija.
- StatsStrip `grid-cols-2` en móvil con `max-w-[14ch]` en labels — riesgo de recorte a zoom alto.
- Tamaños de texto muy pequeños (`text-[0.65rem]` ≈10.4px en "Eliminar" y badge) — a zoom no rompen layout pero parten de un tamaño sub-óptimo.
**Verificación obligatoria en vivo antes del gate.**

### Color-blindness simulation (**pendiente: requiere ejecución en vivo**)
No ejecutable en estático. Observación de código: la marca es monocroma (un rojo + neutros cálidos + cream), así que deuteranopia/protanopia/tritanopia no deberían perder distinción entre elementos (no hay rojo-vs-verde como portador de significado). El único punto de color funcional es el botón "Añadido" verde (`bg-green-500`) — se apoya en icono de check + texto, así que no depende solo del color. **Riesgo bajo, confirmar en vivo.**

### Forced-colors / alto contraste (**pendiente: requiere ejecución en vivo**)
No ejecutable. Riesgo: degradados de fondo (CTA, botones, FAB) y `MeshGradient` desaparecen bajo `forced-colors: active`; los botones con texto blanco sobre degradado pueden perder fondo. Verificar que los CTA conservan borde/legibilidad en modo forzado.

### Movimiento
- `prefers-reduced-motion`: bien implementado en general — `MotionConfig reducedMotion="user"` (providers), media query CSS (`globals.css`), MeshGradient `speed={reduceMotion ? 0 : 0.5}`, count-up gateado, pétalo easter-egg gateado.
- **Excepciones (defectos 32, 33):** el shine infinito del badge y el auto-rotate del carousel (`setInterval`) — el segundo es JS puro y NO lo detiene `MotionConfig`. Movimiento automático que ignora reduced-motion.

---

## Intentional exceptions (no marcadas como defecto)
- **Cita como `<h1>` del Hero** — decisión de `hierarchy-master` / `creative-director` ratificada en Fase 3 (design system §4: "La cita debe ser el `<h1>` real de la home"). No se re-flagea como defecto duro; se anota como reserva de revisión SR (defecto 28, MEDIUM).
- **CTAs demo no funcionales / enlaces `#`** — footer blog/envíos/legal apuntan a `#` por decisión de proyecto (páginas pendientes). No es defecto a11y per se, pero un enlace a `#` sin destino confunde al SR; conviene marcarlos `aria-disabled` o convertir en `<button>` deshabilitado con disclaimer (consistente con la regla La Nonna de CTAs demo). Anotado como observación, no como defecto bloqueante.
- **Sin dark mode** — retirado por decisión de Nil en Fase 3. Correcto, no se audita modo oscuro.

---

## Hallazgo conexo al input de Nil («la web se ve junta, mal distribuida»)
No es el dominio directo de este agente, pero sí toca el eje 6 (baja visión / zoom). Riesgos de layout que pueden agravarse a 200% zoom: Hero con `min-h-[calc(100vh-72px)]` y columnas `%` sin `gap`, nav con altura fija de 72px, grids de 2 columnas en móvil con `ch`-clamps. Recomendación: que `spacing-perfectionist` / `visual-perfection` verifiquen distribución y que la verificación de zoom 200%/400% en vivo se haga antes del gate. La sensación de "junta" puede provenir de `--space-section-gap` aplicado de forma desigual (varias secciones usan `py-20` hardcodeado en vez del token `.section`).

---

## Status

**FAIL** — correcciones obligatorias antes de que `visual-perfection` audite y antes del `quality-gate`.
El sitio NO alcanza WCAG AA: 16 defectos CRITICAL, de los cuales ~14 son fallos AA de contraste en cuerpo de texto causados por opacidad sobre texto (incumplimiento sistemático de la regla dura G-1 del design system de Fase 3), más 2 diálogos sin focus-trap en la ruta de conversión y la ausencia de `<main>`/skip-link. La causa raíz de los fallos de contraste es única y el design system de Fase 3 ya prescribió la solución (tokens de texto SÓLIDOS `--color-text-secondary` / `--color-text-muted` / `--color-text-on-deep`); Fase 4 aplicó los tokens al `globals.css` pero NO migró los componentes — siguen con `text-[...]/NN` hardcodeado. La corrección es mecánica: reemplazar cada `text-color/NN` por el token sólido equivalente y eliminar la opacidad.

## Handoff — `iteration-agent` (lista priorizada)

**Bloque 1 — CRITICAL contraste (mecánico, aplicar G-1 en todo el build):**
1. Eliminar TODA opacidad sobre texto en `stats-strip.tsx`, `cta.tsx`, `footer.tsx`, `products.tsx`, `values.tsx`, `contact.tsx`, `cart.tsx`, `checkout.tsx`. Sustituir por: texto sobre superficie clara → `--color-text-secondary` / `--color-text-muted` / `--color-brand-primary`; texto sobre maroon/footer/CTA → `--color-text-on-deep` (cream sólido). Referencia: tabla §7 del design system de Fase 3.
2. Hero (#40): scrim sólido legible bajo el bloque de texto sobre el MeshGradient.

**Bloque 2 — CRITICAL teclado/SR:**
3. `<main id="contenido">` envolviendo `page.tsx`; `<a class="skip-link" href="#contenido">` traducido como primer focusable en `layout.tsx`.
4. Cart drawer: `role="dialog"` + `aria-modal` + `aria-labelledby`, focus-trap, `Esc`-close, retorno de foco al FAB.
5. MobileNav y LanguageSelector: focus-trap + `Esc`-close + retorno de foco.

**Bloque 3 — HIGH:**
6. `language-context.tsx`: aceptar `"en"` en la rehidratación; sincronizar `<html lang>` con el idioma activo.
7. Auto-rotate del carousel: gatear con `useReducedMotion()` + control de pausa accesible.
8. `role="status" aria-live="polite"` en los mensajes de éxito de contacto, off-season y checkout.
9. Validación de formulario accesible (`aria-invalid` + `aria-describedby` + mensaje que explica el fix) en contacto y checkout.
10. `<nav aria-label="Principal">`; placeholders oscurecidos a token sólido ≥4.5:1; borde de input de checkout a token con contraste (escalar a `creative-director` el valor exacto ≥3:1).

**Bloque 4 — MEDIUM/LOW:**
11. `aria-hidden` consistente en SVG decorativos (stats, values icons).
12. Gatear el shine del badge con `useReducedMotion()`.

---

## Verificación pendiente de ejecución en vivo (obligatoria antes del gate)
- axe-core + Lighthouse a11y + WAVE sobre `/` y `/checkout` (servidor encendido).
- Walkthrough real con lector de pantalla (NVDA en Windows): orden de anuncio, eficacia ARIA, anuncio de contenido dinámico, calidad de alt.
- Walkthrough teclado-solo completo de la ruta de conversión (añadir → cesta → checkout → pago).
- Zoom 200% y 400% en navegador: confirmar/descartar los riesgos de layout del Hero, nav de altura fija y grids móviles.
- Simulación de daltonismo (deuteranopia, protanopia, tritanopia, acromatopsia).
- Modo `forced-colors: active`: verificar legibilidad de CTAs y botones con fondo en degradado.

---
*Auditoría estática realizada en modo AUDIT. No se modificó ningún archivo de código. Ratios de contraste calculados a mano componiendo el color de texto sobre el fondo real de cada superficie al porcentaje de opacidad declarado en las clases Tailwind. Las herramientas que requieren runtime se marcan explícitamente como pendientes y no se reportan números inventados.*
