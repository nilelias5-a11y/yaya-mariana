# Phase 1 — SEO Strategy from Zero
**Project:** Yaya Mariana (premium artisanal fresas de Tarragona · ES/CA/EN)
**Prepared by:** seo-analyst
**Date:** 2026-05-20
**Mode:** AUDIT — single-page architecture preserved, surgical recommendations inside Hero · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer · Cart.
**Deploy target:** `yayamariana.es` (fresh TLD, not yet purchased). NO migration from legacy `yayamariana.com` (unrelated abandoned Audax build) — SEO starts at zero.
**Narrative firewall:** founder = `"J. Elías, fundador"` exactly. No real-identity expansion anywhere in titles, descriptions, OG, JSON-LD, alt text, schema, breadcrumbs, or copy. Yaya Mariana = the grandmother (passed). Tone is tribute / dignified / restrained — **never** marketed as "homenaje" or "memoria" in SEO surfaces.

---

## 1. Executive Summary

Yaya Mariana lands on a fresh `.es` TLD with zero domain authority, in a Spanish berry DTC category dominated by Huelva commodity SEO (RedSayra/Marisma), with Crowdfarming owning the top of the "buy direct from farmer" SERPs and supermarket private label monopolising "fresas premium" generic queries. The opportunity is precise: **own three intersecting long-tail clusters that no incumbent currently defends — variety-named queries ("fresas Mágnum", "fresas Dream"), Catalan micro-origin queries ("fresas Tarragona", "maduixes Tarragona"), and "sin pesticidas + Catalunya"** — while shipping a clean Lighthouse SEO ≥95 from day one through fixed meta, full schema.org triplet (Organization + Product × 3 + WebSite), and ES/CA/EN hreflang on the single-page architecture. The current `layout.tsx` has a legacy lettuce title ("Lechugas hidropónicas") inherited from the unrelated Audax build — that is the single highest-impact one-line fix on the entire codebase. **Memorial keywords ("homenaje", "memoria", "en memoria de") are excluded as primary targets**: they carry near-zero commercial intent, would dilute focus, and would commodify the gentle tribute tone that lives correctly in the product experience, not in meta-tag spam. Instead, the keyword strategy leans on commercial + provenance intent and lets the tribute show through brand voice, photography, and the abuela narrative inside AboutUs.

---

## 2. Keyword Strategy

### 2.1 Keyword clusters (master table)

| # | Cluster | Locale(s) | Top 3 keywords | Est. monthly volume (ES, indicative) | Difficulty | Intent | Target section |
|---|---|---|---|---|---|---|---|
| C1 | **Commercial — buy strawberries online** | ES | "comprar fresas online", "fresas frescas a domicilio", "fresas online España" | 1.6k–2.4k / 480–880 / 320–590 | High | Transactional | Hero H1 · Products · CTA |
| C2 | **Provenance — Tarragona / Catalunya** | ES + CA | "fresas Tarragona", "fresas Catalunya", "maduixes Tarragona" | 210–390 / 90–170 / 70–140 | **Low** | Commercial | Hero subtitle · AboutUs p1 · Footer description |
| C3 | **Quality — no pesticides** | ES | "fresas sin pesticidas", "fresas sin químicos", "fresas naturales online" | 480–880 / 90–170 / 170–320 | Medium | Commercial | Values bullet · Products subtitle · CTA badges |
| C4 | **Variety-named (uncontested)** | ES + EN | "fresa Mágnum", "fresa variedad Dream", "fresa 1525" | <50 / <50 / <50 | **Very low** | Commercial / Informational | Products card titles · H2 in Products · Product schema `name` |
| C5 | **Sector education / question-led** | ES | "diferencia fresa Huelva vs Tarragona", "cuándo es temporada de fresas en España", "qué variedad de fresa es la más dulce" | 50–90 / 1.3k–2.4k / 170–320 | Low–Med | Informational | AboutUs p2 (sector context) · Values descriptions · FAQ-able microcopy in Values |
| C6 | **Catalan-native (moat)** | CA | "maduixes Tarragona", "maduixes ecològiques Catalunya", "comprar maduixes en línia" | 70–140 / 30–90 / 30–90 | **Very low** | Commercial | CA `<title>`, CA Hero subtitle, CA Footer |
| C7 | **EN expat / gifting / tourist** | EN | "Spanish strawberries delivery", "premium Catalan strawberries online", "buy Spanish strawberries UK/EU" | 90–170 / <50 / 30–90 | Low | Commercial | EN `<title>`, EN Hero subtitle, EN Products |
| C8 | **Brand defensive** | ES + CA + EN | "Yaya Mariana fresas", "Yaya Mariana Tarragona", "Yaya Mariana maduixes" | <50 (launch phase) | Trivial | Navigational | Title brand-anchor (always include "Yaya Mariana") |
| C9 | **Long-tail commercial** | ES | "fresas premium Tarragona online", "fresas artesanas Catalunya", "fresas pequeño productor" | <50 / <50 / 30–90 | Low | Commercial | AboutUs p2 · Footer description · meta description |
| C10 | **Seasonal / urgency** | ES | "fresas de temporada España", "comprar fresas mayo", "fresas frescas marzo abril" | 320–590 / 70–140 / 70–140 | Low | Commercial | CTA eyebrow · Hero traceability chip (week ISO) · Footer schedule line |

> **Volume bands are deliberately indicative** (single-source estimation is noisy; competitor-killer Phase 2 / seo-genius Phase 5 should confirm with Search Console once `.es` is live). Locked priority is by intent + difficulty, not by absolute volume.

### 2.2 Cluster prioritisation (where to invest first)

**P1 — ship at launch:** C2 (provenance Tarragona), C4 (variety names), C6 (Catalan-native), C8 (brand defensive). Reason: low/zero difficulty, uncontested in SERPs, directly aligned to the three killers (variety + origin + abuela). These are wins available month 1.

**P2 — ship at launch, expect 3–6 months to climb:** C1 (commercial buy-online), C3 (no pesticides), C9 (long-tail commercial). Reason: higher competition (Crowdfarming, supermarket private label), but the meta + schema must be in place from day one or the climb never starts.

**P3 — ship at launch, capture as awareness grows:** C5 (sector education — the diff-Huelva-Tarragona long-tail is a textbook AboutUs micro-paragraph), C7 (EN expat — small SAM but easy parity with existing translations), C10 (seasonal — paired with the harvest-week chip; this is the only cluster with natural urgency baked in).

### 2.3 Excluded clusters (do NOT target)

| Cluster | Why excluded |
|---|---|
| Memorial / tribute keywords ("homenaje", "en memoria de", "fresas memoria", "tributo abuela") | Near-zero commercial intent. Tribute tone is the brand experience (AboutUs narrative, photography, restraint), NOT a SEO surface. Stuffing "homenaje" into meta titles would feel exploitative and disrespect Nil's grandmother. **Hard rule.** |
| Generic "fresas" head term | Volume is huge (40k+/mo) but dominated by Huelva commodity producers + supermarkets with decades of authority. A fresh `.es` cannot rank top-20 in year one — and the head term doesn't differentiate. Long-tail captures the buyer who *would* convert anyway. |
| "Fresas Huelva" | Wrong origin. Don't claim it, don't optimise for visitors looking for Huelva. (Indirect: a Phase-5 informational article *about* Huelva vs Tarragona, see C5, is a different play.) |
| "Fresas ecológicas certificadas" / "fresas bio" | Brand currently has NO bio/ecological seal (per market-analyst: no DOP/IGP exists for Catalan strawberries, no Zerya certification mentioned). Claiming "ecológicas" without certification is a 2025 backlash risk (PwC + Zerya 2025). Use "sin pesticidas" / "naturales" / "sin químicos" — claims the site already substantiates. |
| Founder real-name queries | Off-limits by narrative firewall. Brand is "Yaya Mariana"; founder is `"J. Elías, fundador"`. Period. |
| Audax / Linverd / hydroponic / lechugas | Legacy unrelated brand. Active EXCLUSION rule (see §6 robots.txt + meta exclusions). |

---

## 3. On-page Recommendations — `src/app/layout.tsx`

### 3.1 Current state (audit)

```tsx
// src/app/layout.tsx lines 24-28 — BROKEN
export const metadata: Metadata = {
  title: "Yaya Mariana – Lechugas hidropónicas frescas",
  description:
    "Lechugas hidropónicas frescas, cultivadas con cariño. Sin pesticidas, sin químicos. Directas a tu mesa.",
};
```

**Critical issue:** title and description are inherited from the abandoned Audax lettuce build. This is the single highest-impact one-line SEO fix on the entire codebase and is already on Nil's pre-approved bug list (phase-0-report.md §5). **Owner: seo-genius. Priority: P0 — fix BEFORE crawl.**

`lang="es"` is correct as default. No metadata locale strategy currently — recommendation in §3.4.

### 3.2 Recommended `<title>` (≤ 60 chars; brand-anchored; cluster-aligned)

**ES (default):**
> `Fresas frescas de Tarragona | Yaya Mariana`
> (43 chars · captures C1+C2+C8)

**Alternates to A/B test post-launch:**
- `Fresas Mágnum, Dream y 1525 de Tarragona | Yaya Mariana` (54 chars · captures C2+C4+C8; variety-named angle)
- `Fresas naturales sin pesticidas — Yaya Mariana` (47 chars · C3+C8; values-first angle)

**CA:**
> `Maduixes fresques de Tarragona | Yaya Mariana`
> (46 chars · captures C2+C6+C8 — uncontested in Catalan SERPs)

**EN:**
> `Fresh strawberries from Tarragona | Yaya Mariana`
> (49 chars · captures C7+C8)

### 3.3 Recommended `<meta description>` (≤ 160 chars; tribute-tone respected; value-prop clear)

**ES:**
> `Fresas Mágnum, Dream y 1525 cultivadas en Tarragona sin pesticidas. Recogidas y enviadas en 24-48h, directas a tu mesa. Cosecha propia, en su punto.`
> (149 chars · captures C1+C2+C3+C4)

**CA:**
> `Maduixes Mágnum, Dream i 1525 cultivades a Tarragona sense pesticides. Collides i enviades en 24-48h, directes a la teva taula. Collita pròpia.`
> (146 chars · captures C2+C3+C6)

**EN:**
> `Mágnum, Dream and 1525 strawberries grown in Tarragona without pesticides. Picked and shipped in 24-48h. Own harvest, always at their best.`
> (140 chars · captures C3+C4+C7)

**Tribute-tone check on all three:** no "homenaje", no "memoria", no "en memoria de", no "abuela" in the meta. The abuela narrative lives in AboutUs where it can carry warmth, not in compressed 160-char meta where it would feel exploitative. Approved.

### 3.4 Open Graph + Twitter Card

```tsx
openGraph: {
  type: "website",
  locale: "es_ES",
  alternateLocale: ["ca_ES", "en_GB"],
  url: "https://yayamariana.es",
  siteName: "Yaya Mariana",
  title: "Fresas frescas de Tarragona | Yaya Mariana",
  description: "Fresas Mágnum, Dream y 1525 cultivadas en Tarragona sin pesticidas. Recogidas y enviadas en 24-48h, directas a tu mesa.",
  images: [{
    url: "https://yayamariana.es/og/og-default.jpg", // 1200×630 — la yaya's hands + a Mágnum, no founder face
    width: 1200, height: 630,
    alt: "Fresas Mágnum recién cogidas en Tarragona — Yaya Mariana",
  }],
},
twitter: {
  card: "summary_large_image",
  title: "Fresas frescas de Tarragona | Yaya Mariana",
  description: "Fresas Mágnum, Dream y 1525 cultivadas en Tarragona sin pesticidas. 24-48h a tu mesa.",
  images: ["https://yayamariana.es/og/og-default.jpg"],
},
```

**OG image content rule:** must respect narrative firewall. Composition is hands + Mágnum berry over warm cream (per competitor-killer Killer Visual #2). **NO founder face. NO investor identity. NO logo of legacy yayamariana.com.** Owner: image-curator + seo-genius coordination.

### 3.5 hreflang + locale routing

**Current state:** single `lang="es"` at root; translations dictionary contains ES/CA/EN parity but no per-locale routing visible in `app/` directory.

**Recommendation (option A — preferred, low-effort):** add `next-intl` or App Router locale segments to expose `/es`, `/ca`, `/en` (with `/` → 302 to `/es` via middleware based on Accept-Language). Three `<link rel="alternate">` tags per page:

```html
<link rel="alternate" hreflang="es-ES" href="https://yayamariana.es/es" />
<link rel="alternate" hreflang="ca-ES" href="https://yayamariana.es/ca" />
<link rel="alternate" hreflang="en"    href="https://yayamariana.es/en" />
<link rel="alternate" hreflang="x-default" href="https://yayamariana.es/es" />
```

**Recommendation (option B — fallback if locale routing is too invasive for AUDIT scope):** keep single-route architecture; expose locale via `?lang=ca` query param OR via hash anchors; add `hreflang` only at root pointing to itself with `x-default`. **Cost:** loses the CA-native moat in Google's eyes (CA content is invisible to crawlers without a separable URL).

**Director decision needed:** option A is the right SEO call but may count as MAJOR (modifies routing). Option B is AUDIT-safe but leaves the CA cluster (C6) on the table. **Flag to director.** Phase 4.5 / 5 (seo-genius) cannot implement A without explicit approval.

### 3.6 Canonical strategy for single-page architecture

**Self-referencing canonicals per locale route.** Each locale page declares itself canonical:

```html
<link rel="canonical" href="https://yayamariana.es/es" />
```

**Anchor links (#productos, #sobre-nosotros) do NOT need their own canonicals** — anchors don't create indexable URLs in Google's model. The single-page architecture is *fine* for SEO so long as:
1. The H1 is one and clear (per locale): "Fresas frescas de Tarragona" / "Maduixes fresques de Tarragona" / "Fresh strawberries from Tarragona".
2. Each section uses a clear H2 (Products → "Nuestras fresas Mágnum, Dream y 1525"; AboutUs → "Nuestra historia desde el Camp de Tarragona"; Values → "Por qué nuestras fresas son distintas"; CTA → "Pruébalas esta temporada").
3. Anchor IDs use kebab-case Spanish (preferred for ES default): `#productos`, `#sobre-nosotros`, `#contacto`, `#valores` (NOT `#products`, NOT `#about-us`). Crawlers don't index anchors, but humans share the URLs, and Spanish anchors in a `.es` site are correct UX.

### 3.7 robots.txt (single-page nuances)

`src/app/robots.ts` (Next.js App Router convention):

```tsx
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/checkout', '/api/'] }, // checkout = Stripe-hosted, no SEO value
    ],
    sitemap: 'https://yayamariana.es/sitemap.xml',
    host: 'https://yayamariana.es',
  };
}
```

**Notes:**
- Disallow `/checkout` to prevent Stripe checkout redirect URL from indexing.
- Disallow `/api/` (contact form server actions, if any).
- **NO** blanket disallow of `legacy yayamariana.com` paths — we don't control that domain; nothing to disallow.
- **NO** Audax / Linverd / lechuga path patterns to disallow (those URLs don't exist on `yayamariana.es`).

### 3.8 sitemap.xml (single-page nuances)

`src/app/sitemap.ts`:

```tsx
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://yayamariana.es';
  const lastModified = new Date();
  return [
    {
      url: `${base}/es`,
      lastModified, changeFrequency: 'weekly', priority: 1.0,
      alternates: { languages: {
        es: `${base}/es`, ca: `${base}/ca`, en: `${base}/en`,
      }},
    },
    {
      url: `${base}/ca`,
      lastModified, changeFrequency: 'weekly', priority: 0.9,
      alternates: { languages: {
        es: `${base}/es`, ca: `${base}/ca`, en: `${base}/en`,
      }},
    },
    {
      url: `${base}/en`,
      lastModified, changeFrequency: 'weekly', priority: 0.8,
      alternates: { languages: {
        es: `${base}/es`, ca: `${base}/ca`, en: `${base}/en`,
      }},
    },
  ];
}
```

**`changeFrequency: 'weekly'` is honest** — the Hero traceability chip ("semana N · Mágnum") changes weekly in-season; the rest of the site is stable. **Priority:** ES highest (default market), CA second (moat play), EN third (smaller SAM but expat/gifting upside).

---

## 4. Structured Data (JSON-LD)

Render all schemas in `<head>` via `<Script type="application/ld+json">` blocks in the root layout (or in a dedicated `<JsonLd />` component if cleaner). Below is the compact contract; seo-genius (Phase 5) implements the exact code.

### 4.1 Organization schema (P0 — ship at launch)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Yaya Mariana",
  "alternateName": "Yaya Mariana — Fresas de Tarragona",
  "url": "https://yayamariana.es",
  "logo": "https://yayamariana.es/logo.webp",
  "description": "Productor artesanal de fresas Mágnum, Dream y 1525 en el Camp de Tarragona. Sin pesticidas, recogidas en su punto óptimo y enviadas directas del campo a tu mesa.",
  "founder": "J. Elías, fundador",
  "areaServed": { "@type": "Country", "name": "España" },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Badalona",
    "addressRegion": "Barcelona",
    "postalCode": "08911",
    "addressCountry": "ES"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+34 666 777 888",
    "email": "info@yaya-mariana.com",
    "contactType": "customer service",
    "availableLanguage": ["es", "ca", "en"]
  },
  "sameAs": ["https://www.instagram.com/layayamariana"]
}
```

**HARD RULES:**
- `"founder": "J. Elías, fundador"` — string, no `Person` schema (would invite real-identity expansion). **Do NOT** add `givenName`/`familyName`. **Do NOT** add a Person `@id`.
- `"email": "info@yaya-mariana.com"` — hyphen INTENTIONAL. Untouchable. Do NOT propose "fixing" to `info@yayamariana.com`.
- `"telephone": "+34 666 777 888"` — placeholder, untouchable.
- Address is Badalona (Audax HQ legally correct), NOT Tarragona. Tarragona is where the fresas are grown; Badalona is the legal HQ. Both true.
- `"sameAs"` includes only `@layayamariana` Instagram (the one verified social). No Facebook/Twitter root-URL leaks.

### 4.2 LocalBusiness OR Producer (DECISION)

**Recommendation: skip `LocalBusiness`.** Yaya Mariana is not a walk-in retail business — it's a DTC e-commerce producer. `LocalBusiness` invites Google to expect opening hours, walk-in address, etc. that don't apply.

**Use `Organization` as above + per-product `Product` schemas.** If a Producer/FoodProducer subtype is wanted later for richness, that is a Phase 5 enhancement, not P0.

### 4.3 Product schema × 3 (P0 — ship at launch)

For each of Mágnum, Dream, 1525, render one Product block. Example (Mágnum):

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Fresas Mágnum — Yaya Mariana",
  "description": "Fresa de gran tamaño y sabor intenso, cultivada en Tarragona. Recogida en su punto óptimo de madurez, sin pesticidas.",
  "image": "https://yayamariana.es/products/fresa-magnum.webp",
  "brand": { "@type": "Brand", "name": "Yaya Mariana" },
  "category": "Fresas frescas",
  "sku": "YM-MAGNUM-500",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": "7.50",
    "availability": "https://schema.org/InStock",
    "url": "https://yayamariana.es/es#productos",
    "seller": { "@type": "Organization", "name": "Yaya Mariana" }
  },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Origen", "value": "Camp de Tarragona, Catalunya, España" },
    { "@type": "PropertyValue", "name": "Variedad", "value": "Mágnum" },
    { "@type": "PropertyValue", "name": "Formato", "value": "500 g" },
    { "@type": "PropertyValue", "name": "Cultivo", "value": "Sin pesticidas" }
  ]
}
```

**Pricing note:** the brief says `0.00` or omit until Joan Carles confirms. **Current placeholder is `7.50€/500g` — that IS the placeholder Nil has committed to** (untouchable per phase-0-report.md §5). Use `7.50` with `priceCurrency: EUR` in schema. If a later phase decides to hide pricing, omit the `offers` block entirely (do not use `0.00` — Google flags it as invalid).

**Out-of-season behaviour:** when off-season, change `"availability": "https://schema.org/PreOrder"` and add `"availabilityStarts": "2027-03-01"` (or actual next-harvest date). seo-genius wires this to the same data source as the Hero traceability chip (#2 of competitor-killer Beat-them plan).

### 4.4 BreadcrumbList — SKIP

Single-page architecture has no breadcrumb hierarchy. Anchor links (`#productos`) are not a crawl path. **Do not add BreadcrumbList** — Google won't render it for a single-route page.

### 4.5 WebSite + SearchAction — SKIP for now

Recommended only if site exposes an internal search. Single-page Yaya Mariana has no search box. **Add only if Phase 5 introduces search** (unlikely in AUDIT mode).

### 4.6 FAQPage — SKIP (out of audit scope)

A FAQ section is not in the existing 9 sections. Adding one would be MAJOR. **Do not add FAQPage schema in Phase 4.5.** If client wants FAQ later (covers C5 sector-education cluster naturally), it becomes a Phase 6+ MAJOR proposal.

### 4.7 Person schema for founder — HARD NO

**Do not add a `Person` schema for the founder.** Renders as `"founder": "J. Elías, fundador"` string within `Organization` only. Adding a Person node creates an indexable entity that crawlers and tools (e.g., Google Knowledge Graph) will try to enrich — invites the real-identity surface that the narrative firewall exists to prevent.

---

## 5. Content Gap Recommendations (where each keyword lands inside existing sections)

| Keyword cluster | Natural home in existing sections | Recommended copy adjustment |
|---|---|---|
| **C1 — "comprar fresas online", "fresas frescas a domicilio"** | Hero H1 + CTA buyNow button + CTA subtitle | Hero `subtitle` already says "Fresas frescas de Tarragona..." — keep. CTA `subtitle` adds explicit "Envío a domicilio en 24-48h en toda la península" (already implied in `cta.subtitle` — tighten wording). |
| **C2 — "fresas Tarragona", "maduixes Tarragona"** | Hero subtitle, AboutUs p1, Footer description, meta description | Already strong. Footer description currently: *"Fresas frescas de Tarragona, cultivadas con amor y sin pesticidas."* — perfect, no change. |
| **C3 — "fresas sin pesticidas"** | Values bullet ("Zero pesticidas"), Products subtitle, CTA badges | Already strong. Values title currently "Cero pesticidas" — keep, but consider H3 anchor `#sin-pesticidas` for one Values card to gain in-page anchor signal. |
| **C4 — "fresa Mágnum", "fresa Dream", "fresa 1525"** | Products card titles + H2 in Products | Current Products title is *"Nuestras fresas"*. Recommendation: subhead OR eyebrow promotes the three variety names as a typographic statement: *"Mágnum · Dream · 1525"* (matches competitor-killer Beat-them plan #8). Each Product card `title` should be exactly `Fresas Mágnum`, `Fresas Dream`, `Fresas 1525` — NOT generic "Variedad premium". |
| **C5 — sector education (Huelva vs Tarragona, temporada de fresas)** | AboutUs p2 has the natural slot for *"Las fresas Mágnum, Dream y 1525 que cultivamos en el Camp de Tarragona no son las variedades del mercado masivo de Huelva..."* (60–80 words inside p2; respects audit scope; covers C5 informational queries indirectly). | New microparagraph inside AboutUs p2 (already exists as a paragraph — extend by ~40 words). Tone: factual, not combative; never name Huelva as a competitor, frame as "different terroir". |
| **C6 — Catalan-native (maduixes Tarragona)** | CA Hero subtitle, CA Products, CA Footer | All already in `translations.ts:ca`. **Bug:** `stats.labels[0]` in ES is `"Del camp a taula"` (Catalan contamination — already on Nil's pre-approved fix list, phase-0-report §5). Fix to `"Del campo a tu mesa"` in ES. |
| **C7 — EN expat / gifting** | EN Hero, EN AboutUs, EN Footer | Existing EN copy is solid. Add one line in EN AboutUs about EU shipping (if applicable). Confirm with conversion-funnel-optimizer in Phase 5 whether EU shipping is in scope; if Spain-only, EN copy should say so honestly. |
| **C8 — brand defensive** | Title + meta description + Organization schema `name`/`alternateName` | All three titles must include `Yaya Mariana` as suffix. **Locked.** |
| **C9 — "fresas premium Tarragona online", "fresas artesanas"** | AboutUs, meta description, Footer description | Already implicit; Footer description tighten: add "artesanas" to EN/ES Footer descriptions where natural ("Premium artisanal strawberries from Tarragona"). |
| **C10 — "fresas de temporada España"** | Hero traceability chip ("semana 18 · Mágnum") + CTA eyebrow | The chip handles this naturally if competitor-killer Beat-them plan #2 ships. CTA eyebrow can swap to "Temporada {YYYY}" during in-season. |

**Critical translation bug to fix as part of SEO pass:** `translations.ts:28` ES `stats.labels` array contains Catalan strings (`"Del camp a taula"`, `"Qualitat premium"`) — this is on the bug list, but worth re-flagging because Catalan in the ES locale will hurt ES rankings (Google language-detects strings; mixed language reduces topical clarity).

---

## 6. Competitive SEO Benchmarking

| Dimension | Crowdfarming | Naranjas del Carmen | Joselito | Yaya Mariana target |
|---|---|---|---|---|
| Title length / brand-anchor | 50–60 chars, brand-suffixed | 45–55 chars, brand-suffixed | 50–65 chars, brand-suffixed + collection-named | **Match: 45–55 chars, brand-suffixed** |
| Meta description | 140–160 chars, value-prop + CTA | 130–150 chars, "how it works" lead | 140–160 chars, heritage lead | **Match: 140–160 chars, value-prop lead (no heritage faking)** |
| hreflang depth | 6 langs (ES/EN/DE/FR/IT/NL) | 4 langs (ES/EN/FR/DE) | 5 langs (ES/EN/PT/FR/ZH) | **Subset: 3 langs (ES/CA/EN) — but CA-native is unique to us** |
| Schema.org coverage | Organization + Product + Farmer + Article | Organization + Product + multilingual variants | Organization + Product + Article + BreadcrumbList | **Match floor: Organization + Product × 3. Skip BreadcrumbList (no hierarchy).** |
| Sitemap richness | 1000s of per-farmer + per-product URLs | 100s of URLs | 100s of URLs | **3 URLs (one per locale). Honest for single-page.** |
| Blog / content marketing | Yes, weekly | Yes, sustainability essays | Yes, editorial recipes | **No — out of audit scope. Phase 6+ MAJOR.** |
| Product schema completeness | High (offers, ratings, availability) | High (offers, availability, sku) | High (offers, brand, category) | **Match: offers + brand + sku + additionalProperty (origin/variety/format/cultivation)** |
| Trustpilot / review aggregator linkage | Yes (4.6★ embedded) | Limited | Editorial reviews referenced | **None at launch. Add once real reviews exist (Phase 6+).** |
| Reviews / AggregateRating in schema | Yes | Yes | Limited | **DO NOT FAKE.** Add only after real reviews accumulate (5+ verifiable). Faking AggregateRating = Google penalty risk. |

**What to MATCH:**
- Title/meta length discipline, brand-anchor suffix.
- Organization + Product schema coverage.
- hreflang implementation (option A above).
- Schema completeness on Product (offers, sku, brand, additionalProperty for origin/variety).

**What to SKIP (don't chase platform-class moats):**
- Crowdfarming's 1000s-URL sitemap (we have 3 URLs honestly).
- Blog / weekly content marketing (out of audit scope; would be MAJOR).
- AggregateRating until real reviews exist (faking = penalty risk).
- BreadcrumbList (no hierarchy on single-page).
- Farmer-page schemas (we are *one* farm — Organization carries it).

**Our unique SEO moat:**
- **Catalan-native (C6)** — no premium berry incumbent serves CA-native long-tail. Tiny volume, near-zero competition, perfect for fresh `.es` to capture quickly.
- **Variety-named (C4)** — Mágnum/Dream/1525 are uncontested in SERPs because no commodity producer differentiates them.
- **Tarragona micro-origin (C2)** — second strawberry region in Spain, almost unclaimed in DTC SEO (Huelva dominates the head term, Maresme owns the Catalan gifting niche, Tarragona is open).

---

## 7. SEO Acceptance Criteria for Phase 4.5 (input to seo-genius)

A Phase 4.5 SEO pass is "complete and ship-ready" when **all of the following are true**:

### 7.1 Lighthouse + technical (target: SEO ≥ 95)

- [ ] Lighthouse SEO audit on `/es`, `/ca`, `/en` all score ≥ 95.
- [ ] `<title>` and `<meta description>` present and unique per locale, ≤ 60 / ≤ 160 chars.
- [ ] `<html lang="...">` matches the active locale per route (not hard-coded `lang="es"` on `/ca` or `/en`).
- [ ] `<link rel="canonical">` self-referencing per locale URL.
- [ ] `<link rel="alternate" hreflang>` × 3 + `x-default` per page.
- [ ] `robots.txt` accessible at `/robots.txt`; allows `/`; disallows `/checkout`, `/api/`.
- [ ] `sitemap.xml` accessible at `/sitemap.xml`; valid XML; includes 3 locale URLs with `<xhtml:link>` alternates.
- [ ] Meta viewport correct; mobile-friendly test passes.
- [ ] No mixed-content; HTTPS-only (Phase 7 devops issue but verify in 4.5 if staging is HTTPS).

### 7.2 Schema.org (target: zero validator errors)

- [ ] Organization schema validates clean in Google Rich Results Test.
- [ ] Product schema × 3 validates clean in Google Rich Results Test.
- [ ] **Zero** Person schema instances. **Zero** PostalAddress instances pointing to anywhere other than Badalona. **Zero** founder real-name expansions in any schema.
- [ ] Email in ContactPoint = `info@yaya-mariana.com` (hyphen intact).
- [ ] Phone in ContactPoint = `+34 666 777 888` (placeholder intact).

### 7.3 Content quality (target: cluster coverage per §5)

- [ ] H1 per locale is unique and includes the primary commercial keyword for that locale.
- [ ] Three H2 candidates land the variety names (Mágnum · Dream · 1525) at least once in the rendered HTML per locale.
- [ ] "Tarragona" appears in `<title>`, `<meta description>`, Hero `<h1>` or subtitle, AboutUs p1, Footer description (5 surfaces minimum per locale).
- [ ] "Sin pesticidas" / "sense pesticides" / "no pesticides" appears in Values, Products, CTA badges, AND meta description per locale.
- [ ] Alt text on every `<img>` follows pattern: `[Product/Subject] [origin] — Yaya Mariana`. No alt text references "homenaje", "memoria", or founder real name.
- [ ] Catalan contamination in `translations.ts:ES.stats.labels` is fixed (bug list pre-approved).
- [ ] Legacy lettuce title is replaced (bug list pre-approved).

### 7.4 Narrative + tribute-tone (HARD GATES)

- [ ] Grep audit: zero instances of `"homenaje"`, `"memoria"`, `"en memoria de"`, `"tributo"` in titles, meta descriptions, OG, schema, alt text, or H1/H2/H3. **HARD GATE.**
- [ ] Grep audit: zero expansions of `"J. Elías"` to any longer form. **HARD GATE.**
- [ ] Grep audit: zero references to legacy `yayamariana.com`, Audax, Linverd, La Sirena, or lechugas/hidropónico anywhere in code or rendered HTML. **HARD GATE.**

### 7.5 Day-1 indexability

- [ ] Google Search Console property verified for `yayamariana.es` (Phase 7 devops).
- [ ] Sitemap submitted via Search Console.
- [ ] First crawl confirmed within 14 days of `.es` registration + DNS propagation.
- [ ] Zero "Soft 404", "Discovered – currently not indexed", or "Excluded by robots.txt" errors for the 3 locale URLs.

---

## 8. Confirmation Paths

- **Deliverable (this file):** `C:\proyectos\yaya-mariana\docs\agency\phase-1-seo-analyst-keyword-strategy.md`
- **Memory append:** `C:\Users\8nill\.claude\agencia-web-v2\memory\seo-analyst-memory.md` (created in this engagement)
- **Inputs read (exactly once each):**
  1. `C:\Users\8nill\.claude\agencia-web-v2\memory\global-memory.md`
  2. `C:\proyectos\yaya-mariana\docs\agency\phase-0-report.md`
  3. `C:\proyectos\yaya-mariana\docs\agency\phase-0-market-analyst-report.md`
  4. `C:\proyectos\yaya-mariana\docs\agency\phase-0-competitor-killer-plan.md`
  5. `C:\proyectos\yaya-mariana\src\app\layout.tsx`
  6. `C:\proyectos\yaya-mariana\src\i18n\translations.ts`
  7. `C:\Users\8nill\.claude\agencia-web-v2\analysis\seo-analyst.md` (role spec)
- **Narrative-protection self-audit (this file):** zero `"J. Elías"` expansions · zero investor-identity references · zero Audax/Linverd/lechuga mentions other than in §3.1 and §7.4 as exclusion-rule context · zero "homenaje"/"memoria" keyword recommendations · zero email "fix" proposals · founder rendered consistently as `"J. Elías, fundador"`.
- **Deploy-context self-audit:** zero 301/410/migration moves · zero legacy `.com` rescue tactics · treats `yayamariana.es` as a clean launch on a fresh TLD.
- **MAJOR-flag decisions for director:**
  - **§3.5 hreflang option A vs B** — A is the right SEO call but requires locale routing (modifies app structure). B is AUDIT-safe but leaves the Catalan moat (C6) invisible to crawlers. **Director decision needed before Phase 4.5.**
  - Everything else fits AUDIT scope.

---

## 9. Handoff for seo-genius (Phase 4.5 / 5)

Priority-ordered implementation checklist (Phase 4.5 surgical SEO pass):

1. **P0** — Replace `layout.tsx` lettuce title + description with ES versions from §3.2 + §3.3.
2. **P0** — Fix `translations.ts` ES.stats.labels Catalan contamination.
3. **P0** — Implement `Organization` + `Product` × 3 JSON-LD per §4.1 + §4.3.
4. **P0** — Create `src/app/robots.ts` and `src/app/sitemap.ts` per §3.7 + §3.8.
5. **P0** — Add `openGraph` + `twitter` metadata blocks per §3.4 (image asset coordinated with image-curator; **no founder face**).
6. **P1** — Decide hreflang option A vs B with director. If A: implement locale routing (`/es`, `/ca`, `/en`) + per-locale metadata + canonical/alternate links.
7. **P1** — Surface variety names (Mágnum · Dream · 1525) in Products H2 / eyebrow per §5 + competitor-killer Beat-them plan #8.
8. **P1** — Add the 40-word "Camp de Tarragona vs commodity Huelva" microparagraph inside AboutUs p2 per §5 (without naming Huelva combatively).
9. **P2** — Wire harvest-week chip data source to also drive Product `availability` (in-season `InStock` ↔ off-season `PreOrder`) per §4.3.
10. **P2** — Run final Lighthouse SEO + Rich Results Test pass; verify zero validator errors; verify all hard gates §7.4 green.

---

*End of report.*
