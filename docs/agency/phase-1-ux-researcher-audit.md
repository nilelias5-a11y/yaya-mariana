# Fase 1 — UX Researcher Audit
**Proyecto:** Yaya Mariana (premium artisanal fresas de Tarragona · ES/CA/EN · tribute site)
**Branch auditada:** `clasico` (SHA `19dabf2`)
**Modo:** AUDIT (mejoras quirúrgicas, no rebuild)
**Fecha:** 2026-05-20
**Author:** ux-researcher
**Tone constraint:** HOMAGE — Mariana fue la abuela real de Nil, fallecida. Tribute, not marketing. Restraint as TONE not just aesthetic.

---

## 0. Executive summary

The `clasico` build (Hero · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer · Cart) is technically competent and emotionally well-positioned for a premium DTC strawberry brand — but it currently reads as a commerce site with a grandmother-themed garnish, not a tribute site that also sells fruit. The biggest UX risk in Fase 4.5 is **not** a missing feature: it is the tonal slippage between (a) the *universal* "amor de abuela" commercial promise and (b) the *specific* memorial undercurrent for Mariana. Three pivots will resolve the audit without adding sections: (1) re-stage AboutUs as the emotional anchor of the page — first-person homage, past tense where narrative is about her, gentle entry before the CTA pressure ramps; (2) soften every CTA's commercial urgency (badges, "compra ahora") with a "memorial-compatible" register that doesn't break conversion; (3) treat the Hero traceability chip and StatsStrip numerics as *quiet proof*, not loud differentiators. The 18 Beat-them points all clear UX gates with adjustments noted below — none introduce regressions in the dominant flows, but #4 (AboutUs narrative), #15 (off-season "te avisamos" capture), and the existing `target="_blank"` checkout leak (#12) deserve direct UX care because they sit precisely on the tribute/commerce seam.

---

## 1. Methodology

- Read inputs once each: global memory, role spec, phase-0 report, competitor-killer plan, page.tsx, all 9 section components, translations.
- Real-user-language source: I have no fresh review-mining pass for *this* engagement (memory has no prior berry-DTC personas saved). The competitor-analyst report already captured competitor review patterns (Crowdfarming · Naranjas del Carmen · Frutos Rojos) at Phase 0; persona language below is derived from that secondary read plus the named-grandmother + Tarragona-microorigin angle. **Honest caveat:** no Reddit/Trustpilot quotes are cited as "real" — I will not invent user voices. Quotes shown are phrased as the persona would plausibly speak in their context; copywriter should validate against any future review-mining pass before shipping copy.
- All recommendations stay inside the 9 existing sections (audit mode).

---

## 2. Personas (5)

### Persona 1 — Núria, the gift-buyer (regalo de empresa / regalo personal)

- **Age:** 38–52 · **Occupation:** marketing manager / mid-senior office role · **Location:** Barcelona / urban Catalonia · **Tech comfort:** High
- **Goals:**
  - Find a *premium-feeling* edible gift for clients, in-laws, or a hostess gift — something that says "I chose carefully" without being a wine cliché.
  - Local + Catalan + story-able. Will mention the origin to the recipient.
- **Frustrations:**
  - Premium hampers are generic; supermarket "gourmet" is hollow.
  - Origin claims feel fake ("fresas de la finca" with no finca named).
  - Shipping uncertainty kills the gift moment.
- **Plausible voice:** *"Quiero algo que se note que viene de un sitio concreto, no de un catálogo."* / *"Si llegan blandas, me hace quedar mal."*
- **How they find the site:** Instagram (friend's story), Google "regalo gourmet Barcelona", press (El Mira, Diari).
- **Device:** Mobile-first, desktop for the purchase moment.
- **Decision trigger:** Story that's *gift-shareable* + delivery date guarantee + photo of the actual product (not stock).
- **Tribute relevance:** MEDIUM. They care that the brand has soul; they're not buying *because* of Mariana, but the narrative makes the gift gift-able. The tribute layer adds depth, not entry friction.

### Persona 2 — Pau, the Catalan foodie / local-pride buyer

- **Age:** 28–45 · **Occupation:** restaurant industry / food media / engaged amateur · **Location:** Camp de Tarragona, Barcelona, Maresme · **Tech comfort:** High
- **Goals:**
  - Try the specific *variedad* (Mágnum/Dream/1525) — they recognize cultivar talk and want it.
  - Support Catalan single-finca production over Huelva volume.
  - Repeat-buy in season; tell friends.
- **Frustrations:**
  - Generic "fresa de temporada" with no variety / no Brix / no harvest week.
  - Single-language Castilian-only sites in Catalan-speaking territory.
  - "Bio" labels with no concrete proof.
- **Plausible voice:** *"Per fi una marca que anomena la varietat."* / *"Si és del Camp de Tarragona ho vull saber clarament."*
- **How they find the site:** Catalan food media, Diari de Tarragona, Reddit `r/catalonia` or `r/Spain`, Instagram food accounts.
- **Device:** Both, leans desktop for reading.
- **Decision trigger:** Variety + finca + concrete numbers (Brix, days from harvest). CA-language UI signals seriousness.
- **Tribute relevance:** LOW–MEDIUM. They came for the cultivar. The yaya narrative is *nice context* but not the buy-trigger. **Risk:** if AboutUs over-saturates the page, this persona disengages before reaching Products.

### Persona 3 — Laura, the pesticide-conscious / health-led shopper

- **Age:** 32–55 · **Occupation:** parent of young kids, often dual-income · **Location:** suburban Catalonia / Madrid / Valencia · **Tech comfort:** Medium–High
- **Goals:**
  - "Sin pesticidas" for the family table; verifies the claim before paying premium.
  - Reliable delivery, returns if needed, clear ingredients.
- **Frustrations:**
  - "Eco" / "bio" claims that don't survive scrutiny.
  - Buying premium and getting commodity quality.
  - Hidden shipping fees, last-minute upsell.
- **Plausible voice:** *"Quiero saber exactamente qué echáis en la tierra. Si pone 0 pesticidas, ¿por qué no hay un certificado?"*
- **How they find the site:** Google "fresas sin pesticidas catalunya", parenting-forum recommendation, Instagram.
- **Device:** Mobile.
- **Decision trigger:** Concrete proof (Brix · 0 pesticidas, ideally a 3rd-party seal eventually) + transparent shipping + clean checkout.
- **Tribute relevance:** LOW. The grandmother layer reads as "this brand has values, not just margin"; doesn't drive purchase but supports trust.

### Persona 4 — Marc & Helena, the memory-driven curator (the tribute-aware buyer)

- **Age:** 30–65, broad · **Occupation:** mixed; often someone whose own grandmother has passed or is aging · **Location:** anywhere ES/CA/EN, often expat or diaspora · **Tech comfort:** Mixed
- **Goals:**
  - Buy something whose *story* matters more than its taste. The fact that it honors a real grandmother is the buy.
  - Send it to a parent or grandparent as "this reminded me of you."
- **Frustrations:**
  - Brands that *invent* a "grandmother" archetype as a marketing skin.
  - Tribute angles that feel exploited or saccharine.
- **Plausible voice:** *"Mi yaya hacía mermelada igual. Esto se lo regalo a mi madre."*
- **How they find the site:** Word-of-mouth, family WhatsApp share, Catalan diaspora networks, press.
- **Device:** Mobile, often in a quiet moment (evenings).
- **Decision trigger:** Authenticity of the narrative. Past-tense respect for Mariana. NO "ven a conocerla" copy. The visual restraint *is* the trust signal — gloss kills the sale.
- **Tribute relevance:** HIGH — they ARE the tribute-aware audience. If the site reads as commerce-with-grandma-skin, they bounce harder than the commerce-only personas. Restraint protects them.

### Persona 5 — Ana, the sustainability-conscious EU expat / Catalan-curious

- **Age:** 30–50 · **Occupation:** professional, often German / Dutch / French ES-resident or visitor · **Location:** Barcelona, coastal Catalonia · **Tech comfort:** High
- **Goals:**
  - National + temporada (AECOC pattern: 61% of Spanish shoppers actively seek this; expats over-index too).
  - English UI for comfort; Catalan/Spanish optional.
  - Sustainability story integrated with product, not isolated to a page (Joselito model).
- **Frustrations:**
  - Spanish-only commerce sites.
  - Crowdfarming-style adoption friction when they just want a punnet.
- **Plausible voice:** *"I want to buy from a single farm, not a marketplace. And in English, please."*
- **How they find the site:** Google EN long-tail, expat newsletters, Instagram travel/food accounts.
- **Device:** Mobile + desktop ~50/50.
- **Decision trigger:** EN parity + clean shipping promise + single-finca story.
- **Tribute relevance:** LOW–MEDIUM. The grandmother story translates *culturally* but with care — "abuela" is a specific Spanish/Catalan cultural unit; EN copy needs to land it as universal-warm without forcing the Spanish/Catalan word.

---

## 3. User journeys (5 dominant flows)

### Journey A — Commercial path: Hero → Products → Cart (Núria, Pau, Laura)

| Stage | Action | Thought | Emotion | Friction / Opportunity |
|---|---|---|---|---|
| Awareness | Click from IG/press/Google → land on Hero | "¿Es serio o tema-WordPress?" | Skeptical | The current Hero leads with a *quote* in Playfair italic from Mariana, not the product or variety claim. Beautiful, but eyebrow `"Tarragona · Qualitat premium"` is the only commercial signal in the first viewport. **Friction:** killer message (Mágnum/Dream/1525 + Tarragona) is not in the H1; persona 2 (foodie) doesn't see the cultivar hook on entry. **Opportunity:** Beat-them #2 + #8 in Hero subtitle slot. |
| Consideration | Scroll past StatsStrip, hit Products | "OK, dark band of stats — what's the actual product?" | Curious | StatsStrip is dark maroon `#5c1a1a` — high contrast jump from Hero cream. Currently shows 100% · 0 · 24h · "+" (broken regex) with labels partly contaminated by CA in ES. **Friction:** label mismatch + the "+" stat reads broken. **Opportunity:** Beat-them #3 (Brix · 24h · 3 variedades · 0 pesticidas) — quiet proof, not loud. |
| Decision | Reach Products grid, hover Mágnum card | "¿Qué tiene de distinta una Mágnum?" | Interested | Products is the strongest section visually (parallax carousel, badge shine, typewriter heading). Currently: name + generic description + Premium badge. No variety descriptor, no finca chip, no Brix. **Opportunity:** Beat-them #1 + #7. Typewriter is delightful but on a tribute site borders on too animated — consider reduced-motion fallback. |
| Action | Click "Añadir al carrito" → floating cart badge → open Cart sheet → "Ir a pagar" | "Se añade rápido — ¿el cart se abrió o solo se actualizó?" | Confident | The add-to-cart pulses green for 1.6s but does NOT auto-open the cart sheet; the user has to find the floating button (correctly placed, but no signal it now has 1 item beyond a small badge). **Friction:** discovery cost on first add. **Opportunity:** Subtle slide-in toast or auto-open the sheet on first add — to validate in QA. |
| Post-action | Hit checkout | "Voy a comprar." | Satisfied | `<a target="_blank">` to `/checkout` opens new tab — known issue (#12). On mobile this is *especially* disruptive (new tab in Safari = context loss). **HIGH priority UX fix.** |

**Friction summary (Journey A):** killer message not in Hero · StatsStrip looks broken · add-to-cart confirmation could be louder · checkout new-tab kills momentum.

### Journey B — Emotional path: Hero → AboutUs → optional buy (Marc & Helena, sometimes Núria)

| Stage | Action | Thought | Emotion | Friction / Opportunity |
|---|---|---|---|---|
| Awareness | Land via family-share / press-piece-about-tribute | "Quiero leer la historia." | Curious-warm | Hero quote *is* the entry — actually good for this persona. They like that the H1 isn't a sales line. **Opportunity:** keep this; do NOT replace the quote with a transactional headline. Beat-them #8 (Mágnum · Dream · 1525) can live BELOW the quote as a single restrained line. |
| Consideration | Scroll past StatsStrip — feels jarring | "Estos números no van con la historia." | Slight dissonance | Maroon stats panel + animated counters feels commercial right after the quote. **Friction (tribute lens):** the numbers are correct but the *staging* is loud. **Opportunity:** restraint sweep (Beat-them #5) — softer panel, smaller animation, or move the dark band visually closer to the StatsStrip→Products transition (NOT immediately after Hero quote). MAJOR if relocated, MEDIUM if just visually toned. |
| Decision | AboutUs — current copy is generic "nació de la pasión", quote attributed to founder | "¿Quién era Mariana, realmente?" | Reaching | **CRITICAL FRICTION (homage lens):** current AboutUs copy is third-person, present-tense, generic ("Yaya Mariana nació de la pasión por las fresas de calidad"). For a tribute site, this is the section that should land — and it currently doesn't. The founder quote is fine but the section reads as commerce-with-grandma-skin. **Opportunity:** Beat-them #4 — first-person, past tense where narrative is about Mariana, ~60–90 words, ends with a single moment, not a marketing close. |
| Action | Click "Ver tienda" CTA in AboutUs | "Ok, sí, quiero probar." | Touched | The CTA is `target="_blank"` again — same leak. **Friction:** new tab breaks the emotional moment. |
| Post-action | Convert or close-tab-with-warm-feeling | "Lo he guardado / se lo mando a mi madre." | Satisfied | If they don't convert today, they share. Footer share / social links should be discoverable. **Opportunity:** small "share" affordance on AboutUs section — flag MEDIUM, not in Beat-them plan; suggest deferring unless director approves. |

**Friction summary (Journey B):** StatsStrip tonal jolt · AboutUs reads commercial-by-default · checkout new-tab breaks the warm moment.

### Journey C — Off-season retention: visit → waitlist → notified (all personas)

| Stage | Action | Thought | Emotion | Friction / Opportunity |
|---|---|---|---|---|
| Awareness | Land out-of-season (Jul–Jan) | "¿Hay fresas hoy?" | Confused | Current site has **no off-season state** — Products grid still shows 3 cards at 7.50€ with no "agotado / próxima cosecha". **CRITICAL FRICTION:** persona buys, expects fresh fruit, receives nothing or a delayed order = trust burn. **Opportunity:** Beat-them #15. |
| Consideration | Read about, scroll to CTA | "¿Cuándo vuelven?" | Patient if signaled | CTA currently says "¿Listo para probar las fresas de Yaya Mariana?" → year-round commercial framing. **Friction:** off-season this CTA reads broken. **Opportunity:** seasonal switch in CTA copy: "Próxima cosecha: marzo. Te avisamos." |
| Decision | Submit email to waitlist | "¿Es opt-in real o me van a spamear?" | Cautious | Bandera #4: Resend, RGPD, double opt-in. **HIGH UX priority:** double-opt-in language must be explicit at submission ("te enviaremos un email para confirmar"); RGPD consent checkbox unticked-by-default; clear unsubscribe promise. |
| Action | Confirm via email link | "Listo." | Trust | Confirmation page on the same domain, not a thrown-together page. **Opportunity:** "Gracias — te avisaremos en cuanto Mariana esté en temporada" — but careful: "Mariana esté en temporada" treats her as the product. Reframe: "te avisaremos en cuanto las primeras Mágnum de Tarragona estén listas." |
| Post-action | Receive seasonal email | "Por fin." | Anticipating | First seasonal email is *the* moment; copy must match homage register, not promotional. |

**Friction summary (Journey C):** no off-season state today · waitlist trust hinges on double-opt-in + RGPD copy · "Mariana esté en temporada" wording is a tribute landmine.

### Journey D — Mobile flow (cross-persona)

Single-column collapse of two-column Hero (`md:w-[55%]` / `md:w-[45%]`). Concerns identified statically:

| Stage | Friction / Opportunity |
|---|---|
| Hero | Sticky nav is 72px + a logo image 254×56 unoptimized JPG. On iPhone SE width, three nav links + LanguageSelector + "Ver tienda →" CTA + 254px logo cannot fit — `md:flex` hides the links below md, fine. But the logo at 254px wide on a 375px viewport leaves ~120px for the language selector + CTA — verify in QA. Language dropdown tap target ~`fontSize:13`+`gap:1` is below 44px — Beat-them #11. |
| Hero R-column | Second 380×380 logo image on right column collapses below text — duplicates the nav logo. **Friction:** two large logos in the same scroll. This is the killer-visual gap (Bandera #1 unresolved). Until photo exists, leave the logo there but consider a typographic placeholder ("Mágnum · Dream · 1525") to avoid two logos. |
| StatsStrip | 2-column grid on small viewports (`grid-cols-2 md:grid-cols-4`). Fine. |
| Products | 1-column grid on small viewports; carousel arrows hide unless hovered (touch never hovers). **Friction on touch:** arrows are invisible. **Opportunity:** show arrows always on touch / use swipe gestures. Beat-them #11. |
| Add to cart | Floating button bottom-right covers part of last product card on small viewports. Verify. |
| Cart sheet | `max-w-[22rem]` (352px) — on iPhone SE (375px) this is good, leaves a thin backdrop strip. OK. |
| Contact form | Stacks 1-column on mobile. Form fields focus-scale 1.01 — minimal motion, fine. |
| Checkout link | `target="_blank"` on mobile = new tab in Safari = back-button broken UX. **HIGH.** |

### Journey E — Language flow (CA · ES · EN)

| Persona | Language entry | Friction |
|---|---|---|
| Pau (Catalan foodie) | Lands ES (default), spots LanguageSelector top-right (small, easy to miss), switches to CA | The selector is a 13px dropdown in the nav corner — discoverability borderline. **Friction:** persona 2 may not find it. **Opportunity:** consider language-detection-on-first-visit (`Accept-Language` header) — MAJOR, flag for director. Lighter touch: increase tap target (Beat-them #11). |
| Ana (EU expat) | Lands ES, switches to EN | Same selector issue. EN translation parity must be verified by translator agent in Fase 4. Honest gap: I have not validated EN text quality in `translations.ts` end-to-end. |
| All | Switch language | The site uses `useLanguage` context — switch is instant (no reload). Good UX. But text length varies (CA tends longer than ES), Hero quote could overflow on narrow viewports — verify in mobile-obsessor pass. |

**Stats-strip language bug (already triaged):** ES labels currently contain `"Del camp a taula"` and `"Qualitat premium"` (CA contamination). Persona 1/3/5 reading ES hits this as a "this brand isn't careful" signal. **HIGH priority cosmetic.** Already on Fase 4 fix list.

### Journey F — Reduced-motion flow

Audit findings:
- Hero MeshGradient (paper-design/shaders-react) animates `speed={0.5}` — does it respect `prefers-reduced-motion`? Library default may not. **HIGH UX risk** for vestibular-sensitive users + a tribute site should err on the side of restraint anyway. **Recommendation:** wrap in a `prefers-reduced-motion: reduce` query and freeze the gradient.
- AnimatedValue counters in StatsStrip (1.4s ease-out count-up): no reduced-motion check. Should freeze to final value if motion reduced.
- Typewriter heading in Products: 55ms per character, no reduced-motion check. Should render full text instantly if reduced.
- Framer-motion section entrances (translate + fade): framer-motion respects `prefers-reduced-motion` via `useReducedMotion()` hook IF used; current code uses raw `initial/animate` props which do NOT auto-respect. **MEDIUM.**

Beat-them #6 (IntersectionObserver entrances + reduced-motion) directly addresses this. **UX-validated as CRIT for accessibility-perfectionist in Fase 4.5.**

---

## 4. Pain points + opportunities — section by section (with homage-tone lens)

### Hero
- **Strengths (UX):** quiet quote-led entry suits the tribute register; sticky nav is clean; eyebrow + decorative line is restrained.
- **Pain (commercial):** killer message (Mágnum/Dream/1525 + Tarragona) absent from first viewport for foodie persona; logo-as-hero-image-on-right is a placeholder, not a brand asset.
- **Pain (homage):** none significant. The Playfair italic quote in `#c0392b` actually carries weight if the page below holds it. Could be improved by attributing the quote with a quiet "— Yaya Mariana" treatment + (very small) "en memoria de" undercurrent treatment in Footer or AboutUs, NEVER in Hero (would over-explain).
- **Opportunity:** Beat-them #2 (chip), #8 (variety typographic line), #9 (logo asset polish). Validate that the chip "semana {ISO}" doesn't pull eye from H1 — small, low-weight, secondary color (see §5).

### StatsStrip
- **Strengths:** dark band breaks the page rhythm nicely; counter animation is satisfying.
- **Pain (commercial):** broken "+" stat (regex), label contamination, generic numbers don't tell the story.
- **Pain (homage):** the dark maroon `#5c1a1a` with large `3.25rem` numbers and bold serifs reads *loud* immediately after a delicate Hero quote. On a tribute site, the dark band should feel like a quiet aside (small data, lighter weight), not a stadium scoreboard. **Restraint risk: MEDIUM.**
- **Opportunity:** Beat-them #3 + soften the visual weight (lower the value font-size from 3.25rem to ~2.5rem, drop the `whileHover` `brightness(1.3)`, reduce count-up duration). Coordinate with visual-perfection.

### Products
- **Strengths:** the section is the build's strongest; carousel + parallax + badge shine are Awwwards-tier craft moves.
- **Pain (commercial):** no variety descriptor / finca / Brix on card; "Ver más" link goes to `/checkout` not a product detail page — false affordance.
- **Pain (homage):** the typewriter heading + auto-rotating carousel + parallax mouse-track + badge shine animation + product card hover lift + accent line slide-in on hover = *seven* motion events in the same section. For a tribute site this is a lot. Each is tasteful individually; together they push the section toward "Instagram ad" energy. **Restraint risk: MEDIUM–HIGH.**
- **Opportunity:** Beat-them #1 + #7 (data) · gate auto-rotate behind `prefers-reduced-motion` AND `hover: none` (don't auto-rotate on touch — wastes battery, annoys) · consider removing the badge shine animation or making it run only ONCE on viewport entry, not on a 2s repeat loop · disable `/checkout` `target="_blank"` (#12).

### AboutUs
- **Strengths:** clean 720px max-width container, blockquote treatment, quote attribution exists.
- **Pain (commercial):** Pau (foodie) doesn't get cultivar specifics here either — copy is generic.
- **Pain (homage):** **CRITICAL.** Current copy: *"Yaya Mariana nació de la pasión por las fresas de calidad."* This sentence treats "Yaya Mariana" as the brand (which it is) without the layer that Mariana was a real person. Tribute lens requires: past tense where the narrative is about her ("mi yaya Mariana me enseñó..."), first-person founder voice (Beat-them #4 already specifies this), and absolutely no "ven a conocerla" / "descubre a Mariana" copy. The current `t.about.titleEm` `"cultivado con amor"` is acceptable but adjacent to greeting-card territory.
- **Opportunity:** Beat-them #4 is the single highest-leverage homage move in the audit. Validation: copywriter must draft ~60–90 words, first person, past tense for narrative about her, present tense for what *J. Elías* still does, attribution `"J. Elías, fundador"` (HARD: no expansion). One specific memory (e.g., "Recogía las fresas al alba, con un pañuelo en la cabeza") earns more trust than three abstract sentences. The portrait (Bandera #2) is the visual anchor; if no family photo, the minimal-illustration / typography-only fallback is correct and better than AI.

### Values
- **Strengths:** clean 6-card grid, restrained icons, framer-motion entrances feel premium.
- **Pain (commercial):** card titles are generic ("Vitamina C natural", "Sabor intenso") — every berry brand has these.
- **Pain (homage):** the *concept* of nutritional bullet-points sits adjacent to commerce; on a tribute site, a Values section that reads like a packaged-food side panel feels slightly off-register. NOT a blocker — this is the universal "amor de abuela" surface, and Persona 3 (Laura) needs it.
- **Opportunity:** if copywriter touches Values in Fase 4, soften the medical-spec tone of card 2 ("Con un 90% de contenido en agua...") toward sensory/experiential register. NOT in Beat-them plan; flag as MEDIUM optional polish.

### CTA
- **Strengths:** dark gradient breaks the page, large H2, trust badges visible.
- **Pain (commercial):** "Devolución en 14 días" is good; "Envío gratuito" needs a threshold ("desde 50€") to avoid post-checkout disappointment — verify with the actual fulfillment policy before display.
- **Pain (homage):** *"¿Listo para probar las fresas de Yaya Mariana?"* is on the *uppermost* boundary of acceptable for a tribute site. Replace the question-mark Instagram-ad register with a quieter assertion or seasonal copy (Beat-them #15) and the section recovers. The dark gradient + white H2 + emoji-icon trust badges (the SVG star polygons read as decorative) push the visual register commercial.
- **Opportunity:** soften CTA copy register: "Pruébalas esta temporada" or "En temporada · marzo–junio" rather than the question framing. Beat-them #14 cold-chain microcopy fits naturally here.

### Contact
- **Strengths:** classic 2-column info+form, focus-scale on field is subtle, conversion path clear.
- **Pain (commercial):** fake submit (`setSent(true)` with no backend) — Bandera #4 not yet wired. The "Te responderemos en menos de 24 horas" promise is a *trust burn* until Resend is live. **HIGH UX risk** if shipped as-is.
- **Pain (homage):** the green checkmark emoji `✅` in the success state (line 146 of contact.tsx) is the *only* visible emoji in the build and it appears at one of the most emotionally-loaded moments (post-contact). Even if global rule allowed it, on a tribute site at the success-confirmation moment, replace with a SVG checkmark in brand color. **Recommend removing emoji** here — consistent with La Nonna's no-emoji rule and stronger restraint signal.
- **Opportunity:** **Temporary UX for the fake-submit interim** (decided to keep until Resend): change the success copy from "Te responderemos en menos de 24 horas" to a softer "Hemos recibido tu mensaje" + acknowledge an internal review window without making a 24h promise the backend can't honor. Once Resend is live (Bandera #4), restore the 24h promise.

### Footer
- **Strengths:** clean dark `#2d0a0a` with three nav columns, social icons, "Diseño por Okawa" credit, copyright auto-year.
- **Pain (commercial):** footer links point to `yayamariana.com/blog/`, `/envios/`, `/politica-de-privacidad/`, etc. — the *old legacy domain* that's abandoned (per phase-0 report). On `yayamariana.es` these will 404 or land on abandoned content. **HIGH UX/SEO risk** — phase-0 already noted legacy → not migrated. The footer needs decisions: stub pages on `.es` domain, or change links to `#` until pages exist.
- **Pain (homage):** none directly; Footer is a neutral surface. **Opportunity:** Beat-them #16 (press-strip) lives here as a quiet "Como se ha visto en..." line — fits tribute tone if presented as quiet text, not as logo-bumpers.

### Cart
- **Strengths:** floating button is well-placed; sheet slides in spring-naturally; empty state has an icon and message; quantity controls work; the entire interaction is on-spec.
- **Pain (commercial):** "Ir a pagar · €{total}" button leads to a `/checkout` page (separate route) — but the Products grid cards have `target="_blank"` on the same `/checkout` link, creating *two different checkout entry behaviors* (Products opens new tab; Cart navigates same-tab). **Inconsistency = friction.** Beat-them #12 standardizes both to same-tab.
- **Pain (homage):** the "Ir a pagar" button gradient + the floating button gradient + the green added-to-cart confirmation are three loud commerce moments. The Cart sheet is *correctly* commercial — this is the moment for energy. But the floating button could be slightly toned (gradient → solid `#c0392b`?) to feel less "shopping app" and more "carrito sereno". **Optional polish — flag MEDIUM, not in plan.**
- **Opportunity:** Cart heading is hardcoded ES `"Tu cesta"`; the Cart component doesn't use `useLanguage`. **Bug:** Persona 2 (CA) and Persona 5 (EN) hit Spanish in their cart. **HIGH priority cosmetic / i18n bug.** Add to triaged-bugs list for frontend-developer + translator.

---

## 5. UX validation of the 18 Beat-them plan points

| # | Point (compact) | UX risk | UX adjustment if any |
|---|---|---|---|
| 1 | Variety badge + sensory descriptor per card | **LOW** | Keep descriptor ≤8 words; position badge below price OR replace generic "Premium" badge — don't stack 2 badges on small cards. Persona 2 wins here. |
| 2 | Hero traceability chip "Tarragona · {variedad} · semana {ISO}" | **MED** | Cognitive load + Hero-attention concern. Place BELOW the quote, NOT above; small text (12–13px), single line, secondary color (`#7a3a3a/65`), no animation. **Do NOT compete with the quote** — the chip is a footnote, not a headline. Persona 4 (tribute-aware) tolerance: fine, reads as "this brand is honest about where things come from", which fits homage. |
| 3 | StatsStrip Brix · 24h · 3 variedades · 0 pesticidas | **MED** | **Homage tension.** Soften the visual weight (font-size, hover brightness, count-up speed) — see §4 StatsStrip. Numbers are right; staging needs to be quieter. |
| 4 | AboutUs first-person abuela + portrait | **HIGH** (in the *opportunity* sense — highest leverage but also highest tone risk) | **Tribute-firewall critical.** Past tense for narrative about Mariana. First-person for J. Elías. No "ven a conocerla". Specific memory > abstract praise. Portrait: family archive w/ approval first; if unavailable, *minimal illustration or typography-only* (Bandera #2). **NEVER AI.** If portrait is typography-only fallback, the section can still work — restraint signals respect. |
| 5 | 2-color palette discipline in globals.css | **LOW** | Pure visual; UX-neutral. Validate contrast against cream (#10). |
| 6 | IntersectionObserver entrances + reduced-motion | **LOW** | Strongly recommended. Add `useReducedMotion()` to all framer-motion calls. Validate the Hero MeshGradient also respects reduced motion (currently does not). |
| 7 | Finca + harvest-week + variety chip on product cards | **LOW** | Same chip pattern as #2. Single line, small, below image / above body copy. Persona 2 + 3 win. |
| 8 | Hero typography line "Mágnum · Dream · 1525" | **LOW** | Place BELOW the quote and BELOW the chip from #2. Single restrained Playfair italic line. Persona 2's hook. |
| 9 | Logo WebP/AVIF + drop `unoptimized` + priority hero only | **LOW** | Pure perf; UX-positive (LCP). Currently both Hero logo AND right-column logo are `unoptimized priority` — bandwidth waste. |
| 10 | Contrast audit vs cream `#fdf6f5` | **LOW** | Confirm `text-[#7a3a3a]/65` and `/50` body alphas pass AA against `#fdf6f5` (likely borderline). Owner: accessibility-perfectionist. |
| 11 | Mobile tap targets ≥44px | **LOW** | LanguageSelector dropdown, carousel arrows on touch (currently hover-only), nav links — all need verification. |
| 12 | Close `/checkout target="_blank"` leak | **LOW** (high impact, trivial fix) | All instances (Products card "Ver más", AboutUs "Ver tienda", CTA "Comprar ahora", Footer links to `/checkout`). Standardize to same-tab. Persona on Journey A and B both win. |
| 13 | SEO long-tail + JSON-LD + sitemap/robots + hreflang | **LOW** | UX-neutral; SEO-positive. Validate Catalan hreflang is `ca-ES` not `ca`. |
| 14 | Cold-chain microcopy near CTA | **LOW** | Soften register: "Cosechadas la víspera del envío · embalaje refrigerado · 24–48h península" reads warmer than "envío express refrigerado". Persona 1 (gift-buyer) primary win. |
| 15 | Off-season próxima-cosecha countdown + waitlist capture | **MED** | **Tribute-firewall sensitive.** Copy must avoid: "Mariana esté en temporada" (treats her as the product), "ven a conocerla", "ven cuando lleguen". Use: "Próxima cosecha: marzo. Te avisamos en cuanto las primeras Mágnum estén listas." Resend / RGPD / double-opt-in (Bandera #4). Unticked-by-default consent. |
| 16 | Press-strip in Footer (El Mira · Diari · ElEspañol) | **LOW** | Plain-text citations in light-weight type; NO logos until rights confirmed (Bandera #3). Reads as quiet credibility, not endorsement bumpers. |
| 17 | Drop Yellowtail; Playfair italic founder signature | **LOW** | Persona 4 (tribute-aware) benefits — Yellowtail was the only "decorative-script" risk on a tribute site. |
| 18 | Easter egg hover Mágnum (single petal/leaf bloom) | **MED** | **Tribute-firewall sensitive.** "Bloom of yaya Mariana's hands" was the earlier draft — DROP that variant; it surfaces her too literally. Acceptable variant: single petal/leaf, 0.8–1s, NO sound, NO secondary trigger, reduced-motion = skip. Persona 4 reads it as "this brand cares about craft", Persona 1/2 as a delight, Persona 3 as neutral. |

**Summary:** 0 HIGH risks · 5 MED risks (#2, #3, #4, #15, #18) — all manageable with the tonal guards above · 13 LOW. **No Beat-them point should be cut.** All 18 are UX-compatible after the noted register adjustments.

---

## 6. Trust & accessibility journey (quick pass — deep pass owned by accessibility-perfectionist in Fase 4.5)

- **RGPD cookies banner:** currently absent in the audited build. Required before EU traffic. **Owner:** legal copy via copywriter, implementation via frontend-developer. **MED priority for Fase 4.**
- **Cookies vs waitlist consent:** separate concerns. Waitlist (Bandera #4) has its own consent + double-opt-in flow.
- **Dark/light mode:** site is light-only (cream + dark accents). No prefers-color-scheme handling. **Acceptable** — the homage palette is the brand. Do NOT introduce a dark mode; it would force re-design and dilute restraint.
- **Reduced-motion:** see §3 Journey F — MeshGradient, AnimatedValue counters, Typewriter, framer-motion entrances all need explicit reduced-motion handling. **HIGH for Fase 4.5.**
- **Keyboard navigation:** nav links + LanguageSelector + CTAs are all `<a>`/`<button>` — should keyboard-traverse correctly. Carousel arrows in Products are `<button>` but only visible on hover — keyboard users tab to invisible controls. **Friction:** need focus-visible outline OR make arrows persistently visible. Cart sheet open state should trap focus inside the sheet — verify in QA.
- **Screen reader:** Hero `alt="Yaya Mariana"` on logo is fine. Carousel images alt `"${name} foto ${current + 1}"` — descriptive enough. Form labels are wired correctly. StatsStrip values rendered through `<AnimatedValue>` — verify the visible text is read, not "0" mid-animation. **Owner:** accessibility-perfectionist.
- **ARIA:** LanguageSelector has `aria-expanded` + `aria-haspopup="listbox"` — good. AnimatePresence dropdown role="listbox" + option role — good. Verify Cart sheet has `role="dialog" aria-modal="true"` — currently no role set on the panel div. **MED.**

---

## 7. Mobile-specific concerns

| Concern | Severity | Recommendation |
|---|---|---|
| Two Hero logos (sticky nav + 380×380 right-column) on small viewports = double logo footprint | MED | Until killer-visual photo (Bandera #1) exists, replace right-column logo with the typography line "Mágnum · Dream · 1525" (Beat-them #8) — solves duplication AND advances the cultivar hook. |
| Products card carousel arrows hover-only — invisible on touch | MED | Show arrows always OR enable swipe gestures (`react-swipeable`). Beat-them #11. |
| Floating cart button overlap with last product card | LOW | Add bottom padding to Products section equal to button height. Cosmetic verification in QA. |
| LanguageSelector tap target (~13px text + small dropdown trigger) | MED | Increase tap target ≥44px (Beat-them #11). Consider showing all 3 options inline as small toggles on mobile instead of dropdown — eliminates a click. |
| Sticky CTA placement on mobile | n/a | No sticky mobile CTA exists. **DO NOT ADD** — would add commerce pressure and break the tribute restraint. The floating cart button is enough. |
| Drawer cart vs sheet on mobile | LOW | Current right-side sheet at `max-w-[22rem]` is correct iOS-pattern. Keep. |
| Modal vs Sheet patterns | n/a | No competing modals exist. Cart is the only sheet. Contact form is inline. Good. |

---

## 8. Top 5 pain points to fix in Fase 4.5

| # | Pain | Owner agent | Priority |
|---|---|---|---|
| 1 | `/checkout target="_blank"` leak everywhere (Products card, AboutUs CTA, CTA section "Comprar ahora", Footer "shop" links) — breaks momentum on every persona, *especially* destroys the emotional moment for Persona 4 | conversion-funnel-optimizer + frontend-developer | **CRIT** |
| 2 | AboutUs copy reads commercial-with-grandmother-skin; tribute layer absent at the only section where it should land | copywriter (Beat-them #4) + image-curator (portrait or fallback per Bandera #2) | **CRIT** |
| 3 | Reduced-motion respect missing across Hero MeshGradient, AnimatedValue counters, Typewriter heading, framer-motion entrances — accessibility AND tribute restraint signal | accessibility-perfectionist + animation-premium | **HIGH** |
| 4 | Cart sheet header hardcoded ES "Tu cesta" + "Eliminar" + "Subtotal" + "Envío" + "Ir a pagar" — Persona 2 (CA) and Persona 5 (EN) hit Spanish at checkout, breaks i18n trust | frontend-developer + translator | **HIGH** |
| 5 | Contact form fake-submit promises "responderemos en menos de 24 horas" while no backend exists — trust burn until Resend is live | copywriter (interim copy) + fullstack-developer (Resend later) | **HIGH** |

Honorable mentions (next priority):
- StatsStrip "+" stat broken regex (already on triage list, frontend-developer)
- StatsStrip ES labels contaminated by CA (already on triage list, copywriter/translator)
- Footer links pointing to abandoned `yayamariana.com` legacy domain — decision needed (seo-genius / director)
- Emoji ✅ in Contact success state — replace with brand-color SVG checkmark
- LanguageSelector tap target on mobile <44px

---

## 9. Tribute-tone UX risks identified (5 places where homage and commerce tension)

1. **AboutUs reading as marketing.** The page's emotional anchor currently delivers a brand-launch copy register, not a tribute register. *Tension:* commerce wants a launch story; homage wants a memory. *Resolution:* Beat-them #4 — first person, past tense for narrative about her, one specific moment over three generic sentences.

2. **CTA section "¿Listo para probar las fresas de Yaya Mariana?"** Question-mark Instagram-ad register on the strongest commerce surface. *Tension:* the CTA needs to convert; the tribute register doesn't ask "¿listo?" *Resolution:* reframe as quiet assertion ("Pruébalas esta temporada") or seasonal hook ("En temporada · marzo–junio") — also enables Beat-them #15 off-season state without a copy rewrite.

3. **StatsStrip visual weight against Hero quote.** Loud dark band with 3.25rem bold numbers immediately after a delicate italic quote. *Tension:* the numbers are the commerce proof; the proximity makes them feel sales-y on a tribute page. *Resolution:* soften the StatsStrip visual weight (font-size, hover-brightness, count-up speed) — keep the numbers, lose the volume.

4. **Off-season "te avisamos" copy is a tribute landmine.** *Tension:* the natural sentence is "te avisamos cuando Mariana esté en temporada" — but that treats her as a *seasonal product*. *Resolution:* "te avisamos en cuanto las primeras Mágnum de Tarragona estén listas" — keeps the urgency, removes the tribute violation.

5. **Easter egg #18 risk of surfacing Mariana literally.** Earlier draft mentioned "bloom of yaya Mariana's hands". *Tension:* delight vs. exploitation. *Resolution:* single petal/leaf bloom only; never her image/hands as a hover trigger; reduced-motion skips it entirely. Easter-egg-creator must hold this line.

**Sixth (honorable mention) — Cart heading "Tu cesta" + green gradient confirmation button.** The Cart sheet is *correctly* commercial (this is the buy moment), but the gradient + the green added-to-cart animation are the loudest commerce signals in the build. Persona 4 (tribute-aware) tolerates this because they understand they're buying — but worth flagging that the *style-guide-enforcer* sweep (Beat-them #5) should slightly tone the Cart's gradient saturation to keep it consistent with the rest of the restraint.

---

## 10. Confirmation paths

- **Deliverable saved at:** `C:\proyectos\yaya-mariana\docs\agency\phase-1-ux-researcher-audit.md`
- **Memory appended at:** `C:\Users\8nill\.claude\agencia-web-v2\memory\ux-researcher-memory.md` (created in this engagement)
- **Inputs read exactly once each:**
  1. `C:\Users\8nill\.claude\agencia-web-v2\memory\global-memory.md`
  2. `C:\Users\8nill\.claude\agencia-web-v2\analysis\ux-researcher.md` (role spec)
  3. `C:\proyectos\yaya-mariana\docs\agency\phase-0-report.md`
  4. `C:\proyectos\yaya-mariana\docs\agency\phase-0-competitor-killer-plan.md`
  5. `C:\proyectos\yaya-mariana\src\app\page.tsx`
  6. `C:\proyectos\yaya-mariana\src\components\ui\hero.tsx`
  7. `C:\proyectos\yaya-mariana\src\components\ui\stats-strip.tsx`
  8. `C:\proyectos\yaya-mariana\src\components\ui\products.tsx`
  9. `C:\proyectos\yaya-mariana\src\components\ui\about-us.tsx`
  10. `C:\proyectos\yaya-mariana\src\components\ui\values.tsx`
  11. `C:\proyectos\yaya-mariana\src\components\ui\cta.tsx`
  12. `C:\proyectos\yaya-mariana\src\components\ui\contact.tsx`
  13. `C:\proyectos\yaya-mariana\src\components\ui\footer.tsx`
  14. `C:\proyectos\yaya-mariana\src\components\ui\cart.tsx`
  15. `C:\proyectos\yaya-mariana\src\i18n\translations.ts` (partial — confirmed copy register and CA contamination bug)
- **Narrative-firewall verification:** zero expansions of `"J. Elías"`, zero references to investor identity, zero references to Audax/La Sirena/hydroponic lettuce/Mariana being currently alive. References to Mariana are past tense where narrative is about her; tribute register held throughout.
- **Mode-constraint verification:** 0 new sections proposed · 0 platform rewrites · 0 untouchables touched · 0 migration moves · 0 expansions of initials. All recommendations fit inside the 9 existing sections.
