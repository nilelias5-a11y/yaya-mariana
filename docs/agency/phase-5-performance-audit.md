# Fase 5 — Auditoría de Performance · Yaya Mariana

> Equipo de performance de la red de agencia (roles asumidos: `performance-optimizer` · `lighthouse-auditor` · `core-web-vitals-specialist`).
> Proyecto: Yaya Mariana — DTC de fresas premium (Tarragona). Rama `clasico`, commit `5e24960`.
> Stack: Next.js 16.2.4 (Turbopack) · React 19.2.4 · Tailwind v4 · Framer Motion 12 · Stripe.
> Modo: **AUDIT — no se modifica código.**
> Fecha: 2026-05-22.

---

## 0. Resumen ejecutivo

**Baseline Lighthouse MEDIDO EN VIVO** — `npm run build` (verde) + `npx next start` + `npx lighthouse` headless contra `http://localhost:3000`. Dos pasadas para estabilidad.

| Categoría | Run 1 | Run 2 | Veredicto |
|---|---|---|---|
| **Performance** | 64 | 70 | **~67 / 100 — POOR** (umbral 90) → **6.7/10** |
| **Accessibility** | 95 | — | NEEDS IMPROVEMENT (umbral 95) → 9.5/10 |
| **Best Practices** | 100 | — | GOOD → 10/10 |
| **SEO** | 100 | — | GOOD → 10/10 |

**Core Web Vitals (lab, mobile emulado, throttling simulado):**

| Métrica | Run 1 | Run 2 | Objetivo | Estado |
|---|---|---|---|---|
| LCP | 4.3 s | 4.0 s | ≤ 2.5 s | **POOR** |
| TBT | 700 ms | 530 ms | ≤ 200 ms (proxy INP lab) | **POOR** |
| CLS | 0 | 0 | ≤ 0.1 | **GOOD (perfecto)** |
| FCP | 1.4 s | 1.4 s | ≤ 1.8 s | GOOD |
| Speed Index | 5.1 s | 5.0 s | ≤ 3.4 s | POOR |
| TTI | 5.7 s | — | — | lento |
| TTFB | 10 ms | — | ≤ 800 ms | EXCELENTE (estático local) |

**Diagnóstico (2 frases):** La home es una SPA 100% client-side — los 11 componentes UI son `'use client'` — que envía ~262 KB de JS gzip y monta un shader WebGL (`MeshGradient`) above-the-fold; el resultado es un LCP de ~4 s y un TBT de ~600 ms que hunden la nota a ~67. La accesibilidad, las best-practices y el SEO ya están en o muy cerca del verde; el problema es exclusivamente **carga inicial e interactividad**, no contenido ni semántica.

> Nota de fiabilidad: Lighthouse arrancó contra `next start` local (TTFB ~10 ms, sin red real). En producción Vercel el TTFB será mayor pero el patrón LCP/TBT se mantiene — son problemas de cliente, no de servidor. El baseline está **MEDIDO**, no estimado.

---

## 1. Recuento de defectos por severidad

| Severidad | Nº | IDs |
|---|---|---|
| **CRITICAL** | 2 | P-01 Shader WebGL above-the-fold · P-02 LCP ~4 s |
| **HIGH** | 4 | P-03 TBT ~600 ms / mainthread 8.9 s · P-04 Home 100% client-side (sin RSC) · P-05 71 KB de JS sin usar · P-06 Sin code-splitting de Stripe/checkout fuera de la home |
| **MEDIUM** | 5 | P-07 Carga de fuentes (15 woff2, 6 pesos Playfair) · P-08 42 JPEG de producto sin comprimir en `public/fresas/` · P-09 `Fotos Fresas.zip` (12 MB) en `public/` · P-10 `optimizePackageImports` ausente · P-11 Contraste botón Hero (a11y, también afecta nota A11y 95) |
| **LOW** | 4 | P-12 `heading-order` (`<h4>` footer) · P-13 Sin `@next/bundle-analyzer` · P-14 Sin Speed Insights / web-vitals · P-15 SVG inline repetidos sin extraer |

**Total: 15 defectos — 2 CRITICAL · 4 HIGH · 5 MEDIUM · 4 LOW.**

---

## 2. Los 6-8 problemas más relevantes

### P-01 · CRITICAL — `MeshGradient` (shader WebGL) above-the-fold en el Hero
`src/components/ui/hero.tsx:300` monta `<MeshGradient>` de `@paper-design/shaders-react` como fondo absoluto del Hero. Es un shader WebGL que:
- Arrastra el paquete `@paper-design/shaders-react` (~649 KB en disco; el código del shader vive en el chunk de 219 KB raw / **66 KB gzip** de la ruta `/`).
- Crea un contexto WebGL, compila shaders GLSL y arranca un loop de render — todo en el hilo principal, **above-the-fold**, compitiendo con el LCP.
- Es de los mayores contribuyentes al TBT (~600 ms) y al `mainthread-work-breakdown` de 8.9 s.
- Aporta, según el propio comentario del código (TANDA 5 ME-21), "un susurro de calidez" con 3 tonos cream — un degradado estático casi imperceptible.

**Coste/beneficio pésimo:** se paga un motor WebGL completo para un efecto que un `linear-gradient` CSS (coste 0) o una imagen AVIF diminuta reproducirían visualmente igual. `speed={reduceMotion ? 0 : 0.5}` congela el movimiento bajo reduced-motion pero **el contexto WebGL se sigue creando y el chunk se sigue descargando**.
**Recomendación (Fase 6, fuera de modo AUDIT):** sustituir `MeshGradient` por un `background` CSS con `linear-gradient`/`radial-gradient` de los 3 tonos cream (`#fdf6f5 → #fdf0ef → #ead7d4`). Elimina la dependencia entera, el chunk WebGL y el coste de hilo principal. Es la palanca #1 de toda la auditoría. Cambio de Hero = requiere confirmación de Nil (umbral de cambio mayor), pero el asset visual es swap in-place, no rediseño.
**Impacto estimado:** LCP −1 a −1.5 s · TBT −150 a −300 ms · bundle ruta `/` −60 a −66 KB gzip · Performance +12 a +18 puntos.

### P-02 · CRITICAL — LCP ~4.0-4.3 s (objetivo ≤ 2.5 s)
El LCP está en zona POOR. Causas encadenadas:
1. El elemento LCP es texto (la cita `<h1>` Playfair italic del Hero) o el bloque tipográfico de la columna derecha — ambos dependen de que Playfair termine de cargar y de que React hidrate.
2. El Hero entero está en un componente `'use client'`; nada se pinta hasta que el JS de la ruta (219 KB raw del chunk principal) descarga, parsea y ejecuta.
3. La animación de entrada Framer Motion `initial={{ opacity: 0, y: 14 }}` mantiene el contenido **invisible** hasta que el JS corre — el texto LCP arranca en `opacity: 0`, retrasando deliberadamente la pintura.
4. El shader WebGL (P-01) compite por el hilo principal en el momento exacto del LCP.

**Recomendación:** (a) resolver P-01; (b) para el contenido above-the-fold (eyebrow, `<h1>`, placa de variedades) renderizar el estado final sin gate de opacidad — la animación de entrada del Hero no debería ocultar el LCP; considerar Server Component para el bloque estático del Hero y empujar `'use client'` solo a `LanguageSelector`/`MobileNav`/`MeshGradient`.
**Impacto estimado:** LCP a ~2.2-2.8 s combinado con P-01/P-04.

### P-03 · HIGH — TBT ~530-700 ms · mainthread-work-breakdown 8.9 s
TBT es el 30% del score de Performance — la métrica de mayor peso. Las tareas largas vienen de dos chunks:
- `10~x95jhs6ns3.js` (227 KB raw / 70 KB gzip) — react-dom + runtime; tareas de 471/223/198 ms.
- `0602mzd7dr.r5.js` (219 KB raw / 66 KB gzip) — shader WebGL + motor de proyección de Framer Motion (107 ocurrencias de `projection`); tareas de 126 ms ×2.
`bootup-time` 1.2 s. Todo es ejecución de JS de arranque: hidratar 11 componentes cliente + montar el shader + inicializar Framer Motion.
**Recomendación:** P-01 (quita el shader) + P-04 (reduce JS a hidratar) + P-10 (`optimizePackageImports` para tree-shaking de framer-motion y lucide-react). Diferir lo no above-the-fold con `next/dynamic`.
**Impacto estimado:** TBT a ~200-300 ms · Performance +8 a +14 puntos.

### P-04 · HIGH — La home es 100% client-side; no se aprovechan los React Server Components
Los **11** componentes (`hero`, `stats-strip`, `products`, `about-us`, `values`, `cta`, `contact`, `footer`, `cart`, `skip-link`, `providers`) llevan `'use client'`. `page.tsx` es Server Component pero todo lo que renderiza es cliente, así que la página se sirve como una SPA: el HTML inicial es casi un cascarón y todo el contenido se hidrata en cliente.

Mucho de ese contenido es **estático**: `Values` (6 tarjetas de texto+SVG), `Footer` (enlaces), las cabeceras de sección, los textos de `AboutUs`, los iconos de `StatsStrip`, los `coldChain`/`badges` del `CTA`. Son `'use client'` solo porque consumen `useLanguage()` (un Context cliente) — no porque tengan interactividad real.

**Recomendación (Fase 6):** la causa raíz es que la i18n es un React Context en cliente. Migrar a i18n basado en rutas/servidor (p. ej. segmento `[lang]` + diccionario servido en el server, patrón estándar Next 16 App Router) permitiría que `Values`, `Footer`, `AboutUs`, las cabeceras y `StatsStrip` (salvo el count-up) sean Server Components — JS enviado al navegador cae drásticamente. Es un cambio de arquitectura de i18n (umbral mayor → confirmación de Nil). Alternativa de menor calado: mantener el Context pero envolver cada hoja interactiva en `'use client'` y dejar el resto como server, pasando las cadenas ya resueltas como props desde un server boundary.
**Impacto estimado:** −80 a −140 KB gzip de JS de hidratación · TBT −150 a −250 ms.

### P-05 · HIGH — 71 KB de JavaScript sin usar (`unused-javascript`, save ~300 ms)
Lighthouse marca ~71 KiB de JS descargado y no ejecutado en los primeros segundos. Encaja con: el motor de proyección de Framer Motion (layout animations que esta home apenas usa tras la limpieza de motion de TANDA 5), `lucide-react` (37 MB en `node_modules`; importado pero la mayoría de iconos del sitio son SVG inline propios — verificar si `lucide-react` se usa realmente o es import muerto), y partes de `@paper-design`.
**Recomendación:** `optimizePackageImports` (P-10); auditar si `lucide-react` se importa en algún sitio (no se encontró uso en los componentes leídos — candidato a dependencia muerta); resolver P-01.
**Impacto estimado:** −300 ms de carga · −71 KB transferencia.

### P-06 · HIGH — Stripe entra en el bundle del checkout sin lazy-loading explícito
`src/components/ui/checkout.tsx` importa `@stripe/stripe-js` y `@stripe/react-stripe-js` a nivel de módulo y llama `loadStripe(...)` en module-scope (`checkout.tsx:10`). `@stripe/react-stripe-js` aparece en chunks de la ruta `/` además del `/checkout` (`elements` detectado en `0602mzd7dr.r5.js` y `0d3tkj33oycf2.js`). Aunque `/checkout` es una ruta aparte, conviene confirmar que el SDK de Stripe **no** se incluye en el first-load de la home.
**Bien hecho:** el SDK de pago (`stripe.js` remoto, ~callback de `loadStripe`) se carga bajo demanda al renderizar `<Elements>` — `loadStripe` es asíncrono. La ruta `/checkout` es `○ Static`, correcto.
**Recomendación:** verificar con `@next/bundle-analyzer` que `@stripe/*` no contamina el chunk compartido de la home; si lo hace, mover el import de checkout a `next/dynamic` con `ssr:false`. Preconnect a `https://js.stripe.com` y `https://api.stripe.com` en la `<head>` de `/checkout` para adelantar el handshake.
**Impacto estimado:** si Stripe está en el first-load de la home, −30 a −50 KB gzip de la ruta `/`.

### P-07 · MEDIUM — Carga de fuentes: 15 ficheros woff2, Playfair con 6 pesos × 2 estilos
`layout.tsx` carga `Playfair_Display` con `weight: ["400","500","600","700","800","900"]` y `style: ["normal","italic"]` — eso son **12 combinaciones de Playfair** más Inter, materializadas en 15 woff2 en `.next/static/media/` (algunos por subset latin/latin-ext). En la primera carga se descargan 3 (~124 KB transfer). El sitio usa Playfair sobre todo en *italic* (Hero `<h1>`, placa de variedades, blockquote AboutUs, wordmark footer, títulos CTA) y los `.text-h*` de `globals.css` solo invocan `fw-regular/medium/semibold/bold` (400/500/600/700) — **800 y 900 no se usan** en ninguna utilidad ni componente leído.
**Recomendación:** reducir Playfair a los pesos realmente usados (probablemente `400` + `700`, ambos estilos) — el spec de `performance-optimizer §2` lo pide explícito ("only load what you use"). Considerar `weight: "variable"` con axis explícito (aprendizaje de La Nonna en global-memory: variable font metric-matched, no estáticos discretos). Ningún `preload`/`display` está configurado: `next/font` aplica `display: swap` por defecto (bien, CLS 0 lo confirma), pero conviene fijarlo explícito.
**Impacto estimado:** −30 a −60 KB de woff2 servidos · menos competencia de red en el LCP.

### P-08 · MEDIUM — 42 JPEG de producto sin optimizar en `public/fresas/`
`public/fresas/` contiene 42 JPEG (14 magnum + 14 dream + 14 variedad1525), peso medio ~280 KB, picos de 407 KB (`variedad1525-05.jpeg`). **El pipeline de Next funciona correctamente** — Lighthouse confirma que las imágenes se sirven vía `/_next/image` en AVIF a 103/95/30 KB en lugar del JPEG crudo, gracias a `formats:["avif","webp"]` (Fase 4.5) y al `sizes` correcto en `ProductCarousel`. Sin embargo:
- Solo 12 de los 42 se referencian (`PRODUCTS_BASE` usa 4 imágenes × 3 productos); **30 JPEG son peso muerto en el repo** (no afectan runtime, sí el tamaño del repo/deploy).
- Los JPEG fuente sin comprimir hacen que la **primera optimización** de cada imagen en Vercel sea más lenta y cara (la transformación AVIF parte de un original de 280-400 KB).
**Recomendación:** pre-comprimir los 12 JPEG usados a ~80-85% calidad / mximo 1600px antes de subir (el optimizador parte de un original más liviano); mover o borrar los 30 no usados; `quality={85}` explícito en los `<Image>` de producto (hoy heredan el default 75 — aceptable, pero el spec recomienda 85 como punto dulce).
**Impacto estimado:** repo/deploy más ligero · primera transformación AVIF más rápida (no afecta CWV en visitas calientes).

### P-09 · MEDIUM — `Fotos Fresas.zip` (12 MB) servido como asset estático público
`public/Fotos Fresas.zip` pesa **12.152.108 bytes**. Todo lo que está en `public/` es servible: cualquiera puede descargar `https://yayamariana.es/Fotos%20Fresas.zip`. No afecta a las CWV (no se enlaza), pero es 12 MB innecesarios en el bundle de deploy y una fuga de assets crudos.
**Recomendación:** sacar el ZIP de `public/` (moverlo fuera del repo o a `docs/` no servible). Limpieza, no rendimiento de runtime — pero trivial y debe hacerse antes del deploy.

---

## 3. Lo que ya está bien (no tocar)

- **CLS = 0 perfecto.** `next/font` con `display:swap` + `adjustFontFallback`, `<Image>` con `width/height` o `fill` sobre contenedor dimensionado, `100dvh` en el Hero (Fase 4.5 TANDA 4), Hero con `min-h` reservado. Cero layout shift — excelente.
- **Pipeline de imágenes correcto.** `formats:["avif","webp"]`, `localPatterns`, `sizes` responsivo en `ProductCarousel`, `priority` solo en la 1ª imagen del 1er producto (LCP candidate) y en el logo del nav. `remotePatterns` legacy retirado. Cero `<img>` crudos en todo `src/`.
- **Best Practices 100 / SEO 100.** Sin mixed content, HTTPS-ready, metadatos correctos, `<title>`/`description` de fresas, un solo `<h1>`, `<main>` + skip-link, `<html lang>` dinámico.
- **Server response 10 ms**, rutas `/` y `/checkout` prerenderizadas como `○ Static`. API de Stripe correctamente dinámica.
- `reducedMotion="user"` global vía `MotionConfig` + gating individual de count-up/auto-rotate/badge — el motion respeta la preferencia del SO.
- Build verde: `tsc` 0 errores, `next build` OK, 6 rutas generadas.

---

## 4. CWV objetivo vs estado · Presupuestos de rendimiento

### Core Web Vitals — objetivo vs medido

| Métrica | Medido (lab) | Objetivo "Good" | Gap | Palanca principal |
|---|---|---|---|---|
| LCP | ~4.0-4.3 s | ≤ 2.5 s | **−1.5 a −1.8 s** | P-01 (shader) + P-02 (gate opacidad) + P-04 (RSC) |
| TBT (≈INP lab) | ~530-700 ms | ≤ 200 ms | **−330 a −500 ms** | P-01 + P-03 + P-04 + P-05 |
| CLS | 0 | ≤ 0.1 | ✅ cumplido | — |
| FCP | 1.4 s | ≤ 1.8 s | ✅ cumplido | — |
| Speed Index | ~5.0-5.1 s | ≤ 3.4 s | **−1.6 a −1.7 s** | derivado de LCP/TBT |

### Presupuestos de rendimiento propuestos (post-fix, ruta `/`)

| Recurso | Estado actual | Presupuesto propuesto | Notas |
|---|---|---|---|
| **JS first-load (gzip)** | ~262 KB total / chunk principal 66 KB | **≤ 160 KB** | tras quitar shader (−66 KB) + tree-shaking + RSC |
| **CSS (gzip)** | 13 KB (80 KB raw) | ≤ 20 KB | ya en presupuesto — Tailwind v4 purga bien |
| **Fuentes (transfer, 1ª carga)** | ~124 KB / 3 woff2 | **≤ 80 KB** | reducir pesos Playfair (P-07) |
| **Imagen above-the-fold** | Hero = bloque tipográfico, 0 imágenes | **≤ 0 KB** (Hero sin foto) | Path T tipográfico — ventaja real; mantener |
| **1ª imagen de producto (AVIF, 750w)** | ~103 KB | ≤ 90 KB | pre-comprimir fuente (P-08) |
| **Total byte weight (home)** | 644 KB | ≤ 450 KB | |
| **Lighthouse Performance** | ~67 | **≥ 90** | objetivo de la fase |
| **LCP / TBT / CLS** | 4.1 s / 615 ms / 0 | ≤ 2.5 s / ≤ 200 ms / ≤ 0.1 | |

### Proyección post-fix (estimada, marcada como estimación)

Aplicando P-01 (shader→CSS) + P-04 (RSC en componentes estáticos) + P-05/P-10 (tree-shaking) + P-07 (fuentes):
**Performance proyectada ~88-94 · LCP ~2.2-2.6 s · TBT ~150-250 ms.** P-01 sola vale ~+12-18 puntos y es la de mejor coste/beneficio. Es una **estimación razonada**, no medida — se confirmará re-ejecutando Lighthouse tras los fixes.

---

## 5. Plan de remediación recomendado (orden por impacto/esfuerzo) — para Fase 6, NO aplicado

1. **P-01** — Sustituir `MeshGradient` WebGL por gradiente CSS. *(Mayor impacto. Cambio de Hero → confirmación de Nil; el efecto visual es equivalente.)*
2. **P-05 + P-10** — Añadir `experimental.optimizePackageImports: ['framer-motion','lucide-react']` en `next.config.ts`; eliminar `lucide-react` si es import muerto.
3. **P-02** — Quitar el gate de `opacity:0` en el contenido LCP above-the-fold del Hero.
4. **P-04** — Migrar la i18n a server (segmento `[lang]`) para que `Values`/`Footer`/`AboutUs`/cabeceras sean RSC. *(Cambio de arquitectura → confirmación de Nil.)*
5. **P-07** — Reducir Playfair a 400/700 (o variable) en `layout.tsx`.
6. **P-06** — Verificar con bundle-analyzer que Stripe no entra en el first-load de `/`; preconnect a Stripe en `/checkout`.
7. **P-08 + P-09** — Pre-comprimir los 12 JPEG usados; borrar los 30 sin usar; sacar el ZIP de 12 MB de `public/`.
8. **P-11 / P-12** — Contraste del botón Hero y `heading-order` del footer (cruzan con accessibility-perfectionist; perf solo los flaggea).
9. **P-13 / P-14** — Instalar `@next/bundle-analyzer` y `@vercel/speed-insights` para medición continua (lab + field/CrUX).

> Notas de modo AUDIT: no se ha modificado ningún archivo de `src/`, `next.config.ts`, `package.json` ni `public/`. El servidor `next start` arrancado para Lighthouse fue **detenido** al terminar; los JSON temporales de Lighthouse fueron borrados. Build artefacto `.next/` queda como subproducto del build (no commiteable, ya en `.gitignore`).

---

## 6. Metodología del baseline

- `npm run build` — verde, Next 16.2.4 Turbopack, `tsc` 0 errores, 6 rutas (`/`, `/checkout` estáticas; `/api/create-payment-intent` dinámica).
- `npx next start -p 3000` en background — `/` y `/checkout` respondieron HTTP 200.
- `npx lighthouse@latest http://localhost:3000 --only-categories=performance,accessibility,best-practices,seo --output=json --chrome-flags="--headless=new --no-sandbox --disable-gpu"` — **2 pasadas**. Chrome de sistema disponible (`C:\Program Files\Google\Chrome`). Lighthouse emitió un `EPERM` al limpiar su tmpdir **después** de escribir el reporte — los JSON se generaron y leyeron correctamente; el error de cleanup no invalida las métricas.
- Análisis estático de bundle sobre `.next/static/chunks` (tamaños raw + gzip), fingerprint de chunks, `node_modules` de las dependencias pesadas.
- Baseline **MEDIDO en vivo**, no estimado. Las únicas cifras marcadas como estimación son las proyecciones post-fix de la §4.
