# Fase 4.5 — QA Visual · Informe de cierre

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES)
**Fecha:** 2026-05-22
**Modo:** AUDIT — los agentes detectan y proponen. **No se ha tocado ni una línea de código.**
**Gate:** abierto. El plan de fixes está preparado pero NO aplicado, a la espera de la decisión de Nil.

---

## 1 · Resumen ejecutivo

Fase 4.5 desplegó 7 agentes premium en dos olas. OLA 1 (5 auditores en paralelo) midió el build sección por sección; OLA 2 (consolidación + planificación) unificó los hallazgos y preparó el plan de fixes.

**Score global de la web: 5.0 / 10 — FAIL** (umbral de entrega 8.5).

**Causa raíz dominante (confirmada por los 5 agentes):** el design system tokenizado de Fase 3 (`globals.css`) se aplicó, pero **nunca se migró a los componentes**. Los 11 componentes siguen hardcodeando colores hex, espaciado Tailwind crudo y tamaños tipográficos sueltos, ignorando los tokens (`--space-*`, `--fs-*`, `.section`, `.container`, `var(--color-*)`). El handoff Fase 3 → Fase 4 quedó a medias: se tokenizó la hoja de estilos, no el árbol de componentes.

**Esto explica directamente la queja de Nil** («la web se ve junta, mal distribuida, las cosas no están bien colocadas»): sin el sistema de espaciado conectado, el ritmo vertical es plano y arrítmico, las secciones hermanas no comparten padding y el contenido se centra en cinco anchos distintos.

**La buena noticia:** el ~78% de los defectos son deuda de *ejecución*, no de *diseño*. La arquitectura, el concepto y el design system son correctos — solo falta aplicarlos. El cierre es mecánico, sin rediseño. Trayectoria proyectada tras los fixes: **8.3 – 8.8 / 10**.

---

## 2 · OLA 1 — Auditorías (5 agentes, modo AUDIT)

| Agente | Dominio | Score | Veredicto |
|---|---|---|---|
| spacing-perfectionist | Espaciado, ritmo vertical, distribución | **4.8 / 10** | FAIL |
| visual-perfection | QA visual holístico vs Awwwards (7 criterios) | **5.4 / 10** | FAIL |
| hierarchy-master | Jerarquía tipográfica, F/Z-pattern, 70/20/10 | **5.5 / 10** | FAIL |
| accessibility-perfectionist | WCAG (8 ejes) | **4.6 / 10** | FAIL — por debajo de AA |
| mobile-obsessor | Móvil como experiencia principal (9 ejes) | **6.4 / 10** | FAIL — posture mobile-first NO |

Informes completos: `phase-4.5-{spacing-perfectionist,visual-perfection,hierarchy-master,accessibility-perfectionist,mobile-obsessor}-audit.md`.

---

## 3 · OLA 2 — Consolidación

`comparison-engine` dedujo ~123 entradas brutas a **71 defectos raíz** (la compresión confirma que los 5 agentes veían el mismo problema con distinto lenguaje).

### Mapa de defectos por severidad

| Severidad | Nº | Naturaleza |
|---|---|---|
| **CRITICAL** | 13 | Sistémicos: fallo de suelo legal WCAG AA, ruta de conversión inaccesible, sistema de espaciado/tokens sin migrar |
| **HIGH** | 22 | Inconsistencias entre instancias del mismo componente, motion de anuncio, contraste sub-AAA |
| **MEDIUM** | 22 | Valores off-system puntuales, anatomía de componentes secundarios |
| **LOW** | 14 | Drift dentro de tolerancia en elementos one-off |
| **Total** | **71** | |

### Clústeres de causa raíz (ordenados por impacto)

| # | Clúster | Agentes | Defectos | Severidad |
|---|---|---|---|---|
| **C1** | Sistema de espaciado de Fase 3 no migrado a componentes | **5/5** | ~32 | CRITICAL |
| **C2** | Opacidad sobre texto → fallo WCAG AA sistémico | 4/5 | ~30 | CRITICAL |
| **C3** | Paleta y escala tipográfica hardcodeadas (token-coherence colapsada) | 3/5 | ~24 | CRITICAL |
| **C5** | Semántica / teclado / screen-reader — accesibilidad estructural | 2/5 | ~11 | CRITICAL |
| **C6** | Posture desktop-down — sin sistema responsive ni saneamiento móvil | 1/5 | ~12 | CRITICAL |
| **C4** | Motion de anuncio — contradice el tono tributo/restraint | 2/5 | ~22 | HIGH |

> **C1 + C2 + C3 son el mismo evento de proyecto** — el handoff Fase 3 → 4 sin completar. Suman el 78% de los defectos.

Informe completo: `phase-4.5-comparison-engine-consolidation.md`.

---

## 4 · Foco prioritario — distribución y espaciado (input de Nil)

El input literal de Nil («se ve junta, mal distribuida») es **C1**, el único clúster confirmado por los 5/5 agentes y el de mayor peso. Diagnóstico mecánico:

- **Ritmo vertical roto** — StatsStrip `py-14` (56px) frente al resto `py-20` (80px); Hero y Footer con padding superior ≠ inferior. El scroll se siente arrítmico.
- **Padding de sección por debajo del registro** — 80px plano de principio a fin; el tono tributo (whitespace confiado) pide 96–128px. ~25% por debajo.
- **Cinco anchos de contenedor distintos** — el borde del contenido "baila" de sección a sección.
- **Sin escalado responsive** — el `py-20` no se reduce en móvil: en 375px las secciones se aplastan (mobile-crush).
- **El sistema YA EXISTE sin usarse** — `.section`, `.container`, `--space-section-gap`, `--container-max` están en `globals.css`, con 0 componentes que los referencien.

**Arreglo:** conectar el build al sistema ya existente — subir `--space-section-gap` a `clamp(80px → 112px)`, igualar el ritmo de secciones hermanas, unificar el ancho a `--container-max`. Trabajo mecánico, cero rediseño.

---

## 5 · Plan de fixes propuesto (NO aplicado — pendiente del gate)

`iteration-agent` organizó los 71 defectos en **5 tandas secuenciadas + re-audit**, siguiendo el patrón de Fase 4 (gate de Nil entre cada tanda). Prioridades: **P1 = 13** (los CRITICAL) · **P2 = 44** (HIGH + MEDIUM) · **P3 = 14** (LOW). Cero scope creep.

| Tanda | Contenido | Clústeres | Esfuerzo | Ejecutor |
|---|---|---|---|---|
| **T1 — Distribución/Espaciado** | Conectar `.section`/`.container`, ritmo vertical, anchos, escalado responsive | C1 | Medio | frontend-developer |
| **T2 — Suelo legal WCAG AA** | Eliminar opacidad sobre texto, tokens de texto sólidos (regla G-1) | C2 | Medio | frontend-developer |
| **T3 — Tokens + jerarquía** | Migrar hex → `var(--color-*)`, aplicar escala `--fs-*` | C3 | Medio-alto | frontend-developer |
| **T4 — A11y estructural + móvil** | `<main>`, skip-link, focus-trap del Cart, semántica, tipografía móvil 16px, atributos de formulario, saneamiento iOS | C5 + C6 | Medio-alto | frontend-developer |
| **T5 — Motion de tributo** | Sustituir motion de anuncio por entradas de restraint | C4 | Bajo-medio | frontend-developer |
| **RE-AUDIT** | OLA 2 completa de re-verificación | todos | Medio | 5 auditores + comparison-engine |

**Orden recomendado:** C1 → C2 → C3 → (C5+C6) → C4. C1 primero por el mandato de Nil y por ser estructural sin colisiones; luego color → tipografía → comportamiento/móvil → motion, respetando la regla de no-colisión en `globals.css`. Gate de Nil entre cada tanda.

**Verificación diferida** (requiere ejecución en vivo, no se inventaron métricas): Lighthouse/axe/WAVE/daltonismo/forced-colors en T2; NVDA + teclado-solo + dispositivo real iOS/Android + in-app Instagram + Lighthouse Mobile + zoom 200/400% en T4.

**Una escalada al director:** el valor exacto del borde de input para pasar contraste UI 3:1 estricto necesita ratificación (token de 1 línea — no scope creep).

Plan completo: `phase-4.5-iteration-agent-fix-plan.md`.

---

## 6 · Veredicto

**Fase 4.5 (auditoría) COMPLETA. Web en 5.0/10 — FAIL. Entrega bloqueada.**

El gap hasta el umbral 8.5 es **deuda de ejecución mecánica**, no de diseño: completar el handoff Fase 3 → componentes. Proyección post-fixes 8.3–8.8, dentro del presupuesto de 3 iteraciones (OLA 1 = iteración 1).

**Gate abierto — Nil decide:** aprobar el plan de 5 tandas y arrancar por T1 (distribución/espaciado), o ajustar el plan antes de empezar.

---

## 7 · Índice de entregables (`docs/agency/`)

1. `phase-4.5-spacing-perfectionist-audit.md`
2. `phase-4.5-visual-perfection-audit.md`
3. `phase-4.5-hierarchy-master-audit.md`
4. `phase-4.5-accessibility-perfectionist-audit.md`
5. `phase-4.5-mobile-obsessor-audit.md`
6. `phase-4.5-comparison-engine-consolidation.md`
7. `phase-4.5-iteration-agent-fix-plan.md`
8. `phase-4.5-report.md` (este documento)
