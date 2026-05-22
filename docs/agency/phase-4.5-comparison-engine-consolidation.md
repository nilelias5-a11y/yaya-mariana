# FASE 4.5 — QA Visual · Consolidación de Auditorías OLA 1
## Entregable del agente `comparison-engine` — Motor de Consolidación

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES) · sitio HOMENAJE a la abuela de Nil
**Rama:** `clasico` · **Modo:** AUDIT (cero código tocado · cero memoria de agencia tocada)
**Fecha:** 2026-05-22
**Rol en Fase 4.5:** ingerir las 5 auditorías de OLA 1 y producir (a) un mapa de defectos unificado y deduplicado, (b) un mapa de clústeres de causa raíz, (c) un score global de la web 0–10, (d) veredicto vs umbral 8.5.
**Framework:** D — Criterios custom (consolidación; ninguno de A/B/C aplica a un meta-roll-up de auditorías)
**Input prioritario de Nil:** «La web se ve junta, mal distribuida, las cosas no están bien colocadas.» → distribución/espaciado es la queja nº1 declarada.

---

## ⚑ RESUMEN EJECUTIVO — VEREDICTO

> **SCORE GLOBAL DE LA WEB: 5.0 / 10 — FAIL.** Umbral 8.5. Brecha 3.5.
> Entrega BLOQUEADA. Pero la brecha es **mecánicamente cerrable sin rediseño**.

Las 5 auditorías de OLA 1 (`spacing-perfectionist` 4.8 · `visual-perfection` 5.4 · `hierarchy-master` 5.5 · `accessibility-perfectionist` 4.6 · `mobile-obsessor` 6.4) **no son cinco hallazgos distintos: son cinco lecturas del mismo defecto raíz.** Los 5 agentes, con vocabularios diferentes (espaciado / coherencia visual / jerarquía / contraste / responsive), describen una sola causa:

> **El design system tokenizado que la Fase 3 entregó en `globals.css` nunca se migró a los componentes.** Color, espaciado y escala tipográfica viven hardcodeados en los 10–11 `.tsx`. El handoff Fase 3 → Fase 4 (`frontend-developer`) no se ejecutó. `globals.css` y los componentes son dos universos desconectados.

Esto no es un build mal diseñado. Es un build **desconectado de su propio sistema**. El diagnóstico de Nil («se ve junta, mal distribuida») es CONFIRMADO por los 5 agentes con firma técnica concreta: un sistema de spacing especificado (escala base-4, `--space-section-gap`, `.section`, `.container`, gutters por breakpoint) que cero componentes consumen.

---

## 1. PRE-COMPARISON PROTOCOL — Framework D y tabla de pesos

El director (Nil) ha pre-aprobado un esquema de pesos razonable, ponderado por (a) impacto en usuario y (b) la prioridad declarada de Nil sobre distribución/espaciado. **Procedo sin segunda confirmación**, declarando los pesos explícitamente aquí como mandato del rol.

### 1.1 Por qué Framework D y no un promedio de los 5 scores

Un promedio ingenuo de los 5 números (4.8 · 5.4 · 5.5 · 4.6 · 6.4 = **5.34**) sería **metodológicamente incorrecto** por una razón estructural:

- **`visual-perfection` es un roll-up holístico, no un especialista paralelo.** Su rúbrica de 7 criterios (Spacing, Hierarchy, Contrast, Motion, Hover, Mobile, Token-coherence) **ya integra** el territorio de los otros 4 agentes. Su 5.4 *contiene* spacing, hierarchy, a11y-contraste y mobile. Promediarlo junto a los 4 especialistas es **doble conteo**: el espaciado pesa dos veces (vía `spacing-perfectionist` y vía la fila Spacing de `visual-perfection`), igual contraste, jerarquía y mobile.
- Por tanto, el score global **no es la media de 5**. Es una **síntesis ponderada por dimensión de usuario**, donde `visual-perfection` se usa como *calibrador transversal* (sanity-check del conjunto), no como una quinta entrada igual.

### 1.2 Tabla de pesos propuesta (Framework D — APROBADA por mandato del director)

Los pesos se asignan a **dimensiones de calidad percibida por el usuario**, no a agentes. Cada dimensión toma su evidencia de los agentes que la cubren.

| Dimensión de calidad | Peso | Justificación del peso | Fuente de evidencia (agentes) |
|---|---|---|---|
| **Distribución / espaciado / layout** | **30%** | Queja nº1 declarada de Nil — peso máximo por mandato explícito del director. Es lo que el cliente literalmente ve mal. | `spacing-perfectionist` (primario) · `visual-perfection` §spacing · `mobile-obsessor` ejes 1/4 · `hierarchy-master` causa #3 |
| **Accesibilidad / contraste / legibilidad** | **25%** | Es un suelo no negociable (WCAG AA), no un "nice-to-have". El sitio está *por debajo de AA*; afecta a toda la audiencia, en especial al perfil de cliente mayor que el propio `mobile-obsessor` identifica. Impacto de usuario altísimo. | `accessibility-perfectionist` (primario) · `visual-perfection` §contrast · `hierarchy-master` issue #2 |
| **Jerarquía visual / orden de lectura** | **20%** | "Mal colocada" es en parte un problema de jerarquía aplastada (todos los tiers colapsan en un gris-rosa). Alta contribución a la queja de Nil, pero subordinada a espaciado puro. | `hierarchy-master` (primario) · `visual-perfection` §hierarchy |
| **Experiencia móvil** | **15%** | Audiencia ~70–80% móvil (DTC fresco, tráfico Instagram/WhatsApp). Pero el camino de conversión móvil base funciona (tap targets, nav) — por eso es la dimensión menos rota. | `mobile-obsessor` (primario) · `visual-perfection` §mobile |
| **Coherencia de marca / ejecución de superficie / motion** | **10%** | Motion de anuncio, gradientes naranja, sombras teñidas, decoración fuera de paleta. Rompe el tono restraint/tributo, pero es la capa más cosmética y la de menor impacto funcional para el usuario. Conversión NO se up-weightea: sitio homenaje, no funnel agresivo (consistente con `comparison-engine-memory` Yaya Mariana). | `visual-perfection` (primario, §motion/§token-coherence/§hover) |
| **TOTAL** | **100%** | | |

> **Nota de calibración (de `comparison-engine-memory`):** la regla del role-spec "declarar ganador a gap ≥5" está calibrada a escala 0–100; en escala 0–10 el gap proporcional comparable es ~0.5. No aplica aquí (no es un A/B de dos variantes) pero sí se respeta la disciplina de no inflar márgenes. Toda puntuación por dimensión se da en 0–10.

---

## 2. MAPA DE CLÚSTERES DE CAUSA RAÍZ (deduplicación cruzada)

Los ~120 defectos individuales reportados por los 5 agentes (recuentos brutos: spacing 24 accionables · visual-perfection 37 · hierarchy 14 · accessibility 34 · mobile 14 = **123 entradas brutas**) se agrupan en **6 clústeres de causa raíz**. Los clústeres C1–C3 son el **mismo eslabón roto** visto desde tres ángulos; se reportan separados porque tienen *fixes distintos* y *prioridades distintas*, aunque comparten origen (handoff Fase 3→4 no ejecutado).

| ID | Clúster de causa raíz | Causa mecánica | Agentes que lo confirman | Nº defectos individuales (dedup.) | Severidad dominante |
|---|---|---|---|---|---|
| **C1** | **Sistema de espaciado de Fase 3 no migrado a componentes** | `globals.css` declara escala base-4, `--space-section-gap`, `.section`, `.container`, `--container-max`, gutters por breakpoint. **Cero componentes los consumen.** `py-20` plano sin escalado responsive en 5+ secciones; 5 anchos de contenedor distintos; ritmo vertical arrítmico (StatsStrip 56px vs resto 80px); gaps/márgenes ad-hoc off-system. ESTA es la queja literal de Nil. | **5 / 5** (spacing · visual-perfection · hierarchy · accessibility · mobile) | ~32 | **CRITICAL** |
| **C2** | **Opacidad sobre texto → fallo WCAG AA sistémico** | 30+ nodos de texto usan `text-color/NN` (`text-white/35`, `text-[#7a3a3a]/65`, `/50`, `/40`…). Viola la regla dura G-1 del design system. Ratios reales medidos hasta **1.9:1** (placeholders Contact, "Eliminar" Cart). Los 9 fallos H-1…H-9 que Fase 3 documentó y marcó "resueltos vía tokens sólidos" siguen TODOS vivos. | **4 / 5** (accessibility · visual-perfection · hierarchy · spacing menciona G-1) | ~30 | **CRITICAL** |
| **C3** | **Paleta y escala tipográfica hardcodeadas (token-coherence colapsada)** | 50+ literales hex inline (`#962a1f`, `#5c1a1a`, `#f5c6c2`…) en 10/11 componentes; tamaños Tailwind sueltos (`text-4xl`, `text-[1.25rem]`) en vez de las utilidades `.text-h1/.text-h2/.text-overline` y tokens `--fs-*`. Solo `about-us.tsx` consume el sistema. Colores fuera de paleta (`#7a3a3a`, `#7a4a42`), `<h2>` sobredimensionados que aplastan el escalón H1>H2. | **3 / 5** (visual-perfection · hierarchy · accessibility) | ~24 | **CRITICAL** |
| **C4** | **Motion de anuncio — contradice el tono tributo/restraint** | `scale` en hover de botones (1.04–1.08) y en entrada (`scale:0.85` H2, `0.8` logo, `0.92` cards); glows de sombra de 24px; flecha deslizante; shine `repeat:Infinity`; gradientes rojo→naranja en 6 componentes; sombras teñidas de rojo; entradas `x:±40/60/80`; `type:spring`. El `ui-designer-spec` lo prohíbe; es el "anuncio de Instagram" que el brief marca como error tonal en un sitio homenaje. | **2 / 5** (visual-perfection primario · mobile toca auto-rotate/reduced-motion) | ~22 | **HIGH** |
| **C5** | **Semántica / teclado / SR — fallos de accesibilidad estructural** | Falta `<main>`; `.skip-link` definido en CSS pero nunca renderizado; Cart drawer y MobileNav son diálogos sin `role="dialog"`/`aria-modal`/focus-trap/`Esc`/retorno de foco; `<html lang>` fijo en "es" no sigue al idioma; rehidratación ignora "en"; mensajes de éxito sin `role="status"`; validación de formulario no accesible. | **2 / 5** (accessibility primario · mobile confirma `<main>`/skip-link) | ~11 | **CRITICAL** |
| **C6** | **Posture desktop-down — sin sistema responsive ni saneamiento móvil** | Build autorizado desktop-down: un solo breakpoint `md:`; tipo de cuerpo 15px e inputs 13–15px → auto-zoom iOS; cero `inputmode`/`autocomplete`/`enterkeyhint`; `100vh` (no `100dvh`) en Hero → salto URL-bar iOS; sin `env(safe-area-inset)`; sin `-webkit-tap-highlight-color`; primera imagen de producto sin `priority`; fuentes Playfair con 12 cortes. | **1 / 5** (mobile-obsessor primario; solapa con C1 en spacing responsive) | ~12 | **CRITICAL** |

**Total defectos individuales tras deduplicación: ~131 entradas brutas → ~110 defectos únicos** agrupados en 6 clústeres. (La deduplicación retira ~13–20 entradas: el mismo `text-white/65` de StatsStrip lo cuentan spacing-adyacente, visual-perfection, hierarchy y accessibility; el `py-20` plano lo cuentan los 5; `<main>` ausente lo cuentan accessibility y mobile.)

### 2.1 Lectura del mapa de clústeres

- **C1 + C2 + C3 son el mismo evento de proyecto:** el handoff Fase 3→4 no se ejecutó. Se mantienen separados porque (a) tienen *fixes distintos* — C1 es `.section`/`.container`/`clamp()`, C2 es quitar opacidad, C3 es sustituir hex/tamaños — y (b) *prioridades distintas* por impacto. Juntos suman ~86 de los ~110 defectos: **el 78% del sitio es un solo problema de cableado.**
- **C1 es el único clúster confirmado por los 5 agentes.** Es la firma exacta de la queja de Nil. Máxima señal de consenso del panel.
- **C2 es el clúster de mayor severidad de instancia** (ratios de 1.9:1 son ilegibles, no "subóptimos") y el que rompe un suelo legal (WCAG AA).
- **C5 es CRITICAL pese a tener "solo" ~11 defectos**: un diálogo de conversión sin focus-trap deja la compra incompletable solo-con-teclado. Severidad por gravedad, no por volumen.
- **C6 lo confirma un solo agente** pero es CRITICAL por dominio: el auto-zoom de inputs iOS degrada directamente el checkout en una audiencia ~70–80% móvil.

---

## 3. MAPA DE DEFECTOS UNIFICADO POR SEVERIDAD (deduplicado)

Tabla consolidada. Cada fila es un **defecto raíz único** (no una instancia); la columna "Instancias" indica cuántas ocurrencias de código agrupa. "Agentes" lista quién lo detecta.

### 3.1 CRITICAL

| # | Defecto raíz | Clúster | Instancias | Agentes que lo detectan |
|---|---|---|---|---|
| CR-1 | Sistema de espaciado de Fase 3 desconectado del build (`.section`/`.container`/`--space-*` con 0 uso) | C1 | ~10 secciones | spacing · visual-perfection · hierarchy · mobile |
| CR-2 | Ritmo vertical entre secciones roto (StatsStrip 56px vs resto 80px; Hero/Footer asimétricos) | C1 | 3 puntos | spacing · visual-perfection · hierarchy · mobile |
| CR-3 | `py-20` plano sin escalado responsive (5 secciones) → "mobile-crush" | C1 / C6 | 5 secciones | mobile · spacing · visual-perfection |
| CR-4 | Opacidad sobre texto sistémica → ~30 nodos por debajo de WCAG AA (mín. 1.9:1) | C2 | 30+ nodos | accessibility · visual-perfection · hierarchy |
| CR-5 | Cadena de fallos AA en formulario Contact (labels 3.4:1, placeholders 1.9:1) | C2 | ~8 nodos | accessibility · visual-perfection |
| CR-6 | Token-coherence colapsada — 50+ literales hex en 10/11 componentes | C3 | 50+ literales | visual-perfection · hierarchy · accessibility |
| CR-7 | Escala tipográfica `--fs-*`/`.text-*` no aplicada — tamaños Tailwind sueltos | C3 | 10 componentes | hierarchy · visual-perfection |
| CR-8 | Texto del Hero sobre MeshGradient animado — contraste no garantizado (`<h1>` ~2.9:1 sobre stop oscuro) | C2 / C4 | 1 (Hero) | accessibility · visual-perfection (DSM-1) |
| CR-9 | Cart drawer sin `role="dialog"`/`aria-modal`/focus-trap/`Esc` — ruta de conversión inaccesible por teclado | C5 | 1 drawer | accessibility · visual-perfection · mobile |
| CR-10 | MobileNav + LanguageSelector sin focus-trap/`Esc`/retorno de foco | C5 | 2 overlays | accessibility · visual-perfection |
| CR-11 | Falta `<main>` landmark; `.skip-link` definido pero nunca renderizado | C5 | layout/page | accessibility · mobile |
| CR-12 | Inputs <16px → auto-zoom iOS Safari (cuerpo 15px, inputs 13–15px) | C6 | 9 campos + body | mobile |
| CR-13 | Formularios sin `inputmode`/`autocomplete`/`enterkeyhint` (Contact + Checkout) | C6 | 9 campos | mobile |

**Subtotal CRITICAL: 13**

### 3.2 HIGH

| # | Defecto raíz | Clúster | Agentes |
|---|---|---|---|
| HI-1 | `--space-section-gap` 80px por debajo del rango confident-whitespace (96–128px) para tono tributo | C1 | spacing · visual-perfection |
| HI-2 | 5 anchos de contenedor distintos — borde del contenido "baila" entre secciones | C1 | spacing · visual-perfection · hierarchy |
| HI-3 | Bandas oscuras desiguales (StatsStrip 56px vs CTA 80px) | C1 | spacing · visual-perfection |
| HI-4 | Card padding distinto entre cards del mismo tier (Products `p-5` vs Values `p-6`) | C1 | spacing |
| HI-5 | Gradientes rojo→naranja en 6 componentes (botones, FAB, fondos) — viola disciplina 2-color | C4 | visual-perfection |
| HI-6 | Motion de anuncio: `scale` en hover/entrada, glow, flecha deslizante, shine `repeat:Infinity` | C4 | visual-perfection · mobile |
| HI-7 | Entradas de barrido `x:±40/60/80` y `y:30/40/56/60` — chocan con el tono solemne | C4 | visual-perfection |
| HI-8 | Sombras de card teñidas de rojo (deberían ser neutras) | C4 | visual-perfection |
| HI-9 | Hero — placa de variedades compite con la cita `<h1>` (sin protagonista único) | C3 | hierarchy · visual-perfection |
| HI-10 | Hero — `<h1>` `#962a1f` por debajo de AAA contra stops claros del mesh | C2 | hierarchy · accessibility |
| HI-11 | ProductCard — nombre y precio empatados (delta 2px); 5 tiers de texto intra-card | C3 | hierarchy |
| HI-12 | Contact — columna info y formulario sin protagonista (empate 48/48) | C3 | hierarchy |
| HI-13 | `<h2>` de sección sobredimensionados (`text-5xl` ≈48px vs `--fs-h2` 32px) — aplastan escalón H1>H2 | C3 | hierarchy |
| HI-14 | `100vh` en Hero (no `100dvh`) → salto de layout URL-bar iOS | C6 | mobile |
| HI-15 | Primera imagen de producto sin `priority` — LCP móvil en riesgo | C6 | mobile |
| HI-16 | `<html lang>` fijo en "es"; rehidratación ignora "en" — SR con fonética errónea, idioma perdido al recargar | C5 | accessibility |
| HI-17 | Carousel auto-rota sin respetar `useReducedMotion()` ni control de pausa accesible | C4 / C5 | accessibility · mobile |
| HI-18 | Mensajes de éxito de formulario sin `role="status"`/`aria-live` (Contact, off-season, checkout) | C5 | accessibility |
| HI-19 | Validación de formulario no accesible (sin `aria-invalid`/`aria-describedby`) | C5 | accessibility |
| HI-20 | Bordes de input con contraste insuficiente (`#f5c6c2` ≈1.3:1, falla 3:1 UI) | C2 | accessibility |
| HI-21 | Placeholders fuera de paleta con contraste bajo (`#c0a0a0` ≈2.1:1, `#b08a8a` ≈2.9:1) | C2 | accessibility · visual-perfection |
| HI-22 | Hero — columna izquierda entra con `x:-40` (anuncio) | C4 | visual-perfection |

**Subtotal HIGH: 22**

### 3.3 MEDIUM

| # | Defecto raíz | Clúster | Agentes |
|---|---|---|---|
| ME-1 | Headers de sección inconsistentes (eyebrow→título `mb-3` vs `mb-4`; bloque→contenido `mb-10` vs `mb-12`) | C1 | spacing |
| ME-2 | Contact `gap-14` (56px) off-system | C1 | spacing |
| ME-3 | 4 paddings de botón distintos para el mismo rol (10/11/12/14px) | C1 / C3 | spacing |
| ME-4 | 3 paddings de input distintos (Contact/CTA/checkout) | C1 / C3 | spacing |
| ME-5 | `gap-3.5`/`py-2.5`/`py-3.5` off-baseline (14px/10px no múltiplos de 4) | C1 | spacing |
| ME-6 | Eyebrows a 12px en vez de `.text-overline` 11px; Hero usa 11px → inconsistencia de tier | C3 | hierarchy |
| ME-7 | Decoración fuera de disciplina 2-color: MeshGradient 5-color, patrón de puntos Products, gradiente 3-stop CTA | C4 | visual-perfection |
| ME-8 | `type:spring` en drawer y parallax (prohibido por el sistema de motion) | C4 | visual-perfection |
| ME-9 | `FocusField` escala el campo `scale:1.01` en focus | C4 | visual-perfection |
| ME-10 | Estado "Añadido"/éxito usa verde fuera de paleta (`bg-green-500`/`#16a34a`) | C3 / C4 | visual-perfection |
| ME-11 | Count-up StatsStrip a 1400ms (debería 2200ms — lee rápido/comercial) | C4 | visual-perfection |
| ME-12 | StatsStrip cifra `text-[2.6rem]` fija sin reducir en móvil dentro de `grid-cols-2` | C6 | mobile · visual-perfection |
| ME-13 | Bloque tributo AboutUs sin orden interno (placa "Mariana" ↔ blockquote empatados) | C3 | hierarchy |
| ME-14 | Footer headings de columna `text-white/40` ilegibles — tier de etiqueta desaparece | C2 / C3 | hierarchy · accessibility |
| ME-15 | "Eliminar" del Cart con tap target sub-44px (~24px) | C6 | mobile |
| ME-16 | Sin `env(safe-area-inset-*)` en nav sticky ni FAB | C6 | mobile |
| ME-17 | Sin `-webkit-tap-highlight-color` ni `touch-action: manipulation` | C6 | mobile |
| ME-18 | Imágenes fuente de producto sin optimizar (200–360 KB c/u); assets muertos en `public/` | C6 | mobile |
| ME-19 | `<nav>` sin `aria-label="Principal"` | C5 | accessibility |
| ME-20 | SVG decorativos sin `aria-hidden` consistente (stats, values icons) | C5 | accessibility |
| ME-21 | Shine del badge `repeat:Infinity` sin gate `useReducedMotion()` explícito | C4 / C5 | accessibility · visual-perfection |
| ME-22 | Cart sin leer `useReducedMotion()` para gatear slide/badge | C4 / C5 | visual-perfection · accessibility |

**Subtotal MEDIUM: 22**

### 3.4 LOW

| # | Defecto raíz | Clúster | Agentes |
|---|---|---|---|
| LO-1 | 4 paddings de botón primario distintos en el sitio (consecuencia de ME-3, residual) | C3 | spacing |
| LO-2 | Hero — `pr-10` compensatorio en vez de `gap` real | C1 | spacing |
| LO-3 | Hero — posible orphaned whitespace con `min-h` + `pt-16 pb-20` | C1 | spacing |
| LO-4 | Tracking de eyebrow Hero `0.22em` vs resto `0.18em` | C3 | spacing · visual-perfection |
| LO-5 | Autor de la cita Hero en color fuera de paleta (`#7a4a42`) | C3 | hierarchy |
| LO-6 | "Ver más" de ProductCard — 5º tier de ruido + opacidad | C2 / C3 | hierarchy |
| LO-7 | Footer "En memoria de Mariana" en color hardcodeado fuera de paleta | C3 | visual-perfection · accessibility |
| LO-8 | `borderRadius`/`bg` hardcodeados donde existe token (`--radius-button`, `--color-bg-footer`, etc.) | C3 | visual-perfection · accessibility |
| LO-9 | `button.tsx` (Base UI) es código muerto en la home; clases `dark:` residuales | C3 | accessibility |
| LO-10 | Tap targets sub-44px en enlaces secundarios ("Volver", "Ver más", email/tel) | C6 | mobile |
| LO-11 | Panel Cart `max-w-[22rem]` — falta `overscroll-behavior: contain` | C6 | mobile |
| LO-12 | Hero — `aspectRatio 1/1` del bloque de variedades denso en móvil | C6 | mobile |
| LO-13 | Count-up StatsStrip sin nodo `sr-only` con valor final (riesgo bajo de lectura intermedia SR) | C5 | accessibility |
| LO-14 | Playfair Display con 12 cortes cargados (config de fuente — recortar a 2) | C6 | mobile |

**Subtotal LOW: 14**

### 3.5 Recuento total consolidado y deduplicado

| Severidad | Defectos raíz únicos | Instancias de código agrupadas (aprox.) |
|---|---|---|
| **CRITICAL** | **13** | ~95 (la mayoría son C1/C2/C3 multi-instancia) |
| **HIGH** | **22** | ~30 |
| **MEDIUM** | **22** | ~30 |
| **LOW** | **14** | ~15 |
| **TOTAL** | **71 defectos raíz** | **~110 defectos únicos / ~123–131 entradas brutas pre-dedup** |

> Lectura: los 5 agentes reportaron ~123 entradas brutas. Tras deduplicar las causas raíz cruzadas, el sitio tiene **71 defectos raíz** (o ~110 si se cuenta cada instancia única). La compresión 123→71 es la prueba cuantitativa de que **los agentes estaban viendo en gran parte lo mismo.**

---

## 4. SCORE GLOBAL DE LA WEB — cálculo

### 4.1 Puntuación por dimensión (0–10)

Cada dimensión se puntúa con la evidencia consolidada de sus agentes fuente, NO copiando un score de agente.

| Dimensión | Peso | Score 0–10 | Justificación de la puntuación |
|---|---|---|---|
| Distribución / espaciado / layout | 30% | **4.8** | `spacing-perfectionist` 4.8 es el especialista primario y los otros 3 agentes que tocan layout convergen en el mismo rango (visual-perfection §spacing capado a ≤6.0, mobile eje 1 FAIL). 2 CRITICAL de cableado + ritmo roto. Tomo el score del especialista directamente: es el dominio de máxima evidencia. |
| Accesibilidad / contraste | 25% | **4.6** | `accessibility-perfectionist` 4.6, por debajo de AA. 16 CRITICAL en su conteo, ~14 fallos AA de contraste, 2 diálogos sin focus-trap. Es un fallo de *suelo*, no de pulido. Sin descuento ni bonus: el especialista midió ratios reales a mano. |
| Jerarquía visual | 20% | **5.5** | `hierarchy-master` 5.5. La arquitectura de secciones es sana (5 PASS de protagonista), pero la escala que haría visible el orden no se renderiza. Score del especialista. |
| Experiencia móvil | 15% | **6.4** | `mobile-obsessor` 6.4 — la dimensión menos rota: 3 ejes PASS, tap targets y navegación base correctos. Pero 6/9 ejes fallan, 2 en el camino de conversión. Score del especialista. |
| Coherencia de marca / motion | 10% | **5.0** | Derivado de las filas Motion/Hover/Token-coherence de `visual-perfection`: gradientes naranja, motion de anuncio, sombras teñidas, decoración fuera de paleta en ~6 componentes. Un CRITICAL de token-coherence presiona a la baja; los HIGH de motion lo dejan en el rango 5. |

### 4.2 Cálculo ponderado

```
Score base ponderado =
  (4.8 × 0.30) + (4.6 × 0.25) + (5.5 × 0.20) + (6.4 × 0.15) + (5.0 × 0.10)
= 1.440 + 1.150 + 1.100 + 0.960 + 0.500
= 5.15
```

### 4.3 Regla del techo por CRITICAL

El role-spec y la calibración de los 5 agentes aplican una regla común: **un defecto CRITICAL capa el resultado a ≤6.0; CRITICAL sistémicos lo bajan más.** Aquí no hay un CRITICAL aislado — hay **13 defectos CRITICAL en 4 clústeres distintos** (C1, C2, C3, C5, C6 todos con CRITICAL). Cuando los CRITICAL son *sistémicos y multi-dimensión*, el techo efectivo no es 6.0 sino más bajo, porque el sitio falla simultáneamente en distribución, contraste-AA, semántica y móvil-conversión.

- Techo por CRITICAL aislado: 6.0 → no aplica (no es aislado).
- Techo por CRITICAL sistémico multi-clúster: **~5.0–5.5**.
- El score base ponderado (5.15) **ya cae dentro de ese techo** — los pesos y la regla del techo coinciden, lo cual es señal de consistencia.

**Ajuste fino a la baja (−0.15):** el clúster C2 contiene fallos de *suelo legal* (WCAG AA con ratios de 1.9:1, ilegibles) y C5 deja la ruta de conversión incompletable solo-con-teclado. Cuando un CRITICAL no es "subóptimo" sino "roto/inaccesible", la regla del techo se aplica con sesgo a la baja dentro del rango. Score base 5.15 − 0.15 = **5.00**.

### 4.4 SCORE GLOBAL = **5.0 / 10**

> **Frase de cálculo:** media ponderada por dimensión de usuario (espaciado 30% · a11y 25% · jerarquía 20% · móvil 15% · marca/motion 10%) = 5.15, capada por la regla de techo de 13 CRITICAL sistémicos en 4 clústeres y ajustada −0.15 por fallos de suelo legal (AA) e inaccesibilidad de la ruta de conversión → **5.0**.

**Verificación cruzada (sanity-check, patrón de `comparison-engine-memory`):** el promedio ingenuo de los 5 scores es 5.34; `visual-perfection` como roll-up holístico independiente da 5.4. El score consolidado 5.0 queda *ligeramente por debajo* de ambos — correcto: el promedio ingenuo infla por doble conteo del espaciado y por no penalizar la *acumulación* de CRITICAL; la consolidación honesta debe ser algo más severa que la media. La dirección (FAIL claro, ~5) es estable en los tres métodos; solo cambia el margen. Esto replica el hallazgo de memoria: pesos no estándar *afinan* un veredicto que ya existe, no lo fabrican.

---

## 5. VEREDICTO Y TRAYECTORIA

### 5.1 Veredicto

> **FAIL.** Score global **5.0 / 10** vs umbral **8.5**. Brecha **3.5 puntos**. Entrega BLOQUEADA.

Pero la brecha es **estructuralmente cerrable sin rediseño**, y esta es la lectura honesta para el gate de Nil:

- El build NO está mal diseñado. La arquitectura de Fase 0–2.5 es sana (5/10 secciones PASS de protagonista, navegación móvil sólida, tap targets correctos). La Fase 3 produjo un design system **completo y correcto**.
- El sitio falla por **un solo evento de proyecto**: el handoff Fase 3 → Fase 4 (`frontend-developer`) no se ejecutó. `globals.css` se tokenizó; los componentes no se migraron. C1+C2+C3 — el 78% de los defectos — son ese único eslabón roto.
- El trabajo de cierre es **mayoritariamente mecánico**: sustituir hex por tokens, opacidad por tokens sólidos, `py-20` por `.section`/`clamp()`, `max-w-*` por `.container`, añadir atributos de formulario y landmarks. No requiere decisiones de diseño nuevas — `about-us.tsx` ya demuestra (consumiendo tokens) cómo debe quedar todo.
- `about-us.tsx` 7.4 es el techo demostrado de lo que el sitio alcanza *cuando consume su propio sistema*. Migrar el resto sube el conjunto a ese rango.

**Proyección de trayectoria:** los especialistas estiman, tras aplicar los fixes, ~8.7–9.0 (spacing), ~8.0–8.5 (hierarchy). Consolidado: con C1+C2+C3+C5 cerrados el sitio entra en **8.3–8.8** — a 1–2 iteraciones del PASS, dentro del presupuesto de 3 iteraciones. La OLA 1 es i1 = 5.0; quedan i2/i3.

### 5.2 Qué clúster mueve más aguja

**Ranking de clústeres por impacto (peso de dimensión × severidad × consenso de agentes × proximidad a la queja de Nil):**

| # | Clúster | Impacto | Por qué mueve aguja |
|---|---|---|---|
| **1º** | **C1 — Sistema de espaciado no migrado** | **MÁXIMO** | Único confirmado por los **5/5 agentes**. Cae sobre la dimensión de peso 30%. **Es la queja literal nº1 de Nil** — resolverlo es lo que hace que Nil deje de ver la web "junta y mal distribuida". Fix mecánico de ~13 sustituciones + 1 token a `clamp()`. Mejor ratio impacto/esfuerzo del sitio. |
| 2º | C2 — Opacidad sobre texto / fallo AA | MUY ALTO | Dimensión 25%. Desbloquea el suelo WCAG AA. ~30 nodos, fix mecánico (quitar `/NN`, usar token sólido). Sin esto el sitio es legalmente no entregable. |
| 3º | C3 — Hex/escala hardcodeados | ALTO | Dimensión jerarquía 20% + marca 10%. Migrar `--fs-*`/`.text-*` recupera el orden de lectura visible. Mecánico. |
| 4º | C5 — Semántica/teclado/SR | ALTO (gravedad) | Pocos defectos (~11) pero CRITICAL: ruta de conversión inaccesible por teclado. Requiere algo de lógica (focus-trap), no solo sustitución. |
| 5º | C6 — Posture desktop-down / móvil | MEDIO-ALTO | Audiencia 70–80% móvil; auto-zoom iOS degrada checkout. Solapa con C1 en spacing responsive. |
| 6º | C4 — Motion de anuncio | MEDIO | Dimensión 10%. Rompe el tono restraint/tributo — importa para la dignidad del homenaje — pero es la capa más cosmética y de menor impacto funcional. |

> **El clúster nº1 a atacar es C1 — "Sistema de espaciado de Fase 3 no migrado a componentes".** Es el único con consenso 5/5, cae sobre la dimensión de mayor peso (30%), y es la causa mecánica exacta de la queja declarada de Nil. Atacarlo primero es además el desbloqueo de mayor ratio impacto/esfuerzo: conectar `.section`/`.container` y subir `--space-section-gap` a `clamp(80→112px)` es trabajo de ~1 sprint corto sin rediseño.

---

## 6. BIAS CHECK

Aplicado el checklist del role-spec, adaptado a una consolidación (no a un A/B):

- **Recency bias (¿el último audit leído pesó de más?):** No detectado. `mobile-obsessor` (último leído, score más alto 6.4) NO arrastró el global al alza — la dimensión móvil pesa solo 15% por mandato y el global 5.0 quedó por debajo de los 6.4. El orden de lectura no contaminó.
- **Length bias (¿el audit más largo/detallado pareció más grave?):** Vigilado. `visual-perfection` es el audit más extenso (10 secciones). Conscientemente **se le rebajó el rol** a calibrador transversal en vez de quinta entrada igual, precisamente para no dejar que su volumen inflara su peso. La extensión no se confundió con severidad.
- **Novelty bias:** No aplica (no hay opción "nueva" vs "vieja"). El recurrente novelty-hit de memoria (sobre-creditar "lo que parece más diseño") no estaba en juego en una consolidación.
- **Confirmation bias (¿el input de Nil distorsionó los scores antes de evaluar?):** Riesgo REAL y declarado. Nil dijo "se ve junta" *antes* de la auditoría → tentación de inflar C1/espaciado para "darle la razón". Mitigado de dos formas: (1) C1 no se puntúa por la palabra de Nil sino por **consenso independiente 5/5 de los agentes** y por firma técnica medible (`py-20` plano, 0 uso de `.section`); (2) el peso 30% de espaciado es un **mandato explícito del director**, no una decisión mía sesgada — está declarado como tal en §1.2. La prioridad de Nil informa el *peso*, no el *score* de la dimensión.
- **Anchoring (¿el primer audit leído fijó un ancla?):** `spacing-perfectionist` (4.8, primero leído) pudo anclar a la baja. Contrastado: el score consolidado 5.0 NO copió el 4.8 — se calculó por dimensiones y quedó por encima del primer ancla, lo que indica que el ancla no dominó.
- **Sesgo de "rubber stamp tras N reports" (de `comparison-engine-memory`):** No aplica a la baja aquí — los 5 reports son FAIL, no positivos. El riesgo inverso (sumarse al pesimismo del panel sin verificar) se mitigó con el sanity-check de §4.4: tres métodos independientes (promedio, roll-up, ponderado) convergen en ~5.0–5.4. El veredicto FAIL es del artefacto, no contagio de tono.

**Conclusión del bias check:** sin sesgos sin corregir. El único riesgo material —confirmation bias por el input de Nil— se neutralizó separando *peso* (mandato del director, declarado) de *score* (consenso independiente medible de 5 agentes).

---

## 7. STATUS & HANDOFF

**Status:** **FAIL** — score global 5.0/10 vs umbral 8.5. Entrega BLOQUEADA. OLA 1 = iteración 1 de 3.

**Handoff:**
- **→ director / gate de Nil:** decisión requerida — autorizar la migración componentes→design-system (clústeres C1+C2+C3) como work item de Fase 4 *no completado*, no como pulido de Fase 4.5. Es el handoff Fase 3→4 que nunca se ejecutó. Confirmar también el salto de `--space-section-gap` 80→112px (`clamp`), que es lo que materialmente arregla la queja de Nil.
- **→ `iteration-agent`:** orden de ataque C1 → C2 → C3 → C5 → C6 → C4. C1 primero (máximo impacto/esfuerzo, queja de Nil). C1+C2+C3 son ~86 defectos mecánicos sin rediseño. C5 requiere lógica (focus-trap). C4 es el pulido final de tono.
- **→ re-auditoría:** tras los fixes, las 5 auditorías de OLA 1 deben re-correr; este `comparison-engine` re-consolida en OLA 2. Hard cap 3 iteraciones; si i3 < 8.5, escalar a director con la trayectoria.

**Una frase para Nil:** la web no está mal diseñada — tiene un design system correcto que sus propios componentes nunca llegaron a usar; conectar ese sistema (sobre todo subir y regularizar el aire entre secciones) arregla la sensación de "junta y mal distribuida" sin rediseñar nada, y deja el sitio a 1–2 iteraciones del aprobado.

---

*Consolidación `comparison-engine` · Framework D (criterios custom) · Fase 4.5 QA Visual · Yaya Mariana · 2026-05-22 · modo AUDIT — cero archivos de código modificados · cero archivos de memoria de la agencia modificados. Pesos pre-aprobados por el director y declarados explícitamente en §1.2.*
