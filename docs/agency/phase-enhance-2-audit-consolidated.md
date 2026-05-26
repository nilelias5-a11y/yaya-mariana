# ENHANCE-2 — Audit consolidado

> **Fecha:** 2026-05-26
> **Rama / HEAD:** `origin/clasico` = `0a53c6c` (ENHANCE-1 completa)
> **Modo:** AUDIT-only. Ningún cambio de código aplicado en esta fase.
> **Auditores OLA paralela:** creative-director · visual-perfection · hero-specialist · footer-architect · animation-premium · typography-master · color-psychologist · easter-egg-creator · micro-copy-master.
> **Canónicos leídos por cada agente:** `nil-design-preferences.md` (CANÓNICO) + `phase-enhance-1-audit-consolidated.md` (qué ya está hecho — no duplicar).

---

## 0 · Resumen ejecutivo

- **96 propuestas formales** repartidas por 9 auditores, todas auditadas contra las reglas duras vigentes.
- **89 ADITIVAS / 7 MIXTAS.** Las 7 MIXTAs son todas reescrituras de copy (MC-B-01 a MC-B-07) y requieren firma explícita de Nil. Cero propuestas tocan paleta base, fondos, tipografía base, layouts o estructura. Cero propuestas tocan las secciones BLOQUEADAS (Grid productos interior, Grid beneficios Values 6 cards, CTA final rojo) — salvo perímetros y refinamientos no-estructurales explícitamente permitidos.
- **Filtro automático aplicado:** las 89 ADITIVAs pasan filtro y entran al pool de implementación. Las 7 MIXTAs quedan retenidas hasta gate Nil.
- **Convergencias detectadas:** 7 propuestas convergen entre 2 o más agentes (ver §3) — implementación única, crédito compartido.
- **Hallazgo crítico identificado por VP-03:** los hairlines top/bottom del StatsStrip propuestos en E1 (VP-#3, VP-#11) **NUNCA se aplicaron en el código actual**. El componente sigue con `py-14 px-6` plano. ENHANCE-1 cerró 6 commits pero este gesto se quedó en la propuesta.

---

## 1 · Distribución por categoría y prioridad

### 1.1 — Por auditor

| Auditor | Propuestas | ADITIVAs | MIXTAs | ALTA | MEDIA | BAJA |
|---|---|---|---|---|---|---|
| creative-director | 13 | 13 | 0 | 4 | 6 | 3 |
| visual-perfection | 13 | 13 | 0 | 3 | 6 | 4 |
| hero-specialist | 10 | 10 | 0 | 3 | 5 | 2 |
| footer-architect | 9 | 9 | 0 | 3 | 4 | 2 |
| animation-premium | 12 | 12 | 0 | 4 | 5 | 3 |
| typography-master | 12 | 12 | 0 | 5 | 5 | 2 |
| color-psychologist | 10 | 10 | 0 | 3 | 5 | 2 |
| easter-egg-creator | 3 | 3 | 0 | 2 | 1 | 0 |
| micro-copy-master | 14 | 7 | 7 | 3 (A) + 4 (B) | 4 (A) + 2 (B) | 1 (A) + 1 (B) |
| **TOTAL** | **96** | **89** | **7** | **31** | **43** | **22** |

### 1.2 — Por sección (cuántas propuestas tocan cada zona)

| Sección | # propuestas |
|---|---|
| Global / sistémica (cruza varias) | 13 |
| Nav | 7 |
| Hero | 15 |
| StatsStrip | 6 |
| AboutUs | 3 |
| Values | 2 |
| Products (perímetro) | 2 |
| CTA | 1 |
| Contact | 8 |
| Footer | 13 |
| Cart | 9 |
| Checkout | 9 |
| Alt-text Capa B | 1 |
| Microcopy reescritura (MIXTA) | 7 |

---

## 2 · Mapa por sección (todas las propuestas)

> Formato: `ID — Título · Tipo · Prioridad · Test La Nonna`
> Test La Nonna: ✓ = sí · ✓\* = sí con matiz · ✗ = no (diferencial Yaya específico, no descarta — solo no es importable a otros proyectos)

### 2.1 — Global / sistémica

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| CD-07 | `scroll-margin-top: 80px` global para anchors | ADITIVA | ALTA | ✓ |
| TM-01 | `text-wrap: balance` en H2 de sección | ADITIVA | ALTA | ✓ |
| TM-02 | `text-wrap: pretty` en párrafos | ADITIVA | ALTA | ✓ |
| TM-04 | `font-feature-settings: "calt"` en `.font-serif` global | ADITIVA | ALTA | ✓ |
| CP-01 | `::selection` terracota 18% | ADITIVA | ALTA | ✓ |
| CP-03 | `:focus-visible` outline terracota 55% | ADITIVA | ALTA | ✓ |
| EE-02 | Konami code → frase a Nil (3.2s, sessionStorage) | ADITIVA | ALTA | ✗ |
| TM-03 | `hyphens: auto` contextual | ADITIVA | MEDIA | ✓ |
| TM-05 | `font-optical-sizing: auto` + eje `opsz` | ADITIVA | MEDIA | ✓\* |
| TM-06 | `text-underline-offset: 3px` + `skip-ink: auto` en links | ADITIVA | MEDIA | ✓ |
| CP-05 | Scrollbar custom paleta (webkit + firefox) | ADITIVA | MEDIA | ✓ |
| CP-09 | `:visited` / `:active` tonal (maroon) | ADITIVA | MEDIA | ✓ |
| EE-03 | Quietud 28s → línea italic en esquina inferior izda. | ADITIVA | MEDIA | ✓\* |

### 2.2 — Nav

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| VP-01 | Scroll-state backdrop-blur + hairline terracota condensado | ADITIVA | ALTA | ✓ |
| HS-09 | Hairline scroll-fade (border+shadow invisibles en `scrollY=0`) | ADITIVA | ALTA | ✓ |
| VP-09 | Indicador activo de sección en scroll (underline permanente) | ADITIVA | MEDIA | ✓ |
| CD-03 | Mic separadores nav (versión estática segura) | ADITIVA | MEDIA | ✓\* |
| AP-07 | MobileNav + LanguageSelector easing warm-lux | ADITIVA | MEDIA | ✓ |
| CD-08 | Hover logo Nav `opacity-80` | ADITIVA | BAJA | ✓ |
| CP-10 | Nav gradient mesh cream→rosa pálido 35% extremo | ADITIVA | BAJA | ✓ |

### 2.3 — Hero

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| HS-01 | Aura logo respiración idle (loop 10s opacity 32→44%) | ADITIVA | ALTA | ✓ |
| HS-04 | Word-reveal escalonado en cita (énfasis paciencia/trabajo/amor) | ADITIVA | ALTA | ✓ |
| AP-01 | Scroll-cue auto-fade al primer scroll | ADITIVA | ALTA | ✓ |
| TM-09 | Smart quotes (`&ldquo;`/`&rdquo;`) en `hero.quoteText` | ADITIVA | ALTA | ✓ |
| HS-02 | Settle moment del grano post-carga (delay 1.4s, fade 1.8s) | ADITIVA | MEDIA | ✓ |
| HS-03 | Aura parallax scroll (18px desktop, off mobile) | ADITIVA | MEDIA | ✓\* |
| HS-05 | Cursor-following gradient sobre logo (desktop) | ADITIVA | MEDIA | ✓\* |
| HS-07 | CTA primario motion lift (`y:-2`, shadow elevada, gap expansivo) | ADITIVA | MEDIA | ✓ |
| HS-10 | Scroll-cue fade-out al scroll (AnimatePresence exit) | ADITIVA | MEDIA | ✓ |
| AP-06 | Hero aura respiración idle (token warm-lux, loop 10s) | ADITIVA | MEDIA | ✓ |
| TM-08 | Italic real explícito + OT completo en cita Hero | ADITIVA | MEDIA | ✓ |
| MC-A-07 | `hero.quoteAuthorTitle` tooltip glosa Mariana Elías | ADITIVA | MEDIA | ✗ |
| HS-06 | Em-dash refinado en `quoteAuthor` (Unicode + tracking) | ADITIVA | BAJA | ✓ |
| HS-08 | Hairline vertical entre columnas md+ (fade extremos) | ADITIVA | BAJA | ✓\* |
| AP-11 | Hero aura parallax 14px (variante conservadora de HS-03) | ADITIVA | BAJA | ✓\* |

### 2.4 — StatsStrip

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| VP-02 | Divisores verticales internos entre stats (md+) | ADITIVA | ALTA | ✓ |
| VP-03 | **Hairline top/bottom edge animado — hallazgo: E1 NUNCA aplicado** | ADITIVA | ALTA | ✓ |
| CD-02 | Hairlines top/bottom luz blanca pura (variante visual de VP-03) | ADITIVA | ALTA | ✓ |
| TM-07 | Resolver `onum` global vs `lnum` tabular | ADITIVA | ALTA | ✓ |
| AP-05 | Easing warm-lux + delay refinado + icono escalonado | ADITIVA | MEDIA | ✓ |
| TM-12 | Superíndice `.unit-suffix` para `%` y `h` | ADITIVA | BAJA | ✓\* |

### 2.5 — AboutUs

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| EE-01 | Ornamento ❦ respira (rotación + opacity sostenido ≥1.8s) | ADITIVA | ALTA | ✗ |
| CP-07 | Velo warm AboutUs 2% (pseudo-elemento `::before`) | ADITIVA | MEDIA | ✓\* |

### 2.6 — Values

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| VP-04 | Hairline superior sección sobre `#fdf0ef` | ADITIVA | MEDIA | ✓ |
| VP-05 | Eyebrow + hairline-rule centrado en header | ADITIVA | MEDIA | ✓ |

> **Nota:** ambas propuestas tocan **header/perímetro**, no las 6 cards (que siguen BLOQUEADAS).

### 2.7 — Products (perímetro, sin tocar grid)

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| CD-11 | Hairline respiro perímetro top de Products | ADITIVA | MEDIA | ✓ |
| VP-10 | Hairline en transición Products↓ / StatsStrip↑ | ADITIVA | BAJA | ✓\* |

### 2.8 — CTA

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| CD-04 | Hairline curvo SVG cierre CTA (eco Hero, rgba(245,198,194,0.18)) | ADITIVA | MEDIA | ✓ |

> **Nota:** solo aplicación de hairline decorativo en **borde superior** del CTA. Fondo rojo y estructura BLOQUEADOS — sin tocar.

### 2.9 — Contact

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| AP-04 | Inputs focus-glow warm terracota 12% | ADITIVA | ALTA | ✓ |
| CP-02 | `caret-color: #c0392b` en inputs | ADITIVA | ALTA | ✓ |
| AP-08 | Chips entrada escalonada (`.reveal` 0/100/200ms delay) | ADITIVA | MEDIA | ✓ |
| AP-09 | Submit button micro-lift (`y:-2` + shadow expansion) | ADITIVA | MEDIA | ✓ |
| TM-10 | Labels uppercase tracking 0.10em + `cpsp` | ADITIVA | MEDIA | ✓ |
| CP-04 | Placeholder color maroon 45% (suprime gris neutro) | ADITIVA | MEDIA | ✓ |
| CP-06 | Box-shadow segunda capa cream-rosa flanco superior | ADITIVA | MEDIA | ✓ |
| CP-08 | Velo neutro-fresco Contact maroon 2.5% | ADITIVA | BAJA | ✓ |

### 2.10 — Footer

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| FA-02 | Underline draw-in hover links nav (complementa `x:4` existente) | ADITIVA | ALTA | ✓ |
| FA-03 | Hairline separador 1px antes del bottom-row | ADITIVA | ALTA | ✓ |
| FA-06 | Micro-fade reveal inline `inMemoryHint` al hover/focus línea-tributo | ADITIVA | ALTA | ✗ |
| FA-01 | Divisores verticales inter-columna 1px rgba(255,255,255,0.06) | ADITIVA | MEDIA | ✓ |
| FA-04 | Halo cream-rosa hover logo | ADITIVA | MEDIA | ✓ |
| FA-05 | Focus ring social icons doble-capa terracota | ADITIVA | MEDIA | ✓ |
| FA-07 | Micro-grano 0.8% turbulence (coherencia con Contact 1.2%) | ADITIVA | MEDIA | ✓ |
| FA-08 | Fleuron `❦` tras año copyright | ADITIVA | BAJA | ✓ |
| FA-09 | Link Okawa: underline permanente + draw-in hover | ADITIVA | BAJA | ✓ |
| VP-12 | Hairlines verticales fantasma intercolumna (`rgba(255,255,255,0.05)`) | ADITIVA | BAJA | ✓ |
| AP-10 | Columnas easing warm-lux + delay base 0.15s | ADITIVA | BAJA | ✓ |
| TM-11 | `.tribute-line` OpenType `ss01 calt` | ADITIVA | BAJA | ✓\* |
| MC-A-06 | `footer.inMemoryHint` texto más completo (condicional UI tooltip) | ADITIVA | BAJA | ✗ |

### 2.11 — Cart

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| AP-02 | Cart badge micro-spring al añadir ítem (keyframe [1, 1.38, 0.92, 1.06, 1]) | ADITIVA | ALTA | ✓ |
| AP-03 | Drawer easing warm-lux entrada (520ms + salida warm-inout 320ms) | ADITIVA | ALTA | ✓ |
| CD-05 | `cart.emptyHint` microcopy capa A | ADITIVA | ALTA | ✓ |
| MC-A-01 | `cart.emptyHint` (es/ca/en) — converge con CD-05 | ADITIVA | ALTA | ✓ |
| MC-A-02 | `cart.ariaClose` (laguna a11y vs `cart.ariaOpen` existente) | ADITIVA | ALTA | ✓ |
| VP-06 | Drawer inset hairline header + footer (paper-card) | ADITIVA | MEDIA | ✓ |
| CD-13 | FAB micro-rebote primer ítem (spring stiffness ≤280) | ADITIVA | MEDIA | ✓\* |
| VP-11 | FAB hover easing refinado a warm-lux | ADITIVA | BAJA | ✓ |
| AP-12 | Drawer exit easing direccional + backdrop delay 40ms | ADITIVA | BAJA | ✓ |

### 2.12 — Checkout

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| CD-06 | `checkout.success.tributeHint` línea ornamental italic (aditiva pura, nueva clave) | ADITIVA | ALTA | ✓ |
| CD-09 | Microtextura papel turbulence 0.012 (eco AboutUs/Contact) | ADITIVA | MEDIA | ✓ |
| VP-07 | Fieldset legends con hairline-rule bajo label | ADITIVA | MEDIA | ✓ |
| VP-08 | Success card inset shadow + border (paper-card heredado Contact) | ADITIVA | MEDIA | ✓ |
| MC-A-03 | `checkout.processingHint` "Un momento — con cuidado" | ADITIVA | MEDIA | ✓ |
| MC-A-04 | `checkout.errors.genericHint` texto de apoyo con vía de acción | ADITIVA | MEDIA | ✓ |
| CD-10 | `document.title` "Un momento · Yaya Mariana" durante Stripe processing | ADITIVA | BAJA | ✓\* |
| CD-12 | Legends fieldset `font-feature-settings: "cpsp"` | ADITIVA | BAJA | ✓ |
| VP-13 | Back button warm-lux icono chevron `-translate-x-1` hover | ADITIVA | BAJA | ✓ |

### 2.13 — Alt-text (Capa B oculta)

| ID | Título | Tipo | Prio | La Nonna |
|---|---|---|---|---|
| MC-A-05 | `about.photoAlt1/2/3` enriquecidos con pasado verbal Mariana | ADITIVA | MEDIA | ✗ |

> **Matiz:** alt-text no rompe UI visual, pero usar pasado referido a Mariana requiere confirmación tonal de Nil (no es reescritura visible — pero es Capa B explícita en surface invisible).

---

## 3 · Convergencias (≥2 auditores sobre el mismo gesto)

Cuando 2 o 3 auditores llegan a la misma idea desde ángulos distintos, **se implementa una sola vez**, con crédito compartido. Las divergencias menores (timing, magnitud) se resuelven a favor de la opción más conservadora.

| # | Gesto | Auditores | Resolución |
|---|---|---|---|
| 1 | Hero aura respiración idle | HS-01 + AP-06 | Implementación única. AP-06 aporta los tokens warm-lux + duración 10s; HS-01 aporta el rango 32→44%. **Quedamos con la versión AP-06** (más alineada al sistema). |
| 2 | Scroll-cue auto-fade al scroll | HS-10 + AP-01 | Implementación única. AP-01 más completa: añade el camino de re-entrada al volver a top. **Quedamos con AP-01**. |
| 3 | Hero aura parallax scroll | HS-03 (18px) + AP-11 (14px) | Implementación única. **Quedamos con 14px** (más conservador, AP-11). Solo desktop. |
| 4 | Nav scroll-fade chrome | VP-01 + HS-09 | Implementación única. VP-01 más rica (backdrop-blur + hairline terracota condensado); HS-09 más simple (solo opacity del border+shadow). **Combinable**: HS-09 como base + VP-01 como capa adicional (hairline terracota + blur). |
| 5 | StatsStrip hairlines top/bottom | VP-03 + CD-02 | Variantes cromáticas distintas: VP-03 propone `rgba(231,76,60,0.18)` (terracota saturado); CD-02 propone `rgba(255,255,255,0.08)` (luz blanca pura sobre oscuro). **Decisión de Nil**: 1 — terracota (VP-03) o 2 — luz blanca (CD-02). Más limpio = CD-02. |
| 6 | `cart.emptyHint` microcopy | CD-05 + MC-A-01 | Mismo gesto, redacción levemente distinta. Quedamos con la versión MC-A-01 (es/ca/en explícitos) y crédito compartido. |
| 7 | Cart FAB micro-rebote al añadir | AP-02 + CD-13 | Mismo gesto sobre badge + FAB. CD-13 sugiere keyframe distinto en el botón flotante; AP-02 sobre el badge numérico. **Combinable** — AP-02 para el badge, CD-13 para el FAB (gestos en planos distintos sobre el mismo evento). |
| 8 | Footer divisores intercolumna | FA-01 + VP-12 | Mismo gesto, FA-01 con alpha 0.06 vs VP-12 con alpha 0.05. **Quedamos con 0.06** (FA-01). |

---

## 4 · Filtro automático (ADITIVA pasa · MIXTA retiene)

### 4.1 — ADITIVAs aprobadas (89 — entran a pool de implementación tras gate de Nil sobre el conjunto)

Las 89 propuestas ADITIVA no tocan ninguna de las dimensiones bloqueadas (paleta, fondos, tipografía base, layouts, estructura) ni las 3 secciones BLOQUEADAS (Grid productos interior, Grid beneficios Values 6 cards, CTA final rojo). Pasan filtro automático. La aprobación por Nil del conjunto activa su entrada a tandas de implementación.

### 4.2 — MIXTAs retenidas (7 — requieren firma de Nil pieza por pieza)

| ID | Clave i18n | Cambio | Razón del cambio |
|---|---|---|---|
| MC-B-01 | `contact.sent` | Quitar `!` final (es/ca/en) | Exclamación → tono notificación marketing |
| MC-B-02 | `contact.sentSubtitle` | "24 horas" → "te leeremos pronto, con calma" | SLA contact-center vs voz Yaya |
| MC-B-03 | `checkout.success.title` | Quitar `!` final (es/ca/en) | Estado de éxito en tributo, sin alegría efusiva |
| MC-B-04 | `checkout.success.body` | "Gracias por tu compra" → "Gracias por confiar en nosotros" | Transaccional → tonal |
| MC-B-05 | `checkout.errors.generic` | "Error al procesar el pago" → "Algo no ha ido como esperábamos" | Consola técnica → voz de casa |
| MC-B-06 | `checkout.errors.cardLoad` | Pasiva técnica → 1ª persona + instrucción concreta | Coherencia voz |
| MC-B-07 | `hero.subtitle` | Quitar "tu abuela" del Hero | Saturación: "abuela" aparece 4× en los 2 primeros scrolls |

> **Nota MC-B-07:** la más subjetiva del bloque. `micro-copy-master` marca explícitamente que es candidata a debate — Nil puede preferir mantener la palabra "abuela" en el Hero por estrategia narrativa.

### 4.3 — Casos límite con matiz (ADITIVA pero con verificación previa)

- **MC-A-05** (alt-text con pasado de Mariana): ADITIVA porque no rompe UI visual, pero usa pasado verbal referido a Mariana como activo SEO/a11y. Requiere confirmación tonal de Nil.
- **MC-A-06** (footer.inMemoryHint extendido): condicional a que la UI del tooltip admita texto largo. Si no, mantener valor actual.
- **EE-02** (Konami code copy): copy a Nil "Ella estaría orgullosa de lo que has construido." — `easter-egg-creator` marca explícitamente que la copia exacta requiere confirmación de Nil.

---

## 5 · Hallazgos críticos (lo que el audit destapa más allá de las propuestas)

### 5.1 — Hairlines del StatsStrip propuestos en E1 nunca se aplicaron (VP-03)

E1 contenía VP-#3 y VP-#11 con un sistema de hairlines top/bottom para el StatsStrip. Al revisar el código actual (`src/components/stats-strip.tsx`), `visual-perfection` confirma que el componente solo tiene `py-14 px-6` sin ningún borde, hairline ni overlay. La propuesta se documentó pero no llegó al commit. Es el gap más visible entre lo que ENHANCE-1 prometió y lo que el HEAD entrega.

**Resolución sugerida:** integrar VP-03 (o CD-02, según decisión cromática de §3) en la primera tanda de ENHANCE-2.

### 5.2 — Tensión OpenType `onum` global vs `lnum` tabular (TM-07)

E1 declaró `font-feature-settings: "onum"` global en `.font-serif` y `.numerals-tabular` con `lnum`. Sin override explícito (`"onum" 0`), el `onum` puede ganar en cascade y los counters del StatsStrip pueden mostrar dígitos oldstyle (con bajantes) mientras se animan. La intención declarada en E1 fue lining para contadores — esta corrección de una sola línea cierra la ambigüedad.

### 5.3 — Cita Hero en straight-quotes (TM-09)

El `<p>` con `t.hero.quoteText` está envuelto en comillas straight ASCII. En `<blockquote>` de AboutUs se corrigió a `&ldquo;`/`&rdquo;` en E3, pero la cita del Hero sigue con straight. Es la única instancia de comillas planas restante en el sitio.

### 5.4 — Laguna a11y: `cart.ariaClose` no existe (MC-A-02)

`cart.ariaOpen` está en `translations.ts` pero no el equivalente de cierre. El componente actual probablemente lo tiene hardcoded en una sola lengua o lo deja vacío.

### 5.5 — `scroll-margin-top` ausente (CD-07)

Cuando el usuario navega vía nav anchors (`#productos`, `#sobre-nosotros`, `#contacto`), las secciones aterrizan pegadas al borde inferior del nav sticky (72px). Una línea de CSS resuelve el defecto.

### 5.6 — Saturación de "abuela" en los primeros dos scrolls (MC-B-07 + observación Bloque C-1)

`hero.subtitle` + `about.p1` ambos usan "abuela" en sentido universal (Capa A) en los primeros 2 scrolls. Las dos capas tonales (A universal vs B tributo a Mariana) corren riesgo de colapsar antes de que el lector llegue a la sección donde la Capa B se justifica. La propuesta MC-B-07 ataca el Hero; `about.p1` queda anotado para futura sesión.

---

## 6 · Sugerencia de tandas de implementación

Si Nil aprueba el conjunto, una secuencia razonable (basada en convergencias, riesgo cero, y mayor impacto perceptual con menor coste):

### Tanda T1 — Foundation tokens & global sweep
*Bajo riesgo, alto impacto en cohesión:*
- TM-04 (`calt` global), TM-07 (`onum` vs `lnum`), TM-09 (smart quotes Hero), TM-01 (text-wrap balance), TM-02 (text-wrap pretty)
- CP-01 (`::selection`), CP-03 (focus-visible outline), CP-02 (caret-color)
- CD-07 (scroll-margin-top global)
- MC-A-02 (`cart.ariaClose` laguna a11y)

### Tanda T2 — StatsStrip (cierra hallazgo crítico)
- VP-03 (o CD-02 según §3) — hairlines top/bottom (cerrar el E1 sin implementar)
- VP-02 (divisores verticales internos)
- AP-05 (easing warm-lux + delay + icono escalonado)
- TM-12 (superíndice `.unit-suffix` para `%`/`h`)

### Tanda T3 — Nav scroll-fade & chrome
- VP-01 + HS-09 combinados (backdrop-blur + hairline scroll-fade)
- VP-09 (indicador activo de sección)
- AP-07 (MobileNav + LanguageSelector easing warm-lux)
- CD-08 (hover logo opacity-80)

### Tanda T4 — Hero refinements
- HS-04 (word-reveal escalonado cita), AP-06 (aura respiración idle, descarta HS-01), AP-01 (scroll-cue auto-fade, descarta HS-10)
- HS-07 (CTA primario motion lift), HS-02 (settle moment del grano)
- TM-08 (italic real explícito + OT)
- MC-A-07 (`hero.quoteAuthorTitle` tooltip)

### Tanda T5 — Contact refinements
- AP-04 (focus-glow warm 12%), AP-08 (chips escalonados), AP-09 (submit lift)
- TM-10 (labels caps 0.10em + cpsp)
- CP-04 (placeholder maroon 45%), CP-06 (box-shadow 2ª capa cream)

### Tanda T6 — Cart + Checkout (heredan patrón Contact + microcopy aditivo)
- AP-02 + CD-13 combinados (badge spring + FAB rebote primer ítem), AP-03 (drawer easing entrada)
- VP-06 (drawer hairlines header/footer paper-card), VP-08 (success card paper-card), VP-07 (legends hairline-rule)
- MC-A-01 (`cart.emptyHint`), CD-06 (`checkout.success.tributeHint`), MC-A-03 (`checkout.processingHint`), MC-A-04 (`checkout.errors.genericHint`)
- CD-09 (microtextura papel Checkout), CD-12 (legends `cpsp`), CD-10 (`document.title` processing easter egg)
- VP-13 (back button chevron warm-lux), VP-11 (FAB hover easing)

### Tanda T7 — Footer refinements
- FA-02 (underline draw-in hover links), FA-03 (hairline antes bottom-row), FA-06 (inMemoryHint fade reveal inline)
- FA-04 (halo hover logo), FA-05 (focus ring socials), FA-07 (micro-grano 0.8%)
- FA-01 + VP-12 combinados (divisores intercolumna)
- FA-08 (fleuron ❦ copyright), FA-09 (link Okawa diferenciado), AP-10 (columnas easing warm-lux), TM-11 (`.tribute-line` OpenType)

### Tanda T8 — Decorativos seccionales (AboutUs, Values, Products, CTA)
- EE-01 (ornamento ❦ respira), CP-07 (velo warm AboutUs 2%), CP-08 (velo neutro-fresco Contact 2.5%)
- VP-04 (Values hairline superior), VP-05 (Values eyebrow hairline-rule)
- CD-11 (Products perímetro hairline), VP-10 (junta Products↓/StatsStrip↑)
- CD-04 (CTA hairline curvo eco Hero)

### Tanda T9 — Sistema fino & easter eggs
- TM-03 (hyphens auto), TM-05 (font-optical-sizing + opsz), TM-06 (text-underline-offset + skip-ink)
- CP-05 (scrollbar custom), CP-09 (:visited/:active tonal), CP-10 (Nav gradient mesh)
- EE-02 (Konami code) — requiere confirmación copy Nil
- EE-03 (Quietud 28s)

### Tanda T10 — Microcopy MIXTA (gate Nil pieza por pieza)
- MC-B-01 (sent sin "!"), MC-B-02 (sentSubtitle voz Yaya), MC-B-03 (success.title sin "!"), MC-B-04 (success.body confiar), MC-B-05 (errors.generic warm rewrite), MC-B-06 (errors.cardLoad 1ª persona), MC-B-07 (hero.subtitle quitar "abuela")
- MC-A-05 (alt-text Capa B pasado Mariana) — confirmación tonal Nil
- MC-A-06 (`footer.inMemoryHint` extendido) — condicional UI tooltip

> **Nota:** el orden T1→T10 es una sugerencia, no un plan cerrado. Nil puede reorganizar, descartar tandas enteras, o ejecutar varias en paralelo si el reduced-motion gate y el tsc/build siguen verdes.

---

## 7 · Aprendizaje meta (para `learning-loop-v2`)

- **OLA paralela de 9 auditores en modo AUDIT funciona.** 96 propuestas en una sola pasada, cero violaciones de reglas duras, 7 convergencias detectables vía comparación cruzada. Coste de orquestación bajo gracias a la separación clara de focos.
- **El test "se vería en La Nonna" es un filtro robusto.** Propuestas que no pasan el test son explícitamente diferenciales del proyecto Yaya (capa B tributo) — eso no las descarta, las clasifica como "exclusivo del proyecto" (categoría útil cuando se compare con otros sitios en el catálogo).
- **El hallazgo crítico de VP-03 (E1 propuesto-no-aplicado) sugiere instaurar un gate "implementation-vs-spec audit"** al cierre de cada fase: comparar lo prometido en el doc consolidado con el HEAD actual antes de declarar la fase completa.
- **Convergencias entre auditores son una señal positiva.** Cuando 3 agentes llegan al mismo gesto desde ángulos distintos (HS-01 + AP-06, HS-10 + AP-01, FA-01 + VP-12), la propuesta tiene robustez de marco — más confianza para aplicar primero.
- **El bloque B de `micro-copy-master` es la única zona con MIXTAs.** Toda otra dimensión queda dentro de aditivo. Esto valida que la decisión de Nil de bifurcar capas técnica y visual (mayo 2026) sigue rindiendo: 92.7% de las propuestas pasan filtro automático.

---

*Documento generado por consolidación cross-referenced de 9 archivos `phase-enhance-2-{rol}.md`. Cero código modificado en esta fase.*
