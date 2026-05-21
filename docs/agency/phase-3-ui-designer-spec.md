# Fase 3 — UI Design Specification · Yaya Mariana
## Entregable del agente `ui-designer`
**Proyecto:** Yaya Mariana · rama `clasico` · modo AUDIT · Dirección B "En su Punto" · **Fecha:** 2026-05-21

---

## ⚑ RATIFICACIÓN DEL DIRECTOR (gate Nil — 2026-05-21)

Entregable del `ui-designer`. El gate de Nil ratificó 4 decisiones; donde haya divergencia manda el gate (ver `phase-3-report.md §2`):

1. Fase 3 — **APROBADA**.
2. **Typewriter del `<h2>` de Products → RETIRAR → fade-up estándar.** Resuelve el flag C-typewriter/§4.6 de este doc tal como el ui-designer recomendaba.
3. **Radius de botones → unificar a `--radius-lg` 8px** (todos). Resuelve el flag §7.1 de este doc.
4. **Inputs → fondo blanco (`--color-bg-surface`) + borde `--color-border-default`.** Enmienda §3.4 (que proponía fondo cream).

Decisiones menores ratificadas: `scale:1.01` del campo en focus → reducir a 0 (solo el ring de marca señala el foco); image-slots **sin radius** (`--radius-none`).

> **Nota de token:** los nombres canónicos son los de `design-system-manager` (`--color-brand-primary`, `--duration-*`). Los `--color-primary`/`--dur-*` de este doc resuelven igual vía el bridge shadcn. El easing por defecto coincide: `cubic-bezier(0.22,1,0.36,1)`.

---

## 1. Design Direction Brief

Yaya Mariana es un sitio-homenaje DTC de fresas premium que encarna la **Dirección B "En su Punto"**: restraint como reverencia — el registro museístico de Aesop y Buly 1803, el héroe-tipográfico de Le Fruit Studio, la disciplina de 2 colores de Farm Minerals. El sistema lleva su calidez en el lienzo (cream rosado), no en el ruido: el rojo carmín está **racionado a casi-escasez** — aparece donde el ojo debe aterrizar (la fruta, un CTA por pantalla, el badge de variedad) y en ningún otro sitio. Tres cualidades de interacción heredadas: **(1) motion al borde de la percepción** — se siente, no se mira; **(2) jerarquía por escala y espacio**, no por peso ni color; **(3) la transacción no rompe la calma**. Restricción dura: esto es homenaje, no marketing — si una micro-interacción parece un anuncio de Instagram, está mal; `prefers-reduced-motion` es obligatorio.

---

## 2. Inventario de componentes (lo que el sitio REALMENTE tiene)

Auditado contra los 11 `.tsx` reales. **Modo AUDIT: cero componentes inventados.** El sitio no tiene design system formal — los 11 componentes hardcodean hex inline; no existe `Input`/`Badge`/`Card` como primitiva. El `button.tsx` de shadcn **existe pero no lo usa ningún componente de UI**.

**Primitivas:** Button primario/ghost/icon-only (Required, inline — no usan `button.tsx`) · `button.tsx` shadcn (Optional, no se activa en AUDIT) · Input/Textarea (Required) · Checkbox (Conditional — solo consent waitlist) · Badge variedad (Required) · Chip trazabilidad (Required) · Icon set SVG inline (Required, se conserva) · Divider (Required) · Spinner (Conditional — solo con backend) · Selector idioma (Required) · Image slot (Required).

**Composites:** Nav desktop (Required) · **Nav móvil + hamburguesa (Required — único componente nuevo, decisión #2 de Fase 2.5)** · Product Card (Required) · Carousel (Required) · Cart drawer+FAB (Required) · Form Contact (Required) · Modal genérico (no se crea — el Cart drawer es el único patrón modal) · Toast (Conditional — M7, a validar QA).

**Secciones:** las 9 ratificadas, orden y layout intactos.

---

## 3. Especificación visual por estado

### 3.1 Button — Primario
Usado en Hero/Nav/AboutUs/CTA/Products/Cart.
- **Default:** bg `--color-brand-primary` `#962a1f` · texto blanco (AA 7.93:1) · `text-sm` 14px · `weight 600` · padding `13px 28px` / `10px 20px` (nav) · **radius `--radius-lg` 8px (decisión #3)** · sin shadow. Reemplaza el gradiente `#c0392b→#e74c3c` por rojo plano.
- **Hover:** `background --dur-fast --ease-out` · bg → `--color-brand-pressed` `#7a1f17` · **sin scale, sin glow, sin flecha deslizante**.
- **Focus:** `outline 2px solid --color-brand-primary` · `offset 2px`.
- **Active:** `--dur-instant` · `translateY(1px)`.
- **Disabled:** `opacity 0.45` · `not-allowed` · `pointer-events:none`.
- **Loading** (solo con backend): spinner 16px + "Enviando…" · ancho fijado (anti-shift).

### 3.2 Button — Ghost / Secundario
Hero "Historia", AboutUs, CTA, Products "Ver más".
- **Default:** bg transparente · texto `--color-brand-primary` **sólido** (nunca opacidad — H-6) · `weight 600` · subrayado 2px oculto (`scaleX:0`).
- **Hover:** subrayado `scaleX:0→1` desde la izquierda · **sin `x:+4`, sin cambio de opacity**.
- **Focus:** `outline 2px` · `offset 3px`. **Active:** `opacity 0.7`. **Disabled:** `opacity 0.4`.

### 3.3 Button — Icon-only
Flechas carousel, cerrar Cart, ±cantidad, hamburguesa.
- **Default:** hit-area **44×44px** (superficie visible puede ser menor) · bg `--color-bg-surface` 85% (carousel) o transparente (Cart) · icono `--color-brand-primary`.
- **Focus:** `outline 2px` · `offset 2px`. Las flechas del carousel deben ser focusables y **visibles en touch** permanentemente.
- **Active:** `opacity 0.8`. **Disabled:** `opacity 0.35`.

### 3.4 Input / Textarea — Form de Contact
**Decisión #4: fondo blanco.**
- **Default:** bg `--color-bg-surface` **blanco** · borde `1px solid --color-border-default` `#d8b8b4` · radius `--radius-input` 12px · texto `--color-text-primary` · placeholder `--color-text-muted` (H-5: hoy `/35` 1.81:1 FAIL → 9.09:1). Textarea: `rows=4`, `resize:none`.
- **Label:** `text-caption` 12px · `weight 600` · `--color-text-secondary` **sólido** (H-3: hoy `/60` 3.02:1 FAIL → 10.94:1) · uppercase · `letter-spacing 0.06em`.
- **Hover:** borde → tono de marca. **Focus:** borde `1.5px --color-brand-primary` + `box-shadow 0 0 0 3px rgba(150,42,31,0.18)` (ring de marca). **El campo NO escala** (decisión menor ratificada: el `scale:1.01` del `FocusField` se reduce a 0).
- **Error:** borde `1.5px --color-error` · mensaje debajo en `--color-error` + icono SVG (no solo color).
- **Disabled:** `opacity 0.5` · `not-allowed`.

### 3.5 Checkbox — Consent waitlist off-season (CTA, M5)
Nuevo, condicional. **Desmarcado por defecto (HARD, brief).** Caja 18×18px · borde `1.5px --color-border-default` · radius `--radius-sm` 4px · hit-area ≥44px. Checked: bg `--color-brand-primary` + check SVG blanco. Focus `outline 2px`.

### 3.6 Badge de variedad — reemplaza "Premium" (Beat-them #1)
Texto = variedad en mayúsculas (`MÁGNUM`/`DREAM`/`1525`) · 10–11px · `weight 700` · `letter-spacing 0.12em` · color `--color-brand-primary` · bg blanco 92% + blur · pill · shadow `--shadow-sm`. **Shine una sola vez** al entrar en viewport (hoy `repeat:Infinity`). Reduced-motion: shine eliminado.

### 3.7 Chip de trazabilidad — finca/semana/variedad (decisión #3 de Fase 2.5)
Aterriza en la Product Card. Registro footnote: 11px · `weight 500` · `--color-text-muted` sólido · icono pin 12px · sin radius de píldora, sin shadow — es texto, no botón. **Sin estados interactivos.**

### 3.8 Icon set + Divider
Set SVG inline custom (viewBox 24, stroke 1.5–1.8, linecap round) — **se conserva**, es sobrio y coherente. Stroke 1.5 decorativo / 1.8 funcional. Color por contexto. **El `#e74c3c` de StatsStrip/CTA → `--color-brand-primary`** (H-7). Divider: línea deco Hero 60×3 `--color-brand-primary`; hairlines `1px --color-border-subtle`.

### 3.9 Spinner — condicional
Solo si Fase 4 conecta backend: círculo 16–20px, `1.2s linear`, **omitido bajo reduced-motion** → texto "Enviando…" estático.

### 3.10 Selector de idioma
Trigger `ES/CA/EN` 13px + chevron · **hit-area ≥44px** (L2). Hover → `--color-brand-primary`. Focus `outline 2px`. Menú: panel blanco · borde · radius `--radius-lg` · shadow `--shadow-dropdown` · entrada fade + `y:-6→0`; reduced-motion solo fade. Ya implementa ARIA correcto — conservar.

### 3.11 Image slot (Hero 380×380 + retrato AboutUs)
- **Hero — Path T (default):** caja **380×380 aspect-ratio 1:1 fijo** reservado (anti-CLS) · bloque tipográfico "Mágnum · Dream · 1525" Playfair · bg `--color-bg-base`/`subtle` · **sin radius** (`--radius-none`, decisión menor) · sin shadow.
- **Hero — Path P (swap):** misma caja 380×380, intercambia el bloque por `<Image>` 1:1 `object-fit:cover`, sin filtro.
- **Retrato AboutUs:** placement inline junto al blockquote (menor cambio de layout). Fallback ilustración minimal o tipografía — **NUNCA imagen IA de Mariana**. aspect-ratio reservado.
- **Entrada:** fade-in `--dur-slow --ease-out`. Sin scale, sin parallax.

### 3.12 Nav bar (desktop)
Sticky h72 · bg blanco · borde inferior `--color-border-subtle` · shadow `--shadow-nav`. Link: 14px `weight 500` `--color-text-primary` + subrayado oculto. Hover: subrayado `scaleX:0→1` desde la izquierda · **se elimina el `y:-2` y el cambio de color**. Focus `outline 2px offset 4px`. Activo: subrayado fijo.

### 3.13 Nav móvil + hamburguesa — único componente nuevo (decisión #2 de Fase 2.5)
Botón hamburguesa icon-only 44×44 · visible solo `<768px`. Abierto: panel bg blanco con ítems de `t.nav.menu` (hoy sin usar) — `label`+`subtitle`, cada uno hit-area ≥44px, incluye selector de idioma y "Ver tienda". Transición: backdrop fade `--dur-fast` + slide del panel `--dur-normal --ease-out`; reduced-motion solo fade. Focus: al abrir foco al primer ítem, `Esc` cierra, focus-trap. Hamburguesa `aria-expanded`+`aria-controls`+`aria-label`.

### 3.14 Product Card
- **Default:** bg blanco · radius `--radius-card` 16px · shadow `--shadow-card` (sombra **neutra**, no la roja `rgba(192,57,43,...)` actual) · padding cuerpo 20px. Contiene carousel, badge variedad, `<h3>` = "Fresas Mágnum/Dream/1525" (rename SEO C4), descriptor sensorial, chip trazabilidad, precio, botón ghost "Ver más", botón primario "Añadir".
- **Hover:** `box-shadow --dur-normal --ease-out` · `--shadow-card → --shadow-card-raised` · `translateY(-4px)` (hoy `y:-8` + sombra roja enorme → lift discreto + sombra neutra). La línea de acento inferior `scaleX:0→1` se conserva, gradiente rojo→naranja → rojo plano.
- **Focus-within:** `outline 2px offset 3px`.
- **Easter egg #18:** hover/long-press imagen Mágnum → bloom de UN pétalo/hoja, 1s, una vez. Reduced-motion: omitido. DROP "yaya's hands bloom".

### 3.15 Carousel
4 imágenes `object-fit:cover`, `h-60`. Transición slide: fade + `x:±28` `--dur-normal`. **Auto-rotate 3s gateado en touch (`hover:none`) + reduced-motion.** Parallax mouse-move conservado solo desktop puntero-fino, eliminado en touch + reduced-motion. Flechas §3.3 visibles en touch, hit-area 44px. Dots focusables.

### 3.16 Cart drawer + FAB + badge
- **FAB:** fixed `bottom-6 right-6` · 56×56 · bg `--color-brand-primary` **plano** (hoy gradiente) · icono blanco · shadow `--shadow-xl`. Hover: shadow sube · **sin scale**. Focus `outline 2px --color-text-primary offset 3px`.
- **Badge contador:** círculo blanco/rojo, entra `scale:0→1`; reduced-motion sin scale.
- **Drawer:** panel `right:0` full-height `max-w-22rem` · bg blanco · shadow `--shadow-modal`. **Slide-in desde la derecha SE CONSERVA** (es navegación). `handleCheckout` ya hace `router.push` misma pestaña → NO tocar.
- **a11y:** `role="dialog"` + `aria-modal` + focus-trap + `Esc` (M7/C9).
- **Backdrop:** `bg-black/30 blur`, fade.
- **Empty state:** icono cesta 48px + texto i18n. Se conserva.
- **i18n:** todos los strings ES hardcoded → `translations.ts` (C3).
- **Reduced-motion:** drawer sin slide → fade.

### 3.17 Toast — condicional, a validar QA (M7)
Si QA elige toast en el primer add-to-cart: bg blanco, borde, radius `--radius-lg`, shadow `--shadow-md`, icono check SVG `--color-success` (no emoji), auto-dismiss 3–4s, entrada fade + `y:+12`; reduced-motion solo fade. **Recomendación:** auto-abrir el sheet es más quieto que un toast para Dirección B — decisión de QA/conversion.

### Estado de éxito de Contact — sin emoji (C-emoji/H-8)
El `✅` de `contact.tsx:146` → círculo `--color-success-surface` + check SVG `--color-success` (patrón de `checkout.tsx`). Copy interino "te leeremos pronto" hasta Resend (H2, Bandera D).

---

## 4. Sistema de motion — restrained

**Filosofía:** el motion se siente, no se mira. Tres trabajos legítimos: revelar, confirmar, orientar. Nada de spring/bounce/pop/glow/loops infinitos/typewriter.

**Easing:** `--ease-out cubic-bezier(0.22,1,0.36,1)` (por defecto, el que el build ya usa) · `--ease-in-out cubic-bezier(0.4,0,0.2,1)` (drawer/menú) · `--ease-in` (salidas). **Spring/bounce PROHIBIDO** — el `type:"spring"` del drawer y el parallax → `ease-out` con duración.

**Duración:** instant 100ms · fast 200ms · normal 320ms · slow 600ms · **countup 2200ms** (hoy 1400ms — lento lee como "calma").

**Scroll-animation por sección** (IntersectionObserver siempre, `once:true`, translate cae a opacity-only bajo reduced-motion):

| Sección | Efecto | Cambio respecto al build |
|---|---|---|
| Hero | Fade-up secuencial eyebrow→h1→variedades→CTAs, stagger 80–100ms, `translateY 16px` | Elimina entrada `x:±40` de columnas |
| StatsStrip | Fade-up por stat + count-up 2200ms, stagger 80ms | Elimina `y:50 scale:0.9` y `hover scale:1.08 brightness:1.3` |
| Products | Card fade-up, stagger 80ms, `translateY 16px` | Elimina `y:56`, shine infinito → once, **typewriter del `<h2>` → fade-up (decisión #2)** |
| AboutUs | Fade-up sutil, una entrada | Elimina `x:-60` |
| Values | Fade-up por card, stagger 80–100ms | Elimina `scale:0.92` y el `rotate-[10deg]` del icono en hover |
| CTA | Fade-up del bloque | Elimina `scale:0.85` del `<h2>` |
| Contact | Fade-in 2 columnas | Elimina `x:±80` |
| Footer | Fade-up leve, stagger 100ms | Elimina `scale:0.8` del logo |

**Distancia uniforme 12–16px** (hoy 40–80px — un movimiento amplio lee como anuncio).

**Micro-interacciones:** hover de botón solo `background` · click `translateY(1px)` · nav-link subrayado desde la izquierda · card lift 4px + sombra · parallax solo desktop puntero-fino · focus de campo ring de marca **sin escalado** · badge shine una pasada · count-up 2200ms · add-to-cart confirm con check SVG (`bg-green-500` → `--color-success`, diferido a Fase 4) · drawer/menú slide conservado · easter egg 1 pétalo 1s.

**Decisión #2 aplicada — typewriter retirado:** el `<h2>` de Products usa el mismo fade-up de heading que el resto de secciones. Sin loop de cursor, sin micro-CLS, `<h2>` SEO real desde el primer frame.

**Bloque `prefers-reduced-motion`** (a materializar en `globals.css`):
- **Se ELIMINA:** MeshGradient animado · count-up (muestra valor final) · shine del badge · parallax · auto-rotate · easter egg.
- **Se REDUCE a opacity-only:** scroll-reveals · drawer y menú móvil (fade, sin slide) · dropdown idioma · badge contador (sin scale).
- **Se CONSERVA:** transiciones de color en hover/focus · el focus ring NUNCA se elimina.
- **Crítico:** count-up, parallax, auto-rotate, MeshGradient son **JS, no CSS** — cada componente debe leer `matchMedia('(prefers-reduced-motion: reduce)')` y **no montar** la lógica de motion (Fase 4).

---

## 5. Sistema de spacing & grid

**Spacing base-4:** `--space-1..24` (4–96px). Padding componentes `--space-3/5` · gap de grid `--space-6` (24px) · margin entre bloques `--space-4/6/8` · section padding `--space-20` desktop / `--space-16` tablet / `--space-12` móvil.

**Grid alineado a los breakpoints Tailwind que el build ya usa** (`sm 640 · md 768 · lg 1024 · xl 1280`):
- **Desktop (≥1024px):** max content 1152px (`max-w-6xl`) · gutter `--space-12` · Product grid 3-col · Hero split 55/45.
- **Tablet (768–1023):** gutter `--space-8` · Product grid 2-col · Hero 55/45 hasta `md`.
- **Móvil (<768):** gutter `--space-6` · Product grid 1-col · StatsStrip 2×2 · Hero apilado (texto arriba, slot abajo) · botones full-width ≥44px alto.

> El build no tiene grid de 12 columnas formal — usa CSS grid por sección + contenedores `max-w-*`. En AUDIT no se impone un grid maestro: se documenta el sistema real.

---

## 6. Shadow & border-radius

**Shadow — sobrias, neutras** (corrige las sombras teñidas de rojo `rgba(192,57,43,...)` del build, que eran decoración):
```
--shadow-none / --shadow-sm / --shadow-md / --shadow-lg / --shadow-xl / --shadow-2xl
```
Card default `sm` → hover `md` · nav `sm` · dropdown `md` · menú móvil `lg` · FAB `xl` → hover `2xl` · drawer `2xl`. Inputs en focus NO usan shadow de elevación — usan el ring de marca.

**Radius:** `--radius-none/sm/md/lg/xl/2xl/full`. **Botones → `--radius-lg` 8px TODOS (decisión #3).** Product Card `2xl` 16px · Input `xl` 12px · **image-slots `--radius-none`** (decisión menor) · badge/chip `full` · iconos circulares `full`.

---

## 7. Flags y handoff

**Contradicciones — estado post-gate:**
| ID | Estado |
|---|---|
| C-typewriter / C5 | **RESUELTA — decisión #2: retirar → fade-up** |
| Radius de botón inconsistente | **RESUELTA — decisión #3: unificar a 8px** |
| `scale:1.01` campo en focus | Resuelta: reducir a 0 (refinamiento) |
| C-deco | Diferida a Fase 4 (visual-perfection) — el MeshGradient debe gatearse bajo reduced-motion |
| C-green | Diferida a Fase 4 (style-guide-enforcer) → `--color-success #15803d` |

**Coordinación con design-system-manager:** ui-designer define qué componente usa qué token y en qué estado; design-system-manager codifica los tokens en `globals.css`. Nombres de token canónicos = los de design-system-manager.

**Trazabilidad:** todo cambio respecto al build traza a un wireframe de Fase 2.5, un dolor de Fase 1 (`H-1`–`H-9`), o el tono homenaje. Cero componentes inventados — los 3 elementos nuevos (hamburguesa, checkbox consent, chip trazabilidad) están autorizados por una decisión del gate o un punto del Beat-them.

**Hard rules:** firewall narrativo respetado (slot AboutUs admite solo foto consentida / ilustración / tipografía — nunca IA de Mariana); cero vocabulario de marketing; `prefers-reduced-motion` obligatorio; AA verificado contra el cream real; ningún fichero de `src/` tocado.
