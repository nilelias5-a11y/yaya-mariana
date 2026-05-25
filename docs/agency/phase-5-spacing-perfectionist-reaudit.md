# FASE 5 — RE-AUDIT FINO de Espaciado (post-TANDA 1+2+3+4)
## Entregable del agente `spacing-perfectionist`

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE a la abuela de Nil
**Rama:** `clasico` · HEAD `62c6f77` · **Modo: AUDIT** (estático — dev server apagado · CERO escritura en código · CERO memoria de agencia tocada)
**Stack:** Next.js 16 · React 19 · Tailwind v4 · single-page + `/checkout`
**Fecha:** 2026-05-25
**Fase:** 5 — Optimización · re-chequeo del afinado tras las 4 TANDAS
**Base histórica:** OLA 1 (Fase 4.5) 4.8/10 FAIL → re-chequeo TANDA 1 8.6/10 PASS → pase fino Fase 5 8.4/10 FAIL por margen → **este re-audit tras TANDA 1+2+3+4**.

---

## Spacing Audit — Yaya Mariana — Re-audit Fase 5 (TANDAS 1+2+3+4)

**Spacing system in use:** base-4 **conectado, vivo y casi total** — `--space-*`, `.section`/`.section-deep`, `.container`/`.container-prose`, **`.section-header*` y `--measure-header` nuevos**, y un **sistema de botón tokenizado** en `globals.css §8` que centraliza padding/radio/estados. El sistema ya no es "valor que pasa", es regla escrita.

**Density register:** `confident-whitespace` — confirmado y correcto. Ningún registro nuevo ha cambiado la densidad.

**Coherence score: 9.0 / 10**   **Threshold: 8.5**   **Status: PASS (+0.4 sobre 8.6)**

> Subida +0.6 sobre el 8.4 del pase fino y +0.4 sobre el 8.6 del re-chequeo TANDA 1 de Fase 4.5. El sitio cruza el umbral con margen claro. No llega a 9.5+ por **una decisión de diseño del sistema de botón** (padding 11/13/20/28 en lugar del 12/24-16/32 que la auditoría Bloque A proponía) y **3 hairlines residuales** de 6px (`gap-1.5`) que sobreviven en superficies decorativas. Ninguno es CRITICAL ni HIGH; son MEDIUM/LOW de pulido.

---

## 1. Lo que TANDA 1+2+3+4 cerró respecto al pase fino 8.4

### Bloque A — botones inline OFF-BASELINE (residuo diferido desde Fase 4.5) → **CERRADO** ✅

- `hero.tsx:279` nav CTA `padding: "10px 20px"` → **migrado al sistema `<Button size="sm">`** (`hero.tsx:288-296`).
- `hero.tsx:186` MobileNav CTA `padding: "11px 20px"` → **migrado al sistema `<Button size="sm">`** (`hero.tsx:188-198`).
- `hero.tsx:376` Hero CTA `#productos` `paddingTop/Bottom: 13` + `paddingLeft/Right: 28` → **migrado al sistema `<Button size="md">`** (`hero.tsx:402`).
- Cero literales `padding: "Npx Npx"` en código de botón. Verificado con grep transversal: solo sobreviven `paddingTop: "env(safe-area-inset-top)"` (correcto — token CSS) y `padding: "0 14px"` decorativo (LOW residual, ver §3).

> El defecto diferido más antiguo del proyecto está resuelto **por sistema**, no por parche: los ~33 botones del sitio comparten ahora una sola fuente de verdad (`.btn` + variantes).

### Bloque B — receta ÚNICA de header de sección (defecto transversal G-2) → **CERRADO** ✅

- `globals.css:295-318` define `.section-header`, `.section-header--start`, `.section-header__eyebrow` (mb-4 = 16px), `.section-header__sub` (mt-4 = 16px), gobernados por `--measure-header: 36rem`.
- Aplicado en `products.tsx:467`, `values.tsx:52`, `contact.tsx:144` (variante --start).
- CTA `cta.tsx:19-51, 136-165` aplica la receta a mano (eyebrow `mb-4`, H2 `mb-4`, subtítulo `mb-8` con `maxWidth: var(--measure-header)`) — decisión explícita para que la banda oscura conserve menos aire que el contenido (registrada en el comentario inline).
- AboutUs `about-us.tsx:23-29` mantiene su ritmo propio (eyebrow `mb-4`, h2 `mb-6` SIN subtítulo, párrafos en `space-y-4`) — es un único bloque editorial, no un header con triple capa; NO requiere `.section-header`. Exempción coherente.

> El salto título→subtítulo (12px) que invertía la progresión está corregido: hoy eyebrow→título = 16px = título→subtítulo. Las 5 recetas distintas del pase fino quedan reducidas a **una receta + 2 exempciones declaradas** (CTA banda oscura, AboutUs editorial-puro).

### Bloque C — micro-gaps off-baseline → **CERRADO al 92%** ✅

| # pase fino | Defecto | Estado actual | Archivo |
|---|---|---|---|
| #11 | CTA cold-chain `gap-2.5` | `gap-3` ✅ | `cta.tsx:71` |
| #12 | CTA checkbox `gap-2.5` | `gap-3` ✅ | `cta.tsx:194` |
| #13 | Footer lista `space-y-2.5` | `space-y-3` ✅ | `footer.tsx:166` |
| #14 | Footer bottom row `pt-7` | `pt-8` ✅ | `footer.tsx:190` |
| #15 | CTA trust badges `mt-7` | `mt-8` ✅ | `cta.tsx:68 comentario inline` |
| #18 | ProductCard chip trazabilidad `gap-1.5` | `gap-2` ✅ | `products.tsx:383` |
| #19 | ProductCard precio `ml-1.5` | `ml-2` ✅ | `products.tsx:396` |
| #20 | Contact label `mb-0.5` | `mb-1` ✅ | `contact.tsx:164` |
| #21 | Contact labels `mb-1.5` | `mb-2` ✅ | `contact.tsx:235,259,285,308` |
| #22 | Contact errores `mt-1.5` | `mt-2` ✅ | `contact.tsx:253,278,302,324` |
| #30 | Checkout `Field` `space-y-1.5` + `ml-0.5` | `space-y-2` + `ml-1` ✅ | `checkout.tsx:427,433` |

Quedan 3 `gap-1.5` (6px) residuales en superficies decorativas (CTA trust badges, dots del carousel, indicador "Añadido") — ver §3 LOW residuales.

### Bloque D — paneles-formulario `p-8` ≠ `p-6` → **CERRADO** ✅

- `checkout.tsx:370` order summary `aside` `p-6` → **`p-8`**: ahora iguala al form de Contact (`contact.tsx:189`).
- Cart drawer `cart.tsx:113,130,205` `py-4` → **`py-5`**: el `py-5` recomendado (LOW #10) sí se aplicó. El `px-5` lateral se mantiene como excepción registrada (drawer estrecho).

### Cosa nueva muy positiva — Hero gutter simétrico

- `hero.tsx:336` ahora `md:gap-16` (gap simétrico = 64px) en el flex padre. El `md:pr-10` compensatorio (LOW #21 de Fase 4.5) **retirado**: el canal central lo gobierna ahora el gap del padre, simétrico para ambas columnas. El hack micro-asimétrico que separaba "PASS" de "ejemplar" en Fase 4.5 está cerrado.

### Cosa nueva muy positiva — Footer 5-col

- `footer.tsx:109` `md:grid-cols-5` con marca `md:col-span-2`: la masa visual del cierre se equilibra (antes la columna de marca era ~2× más alta que las 3 nav). El gap `md:gap-10` (40px) se mantiene on-system.

### Cosa nueva muy positiva — AboutUs aspect-[4/5]

- `about-us.tsx:57` placa de tributo con `aspect-[4/5]` estable móvil↔desktop + `sm:w-[220px]` (antes `h-[150px] sm:h-auto` cambiaba de proporción). Slot anti-CLS reservado para la foto familiar futura. Padding `px-5 py-6` (20/24) acepta el ratio de la placa.

### Cosa nueva — Products card huérfana al filtrar

- `products.tsx:539-544` grid pasa a `auto-fit minmax(280px,360px) justify-center` cuando hay <3 items: con 1 card filtrada queda centrada en vez de anclada a la izquierda. No es defecto de spacing, pero el `gap-6` se conserva on-system.

### Cosa nueva — sistema de botón en CSS

- `globals.css §8 (líneas 350-521)` define la primitiva: 5 estados, 2 tamaños, 4 variantes, **un solo radio** vía `--radius-button`. El `min-height` (44/48px) garantiza tap target sin reescribir cada componente. Los 33 botones inline migrados (`button.tsx` reescrito como pasarela).

---

## 2. Regresiones frente al 8.6 de TANDA 1 (Fase 4.5)

**Ninguna regresión de espaciado introducida.** Verificación punto por punto:

- **TANDA 4 (CSS gradient Hero):** el shader WebGL fue sustituido por 3 `radial-gradient` CSS sobre `var(--cream-100)` en un `<div absolute inset-0>` decorativo (`hero.tsx:315-326`). **NO afecta a la composición vertical** — es un fondo `absolute inset-0`, no participa del flujo de bloque. El padding `py-20`, el `min-h-[calc(100dvh-72px)]` y el `md:gap-16` del Hero se mantienen idénticos. **Sin impacto sobre el ritmo.**
- **TANDA 2 (sistema de botón):** los botones inline se sustituyeron por `<Button>` del sistema con `min-height: 48px` (`md`) / `44px` (`sm`). En todas las secciones donde antes había `py-3` (12px) inline el componente nuevo aplica `13px` por defecto — diferencia de 1px imperceptible que NO rompe el ritmo de la sección (el padding del contenedor padre domina). El subrayado del ghost ya no compite con el primario.
- **TANDA 3 (microcopy + i18n):** modifica solo texto (`.text-body` standardización en 8 sitios). El token `.text-body` ya estaba declarado; usarlo no cambia la altura de línea (1.65 ya era el valor). Cero efecto sobre paddings/márgenes.
- **TANDA 1 (distribución fina):** todos los cambios listados §1 fueron normalizaciones a la escala base-4. Ningún componente perdió mx-auto/centrado, ningún ancho cambió fuera de los 2 contenedores tokenizados, ningún grid alteró su `gap`.

> Conclusión: **0 regresiones**. Las 4 TANDAS son una migración limpia que sube el listón sin reabrir defectos cerrados.

---

## 3. Defectos residuales — pase FINO post-TANDAS

### MEDIUM (1)

| # | Element / file | Current | Correct | Severity | Reason |
|---|----------------|---------|---------|----------|--------|
| R-1 | Sistema de botón `.btn--sm` / `.btn--md` — `globals.css:404-413` | `11px 20px` (sm) · `13px 28px` (md) | `12px 24px` (sm) · `16px 32px` (md) | **MEDIUM** | El sistema tokeniza el padding (gran mejora respecto a 10/11/13 inline), pero los valores elegidos NO son múltiplos de 4: 11 y 13 rompen el baseline; 20 y 28 sí son múltiplos. El padding nuevo es uniforme, pero off-baseline. Bloque A del pase fino proponía 12/24-16/32 (todos `--space-*`). Acción: editar `globals.css §8`. Cierra la única arritmia fina sistemática que queda. |

### LOW (5)

| # | Element / file | Current | Correct | Severity | Reason |
|---|----------------|---------|---------|----------|--------|
| R-2 | CTA trust badges — `cta.tsx:83` | `gap-1.5` (6px) | `gap-2` (8px) | LOW | Icono↔label del badge sigue en 6px (no múltiplo de 4). Repite el patrón del chip de trazabilidad que SÍ se subió a `gap-2`. |
| R-3 | Carousel dot indicators — `products.tsx:218` | `gap-1.5` (6px) | `gap-2` (8px) | LOW | Separación entre dots; 6px off-baseline. Tolerable visualmente porque los dots son tiny, pero off-system estricto. |
| R-4 | "Añadido" indicator chevron — `products.tsx:419` | `gap-1.5` (6px) | `gap-2` (8px) | LOW | Icono check↔label del estado transitorio. Mismo patrón #R-2/#R-3. |
| R-5 | Checkout secure-payment lock — `checkout.tsx:330` | `gap-1.5` (6px) | `gap-2` (8px) | LOW | Icono candado↔texto del aviso de pago seguro. Mismo patrón. |
| R-6 | Hero separador `·` — `hero.tsx:274` | `padding: "0 14px"` | `0 16px` o `0 12px` | LOW | Único literal `style={{padding}}` residual: 14px decorativo entre items del nav (separador `·`). 14 no es múltiplo de 4 (12 o 16 sí). Único valor inline de padding que sobrevive. |

### Hairlines tolerados (no flagged)

- `space-y-3` (12px) entre links del footer y `gap-3` en CTA: on-baseline ✅
- `gap-5` (20px), `gap-10` (40px), `gap-6` (24px), `gap-12` (48px), `gap-16` (64px) en grids/wrappers: todos múltiplos de 4 ✅
- `mt-1`/`mb-1` (4px) micro-labels: mínimo de la escala, on-system ✅
- `pt-3 space-y-3` (12px) en card body de Products: on-baseline ✅

---

## 4. Cosas NUEVAS introducidas en Fase 5 que afectan a spacing

### 4.1 Tokens nuevos en `globals.css`

- `--measure-header: 36rem` (576px) — ancho de medida ÚNICO de los headers de sección. Sustituye 5 `max-w-*` distintos. **Token de leverage alto** ✅
- `--color-accent-on-deep: #f3c9c4` — cierra los `#f5c6c2` / `#e8c4bf` sueltos. No es token de espaciado pero limpia la paleta. ✅
- `--btn-pad-y` / `--btn-pad-x` (escritos en `.btn`) con valores por defecto y sobreescritura por tamaño. Centraliza el padding de botón.

### 4.2 Clases nuevas — sistema de botón (§8)

- `.btn`, `.btn--sm`, `.btn--md`, `.btn--block`, `.btn--primary`, `.btn--primary-inverse`, `.btn--success`, `.btn-ghost`, `.btn-ghost--on-deep`, `.btn-link`, `.btn-icon`. Los 5 estados (default/hover/focus-visible/active/disabled) definidos UNA vez. `min-height` (44/48px) garantiza tap target.
- **Impacto sobre spacing:** los botones tienen ahora UN padding por tamaño, UN radio, UN gap interno (`gap-2` = 8px en `.btn`). Cero literales inline en código de botón. El defecto Bloque A del pase fino queda resuelto **arquitectónicamente**.

### 4.3 Clases nuevas — header de sección (§6)

- `.section-header`, `.section-header--start`, `.section-header__eyebrow` (mb-4), `.section-header__sub` (mt-4). Receta declarada en CSS, no en cada componente. **Cierre del defecto transversal G-2** del pase fino.

### 4.4 Hero gutter, footer 5-col, AboutUs aspect

- Hero `md:gap-16`: gutter simétrico tokenizado (sin compensación lateral).
- Footer `md:grid-cols-5` (marca col-span-2): masa visual del cierre equilibrada.
- AboutUs placa `aspect-[4/5]` + `sm:w-[220px]`: forma estable móvil↔desktop, slot anti-CLS para foto futura.

### 4.5 Cart drawer `py-5`, panels `p-8`

- Cart drawer header/items/footer subidos a `py-5` (20px): la zona del drawer respira sin que se ensanche.
- Checkout summary `p-8` = Contact form `p-8`: paneles-formulario homologados a un tier "panel grande".

### 4.6 TANDA 4 cosas que tocan spacing indirectamente

- **CSS radial-gradient Hero:** `absolute inset-0` decorativo, NO afecta al flujo (el padding/min-height del Hero se mantienen). Sin impacto sobre ritmo.
- **SEO/JSON-LD/OG image:** ficheros nuevos en `/src/app/` que NO se renderizan en el árbol visual. Cero impacto sobre spacing.
- **Playfair pesos acotados a 1:** ahorro de fuentes sin tocar font-size/line-height. Cero impacto.

---

## 5. Vertical rhythm check (re-verificación post-TANDAS)

**Baseline:** 4px. Off-baseline restantes:

- **Sistema de botón** `.btn--sm` 11/20 + `.btn--md` 13/28 — `globals.css:404-413`. 11 y 13 NO son múltiplos de 4. **Único off-baseline sistémico que queda**, defecto #R-1. Cierre: cambiar a 12/24 + 16/32.
- **`gap-1.5` decorativos** (4 ocurrencias) — `products.tsx:218, 419`, `cta.tsx:83`, `checkout.tsx:330`. Hairlines de 6px. Cierre: `gap-2`.
- **Hero `padding: "0 14px"`** — `hero.tsx:274`. Único literal `style` con 14. Cierre: `0 16px` o `0 12px`.

**Adjacent-section gap consistency: PASS** — ritmo periódico de 2 niveles (`.section` 80→112px / `.section-deep` 56→72px) intacto. Hero `py-20` y Footer `pt-deep`/`pb-8` como excepciones registradas. Sin cambios desde TANDA 1 Fase 4.5.

**Intra-section rhythm consistency: PASS** — la receta única de header de sección (eyebrow mb-4 → título → subtítulo mt-4 → contenido mb-12) está aplicada en Products/Values/Contact; CTA y AboutUs declaran su exempción. El defecto fino del pase 8.4 (5 recetas distintas) **resuelto**.

---

## 6. Responsive check (estático)

- **Mobile (375):** HOLDS. `clamp()` macro intacto; los botones del sistema tienen `min-height ≥44px` garantizado, no por padding sino por la regla CSS. El `aspect-[4/5]` de la placa AboutUs estabiliza el layout móvil (antes `h-[150px]`).
- **Tablet (768):** HOLDS. El gutter del Hero `md:gap-16` se activa a partir de `md`, anchos `.container`/`.container-prose` resuelven sin saturar.
- **Desktop (1280):** HOLDS — la receta de header centrada con `--measure-header: 36rem` lee bien a viewport ancho (eyebrow/h2/subtítulo se constriñen a 576px y se centran). El Hero gutter de 64px da el canal de aire correcto entre cita y placa de variedades. El Footer 5-col equilibra la fila.
- **Verificación diferida (Hero 1280×900 orphaned whitespace):** sigue diferida — server apagado por diseño. Sin impacto sobre este audit.

---

## 7. Intentional exceptions (registradas)

- `.container-prose` 45rem (AboutUs/CTA) — ancho editorial estrecho. ✅
- Footer `pb-8` (32px) asimétrico — cierre de página. ✅
- Bandas oscuras (`.section-deep`) con menos aire que `.section` — quiebre intencional. ✅
- Hero placa variedades `padding: clamp(32px, 6vw, 56px)` — superficie decorativa única, extremos on-system (32, 56 múltiplos de 4). ✅
- Cart drawer `px-5` (20px) lateral — drawer estrecho 22rem. ✅
- CTA banda oscura — NO aplica `.section-header__sub` (mantiene mb-8 propio). Excepción declarada en código. ✅
- AboutUs — NO aplica `.section-header` (es un bloque editorial-puro, no triple capa). ✅

---

## 8. Severidad — resumen ejecutivo

| Severidad | Nº | Detalle |
|---|---|---|
| CRITICAL | 0 | Los 2 CRITICAL de cableado siguen cerrados desde Fase 4.5 |
| HIGH | 0 | Los 5 HIGH de C1 siguen cerrados; los Bloques A+B+C+D del pase fino cierran lo que quedaba |
| **MEDIUM** | **1** | R-1: sistema de botón con padding 11/13 off-baseline (decisión de TANDA 2) |
| **LOW** | **5** | R-2/R-3/R-4/R-5: 4× `gap-1.5` (6px) decorativos · R-6: 1× literal `padding: "0 14px"` Hero |

**Recuento desde el pase fino 8.4:** 7 MEDIUM + 15 LOW = 22 defectos → **1 MEDIUM + 5 LOW = 6 defectos.** Reducción del 73%.

**Coherence score: 9.0 / 10 — PASS (+0.4 sobre 8.6).**

Proyección tras corregir R-1 (cambiar el sistema a 12/24 + 16/32) y los 5 LOW (4× `gap-2` + 1× `padding: 0 16px`): estimado **9.5–9.6**. Trabajo de ≈6 sustituciones one-liner.

---

## 9. Veredicto

**Status: PASS sólido — 9.0/10, +0.4 sobre el 8.6 histórico, +0.6 sobre el 8.4 del pase fino.**

Lo que TANDA 1+2+3+4 entregaron al espaciado:
1. **El residuo de botón inline más antiguo del proyecto (Fase 4.5 → diferido) está cerrado por SISTEMA**, no por parche.
2. **El "chirría" fino que el pase 8.4 destapó —ritmo de header invertido + 5 recetas distintas— está resuelto con UNA receta tokenizada en CSS** (`.section-header*`).
3. **Cero regresiones.** Las TANDAS no han reabierto nada cerrado, incluido el cambio de Hero a CSS gradient (decorativo `absolute`, sin impacto sobre el flujo).
4. **Hero gutter simétrico, footer 5-col y AboutUs aspect-[4/5]** son ganancias finas reales, no relleno: cierran tres micro-asimetrías que el ojo de Nil captaba.

Lo que separa el 9.0 del 9.5+ está concentrado en **un solo punto**: los valores 11/13 elegidos para el padding vertical del sistema de botón (`.btn--sm`/`.btn--md`). Es la única arritmia base-4 sistémica que queda. Cambiar el sistema a 12/24 + 16/32 (Bloque A del pase fino, no aplicado) lo cierra de un tirón. El resto son 5 hairlines `gap-1.5` decorativos — barrido mecánico de exactitud.

**Handoff:**
- → **`iteration-agent`** (si Nil ratifica): R-1 en `globals.css §8` (4 líneas) + R-2/R-3/R-4/R-5 (`gap-1.5`→`gap-2`, 4 líneas) + R-6 (`padding: "0 14px"`→`0 16px`, 1 línea). Total ≈9 cambios one-liner.
- → **`visual-perfection`**: la fila "spacing" puntúa sobre **9.0** a resolución fina. Ningún CRITICAL/HIGH en juego — la fila no está capada. Con los 6 fixes propuestos sube a ~9.5.
- → **gate de Nil**: ¿cambiar el padding del sistema de botón de 11/13 a 12/16 (todos múltiplos de 4) es deseable? Pro: cierra la única arritmia base-4 sistémica que queda; el botón sigue siendo cómodo (12/16 son valores tipográficamente probados — Bootstrap, Material, Tailwind defaults). Contra: ya está en producción y la diferencia visual es ~2px, no perceptible. Recomendación: hacerlo. El sistema tokenizado merece valores que vivan en su propia escala.

**Una frase para Nil:** las cuatro TANDAS limpiaron el "chirría" fino que destapó el pase 8.4 — sistema de botón, receta única de header, micro-gaps barridos, paneles homologados — sin reabrir ningún defecto cerrado; el sitio está en 9.0/10 PASS con un solo punto MEDIUM accionable (el padding interno de los botones nuevos: 11/13 px, off-baseline base-4 — el resto del sistema sí lo es) y 5 LOW de hairlines decorativos; con ≈9 sustituciones one-liner sube a 9.5.

---

*Re-auditoría estática · dev server apagado por diseño · modo AUDIT — cero archivos de código modificados · cero archivos de memoria de la agencia modificados. Fase 5 · Optimización · re-chequeo del afinado tras las 4 TANDAS.*
