# Fase 1.5 — Mood Board · Reporte Consolidado
**Proyecto:** Yaya Mariana
**Branch:** `clasico` (modo AUDIT)
**Tono:** Homenaje (HARD RULE — no marketing)
**Fecha:** 2026-05-21
**Agentes ejecutados (2 olas):** mood-board-creator · color-psychologist (paralelo) → creative-director

---

## 1. Resultado de la fase

La Fase 1.5 cierra con **dirección visual decidida** y **paleta validada**. El `creative-director` (capa de juicio "synthetic-Nil") tomó dos decisiones de criterio para no detener el flujo; ambas quedan **pendientes de ratificación de Nil** en el gate. La pregunta de fotografía NO se resolvió aquí — se **desacopló**: el diseño ya no depende de ella.

| Decisión | Resultado | Confianza | Estado |
|---|---|---|---|
| Dirección visual | **B — "En su Punto"** | HIGH | Pendiente ratificación Nil |
| Calibración red de marca | **A — `#962a1f`** carmín | HIGH | Decidida (reversible, overridable) |
| Hero: foto vs tipografía | **DEFERIDA** | — | Escalada → conversación familia |

---

## 2. Las 3 direcciones visuales (mood-board-creator)

10 referencias documentadas: las 5 ya validadas por competitor-analyst (Farm Minerals SOTD Feb-2026, Post Familiar Wine SOTD 2024, Le Fruit Studio SOTD 2023, Beerenberg Farm, Swiss Organic Farm) + 5 del eje tributo/heritage que las primeras infra-cubrían (Canlis, Ruinart, Familia Torres, Buly 1803, Aesop).

| Dir. | Nombre | Concepto en una línea |
|---|---|---|
| A | La Mesa de la Yaya | Bodegón doméstico cálido; la fresa puesta como ella la dejaría en la mesa de la cocina |
| **B** | **En su Punto** | **Restraint como reverencia; la fresa con silencio, registro museístico. La más premium y la más Awwwards-aware** |
| C | Del Campo, con Calma | Descenso scroll-driven del campo a la mesa; la más narrativa |

**Cada dirección especifica su Hero DOS veces** — Path P (foto) y Path T (tipografía-only), mismo grid/layout/spacing/tipo — cumpliendo la mitigación obligatoria del Riesgo 1.

---

## 3. Dirección elegida — B "En su Punto"

`creative-director` confirma la recomendación de `mood-board-creator`. Razonamiento:
1. **Es la expresión más fiel del tono homenaje** — el brief literalmente dice "restraint amplifies dignity"; B *es* eso. El default cálido/artesanal de la agencia queda explícitamente sobreescrito por el brief.
2. **La más segura contra el Riesgo 1** — su Hero sin foto (Path T) es su *mejor* versión, no un fallback degradado.
3. **La diferenciación competitiva más difícil de copiar** — ninguna marca española de fresa sostiene el restraint.
4. **Encaja limpio en el sistema 2-color** cream + strawberry-red + 1 neutral.

Segunda opción documentada: **Dirección A**, si el deseo prioritario de la familia resultara ser calidez doméstica inmediata. `creative-director` registró un watch-note: si Nil override hacia A, eso es un ANTI-pattern de alto valor para su modelo de gusto.

---

## 4. Validación de color (color-psychologist)

**Paleta recomendada — "Fresa en su punto":**
- Canvas: cream `#fdf6f5` — confirmado sin cambios (hace ~90% del trabajo de dignidad)
- Marca: `#962a1f` carmín fresa · `-light #b5341f` · `-dark #7a1f17`
- Neutral cálido: tinta `#1a0808` · soft `#5a2a2a` · muted `#6e3232`
- Semánticos: success `#15803d` · warning `#92400e` (ámbar-tierra) · error `#b91c1c` · info `#1d4ed8`

**Tensión red-as-appetite resuelta:** cream + strawberry-red es la pareja correcta, pero el red shippeado está calibrado en registro promocional. La solución es **de-escalar el tono** (carmín, menos croma, menos luminosidad), no reemplazarlo. `#962a1f` clarea WCAG AA sobre cream a 7.43:1.

Alternativas: B `#a52f23` (delta mínima vs código actual, más promocional) · C `#8f2433` (más solemne, riesgo de leerse como vino — descartada por `creative-director`: cold-shift sin razón narrativa).

---

## 5. Hallazgos para Fase 4 — deuda técnica descubierta

`color-psychologist` auditó el código shippeado y encontró trabajo real que la Fase 4 debe absorber:

| # | Hallazgo | Severidad | Owner Fase 4 |
|---|---|---|---|
| 1 | **8 fallos WCAG AA** en `clasico` — casi todos de texto con opacidad (`/65`, `/60`, `/50`, `/40`, `/35`) que machaca colores que pasan AA en sólido. Peor: AboutUs p3 3.97:1, subtítulos 3.38:1, labels 3.02:1, placeholders ~1.8:1 | HIGH | accessibility-perfectionist + frontend-developer |
| 2 | **`globals.css` sigue siendo el tema shadcn neutro por defecto** — la paleta de marca NO está tokenizada. Beat-them #5 ("2-color discipline en globals.css") es trabajo de tokenización en ~11 componentes, no un tweak de hex | HIGH | style-guide-enforcer + frontend-developer |
| 3 | Gradientes red→orange `#c0392b → #e74c3c` — firma del e-commerce de conversión, a eliminar | MED | visual-perfection |
| 4 | `#e74c3c` actúa como 2º color de marca no-oficial → rompe la disciplina 2-color | MED | style-guide-enforcer |
| 5 | Emoji `✅` en `contact.tsx:146` (success state) — viola la regla sin-emoji del `phase-1-report §2`. `checkout.tsx` ya lo hace bien con SVG checkmark → replicar ese patrón | LOW | frontend-developer |

Recurrencia: el bug cream-vs-white (contraste calculado contra blanco puro en vez del canvas cream real) reaparece por 3ª vez entre proyectos — recomendación a `brand-designer`: fijar el canvas como token desde Fase 1 en futuros proyectos.

---

## 6. Riesgo 1 — estado: MITIGADO

La Dirección B especifica Path P y Path T sobre grid, layout, spacing y tipografía **idénticos** — solo cambia el asset central de 380×380px. La conversación con familia **selecciona un path; no puede reiniciar el diseño**. Fase 4 (`brand-designer`) queda desbloqueada ya; solo el asset central del Hero espera el input familiar escalado.

---

## 7. Decisiones para Nil (gate Fase 1.5)

| # | Decisión | Recomendación | Bloquea |
|---|---|---|---|
| A | Ratificar dirección visual **B "En su Punto"** | Confirmar B (HIGH confidence synthetic-Nil) | Gate de Fase 4 (hero/brand/image) |
| B | Calibración red `#962a1f` | Decidida internamente — overridable si chirría | No bloquea |
| C | Stance del Hero photo-vs-typo | Ver `phase-2-report.md` — comparison-engine recomienda shippar Path T como default ya, Path P como swap posterior | No bloquea Fase 2.5 |

---

## 8. Deliverables Fase 1.5

```
C:\proyectos\yaya-mariana\docs\agency\
├── phase-1.5-report.md              ← este reporte consolidado
├── phase-1.5-mood-board.md          (mood-board-creator — 10 refs, 3 direcciones)
├── phase-1.5-color-validation.md    (color-psychologist — paleta + audit WCAG)
└── phase-1.5-creative-direction.md  (creative-director — 2 decisiones + escalada)
```

## 9. Memory updates

```
~/.claude/agencia-web-v2/memory/
├── mood-board-creator-memory.md   (actualizado — dual-path Hero pattern, refs homage-tone food)
├── color-psychologist-memory.md   (CREADO — registro tribute-tone, cream-canvas contrast)
└── creative-director-memory.md    (actualizado — 2 forks, ambos PENDING Nil confirm/override)
```

## 10. Próxima fase

**Fase 2.5 — Wireframes** (`ux-designer` + `prototype-designer`) — gate aparte; por las reglas del director requiere aprobación de Nil página por página. La Fase 2 (`comparison-engine`) se ejecutó en la misma ola — ver `phase-2-report.md`.

Esperando confirmación del director.
