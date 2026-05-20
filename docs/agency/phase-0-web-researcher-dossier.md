## Client Dossier — Yaya Mariana

**Researched by:** web-researcher
**Date:** 2026-05-20
**Industry:** Premium artisanal fresh produce (strawberries / fresas) — Spain, e-commerce direct-to-consumer
**Mode:** AUDIT (existing build on branch `clasico`, SHA `19dabf2`, treat as reference intelligence — not a rebuild blueprint)

---

### Digital Presence Overview

Yaya Mariana is the consumer brand of **José Elías Navarro** (president of Audax Renovables, owner of La Sirena), an established Catalan multimillionaire entrepreneur. The brand originated as a **hydroponic lettuce** project in Riudoms (Baix Camp, Tarragona) — that incarnation is the one currently live at `https://yayamariana.com` and listed by the wholesaler Linverd. José Elías has since **pivoted the farm toward premium strawberries** (≈1,000 kg/week, ~7 € per 500 g box, ambition to make berries ~90% of activity 12 months/year), and the codebase audited here at `C:\proyectos\yaya-mariana` (branch `clasico`) is the **new strawberry-positioned single-page site that has not yet replaced the public lettuce site.** This is a brand in mid-pivot: high-quality product photography is in place, the founder has notoriety and press traction, the new site is built and polished, but social channels and the public domain still telegraph the previous (lettuce) identity.

---

### Existing Website

| Item | Finding |
|---|---|
| **Public production URL** | `https://yayamariana.com/` — still serves the OLD lettuce brand ("El sabor de siempre, cultivado de forma sostenible · Lechuga fresca directa a tu cocina"); six lettuce varieties (Batavia, Hoja de Roble, Lollo Rojo, Lollo Verde, Trocadero Roja, Trocadero Verde). |
| **Audited codebase** | `C:\proyectos\yaya-mariana` (branch `clasico` @ `19dabf2`). Strawberry-pivot SPA. Not yet deployed to the apex domain. |
| **Stack (audited)** | Next.js 16.2.4 · React 19.2.4 · Tailwind v4 · Framer Motion 12 · shadcn 4 · @paper-design/shaders-react (mesh gradient) · @base-ui/react · Stripe Checkout (`@stripe/react-stripe-js` 6.3, `stripe` 22.1) · lucide-react. |
| **Architecture** | Single-page: Hero · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer · Cart. All section components are client components. |
| **Languages** | ES (default `<html lang="es">`), CA (Catalan), EN. Translations in `src/i18n/translations.ts`. Switcher is a custom dropdown in `hero.tsx`. **No `next-intl`, no `/{locale}` routing, no hreflang** — locale lives only in client React context. |
| **Image assets** | `/public/fresas/{magnum,dream,variedad1525}/` — 14 high-quality JPEGs per variety. Logo `/public/logo-nuevo.jpg`. Stale `/public/logo-yaya.png.png` (double extension). One leftover ZIP `Fotos Fresas.zip` should not ship to prod. |
| **Quality score** | **8.2 / 10** — premium craft: warm bespoke palette, custom mesh-gradient hero, typewriter heading, hover micro-interactions, animated stat counter, product carousel with parallax-on-mouse-move. The build is intentional and on-brand. |
| **Confirmed bugs** | (1) **`<title>` meta still says "Yaya Mariana – Lechugas hidropónicas frescas"** with the lettuce description (`layout.tsx` lines 25–28) — vestige of the prior pivot. (2) **ES `stats.labels` array contains Catalan strings** ("Del camp a taula", "Qualitat premium") — `translations.ts` line 28. (3) **Stats `value: "+"`** with regex `/^(\d+)(.*)$/` matches nothing, so the counter only displays `+` (no animated number) — `stats-strip.tsx` line 34. (4) Three social handles in Footer point to platform homepages (`https://facebook.com`, `https://instagram.com`, etc.), not the brand's real `@layayamariana`. (5) `<em className="not-italic italic">` in `about-us.tsx` line 23 — contradictory utility classes. (6) Logo double extension `logo-yaya.png.png` and unused `Fotos Fresas.zip` in `/public`. |
| **Performance posture (estimate, pending Phase 5 lighthouse-auditor)** | Hero loads a `MeshGradient` shader, a 380×380 `unoptimized` logo, plus a 254×56 `unoptimized` nav logo on every page → expect LCP ≥ 2.8 s on mid-tier mobile until the logo is optimised and the shader is gated. `priority` set on both nav and hero logo will further fight LCP candidate selection. |
| **A11y posture (estimate)** | Custom language `<button>` dropdown does the right things (`aria-expanded`, `aria-haspopup`, `role="listbox"`, click-outside). Decorative inline SVGs lack consistent `aria-hidden`. The "✅" emoji in Contact post-submit conflicts with the no-emoji rule the agency applied to La Nonna; flag to brand for explicit decision (Yaya may want it). Multiple text-on-color combinations to validate: `#7a3a3a/65` on `#fdf6f5`, `#c0392b` on `#fdf0ef`, white on `#5c1a1a`. |

---

### Social Media

| Platform | Handle | Followers | Activity | Notes |
|---|---|---|---|---|
| Instagram | **@layayamariana** (confirmed exists; metrics not exposed in search) | Unknown — account is low-visibility on SEO; likely < 1k | Unknown | Site title resolves but counts/content not extractable via web search. **Footer links go to `https://instagram.com` root** — must be updated to `https://instagram.com/layayamariana`. |
| Facebook | Not found | — | — | Footer link is a placeholder (`facebook.com`). No brand profile surfaced in search. |
| X / Twitter | Not found | — | — | Footer link is a placeholder. |
| Pinterest | Not found for the strawberry brand | — | — | An `@yayamariana07` Pinterest profile exists but appears unrelated (personal account, AR domain). Footer link is a placeholder. |
| LinkedIn | Founder profile exists (José Elías Navarro, Audax Renovables); no brand company page surfaced | — | — | Footer link is a placeholder. |
| TikTok / YouTube | No brand presence | — | — | Founder appears in third-party YouTube coverage ("Así Es Mi Nueva Granja de Fresas Premium (1000kg/semana)") — earned media, not owned. |

**Reading:** the brand is in **launch / early phase** for the strawberry positioning. Owned social is one channel deep (Instagram), low-density, and footer wiring undermines what little presence exists.

---

### Reputation

- **No consumer reviews indexed** for Yaya Mariana strawberries on Google Business, Trustpilot, TripAdvisor, or Spanish e-commerce comparators as of 2026-05-20.
- The **lettuce incarnation** has a wholesale listing on Linverd Market (consumer-neutral, no scored reviews surfaced).
- **Earned media (positive direction):** El Mira, ElEspañol, and Diari de Tarragona have covered the José Elías strawberry pivot with admiring framing (rentabilidad, premium dulzura, inversión 600–700k€). El Mira article dated 2026-05-10 explicitly profiles the "granja de fresas premium" generating ~3,000 €/semana.
- **Reputational risk surface:** founder is a polarising public figure (Crónica Global has critical political coverage). Reviews when they appear will likely cluster around perceived **price-to-value** for a 500 g box at 7.50 €, **shipping cost/speed**, and **freshness on arrival** (the core promise of "del campo a tu mesa, 24h" the audited stats-strip implies).

---

### Brand Identity (audited FROM CODE — no separate brand-book reviewed)

**Visual style** — warm, artisanal, premium-craft. Coherent palette:
- `#fdf6f5` cream canvas
- `#fff5f5` hero secondary cream
- `#fdf0ef` accent cream (values section, contact icon bg)
- `#c0392b` brand red (primary CTA, eyebrows, accents) — strawberry-derived
- `#e74c3c` brand red bright (gradients, accents)
- `#a93226` brand red dark (hover state)
- `#5c1a1a` deep wine red (stats strip bg)
- `#2d0a0a` near-black wine (footer bg)
- `#7a3a3a` warm brown (body copy at varying alphas: /65, /50, /35)
- `#1a0808` near-black brown (headings)
- `#7a4a42` muted brown (hero quote attribution)
- `#f0d0d0`, `#f5c6c2`, `#f0e0e0`, `#c8b8b8` — supporting greys/pinks for dividers, borders, separators

**Typography** — three-font stack loaded via `next/font/google`:
- `Inter` (sans, body and UI) — variable subset latin
- `Playfair_Display` (serif, headings + italic quote) — discrete weights 400–900 + italic
- `Yellowtail` (script, weight 400) — declared but **not actually referenced** in any of the audited components; brief says "Yellowtail + Playfair + Inter" — currently a stale dependency on the page level. Either re-introduce in hero/about ornament, or drop to reclaim font payload.

**Tone of voice** (from translations.ts) — warm, intimate, grandmotherly. Defining lines:
- ES: *"cultivadas con el mismo cariño que le pondría tu abuela"* / *"Mi abuela me enseñó que las mejores fresas son las que se recogen con amor y se comen el mismo día."* — J. Elías, fundador.
- Hero quote: *"Todo lo bueno de la vida requiere paciencia, trabajo y amor."* — Yaya Mariana.
- Eyebrow tags: "Tarragona · Qualitat premium" (note: mixed ES/CA on purpose — a brand signal of Catalan rootedness, OR a leftover ES copy error; needs founder confirmation).
- Trust badges: "Envío gratuito · Sin pesticidas · Cosecha propia · Devolución en 14 días" — direct, no exclamation, no emoji (except for the ✅ in the contact success state, which is the lone emoji in the build).

**Voice rules apparent from code (worth honoring in subsequent phases):**
1. Quotes are first-person, founder-attributed (J. Elías) or grandmother-attributed (Yaya Mariana the character).
2. No emoji body copy. ✅ in contact success state is the lone exception.
3. CTAs are short imperatives: "Comprar ahora", "Ver nuestras fresas", "Nuestra historia", "Conocer nuestra historia".
4. Trilingual parity is enforced — every key has ES/CA/EN equivalents.

**Consistency score** — **Medium-High**. The codebase is internally tight. External (live `yayamariana.com`, social) is the OLD brand. Until deployment, internal/external are misaligned by definition.

---

### Opportunities Identified (SURGICAL — for Phase 4.5 / 5 agents)

Each is framed as a minimal-surface fix the audit/optimization agents can apply without rebuilding the section.

1. **[seo-genius]** Fix the stale `<title>` and `<meta name="description">` in `src/app/layout.tsx` (lines 25–28). Replace "Lechugas hidropónicas frescas" with the strawberry-positioned title (e.g. *"Yaya Mariana – Fresas frescas de Tarragona · Sin pesticidas"*). Add full Metadata API surface: `openGraph`, `twitter`, `alternates.canonical`, `alternates.languages` (ES/CA/EN), `robots`, `keywords`. **High-confidence quick win.**
2. **[copywriter / micro-copy-master replacement]** Fix the `ES stats.labels` array — entries 1 and 4 are in Catalan ("Del camp a taula", "Qualitat premium"). Replace with ES equivalents while keeping CA intact in its own array. Same file: `src/i18n/translations.ts` line 28.
3. **[frontend-developer]** Fix the `StatsStrip` `value: "+"` so it either animates a real number (suggest "12m" for "12 meses al año", consistent with founder's 12-months-of-strawberries ambition reported in press) or skips animation gracefully (`stats-strip.tsx` lines 33–44 + AnimatedValue regex). Currently the fourth tile renders just `"+"` with a truck icon and no number — visually broken intent.
4. **[frontend-developer + seo-genius]** Replace the placeholder social links in `footer.tsx` (lines 8–56) with real handles. **Confirmed:** Instagram = `https://www.instagram.com/layayamariana/`. For Facebook, X, Pinterest, LinkedIn — flag to client; either point to real profiles or **remove the icons** rather than ship broken/empty footprints. Adding `rel="me"` on the real ones helps brand SEO and Mastodon-style verification.
5. **[lighthouse-auditor + visual-perfection]** Optimize the hero logo pipeline: `logo-nuevo.jpg` is loaded twice (nav at 254×56 and hero at 380×380), both with `unoptimized` and `priority`/`loading="eager"`. Convert source to WebP/AVIF, drop `unoptimized` so Next image optimization kicks in, set `priority` only on the hero instance, and let the nav image lazy-load (it's above the fold but smaller and cacheable). LCP improvement expected.
6. **[accessibility-perfectionist]** Audit text-on-color combinations against the cream `#fdf6f5` canvas (La Nonna learning: never compute contrast against pure white when the canvas is cream). Specifically: `#7a3a3a` at `/35` and `/50` alpha used for placeholder text and meta labels likely fails WCAG AA body. The mesh-gradient hero text needs a contrast guarantee against the lightest gradient stops too.
7. **[mobile-obsessor]** Hero section uses `clamp(2rem, 4vw, 3rem)` for the quote — good — but the two-column 55/45 split collapses to a stacked layout where the 380×380 logo can dominate the small viewport. Verify on iPhone SE / Galaxy S small. The custom language dropdown is tap-target ~32 px, below 44 px minimum.
8. **[conversion-funnel-optimizer]** Products → `/checkout` opens in a NEW tab (`target="_blank"`) from product card "Ver más", About "Ver tienda", CTA "Comprar ahora", and Footer shop links. This **leaks the cart context** (zustand or React-context-based cart in `<Cart />`) and breaks the user's session continuity. Either keep checkout same-tab, or build the checkout as a modal/sheet over the SPA. Friction-removal opportunity.
9. **[seo-genius]** No `robots.txt`, no `sitemap.xml`, no `<link rel="alternate" hreflang>` between ES/CA/EN (locale is client-only). For a launch site, add an App Router `app/sitemap.ts` + `app/robots.ts`. Since the site is single-page-per-locale, hreflang can point three deep-links at the same URL with the `?lang=` query or — better — introduce locale routing in Phase 4.5 (`/`, `/ca`, `/en`).
10. **[visual-perfection]** The "Yellowtail" font is loaded but never used. Either give it a job (recommend: founder signature in the About section under "J. Elías, fundador de Yaya Mariana") or remove the import to cut request count.
11. **[brand-designer minor]** `<em className="text-[#c0392b] not-italic italic">` in `about-us.tsx` line 23 — `not-italic italic` is a no-op contradiction. Decide on italic on/off for the highlight phrase.
12. **[asset-hygiene]** Remove `/public/Fotos Fresas.zip` (3 MB+ of dead weight that Next does NOT exclude from the build), rename `logo-yaya.png.png` to `.png` (or remove if `logo-nuevo.jpg` supersedes it). Remove `fresas-1/2/3.jpg` if unreferenced.
13. **[analytics-architect]** No analytics, no event tagging, no Stripe-success postback handler audited in the files. For a launch e-commerce site, baseline: GA4 + consent banner (RGPD compulsory in ES) + ecommerce event mapping (`add_to_cart` on the cart context, `begin_checkout` on the `/checkout` route, Stripe webhook → `purchase`).
14. **[fullstack-developer]** Contact form in `contact.tsx` does `setSent(true)` on submit with **no actual submission** — no Server Action, no API route, no email transport. The form is a UX placeholder. Wire to a Server Action with rate limiting (La Nonna pattern in global memory) once a transactional email provider is confirmed with the client.
15. **[seo-genius / brand]** Decide the **eyebrow language policy** ("Tarragona · Qualitat premium" is rendered identically across all three locales in `hero.tsx` line 191; only the right-side dropdown changes locale). Either localise the eyebrow per locale, or treat the mixed-language phrasing as an intentional Catalan-rooted-but-Spanish-speaking brand signal (Catalonia DO produce framing). Founder call.

---

### Red Flags

1. **Domain ↔ codebase mismatch.** The public site `yayamariana.com` is still the lettuce build. Deploying the new strawberry codebase will replace a site that currently has SEO equity and a wholesale listing (Linverd). Before deploy: capture 301 redirect plan for any lettuce-product URLs, decide whether to preserve `/lechuga/*` slugs as memorial pages or 410-Gone them. **Phase 4.5 / SEO-genius must do this before deploy, not after.**
2. **Untouchables present in code that the client must explicitly re-confirm post-pivot:**
 - **Prices:** 7.50 €/500 g uniform across the three varieties (`products.tsx` lines 13–45). El Mira reports ~7 €/box — close enough to verify, but PIN to client before launch.
 - **Phone:** `+34 666 777 888` in `contact.tsx` — looks like a placeholder, not a real number.
 - **Email:** `info@yaya-mariana.com` — note the hyphen, while the real domain is `yayamariana.com` (no hyphen). Likely **typo** in code or an alt-domain — verify with client.
 - **Address:** "C/ Electrónica, 19, Planta 10, oficina D · 08915, Badalona" — Badalona is the Audax corporate HQ region, NOT Tarragona (where the farm is). For a "del campo a tu mesa" brand, surfacing the corporate office instead of the Tarragona farm is on-brand-weak. Flag to client.
 - **IBAN:** not present in code (good).
 - **Logo and brand assets:** `logo-nuevo.jpg` (JPG, not vector) — risk of fringing on cream bg, currently mitigated via `mix-blend-mode: multiply` (`globals.css` `.logo-blend`). Live site uses an `…VECTORIAL-01.png` from the WP install — a vector source likely exists. Ask client for SVG.
3. **Founder identity disclosure.** Audited copy attributes everything to "J. Elías, fundador de Yaya Mariana" without surfacing that J. Elías is **José Elías Navarro of Audax Renovables / La Sirena.** This is a brand decision: does Yaya Mariana lean into the founder's notoriety (good for press, validates the investment-grade quality) or maintain the "abuela's-care small-farm" intimacy (good for the warm-craft positioning)? The two are not contradictory but require an intentional narrative — flag for the requirements-analyst to probe in the briefing.
4. **shadcn CSS contradiction.** `globals.css` defines an OKLCH `--background: oklch(1 0 0)` (white) and `--foreground: oklch(0.145 0 0)` (near-black) via shadcn defaults, applied via `body { @apply bg-background text-foreground; }`. BUT the actual body uses `bg-[#fdf6f5]` inline (`layout.tsx` line 40), and every section sets its own bg color. The shadcn theme variables are **dead code** for this brand — either align them to the actual palette (cream + brown-black) or remove the unused half of the file (>80 lines). Maintenance hygiene issue, not a user-facing bug.
5. **Stripe key handling — out of scope for code audit (no env files inspected), but flag:** the project uses `@stripe/react-stripe-js` 6.3 + `stripe` 22.1. payment-genius should validate that publishable/secret keys are wired correctly, the success/cancel URLs respect locale, and the Checkout session reflects the cart line-items honestly (cart context not deeply audited here).

---

### Confirmation of the "Lechugas hidropónicas" title bug

**YES — confirmed.** `src/app/layout.tsx` lines 24–28:

```ts
export const metadata: Metadata = {
  title: "Yaya Mariana – Lechugas hidropónicas frescas",
  description:
    "Lechugas hidropónicas frescas, cultivadas con cariño. Sin pesticidas, sin químicos. Directas a tu mesa.",
};
```

This is the single most consequential SEO bug pre-launch. Phase 4.5 / seo-genius should fix this as a P0.

---

### Recommended focus for the briefing (for requirements-analyst)

When the client conversation happens, probe specifically:

1. **Deployment intent and timeline.** Is the `clasico` build replacing `yayamariana.com` directly, or going to a sub-path / new domain (e.g. `fresas.yayamariana.com`)? Redirect strategy for the lettuce URLs?
2. **Lettuce business status.** Discontinued? Still distributed via Linverd? Co-exist? This dictates whether the new site needs a "see also lettuce" link, or whether lettuce is being sunset entirely (per founder's "berries 90% of activity" stated ambition).
3. **Founder narrative depth.** How much José Elías personal brand to surface vs. how much "abuela's intimate farm" mythology to lean on. (See Red Flag #3.)
4. **Real Tarragona farm address** — confirm we can put the Riudoms farm on the contact section instead of the Badalona corporate office.
5. **Email/phone confirmation.** `info@yaya-mariana.com` (hyphenated) — typo or real alt-domain? Phone `666 777 888` is the textbook placeholder — get the real one.
6. **Social media inventory.** Confirm `@layayamariana` Instagram is the official handle. Decide which other social icons in the footer to enable (real profiles) or remove (no fake placeholders).
7. **Eyebrow / stats CA-in-ES policy.** Intentional Catalan-rooted signal, or accidental copy bleed?
8. **Pricing.** 7.50 €/500 g uniform for Mágnum, Dream, 1525. Realistic? Different per variety? Volume pricing? (Press says ~7 € — close, verify.)
9. **Yellowtail font usage.** Loaded but unused — give it a role (founder signature on the About blockquote is the natural fit) or drop the import?
10. **Shipping promise.** "Del campo a tu mesa, 24h" implied by the stats strip and the founder quote. Verify the operational reality and the geographic coverage ("Envío a toda la península" in CTA) — is freshness compatible with peninsular shipping?
11. **Legal & compliance.** RGPD cookie consent? Aviso legal, política de privacidad, política de devolución — Footer links to WP slugs (`https://yayamariana.com/aviso-legal/` etc.) that today serve the lettuce site's documents. Need updated legal docs that reference the strawberry SKUs and refund/cold-chain policy.
12. **Earned media stance.** Press already covers the farm. Decide whether to surface a "as featured in" strip (El Mira, ElEspañol, Diari de Tarragona) on the home page — usually a strong trust booster for an early-launch premium D2C brand.

---

### Sources (external research)

- [Yaya Mariana — official site (lettuce, pre-pivot)](https://yayamariana.com/)
- [Linverd Market — Lechuga Hidropónica Yaya Mariana (wholesale listing)](https://linverd.com/es/lechuga-hidroponica-yaya-mariana)
- [El Mira — José Elías destapa la alta rentabilidad de su granja de fresas premium: 3.000 euros a la semana (2026-05-10)](https://www.elmira.es/articulo/noticias-interesantes/empresario-jose-elias-destapa-alta-rentabilidad-granja-fresas-premium/20260510124441559959.html)
- [Diari de Tarragona — José Elías construirá un cultivo hidropónico en Riudoms (2024-06-21)](https://www.diarimes.com/es/camp-tarragona/baix-camp/240621/jose-elias-construira-cultivo-hidroponico-riudoms_146456.html)
- [Diari de Tarragona — José Elías interview](https://www.diaridetarragona.com/tarragona/245315/jose-elias.html)
- [El Español — José Elías nuevo negocio gallinas (context on founder's diversified portfolio)](https://www.elespanol.com/sociedad/20260215/gallinas-huevos-diarios-nuevo-negocio-comprado-empresario-jose-elias-kw/1003744131127_0.html)
- [YouTube — "Así Es Mi Nueva Granja de Fresas Premium (1000kg/semana)"](https://www.youtube.com/watch?v=TZ-qKqxYyl8)
- [LinkedIn — Jose Elías Navarro, Presidente Audax Renovables](https://es.linkedin.com/in/jose-elias-navarro)
- [Instagram — @layayamariana (handle confirmed; metrics not publicly indexed)](https://www.instagram.com/layayamariana)
