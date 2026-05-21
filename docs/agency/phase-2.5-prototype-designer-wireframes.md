# Fase 2.5 — Wireframes · Capa wireframe construible
**Proyecto:** Yaya Mariana — sitio DTC fresas premium · rama `clasico` · modo AUDIT
**Agente:** prototype-designer
**Fecha:** 2026-05-21
**Dirección visual:** B "En su Punto" · cream `#fdf6f5` + red marca `#962a1f` + tinta `#1a0808`
**Hero:** Path T (tipografía-only) default · slot central 380×380 intercambiable P/T

---

## ⚑ RATIFICACIÓN DEL DIRECTOR (gate Nil — 2026-05-21)

Este entregable refleja el trabajo del prototype-designer. El gate de Nil ratificó 4 decisiones que **enmiendan** partes de este documento; donde haya divergencia manda el gate (ver `phase-2.5-report.md §2`):

1. Los 9 wireframes — **APROBADOS**.
2. Nav móvil — **hamburguesa mínimo autorizado** (resuelve C10): el wireframe Hero móvil incorpora `[☰]` funcional.
3. Chip de trazabilidad — **solo en Products**: el wireframe Hero **pierde** el elemento "✚ chip trazabilidad"; su contenido pasa al chip de la product card (elemento 5f).
4. Filtro Products — **reetiquetar por variedad** (resuelve C7): la barra de filtros pasa a `[Todas][Mágnum][Dream][1525]`.

Las contradicciones diferidas (C4 deco, C5 typewriter, C8 verde "Añadido", C9 `<h2>` Cart) quedan para Fase 4. Las confirmadas (C1 emoji, C2 `target=_blank`, C3 no-CLS, C11 legacy, C12 no-`<h1>`) pasan al mapa de cambios.

---

> **Leyenda de cajas:** `█`=banda de color · `┌─┐`=contenedor · `[ ]`=interactivo · `( )`=imagen/slot · `~~~`=texto cuerpo · `===`=heading · `··`=se MANTIENE · `▲`=MOVER · `✕`=QUITAR · `✚`=AÑADIR · `⚠`=contradicción flagged.

## 0. Resumen ejecutivo del wireframe

El wireframe **no mueve ni añade ninguna sección**. Cambios de tres tipos, todos quirúrgicos:
1. **Hero** — único cambio de layout estructural: columna derecha de "logo duplicado 380×380" (defecto) a "slot 380×380 intercambiable P/T". Resto del grid 55/45 idéntico.
2. **StatsStrip · Products · Values · Footer** — sin cambio de layout; cambios de contenido y de peso visual/motion dentro de las cajas existentes.
3. **CTA · Contact · Cart** — sin cambio de layout; inserciones dentro del chrome actual.

Cero secciones nuevas. Cero MAJOR flags de arquitectura.

## 1. Wireframe del Hero — 3 breakpoints (con gate aplicado)

**DESKTOP (≥1280px) — PROPUESTO**
```
┌──────────────────────────────────────────────────────────────┐
│ NAV sticky h72  ( logo 254×56 )·· Prod·Sobre·Contacto         │
│                                          [ES▾]·· [Ver tienda]··│
├──────────────────────────────────────────────────────────────┤
│ ░░ cream #fdf6f5 · MeshGradient OUT o reducido ⚠ (C4, Fase 4) ││
│ ┌─────────────── 55% ──────────────┐┌──────── 45% ─────────┐ ││
│ │ │ línea vert ·· EYEBROW ·· ·· ·· ·││ ┌── SLOT 380×380 ──┐ │ ││
│ │ === <h1> cita italic Playfair  ··││ │ PATH T (default): │ │ ││
│ │      — Yaya Mariana          ·· ·││ │  "Mágnum·Dream·   │ │ ││
│ │ ✚ línea var: Mágnum·Dream·1525   ││ │   1525" Playfair  │ │ ││
│ │ ── línea deco (kept) ──          ││ ├···················┤ │ ││
│ │ [Ver fresas →]·· [Historia →]·· ·││ │ PATH P (swap):    │ │ ││
│ └──────────────────────────────────┘│ │ ( foto 1:1 380² ) │ │ ││
│   ✕ chip trazabilidad — NO en Hero  │ └──────────────────┘ │ ││
│     (gate #3 → movido a Products)   └──────────────────────┘ ││
└──────────────────────────────────────────────────────────────┘
```

**MOBILE (<768px) — PROPUESTO (con hamburguesa, gate #2)**
```
┌──────────────────────────┐
│ NAV h72 (logo) [ES▾] [☰] │  ✚ HAMBURGUESA mínimo (gate #2)
├──────────────────────────┤     usa t.nav.menu (hoy sin usar)
│ │ eyebrow                 │
│ === <h1> cita italic      │  ← el titular pasa a <h1> real (H6)
│ — Yaya Mariana            │
│ ✚ línea variedades        │
│ ── deco ──                │
│ [Ver fresas →] full-w     │  ≥44px alto
│ [Historia →]              │
├──────────────────────────┤
│ ┌── SLOT 380×380 ───────┐ │  slot DEBAJO del texto (orden correcto)
│ │ Path T: bloque typo   │ │  Path T = ~0 coste LCP
│ └───────────────────────┘ │  Path P = imagen en critical path ⚠ (C3)
└──────────────────────────┘
```

*Justificación del único cambio de layout:* la columna derecha hoy renderiza `logo-nuevo.jpg` 380×380 — el mismo archivo que el logo del nav (`hero.tsx:102` y `:276`). Path T lo sustituye por el bloque tipográfico; el box 380×380 aspect 1:1 se conserva para que Path P entre como swap de asset sin tocar estructura.

Las restantes 8 secciones (StatsStrip, Products, AboutUs, Values, CTA, Contact, Footer, Cart) tienen sus wireframes de bloques ACTUAL→PROPUESTO en `phase-2.5-report.md §3`. Resumen: **ninguna cambia de layout** — solo contenido, peso visual/motion, o inserciones dentro del chrome.

## 2. Inventario de contenido — Hero (orden visual · token · heading · estado)

| # | Elemento | Token aprox. | Heading | Estado |
|---|---|---|---|---|
| N1 | Nav logo (imagen 254×56) | `image`, `priority` | — | MANTIENE |
| N2 | Nav links | `text-nav` 14px | — | MUEVE (incluir "Inicio" o anclar logo) |
| N3 | Selector idioma `[ES▾]` | `text-sm` 13px | — | MANTIENE (tap target ≥44px) |
| N4 | Botón "Ver tienda" | `button` primary sm | — | MANTIENE |
| N5 | **Hamburguesa móvil `[☰]`** | `button-icon` ≥44px | — | **AÑADE (gate #2)** |
| 1 | Eyebrow + línea vertical | `text-overline` 11px `text-brand` | — | MANTIENE (corregir CA→ES) |
| 2 | Titular — cita italic de Mariana | `text-h1` Playfair italic | **`<h1>`** | MANTIENE / **promover a `<h1>` real** (hoy `<p>`) |
| 3 | Atribución "— Yaya Mariana" | `text-h3` Playfair italic | — | MANTIENE |
| 4 | **Línea variedades** "Mágnum · Dream · 1525" | `text-body` Playfair | — | **AÑADE** (Beat-them #8) |
| 5 | Línea decorativa 60×3 | divisor | — | MANTIENE (opcional) |
| 6 | CTA primario "Ver fresas →" | `button` primary | — | MANTIENE |
| 7 | CTA secundario "Historia →" | `button` ghost | — | MANTIENE |
| 8 | **Slot central 380×380** P/T | `image-slot` 1:1 fijo | — | **AÑADE el slot** / **QUITA el logo duplicado** |
| — | ~~Chip trazabilidad~~ | — | — | **NO entra (gate #3 → Products)** |

Los inventarios completos de las otras 8 secciones se entregaron en el análisis del agente; se integran en el Development Briefing de Fase 4. Cambios clave: StatsStrip (numéricos craft), Products card (badge variedad + descriptor sensorial + chip finca/semana), AboutUs (slot retrato), CTA (micro-bloque cold-chain + bloque off-season), Contact (estado success sin emoji), Footer (press-strip + línea Capa B), Cart (i18n de strings).

## 3. Hint de animación por sección (alimenta a ui-designer)

Regla transversal: **toda animación de translate cae a opacity-only bajo `prefers-reduced-motion`; ninguna re-dispara en scroll-up; IntersectionObserver, nunca scroll-listeners.**

| Sección | Hint | Nota de restraint |
|---|---|---|
| Hero | Fade-up secuencial leve (eyebrow→h1→variedades→CTAs, ~80-100ms). Quitar entradas `x:±40`. Slot P/T: fade-in simple | MeshGradient animado ⚠ C4 |
| StatsStrip | Count-up más lento (~2200ms). Quitar `whileHover scale1.08 + brightness1.3` y `y:50 scale:0.9` | §5 #3: staging ruidoso junto al Hero |
| Products | Card: fade-up quieto, stagger ~80ms. Quitar `y:56`, shine infinito, ⚠ typewriter del título (C5) | uno quieto por card |
| AboutUs | Fade única (hoy `x:-60` → fade-up sutil) | "calm chapter" |
| Values | Fade-up por card, stagger ~80-100ms. Quitar `rotate-[10deg]` del icono | rotación juguetona, fuera de registro |
| CTA | Fade-up del bloque. Quitar `scale:0.85` del H2 ("pop" comercial) | — |
| Contact | Fade-in columnas (hoy `x:±80` → suavizar). Focus `scale:1.01` aceptable | — |
| Footer | Fade-up leve, stagger. `scale:0.8` del logo → fade-in simple | — |
| Cart | Drawer slide-in desde derecha (mantener — funcional). Reduced-motion: sin slide | el slide es navegación |
| #18 easter egg | Hover/long-press imagen Mágnum → 1s bloom de UN pétalo/hoja. Reduced-motion: omitir | DROP "yaya's hands bloom" |

## 4. Contradicciones detectadas (C1–C12) — estado post-gate

| ID | Contradicción | Ubicación | Estado |
|---|---|---|---|
| C1 | Emoji `✅` en estado success | `contact.tsx:146` | Confirmada → H2, Fase 4 |
| C2 | `target="_blank"` → `/checkout` | `products.tsx:286`, `about-us.tsx:42`, `cta.tsx:43`, `footer.tsx:121`/`:169` | Confirmada → C1, Fase 4 |
| C3 | Slots de imagen placeholder sin garantía no-CLS | Hero slot P, slot retrato AboutUs | Briefing Fase 4 exige `width/height`/`aspect-ratio` |
| C4 | Decoración (MeshGradient, dots, gradiente 3-stop) vs restraint #5 | `hero.tsx:168`, `products.tsx:369`, CTA | Diferida → Fase 4 visual-perfection |
| C5 | Typewriter del título vs registro homenaje | `products.tsx:330` | Diferida → Fase 4 ui-designer |
| C6 | Badge "Premium" vs badge de variedad | `products.tsx:246-263` | Resuelta: badge → variedad |
| C7 | Filtro `[Todas][Premium]` no filtra nada | `products.tsx:399-413` | **Resuelta — gate #4: por variedad** |
| C8 | Estado "Añadido" usa verde puro `bg-green-500` | `products.tsx:300` | Diferida → Fase 4 style-guide-enforcer |
| C9 | `<h2>` en header del drawer Cart | `cart.tsx:75` | Fase 4 accessibility-perfectionist |
| C10 | Sin navegación en móvil `<768px` | `hero.tsx:116`, `:147` | **Resuelta — gate #2: hamburguesa** |
| C11 | Logo footer remoto + links a dominio legacy | `footer.tsx:105` y links Empresa/Legal | Confirmada → H4, Fase 4 |
| C12 | El titular del Hero es `<p>`, no `<h1>` — la home no tiene `<h1>` | `hero.tsx` headline | **Confirmada en código → H6, Fase 4** |

## 5. Notas de cierre

- **Modo AUDIT respetado:** 9 secciones, orden y layout mantenidos. Único cambio estructural de layout = columna derecha del Hero (logo duplicado → slot P/T). Excepción autorizada por gate: hamburguesa móvil.
- **Slot Hero P/T:** Path T (bloque tipográfico) shippea como default; Path P (foto) entra después como swap de asset en el mismo box 380×380 aspect 1:1, sin cambio estructural.
- **Firewall narrativo:** sin expansión de "J. Elías", sin identidad de inversor, sin imagen IA de Mariana, sin vocabulario de marketing. El tributo se nombra en superficie pública solo en la línea "En memoria de Mariana" del Footer.
- **Construible:** un developer puede construir el layout propuesto desde §1 + el §3 del reporte consolidado. El Development Briefing completo + el Scroll Animation Map se entregan en Fase 4, tras las specs de `ui-designer`.
