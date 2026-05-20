# Phase 1 — Requirements Document (Tribute Build)
**Project:** Yaya Mariana — premium artisanal fresas de Tarragona · tribute site in memory of Nil's grandmother
**Prepared by:** requirements-analyst
**Date:** 2026-05-20
**Mode:** AUDIT — surgical improvements inside the existing 9-section `clasico` build (Hero · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer · Cart). No rebuild, no new sections, no platform rewrites.
**Tone:** HOMAGE, NOT MARKETING. Gentle, dignified, present-but-quiet. Mariana was real and has passed; the site is the tribute.
**Narrative firewall:** founder rendered exclusively as `"J. Elías, fundador"`. Real investor identity OFF-LIMITS in any user-facing surface. Internal `docs/agency/` notes may mention; deliverable copy must not propagate.

---

## 1. Executive Summary

The Yaya Mariana build needs to land in a place no Spanish berry DTC currently occupies: a single-page artisanal e-commerce site that reads as a quiet tribute to a real grandmother who has passed, while still selling 500-g punnets of Mágnum/Dream/1525 strawberries from Tarragona. The current `clasico` codebase (8.2/10) is structurally right but tonally written under generic "abuela warmth" framing — every line that reads like an Instagram ad ("¡Listo para probar las fresas...?", "Conoce nuestra historia") will be re-written under the homage discipline before Phase-4 copywriter touches anything. The 18 Beat-them plan points are technically achievable inside the existing sections; this document validates each against the tribute tone (some compress, none break). Key tensions to flag: (a) the Hero "Killer Visual" hangs on a family-archive photograph that may not exist — Plan-B and Plan-C must be specified before Phase 2; (b) the AboutUs first-person founder narrative needs to honor *her* (past tense for Mariana, present for the continuation) without leaning on heritage-mythology Joselito-style copy the brand cannot truthfully claim; (c) the off-season "te avisamos" capture (Resend, RGPD, double opt-in) is the one new piece of infrastructure that did not exist in `clasico` and must be specified now so Phase-3 software-recommender can scope it. The "untouchables" (phone/email/address/prices/social/contact-form/logo) stay verbatim and out of every recommendation. Everything else is fair game for the surgical pass.

---

## 2. Functional Requirements

Baseline = current `clasico` AS-IS. Changes documented vs. that baseline.

### FR-1 — Single-page composition (UNCHANGED from AS-IS)
The site MUST render as a single scrolling page composed of nine sections in this fixed order: Hero · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer · Cart. No new sections in Phase 4. Any structural change escalates to MAJOR and requires Nil approval.

### FR-2 — Trilingual content parity (UNCHANGED structure, locale routing TBD)
Site MUST serve ES (default) / CA / EN with full content parity in `src/i18n/translations.ts`. The CURRENT switcher is a client-only React-context dropdown; the TARGET (per Beat-them plan #13) is `next-intl`-style `/`, `/ca`, `/en` routing with `<link rel="alternate" hreflang>` ES/CA/EN. Phase-3 software-recommender owns the recommendation; Phase-4 frontend-developer implements. The eyebrow "Tarragona · Qualitat premium" mixed-language phrasing is RESOLVED as intentional Catalan-rooted signal and stays in all three locales.

### FR-3 — E-commerce flow (UNCHANGED stack, MICROCOPY + funnel-coherence changes)
Site MUST support `add_to_cart` (existing context) → cart drawer (existing `<Cart />`) → `/checkout` (Stripe Checkout, existing `@stripe/react-stripe-js` 6.3 + `stripe` 22.1). CHANGE vs. AS-IS: `/checkout` MUST open same-tab (not `target="_blank"` — closes the cart-context leak; Beat-them point #12). Stripe publishable/secret-key wiring, success/cancel URLs respecting locale, and cart line-item integrity validated by Phase-3 payment-genius.

### FR-4 — Hero traceability chip (NEW microcopy, NO new section — Beat-them point #2)
Hero subtitle slot MUST render a live traceability line:
- ES: *"Recogidas en Tarragona · {variedad} · semana {ISO}"*
- CA: *"Collides a Tarragona · {varietat} · setmana {ISO}"*
- EN: *"Picked in Tarragona · {variety} · week {ISO}"*

Data source: a lightweight JSON file (path TBD, suggest `src/data/harvest.json`) with shape `{ variety: "Mágnum" | "Dream" | "1525", isoWeek: number, updatedAt: ISO-8601 }`. Nil updates per season manually (Bandera 5 RESOLVED). Phase-3 cms-builder confirms JSON-vs-tiny-CMS recommendation; default = JSON. ISO-week is computed in the component, not stored.

### FR-5 — Variety badges + sensory descriptor on product cards (NEW microcopy — Beat-them points #1 + #7)
Each of the three product cards (Mágnum · Dream · 1525) MUST display a variety badge + a 1-line sensory descriptor + a finca/cosecha/variedad chip (`"Finca Riudoms · semana 18 · Mágnum"`). Sensory descriptor copy candidates per variety pending Joan Carles confirmation for 1525.

### FR-6 — StatsStrip with craft-specific numerics (REPLACE current values — Beat-them point #3)
StatsStrip MUST render four numeric tiles with craft-specific values: *"≈9.5° Brix promedio"*, *"<24h del campo a tu mesa"*, *"3 variedades"*, *"0 pesticidas"*. The current `value: "+"` bug (regex mismatch) is RESOLVED by giving each tile a real numeric value compatible with the `AnimatedValue` regex `/^(\d+)(.*)$/`.

### FR-7 — AboutUs first-person tribute narrative (REWRITE — Beat-them point #4)
AboutUs MUST carry a first-person tribute narrative (≤90 words) attributed to `"J. Elías, fundador"`. Tone discipline per §4 of this document. PAST TENSE for Mariana ("cultivaba", "ponía", "guardaba"); PRESENT for the continuation ("seguimos su forma", "cada fresa lleva"). Portrait asset per Bandera 2 decision tree (§6 of this document).

### FR-8 — CTA section with cold-chain microcopy + off-season fallback (NEW microcopy — Beat-them points #14 + #15)
CTA MUST carry near-CTA microcopy: *"24-48h península · embalaje refrigerado · cosechadas la víspera del envío"* (tonally restrained — no exclamation, no urgency-architect hype). When out-of-season (Jul-Jan), CTA MUST surface a "Próxima cosecha: {mes}" date + an email capture for the off-season waitlist (FR-9).

### FR-9 — Off-season waitlist (NEW infrastructure — Beat-them point #15)
Site MUST support an email capture connected to **Resend** with **RGPD-compliant double opt-in** (Bandera 4 RESOLVED). Form fields: email (required), locale (auto from current locale), consent checkbox (explicit, unchecked by default, with link to Política de Privacidad). On submit: store opt-in record with timestamp + IP hash, send confirmation email with verification link, mark as confirmed on link click. Unsubscribe link in every email. Data retention policy: pending Phase-3 legal confirmation. Phase-3 software-recommender + payment-genius (Resend is not a payment provider but is the closest agent owner) scope; Phase-4 fullstack-developer implements with rate-limiting (La Nonna pattern in global-memory).

### FR-10 — Contact form (KEEP fake submit through Phase 4, wire to Resend in later phase)
Contact form's `setSent(true)` fake submit is an UNTOUCHABLE through Phase 4 (per Nil). Phase-4.5/5 fullstack-developer wires to Resend with rate limiting + Server Action (same pattern as FR-9), under explicit Nil greenlight.

### FR-11 — SEO infrastructure (NEW — Beat-them point #13)
Site MUST ship: a strawberry-positioned `<title>` and `<meta name="description">` (replacing the "Lechugas hidropónicas" vestige); full Metadata API surface (`openGraph`, `twitter`, `alternates.canonical`, `alternates.languages` ES/CA/EN, `robots`, `keywords`); `app/sitemap.ts`; `app/robots.ts`; `<link rel="alternate" hreflang>` ES/CA/EN; JSON-LD Product (× 3 varieties), LocalBusiness, Organization schemas; H1/H2 long-tail variants for "fresas Tarragona", "fresas Mágnum comprar online", "fresas sin pesticidas Catalunya". **HARD CONSTRAINT (narrative firewall):** no schema or OG metadata MAY expand `"J. Elías"` or reference the real investor identity.

### FR-12 — Logo asset pipeline (REPLACE — Beat-them point #9)
Logo MUST be converted to WebP/AVIF (artwork itself stays — "logo artwork untouchable" means the design, not the file format). Drop `unoptimized`. Set `priority` only on the Hero instance. Lazy-load nav logo. Stale `/public/logo-yaya.png.png` and `/public/Fotos Fresas.zip` removed from `/public`. Source artwork JPG kept as backup off-build.

### FR-13 — Press-strip in Footer (POSTPONED per Bandera 3)
Press-strip (El Mira · Diari de Tarragona · ElEspañol) is **postponed until publications exist as confirmed live coverage post-launch**. A placeholder slot stays in the Footer wireframe for future activation. Phase-4 does not implement.

### FR-14 — Subtle easter egg on Mágnum hover (NEW — Beat-them point #18)
On Mágnum product card hover/long-press, a single petal/leaf bloom (≤1s, single rAF, `prefers-reduced-motion: reduce` → no animation) renders in the card corner. Strictly no-emoji, strictly tribute-toned (not a "fun" easter egg — a quiet craft signal). Phase-4 easter-egg-creator + animation-premium implement.

### FR-15 — Cart preserves session through checkout (FIX — Beat-them point #12)
All `target="_blank"` on Products / AboutUs / CTA / Footer / Cart links to `/checkout` MUST be removed. Cart context (zustand or React-context) persists across the SPA → checkout transition.

---

## 3. Non-functional Requirements

### NFR-1 — Performance
- LCP < 2.5s on mid-tier mobile (Moto G4 equivalent, 4G throttle).
- CLS < 0.1.
- TBT < 200ms.
- Hero MeshGradient shader gated on `prefers-reduced-motion: no-preference` AND viewport ≥ 768px (low-end mobile gets a static cream-tone fallback).
- Logo pipeline per FR-12.
- Font loading: Inter + Playfair Display only (Yellowtail removed — Beat-them point #17). Both `weight:"variable"` with explicit axes, metric-matched fallback (La Nonna learning). No discrete static weights.
- Phase-5 lighthouse-auditor + core-web-vitals-specialist quality-gate target ≥ 90/100 on mobile.

### NFR-2 — Accessibility (WCAG 2.1 AA)
- All text-on-color combinations validated against the REAL `#fdf6f5` cream canvas (NOT pure white — recurring La Nonna bug). Specifically: `#7a3a3a/35`, `#7a3a3a/50`, `#7a3a3a/65` body alphas; `#c0392b` CTA bg + cream text; mesh-gradient text against lightest stops.
- All interactive controls ≥ 44×44 px tap target (current language dropdown ~32 px must grow).
- `prefers-reduced-motion: reduce` MUST disable: MeshGradient animation, parallax-on-mouse-move, IntersectionObserver entrance fades, easter egg petal bloom, typewriter heading. Static fallback for each.
- Decorative SVG icons get `aria-hidden="true"`.
- Custom language dropdown keeps existing `aria-expanded`, `aria-haspopup`, `role="listbox"`, click-outside (already correct).
- No emoji in body copy. The existing `✅` in contact-success state is **removed** under the homage-tone discipline (commercial emoji conflicts with tribute restraint).
- Keyboard nav: Tab order matches visual reading order, focus rings visible on cream canvas (cream is low-contrast for default browser rings — custom focus style needed).

### NFR-3 — RGPD / Cookie compliance
- Cookie consent banner on first visit (categories: necessary, analytics, marketing); reject-all is one click, not buried.
- Política de Privacidad, Política de Cookies, Aviso Legal, Política de Devolución pages — content updated to reference strawberries (current Footer links go to lettuce WP slugs at the abandoned `yayamariana.com`). Phase-4 content-strategist drafts; legal review (outside agent scope) before deploy.
- GA4 + ecommerce events gated on consent (`add_to_cart`, `begin_checkout`, Stripe webhook → `purchase`).
- Waitlist (FR-9) explicit double opt-in, unsubscribe in every email, data retention policy documented.

### NFR-4 — Security
- Stripe keys in env vars only (never committed). Phase-3 payment-genius validates publishable vs. secret-key separation.
- Server Actions (contact form Phase-4.5, waitlist Phase-4) rate-limited per IP (suggested: 5 req/min/IP for contact, 3 req/min/IP for waitlist).
- CSRF protection via Next.js Server Action signed payloads (default).
- No client-side secrets, no hardcoded API keys.
- `rel="noopener noreferrer"` on all external links (already mostly present in Footer — audit pass).
- Security-auditor + security-guardian own Phase-7 review.

### NFR-5 — Mobile-first
- iPhone SE / Galaxy S small (375 px wide) MUST render Hero cleanly: two-column 55/45 collapses to stacked, 380×380 image does not dominate viewport.
- Product cards stack 1-col on < 640px, 2-col on 640-1024, 3-col on ≥ 1024.
- All tap targets ≥ 44×44 px (NFR-2 overlap).
- Phase-4.5 mobile-obsessor owns audit.

### NFR-6 — Restraint as tonal discipline (cross-cutting)
This is technically a tone requirement (§4) but has non-functional teeth:
- 2-color palette (strawberry red + warm cream) + 1 neutral — globals.css enforced (Beat-them point #5).
- No decorative gradients/patterns competing with photography.
- IntersectionObserver entrances are slow (300-500ms ease-out), not springy. Motion serves the dignity, not the spectacle.
- Whitespace is generous. The competitor-killer "Awwwards restraint" pattern is the visual translation of the tribute tone — not just aesthetics.

### NFR-7 — Browser support
- Last 2 versions of Chrome, Safari, Firefox, Edge.
- iOS Safari 16+.
- Android Chrome 120+.
- No IE11.

---

## 4. Tone-of-Voice Requirements (HOMAGE FRAMEWORK)

This section is the most reusable piece of this document. Future copywriter / seo-writer / content-strategist agents read this BEFORE writing anything for Yaya Mariana.

### 4.1 Voice principles (in order)

1. **Gentle.** Never raise your voice. No exclamation marks of enthusiasm. No "¡Listo para probar...?". The brand does not sell, it offers.
2. **Dignified.** Mariana is real and has passed. Every line is read with that knowledge. If it would feel wrong said at her memorial, it is wrong on the site.
3. **Present-but-quiet.** Restraint amplifies care. Whitespace, slow motion, low decoration are tonal cues. The page does not perform; it carries.
4. **Specific over poetic.** "Cosechadas la víspera del envío" beats "frescura artesanal". Concrete numbers (9.5° Brix, semana 18, Finca Riudoms) carry the weight emotional inflation tries to fake.
5. **First-person where it makes sense, never first-person plural marketing.** "Mi yaya" not "nuestra abuela". The grandson speaks; the brand does not orate.
6. **Two tonal layers — keep distinct:**
   - **Layer A — universal "amor de abuela":** the brand promise customers feel cared for. *"Cultivadas con el cuidado de siempre"* type.
   - **Layer B — specific tribute to Mariana:** about HER. *"Mariana guardaba las mejores para los nietos"* type. Use sparingly — once or twice on the site, where natural. "En memoria de Mariana" appears at most once.
   - Do not collapse them. Layer A is for product/CTA/values copy; Layer B is for AboutUs and one footer line.

### 4.2 Tense rules (HARD)

| Subject | Tense | Examples |
|---|---|---|
| Mariana herself, what she did | **Past** | "cultivaba", "ponía", "guardaba", "decía", "enseñó" |
| The project's continuation of her practice | **Present** | "seguimos su forma de cuidar", "cada fresa lleva su cuidado", "cultivamos como ella" |
| The product right now | **Present** | "Recogidas en Tarragona", "están en su punto" |
| The founder voice quoting her | **Past (her) + present (him)** | *"Mi yaya me enseñó que..."* (past for her, present for the learning) |

**NEVER:**
- *"Mi abuela me enseña"* (present tense for her — assumes she's alive).
- *"Yaya Mariana cultiva"* (present tense, third-person — assumes she's the active farmer; she isn't).
- Conditional "le pondría tu abuela" (current copy) — assumes a generic abuela who *would*, when the real Mariana *did*. Either keep as universal Layer A *if* it doesn't clash with surrounding tribute lines, or rewrite to specific past tense.

### 4.3 Vocabulary — DO list

- **Verbs (past, about her):** cultivaba, ponía, guardaba, escogía, decía, enseñó, hacía, cuidaba
- **Verbs (present, about the continuation):** seguimos, llevamos, cuidamos, escogemos, recogemos, llega, lleva
- **Nouns (specific):** la víspera, el punto, la paciencia, el cuidado, la mano, la tierra, la luz, la temporada, la cosecha, la finca, la variedad, la semana
- **Modifiers (restrained):** firme, aromática, dulce, justa, sencilla, paciente, sin prisa, en su punto, con calma
- **Attribution (only):** `"J. Elías, fundador"` · `"Yaya Mariana"` · `"Mariana"` · `"la yaya"` · `"mi yaya"` (in first-person founder voice)

### 4.4 Vocabulary — DON'T list

- **Marketing hype:** descubre, descubrir, experimenta, vive, prueba (as imperative-hype), conoce (as imperative-hype), siente, "ven a"
- **Emotional inflation:** mágico/a, increíble, único (as adjective of hype — "única" as numeric scarcity is fine: "la única finca..."), excepcional, especial, mejor del mundo, irresistible
- **Commercial verbs in tribute layer:** disfruta, deléitate, sorpréndete
- **Ad clichés:** "del campo a tu mesa" appears in current copy — KEEP as it is a true and specific promise, not hype. But: "no te pierdas", "no esperes más", "última oportunidad", "oferta limitada" — NEVER.
- **English equivalents:** discover, experience, magic of, taste the difference, savor — banned in EN locale.
- **Catalan equivalents:** descobreix, prova (imperative-hype), viu l'experiència — banned in CA locale.
- **Emoji of any kind in body copy.** The existing `✅` in contact-success state is removed.

### 4.5 "En memoria de Mariana" — appropriateness map

| Location | Appropriate? | Why |
|---|---|---|
| AboutUs first paragraph | Yes (once) | This is the section that holds the tribute — landing it here once is the discipline. |
| Hero subtitle / chip | No | Hero sells the product specifically; the tribute is the undercurrent, not the headline. |
| Product card descriptions | No | Product copy stays specific (variety, finca, sensory). Tribute would feel manipulative against an "add to cart" button. |
| Values section | No | Values are universal (vitamin C, hydration, no pesticides). Tribute thread would dilute. |
| Footer (one line, small) | Yes (once, small) | A single small line below the social row — *"En memoria de Mariana"* — is dignified and not surfacing. |
| Contact / CTA / StatsStrip | No | Transactional or numerical contexts. Tribute would clash. |
| OG / meta / schema | No | Public-facing structured data is for SEO + sharing; tribute is on-page, not in schema. |

### 4.6 The Layer A vs Layer B copy split — applied

| Section | Primary layer | Why |
|---|---|---|
| Hero | A (universal "cuidado") + specific traceability | Product + place + variety lead. |
| StatsStrip | Neither — numeric/silent | Brix, hours, varieties, zero pesticides. |
| Products | A (descriptive) + specific (variety + finca + week) | Sales copy with craft details. |
| AboutUs | B (specific tribute) | This is where Mariana appears as Mariana. |
| Values | A (universal benefits) | Nutrition + environment claims; not about her. |
| CTA | A (warm offer) + microcopy (cold-chain) | Transactional with restraint. |
| Contact | A (welcoming) | Service tone. |
| Footer | A (descriptive) + B (one small line: *"En memoria de Mariana"*) | The single Layer-B placement outside AboutUs. |

---

## 5. Translations.ts — Tone Audit

Lines flagged against the homage discipline. **N = 18 lines** in the ES locale carry generic-abuela-metaphor, marketing-y, or living-grandmother tonal issues (CA + EN have the parallel issues; this audit focuses on ES, the parallels carry).

**Status legend:** REWRITE (tonal collision) · ADJUST (small lift) · KEEP (already tribute-compatible) · KEEP-AS-UNIVERSAL (Layer A — works as universal "amor de abuela" without conflicting).

### Top 5 most-impacted lines (current vs. candidate)

#### 1. `hero.subtitle` — REWRITE
- **Current (ES):** *"Fresas frescas de Tarragona, cultivadas con el mismo cariño que le pondría tu abuela. Sin pesticidas, naturales y siempre en su punto."*
- **Issue:** "que le pondría tu abuela" is a conditional about a generic abuela. The site is about Mariana specifically — Layer B is mixed into a Hero-Layer-A position. Also, the chip (FR-4) will carry the traceability line; the Hero subtitle needs to do less.
- **Candidate (ES):** *"Recogidas en Tarragona · Mágnum, Dream y 1525 · sin pesticidas, en su punto."*
- **CA candidate:** *"Collides a Tarragona · Mágnum, Dream i 1525 · sense pesticides, al seu punt."*
- **EN candidate:** *"Picked in Tarragona · Mágnum, Dream, 1525 · no pesticides, in season."*

#### 2. `about.p1` — REWRITE (highest stakes — this is the tribute paragraph)
- **Current (ES):** *"Yaya Mariana nació de la pasión por las fresas de calidad. Cultivamos fresas frescas en Tarragona con el mismo amor y dedicación que le pondría tu abuela. Cada fresa recogida en su punto óptimo de madurez, directa del campo a tu mesa."*
- **Issue:** "nació de la pasión" is brand-launch copy, not tribute. "que le pondría tu abuela" treats Mariana as a generic metaphor. The whole paragraph is Layer A in a Layer B slot.
- **Candidate (ES):** *"Mi yaya Mariana cuidaba sus fresas con la calma de quien sabe que lo bueno no tiene prisa. Recogía cada una en su punto, las guardaba para los nietos, y nos enseñó que una fresa buena no se hace, se cuida. Seguimos su forma en Tarragona — sin pesticidas, sin prisa, con la misma paciencia que ella ponía."*
- **Tense:** past for her (cuidaba, recogía, guardaba, enseñó), present for the continuation (seguimos, ponía in past).

#### 3. `about.quote` — ADJUST
- **Current (ES):** *"Mi abuela me enseñó que las mejores fresas son las que se recogen con amor y se comen el mismo día."* — J. Elías, fundador
- **Issue:** Generic "Mi abuela". Mariana has a name. "Con amor" is the kind of phrase that reads warm-but-empty after the Hero/AboutUs rewrites land specificity.
- **Candidate (ES):** *"Mi yaya Mariana me enseñó que una fresa buena no se hace, se cuida."* — J. Elías, fundador
- **Note:** specific name, past tense, drops the universal abstraction.

#### 4. `cta.title` + `cta.titleEm` — REWRITE
- **Current (ES):** *"¿Listo para probar las fresas de Yaya Mariana?"*
- **Issue:** Marketing-question hype. The brand does not ask "¿listo?". It offers.
- **Candidate (ES):** *"Fresas de Tarragona, cuando están en su punto."* (title) + *"Pedir esta cosecha"* (replacing `buyNow` CTA button label below).
- **CA candidate:** *"Maduixes de Tarragona, quan són al seu punt."* + *"Demanar aquesta collita"*.
- **EN candidate:** *"Strawberries from Tarragona, when they're in season."* + *"Order this harvest"*.

#### 5. `about.titleEm` — ADJUST (combined with `about.title`)
- **Current (ES):** *"El sabor de siempre, cultivado con amor"*
- **Issue:** "cultivado con amor" is the textbook artisanal cliché. It reads as a sticker, not a craft signal.
- **Candidate (ES):** *"Lo que ella cultivaba, seguimos cuidando"*
- **CA candidate:** *"El que ella cultivava, seguim cuidant"*
- **EN candidate:** *"What she grew, we still tend"*

### Full audit table (all 18 flagged lines)

| # | Key | Current ES (excerpt) | Status | Note |
|---|---|---|---|---|
| 1 | `hero.subtitle` | "cultivadas con el mismo cariño que le pondría tu abuela" | REWRITE | See above. Hero chip + restraint replaces. |
| 2 | `hero.quoteText` | "Todo lo bueno de la vida requiere paciencia, trabajo y amor." | KEEP | Tribute-compatible, attributable to her, timeless. |
| 3 | `hero.quoteAuthor` | "Yaya Mariana" | KEEP | Exact form. |
| 4 | `stats.labels[0]` | "Del camp a taula" (CA in ES locale — bug) | REWRITE | Fix to ES *"Del campo a tu mesa"* + replace with craft numeric tile per FR-6. |
| 5 | `stats.labels[3]` | "Qualitat premium" (CA in ES locale — bug) | REWRITE | Fix + replace with *"variedades"* numeric tile per FR-6. |
| 6 | `products.subtitle` | "Cultivadas sin pesticidas en Tarragona. Directas del campo a tu mesa, siempre en su punto." | KEEP-AS-UNIVERSAL | Layer A, factual, restrained. |
| 7 | `products.items[].description` (all 3) | Generic descriptors per variety | ADJUST | Add sensory + Brix per FR-5: *Mágnum — "firme, aromática, ≈9.5° Brix"*; *Dream — "rústica, ciclo largo, dulzor profundo"*; *1525 — "[descriptor pendiente Joan Carles]"*. |
| 8 | `about.eyebrow` | "Nuestra historia" | KEEP | Fine. |
| 9 | `about.title` | "El sabor de siempre," | KEEP | Pairs with the rewritten `titleEm`. |
| 10 | `about.titleEm` | "cultivado con amor" | ADJUST | See top-5 #5. |
| 11 | `about.p1` | "Yaya Mariana nació de la pasión..." | REWRITE | See top-5 #2. |
| 12 | `about.p2` | "Trabajamos con variedades seleccionadas..." | ADJUST | Tonally fine; tighten and connect to her: *"Trabajamos las variedades que ella escogía — Mágnum, Dream y 1525. Sin pesticidas, sin químicos. Solo el sol, la tierra y el cuidado de las manos que aprendieron de las suyas."* |
| 13 | `about.quote` | "Mi abuela me enseñó..." | ADJUST | See top-5 #3. |
| 14 | `values.subtitle` | "Cada fresa que cultivamos lleva consigo nutrición, sabor y compromiso con el medio ambiente." | KEEP-AS-UNIVERSAL | Layer A, no tribute conflict. |
| 15 | `values.benefits[2].description` | "Cultivadas sin ningún tipo de pesticida ni químico artificial. Solo agua, luz y el cuidado que merece cada fruta." | KEEP-AS-UNIVERSAL | Fine. |
| 16 | `cta.eyebrow` | "Directo de la granja a tu mesa" | KEEP | Specific, restrained. |
| 17 | `cta.title` + `titleEm` | "¿Listo para probar las fresas de Yaya Mariana?" | REWRITE | See top-5 #4. |
| 18 | `cta.buyNow` | "Comprar ahora" | ADJUST | Soften to *"Pedir esta cosecha"* — more tribute-toned, more specific. |
| 19 | `contact.title` | "Contacta con nosotros" | KEEP | Service tone, fine. |
| 20 | `contact.subtitle` | "¿Tienes preguntas... estamos aquí para ayudarte." | KEEP-AS-UNIVERSAL | Fine. |
| 21 | `contact.sent` | "¡Mensaje enviado!" | ADJUST | Drop the exclamation: *"Mensaje enviado"*. Quiet confirmation. Also: remove the `✅` emoji from the component (NFR-2). |
| 22 | `footer.description` | "Fresas frescas de Tarragona, cultivadas con amor y sin pesticidas." | ADJUST | *"Fresas de Tarragona, cuidadas como ella las cuidaba."* + a new microcopy line below social row: *"En memoria de Mariana"* (Layer B, one place outside AboutUs — per §4.5). |

**Final delta:** 8 REWRITE, 7 ADJUST, 7 KEEP/KEEP-AS-UNIVERSAL across ES; CA and EN carry parallel changes. Final copy ownership remains with Phase-4 copywriter; this document is the BRIEF, not the final copy.

---

## 6. Pending Client Decisions — Decision Tree (the 6 Banderas formalized)

For each bandera, the resolved decision is at the top; sub-decisions that need family/client follow-up are nested below as a tree with the explicit questions, options, and selection criteria.

### Bandera 1 — Hero hands photograph
**RESOLVED:** family archive of Mariana → fallback next-gen family hands (Nil's mother / Nil) → fallback elegant placeholder. **NO AI.**

**Sub-decisions still pending (family conversation):**
- **Q1.1** Does Nil's family have a usable archival photograph of Mariana's hands (or hands + fresa, or hands + tierra, or hands + canasta)?
  - **If YES → Option A (preferred):** which photo? scan resolution? do we need a restoration pass? family consent to publish?
  - **If NO → Q1.2.**
- **Q1.2** Are Nil's mother (or Nil) willing to be photographed for the next-gen-hands fallback?
  - **If YES → Option B:** schedule a single-session shoot. Composition: hands cradling a Mágnum fresa over warm cream `#fdf6f5`, shallow DoF, no studio gloss. Real, not stylized.
  - **If NO → Option C.**
- **Q1.3 (Option C — elegant placeholder):** what is "elegant"? Three viable directions:
  - **C1.** Typography-only Hero (Playfair italic "Mágnum · Dream · 1525" + traceability chip — no photograph at all). Restraint-maximalist. Strongest tribute discipline.
  - **C2.** Single Mágnum fresa on warm cream linen — no hands. Product-as-hero, Post Familiar Wine-style. Visually safe.
  - **C3.** Earthenware bowl with three fresas, top-down. Domestic, intimate, no person required. Closest to the abuela-kitchen aesthetic without showing a person.
  - **Selection criterion:** if Layer-B tribute lands strongly in AboutUs (Bandera 2 resolves with a portrait or strong illustration), C1 or C2 in Hero keeps the Hero from "competing" with AboutUs. If Bandera 2 resolves typography-only, C3 in Hero adds a single human-warmth signal.

**Phase-4 hero-specialist + image-curator block until Q1.1-1.3 resolve.**

### Bandera 2 — AboutUs portrait of Mariana
**RESOLVED (provisionally):** family archive w/ family approval → fallback minimal illustration or typography-only with her name. **Final decision pending family consult.**

**Sub-decisions still pending:**
- **Q2.1** Does a portrait of Mariana exist in the family archive that her surviving family is willing to publish?
  - **If YES → Option A:** which photo? Period (young vs. older)? Format (B&W vs. color, square vs. portrait)? Restoration?
  - **If NO → Q2.2.**
- **Q2.2** Is the family comfortable with a minimal illustrated portrait (line drawing from a private photo, not published)?
  - **If YES → Option B:** commission a single illustration from a Spanish illustrator (suggest Phase-3 budget). Style: single-line, restrained, Le Fruit Studio-adjacent.
  - **If NO → Option C: typography-only.** *"Mariana"* set in Playfair Display italic, large, surrounded by whitespace, no portrait at all. This is the most dignified option if the family prefers privacy.
- **Q2.3** Regardless of A/B/C: is *"En memoria de Mariana"* (small, beneath the section) acceptable as a tribute line? (per §4.5 of this document) — assume YES unless family declines.

**Selection criterion:** family privacy preference is sovereign. If the family is not comfortable with any image, Option C is the right answer — typography-only is more dignified than a stock substitute.

### Bandera 3 — Press-strip in Footer
**RESOLVED:** postponed; placeholder slot kept until publications confirmed live coverage post-launch.

**Sub-decisions still pending:**
- **Q3.1** Once site is live and El Mira / Diari de Tarragona / ElEspañol mention the *strawberry-positioned* site (not the lettuce coverage), do we have written permission to display their logos?
  - **If YES:** Option A — small grayscale logo strip in Footer.
  - **If NO:** Option B — textual citation only: *"Como se ha visto en El Mira · Diari de Tarragona · ElEspañol"* with hyperlinks.
- **Q3.2** Trigger condition: ≥2 publications must cover the strawberry site post-launch before activating the strip. Until then, slot stays empty.

**Phase-4 does NOT implement this. Phase 9+ activation, post-launch.**

### Bandera 4 — Off-season waitlist
**RESOLVED:** Resend, RGPD-compliant, double opt-in.

**Sub-decisions still pending:**
- **Q4.1** Resend account ownership: Nil's account or a separate `info@yaya-mariana.com`-bound account? (Implications for sender domain authentication — SPF/DKIM/DMARC on `yaya-mariana.com` and `yayamariana.es`.)
- **Q4.2** Confirmation email + waitlist-confirmation email copy — Phase-4 copywriter under tribute-tone discipline (§4). Specific question: is the confirmation email signed *"J. Elías, fundador"* or unsigned/brand-only?
- **Q4.3** Data retention: how long do we keep unconfirmed opt-ins before deletion? (Suggested: 30 days. RGPD-default.)
- **Q4.4** What triggers the waitlist email send? (Suggested: Nil manually triggers a "fresas disponibles" broadcast at start-of-season. No automated cron.)
- **Q4.5** Where do the waitlist records live? (Suggested: Resend's audience feature, no separate DB needed for v1.)

**Phase-3 software-recommender + Phase-4 fullstack-developer own implementation.**

### Bandera 5 — Hero variety + ISO-week chip
**RESOLVED:** lightweight JSON/CMS, Nil updates per season.

**Sub-decisions still pending:**
- **Q5.1** JSON file vs. tiny CMS field?
  - **Default:** JSON file at `src/data/harvest.json`, edited by Nil, committed to git, redeployed automatically (Vercel-tier auto-deploy on push).
  - **Alternative:** a tiny CMS (Sanity / Tina) with a single document — overkill for one field, but easier for non-developer Nil to edit from a browser without a git push.
  - **Selection criterion:** if Nil edits this < monthly, JSON file is fine. If weekly during peak season (Mar-Jun), the CMS path saves friction. **Recommend JSON file for v1, escalate to CMS in Phase 4.5 if friction emerges.**
- **Q5.2** What is the off-season chip value? (When `harvest.json` says we're between seasons, what does the chip render?)
  - **Default:** chip hides; subtitle reverts to a tribute-toned off-season line: *"Esperando la próxima cosecha · marzo"* (date dynamic per `harvest.json.nextSeasonStart`).

### Bandera 6 — Mariana = real, deceased
**RESOLVED:** tribute tone confirmed. Whole document encodes this resolution.

**Sub-decisions still pending:**
- **Q6.1** Does the family want to be informed before launch (courtesy)? (Suggested: yes — Nil shows the AboutUs section, the Hero, and the one Footer tribute line to family for sign-off before deploy.)
- **Q6.2** Is there a date of significance (her birthday, the anniversary of her passing) that should be honored as the launch date or as a private internal marker? (Suggested: ask family; don't impose.)
- **Q6.3** If the family wants any specific phrase, recipe, or memory included, where does it go? (Suggested: AboutUs section can accommodate one quoted line attributed to her, in addition to `about.quote` from J. Elías. Default: do not add unless family requests.)

---

## 7. Acceptance Criteria — 18 Beat-them Points

Phase-4.5 / Phase-5 quality-gate accepts each point as "done" only if its acceptance criterion holds.

| # | Beat-them Point | Acceptance Criterion |
|---|---|---|
| 1 | Variety badge + sensory descriptor on product cards | Each of 3 product cards renders a `[Variety]` badge in brand-red and a 1-line sensory descriptor below the title. ES/CA/EN parity. Descriptor copy approved by Phase-4 copywriter under §4 discipline. 1525 descriptor confirmed by Joan Carles (or marked "pendiente" until). |
| 2 | Hero traceability chip | Chip visible below H1 in Hero. Copy: *"Recogidas en Tarragona · {variedad} · semana {ISO}"* (ES/CA/EN parity). Data source `src/data/harvest.json` documented. Nil's update workflow documented in `README.md` or `docs/agency/harvest-update.md`. Off-season fallback chip per §6 Bandera 5 Q5.2. |
| 3 | StatsStrip craft numerics | Four tiles render: *"≈9.5° Brix"* (or pending real value), *"<24h"*, *"3 variedades"*, *"0 pesticidas"*. `value: "+"` bug resolved. AnimatedValue regex matches. ES locale labels fixed (no CA bleed). ES/CA/EN parity. |
| 4 | AboutUs first-person tribute + portrait | First-person paragraph ≤90 words, attributed `"J. Elías, fundador"` (initials-firewall verified). Tense rules per §4.2 honored. Portrait per §6 Bandera 2 resolution. *"En memoria de Mariana"* placement decided. |
| 5 | 2-color palette discipline in globals.css | globals.css enforces strawberry-red + cream + one neutral. No competing decorative gradients/patterns shipped. Phase-4.5 visual-perfection passes. |
| 6 | IntersectionObserver entrances (no scroll-jacking) + reduced-motion | Section headers + product cards fade-translate on entry, single rAF handler, IntersectionObserver. `prefers-reduced-motion: reduce` → static. La Nonna pattern (non-pinned) honored. |
| 7 | Finca + harvest-week + variety chip on product cards | Each product card renders a chip `"Finca Riudoms · semana {ISO} · {variedad}"`. Data source either inline or from `harvest.json`. ES/CA/EN parity. |
| 8 | Hero typography statement "Mágnum · Dream · 1525" | A single restrained line in Playfair Display under the H1, dot-separated. No carousel, no slider. ES/CA/EN identical (variety names don't translate). |
| 9 | Logo WebP/AVIF, optimized pipeline | `/public/logo-nuevo.jpg` → `/public/logo.webp` (+ AVIF fallback). `unoptimized` dropped. `priority` only on Hero instance. Nav logo lazy-loaded. Stale `logo-yaya.png.png` and `Fotos Fresas.zip` removed. Lighthouse-auditor confirms LCP < 2.5s mobile. |
| 10 | Contrast audit against `#fdf6f5` cream canvas | All text-on-color combinations validated against cream (NOT pure white). `#7a3a3a/35`, `/50`, `/65` body alphas pass WCAG AA. CTA contrast passes. Mesh-gradient text contrast against lightest stops verified. accessibility-perfectionist signs off. |
| 11 | Mobile pass + tap targets ≥44px | iPhone SE (375px) renders Hero 55/45 → stacked cleanly. Language dropdown tap target ≥44×44 px. All interactive controls ≥44×44 px. mobile-obsessor signs off. |
| 12 | Close `target="_blank"` checkout leak | Zero `target="_blank"` on internal `/checkout` or cart-related links. Cart context survives navigation to /checkout. conversion-funnel-optimizer signs off. |
| 13 | SEO H1/H2 long-tail + JSON-LD + sitemap/robots + hreflang | `<title>` is strawberry-positioned (NOT "Lechugas hidropónicas"). Full Metadata API surface populated. JSON-LD Product (×3) + LocalBusiness + Organization present, validated via Google's Rich Results tester. `app/sitemap.ts` + `app/robots.ts` shipped. hreflang ES/CA/EN present and accurate. Narrative firewall: zero `"J. Elías"` expansions in JSON-LD or OG. |
| 14 | Cold-chain microcopy near CTA | Microcopy line near CTA reads: *"24-48h península · embalaje refrigerado · cosechadas la víspera del envío"* (ES/CA/EN parity). Tonally restrained — no exclamation. |
| 15 | Off-season próxima cosecha countdown + capture | When `harvest.json` says off-season, CTA shows next-harvest date + email capture form. Form wired to Resend with double opt-in (FR-9). RGPD consent checkbox explicit. fullstack-developer signs off. |
| 16 | Press-strip in Footer | **POSTPONED per Bandera 3.** Placeholder slot in Footer wireframe; no implementation in Phase 4. Acceptance criterion when activated: 2+ confirmed strawberry-site press citations + logos-or-text permission resolved. |
| 17 | Yellowtail dropped; Playfair italic founder signature | Yellowtail import removed from `layout.tsx`. AboutUs `J. Elías, fundador` attribution set in Playfair Display italic. Font payload reduced. typography-master signs off. |
| 18 | Reduced-motion easter egg on Mágnum hover | Hover/long-press on Mágnum product card triggers single petal/leaf bloom ≤1s, single rAF. `prefers-reduced-motion: reduce` → no animation. No emoji. easter-egg-creator signs off. |

**Win threshold (Phase-8 quality-gate):** ≥12/18 points SUPERADO + 0 CRITICAL points INFERIOR + both HARD GATES green (narrative firewall + untouchables).

---

## 8. Risks / Dependencies

### Risk 1 — Family declines Hero / AboutUs photography (HIGH probability, MEDIUM impact)
**Scenario:** Bandera 1 + 2 family conversation results in "no photo of Mariana publishable" and "no family member willing to be photographed."
**Impact:** Hero loses its Killer Visual. AboutUs loses the portrait anchor.
**Mitigation:** Plan-B (Bandera 1 Option C — typography-only or product-only Hero) and Plan-B (Bandera 2 Option C — typography-only AboutUs) are documented and shippable. Restraint-maximalist Hero + typography AboutUs is arguably MORE tribute-disciplined than the photograph option. Phase-4 does NOT block on this risk because both fallbacks are designable in advance.
**Action:** Phase-2 (mood-board-creator + creative-director) produces BOTH the photograph-Hero direction and the typography-only direction in parallel, so the family conversation outcome doesn't restart the design.

### Risk 2 — Joan Carles supplies real product pricing late (MEDIUM probability, HIGH impact)
**Scenario:** placeholder 7.50€/500g uniform stays through Phase 4-7; real prices land just before deploy.
**Impact:** Stripe Checkout line-items, schema.org Product JSON-LD, OG metadata, all product-card displays need a coordinated swap.
**Mitigation:** Product prices live in a single source of truth (suggested: `src/data/products.ts`) — one file to edit at deploy. Phase-3 software-recommender ensures price is NOT hardcoded in multiple components. Stripe Price IDs are env-vars, not hardcoded.
**Action:** Centralize price source in Phase 4. Document the swap workflow in `docs/agency/deploy-checklist.md` (Phase 7 owner).

### Risk 3 — Resend integration delays push waitlist out of v1 (LOW probability, MEDIUM impact)
**Scenario:** Resend account / domain authentication / DKIM not ready by Phase 5.
**Impact:** Off-season CTA (FR-9) cannot ship. Site looks "broken" in summer/winter if not addressed.
**Mitigation:** v1 fallback — off-season CTA displays the próxima-cosecha date + a `mailto:info@yaya-mariana.com` link instead of an inline form. Less elegant, ships without Resend.
**Action:** Phase-3 sets Resend domain auth as a Phase-7 deploy prerequisite. If late, the fallback is the v1 default.

### Risk 4 — Narrative firewall leakage (LOW probability, CRITICAL impact)
**Scenario:** an agent (image-curator pulling real photo metadata, seo-genius writing schema.org Person, content-strategist drafting AboutUs) accidentally surfaces the real investor identity in code, alt text, schema, or copy.
**Impact:** quality-gate hard-blocks deploy.
**Mitigation:** every agent's role-spec reminds of the firewall. Phase-8 quality-gate runs an explicit grep for the real name across `/src`, `/public`, `/docs` (excluding `docs/agency/`), and the deployed build.
**Action:** Phase-4 and onward, every agent confirms in their phase report that they did not surface the real name.

### Risk 5 — Tribute tone gets diluted by downstream agents (MEDIUM probability, MEDIUM impact)
**Scenario:** Phase-4 copywriter, Phase-5 conversion-funnel-optimizer, Phase-5 urgency-architect, Phase-5 social-media-manager apply standard-DTC playbooks (urgency CTAs, scarcity microcopy, "discover" verbs, exclamation marks) without reading §4 of this document.
**Impact:** site reverts toward generic premium-DTC voice; tribute discipline lost.
**Mitigation:** §4 of this document IS the tone enforcement contract. Phase-5 style-guide-enforcer reads §4 as a hard rule, not a suggestion. Phase-8 quality-gate runs a tone-grep for banned vocabulary (§4.4 DON'T list).
**Action:** require every Phase-4+ agent that touches user-facing copy to acknowledge §4 in their phase report. Add §4 vocab DON'T list to `style-guide-enforcer` memory.

---

## 9. Confirmation Paths

- **Brief deliverable:** `C:\proyectos\yaya-mariana\docs\agency\phase-1-requirements-analyst-brief.md` (this file).
- **Memory update:** `C:\Users\8nill\.claude\agencia-web-v2\memory\requirements-analyst-memory.md` (created in this engagement — appended with the homage-tone framework for any future memorial/tribute-site project).
- **Inputs read (exactly once each):**
  1. `C:\Users\8nill\.claude\agencia-web-v2\memory\global-memory.md`
  2. `C:\Users\8nill\.claude\agencia-web-v2\memory\requirements-analyst-memory.md` (was MISSING → created)
  3. `C:\proyectos\yaya-mariana\docs\agency\phase-0-report.md`
  4. `C:\proyectos\yaya-mariana\docs\agency\phase-0-competitor-killer-plan.md`
  5. `C:\proyectos\yaya-mariana\docs\agency\phase-0-web-researcher-dossier.md`
  6. `C:\proyectos\yaya-mariana\src\i18n\translations.ts`
  7. `C:\proyectos\yaya-mariana\src\app\page.tsx`
- **Narrative-protection verification:** this file contains zero expansions of `"J. Elías"`, zero references to the real investor identity by name, zero references to Audax / La Sirena / hydroponic lettuce in any user-facing recommendation. Founder consistently rendered `"J. Elías, fundador"`; abuela as `"Mariana"` / `"la yaya"` / `"yaya Mariana"`.
- **Tone-discipline verification:** every candidate copy line in §5 was checked against §4.2 tense rules and §4.4 DON'T list before being proposed.
- **Untouchables verification:** zero recommendations in this document propose touching phone `+34 666 777 888`, email `info@yaya-mariana.com` (hyphen intentional), Badalona address, prices 7.50€/500g, social root links, contact-form fake submit, or logo artwork.

---

## 10. Next Phase

Phase 1.5 (mood-board-creator + creative-director + color-psychologist) can begin once the director confirms this brief. Phase-1.5 specific dependency: must produce BOTH the photograph-Hero and the typography-only Hero in parallel (Risk 1 mitigation).

Awaiting director confirmation.
