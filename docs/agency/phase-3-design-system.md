# FASE 3 — Design System · Yaya Mariana
## Entregable del agente `design-system-manager`
**Proyecto:** Yaya Mariana — sitio DTC de fresas premium (sitio HOMENAJE) · rama `clasico` · modo **AUDIT**
**Dirección visual ratificada:** B "En su Punto" · rojo A `#962a1f` · **Fecha:** 2026-05-21

---

## ⚑ RATIFICACIÓN DEL DIRECTOR (gate Nil — 2026-05-21)

Entregable del `design-system-manager`. El gate de Nil ratificó 4 decisiones; donde haya divergencia, manda el gate (ver `phase-3-report.md §2`):

1. Fase 3 — **APROBADA**.
2. Typewriter del `<h2>` de Products — **retirar → fade-up** (no afecta a este doc; es motion, ver `phase-3-ui-designer-spec.md`).
3. Radius de botones — **unificar a `--radius-button` 8px** (`--btn-radius` ya apunta ahí; sin cambio en el token).
4. Borde de inputs — **fondo blanco + borde** → resuelve el conflicto **DSM-2**: el token de componente `--input-bg` pasa a `var(--color-bg-surface)` (blanco), no `--color-bg-base` (cream). El borde se mantiene `--color-border-default`.

Decisiones menores ratificadas: el `@custom-variant dark` + `.dark{}` se **eliminan** (ya reflejado en el `globals.css` de §2, que los retira). Los image-slots van **sin radius** (`--radius-none`).

---

## 0. Resumen ejecutivo

- **El núcleo del Beat-them #5 se resuelve aquí.** Hoy `globals.css` es 100% tema shadcn neutro y la paleta de marca vive hardcodeada en literales hex en 12 componentes. Este entregable es el `globals.css` completo que tokeniza la paleta ratificada en una arquitectura de 3 niveles.
- **Los 8 (→9) fallos WCAG AA se resuelven a nivel de token.** Causa raíz única: opacidad Tailwind sobre texto. El sistema lo elimina: `--color-text-secondary` y `--color-text-muted` son tokens **sólidos** que pasan AA. Regla dura G-1.
- **`prefers-reduced-motion` se añade** (hoy ausente).
- **El cream `#fdf6f5` es token primitivo desde Nivel 1** — cierra el bug recurrente cream-vs-white.
- **`@theme inline` se conserva y reconfigura** (AUDIT): los `--color-*` de shadcn apuntan ahora a tokens de marca.
- **2 conflictos paleta↔wireframe marcados** (§5): DSM-1 (decoración animada, diferida a Fase 4) y DSM-2 (**resuelto por el gate — decisión #4**).

> **Verificación firewall narrativo:** la capa de tokens/CSS no introduce nombres, identidad de inversor ni referencias a `J. Elías`/`yayamariana.com`. CSS es agnóstico de copy. Sin hallazgos.

---

## 1. Arquitectura de tokens en 3 niveles

```
NIVEL 1 — PRIMITIVOS   Qué ES.   --strawberry-600: #962a1f
       ↓ (solo el Nivel 2 lee Nivel 1)
NIVEL 2 — SEMÁNTICOS   Qué HACE. --color-text-secondary: var(--ink-600)
       ↓ (solo los componentes leen Nivel 2)
NIVEL 3 — COMPONENTE   Scope local. --btn-bg: var(--color-brand-primary)
```

**Regla de no-salto (G-3):** un componente jamás lee Nivel 1.

### 1.1 Nivel 1 — Primitivos

| Token | Valor | Origen |
|---|---|---|
| `--cream-100` | `#fdf6f5` | Canvas cream |
| `--cream-200` | `#fdf0ef` | Secciones alternas |
| `--cream-300` | `#ead7d4` | Hairline cálido |
| `--cream-400` | `#d8b8b4` | Borde funcional |
| `--white` | `#ffffff` | Superficie de cards |
| `--strawberry-500` | `#b5341f` | primary-light — hover de superficie |
| `--strawberry-600` | `#962a1f` | primary — marca |
| `--strawberry-700` | `#7a1f17` | primary-dark — pressed |
| `--maroon-800` | `#5c1a1a` | StatsStrip |
| `--maroon-900` | `#2d0a0a` | Footer |
| `--ink-900` | `#1a0808` | Texto principal |
| `--ink-600` | `#5a2a2a` | Texto secundario sólido |
| `--ink-500` | `#6e3232` | Metadatos sólido |
| `--green-700`/`--green-50` | `#15803d`/`#e7f3ea` | success |
| `--amber-800`/`--amber-50` | `#92400e`/`#f6ecdf` | warning |
| `--red-700`/`--red-50` | `#b91c1c`/`#f7e3e3` | error |
| `--blue-700`/`--blue-50` | `#1d4ed8`/`#e4eafc` | info |

**Disciplina 2-color:** la marca es UN rojo a 3 luminosidades + UN neutro cálido (`ink`) + el canvas. `maroon-800/900` son el mismo rojo en su extremo oscuro. `#e74c3c` y `#c0392b` se retiran — no existen como token.

### 1.2 Nivel 2 — Semánticos

| Token semántico | → Primitivo | Propósito |
|---|---|---|
| `--color-bg-base` | `--cream-100` | Canvas de página |
| `--color-bg-subtle` | `--cream-200` | Secciones alternas |
| `--color-bg-surface` | `--white` | Cards, panel Cart, **inputs (decisión #4)** |
| `--color-bg-deep` | `--maroon-800` | StatsStrip |
| `--color-bg-footer` | `--maroon-900` | Footer |
| `--color-text-primary` | `--ink-900` | Titulares y texto principal |
| `--color-text-secondary` | `--ink-600` | Texto secundario — SÓLIDO |
| `--color-text-muted` | `--ink-500` | Metadatos — SÓLIDO |
| `--color-text-on-brand` | `--white` | Texto sobre botón rojo |
| `--color-text-on-deep` | `--cream-100` | Texto sobre superficie oscura |
| `--color-brand-primary` | `--strawberry-600` | Links, eyebrows, botones |
| `--color-brand-hover` | `--strawberry-500` | Hover de superficie |
| `--color-brand-pressed` | `--strawberry-700` | Pressed |
| `--color-border-subtle` | `--cream-300` | Hairline decorativo |
| `--color-border-default` | `--cream-400` | Borde de input / divisor |
| `--color-border-focus` | `--strawberry-600` | Anillo de focus |
| `--color-success`/`-surface` | `--green-700`/`--green-50` | Estado positivo |
| `--color-warning`/`-surface` | `--amber-800`/`--amber-50` | Aviso |
| `--color-error`/`-surface` | `--red-700`/`--red-50` | Error |
| `--color-info`/`-surface` | `--blue-700`/`--blue-50` | Informativo |

### 1.3 Nivel 3 — Componente

Cada componente declara un bloque local que SOLO referencia Nivel 2. Ej. Button:
```css
.btn {
  --btn-bg:       var(--color-brand-primary);
  --btn-bg-hover: var(--color-brand-hover);
  --btn-text:     var(--color-text-on-brand);
  --btn-radius:   var(--radius-button);   /* 8px — decisión #3 */
}
```

---

## 2. `globals.css` COMPLETO

> Listo para que Fase 4 lo aplique a `src/app/globals.css`. Sin placeholders. Conserva la integración Tailwind v4 + shadcn (modo AUDIT). El `@custom-variant dark` y el `.dark{}` del shadcn neutro se retiran (decisión menor ratificada).

```css
/* ============================================================
   YAYA MARIANA — globals.css
   Design System · Fase 3 · design-system-manager
   Dirección B "En su Punto" · rojo A "#962a1f"
   Modo AUDIT — tokeniza la paleta ratificada sobre el build existente.
   ============================================================ */

@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/* ============================================================
   1. PRIMITIVE TOKENS — Nivel 1
   ============================================================ */
:root {
  /* --- Canvas / neutros cálidos --- */
  --cream-100: #fdf6f5;
  --cream-200: #fdf0ef;
  --cream-300: #ead7d4;
  --cream-400: #d8b8b4;
  --white:     #ffffff;

  /* --- Marca: strawberry-red (1 matiz, 3 luminosidades) --- */
  --strawberry-500: #b5341f;
  --strawberry-600: #962a1f;
  --strawberry-700: #7a1f17;

  /* --- Superficies oscuras (mismo rojo, extremo oscuro) --- */
  --maroon-800: #5c1a1a;
  --maroon-900: #2d0a0a;

  /* --- Tinta cálida (texto) --- */
  --ink-900: #1a0808;
  --ink-600: #5a2a2a;
  --ink-500: #6e3232;

  /* --- Semánticos de estado (primitivos) --- */
  --green-700: #15803d;  --green-50: #e7f3ea;
  --amber-800: #92400e;  --amber-50: #f6ecdf;
  --red-700:   #b91c1c;  --red-50:   #f7e3e3;
  --blue-700:  #1d4ed8;  --blue-50:  #e4eafc;

  /* --- Espaciado — escala base-4 --- */
  --space-1:  0.25rem;  --space-2:  0.5rem;   --space-3:  0.75rem;
  --space-4:  1rem;     --space-5:  1.25rem;  --space-6:  1.5rem;
  --space-8:  2rem;     --space-10: 2.5rem;   --space-12: 3rem;
  --space-16: 4rem;     --space-20: 5rem;     --space-24: 6rem;

  /* --- Tipografía (raw) — fuentes vía next/font en layout.tsx --- */
  --primitive-font-sans:  var(--font-inter), system-ui, -apple-system, sans-serif;
  --primitive-font-serif: var(--font-playfair), Georgia, "Times New Roman", serif;
  --primitive-font-mono:  ui-monospace, "SF Mono", Menlo, monospace;

  --fs-overline: 0.6875rem; --fs-caption: 0.75rem;  --fs-sm: 0.8125rem;
  --fs-body: 0.9375rem;     --fs-body-lg: 1.0625rem; --fs-h4: 1.25rem;
  --fs-h3: 1.5rem;          --fs-h2: 2rem;           --fs-h1: 2.5rem;
  --fs-display: 3rem;

  --fw-regular: 400; --fw-medium: 500; --fw-semibold: 600; --fw-bold: 700;

  /* --- Radios --- */
  --primitive-radius-sm:   0.375rem;
  --primitive-radius-md:   0.5rem;
  --primitive-radius-lg:   0.75rem;
  --primitive-radius-xl:   1rem;
  --primitive-radius-full: 9999px;

  /* --- Sombras — cálidas, restraint --- */
  --primitive-shadow-xs: 0 1px 2px rgba(26, 8, 8, 0.05);
  --primitive-shadow-sm: 0 2px 12px rgba(150, 42, 31, 0.06), 0 1px 3px rgba(26, 8, 8, 0.04);
  --primitive-shadow-md: 0 8px 28px rgba(150, 42, 31, 0.10), 0 2px 8px rgba(26, 8, 8, 0.05);
  --primitive-shadow-lg: 0 20px 48px rgba(150, 42, 31, 0.14), 0 6px 18px rgba(26, 8, 8, 0.07);

  /* --- Motion --- */
  --primitive-duration-instant: 120ms;
  --primitive-duration-fast:    200ms;
  --primitive-duration-normal:  320ms;
  --primitive-duration-slow:    560ms;
  --primitive-ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
  --primitive-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================================
   2. SEMANTIC TOKENS — Nivel 2 (light, único modo)
   ============================================================ */
:root {
  --color-bg-base:    var(--cream-100);
  --color-bg-subtle:  var(--cream-200);
  --color-bg-surface: var(--white);
  --color-bg-deep:    var(--maroon-800);
  --color-bg-footer:  var(--maroon-900);

  /* texto — todos SÓLIDOS (prohibido aplicarles opacidad, G-1) */
  --color-text-primary:   var(--ink-900);
  --color-text-secondary: var(--ink-600);
  --color-text-muted:     var(--ink-500);
  --color-text-on-brand:  var(--white);
  --color-text-on-deep:   var(--cream-100);

  --color-brand-primary: var(--strawberry-600);
  --color-brand-hover:   var(--strawberry-500);
  --color-brand-pressed: var(--strawberry-700);

  --color-border-subtle:  var(--cream-300);
  --color-border-default: var(--cream-400);
  --color-border-focus:   var(--strawberry-600);

  --color-success: var(--green-700);  --color-success-surface: var(--green-50);
  --color-warning: var(--amber-800);  --color-warning-surface: var(--amber-50);
  --color-error:   var(--red-700);    --color-error-surface:   var(--red-50);
  --color-info:    var(--blue-700);   --color-info-surface:    var(--blue-50);

  --font-body:    var(--primitive-font-sans);
  --font-heading: var(--primitive-font-serif);
  --font-mono:    var(--primitive-font-mono);
  --text-body:    var(--fs-body);

  --space-component-pad-x: var(--space-5);
  --space-component-pad-y: var(--space-3);
  --space-content-gap:     var(--space-4);
  --space-section-gap:     var(--space-20);
  --space-container-pad:   var(--space-6);

  --radius-button: var(--primitive-radius-md);   /* 8px — decisión #3, todos los botones */
  --radius-card:   var(--primitive-radius-xl);
  --radius-input:  var(--primitive-radius-lg);
  --radius-badge:  var(--primitive-radius-full);
  --radius-pill:   var(--primitive-radius-full);

  --shadow-card:        var(--primitive-shadow-sm);
  --shadow-card-raised: var(--primitive-shadow-md);
  --shadow-modal:       var(--primitive-shadow-lg);
  --shadow-dropdown:    var(--primitive-shadow-md);
  --shadow-nav:         0 2px 8px rgba(26, 8, 8, 0.06);

  --duration-fast:   var(--primitive-duration-fast);
  --duration-normal: var(--primitive-duration-normal);
  --duration-slow:   var(--primitive-duration-slow);
  --easing-default:  var(--primitive-ease-out);
  --easing-in-out:   var(--primitive-ease-in-out);

  --container-max: 72rem; /* 1152px — coincide con max-w-6xl ya usado */
}

/* ============================================================
   3. TAILWIND v4 / shadcn BRIDGE  (modo AUDIT)
   Re-mapea los tokens shadcn a tokens de marca, de modo que las
   utilidades existentes (bg-primary, text-foreground) queden
   correctas sin reescribir componentes.
   ============================================================ */
@theme inline {
  --color-background:         var(--color-bg-base);
  --color-foreground:         var(--color-text-primary);
  --color-card:               var(--color-bg-surface);
  --color-card-foreground:    var(--color-text-primary);
  --color-popover:            var(--color-bg-surface);
  --color-popover-foreground: var(--color-text-primary);
  --color-primary:            var(--color-brand-primary);
  --color-primary-foreground: var(--color-text-on-brand);
  --color-secondary:          var(--color-bg-subtle);
  --color-secondary-foreground: var(--color-text-primary);
  --color-muted:              var(--color-bg-subtle);
  --color-muted-foreground:   var(--color-text-muted);
  --color-accent:             var(--color-bg-subtle);
  --color-accent-foreground:  var(--color-brand-primary);
  --color-destructive:        var(--color-error);
  --color-border:             var(--color-border-subtle);
  --color-input:              var(--color-border-default);
  --color-ring:               var(--color-border-focus);

  --font-sans:    var(--font-body);
  --font-serif:   var(--font-heading);
  --font-mono:    var(--font-mono);
  --font-heading: var(--font-heading);

  --radius-sm: var(--primitive-radius-sm);
  --radius-md: var(--primitive-radius-md);
  --radius-lg: var(--primitive-radius-lg);
  --radius-xl: var(--primitive-radius-xl);
}

/* DARK MODE: NO se especifica (decisión menor ratificada por Nil).
   El @custom-variant dark y el bloque .dark{} del shadcn neutro se
   RETIRAN — eran tema muerto. Si en el futuro se pide dark mode, se
   añade aquí re-mapeando SOLO tokens de color de Nivel 2. */

/* ============================================================
   4. CSS RESET
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; tab-size: 4; }

body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--color-text-primary);
  background-color: var(--color-bg-base);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

img, video, svg, canvas { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button, input, textarea, select { font: inherit; color: inherit; }
button { cursor: pointer; background: none; border: none; }
p, h1, h2, h3, h4, h5, h6, li, blockquote { overflow-wrap: break-word; }
ul, ol { list-style: none; }
::selection { background-color: var(--color-brand-primary); color: var(--color-text-on-brand); }

/* ============================================================
   5. TYPOGRAPHY UTILITIES — Playfair (heading) + Inter (body)
   Yellowtail ELIMINADA del sistema (retirar de layout.tsx).
   ============================================================ */
.text-display {
  font-family: var(--font-heading);
  font-size: clamp(2.25rem, 5vw, var(--fs-display));
  font-weight: var(--fw-bold); line-height: 1.08; letter-spacing: -0.01em;
}
.text-h1 {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.5vw, var(--fs-h1));
  font-weight: var(--fw-bold); line-height: 1.12; letter-spacing: -0.01em;
}
.text-h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, var(--fs-h2));
  font-weight: var(--fw-semibold); line-height: 1.18;
}
.text-h3 {
  font-family: var(--font-heading);
  font-size: clamp(1.375rem, 2.5vw, var(--fs-h3));
  font-weight: var(--fw-semibold); line-height: 1.25;
}
.text-h4 {
  font-family: var(--font-heading);
  font-size: var(--fs-h4); font-weight: var(--fw-medium); line-height: 1.3;
}
.text-quote {
  font-family: var(--font-heading); font-style: italic;
  font-size: clamp(1.75rem, 4vw, var(--fs-display));
  font-weight: var(--fw-regular); line-height: 1.3;
}
.text-body-lg { font-size: var(--fs-body-lg); line-height: 1.6; }
.text-body    { font-size: var(--fs-body);    line-height: 1.65; }
.text-sm      { font-size: var(--fs-sm);      line-height: 1.6; }
.text-caption { font-size: var(--fs-caption); line-height: 1.5; }
.text-overline {
  font-family: var(--font-body); font-size: var(--fs-overline);
  font-weight: var(--fw-semibold); letter-spacing: 0.18em; text-transform: uppercase;
}

/* ============================================================
   6. LAYOUT UTILITIES
   ============================================================ */
.container {
  width: 100%; max-width: var(--container-max);
  margin-inline: auto; padding-inline: var(--space-container-pad);
}
.section { padding-block: var(--space-section-gap); }
.surface-card {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

/* ============================================================
   7. FOCUS & ACCESSIBILITY
   ============================================================ */
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px; border-radius: var(--primitive-radius-sm);
}
:focus:not(:focus-visible) { outline: none; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
}

.skip-link {
  position: absolute; left: var(--space-2); top: -3rem; z-index: 100;
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-brand-primary);
  color: var(--color-text-on-brand); border-radius: var(--radius-button);
  transition: top var(--duration-fast) var(--easing-default);
}
.skip-link:focus { top: var(--space-2); }

.tap-target { min-width: 44px; min-height: 44px; }

/* ============================================================
   8. REDUCED MOTION  (NUEVO — hoy ausente en el build)
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  :root {
    --duration-fast: 0.01ms;
    --duration-normal: 0.01ms;
    --duration-slow: 0.01ms;
  }
}

/* ============================================================
   9. UTILIDAD DE INTEGRACIÓN HEREDADA
   ============================================================ */
.logo-blend { mix-blend-mode: multiply; }
```

**Notas de implementación para Fase 4 (contrato):**
- El `@custom-variant dark` del actual `globals.css` se retira con el resto del tema oscuro muerto.
- `body className="bg-[#fdf6f5]"` en `layout.tsx` queda redundante (el reset ya pone `--color-bg-base`) — limpieza no bloqueante.
- `layout.tsx` debe **eliminar el import y la carga de `Yellowtail`** (fuente cargada y nunca usada).
- Componente Input: `--input-bg` = `var(--color-bg-surface)` (blanco — decisión #4 del gate).

---

## 3. Escala tipográfica — referencia

| Clase | Fuente | Tamaño (clamp) | Peso | Uso |
|---|---|---|---|---|
| `.text-display` | Playfair | 36→48px | 700 | Hero alterno (Path T) |
| `.text-h1` | Playfair | 32→40px | 700 | El `<h1>` real de la home (H6) |
| `.text-h2` | Playfair | 28→32px | 600 | Títulos de sección |
| `.text-h3` | Playfair | 22→24px | 600 | Nombre de producto |
| `.text-h4` | Playfair | 20px | 500 | Sub-bloques |
| `.text-quote` | Playfair italic | 28→48px | 400 | Cita Hero, blockquote AboutUs, H2 CTA |
| `.text-body-lg` | Inter | 17px | 400 | Intro destacada |
| `.text-body` | Inter | 15px | 400 | Cuerpo por defecto |
| `.text-sm` | Inter | 13px | 400 | UI secundaria |
| `.text-caption` | Inter | 12px | 400 | Metadatos, chip trazabilidad |
| `.text-overline` | Inter | 11px | 600 | Eyebrows uppercase |

---

## 4. Documentación de componente · ARIA + auditoría de contraste

> Ratios contra el fondo REAL de cada superficie (cream `#fdf6f5`, blanco `#ffffff`, maroon `#5c1a1a`, footer `#2d0a0a`). Umbrales: cuerpo `4.5:1`, texto grande `3:1`, UI `3:1`.

### Button
**Ubicación:** `components/ui/button.tsx`. Con el bridge `@theme inline` reconfigurado, `bg-primary`/`text-primary-foreground` resuelven a tokens de marca sin reescribir el componente. **Radius: `--radius-button` 8px para TODOS los botones (decisión #3).**
**ARIA:** `<button>` role implícito; `aria-disabled`+`disabled`; botón solo-icono obliga `aria-label`.
**Contraste:** blanco sobre `brand-primary` 7.93:1 PASS · blanco sobre `brand-hover` 5.49:1 PASS · `brand-primary` (ghost) sobre cream 7.43:1 PASS.
**ANTES→DESPUÉS:** ANTES gradiente `#c0392b→#e74c3c` (blanco-sobre-`#e74c3c` 3.85:1 borderline). DESPUÉS fondo plano `--color-brand-primary`, 7.93:1.

### Input / FormField
**Ubicación:** `contact.tsx`, `checkout.tsx`. **Decisión #4:** `--input-bg: var(--color-bg-surface)` (blanco) + borde `--color-border-default`.
**ARIA:** `<label htmlFor>`; `required`+`aria-required`; en error `aria-invalid`+`aria-describedby`; asterisco decorativo `aria-hidden`.
**ANTES→DESPUÉS:**
| Elemento | ANTES | ratio | DESPUÉS | ratio |
|---|---|---|---|---|
| H-3 Label form | `text-[#7a3a3a]/60` | 3.02:1 FAIL | `--color-text-secondary` | 10.94:1 PASS |
| H-5 Placeholder | `/35` / `#c0a0a0` | 1.81–2.24:1 FAIL | `--color-text-muted` | 9.09:1 PASS |
| Texto introducido | `text-[#7a3a3a]` | 7.89:1 PASS | `--color-text-primary` | 18.18:1 PASS |
| Borde input | `#f5c6c2` | ~1.3:1 FAIL | **fondo blanco sobre cream + borde `--color-border-default`** | límite perceptible resuelto (decisión #4) |

### Badge / Chip
Badge de variedad (sustituye "Premium") + chip de trazabilidad (finca·semana·variedad). `ink-900` sobre `white/92` ~16:1 PASS · chip `--color-text-muted` sobre cream 9.09:1 PASS. Shine respeta `prefers-reduced-motion` (una sola pasada).

### ProductCard
Superficie `--color-bg-surface` (blanco). ANTES→DESPUÉS sobre blanco:
| Elemento | ANTES | ratio | DESPUÉS | ratio |
|---|---|---|---|---|
| Nombre producto | `text-[#1a0808]` | 19.6:1 | `--color-text-primary` | PASS |
| H-1 Descripción | `/65` | 3.49:1 FAIL | `--color-text-secondary` | 10.6:1 PASS |
| H-4 "/500g" | `/50` | 2.49:1 FAIL | `--color-text-muted` | 8.8:1 PASS |
| H-6 Link "ver más" | `text-[#c0392b]/70` | 3.10:1 FAIL | `--color-brand-primary` | 7.2:1 PASS |

### Cart (drawer)
Panel blanco. ARIA: `role="dialog"` + `aria-modal` + `aria-labelledby` (hoy ausente — M7), focus-trap, `Esc` cierra, foco devuelto al FAB. ANTES→DESPUÉS sobre blanco: nombre item 19.6:1 PASS · "500g·precio" `/60` 3.0:1 FAIL → `--color-text-secondary` 10.6:1 · "Eliminar" `/40` 1.99:1 FAIL → `--color-text-muted` 8.8:1 · FAB gradiente 3.85:1 → sólido 7.93:1.

### Nav
Superficie blanca. ARIA: `<nav aria-label="Principal">`; el `LanguageSelector` ya implementa `aria-haspopup`/`aria-expanded`/`role="listbox"` — correcto, conservar. Hamburguesa nueva: `aria-expanded`+`aria-controls`+`aria-label`, tap targets ≥44px. Contraste: link sobre blanco 19.6:1 · hover `brand-primary` 6.8:1 · CTA blanco sobre rojo 7.93:1.

### Hero
La cita debe ser el `<h1>` real de la home (H6 — hoy es `<p>`). Slot 380×380 con `width/height` reservados (anti-CLS). Cita `brand-primary` sobre cream 7.43:1 PASS · autor `text-secondary` 10.94:1 PASS.

### StatsStrip
Superficie `--color-bg-deep #5c1a1a`. Cifra `text-on-deep` (cream) 11.9:1 PASS. **Label hoy `text-white/65` → G-1 lo prohíbe** → `--color-text-on-deep` sólido 11.9:1. `#e74c3c` del icono retirado → rojo de marca.

### Values / CTA / Footer
Values card blanca: descripción `/65` 3.49:1 FAIL → `--color-text-secondary` 10.6:1. CTA banda oscura: subtítulo `text-white/70` → token sólido (G-1 es categórico). Footer `#2d0a0a`: links `/65` y descripción `/50` → tokens sólidos; **copyright `text-white/35` ~3.5:1 FAIL — hallazgo H-9 nuevo** → `--color-text-on-deep` sólido 18:1.

---

## 5. Conflictos paleta ↔ wireframe

| # | Conflicto | Estado |
|---|---|---|
| DSM-1 | Decoración animada (MeshGradient, patrón de puntos, gradiente 3-stop) vs disciplina 2-color | Diferida a Fase 4 (`visual-perfection`). El sistema no crea tokens para los colores del MeshGradient; tampoco fuerza retirarlos. El `globals.css` es válido en ambos desenlaces |
| DSM-2 | Borde de input no alcanza 3:1 como UI | **RESUELTA — decisión #4 del gate: input con fondo blanco (`bg-surface`) + borde `--color-border-default`** |

---

## 6. Reglas de gobernanza

**Requiere aprobación del director:** añadir un color fuera de Nivel 1 · cambiar un token semántico a mitad de proyecto · duplicar un componente · desviarse de la escala tipográfica/espaciado · reintroducir dark mode · cualquier cambio al design system tras empezar Fase 4.

**Reglas de uso de token (duras):**
- **G-1 — PROHIBIDO APLICAR OPACIDAD SOBRE TEXTO.** Causa raíz de los 9 fallos AA. Nunca `text-[...]/65`, `text-white/70`, ni `opacity` sobre un nodo de texto. El texto secundario/muted son tokens sólidos. La opacidad solo es legítima sobre elementos no textuales.
- **G-2 — Cero hex crudos en componentes.** Todo color es token (hoy 40+ literales en 12 componentes).
- **G-3 — No saltar niveles.** Componente lee Nivel 2, nunca Nivel 1.
- **G-4 — Un valor usado dos veces es un token.** Cero one-offs.
- **G-5 — `prefers-reduced-motion` obligatorio.**
- **G-6 — Contraste contra el fondo REAL** (cream/blanco/maroon), nunca contra blanco por defecto.

**Naming:** primitivos `--[familia]-[escala]` · semánticos `--[categoría]-[elemento]-[variante]` · componente `--[componente]-[propiedad]` · utilidades kebab-case con prefijo de categoría.

---

## 7. Trazabilidad — los 9 fallos WCAG AA

| # | Fallo (build) | Causa | Resolución | Verificado |
|---|---|---|---|---|
| H-1 | `/65` subtítulos/cuerpo | opacidad | `--color-text-secondary` sólido | 10.6–10.9:1 PASS |
| H-2 | `/72` párrafos AboutUs | opacidad | `--color-text-secondary` sólido | 10.6:1 PASS |
| H-3 | `/60` labels form | opacidad | `--color-text-secondary` sólido | 10.9:1 PASS |
| H-4 | `/50 /40` metadatos, "Eliminar" | opacidad | `--color-text-muted` sólido | 8.8–9.1:1 PASS |
| H-5 | placeholders `/35` | opacidad | `--color-text-muted` sólido | 9.1:1 PASS |
| H-6 | `text-[#c0392b]/70` link | opacidad | `--color-brand-primary` sólido | 7.2:1 PASS |
| H-7 | `#e74c3c` texto/UI | color fuera de paleta | retirado; rojo de marca | resuelto |
| H-8 | emoji `✅` success | HARD RULE (no contraste) | check SVG, Fase 4 | frontend-developer |
| **H-9** | **`text-white/35` copyright Footer** | opacidad — **hallazgo nuevo** | `--color-text-on-deep` sólido | 18:1 PASS |

G-1 garantiza que estos fallos no pueden reaparecer.

---

## 8. Handoff

| Hacia | Qué recibe |
|---|---|
| frontend-developer (Fase 4) | El `globals.css` de §2, listo para `src/app/globals.css`. Contrato: cero hex en componentes, retirar Yellowtail, `<h1>` real en Hero, `--input-bg` = blanco |
| accessibility-perfectionist (Fase 4.5) | Tabla §7, bloque reduced-motion §8, specs ARIA por componente §4 |
| style-guide-enforcer (Fase 4/5) | Reglas de gobernanza §6. `#e74c3c`/`#c0392b` retirados; gradientes rojo→naranja eliminados |
| visual-perfection (Fase 4) | Conflicto DSM-1 (decoración animada) |
