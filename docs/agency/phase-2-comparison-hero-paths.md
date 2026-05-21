# Comparison Report — Hero Path P (photograph-led) vs Hero Path T (typography-only)

**Date:** 2026-05-21
**Project:** Yaya Mariana — premium artisanal fresas de Tarragona · tribute site
**Phase:** 2 — Análisis profundo
**Decision type:** Design
**Framework used:** A (Design Comparison) — director-adjusted weights for a tribute site
**Requested by:** director
**Prepared by:** comparison-engine
**Mode:** AUDIT — surgical refinement of the existing `clasico` build

---

## Scope and framing

The Phase-1.5 mood board specifies the Hero of every visual direction **twice** in parallel:

- **Path P — photograph-led Hero:** the Hero 380×380 slot holds real archival family photography of Mariana (her hands cradling a single Mágnum strawberry over warm cream); or, failing that, next-generation family hands in the same restrained composition.
- **Path T — typography-only Hero:** the same Hero, with the photo slot replaced by a typographic statement — `"Mágnum · Dream · 1525"` set large in Playfair Display, the traceability chip beneath, carried by type and theatrical cream whitespace.

This comparison evaluates **Path P vs Path T** using **Direction B "En su Punto"** as the primary reference case — it is the mood board's standing recommendation. The Conditions section states explicitly how the verdict shifts if Direction A or C is confirmed instead.

**Critical constraint (Risk 1, `phase-1-report.md`):** the family conversation this week has not yet resolved whether usable archival photography of Mariana exists. The goal of this comparison is **NOT to eliminate a path.** Both Hero paths must stay viable until that conversation resolves. The verdict is therefore deliberately **conditional**.

**Pre-Comparison gate:** SATISFIED. The director has approved the weights below; proceeding directly to scoring.

### Director-approved weights (Framework A, tribute-site adjustment)

| Criterion | Default A | Tribute-adjusted | Rationale for the shift |
|---|---|---|---|
| Visual hierarchy | 20% | **20%** | Unchanged. |
| Brand alignment | 20% | **25%** | Tone/homage fit is the project's defining success condition. |
| Conversion readiness | 20% | **10%** | Homage site, not a conversion funnel — down-weighted. |
| Mobile experience | 15% | **15%** | Unchanged. |
| Accessibility | 10% | **15%** | Restraint + a11y are core to the tribute register. |
| Awwwards standard | 15% | **15%** | Unchanged — restraint-aware craft, not spectacle. |
| **Total** | 100% | **100%** | |

These weights are used as the approved default throughout. A secondary "strict default Framework A" run is shown in the Analysis section to surface the delta.

---

## Variant A — Path P (photograph-led Hero)

The Hero centre asset is a single warm still life: ideally Mariana's hands (archival) cradling one Mágnum strawberry over warm cream; the documented fallback is next-generation family hands in the identical composition. Shallow depth of field, natural light, no studio gloss. Face out of frame or defocused (narrative firewall — investor identity never surfaced). The H1 keeps the quiet Playfair quote entry; the traceability chip and the `"Mágnum · Dream · 1525"` line sit below as quiet footnotes.

Path P is **conditional on an asset that does not exist yet** (Bandera 1, `phase-0-report.md`). It is only deliverable if the family provides usable archival photography or consents to a restrained next-gen-hands session.

## Variant B — Path T (typography-only Hero)

The Hero centre asset is a typographic statement: `"Mágnum · Dream · 1525"` set large in Playfair Display, the traceability chip beneath, surrounded by theatrical cream whitespace (the Le Fruit Studio / Canlis model). The H1 quote, the chip, and the variety line are unchanged from Path P — only the centre asset differs. The warmth is carried by the cream palette and the type, not by a person.

Path T is **deliverable today.** It depends on no unresolved input. It also resolves a live build defect: the current Hero right column holds a *second* 380×380 logo image, duplicating the nav logo (`phase-1-ux-researcher-audit.md` §7, Journey D). Path T's typographic block replaces that duplicate logo cleanly.

---

## Scoring — Direction B "En su Punto" (primary reference case)

Scores 1–10. Weighted score = (score × weight) summed. Winner declared at gap ≥5 weighted points; "too close to call" below 5.

| Criterion | Weight | Path P | Path T | Notes |
|-----------|--------|--------|--------|-------|
| Visual hierarchy | 20% | 8 | 8 | P: a photograph is a natural focal anchor for the right column — but it competes with the Playfair quote H1 for first fixation, a real risk the ux-researcher flagged ("do NOT replace the quote"). T: the centre type is hierarchically subordinate to the H1 by design; one clear focal order. Even. |
| Brand alignment | 25% | 8 | 9 | Both honour the homage tone. T edges ahead *for Direction B specifically*: the mood board states Path T "is not a fallback here — it is the purest expression of the direction." Restraint is the trust signal for Marc & Helena (ux-researcher: "gloss kills the sale"). P with *authentic archival* photography would score 9 too — but P also carries the next-gen-hands fallback, which is one degree less true to "her". |
| Conversion readiness | 10% | 8 | 7 | P: a real human-hands image is a stronger appetite + provenance cue (warm, tactile, gift-able for Núria). T: the variety type line is a sharper cultivar hook for Pau, but the Hero carries less appetite. P slightly ahead — low weight, small effect. |
| Mobile experience | 15% | 7 | 9 | P: a 380×380 photo below the text on a 375px viewport adds weight and a real LCP image to the critical path. T: a typographic block reflows cleanly, removes the duplicate-logo problem, and adds near-zero LCP cost. T clearly better at 375px. |
| Accessibility | 15% | 7 | 8 | P: requires a genuinely descriptive, firewall-safe `alt` (no investor identity) and a correct contrast read of any caption over cream. T: text is natively accessible, scalable, reflowable, screen-reader-perfect; the only check is Playfair contrast vs `#fdf6f5`. T ahead. |
| Awwwards standard | 15% | 8 | 8 | P: archival photography handled with restraint is an authenticity signal (Ruinart model). T: type-as-hero is a proven SOTD move (Le Fruit Studio, Canlis). For Direction B's restraint-led identity both clear the bar; neither is spectacle. Even. |
| **Weighted Total** | **100%** | **7.65** | **8.30** | |

**Weighted total — Path P:** (8×.20)+(8×.25)+(8×.10)+(7×.15)+(7×.15)+(8×.15) = 1.60+2.00+0.80+1.05+1.05+1.20 = **7.65**
**Weighted total — Path T:** (8×.20)+(9×.25)+(7×.10)+(9×.15)+(8×.15)+(8×.15) = 1.60+2.25+0.70+1.35+1.20+1.20 = **8.30**

**Gap: 0.65 weighted points → "too close to call" by the role-spec threshold (gap <5).**

Note the threshold caveat: the role spec's "≥5 points" rule is calibrated to a 0–100 weighted scale. On the 1–10 scale used here, 5 points is not a meaningful gap; the comparable proportional gap is ~0.5. The Path P/T gap of 0.65 is *just past* that proportional line — a real but narrow lead for Path T, not a decisive one. This is consistent with the mood board's own framing that Path T "is not a downgrade."

---

## Secondary run — strict default Framework A weights (delta check)

Re-scored with the *un-adjusted* Framework A defaults (Brand 20%, Conversion 20%, Accessibility 10%) to show how sensitive the verdict is to the weight choice:

| Criterion | Default weight | Path P | Path T |
|---|---|---|---|
| Visual hierarchy | 20% | 8 | 8 |
| Brand alignment | 20% | 8 | 9 |
| Conversion readiness | 20% | 8 | 7 |
| Mobile experience | 15% | 7 | 9 |
| Accessibility | 10% | 7 | 8 |
| Awwwards standard | 15% | 8 | 8 |
| **Weighted Total** | 100% | **7.75** | **8.10** |

**Delta:** under strict defaults the gap narrows to 0.35 (Path T still ahead). The tribute-adjusted weights *widen* Path T's lead (0.65) because they up-weight Brand and Accessibility — the two criteria where T leads — and down-weight Conversion, the one criterion where P leads. **The verdict direction (T ahead on Direction B) is stable across both weightings; only the margin changes.** This confirms the director-approved weights are not manufacturing the result — they are sharpening a lead that exists either way.

---

## Analysis

**Where Path P leads:** A real photograph of Mariana's hands is the single most emotionally direct asset the site could carry — it makes the tribute *immediate* rather than implied, and it is the strongest appetite/provenance cue for the gift-buyer (Núria). If the family provides genuine archival photography, P delivers warmth that T can only approach. P leads on conversion readiness, and would tie T on brand alignment *only when the asset is authentically archival*.

**Where Path T leads:** Path T is deliverable today with zero unresolved dependencies, it is hierarchically cleaner (the type cannot fight the H1 quote the way a photo can), it is materially better on mobile and accessibility, and it resolves an existing build defect (the duplicate right-column logo, ux-researcher §7). For Direction B specifically, the mood board is explicit that T is "the purest expression of the direction" — restraint *is* the identity, and the silence that would frame a photo simply frames the type instead.

**The decisive factor:** there is no single decisive *quality* factor — the two paths are close on craft. The decisive factor is **dependency risk**. Path P is gated on an asset that does not exist and may never exist (Bandera 1 / Risk 1). Path T is gated on nothing. For Direction B, T is also the aesthetically purer choice, so the dependency risk is not even a trade-off against quality — choosing T sacrifices almost nothing. That combination is what produces the conditional verdict below.

### Bias Check

- **Recency bias:** *Not detected.* Path T was scored second; its higher score traces to specific, listed criteria (mobile, a11y, brand-for-Direction-B), not to ordering. Cross-checked by re-scoring P's mobile and a11y in isolation — scores held.
- **Length bias:** *Not detected.* Both paths are specified at equal depth in the mood board; neither description is longer.
- **Novelty bias:** *Detected and corrected.* Initial instinct over-credited Path P as the "richer / more creative" option (a photograph feels like more design). Re-scored Visual hierarchy and Awwwards on the *artifact's effect for a restraint-led tribute*, not on apparent richness — P dropped from 9→8 on hierarchy because a photo competing with the H1 quote is a hierarchy *cost*, not a bonus. This is the same bias flagged in comparison-engine memory ("newer/richer always feels better").
- **Confirmation bias:** *Watched.* The mood board already recommends Direction B and frames Path T favourably for it. To correct, Path P was scored against an *authentic-archival* best case, not its weaker next-gen-hands fallback — giving P its strongest fair footing. P still trails, narrowly.
- **Anchoring:** *Not detected.* Path P (scored first) did not set a distorting anchor; the secondary strict-weights run independently reproduced the same direction.

---

## Verdict

**Recommended: CONDITIONAL — both paths stay alive until the family conversation resolves.**

This is not a "too close to call" punt and not a single winner. It is a genuinely conditional verdict, mandated by Risk 1:

- **Path P wins IF** the family provides usable archival photography of Mariana (or consents to a restrained next-gen-family-hands session). An authentic archival image carries warmth and tribute immediacy that Path T cannot fully match; in that case P's brand-alignment score rises to parity and its conversion edge stands. **Choose P.**
- **Path T wins IF** the family declines all photography, OR provides nothing usable, OR the conversation slips past the Phase-4 hero-specialist start. Path T is the better artifact on hierarchy-cleanliness, mobile, and accessibility, and — for Direction B — is the purest expression of the direction. **Choose T.**

**Third-option flag (surfaced per the role spec, do not artificially limit to two):** There is a case stronger than either pure path — **stage Path T as the shipping default now, and treat Path P as an in-place asset swap if and when the family delivers.** Rationale:

1. The mood board already guarantees the layout, spacing, and type are *identical* across P and T — only the 380×380 centre asset changes. The build can ship Path T and later swap in a photograph with **no structural change**, exactly the documented `R1-003`-style placeholder-slot pattern reused successfully on La Nonna.
2. This removes Path P from the project's critical path entirely. The family conversation becomes genuinely unhurried (the mood board's stated intent) instead of a Phase-4 blocker.
3. It costs nothing: Path T is not a downgrade, so shipping it as the default is not "settling." If the photograph never arrives, the site is already in its correct final state.

This third option is the recommended operational stance. It is fully compatible with the conditional verdict — it simply makes Path T the *default branch* of the condition and Path P a clean, non-blocking upgrade.

**Is either path strong enough to ship regardless of the family outcome?** **Yes — Path T.** For Direction B, Path T is shippable, defect-resolving, and the purest expression of the direction *independent of the family conversation*. Path P is NOT strong enough to ship regardless, because it is asset-gated. This asymmetry is the core finding: one path is unconditionally viable, the other is conditionally viable. That is precisely why the third option (ship T, swap to P later) is safe.

---

## Conditions — how the verdict shifts by Direction

The primary scoring above uses **Direction B "En su Punto."** The verdict shifts as follows if Direction A or C is the one ultimately confirmed by Nil and the family:

### If Direction A "La Mesa de la Yaya" is confirmed
**The Path P/T gap narrows, and may invert toward P.** Direction A's identity is *warm domestic intimacy* — warmth carried by a person, a table, hands. Here a photograph is not "one quiet element among several" (as in B); it is closer to the *point* of the direction. Path A's Path-T fallback is a warm earthenware still-life or a type block — described by the mood board as "strong," but **not** as "the purest expression" the way B's Path T is.
- Re-weighted intuition: under Direction A, Path P's Brand alignment rises to ~9 and Path T's drops to ~7–8 (warmth is harder to carry by type alone in a domestic-warmth direction). Conversion readiness also tilts further to P.
- **Likely result for Direction A:** Path P and Path T are a true coin-flip, with P slightly favoured *if authentic archival photography exists*. The conditional verdict still holds, but the "IF photography exists" branch becomes materially more valuable, and Path T is more of a genuine compromise (still good, not "purest"). The third-option stance (ship T, swap P later) remains the safe operational call, but with more upside pressure to secure the photograph.

### If Direction C "Del Campo, con Calma" is confirmed
**The gap stays narrow; Path T's relative position holds or slightly strengthens.** Direction C's identity is a *narrative descent* — the tribute is carried by the scroll and by AboutUs, not concentrated in the Hero. The mood board states the Hero in C "only needs to announce the journey"; the photograph "reads as the first frame of a story" but the story is told by the chapters below.
- Because C explicitly off-loads emotional weight from the Hero to the scroll, Path T's typographic chapter-opener loses very little — it announces the journey just as well as a photo does. Path P's advantage shrinks because the Hero is not where C's tribute lands.
- **Likely result for Direction C:** similar to Direction B — Path T narrowly ahead, gap ~0.5–0.7, and the third-option stance (ship T, swap P later) is again the clean call. C's added caveat is motion-dependency: whichever path ships, the reduced-motion fallback of the scroll narrative must be complete (ux-researcher Journey F).

### Summary table

| Confirmed direction | Path P / Path T relationship | Verdict posture |
|---|---|---|
| **B — En su Punto** (primary, recommended) | T narrowly ahead (8.30 vs 7.65). T is the *purest* expression of the direction. | Ship T as default; P is a clean non-blocking swap if family delivers. |
| **A — La Mesa de la Yaya** | True coin-flip; P slightly favoured *if authentic archival photography exists*. | Conditional verdict holds; the "IF photography" branch is more valuable; push harder to secure the photograph. |
| **C — Del Campo, con Calma** | T narrowly ahead, similar to B; Hero is not where C's tribute lands. | Ship T as default; P a clean swap. Ensure reduced-motion scroll fallback. |

**Cross-direction constant:** in all three directions, Path T is unconditionally shippable and Path P is asset-gated. The conditional verdict and the third-option operational stance are valid regardless of which direction is confirmed.

---

## If you choose the other option

- **If the director/family chooses Path P outright (before the family conversation resolves):** do not begin Phase-4 hero-specialist work until the asset is in hand. P with no asset is not a Hero — it regresses to the current duplicate-logo placeholder, which the ux-researcher already flagged as a defect. Hold P behind a confirmed, firewall-safe, consent-cleared photograph. Watch the `alt` text (no investor identity, face out of frame), the LCP cost of a 380×380 image on mobile, and contrast of any caption over cream `#fdf6f5`.
- **If the director/family chooses Path T outright and forecloses Path P:** that is a defensible call *for Direction B* and costs little — but it forecloses a genuine future upgrade. Keep the 380×380 slot architecturally photo-ready (documented placeholder-slot seam, the La Nonna `R1-003` pattern) so a photograph can still be added later without a code change, even if the current intent is type-only. Do not hard-code the typographic block in a way that makes a later swap a structural edit.

---

## Confirmation paths

- **Deliverable saved at:** `C:\proyectos\yaya-mariana\docs\agency\phase-2-comparison-hero-paths.md`
- **Memory appended at:** `C:\Users\8nill\.claude\agencia-web-v2\memory\comparison-engine-memory.md`
- **Inputs read once each:** comparison-engine role spec · global-memory · comparison-engine-memory · phase-1.5-mood-board · phase-0-report · phase-1-report · phase-1-ux-researcher-audit
- **Framework:** A (Design Comparison), director-approved tribute-site weights; secondary strict-default run shown for delta transparency.
- **Hard-rule compliance:** homage tone held (no marketing register) · no AI imagery of Mariana referenced or proposed · founder referenced only as the role, never expanded · audit mode respected (Path T resolves an existing defect, neither path adds a section or alters the 9-section IA).
- **Returned to director:** weighted scores (P 7.65 / T 8.30 on Direction B), the conditional verdict (P wins IF usable archival photography exists; T wins IF not), and the third-option flag (ship T as default, treat P as a non-blocking in-place asset swap).
