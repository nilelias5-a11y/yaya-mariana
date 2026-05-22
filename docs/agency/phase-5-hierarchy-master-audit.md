# FASE 5 — Auditoría de Jerarquía Visual · Yaya Mariana
## Entregable del agente `hierarchy-master` — Director de Arte Editorial del Camino Visual

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE a la abuela de Nil
**Rama:** `clasico` · **Modo:** AUDIT (solo detección y propuesta — no se modifica código ni memoria de agencia)
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page + `/checkout`
**Fecha:** 2026-05-22
**Auditado:** `src/components/ui/*.tsx` (12 componentes), `src/app/globals.css`, `src/app/page.tsx`, `src/i18n/translations.ts`
**Fase:** 5 (Optimización) — re-auditoría de jerarquía con foco en el TEXTO
**Referencia previa:** `phase-4.5-hierarchy-recheck-tanda3.md` — score 8.5/10 PASS (en el límite)
**Input prioritario de Nil (PRIORIDAD ALTA):** «El texto en general necesita pulido.»

---

## Hierarchy Audit — Yaya Mariana — Site-wide · Foco TEXTO

**Reading pattern in use:**
- **Hero:** Z-pattern — logo top-left, idioma+CTA top-right, diagonal a la cita `<h1>`, CTA al final. Correcto para hero esparcido a 2 columnas.
- **StatsStrip:** banda de ritmo de 4 ítems paralelos — sin patrón de lectura (intencional).
- **Products / Values:** F-pattern — header centrado, barrido horizontal por filas del grid de tarjetas.
- **AboutUs:** F-pattern — columna única `.container-prose` (720px), lectura vertical anclada a la izquierda.
- **CTA:** eje central simétrico — patrón centrado (válido para banda de cierre).
- **Contact:** F-pattern 2-col — info izquierda (5fr), formulario derecha (7fr).
- **Footer:** grid 4-col, lectura por columnas.

**Typographic scale ratio (design system Fase 3):** `--fs-*` declara overline 11px · caption 12px · sm 13px · body 15px · body-lg 17px · h4 20px · h3 24px · h2 32px · h1 40px · display 48px. Ratios nominales **1.25–1.333** — escala limpia y descendente. **Estado de aplicación: APLICADA** en los headings de las 7 secciones de la home (confirmado desde la TANDA 3). El defecto raíz de Fase 4.5 ("design system no migrado") sigue cerrado — no hay regresión.

**Coherence score: 8.4 / 10**   **Threshold: 8.5**   →   **FAIL (marginal, −0.1)**

> El score baja una décima respecto al 8.5 de la TANDA 3. No es una regresión de código: es el resultado de **mirar el texto con la lupa que pidió Nil**. La TANDA 3 verificó que la escala estaba *aplicada* (sí lo está) y que cada sección tiene *un protagonista* (sí lo tiene). Esta auditoría de Fase 5 mira un nivel más fino — line-heights, longitud de línea (measure), coherencia de tier entre secciones equivalentes, el escalón h3/h4, la mezcla de utilidad de sistema con literales Tailwind sueltos en los tiers inferiores — y ahí el texto **aún no está pulido**. La jerarquía macro PASA; la jerarquía fina del cuerpo y los sub-tiers tiene 9 issues reales que, juntos, son exactamente la sensación que Nil describe. Ninguno es CRITICAL; ninguno bloquea por sí solo. El conjunto sí justifica una tanda de pulido tipográfico antes de cerrar Fase 5.

---

## DIAGNÓSTICO DEL INPUT DE NIL — "el texto necesita pulido"

La queja de Nil, traducida a jerarquía tipográfica fina, tiene cuatro causas mecánicas concretas y medibles:

1. **El tier de "cuerpo" no está estandarizado — hay dos formas de escribir el mismo nivel.** La escala del sistema publica `.text-body` (15px / line-height 1.65) y `.text-body-lg` (17px / 1.6). Pero NINGÚN componente usa `.text-body`. En su lugar, los subtítulos de sección y los párrafos del cuerpo se escriben a mano con `text-[0.9375rem]` + `leading-relaxed` (Products, Values, AboutUs, Contact, CTA). El valor numérico coincide con `--fs-body` (15px = 0.9375rem), pero **el `line-height` no**: `.text-body` del sistema clava 1.65; `leading-relaxed` de Tailwind es 1.625. Y las descripciones de tarjeta usan `text-sm` (la utilidad **del sistema**, 13px/1.6) mientras los subtítulos usan el literal de 15px. Resultado: el tier de cuerpo no es un tier, es una nube de valores cercanos. Esa inconsistencia de interlineado y de tamaño entre bloques que deberían leerse idénticos es lo que hace que el texto "no termine de asentar". → Issues #1, #2.

2. **El escalón h3 → h4 está comprimido y, en Values, mal asignado.** `.text-h3` clampa 22→24px; `.text-h4` es 20px fijo. El delta en el extremo inferior del clamp es de solo **2px** (22 vs 20) — por debajo del mínimo de 6px de la regla de escala. Peor: Values usa `.text-h4` (20px) para el título de cada tarjeta de beneficio, mientras que el ProductCard usa `.text-h3` (22-24px) para el suyo. **Dos grids de tarjetas equivalentes, dos tiers distintos para el mismo rol** ("título de tarjeta"). El visitante que baja de Products a Values percibe que los títulos "se encogen" sin motivo jerárquico. → Issues #3, #4.

3. **Líneas largas y descontroladas: la medida (measure) no está gobernada.** Los párrafos de AboutUs viven en `.container-prose` (720px) **sin `max-w` propio**: a 15px, una línea de 720px arrastra ~95–105 caracteres por línea — muy por encima del rango de lectura cómoda (45–75, ideal 66). En la sección más solemne y más leída del sitio (el relato del homenaje), las líneas son demasiado largas y el ojo se pierde al volver al margen izquierdo. En cambio Products/Values/CTA limitan su subtítulo con `max-w-md` (~28rem) — coherente pero distinto del de AboutUs, que no limita nada. La medida es ad-hoc, sección a sección. → Issue #5.

4. **Demasiados literales tipográficos sueltos en los tiers inferiores, y dos colores de texto fuera de paleta.** Pesos, tamaños y colores de los tiers caption/overline aún se escriben con literales Tailwind (`text-xs`, `text-[0.65rem]`, `text-[0.6875rem]`, `text-[0.72rem]`, `text-[0.8125rem]`) en vez de las utilidades del sistema (`.text-caption`, `.text-overline`, `.text-sm`). Y el eyebrow + `<em>` del CTA usan el literal de color `#f5c6c2`, y la línea de tributo del Footer `#e8c4bf` — colores de texto sobre elemento de jerarquía que no son tokens del sistema. El "ruido" no es de los protagonistas (los `<h1>`/`<h2>` están limpios); es de los sub-tiers, donde se acumulan 6-7 maneras distintas de declarar lo mismo. → Issues #6, #7, #8.

**Conclusión del diagnóstico:** Nil ya no ve un problema de jerarquía *aplastada* (eso era Fase 4.5 y está resuelto — los protagonistas saltan a la vista). Lo que ve en Fase 5 es un problema de **acabado tipográfico fino**: el tier de cuerpo no está estandarizado, el escalón h3/h4 está comprimido, la medida no está gobernada y los sub-tiers acumulan literales sueltos. El sitio "se ve bien de lejos y desordenado de cerca". La corrección de máximo apalancamiento es **una tanda de normalización del tier de cuerpo + sub-tiers**: migrar a `.text-body`/`.text-caption`/`.text-overline`, abrir el escalón h3/h4, gobernar la medida con un `max-w` consistente. Es pulido — no rediseño.

---

## Per-section protagonist check

| Sección | Protagonista previsto | Ganador visual real | Estado | Δ vs TANDA 3 |
|---------|----------------------|---------------------|--------|--------------|
| **Nav** | CTA "Ver tienda" | CTA "Ver tienda" (rojo sólido vs links negros) | PASS | = |
| **Hero** | Cita `<h1>` Playfair italic | Cita `<h1>` (placa de variedades demotada a soporte) | PASS | = |
| **StatsStrip** | Las 4 cifras (`clamp(2rem,6vw,2.6rem)` serif) | Las 4 cifras | PASS — banda sin protagonista único por diseño | = |
| **Products** | Grid de tarjetas de producto | Grid de tarjetas | PASS sección · PASS intra-tarjeta (nombre `.text-h3` domina) | = |
| **AboutUs** | El `<h2>` titular + el relato | El `<h2>` + relato (blockquote subordinado) | PASS — con la salvedad de la measure (Issue #5) | = |
| **Values** | Grid de 6 tarjetas de beneficio | Grid de 6 tarjetas | PASS sección · BORDERLINE intra-tarjeta (título `.text-h4`, ver Issue #4) | = |
| **CTA** | El `<h2>` + botón "Comprar ahora" | El `<h2>` | PASS — banda oscura aísla bien | = |
| **Contact** | El formulario (conversión) | El formulario (columna 7fr + card con sombra) | PASS | = |
| **Footer** | Navegación / wordmark | Reparto plano 4-col | PASS — footer admite jerarquía plana | = |
| **Cart (drawer)** | Lista de ítems + botón checkout | Botón checkout | PASS | = |

**Recuento:** 9 PASS · 1 BORDERLINE (Values intra-tarjeta) · 0 FAIL.

> A nivel de **protagonista por sección**, la jerarquía macro sigue sana — todas las secciones PASAN, como en la TANDA 3. El FAIL marginal de Fase 5 no viene de aquí; viene de la jerarquía **fina dentro de los tiers de soporte y ambiente**, que la tabla de issues detalla.

---

## Issues detected — foco TEXTO / jerarquía tipográfica fina

| # | Elemento / archivo | Problema | Severidad | Fix |
|---|--------------------|----------|-----------|-----|
| 1 | **Subtítulos de sección** — `products.tsx:471`, `values.tsx:53`, `about-us.tsx:29`, `contact.tsx:143`, `cta.tsx:34,116,144` — todos `text-[0.9375rem] leading-relaxed` | El tier de cuerpo se hardcodea con un literal en vez de usar `.text-body` del sistema. El tamaño (15px) coincide con `--fs-body` pero el `line-height` no: el literal hereda `leading-relaxed` (1.625) mientras `.text-body` clava 1.65. Siete bloques de cuerpo escritos "a ojo" en lugar del tier. La utilidad `.text-body` existe en `globals.css §5` y **no se usa en ningún sitio**. | **MEDIUM** | Migrar los 7 subtítulos/párrafos a `.text-body`. Un solo tier de cuerpo, un solo line-height. Elimina la nube de valores cercanos. |
| 2 | **Descripciones de tarjeta** — `products.tsx:361` (`text-sm`), `values.tsx:78` (`text-sm`) vs **subtítulos de sección** (15px, Issue #1) | Dos tamaños distintos para texto de cuerpo: la descripción de tarjeta usa `.text-sm` (13px) y el subtítulo de sección usa el literal de 15px. El delta de 2px entre dos roles de "cuerpo de lectura" no es un escalón jerárquico intencional — es drift. El cuerpo de la web no tiene un tamaño canónico. | **MEDIUM** | Decidir el tier: o las descripciones de tarjeta suben a `.text-body` (15px) igual que los subtítulos, o se documenta explícitamente que la descripción de tarjeta es tier `.text-sm` (13px) por densidad. Hoy es ambiguo. Recomendado: descripciones de tarjeta a `.text-body` — la tarjeta tiene sitio y el homenaje pide lectura cómoda, no densidad. |
| 3 | **Escala `.text-h3` vs `.text-h4`** — `globals.css:245-253` | `.text-h3` = `clamp(1.375rem, 2.5vw, 1.5rem)` (22→24px); `.text-h4` = `var(--fs-h4)` = 20px fijo. En el extremo bajo del clamp el delta h3↔h4 es **22−20 = 2px** — viola el mínimo de 6px de la regla de escala. El escalón entre los dos tiers de heading menores casi no se ve. | **MEDIUM** | Bajar `.text-h4` a `var(--fs-body-lg)` (17px) — abre el delta a 5–7px y respeta el ratio 1.25 (h3 22-24 / h4 17 ≈ 1.3-1.4). O, si h4 debe quedar en 20px, subir el suelo de `.text-h3` a `1.5rem` fijo (24px) → delta 4px, aún corto pero mejor. Territorio compartido con `typography-master`. |
| 4 | **`values.tsx:77`** — título de tarjeta de beneficio en `.text-h4` (20px) vs **`products.tsx:358`** — título de tarjeta de producto en `.text-h3` (22→24px) | Dos grids de tarjetas equivalentes (mismo rol visual: "título de tarjeta dentro de un grid 3-col"), dos tiers de heading distintos. El visitante que recorre Products → Values percibe que los títulos "se encogen" 2-4px sin razón jerárquica: Values no es menos importante que Products. Incoherencia de tier entre secciones equivalentes. | **MEDIUM** | Unificar: el título de tarjeta de Values sube a `.text-h3`, igual que el de ProductCard. Las dos tarjetas son el mismo componente conceptual — deben compartir tier de título. (Resuelve también el lado Values del escalón h3/h4.) |
| 5 | **`about-us.tsx:29`** — bloque de párrafos `p1`/`p2` dentro de `.container-prose` (720px) sin `max-w` propio | La measure (caracteres por línea) no está gobernada en la sección más leída del sitio. A 15px en 720px, los párrafos del relato arrastran ~95–105 caracteres/línea — muy por encima del rango cómodo (45–75, ideal ~66). En la sección de tono homenaje, donde se quiere lectura pausada, las líneas son demasiado largas y el retorno de carro pierde la siguiente línea. Contrasta con Products/Values/CTA, que sí limitan su subtítulo con `max-w-md` — pero AboutUs, que tiene MÁS texto, no limita nada. | **HIGH** | Limitar la columna de lectura de los párrafos de AboutUs a `max-w-[34rem]`/`max-w-prose` (~62-66ch a 15px). El `.container-prose` de 720px sirve para el ancho de sección (heading + bloque tributo a ancho completo); el cuerpo de párrafo necesita su propia medida más estrecha dentro de él. Es el issue de texto de mayor impacto perceptual. |
| 6 | **Eyebrows del CTA** — `cta.tsx:16` y `cta.tsx:125` — `text-overline text-[#f5c6c2]` · **`<em>` del título** — `cta.tsx:31,139` — `italic text-[#f5c6c2]` | El eyebrow usa correctamente la utilidad `.text-overline`, pero el color es un literal `#f5c6c2` fuera de la paleta tokenizada. El `<em>` del `<h2>` (un acento dentro del protagonista de la sección) también. Son nodos de texto con peso de jerarquía (tier etiqueta y acento de titular) pintados con un hex que el design system no publica. Residuo arrastrado desde Fase 4.5 (RM-1) — sigue abierto. | **MEDIUM** | Migrar a token. Requiere que `design-system-manager` cree primero `--color-accent-on-deep` (candidato cream-rosado sobre maroon). Hasta entonces el literal no rompe legibilidad (lee como variante de `--cream-300`) pero es deuda de coherencia de tier. Escalada, no fix de una línea. |
| 7 | **`footer.tsx:176`** — línea "En memoria de Mariana" — `font-serif italic text-[0.8125rem] text-[#e8c4bf]` | Doble drift en una sola línea de tributo: (a) tamaño con literal `text-[0.8125rem]` en vez de `.text-sm` (el valor 0.8125rem ES `--fs-sm`, pero escrito a mano); (b) color `#e8c4bf` fuera de paleta. Es la línea emocionalmente más cargada del sitio (el hilo del homenaje) y es la que más se aparta del sistema tipográfico. | **LOW** | Tamaño → `.text-sm`. Color → mismo token `--color-accent-on-deep` que el Issue #6 cuando exista. Mantener `font-serif italic` (tratamiento de tributo, correcto). |
| 8 | **Tiers caption/overline con literales** — `products.tsx:334` (`text-[0.65rem]`), `:368` (`text-[0.6875rem]`), `:380` (`text-xs`), `:384` (`text-xs`) · `cart.tsx:63` (`text-[0.65rem]`), `:143,:192` (`text-xs`), `:175` (`text-[0.65rem]`) · `contact.tsx:154,219,...` (`text-xs`) · `checkout.tsx:281` (`text-[0.72rem]`) | Los tiers más bajos (caption, micro-etiqueta, overline de badge) se declaran con ~5 literales distintos (`text-xs`, `text-[0.65rem]`, `text-[0.6875rem]`, `text-[0.72rem]`) en vez de las utilidades `.text-caption` (12px) / `.text-overline`. No rompe protagonista, pero es exactamente el "desorden de cerca": el mismo rol (chip, badge, helper, fine print) tiene 4-5 tamaños sutilmente distintos repartidos por la web. | **MEDIUM** | Normalizar el tier inferior: badge de variedad y chip de trazabilidad → `.text-overline` o `.text-caption`; helpers/fine print → `.text-caption`; "/500g", "×N", precios pequeños → `.text-caption`. Reducir 5 literales a 2 utilidades. Pulido de coherencia de sub-tier. |
| 9 | **`hero.tsx:333-346`** — `<h1>` (cita) `font-weight: 400` · **`about-us.tsx:25`** — `<h2>` `.text-h2` (`font-weight: 600` vía utilidad) | El `<h1>` de la página tiene peso 400 (regular) — es una cita en Playfair italic, tratamiento bespoke autorizado y coherente con el tono homenaje. Pero los `<h2>` de sección, vía `.text-h2`, son peso 600 (semibold). **El titular jerárquicamente superior de la página es más ligero en peso que los subordinados.** Lo compensan la escala (h1 32-48px > h2 28-32px) y el italic, así que el `<h1>` aún gana — pero el contraste de peso va en dirección contraria al orden de importancia. Tier de peso invertido entre H1 y H2 (mitigado, no roto). | **LOW** | No tocar el `<h1>` (la cita ligera italic es decisión de tono ratificada). Documentar como excepción intencional para que no se vuelva a marcar. Alternativa opcional, solo si `creative-director` lo aprueba: `<h1>` a peso 500 — añade autoridad sin perder la delicadeza de la cita. Mantener como LOW. |

**Recuento por severidad:** 0 CRITICAL · 1 HIGH · 6 MEDIUM · 2 LOW = **9 issues**.

---

## Reading path check

- **Hero (Z-pattern):** top-left logo OK · top-right idioma+CTA "Ver tienda" OK · diagonal aterriza limpiamente en la cita `<h1>` (la placa de variedades quedó demotada en Fase 4.5 — sin borde, nombres en tinta secundaria) · el CTA primario "Ver nuestras fresas" cae abajo-izquierda. **PASS con nota:** para un Z-pattern estricto el CTA de conversión idealmente cae abajo-derecha; aquí cae abajo-izquierda porque es un hero cita-led de 2 columnas con el contenido a la izquierda. Es coherente con el patrón cita-led del sector (registrado en memoria), no se marca como defecto.
- **StatsStrip:** banda de 4 ítems pares, sin camino — correcto.
- **Products (F-pattern):** header centrado → filtros → grid. Primer punto de fijación = `<h2>` "Nuestras fresas". **PASS.**
- **AboutUs (F-pattern):** eyebrow → `<h2>` → cuerpo → bloque tributo → CTA. El borde izquierdo ancla la columna. **PASS de camino**, pero la measure descontrolada (Issue #5) degrada la *calidad* del barrido F: líneas de ~100 caracteres hacen que el retorno al margen izquierdo falle el salto de línea. El camino es correcto; el confort de lectura sobre ese camino, no.
- **Values (F-pattern):** header centrado → grid 6. **PASS.**
- **CTA (centrado):** eyebrow → `<h2>` → subtítulo → 2 botones → cold-chain → trust badges. Eje central, lectura descendente limpia. **PASS** — el `<h2>` gana el squint.
- **Contact (F-pattern 2-col):** info ancla la izquierda (5fr), el form domina la derecha (7fr). **PASS.**
- **Footer:** grid 4-col, lectura por columnas. **PASS.**

**Above-the-fold (secciones de conversión):** Hero `<h1>` + CTA "Ver nuestras fresas" caen en el primer viewport (`min-h-[calc(100dvh-72px)]`). Contact `<h2>` + primer campo del form visibles. OK.

---

## 70/20/10 weight check (por sección) — squint test

| Sección | Reparto estimado (squint) | Veredicto |
|---------|----------------------------|-----------|
| **Hero** | cita `<h1>` ~68% / placa variedades ~22% / CTA+eyebrow ~10% | PASS — la cita domina; placa demotada a soporte. |
| **StatsStrip** | 4 cifras ~70% / iconos ~18% / labels ~12% | PASS — la cifra domina cada celda. |
| **Products (intra-card)** | imagen ~55% / nombre `.text-h3` ~22% / precio+botón ~15% / desc+chip ~8% | PASS — el nombre domina sobre el precio. |
| **AboutUs** | `<h2>`+cuerpo ~62% / bloque tributo ~30% / CTA ~8% | PASS de reparto. Nota: el cuerpo "pesa" más de lo debido por la measure larga (Issue #5) — no invierte la jerarquía, pero el bloque de párrafo se lee como una mancha más densa de lo necesario. |
| **Values (intra-card)** | icono ~25% / título `.text-h4` ~30% / descripción ~45% | **BORDERLINE** — el título a 20px y la descripción a 13px con 3-4 líneas hacen que la descripción acumule casi tanto peso de tinta como el título. Subir el título a `.text-h3` (Issue #4) restaura el 70/20/10 intra-tarjeta. |
| **CTA** | `<h2>` ~55% / botones ~25% / badges+cold-chain ~20% | PASS — protagonista claro, soporte y ambiente escalonados. |
| **Contact** | formulario ~58% / info ~38% / eyebrow ~4% | PASS — el formulario es el protagonista. |
| **Footer** | 4 columnas ~equireparto + wordmark | PASS — jerarquía plana admitida en footer. |

---

## Component anatomy violations

- **ProductCard** (`products.tsx`) — Orden canónico imagen → nombre → precio → botón: **RESPETADO.** Nombre `.text-h3` domina sobre precio `text-lg` (18px). 3 tiers perceptuales (nombre / precio+botón / descripción+chip+"/500g"+"Ver más"). PASS. Nota fina: dentro del tier-ambiente todavía conviven 4 tamaños de texto distintos (descripción `text-sm` 13px, chip `text-[0.6875rem]`, "/500g" `text-xs`, "Ver más" `text-xs`) — no rompe la anatomía de 3 tiers, pero es ruido de sub-tier (Issue #8).
- **ValueCard** (`values.tsx`) — Orden icono → título → descripción. El título `.text-h4` (20px) no domina con holgura sobre la descripción `text-sm` (13px) de 3-4 líneas: el delta de tamaño es correcto pero el volumen de tinta de la descripción casi lo iguala. **BORDERLINE** — subir el título a `.text-h3` (Issue #4) lo resuelve.
- **Hero** (`hero.tsx`) — Orden headline → sub-headline → CTA → visual: **RESPETADO.** La placa (visual) está subordinada al `<h1>`. PASS. Nota: el `<h1>` peso 400 vs `<h2>` peso 600 es un tier de peso invertido (Issue #9), mitigado por escala e italic.
- **Form / Contact** (`contact.tsx`) — Orden label → input → helper → submit: **RESPETADO.** Labels `text-xs` uppercase, inputs `text-base` (16px), submit dominante full-width. El form domina su sección. PASS.
- **Blockquote AboutUs** (`about-us.tsx`) — Orden cita → atribución, placa "Mariana" como etiqueta de soporte: **RESPETADO.** Blockquote `text-lg` italic en tinta primaria con barra lateral; placa "Mariana" `text-lg` italic en tinta de marca; atribución `text-sm` subordinada. PASS.
- **Cart drawer** (`cart.tsx`) — `<h2>` `font-serif text-xl` (drawer overlay, tolerado) → lista → subtotal → botón checkout full-width. Anatomía correcta. PASS.
- **Order summary** (`checkout.tsx`) — `<h2>` `font-serif text-lg` → líneas de ítem → total. PASS — el total en bold cierra bien la jerarquía del aside.

Ninguna violación de anatomía bloqueante. Los dos puntos finos (ValueCard borderline, ruido de sub-tier en ProductCard) están en la tabla de issues.

---

## Coherencia de tamaños entre secciones equivalentes — chequeo cruzado

Mirada explícita pedida por Nil ("¿cada tier es el correcto en cada sitio?"):

| Rol de texto | Products | Values | AboutUs | Contact | CTA | ¿Coherente? |
|---|---|---|---|---|---|---|
| Eyebrow | `.text-overline` | `.text-overline` | `.text-overline` | `.text-overline` | `.text-overline` | ✅ Sí — unificado en Fase 4.5. |
| Heading de sección | `.text-h2` | `.text-h2` | `.text-h2` | `.text-h2` | `.text-h2` | ✅ Sí. |
| Subtítulo de sección | `text-[0.9375rem]` | `text-[0.9375rem]` | — | `text-[0.9375rem]` | `text-[0.9375rem]` | ⚠️ Mismo valor, pero literal en vez de `.text-body`; line-height a la deriva (Issue #1). |
| Título de tarjeta | `.text-h3` (22-24px) | `.text-h4` (20px) | — | — | — | ❌ **No** — dos tiers para el mismo rol (Issue #4). |
| Descripción/cuerpo | `text-sm` (13px) | `text-sm` (13px) | `text-[0.9375rem]` (15px) | `text-[0.9375rem]` (15px) | `text-[0.9375rem]` (15px) | ❌ **No** — el cuerpo oscila 13↔15px según la sección (Issue #2). |
| Caption/micro-etiqueta | `text-[0.65rem]` / `text-[0.6875rem]` / `text-xs` | — | — | `text-xs` | `text-xs` | ⚠️ ~4 literales para el tier inferior (Issue #8). |

**Lectura:** los **tiers altos** (eyebrow, heading de sección) son perfectamente coherentes — la TANDA 3 hizo bien ese trabajo. La incoherencia está concentrada en los **tiers medios y bajos**: título de tarjeta, cuerpo y caption. Es exactamente el "pulido fino" que pide Nil, y es acotado: 3 roles de texto a normalizar.

---

## Anatomía de componentes — resumen de tiers

- **Hero:** H1 (cita 32-48px/400 italic) → autor (17-22px/400 italic) → CTA (14px/600) → placa de soporte (overline + 3 nombres 22-28px/400). 4 tiers, ordenados. La única nota es el peso 400 del H1 (Issue #9).
- **ProductCard:** nombre (h3 22-24px/600) → precio (18px/700) + botón (14px/700) → descripción (13px) + chip (11px) + "/500g" (12px) + "Ver más" (12px). 3 tiers de jerarquía, pero el tier-ambiente con 4 tamaños distintos (Issue #8).
- **ValueCard:** título (h4 20px/500) → descripción (13px). 2 tiers — título poco dominante (Issue #4).
- **Contact form:** label (12px/600 uppercase) → input (16px/400) → error (12px) → submit (14px/700). 4 tiers, ordenados.
- **CTA:** eyebrow (11px/600) → H2 (28-32px/600 italic) → subtítulo (15px) → botones (14px) → cold-chain + badges (12-13px). 5 tiers — al borde del máximo, pero ordenados.

---

## Intentional exceptions (no marcadas como defecto)

- **Hero: la cita en Playfair italic peso 400 es el único `<h1>` de la página.** Decisión de tono ratificada (Fase 2.5 H6; auditorías previas). La escala (32-48px) y el italic mantienen su dominancia pese al peso ligero. Se anota como excepción intencional (Issue #9 queda LOW solo como nota de coherencia, no como fix obligatorio).
- **StatsStrip sin protagonista único** — 4 cifras de peso par es el patrón canónico de una banda de estadísticas. No es defecto.
- **Footer con jerarquía plana** — el footer admite reparto equilibrado de columnas. No es defecto.
- **`cart.tsx` / `checkout.tsx` con headings `font-serif text-xl/lg/3xl`** — drawer overlay y ruta `/checkout` separada; no compiten en el outline visual de la home. Tolerado desde Fase 4.5.
- **AboutUs — bloque tributo con presencia alta (~30%)** — el tono homenaje justifica que el recuerdo de Mariana tenga peso; se mantiene subordinado al `<h2>`. No es defecto.

---

## Comparación con la TANDA 3 de Fase 4.5 — ¿por qué 8.5 → 8.4?

No es una regresión de código. Es un cambio de **profundidad de auditoría** pedido explícitamente por Nil:

- **TANDA 3 (8.5)** verificó la jerarquía **macro**: ¿está aplicada la escala? ¿tiene cada sección un protagonista? ¿está restaurado el escalón H1>H2? Todo eso PASA y sigue pasando — 0 regresiones.
- **Fase 5 (8.4)** mira la jerarquía **fina del texto**, el mandato de Nil: line-heights, measure, coherencia de tier entre secciones equivalentes, el escalón h3/h4, los literales de sub-tier. Ahí aparecen 9 issues que la TANDA 3 no tenía mandato de revisar (su alcance era el clúster C3: tokens + escala aplicada, no acabado fino).
- El medio punto que la TANDA 3 ya reconocía como pendiente ("el escalón h3/h4 de Values comprime levemente", "2 literales de color sin token") es justamente parte de lo que esta auditoría desarrolla y cuantifica. La TANDA 3 lo dejó como nota; Fase 5 lo convierte en tabla accionable.

El veredicto honesto: la web está a **una décima** del umbral, con 0 CRITICAL y 1 solo HIGH. No es un FAIL grave — es un "casi, falta el acabado". Cerrar los 9 issues (sobre todo #1, #4, #5) sube el score con holgura a ~9.0.

---

## Status

**FAIL marginal — 8.4 / 10 vs umbral 8.5** (TANDA 3 de Fase 4.5 fue 8.5 PASS en el límite).

No hay bloqueantes CRITICAL. El único HIGH es la **measure descontrolada de AboutUs (Issue #5)** — el issue de texto de mayor impacto perceptual y el de fix más barato (un `max-w`). Los 6 MEDIUM son normalización del tier de cuerpo (#1, #2), del escalón h3/h4 (#3, #4) y de los sub-tiers (#6, #8). Los 2 LOW son coherencia de detalle (#7, #9).

**Ruta de máximo apalancamiento para volver a PASS (≥8.5):**
1. **Issue #5** (HIGH) — gobernar la measure de AboutUs con `max-w`. Sube ~+0.2 por sí solo: es la sección más leída.
2. **Issues #1 + #2** (MEDIUM) — estandarizar el tier de cuerpo a `.text-body`. Cierra la "nube de valores cercanos".
3. **Issues #3 + #4** (MEDIUM) — abrir el escalón h3/h4 y unificar el título de tarjeta de Values a `.text-h3`.

Con esos 5 issues cerrados el score proyectado es **~9.0** — PASS con margen. Los restantes (#6/#7 dependen de un token nuevo de `design-system-manager`; #8 es pulido de sub-tier; #9 es nota de excepción) se difieren sin bloquear.

## Handoff

- **→ iteration-agent:** aplicar Issues #1, #2, #3, #4, #5, #8 como reescrituras concretas — tamaños/utilidades ya especificados por archivo y línea en la tabla. Son sustituciones de clase, no rediseño. Issue #5 (`max-w` en los párrafos de AboutUs) es el de mayor retorno y el más barato; priorizarlo.
- **→ typography-master:** Issue #3 (escalón `.text-h3`/`.text-h4` comprimido a 2px en el extremo del clamp) toca la definición de la escala en `globals.css §5` — es decisión de la escala, territorio compartido. Validar el fix propuesto (`.text-h4` → `--fs-body-lg` 17px) o proponer alternativa antes de que `iteration-agent` aplique #4.
- **→ design-system-manager:** Issues #6 y #7 necesitan el token `--color-accent-on-deep` (acento cream-rosado sobre maroon) — sigue pendiente desde Fase 4.5 (RM-1/RL-2). Sin ese token, `#f5c6c2` y `#e8c4bf` no tienen destino de migración. Crearlo desbloquea esos 2 issues.
- **→ visual-perfection:** la jerarquía pasa de 8.5 a 8.4 — un FAIL marginal, no un cap. Sin CRITICAL, la regla del techo no se activa; el impacto en tu fila de jerarquía es de una décima. Recomendable re-puntuar tras la tanda de pulido (#1-#5) antes de cerrar Fase 5.
- **→ director:** Fase 5 (Optimización) detecta que el input de Nil — «el texto necesita pulido» — es real y acotado: 9 issues de acabado tipográfico fino, 0 CRITICAL, 1 HIGH barato. Recomiendo autorizar una tanda de pulido tipográfico corta (estandarización del tier de cuerpo + measure de AboutUs + escalón h3/h4) y re-chequear. No requiere rediseño ni reabrir Fase 4.5.

---

## Audit log entry (para `hierarchy-master-memory.md` — pendiente de persistir por el director)

- **Yaya Mariana — site-wide — Fase 5 (Optimización) — 2026-05-22 — score 8.4/10 — FAIL marginal (−0.1).**
  - La jerarquía macro (protagonista por sección, escala aplicada, escalón H1>H2) sigue PASS sin regresión desde la TANDA 3 de Fase 4.5. El FAIL marginal es de jerarquía **fina del texto**, no macro.
  - **Nuevo modo de fallo descubierto:** "escala aplicada pero tier de cuerpo no estandarizado". La TANDA 3 verificó que las utilidades `.text-*` estaban aplicadas a los HEADINGS — y lo están. Pero el tier de CUERPO (`.text-body`) no se usa en ningún sitio: los párrafos se hardcodean con `text-[0.9375rem] leading-relaxed`, valor de tamaño correcto pero line-height a la deriva, y el cuerpo oscila 13↔15px entre secciones. Detección temprana: no basta con comprobar que los headings usan `.text-h*`; hay que comprobar que el cuerpo usa `.text-body`/`.text-sm`/`.text-caption` y no literales — la migración de Fase 4.5 cubrió headings, no cuerpo. Promover a check duro: "auditar el tier de cuerpo y los sub-tiers, no solo los headings".
  - **Patrón nuevo:** "coherencia de tier entre componentes equivalentes". Dos grids de tarjetas (Products, Values) usaban dos tiers distintos para el mismo rol "título de tarjeta" (`.text-h3` vs `.text-h4`). Detección: cuando dos secciones tienen el mismo componente conceptual (tarjeta en grid), verificar que el tier de cada elemento interno coincide — un título de tarjeta no debe cambiar de tier según la sección.
  - **Patrón nuevo (measure):** la columna de prosa (`.container-prose` 720px) gobierna el ancho de SECCIÓN, no la measure de PÁRRAFO. Un párrafo de cuerpo a 15px en 720px arrastra ~100 caracteres/línea. Regla: el cuerpo de párrafo necesita su propio `max-w` (~62-66ch), más estrecho que el contenedor de sección, aunque la sección ya sea estrecha.
  - Sin overrides de Nil que registrar en esta tanda. Issue #9 (H1 peso 400 < H2 peso 600) se deja como excepción intencional candidata — registrar si `creative-director` la ratifica.
</content>
</invoke>
