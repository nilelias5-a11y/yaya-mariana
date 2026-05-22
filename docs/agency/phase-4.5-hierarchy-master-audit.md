# FASE 4.5 — Auditoría de Jerarquía Visual · Yaya Mariana
## Entregable del agente `hierarchy-master` — Director de Arte Editorial del Camino Visual

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE
**Rama:** `clasico` · **Modo:** AUDIT (solo detección y propuesta — no se modifica código)
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page
**Fecha:** 2026-05-22
**Auditado:** `src/app/page.tsx`, `layout.tsx`, `globals.css`, `src/components/ui/*.tsx` (10 componentes + `/checkout`)
**Input prioritario de Nil:** «La web se ve junta, mal distribuida, las cosas no están bien colocadas.»

---

## Hierarchy Audit — Yaya Mariana — Site-wide

**Reading pattern in use:**
- Hero: **Z-pattern** — logo top-left, idioma+CTA top-right, diagonal a la cita, CTA al final. Correcto para hero esparcido a 2 columnas.
- StatsStrip: banda de ritmo, sin patrón de lectura (4 ítems paralelos, intencional).
- Products / Values: **F-pattern** — grid de tarjetas, header centrado, barrido horizontal por filas.
- AboutUs: **F-pattern** — columna única 720px, lectura vertical anclada a la izquierda.
- CTA: eje central simétrico — patrón centrado (válido para banda de cierre).
- Contact: **F-pattern** 2-col — info izquierda, formulario derecha.
- Footer: grid 4-col, lectura por columnas.

**Typographic scale ratio (declarada en design system Fase 3):** 1.25–1.333 — escala `--fs-*` limpia y descendente SOBRE EL PAPEL. **PROBLEMA RAÍZ: la escala NO se aplica.** Los componentes no usan las utilidades `.text-h1/.text-h2/...` ni los tokens `--fs-*`; cada componente hardcodea tamaños Tailwind arbitrarios. Ver Issue #1.

**Coherence score: 5.5 / 10**   **Threshold: 8.5**   →   **FAIL**

> Un CRITICAL (escala tipográfica del design system no aplicada + texto de cuerpo bajo AA por opacidad) capa la coherencia en ~6.0 conforme a la regla de calibración de [[hierarchy-master-memory]]. El resto del trabajo es sólido — la arquitectura de secciones es sana y el Hero tiene un protagonista claro — pero la jerarquía que el sistema *declara* no es la que el visitante *ve*.

---

## DIAGNÓSTICO DEL INPUT DE NIL — "se ve junta, mal colocada"

La queja de Nil tiene tres causas mecánicas concretas, todas de jerarquía, todas medibles:

1. **El design system de Fase 3 nunca se aplicó a los componentes.** `globals.css` tokeniza la paleta y publica una escala tipográfica limpia (`.text-h1`…`.text-overline`) y la regla dura **G-1 (prohibido opacidad sobre texto)**. Pero los 10 componentes siguen con el build pre-Fase-3: tamaños Tailwind sueltos (`text-4xl`, `text-xl`, `text-sm`, `text-[1.25rem]`) y **texto secundario con opacidad** (`text-[#7a3a3a]/65`, `text-white/70`, `text-white/35`). La escala que debería hacer "saltar a la vista" el orden de importancia está apagada. → **El sitio se ve plano porque todos los niveles inferiores se aplastan en un único gris-rosa de bajo contraste.** Esa es la sensación de "todo junto".

2. **Jerarquía plana dentro de cada tarjeta y cada bloque de texto.** Cuando el cuerpo, los metadatos y las descripciones viven todos en `#7a3a3a` con opacidad 50–65%, no hay tiers — hay una mancha. Squint test: en Products, Values y Contact, al entornar los ojos la descripción, el precio "/500g", el chip de trazabilidad y el "Ver más" colapsan en una sola textura gris. Sin tiers, el ojo no tiene asideros → "mal distribuida".

3. **Ritmo de sección uniforme + protagonistas que no destacan lo suficiente.** Todas las secciones de contenido usan `py-20` idéntico y el mismo patrón eyebrow→h2→subtítulo→contenido. El patrón es correcto, pero como los `<h2>` y los eyebrows tienen poco contraste de peso/escala frente al cuerpo (ver Issues #1, #6, #9), las costuras entre secciones se difuminan. Las secciones no "respiran" como capítulos distintos → "mal colocada".

**Conclusión del diagnóstico:** Nil no está viendo un problema de *espaciado* (eso lo audita `spacing-perfectionist`). Está viendo un problema de **jerarquía aplastada**: el design system define un orden de importancia nítido que el código nunca recibió. La corrección de máximo apalancamiento es **migrar los componentes al design system de Fase 3** — escala `--fs-*` aplicada + G-1 cumplida. Eso solo recupera la mayor parte de la sensación de "colocado".

---

## Per-section protagonist check

| Sección | Protagonista previsto | Ganador visual real | Estado |
|---------|----------------------|---------------------|--------|
| **Nav** | CTA "Ver tienda" | CTA "Ver tienda" (rojo sólido vs links negros) | PASS |
| **Hero** | Cita `<h1>` Playfair italic | Cita `<h1>` — pero **empatada** con la placa blanca de variedades (45% de ancho, borde, 3 nombres en 2.35rem italic) | FAIL — protagonista compite con la columna derecha |
| **StatsStrip** | Las 4 cifras (`2.6rem` serif) | Las 4 cifras | PASS — sin protagonista único por diseño (4 ítems pares, intencional) |
| **Products** | Grid de tarjetas de producto | Grid de tarjetas | PASS a nivel sección · FAIL dentro de la tarjeta (ver Issue #5) |
| **AboutUs** | El `<h2>` titular + el relato | Empate `<h2>` ↔ bloque tributo (placa "Mariana" + blockquote) | BORDERLINE — el bloque tributo casi iguala al titular; aceptable por tono homenaje, pero el blockquote no está claramente subordinado |
| **Values** | Grid de 6 tarjetas de beneficio | Grid de 6 tarjetas | PASS |
| **CTA** | El `<h2>` + botón "Comprar ahora" | El `<h2>` | PASS — protagonista claro, banda oscura aísla bien |
| **Contact** | El formulario (conversión) | Empate formulario ↔ columna de info | FAIL — dos columnas de peso visual casi idéntico, sin protagonista declarado |
| **Footer** | Navegación / wordmark | Reparto plano 4-col | PASS — footer admite jerarquía plana |
| **Cart (drawer)** | Lista de ítems + botón checkout | Botón checkout | PASS |

**Recuento:** 5 PASS · 1 BORDERLINE · 3 FAIL (Hero, Products-intra-card, Contact).

---

## Issues detected

| # | Elemento / archivo | Problema | Severidad | Fix |
|---|--------------------|----------|-----------|-----|
| 1 | **Todos los componentes** vs `globals.css` §5 | El design system de Fase 3 (escala `--fs-*` + utilidades `.text-h1`…`.text-overline`) **no se aplica**: cada componente hardcodea tamaños Tailwind sueltos. La escala que debería ser visible a simple vista no existe en el render. Causa directa del "se ve junta". | **CRITICAL** | Migrar los 10 componentes a las utilidades `.text-*`/tokens `--fs-*`. Headings → `.text-h2`/`.text-h3`; eyebrows → `.text-overline`; cuerpo → `.text-body`; metadatos → `.text-caption`. Sin esto la jerarquía no se ve. |
| 2 | **Texto secundario** en `products.tsx`, `values.tsx`, `contact.tsx`, `stats-strip.tsx`, `cta.tsx`, `footer.tsx` — `text-[#7a3a3a]/65`, `text-white/70`, `text-white/65`, `text-white/55`, `text-white/35`, `text-[#7a3a3a]/50` | Opacidad sobre texto — **viola la regla dura G-1 del design system**. El texto de cuerpo cae por debajo de AA (4.5:1) sobre cream/blanco. Texto secundario indistinguible del cuerpo → jerarquía aplastada. La tabla §7 de Fase 3 lista estos 9 fallos como ya diagnosticados y NO resueltos en el código. | **CRITICAL** | Sustituir por tokens sólidos: cuerpo → `--color-text-secondary` (`#5a2a2a`); metadatos → `--color-text-muted` (`#6e3232`); sobre oscuro → `--color-text-on-deep`. Cero opacidad sobre nodos de texto. |
| 3 | `hero.tsx` — placa blanca de variedades (col. derecha, 45% ancho, `border`, 3 nombres `clamp(1.7rem,3.4vw,2.35rem)` italic) vs `<h1>` (`clamp(2rem,4vw,3rem)` italic) | Dos focos compiten en el Hero: la cita `<h1>` y la placa de variedades. En desktop la placa ocupa ~45% del ancho, lleva borde (peso de contorno) y tres nombres en italic casi tan grandes como el `<h1>`. Squint test: la placa sobrevive con presencia comparable a la cita. | **HIGH** | Demotar la placa a soporte: reducir los nombres a `clamp(1.35rem,2.6vw,1.75rem)`, retirar el `border` (sustituir por fondo `--color-bg-subtle` sin contorno) o bajar opacidad del contenedor. La cita `<h1>` debe ganar el squint sin discusión. |
| 4 | `hero.tsx` `<h1>` color `#962a1f` sobre MeshGradient (`#f5d0c8`–`#ffd0c0`, fondo sección `#fff5f5`) | El `<h1>` se evaluó en Fase 3 a 7.43:1 contra cream sólido `#fdf6f5`. El fondo real es un MeshGradient animado con stops claros (`#ffd0c0`, `#f5d0c8`): contra `#ffd0c0` el carmín `#962a1f` cae a ~6.0:1 — **por debajo de AAA (7:1) para titulares**. El headline no tiene estrategia de contraste estructural independiente de la foto/shader (patrón de fallo registrado en [[visual-perfection-memory]]). | **HIGH** | Asegurar AAA estructural: o bien el `<h1>` sobre una banda/scrim sólido cream, o congelar el stop bajo la cita a un valor que garantice ≥7:1, o oscurecer el carmín del `<h1>` a `--strawberry-700` (`#7a1f17`) que pasa AAA sobre todos los stops del mesh. |
| 5 | `products.tsx` ProductCard — `<h3>` nombre `text-[1.25rem]` vs descripción `text-sm` (13px) `/65` · precio `text-lg` (18px) bold vs nombre `1.25rem` (20px) | Anatomía de tarjeta de producto: orden canónico imagen→nombre→precio→botón. Aquí el **precio (18px bold `#1a0808`) casi iguala al nombre (20px regular-serif)**: delta de solo 2px y el precio gana en peso. Dentro de la tarjeta no hay un protagonista textual claro — nombre, precio y "Ver más" pelean. El chip de trazabilidad (`0.6875rem`) y el "Ver más" (`text-xs` `/70`) añaden ruido de 4º y 5º tier. | **HIGH** | Subir el `<h3>` nombre a `.text-h3` (`1.5rem`/600) para crear delta ≥6px sobre el precio; mantener precio `1.0625rem`/700. Reducir a 3 tiers visibles por tarjeta: nombre (protagonista) → precio+botón (soporte) → descripción+chip (ambiente). |
| 6 | Eyebrows en `products.tsx`, `values.tsx`, `about-us.tsx`, `contact.tsx`, `cta.tsx` — `text-xs` (12px) `tracking-[0.18em]` vs `--fs-overline` del sistema (`0.6875rem`/11px `0.18em`) | Los eyebrows no usan `.text-overline`. Tamaño 12px en lugar de 11px — drift menor, pero además **el eyebrow del Hero usa 11px** y los de sección 12px: el kicker no es consistente entre secciones. Inconsistencia de tier de etiqueta. | **MEDIUM** | Aplicar `.text-overline` a todos los eyebrows. Unifica a 11px/600/0.18em y garantiza que el kicker es el mismo tier en las 7 secciones. |
| 7 | `stats-strip.tsx` — label `text-sm text-white/65` sobre `#5c1a1a` | Label de stat con opacidad (G-1) — `white/65` sobre maroon. Además el label es el único soporte de la cifra y queda demasiado apagado: la cifra `2.6rem` flota sin contexto legible. | **MEDIUM** | Label → `--color-text-on-deep` sólido (cream). Mantiene el tier soporte pero legible; la cifra sigue siendo protagonista por escala. |
| 8 | `contact.tsx` — columna de info (`<h2>` + 3 datos) vs columna de formulario (card blanca con sombra) | Sección de intención de conversión sin protagonista único: las dos columnas tienen peso visual casi idéntico (`grid-cols-2 gap-14`). El formulario — el elemento de conversión — no domina; la card blanca con sombra incluso compite con el `<h2>` de la izquierda. El visitante no sabe si la sección quiere que lea o que rellene. | **HIGH** | Declarar el formulario protagonista: o ensanchar la columna del form (`grid-cols-[5fr_7fr]`), o subir su elevación (`--shadow-card-raised`) y bajar el peso de la columna info (datos como soporte, no como bloque par). |
| 9 | `about-us.tsx` — `<h2>` `text-4xl md:text-5xl` (los `5xl` = ~48px) vs `--fs-h2` del sistema (`2rem`/32px) | Los `<h2>` de sección usan `text-4xl md:text-5xl` (36→48px) cuando la escala del sistema marca `--fs-h2` = 32px y `.text-h2` clampa a 28→32px. **Los `<h2>` están sobredimensionados ~16px respecto al sistema**, lo que comprime el delta visual contra el `<h1>` real del Hero (`clamp(2rem,4vw,3rem)` = 32→48px). H1 y H2 acaban en el mismo rango → la página pierde el escalón H1>H2. | **MEDIUM** | Alinear los `<h2>` a `.text-h2` (28→32px). Restaura el escalón descendente H1(32→48) > H2(28→32) y refuerza que el Hero es el titular de la página. |
| 10 | `about-us.tsx` — placa "Mariana" (`text-[1.75rem]` italic, `#962a1f`, en card con borde) junto al blockquote | El bloque tributo tiene dos elementos casi pares: la placa "Mariana" y el blockquote (`text-lg` italic). Ninguno está claramente subordinado al otro; y a su vez casi igualan al `<h2>` de sección. Tres elementos en zona de empate. Por tono homenaje el bloque debe tener presencia, pero necesita un orden interno. | **MEDIUM** | Definir orden dentro del bloque tributo: blockquote = protagonista del bloque (subir levemente o mantener), placa "Mariana" = soporte (es etiqueta de autoría, no titular). Mantener ambos por debajo del `<h2>` de sección. |
| 11 | `footer.tsx` — wordmark "Yaya Mariana" `text-[1.75rem]` vs headings de columna `text-xs` `/40` | Salto brutal entre el wordmark (28px) y los `<h4>` de columna (12px con opacidad 40%). No es un defecto de protagonista (el footer admite jerarquía plana) pero los `<h4>` `/40` son casi ilegibles — el tier de "encabezado de columna" desaparece. | **LOW** | Headings de columna → `.text-overline` con `--color-text-on-deep` a opacidad sólida reducida vía token, no `/40`. Recupera el tier de etiqueta. |
| 12 | `hero.tsx` — segunda línea de la cita (autor) `<p>` `clamp(1.1rem,2vw,1.4rem)` color `#7a4a42` | El autor de la cita (`— Yaya Mariana`) está en un color (`#7a4a42`) que no es token del sistema. Tier de atribución correcto en escala, pero color fuera de paleta — drift de coherencia. | **LOW** | Color del autor → `--color-text-secondary` (`#5a2a2a`). Mantiene el tier subordinado con color del sistema. |
| 13 | `products.tsx` — "Ver más" `text-xs font-semibold text-[#962a1f]/70` junto al precio | Acción secundaria "Ver más" con opacidad sobre texto (G-1) y, a `text-xs`, casi indistinguible del chip de trazabilidad. Quinto tier de ruido dentro de la tarjeta. | **LOW** | "Ver más" → color de marca sólido `--color-brand-primary`; valorar fundirlo con el botón "Añadir" para reducir a 1 acción por tarjeta (el botón ya lleva a conversión). |
| 14 | `cart.tsx` — header del drawer usa `<h2>` ("Tu cesta"); `checkout.tsx` summary usa `<h2>` ("Resumen del pedido") | El `<h2>` del drawer Cart es correcto semánticamente como heading de un dialog, pero a nivel de página single-page convive con los `<h2>` de sección sin ser parte del flujo del documento. No es defecto de jerarquía visual (el drawer es overlay) — se anota como cross-check para `accessibility-perfectionist` (contradicción C-h2cart de Fase 2.5). | **LOW** | Sin acción de jerarquía visual. Confirmar con `accessibility-perfectionist` que el drawer lleva `role="dialog"`+`aria-labelledby` (ya pendiente como M7) — eso aísla el `<h2>` del outline de página. |

**Recuento por severidad:** 2 CRITICAL · 4 HIGH · 4 MEDIUM · 4 LOW = **14 issues**.

---

## Reading path check

- **Hero (Z-pattern):** top-left logo OK · top-right idioma+CTA "Ver tienda" OK · diagonal **lands en empate** entre la cita `<h1>` y la placa de variedades → la mirada zig-zaguea pero el punto de fijación de la diagonal no es inequívoco (Issue #3) · bottom-right: el CTA primario "Ver fresas" está abajo-izquierda, no abajo-derecha — para un Z-pattern el CTA de conversión debería caer abajo-derecha. **PARCIAL FAIL** — la diagonal compite y el CTA no aterriza en el punto de conversión del patrón.
- **StatsStrip:** banda de 4 ítems pares, sin camino — correcto.
- **Products (F-pattern):** header centrado top → filtros → grid. Barrido por filas OK. Primer punto de fijación = `<h2>` "Nuestras fresas". **PASS** a nivel sección.
- **AboutUs (F-pattern):** top-left eyebrow → `<h2>` → cuerpo → bloque tributo → CTA. Borde izquierdo ancla la columna. **PASS**, con la salvedad del Issue #10 (empate en el bloque tributo).
- **Values (F-pattern):** header centrado → grid 6. **PASS**.
- **CTA (centrado):** eyebrow → `<h2>` → subtítulo → 2 botones → cold-chain → trust badges. Eje central, lectura descendente limpia. **PASS** — el `<h2>` gana el squint.
- **Contact (F-pattern 2-col):** la columna info ancla la izquierda, el form la derecha. El camino no resuelve a un protagonista (Issue #8) → el ojo no sabe a cuál de las dos columnas comprometerse. **FAIL**.
- **Footer:** grid 4-col, lectura por columnas — admite patrón plano. **PASS**.

**Above-the-fold (secciones de conversión):**
- Hero: `<h1>` + CTA "Ver fresas" caen en el primer viewport en desktop (`min-h-[calc(100vh-72px)]`). OK. En móvil, la columna apila y la placa de variedades empuja el CTA — verificar que "Ver fresas" no caiga bajo el pliegue en viewports cortos (≤700px de alto).
- Contact: `<h2>` + primer campo del form visibles. OK.

---

## 70/20/10 weight check (por sección)

| Sección | Reparto medido (squint) | Veredicto |
|---------|--------------------------|-----------|
| **Hero** | cita `<h1>` ~45% / placa variedades ~40% / CTA+eyebrow ~15% | **INVERTIDO/EMPATE** — el protagonista debería ser ~70%; aquí cita y placa casi se reparten 45/40. Issue #3. |
| **StatsStrip** | 4 cifras ~70% (17.5% c/u) / iconos ~18% / labels ~12% | PASS — la cifra domina cada celda, label apagado por opacidad lo refuerza por accidente (corregir vía Issue #7 sin invertir el reparto). |
| **Products** | grid tarjetas ~72% / header ~20% / filtros ~8% | PASS a nivel sección. Intra-tarjeta: imagen ~55% / nombre ~15% / precio ~15% / botón ~10% / desc+chip ~5% → **nombre y precio empatados** (Issue #5). |
| **AboutUs** | `<h2>`+cuerpo ~60% / bloque tributo ~32% / CTA ~8% | BORDERLINE — el bloque tributo a 32% roza el límite de "soporte"; aceptable por tono homenaje pero vigilar. |
| **Values** | grid 6 tarjetas ~75% / header ~20% / — ~5% | PASS. |
| **CTA** | `<h2>` ~55% / botones ~25% / badges+cold-chain ~20% | PASS — protagonista claro, soporte y ambiente bien escalonados. |
| **Contact** | columna info ~48% / formulario ~48% / eyebrow ~4% | **EMPATE** — ningún elemento alcanza el 70%. El formulario (conversión) debe ser protagonista. Issue #8. |
| **Footer** | 4 columnas ~equireparto + wordmark | PASS — jerarquía plana admitida en footer. |

---

## Component anatomy violations

- **ProductCard** (`products.tsx`) — Orden canónico: imagen → nombre → precio → botón comprar. Orden visual real: imagen → **precio≈nombre** → descripción → chip → "Ver más" → botón. El nombre (`1.25rem` regular serif) no domina sobre el precio (`text-lg` 18px **bold**); el peso bold del precio compite con la escala del nombre. Además 5 tiers de texto en el cuerpo de la tarjeta (nombre, descripción, chip, precio, "/500g", "Ver más") cuando el máximo es 3. → **Fix:** nombre a `.text-h3` (delta ≥6px sobre precio); colapsar a 3 tiers (nombre / precio+botón / descripción+chip). Ver Issue #5 y #13.

- **Hero** (`hero.tsx`) — Orden canónico: headline → sub-headline → CTA primario → visual. Orden visual real: headline ↔ **visual (placa) empatados** → sub-headline → CTA. El visual (placa de variedades) no está subordinado al headline. → **Fix:** demotar la placa (Issue #3).

- **Form / Contact** (`contact.tsx`) — Orden canónico: label → input → helper → submit. El formulario en sí está bien construido (label `text-xs` → input → submit dominante full-width). La violación no es intra-form sino de sección: el form no domina su sección (Issue #8). El botón submit SÍ es protagonista dentro del form — PASS intra-componente.

- **Testimonial / blockquote AboutUs** (`about-us.tsx`) — Orden canónico: cita → atribución → rol → foto. Aquí: placa "Mariana" (slot de retrato/etiqueta) ↔ cita casi pares. La atribución (`footer` `text-sm`) sí está subordinada — OK. La placa, que ocupa el rol de "foto/retrato", no debe pesar tanto como la cita. → **Fix:** Issue #10.

- **Nav** (`hero.tsx`) — Orden canónico: logo → nav → CTA. PASS — logo top-left, links centrales en negro, CTA "Ver tienda" en rojo sólido domina como acción primaria; idioma como acción terciaria de bajo peso. Anatomía correcta.

- **Cart drawer** (`cart.tsx`) — PASS — `<h2>` título → lista de ítems → subtotal → botón checkout (full-width, gradiente, protagonista de acción). Anatomía correcta.

---

## Intentional exceptions (no marcadas como defecto)

- **Hero: la cita en Playfair italic es el único `<h1>` de la página** — decisión ratificada (Fase 2.5 H6 / C-h1; brief de esta auditoría). Verificado: el repo tiene exactamente un `<h1>` en la home (`hero.tsx:278`). Los `<h1>` de `checkout.tsx` están en una ruta separada (`/checkout`) — correcto, una página, un `<h1>`. **No es defecto.** El tratamiento como cita-titular es coherente con el tono homenaje.
- **StatsStrip sin protagonista único** — 4 cifras de peso par es el patrón canónico de una banda de estadísticas; no se exige un protagonista. **No es defecto.**
- **Footer con jerarquía plana** — el footer admite reparto equilibrado de columnas. **No es defecto** (el Issue #11 es solo legibilidad del tier de encabezado, no protagonismo).
- **AboutUs — bloque tributo con presencia alta (~32%)** — el tono homenaje (HARD RULE) justifica que el recuerdo de Mariana tenga peso. Se marca BORDERLINE, no FAIL: el bloque puede conservar presencia, pero necesita orden interno (Issue #10). No se escala como competencia de protagonista mientras se mantenga por debajo del `<h2>`.

---

## Hallazgo transversal — para el director

La causa raíz del 80% de los issues de esta auditoría es **una sola**: el design system de Fase 3 se entregó como `globals.css` tokenizado pero **los componentes nunca se migraron a él**. La escala `--fs-*`, las utilidades `.text-*` y la regla G-1 (anti-opacidad) existen en CSS pero el código de componente sigue en el estado pre-Fase-3 (tamaños Tailwind sueltos + texto con opacidad). Esto excede el mandato puro de `hierarchy-master` (afecta a color, contraste y tokens — territorio de `typography-master`, `design-system-manager` y `accessibility-perfectionist`), pero **es la palanca de jerarquía nº1**: sin migración, la escala que haría legible el orden de importancia simplemente no se renderiza. Recomendación al director: tratar la migración componentes→design-system como un work item de Fase 4 previo a cualquier ajuste fino de jerarquía. Issues #1 y #2 son ese trabajo.

---

## Status

**FAIL — 5.5 / 10 vs umbral 8.5.** Correcciones obligatorias antes de que `visual-perfection` audite.

Bloqueantes (deben cerrarse para subir de 6.0):
- Issue #1 (CRITICAL) — aplicar la escala tipográfica del design system a los componentes.
- Issue #2 (CRITICAL) — eliminar opacidad sobre texto (G-1); tokens sólidos.

Tras cerrar los 2 CRITICAL, los 4 HIGH (#3 Hero placa, #4 contraste `<h1>`, #5 anatomía ProductCard, #8 Contact sin protagonista) son la siguiente tanda — esperada subida a ~8.0–8.5. Los MEDIUM/LOW son pulido de coherencia.

## Handoff

- **→ iteration-agent:** aplicar Issues #3–#13 como reescrituras concretas (tamaño/peso/color/posición ya especificados por archivo en la tabla). Issues #1 y #2 requieren coordinación con `typography-master` + `design-system-manager` (migración de escala) y `accessibility-perfectionist` (G-1 / contraste) — no son reescrituras de una sola línea.
- **→ visual-perfection:** este FAIL capa la fila de jerarquía de tu score global. No audites hasta que los 2 CRITICAL estén cerrados y re-puntuados por `hierarchy-master`. El conflicto DSM-1 (decoración MeshGradient) que se te difirió interactúa con el Issue #4 — el contraste del `<h1>` depende del shader.
- **→ director:** decisión necesaria — la migración componentes→design-system (Issues #1/#2) es trabajo de Fase 4 no completado, no un defecto cosmético de Fase 4.5. Recomiendo gate de Nil para autorizar esa migración como pre-requisito antes de continuar el pase de QA visual.

---

## Audit log entry (para `hierarchy-master-memory.md` — pendiente de persistir por el director)

- **Yaya Mariana — site-wide — 2026-05-22 — score 5.5/10 — FAIL.**
  - Focal-point issues: Hero cita↔placa de variedades empatados (HIGH); Contact info↔form sin protagonista (HIGH); ProductCard nombre↔precio empatados intra-tarjeta (HIGH).
  - **Nuevo modo de fallo descubierto:** "design system entregado pero no migrado" — la escala tipográfica y la regla anti-opacidad viven en `globals.css` pero los componentes siguen pre-sistema. Detección temprana: en el primer barrido, comparar los tamaños/colores usados en componentes contra las utilidades `.text-*` del `globals.css`; si los componentes hardcodean tamaños Tailwind en vez de las utilidades del sistema, la jerarquía declarada no es la renderizada. Promover a check duro.
  - **Patrón sector DTC artesanal/homenaje:** hero = cita-led (no headline transaccional, no photo-led) — válido y coherente con el registro homenaje, siempre que el visual de soporte (placa/foto) quede demotado por debajo del 70/20/10. Registrar junto al patrón restaurante-herencia de La Nonna.
  - Sin overrides de Nil aún — no hay excepciones aprobadas que registrar.
</content>
</invoke>
