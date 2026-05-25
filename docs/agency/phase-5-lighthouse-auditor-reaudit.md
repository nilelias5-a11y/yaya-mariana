# Fase 5 — Re-auditoría Lighthouse · Yaya Mariana (post-TANDA 4)

> Rol: `lighthouse-auditor` de la red agencia-web-v2.
> Proyecto: Yaya Mariana — DTC de fresas premium (Tarragona). Rama `clasico`, HEAD `62c6f77`.
> Modo: **AUDIT ESTÁTICO** — el servidor `next dev`/`next start` no está corriendo; Lighthouse en vivo NO es ejecutable en esta pasada. Estimaciones por análisis del código + delta de cambios respecto a la auditoría OLA 1.
> Fecha: 2026-05-25.
> Baseline previo (audit MEDIDO en vivo, Fase 5 OLA 1): Perf ~67 · A11y 95 · Best-Practices 100 · SEO 100 (Lighthouse) — con seo-genius autoevaluándose en **4.2 / 10** por la ausencia total de la capa técnica (robots/sitemap/JSON-LD/OG/canonical/metadataBase/hreflang).

---

## 0. Resumen ejecutivo

TANDA 4 (perf + SEO + CWV) ejecutó **las 7 palancas de mayor impacto** del audit OLA 1 sin tocar la arquitectura (i18n se mantiene client-side, Opción B del issue #4 de seo-genius). Cambios verificados en código:

1. **MeshGradient WebGL eliminado.** `hero.tsx:315-326` ya pinta el fondo con 3 `radial-gradient` CSS sobre `--cream-100`. Comentario en línea documenta el reemplazo. (Resuelve P-01 — la palanca más cara del audit previo.)
2. **`@paper-design/shaders-react` y `lucide-react` desinstalados.** `package.json` no los lista; `node_modules/@paper-design` y `node_modules/lucide-react` no existen. (Resuelve P-05 + raíz de P-03.)
3. **Playfair recortado de 7 pesos a 1.** `layout.tsx:16-21` carga solo `weight:["400"]` + `style:["normal","italic"]`. (Resuelve P-07.)
4. **JSON-LD inyectado en `<head>`.** `layout.tsx:178-196` emite 1× `Organization` + 3× `Product` con `offers.price=7.50 EUR`, `availability:InStock`, `additionalProperty` por SKU. `founder` deliberadamente fuera del schema (HARD RULE narrativa). (Resuelve seo issue #1.)
5. **`metadataBase` + `openGraph` + `twitter` + `alternates.canonical` + `robots`.** `layout.tsx:33-86`. (Resuelve seo issues #6, #8, #9.)
6. **OG image dinámica vía edge runtime.** `src/app/opengraph-image.tsx` — 1200×630, tipográfico (wordmark Playfair italic + 3 variedades), SIN rostro del fundador, fuente Playfair fetched en runtime de Google Fonts. (Resuelve seo issue #7.)
7. **`robots.ts` + `sitemap.ts` creados.** Disallow `/api/` + `/checkout`. Sitemap con 1 URL home. (Resuelve seo issues #2 + #3.)

Verificaciones colaterales:
- `Fotos Fresas.zip` (12 MB) eliminado de `public/` (resuelve P-09).
- Las 42 JPEG siguen ahí (P-08 NO atacado: peso muerto en el repo pero el pipeline AVIF runtime ya las sirve bien — gana lo importante, queda lo cosmético).
- i18n sigue siendo `LanguageProvider` client-side (`context/language-context.tsx`). NO se introdujo `/[lang]` routing — Opción B mantenida (CA/EN no indexables; moat catalán C6 sigue invisible para SEO).
- `experimental.optimizePackageImports` NO añadido a `next.config.ts` (P-10 sigue abierto, pero su impacto cae al desinstalarse las dos dependencias gordas).

---

## 1. Estimación Lighthouse final (vs OLA 1)

| Categoría | OLA 1 (MEDIDO) | Post-TANDA 4 (ESTIMADO) | Delta |
|---|---|---|---|
| **Performance** | ~67 (Run 1 64 / Run 2 70) | **86 — 92** (realista ~88) | **+19 a +25** |
| **SEO** | 100 (Lighthouse) / 4.2 (seo-genius técnico) | **100 (Lighthouse) / ~8.7 (seo-genius)** | seo-genius +4.5 pts |
| **Accessibility** | 95 | **95 — 97** | sin regresión |
| **Best Practices** | 100 | **100** | sin regresión |

### Justificación de la horquilla de Performance

La proyección §4 del audit OLA 1 cifraba el bundle de fixes aplicado (P-01 + P-05 + P-07) en **~88-94 puntos** y el shader-solo en **+12 a +18**. Realidad post-TANDA 4:

- **P-01 (shader → CSS gradient):** −66 KB gzip del chunk principal · −150 a −300 ms TBT · −1.0 a −1.5 s LCP. Confianza alta — el motor WebGL desaparece literalmente del runtime.
- **P-05 (paquetes muertos):** `@paper-design/shaders-react` + `lucide-react` desinstalados → tree-shaking más limpio + Turbopack ya no resuelve esos paths. Impacto agregado a P-01 (~−71 KB gzip estimados en el audit).
- **P-07 (Playfair de 12 a 2 combinaciones):** transfer de fuentes en 1ª carga cae de ~124 KB / 3 woff2 a ~40-60 KB / 2 woff2. Menos competencia de red con el LCP. **+1 a +3 puntos.**
- **Lo NO atacado todavía:**
  - P-04 (RSC en componentes estáticos) — NO migrado. Los 11 componentes siguen `'use client'` por el Context i18n. Eso deja ~80-140 KB gzip de JS de hidratación que aún se envían — techo de Perf ~92 hasta que se mueva i18n a routing por locale.
  - P-02 (gate `opacity:0` en LCP) — el Hero sigue con `initial={{ opacity:0, y:14 }}` en su `motion.div` izquierdo (línea 343). El LCP sigue arrancando invisible. **−3 a −6 puntos del LCP ideal.**
  - P-10 (`optimizePackageImports`) — no aplicado; pero `framer-motion` sigue siendo la dependencia "gorda" restante y se beneficiaría de tree-shaking explícito.
- **Riesgos de la estimación:**
  - La OG image vía `runtime:edge` con `fetch` a Google Fonts en cold start es razonable PARA LA OG (no se descarga en la home), pero crawlers sociales pueden ver una latencia de 1ª generación de ~500-1500 ms. Se cachea tras la 1ª. No afecta Lighthouse de la home.
  - El `radial-gradient` triple del Hero hace painting trabajo no trivial en GPU de gama baja, pero es composite-only (no JS) — su coste es inferior al shader en 1-2 órdenes de magnitud.

**Estimación realista (Perf):** **~88 / 100.** Optimista (si LCP cae a ~2.3s y TBT a ~180ms): **~92.** Pesimista (si Vercel TTFB añade 200ms en producción real y P-02 mantiene LCP en 2.6-2.8s): **~85.**

**CWV proyectados:**

| Métrica | OLA 1 | Estimación post-TANDA 4 | Objetivo |
|---|---|---|---|
| LCP | 4.0–4.3 s | **2.4 – 2.9 s** | ≤ 2.5 s (borderline) |
| TBT | 530–700 ms | **180 – 280 ms** | ≤ 200 ms (borderline) |
| CLS | 0 | 0 | ≤ 0.1 |
| FCP | 1.4 s | 1.1 – 1.3 s | ≤ 1.8 s |
| Speed Index | ~5.0 s | 2.8 – 3.4 s | ≤ 3.4 s |

LCP y TBT quedan **en zona borderline-good**. Sin P-02 (quitar el gate `opacity:0`) y sin P-04 (RSC), no se garantiza zona Good clean — pero la barra de PASS (Perf ≥85) está cubierta con margen.

### Justificación de SEO

Lighthouse SEO ya estaba en 100/100 en OLA 1 (cubre los básicos: title, description, `<html lang>`, hreflang opcional, link crawlability, `viewport`). Lo que faltaba era la capa **técnica/rich-results**, no la capa Lighthouse-SEO. Tras TANDA 4:

- **seo-genius score (escala interna 0-10):** sube de **4.2 → ~8.7** según su propia tabla §5: Metadata 3→9, Schema 0→9, Técnico 1→9, i18n 2→3 (sin Opción A sigue suspenso), Estructura 9→9, On-page 7→7, Firewall 10→10. Ponderado: **8.6-8.8 → PASS** del umbral 8.5.
- **Lighthouse SEO:** se mantiene en 100. Eventualmente Google Rich Results Test debería dar 0 errores en el `Organization` + 3 `Product`.
- **Riesgos seo-genius:**
  - **i18n sigue siendo client-side** (issue #4 de OLA 1) — sin Opción A, el moat catalán C6 sigue invisible. seo-genius lo señaló como decisión de director; el equipo eligió Opción B. **No bloquea PASS técnico** pero deja ~30% del potencial SERP sin capturar.
  - El `sameAs` del schema lista placeholders (`facebook.com`, `instagram.com`, `x.com`...) — no son URLs reales de la marca. Google ignorará entradas inválidas pero conviene limpiarlas o sustituir por el Instagram real `@layayamariana`.
  - `address.postalCode: "08915"` (alineado con `contact.tsx` — issue #24 OLA 1 resuelto por copia, sin verificación de Nil sobre cuál es el CP real).

### Justificación de A11y / BP

A11y 95 en OLA 1 estaba lastrado por: contraste botón Hero (P-11 OLA 1) y `heading-order` del footer (P-12 OLA 1). Ninguno de los dos cae en el alcance de TANDA 4 (perf+SEO) y `accessibility-perfectionist` no entró en esta tanda — por tanto **se asume sin cambio: 95.** Si los fixes de TANDA 1-3 (botones del sistema, focusables, ARIA del Cart) tocaron también esos puntos, podría subir a 97-98; verificable solo en Lighthouse en vivo. Best Practices se mantiene en 100 — ningún cambio introduce HTTPS-mixed, deprecated API ni cookie inseguro.

---

## 2. Defectos restantes por severidad

| Severidad | Nº | IDs |
|---|---|---|
| **HIGH** | 2 | R-01 LCP gate `opacity:0` del Hero (P-02 OLA 1, no atacado) · R-02 i18n client-side bloquea CA/EN indexables (issue #4 OLA 1, decisión Opción B) |
| **MEDIUM** | 4 | R-03 RSC no migrados (P-04 OLA 1) · R-04 `optimizePackageImports` ausente (P-10 OLA 1) · R-05 30 JPEG no usados en `public/fresas/` (P-08 OLA 1, parcial) · R-06 `sameAs` del schema con placeholders inválidos |
| **LOW** | 3 | R-07 `heading-order` footer (P-12 OLA 1) · R-08 Sin `@next/bundle-analyzer` / `@vercel/speed-insights` (P-13/14 OLA 1) · R-09 OG en `runtime:edge` con `fetch` a Google Fonts (latencia 1ª generación; sin impacto en Lighthouse de la home) |

**Total: 9 defectos abiertos.** Los 2 CRITICAL del OLA 1 (P-01 shader · P-02 LCP ~4s) → P-01 resuelto · P-02 parcial (cuanto cae al quitar el shader, queda el componente del gate de opacidad).

---

## 3. Quick-wins para ganar otros 5–10 puntos

Ordenados por impacto/esfuerzo. Cada uno es < 20 min de edición y NO requiere decisión de director.

1. **R-01 — Retirar `initial={{ opacity:0 }}` del bloque LCP del Hero** (`hero.tsx:343`). Mantener la entrada de los elementos *no-LCP* (subtítulo, badges) pero pintar el `<h1>` Playfair italic y el eyebrow en estado final desde SSR. **+3 a +6 puntos Perf · LCP −300 a −600 ms.** Esfuerzo: 5 líneas. La animación de "respiración" puede quedarse en los hijos.
2. **R-04 — Añadir `experimental.optimizePackageImports: ['framer-motion']` a `next.config.ts`.** Tree-shaking explícito del único paquete gordo que queda. **+1 a +3 puntos Perf · −15 a −30 KB gzip.** Esfuerzo: 1 línea.
3. **R-06 — Limpiar `sameAs` del JSON-LD `Organization`** (`layout.tsx:110-116`). Cambiar los 5 placeholders por el único social real de la marca (`https://www.instagram.com/layayamariana`) — el resto, fuera. **Cero impacto Lighthouse, ~+0.2 puntos seo-genius**, evita warning de Google Rich Results sobre entidades sociales no resueltas. Esfuerzo: 3 líneas.
4. **R-05 — Borrar las 30 JPEG no usadas en `public/fresas/`.** 12 de 42 se referencian (4 imágenes × 3 productos). Las otras 30 son peso muerto de deploy. **Cero impacto en CWV (no se sirven), reduce el bundle de deploy en ~8 MB.** Esfuerzo: 1 comando `rm`. Pre-comprimir las 12 usadas a Q80/1600px (P-08 OLA 1) puede esperar; el pipeline AVIF runtime ya las sirve bien.
5. **R-08 — Instalar `@vercel/speed-insights`** y montarlo en `layout.tsx` (`<SpeedInsights />` antes de `</body>`). Cero impacto sintético en Lighthouse, pero habilita CrUX/field data para monitorización post-launch. Esfuerzo: `npm i` + 2 líneas.

**Si se aplican 1+2+3 (15 minutos de edición):** Performance proyectada sube de ~88 a **~91-93**. SEO se mantiene en 100 / seo-genius sube a ~8.8.

---

## 4. Veredicto

**Umbral PASS:** Performance ≥ 85 · SEO ≥ 90 (Lighthouse) · seo-genius ≥ 8.5.

| Métrica | Umbral | Estimación | Veredicto |
|---|---|---|---|
| Performance (Lighthouse) | ≥ 85 | ~88 (realista) | **PASS** (con margen 3 pts) |
| SEO (Lighthouse) | ≥ 90 | 100 | **PASS** (con margen amplio) |
| SEO (seo-genius interno) | ≥ 8.5 | ~8.7 | **PASS** (con margen 0.2) |
| Accessibility | ≥ 95 | 95 (estable) | **PASS** (justo en umbral) |
| Best Practices | ≥ 90 | 100 | **PASS** (con margen amplio) |

**Veredicto global: PASS.** Subimos los 4 indicadores por encima del umbral, con margen amplio en SEO/BP y margen ajustado en Perf/A11y. Los 2 defectos CRITICAL del audit previo (P-01 shader · P-02 LCP) están resueltos (P-01) o parcialmente resueltos (P-02 — basta R-01 quick-win para garantizar zona Good de LCP).

**Caveat metodológico:** la nota está ESTIMADA por análisis de delta de código, no MEDIDA en Lighthouse en vivo (el servidor está apagado en esta pasada). La cifra MEDIDA podría variar **±3-4 puntos** respecto a la estimación realista de 88 (la confianza es alta porque la palanca dominante — quitar el shader WebGL — tiene impacto teórico cuantificable y verificable). Antes de cerrar Fase 5 conviene una pasada `quality-gate` con `npm run build` + `next start` + `lighthouse` para sellar el número MEDIDO.

**Recomendación:** aplicar los quick-wins R-01 + R-04 + R-06 (15 min) antes de la medición final. Eso lleva la estimación a ~91-93 y deja LCP/TBT firmemente en zona Good.

---

## 5. Trazabilidad

- Audit previo MEDIDO: `docs/agency/phase-5-performance-audit.md` (Perf ~67).
- Audit SEO previo: `docs/agency/phase-5-seo-genius-audit.md` (4.2/10).
- HEAD analizado: `62c6f77` ("Yaya Mariana: Fase 5 TANDA 4 (performance + SEO + CWV)").
- Sin modificación de código en esta pasada (modo AUDIT puro).

*End of re-audit.*
