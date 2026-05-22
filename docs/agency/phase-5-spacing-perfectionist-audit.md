# FASE 5 — Optimización · Auditoría FINA de Espaciado
## Entregable del agente `spacing-perfectionist`

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE a la abuela de Nil
**Rama:** `clasico` · **Modo: AUDIT** (detección + propuesta — CERO escritura en código · CERO memoria de agencia tocada)
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page + `/checkout`
**Fecha:** 2026-05-22
**Fase:** 5 — Optimización · afinado FINO de paddings/margins/gaps residuales
**Input prioritario de Nil (PRIORIDAD ALTA):** «La distribución aún se puede afinar más — algo chirría.»
**Base:** Fase 4.5 cerró en 8.6/10 PASS (re-chequeo TANDA 1). El espaciado GRUESO está conectado; esta auditoría es el AFINADO.

---

## Spacing Audit — Yaya Mariana — Site-wide (pase FINO)

**Spacing system in use:** base-4 **conectado y vivo** — `--space-*`, `.section`/`.section-deep`, `.container`/`.container-prose` los consumen las 8 secciones de página (verificado en Fase 4.5 TANDA 1). El pase grueso es sólido. Lo que queda son **residuos finos**: literales `style={{}}` de paddings de botón, micro-gaps fuera de escala dentro de las cards y headers, y **asimetrías de ritmo interno** que el corte grueso no cazó porque cada valor, aislado, "pasa".

**Density register:** `confident-whitespace` — confirmado y correcto. El afinado NO compacta; reparte y exactifica.

**Coherence score: 8.4 / 10**   **Threshold: 8.5**   **Status: FAIL por margen (−0.1)**

> El score baja levemente respecto al 8.6 del re-chequeo de Fase 4.5 porque esa cifra midió "¿se cerró el clúster C1 grueso?" (sí). Esta auditoría mide a una resolución más fina: **¿es cada número exacto?** A esa lupa aparecen 4 patrones que el pase grueso no penalizó. NO es una regresión —el código no ha cambiado— es un cambio de criterio de medición acorde al mandato de Fase 5. Ninguno de los defectos es CRITICAL ni HIGH; son MEDIUM/LOW de pulido. Con el Bloque A aplicado el score sube a ~9.2.

---

## 0. DIAGNÓSTICO — qué "chirría" exactamente

La intuición de Nil («algo chirría») es correcta y tiene **cuatro causas finas concretas**, todas de espaciado, todas invisibles al pase grueso porque cada valor por separado es plausible:

1. **El ritmo interno del header de sección es asimétrico — eyebrow→título→subtítulo→contenido no sigue una progresión.** Hoy, en Products/Values: eyebrow→título `mb-4` (16px) · título→subtítulo `mt-3` (12px) · subtítulo→grid `mb-12` (48px). El salto título→subtítulo (12px) es **menor** que el salto eyebrow→título (16px), cuando la jerarquía pide lo contrario o, como mínimo, igualdad: el subtítulo se "pega" al título. Es un micro-arritmia que el ojo lee como "mal colocado" sin saber nombrarlo. Y los cuatro headers de sección (Products, Values, CTA, Contact, AboutUs) **no comparten la misma receta de ritmo** — cada uno mezcla `mb-4`/`mt-3`/`mb-6`/`mb-8`/`mb-10` distinto.

2. **Los paddings de botón inline siguen off-system — el residuo diferido de Fase 4.5 nunca se cerró.** Tres botones con el mismo rol ("Ver tienda" / CTA primario) llevan tres paddings distintos y **ninguno es múltiplo de 4**: nav `10px 20px`, hero `13px/28px`, móvil `11px 20px`. 10, 11 y 13 rompen el baseline de 4px. Es el defecto que la propia auditoría de Fase 4.5 dejó explícitamente pendiente para "una tanda posterior" — y la tanda posterior es ahora, Fase 5.

3. **Los gaps internos micro-finos van a la deriva — `gap-2.5`, `gap-1.5`, `space-y-2.5`, `mt-0.5`, `mb-0.5`.** El sistema base-4 declara la escala 4·8·12·16·20·24. Un `gap-2.5` = 10px y un `space-y-2.5` = 10px **no están en la escala** (10 no es múltiplo de 4). Aparecen en CTA (cold-chain `gap-2.5`, checkbox `gap-2.5`), Footer (`space-y-2.5` de los links), y micro-labels (`mb-0.5`, `mt-0.5`). Aislados son hairlines invisibles; en conjunto son 8-10 valores que el próximo desarrollador no puede derivar de una regla.

4. **El padding de superficie de cards/paneles no es uniforme entre piezas del mismo tier.** ProductCard body `p-6` (24px) · Values card `p-6` (24px) — **coinciden, bien**. Pero Contact form panel `p-8` (32px) · Checkout summary `p-6` (24px) · Cart drawer `px-5 py-4` (20/16px) · placa Hero `clamp(32px,6vw,56px)` · placa AboutUs `px-5 py-6` (20/24px). Cinco superficies-tarjeta con cinco paddings. El `p-8` del form de Contact y el `p-6` del resumen de Checkout son los dos paneles-formulario grandes del sitio y **no coinciden** (32 vs 24).

**Qué lo arregla, en una frase:** definir UNA receta de ritmo de header (eyebrow `mb-4` → título → subtítulo `mt-4` → contenido `mb-12`), tokenizar el padding de botón (`--btn-pad`/`--btn-pad-lg`) y aplicarlo a los 3 botones inline, subir los `gap-2.5`/`space-y-2.5` a `gap-3`/`space-y-3` (12px, on-system), y unificar el padding de los dos paneles-formulario. Cero rediseño; es exactitud.

---

## 1. Sistema de espaciado en uso — confirmación fina

### 1.1 Lo que el pase grueso ya dejó bien (no se re-audita — registrado como PASS)

- `globals.css`: `--space-section-gap: clamp(5rem,8vw,7rem)` (80→112px) y `--space-section-gap-deep: clamp(3.5rem,6vw,4.5rem)` (56→72px) — fluidos, correctos.
- `.section`/`.section-deep` aplicados en las 8 secciones; ritmo periódico de 2 niveles. PASS.
- `.container` (72rem) / `.container-prose` (45rem) — 2 anchos tokenizados. PASS.
- Grids: Products/Values `gap-6` (24px), StatsStrip `gap-y-10 gap-x-6` (40/24), Footer top `gap-10` (40) — todos on-system. PASS.
- Card grid `gap-6` consistente entre Products y Values. PASS.
- Line-heights (`body` 1.65, `.text-h1/h2/h3` 1.12/1.18/1.25, `.text-overline` 0.18em) — todos en rango. PASS.
- ProductCard body `p-6` = Values card `p-6` (24px) — la normalización HIGH #10 de Fase 4.5 se mantiene. PASS.
- `.text-overline` unificado: eyebrows de Hero, Products, Values, AboutUs, CTA, Contact, Footer **todos usan la clase `.text-overline`** (0.18em). El tracking `0.22em` inline del Hero que Fase 4.5 marcó como LOW #31 **ya está corregido** — `hero.tsx:326` y `:409` usan `className="text-overline"`. PASS — buen hallazgo de pulido cerrado.

### 1.2 Lo que el pase fino destapa

El sistema está conectado, pero el **enforcement no es total**: hay 3 superficies donde el espaciado se escribe en literal `style={{}}` con valores crudos (los 3 botones de Hero), y hay micro-utilidades Tailwind fuera de la escala base-4 (`*-2.5` = 10px, `*-0.5` = 2px, `gap-3.5` aún en un punto). El sistema "existe", pero ~22 instancias finas no lo respetan al 100%.

**Baseline real:** 4px. Off-baseline detectados en el pase fino: `10px`/`11px`/`13px` (botones inline), `gap-2.5`/`space-y-2.5`/`mt-2.5` (=10px), `mb-0.5`/`mt-0.5`/`mb-1.5`/`mt-1.5` (=2px/6px). De estos, 10px y 6px y 2px **no son múltiplos de 4** — rompen el baseline. (6px y 2px son hairline-tolerados solo en la escala 8px pura; en una base-4 estricta `mb-1.5`=6px no está en `4·8·12·16·20·24` y debería ser `mb-1`=4px o `mb-2`=8px.)

---

## 2. Issues detectados — pase FINO

> `Current` = valor real en el build. `Correct` = snap al sistema base-4 de Fase 3, sesgado al múltiplo coherente con la jerarquía. NINGÚN cambio escrito en código — propuesta para el gate de Nil. Severidades calibradas al mandato de Fase 5 (afinado): no hay CRITICAL/HIGH; los defectos son de exactitud, no de estructura.

| # | Element / file | Current | Correct | Severity | Reason |
|---|----------------|---------|---------|----------|--------|
| 1 | Botón nav "Ver tienda" — `hero.tsx:279` | `padding: "10px 20px"` | `12px 24px` (`--btn-pad`) | **MEDIUM** | 10px off-baseline (no múltiplo de 4). Residuo diferido de Fase 4.5 #15. Detección #1 + #2 |
| 2 | Botón hero "#productos" — `hero.tsx:376` | `paddingTop/Bottom: 13` · `paddingLeft/Right: 28` | `12 / 24` o `16 / 32` (`--btn-pad-lg`) | **MEDIUM** | 13px y 28px off-baseline. CTA de conversión primario. Residuo diferido #14 |
| 3 | Botón móvil "Ver tienda" — `hero.tsx:186` | `padding: "11px 20px"` | `12px 24px` (`--btn-pad`) | **MEDIUM** | 11px off-baseline. Mismo rol que #1 y #2 con un TERCER valor distinto. Residuo diferido #16 |
| 4 | Receta de ritmo de header — Products `products.tsx:471` · Values `values.tsx:53` | título→subtítulo `mt-3` (12px) | `mt-4` (16px) | **MEDIUM** | El salto título→subtítulo (12px) es menor que eyebrow→título (16px): el subtítulo se pega al título. Causa #1 del "chirría". Detección #5 (ritmo interno) |
| 5 | Receta de ritmo de header — inconsistencia entre 5 secciones | Products `mb-4/mt-3/mb-12` · Values `mb-4/mt-3/mb-12` · AboutUs `mb-4/—/mb-6` · CTA `mb-4/—/mb-4→mb-8` · Contact `mb-4/—/mb-4→mb-10` | una receta única: eyebrow `mb-4` · título→sub `mt-4` · sub→contenido `mb-12` (banda oscura: `mb-8`) | **MEDIUM** | 5 headers de sección, 5 recetas de ritmo distintas. Detección #2. El header "no está bien colocado" respecto al contenido que le sigue, de forma distinta en cada sección |
| 6 | CTA — subtítulo→contenido — `cta.tsx:34,144` | `mb-8` (32px) | `mb-8` ok, pero el H2 lleva `mb-4` (16px) antes | LOW | El header de CTA salta `mb-4` (eyebrow) → `mb-4` (H2) → `mb-8` (subtítulo): el eyebrow y el H2 usan el MISMO `mb-4`, sin progresión. Debe escalar |
| 7 | Contact — subtítulo→bloque info — `contact.tsx:143` | `mb-10` (40px) | `mb-12` (48px) o `mb-8` (32px) | **MEDIUM** | 40px aislado, no es el valor de header-a-contenido del resto (Products/Values usan 48px). Detección #1. Repetido de Fase 4.5 #13 — sin corregir |
| 8 | Contact form panel padding — `contact.tsx:179` | `p-8` (32px) | `p-8` ok SI se declara como tier "panel grande"; pero ≠ Checkout summary `p-6` | **MEDIUM** | El form de Contact (`p-8`=32px) y el resumen de Checkout (`p-6`=24px) son los 2 paneles-formulario del sitio y no comparten padding. Causa #4. Detección #2 |
| 9 | Checkout — order summary `aside` — `checkout.tsx:318` | `p-6` (24px) | `p-8` (32px) — igualar a Contact form | **MEDIUM** | Ver #8. Dos superficies del mismo tier (panel de formulario/resumen) con padding distinto |
| 10 | Cart drawer — secciones `px-5 py-4` — `cart.tsx:104,118,187` | `px-5 py-4` (20/16px) | `px-6 py-5` (24/20px) o `p-5` uniforme | LOW | El drawer usa 20/16; los paneles del sitio usan 24-32. Es un drawer estrecho (max-w 22rem) → 20px lateral es defendible, pero el `py-4`=16px vertical es escaso para separar header/items/footer en un drawer |
| 11 | CTA — cold-chain micro-bloque `gap-2.5` — `cta.tsx:62,64` | `gap-2.5` (10px) | `gap-3` (12px) | **MEDIUM** | 10px off-baseline (no múltiplo de 4). Detección #1 |
| 12 | CTA — checkbox de consentimiento `gap-2.5` — `cta.tsx:177` | `gap-2.5` (10px) | `gap-3` (12px) | LOW | 10px off-baseline. Mismo patrón que #11 |
| 13 | Footer — `space-y-2.5` lista de links — `footer.tsx:150` | `space-y-2.5` (10px) | `space-y-3` (12px) | LOW | 10px off-baseline entre items de lista. Detección #1 |
| 14 | Footer — bottom row `pt-7` — `footer.tsx:169` | `pt-7` (28px) | `pt-6` (24px) o `pt-8` (32px) | LOW | `pt-7`=28px no está en la escala base-4 (`4·8·12·16·20·24·32`). Snap a 24 o 32 |
| 15 | CTA — trust badges `mt-7` — `cta.tsx:62` (cold-chain) | `mt-7` (28px) | `mt-6` (24px) o `mt-8` (32px) | LOW | `mt-7`=28px off-system, igual que #14. CTA tiene `mt-7` y `mt-8` mezclados |
| 16 | Hero — eyebrow row `gap-3` + `mb-5` — `hero.tsx:323` | `gap-3` (12px) · `mb-5` (20px) | `gap-3` ok · `mb-5`→`mb-6` (24px) si se alinea al ritmo de otros eyebrows | LOW | El eyebrow del Hero separa de la línea decorativa con `gap-3` y del titular con `mb-5`(20px); los demás eyebrows usan `mb-4`(16px). Inconsistencia menor de ritmo eyebrow |
| 17 | Hero — línea decorativa `my-6` — `hero.tsx:363` | `my-6` (24px) | on-system — pero verificar simetría con el bloque cita arriba (`mb-0`) | LOW | `my-6`=24px es on-system; el `mb-0` del bloque cita encima crea un salto irregular cita→línea (0) vs línea→botones (24). Aceptable, pero el `mb-0` es un literal que delata falta de ritmo declarado |
| 18 | ProductCard — chip de trazabilidad `gap-1.5` — `products.tsx:368` | `gap-1.5` (6px) | `gap-2` (8px) | LOW | `gap-1.5`=6px icono↔texto; mi rúbrica fija icono↔label en 8-12px. 6px es sub-mínimo. Detección #1 |
| 19 | ProductCard — precio `ml-1.5` "/ 500g" — `products.tsx:380` | `ml-1.5` (6px) | `ml-2` (8px) | LOW | 6px off-baseline para separar precio de unidad |
| 20 | Micro-labels `mb-0.5` / `mt-0.5` — `contact.tsx:154`, `cta.tsx:183` | `mb-0.5`/`mt-0.5` (2px) | `mb-1`/`mt-1` (4px) | LOW | 2px no está en la escala base-4; el mínimo es 4px (`--space-1`). Hairline tolerado pero off-system estricto |
| 21 | Form labels `mb-1.5` — `contact.tsx:219,243,269,292` | `mb-1.5` (6px) | `mb-2` (8px) | LOW | 6px label→input; el resto de gaps de formulario van en 16-20px (`space-y-5`). 6px es el único múltiplo-no-4 del form. Snap a 8px |
| 22 | Form error `mt-1.5` — `contact.tsx:237,262,287,308` | `mt-1.5` (6px) | `mt-2` (8px) | LOW | 6px input→mensaje de error. Mismo patrón #21 |
| 23 | Hero — botones `gap-5` — `hero.tsx:372` | `gap-5` (20px) | on-system | — (PASS) | 20px = `--space-5`. Correcto para separar CTA primario de enlace secundario |
| 24 | Hero — derecha `gap-5` (idioma↔botón) — `hero.tsx:270` | `gap-5` (20px) | on-system | — (PASS) | Correcto |
| 25 | Contact — grid `gap-12` (48px) — `contact.tsx:127` | `gap-12` | on-system | — (PASS) | Corregido en Fase 4.5 (#12, era `gap-14`). Se mantiene. PASS |
| 26 | AboutUs — bloque tributo `gap-5` + `mt-8` — `about-us.tsx:37,60` | `gap-5` (20) · `mt-8` (32) | on-system | — (PASS) | Múltiplos de 4. Correctos |
| 27 | Checkout — `gap-10` columnas / `space-y-8` form — `checkout.tsx:164,167` | 40 / 32 | on-system | — (PASS) | Correctos |
| 28 | StatsStrip — `gap-2` interno + `mt-1` cifra — `stats-strip.tsx:97,108` | 8 / 4 | on-system | — (PASS) | Múltiplos de 4. Correctos |
| 29 | ProductCard — `mb-2` título · `pt-3` divisor · `space-y-3` — `products.tsx:358,376` | 8 / 12 / 12 | on-system | — (PASS) | Correctos |
| 30 | Checkout — `Field` `space-y-1.5` — `checkout.tsx:373` | `space-y-1.5` (6px) | `space-y-2` (8px) | LOW | Mismo patrón #21 — el `Field` de checkout usa 6px label↔input; debería igualar a 8px |

**Recuento por severidad:** 0 CRITICAL · 0 HIGH · 7 MEDIUM · 15 LOW · 8 PASS explícitos.
**Defectos accionables reales: 7 MEDIUM + 15 LOW = 22.**

---

## 3. Correcciones propuestas (NO aplicadas — modo AUDIT)

> Cada línea es un diff que `iteration-agent` podría aplicar sin preguntar, si Nil ratifica. Orden por leverage.

**Bloque A — Cerrar el residuo de botón diferido (resuelve #1, #2, #3 — el "chirría" más concreto):**
- `globals.css` — añadir 2 tokens: `--btn-pad-y: var(--space-3)` (12px), `--btn-pad-x: var(--space-6)` (24px); y para el CTA grande del Hero `--btn-pad-lg-y: var(--space-4)` (16px), `--btn-pad-lg-x: var(--space-8)` (32px). Opción más limpia: una utilidad `.btn-pad { padding: 12px 24px }` / `.btn-pad-lg { padding: 16px 32px }`.
- `hero.tsx:279` — nav CTA: `padding: "10px 20px"` → `12px 24px`.
- `hero.tsx:186` — MobileNav CTA: `padding: "11px 20px"` → `12px 24px`.
- `hero.tsx:376` — hero CTA `#productos`: `paddingTop/Bottom: 13` + `paddingLeft/Right: 28` → `16px 32px` (es el CTA primario más prominente; el `py-3`=12px que usan los demás botones es el suelo, el hero puede ir un escalón arriba a 16/32 — registrar como tier "CTA hero"). **Si Nil prefiere uniformidad total**: `12px 24px` como todos. Recomendación: `12px 24px` — un solo padding de botón en todo el sitio es lo que el sistema pide; el hero ya gana protagonismo por tamaño de tipografía y posición, no necesita padding extra.

> Tras Bloque A: de 4 paddings de botón distintos (10/11/12/13) el sitio queda con **uno** (12px vertical · 24px horizontal), on-baseline, tokenizado. Cierra el defecto que Fase 4.5 arrastraba como diferido.

**Bloque B — Receta única de ritmo de header (resuelve #4, #5, #6, #7 — la causa #1 del diagnóstico):**
- Definir la receta: `eyebrow mb-4 (16)` → `título` → `mt-4 (16) subtítulo` → `mb-12 (48) contenido`. Para bandas oscuras (CTA) el contenido va a `mb-8 (32)` porque la banda lleva menos aire.
- `products.tsx:471` — subtítulo `mt-3` → `mt-4`.
- `values.tsx:53` — subtítulo `mt-3` → `mt-4`.
- `cta.tsx:30-34` (InSeason) y `:138-144` (OffSeason) — el H2 lleva `mb-4`; el subtítulo `mb-8`. Cambiar el H2→subtítulo: el eyebrow ya usa `mb-4`; el bloque H2 debería separar del subtítulo con un valor mayor o igual. Dejar H2 `mb-4` está bien; revisar que eyebrow `mb-4` + H2 `mb-4` no produzcan dos saltos idénticos planos — subir el eyebrow→H2 a `mb-3` (12) NO, mantener `mb-4`. La receta de CTA queda: eyebrow `mb-4` → H2 `mb-4` → subtítulo `mb-8`. Aceptable; documentar.
- `contact.tsx:143` — subtítulo→info `mb-10` → `mb-12` (alinea a Products/Values) o `mb-8`.

**Bloque C — Snap de micro-gaps off-baseline (resuelve #11, #12, #13, #14, #15, #18-22, #30):**
- `cta.tsx:62,64,177` — `gap-2.5` → `gap-3` (3 ocurrencias: cold-chain wrapper, cold-chain item, checkbox).
- `footer.tsx:150` — `space-y-2.5` → `space-y-3`.
- `footer.tsx:169` — `pt-7` → `pt-8`.
- `cta.tsx:62` — `mt-7` → `mt-8` (unifica con el `mt-8` de las trust badges).
- `products.tsx:368` — chip trazabilidad `gap-1.5` → `gap-2`.
- `products.tsx:380` — precio `ml-1.5` → `ml-2`.
- `contact.tsx:219,243,269,292` — labels `mb-1.5` → `mb-2`.
- `contact.tsx:237,262,287,308` — errores `mt-1.5` → `mt-2`.
- `contact.tsx:154` `mb-0.5` · `cta.tsx:183` `mt-0.5` — → `mb-1` / `mt-1`.
- `checkout.tsx:373` — `Field` `space-y-1.5` → `space-y-2`.

**Bloque D — Unificar padding de paneles-formulario (resuelve #8, #9):**
- `checkout.tsx:318` — order summary `aside` `p-6` → `p-8`, iguala al form de Contact (`p-8`). Decisión alternativa: bajar Contact a `p-6` — pero `p-8`=32px es el valor confident-whitespace correcto para un panel de formulario; subir Checkout es lo coherente.
- `cart.tsx:104,118,187` — drawer `py-4` → `py-5` (20px) para dar más aire vertical a las 3 zonas del drawer; `px-5` se mantiene (drawer estrecho). LOW, opcional.

---

## 4. Vertical rhythm check (pase fino)

**Baseline:** 4px. Estado tras el pase fino:

**Off-baseline restantes (rompen el baseline de 4px):**
- Botones inline Hero/Nav: `10px` / `11px` / `13px` — #1, #2, #3. **No corregidos desde Fase 4.5.**
- `gap-2.5` / `space-y-2.5` / `mt-2.5` = 10px — #11, #12, #13. 10 no es múltiplo de 4.
- `mb-0.5` / `mt-0.5` = 2px — #20. Por debajo del mínimo de escala (`--space-1`=4px).

**Within-tolerance pero off-escala estricta (6px — múltiplo de 4 NO; hairline 8px-system SÍ):**
- `mb-1.5` / `mt-1.5` / `space-y-1.5` / `gap-1.5` = 6px — #18, #21, #22, #30. En una base-4 estricta 6px no existe; snap a 4 u 8.

**Adjacent-section gap consistency: PASS** (sin cambios — el ritmo de 2 niveles `.section`/`.section-deep` de Fase 4.5 se mantiene íntegro).

**Intra-section rhythm consistency: FAIL fino.** El ritmo ENTRE secciones es periódico; el ritmo DENTRO de cada sección no lo es:
- El header de sección tiene 5 recetas distintas (#5).
- El salto título→subtítulo (12px) < eyebrow→título (16px) invierte la progresión esperada (#4).
- Los micro-gaps de CTA (`gap-2.5`, `mt-7`, `mt-8` mezclados) no derivan de una escala única.

**Veredicto:** el pase grueso enderezó el ritmo macro (scroll periódico). El ritmo micro —dentro del header, dentro de las cards, dentro de los micro-bloques— **aún no es un sistema**, es una colección de valores plausibles. Eso es exactamente lo que "chirría": no un salto grande y visible, sino una arritmia fina y difusa que el ojo registra sin poder señalar.

---

## 5. Responsive check (estático — server apagado por diseño)

- **Mobile (375px): HOLDS.** Los `clamp()` de sección resuelven bien (verificado en Fase 4.5). Reserva fina nueva: los botones inline con `10px/11px/13px` de padding vertical — en móvil el `minHeight: 44` del MobileNav CTA (`hero.tsx:186`) **garantiza el tap target** pese al `11px`, correcto; pero el nav CTA de escritorio (`hero.tsx:279`, `10px 20px`) es `hidden md:inline-flex` → no afecta a móvil. El hero CTA `#productos` con `13px` vertical + `text-sm` (≈20px line-height) da ≈46px de alto computado → tap target OK por los pelos. Subir a `12px` (que con line-height da ≈44px) o `16px` (≈52px) es más seguro y on-system.
- **Tablet (768px): HOLDS.** Sin hallazgos finos nuevos. La receta de header (`mt-3`/`mt-4`) es invariante por breakpoint — el fix no necesita override responsive.
- **Desktop (1280px): HOLDS — pero es donde la arritmia fina del header más se nota.** A 1280px el header de sección ocupa una franja amplia y centrada; el salto corto título→subtítulo (12px) se lee como "subtítulo pegado" con más evidencia que en móvil. El fix `mt-3`→`mt-4` es el que más rinde en desktop.
- **Verificación diferida (de Fase 4.5, sigue pendiente):** Hero `min-h-[calc(100dvh-72px)]` + `py-20` a 1280×900 — comprobar orphaned whitespace. No es defecto de este pase; se mantiene en la lista de verificación en vivo.

**Conclusión responsive:** sin crush, sin slack. El espaciado fluido macro es correcto. Los defectos finos de este pase son **invariantes por breakpoint** (paddings de botón, recetas de header, micro-gaps) → se corrigen una vez y valen en los 3 anchos.

---

## 6. Intentional exceptions (not flagged / registradas)

- **`.container-prose` 45rem en AboutUs y CTA** — ancho editorial estrecho, ratificado como token en Fase 4.5. Correcto, no se toca.
- **Footer `pb-8` (32px) asimétrico** — cierre de página; asimetría intencional registrada. No se toca.
- **Bandas oscuras (`.section-deep`) con menos aire que el contenido** — quiebre de ritmo intencional. Correcto.
- **Placa de variedades del Hero `padding: clamp(32px,6vw,56px)`** — es un literal `style`, pero el `clamp` es fluido y los extremos (32/56) son on-system; es una superficie decorativa única (no un tier repetido). Aceptable como excepción — no hay otra placa con la que deba coincidir. Registrada, no flagged.
- **Cart drawer `px-5` (20px) lateral** — el drawer mide 22rem de ancho; 20px lateral es proporcionado para un panel estrecho frente a los 24-32px de los paneles full. El `px` se acepta; solo el `py-4` (16px) vertical se marca como LOW #10 por escaso.
- **`gap-1.5` icono↔label en botones con flecha** (`gap-1.5` en hero CTA, ProductCard "Ver más") — 6px icono-texto en un CTA es tracking interno de botón, defendible como apretado-intencional para que el par texto+flecha lea como una unidad. Lo dejo como LOW, no MEDIUM — borderline. Si Nil lo quiere exacto, `gap-2` (8px).

> Ninguna decisión de `creative-director` en memoria justifica las 5 recetas de header distintas ni los 10/11/13px de botón — esos SÍ son defectos de exactitud, no taste calls.

---

## 7. Severidad — resumen ejecutivo

| Severidad | Nº | Qué son |
|---|---|---|
| **CRITICAL** | 0 | El pase grueso de Fase 4.5 cerró los 2 CRITICAL de cableado. Ninguno reabierto |
| **HIGH** | 0 | Los 5 HIGH de C1 siguen cerrados. Ningún defecto fino alcanza HIGH |
| **MEDIUM** | 7 | 3 paddings de botón inline off-baseline · ritmo título→subtítulo invertido · 5 recetas de header distintas · Contact `mb-10` aislado · paneles-formulario `p-8`≠`p-6` · cold-chain `gap-2.5` off-baseline |
| **LOW** | 15 | micro-gaps off-baseline (`space-y-2.5`, `pt-7`, `mt-7`, `mb-1.5`, `mt-1.5`, `mb-0.5`, `gap-1.5`, `ml-1.5`) · drawer `py-4` escaso · ritmo eyebrow Hero `mb-5` |

**Coherence score: 8.4 / 10 — FAIL por margen (−0.1 del umbral 8.5).**

Proyección tras aplicar Bloques A+B+C+D: estimado **9.1–9.3**. Es trabajo mecánico de exactitud, ~22 sustituciones de valor, cero rediseño. Bloque A (botones) es el de mayor leverage perceptual — cierra el residuo más "chirriante" y el más antiguo.

---

## 8. Status & Handoff

**Status:** **FAIL por margen** — coherencia 8.4 < 8.5 a resolución fina. NO es una regresión: el código no ha cambiado desde el 8.6 de Fase 4.5; es la lupa de Fase 5 (exactitud, no estructura) la que destapa los 22 residuos finos. El sitio sigue siendo entregable; este informe es la lista de afinado que el mandato de Fase 5 pidió.

**Causa raíz del "chirría" de Nil:** no hay un defecto grande. Hay **cuatro micro-patrones** —botones off-baseline, ritmo de header invertido y no-uniforme, micro-gaps fuera de escala, paddings de panel desiguales— que individualmente "pasan" pero en conjunto producen una arritmia fina que el ojo entrenado de Nil registra sin poder nombrar. El afinado que falta es de **exactitud**: hacer que cada número derive de la escala, no que se le parezca.

**Handoff:**
- → **`iteration-agent`** (tras gate de Nil): **Bloque A es la prioridad** — cierra los 3 botones inline (residuo diferido desde Fase 4.5, el más visible) y deja UN solo padding de botón tokenizado. **Bloque B** (receta única de header) es el segundo en leverage — resuelve la causa #1 del diagnóstico. Bloques C/D son barrido de exactitud. ~22 cambios, todos one-liners.
- → **`visual-perfection`**: la fila "spacing" puede puntuarse sobre 8.4 a resolución fina; con Bloque A+B aplicado sube a ~9.2. Ningún CRITICAL/HIGH en juego — la fila no está capada.
- → **gate de Nil**: una decisión de taste — el botón hero `#productos` ¿se unifica a `12px 24px` como todos (recomendado: un solo padding de botón en el sitio) o se le da un tier `CTA-hero` a `16px 32px`? Y confirmar la receta de header (eyebrow `mb-4` → `mt-4` subtítulo → `mb-12` contenido).

**Una frase para Nil:** lo que chirría no es un fallo grande sino cuatro detalles finos —tres botones del menú con un padding descuadrado, el subtítulo de cada sección pegado a su título, una decena de micro-espacios fuera de la escala y dos formularios con relleno distinto—; ninguno se ve solo, pero juntos rompen la sensación de que todo está medido, y afinarlos (≈22 ajustes de un número cada uno, sin rediseñar nada) lleva el espaciado de "aprobado" a "milimétrico".

---

*Auditoría estática · dev server apagado por diseño · modo AUDIT — cero archivos de código modificados · cero archivos de memoria de la agencia modificados. Fase 5 · Optimización · pase FINO de espaciado.*
