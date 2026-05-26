# ENHANCE-2 — visual-perfection audit

## Contexto y enfoque

Auditoría pixel-level del HEAD `clasico` (0a53c6c) post-ENHANCE-1. El sistema de tokens, hairlines, grano, OpenType y reveals ya está fundado. ENHANCE-2 busca los defectos residuales que ningún agente tocó en la primera ronda: bordes de transición duros entre bandas, micro-gaps de alineación, states de interacción incompletos y oportunidades editoriales en componentes menos enriquecidos (Nav, StatsStrip, Cart drawer, Checkout, Values header). Cada propuesta es estrictamente ADITIVA salvo indicación expresa; ninguna toca fondos, paleta base, tipografía base, layouts ni estructura.

---

## Propuestas

### VP-01 — Nav: scroll-state backdrop-blur + hairline terracota condensado

- **Sección:** Nav
- **Descripción:** Cuando el usuario hace scroll hacia abajo (>8px), el Nav recibe `backdrop-filter: blur(12px)` sobre un fondo `rgba(255,255,255,0.88)` en lugar de `bg-white` opaco. El `border-bottom` pasa de `1px solid #f0e0e0` (blanco-frío, se ve como corte duro sobre el melocotón del Hero) a un gradiente de 1px `rgba(192,57,43,0.12)` centro → transparente en los extremos, igual al hilo del Footer. El estado "en top" mantiene `bg-white` sólido y el border existente sin cambios.
- **Tipo:** ADITIVA (capa JS de scroll-class + CSS backdrop; el `border-bottom` hardcodeado se complementa con el gradiente en un pseudo-elemento `::after` sin tocar el original)
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — las referencias editoriales italianas (Frantoio Muraglia, Nudo) usan nav con vidrio sobre fondos cálidos; el corte duro blanco-sobre-melocotón es el defecto más visible al hacer scroll.
- **Por qué:** El `border-bottom: 1px solid #f0e0e0` es un gris-frío que contrasta visualmente con el fondo melocotón del Hero al hacer scroll. Un hairline terracota centrado y difuminado en los extremos es coherente con el sistema ya establecido en Footer y Contact (mismo gesto en VP-03 de ENHANCE-1 aplicado a bandas oscuras; aquí se extiende al Nav claro). El backdrop-blur da profundidad sin cambiar el fondo.

---

### VP-02 — StatsStrip: divisores verticales internos entre stats

- **Sección:** StatsStrip
- **Descripción:** Entre cada par de stats del grid `md:grid-cols-4`, añadir un divisor vertical de 1px a `rgba(255,255,255,0.07)` que ocupe el 50% de la altura del ítem centrado verticalmente. En mobile (2 columnas), los divisores se omiten. Solo visible en md+. Se implementa como pseudo-elemento `::after` en cada ítem excepto el último de su fila, o como elementos `aria-hidden` inseridos entre los stat items.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — patrón habitual en stats strips de marcas editoriales premium; da ritmo sin añadir peso.
- **Por qué:** El grid de 4 stats sobre `#5c1a1a` no tiene ninguna separación visual. Los ítems "flotan" en la masa oscura sin articulación horizontal. El sistema hairline ya está establecido en globals.css (`.hairline-accent`); este divisor es la extensión lógica al plano vertical-interno en banda oscura. No toca el layout ni el fondo ni el spacing existente.

---

### VP-03 — StatsStrip: hairline top/bottom edge con entrada animada

- **Sección:** StatsStrip
- **Descripción:** Dos hairlines de 1px, uno en `border-top` y otro en `border-bottom` de la sección, con `background: linear-gradient(to right, transparent, rgba(231,76,60,0.18), transparent)` — mismo patrón que el Footer top-edge pero en rojo-terracota ligeramente más saturado para ser visible sobre `#5c1a1a`. Entran con `scaleX: 0 → 1` via `.hairline-accent--animate` (clase ya definida en globals.css) cuando la sección entra al viewport.
- **Tipo:** ADITIVA
- **Prioridad:** ALTA
- **Test "se vería en La Nonna":** SÍ — las bandas oscuras de marcos La Nonna siempre tienen ese "tape cinematográfico"; sin él la sección flota aislada.
- **Por qué:** ENHANCE-1 propuso esto como VP-#3 y VP-#11 (sinergias con CD-#9 y AP), pero revisando el código actual el StatsStrip NO tiene esos hairlines implementados — solo tiene `py-14 px-6` sin ningún borde ni overlay. Es el gap más visible entre la propuesta E1 y el estado actual del código. Distinto de lo ya hecho en Footer (que sí tiene su hairline top implementado).

---

### VP-04 — Values: hairline superior de sección sobre `#fdf0ef`

- **Sección:** Values
- **Descripción:** Un hairline de 1px en el borde superior de la sección Values (`#fdf0ef`), gradiente horizontal `rgba(192,57,43,0.10)` centro → transparente extremos. Separa visualmente la transición AbouUs (bg-white) → Values (bg-[#fdf0ef]) que actualmente es una junta cromática sin articulación, especialmente notable porque el cambio de fondo es muy suave y la banda queda "pegada" a AboutUs.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — las marcas editoriales usan hairlines como puntuación entre secciones de fondo similar.
- **Por qué:** La transición AboutUs-blanco a Values-melocotón-claro es la más silenciosa de la página. Sin hairline de separación, el inicio de Values parece un accidente cromático. El mismo patrón ya está aplicado en Contact (hairline bottom) y Footer (hairline top); la coherencia del sistema lo pide también aquí.

---

### VP-05 — Values: eyebrow + título heading con hairline-rule centrado

- **Sección:** Values
- **Descripción:** Bajo el eyebrow del header de Values (`{t.values.eyebrow}`), añadir un hairline centrado de 40px × 1px con `rgba(192,57,43,0.22)` y entrada `scaleX` via `.hairline-accent--animate`. El header actual (eyebrow → h2 → subtitle) carece de articulación entre eyebrow y título, a diferencia del header de AboutUs (que ya tiene su divisor 60px aplicado en ENHANCE-3) y del Hero (que tiene su línea 32px). El sistema se completaría aplicando el mismo gesto al tercer encabezado de sección grande (Products ya tiene `TypewriterHeading` con cursor parpadeante como diferenciador propio; CTA está bloqueado).
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — hairline bajo eyebrow es lenguaje editorial canónico en La Nonna y en Frantoio Muraglia.
- **Por qué:** El patrón eyebrow → hairline → título ya existe en Hero y AboutUs. Values es el único header de sección principal que lo omite, creando una inconsistencia en el sistema de señalización tipográfica. La propuesta es idéntica en carácter a la ya aplicada en ENHANCE-3 para AboutUs.

---

### VP-06 — Cart drawer: inset hairline en header y footer del panel

- **Sección:** Cart
- **Descripción:** El `border-b border-[#f5c6c2]/60` del header del cart (línea que separa título y X del cuerpo) y el `border-t border-[#f5c6c2]/60` del footer del cart (línea sobre total + botón checkout) son bordes de 1px sólido directo. Añadir debajo/encima de cada uno un segundo hairline fantasma de 1px a `rgba(255,255,255,0.8)` con 2px de gap (igual al patrón hairline editorial doble del Footer `boxShadow: "0 3px 0 -2px rgba(255,255,255,0.06)"`). Esto eleva la percepción de "papelería" del drawer al mismo nivel que el form-card de Contact y el order-summary de Checkout.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — los drawers laterales de marcas como Farmacia SS Annunziata usan exactamente este detalle de doble línea para elevar la percepción de calidad del panel.
- **Por qué:** El drawer de Cart es la superficie de mayor intención de compra. El form-card de Contact ya recibió `border + inset shadow` en ENHANCE-1 (VP-#12); el order-summary de Checkout tiene `border border-[#f5c6c2]/40`. El Cart drawer es el único panel blanco que conserva el borde único y frío sin inset shadow. Coherencia de sistema y momento de conversión justifican ALTA.

---

### VP-07 — Checkout: fieldset legends con hairline-rule bajo el label

- **Sección:** Checkout
- **Descripción:** Las tres leyendas de fieldset del Checkout (`{t.checkout.sections.personal}`, `.shipping`, `.payment`) tienen `text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-3` pero no tienen ninguna separación visual respecto al primer input. Añadir un hairline de 1px `rgba(192,57,43,0.15)` a ancho completo bajo cada `<legend>`, con `scaleX: 0 → 1` CSS cuando el elemento es visible. Mismo gesto que el sistema eyebrow-hairline, aplicado como separador de sección de formulario.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — las secciones de formulario con divisor bajo el label de sección son estándar en branding editorial de lujo (Roscioli, Il Posto).
- **Por qué:** Los fieldset del Checkout son las únicas "secciones" de la interfaz de compra sin articulación visual clara. El eyebrow del Hero, de Contact, de Products y de Values tienen todos alguna marca; los legends del Checkout no. El gesto es mínimo y consistente con el sistema establecido.

---

### VP-08 — Checkout: success card con inset shadow terracota

- **Sección:** Checkout
- **Descripción:** La pantalla de éxito del Checkout es actualmente texto sobre `#fdf6f5` sin ninguna tarjeta visual. El `max-w-md` no tiene borde ni sombra, a diferencia de todos los demás contenedores blancos del sitio (form Contact, order-summary Checkout, card Values). Añadir al `div.max-w-md.w-full.text-center` un fondo `bg-white`, `border: 1px solid rgba(245,198,194,0.5)`, `border-radius: 24px`, `padding: 3rem` y `box-shadow: 0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 24px rgba(192,57,43,0.06)` — heredando el patrón del form-card de Contact.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — el momento post-compra merece el mismo cuidado "papelería" que el resto.
- **Por qué:** La pantalla de confirmación es el último punto de contacto emocional de la compra. Para un tributo a la abuela, este momento debería sentirse igual de cuidado que el formulario de contacto. El div de éxito es la única superficie de conversión completada sin el tratamiento paper-card.

---

### VP-09 — Nav: indicador activo de sección en scroll (underline hairline)

- **Sección:** Nav
- **Descripción:** Los links del Nav (Productos, Sobre nosotros, Contacto) tienen hover con underline animado (`scaleX: 0 → 1`) pero ningún estado "activo" mientras el usuario está dentro de una sección. Añadir un `aria-current="page"` dinámico via IntersectionObserver (mismo patrón del `.reveal` ya en globals.css) y cuando un link está activo, mostrar el underline en estado permanente con `scaleX: 1` y opacidad 0.5 (más suave que el hover full). ADITIVA pura: no toca el borde ni el fondo del Nav.
- **Tipo:** ADITIVA
- **Prioridad:** MEDIA
- **Test "se vería en La Nonna":** SÍ — navegación con indicador de sección activa es estándar en webs editoriales de referencia.
- **Por qué:** El Nav tiene underline en hover pero ningún estado de reposo que indique "estás aquí". La arquitectura de scroll-one-page hace especialmente útil este indicador. Usa el mismo patrón de IntersectionObserver que el sistema `.reveal` ya establecido, sin duplicar infraestructura.

---

### VP-10 — Products: transición hard-cut entre banda `#fdf6f5` puntos y StatsStrip `#5c1a1a`

- **Sección:** Products / StatsStrip (junta entre secciones)
- **Descripción:** La sección Products termina con fondo `#fdf6f5` con patrón de puntos radial, y StatsStrip comienza directamente con `#5c1a1a`. Es la transición cromática más abrupta de la página y actualmente no tiene ninguna articulación. Añadir en el borde inferior de Products un hairline de 1px `rgba(192,57,43,0.10)` (gradiente horizontal centro-extremos) como cierre de la banda clara antes de la oscura. No toca ningún fondo ni color existente.
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — con matiz: La Nonna usa transiciones de fondo igual de abruptas pero con hairlines de "sello" en los extremos. El hairline único es el detalle mínimo que eleva la junta.
- **Por qué:** Es la única junta entre bandas cromáticas principales sin ningún elemento de articulación. Footer ya tiene su hilo superior; Contact tiene su hairline de cierre inferior. Products es el eslabón que falta en la cadena de hairlines de la página.

---

### VP-11 — Cart FAB: easing del hover refinado a warm-lux

- **Sección:** Cart
- **Descripción:** El botón flotante (FAB) del cart usa `whileHover={{ scale: 1.08 }}` con easing por defecto de framer-motion (spring con parámetros genéricos). Añadir `transition={{ duration: 0.22, ease: [0.19, 1, 0.22, 1] }}` al `whileHover` y `whileTap` para alinear con el token `--ease-warm-lux` establecido en globals.css ENHANCE-1. No toca el gradiente de fondo ni la forma del FAB.
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — el FAB es el elemento más "genérico" en easing actualmente; el warm-lux lo integra al sistema de movimiento del sitio.
- **Por qué:** El token `--ease-warm-lux` fue establecido en ENHANCE-1 como sistema global. El FAB del cart es el único elemento de interacción primaria que no lo usa. El defecto es sutil pero audible para el ojo entrenado: el FAB "rebota" diferente al resto.

---

### VP-12 — Footer: intercolumna hairlines verticales entre columnas de nav

- **Sección:** Footer
- **Descripción:** El grid de 4 columnas del Footer (brand + 3 nav) en md+ no tiene separación visual entre columnas. Los 3 grupos de nav (Tienda, Empresa, Legal) están en el mismo plano sin ningún ritmo horizontal. Añadir entre las columnas 2, 3 y 4 un divisor vertical de 1px `rgba(255,255,255,0.05)` de altura 70% centrado, usando `aria-hidden` como pseudo-separador o pseudo-elemento CSS. Mismo carácter y alpha que los divisores de VP-02 (StatsStrip), pero aún más sutiles para no competir con el fondo `#2d0a0a`.
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — el Footer de La Nonna usa exactamente este detalle de columnas articuladas con hairlines fantasma.
- **Por qué:** El Footer ya recibió wordmark, headings en terracota, hairline editorial doble y halo en socials (ENHANCE-1). Lo que falta es la articulación interna entre columnas. Sin ella las tres columnas de nav flotan en la masa oscura sin relación entre sí. El alpha extremadamente bajo (0.05) garantiza que pase el test "limpio > saturado".

---

### VP-13 — Checkout: back button con microanimación warm-lux en el icono

- **Sección:** Checkout
- **Descripción:** El botón de volver atrás del Checkout (`← {t.checkout.back}`) tiene `hover:text-[#c0392b] transition-colors` pero el icono SVG del chevron no tiene ninguna micro-animación de traslación. Añadir al `svg` un `group-hover:-translate-x-1` con `transition-transform duration-200 ease-[0.19_1_0.22_1]` (warm-lux) — mismo patrón que el flecha `→` del botón secundario del Hero y el de los links de footer en hover (`x: 4`), pero en dirección inversa dado que es un "volver".
- **Tipo:** ADITIVA
- **Prioridad:** BAJA
- **Test "se vería en La Nonna":** SÍ — microanimación de dirección en iconos de navegación es detalle estándar en webs de referencia editorial.
- **Por qué:** Todos los CTAs y links direccionales del sitio tienen la micro-animación de desplazamiento del icono en hover (Hero btn1, btn2, nav links, footer links, about contact link). El back-button del Checkout es el único CTA direccional sin este detalle. Es el ítem de menor prioridad del audit porque la pantalla de checkout es funcional por encima de decorativa, pero la consistencia del sistema lo pide.
