# FASE 4.5 — QA Visual · Auditoría de Espaciado
## Entregable del agente `spacing-perfectionist`

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE
**Branch:** `clasico` · **Modo: AUDIT** (detección + propuesta — CERO escritura en código)
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page
**Fecha:** 2026-05-22
**Input prioritario de Nil:** «La web se ve junta, mal distribuida, las cosas no están bien colocadas.»

---

## Spacing Audit — Yaya Mariana — Site-wide

**Spacing system in use:** mixto / incoherente — el design system de Fase 3 **declara** una escala base-4 (`--space-1…--space-24`, multiples 4·8·12·16·20·24·32·40·48·64·80·96) y un `--space-section-gap` de **80px**, pero **ningún componente la consume**. El espaciado real se escribe a mano con utilidades Tailwind crudas y literales `style={{}}`.

**Density register:** `confident-whitespace` — es el registro correcto y obligatorio para este sitio. La queja de Nil NO se resuelve compactando: se resuelve **distribuyendo** mejor el aire que ya existe y **subiendo** el ritmo entre secciones. El tono tributo exige aire generoso; hoy el sitio tiene aire insuficiente y, sobre todo, **aire desigual**.

**Coherence score: 4.8 / 10**   **Threshold: 8.5**   **Status: FAIL**

> El score < 5 porque: (a) hay **2 CRITICAL** — el sistema de espaciado de Fase 3 existe en `globals.css` pero está completamente desconectado del build, y el ritmo vertical entre secciones está roto en 3 puntos; (b) no hay un solo token de espaciado en uso, por lo que no existe "un sistema en el código", solo valores que coinciden por casualidad. Por la regla de calibración (un CRITICAL en token/ritmo de sección primaria capa coherencia a 6.0; aquí hay dos y además fallo sistémico), el score baja a 4.8.

---

## 0. DIAGNÓSTICO — por qué la web "se ve junta / mal distribuida"

La queja de Nil es correcta y tiene **cuatro causas mecánicas concretas**, todas de espaciado:

1. **El padding de sección es insuficiente para el registro tributo.** Todas las secciones de contenido usan `py-20` = **80px** arriba y abajo. Para un sitio `confident-whitespace` de homenaje, el suelo del rango es 96px y el techo razonable 128px (mi rúbrica: 96–128px desktop entre secciones mayores). 80px es el valor de un sitio comercial *compacto*, no de un homenaje. El sitio "respira" un 20–35% menos de lo que su tono pide. Esa es la sensación de "junto".

2. **El ritmo vertical es arrítmico — secciones hermanas con padding distinto.** StatsStrip usa `py-14` (56px), el resto `py-20` (80px), el Hero `pt-16 pb-20` (64/80), el Footer `pt-16 pb-8` (64/32). Al hacer scroll, el ojo recibe saltos de 56→80→80→80→80→64px. No es periódico. Un ritmo irregular se percibe exactamente como "mal distribuido" aunque cada sección por separado parezca bien.

3. **El contenido no se centra ni se ancha de forma consistente — los anchos de contenedor van a la deriva.** Conviven CINCO anchos máximos distintos: Hero sin `max-w` (full-bleed con solo `px`), `max-w-6xl` (1152px) en Products/Values/Contact/Footer, `max-w-5xl` (1024px) en StatsStrip, `max-w-2xl` (672px) en CTA, `max-w-[720px]` en AboutUs. El borde izquierdo del contenido salta de sección a sección. El sistema declara `--container-max: 72rem` y una utilidad `.container`, pero nadie la usa. Saltos de borde = "las cosas no están bien colocadas".

4. **Falta de jerarquía de espaciado dentro de las secciones.** El header de sección (eyebrow → título → subtítulo) usa `mb-3` (12px) entre eyebrow y título, `mt-3` (12px) entre título y subtítulo, y luego `mb-10`/`mb-12` (40/48px) hasta el contenido — pero el valor del bloque-a-contenido no es consistente (Products `mb-10`, Values `mb-12`). El header se pega visualmente al título porque 12px es poco salto desde un eyebrow de 11px. El bloque "no está bien colocado" respecto a la grid que le sigue.

**Qué lo arregla, en una frase:** conectar el sitio al sistema de espaciado que Fase 3 ya escribió — adoptar `.section`/`.container`, **subir `--space-section-gap` de 80px a 112px** (fluido `clamp` 80→112), normalizar StatsStrip/Hero/Footer al mismo ritmo, y unificar el ancho de contenido a `--container-max`. No hay que rediseñar nada; hay que **enchufar el sistema que ya existe**.

---

## 1. Sistema de espaciado en uso — hallazgo estructural

### 1.1 El sistema declarado (Fase 3 — `globals.css`)

`globals.css` define una escala base-4 completa y semánticos de espaciado:

```
--space-1..24  → 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 px
--space-section-gap   : var(--space-20)  → 80px
--space-container-pad : var(--space-6)   → 24px
--space-content-gap   : var(--space-4)   → 16px
--container-max       : 72rem            → 1152px
.section { padding-block: var(--space-section-gap); }
.container { max-width: var(--container-max); padding-inline: var(--space-container-pad); }
```

### 1.2 El sistema en uso (Fase 4 — componentes)

**Cero.** `grep` de `space-section`, `.section`, `.container`, `--space-` y `--container-max` en `src/components/ui/*.tsx` y `page.tsx`: **0 ocurrencias**. Ningún componente importa, aplica ni referencia un solo token de espaciado. Todo el espaciado se escribe:
- con utilidades Tailwind crudas (`py-20`, `gap-6`, `mb-10`, `px-6`…),
- o con literales inline (`style={{ padding: "10px 20px" }}`, `paddingTop: 13`, `gap: 80`).

**Consecuencia (regla G-4 del DSM + mi rúbrica de detección #8):** el design system de espaciado de Fase 3 es código muerto. El build "funciona" porque `py-20` *casualmente* coincide con `--space-section-gap` 80px — pero es coincidencia, no sistema. El próximo desarrollador no tiene una regla que seguir; tiene que adivinar. Esto es exactamente el fallo que mi rol existe para impedir.

### 1.3 Veredicto de sistema

El sitio NO tiene un sistema de espaciado coherente *en el código*. Tiene un sistema *en el documento de Fase 3* y un build que lo ignora. La escala Tailwind por defecto (que sí es base-4) salva el sitio de ser ruido total — la mayoría de valores caen en múltiplos de 4 — pero hay **off-system reales** (`py-3.5`=14px, `py-2.5`=10px en inputs, `gap-3.5`=14px) y, peor, **inconsistencia masiva entre elementos equivalentes**.

**Sistema que se debe enforce:** escala base-4 (la que Fase 3 ya declaró). No cambiarla. Hay que *conectarla*.

---

## 2. Issues detectados

> `Current` = valor real en el build. `Correct` = valor propuesto (snap al sistema base-4 de Fase 3, sesgado al múltiplo mayor por el registro confident-whitespace). NINGÚN cambio se ha escrito en código — esto es propuesta para el gate de Nil.

| # | Element / file | Current | Correct | Severity | Reason |
|---|----------------|---------|---------|----------|--------|
| 1 | Sistema de espaciado global — `globals.css` tokens vs `*.tsx` | tokens declarados, **0 en uso** | adoptar `.section`/`.container`/`--space-*` | **CRITICAL** | El design system de espaciado de Fase 3 está desconectado del build. No existe "sistema en el código" — regla G-4 + detección #8. Causa raíz de la queja de Nil |
| 2 | Ritmo vertical entre secciones (gap a la sección previa) | Hero `pt16/pb20` · Stats `py14` · Products/About/Values/Contact `py20` · Footer `pt16/pb8` | ritmo único: contenido `py` 112 (clamp 80→112) · bandas oscuras `py` 72 | **CRITICAL** | Secciones hermanas con padding distinto → scroll arrítmico. Detección #5. Es la causa #2 del "mal distribuida" |
| 3 | `--space-section-gap` token | `var(--space-20)` = **80px** | `clamp(5rem, 8vw, 7rem)` = 80→112px | **HIGH** | 80px está por debajo del rango confident-whitespace (96–128px desktop) para registro tributo. El sitio respira ~25% menos de lo que su tono exige |
| 4 | Ancho de contenedor de contenido | 5 valores: ninguno, `6xl`, `5xl`, `2xl`, `[720px]` | `--container-max` 72rem para secciones full-width; medidas editoriales declaradas para AboutUs/CTA | **HIGH** | Borde izquierdo del contenido salta sección a sección. Detección #2. Causa #3 del "mal colocadas". `.container` ya existe sin usar |
| 5 | StatsStrip — `section py-14` (56px) | 56px | 72px (banda oscura, ritmo unificado con CTA) | **HIGH** | Banda oscura de quiebre — única sección con 56px. Rompe el ritmo. Debe igualar a la otra banda oscura (CTA) |
| 6 | Hero — `pt-16 pb-20` (64 / 80) | top 64 · bottom 80 | top/bottom simétricos según ritmo (sección de apertura puede ir 96–112) | **HIGH** | Padding superior ≠ inferior sin razón declarada. Detección #5 (rhythm). El Hero es sección primaria |
| 7 | Footer — `pt-16 pb-8` (64 / 32) | top 64 · bottom 32 | top 72 (igual a bandas oscuras) · bottom 32 ok | **MEDIUM** | `pb-8`=32px es correcto para cierre de footer; `pt-16`=64px no encaja con el ritmo de bandas oscuras (72px). Asimetría aceptable solo en footer, pero el top debe alinearse |
| 8 | Header de sección — eyebrow→título gap | `mb-3` (12px) | `mb-4` (16px) | **MEDIUM** | 12px desde un eyebrow de 11px es salto corto: el título se "pega" al eyebrow. AboutUs ya usa `mb-4` — los demás (Products, Values, CTA) usan `mb-3`/`mb-4` mezclado |
| 9 | Header de sección — bloque→contenido gap | Products `mb-10` (40) · Values `mb-12` (48) | `mb-12` (48px) en ambos | **MEDIUM** | Dos secciones con grid de cards (Products, Values) separan el header de la grid con valores distintos. Detección #2 |
| 10 | Card padding — Products vs Values | Products body `p-5` (20px) · Values card `p-6` (24px) | `p-6` (24px) en ambos | **HIGH** | Dos tipos de card en el mismo registro con padding interno distinto. Mi rúbrica: card padding idéntico entre cards del mismo tier; 24px es el target confident-whitespace |
| 11 | Card grid gap — Products / Values | `gap-6` (24px) | 24px — correcto | LOW (PASS) | Ambas grids usan `gap-6`. Consistente y dentro de rango (24–32px). Sin acción |
| 12 | Contact grid gap | `gap-14` (56px) | `gap-12` (48px) | **MEDIUM** | 56px es off-system respecto al ritmo de 2-col; 48px (`--space-12`) es el múltiplo del sistema. Detección #1 |
| 13 | Contact — header subtítulo→info gap | `mb-10` (40px) | `mb-8` (32px) o `mb-12` (48px) | LOW | 40px aislado; aceptable pero no es el valor que usan los headers de grid (48px) |
| 14 | Botón Hero `#productos` — padding | `pt/pb 13px` `pl/pr 28px` | `py-3.5`→14px aún off; usar 12 o 16 vertical · 28→24 o 32 horiz. | **MEDIUM** | `13px` vertical es off-system (no múltiplo de 4). Detección #1. Botón de conversión primario |
| 15 | Botón Nav `Ver tienda` — padding | `padding: "10px 20px"` | 12px vertical (`--space-3`) · 20px ok | **MEDIUM** | `10px` vertical off-system. El CTA del nav y el CTA del hero (`13px`) **no comparten padding** — dos botones primarios deben coincidir. Detección #2 |
| 16 | Botón móvil `Ver tienda` (MobileNav) — padding | `padding: "11px 20px"` | 12px vertical · 20px ok | **MEDIUM** | `11px` vertical off-system. Tercera variante de padding para el mismo botón "Ver tienda" (nav 10px, hero 13px, móvil 11px) |
| 17 | Botón CTA `Comprar`/`Ver historia` — padding | `px-8 py-3.5` (32 / 14px) | `py-3` (12) o `py-4` (16) · `px-8` ok | **MEDIUM** | `py-3.5`=14px off-system (default shadcn-style heredado). Patrón recurrente de memoria. Estos 2 botones sí coinciden entre sí, pero con un valor off-system |
| 18 | Botón `Añadir` (ProductCard) — `py-3` | 12px | 12px — ok, pero ≠ botones hero/cta | LOW | `py-3`=12px es on-system; el problema es que NINGÚN otro botón primario usa 12px → 4 paddings de botón distintos en el sitio (10/11/12/14px) |
| 19 | Inputs Contact — `py-2.5` (10px) | 10px | 12px (`--space-3`) | **MEDIUM** | `py-2.5`=10px off-system. Además: input Contact `py-2.5`+`rounded-xl` vs input CTA `py-3`+`rounded-full` vs input checkout `py-3`+`rounded-xl` → 3 paddings de input distintos. Detección #1 + #2 |
| 20 | `ProductCard` body — `gap-3.5` (14px) | 14px | `gap-4` (16px) | **MEDIUM** | `gap-3.5`=14px off-system entre bloques del cuerpo de la card. Detección #1 |
| 21 | Hero columna izquierda — `gap-10 md:gap-0` | móvil 40px · desktop 0 | desktop: usar gap real, no `pr-10` en la columna | LOW | El grid 55/45 separa columnas con `md:gap-0` + `md:pr-10` en la columna izquierda (padding compensatorio en vez de gap). Funciona pero es un hack de espaciado; `gap` directo es el sistema |
| 22 | Hero — `min-h-[calc(100vh-72px)]` + `pt-16 pb-20` | viewport-height forzado | revisar: con `pt-16 pb-20` y min-h full puede sobrar aire vertical en desktop alto | LOW | No es defecto duro; verificar en 1280×900 que el bloque no quede flotando con orphaned whitespace (detección #4) |
| 23 | StatsStrip — `gap-y-10 gap-x-6` | 40 / 24 | mantener; on-system | LOW (PASS) | Ambos múltiplos de 8. Correcto |
| 24 | Footer — `gap-10` top row, `pb-12` border | 40 / 48 | on-system | LOW (PASS) | Correctos |
| 25 | Eyebrow Hero — línea decorativa `height: 80` | 80px | on-system (`--space-20`) | LOW (PASS) | Coincide con un token; sin acción |
| 26 | `body` line-height | 1.65 | 1.65 — correcto | — (PASS) | Dentro de rango 1.5–1.7. Buen valor para legibilidad cálida |
| 27 | `.text-body` / `.text-body-lg` line-height | 1.65 / 1.6 | correctos | — (PASS) | En rango |
| 28 | `.text-h1`/`h2`/`h3` line-height | 1.12 / 1.18 / 1.25 | correctos | — (PASS) | En rango headline 1.1–1.3 |
| 29 | Hero `<h1>` (la cita) — `lineHeight: 1.3` | 1.3 | 1.3 — aceptable | LOW (PASS) | Es Playfair italic display; 1.3 es alto para un h1 pero la cita es texto largo multi-línea → aceptable como excepción editorial |
| 30 | `.text-overline` letter-spacing | 0.18em | 0.18em | — (PASS) | Uppercase con tracking generoso — correcto (rúbrica: 0.05–0.1em mínimo; 0.18em es decisión editorial válida) |
| 31 | Eyebrows inline — `tracking-[0.18em]` / `letterSpacing:"0.22em"` | 0.18em (la mayoría) · 0.22em (Hero) | unificar a 0.18em | LOW | El eyebrow del Hero usa 0.22em; los demás 0.18em. Inconsistencia menor de tracking entre instancias del mismo elemento |
| 32 | Badge variedad (ProductCard) — `px-3 py-1` | 12 / 4px | on-system | LOW (PASS) | Múltiplos de 4. Correcto para un chip |

**Recuento por severidad:** 2 CRITICAL · 5 HIGH · 9 MEDIUM · 16 LOW (de los cuales 8 son PASS explícitos sin acción).
**Defectos accionables reales: 2 CRITICAL · 5 HIGH · 9 MEDIUM · 8 LOW = 24.**

---

## 3. Correcciones propuestas (NO aplicadas — modo AUDIT)

> Mi spec dice "corrige/reescribe"; el brief de Fase 4.5 lo anula: aquí solo se documenta como propuesta para el gate de Nil. Cada línea es un diff que `iteration-agent` podría aplicar sin preguntar, si Nil ratifica.

**Bloque A — Conectar el sistema (resuelve CRITICAL #1, #2 y la queja de Nil):**
- `globals.css` — `--space-section-gap: var(--space-20)` (80px) → `clamp(5rem, 8vw, 7rem)` (80→112px). Sube el ritmo a confident-whitespace fluido.
- `globals.css` — añadir `--space-section-gap-deep: clamp(3.5rem, 6vw, 4.5rem)` (56→72px) para bandas oscuras (StatsStrip, CTA), que llevan menos aire por diseño de quiebre.
- `about-us.tsx:10`, `contact.tsx:88`, `products.tsx:420`, `values.tsx:43` — sustituir `py-20` por `className="section"` (consume `--space-section-gap`).
- `cta.tsx:187`, `stats-strip.tsx:87` — usar `padding-block: var(--space-section-gap-deep)` (72px) en vez de `py-20` / `py-14`.
- `hero.tsx:256` — `pt-16 pb-20` → padding simétrico del ritmo (la sección de apertura puede ir al techo, 112px, o `pt`/`pb` iguales).
- `footer.tsx:94` — `pt-16` → `pt` 72px (igual a bandas oscuras); `pb-8` (32px) se mantiene — cierre de footer, asimetría aceptable y registrada.

**Bloque B — Unificar anchos de contenido (resuelve HIGH #4):**
- `products.tsx:428`, `values.tsx:44`, `contact.tsx:89`, `footer.tsx:95` — `max-w-6xl mx-auto` → `className="container"` (consume `--container-max` 72rem = 1152px, idéntico).
- `stats-strip.tsx:88` — `max-w-5xl` → decisión: o `container` (alinea el borde con todo lo demás) o registrar `max-w-5xl` como excepción intencional de banda. **Recomendación: alinear a `container`.**
- `about-us.tsx:11` `max-w-[720px]` y `cta.tsx:192` `max-w-2xl` (672px) — son **medidas editoriales legítimas** (columna de lectura estrecha para tributo / CTA centrado). Mantener, pero declararlas como token `--container-prose: 45rem` para que sean sistema, no literal. Registrar como excepción intencional (ver §6).

**Bloque C — Normalizar componentes (HIGH #10, MEDIUM #8,9,12,14-20):**
- `products.tsx:335` — card body `p-5` (20px) → `p-6` (24px), iguala a Values.
- `products.tsx:335` — `gap-3.5` (14px) → `gap-4` (16px).
- `products.tsx:430` `mb-10` → `mb-12`; `values.tsx:45` ya en `mb-12` — quedan iguales.
- Headers de sección — unificar eyebrow→título a `mb-4` (16px) en `products.tsx:432`, `values.tsx:46`, `cta.tsx` (los `mb-3`).
- `contact.tsx:89` — `gap-14` (56px) → `gap-12` (48px).
- Botones — definir UN token de padding de botón primario: `--btn-pad: 12px 24px` (o 16/32 para el hero). Aplicar a nav (`hero.tsx:224` `10px 20px`), hero CTA (`hero.tsx:315` `13px/28px`), MobileNav (`hero.tsx:139` `11px 20px`), CTA (`cta.tsx:43,52` `py-3.5`). Hoy: 4 paddings distintos para el mismo rol.
- Inputs — un token `--input-pad-y: 12px`. Aplicar a `contact.tsx` (`py-2.5`=10px → 12px). Unificar radius/padding de input entre Contact, CTA y checkout.

**Bloque D — Tracking (LOW #31):**
- `hero.tsx:270` eyebrow `letterSpacing: "0.22em"` → `0.18em`, iguala al resto.

---

## 4. Vertical rhythm check

**Baseline:** 4px (escala base-4 de Fase 3). La mayoría de valores caen en múltiplos de 4 — la escala Tailwind por defecto lo garantiza. **Excepciones off-baseline detectadas:** `py-3.5`/`gap-3.5` = 14px (#14,17,20), `py-2.5` = 10px en inputs (#19), `10px`/`11px`/`13px` en paddings de botón inline (#14,15,16). 14px y 10px no son múltiplos de 8 pero sí de 2 — fuera del baseline de 4px en el caso de 14px... no, 14 sí es par pero no múltiplo de 4. **14px y 10px rompen el baseline de 4px.** Snap a 12/16.

**Adjacent-section gap consistency: FAIL.** Secuencia real de padding vertical sección a sección:

```
Hero        pt 64  / pb 80     ← sección de apertura, asimétrica
StatsStrip  py 56              ← banda oscura — ROMPE (única con 56)
Products    py 80
AboutUs     py 80
Values      py 80
CTA         py 80              ← banda oscura, pero usa 80 ≠ StatsStrip 56  ← INCONSISTENTE
Contact     py 80
Footer      pt 64 / pb 32      ← cierre, asimétrico
```

Dos fallos de ritmo:
1. **Las dos bandas oscuras no coinciden** — StatsStrip `py-14` (56px) vs CTA `py-20` (80px). Elementos del mismo tipo (banda oscura de quiebre) con espaciado distinto → HIGH #5.
2. **El ritmo general es plano a 80px** cuando el registro pide 96–128px → el scroll se siente apretado de principio a fin (HIGH #3).

**Veredicto:** el ritmo NO es periódico. Es la causa mecánica directa de "se ve junta / mal distribuida". Tras aplicar Bloque A: contenido a 80→112px fluido, bandas oscuras a 56→72px fluido, Hero/Footer alineados → ritmo periódico de 2 niveles (contenido / banda), que es lo correcto.

---

## 5. Responsive check

> Dev server apagado a propósito — análisis estático de clases Tailwind, breakpoints y `clamp()`.

**Mobile (375px): HOLDS con reservas.**
- Padding de sección: `py-20` se aplica **idéntico en móvil** — 80px arriba y abajo en una pantalla de 375px es *demasiado* aire vertical proporcional, y a la vez el sistema declara que en móvil el rango es 64–80px. No hay override móvil de padding de sección en NINGUNA sección → el espaciado de sección es copy-paste desktop→móvil (viola "spacing fluido, no copy-pasteado", rúbrica responsive). No es "crush" (no se aplasta), es lo contrario: rigidez. La propuesta `clamp(5rem, 8vw, 7rem)` lo arregla — en 375px el término `8vw`=30px no domina, da ~80px, correcto; en desktop sube a 112px.
- Grids: Products/Values `grid-cols-1` en móvil con `gap-6` (24px) — correcto, sin crush.
- `px-6` (24px) lateral en móvil — correcto, no se aplasta el contenido contra el borde.
- Hero: `flex-col` con `gap-10` (40px) entre columnas en móvil — correcto.
- **Reserva:** Contact `gap-14` (56px) entre las 2 columnas se mantiene en móvil hasta el breakpoint `lg`; en `grid-cols-1` ese `gap` se vuelve gap vertical de 56px entre info y form — excesivo en móvil. Debería bajar.

**Tablet (768px): HOLDS con un fallo.**
- Products: `sm:grid-cols-2` activo a 640px → en 768px hay 2 columnas con `gap-6`. Correcto.
- Hero: a `md` (768px) pasa a `flex-row` 55/45. La columna izquierda lleva `md:pr-10` (40px) como separación — funciona pero es padding compensatorio, no gap (LOW #21).
- **Fallo:** Contact pasa a 2-col solo en `lg` (1024px), no en `md` — en 768px sigue 1-col con `gap-14`=56px vertical. Aceptable pero el `gap-14` sigue siendo off-system.
- Footer: `md:grid-cols-4` activo — 4 columnas en 768px con `gap-10` (40px). Apretado para 4 columnas en 768px pero no roto.

**Desktop (1280px): HOLDS — pero es donde más se nota la queja.**
- A 1280px el contenido se centra en anchos distintos por sección (6xl=1152, 5xl=1024, 2xl=672, [720px]) → el borde del contenido **baila** entre secciones. En 1280px hay 128px de margen lateral en Products (`(1280-1152)/2 + px-6`) pero ~280px en StatsStrip (`(1280-1024)/2`) y ~300px en CTA. El usuario percibe que "las cosas no están alineadas" — porque literalmente no lo están entre secciones. HIGH #4.
- Padding de sección 80px a 1280px: por debajo de lo que el ancho de viewport puede permitirse. Un sitio premium a 1280px respira 96–128px. 80px lo hace sentir "comercial / apretado".
- Hero `min-h-[calc(100vh-72px)]`: en 1280×800 ocupa toda la altura; con `pt-16 pb-20` el contenido puede quedar con aire desigual arriba/abajo (LOW #22).

**Conclusión responsive:** no hay *crush* móvil (el sitio no aplasta), pero **el espaciado es estático**: el mismo valor en 375 y 1280. Eso significa que está mal en los dos extremos a la vez — un poco generoso de más en móvil, claramente corto en desktop. `clamp()` en `--space-section-gap` es la corrección de una línea que resuelve ambos.

---

## 6. Intentional exceptions (not flagged / a registrar)

- **AboutUs `max-w-[720px]` y CTA `max-w-2xl` (672px)** — anchos de lectura estrechos. AboutUs es la única superficie Capa-B (tributo): una columna de texto estrecha es la decisión editorial correcta para una cita íntima — NO se normaliza a 1152px. CTA centrado estrecho concentra la conversión. Ambos son taste calls válidos. **Propuesta:** no eliminarlos, pero convertirlos de literal a token (`--container-prose`) para que sean *sistema*, no one-off. Si Nil ratifica, dejan de ser defecto.
- **Footer `pb-8` (32px) asimétrico** — el padding inferior reducido en el cierre de página es práctica estándar y correcta. Asimetría intencional; registrada, no flagged.
- **Bandas oscuras con menos padding que el contenido** — StatsStrip y CTA llevan menos aire vertical que las secciones claras a propósito (quiebre de ritmo). Esto es correcto; el defecto NO es que tengan menos, es que tienen *valores distintos entre sí* (56 vs 80). La propuesta las unifica a 72px, conservando la intención de "banda más compacta".
- **`.text-overline` tracking 0.18em** — uppercase con tracking amplio; decisión editorial del DSM, dentro de lo legítimo.
- **Hero `<h1>` line-height 1.3** — alto para un h1, pero es una cita Playfair italic multi-línea; 1.3 es legibilidad correcta para texto-cita largo. Excepción editorial aceptable.

> Ninguna decisión de `creative-director` en memoria justifica el ritmo plano de 80px ni los 5 anchos de contenedor — esos SÍ son defectos, no taste calls.

---

## 7. Severidad — resumen ejecutivo

| Severidad | Nº | Qué son |
|---|---|---|
| **CRITICAL** | 2 | (#1) sistema de espaciado de Fase 3 desconectado del build · (#2) ritmo vertical roto en 3 puntos |
| **HIGH** | 5 | (#3) section-gap 80px sub-tono · (#4) 5 anchos de contenedor · (#5) bandas oscuras desiguales · (#6) Hero asimétrico · (#10) card padding Products≠Values |
| **MEDIUM** | 9 | headers de sección inconsistentes · Contact gap-14 · 4 paddings de botón distintos · 3 paddings de input distintos · `gap-3.5` off-system |
| **LOW** | 8 | tracking eyebrow Hero · `pr-10` compensatorio · orphaned whitespace Hero · etc. |

**Coherence score: 4.8 / 10 — FAIL** (threshold 8.5).

Proyección tras aplicar Bloques A+B+C+D: estimado **8.7–9.0** — el sistema de Fase 3 ya está escrito y es correcto; conectarlo y normalizar las ~24 instancias es trabajo mecánico sin rediseño. El sitio está a un sprint de espaciado de pasar.

---

## 8. Status & Handoff

**Status:** **FAIL** — coherencia 4.8 < 8.5. Correcciones obligatorias antes de que `visual-perfection` cierre su fila de espaciado.

**Causa raíz única:** Fase 4 implementó los componentes sin consumir el sistema de espaciado que Fase 3 entregó. No es un fallo de diseño — es un fallo de *cableado*. El `globals.css` tiene `.section`, `.container`, `--space-*` y `--container-max` listos y nadie los enchufó.

**Handoff:**
- → **`visual-perfection`**: la fila "spacing" de tu auditoría queda **capada a ≤6.0** mientras el sistema no se conecte (regla de calibración: CRITICAL en token/ritmo de sección primaria). Los 2 CRITICAL son de cableado, no de gusto.
- → **`iteration-agent`** (tras gate de Nil): Bloque A es la prioridad — resuelve los 2 CRITICAL y la queja literal de Nil. Es ~8 sustituciones de `py-20`→`.section` + 1 cambio de token a `clamp()`. Bloque B son ~5 sustituciones `max-w-*`→`.container`. Bloque C/D son normalizaciones de instancia.
- → **`director` / gate de Nil**: decisión requerida sobre §6 — ¿se ratifican AboutUs/CTA como anchos editoriales tokenizados (`--container-prose`)? Y confirmación del salto de `--space-section-gap` 80→112px (fluido), que es lo que materialmente arregla "se ve junta".

**Una frase para Nil:** la web no está mal diseñada — está *desconectada de su propio sistema de espaciado*; tiene aire suficiente pero mal repartido y un ritmo plano y corto. Subir el respiro entre secciones a 112px, igualar las secciones hermanas y unificar el ancho del contenido lo arregla sin tocar el diseño.

---

*Auditoría estática · dev server apagado por diseño · modo AUDIT — cero archivos de código modificados · cero archivos de memoria de la agencia modificados.*
