# Fase 2 — Análisis Profundo · Reporte Consolidado
**Proyecto:** Yaya Mariana
**Branch:** `clasico` (modo AUDIT)
**Fecha:** 2026-05-21
**Agente ejecutado:** comparison-engine

---

## 1. Objeto de la comparación

El mood board de Fase 1.5 define, para cada dirección visual, el Hero en dos caminos:
- **Path P — Hero con foto** (archivo familiar real / manos de la siguiente generación)
- **Path T — Hero tipografía-only** (sin foto)

`comparison-engine` evaluó **Path P vs Path T** con la Dirección B "En su Punto" como caso de referencia (la recomendada), Framework A (Design Comparison) con pesos ajustados a sitio-homenaje.

---

## 2. Pesos (Framework A, ajustado a tributo — aprobados por el director)

| Criterio | Peso | Ajuste vs default |
|---|---|---|
| Visual hierarchy | 20% | = |
| Brand alignment | 25% | ↑ (de 20 — el ajuste tonal es lo primordial) |
| Conversion readiness | 10% | ↓ (de 20 — es homenaje, no funnel) |
| Mobile experience | 15% | = |
| Accessibility | 15% | ↑ (de 10 — reduced-motion/contraste son frente abierto) |
| Awwwards standard | 15% | = |

---

## 3. Scoring

| | Path P (foto) | Path T (tipografía) |
|---|---|---|
| **Total ponderado (pesos tributo)** | **7.65** | **8.30** |
| Total ponderado (Framework A default) | 7.75 | 8.10 |

Gap 0.65 — estrecho. Path T lidera en mobile (9 vs 7), accesibilidad (8 vs 7) y brand alignment para la Dirección B (9 vs 8). Path P solo lidera en conversion readiness (8 vs 7 — el criterio de menor peso). **El sentido del veredicto se mantuvo en ambos pesajes** — los pesos ajustados afilan una ventaja existente, no la fabrican. Checklist de sesgos ejecutado, sin sesgos detectados.

---

## 4. Veredicto condicional

Por mandato del Riesgo 1, ambos paths siguen vivos hasta la conversación con familia. El veredicto es por tanto **condicional**:

- **Path P gana SI** la familia aporta fotografía de archivo usable de Mariana (o consiente una sesión sobria de manos de la siguiente generación) — una imagen de archivo auténtica carga una inmediatez de tributo que Path T no iguala del todo.
- **Path T gana SI** la familia declina, no aporta nada usable, o la conversación se pasa del arranque del `hero-specialist` en Fase 4.
- **Hallazgo asimétrico clave:** solo **Path T es viable incondicionalmente**. Path P está bloqueado sobre un asset que no existe (Bandera 1). Esa asimetría es el resultado central.

---

## 5. Tercera opción — stance operativo recomendado

Más fuerte que cualquiera de los dos paths puros:

> **Shippar Path T como default AHORA; tratar Path P como un swap de asset in-place, no bloqueante**, si/cuando la familia entregue material.

El mood board garantiza que P y T comparten layout idéntico y difieren solo en el slot central de 380×380px → una foto puede entrar después sin cambio estructural (mismo patrón placeholder-slot que R1-003 de La Nonna). Esto **saca a Path P de la ruta crítica** a coste casi-cero. Además, Path T resuelve de paso un defecto existente del build (el logo duplicado en la columna derecha del Hero).

---

## 6. Sensibilidad por dirección

| Si Nil confirma… | Resultado |
|---|---|
| Dirección B "En su Punto" | T por delante (8.30 vs 7.65); stance tercera-opción aplica |
| Dirección A "La Mesa de la Yaya" | Gap se estrecha a casi cara-o-cruz; P ligeramente favorecida *si existe fotografía auténtica* (la calidez doméstica es más difícil solo con tipo) |
| Dirección C "Del Campo, con Calma" | Espeja a B — T por delante, el tributo de C lo carga el scroll, no el Hero |

En las 3 direcciones: T es shippeable incondicionalmente y P está asset-gated → el veredicto condicional y el stance operativo se sostienen sea cual sea la dirección confirmada.

---

## 7. Deliverable y memory

```
docs/agency/phase-2-comparison-hero-paths.md       (comparison-engine — reporte completo)
docs/agency/phase-2-report.md                      (este reporte consolidado)
~/.claude/agencia-web-v2/memory/comparison-engine-memory.md  (actualizado)
```

## 8. Próxima fase

**Fase 2.5 — Wireframes** (`ux-designer` + `prototype-designer`) — gate aparte, aprobación Nil página por página. Los wireframes deben mostrar dónde aterrizan los 18 puntos del Beat-them plan y reflejar el slot Hero P/T-intercambiable de 380×380px.

Esperando confirmación del director.
