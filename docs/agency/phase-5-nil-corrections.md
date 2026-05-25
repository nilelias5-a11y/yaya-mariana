# Fase 5 — Captura de correcciones de Nil (entrada a learning-loop-v2)

> **Propósito:** este archivo es el punto único de recogida de las correcciones manuales que Nil aplique tras revisar Fase 5 en el dev server. Es la materia prima que `learning-loop-v2` enrutará a las memorias de los agentes que correspondan cuando `quality-gate` devuelva APPROVED.
>
> **Cómo usar:** Nil deja sus correcciones aquí (o las dicta en sesión y yo las anoto). Cada entrada lleva un patrón consistente para que learning-loop-v2 las parsee sin ambigüedad. Cuando se cierre Fase 5, learning-loop-v2 lee este archivo y propaga.

---

## Formato de cada corrección

```
### YYYY-MM-DD · [scope: hero | products | values | checkout | cta | contact | footer | cart | nav | seo | perf | a11y | mobile | hierarchy | spacing | a otros]

**Lo que el agente produjo:** (cita literal o descripción de la salida actual)

**Lo que Nil corrigió:** (la versión final que Nil eligió)

**Regla inferida:** (la guía que, de existir, habría evitado el gap)

**Agente(s) destino:** (de la lista de 47 — visual-perfection, copywriter, brand-designer, etc.)

**Cross-refs:** (otros agentes que también deberían haberlo cazado)
```

---

## Estado de activación

- **2026-05-25:** archivo creado en TANDA 4 cierre. Dev server arrancado para revisión de Nil.
- **Pendiente:** trigger de `learning-loop-v2`. Se dispara cuando `quality-gate` devuelva APPROVED en Fase 5 completa (después de las correcciones de Nil + cualquier iteración T-future). Hasta entonces, esta lista vive aquí y se va llenando.
- **Memoria runtime de learning-loop-v2:** `~/.claude/agencia-web-v2/memory/learning-loop-v2-memory.md` (paired file con el log de runs).

---

## Correcciones de Nil (orden cronológico — append-only)

### 2026-05-25 · scope: META · CRÍTICO — additive-only mode

**Disparador:** Nil compara side-by-side `localhost:3000` (rama `clasico`, HEAD `62c6f77`, salida de los agentes Fases 0-5, score interno 8.9/10) vs `localhost:3001` (rama `clasico-backup-pre-agents` @ `19dabf2`, versión suya original sin agentes). Worktree montado en `C:\proyectos\yaya-mariana-backup` para la comparación.

**Lo que los agentes produjeron:** Una iteración completa de 5 fases sobre el código de Nil con score interno 8.9/10 PASS en cierre: rediseño del sistema de design tokens, paleta carmín ratificada `#962a1f`, sistema de spacing tokenizado, sistema de botones unificado, embudo de conversión cerrado, JSON-LD/SEO/OG, MeshGradient WebGL → CSS gradient, etc. La media dimensional cierre = 8.9 (visual 8.9, spacing 9.0, hierarchy 8.7, mobile 9.0, a11y 8.9).

**Lo que Nil corrigió:** Rechaza el conjunto del rediseño visual. La identidad aprobada es la de la rama backup (fondos pastel cálidos melocotón/cream, tipografía editorial serif, acentos rojos sobre pastel, animaciones existentes como valor). Declara modo **ADDITIVE-ONLY** para el trabajo futuro y bloquea por completo Grid productos · Grid beneficios 6 cards · CTA final rojo. Hero y Nuestra historia y Contacto: base mantenida, permitido añadir microelementos. Pidió crear `docs/agency/nil-design-preferences.md` (CANÓNICO) con las reglas duras.

**Regla inferida — escala 10/10 (highest-value signal):**

1. El sistema de agentes NO debe rediseñar la identidad visual del cliente sin gate de aprobación previo. La fase 2.5 (ux-designer + prototype-designer) sí gateó (Nil aprobó wireframes); la fase 3 (ui-designer + design-system-manager) sí gateó (Nil aprobó dirección B "En su Punto" + rojo carmín). PERO al implementar (Fase 4 en adelante) los agentes ejecutaron rediseño VISUAL completo además de los fixes técnicos, y Nil — tras verlo materializado — prefiere su versión original.

2. La aprobación de wireframes/specs sobre papel ≠ aprobación del resultado renderizado. **Faltó un gate intermedio "first-paint review"** entre el spec y la implementación masiva, donde Nil pudiera ver una sola sección renderizada con la dirección visual antes de extenderla a las 8 secciones.

3. La quality-gate basada en scores dimensionales (visual/spacing/hierarchy/mobile/a11y) es ciega a la dimensión **identidad** = "¿esto sigue pareciendo el sitio que el cliente quiere?". 8.9/10 técnico puede coexistir con 0/10 de identidad si el rediseño no respeta el ADN del proyecto.

4. **Pareto inverso confirmado:** los fixes técnicos (a11y, SEO, performance, mobile, i18n, bug fixes) son universalmente valiosos y bien recibidos por Nil. El rediseño visual (paleta, tokens cromáticos, botones, motion uniforme, gradient, tonos de copy) es discutible y Nil prefiere su versión. Próxima vez: aplicar las dos capas en commits separados y gatear cada una por separado.

**Agente(s) destino — ruta principal:**

- `quality-gate` — debe rechazar diffs que toquen las 5 dimensiones prohibidas (fondos / paleta / tipografía base / layouts / estructura) sin gate explícito de Nil. Hoy quality-gate no contempla la dimensión "identidad".
- `creative-director` — su aprobación de la dirección visual B "En su Punto" no era equivalente a aprobación de la implementación masiva. Necesita gate "first-paint review" obligatorio entre spec y rollout.
- `director` (orchestrator) — la planificación de fases debe separar capa-técnica (a11y/SEO/perf/mobile/i18n/bugs) y capa-visual (paleta/tokens/motion/copy) en commits y gates distintos. Hoy van mezcladas en las TANDAS.
- `ui-designer`, `design-system-manager`, `brand-designer`, `visual-perfection`, `hierarchy-master`, `spacing-perfectionist`, `mobile-obsessor`, `accessibility-perfectionist`, `copywriter` — todos leen `nil-design-preferences.md` antes de actuar. Si tocan dimensión prohibida sin aprobación, su output es no-mergeable.

**Cross-refs:**

- `learning-loop-v2` — propaga `nil-design-preferences.md` como ground truth a las memorias relevantes; lo añade a la rutina de carga de contexto de los 9 agentes citados.
- `client-simulator` — debe simular "Nil prefers his original baseline" como persona del cliente Yaya Mariana en futuras evaluaciones.
- La regla **NO debe generalizarse** a otros proyectos de la agencia sin más datos. Es PROYECTO-ESPECÍFICA por ahora. A los 3 proyectos con override de este tipo se promueve a regla canónica (umbral 3).

---

## Estrategia de reversión — DECISIÓN PENDIENTE de Nil

Tres opciones presentadas a Nil el 2026-05-25. Su recomendación: B (cherry-pick). Esperando confirmación explícita antes de tocar git.

- **A) HARD RESET** — `clasico` ← `clasico-backup-pre-agents`. Pierde TODO el trabajo de los agentes (incl. a11y WCAG AA, SEO completo, perf, mobile, i18n, bug fixes).
- **B) CHERRY-PICK** — `clasico` ← `clasico-backup-pre-agents` + commits aditivos con los fixes técnicos que NO tocan diseño visual (a11y, SEO, performance, mobile, i18n cart+checkout, bug fixes, Yellowtail). Implementación: hard reset + commits aditivos sobre la base original, archivando el trabajo actual en `clasico-agents-archive` antes del reset.
- **C) MIXTO** — empezar desde backup y pedir permiso por cada fix técnico antes de aplicarlo. Más lento, más control.

Cuando Nil confirme estrategia, se ejecuta y se añade aquí la nota de cierre.
