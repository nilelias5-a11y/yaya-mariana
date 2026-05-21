# Fase 2.5 — Wireframes · Reporte Consolidado
**Proyecto:** Yaya Mariana
**Branch:** `clasico` (modo AUDIT)
**Tono:** Homenaje (HARD RULE — no marketing)
**Fecha:** 2026-05-21
**Agentes ejecutados (paralelo):** ux-designer (capa IA/estructura/flujos) · prototype-designer (capa wireframe construible)
**Estado:** APROBADO por Nil — gate 2026-05-21

---

## 1. Resultado de la fase

La IA de 9 secciones del `clasico` está **sana**. Los wireframes de Fase 2.5 **no mueven ni añaden ninguna sección** respecto al `page.tsx` actual (`Hero · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer · Cart`). El único cambio de *layout* real es la columna derecha del Hero. Todo lo demás son cambios de contenido, de peso visual/motion, o inserciones dentro del chrome existente. Coherente con modo AUDIT.

**Veredictos por sección:** 1 MANTENER · 4 REORGANIZAR · 4 REESCRIBIR. Ningún REESCRIBIR es rediseño de arquitectura.

---

## 2. Decisiones ratificadas por Nil (gate 2026-05-21)

| # | Decisión | Resolución | Impacto en wireframes |
|---|---|---|---|
| 1 | Aprobación de los 9 wireframes | **APROBADOS** | Se consolida la Fase 2.5; desbloquea Fase 3/4 |
| 2 | Navegación móvil (hoy inexistente en `<768px`) | **Hamburguesa mínimo autorizado** — cambio estructural excepcional dentro de AUDIT | Nav móvil gana un menú hamburguesa sobrio. `t.nav.menu` ya tiene los datos (`label`, items, subtitles) hoy sin usar |
| 3 | Chip de trazabilidad en Hero (Tarragona · variedad · semana ISO) | **Solo en Products** — se retira del Hero | Hero queda Capa-A pura: cita + línea de variedades, sin elemento comercial. Beat-them #2 se funde en Products junto a #7 |
| 4 | Filtro Products `[Todas][Premium]` (no filtra nada) | **Reetiquetar por variedad** (Mágnum/Dream/1525) | Filtro funcional; además captura el cluster SEO C4 ("fresa Mágnum/Dream/1525") |

---

## 3. Wireframes página por página (ACTUAL → PROPUESTO, con decisiones aplicadas)

> Leyenda: `··`=se mantiene · `▲`=mover/ajustar · `✕`=quitar · `✚`=añadir · `⚠`=contradicción flagged

### ① HERO — REORGANIZAR · Capa A

Único cambio de layout. La columna derecha hoy renderiza `logo-nuevo.jpg` 380×380 — el **mismo archivo** que el logo del nav 16px arriba (defecto documentado en `phase-2-comparison §54`).

```
ACTUAL                                  PROPUESTO (gate aplicado)
┌─ NAV h72 ───────────────────────┐    ┌─ NAV h72 ─────────────────────────┐
│ (logo) Inicio·Prod·Contacto      │    │ (logo)·· Prod·Sobre·Contacto      │
│              [ES▾] [Ver tienda]  │    │            [ES▾]·· [Ver tienda]·· │
│  ✕ móvil: nav vacío               │    │  ✚ móvil: HAMBURGUESA mínimo      │
├─ ███ MeshGradient animado ███ ───┤    ├─ ░ cream plano · MeshGradient ⚠ ──┤
│ ┌── 55% ──────┐┌── 45% ────────┐ │    │ ┌── 55% ──────┐┌── 45% ──────────┐│
│ │ eyebrow      ││ ( LOGO 380×380 │ │    │ │ eyebrow··    ││ ┌ SLOT 380×380 ┐││
│ │ === cita H1 ││  ✕ DUPLICADO  )│ │    │ │ === cita <h1>││ │ PATH T (def):│││
│ │ —Yaya Mariana│                │ │    │ │ —Yaya Mariana││ │ "Mágnum·Dream│││
│ │ ──deco──     ││               │ │    │ │ ✚ línea vars ││ │  ·1525" typo │││
│ │ [Ver fresas] ││               │ │    │ │ ──deco·· ──   ││ ├··············┤││
│ │ [Historia]   ││               │ │    │ │ [Ver fresas]·││ │ PATH P (swap)│││
│ └──────────────┘└───────────────┘ │    │ │ [Historia]·· ││ └──────────────┘││
└──────────────────────────────────┘    │ └──────────────┘└────────────────┘│
                                          └────────────────────────────────────┘
```

- **Se mantiene:** grid 55/45, entrada por la *cita* en Playfair italic (NO sustituir por headline transaccional), eyebrow, los 2 botones.
- **Cambia:** logo duplicado → **slot 380×380 P/T** (hoy bloque tipográfico "Mágnum · Dream · 1525"; mañana foto sin tocar estructura). `✚` línea de variedades. `✚` hamburguesa móvil (decisión #2). El titular de la cita pasa a ser `<h1>` real (ver §6, H6). **El chip de trazabilidad NO entra en el Hero** (decisión #3).
- **Beat-them aterrizados:** #8 (statement tipográfico variedades), #9 (logo WebP/AVIF), #11 (mobile pass + tap targets), #12 (cerrar `target=_blank` del nav), #6 (reduced-motion).

### ② STATSSTRIP — REORGANIZAR · Capa Neither

- **Se mantiene:** banda oscura como quiebre de ritmo, grid 4-col / 2-col móvil, count-up.
- **Cambia:** el stat `"+"` se renderiza **literalmente roto** (la regex de `AnimatedValue` no matchea valores no-numéricos) → numéricos *craft* (Brix · `<24h` · 3 variedades · 0 pesticidas). Labels en ES limpio (hoy 2 de 4 en catalán). Peso visual suavizado (font ~2.6rem, sin hover brightness/scale, count-up más lento). **Beat-them #3, #6.**

### ③ PRODUCTS — REORGANIZAR · Capa A

```
Card ACTUAL                    Card PROPUESTA
┌──────────────┐               ┌──────────────────┐
│ (carousel 4) │               │ (carousel 4)··    │
│ [Premium]+shine│             │ ✚[MÁGNUM] variedad│
│ Fresas        │               │ === Fresas Mágnum │ ← rename SEO (C4)
│ desc··        │               │ ✚ "firme·aromática│
│ 7.5€ [Ver más↗]│             │ ✚ ⌖ Finca·sem 18  │ ← chip traza (#2 + #7)
│ [Añadir]··    │               │ 7.5€ [Ver más] ⚠  │
└──────────────┘               │ [Añadir]··        │
                                └──────────────────┘
```

- **Se mantiene:** la sección más fuerte del build — carousel, grid 1/2/3-col, controles de cantidad, parallax/shine (con gating reduced-motion).
- **Cambia:** `✚` badge de **variedad** (sustituye al genérico "Premium"). `✚` descriptor sensorial. `✚` chip finca/semana/variedad — **aquí aterriza ahora también el contenido del antiguo chip Hero** (decisión #3: Beat-them #2 se funde con #7). `"Ver más"` pierde `target="_blank"` y deja de prometer detalle inexistente. **Filtro reetiquetado a Mágnum/Dream/1525** (decisión #4). Carousel: auto-rotate gateado en touch, flechas visibles en touch. Easter egg #18: solo pétalo/hoja, reduced-motion skip. **Beat-them #1, #2, #7, #12, #13, #6, #11, #18.**

### ④ ABOUTUS — REESCRIBIR (tonal + estructural) · **Capa B** (único slot de tributo)

- **Se mantiene:** contenedor 720px centrado, blockquote, atribución `"J. Elías, fundador"` (HARD — sin expansión de iniciales).
- **Cambia (tonal):** copy en 1ª persona, **pasado** para Mariana / **presente** para la continuación — hoy lee como "commerce con grandmother-skin" (dolor CRITICAL §4.2 de `phase-1-report`). **Cambia (estructural):** `✚` slot visual de retrato — fallback ilustración minimal o tipografía, **NUNCA imagen IA**. Placement del slot por confirmar (inline junto al blockquote = menor cambio de layout = preferido por AUDIT). `target="_blank"` del CTA → misma pestaña. La copy final es del copywriter en Fase 4. **Beat-them #4, #12, #17.**

### ⑤ VALUES — MANTENER TAL CUAL · Capa A

Grid 6-card, iconos sobrios, registro correcto. Único cambio obligado: heredar gating `reduced-motion` y suavizar el `rotate-[10deg]` juguetón del icono en hover. Es la superficie "amor de abuela universal" — no sobre-trabajar (robaría peso a AboutUs). **Beat-them #6.**

### ⑥ CTA — REESCRIBIR (tonal) · Capa A

- **Se mantiene:** el quiebre con fondo oscuro, H2 grande, 4 trust badges, 2 botones.
- **Cambia (tonal):** H2 fuera del registro pregunta-anuncio ("¿Listo para probar…?" — "probar" imperativo está en el vocab DON'T). `✚` micro-bloque cold-chain ("víspera · refrigerado · 24-48h"). `✚` **variante off-season**: "Próxima cosecha: marzo" + captura de email con double-opt-in y consentimiento **desmarcado por defecto**. `"Comprar ahora"` → misma pestaña. `"Envío gratuito"` necesita umbral o se elimina. **Beat-them #14, #15, #12, #6.**

### ⑦ CONTACT — REESCRIBIR (tonal) · Capa A

- **Se mantiene:** layout 2-col info+form; los datos de contacto (dirección Badalona / email con guion / teléfono) son **untouchables**.
- **Cambia:** emoji `✅` (`contact.tsx:146`) → SVG checkmark de marca (replica el patrón correcto de `checkout.tsx`). Copy de éxito "respondemos en 24h" → suavizar a "te leeremos pronto" hasta que Resend esté live (Bandera D). El fake submit se registra para fullstack-developer. **Sin Beat-them directo** (dolor §4.5).

### ⑧ FOOTER — REORGANIZAR · Capa A + 1 línea B

- **Se mantiene:** estructura dark 4-col, socials, crédito "Diseño por Okawa", copyright auto-year.
- **Cambia:** el logo es un **hot-link a `yayamariana.com/wp-content/...`** (dominio legacy) → asset local (HARD GATE SEO: cero refs a `yayamariana.com`). Links de Empresa/Legal apuntan al dominio legacy abandonado → decisión necesaria (stub `.es` o `#`). `✚` press-strip *quiet-text* (sin logos hasta confirmar derechos). `✚` línea Capa B "En memoria de Mariana" junto al copyright — **única** superficie pública donde el tributo se nombra (jamás en title/meta/OG/schema). **Beat-them #9, #16.**

### ⑨ CART — REESCRIBIR (estructural / i18n) · Capa Neither

- **Se mantiene:** el sheet es correcto — FAB bien ubicado, slide-in, empty-state, controles de cantidad. `handleCheckout` ya hace `router.push` misma pestaña → **NO tocar, es el comportamiento correcto**; las otras entradas son las que se alinean a este.
- **Cambia:** **todos los strings hardcoded en ES** ("Tu cesta", "Eliminar", "Subtotal", "Envío", "Ir a pagar"…) y el componente no usa `useLanguage` → Pau (CA) y Ana (EN) topan con ES. Llevar strings a `translations.ts` (Bandera C: quirúrgico, sin redesign). `✚` `role="dialog"` + focus-trap. **Beat-them #11, #12.**

---

## 4. Las 4 preguntas del objetivo de Fase 2.5

### 4.1 Secciones que se mantienen tal cual
- **Values** (1) — único MANTENER pleno.
- Estructuralmente intactas también: el *layout* de Contact, el *layout* del Cart y la grid del Footer — solo cambia su contenido/strings, no su esqueleto.

### 4.2 Secciones que necesitan reorganización (sin perder lo que funciona)
- **Hero · StatsStrip · Products · Footer** (4) — reorganización = reordenar jerarquía / insertar elementos dentro del chrome existente. Ninguna es rediseño.

### 4.3 Reescritura — tonal vs visual vs estructural

| Sección | Tonal | Visual | Estructural |
|---|:---:|:---:|:---:|
| AboutUs | ✅ copy 1ª persona/pasado | — | ✅ slot retrato |
| CTA | ✅ H2 fuera registro-anuncio | — | ✅ variante off-season |
| Contact | ✅ copy success interino | ✅ emoji→SVG | — |
| Cart | — | — | ✅ i18n strings |
| StatsStrip | ✅ labels CA→ES | ✅ peso/motion | ✅ stat `+` roto |
| Products | ✅ descriptores | ✅ peso/motion | ✅ chips + filtro |
| Hero | — | ✅ slot P/T | ✅ hamburguesa + `<h1>` |

Ningún REESCRIBIR es rediseño de arquitectura: AboutUs y Cart son los únicos con componente estructural, y en ambos es *dentro* del contenedor existente (slot / strings), no reconstrucción.

### 4.4 Mapa de cambios para Fase 4 — clasificado por severidad

| ID | Sev. | Sección | Cambio | Tipo | Owner Fase 4 |
|---|---|---|---|---|---|
| C1 | CRITICAL | Products·AboutUs·CTA·Footer | Unificar 5× `target="_blank"`→`/checkout` (fuga de cart context) | estruct | conversion-funnel-optimizer + frontend-developer |
| C2 | CRITICAL | AboutUs | Rewrite tonal 1ª persona/pasado + slot retrato | tonal+estruct | copywriter + image-curator |
| C3 | CRITICAL | Cart | i18n: strings ES hardcoded → `translations.ts` + `useLanguage` | estruct | frontend-developer + translator |
| H1 | HIGH | global | Gating `prefers-reduced-motion` (MeshGradient, count-up, typewriter, framer) | visual/a11y | accessibility-perfectionist + animation-premium |
| H2 | HIGH | Contact | Copy "24h" sin backend → suavizar · emoji `✅`→SVG | tonal+visual | copywriter + frontend-developer |
| H3 | HIGH | StatsStrip | Stat `"+"` roto + labels CA-en-ES + numéricos craft | estruct+tonal | frontend-developer + copywriter |
| H4 | HIGH | Footer | Logo hot-link legacy → asset local · links a dominio legacy | estruct | frontend-developer + seo-genius |
| H5 | HIGH | Hero | Slot 380×380: logo duplicado → Path T tipográfico swappable | visual+estruct | hero-specialist + typography-master |
| H6 | HIGH | Hero | **La home no tiene `<h1>`** — el titular es un `<p>`. Verificado: únicos `<h1>` del repo en `checkout.tsx` | estruct/SEO | seo-genius + frontend-developer |
| M2 | MED | Hero | Línea tipográfica variedades "Mágnum · Dream · 1525" bajo la cita | visual | typography-master + hero-specialist |
| M3 | MED | Products | Chip finca/semana/variedad + descriptor sensorial (absorbe Beat-them #2, decisión #3) | tonal+visual | copywriter + visual-perfection |
| M4 | MED | CTA | Reescritura tonal H2 + micro-bloque cold-chain | tonal | copywriter + conversion-funnel-optimizer |
| M5 | MED | CTA | Variante estacional + captura email off-season + double-opt-in | estruct+tonal | conversion-funnel-optimizer + copywriter |
| M6 | MED | StatsStrip·Products·Cart | Suavizar peso visual: font-size, hover-brightness, shine-once, count-up lento | visual | visual-perfection + style-guide-enforcer |
| M7 | MED | Cart | Primer add-to-cart: auto-abrir sheet o toast (validar QA) + `role=dialog` + focus-trap | estruct | conversion-funnel-optimizer + accessibility-perfectionist |
| M8 | MED | Products | Carousel: auto-rotate gateado `hover:none`; flechas visibles en touch | estruct+visual | mobile-obsessor + animation-premium |
| M9 | MED | global (móvil) | **Construir hamburguesa mínimo** (decisión #2) — usa `t.nav.menu`, hoy sin usar | estruct | mobile-obsessor + frontend-developer |
| L1 | LOW | Hero·Footer | Pipeline logo WebP/AVIF, drop `unoptimized`, `priority` solo Hero | visual/perf | performance-optimizer + lighthouse-auditor |
| L2 | LOW | Hero·Products | Tap targets ≥44px (selector idioma, flechas carousel) | visual/a11y | mobile-obsessor |
| L3 | LOW | Footer | Press-strip quiet-text + línea Capa B "En memoria de Mariana" | tonal | copywriter |
| L4 | LOW | Products | Easter egg hover Mágnum — solo pétalo/hoja, reduced-motion skip | visual | easter-egg-creator + animation-premium |
| L5 | LOW | Products | Filtro reetiquetado a Mágnum/Dream/1525 (decisión #4) — refuerza cluster SEO C4 | estruct | frontend-developer + seo-genius |
| L6 | LOW | Values | Suavizar registro médico card 2 ("90% agua") — OPCIONAL, no bloquea | tonal | copywriter |
| L7 | LOW | Hero | Eyebrow `"Tarragona · Qualitat premium"` hardcoded con CA en ES | tonal | copywriter + frontend-developer |
| L8 | LOW | re-entrada | Verificar si `cart-context` persiste (localStorage) entre visitas | estruct | frontend-developer |

**Conteo:** 3 CRITICAL · 6 HIGH · 8 MED · 8 LOW.

*Notas de trazabilidad:* el antiguo ítem "M1 chip Hero" se elimina por decisión #3 — su contenido (Beat-them #2) se absorbe en M3 (Products). H6 es hallazgo nuevo de esta fase, verificado en código durante el gate.

---

## 5. Aterrizaje de los 18 puntos del Beat-them plan

Los 18 puntos aterrizan dentro de las 9 secciones existentes — **0 secciones nuevas** (coincide con `phase-0 §9`).

| # | Punto | Sección | Ajuste tonal aplicado |
|---|---|---|---|
| 1 | Badge variedad + descriptor sensorial | Products | — |
| 2 | Chip trazabilidad | **Products** (movido del Hero — decisión #3) | footnote 11-12px, secundario, sin animación |
| 3 | StatsStrip numerics craft | StatsStrip | peso visual suavizado |
| 4 | AboutUs 1ª persona + retrato | AboutUs | pasado/Mariana, presente/J.Elías, retrato NUNCA IA |
| 5 | Restraint sweep paleta 2-color | global | flag Fase 4 (visual-perfection) |
| 6 | IO entrances + reduced-motion | Hero·Products·AboutUs·Values | — |
| 7 | Chip finca + semana + variedad en card | Products | registro footnote |
| 8 | Hero typography statement variedades | Hero | una línea restraint |
| 9 | Pipeline logo WebP/AVIF | Hero·Footer | — |
| 10 | Contraste vs cream real | global | a11y — fuera de capa wireframe |
| 11 | Mobile pass + tap targets ≥44px | Hero·Products·Cart | — |
| 12 | Cerrar `/checkout target="_blank"` | Products·AboutUs·CTA·Footer | — |
| 13 | SEO H1/H2 long-tail + JSON-LD | Hero (H1)·Products (rename) | — |
| 14 | Micro-bloque cold-chain | CTA | microcopy, sin sección nueva |
| 15 | Off-season waitlist | CTA | "primeras Mágnum estén listas", consent unticked |
| 16 | Press-strip | Footer | dentro del chrome footer |
| 17 | Typography polish + firma | AboutUs | NO Yellowtail, NO expansión iniciales |
| 18 | Easter egg Mágnum hover | Products | SOLO petal/leaf, DROP "yaya's hands bloom", reduced-motion skip |

---

## 6. Contradicciones registradas (12 — de los agentes; gate las cierra o difiere)

| ID | Contradicción | Estado tras gate |
|---|---|---|
| C-emoji | Emoji `✅` en `contact.tsx:146` vs regla sin-emoji §2 | Confirmada → H2, Fase 4 |
| C-blank | `target="_blank"` → `/checkout` (5 ocurrencias verificadas) | Confirmada → C1, Fase 4 |
| C-cls | Slots de imagen placeholder sin garantía no-CLS (Hero P, retrato AboutUs) | El Briefing Fase 4 debe exigir `width/height`/`aspect-ratio` reservado |
| C-deco | MeshGradient animado · patrón de puntos Products · gradiente 3-stop CTA vs restraint sweep #5 | Diferida a Fase 4 (visual-perfection) — no bloquea el gate |
| C-typewriter | Typewriter del título de Products vs registro homenaje | Diferida a Fase 4 (ui-designer/visual-perfection) |
| C-badge | Badge "Premium" vs badge de variedad | Resuelta: badge pasa a variedad |
| C-filtro | Filtro `[Todas][Premium]` no filtra nada | **Resuelta — decisión #4: reetiquetar por variedad** |
| C-green | Estado "Añadido" usa verde puro `bg-green-500` fuera de paleta | Diferida a Fase 4 (style-guide-enforcer) |
| C-h2cart | `<h2>` en header del drawer Cart vs jerarquía de página | Fase 4 (accessibility-perfectionist) |
| C-navmob | Sin navegación en móvil `<768px` | **Resuelta — decisión #2: hamburguesa mínimo** |
| C-legacy | Logo footer remoto + links a dominio legacy `yayamariana.com` | Confirmada → H4, Fase 4 |
| C-h1 | El titular del Hero es un `<p>`; la home no tiene `<h1>` | **Confirmada en código → H6, Fase 4** |

---

## 7. Deliverables Fase 2.5

```
C:\proyectos\yaya-mariana\docs\agency\
├── phase-2.5-report.md                        ← este reporte consolidado
├── phase-2.5-ux-designer-wireframes.md         (ux-designer — IA, flujos, clasificación)
└── phase-2.5-prototype-designer-wireframes.md  (prototype-designer — wireframes de bloques, inventario, estados)
```

## 8. Memory updates

```
~/.claude/agencia-web-v2/memory/
├── ux-designer-memory.md         (actualizado — patrón audit-wireframe tribute-site)
└── prototype-designer-memory.md  (actualizado — slot swappable P/T, contradicción no-h1)
```

## 9. Próxima fase

**Fase 3 — UI Design + Design System** (`ui-designer` · `design-system-manager`) — traduce estos wireframes aprobados a specs de componente y tokens. Luego Fase 4 ejecuta el mapa de cambios §4.4 en orden de severidad.

**Pendientes que NO bloquean Fase 3:**
- Placement del slot de retrato de AboutUs (depende de la conversación con familia — Bandera 2).
- Path P del Hero — asset-gated, swap posterior fuera de ruta crítica.
- hreflang opción A vs B (`phase-1-report §7` decisión A) — bloquea Fase 4.5, no Fase 3.

Esperando confirmación del director para arrancar Fase 3.
