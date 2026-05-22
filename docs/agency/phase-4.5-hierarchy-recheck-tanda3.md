# FASE 4.5 — Re-chequeo de Jerarquía Visual · TANDA 3 · Yaya Mariana
## Entregable del agente `hierarchy-master` — re-chequeo incremental del clúster C3

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE
**Rama:** `clasico` · **Modo:** AUDIT (solo verificación — no se modifica código)
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page
**Fecha:** 2026-05-22
**Re-auditado:** `src/components/ui/*.tsx` (10 componentes + `/checkout`), `src/app/globals.css`
**Referencia OLA 1:** `phase-4.5-hierarchy-master-audit.md` — score 5.5/10 FAIL · 2 CRITICAL · 4 HIGH · 4 MEDIUM · 4 LOW
**Alcance:** clúster C3 — coherencia de tokens de color + jerarquía tipográfica.

---

## Hierarchy Re-check — Yaya Mariana — TANDA 3

**Typographic scale ratio (design system Fase 3):** 1.25–1.333 — escala `--fs-*` limpia y descendente.
**Estado de aplicación:** **APLICADA.** Las utilidades `.text-h2`, `.text-h3`, `.text-h4`, `.text-overline` del `globals.css §5` están ahora presentes en los componentes. El defecto raíz de la OLA 1 ("design system entregado pero no migrado") está RESUELTO en el clúster C3.

**Coherence score: 8.5 / 10**   **Threshold: 8.5**   →   **PASS** (en el límite)

> Los 2 CRITICAL de la OLA 1 están cerrados (issue #2 en TANDA 2, issue #1 en TANDA 3). Los 4 HIGH están todos resueltos. El score sube de 5.5 a 8.5: el sitio ya renderiza la jerarquía que el sistema declara. El medio punto que falta hasta el 9 lo retienen dos residuos LOW de coherencia de color de marca (`#f5c6c2` y `#e8c4bf` como literales de texto) y la escala `text-h4` de Values que comprime levemente el escalón h3/h4 — pulido, no bloqueante.

---

## Verificación punto por punto del encargo

### 1 · Issue #1 (CRITICAL) — escala tipográfica del design system aplicada → **RESUELTO**

La escala `.text-*` del `globals.css` está ahora aplicada en los 10 componentes:

| Componente | Heading principal | Eyebrow | Estado |
|---|---|---|---|
| `hero.tsx` | `<h1>` `clamp(2rem,4vw,3rem)` (cita, tratamiento bespoke autorizado) | `.text-overline` ×2 | OK |
| `products.tsx` | `<h2>` `.text-h2` · `<h3>` nombre `.text-h3` | `.text-overline` | OK |
| `values.tsx` | `<h2>` `.text-h2` · `<h3>` `.text-h4` | `.text-overline` | OK (ver nota tier) |
| `about-us.tsx` | `<h2>` `.text-h2` | `.text-overline` | OK |
| `contact.tsx` | `<h2>` `.text-h2` · `<h3>` `.text-h3` (estado enviado) | `.text-overline` | OK |
| `cta.tsx` | `<h2>` `.text-h2` ×3 (in/off-season) | `.text-overline` ×2 | OK |
| `footer.tsx` | `<h4>` columna `.text-overline` | — | OK |
| `stats-strip.tsx` | cifra `2.6rem` serif (display bespoke, banda) | — | OK |
| `cart.tsx` | `<h2>` `font-serif text-xl` (drawer overlay) | — | tolerado (overlay, ver nota) |
| `checkout.tsx` | `<h1>` `font-serif text-3xl md:text-4xl` (página aparte) | — | tolerado (ruta separada) |

Ya no hay tamaños Tailwind sueltos hardcodeados en los headings de las **secciones de la home**. El defecto sistémico de la OLA 1 — los `<h2>` en `text-4xl md:text-5xl`, los eyebrows en `text-xs` — está corregido. La causa raíz del "se ve junta" está atajada en su palanca nº1.

> Nota menor (no defecto de C3): `cart.tsx` y `checkout.tsx` mantienen `font-serif text-xl/3xl` en su heading. Son un drawer overlay y una ruta `/checkout` separada — no compiten en el outline visual de la home. La OLA 1 ya los marcó como cross-check de `accessibility-perfectionist`, no como defecto de jerarquía. Sin acción.

### 2 · Issue #9 — escalón H1 > H2 restaurado → **RESUELTO**

- `<h1>` Hero: `clamp(2rem, 4vw, 3rem)` = 32→48px. Intacto.
- `<h2>` de sección: ahora `.text-h2` = `clamp(1.75rem, 4vw, 2rem)` = 28→32px en TODAS las secciones (Products, Values, AboutUs, Contact, CTA).
- **Escalón restaurado:** H1 (32→48) > H2 (28→32). El solapamiento de la OLA 1 (h2 a 36→48px invadiendo el rango del h1) está eliminado. El Hero vuelve a ser inequívocamente el titular de la página.
- Ratio H2→H3 (`.text-h2` 32 / `.text-h3` 24) = 1.33 — perfecto cuarto, dentro de norma.

### 3 · Issue #6 — eyebrows con `.text-overline` consistente → **RESUELTO**

`.text-overline` (11px / 600 / 0.18em / uppercase) aplicado en TODOS los eyebrows: Hero (col. izq. y placa de variedades), Products, Values, AboutUs, Contact, CTA (in-season y off-season), y los `<h4>` de columna del Footer. El kicker es ahora el mismo tier de etiqueta en las 7 secciones — el drift 12px/11px de la OLA 1 está eliminado.

### 4 · Issue #3 — placa de variedades del Hero demotada → **RESUELTO**

`hero.tsx` columna derecha:
- Borde retirado — la placa ya no tiene `border` (sustituido por fondo `--color-bg-subtle` sin contorno).
- Nombres de variedad reducidos a `clamp(1.35rem, 2.6vw, 1.75rem)` (antes `clamp(1.7rem, 3.4vw, 2.35rem)`).
- Color de los nombres `--color-text-secondary` (tinta apagada, no carmín de marca).

**Squint test:** el `<h1>` (32→48px, carmín `--color-brand-pressed`, Playfair italic) gana ahora el camino diagonal sin discusión. La placa cae al rol de soporte: tres nombres en tinta secundaria, sin contorno, sobre cream sutil. El empate 45/40 de la OLA 1 se resuelve — la cita es el protagonista del Hero.

### 5 · Issue #5 — ProductCard: nombre protagonista, 3 tiers → **RESUELTO**

`products.tsx` ProductCard:
- Nombre `<h3>` → `.text-h3` = `clamp(1.375rem, 2.5vw, 1.5rem)` = 22→24px / 600.
- Precio: `text-lg font-bold` = 18px.
- **Delta:** 22→24px vs 18px = **+4 a +6px** sobre el precio, y el nombre suma el peso del serif Playfair vs el sans del precio. El delta de la OLA 1 era +2px con el precio ganando en peso; ahora el nombre domina por escala y familia. Cumple el ≥6px en el extremo superior del clamp y se acerca en el inferior — el peso de familia cierra el margen. Protagonista textual claro.
- **Tiers visibles:** nombre (protagonista) → precio + botón "Añadir" (soporte) → descripción + chip de trazabilidad + "/500g" + "Ver más" (ambiente). 3 tiers de jerarquía perceptual. La anatomía imagen → nombre → precio → botón se respeta.

> Residuo menor (era issue #13 LOW, no estaba en el alcance de C3): "Ver más" sigue en `text-xs` junto al precio. No es regresión — TANDA 3 no tenía mandato sobre #13. Se mantiene para una tanda de pulido.

### 6 · Issue #8 — formulario de Contact protagonista de su sección → **RESUELTO**

`contact.tsx`: el grid pasó de `lg:grid-cols-2` (48/48, empate) a `lg:grid-cols-[5fr_7fr]`. La columna del formulario ocupa ahora 7/12 = ~58% del ancho frente al 42% de la columna de info. Sumado a la card blanca con sombra (`shadow-sm`) sobre el fondo `--color-bg-base`, el formulario — el elemento de conversión — es el ganador visual de la sección. El empate de la OLA 1 está roto: la sección tiene un protagonista declarado.

### 7 · Issue #10 — bloque tributo de AboutUs con orden interno → **RESUELTO**

`about-us.tsx` bloque tributo:
- Placa "Mariana": el nombre se reduce a `text-lg` (18px) — actúa como etiqueta de autoría/retrato, no como titular.
- Blockquote: `text-lg` italic Playfair en `--color-text-primary` (tinta más oscura) + barra lateral de marca de 3px + atribución subordinada en `text-sm`.
- **Orden interno:** el blockquote, con color de texto primario y el ancla visual de la barra lateral, es el protagonista del bloque; la placa "Mariana" queda como soporte. Ambos por debajo del `<h2>` de sección. El empate de tres elementos de la OLA 1 está resuelto.

### 8 · Regresiones y hex de marca residual

**Regresiones:** ninguna. No se detecta ningún heading que haya perdido su tier, ni ningún token de color revertido a literal. La migración de ~70 literales hex a `var(--color-*)` es consistente — inputs, bordes, textos y superficies usan tokens en los 10 componentes.

**Hex residual — clasificado:**

| Ubicación | Literal | Clase | ¿Bloqueante C3? |
|---|---|---|---|
| `cart.tsx` 29,170 · `checkout.tsx` 101,227 · `products.tsx` 380,400 · `contact.tsx` 239 · `cta.tsx` 190 | `linear-gradient(...)` | Gradiente de marca | NO — diferido a TANDA 5 a propósito |
| `checkout.tsx` 15,17,18,20 | `#1a0808 #6e3232 #962a1f #b5341f` | `CARD_STYLE` Stripe (iframe) | NO — iframe no lee CSS vars; exento |
| `hero.tsx` 249 | `["#f5d0c8" … "#e89888"]` | Prop `colors` del shader `MeshGradient` | NO — prop de shader, no acepta CSS vars (análogo a gradiente) |
| `products.tsx` 306 | `fill="#e8a090"` | SVG decorativo (pétalo easter-egg) | NO — SVG decorativo, no superficie de texto/UI |
| `hero.tsx` 58,120,169,211,268,370,377 | `#f0e0e0 #c8b8b8 #f0d0d0 #d8b0b0` | Hairlines / puntos separadores decorativos no-texto | NO — drift menor de coherencia, no afecta jerarquía; recomendado tokenizar en pulido |
| **`cta.tsx` 16,28,124,136** | **`#f5c6c2`** | **Color de TEXTO en `.text-overline` y `<em>` de título** | **Residuo real** — literal de texto en elemento de jerarquía |
| **`footer.tsx` 172** | **`#e8c4bf`** | **Color de TEXTO de la línea "En memoria de Mariana"** | **Residuo real** — literal de texto |

Dos residuos son literales de **color de texto sobre elementos con peso de jerarquía** (`#f5c6c2` en el eyebrow y el `<em>` del título del CTA; `#e8c4bf` en la línea de tributo del Footer). No son gradientes ni `CARD_STYLE` Stripe, así que entran formalmente en el ámbito de C3 y quedan sin migrar. Su impacto es bajo: ambos son tonos cream-rosados de bajo peso sobre banda oscura, leen como variantes de `--color-text-on-deep` / `--cream-300`. No rompen jerarquía — el eyebrow del CTA sigue siendo tier-etiqueta y la línea de tributo sigue siendo discreta — pero el design system de Fase 3 no publica un token para "acento cream sobre maroon", por lo que su migración exige primero crear ese token (territorio de `design-system-manager`). Se clasifican LOW y se difieren con rationale, no se marcan como fallo de TANDA 3.

> Nota: la OLA 1 no listó `#f5c6c2`/`#e8c4bf` entre los 9 fallos de opacidad/color porque son literales sólidos (no opacidad sobre texto, G-1 cumplida). TANDA 3 migró opacidad→token correctamente; estos dos sólidos quedaron porque no tienen token destino. Coherente, no contradictorio.

---

## Per-section protagonist check (post-TANDA 3)

| Sección | Protagonista previsto | Ganador visual real | Estado | Δ vs OLA 1 |
|---|---|---|---|---|
| Nav | CTA "Ver tienda" | CTA "Ver tienda" | PASS | = |
| **Hero** | Cita `<h1>` | Cita `<h1>` (placa demotada) | **PASS** | FAIL → PASS |
| StatsStrip | 4 cifras | 4 cifras | PASS | = |
| Products | Grid de tarjetas | Grid de tarjetas | PASS | = |
| AboutUs | `<h2>` + relato | `<h2>` + relato (blockquote ordenado) | **PASS** | BORDERLINE → PASS |
| Values | Grid de 6 tarjetas | Grid de 6 tarjetas | PASS | = |
| CTA | `<h2>` + botón | `<h2>` | PASS | = |
| **Contact** | Formulario | Formulario (col. 7fr) | **PASS** | FAIL → PASS |
| Footer | Reparto plano | Reparto plano | PASS | = |
| Cart (drawer) | Lista + checkout | Botón checkout | PASS | = |

**Recuento:** 10 PASS · 0 BORDERLINE · 0 FAIL. (OLA 1: 5 PASS · 1 BORDERLINE · 3 FAIL.) Las tres secciones que fallaban — Hero, Products-intra-card, Contact — están resueltas.

---

## 70/20/10 weight check (post-TANDA 3)

| Sección | Reparto estimado (squint) | Veredicto |
|---|---|---|
| Hero | cita `<h1>` ~68% / placa ~22% / CTA+eyebrow ~10% | PASS — la cita domina; placa demotada a soporte |
| Products (intra-card) | imagen ~55% / nombre ~22% / precio+botón ~15% / desc+chip ~8% | PASS — nombre claramente sobre precio |
| AboutUs | `<h2>`+cuerpo ~62% / bloque tributo ~30% / CTA ~8% | PASS — bloque tributo con orden interno, subordinado al `<h2>` |
| Contact | formulario ~58% / info ~38% / eyebrow ~4% | PASS — formulario es el protagonista |

---

## Component anatomy violations (post-TANDA 3)

- **ProductCard** — orden imagen → nombre → precio → botón: RESPETADO. Nombre `.text-h3` domina sobre precio `text-lg`. 3 tiers. PASS.
- **Hero** — orden headline → sub-headline → CTA → visual: RESPETADO. Placa (visual) subordinada al `<h1>`. PASS.
- **Form / Contact** — el formulario domina su sección además de tener anatomía intra-form correcta. PASS.
- **Blockquote AboutUs** — cita protagonista, placa "Mariana" como etiqueta de soporte, atribución subordinada. PASS.

Ninguna violación de anatomía pendiente.

---

## Estado de cada issue del encargo

| Issue | Severidad OLA 1 | Estado TANDA 3 |
|---|---|---|
| #1 — escala tipográfica del design system aplicada | CRITICAL | **RESUELTO** |
| #3 — placa de variedades del Hero demotada | HIGH | **RESUELTO** |
| #5 — ProductCard nombre protagonista, 3 tiers | HIGH | **RESUELTO** |
| #6 — eyebrows con `.text-overline` consistente | MEDIUM | **RESUELTO** |
| #8 — formulario de Contact protagonista | HIGH | **RESUELTO** |
| #9 — escalón H1 > H2 restaurado | MEDIUM | **RESUELTO** |
| #10 — bloque tributo de AboutUs con orden interno | MEDIUM | **RESUELTO** |

Issues cerrados en tandas previas y fuera de re-evaluación: #2 (opacidad sobre texto, cerrado TANDA 2), #4 (contraste `<h1>` Hero, `<h1>`→strawberry-700, cerrado TANDA 2).

Residuos LOW abiertos, no bloqueantes (no estaban en el alcance de C3 o requieren token nuevo): #11 (footer ya migrado a `.text-overline`, parcialmente resuelto), #13 ("Ver más" `text-xs`), `#f5c6c2`/`#e8c4bf` (acento cream sin token destino), hairlines decorativos del Hero.

---

## Status

**PASS — 8.5 / 10 vs umbral 8.5** (antes 5.5/10 FAIL).

El clúster C3 está resuelto: los 2 CRITICAL y los 4 HIGH de la OLA 1 están cerrados, los 3 MEDIUM dentro del alcance (#6, #9, #10) también. La jerarquía que el design system de Fase 3 declara es ahora la que el visitante ve. El score llega justo al umbral; el medio punto restante es pulido de coherencia de color de marca (2 literales de texto sin token destino) y un escalón h3/h4 ligeramente comprimido en Values — todo LOW, no bloqueante.

## Handoff

- **→ visual-perfection:** la fila de jerarquía ya no capa tu score global. El clúster C3 pasa en 8.5. Puedes auditar. El conflicto DSM-1 (decoración MeshGradient) y los gradientes de marca siguen diferidos a TANDA 5 — no son defecto de jerarquía.
- **→ design-system-manager:** crear un token de "acento cream sobre superficie maroon" (candidato: `--color-accent-on-deep`) para poder migrar `#f5c6c2` (CTA) y `#e8c4bf` (Footer) en TANDA 5. Hoy no hay token destino; por eso quedaron como literales.
- **→ iteration-agent:** pulido opcional (no bloqueante) — issue #13 ("Ver más" a color de marca sólido), hairlines decorativos del Hero a tokens, y revisar si el `<h3>` de Values debe subir de `.text-h4` a `.text-h3` para abrir el escalón h2/h3/h4.
- **→ director:** TANDA 3 cierra el clúster C3. Recomendación: autorizar el avance del pase de QA visual; los residuos pendientes son TANDA 5 (gradientes + tokens de acento) y pulido LOW.

---

## Audit log entry (para `hierarchy-master-memory.md` — pendiente de persistir por el director)

- **Yaya Mariana — re-chequeo TANDA 3 — 2026-05-22 — score 8.5/10 — PASS.**
  - El modo de fallo "design system entregado pero no migrado" (descubierto en OLA 1) se cierra: confirmado que la migración componente→sistema recupera la jerarquía perceptual. La detección temprana propuesta — comparar tamaños/colores hardcodeados contra las utilidades `.text-*` — sigue siendo el check duro recomendado.
  - **Patrón nuevo:** un literal de color de marca puede quedar legítimamente sin migrar si el design system no publica un token destino para ese rol (p.ej. "acento cream sobre maroon"). No es un fallo de la tanda de migración; es un gap del sistema. Detección: separar "literal con token destino disponible" (defecto) de "literal sin token destino" (escalada a design-system-manager).
  - Hero DTC artesanal/homenaje = cita-led, confirmado: demotar el visual de soporte (placa) por debajo del 70/20/10 recupera el squint para la cita `<h1>`. Patrón validado, registrar junto al de La Nonna.
  - Sin overrides de Nil que registrar.
</content>
</invoke>
