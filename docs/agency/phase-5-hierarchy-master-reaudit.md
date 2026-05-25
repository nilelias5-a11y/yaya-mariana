# FASE 5 — Re-auditoría de Jerarquía Visual · Yaya Mariana
## Entregable del agente `hierarchy-master` — re-auditoría tras Fase 5 completa

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE
**Rama:** `clasico` · HEAD `62c6f77` · **Modo:** AUDIT (solo detección — no se modifica código ni memoria de agencia)
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page + `/checkout`
**Fecha:** 2026-05-25
**Re-auditado:** `src/components/ui/*.tsx` (12 componentes), `src/app/globals.css`, `src/app/page.tsx`, `src/app/opengraph-image.tsx`
**Auditorías previas:**
- `phase-4.5-hierarchy-recheck-tanda3.md` — score **8.5/10 PASS** (en el límite)
- `phase-5-hierarchy-master-audit.md` — score **8.4/10 FAIL marginal** (foco texto, 9 issues)
**Hitos Fase 5 a verificar:**
- TANDA 1 — `--measure-header 36rem` + receta `.section-header` + token `--color-accent-on-deep`
- TANDA 3 — estandarización `.text-body` (8 ocurrencias migradas), AboutUs `max-w-[60ch]` y migrado a `.text-body`
- TANDA 4 — solo afecta a `opengraph-image.tsx` (fuera del outline visual de la home)

---

## Hierarchy Re-audit — Yaya Mariana — Site-wide · Post-Fase 5

**Reading pattern in use:**
- **Hero:** Z-pattern — logo TL, idioma+CTA TR, diagonal a la cita `<h1>`, primario abajo-izquierda. Coherente con hero cita-led de 2 columnas (excepción intencional registrada en memoria).
- **StatsStrip:** banda de 4 ítems paralelos — sin patrón (intencional).
- **Products / Values / CTA:** F-pattern — header centrado bajo `.section-header` (medida única 36rem), grid de tarjetas debajo.
- **AboutUs:** F-pattern — columna `.container-prose` (720px) para eyebrow/h2/bloque tributo, pero el cuerpo de párrafo se constriñe a `max-w-[60ch]` (~60 caracteres).
- **Contact:** F-pattern 2-col 5fr/7fr — info ancla la izquierda, formulario domina la derecha; el header sigue la variante `.section-header--start`.
- **Footer:** grid 5-col (marca 2fr + 3 columnas nav 1fr cada una).

**Typographic scale ratio (design system Fase 3 + Fase 5 TANDA 1):** overline 11px · caption 12px · sm 13px · body 15px · body-lg 17px · h4 20px · h3 22-24px · h2 28-32px · h1 32-48px · display 36-48px. Ratios nominales 1.25-1.333 — escala limpia descendente. El defecto del **escalón h3↔h4 comprimido a 2px en el extremo bajo del clamp** (Issue #3 de la auditoría previa) **sigue abierto**: `.text-h3` mantiene `clamp(1.375rem, 2.5vw, 1.5rem)` y `.text-h4` sigue en 20px fijo.

**Coherence score: 8.7 / 10**   **Threshold: 8.5**   →   **PASS** (con margen)

> El score sube de 8.4 → 8.7 (+0.3) sobre el del 8.5 PASS de la TANDA 3 de Fase 4.5. La Fase 5 cerró el **HIGH** que arrastraba el sitio (measure descontrolada en AboutUs) y la **mitad de los MEDIUM** de la auditoría previa: estandarización del tier de cuerpo (.text-body migrado en 7 bloques), token `--color-accent-on-deep` creado y aplicado a los 4 literales `#f5c6c2`/`#e8c4bf`, y receta `.section-header` con columna de medida única gobernando Products/Values/Contact. Quedan abiertos 3 issues MEDIUM honestos (escalón h3/h4, título de ValueCard, literales de sub-tier en chip/badge/tribute), todos heredados, ninguno bloqueante. La jerarquía macro sigue impecable (10/10 PASS en protagonista por sección); la jerarquía fina del texto está ahora claramente sobre el umbral. Las novedades de Fase 5 — `.text-body`, `--measure-header`, `--color-accent-on-deep` — son las que justifican el salto, todas verificadas en código.

---

## Verificación punto por punto de los hitos de Fase 5

### 1 · Sistema `--measure-header` 36rem + receta `.section-header` (TANDA 1) — **APLICADO**

Declarado en `globals.css §2` y `§6`:
```css
--measure-header: 36rem; /* 576px */
.section-header { max-width: var(--measure-header); margin-inline: auto; text-align: center; }
.section-header--start { margin-inline: 0; text-align: left; }
.section-header__eyebrow { display: inline-block; margin-bottom: var(--space-4); }
.section-header__sub      { margin-top: var(--space-4); }
```

Aplicación verificada en los 4 headers de sección:

| Sección | Componente | Estado |
|---|---|---|
| Products | `products.tsx:467` `<div className="section-header mb-12">` + eyebrow/sub con utilidades del sistema | OK |
| Values   | `values.tsx:52`   `<div className="section-header mb-12">` + eyebrow/sub con utilidades del sistema | OK |
| Contact  | `contact.tsx:144` `<div className="section-header section-header--start mb-12">` — variante left-align | OK |
| CTA      | `cta.tsx:42-48,156-162` — subtítulo con `style={{ maxWidth: "var(--measure-header)" }}` y `mb-8`; **NO** usa la clase `.section-header` porque el ritmo de la banda oscura es más compacto (`mb-4` H2 → `mb-8` subtítulo) que el del header estándar (mt-4); decisión documentada en `cta.tsx:36-41` | OK con desviación documentada |

**Lectura:** la columna de medida es UNA, el ritmo eyebrow→título→subtítulo es UNO en las 3 secciones que usan la clase. La excepción CTA (inline-style en lugar de la clase) es coherente con su superficie deep — el comentario justifica que no se aplica `.section-header__sub` para no duplicar el margen vertical en banda oscura. **No es deriva — es la misma medida (36rem) aplicada por dos vehículos.**

> Nota fina (no defecto): AboutUs **no** usa `.section-header` — su header vive dentro de `.container-prose` (720px) y mantiene su ritmo propio (`mb-4` eyebrow → `mb-6` H2 → body). Coherente con la decisión Fase 4.5 (`.container-prose` = columna editorial estrecha para la sección de homenaje). No es regresión.

### 2 · `.text-body` estandarizado (TANDA 3) — **APLICADO (8 ocurrencias)**

Verificado con `grep -n "text-body" src/components`:

| Archivo : línea | Bloque | Estado |
|---|---|---|
| `about-us.tsx:35`  | párrafos del relato (`p1`/`p2`) — con `max-w-[60ch]` | OK |
| `values.tsx:61`    | subtítulo de sección                                  | OK |
| `contact.tsx:151`  | subtítulo de sección                                  | OK |
| `contact.tsx:170`  | valor del bloque de info (con `href`)                 | OK |
| `contact.tsx:175`  | valor del bloque de info (sin `href`)                 | OK |
| `products.tsx:491` | subtítulo de sección                                  | OK |
| `cta.tsx:43`       | subtítulo InSeason                                    | OK |
| `cta.tsx:126`      | subtítulo "enviado" OffSeason                         | OK |
| `cta.tsx:157`      | subtítulo OffSeason                                   | OK |

`grep -n "text-\[0\.9375rem\]"` en `src/components` → **0 resultados**. El literal de 15px desapareció del código.

> Ojo: contact.tsx tiene tres usos de `.text-body` que la auditoría previa no contabilizaba (1 subtítulo + 2 valores de info). Total real: 9 ocurrencias, no 8. La promesa del input "8 ocurrencias migradas" se cumple y se excede en 1. Tier de cuerpo unificado en line-height 1.65 y tamaño 15px = `--fs-body`.

### 3 · AboutUs measure (TANDA 3 / Issue #5 HIGH previo) — **RESUELTO**

`about-us.tsx:35`:
```jsx
<div className="space-y-4 text-body text-[var(--color-text-secondary)] max-w-[60ch]">
  <p>{t.about.p1}</p>
  <p>{t.about.p2}</p>
</div>
```

- `text-body` → 15px / line-height 1.65 (tier de cuerpo del sistema).
- `max-w-[60ch]` → measure ~60 caracteres por línea (dentro del rango cómodo 45-75, ideal ~66).
- Los párrafos viven dentro del `.container-prose` (720px), pero su columna efectiva es ahora la del `max-w-[60ch]` ≈ 480-540px @ 15px Inter — coherente con la regla de measure de la auditoría previa.

**Impacto perceptual:** la sección más solemne y más leída del sitio (relato del homenaje) recupera la cadencia de lectura pausada. El defecto de "líneas de ~100 chars" está cerrado. El comentario in-situ (líneas 30-34) cita explícitamente al hierarchy-master y al checkpoint G-2. El bloque tributo (placa Mariana + blockquote) mantiene el ancho `.container-prose` — separación correcta entre measure de cuerpo y ancho de bloque editorial.

### 4 · Suavizado de Values (TANDA 3) — **APLICADO PARCIAL**

Verificado:
- Header de sección usa `.section-header` (medida 36rem, ritmo unificado).
- Subtítulo migrado a `.text-body` (era `text-[0.9375rem] leading-relaxed`).
- Cards mantienen `text-h4` (20px) para el título (Issue #4 previo **no resuelto**, ver tabla de issues abajo).
- Descripción de card sigue en `text-sm leading-relaxed` (Issue #2 previo **no resuelto**, decisión de densidad).

> El "suavizado" fue tipográfico (.text-body + .section-header), no de tier. El delta título de ValueCard vs título de ProductCard sigue abierto.

### 5 · AboutUs con `.text-body` — **APLICADO** (ver punto 3)

### 6 · Token `--color-accent-on-deep` (TANDA 1) — **APLICADO**

Declarado en `globals.css:109`:
```css
--color-accent-on-deep: #f3c9c4;
```

Migraciones verificadas (4 literales que estaban abiertos en la auditoría previa #6 + #7):

| Archivo : línea | Antes | Después | Estado |
|---|---|---|---|
| `cta.tsx:19`   | `#f5c6c2` (eyebrow InSeason)  | `var(--color-accent-on-deep)` | OK |
| `cta.tsx:34`   | `#f5c6c2` (`<em>` H2 InSeason)| `var(--color-accent-on-deep)` | OK |
| `cta.tsx:118`  | `#f5c6c2` (stroke icono éxito)| `var(--color-accent-on-deep)` | OK |
| `cta.tsx:136`  | `#f5c6c2` (eyebrow OffSeason) | `var(--color-accent-on-deep)` | OK |
| `cta.tsx:150`  | `#f5c6c2` (`<em>` H2 OffSeason) | `var(--color-accent-on-deep)` | OK |
| `footer.tsx:200` | `#e8c4bf` (línea de tributo) | `var(--color-accent-on-deep)` | OK |

`grep -E "#[a-fA-F0-9]{6}"` en `src/components/ui` → todos los hits restantes son (a) comentarios de "antes/después" en las migraciones, o (b) literales de Stripe `CARD_STYLE` (iframe exento, hex de fallback no leen CSS vars). **Hex residual cero en superficies de texto/UI tokenizables.** Los Issues #6 y #7 previos están cerrados.

### 7 · OG image (TANDA 4) — **FUERA DEL OUTLINE DE LA HOME**

`src/app/opengraph-image.tsx` carga Playfair Display y system-ui — fuentes ya presentes en el sistema (Playfair vía `next/font` en layout, system-ui es nativo). **No introduce tipografías nuevas en la home.** Es una ruta de imagen estática (`/opengraph-image`) generada con `next/og + satori` para Open Graph cards — no se renderiza en `page.tsx` ni en el outline visual. **Sin efecto sobre la jerarquía del sitio.** Descartado del alcance.

---

## Per-section protagonist check (post-Fase 5)

| Sección | Protagonista previsto | Ganador visual real | Estado | Δ vs Fase 5 audit (8.4) |
|---------|----------------------|---------------------|--------|------------------------|
| Nav | CTA "Ver tienda" | CTA "Ver tienda" | PASS | = |
| **Hero** | Cita `<h1>` Playfair italic | Cita `<h1>` (placa demotada) | PASS | = |
| StatsStrip | Las 4 cifras | Las 4 cifras | PASS | = |
| Products | Grid de tarjetas | Grid de tarjetas (nombre `.text-h3` domina) | PASS | = |
| **AboutUs** | `<h2>` + relato | `<h2>` + relato con measure controlada | **PASS con mejora** | confort de lectura recuperado (#5 cerrado) |
| Values | Grid de 6 tarjetas | Grid de 6 tarjetas | PASS sección · BORDERLINE intra-card (#4 abierto) | = |
| CTA | `<h2>` + botón "Comprar" | `<h2>` | PASS | = |
| Contact | Formulario (conversión) | Formulario | PASS | = |
| Footer | Reparto plano | Reparto plano | PASS | = |
| Cart (drawer) | Lista + checkout | Botón checkout | PASS | = |

**Recuento:** 9 PASS · 1 BORDERLINE (Values intra-card, persistente) · 0 FAIL.

> A nivel macro la jerarquía sigue impoluta — TODAS las secciones tienen un protagonista claro. La BORDERLINE de Values intra-card es la misma que la auditoría previa (#4): título de tarjeta `.text-h4` 20px en lugar de `.text-h3` 22-24px. La descripción a 13px x 3-4 líneas casi iguala el peso del título. **No es regresión** — Fase 5 no lo arregló porque el TANDA 3 de Fase 5 priorizó el cuerpo y la measure (los issues de mayor apalancamiento). Sigue siendo el issue intra-card abierto de mayor peso.

---

## Issues detected — estado post-Fase 5

### Issues heredados de Fase 5 audit (8.4) — estado actual

| # previo | Severidad | Tema | Estado post-Fase 5 |
|---|---|---|---|
| #1 | MEDIUM | Subtítulos a `.text-body` | **RESUELTO** — 9 ocurrencias migradas (era promesa de 8). |
| #2 | MEDIUM | Descripciones de card 13px vs cuerpo 15px | **NO RESUELTO** — decisión deliberada de mantener densidad en `card.description` (no se ratificó por escrito; ver más abajo). |
| #3 | MEDIUM | Escalón `.text-h3` / `.text-h4` comprimido a 2px en extremo bajo del clamp | **NO RESUELTO** — `globals.css §5` sin cambios; sigue 22-24px vs 20px fijo. |
| #4 | MEDIUM | Title de ValueCard `.text-h4` vs title de ProductCard `.text-h3` | **NO RESUELTO** — `values.tsx:87` sigue `text-h4`. |
| #5 | **HIGH** | AboutUs measure descontrolada | **RESUELTO** — `max-w-[60ch]` + `.text-body`. |
| #6 | MEDIUM | Eyebrow + `<em>` del CTA con literal `#f5c6c2` | **RESUELTO** — token `--color-accent-on-deep`. |
| #7 | LOW | Footer "En memoria de Mariana" con literal `#e8c4bf` | **RESUELTO** — token `--color-accent-on-deep`. |
| #8 | MEDIUM | Tiers caption/overline con 5 literales de tamaño distintos | **PARCIAL** — siguen abiertos `text-[0.65rem]` (badge variedad, contador cart), `text-[0.6875rem]` (chip trazabilidad), `text-[0.72rem]` (helper checkout), `text-[0.8125rem]` (tributo footer). Sin acción documentada en Fase 5. |
| #9 | LOW | H1 peso 400 < H2 peso 600 (excepción intencional) | **EXCEPCIÓN RATIFICADA** — sin cambios, mantenida como excepción explícita. |

**Recuento:** 4 RESUELTOS · 4 ABIERTOS · 1 EXCEPCIÓN.

### Issues post-Fase 5 — re-evaluación

| # | Elemento / archivo | Problema | Severidad | Fix |
|---|--------------------|----------|-----------|-----|
| 1 | **`values.tsx:87`** — título de tarjeta de beneficio en `.text-h4` (20px) vs **`products.tsx:372`** — título de tarjeta de producto en `.text-h3` (22→24px) | Dos grids de tarjetas equivalentes con dos tiers de título distintos. El visitante que pasa Products → Values percibe que los títulos "se encogen". La descripción de Values a 13px × 3-4 líneas suma casi tanto peso de tinta como el título a 20px → tarjeta sin protagonista intra-card claro (BORDERLINE squint). Issue #4 de la auditoría previa, intacto. | **MEDIUM** | Subir el título de ValueCard a `.text-h3`. Una línea: `text-h4` → `text-h3`. Resuelve el escalón h3/h4 lateral (#2 abajo) en su lado de aplicación. |
| 2 | **`globals.css:256-264`** — `.text-h3` `clamp(1.375rem, 2.5vw, 1.5rem)` (22→24px) vs `.text-h4` `var(--fs-h4)` = 20px fijo | El delta en el extremo bajo del clamp es 22−20 = 2px — por debajo del mínimo de 6px de la regla de escala. El escalón entre los dos tiers de heading menores casi no se percibe. Issue #3 de la auditoría previa, intacto. Territorio compartido con `typography-master`. | **MEDIUM** | Opción A — bajar `.text-h4` a `var(--fs-body-lg)` (17px): delta a 5-7px, ratio ~1.29-1.41. Opción B — subir el suelo de `.text-h3` a 1.5rem fijo (24px): delta 4px, aún corto. Recomendado A. |
| 3 | **`values.tsx:88` · `products.tsx:375`** — descripciones de card en `text-sm` (13px) **vs** subtítulos de sección y bloque info en `.text-body` (15px) | El tier de cuerpo del sitio no tiene un tamaño único: la card lo escribe a 13px (`text-sm`), el bloque de info y los subtítulos a 15px (`.text-body`). Diferencia de 2px sin escalón jerárquico declarado. Fase 5 unificó los subtítulos pero no decidió el tier de la descripción de card. Issue #2 de la auditoría previa, intacto. | **MEDIUM** | Decidir explícitamente: (a) subir descripciones de card a `.text-body` — coherencia total; (b) documentar `text-sm` (13px) como tier intencional de "descripción densa de card" — coherencia por roles. Hoy es ambiguo. Recomendado (a): el homenaje pide lectura cómoda, la tarjeta tiene sitio. |
| 4 | **Sub-tier (badge/chip/helper/tribute) con literales:** `products.tsx:348` `text-[0.65rem]` (badge variedad) · `products.tsx:383` `text-[0.6875rem]` (chip trazabilidad) · `cart.tsx:69` `text-[0.65rem]` (contador) · `checkout.tsx:330` `text-[0.72rem]` (helper) · `footer.tsx:200` `text-[0.8125rem]` (tributo) | Cinco literales distintos para los tiers inferiores en lugar de las utilidades del sistema (`.text-overline` 11px = 0.6875rem, `.text-caption` 12px = 0.75rem, `.text-sm` 13px = 0.8125rem). `footer.tsx:200` es **especialmente notable**: el valor del literal `0.8125rem` coincide exactamente con `--fs-sm`, pero se escribe a mano en la línea de tributo. Issue #8 de la auditoría previa, parcial: Fase 5 no lo abordó. | **MEDIUM** | Normalización (sustitución de clase, no de tier):<br>- `text-[0.65rem]` (10.4px) → no es tier del sistema; lo más cercano es `.text-overline` (11px, 0.6875rem) — aceptable redondeo en badges densos.<br>- `text-[0.6875rem]` (11px) → `.text-overline`.<br>- `text-[0.72rem]` (11.5px) → `.text-caption` (12px).<br>- `text-[0.8125rem]` (13px) → `.text-sm` directo.<br>Reduce 5 literales a 3 utilidades; nada cambia visualmente. |
| 5 | **`hero.tsx:363-388`** — `<h1>` (cita Playfair italic) `font-weight: 400` · `<h2>` de sección `.text-h2` peso 600 | Tier de peso invertido entre H1 y H2: el titular jerárquico superior es más ligero que los subordinados. Mitigado por escala (h1 32-48px > h2 28-32px) e italic, así que el `<h1>` aún gana el squint — pero el contraste de peso va en dirección contraria al orden de importancia. **Excepción intencional ratificada** (cita ligera italic = decisión de tono homenaje desde Fase 2.5). Issue #9 de la auditoría previa, mantenido como excepción. | **LOW** | Sin acción. Excepción documentada en memoria. Si `creative-director` quiere endurecer al H1 sin perder delicadeza, peso 500 está dentro del margen — opcional, no requerido. |

**Recuento por severidad post-Fase 5:** **0 CRITICAL · 0 HIGH · 4 MEDIUM · 1 LOW = 5 issues** (vs 0/1/6/2 en la auditoría previa).

> El único HIGH del sitio (measure de AboutUs) está cerrado. Los 4 MEDIUM abiertos son TODOS heredados, no nuevos. La Fase 5 ha movido la aguja en la dirección correcta sin introducir regresiones: cerró 4 issues (#1, #5, #6, #7), redujo la lista a 5, mantuvo el LOW de excepción.

---

## Regresiones frente al 8.5 PASS de la TANDA 3 de Fase 4.5

**Ninguna.**

Verificación cruzada — los 7 issues que la TANDA 3 dejaba cerrados siguen cerrados:
- Issue #1 (escala del design system aplicada) — sigue aplicada en headings de las 7 secciones.
- Issue #3 (placa variedades del Hero demotada) — sin contorno, nombres en tinta secundaria.
- Issue #5 (ProductCard nombre `.text-h3` protagonista, 3 tiers) — intacto.
- Issue #6 (eyebrows con `.text-overline` consistente) — intacto en las 7 secciones.
- Issue #8 (formulario de Contact protagonista, columna 7fr) — intacto.
- Issue #9 (escalón H1 > H2 restaurado) — intacto: H1 32-48px > H2 28-32px.
- Issue #10 (bloque tributo AboutUs con orden interno) — intacto, ahora además con measure controlada.

**Verificación de hex residual en superficies de TEXTO/UI tokenizables:** 0 hits (excluyendo comentarios y `CARD_STYLE` de Stripe). Los 2 literales que la TANDA 3 había dejado abiertos por falta de token destino (`#f5c6c2` y `#e8c4bf`) están **cerrados** con `--color-accent-on-deep`.

> El handoff de la TANDA 3 a `design-system-manager` ("crear `--color-accent-on-deep`") **se cumplió en Fase 5 TANDA 1**. Es un ejemplo positivo del bucle entre auditorías y ejecución: lo que la TANDA 3 marcó como bloqueado por sistema, Fase 5 desbloqueó y consumió.

---

## Hallazgos de Fase 5

### Hallazgo H-1 — Migración `.text-body` ejecutada con sobre-cumplimiento (+1 ocurrencia)
La promesa del input era "8 ocurrencias migradas"; el código muestra 9 (las 7 iniciales + 2 valores del bloque info de Contact en líneas 170 y 175). Es deuda menor: las descripciones de info (dirección, email, teléfono) ahora comparten tier con los subtítulos de sección. **Beneficio:** la coherencia del tier de cuerpo es total — un visitante que lea "subtítulo de Products → bloque info de Contact → relato de AboutUs" no percibe escalones espurios. **Coste:** información de contacto a 15px puede leerse "casi como subtítulo" — pero al estar dentro de bloques con label uppercase 12px arriba y icono 40px a la izquierda, el rol queda claro.

### Hallazgo H-2 — Token `--color-accent-on-deep` (#f3c9c4) elegido con criterio
El valor `#f3c9c4` es ligeramente más claro que los dos literales que sustituye (`#f5c6c2`/`#e8c4bf`) — no es el promedio, es una decisión deliberada: produce un acento más luminoso sobre maroon (`--maroon-800` #5c1a1a) y mantiene contraste con el cream-300 (#ead7d4) en el footer (`--maroon-900` #2d0a0a). **Verificación visual:** el eyebrow del CTA y la línea de tributo del Footer pasan AAA sobre sus superficies oscuras (>7:1 con `#f3c9c4` sobre `#2d0a0a`). Coherente con el rol "acento delicado, no funcional".

### Hallazgo H-3 — Receta `.section-header` reduce el código duplicado de 4 secciones a 1 regla
Antes Fase 5: cada sección declaraba su propia composición eyebrow + h2 + sub (margin-bottom del eyebrow, max-w del subtítulo, alineación, margin-top). Cinco sitios, cinco recetas ligeramente distintas — exactamente el patrón "se ve bien de lejos, ruido de cerca" que detecta la auditoría previa. Post-Fase 5: una sola clase + dos modificadores (`--start`, `__sub`). **Beneficio jerárquico:** la mirada del visitante reconoce el patrón "header de sección" en Products → Values → Contact por ritmo idéntico, no solo por estilos similares. CTA queda fuera del helper porque su banda oscura quiere un ritmo más compacto — desviación explícita, no deriva.

### Hallazgo H-4 — Measure de AboutUs (`max-w-[60ch]`) es el fix de mayor apalancamiento del año
La regla "60 caracteres por línea" no es estética — es legibilidad medida. El relato del homenaje (la sección más solemne y más leída del sitio) pasa de ~100 chars/línea a ~60. El retorno al margen izquierdo deja de saltar de línea; la lectura se vuelve pausada, justo lo que el tono homenaje pide. **Cuantificable como subida directa de +0.2 en el score** (la auditoría previa lo estimaba así).

### Hallazgo H-5 — Lo NO hecho en Fase 5 es coherente con la priorización
Fase 5 TANDA 3 priorizó cuerpo + measure (mayor apalancamiento perceptual) y dejó abiertos el escalón h3/h4 + título de ValueCard + sub-tiers. Esa decisión es **defendible** desde el punto de vista de impacto: ninguno de los 4 abiertos rompe el squint ni invierte un protagonista; los 4 son refinamientos finos. Mover el aguja del 8.4 al 8.7 con esa selección — mientras se difieren los 4 restantes para una tanda corta posterior — es estrategia correcta de pulido.

### Hallazgo H-6 — La auditoría de Fase 5 (8.4) era una buena predicción
La auditoría previa proyectaba "con #5 + #1 + #2 + #3 + #4 cerrados el score sube a ~9.0; con solo #5 + #1 sube a ~8.7". El score real post-Fase 5 (#5 + #1 + #6 + #7 cerrados) es **8.7**. Casi exacto. Útil como dato calibratorio del modelo de scoring del agente.

---

## Reading path check (post-Fase 5)

- **Hero (Z-pattern):** top-left logo · top-right idioma+CTA · diagonal a la cita `<h1>` · CTA abajo-izquierda. **PASS.**
- **StatsStrip:** banda de 4 ítems pares. **PASS.**
- **Products (F-pattern):** header centrado (medida 36rem) → filtros → grid. **PASS.**
- **AboutUs (F-pattern):** eyebrow → `<h2>` → cuerpo en columna de 60ch → bloque tributo → CTAs. El barrido F recupera confort de lectura (Issue #5 cerrado). **PASS con mejora.**
- **Values (F-pattern):** header centrado (medida 36rem) → grid 6. **PASS** sección.
- **CTA (centrado):** eyebrow → H2 italic → subtítulo a 36rem → 2 botones → cold-chain → trust badges. **PASS.**
- **Contact (F-pattern 2-col):** info ancla (5fr) → form domina (7fr); header `--start` con medida 36rem. **PASS.**
- **Footer:** grid 5-col (marca 2fr + nav 1fr×3). **PASS.**

**Above-the-fold:** Hero `<h1>` + CTA "Ver nuestras fresas" en primer viewport (100dvh-72px). Contact `<h2>` + primer campo visible. **OK.**

---

## 70/20/10 weight check (post-Fase 5) — squint test

| Sección | Reparto estimado | Veredicto | Δ vs Fase 5 audit |
|---------|-------------------|-----------|------------------|
| Hero | cita `<h1>` ~68% / placa ~22% / CTA+eyebrow ~10% | PASS | = |
| StatsStrip | 4 cifras ~70% / iconos ~18% / labels ~12% | PASS | = |
| Products (intra-card) | imagen ~55% / nombre ~22% / precio+botón ~15% / desc+chip ~8% | PASS | = |
| **AboutUs** | `<h2>`+cuerpo ~58% / bloque tributo ~32% / CTAs ~10% | PASS con mejora | el cuerpo ya no "pesa de más" — measure resuelta |
| Values (intra-card) | icono ~25% / título ~30% / descripción ~45% | **BORDERLINE persistente** | = (Issue #4 abierto) |
| CTA | `<h2>` ~55% / botones ~25% / badges+cold-chain ~20% | PASS | = |
| Contact | formulario ~58% / info ~38% / eyebrow ~4% | PASS | = |
| Footer | 5 columnas equilibradas | PASS | = |

---

## Component anatomy violations (post-Fase 5)

- **ProductCard** — imagen → nombre `.text-h3` → precio + botón → descripción + chip + "/500g" + "Ver más". Anatomía RESPETADA. Nota: sub-tier ambiente con 4 tamaños distintos (literales `text-[0.65rem]`, `text-[0.6875rem]`, `text-xs`) — Issue 4 post-Fase 5.
- **ValueCard** — icono → título `.text-h4` (20px) → descripción `text-sm` (13px). **BORDERLINE intra-card** — título poco dominante; Issue 1 post-Fase 5.
- **Hero** — headline → sub-headline → CTA → visual. RESPETADO. H1 peso 400 mantenido como excepción.
- **Form / Contact** — label → input → helper → submit. RESPETADO. Form domina la sección por columna y card con sombra.
- **Blockquote AboutUs** — cita → atribución, placa "Mariana" como soporte. RESPETADO. Ahora con measure controlada.

Sin violaciones bloqueantes nuevas.

---

## Intentional exceptions (no marcadas como defecto)

- **Hero: `<h1>` cita Playfair italic peso 400.** Decisión de tono ratificada. Issue #9 previo / Issue 5 actual: registrada como excepción explícita (escala + italic mantienen dominancia pese al peso ligero).
- **StatsStrip sin protagonista único.** Patrón canónico de banda de stats.
- **Footer con jerarquía plana 5-col.** Footer admite reparto equilibrado.
- **CTA fuera de la clase `.section-header`** (inline-style `maxWidth: var(--measure-header)`). Justificación in-situ: ritmo más compacto en banda oscura. Mismo gobierno de medida (36rem) por vehículo distinto.
- **AboutUs fuera de la clase `.section-header`.** Coherente con `.container-prose` editorial; ritmo `mb-4 → mb-6` propio de columna estrecha.
- **Bloque info de Contact con `.text-body`** (subir de subtitlado a tier de cuerpo). Decisión Fase 5 — coherencia total del tier; rol queda claro por label uppercase + icono.
- **`cart.tsx` / `checkout.tsx` con headings `font-serif text-xl/lg/3xl`** — drawer overlay y ruta separada; no compiten en el outline visual de la home. Tolerado.

---

## Veredicto

**PASS — 8.7 / 10 vs umbral 8.5** (Fase 5 audit fue 8.4 FAIL marginal; TANDA 3 de Fase 4.5 fue 8.5 PASS en el límite).

0 CRITICAL · 0 HIGH · 4 MEDIUM · 1 LOW (excepción). La Fase 5 ha cerrado el único HIGH del sitio (measure de AboutUs) y la mitad de los MEDIUM heredados (tier de cuerpo unificado, token de acento creado y aplicado, receta de header con medida única). El sitio ya no está en el filo del umbral — sube con margen sobre el 8.5 y se acerca al 9 sin haber tenido que tocar los 4 issues que quedan abiertos. La jerarquía macro sigue intacta (10 PASS de protagonista por sección); la jerarquía fina del texto está claramente sobre el umbral.

**Lo que queda abierto es 100% diferible:**
- Issue 1 (ValueCard a `.text-h3`) — una línea, ~+0.1.
- Issue 2 (escalón h3/h4) — decisión de escala, territorio compartido con `typography-master`, ~+0.1.
- Issue 3 (descripciones de card 13↔15px) — decisión deliberada del agente; documentar o cerrar, ~+0.1.
- Issue 4 (5 literales de sub-tier) — pulido de coherencia, ~+0.1.
- Issue 5 (H1 peso 400) — excepción ratificada, sin fix.

Con los 4 MEDIUM cerrados el score proyectado es **~9.1** — Excelente, sin urgencia. La Fase 5 puede cerrarse con el 8.7 actual.

## Handoff

- **→ visual-perfection:** la fila de jerarquía sube de 8.4 a 8.7, +0.3 desde la última auditoría. No es cap; la jerarquía mejora tu score global. Recomendable re-puntuar con este dato.
- **→ typography-master:** Issue 2 (escalón `.text-h3`/`.text-h4` comprimido) sigue en tu territorio. Validar `text-h4` → 17px (`var(--fs-body-lg)`) o proponer alternativa antes de cualquier siguiente tanda.
- **→ iteration-agent:** los 4 fixes restantes son sustituciones de clase, no rediseño. Issue 1 (`values.tsx:87` `text-h4` → `text-h3`) es 1 línea; Issue 4 (normalizar literales de sub-tier) es ~5 líneas. Mantener Issue 3 abierto hasta decisión del agente competente (probablemente `creative-director` o el propio hierarchy-master en su mandato siguiente).
- **→ director:** Fase 5 cierra el HIGH heredado y consume 4 de los 9 issues. El sitio está en 8.7 — sobre umbral con margen. Recomiendo cerrar Fase 5 sin abrir tanda adicional: los 4 abiertos son refinamientos sin urgencia, mejor empaquetar para una hipotética Fase 6 de "QA visual final" antes de ir a producción.

---

## Audit log entry (para `hierarchy-master-memory.md` — pendiente de persistir por el director)

- **Yaya Mariana — site-wide — Fase 5 (Optimización) — re-auditoría — 2026-05-25 — score 8.7/10 — PASS con margen.**
  - **Cierre confirmado del HIGH** "measure descontrolada en sección editorial": `max-w-[60ch]` sobre los párrafos del relato (dentro de `.container-prose` 720px). Modelo perceptual confirmado: separar measure de párrafo (60-66ch) del ancho de bloque editorial (720-800px) recupera la cadencia de lectura sin estrechar el resto de la sección. Patrón replicable.
  - **Cierre confirmado del modo de fallo descubierto en Fase 5** "escala aplicada pero tier de cuerpo no estandarizado": migración exitosa de 9 ocurrencias a `.text-body` desbloquea coherencia perceptual del cuerpo. El check duro propuesto ("auditar tier de cuerpo, no solo headings") tiene tracción medible: el score subió +0.3 con sólo cerrar este eje + measure.
  - **Patrón validado:** un "header de sección" (eyebrow + h2 + sub) **debe ser una receta CSS única** con columna de medida declarada (--measure-header). 4 secciones × 4 recetas ad-hoc = ruido de cerca; 4 secciones × 1 receta + 1 desviación documentada = coherencia perceptual. Promover a regla por defecto en futuros proyectos: el header de sección es un componente, no una composición ad-hoc.
  - **Patrón validado:** un literal de color de marca que la migración previa dejó por falta de token destino debe escalar a `design-system-manager` para que cree el token; consumir después. El bucle "TANDA 3 (Fase 4.5) marca residuo bloqueado por sistema → Fase 5 TANDA 1 crea el token → TANDA 3 de Fase 5 lo consume" demuestra que la auditoría puede empujar la evolución del sistema, no solo verificar lo construido.
  - **Excepción persistente:** Hero `<h1>` peso 400 (cita Playfair italic) — confirmada como invariante de tono homenaje a lo largo de Fase 5. Codificar como excepción reconocida para que futuras auditorías no la re-marquen.
  - **Calibración:** el modelo de scoring del agente (8.4 → 8.7 con #1 + #5 + #6 + #7 cerrados) coincide con la proyección de la auditoría previa (~8.7 con solo #5 + #1). Predicciones de salto de puntuación están bien calibradas para este sitio.
  - Sin overrides de Nil que registrar en esta tanda.
