# Phase 1.5 — Creative Direction · Yaya Mariana
## Decisions by the creative-director ("the synthetic Nil")

**Project:** Yaya Mariana — tribute site in memory of Nil's grandmother · premium artisanal strawberries · ES/CA/EN
**Branch / mode:** `clasico` · AUDIT — every call below is achievable as surgical refinement, not a teardown
**Prepared by:** creative-director
**Date:** 2026-05-21
**Routed to:** the director (for Nil, and Hero-path escalation)

**Hard-rule frame applied to every decision below:** HOMAGE, NOT MARKETING — restraint amplifies dignity · no AI-generated imagery of Mariana, ever · narrative firewall: founder is only ever `"J. Elías, fundador"` · AUDIT — surgical refinement only.

---

## Creative Direction — Mood Board Visual Direction

**Decision:** Direction B — "En su Punto" (At Its Peak). Disciplined · luminous · quiet — restraint as reverence; the strawberry given silence.

**Confidence:** HIGH

**Rationale:** Nil's confirmed pattern (La Nonna, logged in creative-director-memory) is that he picks the *recommended* variant when the rationale leads with the 3-second rule, archetype fit, and differentiation — and mood-board-creator's recommendation for B leads with exactly those: it is the truest expression of the homage tone, it differentiates hardest from every Spanish berry competitor, and it is the only direction whose typography-only Hero is its *purest* form rather than a downgrade. The project context here explicitly overrides the agency's warm-default aesthetic model: the brief states "restraint amplifies dignity" and "if a direction reads like an Instagram ad, it is wrong" — that is a context that explicitly demands a restraint register, so B beats the warmer Direction A despite A being the closer match to Nil's generic warm/artisanal lean. The accepted, recoverable trade-off (B can read cool on first scroll) is mitigated structurally and not by redesign: warmth is carried by the cream `#fdf6f5` canvas, the first-person past-tense AboutUs voice (Phase-1 §2), the carmín-cálido red selected below, and natural-light photography — none of which require leaving Direction B.

**Risk 1 confirmation (BOTH Hero paths preserved):** Direction B is the *strongest* of the three on Risk 1 — "the family declines all photography." It specifies its Hero twice in parallel: Path P (a single Mágnum strawberry, or Mariana's archival hands, given silence) and Path T (the "Mágnum · Dream · 1525" typographic statement in theatrical cream whitespace, the Le Fruit Studio model). The layout, grid, spacing, and type are identical across both paths; only the 380×380 centre asset swaps. The family conversation therefore selects a Hero path and never resets the design — Risk 1 cannot damage this direction. Path T is treated as a first-class outcome, not a fallback; for a tribute site it is arguably the more disciplined option.

**Evidence:** `creative-director-memory.md` (Nil picks the recommended variant when rationale leads with 3-second rule + archetype fit + differentiation; La Nonna hero made structurally photo-independent) · `phase-1.5-mood-board.md` Phase 3 Direction B + Phase 4 recommendation + comparison table · `phase-1-report.md` §2 tonal frame and §9 Risk 1 · `phase-0-report.md` competitor landscape (no competitor holds restraint) · creative-director spec (project context overrides the warm default when the brief explicitly demands a register).

**Rejected:**
- Direction A "La Mesa de la Yaya" — warmer and the closer match to Nil's generic taste default, but the homage brief explicitly demands restraint over warmth, and A carries the named "abuela as marketing skin" / greeting-card drift risk the brief warns against. Held as documented second choice if the family's overriding wish is kitchen-warmth above all.
- Direction C "Del Campo, con Calma" — narrative-spine descent is the right call only with a rich family story/sequence to walk through, which has not been confirmed; it also asks the visitor to scroll for value and is the most motion-dependent, and its cream "warming" note adds a two-color-discipline risk the other two avoid.

**Next agent:** brand-designer (Phase 4) — build the visual identity system on Direction B's disciplined-restraint language: theatrical cream whitespace, rationed strawberry-red, Playfair Display + Inter held with editorial confidence, strict calm grid. `hero-specialist` and `image-curator` design Hero Path P and Path T in parallel and keep them swap-compatible, pending the escalated Hero-path decision below. All consistent with AUDIT mode — same 9 sections, same Playfair + Inter, same cream base, same non-scroll-jacking motion rule.

---

## Creative Direction — Strawberry-Red Calibration

**Decision:** Direction A — "Fresa en su punto" · Primary `#962a1f` (strawberry carmine), Accent `#7a1f17` (deep strawberry), Canvas `#fdf6f5`, Neutral `#1a0808`.

**Confidence:** HIGH

**Rationale:** This is the reversible internal taste call assigned to me, so I commit it without escalation. `#962a1f` is the only one of the three calibrations that satisfies both binding constraints at once: it de-escalates the red from the shipped promotional register (the firefighter-red `#e74c3c` "OFERTA" gradient) into a deep, ripe, homemade-jam strawberry that fits the homage tone, while staying unambiguously a *warm strawberry* red. Direction C `#8f2433` drifts cold toward wine/cherry — a cold-shift with no narrative reason that mis-reads the product as another fruit, which is the exact "cold palette without narrative justification" pattern Nil rejects. Direction B `#a52f23` is the minimal-delta safe option but keeps a more promotional brick character. `#962a1f` also clears WCAG AA for body text on the real cream canvas with genuine margin (7.43:1) and supports white-on-red at 7.93:1 — consistent with the La Nonna locked resolution that AA always wins over a brand-color preference, and it removes the contrast-failure family at the root rather than via workarounds. It is a true AUDIT refinement: the same chromatic gesture, de-escalated, not a new brand.

**Evidence:** `phase-1.5-color-validation.md` §2 (Direction A recommended, reasoning), §3 token spec, §5.1/§5.3 WCAG ratios · `global-memory.md` La Nonna locked resolution #1 (AA always wins over brand-color preference) and Phase-8 learning (recompute contrast against the real cream canvas) · creative-director aesthetic model (reject cold colours with no narrative reason; warm shadows) · `phase-1-report.md` §2 tonal vocabulary ("la víspera", "en su punto", "con calma").

**Rejected:**
- Direction B `#a52f23` — smallest visible change from the shipped `clasico`, but retains a more promotional warm-brick read; kept on record as the contingency if the client wants the most invisible possible change from the build they already saw.
- Direction C `#8f2433` — coldest, most solemn; drifts toward wine/cherry (mis-signals the product) and risks tipping "warm homage" into "funerary" — a cold shift with no narrative justification.

**Next agent:** brand-designer / `visual-perfection` / `style-guide-enforcer` (Phase 4) — adopt the Direction A token set, materialise it in `globals.css` (it currently lives nowhere — brand colours are hardcoded inline across 11 components), retire `#e74c3c` and all red→orange gradients, and forbid the brand red applied with opacity.

---

## OPEN ITEM — ESCALATED TO DIRECTOR / NIL

## Creative Direction — Hero Asset Path (Photograph P vs Typography-only T)

**Decision:** DEFERRED — not decided at the creative-director layer. Escalated.

**Confidence:** N/A — deliberately not a taste call.

**Rationale for escalation:** This fork is escalated regardless of confidence, per the standing rule that any decision which is hard to reverse or outward-facing does not get resolved at this layer. The Hero centre asset is the most outward-facing surface of the site, and the choice is not a matter of taste — it is contingent on real input the creative-director does not have and cannot infer: the family conversation Nil is having this week (Phase-1 §8, Banderas 1, 2, 6, 7) about whether archival photography of Mariana exists, and whether the surviving family consents to its publication. No amount of taste modelling substitutes for that conversation; guessing here would be a defect, not a decision.

**This escalation does NOT block Phase 4.** The mood board's dual-path design and the Direction B choice above are built precisely so the family conversation only *selects* a Hero path and never *resets* the design (Risk 1, mitigated). Direction B keeps both paths fully viable: Path P (single Mágnum / Mariana's archival hands given silence) and Path T (the "Mágnum · Dream · 1525" typographic statement) share an identical grid, layout, spacing, and type — only the 380×380 centre asset differs. brand-designer can proceed on Direction B now; `hero-specialist` designs P and T in parallel and the family conversation resolves which ships.

**Recommended option, addressed to the director:** If the family is unsure, hesitant, or asks for time — ship **Path T (typography-only)**. It is not a fallback: for a tribute site it is the more disciplined and dignified option, and it is the *purest* expression of Direction B. Path P should be selected only on an unambiguous, affirmative family wish to publish a specific archival photograph of Mariana, with consent. The hard constraints are absolute either way: never stock photography of someone else's hands, never AI-generated imagery of Mariana.

**The exact reason this reaches Nil:** outward-facing and hard to reverse + contingent on real family input that does not exist yet. The decision tree for the conversation is already prepared in `phase-1-report.md` §8 (Bandera 1+2).

**Next agent:** director — carry the open item to Nil's family conversation this week. Once a path is confirmed, `hero-specialist` ships the corresponding Hero of Direction B; `image-curator` is engaged only if Path P is confirmed with a real, consented archival photograph.

---

## Summary for the director

| Decision | Outcome | Confidence |
|---|---|---|
| Mood board visual direction | **Direction B — "En su Punto"** (disciplined restraint) | HIGH |
| Strawberry-red calibration | **Direction A — `#962a1f`** "Fresa en su punto" | HIGH |
| Hero asset path (P vs T) | **ESCALATED** — open item, contingent on the family conversation; recommend Path T if the family is unsure | — |

- Both HIGH-confidence decisions are surgical refinements of the `clasico` build — no teardown, no new section, no MAJOR-flagged change.
- Direction B keeps BOTH Hero paths (P and T) fully viable on an identical layout; the family conversation selects a path and cannot reset the design (Risk 1 mitigated).
- Hard rules held throughout: homage tone, no AI imagery of Mariana, narrative firewall (`"J. Elías, fundador"` only), AUDIT mode.
- Phase 4 (brand-designer) is unblocked now; only the Hero centre asset waits on the escalated family input.
