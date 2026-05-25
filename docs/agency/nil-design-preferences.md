# Patrón de diseño aprobado por Nil — Yaya Mariana (25/05/2026)

> **Estatus:** CANÓNICO. Este archivo es ground truth para todas las fases futuras del proyecto Yaya Mariana y entrada permanente para `learning-loop-v2`. Cualquier agente que produzca diseño / motion / copy / build / a11y / perf debe leerlo antes de empezar.
>
> **Disparado por:** comparación side-by-side el 25/05/2026 entre `localhost:3000` (rama `clasico` HEAD `62c6f77`, salida de los agentes Fases 0-5) y `localhost:3001` (rama `clasico-backup-pre-agents` @ `19dabf2`, versión original de Nil sin agentes). Nil prefiere la versión original como base y declara modo `additive-only` para el trabajo futuro.

---

## Identidad visual aprobada (ground truth = rama `clasico-backup-pre-agents`)

- Fondos pastel cálidos (melocotón, cream)
- Tipografía editorial serif
- Acentos rojos sobre fondos pastel
- Animaciones existentes son VALOR, no fricción
- "Limpio" > "saturado" — siempre

## Reglas duras para futuras fases

1. **Modo ADDITIVE-ONLY sobre versión original.**
2. **PROHIBIDO modificar:** fondos, paleta, tipografía base, layouts, estructura.
3. **PERMITIDO añadir:** microtexturas, micro-animaciones, elementos decorativos secundarios.
4. **`quality-gate` DEBE rechazar** cualquier diff que toque las dimensiones prohibidas.

## Decisiones por sección

- **Hero:** mantener fondo melocotón + ilustración Yaya + tipografía serif. Añadir sin saturar.
- **Grid productos:** BLOQUEADO COMPLETO. No tocar.
- **Nuestra historia:** mantener base, permitido añadir.
- **Grid beneficios 6 cards:** BLOQUEADO COMPLETO + animación preservada.
- **CTA final rojo:** BLOQUEADO COMPLETO.
- **Contacto:** base mantenida, cambios menores aceptables.

---

## Cómo se aplica esta regla en la práctica

- Antes de cualquier propuesta de cambio visual, el agente responsable lee este archivo y **declara explícitamente** en su informe qué dimensiones (fondo / paleta / tipografía / layout / estructura) toca o no toca.
- `quality-gate` ejecuta un check: si el diff toca alguna dimensión prohibida sin haber sido escalado a Nil y aprobado caso por caso, el cambio **se bloquea automáticamente**.
- `learning-loop-v2` mantiene este archivo en la lista de "constituyentes" — modificarlo requiere aprobación explícita de Nil y queda fechado y atribuido.

## Excepciones de las reglas duras (necesitan aprobación explícita de Nil)

Si en algún momento un cambio en dimensión prohibida se considera estrictamente necesario (caso límite: hallazgo de seguridad, problema legal, requisito técnico irrenunciable), el agente proponente debe:

1. Documentar la razón concreta en `docs/agency/phase-X-Nil-override-request.md`.
2. Esperar la firma de Nil (PASS) en ese fichero.
3. Solo entonces aplicar el cambio.

Sin firma → no se toca.
