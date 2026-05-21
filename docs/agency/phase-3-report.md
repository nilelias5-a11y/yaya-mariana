# Fase 3 — UI Design + Design System · Reporte Consolidado
**Proyecto:** Yaya Mariana
**Branch:** `clasico` (modo AUDIT)
**Tono:** Homenaje (HARD RULE — no marketing)
**Fecha:** 2026-05-21
**Agentes ejecutados (paralelo):** ui-designer (componentes · motion · spacing/grid · shadow/radius) · design-system-manager (arquitectura de tokens · globals.css · ARIA/contraste · gobernanza)
**Estado:** APROBADO por Nil — gate 2026-05-21

---

## 1. Resultado de la fase

Fase 3 traduce los 9 wireframes aprobados de Fase 2.5 a **specs de componente y un sistema de tokens** — sin tocar `src/`. La implementación es Fase 4. Dos entregas convergentes:

- **design-system-manager** resuelve el núcleo del **Beat-them #5**: hoy `globals.css` es 100% tema shadcn neutro por defecto y la paleta de marca vive hardcodeada en 40+ literales hex en 12 componentes. Entrega una arquitectura de tokens de 3 niveles y el `globals.css` completo listo para Fase 4.
- **ui-designer** entrega el inventario de componentes reales, specs por estado, y un sistema de motion **restrained** que materializa los 8 hints de suavizado de Fase 2.5.

**Hallazgo de auditoría:** el sitio **no tiene design system formal** — 0 primitivas reutilizables (`Input`/`Badge`/`Card` no existen como componente), y el `button.tsx` de shadcn está importado pero **sin usar** por ningún componente de UI (todos los "botones" son `<a>`/`<button>` con clases inline).

---

## 2. Decisiones ratificadas por Nil (gate 2026-05-21)

| # | Decisión | Resolución | Impacto |
|---|---|---|---|
| 1 | Aprobación de Fase 3 | **APROBADA** | Se consolida; desbloquea Fase 4 (implementación) |
| 2 | Typewriter del `<h2>` de Products | **Retirar → fade-up estándar** | Cierra contradicción C-typewriter/C5. El `<h2>` es heading SEO real desde el primer frame; sin loop infinito, sin micro-CLS |
| 3 | Radius de botones (mezcla `rounded-lg`/`rounded-full`) | **Unificar a `--radius-lg` 8px** | Registro editorial/museístico (patrón Aesop). Todos los botones a 8px |
| 4 | Borde de inputs (`#f5c6c2`, ~1.3:1, sub-mínimo UI) | **Fondo blanco + borde `--color-border-default`** | El input usa `--color-bg-surface` (blanco) sobre sección cream; el contraste de superficie crea el límite. Resuelve DSM-2. El checkout ya lo hace así |

**Decisiones menores resueltas con recomendación** (refinamientos sin gate):
- `@custom-variant dark` + bloque `.dark{}` → **eliminados** (tema muerto, ningún color de marca lo usa, el sitio no tiene toggle). Si se quisiera dark mode futuro, se re-añade remapeando solo tokens de color de Nivel 2.
- Radius de los image-slots (Hero 380×380 + retrato AboutUs) → **sin radius** (`--radius-none`) — el registro museístico enmarca con espacio, no con esquinas.

---

## 3. Arquitectura de tokens — 3 niveles

```
NIVEL 1 — PRIMITIVOS    Qué ES.   --strawberry-600: #962a1f
       ↓ (solo Nivel 2 lee Nivel 1)
NIVEL 2 — SEMÁNTICOS    Qué HACE. --color-brand-primary: var(--strawberry-600)
       ↓ (solo componentes leen Nivel 2)
NIVEL 3 — COMPONENTE    Scope local. --btn-bg: var(--color-brand-primary)
```

**Regla de no-salto:** un componente jamás lee un primitivo. Recalibrar la marca = cambiar 1 token de Nivel 2, no 12 componentes.

**Paleta tokenizada (Nivel 1, ratificada):** canvas `--cream-100 #fdf6f5` · marca `--strawberry-500/600/700` (`#b5341f`/`#962a1f`/`#7a1f17`) · superficies oscuras `--maroon-800/900` (mismo rojo, extremo oscuro — no color nuevo) · tinta `--ink-900/600/500` (`#1a0808`/`#5a2a2a`/`#6e3232`) · semánticos success/warning/error/info. **`#e74c3c` y `#c0392b` retirados del sistema** — no existen como token; los gradientes rojo→naranja desaparecen.

El `globals.css` completo, sin placeholders, está en `phase-3-design-system.md` — listo para que Fase 4 lo aplique a `src/app/globals.css`. Conserva el bridge Tailwind v4 + shadcn (`@theme inline` reapuntado a tokens de marca → las utilidades ya escritas en `button.tsx` quedan correctas sin reescribir el componente).

---

## 4. Accesibilidad — los fallos WCAG AA, resueltos a nivel de token

Causa raíz única de los 8 fallos del `clasico`: **opacidad Tailwind sobre texto** (`/72 /65 /60 /50 /40 /35`) que hunde colores que pasan AA en sólido. El sistema lo hace imposible — `--color-text-secondary` (`#5a2a2a`) y `--color-text-muted` (`#6e3232`) son **tokens sólidos** calibrados para pasar AA sobre cada superficie real.

**+1 hallazgo nuevo de Fase 3:** el copyright del Footer usa `text-white/35` (~3.5:1, FAIL para cuerpo) — no estaba en los 8 originales de `color-psychologist`. **Son 9 fallos AA**, todos resueltos por el mismo token sólido.

| # | Fallo (build) | Resolución | Verificado |
|---|---|---|---|
| H-1 | `text-[#7a3a3a]/65` subtítulos/cuerpo | `--color-text-secondary` sólido | 10.6–10.9:1 PASS |
| H-2 | `/72` párrafos AboutUs | `--color-text-secondary` sólido | 10.6:1 PASS |
| H-3 | `/60` labels de form | `--color-text-secondary` sólido | 10.9:1 PASS |
| H-4 | `/50 /40` metadatos, "Eliminar", "/500g" | `--color-text-muted` sólido | 8.8–9.1:1 PASS |
| H-5 | placeholders `/35`, `#c0a0a0` | `--color-text-muted` sólido | 9.1:1 PASS |
| H-6 | `text-[#c0392b]/70` link "ver más" | `--color-brand-primary` sólido | 7.2–7.4:1 PASS |
| H-7 | `#e74c3c` como texto/UI | retirado del sistema; rojo de marca | resuelto por eliminación |
| H-8 | emoji `✅` success (no es contraste) | check SVG, patrón checkout | Fase 4 frontend-developer |
| **H-9** | **`text-white/35` copyright Footer** | `--color-text-on-deep` sólido | 18:1 PASS — **nuevo, añadir a Fase 4** |

**Regla de gobernanza dura G-1 — PROHIBIDO APLICAR OPACIDAD SOBRE TEXTO.** Ni para texto secundario, ni "porque sobre fondo oscuro pasa". La opacidad solo es legítima sobre elementos no textuales (overlays, sombras, gradientes decorativos). Garantiza que los 9 fallos no reaparecen por construcción.

---

## 5. Sistema de motion — restrained

**Filosofía:** "restraint amplifies dignity" — el motion se siente, no se mira. Tres trabajos legítimos: revelar (scroll-in), confirmar (acción), orientar (drawer/menú). Todo lo demás se elimina.

Materializa los 8 hints de suavizado de Fase 2.5:
- **Sin spring/bounce** — el `type:"spring"` del drawer y del parallax → `ease-out` con duración.
- **Sin loops infinitos** — shine del badge: **una sola pasada** (hoy `repeat:Infinity`); typewriter eliminado (decisión #2).
- **Sin hover-brightness / scale / glow / flechas deslizantes** — botones y nav-links solo cambian color + subrayado.
- **Translates de reveal: 40–80px → 16px** — un movimiento amplio lee como anuncio; 16px se siente sin verse.
- **Count-up: 1400ms → 2200ms** — lento lee como "contar con calma".
- **Slide del drawer conservado** — es navegación legítima, no decoración.
- **`prefers-reduced-motion`** (hoy ausente) distingue *eliminar* (count-up, typewriter, shine, parallax, auto-rotate, MeshGradient, easter egg) / *reducir a opacity-only* (scroll-reveals, drawer, dropdown) / *conservar* (transiciones de color, focus ring — **nunca se elimina**).

**Nota crítica para Fase 4:** count-up, typewriter, parallax, auto-rotate y MeshGradient son **JS, no CSS** — un bloque `@media` no los detiene. Cada componente debe leer `matchMedia('(prefers-reduced-motion: reduce)')` y **no montar** la lógica de motion.

Easing por defecto `cubic-bezier(0.22,1,0.36,1)` (el que el build ya usa). Escala de duración: instant 100 · fast 200 · normal 320 · slow 560/600 · countup 2200ms.

---

## 6. Componentes — inventario y specs

Specs por estado (default/hover/focus/active/disabled/loading) de todos los componentes interactivos, con `focus` WCAG-visible en cada uno, en `phase-3-ui-designer-spec.md`. Resumen:

| Componente | Estado en build | Clasificación | Cambio clave |
|---|---|---|---|
| Button primario/ghost/icon | inline, hex hardcodeado | Required | rojo plano (sin gradiente), radius 8px (decisión #3), hover solo color |
| Input/Textarea | inline en `contact.tsx` | Required | fondo blanco + borde (decisión #4), placeholder/label sólidos |
| Checkbox | no existe | Conditional | nuevo — solo para consent waitlist off-season (desmarcado por defecto) |
| Badge variedad | "Premium" genérico + shine ∞ | Required | nombre de variedad, shine una vez |
| Chip trazabilidad | no existe | Required | footnote finca/semana/variedad en Products (decisión #3 de Fase 2.5) |
| Nav + hamburguesa móvil | hamburguesa no existe | Required | hamburguesa = único componente nuevo (decisión #2 de Fase 2.5) |
| Product Card | la sección más fuerte | Required | lift hover 4px (no 8px), sombra neutra (no roja) |
| Carousel | auto-rotate sin gating | Required | auto-rotate gateado en touch + reduced-motion, flechas visibles en touch |
| Cart drawer + FAB | sheet correcto | Required | FAB rojo plano, `role="dialog"` + focus-trap, i18n |

Sistema de **spacing** base-4, **grid** alineado a los breakpoints Tailwind que el build ya usa (no se impone grid de 12 col), **sombras neutras** (corrige las sombras teñidas de rojo, que eran decoración), **radius** documentado por elemento.

---

## 7. Contradicciones — estado post-gate

| ID | Contradicción | Estado |
|---|---|---|
| C-typewriter / C5 | Typewriter del `<h2>` de Products | **RESUELTA — decisión #2: retirar → fade-up** |
| Radius de botón inconsistente | Mezcla `rounded-lg` / `rounded-full` | **RESUELTA — decisión #3: unificar a 8px** |
| DSM-2 | Borde de input sub-mínimo UI (~1.3:1) | **RESUELTA — decisión #4: fondo blanco + borde** |
| `scale:1.01` del campo en focus | Campo que crece al foco vs restraint | Resuelta: reducir a 0, el ring de marca señala el foco (refinamiento) |
| `@custom-variant dark` | Tema oscuro muerto | Resuelta: eliminar (refinamiento) |
| C-deco | MeshGradient · patrón de puntos · gradiente 3-stop vs 2-color | Diferida a Fase 4 (visual-perfection) |
| C-green | "Añadido" usa `bg-green-500` puro | Diferida a Fase 4 (style-guide-enforcer) → `--color-success #15803d` |

---

## 8. Reglas de gobernanza (design-system-manager)

- **G-1** — prohibido aplicar opacidad sobre texto (causa raíz de los 9 fallos AA).
- **G-2** — cero hex crudos en componentes; todo color es token.
- **G-3** — no saltar niveles (componente → Nivel 2 → Nivel 1).
- **G-4** — un valor usado dos veces es un token; cero one-offs.
- **G-5** — `prefers-reduced-motion` obligatorio.
- **G-6** — contraste verificado contra el fondo REAL (cream/blanco/maroon), nunca contra blanco por defecto (bug recurrente, 3ª vez).

Requieren aprobación del director: añadir un color fuera de Nivel 1 · cambiar un token semántico a mitad de proyecto · duplicar un componente · desviarse de la escala tipográfica/espaciado · reintroducir dark mode.

---

## 9. Deliverables Fase 3

```
C:\proyectos\yaya-mariana\docs\agency\
├── phase-3-report.md             ← este reporte consolidado
├── phase-3-design-system.md      (design-system-manager — tokens 3 niveles + globals.css completo + ARIA/contraste + gobernanza)
└── phase-3-ui-designer-spec.md   (ui-designer — direction brief + inventario + specs por estado + motion + spacing/grid + shadow/radius)
```

## 10. Memory updates

```
~/.claude/agencia-web-v2/memory/
├── ui-designer-memory.md       (CREADO — no existía; patrón audit-spec + motion restrained)
└── design-system-memory.md     (CREADO — no existía; arquitectura 3 niveles + G-1 anti-opacidad)
```

## 11. Próxima fase

**Fase 4 — Implementación quirúrgica** (frontend-developer + style-guide-enforcer + copywriter + image-curator…) — ejecuta el mapa de cambios de `phase-2.5-report.md §4.4` (3 CRITICAL · 6 HIGH · 8 MED · 8 LOW, +H-9) aplicando el `globals.css` de Fase 3 y las specs de componente. Orden por severidad. quality-gate audita el estado mejorado (target ≥ 8.5/10).

**Contrato de implementación para Fase 4:** aplicar el `globals.css` del §2 de `phase-3-design-system.md` · cero hex en componentes · retirar Yellowtail de `layout.tsx` · `<h1>` real en Hero · cada componente con motion-JS lee `matchMedia`.

Esperando confirmación del director para arrancar Fase 4.
