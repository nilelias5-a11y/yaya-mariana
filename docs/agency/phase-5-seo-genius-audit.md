# Phase 5 — SEO Technical + On-Page Audit

**Project:** Yaya Mariana — DTC de fresas premium artesanales (Camp de Tarragona, ES)
**Prepared by:** seo-genius
**Date:** 2026-05-22
**Branch:** `clasico` · **Mode:** AUDIT (detect + propose; no code changes)
**Stack:** Next.js 16 App Router · single-page trilingüe ES (default) / CA / EN, i18n client-side
**Deploy target:** `yayamariana.es` (fresh `.es` TLD, not yet purchased)
**Inputs read:** seo-genius spec · global-memory · seo-genius-memory · seo-analyst-memory · `phase-1-seo-analyst-keyword-strategy.md` · `layout.tsx` · `page.tsx` · `checkout/page.tsx` · all `components/ui/*.tsx` · `i18n/translations.ts` · `next.config.ts` · `public/`

---

## 1. Executive Summary

**Overall SEO score: 4.2 / 10 — FAIL** (threshold 8.5).

Phase 4.5 closed the on-page *content* floor cleanly: the legacy "Lechugas hidropónicas" title is gone (now correctly "Yaya Mariana – Fresas de Tarragona"), there is exactly one real `<h1>` (the Hero quote), the page has a `<main>` landmark + skip-link, and the heading hierarchy is sane. The brand-voice keyword coverage in body copy is genuinely strong — Tarragona, "sin pesticidas", and the three variety names appear naturally across Hero, Products, AboutUs, Values, CTA and Footer.

But the **technical SEO floor specified in the Phase 1 handoff (§9 items 3, 4, 5 — schema, robots, sitemap, OG) was never implemented.** The codebase has **zero JSON-LD, zero `robots.ts`, zero `sitemap.ts`, zero Open Graph / Twitter metadata, zero canonical, zero hreflang, no `metadataBase`, and no branded OG image.** A crawler arriving at `yayamariana.es` today gets a page with a title + a description and nothing else — no structured data to earn rich results, no sitemap to accelerate discovery, no social card, and no signal that CA/EN content even exists. The Catalan-native moat (cluster C6), which the strategy named as the single most defensible win, is **completely invisible to Google** because the i18n is client-side with no separable URL per locale.

The gap is pure execution debt, not strategy debt — the Phase 1 strategy is sound and the component copy already carries the keywords. This is a one-build fix. But until robots + sitemap + the schema triplet + OG + per-locale indexability ship, the site launches SEO-blind.

**Diagnosis (2 sentences):** Yaya Mariana has a correct on-page content foundation but an entirely absent technical SEO layer — no schema, no sitemap, no robots, no OG, no canonical, no hreflang — leaving the site uncrawlable-by-best-practice and unable to earn a single rich result on launch day. The fix is execution of the already-written Phase 1 handoff (§9 items 3–5), not new strategy; until then the trilingual content is real but two of three languages are invisible to search.

---

## 2. Issues Table

Severity key: **CRITICAL** = blocks launch / black-hat / firewall breach · **HIGH** = major ranking loss · **MEDIUM** = meaningful gap · **LOW** = micro-optimization.

| # | Área | Problema | Sev. | Fix concreto |
|---|------|----------|------|--------------|
| 1 | Schema.org | **No existe ningún JSON-LD en el código.** Cero `Organization`, cero `Product`. `grep "application/ld+json"` → 0 resultados. Phase 1 §4 lo especificó como P0; nunca se ejecutó. Sin schema no hay rich results, no hay panel de conocimiento, no hay precio/disponibilidad en SERP. | CRITICAL | Crear `src/components/json-ld.tsx` (o un `<Script type="application/ld+json">` en `layout.tsx`) con: 1× `Organization` + 3× `Product` (Mágnum, Dream, 1525) exactamente como el contrato de Phase 1 §4.1/§4.3. `founder` = string `"J. Elías, fundador"` (NUNCA `Person` schema). `price: "7.50"`, `priceCurrency: "EUR"`, `availability` ligada a `season.isOffSeason` (`InStock` ↔ `PreOrder`). Validar en Google Rich Results Test → 0 errores. |
| 2 | Técnico | **No existe `src/app/robots.ts`.** No hay `/robots.txt`. Los crawlers no reciben directiva ni puntero al sitemap; `/checkout` y `/api/` quedan indexables. | CRITICAL | Crear `src/app/robots.ts` (`MetadataRoute.Robots`): `allow: '/'`, `disallow: ['/checkout', '/api/']`, `sitemap: 'https://yayamariana.es/sitemap.xml'`, `host: 'https://yayamariana.es'`. Código exacto en Phase 1 §3.7. |
| 3 | Técnico | **No existe `src/app/sitemap.ts`.** No hay `/sitemap.xml`. Google no tiene mapa de descubrimiento; en un dominio nuevo sin autoridad esto retrasa la primera indexación semanas. | CRITICAL | Crear `src/app/sitemap.ts` (`MetadataRoute.Sitemap`). Si se adopta routing por locale (issue #5) → 3 URLs con `alternates.languages`. Si se mantiene single-route → 1 URL `/` (honesto para SPA client-side). Código base en Phase 1 §3.8. |
| 4 | i18n SEO | **Sitio trilingüe ES/CA/EN servido en una sola URL con i18n client-side** (`language-context.tsx` cambia `t` en cliente, persiste en `localStorage`). No hay rutas `/es` `/ca` `/en`. Google indexa solo el render por defecto (ES). El contenido CA y EN — incluido el **moat catalán C6**, la mayor ventaja competitiva nombrada por la estrategia — es invisible para el crawler. No hay forma de declarar hreflang sin URLs separables. | HIGH | Decisión de equipo (no exigible en AUDIT puro). Opción A (recomendada SEO): introducir segmentos de locale App Router `/[lang]` + middleware Accept-Language → habilita 3 URLs indexables + hreflang real + sitemap por idioma. Opción B (AUDIT-safe): mantener single-route, aceptar que solo ES rankea, documentar la pérdida de C6/C7. **Recomendación seo-genius: Opción A** — sin ella el 66% del contenido traducido no existe para SEO y el moat catalán se pierde. Escalar a `director`. |
| 5 | Metadata | **No hay `<html lang>` correcto en el HTML servido por SSR.** `layout.tsx` hard-codea `lang="es"`; `language-context.tsx` solo corrige `document.documentElement.lang` en cliente tras hidratación. El HTML que ve el crawler (y el primer paint) siempre dice `es`, aunque el usuario tenga CA/EN. | HIGH | Resuelto naturalmente si se adopta Opción A del issue #4 (`lang` por ruta en el layout de `[lang]`). En single-route no hay solución SSR limpia — otra razón para Opción A. |
| 6 | Metadata | **No hay bloque `openGraph` ni `twitter` en `metadata`.** `grep "openGraph"` → 0. Sin OG title/description/image ni Twitter card. Compartir el enlace en WhatsApp / X / Facebook no muestra tarjeta — solo URL pelada. Phase 1 §3.4 lo especificó. | HIGH | Añadir `openGraph` (`type: website`, `locale: es_ES`, `alternateLocale: ['ca_ES','en_GB']`, `url`, `siteName`, `title`, `description`, `images`) + `twitter` (`card: summary_large_image`) a `metadata` en `layout.tsx`. Texto exacto en Phase 1 §3.4. |
| 7 | Técnico | **No existe imagen OG.** No hay `public/og/` ni `opengraph-image` route. La referencia de Phase 1 (`/og/og-default.jpg`) apunta a un asset inexistente. | HIGH | Generar OG 1200×630 — composición manos + fresa Mágnum sobre cream (Killer Visual #2). **Regla firewall: SIN rostro del fundador, SIN identidad del inversor.** Colocar en `public/og/og-default.jpg` o usar `app/opengraph-image.tsx` (ImageResponse). Coordinar con `image-curator`. |
| 8 | Metadata | **No hay `metadataBase`.** Sin él, Next.js no resuelve OG/Twitter `images` a URLs absolutas y emite warning en build; las rutas relativas rompen las tarjetas sociales. | HIGH | Añadir `metadataBase: new URL('https://yayamariana.es')` a `metadata` en `layout.tsx`. |
| 9 | Metadata | **No hay `<link rel="canonical">`.** Sin `alternates.canonical` en `metadata`. Toda página debe declarar su canónica; sin ella el dominio queda expuesto a duplicados por parámetros/UTM. | HIGH | Añadir `alternates: { canonical: 'https://yayamariana.es/' }` (single-route) o auto-referencial por locale (Opción A). |
| 10 | On-page | **`translations.ts` ES `stats.labels` mezcla idiomas.** `["Natural", "Pesticidas", "Del campo a tu mesa", "Variedades"]` — actualmente OK en ES (la "contaminación catalana" `"Del camp a taula"` que reportó Phase 1 §5 **ya fue corregida**). Verificado: ES correcto, CA correcto, EN correcto. | — | **Sin acción** — registrado como verificado para cerrar el ítem del handoff de Phase 1. |
| 11 | Metadata | **`<title>` ES de 33 caracteres** ("Yaya Mariana – Fresas de Tarragona") — válido pero pone la marca **delante** de la keyword. SEO best practice: keyword primaria primero, marca al final. La estrategia (§3.2) recomienda `Fresas frescas de Tarragona | Yaya Mariana`. | MEDIUM | Reordenar a `Fresas frescas de Tarragona | Yaya Mariana` (43 chars). La keyword comercial al inicio mejora CTR y peso de relevancia. Separador `|` en vez de `–` (convención). |
| 12 | Metadata | **Checkout `<title>` = "Pagar – Yaya Marianа"** sin description; la página es indexable (no hay robots disallow aún → issue #2). Una página de pago en el índice es ruido SEO. | MEDIUM | Tras crear `robots.ts` con `disallow: ['/checkout']`, añadir además `robots: { index: false, follow: false }` al `metadata` de `checkout/page.tsx` como defensa en profundidad. |
| 13 | Schema | **Sin schema en `/checkout`** — correcto, no necesita. Pero confirmar que `/checkout` NO hereda Product schema si #1 se monta en `layout.tsx` global. El JSON-LD de Product debe vivir solo en `page.tsx` (home), no en el layout raíz. | MEDIUM | Al implementar #1, montar `Organization` en `layout.tsx` (aplica a todo el sitio) pero los 3 `Product` solo en el componente de la home / `page.tsx`. |
| 14 | On-page / alt | **Las fotos de producto tienen alt genérico secuencial.** `products.tsx` línea 148: `alt={`${name} foto ${current + 1}`}` → "Fresa Mágnum foto 1", "Fresa Mágnum foto 2"... El número de foto no aporta valor semántico ni keyword. Las claves `about.photoAlt1/2/3` de `translations.ts` existen pero **no se usan** (AboutUs renderiza una placa tipográfica, no `<img>`). | MEDIUM | Cambiar el patrón de alt a algo descriptivo + origen, p. ej. `Fresas Mágnum recién cogidas en Tarragona — Yaya Mariana`. Para el carrusel, variar ligeramente por foto sin el "foto N" (o mantener N pero con base descriptiva). Sin "homenaje"/"memoria"/nombre real del fundador (cumple firewall). |
| 15 | Estructura | **El logo del nav usa `alt="Yaya Mariana"`** (`hero.tsx` línea 232) — correcto. Pero el `<a href="/">` que lo envuelve no tiene texto ni `aria-label` adicional; el alt cubre el caso. Sin acción crítica. | LOW | OK. Opcional: el alt del logo podría ser `Yaya Mariana — fresas de Tarragona` para reforzar keyword en un surface above-the-fold. |
| 16 | Estructura | **Anclas de navegación en español kebab-case** (`#productos`, `#sobre-nosotros`, `#contacto`) — correcto y consistente con la recomendación de Phase 1 §3.6. Headings: 1× `h1` (Hero), `h2` por sección, `h3` en cards, `h4` en footer/values. Jerarquía limpia. | — | **Sin acción** — verificado correcto. |
| 17 | On-page | **El H2 de Products dice "Nuestras fresas"** y no nombra las variedades. Phase 1 §5 (C4) recomendó promover "Mágnum · Dream · 1525" en el H2 o eyebrow de Products. Las variedades sí aparecen como `h3` en las cards y como placa en Hero, así que la keyword variety-named está cubierta — pero no en el H2, que es el heading de mayor peso de la sección. | MEDIUM | Considerar subhead/eyebrow en Products: "Mágnum · Dream · 1525" (ya existe en el chip filtro y en la placa Hero). Mejora el match de la query variety-named (C4, competencia casi nula) en el heading más fuerte. AUDIT-scope: cambio de copy menor. |
| 18 | On-page | **No hay sección FAQ** → sin `FAQPage` schema, sin oportunidad de featured snippet. La estrategia (§4.6) lo dejó fuera de scope AUDIT (añadir FAQ = MAJOR). Cluster C5 (educación de sector — "diferencia fresa Huelva vs Tarragona", "cuándo es temporada") queda sin home natural. | LOW | Fuera de scope Phase 5. Registrar como propuesta MAJOR Phase 6+: una FAQ de 4-6 preguntas cubriría C5 y habilitaría `FAQPage` JSON-LD (cebo de posición 0). Decisión de equipo. |
| 19 | Técnico | **`next.config.ts` correcto** — `formats: ["image/avif","image/webp"]` activo, `localPatterns` permite optimización, `remotePatterns` retirado (sin hot-link legacy). Imágenes JPEG locales servidas como AVIF/WebP por el optimizador. | — | **Sin acción** — verificado correcto. |
| 20 | Técnico | **`favicon.ico` presente** (`src/app/favicon.ico`, 25 KB) — Next.js lo sirve automáticamente. No hay `apple-touch-icon` ni `manifest.webmanifest` ni iconos PNG multi-tamaño. | LOW | Opcional: añadir `app/icon.png` (512×512) + `app/apple-icon.png` (180×180) para PWA/iOS. No bloqueante para SEO de buscador. |
| 21 | Firewall / Narrativa | **Verificación de fuga del nombre real del fundador.** Grep en todo el código: `J. Elías` aparece solo como `"J. Elías, fundador"` (ES/CA) y `"J. Elías, founder"` (EN) en `translations.ts`. **Cero expansiones a forma larga. Cero `Person` schema. Cero identidad de inversor.** Cumple el firewall narrativo. | — | **PASS** — mantener: al implementar el `Organization` schema (#1), `founder` debe ser el string `"J. Elías, fundador"`, NUNCA un nodo `Person`. |
| 22 | Firewall / Tono | **Verificación de keywords memoriales.** "homenaje", "tributo", "en memoria de" NO aparecen en title, description, OG (inexistente), schema (inexistente), ni headings. La única aparición de tono memorial es `footer.inMemory` ("En memoria de Mariana") en el copy visible del footer — apropiado como hilo de homenaje, NO es un surface SEO. Cumple la regla dura de Phase 1 §2.3. | — | **PASS** — al crear OG y schema (#1, #6, #7) NO introducir lenguaje memorial en esos surfaces. |
| 23 | Técnico | **Legacy `yayamariana.com` / Audax / Linverd / lechugas** — grep en código y copy: cero referencias. El title legacy ya fue saneado en Phase 4.5. `next.config.ts` confirma que se retiró el `remotePatterns` al dominio legacy. | — | **PASS** — firewall de dominio legacy limpio. |
| 24 | Datos / NAP | **Inconsistencia de dirección entre fuentes.** `contact.tsx` muestra `C/ Electrónica, 19, Planta 10, oficina D · 08915, Badalona`. Phase 1 §4.1 especifica para el `Organization` schema `addressLocality: Badalona, postalCode: 08911`. El CP no coincide (08915 vs 08911). NAP inconsistente entre el schema propuesto y el copy renderizado. | MEDIUM | Antes de implementar el schema (#1), alinear el `postalCode` del JSON-LD con el que muestra `contact.tsx` (`08915`) — o que `director`/Nil confirme cuál es el correcto. La dirección del schema debe ser idéntica a la visible (regla NAP). |
| 25 | Black-hat audit | **Auditoría de tácticas black-hat: PASS — cero.** Sin keyword stuffing (densidad natural), sin texto oculto, sin cloaking, sin doorway pages, sin reviews/AggregateRating fabricados (no hay schema de reviews — correcto, no hay reseñas reales), sin enlaces comprados, sin contenido AI-spam. La placa de variedades, el chip de trazabilidad y los badges de confianza son contenido honesto y visible. | — | **PASS** — sin riesgo de penalización. |

**Recuento:** 3 CRITICAL · 6 HIGH · 7 MEDIUM · 4 LOW · 5 PASS-verificados = **25 ítems / 20 defectos accionables.**

---

## 3. Detalle por área

### 3.1 Metadata

`layout.tsx` tras Phase 4.5: `title` y `description` correctos y orientados a fresas. La description (152 chars) está dentro de límite y cubre clusters C1/C2/C3/C4. **Lo que falta es todo lo demás del objeto `metadata`:** `metadataBase`, `openGraph`, `twitter`, `alternates` (canonical + languages), `robots`. Hoy `metadata` solo tiene `title` + `description` — el mínimo absoluto.

- `<title>` ES: válido (33 chars) pero marca-primero → reordenar (issue #11).
- `<title>` checkout: presente, sin description, indexable → cerrar con robots (issue #12).
- CA y EN **no tienen metadata propia** — al ser i18n client-side, el `<title>`/`<description>` servido es siempre el ES. Sin Opción A (issue #4) no hay metadata por idioma posible.

### 3.2 i18n SEO — el problema estructural

El sitio es genuinamente trilingüe en el *runtime del navegador*: `language-context.tsx` intercambia el diccionario `t` y persiste en `localStorage`. Pero para Google **solo existe una URL y un render** (el ES por defecto, porque el estado inicial del provider es `"es"` y el SSR no conoce la preferencia del usuario). Consecuencias:

1. El contenido CA y EN **no es indexable** — no hay URL que Google pueda rastrear y servir.
2. **No se puede declarar `hreflang`** — `hreflang` requiere URLs distintas por idioma.
3. El **moat catalán (C6)** — descrito por la estrategia como la ventaja más defendible (competencia casi nula en SERPs catalanas) — **se pierde por completo.**
4. El `<html lang>` servido por SSR siempre es `es` (issue #5).

Esto **no es exigible en modo AUDIT puro** (introducir `/[lang]` modifica el routing = MAJOR). Es una decisión de `director` + Nil. Pero seo-genius debe ser explícito: **sin Opción A, dos de los tres idiomas son trabajo de traducción que SEO nunca verá, y la estrategia de keywords pierde C6 y C7 enteros.** Recomendación firme: Opción A (segmentos de locale App Router + middleware Accept-Language). Es la diferencia entre un sitio trilingüe real para SEO y un sitio ES con dos traducciones decorativas.

### 3.3 Estructura / semántica

Correcta. `page.tsx` envuelve el contenido en `<main id="contenido" tabIndex={-1}>`, hay skip-link, el `<nav aria-label>` es traducible, exactamente un `<h1>` (la cita del Hero en Playfair italic), `h2` por sección, `h3` en cards de producto y values, `h4` en columnas de footer. El `<footer>` es landmark propio. Anclas en español kebab-case. Nada que corregir aquí — Phase 4.5 (hierarchy-master + accessibility-perfectionist) ya lo dejó sólido.

### 3.4 Datos estructurados / Schema.org

**Estado: inexistente.** Cero JSON-LD. Lo que debe shippar (contrato Phase 1 §4):

- **`Organization`** (P0) — en `layout.tsx`, global. `name`, `url`, `logo`, `description`, `founder: "J. Elías, fundador"` (string, NO Person), `address` (Badalona — alinear CP con issue #24), `contactPoint` (`info@yaya-mariana.com` con guion intencional, `+34 666 777 888`), `sameAs: ["https://www.instagram.com/layayamariana"]`.
- **`Product` ×3** (P0) — Mágnum / Dream / 1525, solo en la home (`page.tsx`/componente), NO en el layout raíz. `offers` con `price: "7.50"`, `priceCurrency: "EUR"`, `availability` ligada a `season.isOffSeason`. `brand`, `sku`, `additionalProperty` (origen/variedad/formato/cultivo).
- **`LocalBusiness`** — **omitir** (DTC e-commerce, no retail walk-in; invitaría a Google a esperar horarios de tienda).
- **`BreadcrumbList`** — **omitir** (single-page, sin jerarquía).
- **`FAQPage`** — **omitir ahora** (no hay sección FAQ; añadirla es MAJOR Phase 6+).
- **`Person` para el fundador** — **NO, jamás** (crearía entidad indexable que invitaría a la expansión de identidad real; viola el firewall).

### 3.5 Técnico

- `next.config.ts`: AVIF/WebP activo, sin hot-link legacy → **OK**.
- `robots.txt`: **ausente** → crear `robots.ts` (issue #2).
- `sitemap.xml`: **ausente** → crear `sitemap.ts` (issue #3).
- OG image: **ausente** → generar 1200×630 sin rostro del fundador (issue #7).
- `metadataBase`: **ausente** → añadir (issue #8).
- `favicon.ico`: presente; faltan icon PNG / apple-icon / manifest (issue #20, LOW).
- HTTPS / redirects / 404 status: no auditable estáticamente con dev server apagado; verificar en deploy (Phase 7 devops). Next.js App Router sirve un 404 con status correcto por defecto; no hay `not-found.tsx` personalizado pero el genérico devuelve 404 — aceptable, branding del 404 sería pulido LOW.

### 3.6 On-page

Cobertura de keywords en copy: **fuerte.** "Tarragona" aparece en title, description, Hero eyebrow+subtitle, Products subtitle+harvestLabel, AboutUs p1/p2, Footer description, CTA subtitle — muy por encima del mínimo de 5 surfaces de Phase 1 §7.3. "Sin pesticidas" en Values, Products, CTA badges, description. Las tres variedades (Mágnum/Dream/1525) en placa Hero, cards Products, filtro, AboutUs p2, Footer. El **chip de trazabilidad** (`products.tsx`: "Recogida en Tarragona · semana 21") es contenido indexable, honesto, refuerza C2+C10 — bien. Lo que falla on-page es menor: el H2 de Products no nombra variedades (issue #17) y los alt de las fotos son genéricos (issue #14).

---

## 4. Roadmap de corrección (orden de implementación)

Prioridad para llevar el score de 4.2 a ≥8.5:

1. **CRITICAL** — `src/app/robots.ts` (issue #2). ~10 líneas.
2. **CRITICAL** — `src/app/sitemap.ts` (issue #3). ~20 líneas.
3. **CRITICAL** — JSON-LD `Organization` + `Product`×3 (issue #1, #13, #24). Componente nuevo.
4. **HIGH** — `metadataBase` + `openGraph` + `twitter` + `alternates.canonical` en `layout.tsx` (issues #6, #8, #9).
5. **HIGH** — Generar OG image 1200×630 sin rostro del fundador (issue #7) — coordinar `image-curator`.
6. **HIGH** — Decisión `director`: Opción A (locale routing → resuelve #4 + #5 + hreflang real + sitemap por idioma) vs Opción B (single-route, asumir pérdida de C6/C7). Recomendación seo-genius: **A**.
7. **MEDIUM** — Reordenar `<title>` keyword-primero (#11), `robots: noindex` en checkout (#12), alt descriptivos (#14), alinear NAP CP (#24), variedades en H2 Products (#17).
8. **LOW** — icon PNG / apple-icon / manifest (#20), alt del logo (#15), 404 branded.
9. Validar todo en Google Rich Results Test (0 errores) + Lighthouse SEO (objetivo ≥95) cuando haya staging HTTPS.

Items 1-5 son **ejecución directa del handoff Phase 1 §9** — código ya especificado, sin decisiones nuevas. Item 6 es la única decisión de equipo real.

---

## 5. Score

| Dimensión | Peso | Estado | Sub-score |
|-----------|------|--------|-----------|
| Metadata (title/desc/OG/canonical/metadataBase) | alto | title+desc OK; OG/canonical/metadataBase ausentes | 3 / 10 |
| Schema.org / JSON-LD | alto | inexistente (0 schema) | 0 / 10 |
| Técnico (robots/sitemap/OG image) | alto | los 3 ausentes | 1 / 10 |
| i18n SEO (hreflang/lang/indexabilidad por idioma) | alto | client-side, CA/EN no indexables | 2 / 10 |
| Estructura / semántica (h1/landmarks/headings) | medio | correcta y verificada | 9 / 10 |
| On-page (keywords en copy/headings/alt) | medio | copy fuerte; alt y H2 mejorables | 7 / 10 |
| Firewall narrativo + black-hat | gate | PASS — sin fugas, sin black-hat | 10 / 10 |

**Score global ponderado: 4.2 / 10 — FAIL** (umbral 8.5).

El score está deprimido por la ausencia total de la capa técnica, no por defectos de lo construido. Lo que existe (contenido, semántica, firewall) está bien. Ejecutar los 6 primeros pasos del roadmap §4 lleva el score realista a **~8.7** — todo es código ya especificado en el handoff de Phase 1.

---

## 6. Black-hat audit

**PASS — cero tácticas black-hat detectadas.** Sin keyword stuffing (densidad natural en voz de marca), sin texto/enlaces ocultos, sin cloaking, sin doorway pages, sin reviews ni `AggregateRating` fabricados (correctamente ausentes — no hay reseñas reales), sin enlaces comprados, sin contenido AI-spam, sin structured data engañoso (no hay schema todavía — al crearlo debe coincidir con el contenido visible). Sin riesgo para la autoridad del dominio.

---

## 7. Self-audit de protección narrativa

- Cero expansiones de `"J. Elías"` a forma larga en este informe ni propuestas en código.
- Cero `Person` schema propuesto; `founder` se mantiene como string.
- Cero identidad del inversor referenciada.
- Cero keywords memoriales ("homenaje"/"memoria"/"tributo") recomendadas para surfaces SEO.
- Cero referencias a `yayamariana.com` legacy / Audax / Linverd / lechugas como activos a rescatar.
- `info@yaya-mariana.com` (guion) tratado como intocable — sin propuesta de "corrección".
- Tratado `yayamariana.es` como lanzamiento limpio en TLD fresco — sin tácticas de migración 301/410.

---

## 8. Handoff

- **`frontend-developer`** — implementar issues #1, #2, #3, #6, #7, #8, #9 (robots, sitemap, JSON-LD, OG/Twitter/canonical/metadataBase). Código base en Phase 1 §3.4, §3.7, §3.8, §4.
- **`director`** — decisión Opción A vs B del issue #4 (locale routing). Recomendación: A.
- **`image-curator`** — OG image 1200×630, sin rostro del fundador (issue #7).
- **`quality-gate`** — re-verificar floor técnico tras corrección: Rich Results Test 0 errores, Lighthouse SEO ≥95, robots/sitemap accesibles.
- Confirmar con Nil el CP correcto de la dirección (issue #24) antes de cablear el `Organization` schema.

---

*End of report.*
