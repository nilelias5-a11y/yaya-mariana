# ENHANCE-2 — creative-director audit

## Contexto y enfoque

Auditoría transversal de la rama `clasico` HEAD post-ENHANCE-1 (commits E1–E7 aplicados). Lectura completa de todos los componentes activos: Nav, Hero, StatsStrip, AboutUs, Values, CTA, Contact, Footer, Cart, Checkout, easter eggs y translations. Criterio mental aplicado: (1) "limpio > saturado" como ley absoluta; (2) test La Nonna — elegancia restraint editorial, no greeting-card; (3) detección de *moments* de pausa y respiración que el sitio aún no tiene; (4) coherencia narrativa capa A (amor de abuela) / capa B (en memoria de Mariana) como hilo conductor. Foco especial en secciones poco tocadas en ENHANCE-1: Nav, StatsStrip (estructura bloqueada, pero perímetro libre), Cart, Checkout, y la transición global sección→sección.

---

## Propuestas

### CD-01 — Hairline de costura entre secciones de fondo blanco (AboutUs → Values)

- Sección: Global (transición AboutUs → Values)
- Descripción: Un hairline horizontal de 1px a `rgba(192,57,43,0.07)` edge-to-edge marca la junta entre `bg-white` (AboutUs) y la sección siguiente (Values). No es un divider decorativo llamativo, es una "costura de papel" — la misma lógica que el hairline superior del Footer aplicada a las juntas intermedias de fondo claro. Aditivo puro: `<div aria-hidden>` absoluto en el bottom de la sección, sin tocar layout.
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — exactamente el tipo de detalle de impresión editorial que distingue un sitio artesanal de uno genérico.
- Por qué: AboutUs cierra con el glifo ❦ y los botones CTA, pero la transición visual hacia Values no tiene ninguna marca de "cierre de capítulo". El hairline de costura da cadencia respiratoria al scroll sin añadir peso cromático. Mismo gesto que el hairline ya aplicado en Contact → Footer.

---

### CD-02 — Hairline de apertura sectorial en StatsStrip (perímetro, no interior)

- Sección: StatsStrip
- Descripción: Dos hairlines edge-to-edge de 1px — uno en top (`rgba(255,255,255,0.08)` sobre `#5c1a1a`) y otro en bottom (mismo valor) — que enmarcan la banda oscura como si fuera un "sello" tipográfico entre Hero y Products. El interior del grid de stats no se toca. Diferente a la propuesta VP-#3 de ENHANCE-1 (que proponía un acento de color `#e74c3c`): estos son hairlines de luz blanca pura sobre oscuro, mucho más discretos, que replican la lógica del gradient-border del Footer pero en versión simétrica.
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — en La Nonna las bandas oscuras tienen siempre un borde de luz que las "imprime" sobre el fondo, no las deja flotando.
- Por qué: La StatsStrip actualmente aparece y desaparece en el scroll sin ninguna marca de entrada/salida. Los hairlines de luz crean un "filo de sello" que da dignidad de sección sin tocar el interior bloqueado ni añadir color nuevo.

---

### CD-03 — Mic de pausa en el Nav: punto de marca entre los links centrales

- Sección: Nav
- Descripción: Los separadores `·` entre links del nav desktop son actualmente `color: #c8b8b8` en plain text. Propuesta: sustituir el carácter `·` por un SVG de 3×3px (círculo relleno `rgba(192,57,43,0.30)`) que pulsa suavemente (scale 1→1.15→1, 3s loop, offset por índice) cuando ningún link está en hover. Al hover de cualquier link, la animación se detiene (opacity reduce a 0.15). Genera una "cadencia de respiración" en el nav que indica que la marca está viva, no estática.
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ, con matiz — en La Nonna se aplicaría pero sin el loop de pulsación, que puede rozar el límite "limpio > saturado". Versión sin pulsación (punto fijo con opacity 0.30) también válida y más segura.
- Por qué: El Nav es la única zona del sitio con interactividad constante visible que permanece completamente inerte entre acciones del usuario. Un micro-detalle vivo en el separador — sin tocar tipografía ni color base — añade artesanía sin ruido.

---

### CD-04 — Eco visual Hero → CTA: hairline curvo de cierre en CTA

- Sección: CTA
- Descripción: El Hero abre con un fondo mesh melocotón y el CTA cierra la página con un gradiente `#5c1a1a → #c0392b`. La conexión visual entre ambos polos narrativos (apertura / llamada a comprar) se puede reforzar con un hairline SVG de curvatura suave (`path` en `rgba(245,198,194,0.18)`) en el borde superior del CTA — una línea de "ola" de 1px que evoca la organicidad del mesh del Hero. Ancho 100%, altura de curva 8px, completamente aria-hidden y pointer-events-none. No toca el fondo ni el layout.
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — La Nonna usa hairlines SVG curvos para marcar transiciones entre bandas de color sin añadir sombras duras.
- Por qué: Hero y CTA son los dos polos emocionales del sitio (promesa / acción). Sin ninguna señal visual de parentesco, el CTA puede sentirse como un elemento ajeno al universo del Hero. La curva hairline es el eco cromático que los conecta sin saturar.

---

### CD-05 — Microcopy aditivo Cart: hint de espera con voz tributo

- Sección: Cart
- Descripción: Bajo el estado vacío del Cart (`t.cart.empty`), añadir una segunda línea con voz capa A: en `es` → *"Las mejores fresas te esperan."*, en `ca` → *"Les millors maduixes t'esperen."*, en `en` → *"The finest strawberries await."*. Tipografía: `font-serif italic text-[#7a3a3a]/35 text-xs`. Solo aparece cuando la cesta está vacía. Aditivo puro al sistema de traducciones (nueva clave `cart.emptyHint`).
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — en La Nonna los estados vacíos tienen siempre una voz editorial, nunca se dejan en blanco funcional.
- Por qué: El Cart vacío es el momento de mayor frialdad transaccional del sitio. Una línea serif italic en el tono de la abuela transforma ese estado de "no hay nada" en "hay anticipación". Retoma exactamente E6 que quedó postergado (MC — `cart.emptyHint`), y es la única pieza de E6 que puede ir al Cart sin necesitar cambio de texto existente.

---

### CD-06 — Microcopy Checkout: voz tributo en la pantalla de éxito

- Sección: Checkout
- Descripción: La pantalla de éxito del Checkout tiene el tono más transaccional del sitio (`¡Pedido confirmado!`, `Gracias por tu compra,`). Propuesta ADITIVA (no reescritura — eso es E8 MIXTA): añadir una línea ornamental debajo del cuerpo del mensaje, antes del botón de vuelta, en `font-serif italic text-[#7a3a3a]/45 text-sm`. Texto sugerido en `es`: *"Con el mismo cariño de siempre."* Nueva clave de traducción `checkout.success.tributeHint`. No modifica las claves existentes.
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — La Nonna tiene siempre una línea de "firma de casa" en el estado de confirmación de reserva.
- Por qué: La confirmación de compra es el último momento de contacto emocional con el cliente. Sin ninguna capa tributo, el sitio termina funcionalmente igual que cualquier tienda online. Una línea serif suave cierra el ciclo Hero → compra con la voz de la abuela, que es exactamente el arco narrativo del sitio.

---

### CD-07 — Cadencia respiratoria: micro-pausa de entrada en cada `<section>` vía scroll-margin

- Sección: Global
- Descripción: Las secciones ancladas (About, Products, Contact) no tienen `scroll-margin-top` ajustado para el nav sticky de 72px. Al navegar con los links del nav, la sección aterriza pegada al borde inferior del nav. Propuesta: añadir `scroll-margin-top: 80px` (72px nav + 8px de respiro) como utility CSS global para todos los `[id]` dentro de `<main>`. Esto es puramente aditivo (no toca ningún layout ni fondo), y crea literalmente la "micro-pausa de entrada" que hace que cada sección respire al llegar.
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — en La Nonna este ajuste está presente y es la razón por la que el salto a cualquier sección se siente cuidado, no abrupto.
- Por qué: Es uno de los "moments" más descuidados del sitio. El usuario hace clic en "Sobre nosotros" y la sección aparece aplastada contra el nav. Es un defecto de cadencia que afecta a la percepción de cuidado editorial, no solo a la usabilidad.

---

### CD-08 — Hover refinado en el logo Nav: micro-opacidad de reconocimiento

- Sección: Nav
- Descripción: El logo del Nav (el `<a href="/">` que envuelve la Image) no tiene ningún estado hover. Propuesta: `transition: opacity 200ms ease` con `hover:opacity-80`. Un 20% de reducción de opacidad es el gesto más discreto posible de "este elemento es interactivo" — no escala, no sombra, no color. Compatible con el `mix-blend-mode: multiply` del logo.
- Tipo: ADITIVA
- Prioridad: BAJA
- Test "se vería en La Nonna": SÍ — en La Nonna el logo header tiene exactamente este gesto.
- Por qué: El logo-link es el único elemento interactivo del Nav sin ningún feedback visual de hover. Es un detalle de acabado menor pero que el ojo entrenado nota.

---

### CD-09 — Microtextura de papel en el Checkout (eco de AboutUs)

- Sección: Checkout
- Descripción: El Checkout (`bg-[#fdf6f5]`) y la página de éxito (mismo fondo) carecen de la microtextura de papel que AboutUs y Contact ya tienen aplicada en ENHANCE-1/ENHANCE-3. Añadir el mismo overlay SVG turbulence `opacity: 0.012` (el más discreto, el de Contact) como capa `aria-hidden absolute inset-0 pointer-events-none` sobre el `div` raíz del formulario. Cos visual Hero ↔ Contact ↔ Checkout sin coste perceptual.
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — La Nonna tiene la textura de papel en todas las páginas de fondo claro, no solo en algunas.
- Por qué: La coherencia de textura entre secciones del mismo tono de fondo (`#fdf6f5`) es lo que hace que un sitio se sienta como un sistema diseñado, no como páginas pegadas. El Checkout es actualmente la única superficie blanca importante sin este detalle.

---

### CD-10 — Easter egg de Checkout: título del tab "Para Mariana" durante el processing

- Sección: Checkout
- Descripción: Mientras `loading === true` (el spinner de procesamiento de Stripe está activo), modificar temporalmente `document.title` a *"Un momento · Yaya Mariana"* (restaurando el original al resolve). Aditivo puro: no toca UI, no toca traducciones existentes, no es visible en pantalla. Es un micro-momento de humanidad que solo nota quien tenga el tab visible. Bajo `prefers-reduced-motion` no aplica (no hay movimiento). Compatible con todos los idiomas.
- Tipo: ADITIVA
- Prioridad: BAJA
- Test "se vería en La Nonna": SÍ, con matiz — en La Nonna está el equivalente en el formulario de reserva.
- Por qué: Los easter eggs del sitio (console tribute, footer petal, quote-author halo) están todos en la página principal. El Checkout no tiene ninguno, y es el momento de mayor tensión emocional para el usuario. Un cambio de `document.title` es el easter egg de menor impacto técnico posible y el de mayor calidez inesperada.

---

### CD-11 — Hairline de respiro alrededor de StatsStrip en Products (no interior)

- Sección: Products (perímetro, no interior del grid)
- Descripción: La sección Products arranca directamente tras StatsStrip sin ningún elemento de transición. La distancia visual entre la banda oscura `#5c1a1a` y el primer card de producto es la única junta "dura" del sitio. Propuesta: añadir un `<div aria-hidden>` de `height: 1px` y `background: rgba(192,57,43,0.06)` en el top de la sección Products, que actúa como hairline de amortiguación visual. No toca el grid, no toca el layout, no toca las cards (bloqueadas).
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — La Nonna no tiene juntas duras entre secciones de tono muy diferente.
- Por qué: La transición StatsStrip (fondo oscuro `#5c1a1a`) → Products (fondo blanco) es la junta cromática más abrupta del sitio. Un hairline de amortiguación en el tono de marca a opacidad muy baja absorbe el contraste sin intervenir en el diseño.

---

### CD-12 — Microcopy Checkout: label semántico en la leyenda de secciones (voz editorial)

- Sección: Checkout
- Descripción: Las tres `<legend>` del formulario de Checkout (`Datos personales`, `Dirección de envío`, `Datos de pago`) son actualmente en `text-xs font-bold uppercase tracking-widest text-[#c0392b]`. El tracking actual es `tracking-widest` (Tailwind default 0.1em). Propuesta: añadir `font-feature-settings: 'cpsp'` via clase inline a las tres `<legend>`, igual que los headings del Footer. Solo OpenType refinement, sin modificar colores ni tipografía base.
- Tipo: ADITIVA
- Prioridad: BAJA
- Test "se vería en La Nonna": SÍ — en La Nonna las leyendas de formulario tienen OpenType capital spacing activado.
- Por qué: Las tres leyendas son los únicos textos en uppercase del Checkout sin `cpsp`. Es la inconsistencia OpenType más pequeña del sitio y la más sencilla de corregir.

---

### CD-13 — Momento de pausa: icono del Cart flotante con micro-rebote de bienvenida al primer ítem

- Sección: Cart
- Descripción: Cuando `count` pasa de 0 a 1 (primer ítem añadido a la cesta), el botón flotante del Cart ya hace `animate={{ scale: 1 }}` al montar. Propuesta: añadir un efecto `whileAnimate` de rebote muy suave (scale: 1→1.18→0.96→1.04→1, spring stiffness 400, damping 15) que se dispara **únicamente** al detectar el primer cambio de `count` de 0 a 1. Para `count > 1` (items adicionales), un rebote más pequeño (1→1.08→1). Aditivo puro: usa las APIs de framer-motion que ya están en el componente.
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ, con matiz — el rebote debe quedar por debajo del umbral "bounce" que Nil rechaza. Spring stiffness 400 / damping 15 es el límite: quedarse en stiffness ≤280 / damping ≥20 es la zona segura.
- Por qué: El primer "añadir al carrito" es el momento de máxima alegría comercial del sitio. El botón flotante actualmente no lo celebra de ninguna manera — el badge aparece con `scale: 0→1` pero el botón en sí no reacciona. Un micro-rebote suave (no bounce exagerado) hace que el gesto de añadir sienta como una respuesta viva, no una operación de base de datos.

---

## Notas transversales

**Prioridad de implementación sugerida:**
1. CD-07 (scroll-margin) — impacto inmediato en cadencia, cero riesgo.
2. CD-05 (Cart empty hint) + CD-06 (Checkout success) — voz tributo en los dos estados más fríos del sitio.
3. CD-01 + CD-02 + CD-11 (hairlines de costura y perímetro) — sistema de juntas completo.
4. CD-04 (eco Hero → CTA) — conexión narrativa visual de los dos polos.
5. CD-09 (textura Checkout) — consistencia de superficie.
6. CD-03 + CD-13 (micro-animaciones discretas Nav + Cart) — solo si los ítems 1-5 están en repo.
7. CD-08 + CD-10 + CD-12 (acabados menores) — pulido final.

**Propuestas E6/E8 postergadas retomadas:**
- CD-05 retoma E6 (`cart.emptyHint`) como ADITIVA pura (nueva clave, sin reescritura).
- CD-06 retoma parcialmente E8 pero en modo ADITIVO (nueva clave `checkout.success.tributeHint` — no modifica las claves existentes, por tanto no es MIXTA).
- Las reescrituras de E8 (empty cart rewrite, processing rewrite, success body rewrite) siguen siendo MIXTAS y requieren firma de Nil — no se incluyen aquí.
