# Fase 1.5 — Color Validation · Yaya Mariana
**Track:** Color validation (AUDIT mode)
**Agente:** color-psychologist
**Proyecto:** Yaya Mariana — sitio HOMENAJE a la abuela de Nil (no marketing)
**Branch:** `clasico` · Beat-them plan #5 (disciplina 2-color) + #10 (audit contraste vs cream)
**Fecha:** 2026-05-21
**Modo:** Validar y refinar la paleta existente — NO inventar paleta nueva.

> Este documento es deliverable de estrategia. NO se edita código de proyecto aquí.
> Owners de implementación: visual-perfection + style-guide-enforcer + accessibility-perfectionist en Fase 4 / 4.5.

---

## 0. Resumen ejecutivo (para el director)

- La paleta **cream `#fdf6f5` + strawberry-red** es **psicológicamente correcta** para esta marca, pero tal y como está embarcada el rojo está calibrado en registro **promocional/apetito** (rojo bombero saturado), no en registro **homenaje**. Se valida la paleta y se recomienda **de-escalar el rojo**, no sustituirlo.
- **Hallazgo crítico de código:** la paleta de marca NO vive en `globals.css`. El archivo `globals.css` sigue siendo el tema neutro por defecto de shadcn (`oklch(1 0 0)` blanco puro, gris neutro, sin cream, sin rojo). **Todos los colores de marca están hardcodeados inline en los 11 componentes.** Esto es exactamente la deuda que el Beat-them #5 ("disciplina 2-color en globals.css") debe pagar: hoy no hay tokens, hay 1 paleta dispersa en literales hex.
- **Bug recurrente confirmado de nuevo** (La Nonna Phase-8): hay contraste calculado/asumido contra blanco, pero el lienzo real es cream. Recalculado todo contra `#fdf6f5`.
- **WCAG: 8 familias de fallo AA encontradas en el código actual** — casi todas por **texto con opacidad** (`/65`, `/60`, `/50`, `/40`, `/35`). El color base pasa; la opacidad lo hunde por debajo de 4.5:1. Detalle en §5.
- **Violación de HARD RULE D (no emoji):** `contact.tsx:146` renderiza el emoji `✅` en el success state del formulario de contacto. Debe sustituirse por marca de check SVG + texto (el checkout ya lo hace bien con SVG).

---

## 1. Validación psicológica — cream + strawberry-red para una marca tributo

### 1.1 La tensión central: rojo es la convención del apetito

El rojo es el color-convención del sector alimentación (ref. tabla del role spec: *Red → energía, urgencia, pasión, apetito → food, retail*). Para una marca de fresa es a la vez **inevitable y peligroso**:

- **Inevitable:** la fresa *es* roja. Negar el rojo sería negar el producto. Un sitio de fresa premium en azul o verde leería como disonante o como "tech disfrazada de granja".
- **Peligroso:** el rojo de food-marketing por defecto (rojo saturado, alto croma, tendencia naranja) dispara **apetito + urgencia + descuento**. Es el rojo del "OFERTA", del botón "COMPRAR YA", de la cadena de comida rápida. Ese registro **contradice directamente la HARD RULE A** (homenaje, dignidad, herencia tranquila).

**El movimiento no es abandonar el rojo. Es elegir *qué* rojo.** El rojo tiene un eje interno:

```
  rojo promocional  ───────────────────────────────  rojo herencia
  (apetito, urgencia, venta)                          (calidez, memoria, artesanía)
  ↑ alto croma                                        ↑ croma medio
  ↑ luminosidad alta-media                            ↑ luminosidad media-baja
  ↑ matiz hacia naranja (~25-30°)                     ↑ matiz hacia carmín/tierra (~12-20°)
  #e74c3c, #ff3b30                                    #962a1f, #7a1f17, terracota
```

La fresa madura real no es rojo bombero: es un rojo **profundo, ligeramente apagado, con cuerpo** — más cercano a la mermelada casera, al carmín, a la fruta de verdad recogida en su punto que al rojo de packaging. Ese rojo profundo es además el que mejor evoca **lo guardado, lo conservado, la víspera** — el vocabulario tonal de Fase 1 (§2 del phase-1-report: *guardaba, escogía, la paciencia*).

**Veredicto:** cream + strawberry-red se **valida** como par cromático. El cream hace el 90% del trabajo de dignidad: es el lienzo cálido, callado, de mantel de lino y luz de tarde. El rojo debe **bajar un punto de saturación y un punto de luminosidad** para pasar de "rojo de góndola" a "rojo de fruta cultivada con calma". El cream perdona; el rojo es donde se gana o se pierde el tono.

### 1.2 Diagnóstico del rojo actualmente embarcado

El código usa **dos rojos a la vez** sin jerarquía clara:

| Hex | Uso en código | Lectura psicológica |
|---|---|---|
| `#c0392b` | Color de marca dominante (links, eyebrows, botones, iconos, bordes) | Rojo ladrillo-tomate. Aceptable, ligeramente promocional pero con cuerpo. El más usado, ~40+ apariciones. |
| `#e74c3c` | Acento "light" en gradientes, focus rings, hover, blockquote border, icono CTA | **Rojo bombero.** Alto croma, matiz hacia naranja. Este es el rojo "OFERTA". Es el que más empuja hacia el registro de marketing. |

El problema no es que `#e74c3c` exista — es que se usa como **segundo color de marca de facto**, en gradientes visibles y en bordes decorativos. Eso rompe la disciplina 2-color (Beat-them #5: la paleta es *un* rojo + neutro, no dos rojos) **y** sube el termostato hacia promocional. Los gradientes `#c0392b → #e74c3c` leen como botón de e-commerce de conversión, no como homenaje.

### 1.3 El cream `#fdf6f5` — confirmado

`#fdf6f5` = RGB(253, 246, 245). Es un cream **rosado-cálido** (el rojo y verde casi igualados, azul ligeramente más bajo → temperatura cálida con un susurro de rosa). Es exactamente el lienzo correcto: más cálido que un blanco roto neutro, sin llegar al amarillo de "vintage" forzado. Evoca lino crudo, papel de carta, nata. **Se confirma sin cambios.** Es el héroe silencioso de la paleta.

> Nota cromática para typography-master e image-curator: el cream tiene un tinte rosa. Los grises neutros puros (los de `globals.css` por defecto) se verán *fríos y sucios* sobre él. Todo neutro de esta marca debe ser un neutro **cálido** (ver §3, el near-black `#1a0808` ya lo es correctamente).

---

## 2. Color Directions — Yaya Mariana

Per el Palette Proposal Format del role spec. **Esto es AUDIT:** las tres direcciones comparten el mismo cream y el mismo near-black; **solo difiere el matiz del rojo de marca.** No son tres marcas — son tres calibraciones del mismo gesto.

### Direction A — "Fresa en su punto" (carmín profundo)
La fresa Mágnum recogida la víspera, no la fresa de cartel. Rojo profundo de fruta madura, croma medio, matiz carmín — pesa, no grita.
Primary: `#962a1f` strawberry carmine
Secondary: *(ninguno — disciplina 2-color estricta)*
Accent: `#7a1f17` deep strawberry (solo superficies oscuras: StatsStrip, CTA band, Footer)
Neutral base: `#1a0808` warm near-black · Canvas: `#fdf6f5` cream
*Por qué encaja:* es el rojo más alejado del registro promocional sin perder identidad de fresa. Pasa AA body sobre cream con holgura (7.43:1) y permite texto blanco encima (7.93:1). Es el rojo de la mermelada de la abuela, no del packaging. Máxima compatibilidad con el tono homenaje.

### Direction B — "Ladrillo cálido" (terracota-leaning, refinamiento mínimo del actual)
Mantiene el ladrillo-tomate actual `#c0392b` pero lo arrastra ~medio paso hacia terracota y lo oscurece lo justo para cruzar AA. Cambio más conservador respecto a lo embarcado.
Primary: `#a52f23` warm brick
Secondary: *(ninguno)*
Accent: `#7a1f17` deep strawberry
Neutral base: `#1a0808` · Canvas: `#fdf6f5`
*Por qué encaja:* es el delta mínimo respecto al código actual — el cliente que ya vio el `clasico` apenas notará un cambio de identidad, solo "se ve más asentado". Hereda el ADN terracota validado en La Nonna (memoria de agencia: terracota+cream funcionó). Pasa AA body sobre cream (6.49:1).

### Direction C — "Carmín heritage" (rojo más frío, más sobrio)
Rojo carmín tirando ligeramente a frío/vino — el registro más solemne, más cercano a memorial.
Primary: `#8f2433` heritage crimson
Secondary: *(ninguno)*
Accent: `#5e1722` wine-dark
Neutral base: `#1a0808` · Canvas: `#fdf6f5`
*Por qué encaja:* el rojo más digno y quieto de los tres. Riesgo: un carmín frío sobre fresa puede leer como **vino o cereza**, no fresa — empuja el producto hacia "otra fruta" y se aleja del rojo cálido natural de la Mágnum. Demasiada solemnidad puede tirar el tono de "homenaje cálido" a "funerario".

**Recomendado:** **Direction A — "Fresa en su punto" (`#962a1f`)**

**Reasoning:** Es el único de los tres que resuelve las dos restricciones a la vez sin sacrificar ninguna. (1) De-escala el rojo del registro promocional al de fruta-real-cultivada-con-calma — cumple HARD RULE A — manteniéndose inequívocamente *rojo fresa* cálido (a diferencia de C, que deriva a vino). (2) Pasa WCAG AA para texto de cuerpo sobre cream con margen real (7.43:1), lo que elimina de raíz la familia de fallos de contraste del código actual sin necesitar workarounds. (3) Respeta el AUDIT mode: es un refinamiento del rojo existente, mismo gesto cromático, no una marca nueva. B es el plan de contingencia si el cliente quiere el cambio más invisible posible respecto al `clasico` que ya conoce.

---

## 3. Color Token Spec — paleta recomendada (Direction A)

Per el Color Token Spec Format del role spec. **Disciplina 2-color estricta (Beat-them #5):** 1 cream + 1 strawberry-red + 1 neutro cálido. El "accent" oscuro NO es un tercer color de marca — es el mismo rojo llevado a su extremo oscuro para superficies inmersivas (no introduce un matiz nuevo).

> Acción de implementación (Fase 4, owner visual-perfection + style-guide-enforcer):
> estos tokens deben **vivir en `globals.css`** y los 11 componentes deben dejar de hardcodear hex.
> Hoy `globals.css` es el tema shadcn por defecto y no contiene NADA de esta paleta.

```css
/* Design tokens — Yaya Mariana */
/* Generated by color-psychologist · Fase 1.5 · Direction A "Fresa en su punto" */

:root {
  /* === Canvas (confirmado, sin cambios) === */
  --color-cream:            #fdf6f5;  /* cream rosado-cálido — lienzo dignidad */
  --color-cream-sunk:       #fdf0ef;  /* cream un punto más hondo — secciones alt (Values, chips contacto) */

  /* === Brand — strawberry-red (1 solo color, de-escalado a registro homenaje) === */
  --color-primary:          #962a1f;  /* strawberry carmine — fruta madura, NO rojo promocional */
  --color-primary-light:    #b5341f;  /* hover / estados activos — usar SOLO en superficie (botón), nunca como texto de cuerpo sobre cream */
  --color-primary-dark:     #7a1f17;  /* deep strawberry — superficies oscuras inmersivas, pressed states */

  /* === Neutral cálido (1 solo neutro de marca) === */
  --color-ink:              #1a0808;  /* warm near-black — todo texto principal y titulares */
  --color-ink-soft:         #5a2a2a;  /* warm brown — texto secundario; reemplaza el patrón #7a3a3a-con-opacidad */
  --color-ink-muted:        #6e3232;  /* warm brown claro — metadatos, captions; AA body real sin opacidad */

  /* === Superficies oscuras (mismo rojo, no color nuevo) === */
  --color-surface-deep:     #5c1a1a;  /* StatsStrip — deep maroon, hereda del código actual, ya pasa */
  --color-surface-footer:   #2d0a0a;  /* Footer — near-black rojizo, hereda del código actual, ya pasa */

  /* === Líneas y bordes === */
  --color-border:           #ead7d4;  /* hairline cálido sobre cream — sustituye #f5c6c2 cuando deba SER visible */
  --color-border-strong:    #d8b8b4;  /* bordes de input / divisores con función real */

  /* === Semantic Colors (calibrados para NO pelear con el rojo de marca) === */
  --color-success:          #15803d;  /* verde profundo — AA body sobre cream (4.70:1) */
  --color-success-surface:  #e7f3ea;  /* fondo suave de éxito */
  --color-warning:          #92400e;  /* ámbar-tierra — NO ámbar amarillo (chocaría); AA body (6.64:1) */
  --color-warning-surface:  #f6ecdf;
  --color-error:            #b91c1c;  /* rojo de error — ver nota §4 sobre diferenciarlo del rojo de marca */
  --color-error-surface:    #f7e3e3;
  --color-info:             #1d4ed8;  /* azul info — único no-cálido permitido, solo micro-uso UI */
  --color-info-surface:     #e4eafc;

  /* === Semantic Assignments === */
  --color-background:       var(--color-cream);
  --color-surface:          #ffffff;        /* product cards — blanco puro sobre cream, intencional */
  --color-text-primary:     var(--color-ink);
  --color-text-secondary:   var(--color-ink-soft);
  --color-text-muted:       var(--color-ink-muted);
  --color-link:             var(--color-primary);
  --color-on-primary:       #ffffff;        /* texto sobre botones rojos — blanco, AA verificado */
  --color-on-deep:          #fdf6f5;        /* texto sobre superficies oscuras — cream, no blanco puro */
}
```

**Dark mode:** NO se especifica. El `clasico` no expone toggle de tema y un sitio-homenaje de fresa de temporada vive en luz cálida diurna por diseño. El bloque `.dark{}` por defecto de shadcn en `globals.css` está **muerto** (ningún color de marca lo usa) — recomendación: el style-guide-enforcer puede eliminarlo en Fase 5 para no dejar tokens fantasma. Fuera de scope de este track.

### Notas de de-escalado (cómo `#962a1f` baja el termostato)
- vs `#e74c3c` (rojo bombero actual): croma reducido y matiz girado de ~25° (naranja) hacia ~13° (carmín). Sale del registro "OFERTA".
- vs `#c0392b` (ladrillo actual): luminosidad bajada lo justo para cruzar AA body sobre cream y ganar peso de "fruta madura".
- **Eliminar los gradientes `#c0392b → #e74c3c`.** Un botón homenaje es de color plano o, como mucho, un gradiente rojo→rojo-oscuro del mismo matiz (`--color-primary → --color-primary-dark`). El gradiente rojo→naranja es la firma visual del e-commerce de conversión.

---

## 4. Semantic colors — que no peleen con el rojo de marca

El conflicto obvio: **el error de sistema es rojo y la marca es roja.** Si no se gestiona, un mensaje de error de formulario se camufla con el branding o, peor, el branding se lee como una alerta de error permanente.

| Token | Hex | Cómo se separa del rojo de marca |
|---|---|---|
| success | `#15803d` | Verde profundo. Sin conflicto. AA body sobre cream 4.70:1. |
| warning | `#92400e` | Ámbar-**tierra** (no amarillo). Cálido, convive con la paleta; no introduce un color frío chillón. AA body 6.64:1. |
| error | `#b91c1c` | Rojo, pero **deliberadamente más frío, más oscuro y más saturado** que `#962a1f`. La diferenciación NO puede descansar solo en el matiz — debe reforzarse con: (a) icono SVG, (b) borde + fondo `--color-error-surface`, (c) peso de texto. Regla: **el rojo de marca nunca aparece sobre `--color-error-surface` y el error nunca aparece como link/eyebrow.** Contextos siempre distintos. |
| info | `#1d4ed8` | Azul. Es el único color frío de todo el sistema — por eso restringido a micro-UI (tooltips, badges informativos). No debe aparecer en superficies grandes o rompería la calidez homenaje. |

### Success state — color + texto, SIN emoji (HARD RULE D)
El proyecto prohíbe emoji **incluido en estados de éxito**. El success state se construye solo con color y forma vectorial:
- Marca de check **SVG** (stroke `--color-success`), nunca el emoji `✅`.
- Fondo `--color-success-surface`, texto en `--color-ink` (titular) + `--color-ink-soft` (cuerpo).
- El color hace la señal positiva; el texto la confirma. Ningún glifo emoji.
- **El checkout (`checkout.tsx`) ya lo hace bien** — usa un `<path d="M20 6L9 17l-5-5"/>` SVG. Es el patrón a replicar.
- **`contact.tsx:146` lo hace MAL** — usa `✅`. Ver §5, fallo H-8. Debe migrar al patrón del checkout.

---

## 5. Auditoría WCAG AA completa — contra el lienzo real `#fdf6f5`

> **Bug recurrente prevenido** (global-memory, La Nonna Phase-8): todo ratio se calcula contra el cream `#fdf6f5` real, NUNCA contra `#FFFFFF`. El delta cream-vs-blanco para el rojo es ~0.34 — suficiente para empujar un valor "borderline" al lado equivocado.

Umbrales (role spec): cuerpo <18pt → **4.5:1** · texto grande / negrita ≥14pt → **3:1** · componentes UI → **3:1**.

### 5.1 Colores base sólidos sobre cream — PASAN

| Color | Uso | Ratio vs cream | Veredicto |
|---|---|---|---|
| `#1a0808` near-black | titulares, texto principal | 18.18:1 | PASS holgado |
| `#7a3a3a` @100% | texto de blockquote (sólido) | 7.89:1 | PASS |
| `#962a1f` primary (recomendado) | links, eyebrows, texto de marca | 7.43:1 | PASS |
| `#c0392b` (rojo actual) | links, eyebrows, texto de marca | 5.10:1 | PASS (justo) |
| `#7a4a42` | texto muted del Hero | 6.82:1 | PASS |

### 5.2 FALLOS AA encontrados en el código embarcado

**La causa raíz es una sola: texto de marca y texto secundario aplicados con OPACIDAD Tailwind (`/65`, `/60`, `/50`, `/40`, `/35`).** El color base pasaría; la opacidad lo compone contra el cream y lo hunde por debajo de 4.5:1. Esto es invisible en una revisión de "qué hex usamos" y solo aparece al componer el alpha — exactamente el tipo de fallo que el Beat-them #10 pide cazar.

| # | Fallo | Dónde (archivo:línea) | Ratio real vs cream | Fix hue-preserving |
|---|---|---|---|---|
| **H-1** | `text-[#7a3a3a]/65` — subtítulos de sección, cuerpo | products.tsx:388 · values.tsx:52 · contact.tsx:103,149 | **3.38:1** FAIL body | Usar `--color-ink-soft #5a2a2a` **sólido** (sin opacidad) → 10.94:1 |
| **H-2** | `text-[#7a3a3a]/72` — párrafos de AboutUs (cuerpo principal del slot tributo) | about-us.tsx:25 | **3.97:1** FAIL body | `--color-ink-soft #5a2a2a` sólido → 10.94:1. *El slot de homenaje no puede tener su texto por debajo de AA.* |
| **H-3** | `text-[#7a3a3a]/60` — labels de formulario | contact.tsx:114,163,178,194,209 | **3.02:1** FAIL body | `--color-ink-soft #5a2a2a` sólido → 10.94:1 |
| **H-4** | `text-[#7a3a3a]/50` y `/40` — metadatos, footer del blockquote, links "eliminar" del Cart, "/500g" | products.tsx:282 · about-us.tsx:34 · cart.tsx:112,136,150,153 · checkout.tsx varios | **2.44:1** / **1.99:1** FAIL body y large | `--color-ink-muted #6e3232` sólido → 9.09:1. Para metadato no esencial mínimo `3:1`, pero aquí se recomienda body-AA porque incluye precios y acciones. |
| **H-5** | `placeholder:text-[#7a3a3a]/35` y `#c0a0a0` placeholder/StripeElement | contact.tsx:174,189,205,219 · checkout.tsx:17,280 | **1.81:1** / **2.24:1** FAIL | Placeholder mínimo 4.5:1 si transmite info. Usar `--color-ink-muted #6e3232` → 9.09:1, o aceptar `3:1` solo si el label visible ya cubre la info (entonces `#8a5a52`). |
| **H-6** | `text-[#c0392b]/70` — link "ver más" de Products | products.tsx:288 | **3.10:1** FAIL body | Rojo de marca NUNCA con opacidad como texto. `--color-primary #962a1f` **sólido** → 7.43:1. |
| **H-7** | `#e74c3c` como color de texto/UI sobre claro | stats-strip.tsx:95 (icono sobre `#5c1a1a` → 3.40:1, pasa como UI) · CTA icon · focus rings `#e74c3c/40` | borderline | `#e74c3c` sólido sobre cream = **3.58:1** → FAIL body, pasa solo como texto grande/UI. **Recomendación: retirar `#e74c3c` del sistema** (rompe disciplina 2-color y sube registro promocional). Sustituir por `--color-primary`. |
| **H-8** | **Emoji `✅` en success state** — viola HARD RULE D | contact.tsx:146 | n/a (regla, no contraste) | Sustituir por check SVG con stroke `--color-success`, patrón idéntico al de `checkout.tsx:89-91`. |

**Adicional — product cards sobre fondo blanco:** las cards de Products usan fondo blanco `#ffffff`, no cream. `text-[#7a3a3a]/65` sobre blanco = **3.49:1** (FAIL body), `/50` = **2.49:1** (FAIL). Mismo fix: color sólido `--color-ink-soft` / `--color-ink-muted`. (Recordatorio inverso del bug recurrente: aquí el fondo real *sí* es blanco — siempre verificar contra el fondo real de *cada* superficie, no asumir.)

### 5.3 Superficies oscuras — PASAN

| Combinación | Ratio | Veredicto |
|---|---|---|
| Blanco sobre `#5c1a1a` (StatsStrip) | 12.98:1 | PASS |
| `#e74c3c` icono sobre `#5c1a1a` (StatsStrip) | 3.40:1 | PASS como UI/icono (no texto cuerpo) |
| Blanco sobre `#2d0a0a` (Footer) | 18.11:1 | PASS |
| Blanco sobre `#c0392b` / `#962a1f` (botones) | 5.44:1 / 7.93:1 | PASS — `#962a1f` con más margen |
| `#f5c6c2` eyebrow sobre stop oscuro del CTA `#a93226` | 4.33:1 | PASS justo — vigilar; sobre `#5c1a1a` sube a 8.49:1 |

### 5.4 Color blindness
El sistema es monocromático cálido (un rojo + neutros cálidos) — robusto bajo deuteranopía y protanopía: la jerarquía descansa en **luminosidad**, no en matiz. Único punto a verificar en Fase 4.5: error (`#b91c1c`) vs marca (`#962a1f`) — bajo protanopía ambos rojos colapsan, por eso §4 exige que el error se distinga también por **icono + fondo + contexto**, nunca solo por color.

---

## 6. Entregables y handoff

| Hacia | Qué recibe |
|---|---|
| design-system-manager / visual-perfection | Token spec §3 — debe materializarse en `globals.css`; hoy NO existe ahí |
| style-guide-enforcer | Disciplina 2-color: retirar `#e74c3c` y los gradientes rojo→naranja; prohibir rojo de marca con opacidad |
| accessibility-perfectionist | Tabla §5.2 — 8 fallos, todos con fix hue-preserving ya especificado |
| typography-master | Texto secundario = `--color-ink-soft` SÓLIDO, no `#7a3a3a` con opacidad |
| ui-designer / frontend-developer | Success state color+texto+SVG, sin emoji (§4) |

---

## 7. Flags para Nil

1. **Decisión de cliente — calibración del rojo:** elegir entre Direction A (`#962a1f`, recomendada), B (`#a52f23`, delta mínimo vs el `clasico` actual) o C (`#8f2433`, más solemne, riesgo de leer como vino). Las tres comparten cream y near-black; solo cambia el matiz del rojo.
2. **Deuda de arquitectura de color:** la paleta de marca NO está en `globals.css` — está hardcodeada inline en 11 componentes, y `globals.css` aún tiene el tema shadcn neutro por defecto sin usar. El Beat-them #5 implica un trabajo de tokenización real en Fase 4, no un simple ajuste de hex. Conviene presupuestarlo.
3. **8 fallos WCAG AA en el código embarcado**, todos por texto con opacidad (`/65`-`/35`) que hunde colores que de base pasarían. Incluye el cuerpo del slot de homenaje de AboutUs (3.97:1) y el subtítulo de Contacto. Fixes hue-preserving ya especificados en §5.2.
4. **Violación de HARD RULE D:** `contact.tsx:146` usa el emoji `✅` en el success state del formulario. El checkout ya resuelve esto bien con un SVG — replicar ese patrón.
5. **Bug recurrente confirmado de nuevo:** vuelve a aparecer contraste no verificado contra el cream real. Recomendación para el director: que brand-designer fije el cream como token de canvas desde Fase 1 y que toda verificación de contraste, en todo proyecto, se haga contra el token de fondo real — no contra blanco. Es la tercera vez que el patrón cuesta retrabajo (La Nonna + aquí).
