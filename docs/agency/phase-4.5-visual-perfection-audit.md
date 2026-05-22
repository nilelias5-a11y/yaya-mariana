# Fase 4.5 — Auditoría QA Visual · Yaya Mariana
## Entregable del agente `visual-perfection` — Award-Grade Visual Auditor & Delivery Gate

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE
**Rama:** `clasico` · **Modo:** AUDIT (cero archivos de código tocados)
**Dirección visual:** B "En su Punto" · rojo A `#962a1f` sobre cream `#fdf6f5`
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page + `/checkout`
**Iteración:** 1 de 3 · **Fecha:** 2026-05-22
**Auditor:** `visual-perfection` · Rúbrica de 7 criterios · Umbral 8.5/10

---

## ⚑ RESUMEN EJECUTIVO — VEREDICTO

> **GLOBAL: 5.4 / 10 — FAIL. Entrega BLOQUEADA.**

**Hallazgo estructural decisivo (un solo CRITICAL que define la auditoría):** la Fase 3 produjo un design system completo y correcto — `globals.css` está tokenizado al 100% según el spec del `design-system-manager` (3 niveles, 9 fallos WCAG resueltos a nivel de token, G-1 opacidad-prohibida, reduced-motion añadido). **Pero ese sistema NUNCA se aplicó a los componentes.** Los 11 `.tsx` siguen exactamente como antes de Fase 3: hardcodean 50+ literales hex, usan opacidad sobre texto en 30+ nodos, y conservan gradientes rojo→naranja, sombras teñidas y motion de anuncio. `globals.css` y los componentes son **dos universos desconectados**: el sistema existe en CSS pero el build no lo consume.

Consecuencia directa: **los 9 fallos WCAG AA documentados (H-1…H-9) siguen TODOS vivos en el build.** El contrato de handoff de Fase 3 hacia `frontend-developer` ("cero hex en componentes, retirar opacidad de texto") no se ejecutó. Esto es un CRITICAL de a11y + token-coherence que, por la regla de scoring, **capa el global a 6.0** — y el resto de defectos lo bajan a 5.4.

Sobre la queja nº1 de Nil — *«la web se ve junta, mal distribuida, las cosas no están bien colocadas»* — el diagnóstico es **CONFIRMADO y tiene causa concreta**: el spec de Fase 3 §5 definió un sistema de spacing base-4 con ritmo de sección `--space-20` (80px) desktop / `--space-16` tablet / `--space-12` móvil, container tokenizado y gutters por breakpoint. **Nada de eso se aplicó.** Cada sección hardcodea su propio `py-20 px-6` / `py-14 px-6` sin escalado responsive, sin token, sin contenedor común. El padding lateral es `px-6` (24px) plano en TODOS los viewports — en desktop 1440px el contenido respira mal, y el ritmo vertical entre secciones es irregular (StatsStrip `py-14`=56px frente a las demás `py-20`=80px). La sensación de "junta y mal distribuida" es un síntoma real de un sistema de spacing especificado pero no implementado.

**Conteo de defectos:** 3 CRITICAL · 11 HIGH · 14 MEDIUM · 9 LOW = **37 defectos**.

---

## METODOLOGÍA

Auditoría **estática** (dev server apagado por diseño): análisis de código, clases Tailwind, valores inline, tokens CSS. Cada sección puntúa 0–10 contra los 7 criterios de la rúbrica (Spacing, Hierarchy, Contrast, Motion, Hover/interaction, Mobile, Token coherence), ponderados por impacto. Comparación contra el promedio Awwwards del nicho food/DTC artesanal en registro warm-editorial restraint (referencias del `comparison-engine-memory`: Le Fruit Studio, Aesop, Buly 1803, Farm Minerals; nicho food SOTD ~8.6). El global NO es media: un CRITICAL capa a 6.0.

**Decisiones del director que NO se marcan como defecto** (auditadas dentro de su intención): Path T tipográfico del Hero (no foto), image-slots sin radius, drawer slide-in conservado, CTAs demo no funcionales, badge variedad sustituyendo "Premium", filtro reetiquetado por variedad, tono tributo (restraint tonal).

---

## Visual Audit — Hero (incl. Nav + Nav móvil)

**Section Score: 5.8 / 10**  ·  Peso: ALTO (hero — primer impacto, regla 3 segundos)

**Defects detected:**
- `[CRITICAL]` Token-coherence colapsa — `hero.tsx` no consume el design system — todo el componente — el spec de Fase 3 mandó "cero hex en componentes". El Hero hardcodea `#962a1f`, `#7a1f17`, `#1a0808`, `#7a4a42`, `#f0d0d0`, `#fff5f5`, `#f0e0e0`, `#c8b8b8`, `#d8b0b0` como literales inline. `globals.css` define `--color-brand-primary`, `--color-text-primary` etc. y el Hero los ignora por completo. Falla G-1/G-2/G-3 simultáneamente.
- `[HIGH]` Motion de anuncio, no de tributo — botón "Ver fresas" y CTA nav — `whileHover` aplica `scale:1.04` + `boxShadow` glow de 24px (`rgba(150,42,31,0.4)`) + flecha deslizante `x:0→4` con opacidad. El `ui-designer-spec §3.1` lo prohíbe explícitamente: "sin scale, sin glow, sin flecha deslizante". Esto es exactamente el "anuncio de Instagram" que el brief marca como error tonal.
- `[HIGH]` Nav-link hover sube `y:-2` y cambia color — `<ul>` central — el `ui-designer-spec §3.12` ordena "se elimina el `y:-2` y el cambio de color"; solo el subrayado `scaleX` debe señalar el hover. El build conserva ambos.
- `[HIGH]` Entrada de columna con `x:-40` — columna izquierda — `motion.div initial={{x:-40}}`. El spec §4 manda distancia uniforme 12–16px y "elimina entrada x:±40 de columnas". 40px lee como movimiento amplio = anuncio.
- `[MEDIUM]` MeshGradient con 5 colores fuera de paleta — `colors=["#f5d0c8","#e8a090","#f0b8a8","#ffd0c0","#e89888"]` — conflicto DSM-1/C-deco diferido a esta fase. La disciplina 2-color de Dirección B (un rojo + un neutro cálido + canvas) se rompe con 5 rosas-melocotón decorativos. Bajo reduced-motion el shader se congela (`speed:0`) — correcto — pero el degradado sigue siendo cromáticamente ajeno al sistema.
- `[MEDIUM]` Fondo de sección `#fff5f5` ≠ token canvas — `<section>` — el canvas del sistema es `--color-bg-base #fdf6f5`. El Hero pinta `#fff5f5`, un cuarto cream no tokenizado (G-4: un valor que difiere del canvas sin razón es drift de paleta).
- `[MEDIUM]` Ritmo vertical del Hero off-grid — `pt-16 pb-20` (64/80px) — no usa `--space-section-gap`; el `pt-16` rompe con el `py-20` del resto de secciones. La línea decorativa usa `my-6` y `mb-5` mezclados — spacing ad-hoc.
- `[LOW]` `borderRadius` del CTA nav inline `8` correcto pero hardcodeado — debería ser `--radius-button`.
- `[LOW]` Eyebrow `letterSpacing:"0.22em"` — el token `.text-overline` usa `0.18em`. Drift menor de escala tipográfica.
- `[LOW]` Hamburguesa: sin focus-trap ni cierre con `Esc` — el `ui-designer-spec §3.13` los exige; el panel solo cierra al pulsar un ítem. (a11y — coordinar con `accessibility-perfectionist`.)

**Benchmark comparison:** "Hero 5.8 vs food/DTC artesanal Awwwards average 8.6 — el layout 55/45, la entrada por la cita Playfair italic y el bloque tipográfico de variedades están al nivel del benchmark conceptualmente; el gap es de ejecución: motion de anuncio (scale+glow+flecha) y paleta hardcodeada rompen el restraint museístico que sitios como Le Fruit Studio sostienen con disciplina absoluta de hover." (refs: Le Fruit Studio, Aesop, Farm Minerals)

**Required fixes (prioritized for iteration-agent):**
1. `[CRITICAL]` Sustituir TODOS los literales hex de `hero.tsx` por tokens Nivel 2 (`--color-brand-primary`, `--color-text-primary`, `--color-bg-base`, `--color-border-subtle`). Eliminar `style={{color:"#..."}}` inline; usar clases utilitarias o `var()`.
2. `[HIGH]` Botones Hero/Nav: eliminar `scale`, `boxShadow` glow y la flecha deslizante. Hover = solo cambio de `background` a `--color-brand-pressed` con `--duration-fast`. Estado target: `ui-designer-spec §3.1`.
3. `[HIGH]` Nav-links: eliminar `y:-2` y `color` del `whileHover`; conservar solo el subrayado `scaleX:0→1` desde la izquierda.
4. `[HIGH]` Entrada de columna izquierda: cambiar `x:-40` por fade-up `translateY` 12–16px, stagger 80–100ms (eyebrow→h1→variedades→CTAs).
5. `[MEDIUM]` MeshGradient: reducir a degradado de marca dentro de la disciplina 2-color (tonos derivados de `--strawberry-*`/`--cream-*`) o sustituir por cream plano `--color-bg-base`. Gatear bajo reduced-motion ya está hecho.
6. `[MEDIUM]` Fondo de sección → `--color-bg-base`. Ritmo vertical → `--space-section-gap`.

**Status: FAIL**

---

## Visual Audit — StatsStrip

**Section Score: 5.5 / 10**  ·  Peso: MEDIO

**Defects detected:**
- `[HIGH]` Label en `text-white/65` — opacidad sobre texto — `<span className="text-sm text-white/65">`. Viola la regla dura G-1 categóricamente (es el fallo H-1 documentado, marcado en el spec de Fase 3 como resuelto vía `--color-text-on-deep` sólido — no se aplicó). El texto secundario debe ser un token SÓLIDO.
- `[HIGH]` Count-up a 1400ms, no 2200ms — `AnimatedValue` `duration=1400` — el `ui-designer-spec §4` mandó "countup 2200ms (hoy 1400ms — lento lee como calma)". Sigue a 1400ms; lee como rápido/comercial, no como reposo.
- `[MEDIUM]` Color del icono `#b5341f` hardcodeado — `text-[#b5341f]` — debería ser token; además `#b5341f` es `brand-hover`, no el rojo de marca para iconos decorativos.
- `[MEDIUM]` Fondo `#5c1a1a` hardcodeado — `bg-[#5c1a1a]` — existe `--color-bg-deep`. Token-coherence.
- `[MEDIUM]` Ritmo de sección roto — `py-14` (56px) — todas las demás secciones usan `py-20` (80px). La banda oscura queda visiblemente más comprimida que sus vecinas; contribuye directamente a la queja "mal distribuida" de Nil.
- `[LOW]` Cifra `text-[2.6rem]` arbitraria — fuera de la escala tipográfica tokenizada (`--fs-*`). El spec admitía ~2.6rem pero pide que sea token, no literal.
- `[LOW]` Gap `gap-y-10 gap-x-6` — mezcla 40px/24px sin mapear a `--space-*`.

**Benchmark comparison:** "StatsStrip 5.5 vs food/DTC Awwwards average 8.5 — la banda oscura como quiebre de ritmo es una decisión correcta y al nivel del benchmark; el gap es el `text-white/65` (fallo de contraste AA real en el build) y el count-up demasiado rápido. Un benchmark restraint cuenta despacio: el número se asienta, no salta." (refs: Farm Minerals, Aesop)

**Required fixes (prioritized for iteration-agent):**
1. `[HIGH]` Label: `text-white/65` → `--color-text-on-deep` sólido (cierra H-1). Cero opacidad sobre texto.
2. `[HIGH]` `AnimatedValue`: `duration` 1400 → 2200ms.
3. `[MEDIUM]` `bg-[#5c1a1a]` → `--color-bg-deep`; icono → `--color-brand-primary` tokenizado.
4. `[MEDIUM]` `py-14` → `--space-section-gap` para alinear el ritmo vertical con las demás secciones.

**Status: FAIL**

---

## Visual Audit — Products

**Section Score: 6.2 / 10**  ·  Peso: ALTO (sección de conversión primaria + la más fuerte del build)

**Defects detected:**
- `[HIGH]` Descripción de producto en `text-[#7a3a3a]/65` — opacidad sobre texto — `<p className="text-sm text-[#7a3a3a]/65">`. Fallo H-1 vivo. Además `#7a3a3a` no es ni siquiera un primitivo del sistema (los tokens de tinta son `#5a2a2a`/`#6e3232`). Doble fallo: opacidad + color fuera de paleta.
- `[HIGH]` "/500g" en `text-[#7a3a3a]/50` y subtítulo en `/65` — opacidad sobre texto — fallos H-4/H-1. El spec los marca resueltos vía `--color-text-muted` sólido.
- `[HIGH]` Link "Ver más" en `text-[#962a1f]/70` — opacidad sobre texto — fallo H-6 exacto (`text-[#c0392b]/70` → `--color-brand-primary` sólido). El color base cambió de `#c0392b` a `#962a1f` pero la opacidad `/70` sigue ahí: AA falla.
- `[HIGH]` Botón "Añadir" con gradiente rojo→naranja — `background:"linear-gradient(125deg,#962a1f,#b5341f)"` — el `ui-designer-spec §3.1` mandó "reemplaza el gradiente por rojo plano `--color-brand-primary`". Vivo.
- `[HIGH]` Estado "Añadido" usa `bg-green-500` puro — verde fuera de paleta (C-green) — el sistema define `--color-success #15803d`. `bg-green-500` (#22c55e) no es ese token. El spec lo marca diferido a esta fase para corregir.
- `[HIGH]` Shine del badge con `repeat:Infinity` — `motion.span animate={{x:[-24,90]}} repeat:Infinity` — el `ui-designer-spec §3.6` manda "shine UNA sola vez al entrar en viewport (hoy repeat:Infinity)". Un brillo en loop infinito es el patrón de anuncio más explícito del build; rompe el restraint tonal del sitio tributo. Además `ease:"linear"` está prohibido por el sistema de motion.
- `[MEDIUM]` Card entra con `y:56` — `initial={{y:56}}` — el spec manda 12–16px. 56px = movimiento de anuncio.
- `[MEDIUM]` Hover de card `y:-8` + sombra roja gigante — `whileHover={{y:-8, boxShadow:"0 28px 64px rgba(150,42,31,0.17)..."}}` — el `ui-designer-spec §3.14` manda lift discreto `translateY(-4px)` + sombra NEUTRA. El build conserva `y:-8` y la sombra teñida de rojo.
- `[MEDIUM]` Sombras de card teñidas de rojo — `boxShadow:"0 2px 18px rgba(150,42,31,0.07)..."` — el spec §6 corrige "las sombras teñidas de rojo que eran decoración" → `--shadow-card` neutro. No aplicado.
- `[MEDIUM]` Línea de acento inferior con gradiente 3-stop rojo→naranja — `background:"linear-gradient(90deg,#962a1f,#b5341f,#962a1f)"` — debería ser rojo plano.
- `[MEDIUM]` Parallax del carousel usa `type:"spring"` — `transition={{type:"spring",stiffness:110,damping:22}}` — el `ui-designer-spec §4` prohíbe spring/bounce categóricamente: "el type:spring del drawer y el parallax → ease-out con duración".
- `[MEDIUM]` Borde de card `border-[#f5c6c2]/50` — opacidad sobre borde + color fuera de paleta — `#f5c6c2` no es token; el divisor debe ser `--color-border-subtle`.
- `[MEDIUM]` Patrón de puntos de fondo `rgba(150,42,31,0.10)` — decoración fuera de la disciplina 2-color (DSM-1/C-deco). Compite con la fruta por la atención cromática.
- `[LOW]` Eyebrow/header con literales hex `#962a1f`, `#1a0808` — token-coherence.
- `[LOW]` Filtro: `border-[#962a1f]/30` y `bg-white/60` — opacidad sobre borde/superficie; tolerable (no es texto) pero es drift.

**Benchmark comparison:** "Products 6.2 vs food/DTC Awwwards average 8.7 — la sección con mejor arquitectura del build (carousel sólido, grid responsive 1/2/3-col, controles de cantidad, chip de trazabilidad bien resuelto como footnote); pierde 2.5 puntos enteros en ejecución de superficie: gradientes naranja, sombras rojas, shine infinito y verde fuera de paleta son ruido visual que un benchmark food restraint nunca permite. La fruta debería ser lo único saturado en pantalla." (refs: Le Fruit Studio, Farm Minerals)

**Required fixes (prioritized for iteration-agent):**
1. `[HIGH]` Toda la tipografía con opacidad → tokens sólidos: descripción/subtítulo → `--color-text-secondary`; "/500g" → `--color-text-muted`; "Ver más" → `--color-brand-primary` (cierra H-1, H-4, H-6).
2. `[HIGH]` Botón "Añadir" y línea de acento: gradiente → `--color-brand-primary` plano. Estado "Añadido": `bg-green-500` → `--color-success`.
3. `[HIGH]` Shine del badge: `repeat:Infinity` → una sola pasada al entrar en viewport; `ease:"linear"` → `--easing-default`. Omitir bajo reduced-motion.
4. `[MEDIUM]` Card: `initial y:56` → 12–16px; `whileHover y:-8` → `-4px`; sombras teñidas → `--shadow-card`/`--shadow-card-raised` neutras.
5. `[MEDIUM]` Parallax: `type:"spring"` → `ease-out` con duración. Borde → `--color-border-subtle`.
6. `[MEDIUM]` Evaluar retirar el patrón de puntos de fondo (DSM-1) — recomendado: retirar, recupera la disciplina 2-color.

**Status: FAIL**

---

## Visual Audit — AboutUs

**Section Score: 7.4 / 10**  ·  Peso: ALTO (único slot de tributo — Capa B — peso tonal máximo)

**Defects detected:**
- `[HIGH]` Entrada con `x:-60` — `motion.div initial={{x:-60}}` — el `ui-designer-spec §4` manda "elimina x:-60 → fade-up sutil 12–16px". 60px de barrido lateral es el movimiento más amplio del sitio en su sección más solemne — choque tonal directo con el registro homenaje.
- `[MEDIUM]` Botón "Ver tienda" con `scale:1.06` + glow — `whileHover={{scale:1.06, boxShadow:"0 8px 24px..."}}` — prohibido por §3.1 (sin scale, sin glow). En la sección de tributo, un botón que "salta" es especialmente disonante.
- `[LOW]` Esta sección SÍ usa tokens (`var(--color-brand-primary)`, `var(--color-text-secondary)`) — es la única que consume el design system. Buena referencia de cómo deben quedar las demás. El único hex residual está en el `rgba(150,42,31,0.35)` del `boxShadow` del hover (que se elimina con el fix anterior).
- `[LOW]` Slot de retrato (tipográfico "Mariana", fallback correcto — NUNCA IA) bien resuelto; placement inline junto al blockquote es el menor cambio de layout, conforme. Sin `aspect-ratio` reservado explícito en el slot — anti-CLS recomendado cuando llegue la foto familiar.

**Benchmark comparison:** "AboutUs 7.4 vs food/DTC Awwwards average 8.5 — la sección mejor ejecutada del build: usa tokens, contenedor 720px centrado, blockquote con tratamiento Playfair italic digno, slot de tributo resuelto con restraint. El gap es estrecho y enteramente de motion (x:-60 + scale del botón). Corregido el motion, esta sección entra en rango de aprobación." (refs: Aesop, Buly 1803)

**Required fixes (prioritized for iteration-agent):**
1. `[HIGH]` Entrada: `x:-60` → fade-up `translateY` 12–16px, una sola entrada.
2. `[MEDIUM]` Botón "Ver tienda": eliminar `scale:1.06` y `boxShadow` glow; hover = cambio de `background` a `--color-brand-pressed`.
3. `[LOW]` Reservar `aspect-ratio` en el slot de retrato (anti-CLS para el swap de foto familiar).

**Status: FAIL** (por motion; estructuralmente la más cercana a PASS)

---

## Visual Audit — Values

**Section Score: 6.6 / 10**  ·  Peso: MEDIO  ·  Veredicto Fase 2.5: MANTENER

**Defects detected:**
- `[HIGH]` Descripción de card y subtítulo en `text-[#7a3a3a]/65` — opacidad sobre texto — fallo H-1 vivo. `#7a3a3a` fuera de paleta.
- `[MEDIUM]` Entrada con `y:60` + `scale:0.92` — `initial={{y:60,scale:0.92}}` — el `ui-designer-spec §4` manda "elimina scale:0.92" y distancia 12–16px. Un `scale` de entrada es pop = anuncio.
- `[MEDIUM]` Icono con `rotate-[10deg]` en hover — `group-hover:rotate-[10deg]` — el spec §4 y la Fase 2.5 (veredicto MANTENER) piden "suavizar el rotate-[10deg] juguetón". Una rotación juguetona contradice el registro sobrio.
- `[MEDIUM]` Hover de card `y:-6` + sombra roja `rgba(150,42,31,0.18)` — debería ser `-4px` + sombra neutra `--shadow-card-raised`.
- `[LOW]` Iconos SVG con `stroke="#962a1f"` hardcodeado en el array `ICONS` — token-coherence (debería ser `currentColor` + color tokenizado en el contenedor).
- `[LOW]` Fondo `bg-[#fdf0ef]` y textos `#1a0808` hardcodeados — drift; existe `--color-bg-subtle`.

**Benchmark comparison:** "Values 6.6 vs food/DTC Awwwards average 8.4 — grid 6-card limpio, iconos sobrios y bien dibujados, registro correcto; la Fase 2.5 acertó al marcarla MANTENER. El gap es opacidad-sobre-texto (fallo AA) + micro-motion juguetón (scale de entrada, rotación de icono) que un sitio tributo no se puede permitir." (refs: Farm Minerals)

**Required fixes (prioritized for iteration-agent):**
1. `[HIGH]` Descripción y subtítulo: `text-[#7a3a3a]/65` → `--color-text-secondary` sólido (cierra H-1).
2. `[MEDIUM]` Entrada: quitar `scale:0.92`, `y:60` → 12–16px. Hover de card: `y:-6` → `-4px`, sombra → `--shadow-card-raised` neutra.
3. `[MEDIUM]` Icono: retirar `rotate-[10deg]`; conservar como mucho un `scale-105` muy leve o nada.
4. `[LOW]` Iconos `stroke` → `currentColor` con color tokenizado; fondo/textos → tokens.

**Status: FAIL**

---

## Visual Audit — CTA

**Section Score: 4.9 / 10**  ·  Peso: ALTO (sección de conversión)

**Defects detected:**
- `[HIGH]` Subtítulo en `text-white/70`, cold-chain en `/55`, trust badges en `/60`, consent en `/65` — opacidad sobre texto, 4 nodos — viola G-1 categóricamente. El spec de Fase 3 §"Values/CTA/Footer" lo marca explícitamente: "CTA banda oscura: subtítulo text-white/70 → token sólido (G-1 es categórico)". Nada aplicado.
- `[HIGH]` H2 entra con `scale:0.85` — `motion.h2 initial={{scale:0.85}}` — el `ui-designer-spec §4` manda "elimina scale:0.85 del <h2>". Un titular que crece desde 85% es pop puro — el anti-patrón tonal nº1 para un sitio tributo.
- `[HIGH]` Subtítulo entra con `y:40` — distancia 40px, el spec manda 12–16px.
- `[HIGH]` Fondo de sección con gradiente 3-stop — `background:"linear-gradient(135deg,#5c1a1a,#962a1f,#7a1f17)"` — DSM-1/C-deco. La banda CTA debería ser una superficie sólida (`--color-bg-deep` o el rojo de marca plano); un gradiente diagonal de 3 paradas es decoración que rompe la disciplina 2-color.
- `[MEDIUM]` Trust badges con icono estrella — el icono `#b5341f` y la forma estrella; el spec §3.8 manda retirar `#e74c3c` → marca. El color cambió pero sigue hardcodeado.
- `[MEDIUM]` Botón "Comprar" con `scale:1.04` + glow — prohibido §3.1.
- `[MEDIUM]` Input off-season `rounded-full` con `placeholder:text-[#b08a8a]` — placeholder hardcodeado fuera de paleta; el radius pill del input contradice `--radius-input` (12px) del sistema.
- `[MEDIUM]` Eyebrow `text-[#f5c6c2]` y `em` del H2 `text-[#f5c6c2]` — `#f5c6c2` no es token; es un rosa pálido fuera de los 3 niveles. Sobre el rojo del gradiente su contraste es bajo.
- `[LOW]` Todos los literales hex (`#962a1f`, `#5c1a1a`, `#7a1f17`, `#f5c6c2`, `#b08a8a`) — token-coherence.
- `[LOW]` Checkbox de consent: `accent-[#962a1f]` hardcodeado; sin estado focus visible diseñado más allá del default del navegador.

**Benchmark comparison:** "CTA 4.9 vs food/DTC Awwwards average 8.6 — la sección más débil del sitio. Acumula opacidad-sobre-texto en 4 nodos (fallo AA), el `scale:0.85` del H2 (pop prohibido), gradiente decorativo 3-stop y color fuera de paleta. La variante off-season (captura de email, consent unticked) está bien concebida estructuralmente, pero la ejecución visual está un tier y medio por debajo del benchmark — un CTA restraint de nicho food es una superficie sólida con un titular que aparece, no que crece." (refs: Aesop, Le Fruit Studio)

**Required fixes (prioritized for iteration-agent):**
1. `[HIGH]` Los 4 nodos de texto con opacidad → tokens sólidos (`--color-text-on-deep` para texto sobre fondo oscuro). Cierra el fallo G-1 en CTA.
2. `[HIGH]` H2: eliminar `scale:0.85` de la entrada → fade-up 12–16px. Subtítulo: `y:40` → 12–16px.
3. `[HIGH]` Fondo: gradiente 3-stop → superficie sólida (`--color-bg-deep` o `--color-brand-primary`).
4. `[MEDIUM]` Botón "Comprar": quitar `scale`+glow. Input off-season: radius `--radius-input`, placeholder → `--color-text-muted`.
5. `[MEDIUM]` Eyebrow/`em`: `#f5c6c2` → token con contraste verificado sobre el fondo final.

**Status: FAIL**

---

## Visual Audit — Contact

**Section Score: 5.3 / 10**  ·  Peso: MEDIO-ALTO

**Defects detected:**
- `[CRITICAL]` Cadena de fallos AA en el formulario — opacidad sobre texto — labels en `text-[#7a3a3a]/60` (fallo H-3, 3.02:1 documentado), placeholders en `placeholder:text-[#7a3a3a]/35` (fallo H-5, 1.81–2.24:1 — muy por debajo de AA), texto introducido en `text-[#7a3a3a]` (color fuera de paleta), subtítulo y "label de contacto" en `/65` y `/50`. El spec de Fase 3 §4 documenta este formulario como el caso con MÁS fallos AA y los marca resueltos vía decisión #4 + tokens sólidos. **Cero aplicado.** Es el bloque de mayor densidad de fallo de contraste del sitio → CRITICAL.
- `[HIGH]` Entrada de columnas con `x:-80` / `x:+80` — `motion.div initial={{x:-80}}` y `{{x:80}}` — la distancia más amplia de todo el build (el spec manda 12–16px). 80px de barrido lateral.
- `[HIGH]` `FocusField` escala el campo `scale:1.01` en focus — `animate={{scale:focused?1.01:1}}` — el `ui-designer-spec §3.4` y la decisión menor del gate ordenan "el scale:1.01 del FocusField se reduce a 0 — solo el ring de marca señala el foco". Vivo.
- `[MEDIUM]` Botón submit con gradiente rojo→naranja — `background:"linear-gradient(135deg,#962a1f,#b5341f)"` — debe ser `--color-brand-primary` plano.
- `[MEDIUM]` Borde de input `border-[#d8b8b4]` y focus ring `ring-[#b5341f]/40` hardcodeados — `#d8b8b4` coincide con `--color-border-default` pero como literal; el ring debería ser el del sistema.
- `[MEDIUM]` Iconos de contacto en contenedor `bg-[#fdf0ef]` con `text-[#962a1f]` — hardcodeado.
- `[LOW]` El estado de éxito ya usa SVG checkmark (no emoji) — H-8/C-emoji correctamente resuelto. Buen punto.
- `[LOW]` Todos los literales hex de la sección — token-coherence.

**Benchmark comparison:** "Contact 5.3 vs food/DTC Awwwards average 8.4 — layout 2-col info+form correcto, iconos limpios, éxito sin emoji bien resuelto. El gap es severo y se concentra en el formulario: placeholders a 1.8:1 de contraste son ilegibles — un fallo AA flagrante que ningún benchmark tolera — más el barrido `x:±80` y el campo que escala en focus. Es funcionalmente un formulario de 2019 con el design system de 2026 sin conectar." (refs: Aesop)

**Required fixes (prioritized for iteration-agent):**
1. `[CRITICAL]` Reescribir todo el color del formulario con tokens sólidos: labels → `--color-text-secondary`; placeholders → `--color-text-muted`; texto introducido → `--color-text-primary`; subtítulo/label-contacto → `--color-text-secondary`/`-muted`. Cierra H-1, H-3, H-5.
2. `[HIGH]` Entrada de columnas: `x:±80` → fade-up 12–16px.
3. `[HIGH]` `FocusField`: `scale:1.01` → 0 (eliminar el `motion.div` de escala; el ring de marca es el único indicador de focus).
4. `[MEDIUM]` Botón submit: gradiente → `--color-brand-primary` plano. Borde/ring de input → tokens del sistema.

**Status: FAIL**

---

## Visual Audit — Footer

**Section Score: 5.1 / 10**  ·  Peso: BAJO-MEDIO

**Defects detected:**
- `[HIGH]` Copyright en `text-white/35` — opacidad sobre texto — fallo H-9 exacto (el hallazgo nuevo de Fase 3: `text-white/35` ~3.5:1 FAIL). Documentado como resuelto vía `--color-text-on-deep` sólido. Vivo en `footer.tsx:165` y `:172`.
- `[HIGH]` Descripción en `text-white/50`, links de nav en `text-white/65`, headings en `text-white/40` — opacidad sobre texto, 4+ nodos — fallos H-1/H-4. `text-white/40` sobre `#2d0a0a` para los headings de columna está por debajo de AA.
- `[MEDIUM]` Links de footer con `whileHover={{x:4, color:"#962a1f"}}` — el hover desplaza el link 4px y cambia a rojo. El desplazamiento es tolerable pero `#962a1f` sobre `#2d0a0a` (footer oscuro) tiene contraste bajo para un estado hover de texto — el hover debería aclarar, no oscurecer-relativo.
- `[MEDIUM]` Logo brand entra con `scale:0.8` — `initial={{scale:0.8}}` — el `ui-designer-spec §4` manda "elimina scale:0.8 del logo". Pop de entrada.
- `[MEDIUM]` Columnas de nav entran con `y:30` — distancia 30px, el spec manda 12–16px.
- `[LOW]` Wordmark "Yaya Mariana" tipográfico (Path T) sustituye correctamente el hot-link al dominio legacy — H-4/C-legacy resuelto. Buen punto. Links legacy → stub `#` — conforme.
- `[LOW]` Línea Capa B "En memoria de Mariana" presente, en `#e8c4bf` italic — color hardcodeado fuera de paleta, pero la decisión tonal es correcta.
- `[LOW]` `bg-[#2d0a0a]` hardcodeado — existe `--color-bg-footer`.

**Benchmark comparison:** "Footer 5.1 vs food/DTC Awwwards average 8.2 — estructura dark 4-col correcta, socials limpios, la línea de tributo discreta es un acierto tonal. El gap es contraste: el copyright a 3.5:1 y los headings a `white/40` son fallos AA reales, exactamente los que Fase 3 documentó y marcó resueltos. Un footer no necesita brillar, pero su texto tiene que ser legible." (refs: Buly 1803, Aesop)

**Required fixes (prioritized for iteration-agent):**
1. `[HIGH]` Copyright `text-white/35` → `--color-text-on-deep` sólido (cierra H-9). Descripción/links/headings con opacidad → tokens sólidos (cierra H-1/H-4).
2. `[MEDIUM]` Logo brand: eliminar `scale:0.8` de la entrada. Columnas: `y:30` → 12–16px.
3. `[MEDIUM]` Hover de links: revisar `color:"#962a1f"` sobre footer oscuro — usar un tono que aclare para mantener contraste en estado hover.
4. `[LOW]` `bg-[#2d0a0a]` → `--color-bg-footer`; "En memoria de Mariana" → token.

**Status: FAIL**

---

## Visual Audit — Cart (drawer + FAB)

**Section Score: 5.6 / 10**  ·  Peso: MEDIO (conversión)

**Defects detected:**
- `[HIGH]` Textos del drawer en opacidad — "500g·precio" `text-[#7a3a3a]/60`, "Eliminar" `text-[#7a3a3a]/40` (1.99:1 documentado), empty-state `/50`, subtotal `/70`, envío `/50` — opacidad sobre texto, 5+ nodos — fallos H-1/H-4. "Eliminar" a 1.99:1 es ilegible.
- `[HIGH]` FAB con gradiente rojo→naranja — `background:"linear-gradient(135deg,#962a1f,#b5341f)"` — el `ui-designer-spec §3.16` manda FAB "bg `--color-brand-primary` plano (hoy gradiente)". Vivo.
- `[HIGH]` Botón checkout con gradiente — `background:"linear-gradient(125deg,#962a1f,#b5341f)"` — debe ser plano.
- `[MEDIUM]` FAB con `whileHover={{scale:1.08}}` — el spec §3.16 manda "Hover: shadow sube, sin scale". `scale:1.08` es el hover más agresivo del sitio.
- `[MEDIUM]` Badge contador entra con `scale:0→1` — correcto que tenga gating, pero el `ui-designer-spec §3.16` lo permite con reduced-motion sin scale; verificar que `useReducedMotion` se lee (no se ve en el componente — el Cart no importa `useReducedMotion`).
- `[MEDIUM]` Drawer con `type:"spring"` — `transition={{type:"spring",stiffness:320,damping:34}}` — el `ui-designer-spec §4` prohíbe spring: "el type:spring del drawer → ease-out con duración". El slide se conserva (correcto, es navegación) pero con easing, no spring.
- `[MEDIUM]` Sin `role="dialog"` + `aria-modal` + focus-trap + `Esc` — M7/C9 — el drawer no es accesible como modal. (Coordinar con `accessibility-perfectionist`; impacta también UX visual de foco.)
- `[MEDIUM]` Bordes `border-[#f5c6c2]/60` — opacidad sobre borde + color fuera de paleta.
- `[LOW]` Todos los literales hex — token-coherence.

**Benchmark comparison:** "Cart 5.6 vs food/DTC Awwwards average 8.5 — el sheet está bien estructurado (FAB ubicado, empty-state, controles de cantidad con tap targets de 44px correctos); el gap es opacidad-sobre-texto a niveles ilegibles ('Eliminar' a 1.99:1), gradientes en FAB y checkout, y un drawer con física spring que rebota — un benchmark restraint mueve el panel con una curva, no con un muelle." (refs: Aesop)

**Required fixes (prioritized for iteration-agent):**
1. `[HIGH]` Todos los textos del drawer con opacidad → tokens sólidos (`--color-text-secondary`/`-muted`). Cierra H-1/H-4.
2. `[HIGH]` FAB y botón checkout: gradiente → `--color-brand-primary` plano.
3. `[MEDIUM]` FAB hover: `scale:1.08` → solo subida de sombra. Drawer: `type:"spring"` → `ease-in-out` con `--duration-normal`.
4. `[MEDIUM]` Añadir `role="dialog"`+`aria-modal`+focus-trap+`Esc`; leer `useReducedMotion` para gatear slide/scale del badge.

**Status: FAIL**

---

## Visual Audit — Checkout (`/checkout`)

**Section Score: 6.0 / 10**  ·  Peso: ALTO (conversión — cierre de transacción)

**Defects detected:**
- `[HIGH]` Texto en opacidad por toda la página — `text-[#7a3a3a]/60` (subtítulos, "Volver", resumen), `/50`, `/40`, `/80`, `/70` — opacidad sobre texto, 10+ nodos — fallos H-1/H-4 replicados en checkout. El spec de Fase 3 lista `checkout.tsx` explícitamente como destino de la decisión #4 y la tokenización.
- `[HIGH]` Inputs con `border-2 border-[#f5c6c2]` — `#f5c6c2` fuera de paleta (no es `--color-border-default #d8b8b4`); contraste de borde insuficiente. El spec resolvió esto con la decisión #4 (fondo blanco + borde `--color-border-default`).
- `[MEDIUM]` Botón "Pagar" y "Volver al inicio" con gradiente rojo→naranja — debe ser plano `--color-brand-primary`.
- `[MEDIUM]` Placeholders `placeholder-[#c0a0a0]` y CardElement `"::placeholder":{color:"#c0a0a0"}` — `#c0a0a0` fuera de paleta, contraste bajo sobre blanco (~2.2:1) — fallo AA de placeholder.
- `[MEDIUM]` Éxito usa `bg-green-100` + `stroke="#16a34a"` — verde fuera de paleta (C-green); debería derivar de `--color-success`.
- `[LOW]` Radius mixto: inputs `rounded-xl` (12px, correcto = `--radius-input`), botones `rounded-md` (8px, correcto = decisión #3), `aside` `rounded-2xl` (16px = `--radius-card`, correcto) — coherente por accidente, pero todo hardcodeado, no tokenizado.
- `[LOW]` Spinner de loading con `animate-spin` (CSS) — correcto que sea CSS; bajo reduced-motion el `globals.css` lo neutraliza vía la regla global. Aceptable.

**Benchmark comparison:** "Checkout 6.0 vs DTC Awwwards average 8.3 — página de pago funcional y limpia, jerarquía de fieldsets correcta, resumen sticky bien resuelto, integración Stripe sólida; el gap es la misma deuda del resto del sitio — opacidad sobre texto y gradientes — más placeholders a ~2.2:1. El checkout es donde el contraste importa más (el usuario teclea datos sensibles): fallar AA aquí es especialmente caro." (refs: Aesop, benchmark DTC)

**Required fixes (prioritized for iteration-agent):**
1. `[HIGH]` Tokenizar todo el color de `checkout.tsx`: textos con opacidad → tokens sólidos; bordes → `--color-border-default`.
2. `[HIGH]` Inputs: `#f5c6c2` → `--color-border-default`; placeholders (`#c0a0a0` y CardElement) → `--color-text-muted`.
3. `[MEDIUM]` Botones: gradiente → `--color-brand-primary` plano. Éxito: `bg-green-100`/`#16a34a` → derivados de `--color-success`/`--color-success-surface`.

**Status: FAIL**

---

## DEFECTO TRANSVERSAL — Spacing & Distribución (la queja nº1 de Nil)

Input prioritario de Nil: *«La web se ve junta, mal distribuida, las cosas no están bien colocadas.»* Diagnóstico **CONFIRMADO con causa raíz identificada**. No es percepción difusa — es un sistema de spacing especificado y no implementado:

- `[CRITICAL]` **El sistema de spacing de Fase 3 §5 no se aplicó.** El spec definió escala base-4 (`--space-1…24`), ritmo de sección `--space-section-gap` (80px desktop / 64px tablet / 48px móvil), container tokenizado (`max-w` + padding) y gutters por breakpoint. **Cero secciones lo usan.** Cada `.tsx` hardcodea su propio `py-* px-*`.
- `[HIGH]` **Padding lateral plano `px-6` (24px) en todos los viewports.** No hay escalado responsive. En desktop ≥1440px, 24px de gutter sobre un `max-w-6xl` deja el contenido visualmente "pegado" a los bordes en pantallas anchas y sin aire — exactamente la sensación "mal distribuida". El spec mandaba gutter `--space-12` (48px) desktop.
- `[HIGH]` **Ritmo vertical irregular entre secciones.** Hero `pt-16 pb-20`, StatsStrip `py-14` (56px), el resto `py-20` (80px). StatsStrip rompe el compás visiblemente: la banda oscura queda comprimida frente a sus vecinas. Sin un `--space-section-gap` común, el ojo percibe el sitio como "a saltos".
- `[HIGH]` **Sin contenedor común.** Hero usa `px-6 md:px-12`, las demás `px-6`, Products/Values/Footer `max-w-6xl`, AboutUs `max-w-[720px]`, StatsStrip `max-w-5xl`, CTA `max-w-2xl`. Anchos de contenido inconsistentes sección a sección — el `.container` utilitario de `globals.css` (`max-w` + `padding-inline` tokenizados) existe y no se usa en ninguna parte.
- `[MEDIUM]` **Gaps internos ad-hoc:** `gap-3.5`, `gap-y-10 gap-x-6`, `gap-14`, `gap-10`, `mb-5`, `my-6`, `mb-10`, `mb-12` — mezcla de valores sin mapear a `--space-*`. El `gap-3.5` (14px) y `gap-2.5` no caen en la escala base-4/base-8.

**Required fixes (CRITICAL — máxima prioridad para iteration-agent):**
1. Adoptar `.container` (o un wrapper tokenizado equivalente) en las 9 secciones + checkout: `max-width` + `padding-inline` responsive (`--space-container-pad`).
2. Aplicar `--space-section-gap` a TODAS las secciones vía `.section` o `padding-block` tokenizado responsive (80/64/48px). Eliminar `py-14` de StatsStrip y `pt-16` del Hero.
3. Sustituir gaps/márgenes internos arbitrarios por `--space-*` de la escala. Auditar que ningún valor quede fuera de la escala base-4.

---

## Global Visual Verdict

**Global Score: 5.4 / 10**   ·   **Threshold: 8.5**   ·   **Iteration: 1 of 3**

**Status: FAIL — entrega BLOQUEADA, despachada a `iteration-agent`.**

**Causa del cap:** 3 defectos CRITICAL en juego — (a) el design system de Fase 3 no se aplicó a los componentes (token-coherence colapsada en 10 de 11 componentes), (b) los 9 fallos WCAG AA documentados (H-1…H-9) siguen vivos en el build, con concentración crítica en el formulario de Contact (placeholders a 1.8:1, "Eliminar" del Cart a 1.99:1), y (c) el sistema de spacing especificado no se implementó — la queja nº1 de Nil tiene esta causa raíz. Cualquier CRITICAL capa el global a 6.0; los 11 HIGH (motion de anuncio sistémico, gradientes rojo→naranja en 6 componentes, sombras teñidas, shine infinito, entradas `x:±40/60/80`) lo bajan a 5.4.

**Lectura honesta para el gate de Nil:** esto NO es un build mediocre — la arquitectura de Fase 0–2.5 es sana, la Fase 3 produjo un design system correcto y completo, y AboutUs demuestra (consumiendo tokens) cómo debe quedar todo. El problema es de **un solo eslabón roto**: el handoff Fase 3 → Fase 4 (`frontend-developer`) no se ejecutó. `globals.css` se actualizó; los componentes no. El gap de 3.1 puntos hasta el umbral es grande pero **estructuralmente cerrable en las 3 iteraciones** porque el trabajo es mayoritariamente mecánico (sustituir hex por tokens, opacidad por tokens sólidos, gradientes por color plano, calibrar 4 valores de motion) — no requiere rediseño. La Fase 3 ya hizo el diseño; falta aplicarlo.

**Section breakdown:**
- **Hero 5.8** — layout y concepto al nivel del benchmark; hundido por hex hardcodeado (CRITICAL) y motion de anuncio (scale+glow+flecha).
- **StatsStrip 5.5** — `text-white/65` (fallo AA), count-up demasiado rápido, `py-14` rompe el ritmo vertical.
- **Products 6.2** — la mejor arquitectura del build; pierde 2.5 pts en ejecución de superficie (gradientes, sombras rojas, shine infinito, verde fuera de paleta).
- **AboutUs 7.4** — la más cercana a PASS; única que usa tokens; gap estrecho y solo de motion (`x:-60` + scale del botón).
- **Values 6.6** — MANTENER de Fase 2.5; opacidad sobre texto + micro-motion juguetón (scale de entrada, rotate de icono).
- **CTA 4.9** — la sección más débil; 4 nodos de opacidad-sobre-texto, `scale:0.85` del H2, gradiente decorativo 3-stop.
- **Contact 5.3** — CRITICAL por la cadena de fallos AA del formulario (placeholders 1.8:1); barrido `x:±80`; campo que escala en focus.
- **Footer 5.1** — copyright a 3.5:1 (H-9) y headings a `white/40`; pop de entrada del logo.
- **Cart 5.6** — "Eliminar" a 1.99:1, gradientes en FAB/checkout, drawer con física spring.
- **Checkout 6.0** — funcional y limpio; misma deuda de opacidad + gradientes; placeholders a 2.2:1.

**Trayectoria de score:** i1 = 5.4 (sin i2/i3 aún).

---

## DESPACHO A `iteration-agent` — orden de severidad

Lista priorizada, directamente consumible. **Las 3 entradas CRITICAL son una sola tarea conceptual: ejecutar el handoff de Fase 3 que nunca se hizo.**

| # | Sev. | Tarea | Componentes | Cierra |
|---|---|---|---|---|
| 1 | CRITICAL | Sustituir TODOS los literales hex por tokens Nivel 2 — cero `style={{color:"#..."}}`, cero `bg-[#...]`/`text-[#...]` | 10/11 componentes (todos menos about-us) + checkout | G-1/G-2/G-3 |
| 2 | CRITICAL | Eliminar TODA opacidad sobre texto → tokens sólidos (`--color-text-secondary`/`-muted`/`-on-deep`) | stats, products, values, cta, contact, footer, cart, checkout | H-1…H-9 (9 fallos WCAG AA) |
| 3 | CRITICAL | Aplicar el sistema de spacing: `.container` + `--space-section-gap` responsive en las 9 secciones + checkout; gaps/márgenes a `--space-*` | todas | Queja nº1 de Nil |
| 4 | HIGH | Gradientes rojo→naranja → `--color-brand-primary` plano | products, contact, cart (FAB+checkout), cta, checkout | ui-spec §3.1 |
| 5 | HIGH | Motion: eliminar `scale` de hover (botones), `scale` de entrada (H2 CTA, logo footer, cards Values), glow de sombra, flecha deslizante | hero, products, values, cta, about-us, cart, footer | ui-spec §3.1/§4 |
| 6 | HIGH | Distancias de entrada `x:±40/60/80` y `y:30/40/56/60` → fade-up uniforme 12–16px | hero, products, about-us, values, cta, contact, footer | ui-spec §4 |
| 7 | HIGH | Shine del badge `repeat:Infinity` → una pasada; `ease:"linear"` → `--easing-default`; omitir bajo reduced-motion | products | ui-spec §3.6 |
| 8 | HIGH | Sombras teñidas de rojo → `--shadow-card`/`-raised` neutras | products, values | ui-spec §6 |
| 9 | MEDIUM | `type:"spring"` (drawer, parallax) → `ease`/`ease-in-out` con duración | cart, products | ui-spec §4 |
| 10 | MEDIUM | `FocusField` `scale:1.01` → 0 (solo ring de marca señala focus) | contact | gate decisión menor |
| 11 | MEDIUM | Estado "Añadido"/éxito: `bg-green-500`/`bg-green-100`/`#16a34a` → `--color-success`/`-surface` | products, checkout | C-green |
| 12 | MEDIUM | Count-up StatsStrip 1400ms → 2200ms | stats-strip | ui-spec §4 |
| 13 | MEDIUM | Decoración fuera de disciplina 2-color: MeshGradient 5-color, patrón de puntos Products, gradiente 3-stop CTA → reducir a paleta de marca o retirar | hero, products, cta | DSM-1/C-deco |
| 14 | MEDIUM | Cart: `role="dialog"`+`aria-modal`+focus-trap+`Esc`; leer `useReducedMotion` | cart | M7/C9 |
| 15 | LOW | Hamburguesa: focus-trap + cierre con `Esc` | hero | ui-spec §3.13 |

**Re-auditar tras los fixes:** las 9 secciones + checkout (cambio sistémico — todo se toca). Hard cap 3 iteraciones; si i3 < 8.5, escalar a director con trayectoria.

---

## Notas de aprendizaje (para `visual-perfection-memory.md` — pendiente de aplicar por el agente al cierre)

- **Nuevo defecto recurrente — "design system fantasma":** el `globals.css` puede estar 100% tokenizado y correcto mientras los componentes lo ignoran por completo. Detectar SIEMPRE al inicio de una auditoría post-Fase-3 con un grep de literales hex (`#[0-9a-f]{3,6}`) y opacidad-sobre-texto (`text-*/[0-9]+`, `text-white/`) en `src/components`. Si el conteo es alto, el handoff Fase 3→4 no se ejecutó — es un CRITICAL inmediato, no un hallazgo sección-a-sección.
- **La queja "se ve junta" tiene firma técnica:** padding lateral plano sin escalado responsive + ausencia de un `--space-section-gap` común + contenedores de ancho inconsistente. Buscar estos tres patrones cuando un usuario reporta mala distribución; no es subjetivo.
- **Benchmark food/DTC artesanal restraint:** Le Fruit Studio / Aesop / Buly 1803 / Farm Minerals se sostuvieron como comparación justa. El gap de un build con design system sin aplicar concentra TODO el déficit en token-coherence + contraste — patrón gemelo al "todo el gap en spectacle" de La Nonna, pero aquí es deuda de ejecución, no de placeholders. Cerrable sin rediseño.
