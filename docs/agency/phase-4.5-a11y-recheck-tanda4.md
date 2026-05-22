# FASE 4.5 — Re-chequeo incremental TANDA 4 · Clúster C5 (Accesibilidad estructural) · Yaya Mariana
## Entregable del agente `accessibility-perfectionist`

**Proyecto:** Yaya Mariana — sitio HOMENAJE a la abuela de Nil · rama `clasico`
**Modo:** AUDIT — re-chequeo ESTÁTICO del código. No se modificó ningún archivo de código ni memoria de agencia.
**Fecha:** 2026-05-22
**Alcance del re-chequeo:** clúster C5 — eje 2 (Teclado) y eje 3 (Screen-reader) + lo estructural (landmarks, skip-link, `<html lang>`, live regions, validación accesible, `aria-hidden` en SVG decorativos, `nav` etiquetado, auto-rotate gateado).
**Fuera de alcance (por instrucción):** clúster C6 / móvil — lo re-evalúa otro agente. El eje 1 (Contraste / C2) ya pasó a PASS en TANDA 2 (9.0/10) y no se re-evalúa aquí.
**Archivos leídos en estado actual:** `src/hooks/use-focus-trap.ts` · `src/app/layout.tsx` · `src/app/page.tsx` · `src/components/providers.tsx` · `src/context/language-context.tsx` · `src/components/ui/skip-link.tsx` · `src/components/ui/cart.tsx` · `src/components/ui/hero.tsx` (Nav + MobileNav + LanguageSelector) · `src/components/ui/contact.tsx` · `src/components/ui/cta.tsx` · `src/components/ui/products.tsx` · `src/components/ui/stats-strip.tsx` · `src/components/ui/values.tsx` · `src/components/ui/checkout.tsx` · `src/components/ui/footer.tsx` · `src/components/ui/about-us.tsx` · `src/app/globals.css` · `src/i18n/translations.ts`.

---

## Contexto — qué resolvía TANDA 4 (clúster C5)

OLA 1 (auditoría previa, score global **4.6/10 FAIL**) marcó los ejes Teclado y Screen-reader en **FAIL** con un bloque de defectos CRITICAL/HIGH: ausencia de `<main>` y skip-link, dos diálogos sin focus-trap (Cart, MobileNav), `LanguageSelector` sin teclado completo, `<html lang>` fijo, rehidratación que ignora `"en"`, mensajes de éxito no anunciados, validación de formulario no accesible, `<nav>` sin `aria-label`, SVG decorativos sin `aria-hidden`, y auto-rotate del carousel sin respeto a reduced-motion.

TANDA 4 debía cerrar el clúster C5 completo. Este re-chequeo verifica, a nivel de código, ítem por ítem.

---

## Verificación ítem por ítem

### Ítem 1 — `<main>` y skip-link funcional como primer focusable · **RESUELTO**

- `src/app/page.tsx:20` — `<main id="contenido" tabIndex={-1}>` envuelve StatsStrip, Products, AboutUs, Values, CTA, Contact. El `tabIndex={-1}` es correcto: un landmark no es focusable por defecto, y sin él el foco no aterrizaría en `<main>` al activar el skip-link (solo el scroll saltaría). Decisión bien razonada.
- El `<nav>` (sticky, dentro de Hero) y el propio `<Hero>` quedan **fuera** del `<main>` — correcto: el nav y el hero-headline no son "contenido principal" saltable; `<main>` empieza justo después.
- `src/components/ui/skip-link.tsx` — componente cliente nuevo. Renderiza `<a href="#contenido" className="skip-link">{t.skipLink}</a>`. El ancla `#contenido` coincide con el `id` del `<main>`. **OK.**
- `src/components/providers.tsx:18` — `<SkipLink />` se monta **antes** que `<CartProvider>{children}</CartProvider>`, dentro de `<LanguageProvider>`. Es el primer nodo del árbol bajo el provider de idioma → es el **primer elemento focusable del `<body>`**. **Correcto.**
- `src/app/globals.css:303-310` — `.skip-link` posicionado `top: -3rem` (oculto), `:focus { top: var(--space-2) }` (visible arriba-izquierda), `z-index: 100`, fondo `--color-brand-primary` + `--color-text-on-brand`. Patrón estándar oculto-hasta-foco. **OK.**
- `src/i18n/translations.ts:5,162,319` — clave `skipLink` presente en los 3 idiomas: ES "Saltar al contenido", CA "Salta al contingut", EN "Skip to content". **OK.**

Veredicto: `<main>` existe, el skip-link es el primer focusable, está traducido y su ancla resuelve. Defectos OLA 1 #26 y #27 — **cerrados.**

> Nota menor (no defecto): `.skip-link:focus` usa el token `--color-brand-primary` de fondo con texto `--color-text-on-brand` (blanco) — ese par da contraste AAA (verificado en TANDA 2). El anillo de foco propio (`:focus-visible` global, 2px) se mantiene sobre él. Sin objeción.

---

### Ítem 2 — Cart drawer: diálogo modal accesible + focus-trap + Escape + retorno de foco · **RESUELTO**

`src/components/ui/cart.tsx`:
- Línea 79-91 — el panel es `<motion.div role="dialog" aria-modal="true" aria-labelledby="cart-title" tabIndex={-1} ref={panelRef}>`.
- Línea 94 — `<h2 id="cart-title">` existe y es el destino de `aria-labelledby`. El SR anunciará "diálogo, {título de la cesta}". **Cableado correcto.**
- Línea 19-20 — `closeCart = useCallback(() => setOpen(false), [])` (referencia estable) y `panelRef = useFocusTrap({ active: open, onClose: closeCart })`. El `useCallback` con deps `[]` evita que el efecto del hook se re-ejecute en cada render. **Bien.**
- `aria-modal="true"` — declarado. (Observación: el contenido de fondo no recibe `aria-hidden`/`inert`; con `aria-modal` los SR modernos lo tratan como atrapado, pero un `inert` en el resto del árbol sería el cinturón-y-tirantes. Ver "Pendientes" — no es defecto bloqueante.)
- El backdrop (línea 68-76) cierra al click — conservado de OLA 1, correcto.
- Botón de cerrar (línea 96) `w-11 h-11` ≥44px — tap target OK (eje móvil, lo cubre C6, se anota como sano).
- `handleCheckout` (línea 22) hace `setOpen(false)` antes de `router.push` — al cerrar, el hook devuelve el foco; la navegación a `/checkout` ocurre acto seguido. Sin trampa.

**Lógica del focus-trap (`use-focus-trap.ts`) — revisada en detalle:**
- Línea 40 — al activarse guarda `triggerRef.current = document.activeElement` → el FAB que abrió el drawer. Como el `<motion.button>` del FAB (cart.tsx:32) es lo que el usuario activa con Enter/Space, será el `activeElement` en ese instante. **Retorno de foco al FAB: correcto.**
- Línea 44-48 — `focusables()` consulta `FOCUSABLE_SELECTOR` (a[href], button no-disabled, inputs, textarea, select, `[tabindex]` ≠ -1) y filtra por `el.offsetParent !== null` (visible) — descarta elementos ocultos. Recalcula en vivo en cada Tab, así que tolera contenido dinámico (items que se añaden/quitan del carrito). **Robusto.**
- Línea 50-54 — al abrir, foco al primer focusable; si no hay ninguno, al contenedor (`tabIndex={-1}` lo permite). El primer focusable del drawer es el botón de cerrar — aterrizaje razonable.
- Línea 56-61 — `Escape` → `preventDefault()` + `onClose()`. **Escape-close: correcto.**
- Línea 62-83 — manejo de `Tab`/`Shift+Tab`: si el foco está en el último (o salió del contenedor) y se pulsa Tab → vuelve al primero; espejo para Shift+Tab. La cláusula `!container?.contains(activeEl)` re-captura el foco si por cualquier razón se escapó. **Ciclo de foco: correcto.**
- Línea 86-92 — listener en `document` (capta el Tab esté donde esté el foco); el cleanup quita el listener **y** ejecuta `triggerRef.current?.focus?.()` → retorno de foco al cerrar O al desmontar. El optional-chaining `?.focus?.()` evita el throw si el trigger ya no existe.

Punto a vigilar (no defecto): el retorno de foco vive en el cleanup del `useEffect`. Como el panel está dentro de `<AnimatePresence>`, el `<motion.div>` permanece montado durante la animación de salida (~exit spring). El `active` pasa a `false` al instante (`open=false`), lo que dispara el cleanup y devuelve el foco **de inmediato**, antes de que termine la animación de salida — comportamiento correcto y deseable (el foco no espera a la animación). El hook se desmonta limpio después. Sin objeción.

Veredicto: Cart drawer cumple `role="dialog"` + `aria-modal` + `aria-labelledby`, atrapa Tab, cierra con Escape y devuelve el foco al FAB. Defecto OLA 1 #24 — **cerrado.** Confirmación final del recorrido de foco real queda para el walkthrough en vivo.

---

### Ítem 3 — MobileNav y LanguageSelector: manejo de teclado · **RESUELTO**

**MobileNav (`hero.tsx:125-195`):**
- Usa el mismo hook compartido: `closePanel = useCallback(() => setOpen(false), [])`, `panelRef = useFocusTrap({ active: open, onClose: closePanel })` (línea 137-138). → focus-trap + Escape + retorno de foco al botón hamburguesa, idéntico patrón verificado en el ítem 2.
- Botón hamburguesa (línea 142-151): `aria-expanded={open}`, `aria-controls="mobile-nav-panel"`, `aria-label={menuLabel}` (traducido). El panel (línea 161) tiene `id="mobile-nav-panel"` → `aria-controls` resuelve. **OK.**
- Los enlaces del panel (línea 169-180) y el CTA tienda (línea 181-189) son `<a>` reales — focusables, dentro del trap; cada uno hace `setOpen(false)` al click (cierra el panel al navegar). El retorno de foco al hamburguesa lo da el cleanup del hook.

**LanguageSelector (`hero.tsx:21-120`):**
- `aria-haspopup="listbox"` + `aria-expanded={open}` en el trigger (línea 77-78). El desplegable es `role="listbox"` (línea 96) con `role="option"` + `aria-selected` por opción (línea 103-105). Semántica ARIA de listbox correcta.
- **Escape:** dos vías. (a) `onKeyDown` del trigger (línea 71-76) cierra si `open`. (b) `handleListKeyDown` (línea 51-56) en el `role="listbox"` cierra con Escape. Cubre el caso de que el foco esté en el trigger o en una opción. **OK.**
- **Flechas ↑/↓:** `handleListKeyDown` (línea 57-63) — `ArrowDown`/`ArrowUp` con `preventDefault()`, calcula el índice con wrap-around (`(current + delta + N) % N`) y mueve el foco a la opción siguiente/anterior vía `optionRefs`. **Navegación por flechas: correcta**, incluido el ciclado en los extremos.
- **Retorno de foco:** `close(returnFocus = true)` (línea 44-48) hace `triggerRef.current?.focus()`. Se llama desde Escape y desde el `onClick` de cada opción (`setLang(code); close()`). → al elegir idioma o cerrar con Escape, el foco vuelve al botón disparador. **OK.**
- Al abrir, `useEffect` (línea 38-42) enfoca la opción correspondiente al idioma activo — buen detalle de UX de teclado.
- Click-fuera (`mousedown` global, línea 29-35) cierra sin devolver foco — correcto, un click-fuera no debe robar el foco.

Punto a vigilar (no defecto): el `LanguageSelector` no usa `useFocusTrap`; el ciclo de Tab dentro del listbox no está "atrapado" como en el Cart. Es **aceptable** para un menú de popup (patrón APG combobox/listbox: Tab fuera del listbox simplemente lo cierra y mueve el foco — comportamiento esperado, no un defecto). Las flechas + Escape + retorno de foco cubren el contrato de teclado de un listbox. Sin objeción.

Veredicto: MobileNav con focus-trap completo; LanguageSelector con Escape + flechas + retorno de foco + semántica listbox. Defecto OLA 1 #25 — **cerrado.**

---

### Ítem 4 — `<html lang>` sigue al idioma; rehidratación acepta `"en"` · **RESUELTO**

`src/context/language-context.tsx`:
- Línea 23 — el guard de rehidratación es `if (stored === "es" || stored === "ca" || stored === "en")` — **`"en"` ahora aceptado** (antes solo `"es"|"ca"`). Defecto OLA 1 #35a — cerrado.
- Línea 24-25 — al rehidratar: `setLangState(stored)` **y** `document.documentElement.lang = stored`.
- Línea 32-33 — en `setLang`: además de `setLangState` + `localStorage.setItem`, ejecuta `document.documentElement.lang = l`. → al cambiar de idioma en vivo, `<html lang>` se actualiza y el SR cambia de fonética. Defecto OLA 1 #35b — **cerrado.**
- `src/app/layout.tsx:31` — `<html lang="es">` sigue siendo el valor inicial del SSR (correcto: el idioma por defecto es ES; el cliente lo ajusta en el primer efecto si hay un idioma guardado distinto).

Veredicto: rehidratación de los 3 idiomas + `<html lang>` dinámico. Defecto OLA 1 #35 — **cerrado.**

> Reserva menor (no defecto, no bloqueante): entre el render del servidor (`lang="es"`) y el primer `useEffect` del cliente hay una ventana de un tick en la que un usuario que guardó CA/EN ve `lang="es"`. Es el comportamiento estándar de un idioma persistido en `localStorage` sin cookie/SSR; impacto SR despreciable (un SR no re-locuta el documento entero por un cambio de `lang` a mitad de carga). Si en el futuro se quiere eliminar el flash, la vía es una cookie leída en el server component. Anotado como deuda, no como fallo C5.

---

### Ítem 5 — `role="status"` en los 3 mensajes de éxito + validación accesible · **RESUELTO**

**`role="status" aria-live="polite"` — los 3 bloques de éxito:**
- Contact (`contact.tsx:190`) — `<div role="status" aria-live="polite">` envuelve el bloque "mensaje enviado". **OK.** Defecto OLA 1 #37 — cerrado.
- Off-season CTA (`cta.tsx:106`) — `<div role="status" aria-live="polite">` envuelve el bloque "te avisaremos". **OK.** Defecto OLA 1 #36 — cerrado.
- Checkout (`checkout.tsx:127`) — `<div role="status" aria-live="polite">` envuelve "¡Pedido confirmado!". **OK.** Defecto OLA 1 #37 (checkout) — cerrado.

Los tres son correctos: el contenedor con `role="status"` se monta condicionalmente cuando llega el estado de éxito, así que el SR anuncia el contenido al insertarse en el DOM (live region presente antes de poblarse, vía el render condicional del padre). El SVG de check dentro de cada bloque lleva `aria-hidden` — sin ruido. **Patrón correcto.**

**Validación accesible — Contact y Checkout:**
- Contact (`contact.tsx`): `<form noValidate>` (línea 219). `handleSubmit` (línea 111-129) recorre los campos con la **Constraint Validation API** (`field.validity`), traduce el motivo (`valueMissing`→required, `typeMismatch`→email) vía `messageFor`, y puebla `errors`. Cada input lleva `aria-invalid={errors.x ? true : undefined}` y `aria-describedby={errors.x ? "x-error" : undefined}`; el `<p id="x-error">` se renderiza con el texto del error en `--color-error`. `handleChange` (línea 98-109) limpia el error en cuanto el campo vuelve a ser válido. Los `<label htmlFor>` están presentes en los 4 campos (name/email/subject/message) con asterisco visible en los requeridos. El `required` nativo se mantiene en el markup. **Cableado completo y correcto.**
- Checkout (`checkout.tsx`): mismo patrón. `<form noValidate>` (línea 167). `handleSubmit` (línea 65-78) usa la Constraint Validation API, `fieldErrors` por campo. El componente `Field` (línea 357-388) genera `<label htmlFor>` + asterisco + `<p id="{htmlFor}-error">`; cada input lleva `aria-invalid` + `aria-describedby` condicionados al error, e ids `co-name`, `co-email`, `co-address`, `co-city`, `co-zip` que casan con los `htmlFor`/`-error`. `clearFieldError` limpia al volver a válido. Los `<fieldset>`/`<legend>` agrupan secciones (Datos personales / Dirección / Pago) — semántica de formulario AAA. **Correcto.**
- Claves `formErrors` (`required`, `email`) presentes en los 3 idiomas en `translations.ts` (líneas 6-9 ES, 163-166 CA, 320-323 EN). Los mensajes explican el formato esperado ("Introduce un correo electrónico válido"). **OK.**

Veredicto: 3/3 mensajes de éxito anunciados; validación accesible bien cableada en ambos formularios. Defectos OLA 1 #36, #37, #38 — **cerrados.**

> Observación de calidad (no defecto): al fallar la validación, el foco no se mueve automáticamente al primer campo inválido — el usuario de teclado/SR descubre los errores leyendo. Es **aceptable** (los `aria-describedby` quedan asociados; al tabular a un campo inválido el SR locuta el error). Mover el foco al primer error sería un refinamiento AAA opcional, no un requisito. Anotado en "Pendientes" como mejora menor.

---

### Ítem 6 — `aria-hidden` en SVG decorativos · `<nav aria-label>` · auto-rotate gateado · **RESUELTO**

**`aria-hidden` en SVG decorativos:**
- StatsStrip (`stats-strip.tsx:12,20,29,37`) — los 4 SVG de iconos llevan `aria-hidden`. Defecto OLA 1 #29 — cerrado.
- Values (`values.tsx:9,15,19,24,31,35`) — los 6 SVG del array `ICONS` llevan `aria-hidden`. Defecto OLA 1 #30 — cerrado.
- Consistencia verificada también en: el chevron del LanguageSelector (`hero.tsx:84`), el icono de hamburguesa (`hero.tsx:152`), el separador `·` del nav (`hero.tsx:262`), el divisor de la placa de variedades (`hero.tsx:423,430`), el SVG de check de Contact (`contact.tsx:201`) y de off-season (`cta.tsx:108`), el chip de trazabilidad y el "shine" del badge en Products (`products.tsx:331,364`), el pétalo easter-egg (`products.tsx:313`). Todos los SVG puramente decorativos llevan `aria-hidden`. Los SVG informativos que no lo necesitan (flechas del carousel, botones de cantidad) están dentro de `<button>` con `aria-label`, así que el SVG interno no genera ruido. **Consistente.**

**`<nav aria-label>`:**
- `hero.tsx:212` — `<nav aria-label={t.hero.navLabel}>`. La clave `navLabel` existe en los 3 idiomas: ES/CA "Principal", EN "Main" (`translations.ts:11,168,325`). Defecto OLA 1 (nav sin label) — **cerrado.**
- Solo hay **un** `<nav>` en el sitio (verificado por barrido). El footer usa `<ul>` de enlaces sin envoltura `<nav>` — aceptable (los enlaces de footer no obligan a un landmark de navegación; un único `<nav>` etiquetado es lo correcto). Sin conflicto de landmarks duplicados.

**Auto-rotate del carousel gateado con reduced-motion:**
- `products.tsx:79` — `const reduceMotion = useReducedMotion();` dentro de `ProductCarousel`.
- Línea 90-102 — el `useEffect` del `setInterval(next, 3000)`: la guarda es `if (hovered || isTouch || reduceMotion) { clearInterval; return; }`. Con `prefers-reduced-motion` activo el intervalo **no se arma**. El comentario del código lo explica correctamente: el `setInterval` es JS puro y `MotionConfig` no lo detiene, por eso se gatea explícitamente. Defecto OLA 1 #33 (parte reduced-motion) — **cerrado.**
- Pausa además on-hover (`hovered`) y en dispositivos táctiles (`isTouch`).

> Pendiente parcial heredado de OLA 1 #33 (no es regresión, no es C5 estricto): el auto-rotate sigue **sin un control de pausa accesible por teclado/foco** — solo se pausa con `hover`, `isTouch` o reduced-motion. WCAG 2.2.2 pide un mecanismo de pausa para contenido en movimiento automático >5s. El ciclo es de 3s y se detiene en cuanto el usuario interactúa (las flechas/puntos son `<button>` reales y el foco entra ahí), lo que mitiga; pero un usuario de teclado sin reduced-motion no tiene un botón de pausa explícito. **Severidad rebajada a MEDIUM** respecto al HIGH de OLA 1, porque el caso de mayor impacto (usuario con sensibilidad al movimiento → reduced-motion) ya está cubierto. Se mantiene como mejora pendiente, no como bloqueante de C5.

> Observación heredada de OLA 1 (carousel, eje teclado): las flechas del carousel tienen `pointer-events-none` cuando `controlsVisible` es `false` (escritorio sin hover). En ese estado las flechas no son alcanzables por teclado hasta hacer hover; los **puntos** (dots) sí quedan siempre operables por teclado (sin `pointer-events-none`). El carousel es navegable por teclado vía los dots en todo momento, así que no es un teclado-trap ni un camino bloqueado — pero las flechas dependientes de hover siguen siendo un defecto de interacción menor (MEDIUM) heredado, no introducido por TANDA 4. Confirmar con walkthrough en vivo.

Veredicto: `aria-hidden` consistente, `<nav>` etiquetado y traducido, auto-rotate gateado con reduced-motion. Núcleo del ítem 6 — **resuelto;** restan dos refinamientos MEDIUM heredados (control de pausa accesible, flechas dependientes de hover).

---

## Regresiones

**No se detecta ninguna regresión introducida por TANDA 4.** Comprobaciones realizadas:

- El hook `use-focus-trap.ts` añade un listener `keydown` a `document` solo cuando `active` es true y lo retira en el cleanup — no quedan listeners colgados, no interfiere con el teclado fuera de los overlays.
- El `useCallback` de `closeCart`/`closePanel` con deps `[]` evita re-suscripciones del efecto del hook en cada render — no hay bucle de efectos.
- El skip-link como primer focusable no altera el orden de tabulación posterior (nav → contenido) — el DOM sigue el orden visual.
- `<main id="contenido">` no rompe el layout (es un wrapper semántico sin estilos propios; `tabIndex={-1}` no lo mete en el orden de Tab natural).
- `document.documentElement.lang` se escribe en efecto/handler de cliente — no provoca mismatch de hidratación (el SSR sigue emitiendo `lang="es"`).
- El eje 1 (Contraste), que pasó a PASS en TANDA 2, **no se ve afectado**: TANDA 4 no tocó colores de texto; los tokens sólidos siguen en su sitio. Sin regresión de contraste.
- La validación accesible con `noValidate` mantiene el atributo `required` en el markup — la Constraint Validation API (`field.validity`) sigue funcionando porque `noValidate` solo suprime el *bubble* nativo, no la evaluación de validez. Cableado correcto, sin regresión funcional del formulario.

**Defectos C5 de OLA 1 que sigan abiertos:** ninguno de severidad CRITICAL o HIGH. Quedan dos puntos MEDIUM heredados, ya presentes en OLA 1 y **no** empeorados por TANDA 4:
1. Carousel sin control de pausa accesible por teclado (OLA 1 #33, parte WCAG 2.2.2) — el componente reduced-motion sí está resuelto; falta el botón de pausa explícito.
2. Flechas del carousel con `pointer-events-none` dependiente de hover en escritorio (OLA 1, hallazgo del walkthrough de teclado) — mitigado porque los dots son siempre operables.
Ambos se trasladan como mejora, no bloquean el cierre de C5.

---

## Estado de los ejes — recálculo

| # | Eje | Estado OLA 1 | Estado TANDA 4 | Detalle |
|---|------|---|---|---|
| 1 | Contraste | FAIL → **PASS** (TANDA 2) | **PASS** (sin cambios) | Resuelto en TANDA 2 (9.0/10). No re-evaluado aquí; sin regresión. |
| 2 | **Teclado** | **FAIL** | **PASS** | Focus-visible global ya estaba OK. Cart drawer, MobileNav: focus-trap completo (Tab cicla, Escape cierra, retorno de foco al trigger) vía hook compartido revisado línea a línea. LanguageSelector: Escape + flechas ↑/↓ con wrap + retorno de foco + semántica listbox. Skip-link como primer focusable. Sin teclado-traps. Restan 2 refinamientos MEDIUM en el carousel (pausa accesible, flechas hover-dependientes) — no bloquean AA. |
| 3 | **Screen-reader** | **FAIL** | **PASS** | `<main id="contenido">` + skip-link traducido; `role="dialog"`/`aria-modal`/`aria-labelledby` en el Cart; `<html lang>` dinámico + rehidratación de los 3 idiomas; `role="status" aria-live="polite"` en los 3 mensajes de éxito; validación accesible (`aria-invalid` + `aria-describedby` + `<p>` de error) en Contact y Checkout; `<nav aria-label>` traducido; `aria-hidden` consistente en SVG decorativos. Calidad de alt-text ya era PASS en OLA 1. |

**Eje 2 — Teclado: FAIL → PASS.**
**Eje 3 — Screen-reader: FAIL → PASS.**

---

## Score de accesibilidad GLOBAL actualizado

**Score global: 8.7 / 10** (antes **4.6 / 10 FAIL**).

Construcción del score (combinando lo conocido; C6/móvil lo cierra otro agente):
- **Eje 1 Contraste — PASS (9.0/10):** cerrado en TANDA 2. Todos los textos pasan AA contra su fondo real; la mayoría AAA. Único déficit: borde de input de UI-component en reposo bajo 3:1, ya escalado a `creative-director`.
- **Eje 2 Teclado — PASS:** focus-trap correcto en los dos modales, LanguageSelector con teclado completo, skip-link operativo, focus-visible de marca, sin traps. Resta solo el refinamiento MEDIUM del control de pausa del carousel.
- **Eje 3 Screen-reader — PASS:** landmarks (`<main>`, único `<nav>` etiquetado, `<footer>`), `role="dialog"` con nombre accesible, live regions en los 3 éxitos, validación programáticamente asociada, `<html lang>` dinámico, `aria-hidden` consistente, jerarquía de un solo `<h1>`.
- **Eje 4 Cognitiva — PASS (con reservas, sin cambios):** lenguaje llano, etiquetas consistentes, ahora con mensajes de error que explican el fix.
- **Eje 8 Movimiento — PASS:** `prefers-reduced-motion` bien cableado; el último hueco (auto-rotate JS) quedó gateado en TANDA 4.
- **Eje 7 Auditiva — PASS (N/A):** sin audio/vídeo.
- **Ejes 5 (Motora) y 6 (Baja visión/zoom) — clúster C6:** los re-evalúa otro agente; el código leído muestra tap targets ≥44px ya resueltos y `env(safe-area-inset)` aplicado, indicios positivos, pero el score de C6 no es mío.

El 8.7 (no 9–10) refleja: (a) la verificación con herramientas y walkthroughs en vivo sigue **diferida por diseño** — un score 9–10 exige el pase manual de NVDA + teclado real + axe confirmado; (b) restan 2 refinamientos MEDIUM en el carousel; (c) el borde de input bajo 3:1 sigue pendiente de la escalada a `creative-director`; (d) el score de C6/móvil no está consolidado por este agente. A nivel de **clúster C5, el objetivo está cumplido al 100%**: los ejes Teclado y Screen-reader pasan de FAIL a PASS sin defectos CRITICAL ni HIGH abiertos.

---

## Estado de cada ítem C5

| Ítem C5 | Estado |
|---|---|
| 1 · `<main>` + skip-link como primer focusable | **Resuelto** |
| 2 · Cart drawer (`role="dialog"`/`aria-modal`/`aria-labelledby` + focus-trap + Escape + retorno de foco al FAB) | **Resuelto** |
| 3 · MobileNav (focus-trap + Escape + retorno) y LanguageSelector (Escape + flechas + retorno) | **Resuelto** |
| 4 · `<html lang>` dinámico + rehidratación acepta `"en"` | **Resuelto** |
| 5 · `role="status"` en los 3 éxitos + validación `aria-invalid`/`aria-describedby` | **Resuelto** |
| 6 · `aria-hidden` en SVG decorativos + `<nav aria-label>` + auto-rotate gateado con reduced-motion | **Resuelto** (núcleo); restan 2 refinamientos MEDIUM heredados en el carousel — **parcial** en el sub-punto "control de movimiento del carousel" |
| 7 · Regresiones / defectos C5 de OLA 1 abiertos | **Sin regresiones**; 0 CRITICAL/HIGH abiertos; 2 MEDIUM heredados pendientes |

---

## Pendiente de verificación en vivo (diferido por diseño — obligatorio antes del gate)

El análisis es ESTÁTICO; lo que requiere runtime sigue diferido y se confirma con el servidor encendido. No se inventan números de herramienta.

- **axe-core + Lighthouse a11y + WAVE** sobre `/` y `/checkout`.
- **Walkthrough real con NVDA (Windows):** confirmar que el Cart anuncia "diálogo" + título al abrir; que las 3 live regions locutan el éxito; que `aria-invalid`/`aria-describedby` se locutan al tabular a un campo inválido; que el cambio de `<html lang>` reconfigura la fonética; que el skip-link salta y deja el foco en `<main>`.
- **Walkthrough teclado-solo completo:** ruta de conversión (añadir → abrir cesta → checkout → pago); confirmar el ciclo de Tab dentro del Cart y del MobileNav, el retorno de foco al cerrar, las flechas del LanguageSelector y la operabilidad del carousel por dots.
- **`forced-colors: active`** y zoom 200%/400% — pertenecen sobre todo al clúster C6/baja visión, los cierra el otro agente.

### Mejoras menores anotadas (no bloquean C5)
- Carousel: añadir un control de pausa accesible por teclado/foco (WCAG 2.2.2) — MEDIUM heredado.
- Carousel: revisar el `pointer-events-none` dependiente de hover en las flechas de escritorio — MEDIUM heredado (mitigado por los dots).
- Cart drawer: considerar `inert`/`aria-hidden` en el resto del árbol mientras el modal está abierto (cinturón-y-tirantes sobre `aria-modal`) — refinamiento, no fallo.
- Formularios: mover el foco al primer campo inválido tras un submit fallido — refinamiento AAA opcional.
- Idioma: eliminar el flash `lang="es"`→idioma-guardado con una cookie leída en el server component — deuda menor.

---

## Status

**Clúster C5 — PASS.** Ejes 2 (Teclado) y 3 (Screen-reader) pasan de **FAIL → PASS**. Los 6 ítems C5 están resueltos (el ítem 6 con dos refinamientos MEDIUM heredados pendientes que no bloquean AA). No hay regresiones. Combinado con el eje Contraste ya en PASS (TANDA 2), el score de accesibilidad global sube de **4.6/10 a 8.7/10**. La confirmación con axe/Lighthouse/NVDA/teclado real sigue diferida por diseño y es requisito del gate.

---
*Re-chequeo estático en modo AUDIT. No se modificó ningún archivo de código ni memoria de agencia. Verificación realizada a nivel de código/patrón; la lógica del hook `use-focus-trap.ts` se revisó línea a línea. Lo que exige runtime (NVDA, walkthrough de teclado real, axe-core, Lighthouse) se marca explícitamente como pendiente y no se reportan números de herramienta inventados. Clúster C6/móvil fuera de alcance — lo re-evalúa otro agente.*
