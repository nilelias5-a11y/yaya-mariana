# ENHANCE-2 — typography-master audit

> **Fecha:** 2026-05-26
> **Auditor:** typography-master (agencia-web-v2)
> **Rama base:** `origin/clasico` HEAD `0a53c6c`
> **Modo:** AUDIT — sin tocar código. Solo propuestas.
> **Regla maestra:** "limpio > saturado". Cada propuesta debe pasar el filtro
> "¿se vería aquí en La Nonna?".

---

## Contexto y enfoque

### Qué revisé

1. `nil-design-preferences.md` — CANÓNICO. Additive-only. Fondos/paleta/tipografía base/layouts BLOQUEADOS.
2. `phase-enhance-1-audit-consolidated.md` — Estado post-E1: `font-feature-settings: liga, dlig, kern, onum` global serif; `.numerals-tabular` (tnum+lnum) en StatsStrip y precios Products; `.about-dropcap` en AboutUs; comillas tipográficas reales en `<blockquote>`; eyebrow letter-spacing 0.22em; footer headings `ss01 case cpsp` tracking 0.20em.
3. `globals.css` actual — confirmados todos los E1 ítems; sin `text-wrap`, `hyphens`, `calt`, `font-optical-sizing`, ni `text-underline-offset` extendido.
4. Componentes Hero, AboutUs, StatsStrip, Products, Contact, Footer.
5. `layout.tsx` — Playfair Display cargado con pesos 400–900 y `style: ['normal', 'italic']`. Italic real disponible. `lang="es"` en el root HTML; HtmlLangSync actualiza dinámicamente a `ca`/`en`.

### Qué no se ha tocado aún (espacio de ENHANCE-2)

- `text-wrap: balance` en titulares H2 de sección (AboutUs, Products, Contact) — ninguno tiene la propiedad.
- `text-wrap: pretty` en párrafos de cuerpo — sin aplicar en ningún sitio.
- `hyphens: auto` — no existe en el proyecto; el `lang` está correctamente declarado (requisito previo).
- `font-feature-settings: "calt"` — no añadido aún a la regla global serif.
- `font-optical-sizing: auto` — no declarado; Playfair Display es variable font con eje `opsz` expuesto (confirmado vía Google Fonts spec: rango 8–144).
- `onum` global ya activo en serif, pero StatsStrip necesita `lnum` (los grandes cifras son contadores no texto corrido) — hay tensión: `numerals-tabular` ya aplica `lnum` sobre el `<span>` de `AnimatedValue`, pero el selector de globals.css aplica `onum` al `.font-serif` padre y puede ganar en especificidad. Necesita clarificación de orden / especificidad — ver TM-07.
- `text-underline-offset` y `text-decoration-skip-ink` — solo `underline-offset-4` en `button.tsx` variant link; sin definición global ni contextual.
- Cita de Mariana en Hero (`"{t.hero.quoteText}"`) usa comillas tipográficas reales en el JSX como straight-quote envuelto en texto — oportunidad de confirmar o corregir (ver TM-10).
- La línea de tributo `inMemory` en el footer usa `.font-serif italic` sin `font-feature-settings` explícito — hereda el bloque global, pero merece `calt` y `ss01` para máxima elegancia.

---

## Propuestas

### TM-01 — `text-wrap: balance` en titulares H2 de sección

- Sección: AboutUs (`h2`), Products (`h2` TypewriterHeading), Contact (`h2`)
- Descripción: Añadir utilidad `.heading-balanced` con `text-wrap: balance` y aplicarla a los tres H2 de sección. Evita la última línea solitaria de una sola palabra ("viuda de titular") en pantallas intermedias, especialmente visible en tamaños `clamp` responsivos. CSS exacto: `text-wrap: balance;`
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — La Nonna tiene titulares Playfair con el mismo problema en mobile.
- Por qué: Con `text-4xl md:text-5xl` y traducciones ES/CA/EN de longitudes distintas, "Descubre nuestras fresas" o "Nuestra historia" cambian de quiebre según viewport. `balance` hace el trabajo en CSS puro, sin JS, sin tocar tamaños.

---

### TM-02 — `text-wrap: pretty` en párrafos de cuerpo

- Sección: AboutUs (`.about-dropcap p`), Contact (`.text-[0.9375rem]`), Footer (`.text-sm.text-white/50`)
- Descripción: Añadir utilidad `.body-pretty` con `text-wrap: pretty` y aplicarla a los bloques de prosa. `pretty` (a diferencia de `balance`) trabaja sobre la última línea de cada párrafo eliminando líneas viudas/huérfanas sin rebalancear todo el bloque. CSS exacto: `text-wrap: pretty;`
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — control de viudas es estándar editorial en cualquier proyecto premium.
- Por qué: `balance` en párrafos puede estrechar excesivamente el bloque y crear "triángulos" indeseados. `pretty` es la opción correcta para cuerpo: solo interviene en la última línea. Los párrafos de AboutUs tienen 2–3 líneas a `max-w-[720px]` — ideal para `pretty`.

---

### TM-03 — `hyphens: auto` contextual en párrafos largos

- Sección: AboutUs (cuerpo), Contact (subtítulo y descripción), Footer brand description
- Descripción: Añadir utilidad `.body-hyphens` con `hyphens: auto` más `overflow-wrap: break-word` como fallback. El `lang="es"` del root (y su sincronía dinámica con CA/EN vía HtmlLangSync) hace que el motor de hyphenation del navegador conozca el idioma activo — requisito ya cubierto. CSS exacto: `hyphens: auto; overflow-wrap: break-word;`
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — la versión italiana usa hyphens en párrafos de descripción de platos.
- Por qué: Máxima ganancia en mobile (`max-w-[720px]` pasa a ser `~320px` en un iPhone SE). Las palabras largas en catalán ("malauradament", "directament") y español ("directamente del campo") forman líneas con un solo token. El `lang` dinámico permite que el guionado respete la fonología correcta según idioma activo.

---

### TM-04 — `font-feature-settings: "calt"` en Playfair Display

- Sección: Global (selector `.font-serif`)
- Descripción: Añadir `"calt" 1` a la regla global de `.font-serif` ya existente en `globals.css`. `calt` activa sustituciones contextuales — Playfair las usa para ajustar pares de letras en contextos específicos (ej. "ff", "fi", "fl" posicionales, y variantes de cola en letras adyacentes a mayúsculas). CSS exacto: añadir `"calt" 1` a `font-feature-settings: "liga" 1, "dlig" 1, "kern" 1, "onum" 1, "calt" 1;`
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — Canela, Libre Baskerville y Playfair Display todos exponen `calt` con ganancia visible.
- Por qué: `calt` es el refinamiento OpenType más subestimado de Playfair. No cambia el carácter visual, pero afina las uniones contextuales — especialmente relevante en el Hero donde la cita aparece a `clamp(2rem, 4vw, 3rem)` italic. Es una adición de una sola propiedad a la regla ya existente.

---

### TM-05 — `font-optical-sizing: auto` + eje `opsz` en Playfair Display VF

- Sección: Global (selector `.font-serif`) + ajuste específico en Hero quote y StatsStrip valores
- Descripción: Añadir `font-optical-sizing: auto` al selector `.font-serif` global. Como complemento para los tamaños extremos (Hero `clamp(2rem, 4vw, 3rem)` y StatsStrip `3.25rem`), añadir `font-variation-settings: 'opsz' 48` en las utilidades de display. Playfair Display en Google Fonts expone el eje `opsz` con rango 8–144. `auto` delega al navegador el valor correcto según el computed font-size. CSS exacto: `font-optical-sizing: auto;` + opcionalmente `font-variation-settings: 'opsz' 48;` en `.font-display-xl`.
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ con matiz — solo perceptible en tamaños display (≥40px). En tamaños de cuerpo el efecto es mínimo.
- Por qué: A `3.25rem` los counters del StatsStrip y la cita del Hero operan en zona de display. Sin `opsz`, Playfair sirve los glifos optimizados para tamaño de cuerpo (~16px) — el trazo fino aparece mecánicamente delgado. Con `opsz: 48` los trazos contrastan mejor y el serif gana presencia sin cambiar la typeface.

---

### TM-06 — `text-underline-offset` y `text-decoration-skip-ink` en links de navegación y footer

- Sección: Nav (links de menú), AboutUs (CTA secundario "Contactar"), Contact (mailto/tel), Footer (links de columna)
- Descripción: Añadir utilidad `.link-refined` con `text-underline-offset: 3px` y `text-decoration-skip-ink: auto`. Aplicar a cualquier `<a>` que muestre subrayado (hover en nav, hover en footer column links, estado activo en Contact). CSS exacto: `text-underline-offset: 3px; text-decoration-skip-ink: auto;`
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — todos los proyectos premium de agencia con serif usan `text-underline-offset` mayor al default (1px) para que el subrayado no corte los descendentes de `p`, `g`, `y`.
- Por qué: El underline decorativo del nav hover y el de Contact (`.group/link`) actualmente no especifican offset — el navegador usa ~1px que toca descendentes de Playfair y Inter. Con `3px` la línea respira bajo las letras. `skip-ink: auto` saltará las diagonales de letras como `f`, `j`, `y` automáticamente.

---

### TM-07 — Resolver tensión `onum` global vs `lnum` tabular en StatsStrip

- Sección: StatsStrip (`<span class="numerals-tabular font-serif text-[3.25rem]">`)
- Descripción: La regla global `.font-serif { font-feature-settings: "liga", "dlig", "kern", "onum" }` puede ganar sobre `.numerals-tabular { font-feature-settings: "tnum", "lnum" }` dependiendo del orden de especificidad en la cascade. La solución correcta es añadir un selector de mayor especificidad o extender `.numerals-tabular` para incluir explícitamente la anulación de `onum`: `font-feature-settings: "tnum" 1, "lnum" 1, "onum" 0, "kern" 1;`. CSS exacto: `.numerals-tabular { font-variant-numeric: tabular-nums lining-nums; font-feature-settings: "tnum" 1, "lnum" 1, "onum" 0, "kern" 1; }`
- Tipo: ADITIVA (es una clarificación de intención, no cambia el valor visual que Nil aprobó — los counters ya usan `.numerals-tabular`)
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — los precios de La Nonna también usan tnum+lnum con la misma tensión posible.
- Por qué: Sin `"onum" 0` explícito, el conteo animado "100%", "24h", "+", "0" puede mostrar dígitos oldstyle (bajantes) mientras el counter corre — especialmente visible en "0" inicial al arrancar la animación. La intención declarada en E1 era lining para contadores. Este ítem cierra la ambigüedad.

---

### TM-08 — Italic real confirmado: añadir `font-style: italic` explícito en la cita Hero

- Sección: Hero (elemento `<p>` de `quoteText`)
- Descripción: El `<p>` del quoteText usa `fontStyle: "italic"` como inline style. Playfair Display italic está cargado (`style: ['normal', 'italic']` en `layout.tsx`). Sin embargo, no tiene `font-feature-settings` explícito — hereda el global vía `[style*="font-playfair"]` que funciona solo si el atributo `style` contiene literalmente "font-playfair". El selector de globals.css es `[style*="font-playfair"]` pero el elemento usa `fontFamily: "var(--font-playfair)"` — el valor renderizado como atributo style depende del navegador. Propuesta: añadir clase `.serif-italic-quote` con `font-family: var(--font-playfair); font-style: italic; font-feature-settings: "liga" 1, "dlig" 1, "kern" 1, "onum" 1, "calt" 1;` y aplicarla al elemento. CSS exacto: `.serif-italic-quote { font-family: var(--font-playfair); font-style: italic; font-feature-settings: "liga" 1, "dlig" 1, "kern" 1, "onum" 1, "calt" 1; }`
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — las citas en italic de La Nonna usan Playfair italic real, nunca sintético.
- Por qué: El riesgo de italic sintético (oblique forzado) en un sitio tributo es inaceptable. La cita de Mariana a `clamp(2rem, 4vw, 3rem)` es el elemento tipográfico más emocional del sitio. Confirmar y garantizar que usa el italic real con OpenType completo, no el oblique de fallback, es obligatorio.

---

### TM-09 — Smart quotes en la cita Hero (quoteText)

- Sección: Hero (`"{t.hero.quoteText}"`)
- Descripción: El quoteText en el JSX está envuelto en comillas straight ASCII (`"` y `"`). Esto no se ve como curly quotes tipográficas. La solución es cambiar en el JSX (o en la cadena de traducción) a `&ldquo;` / `&rdquo;` igual que se hizo con el `<blockquote>` de AboutUs en ENHANCE-3 (E3 ya aplicado). No afecta CSS — es una acción en el componente Hero que deberá apuntar el implementador. Descripción CSS: n/a (acción en JSX/traducción). Se incluye aquí como hallazgo tipográfico de autoría de `typography-master`.
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — ningún proyecto de La Nonna usa straight quotes en citas visibles.
- Por qué: La cita de Mariana es el corazón emocional del Hero. Aparece a gran tamaño en Playfair italic. Las comillas rectas son error tipográfico evidente en ese contexto. AboutUs ya lo corrigió en E3 — Hero es el único lugar restante con comillas sin curvar.

---

### TM-10 — `letter-spacing` refinado en labels de formulario Contact

- Sección: Contact (labels `<label>` y chips de info de contacto `<p class="text-xs font-semibold ... uppercase tracking-wide">`)
- Descripción: Los labels del formulario usan `tracking-wide` (Tailwind = `0.025em`) y los chips usan `tracking-wide` también. Para texto en uppercase Inter a `text-xs (12px)`, el tracking óptimo es `0.08–0.12em` (ver regla del typography-master spec: "Letter spacing ALL CAPS: 0.08–0.15em"). Propuesta: añadir utilidad `.label-caps` con `letter-spacing: 0.10em; font-feature-settings: "cpsp" 1;` para unificar todos los labels uppercase del formulario y chips de contacto. CSS exacto: `.label-caps { letter-spacing: 0.10em; font-feature-settings: "cpsp" 1; }`
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — los labels de los formularios de reserva de La Nonna usan tracking de 0.10–0.12em en uppercase.
- Por qué: `tracking-wide` = 0.025em es demasiado apretado para Inter uppercase a 12px. El ojo percibe las mayúsculas como bloques de masa sin suficiente aire. `cpsp` (capital spacing) completa el trabajo con ajuste OpenType nativo de Inter. Coherente con el `0.20em` ya establecido en los headings del footer (E5).

---

### TM-11 — Línea de tributo `inMemory` footer: añadir `font-feature-settings` explícito

- Sección: Footer (`.font-serif.italic` en el bottom row: `{t.footer.inMemory}`)
- Descripción: La línea de tributo `"En memoria de Mariana, la Yaya"` (o equivalente) usa `.font-serif italic` sin `font-feature-settings` explícito declarado en el componente. Heredará el global `.font-serif` si el selector `[class*="font-serif"]` lo captura. Propuesta: añadir clase `.tribute-line` con `font-family: var(--font-playfair); font-style: italic; font-feature-settings: "liga" 1, "dlig" 1, "kern" 1, "calt" 1, "ss01" 1; font-size: 0.78rem; letter-spacing: 0.01em;`. Excluir deliberadamente `onum` porque la línea no contiene cifras. CSS exacto: `.tribute-line { font-feature-settings: "liga" 1, "dlig" 1, "kern" 1, "calt" 1, "ss01" 1; }`
- Tipo: ADITIVA
- Prioridad: BAJA
- Test "se vería en La Nonna": SÍ con matiz — La Nonna no tiene línea de tributo, pero sí tiene el footer quote en italic refinado con ss01.
- Por qué: Es el elemento con mayor carga emocional del footer. Aparece pequeño (`0.78rem`) en color `rgba(232,196,191,0.55)` sobre fondo oscuro — exactamente el contexto donde los detalles OpenType son más perceptibles. `ss01` en Playfair activa variantes de estilo alternativas en letras como `a` que dan un tono más caligráfico. No añadir `onum` evita que eventuales años (si se añaden) aparezcan en oldstyle sobre fondo oscuro a bajo tamaño.

---

### TM-12 — Superíndice estilizado en el símbolo `%` de StatsStrip

- Sección: StatsStrip (valor "100%", texto el "%" en el AnimatedValue)
- Descripción: El valor "100%" se renderiza con `font-serif text-[3.25rem]` más `.numerals-tabular`. El `%` es un carácter tipográfico que en Playfair Display a ese tamaño puede quedar desequilibrado respecto a los dígitos. Propuesta: añadir utilidad `.unit-suffix` con `font-size: 0.55em; vertical-align: 0.35em; font-feature-settings: inherit;` para reducir el símbolo de unidad a superíndice estilizado (similar a cómo editorial de moda trata los `%`, `°`, y `€`). En la implementación, el implementador envolvería el sufijo en un `<span class="unit-suffix">`. CSS exacto: `.unit-suffix { font-size: 0.55em; vertical-align: 0.3em; font-feature-settings: inherit; letter-spacing: 0; }`
- Tipo: ADITIVA
- Prioridad: BAJA
- Test "se vería en La Nonna": SÍ con matiz — La Nonna trata `€` y `g` en los precios con tamaño reducido. El gesto es el mismo.
- Por qué: A `3.25rem`, el `%` de Playfair tiene un peso visual desproporcionado. Reducirlo a ~1.8rem en superíndice aligera el bloque numérico sin esconder la información. Es el mismo gesto que usan las publicaciones de cocina premium para tratar los `°C` de temperatura. El implementador decide si envolver solo `%` o también `h` en "24h".

---

## Resumen de prioridades

| ID | Título corto | Tipo | Prioridad |
|---|---|---|---|
| TM-01 | `text-wrap: balance` en H2 de sección | ADITIVA | ALTA |
| TM-02 | `text-wrap: pretty` en párrafos de cuerpo | ADITIVA | ALTA |
| TM-03 | `hyphens: auto` contextual | ADITIVA | MEDIA |
| TM-04 | `font-feature-settings: "calt"` global serif | ADITIVA | ALTA |
| TM-05 | `font-optical-sizing: auto` + eje `opsz` | ADITIVA | MEDIA |
| TM-06 | `text-underline-offset: 3px` + `skip-ink` en links | ADITIVA | MEDIA |
| TM-07 | Resolver tensión `onum` vs `lnum` en StatsStrip | ADITIVA | ALTA |
| TM-08 | Garantizar italic real + OT en cita Hero | ADITIVA | MEDIA |
| TM-09 | Smart quotes en cita Hero (quoteText) | ADITIVA | ALTA |
| TM-10 | `letter-spacing` 0.10em + `cpsp` en labels Contact | ADITIVA | MEDIA |
| TM-11 | `font-feature-settings` explícito en línea tributo footer | ADITIVA | BAJA |
| TM-12 | Superíndice estilizado `.unit-suffix` para `%` StatsStrip | ADITIVA | BAJA |

---

## Orden de implementación recomendado

**Tanda inmediata (alta prioridad, impacto mayor):**
1. TM-04 — `calt` al global serif (una línea en `globals.css`).
2. TM-07 — Arreglar `onum` vs `lnum` en `.numerals-tabular` (una línea en `globals.css`).
3. TM-09 — Smart quotes en Hero quoteText (cambio en JSX o en el archivo de traducciones).
4. TM-01 — `text-wrap: balance` utility + aplicar en H2.
5. TM-02 — `text-wrap: pretty` utility + aplicar en prosa.

**Tanda secundaria (media prioridad, ganancia legibilidad):**
6. TM-06 — `text-underline-offset` + `skip-ink` utility.
7. TM-08 — `.serif-italic-quote` con OT completo en Hero.
8. TM-10 — `.label-caps` en Contact.
9. TM-03 — `hyphens: auto` utility (especialmente útil en mobile ES/CA).
10. TM-05 — `font-optical-sizing: auto`.

**Tanda baja (polish final):**
11. TM-11 — `.tribute-line` en footer inMemory.
12. TM-12 — `.unit-suffix` para `%` en StatsStrip.

---

*Ninguna de estas 12 propuestas toca fondos, paleta, tipografía base (Inter + Playfair Display), layouts ni estructura. Todas son ADITIVAS puras. Cero requieren firma de Nil antes de implementar.*
