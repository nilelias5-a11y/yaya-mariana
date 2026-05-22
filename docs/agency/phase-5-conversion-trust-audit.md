# Fase 5 — Auditoría de Conversión y Confianza · Yaya Mariana

> Agente: **conversion-funnel-optimizer** (asume además la función **trust-builder**, sin agente propio).
> Modo: **AUDIT** — detecta y propone, no modifica código. Dev server apagado, auditoría estática.
> Rama: `clasico` · HEAD `5e24960` · Fecha: 2026-05-22.
> Alcance: `src/components/ui/*.tsx`, `src/app/checkout/`, `src/i18n/translations.ts`, `src/context/cart-context.tsx`, `src/lib/season.ts`.

---

## 0 · Resumen ejecutivo

**Conversión primaria:** compra DTC completada (carrito → `/checkout` con Stripe).
**Cuota de tráfico móvil estimada (sector DTC fresas premium):** ~65–75% — mobile-majority; el embudo móvil pesa más que el desktop.
**Benchmark de sector (DTC alimentación premium / artesanal):** suelo 1–2% de conversión, objetivo 2,5–4% sobre visitantes; abandono de checkout típico 65–75%.
**Score de readiness de conversión:** **6,1 / 10** — FAIL (umbral del clan perfeccionista 8,5).
**Veredicto:** corregir antes de `quality-gate`. El bloqueante es **estructural y único** (no hay paso "producto" entre el catálogo y el pago), y arrastra al resto de la nota.

El sitio está visualmente resuelto (Fase 4.5 cerró en 8,7), con motion sobrio coherente con el tono tributo y señales de confianza bien sembradas. Pero **el embudo de compra tiene un agujero crítico**: cuatro de los cinco caminos hacia la compra saltan el carrito y depositan al visitante en un checkout vacío. La conversión real, hoy, depende de que el visitante encuentre por sí solo el único botón correcto ("Añadir al carrito") entre seis CTAs que compiten — y la mayoría no lo hará.

---

## 1 · Mapa del embudo (tal como está construido)

Página única (`src/app/page.tsx`): `Hero · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer` + `Cart` (drawer) → `/checkout` (Stripe).

| Etapa | ¿Implementada? | Riesgo de fricción | Caída est. |
|---|---|---|---|
| **Entrada** | SÍ | Landing = home única; sin conciencia de canal, aceptable para lanzamiento limpio | BAJA |
| **Comprensión (test 5 s)** | PARCIAL | El `<h1>` es una **cita** ("Todo lo bueno de la vida requiere paciencia…"); no nombra producto ni categoría. Marca + "fresas" solo aparecen en el eyebrow (11px) y el logo | ALTA |
| **Intención** | PARCIAL | Hero ofrece "Ver nuestras fresas" (→ ancla a Products) y "Ver tienda" (→ `/checkout` directo). Dos rutas que prometen lo mismo y aterrizan en sitios distintos | MEDIA |
| **Consideración** | PARCIAL | Hay historia (AboutUs), valores y trazabilidad; **no hay prueba social** (ni reseñas, ni valoraciones, ni testimonios) en todo el sitio | ALTA |
| **Decisión** | NO (roto) | El único botón que avanza el embudo real ("Añadir al carrito") compite con 5 CTAs que dicen "comprar/ver tienda" y saltan al pago. El visitante no sabe cuál es el paso correcto | ALTA |
| **Acción** | PARCIAL | Checkout de 5 campos, todos necesarios, con autocomplete y validación accesible — bien. Pero **se llega con el carrito vacío** desde 4 de 5 rutas → checkout inutilizable | CRÍTICA |
| **Confirmación** | SÍ | Página de éxito clara, nombra al cliente y el email. Correcta | BAJA |

**Diagnóstico del mapa:** las etapas Comprensión, Decisión y Acción fallan. Decisión y Acción fallan por la **misma causa raíz**: el modelo de datos del sitio tiene productos y tiene carrito, pero **no tiene página de producto (PDP)** ni una "tienda" — y la mitad de la UI enlaza a destinos que no existen como tales.

---

## 2 · EMBUDO / CTAs — Issues detectados

| # | Ubicación | Problema | Severidad | Clase | Lift est. | Fix | Se mide con |
|---|---|---|---|---|---|---|---|
| **E1** | `products.tsx:382-383` `viewMore` · `cta.tsx:48` `buyNow` · `about-us.tsx:62` `viewStore` · `hero.tsx:182,277` `verTienda` · `footer.tsx:64-67` (4 links de "Tienda") | **11 enlaces apuntan a `/checkout` sin pasar por el carrito.** `/checkout` (`checkout.tsx`) renderiza solo desde `useCart()`; si el carrito está vacío, el resumen sale en blanco y el botón dice **`Pagar 0.00€`** — el `<400` de la API lo rechazaría (`amount < 50`). El visitante que pulsa "Comprar ahora" llega a un checkout muerto. **Es el bloqueante #1 de conversión.** | **CRÍTICA** | LARGE LIFT | Decidir el modelo: (a) abrir PDP por producto y que estos CTA lleven ahí; o (b) si no hay PDP, **re-apuntar todos los CTA de "comprar/ver tienda" a `#productos`** y que la compra empiece SIEMPRE por "Añadir al carrito". Mínimo viable: opción (b) + en `/checkout` con carrito vacío, redirigir a `#productos` con un mensaje "Tu cesta está vacía". | Tasa de checkout iniciado vs. completado; % de sesiones que llegan a `/checkout` con carrito vacío |
| **E2** | `checkout.tsx:30-352` | El checkout **no defiende el estado de carrito vacío**: sin items muestra resumen vacío y `Pagar 0.00€`. No hay guard ni redirección ni vacío con CTA de retorno. | **CRÍTICA** | QUICK WIN | `if (items.length === 0) return <EmptyCheckout/>` con copy "Tu cesta está vacía" + botón "Ver las fresas" → `/#productos`. Resuelve el síntoma de E1 aunque la decisión de PDP se posponga. | Bounce en `/checkout`; pagos rechazados por importe < 0,50€ |
| **E3** | `products.tsx:382-390` | Dentro de la **misma card** conviven dos CTAs: "Ver más" (link, → `/checkout`) y "Añadir al carrito" (botón sólido). "Ver más" no lleva a "más" — lleva al pago. El visitante que quiere *saber más* acaba en el pago; el que quiere *comprar* tiene el botón correcto al lado pero sin jerarquía clara de "este es el paso". Competencia de CTAs dentro de la card. | **ALTA** | QUICK WIN / MEDIUM | Si hay PDP: "Ver más" → PDP (correcto). Si no hay PDP: **eliminar "Ver más"** — no aporta destino real y diluye el botón de compra. La card queda con un único CTA inequívoco. | Squint test de la card; tap-rate "Añadir al carrito" por card |
| **E4** | `hero.tsx` (nav + columna izq.) | Cuatro CTAs en el primer viewport: nav "Ver tienda →", hamburguesa móvil "Ver tienda", hero "Ver nuestras fresas" (primario), hero "Nuestra historia" (secundario). "Ver tienda" (nav) y "Ver nuestras fresas" (hero) **prometen lo mismo y van a destinos distintos** (`/checkout` vs `#productos`). El visitante no tiene un único "siguiente paso" claro. | **ALTA** | QUICK WIN | Unificar destino: el CTA de nav y el primario del Hero deben llevar al **mismo sitio** (`#productos`). Verbo del nav: "Ver tienda" → coherente con que abajo se llama Products; o renombrar a "Comprar fresas" y que ambos vayan a `#productos`. | Test 5 s "¿qué hago aquí?"; tap-rate por CTA del Hero |
| **E5** | `cart.tsx:11-69` (FAB) · ausencia de barra sticky | El acceso al carrito es un **FAB flotante** abajo-derecha. No hay barra de compra sticky ni contador en el header. En móvil, tras hojear Products, el visitante no tiene el CTA de compra "a un toque": depende de localizar el FAB. El badge solo aparece si `count>0` — antes de añadir nada, el icono de carrito no comunica "aquí compras". | **ALTA** | MEDIUM LIFT | Mantener el FAB, pero el camino primario de compra es "Añadir al carrito" en la card → el drawer se abre **automáticamente al añadir** (hoy no se abre; el visitante añade y no recibe confirmación de que el carrito tiene algo más allá del badge del FAB y el "Añadido" efímero de 1,6 s). Abrir el drawer al añadir = el "siguiente paso" (Tramitar) aparece solo. | Tasa carrito-abierto tras "Añadir"; checkout iniciado |
| **E6** | `products.tsx:278-282` `handleAddToCart` | Al añadir, el botón muestra "Añadido" 1600 ms y vuelve. **No se abre el carrito, no se hace scroll al FAB, no hay micro-confirmación persistente.** El visitante puede añadir 3 productos sin tener nunca a la vista el paso "Tramitar pedido". El embudo se interrumpe justo después de la microconversión más importante. | **ALTA** | QUICK WIN | Al añadir: abrir el drawer del carrito (o, alternativa más discreta y coherente con el tono tributo, un toast no intrusivo "Añadido a tu cesta · Ver cesta" que enlaza al drawer). El drawer ya tiene el botón "Ir a pagar" — solo hay que ponerlo delante del visitante. | % de "Añadir" seguidos de apertura de carrito en < 5 s |
| **E7** | `footer.tsx:60-91` | Columna "Tienda": "Fresa Mágnum / Dream / 1525 / Ver todos los productos" — **los 4 enlazan a `/checkout`**. Un visitante que pulsa "Fresa Mágnum" en el footer espera ver ESA fresa; aterriza en un pago vacío. Mismo defecto que E1, en una zona de alta intención (footer = visitante que ha leído todo). | **ALTA** | QUICK WIN | Re-apuntar los 3 productos a `#productos` (o a su PDP/ancla si se crea) y "Ver todos los productos" a `#productos`. | Clicks footer-tienda → checkout vacío |
| **E8** | `cta.tsx:53-58` `ourStory` | En la sección CTA (la sección cuyo trabajo es **cerrar la compra**), el botón secundario "Conocer nuestra historia" enlaza hacia arriba (`#sobre-nosotros`) — empuja al visitante **lejos** del momento de decisión, de vuelta a la mitad de la página. En la sección de cierre el secundario debería ser neutro o ausente, no un viaje de vuelta. | **MEDIA** | QUICK WIN | Quitar el secundario de la sección CTA, o sustituirlo por algo que no aleje del cierre (p. ej. enlace a envíos/garantía). El primario "Comprar ahora" debe quedar como protagonista sin competencia. | Tap-rate secundario CTA; scroll-up tras llegar a CTA |
| **E9** | `hero.tsx:333-358` | El `<h1>` de la página es **la cita de la abuela**, no un titular de producto. El test de 5 segundos no se pasa: el visitante no puede responder "¿qué es esto?" — "fresas" / "Tarragona" / "premium" viven solo en el eyebrow de 11px y en el logo. (Decisión de marca Path T ratificada por Nil; no es un fallo de implementación, pero **sí tiene coste de conversión** y debe constar.) | **MEDIA** | A/B PROPOSAL | No tocar la dirección de marca. Proponer A/B: el subtítulo del Hero (`t.hero.subtitle`, hoy presente en `translations.ts` pero **no renderizado** en `hero.tsx`) podría montarse bajo la cita — ya dice "Fresas frescas de Tarragona…". Recuperar ese subtítulo da la categoría sin tocar el `<h1>` ni el tono. | Test 5 s pass-rate; bounce del Hero |
| **E10** | `products.tsx` (precio uniforme) | Las 3 variedades cuestan **7.50€/500g idénticos** (placeholder intencional — Joan Carles dará los reales). No es defecto de conversión, pero **la uniformidad total puede leerse como "precio de maqueta"** y resta credibilidad: tres productos "premium" con precio calcado sugiere que el precio no es real. | **BAJA** | (pendiente dato real) | No marcar como defecto. Nota para cuando lleguen precios reales: una variación leve entre variedades (aunque sea 7,50 / 8,00 / 8,50) refuerza que el precio es real y que las variedades se diferencian. | — (post-dato real) |
| **E11** | `checkout.tsx` | Checkout single-page, 5 campos, todos necesarios (nombre, email, dirección, ciudad, CP) + tarjeta. `autoComplete` correcto en todos, `inputMode`, `enterKeyHint`, validación accesible. **Sin defecto** — es checkout invitado (no exige cuenta), bien. Único matiz: no hay Apple Pay / Google Pay pese a que `automatic_payment_methods` está activado en la API — el `CardElement` solo acepta tarjeta. | BAJA | MEDIUM LIFT | Considerar el `PaymentElement` de Stripe (en vez de `CardElement`) para exponer Apple/Google Pay — lift de 10–25% en checkout móvil. Cambio estructural → planificar, no urgente. | Conversión de checkout móvil vs. desktop |

### Resumen embudo/CTAs
- **2 CRÍTICOS** (E1, E2) — mismo evento raíz: no hay paso "producto" y el checkout no se defiende del carrito vacío.
- **5 ALTOS** (E3, E4, E5, E6, E7).
- **2 MEDIOS** (E8, E9).
- **2 BAJOS** (E10, E11).

---

## 3 · SEÑALES DE CONFIANZA (función trust-builder)

DTC alimentario premium: el comprador entrega tarjeta a una marca que no conoce, para fruta perecedera que viaja. La confianza es el 50% de la conversión. Evaluación dentro del **tono tributo / restraint** — sin inflar, sin sellos de hype.

### 3.1 · Lo que YA transmite confianza (a conservar)

- **Trazabilidad** — el chip "Recogida en Tarragona · semana 21" en cada card de producto es una señal de confianza honesta y concreta, muy bien situada (decisión gate 2.5: en Products, no en Hero). Excelente.
- **Cold-chain** — el micro-bloque "Recogida la víspera · Cadena de frío · Entrega en 24–48 h" en el CTA responde a la objeción central del DTC de fruta (¿llegará fresca?).
- **Seguridad de pago** — "Pago seguro gestionado por Stripe. No almacenamos datos de tu tarjeta." bajo el `CardElement`. Correcto y bien ubicado (junto al campo, no en un FAQ).
- **Garantía / devolución** — "Devolución en 14 días" entre los trust badges del CTA.
- **Origen y método** — "Sin pesticidas", "Cosecha propia", "100% natural" repetidos de forma coherente; el StatsStrip los cuantifica.
- **Contacto real** — dirección, email y teléfono presentes, con `tel:` y `mailto:` enlazados (Contact). Bien.
- **Historia / autoría** — AboutUs da cara y relato; "J. Elías, fundador" firma. Da un humano detrás de la marca.

### 3.2 · Señales de confianza — Issues detectados

| # | Ubicación | Problema | Severidad | Clase | Lift est. | Fix | Se mide con |
|---|---|---|---|---|---|---|---|
| **T1** | Todo el sitio | **No hay NINGUNA prueba social.** Ni reseñas, ni valoración con estrellas, ni testimonios de clientes, ni recuento de clientes/pedidos, ni "visto en". Para un DTC desconocido que pide tarjeta, la prueba social es la señal de confianza de mayor peso, y aquí está al 0%. Es la mayor carencia de confianza del sitio. | **ALTA** | MEDIUM LIFT | Añadir una franja sobria de prueba social — coherente con el tono: no "★★★★★ 4,9 ¡COMPRA YA!", sino 2–3 testimonios reales en tipografía serif tranquila, o una valoración real cuando exista. Ubicar **justo antes del CTA de cierre** (momento de duda). Si aún no hay clientes reales, dejar el slot diseñado y documentado como placeholder pendiente de dato real (igual que el precio o el retrato). NO inventar reseñas — sería dark pattern (CRÍTICO). | Tasa de inicio de checkout antes/después |
| **T2** | `checkout.tsx:340` · `cart.tsx:194` | **Coste de envío opacо hasta el final.** Cart: "Envío — Calculado al pagar". Checkout: "Envío — A calcular". El total nunca incluye envío; el visitante paga `total` sin envío y nunca ve el cargo de envío real. El coste de envío sorpresa es causa top-3 de abandono de checkout. Además contradice el badge "Envío gratuito" del CTA. | **ALTA** | QUICK WIN / MEDIUM | Si el envío es gratis (lo dice el badge del CTA "Envío gratuito"), **decirlo en el carrito y en el checkout**: "Envío — Gratuito". Si no es gratis, mostrar el importe o el umbral ("Gratis a partir de X€") antes del paso de pago. La incoherencia badge vs. checkout debe resolverse con dato real de Joan Carles. Hoy: alinear el copy — el carrito no puede decir "a calcular" si la marca promete envío gratuito. | Abandono en el paso de pago; tickets de soporte por envío |
| **T3** | `cta.tsx:90-95` badges | Los trust badges ("Envío gratuito", "Sin pesticidas", "Cosecha propia", "Devolución en 14 días") viven **solo en la sección CTA**, casi al final de la página. El visitante que decide en Products (arriba) no los ve. Las señales de reducción de riesgo deben estar **junto a la acción**, y la primera acción es "Añadir al carrito". | **MEDIA** | QUICK WIN | Replicar 1–2 señales clave ("Envío gratuito", "Devolución 14 días") en el drawer del carrito, junto al botón "Ir a pagar" — el momento exacto de duda antes de tramitar. Reduce abandono del carrito sin recargar Products. | Abandono del drawer de carrito |
| **T4** | `checkout.tsx` | El checkout **no repite ninguna señal de confianza más allá del texto de Stripe**. No hay recordatorio de devolución/garantía, ni de envío, ni de "compra protegida" en el momento de máxima ansiedad (entregar la tarjeta). El visitante que llega aquí desde un carrito ya no ve los badges del CTA. | **MEDIA** | QUICK WIN | Añadir una línea sobria bajo el botón "Pagar": "Devolución en 14 días · Envío con cadena de frío" — reduce la ansiedad del último paso. Tono restraint, sin iconos de hype. | Abandono entre carga de `/checkout` y "Pagar" |
| **T5** | `cta.tsx:73-80` badges | El icono de los 4 trust badges es **una estrella** (`<path d="M8 1L10 6h5..."/>`) para los cuatro por igual. Una estrella junto a "Envío gratuito" o "Devolución" lee como decoración genérica de marketing y, peor, puede confundirse con una valoración. No comunica la señal concreta. | **BAJA** | QUICK WIN | Iconos específicos por badge (camión = envío, hoja = sin pesticidas, etc.) o, más coherente con el restraint, sin icono — solo la palabra. La estrella repetida x4 resta, no suma. | — (refinamiento) |
| **T6** | `contact.tsx:75-88` · placeholders | Dirección "C/ Electrónica 19, Badalona" (HQ fiscal de Audax — legalmente correcta), teléfono `+34 666 777 888` y email `info@yaya-mariana.com` son **placeholders intencionales**. No marcar como defecto. Nota de confianza: un teléfono `666 777 888` es visiblemente de relleno; cuando llegue el real, sustituir — un teléfono "de maqueta" en producción dañaría la credibilidad. El email con guion es intencional (no "corregir"). | BAJA | (pendiente dato real) | No tocar. Recordatorio para pre-launch: teléfono real obligatorio antes de deploy. La dirección de cultivo (Tarragona) podría además mencionarse junto a la fiscal — refuerza el "de dónde vienen las fresas". | — (pre-launch) |
| **T7** | `footer.tsx:84-89` · legales | "Política de privacidad", "Política de devolución", "Aviso legal" enlazan a `#` (stub — páginas pendientes de redacción). Para un e-commerce que cobra con tarjeta, **la ausencia de política de devolución y de privacidad accesibles es una carencia de confianza real** (y un riesgo legal RGPD/LSSI). El badge "Devolución en 14 días" promete algo que no tiene página que lo respalde. | **MEDIA** | MEDIUM LIFT (fuera de scope de audit) | Antes de deploy real: redactar y publicar Política de devolución, Privacidad y Aviso legal. No es trabajo de esta fase, pero debe constar como bloqueante de lanzamiento — un DTC sin política de devolución visible pierde compradores y vulnera normativa. | — (bloqueante pre-launch) |
| **T8** | `cta.tsx` off-season + `contact.tsx` | La captura de email off-season (`OffSeasonCTA`) tiene consentimiento RGPD desmarcado por defecto y promete double opt-in — **bien hecho, señal de respeto al usuario**. El formulario de Contact hace `setSent(true)` falso (placeholder hasta Resend). No es defecto de confianza hoy, pero el form de contacto que "dice enviado" sin enviar es un riesgo: si un cliente escribe y nadie responde, la confianza se rompe. Documentado como placeholder intencional. | BAJA | (pendiente integración) | No tocar. Recordatorio: la integración Resend del form de Contact debe estar antes de deploy — un "mensaje enviado" que no llega a nadie es peor que no tener formulario. | — (pre-launch) |

### Resumen señales de confianza
- **0 CRÍTICOS.**
- **2 ALTOS** (T1 prueba social ausente, T2 envío opaco).
- **3 MEDIOS** (T3, T4, T7).
- **3 BAJOS** (T5, T6, T8).

**Diagnóstico de confianza:** la base honesta está bien puesta (trazabilidad, cold-chain, Stripe, historia) y el tono restraint se respeta. Faltan dos cosas de peso: **prueba social** (cero) y **transparencia de envío** (opaco hasta el final, además incoherente con el badge "gratuito"). Ambas se pueden resolver dentro del registro homenaje, sin un solo signo de exclamación.

---

## 4 · Auditoría de señales honestas

**PASS** — sin urgencia manufacturada, sin escasez falsa, sin contadores, sin dark patterns. El tono tributo se respeta en todo el sitio: ni un "¡compra ya!", ni temporizadores, ni "quedan X". La variante off-season usa consentimiento desmarcado y double opt-in (respeto al usuario). El único riesgo de dark pattern sería **inventar prueba social** para tapar T1 — explícitamente prohibido: si no hay reseñas reales, el slot queda como placeholder, no se rellena con testimonios ficticios.

---

## 5 · Quick wins (aplicar de inmediato)

1. **E2** — Guard de carrito vacío en `/checkout`: render de "Tu cesta está vacía" + botón a `#productos`. Tapa el síntoma del bloqueante crítico aunque se posponga la decisión de PDP.
2. **E1 / E7** — Re-apuntar los 11 enlaces "comprar/ver tienda" de `/checkout` a `#productos` (mientras no exista PDP). El embudo de compra empieza siempre por "Añadir al carrito".
3. **E6** — Abrir el drawer del carrito al pulsar "Añadir al carrito" (o toast "Añadido · Ver cesta"). Pone el paso "Tramitar" delante del visitante.
4. **E3** — Eliminar "Ver más" de la card de producto si no hay PDP (no tiene destino real; diluye el botón de compra).
5. **E4** — Unificar el destino del CTA del nav y del primario del Hero (ambos a `#productos`).
6. **E8** — Quitar de la sección CTA el secundario "Conocer nuestra historia" (empuja lejos del cierre).
7. **T2** — Alinear el copy de envío: si es gratuito, decir "Envío — Gratuito" en carrito y checkout; eliminar "a calcular".
8. **T3 / T4** — Replicar "Envío gratuito · Devolución 14 días" en el drawer del carrito y bajo el botón "Pagar" del checkout.
9. **T5** — Iconos específicos (o sin icono) en los trust badges; retirar la estrella x4.

## 6 · Medium lift (planificar en iteración)

- **E5** — Estrategia de acceso al carrito coherente con el flujo "Añadir → drawer se abre solo".
- **T1** — Slot de prueba social sobrio antes del CTA de cierre (placeholder si aún no hay reseñas reales).
- **E11** — Migrar `CardElement` → `PaymentElement` de Stripe para exponer Apple Pay / Google Pay.
- **T7** — Redactar y publicar Política de devolución, Privacidad y Aviso legal (bloqueante de deploy).

## 7 · Decisión estructural para `director` / Nil

**El issue raíz (E1) requiere una decisión que supera el modo AUDIT:** ¿el sitio tendrá página de producto (PDP)?

- **Opción A — sin PDP (mínimo, dentro de scope de audit-fixes):** todos los CTA de "comprar/ver tienda" → `#productos`; la compra empieza por "Añadir al carrito"; guard de carrito vacío en checkout. Resuelve el bloqueante con cambios quirúrgicos de `href` + un componente de estado vacío. **Recomendada** para no abrir un rediseño en fase de optimización.
- **Opción B — con PDP:** crear ruta `/producto/[variedad]` con galería, descripción ampliada, trazabilidad, "Añadir al carrito". "Ver más" cobra sentido. Es **cambio estructural** (añade IA / rutas) → requiere confirmación de Nil según el umbral de "major change" del proyecto.

El audit recomienda **Opción A** para Fase 5: cierra el agujero del embudo sin reabrir arquitectura. La PDP puede ser una mejora posterior.

## 8 · A/B test propuesto

- **Hipótesis:** recuperar el subtítulo del Hero (`t.hero.subtitle`, ya existe en `translations.ts`, hoy no renderizado) bajo la cita `<h1>` mejora el test de 5 s sin tocar la dirección de marca Path T.
- **Variante A (actual):** cita `<h1>` + autor, sin subtítulo.
- **Variante B:** cita `<h1>` + autor + subtítulo "Fresas frescas de Tarragona, cultivadas con el mismo cariño…".
- **Métrica:** bounce del Hero, scroll-depth a Products, pass-rate del test 5 s.
- **Duración:** 2–3 semanas o 1.000 sesiones por variante.

## 9 · KPIs a instrumentar (handoff a `frontend-developer` / `seo-writer`, consent-aware)

- Tasa por etapa del embudo: Hero visto → Products visto → "Añadir al carrito" → carrito abierto → `/checkout` cargado → pago completado.
- % de sesiones que llegan a `/checkout` con carrito vacío (debe tender a 0 tras E1/E2).
- Tasa de abandono del drawer de carrito.
- Conversión de checkout móvil vs. desktop (paridad esperada o móvil superior).
- Tasa "Añadir al carrito" → carrito abierto en < 5 s.
- Eventos `tel:` y `mailto:` (Contact).
- Tiempo hasta la compra.
- Conversión segmentada por canal (orgánico / directo / social).

---

## 10 · Score y veredicto

| Dimensión | Nota | Comentario |
|---|---|---|
| Mapa del embudo | 5,5 | Etapas presentes pero Decisión y Acción rotas por la misma causa |
| Claridad y visibilidad de CTAs (punto prioritario de Nil) | 5,0 | Botones visibles y bien contrastados, pero **compiten y van a destinos incoherentes**; el visitante no siempre sabe el siguiente paso |
| Fricción / checkout | 7,5 | Checkout invitado, 5 campos necesarios, autocomplete y validación accesibles — sólido; resta el carrito vacío |
| Señales de confianza | 6,5 | Base honesta bien puesta; faltan prueba social y transparencia de envío |
| Señales honestas (tono tributo) | 10 | Sin urgencia, sin escasez, sin dark patterns — impecable |
| **SCORE GLOBAL DE CONVERSIÓN** | **6,1 / 10** | **FAIL** (umbral 8,5) |

**Recuento de defectos:** **2 CRÍTICOS · 7 ALTOS · 5 MEDIOS · 5 BAJOS** (19 issues; E10/T6/T8 son notas sobre placeholders intencionales, no defectos de cuenta — defectos reales: 2 CRÍTICOS · 7 ALTOS · 5 MEDIOS · 2 BAJOS = 16).

**Proyección post-fix:** aplicando los 9 quick wins + T1 (prueba social) la nota proyecta **8,4–8,8** — los CRÍTICOS son cierres de `href` + un componente de estado vacío, esfuerzo bajo y lift alto.

**Status:** **FAIL — correcciones obligatorias antes de `quality-gate`.** El bloqueante (E1/E2) es de bajo esfuerzo si se toma la Opción A.

**Handoff:** `director`/Nil (decisión PDP — punto 7) · `frontend-developer` (E1-E8, T2-T5: re-apuntar hrefs, guard de checkout, abrir drawer al añadir) · `copywriter` (copy de envío T2, estado vacío E2, verbos de CTA E4) · `ui-designer` (slot de prueba social T1, iconos de badge T5) · `quality-gate` (agregación final).

---

## Diagnóstico (2 frases)

El sitio está visualmente resuelto y honesto en su tono, pero el embudo de compra tiene un agujero estructural: cuatro de las cinco rutas hacia la compra saltan el carrito y depositan al visitante en un checkout vacío e inutilizable, porque el sitio tiene productos y carrito pero no un paso intermedio de "producto/tienda" al que esos CTA puedan apuntar. Resuelto eso —re-apuntando los CTA a `#productos`, blindando el checkout contra el carrito vacío y abriendo el carrito al añadir— y sumada una franja sobria de prueba social y transparencia de envío, la conversión pasa de 6,1 a la banda de aprobado sin traicionar ni un gramo del registro homenaje.
