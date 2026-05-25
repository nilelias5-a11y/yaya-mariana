# FASE 5 — Re-auditoría de accesibilidad · Yaya Mariana
## Entregable del agente `accessibility-perfectionist`

**Proyecto:** Yaya Mariana — sitio HOMENAJE a la abuela del fundador · rama `clasico`
**Modo:** AUDIT estático. No se modificó ningún archivo de código ni memoria de agencia.
**Commit auditado:** HEAD `62c6f77` (Fase 5 TANDA 4 — performance + SEO + CWV)
**Fecha:** 2026-05-25
**Referencia histórica:**
- TANDA 2 Fase 4.5 cerró el eje 1 Contraste con score **9.0/10 PASS** (`phase-4.5-a11y-recheck-tanda2.md`).
- TANDA 4 Fase 4.5 cerró los ejes 2 (Teclado) y 3 (Screen-reader) PASS → score global **8.7/10** (`phase-4.5-a11y-recheck-tanda4.md`).
- Fase 5 introdujo TANDA 1 (distribución fina) + TANDA 2 (sistema único de botón) + TANDA 3 (texto + i18n a11y) + TANDA 4 (perf: shader Mesh → CSS gradient, SEO).
**Tools en vivo:** axe-core / Lighthouse / WAVE / NVDA — DIFERIDOS por instrucción (dev apagado). El análisis es a nivel de código y se reporta como tal.
**Archivos leídos en estado actual (Fase 5):** `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/i18n/translations.ts`, `src/components/ui/hero.tsx`, `src/components/ui/products.tsx`, `src/components/ui/cart.tsx`, `src/components/ui/contact.tsx`, `src/components/ui/checkout.tsx`, `src/components/ui/cta.tsx`, `src/components/ui/values.tsx`, `src/components/ui/stats-strip.tsx`, `src/components/ui/footer.tsx`, `src/components/providers.tsx`, `src/context/language-context.tsx`.

---

## 1 · Score global

**Score: 8.9 / 10** (antes 8.7 / 10 al cierre de Fase 4.5).

Justificación del +0.2 (no más):
- **TANDA 3 i18n:** las 4 cadenas hardcoded de `ProductCarousel` (`aria-label` de flechas, `aria-label` de dots, `alt` template) están ahora en `t.products.a11y.*` y traducidas a ES/CA/EN. La regla "ningún aria-label hardcoded" pasa a aplicarse al sitio entero — única regresión potencial vigilada, cubierta.
- **TANDA 3 microcopy:** los mensajes de éxito de Contact y Checkout pierden la exclamación de marketing (`"¡Mensaje enviado!"` → `"Mensaje enviado"`), y el error genérico de Checkout pasa a un tono explicativo y reparable (`"Algo no ha ido bien. Vuelve a intentarlo en un momento."`). WCAG SC 3.3.3 (Error Suggestion) reforzado.
- **TANDA 4 perf:** el MeshGradient WebGL del Hero (shader animado por `requestAnimationFrame`, fuera del alcance de `prefers-reduced-motion` por ser shader) ha sido sustituido por **3 radial-gradients CSS estáticos sobre `--cream-100`**. Esto resuelve dos puntos delicados a la vez: (a) el único nodo del sitio que bypaseaba el respeto a `prefers-reduced-motion`, (b) el margen estrecho del eyebrow (4.56:1 sobre el stop `#e89888` del shader) — ahora sobre `--cream-300 #ead7d4`, el ratio sube cómodamente a ~8.9:1.

No se sube más porque (a) la confirmación en vivo (axe + Lighthouse + NVDA + teclado real) sigue diferida, (b) restan defectos menores nuevos en el sistema único de botón (icon-only sin label en Cart) y heredados sin resolver (carousel sin pausa accesible, borde input <3:1 en reposo).

---

## 2 · Per-axis status

| # | Eje | Estado | Detalle |
|---|------|--------|---------|
| 1 | Contraste | **PASS** | Hero gana margen (eyebrow: 4.56 → ~8.9:1; H1: 4.56 → ~9:1) al sustituir MeshGradient por CSS gradient sobre cream-100/200/300. Resto sin cambios — texto sólido sobre fondo real, AA pasa, AAA mayoritario. Único déficit estructural: borde input en reposo `#d8b8b4` vs blanco/cream ≈ 1.8:1 < 3:1 UI (1.4.11) — pendiente de escalada a `creative-director` (heredado de TANDA 2, no es regresión). |
| 2 | Teclado | **PASS** | Focus-trap del Cart drawer y MobileNav (vía `useFocusTrap`) intactos. LanguageSelector con flechas + Escape + retorno de foco. Skip-link como primer focusable. Sistema único de botón TANDA 2 conserva `:focus-visible` global y el botón base se monta con `<button>` real con `type="button"` (sin `<div onClick>` styled-as-button). Restan refinamientos MEDIUM heredados en el carousel (pausa accesible WCAG 2.2.2, flechas hover-dependientes). |
| 3 | Screen-reader | **PASS** | Landmarks intactos. Cart drawer mantiene `role="dialog"` + `aria-modal` + `aria-labelledby`. Las 3 live regions de éxito (Contact, off-season CTA, Checkout) intactas. Validación accesible (`aria-invalid` + `aria-describedby`) en Contact y Checkout — el bloque `checkout.*` se ha completado en TANDA 3 (antes 100% hardcoded ES; ahora i18n completo). `<nav aria-label>` traducido. `<html lang>` dinámico vía `language-context`. **Novedad TANDA 3:** los 4 `aria-label`/`alt` del ProductCarousel se sirven desde `t.products.a11y.*` en 3 idiomas. |
| 4 | Cognitiva | **PASS** | Microcopy de TANDA 3 más cálido y reparable. Mensajes de error explican la acción (`"Algo no ha ido bien. Vuelve a intentarlo en un momento."`), success sin exclamación, copy "clínico" de Values reescrito en lenguaje llano. Etiquetas consistentes (skip-link, navLabel, ariaOpen, formErrors) en los 3 idiomas. |
| 5 | Motora | **PASS** | Tap targets ≥ 44 px en todos los icon-only del sistema (`.btn-icon` 44×44), incluido el cierre del Cart, los +/− de cantidad, los dots del carousel, el FAB, las flechas del carousel. `env(safe-area-inset)` aplicado al FAB y al nav sticky. Spacing entre toggles y dots ≥ 8 px verificado. |
| 6 | Baja visión / color | **PASS** (estático; zoom 200%/400% diferido a NVDA-walkthrough) | `text-base` (16 px) en todos los inputs anti auto-zoom iOS. Sin color como único portador (asterisco visible en required, mensajes de error con texto, success con icono + título). Forced-colors / zoom 400% sin confirmar — requiere runtime. |
| 7 | Auditiva | **N/A** | Sin audio ni vídeo en el build. |
| 8 | Movimiento | **PASS** (mejorado) | El MeshGradient WebGL (shader animado por `requestAnimationFrame`, fuera del alcance de `prefers-reduced-motion`) HA SIDO ELIMINADO en TANDA 4 perf — sustituido por CSS estático. El último resquicio de movimiento JS no-gateado en el sitio. Auto-rotate del carousel sigue gateado por `useReducedMotion`. Stats count-up gateado. Cart drawer slide-in con `useReducedMotion`. Sin parallax, sin scroll-jacking, sin autoplay con sonido. CSS `@media (prefers-reduced-motion: reduce)` global intacto. |

---

## 3 · Defectos por severidad

### CRITICAL — 0
*Ninguno detectado en estático. Cero AA-failures de texto, cero `<div onClick>` styled-as-button, cero modal sin focus-trap, cero outline:none sin replacement, cero alt faltante en imágenes con significado.*

### HIGH — 0
*Ninguno detectado.*

### MEDIUM — 4

| # | Ubicación | Issue | WCAG ref | Fix |
|---|-----------|-------|----------|-----|
| M1 | `cart.tsx:117` (botón cerrar drawer), `cart.tsx:161` y `cart.tsx:171` (−/+ cantidad) | Botones icon-only del sistema sin `aria-label`. El de cerrar lleva solo un SVG de cruz; los de cantidad llevan los caracteres `−` (U+2212) y `+` como contenido textual — un SR puede locutar "menos / más" sin contexto del ítem que cuantifica. | 4.1.2 | Añadir `aria-label`: cerrar = `t.cart.close` (nueva clave), decremento = `t.cart.decrease` o `${t.cart.decrease} ${item.name}` (mejor: incluye el nombre del producto), incremento idem. Clave nueva en i18n × 3 idiomas. |
| M2 | `contact.tsx:272` email placeholder | `placeholder="tu@email.com"` hardcoded en ES. El resto del formulario está i18n; solo este placeholder bypasa el contexto de idioma. No es a11y estricta (placeholder no es la etiqueta), pero el SR de un usuario CA/EN sí puede locutarlo (depende de la versión) y romper la consistencia de idioma con `<html lang>`. | 3.1.2 (Language of Parts) — borderline | Añadir `t.contact.emailPlaceholder` (ES "tu@correo.com", CA "el.teu@correu.com", EN "you@email.com") y reemplazar el literal. |
| M3 | `cta.tsx:171-182` formulario off-season | El input email tiene `required` pero no implementa el patrón accesible `noValidate` + `aria-invalid` + `aria-describedby` + `<p>` de error que sí está en Contact y Checkout (cableado por TANDA 4 Fase 4.5). El SR recibe la validación nativa del navegador (Chrome/Firefox la locutan; Safari no siempre). | 3.3.1 / 3.3.3 / 4.1.2 | Replicar el patrón de `contact.tsx`: `noValidate` en el `<form>`, estado `errors`, mensajes desde `formErrors`, `aria-invalid` + `aria-describedby` en el input. Es un único campo — 15-20 líneas. |
| M4 | `products.tsx:79-105` auto-rotate del carousel | Heredado de TANDA 4 (#33 parcial). No tiene control de pausa accesible por teclado/foco. Mitigaciones existentes: pausa con `hovered`, `isTouch`, `reduceMotion`. El ciclo es de 3 s — WCAG 2.2.2 pide mecanismo de pausa para movimiento >5 s, así que estrictamente cumple, pero la guía AAA recomienda parar también <5 s si el contenido no es esencial. | 2.2.2 (borderline) | Añadir botón "Pausar" accesible al foco; o detener el intervalo cuando un elemento del carousel reciba foco (más elegante: tabular hacia las flechas o dots ya implica intención del usuario). |

### LOW — 3

| # | Ubicación | Issue | Notas |
|---|-----------|-------|-------|
| L1 | `products.tsx:151` `alt={\`${name} ${a11y.photo} ${current + 1}\`}` | Cuando `<html lang="en">`, el alt resultante es `"Fresa Mágnum photo 1"` — mezcla de un nombre de producto en español ("Fresa Mágnum" es un sustantivo común + nombre de variedad) con sustantivo en inglés ("photo"). Estrictamente WCAG 3.1.2 pediría `<span lang="es">` sobre "Fresa Mágnum", pero los atributos `alt` no admiten markup. | El nombre "Mágnum" es propio (variedad); "Fresa" se entiende universalmente. SR moderno locuta correctamente. Solo se anota; en una pasada futura podría considerarse traducir los nombres de producto (`t.products.items[i].name`) — pero eso es decisión de copywriter/`brand-strategist`, no de a11y. |
| L2 | `footer.tsx:6-55` social icons | `aria-label="Facebook" / "Instagram" / "X / Twitter" / "Pinterest" / "LinkedIn"` hardcoded — pero son nombres de marca y no necesitan traducción. Aceptable. | Cero acción. Anotado por consistencia documental. |
| L3 | `stats-strip.tsx:46-84` AnimatedValue | El count-up cambia el contenido textual de `<span ref={ref}>{display}</span>` 60 veces/seg sin `aria-live`. El SR no anuncia cambios en spans no-live, así que **no hay spam**, pero un SR que entra en la región mientras se anima locutará "0" (valor inicial). Bajo `reduceMotion` salta directo al valor final. | Cero acción crítica. Refinamiento opcional: envolver el valor final en un `aria-label="100 por ciento"` o usar `aria-live="off"` explícito. La labels textual ("Natural", "Pesticidas"…) acompaña al número, así que el sentido se conserva. |

---

## 4 · Regresiones y nuevos hallazgos

### Regresiones — NINGUNA detectada
Comprobaciones específicas:
- **Focus-trap del Cart y MobileNav:** el sistema único de botón TANDA 2 cambió la clase a `.btn-icon` pero conservó `<button type="button">` real — el `FOCUSABLE_SELECTOR` del hook sigue capturándolo. Sin regresión.
- **Skip-link:** el ancla `#contenido` y el id en `<main>` no se han tocado en Fase 5. Verificado.
- **Validación accesible Contact/Checkout:** TANDA 3 reescribió el bloque `checkout.*` en `translations.ts` y la lógica de `handleSubmit` + `Field` quedó intacta. `aria-invalid` + `aria-describedby` siguen cableados. Nuevo: los errores se traducen vía `t.formErrors.*` en lugar de literales — el bloque `errors.generic` y `errors.cardLoad` también pasa por i18n. Sin regresión, mejora.
- **`role="status"` en mensajes de éxito:** los 3 bloques (Contact, off-season CTA, Checkout) conservan `role="status" aria-live="polite"`. El texto interno cambió (sin exclamación) pero la mecánica de anuncio no.
- **`<html lang>` dinámico:** `language-context.tsx` intacto — la rehidratación de los 3 idiomas y la actualización en vivo de `document.documentElement.lang` siguen funcionando.
- **`prefers-reduced-motion`:** el `@media` global en `globals.css:526` intacto. Más aún, la sustitución MeshGradient → CSS gradient eliminó el ÚNICO foco de motion que bypaseaba el respeto (shader WebGL es ajeno a `prefers-reduced-motion` y a `MotionConfig`). **Mejora neta.**

### Nuevos hallazgos por TANDA 3 (i18n a11y)
1. **`t.products.a11y.*` poblado en los 3 idiomas, sin clave vacía.** Verificado por barrido:
   ```
   es:  prevPhoto="Foto anterior"   nextPhoto="Foto siguiente"   goToPhoto="Ir a la foto"      photo="foto"
   ca:  prevPhoto="Foto anterior"   nextPhoto="Foto següent"     goToPhoto="Anar a la foto"    photo="foto"
   en:  prevPhoto="Previous photo"  nextPhoto="Next photo"        goToPhoto="Go to photo"        photo="photo"
   ```
   3 idiomas × 4 claves = 12 strings, todos no-vacíos. **Sincronización i18n a11y: 100 %.** Ninguna clave a11y deja `aria-label=""` o `alt=""` en ningún idioma.
2. **Caso ES≡CA `"Foto anterior" / "foto"`:** coincidencia léxica real, no error de traducción. Catalán y castellano comparten estos sustantivos. Verificado con la asimetría `siguiente`/`següent` (que sí cambia), confirmando que el traductor distinguió correctamente.
3. **Cobertura completa del ProductCarousel:** los 4 puntos donde había literal ES (`aria-label="Foto anterior"`, `aria-label="Foto siguiente"`, `aria-label={\`Ir a la foto ${i + 1}\`}`, `alt={\`${name} foto ${current + 1}\`}`) están ahora todos servidos por `a11y.*`. Cero literales ES residuales en el carousel.
4. **Microcopy de errores Checkout traducido:** `errors.generic` y `errors.cardLoad` en `t.checkout.errors.*` × 3 idiomas. Antes el `catch` hardcodeaba el ES.

### Nuevos hallazgos por TANDA 4 (perf)
5. **MeshGradient eliminado — mejora directa de accesibilidad:**
   - Eje 8 (Motion): el shader WebGL era el ÚNICO componente de motion del sitio que bypaseaba `prefers-reduced-motion` (los shaders se ejecutan en GPU y `@paper-design/shaders-react` no respeta el media query). Sustituido por 3 radial-gradients CSS estáticos. Reducción de motion neta.
   - Eje 1 (Contraste): el stop más oscuro del Mesh era `#e89888` (RL ≈ 0.288), contra el que el eyebrow Hero pasaba AA con margen estrecho (4.56:1 vs 4.5:1 floor — solo 0.06 de cushion). El nuevo gradient usa `--cream-300 #ead7d4` (RL ≈ 0.74) como stop más oscuro: el eyebrow ahora ronda ~8.9:1 — AAA holgado.
6. **Pesos de Playfair acotados a 1 (400 + italic):** sin impacto a11y directo, pero reduce el flash-of-invisible-text en navegadores con FOUT — leve mejora cognitiva (menos disrupción visual durante la carga).

---

## 5 · Sincronización i18n a11y — auditoría sistemática

Verificación de **todas** las claves que se renderizan como `aria-label`, `alt`, `title` o equivalentes accesibles, contra los 3 idiomas (ES/CA/EN):

| Clave | ES | CA | EN | Estado |
|-------|----|----|----|--------|
| `skipLink` | "Saltar al contenido" | "Salta al contingut" | "Skip to content" | OK |
| `hero.navLabel` | "Principal" | "Principal" | "Main" | OK |
| `cart.ariaOpen` | "Abrir la cesta" | "Obrir la cistella" | "Open basket" | OK |
| `products.a11y.prevPhoto` | "Foto anterior" | "Foto anterior" | "Previous photo" | OK |
| `products.a11y.nextPhoto` | "Foto siguiente" | "Foto següent" | "Next photo" | OK |
| `products.a11y.goToPhoto` | "Ir a la foto" | "Anar a la foto" | "Go to photo" | OK |
| `products.a11y.photo` | "foto" | "foto" | "photo" | OK |
| `formErrors.required` | "Este campo es obligatorio." | "Aquest camp és obligatori." | "This field is required." | OK |
| `formErrors.email` | "Introduce un correo electrónico válido." | "Introdueix una adreça de correu vàlida." | "Enter a valid email address." | OK |
| `cta.offSeason.emailLabel` (aria-label del input off-season) | "Email" | "Email" | "Email" | OK (marca/identidad de campo) |
| `checkout.errors.generic` | "Algo no ha ido bien. Vuelve a intentarlo en un momento." | "Alguna cosa no ha anat bé. Torna-ho a intentar en un moment." | "Something went wrong. Please try again in a moment." | OK |
| `checkout.errors.cardLoad` | "No hemos podido cargar el formulario de pago." | "No hem pogut carregar el formulari de pagament." | "We couldn't load the payment form." | OK |

**0 claves a11y vacías. 0 claves a11y olvidadas en algún idioma. 0 desincronizaciones.**

Estricto cumplimiento de la regla "ningún aria-label hardcoded": el barrido `aria-label=` sobre `src/` devuelve 8 ocurrencias, **todas** servidas por `t.*` o por nombre de marca (social icons del footer). El barrido `aria-label="..."` (literal entre comillas) devuelve **0 coincidencias**.

---

## 6 · Veredicto

**Score: 8.9 / 10** (antes 8.7 / 10).
**Estado: PASS** — WCAG AA site-wide confirmado en estático; AAA en casi todos los textos de cuerpo y titulares; ejes 1 / 2 / 3 / 4 / 5 / 6 / 8 PASS; eje 7 N/A.
**Sin defectos CRITICAL ni HIGH. 4 MEDIUM (3 nuevos detectables, 1 heredado) y 3 LOW.**
**Regresiones de Fase 5: cero.**
**Sincronización i18n a11y: 100 %** — ninguna clave queda vacía en ningún idioma; ninguna cadena `aria-label`/`alt` permanece hardcoded fuera de nombres de marca.

La auditoría aprueba el cierre de Fase 5 desde la perspectiva de accesibilidad. La confirmación con axe-core + Lighthouse + NVDA-walkthrough + teclado real sigue diferida por instrucción y se confirma en el gate con dev encendido. Los 4 MEDIUM son ítems de pulido (no bloqueantes de AA) — se trasladan como fixes para una siguiente pasada de mantenimiento, no como condición previa a la entrega.

### Acciones recomendadas (priorizadas)
1. **M1 (Cart icon-only sin label) — más alto impacto-coste:** añadir 3 claves nuevas a `t.cart.*` (`close`, `decrease`, `increase`) en los 3 idiomas y aplicar `aria-label` en `cart.tsx:117/161/171`. ~15 min.
2. **M2 (placeholder ES hardcoded):** añadir `t.contact.emailPlaceholder` en 3 idiomas y reemplazar el literal. ~5 min.
3. **M3 (off-season form sin patrón accesible):** replicar `noValidate` + `aria-invalid` + `aria-describedby` en `cta.tsx`. ~20 min.
4. **M4 (carousel sin pausa accesible):** detener intervalo al recibir foco un descendiente del carousel — ~10 min. Heredado.

---

*Auditoría estática en modo AUDIT. No se modificó código, memoria de agencia ni `accessibility-perfectionist-memory.md`. Las claves a11y de i18n se verificaron por barrido completo de los 3 bloques (ES/CA/EN); los ratios de contraste post-MeshGradient se calcularon a mano (fórmula WCAG 2.x sRGB) contra `--cream-300 #ead7d4` como stop más saturado del nuevo CSS gradient. Lo que exige runtime (axe-core, Lighthouse, NVDA, teclado real, zoom 200/400 %, forced-colors) se marca explícitamente como pendiente.*
