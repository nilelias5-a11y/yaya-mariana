# Fase 1 — Briefing · Reporte Consolidado
**Proyecto:** Yaya Mariana
**Branch:** `clasico` (modo AUDIT)
**Tono:** Homenaje (HARD RULE — no marketing)
**Fecha:** 2026-05-20
**Agentes ejecutados (paralelo):** requirements-analyst · ux-researcher · seo-analyst

---

## 1. Diagnóstico transversal (los 3 agentes convergen aquí)

> El `clasico` está bien construido como **commerce site con guarnición de abuela**. Para ser un **homenaje a Mariana** necesita rewrite tonal quirúrgico, no estructural. La restraint Awwwards-tier que el competitor-killer pidió por razones estéticas resulta ser el mismo movimiento que pide el tono homenaje — convergencia útil.

Tres pivotes resuelven el 80% del problema tonal sin tocar arquitectura:
1. **AboutUs** se re-orienta como ancla emocional con primera persona + pasado sobre ella
2. **Toda CTA** baja la urgencia comercial a un registro compatible con memorial sin matar conversión
3. **Hero traceability chip + StatsStrip numerics** se tratan como *prueba quieta* en vez de *diferenciadores ruidosos*

---

## 2. Marco tonal formalizado (de requirements-analyst — usado por todo Fase 4+)

### Voz
Gentle · dignified · present-but-quiet · specific over poetic · primera persona donde tenga sentido · DOS capas tonales mantenidas separadas (A=warmth universal · B=tributo específico).

### Reglas de tiempo verbal (HARD)
- Sobre Mariana → **pasado** (cultivaba, ponía, guardaba, escogía, enseñó)
- Sobre la continuación del proyecto → **presente** (seguimos, llevamos, cuidamos)
- Sobre el producto actual → **presente** (Recogidas, están en su punto)
- **NUNCA**: presente narrativo sobre Mariana (asume viva), conditional "le pondría tu abuela" como si fuera metáfora cuando la Mariana real *sí lo hacía*.

### Vocabulario DO (ES)
cultivaba · ponía · guardaba · escogía · enseñó · seguimos · cuidamos · recogemos · la víspera · el punto · la paciencia · el cuidado · firme · aromática · en su punto · con calma

### Vocabulario DON'T (banned en homenaje)
descubre · descubrir · experimenta · vive · prueba (imperative-hype) · mágico · increíble · excepcional · irresistible · "no te pierdas" · "última oportunidad". EN: discover · experience · magic-of · savor. CA: descobreix · prova (hype) · viu l'experiència. **Sin emoji ningún sitio** (incluido `✅` en success states).

### Asignación Capa A vs Capa B por sección
| Sección | Capa | Notas |
|---|---|---|
| Hero | A only | Calor universal, sin tributo explícito en H1 |
| StatsStrip | Neither | Solo numérica |
| Products | A only | Warmth universal, sin "en memoria" |
| AboutUs | **B** | EL slot de tributo. Pasado + primera persona |
| Values | A only | |
| CTA | A only | Sin "ven a conocerla" ni urgency |
| Contact | A only | Sin emoji |
| Footer | A + una pequeña línea B | "En memoria de Mariana" pequeño en copyright |
| Cart | Neither | Comercial puro |

---

## 3. Audit tonal de `translations.ts` (22 líneas flagged)

**8 REWRITE · 7 ADJUST · 7 KEEP.** Los 5 más impactantes (candidatos del requirements-analyst — la copy final es del copywriter en Fase 4):

| # | Key | Actual | Candidato |
|---|---|---|---|
| 1 | `hero.subtitle` | "...cultivadas con el mismo cariño que le pondría tu abuela..." | "Recogidas en Tarragona · Mágnum, Dream y 1525 · sin pesticidas, en su punto." |
| 2 | `about.p1` | "Yaya Mariana nació de la pasión por las fresas de calidad..." | "Mi yaya Mariana cuidaba sus fresas con la calma de quien sabe que lo bueno no tiene prisa. Recogía cada una en su punto, las guardaba para los nietos, y nos enseñó que una fresa buena no se hace, se cuida. Seguimos su forma en Tarragona — sin pesticidas, sin prisa, con la misma paciencia que ella ponía." |
| 3 | `about.quote` | "Mi abuela me enseñó que las mejores fresas son las que se recogen con amor y se comen el mismo día." | "Mi yaya Mariana me enseñó que una fresa buena no se hace, se cuida." |
| 4 | `cta.title` | "¿Listo para probar las fresas de Yaya Mariana?" | "Fresas de Tarragona, cuando están en su punto." + botón "Pedir esta cosecha" |
| 5 | `about.titleEm` | "cultivado con amor" | "Lo que ella cultivaba, seguimos cuidando" |

---

## 4. UX — los 5 dolores más caros (a pasar a Fase 4.5)

1. **`/checkout target="_blank"` en TODOS lados** (Products card, AboutUs, CTA, Footer) — fuga de cart context · CRITICAL · conversion-funnel-optimizer + frontend-developer
2. **AboutUs reads como commerce con grandmother-skin** — necesita rewrite primera-persona + pasado · CRITICAL · copywriter + image-curator
3. **Reduced-motion ausente** en MeshGradient, AnimatedValue, Typewriter, framer-motion entrances · HIGH · accessibility-perfectionist + animation-premium
4. **Cart sheet con strings ES hardcoded** ("Tu cesta", "Eliminar", "Subtotal", "Envío", "Ir a pagar") — Pau (CA) y Ana (EN) se topan con ES en checkout · HIGH · frontend-developer + translator
5. **Contact form fake submit con promesa "respondemos en 24h"** sin backend · HIGH · copywriter (interim) + fullstack-developer (cuando Resend)

Honorable mentions ya en triage (StatsStrip `+`, CA en `stats.labels` ES, Lechugas title): pre-aprobados por Nil para Fase 4.

---

## 5. Validación UX de los 18 puntos del Beat-them plan

**0 HIGH risk bloqueante · 5 MED con ajuste tonal claro · 13 LOW.**

Ajustes tonales clave que ux-researcher añade al plan:
- **#2 (Hero chip):** 12-13px, color secundario, SIN animación, abajo del quote → es footnote, no headline
- **#3 (StatsStrip):** suavizar peso visual (font menor, sin hover-brightness, count-up más lento) → números bien, staging muy ruidoso al lado del Hero
- **#4 (AboutUs):** pasado para Mariana / presente para J. Elías / específico > abstracto / retrato fallback = ilustración minimal o tipografía, **NUNCA IA**
- **#15 (Waitlist):** copy "primeras Mágnum estén listas" NO "Mariana esté en temporada" (sería tratarla como producto) · double-opt-in con consent unticked-by-default
- **#18 (Easter egg Mágnum):** SOLO petal/leaf · DROP la variante "yaya's hands bloom" · reduced-motion skips

---

## 6. SEO — estrategia desde cero (yayamariana.es)

### Clusters P1 (envíos en Fase 4.5)
| Cluster | Keywords | Dif. | Sección |
|---|---|---|---|
| **C2 Provenance Tarragona** | "fresas Tarragona", "maduixes Tarragona" | LOW | Hero · AboutUs · Footer |
| **C4 Variedades nombradas** (uncontested) | "fresa Mágnum / Dream / 1525" | VERY LOW | Products H2/cards · Product schema |
| **C6 Catalan-native** (moat) | "maduixes Tarragona", "maduixes ecològiques Catalunya" | VERY LOW | CA `<title>` · CA Hero · CA Footer |
| C8 Brand defensive | "Yaya Mariana fresas" | TRIVIAL | All `<title>` |

### Top 5 cambios on-page (candidatos exactos)
1. **`<title>` ES:** `Fresas frescas de Tarragona | Yaya Mariana` (43 chars). CA/EN parity.
2. **`<meta description>` ES:** `Fresas Mágnum, Dream y 1525 cultivadas en Tarragona sin pesticidas. Recogidas y enviadas en 24-48h, directas a tu mesa. Cosecha propia, en su punto.` (149 chars). **CERO "homenaje" / "memoria"** en meta.
3. **Catalán en ES `stats.labels`** → ES limpio (ya en triage)
4. **Products H2 / eyebrow:** `Mágnum · Dream · 1525` + cards renombradas `Fresas Mágnum`, `Fresas Dream`, `Fresas 1525` → captura cluster C4 con una sola edit
5. **OG + Twitter card:** locale matrix `es_ES` default + `ca_ES` + `en_GB` alternate; OG image = hands + Mágnum (NO cara fundador, NO logo legacy, NO investor identity)

### JSON-LD a embarcar (P0)
- **Organization** (1 global) — `founder: "J. Elías, fundador"` como STRING (NO Person node), email con guion, address Badalona, phone placeholder, `sameAs: [@layayamariana]` solo
- **Product × 3** (uno por variedad) — `name`, `description`, `image`, `brand`, `category`, `sku`, `offers` EUR, `availability` dinámico por temporada (`InStock`/`PreOrder` con `availabilityStarts`)
- **SKIP**: BreadcrumbList (no hay jerarquía), WebSite/SearchAction (sin search), FAQPage (sin FAQ), Person founder (invitaría a identity expansion), AggregateRating (sin reviews reales)

### HARD GATES para Fase 4.5 (seo-genius)
1. Zero `"homenaje" / "memoria" / "tributo"` en title / meta / OG / schema / alt / H1-H3
2. Zero expansions de `"J. Elías"` anywhere · Zero Person schemas
3. Zero refs a `yayamariana.com` / Audax / Linverd / lechugas / hidropónico en código o HTML
4. "Tarragona" en ≥5 superficies por locale · "sin pesticidas" en Values + Products + CTA + meta · variedades visibles como H2/eyebrow

---

## 7. Decisiones NUEVAS para Nil (aparecidas en Fase 1)

| # | Decisión | Origen | Rec. |
|---|---|---|---|
| **A** | **hreflang option A** (locale routing `/es` `/ca` `/en` con next-intl o App Router) **vs B** (single route, pierde moat catalán) | seo-analyst MAJOR | **A** — unlocks Catalan SEO moat (cluster C6) que NINGÚN competidor tiene |
| B | Reduced-motion missing como **bug pre-aprobado** vs **Fase 4.5 a11y** | ux-researcher CRITICAL | Tratarlo en Fase 4.5 con accessibility-perfectionist (no urgente quirúrgico, requiere audit completo) |
| C | Cart sheet i18n: ¿Phase 4 quirúrgico (corto plazo) o Phase 4 + redesign drawer (más limpio)? | ux-researcher HIGH | Phase 4 quirúrgico — añadir strings al `translations.ts` + reemplazar hardcodes |
| D | Contact form copy interim: "respondemos en 24h" mientras no haya backend | ux-researcher HIGH | Suavizar a "Te leeremos pronto" hasta integrar Resend |

---

## 8. Banderas REFINADAS (decision-tree para conversación con familia)

requirements-analyst formalizó las preguntas concretas para tu conversación con familia:

### Bandera 1 + 2 (foto Hero + retrato AboutUs)
**Preguntas para familia:**
1. ¿Existe alguna foto de archivo de las manos de la abuela Mariana? ¿O foto de ella en general?
2. Si existe, ¿la familia da consentimiento para uso digital en este proyecto?
3. ¿Hay alguna foto antigua donde sus manos sean protagonistas (cocinando, en huerto, etc.)?
4. Si no hay foto, ¿la familia prefiere ilustración minimal o tipografía-only con su nombre?
5. ¿La familia desea revisar el AboutUs antes del lanzamiento, como cortesía?
6. ¿Hay una fecha significativa (cumpleaños, aniversario) que la familia quisiera marcar en el lanzamiento o como marker interno?
7. ¿Hay una frase / receta / recuerdo específico de Mariana que la familia quiera incluido (o explícitamente excluido)?

### Bandera 4 (Resend waitlist) — sub-decisiones técnicas
- Account Resend (tuyo, equipo, agencia?)
- Domain auth (SPF/DKIM/DMARC) sobre `yayamariana.es` o sobre `yaya-mariana.com` (el del email)?
- Confirmation email firmado por `"J. Elías, fundador"` (NO "Equipo Yaya Mariana" — el tono está hecho)
- Data retention default 30 días
- Resend Audiences (su CRM ligero) vs. base de datos propia?

### Bandera 5 (chip Hero) — sub-decisión técnica
- JSON file `src/data/harvest.json` editado en GitHub vs. mini-CMS (Sanity/Strapi)
- Comportamiento off-season: ¿chip oculto, o muestra "próxima cosecha: marzo 2027"?

---

## 9. Riesgos identificados (consolidados)

| # | Riesgo | Prob/Impact | Mitigación |
|---|---|---|---|
| 1 | Familia declina toda fotografía | MED/HIGH | **Fase 1.5 debe producir EN PARALELO mood-board photograph-Hero Y typography-only-Hero** — la conversación con familia no reinicia diseño |
| 2 | Joan Carles entrega precios reales tarde | MED/MED | Centralizar precios en `src/data/products.ts` · Stripe Price IDs en env vars · swap documentado en deploy-checklist |
| 3 | Integración Resend retrasada | LOW/MED | Fallback v1: CTA off-season muestra fecha + `mailto:` link |
| 4 | Filtración firewall narrativo | LOW/CRITICAL | Phase-8 quality-gate grep en `/src`, `/public`, build deployado · cada agente Phase-4+ confirma firewall en su phase report |
| 5 | Tono tributo diluido por agentes downstream | MED/MED | Phase-5 style-guide-enforcer aplica §3 DON'T list como hard rule · Phase-8 quality-gate grep vocabulario banned |

---

## 10. Deliverables Fase 1

```
C:\proyectos\yaya-mariana\docs\agency\
├── phase-1-report.md                         ← este reporte consolidado
├── phase-1-requirements-analyst-brief.md     (~400 lines)
├── phase-1-ux-researcher-audit.md            (~350 lines)
└── phase-1-seo-analyst-keyword-strategy.md   (~400 lines)
```

## 11. Memory updates

```
~/.claude/agencia-web-v2/memory/
├── requirements-analyst-memory.md      (creado — homage-tone framework + decision-tree pattern)
├── ux-researcher-memory.md              (creado — tribute-site UX psychology + restraint-as-conversion-lever)
└── seo-analyst-memory.md                (creado — no-memorial-keyword rule + Catalan moat + single-page canonical)
```

---

## 12. Próxima fase

**Fase 1.5 — Mood Board** (mood-board-creator · creative-director · color-psychologist):
- DEBE producir EN PARALELO direcciones photograph-Hero Y typography-only-Hero (mitigación Riesgo 1)
- DEBE validar la paleta cream `#fdf6f5` + strawberry-red + 1 neutral (Beat-them #5) bajo lens homenaje
- DEBE definir el visual language de restraint Awwwards-tier traducido a tono memorial
- Heredan el marco tonal §2 como restricción dura

**Bloqueador de Fase 4.5/5** pendiente decisión Nil:
- (A) hreflang option A vs B — sin decisión no hay rutas locale
- (B-D) los 3 ajustes de §7 — los recoge requirements-analyst en el brief

Esperando confirmación director.
