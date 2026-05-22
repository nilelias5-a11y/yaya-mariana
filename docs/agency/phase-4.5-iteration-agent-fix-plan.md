# FASE 4.5 — QA Visual · Plan de Fixes Priorizado por Tandas
## Entregable del agente `iteration-agent` — Procesador de Feedback y Gestor de Iteración

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE a la abuela de Nil
**Rama:** `clasico` · **Modo:** AUDIT (cero código tocado · cero memoria de agencia tocada)
**Fecha:** 2026-05-22
**Iteración:** Round 1 (OLA 2 — primera ejecución de `iteration-agent` en este proyecto; no existe `iteration-agent-memory.md`)
**Fuente de feedback:** QA Visual OLA 1 — 5 auditorías + consolidación `comparison-engine` (`phase-4.5-comparison-engine-consolidation.md`)
**Input prioritario de Nil:** «La web se ve junta, mal distribuida, las cosas no están bien colocadas.» → C1 (distribución/espaciado) es la prioridad nº1 declarada.

---

> # ⚑ ESTE ES UN PLAN PROPUESTO — PENDIENTE DEL GATE DE NIL
>
> **NADA de lo que sigue se ha aplicado.** No se ha modificado ningún archivo de código, ningún archivo de memoria de la agencia, ni el iteration log (que se creará SOLO cuando Nil apruebe). Todas las asignaciones de agente son **propuestas** hasta que el `director` las confirme. Este documento prepara y prioriza; la ejecución espera autorización. Hay un GATE de Nil antes de tocar nada.

---

## 0. RESUMEN DE INTAKE Y CONTEXTO

### 0.1 Qué se ha procesado
Se ingieren las 5 auditorías de OLA 1 (`spacing-perfectionist` 4.8 · `visual-perfection` 5.4 · `hierarchy-master` 5.5 · `accessibility-perfectionist` 4.6 · `mobile-obsessor` 6.4) ya consolidadas por `comparison-engine` en **71 defectos raíz** (~110 instancias de código) agrupados en **6 clústeres de causa raíz**. Score global OLA 1 = **5.0/10 FAIL** (umbral 8.5, brecha 3.5).

### 0.2 El hallazgo que define el plan
C1 + C2 + C3 **no son tres problemas — son un solo evento de proyecto**: el handoff Fase 3 → Fase 4 (`frontend-developer`) no se ejecutó. La Fase 3 entregó un design system tokenizado **completo y correcto** en `globals.css` (escala base-4, `--space-*`, `.section`, `.container`, escala tipográfica `--fs-*`/`.text-*`, tokens de color de 3 niveles, regla dura G-1 anti-opacidad). Los 10-11 componentes `.tsx` nunca se migraron a él: hardcodean color, espaciado y tamaños tipográficos. `about-us.tsx` es la única excepción que SÍ consume el sistema — y por eso puntúa 7.4, el techo demostrado del sitio.

**Consecuencia para el plan:** ~78% de los 71 defectos (clústeres C1+C2+C3, ~80-86 instancias) se cierran con **trabajo mecánico de migración, sin rediseño**. No hay decisiones creativas nuevas que tomar: el destino ya está escrito en `globals.css` y demostrado en `about-us.tsx`. Esto permite secuenciar el grueso del trabajo como ejecución, no como exploración.

### 0.3 Disciplina de scope (HARMONY PROTOCOL)
- **Cero `scope-new` detectado.** Todos los 71 defectos son corrección de trabajo de Fase 3-4 *no completado* o *no migrado*, NO features nuevas fuera del brief. No hay nada que escalar como scope creep.
- **Reclasificación de scope, no scope creep:** los clústeres C1/C2/C3 deben tratarse como **work item de Fase 4 no terminado**, no como "pulido de Fase 4.5". Esto coincide con la recomendación de `comparison-engine` §7, `hierarchy-master` y `visual-perfection`. Es una nota de encuadre para el `director`, no una bandera de coste extra.
- **Sin duplicados de rondas previas:** es Round 1 de `iteration-agent` en este proyecto. (Nota cruzada: `mobile-obsessor` confirma que la "TANDA 4 / L2" de Fase 4 cerró bien sus tap targets y formatos de imagen — ese trabajo NO se re-abre; los defectos de este plan son los que TANDA 4 no cubrió.)

---

## 1. CATEGORIZACIÓN Y PRIORIZACIÓN POR CLÚSTER

Categorías del role-spec: `visual` · `content` · `functional` · `structural` · `performance` · `scope-new`.
Escala de prioridad: **P1** (bloquea lanzamiento / suelo legal / ruta de conversión rota) · **P2** (esta iteración, explícitamente pedido) · **P3** (siguiente iteración) · **P4** (backlog) · **Scope-Escalate**.

### 1.1 Tabla maestra de clústeres

| Clúster | Título | Categoría primaria | Severidad consolidada | Prioridad `iteration-agent` | Defectos | Justificación de prioridad |
|---|---|---|---|---|---|---|
| **C1** | Sistema de espaciado de Fase 3 no migrado a componentes | `structural` (cableado de layout) + `visual` | CRITICAL · 5/5 agentes | **P1** | ~32 | Queja literal nº1 de Nil. Único clúster con consenso 5/5. Dimensión de mayor peso (30%). Sin distribución no hay entrega. |
| **C2** | Opacidad sobre texto → fallo WCAG AA sistémico | `visual` (contraste) + `functional` (suelo legal) | CRITICAL · 4/5 agentes | **P1** | ~30 | **Suelo legal WCAG AA.** Ratios reales hasta 1.9:1 = ilegible. El sitio es legalmente no entregable hasta cerrarlo. P1 por mandato del brief. |
| **C3** | Paleta + escala tipográfica hardcodeadas (token-coherence colapsada) | `visual` (color/tipografía) | CRITICAL · 3/5 agentes | **P1** (núcleo) / **P2** (residual) | ~24 | El núcleo (sustituir hex por tokens, aplicar `--fs-*`) es P1: es parte del mismo handoff roto y bloquea el re-audit con sentido. El pulido residual de jerarquía es P2. |
| **C5** | Semántica / teclado / SR — accesibilidad estructural | `functional` (a11y) + `structural` (`<main>`) | CRITICAL · 2/5 agentes | **P1** (drawer Cart + `<main>`/skip-link) / **P2** (resto) | ~11 | El Cart drawer sin focus-trap/`role=dialog`/`Esc` = **ruta de conversión inaccesible por teclado** → P1 por mandato del brief. `<main>`/skip-link ausentes = P1 (suelo SR + dependencia de otros fixes). Resto del clúster P2. |
| **C6** | Posture desktop-down — sin sistema responsive ni saneamiento móvil | `functional` (móvil) + `structural` (responsive) | CRITICAL · 1/5 agentes | **P1** (auto-zoom iOS + `inputmode`) / **P2** (resto) | ~12 | Auto-zoom iOS de inputs <16px y formularios sin `inputmode`/`autocomplete` degradan el **checkout** en audiencia ~70-80% móvil → P1. `100dvh`, `priority`, safe-area, tap-highlight son P2. |
| **C4** | Motion de anuncio — contradice el tono tributo/restraint | `visual` (motion/superficie) | HIGH · 2/5 agentes | **P2** | ~22 | Importa para la dignidad del homenaje, pero es la capa más cosmética y de menor impacto funcional. Capa de polish final. Sin defectos CRITICAL propios (CR-8 es compartido C2/C4). |

### 1.2 Prioridad por defecto raíz (de la tabla §3 del `comparison-engine`)

**P1 — Inmediato (bloquean lanzamiento / suelo legal / conversión rota):**
- Todo CRITICAL de C1: CR-1, CR-2, CR-3 (sistema de espaciado, ritmo vertical, `py-20` plano).
- Todo CRITICAL de C2: CR-4, CR-5, CR-8 (opacidad sobre texto sistémica, cadena AA del form Contact, `<h1>` Hero sobre mesh).
- Núcleo CRITICAL de C3: CR-6, CR-7 (50+ hex literales, escala `--fs-*` no aplicada).
- CRITICAL de C5 en ruta de conversión / suelo SR: CR-9 (Cart drawer inaccesible — **mandato del brief**), CR-11 (`<main>` + skip-link).
- CRITICAL de C6 en checkout: CR-12, CR-13 (auto-zoom iOS, formularios sin `inputmode`/`autocomplete`).
- **Recuento P1: 13 defectos raíz** = exactamente los 13 CRITICAL del consolidado.

**P2 — Esta iteración (explícitamente pedido por el panel QA, dentro del sprint de cierre):**
- HIGH de C1: HI-1, HI-2, HI-3, HI-4 (section-gap sub-tono, 5 anchos de contenedor, bandas oscuras desiguales, card padding distinto).
- HIGH de C2: HI-10, HI-20, HI-21 (`<h1>` AAA, bordes de input, placeholders fuera de paleta).
- HIGH de C3: HI-9, HI-11, HI-12, HI-13 (Hero placa compite, ProductCard nombre≈precio, Contact sin protagonista, `<h2>` sobredimensionados).
- HIGH de C4: HI-5, HI-6, HI-7, HI-8, HI-22 (gradientes naranja, motion de anuncio, entradas de barrido, sombras teñidas, Hero `x:-40`).
- HIGH de C5: HI-16, HI-18, HI-19 (`<html lang>`, mensajes de éxito sin `role=status`, validación accesible).
- HIGH de C5/C4: HI-17 (carousel auto-rota sin `useReducedMotion` ni pausa).
- HIGH de C6: HI-14, HI-15 (`100dvh`, primera imagen sin `priority`).
- MEDIUM de C5: CR-10 ya está en P1 como parte del clúster de overlays — se ejecuta junto al Cart; MobileNav/LanguageSelector focus-trap.
- Todos los MEDIUM: ME-1…ME-22 (normalizaciones de instancia, decoración fuera de disciplina, `type:spring`, count-up, verde fuera de paleta, safe-area, tap-highlight, `aria-hidden`, etc.).
- **Recuento P2: 22 HIGH + 22 MEDIUM = 44 defectos raíz.**

**P3 — Siguiente iteración (pulido, no urgente — entra solo si el re-audit lo exige):**
- Todos los LOW: LO-1…LO-14 (paddings residuales de botón, `pr-10` compensatorio, tracking eyebrow, autor de cita fuera de paleta, "Ver más" 5º tier, código muerto `button.tsx`, tap targets de enlaces secundarios, `overscroll-behavior`, Playfair 12 cortes→2, count-up `sr-only`).
- **Recuento P3: 14 defectos raíz.**
- *Nota:* dado que el cierre de C1/C2/C3 toca casi todos los componentes, muchos LOW se resolverán "de paso" durante P1/P2 sin coste extra (p.ej. LO-1, LO-5, LO-7, LO-8 son residuales de la migración de tokens). Se mantienen como P3 formalmente pero se recomienda barrerlos oportunísticamente.

**P4 — Backlog:** ninguno. No hay defecto que el panel no haya comprometido a corregir.

**Scope-Escalate:** ninguno. Cero feature fuera de brief.

### 1.3 Recuento de prioridades

| Prioridad | Defectos raíz | Mapeo a severidad consolidada |
|---|---|---|
| **P1** | **13** | = los 13 CRITICAL |
| **P2** | **44** | = los 22 HIGH + los 22 MEDIUM |
| **P3** | **14** | = los 14 LOW |
| **P4** | **0** | — |
| **Scope-Escalate** | **0** | — |
| **TOTAL** | **71** | |

> El mapeo prioridad↔severidad es 1:1 limpio (P1=CRITICAL, P2=HIGH+MEDIUM, P3=LOW). Esto NO es casualidad: refleja que el panel QA ya hizo una severización disciplinada y que no hay scope creep que distorsione. La aportación de `iteration-agent` no es re-severizar — es **secuenciar** los 71 defectos en tandas ejecutables con dependencias respetadas.

---

## 2. EL PLAN POR TANDAS — 5 TANDAS SECUENCIADAS + RE-AUDIT

### 2.1 Por qué tandas (patrón de Nil)

La Fase 4 de este proyecto se ejecutó en **TANDAS 1-4 con gate entre cada una** (confirmado por `mobile-obsessor`, que verifica "TANDA 4 / L2"). Es el patrón operativo de Nil: lotes pequeños, verificables, con un punto de confirmación entre ellos. Este plan lo replica. Razones técnicas, no solo de proceso:

1. **Dependencia dura — migración ANTES del re-audit.** No tiene sentido re-correr las 5 auditorías sobre un build que aún no consume su design system: el `comparison-engine` ya lo dijo (la migración C1/C2/C3 es pre-requisito del re-audit). Re-auditar a medias mediría ruido.
2. **Dependencia de colisión — orden color → tipografía → spacing → motion.** Esta es la lección de memoria global de La Nonna (Phase 8): *"Run the 4 polish agents SEQUENTIALLY (color → type → image → animation) — they share globals.css/components; parallel would conflict."* C2 (color/opacidad), C3 (tipografía), C1 (spacing) y C4 (motion) **editan los mismos archivos** (`globals.css` y los 10-11 `.tsx`). Aplicarlos en paralelo produciría conflictos de merge y sobreescrituras. Deben secuenciarse.
3. **Dependencia de cimiento — C5 estructural antes que su pulido.** `<main id="contenido">` debe existir antes de que el skip-link tenga ancla; el `id` del `<h2>` del Cart debe existir antes del `aria-labelledby`. Hay micro-dependencias dentro de C5.
4. **Gate de Nil entre tandas.** Cada tanda termina con un punto de confirmación. Nil ve progreso incremental y puede frenar/ajustar. Coherente con la preferencia absoluta de memoria global: *"Confirm with Nil before advancing each phase. Never auto-advance."*

### 2.2 Resolución del conflicto de orden — "C1 primero" (Nil) vs "color→tipografía→spacing" (memoria La Nonna)

Hay una tensión aparente que este plan resuelve explícitamente:
- El **input de Nil** y el `comparison-engine` dicen: **C1 (espaciado) primero** — es la queja nº1 y el mayor ratio impacto/esfuerzo.
- La **memoria de La Nonna** dice: en el polish, el orden es **color → tipografía → spacing → motion**.

**No se contradicen, porque operan en planos distintos.** La regla de La Nonna gobierna el *polish fino* (los 4 agentes de pulido tocando globals.css). Pero C1/C2/C3 aquí no son polish — son **migración estructural** (enchufar un sistema que ya existe). La resolución:

- **TANDA 1 ataca C1 como bloque estructural autocontenido**: subir `--space-section-gap` a `clamp()`, conectar `.section`/`.container`, normalizar ritmo. Esto toca `globals.css` (1 token) y la *clase de layout* de cada sección — NO toca color ni tipografía ni motion. No colisiona con C2/C3/C4 porque opera sobre propiedades distintas (`padding-block`, `max-width`, `padding-inline`). Esto satisface el mandato de Nil ("espaciado primero") sin violar la regla de no-colisión.
- **TANDA 2 ataca C2 (color/opacidad) y TANDA 3 ataca C3 (tipografía)** en ese orden — respetando color→tipografía de la regla de La Nonna.
- **TANDA 5 ataca C4 (motion)** al final — respetando "motion último".
- El único punto donde C1 y C3 rozan `globals.css` es: C1 edita `--space-section-gap`; C3 edita tokens de color/`--fs-*`. Son líneas distintas del mismo archivo — sin colisión real, y al ir en tandas separadas con gate, ni siquiera se editan a la vez.

> **Conclusión:** el orden de tandas es **C1 → C2 → C3 → (C5+C6) → C4**. C1 va primero por mandato de Nil y porque es estructural-no-colisionante; dentro del polish que sí colisiona, se respeta color→tipografía→…→motion. Ambas reglas se honran.

### 2.3 Las 5 tandas

---

#### **TANDA 1 — Distribución y Espaciado (C1)** · *"que la web deje de verse junta"*

**Clústeres:** C1 (completo).
**Prioridad:** P1 (núcleo CR-1, CR-2, CR-3) + P2 (HI-1…HI-4, ME-1…ME-5).
**Categoría:** `structural` + `visual`.
**Por qué primero:** mandato explícito de Nil — es su queja literal nº1. Único clúster confirmado por los 5/5 agentes. Dimensión de mayor peso (30%). Mejor ratio impacto/esfuerzo del sitio. Y es estructural-no-colisionante: toca layout, no color/tipografía/motion, así que abrir por aquí no compromete las tandas siguientes.

**Contenido:**
- `globals.css`: `--space-section-gap` 80px → `clamp(5rem, 8vw, 7rem)` (80→112px). Añadir `--space-section-gap-deep: clamp(3.5rem, 6vw, 4.5rem)` (56→72px) para bandas oscuras.
- Conectar `.section` en las secciones de contenido claras (`about-us`, `contact`, `products`, `values`) — sustituye `py-20` plano.
- Bandas oscuras (`stats-strip` `py-14`, `cta` `py-20`) → `--space-section-gap-deep` (72px) — unifica las dos bandas, hoy desiguales (56 vs 80).
- `hero.tsx`: `pt-16 pb-20` → padding simétrico del ritmo. `footer.tsx`: `pt-16` → 72px (alinear), `pb-8` se mantiene (cierre).
- Unificar anchos: `max-w-6xl`/`5xl` → `.container` (`--container-max` 72rem). Tokenizar AboutUs/CTA como `--container-prose` (anchos editoriales legítimos — registrados como excepción intencional, ver §5).
- Normalizar instancias: card padding Products `p-5`→`p-6` (iguala Values); `gap-3.5`→`gap-4`; headers de sección eyebrow→título a `mb-4`, bloque→contenido a `mb-12`; Contact `gap-14`→`gap-12`; snap de off-baseline `py-3.5`/`py-2.5` a 12/16.

**Agente ejecutor:** `frontend-developer` (migración mecánica — conectar el sistema de Fase 3, sustituciones de clase).
**Esfuerzo relativo:** **M (medio).** ~13 sustituciones `py-20`→`.section` + 1 token a `clamp()` + ~5 `max-w-*`→`.container` + ~10 normalizaciones de instancia. Sin lógica, sin rediseño. `spacing-perfectionist` lo estima como "un sprint corto de espaciado".
**Verificación diferida (ejecución en vivo):** verificar a 1280×900 que el Hero no quede con orphaned whitespace (LO-3); confirmar el `clamp` en 375/768/1280 reales.

---

#### **TANDA 2 — Suelo Legal de Contraste (C2)** · *"que el texto sea legible — WCAG AA"*

**Clústeres:** C2 (completo).
**Prioridad:** P1 (CR-4, CR-5, CR-8) + P2 (HI-10, HI-20, HI-21, ME-14).
**Categoría:** `visual` (contraste) + `functional` (suelo legal).
**Por qué segundo:** es un **suelo legal no negociable** (WCAG AA) — el sitio es legalmente no entregable hasta cerrarlo. Va inmediatamente después de C1 y antes de C3 porque la regla de no-colisión de memoria (La Nonna) ordena **color antes que tipografía**. C2 es el clúster de color.

**Contenido:**
- Eliminar TODA opacidad sobre texto (`text-*/NN`, `text-white/NN`) en `stats-strip`, `cta`, `footer`, `products`, `values`, `contact`, `cart`, `checkout` — ~30 nodos. Sustituir por tokens sólidos: superficie clara → `--color-text-secondary`/`--color-text-muted`/`--color-brand-primary`; sobre oscuro → `--color-text-on-deep`. Cierra los 9 fallos documentados H-1…H-9.
- Cadena AA del formulario Contact (labels 3.4:1, placeholders 1.9:1) → tokens sólidos.
- Hero `<h1>` sobre MeshGradient: scrim/banda sólida cream bajo el bloque de texto, o oscurecer el carmín a `--strawberry-700`, para garantizar AAA estructural independiente del shader (CR-8 / HI-10).
- Bordes de input con contraste insuficiente (`#f5c6c2` ≈1.3:1) → token con contraste ≥3:1 (HI-20). Placeholders fuera de paleta (`#c0a0a0`, `#b08a8a`) → `--color-text-muted` (HI-21).

**Agente ejecutor:** `frontend-developer` (sustitución mecánica de opacidad por tokens sólidos).
**Esfuerzo relativo:** **M (medio).** ~30 sustituciones, todas mecánicas (quitar `/NN`, usar token). El único ítem con micro-criterio es el scrim del Hero (CR-8). El borde de input exacto ≥3:1 puede requerir un valor de `creative-director` — ver Scope-Escalate-soft abajo.
**Escalada blanda al `director`:** el valor exacto del borde de input para pasar 3:1 estricto (`accessibility-perfectionist` #39 sugiere oscurecer hacia `~#c08a86`) no está en `globals.css`; pedir a `creative-director` que ratifique el valor. No es scope creep — es una decisión de token de 1 línea.
**Verificación diferida (ejecución en vivo):** **axe-core + Lighthouse a11y + WAVE** sobre `/` y `/checkout`; confirmación de ratios con el server encendido; simulación de daltonismo; modo `forced-colors`.

---

#### **TANDA 3 — Coherencia de Tokens y Jerarquía Tipográfica (C3)** · *"que el orden de lectura se vea"*

**Clústeres:** C3 (completo).
**Prioridad:** P1 (CR-6, CR-7) + P2 (HI-9, HI-11, HI-12, HI-13, ME-6, ME-10, ME-13).
**Categoría:** `visual` (color/tipografía).
**Por qué tercero:** cierra el handoff Fase 3→4 (es el tercer ángulo del mismo eslabón roto). Va después de C2 porque la regla de memoria ordena **tipografía después de color**. Al llegar aquí, espaciado y contraste ya están migrados; C3 enchufa la escala tipográfica y elimina los últimos hex literales.

**Contenido:**
- Sustituir los 50+ literales hex inline (`#962a1f`, `#5c1a1a`, `#f5c6c2`…) por tokens de color en los 10/11 componentes. (`about-us.tsx` ya está limpio — sirve de referencia.)
- Aplicar la escala tipográfica del sistema: tamaños Tailwind sueltos (`text-4xl`, `text-[1.25rem]`) → utilidades `.text-h1/.text-h2/.text-h3/.text-overline/.text-body/.text-caption` y tokens `--fs-*`.
- `<h2>` de sección sobredimensionados (`text-5xl`≈48px) → `.text-h2` (28→32px) — restaura el escalón H1>H2.
- ProductCard: nombre `<h3>` → `.text-h3` (delta ≥6px sobre el precio); colapsar a 3 tiers de texto por card.
- Hero: demotar la placa de variedades (reducir tamaño de nombres, retirar borde) para que la cita `<h1>` gane el squint.
- Contact: declarar el formulario protagonista (ensanchar columna `[5fr_7fr]` o elevar `--shadow-card-raised`).
- Eyebrows → `.text-overline` (unifica 11px/0.18em). Estado "Añadido"/éxito verde fuera de paleta (`bg-green-500`/`#16a34a`) → `--color-success`. Bloque tributo AboutUs → orden interno (blockquote protagonista, placa "Mariana" soporte).

**Agente ejecutor:** `frontend-developer` (sustitución hex→token y tamaño→utilidad). Coordinación de criterio con `hierarchy-master` para los ítems de jerarquía (HI-9, HI-11, HI-12) — pero la ejecución sigue siendo de `frontend-developer`.
**Esfuerzo relativo:** **M-L (medio-alto).** 50+ sustituciones hex + ~10 componentes migrados a `.text-*` + ~6 ajustes de jerarquía (placa Hero, ProductCard, Contact). Es la tanda con más instancias, pero todas mecánicas o de criterio ya especificado por `hierarchy-master`.
**Verificación diferida:** ninguna obligatoria en vivo — es verificable en estático. `visual-perfection` re-audita en estático tras esta tanda.

---

#### **TANDA 4 — Accesibilidad Estructural y Saneamiento Móvil (C5 + C6)** · *"que se pueda comprar con teclado y en móvil"*

**Clústeres:** C5 (completo) + C6 (completo).
**Prioridad:** P1 (CR-9, CR-10, CR-11, CR-12, CR-13) + P2 (HI-14…HI-19, ME-12, ME-15…ME-22).
**Categoría:** `functional` (a11y + móvil) + `structural` (`<main>`, responsive).
**Por qué cuarto:** C5 y C6 requieren **lógica**, no solo sustitución (focus-trap, listeners `Esc`, `useReducedMotion`, atributos de formulario) — por eso no van en las tandas mecánicas. Se agrupan en una tanda porque comparten naturaleza (comportamiento, no superficie) y archivos parcialmente distintos de C1-C3 (`layout.tsx`, `page.tsx`, contextos, config). C5+C6 NO colisionan con C4 (motion visual) porque tocan estructura/comportamiento. Van antes de C4 porque contienen P1 (ruta de conversión, suelo SR, checkout móvil) y C4 no tiene ningún P1.

**Contenido — C5 (semántica/teclado/SR):**
- `<main id="contenido">` envolviendo `page.tsx`; `<a class="skip-link" href="#contenido">` traducido como primer focusable en `layout.tsx` (CR-11).
- Cart drawer: `role="dialog"` + `aria-modal` + `aria-labelledby` + focus-trap + `Esc`-close + retorno de foco al FAB (CR-9 — **ruta de conversión, P1**).
- MobileNav + LanguageSelector: focus-trap + `Esc`-close + retorno de foco (CR-10).
- `<html lang>` sigue al idioma activo; rehidratación acepta `"en"` (HI-16). Mensajes de éxito → `role="status" aria-live="polite"` (HI-18). Validación accesible `aria-invalid`/`aria-describedby` en Contact + Checkout (HI-19). `<nav aria-label="Principal">` (ME-19). `aria-hidden` consistente en SVG decorativos (ME-20).

**Contenido — C6 (saneamiento móvil):**
- Inputs/`textarea`/`CardElement` Stripe → `font-size ≥16px` en móvil; `--fs-body` → 16px (`clamp`) (CR-12 — **anti auto-zoom iOS, P1**).
- `inputmode`/`autocomplete`/`enterkeyhint` en los 9 campos de Contact + Checkout (CR-13 — **P1**).
- Hero `100vh`→`100dvh` (HI-14). Primera imagen de producto → `priority` (HI-15). `env(safe-area-inset-*)` en nav + FAB (ME-16). `-webkit-tap-highlight-color: transparent` + `touch-action: manipulation` (ME-17). StatsStrip cifra escala en móvil (ME-12). "Eliminar" del Cart tap target ≥44px (ME-15).

**Agente ejecutor:** `frontend-developer` (toda la implementación — focus-trap, listeners, atributos, dvh, safe-area). `accessibility-perfectionist` y `mobile-obsessor` actúan como **re-auditores**, no ejecutores.
**Esfuerzo relativo:** **M-L (medio-alto).** Es la tanda con más lógica real: el focus-trap del Cart y los dos overlays es el ítem más sustancial del plan (≈"requiere algo de lógica" según `comparison-engine`). El resto (atributos, dvh, safe-area, `role=status`) es directo pero numeroso.
**Verificación diferida (ejecución en vivo) — la más cargada del plan:**
- **Walkthrough con lector de pantalla** (NVDA en Windows): orden de anuncio, eficacia ARIA, anuncio de contenido dinámico, calidad de alt.
- **Walkthrough teclado-solo** completo de la ruta de conversión (añadir → cesta → checkout → pago) — confirma que el focus-trap del Cart funciona.
- **axe-core + Lighthouse a11y + WAVE** (re-pasada tras los fixes estructurales).
- **Zoom 200% / 400%** en navegador real (riesgos en Hero `min-h`, nav altura fija).
- **Lighthouse Mobile Performance** + LCP/FCP/CLS/INP/TBT en Slow 4G + 4× CPU; peso AVIF real a 375px; bundle JS gzip (techo 100 KB; coste del MeshGradient WebGL).
- **Pasada de dispositivo real:** iOS Safari (salto del Hero por `100vh`, auto-zoom de inputs, FAB sobre barra de gestos), Android Chrome gama media (tap-highlight, WebGL, teclado de CP), navegador in-app de Instagram (camino de compra completo con `CardElement` Stripe).
- Modo `forced-colors: active`.

> Esta verificación en vivo es **obligatoria antes del gate final** y NO es resoluble en modo AUDIT. Es el bloque de verificación diferida más grande del plan.

---

#### **TANDA 5 — Motion de Tributo y Pulido de Superficie (C4)** · *"que el sitio se mueva con dignidad, no como un anuncio"*

**Clústeres:** C4 (completo).
**Prioridad:** P2 (HI-5…HI-8, HI-22, ME-7…ME-11, ME-21, ME-22).
**Categoría:** `visual` (motion/superficie).
**Por qué último:** la regla de memoria de La Nonna ordena **motion al final** del polish ("color → type → image → animation"). C4 no tiene ningún defecto P1 — es la capa más cosmética. Va después de que color, tipografía, espaciado y estructura estén estables, para que el ajuste de motion no se pise con cambios de los demás clústeres.

**Contenido:**
- Eliminar `scale` de hover de botones (1.04-1.08) y de entrada (`scale:0.85` H2 CTA, `0.8` logo footer, `0.92` cards Values). Hover = solo cambio de `background` a `--color-brand-pressed`.
- Gradientes rojo→naranja en 6 componentes → `--color-brand-primary` plano (botones, FAB, fondos, línea de acento).
- Sombras de card teñidas de rojo → `--shadow-card`/`--shadow-card-raised` neutras.
- Entradas de barrido `x:±40/60/80` y `y:30/40/56/60` → fade-up uniforme `translateY` 12-16px.
- Shine del badge `repeat:Infinity` → una sola pasada; `ease:"linear"` → `--easing-default`; gatear con `useReducedMotion()`.
- `type:"spring"` (drawer Cart, parallax) → `ease`/`ease-in-out` con duración. `FocusField` `scale:1.01` → 0 (solo el ring de marca señala focus). Count-up StatsStrip 1400ms → 2200ms.
- Decoración fuera de disciplina 2-color: MeshGradient 5-color → paleta de marca o cream plano; patrón de puntos Products → retirar; gradiente 3-stop CTA → superficie sólida. Flecha deslizante de botón → retirar.
- Cart y badge: leer `useReducedMotion()` para gatear slide/scale.

**Agente ejecutor:** `frontend-developer` (ejecución de los cambios de motion/superficie). Criterio de tono ya especificado por `ui-designer-spec` y `visual-perfection`.
**Esfuerzo relativo:** **S-M (bajo-medio).** ~22 defectos pero cada uno es un ajuste localizado de un valor de Framer Motion o una sustitución de gradiente. Sin lógica nueva. `comparison-engine` lo califica de "pulido final de tono".
**Verificación diferida (ejecución en vivo):** confirmar con reduced-motion activado (sistema) que shine, auto-rotate, drawer y badge respetan el gate; verificar que el MeshGradient simplificado no introduce coste de GPU.

---

### 2.4 RE-AUDIT — tras las 5 tandas

**No es una tanda de fixes** — es el cierre de OLA 2.
- Las 5 auditorías de OLA 1 (`spacing-perfectionist`, `visual-perfection`, `hierarchy-master`, `accessibility-perfectionist`, `mobile-obsessor`) **re-corren**. `visual-perfection` hace el re-audit holístico.
- `comparison-engine` re-consolida en una nueva pasada y emite score global de OLA 2.
- **Cap de 3 iteraciones:** OLA 1 = i1 (5.0). Este plan, aplicado, es i2. Si el re-audit i2 < 8.5, queda i3. Si i3 < 8.5 → escalar al `director` con la trayectoria. Proyección del `comparison-engine`: con C1+C2+C3+C5 cerrados el sitio entra en **8.3-8.8** — a 1-2 iteraciones del PASS, dentro del presupuesto.

### 2.5 Qué re-auditar tras CADA tanda (chequeo incremental ligero, no OLA completa)

El re-audit completo es al final, pero entre tandas se hace un chequeo de no-regresión enfocado, para detectar errores antes de acumularlos:

| Tras la tanda | Re-auditor de chequeo | Qué verifica | Modo |
|---|---|---|---|
| **TANDA 1 (C1)** | `spacing-perfectionist` | Ritmo vertical periódico, `.section`/`.container` consumidos, anchos unificados. ¿La web ya "se ve repartida"? | Estático + verificación en vivo a 1280×900 |
| **TANDA 2 (C2)** | `accessibility-perfectionist` | Cero opacidad sobre texto; todos los ratios ≥ AA. | Estático ahora; **axe/Lighthouse/WAVE diferido** |
| **TANDA 3 (C3)** | `hierarchy-master` | Escala `--fs-*` aplicada, escalón H1>H2 restaurado, protagonistas resueltos (Hero, ProductCard, Contact) | Estático |
| **TANDA 4 (C5+C6)** | `accessibility-perfectionist` + `mobile-obsessor` | Focus-trap, `<main>`, `role=dialog`, atributos de formulario, `dvh` | Estático ahora; **SR + teclado + dispositivo real + Lighthouse diferido** |
| **TANDA 5 (C4)** | `visual-perfection` | Motion de tributo, disciplina 2-color, sin gradientes naranja | Estático |
| **TODAS (cierre)** | las 5 + `comparison-engine` | **Re-audit OLA 2 completo + score global** | Estático + todo el bloque de verificación en vivo |

---

## 3. ORDEN DE EJECUCIÓN RECOMENDADO

```
GATE de Nil  →  TANDA 1 (C1 · espaciado)            →  chequeo spacing-perfectionist  →  gate
             →  TANDA 2 (C2 · contraste WCAG AA)    →  chequeo accessibility          →  gate
             →  TANDA 3 (C3 · tokens + tipografía)  →  chequeo hierarchy-master        →  gate
             →  TANDA 4 (C5+C6 · a11y estructural + móvil) → chequeo a11y + mobile      →  gate
             →  TANDA 5 (C4 · motion de tributo)    →  chequeo visual-perfection        →  gate
             →  RE-AUDIT OLA 2 (las 5 + comparison-engine) + verificación en vivo completa
             →  score global i2  →  ¿≥8.5? PASS · ¿<8.5? i3 (último cartucho) · ¿i3<8.5? escalar a director
```

**Resumen del orden y su razón en una frase:** C1 primero por mandato de Nil (su queja literal nº1) y porque es estructural-no-colisionante; después color (C2, suelo legal WCAG AA) → tipografía (C3) → comportamiento/móvil (C5+C6, lo único con lógica real y con P1 de conversión) → motion (C4, polish cosmético) — respetando la regla de no-colisión color→tipografía→…→motion de la memoria de La Nonna; toda la migración del design system (C1+C2+C3) se completa ANTES del re-audit, que es su pre-requisito.

---

## 4. ESFUERZO RELATIVO POR TANDA

| Tanda | Clústeres | Defectos | Esfuerzo relativo | Naturaleza | Verificación en vivo diferida |
|---|---|---|---|---|---|
| **TANDA 1** | C1 | ~32 | **M** | Mecánica (sustitución de clase de layout + 1 token) | Ligera — visual a 1280×900, `clamp` en 3 breakpoints |
| **TANDA 2** | C2 | ~30 | **M** | Mecánica (opacidad→token sólido) + 1 micro-criterio (scrim Hero) | **Alta — axe + Lighthouse a11y + WAVE + daltonismo + forced-colors** |
| **TANDA 3** | C3 | ~24 | **M-L** | Mecánica (hex→token, tamaño→`.text-*`) + criterio de jerarquía ya especificado | Ninguna obligatoria — verificable en estático |
| **TANDA 4** | C5 + C6 | ~23 | **M-L** | **Lógica real** (focus-trap, listeners, atributos, dvh) — la más sustancial | **Muy alta — SR (NVDA) + teclado-solo + dispositivo real iOS/Android/in-app + Lighthouse Mobile + zoom 200/400%** |
| **TANDA 5** | C4 | ~22 | **S-M** | Ajustes localizados de valores de motion / sustitución de gradientes | Ligera — reduced-motion + coste GPU del mesh |
| **RE-AUDIT** | todos | — | **M** (5 agentes + consolidación) | Re-auditoría | **Todo el bloque de verificación en vivo, obligatorio antes del gate final** |

**Esfuerzo total relativo:** dominado por trabajo **mecánico** (TANDAS 1-3 = ~86 defectos, sin rediseño). La carga de *lógica* se concentra en TANDA 4. La carga de *verificación en vivo* se concentra en TANDA 2 (a11y) y TANDA 4 (móvil + SR + dispositivo real). TANDA 5 es la más ligera. **Ninguna tanda requiere rediseño** — el `comparison-engine` lo confirma: la brecha es mecánicamente cerrable.

> **Marcado explícito de verificación diferida:** ningún número de Lighthouse, axe, screen reader o dispositivo real puede producirse en modo AUDIT (server apagado por diseño). Todo lo marcado "verificación en vivo" arriba es **diferido y obligatorio antes del gate final de entrega** — no se inventan métricas.

---

## 5. EXCEPCIONES INTENCIONALES (a ratificar en el gate, no son defectos)

Heredadas de las auditorías; se listan para que el `director`/Nil las ratifique de una vez:
- **AboutUs `max-w-[720px]` y CTA `max-w-2xl`** — anchos de lectura editoriales legítimos (columna íntima de tributo / CTA centrado). Propuesta: tokenizar como `--container-prose` (`~45rem`) — pasan de literal a sistema, dejan de ser defecto.
- **Footer `pb-8` (32px) asimétrico** — cierre de página, práctica estándar correcta.
- **Bandas oscuras con menos padding que el contenido** — quiebre de ritmo intencional; el defecto era que tuvieran valores *distintos entre sí* (56 vs 80), no que tuvieran menos. TANDA 1 las unifica a 72px conservando la intención.
- **Cita Playfair italic como `<h1>`** — decisión de `hierarchy-master`/`creative-director` ratificada; coherente con el tono homenaje.
- **Slot de retrato de Mariana como bloque tipográfico (no imagen IA)** — HARD RULE del proyecto; NUNCA imagen IA de la abuela.
- **Carousel sin swipe nativo** — paridad por tap completa; mejora futura, no defecto.

---

## 6. ITERATION SUMMARY

```
## Iteration Round 1 Summary — PLAN PROPUESTO (pendiente del gate de Nil)

Project:           Yaya Mariana (sitio HOMENAJE) — rama clasico
Feedback received: 2026-05-22
Source:            QA Visual OLA 1 — 5 auditorías + consolidación comparison-engine

### Processed Items: 71 defectos raíz (~110 instancias de código)
- P1 Inmediato:        13  — = los 13 CRITICAL — Asignados a: frontend-developer (ejecución)
- P2 Esta iteración:   44  — = 22 HIGH + 22 MEDIUM — Asignados a: frontend-developer (ejecución)
- P3 Siguiente iter.:  14  — = los 14 LOW — pulido; barrer oportunísticamente durante P1/P2
- P4 Backlog:           0
- Scope flags:          0  — Escalados a director: NINGUNO

### Organización: 5 TANDAS secuenciadas + RE-AUDIT
- TANDA 1 — Distribución/Espaciado (C1) ........... P1+P2 · frontend-developer · esfuerzo M
- TANDA 2 — Suelo Legal Contraste WCAG AA (C2) .... P1+P2 · frontend-developer · esfuerzo M
- TANDA 3 — Tokens + Jerarquía Tipográfica (C3) ... P1+P2 · frontend-developer · esfuerzo M-L
- TANDA 4 — A11y Estructural + Móvil (C5+C6) ...... P1+P2 · frontend-developer · esfuerzo M-L
- TANDA 5 — Motion de Tributo (C4) ................ P2 ···· frontend-developer · esfuerzo S-M
- RE-AUDIT — las 5 auditorías + comparison-engine re-consolida OLA 2

### Scope Flags Requiring Director Decision
- Ninguno como scope creep. UNA escalada blanda: el valor exacto del borde de input
  para pasar contraste 3:1 estricto (C2/TANDA 2) requiere ratificación de creative-director
  — es un token de 1 línea, no una feature.
- Encuadre para el director: C1+C2+C3 deben tratarse como work item de Fase 4 NO completado
  (handoff Fase 3→4 no ejecutado), no como pulido de Fase 4.5.

### Duplicates from Previous Rounds
- Ninguno — es Round 1 de iteration-agent en este proyecto.
- Nota: la "TANDA 4 / L2" de Fase 4 (tap targets, formatos de imagen) está verificada como
  correcta por mobile-obsessor y NO se re-abre.

### Verificación diferida (ejecución en vivo — obligatoria antes del gate final)
- Lighthouse (a11y + Mobile Performance), axe-core, WAVE — TANDA 2 y TANDA 4.
- Walkthrough con lector de pantalla (NVDA) y teclado-solo de la ruta de conversión — TANDA 4.
- Pasada de dispositivo real (iOS Safari, Android Chrome, navegador in-app Instagram) — TANDA 4.
- Zoom 200%/400%, simulación de daltonismo, modo forced-colors.

### Orden recomendado
C1 → C2 → C3 → (C5+C6) → C4, con gate de Nil entre cada tanda; toda la migración al
design system (C1+C2+C3) ANTES del re-audit.

### Estimated completion: ~2 sprints de ejecución (i2); proyección de score 8.3-8.8 → 1-2 iteraciones del PASS, dentro del cap de 3.
### Blocking anything? SÍ — la entrega está BLOQUEADA (FAIL 5.0/10) hasta cerrar al menos
   todos los P1. El plan completo (P1+P2) es el camino a PASS.
### Estado del plan: PROPUESTO — NO APLICADO. Pendiente del GATE de Nil.
```

---

## 7. LOG DE ITERACIÓN — Round 1 (formato por tandas)

> **Este log es PROPUESTO.** El iteration log definitivo (`yaya-mariana-iterations.md` en la memoria de la agencia) se creará SOLO cuando Nil apruebe el plan en el gate. Aquí se muestra la forma que tendrá, para revisión.

```markdown
# Yaya Mariana — Iteration Log

## Round 1 — 2026-05-22  [PLAN PROPUESTO — pendiente gate de Nil]
Feedback source:  QA Visual OLA 1 (5 auditorías + comparison-engine)
Total items:      71 defectos raíz
Resolved: 0 | Open: 71 | Deferred (P3): 14 | Scope-flagged: 0
Score OLA 1:      5.0 / 10 FAIL (umbral 8.5) — iteración i1 de 3

| Tanda    | ID      | Clúster | Categoría             | Prioridad | Descripción                                              | Agente ejecutor      | Estado          |
|----------|---------|---------|-----------------------|-----------|----------------------------------------------------------|----------------------|-----------------|
| TANDA 1  | R1-T1   | C1      | structural/visual     | P1+P2     | Migrar al sistema de espaciado: .section/.container,      | frontend-developer   | ⏳ Pend. gate    |
|          |         |         |                       |           | --space-section-gap→clamp(80→112), ritmo, anchos          |                      |                 |
| TANDA 2  | R1-T2   | C2      | visual/functional     | P1+P2     | Eliminar opacidad sobre texto → tokens sólidos;           | frontend-developer   | ⏳ Pend. gate    |
|          |         |         |                       |           | suelo WCAG AA; scrim Hero; bordes/placeholders            |                      |                 |
| TANDA 3  | R1-T3   | C3      | visual                | P1+P2     | Hex→tokens (50+); escala --fs-*/.text-*; escalón H1>H2;   | frontend-developer   | ⏳ Pend. gate    |
|          |         |         |                       |           | protagonistas Hero/ProductCard/Contact                    |                      |                 |
| TANDA 4  | R1-T4   | C5+C6   | functional/structural | P1+P2     | <main>+skip-link; focus-trap Cart/MobileNav; role=dialog; | frontend-developer   | ⏳ Pend. gate    |
|          |         |         |                       |           | inputs ≥16px; inputmode/autocomplete; 100dvh; safe-area   |                      |                 |
| TANDA 5  | R1-T5   | C4      | visual                | P2        | Motion de tributo: sin scale/glow/gradientes naranja;     | frontend-developer   | ⏳ Pend. gate    |
|          |         |         |                       |           | sombras neutras; entradas fade-up 12-16px; spring→ease    |                      |                 |
| RE-AUDIT | R1-RA   | todos   | —                     | —         | Re-correr las 5 auditorías + comparison-engine → OLA 2    | 5 auditores + c-e    | ⏳ Pend. gate    |

Re-auditores de chequeo por tanda: T1→spacing-perfectionist · T2→accessibility-perfectionist ·
T3→hierarchy-master · T4→accessibility-perfectionist+mobile-obsessor · T5→visual-perfection.
Cap de iteraciones: i1=5.0 (OLA 1). Este plan = i2. Si i3<8.5 → escalar a director.
```

---

## 8. STATUS & HANDOFF

**Status:** **PLAN PROPUESTO — pendiente del GATE de Nil.** Cero código tocado, cero memoria de agencia tocada, iteration log NO creado (se creará al aprobar). La entrega del sitio sigue **BLOQUEADA** (FAIL 5.0/10) hasta ejecutar al menos todos los P1.

**Handoff:**
- **→ director / gate de Nil:** decisión requerida — autorizar el plan de 5 tandas. Confirmar (a) que C1+C2+C3 se ejecutan como work item de Fase 4 no completado; (b) el salto `--space-section-gap` 80→112px (`clamp`); (c) las excepciones intencionales de §5; (d) la escalada blanda a `creative-director` por el valor del borde de input ≥3:1.
- **→ `frontend-developer`:** ejecutor único de las 5 tandas, una por una, con gate entre cada una. NO empezar hasta que Nil apruebe.
- **→ los 5 auditores + `comparison-engine`:** re-audit OLA 2 tras TANDA 5; chequeos incrementales por tanda según §2.5.
- **→ `iteration-agent` (yo mismo, futura ejecución):** al aprobar el gate, crear `yaya-mariana-iterations.md` y `iteration-agent-memory.md` con los aprendizajes de Round 1.

**Una frase para Nil:** son 5 tandas — empezamos por el espaciado (tu queja nº1: que la web deje de verse junta), seguimos por la legibilidad del texto y la coherencia de color/tipografía, luego arreglamos que se pueda comprar con teclado y en móvil, y cerramos puliendo el movimiento para que sea de homenaje y no de anuncio; nada de esto se toca hasta que tú des el visto bueno.

---

*Plan `iteration-agent` · Fase 4.5 QA Visual · Yaya Mariana · 2026-05-22 · modo AUDIT — cero archivos de código modificados · cero archivos de memoria de la agencia modificados · iteration log no creado. Plan PROPUESTO, pendiente del gate de Nil.*
