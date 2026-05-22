# Fase 5 — Auditoría de Texto (Copywriter + Microcopy)

**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES)
**Rama:** `clasico` · **Modo:** AUDIT (estático, sin tocar código) · **Fecha:** 2026-05-22
**Agente:** copywriter (asume además la función no-agente *micro-copy-master*)
**Alcance:** `src/i18n/translations.ts` (ES/CA/EN) + uso del texto en `src/components/ui/*.tsx` + `src/app/checkout/`

---

## 1. Resumen ejecutivo

**Score global de texto: 6.5 / 10**

El copy narrativo de la home está, en general, en buen estado de tono tributo: la sección About usa primera persona y pasado para hablar de Mariana ("cuidaba", "recogía"), el footer cierra con "En memoria de Mariana", y no hay exclamaciones de hype ni "descubre" en el cuerpo narrativo. El problema de "pulido" que señala Nil es real pero está **concentrado en el microcopy**, no en la narrativa:

1. **El checkout entero está hardcodeado en español** (~15 strings) — fuera del sistema i18n. Un usuario en CA o EN ve el carrito y la home traducidos y luego un checkout 100% en castellano. Es el defecto más grave de la auditoría.
2. **Incoherencias trilingües**: registro distinto entre ES/CA/EN en varios strings, una errata gramatical en CA (`offSeason`), y signos de interrogación inconsistentes en los títulos del Hero/CTA.
3. **El copy narrativo tiene varias frases genéricas tipo folleto** ("compromiso con el medio ambiente", "refuerzan el sistema inmunológico") que chocan con el tono tributo artesanal del resto.
4. **Microcopy de CTA inconsistente**: cuatro etiquetas distintas para acciones de compra que no escalan ("Ver nuestras fresas", "Comprar ahora", "Añadir al carrito", "Ir a pagar", "Ver tienda") — algunas correctas, pero el conjunto no comunica una jerarquía clara.

Diagnóstico (2 frases): la narrativa de homenaje está bien encaminada y solo necesita podar 5-6 frases de folleto que delatan el origen "abuela genérica"; el grueso del trabajo de pulido es microcopy — un checkout sin traducir, errata en catalán y cuatro verbos de compra sin jerarquía. Es trabajo quirúrgico, no reescritura: la voz ya existe, falta consistencia.

### Recuento de defectos por severidad

| Severidad | Copy narrativo | Microcopy | Total |
|---|---|---|---|
| CRÍTICO | 0 | 1 | **1** |
| ALTO | 3 | 5 | **8** |
| MEDIO | 5 | 7 | **12** |
| BAJO | 3 | 6 | **9** |
| **Total** | **11** | **19** | **30** |

---

## 2. COPY NARRATIVO

Secciones auditadas: Hero · Products · About · Values · CTA · Contact.

| # | Ubicación (clave i18n) | Texto actual | Problema | Propuesta de reescritura | Sev. |
|---|---|---|---|---|---|
| N1 | `values.subtitle` (es) | "Cada fresa que cultivamos lleva consigo nutrición, sabor y **compromiso con el medio ambiente**." | Frase de folleto corporativo. "Compromiso con el medio ambiente" es buzzword vacío; choca con el tono artesanal y concreto de About. | "Cada fresa que cultivamos lleva dentro lo que la tierra le dio: sabor, alimento y el respeto con que se cuidó." | ALTO |
| N2 | `values.benefits[0].description` (es) | "...vitamina C, antioxidantes y ácido fólico que **refuerzan el sistema inmunológico**." | Lenguaje de etiqueta de suplemento / claim cuasi-médico. Tono clínico ajeno a la voz de la marca. | "...vitamina C, antioxidantes y ácido fólico — lo que una fruta cuidada da de forma natural." | ALTO |
| N3 | `values.benefits[4].description` (es) | "Alto contenido en antocianinas y polifenoles que **protegen las células del estrés oxidativo** y favorecen la **salud cardiovascular**." | Idéntico problema: jerga nutricional clínica. Es la frase más fría de toda la web. | "Ricas en antocianinas y polifenoles, los antioxidantes naturales que les dan su color intenso." | ALTO |
| N4 | `hero.subtitle` (es) | "...cultivadas con el mismo cariño que le pondría **tu abuela**." | Capa A (promesa universal "amor de abuela") y Capa B (tributo a Mariana) colapsadas: "tu abuela" usa la abuela como metáfora genérica justo bajo una cita firmada por "Yaya Mariana". Roza el patrón que la regla de tono prohíbe. | "...cultivadas sin prisa, con el cuidado que Mariana ponía en las suyas. Sin pesticidas, naturales y siempre en su punto." | MEDIO |
| N5 | `values.benefits[1].description` (es) | "Las fresas son **casi todo agua**. Por eso resultan tan jugosas y ligeras..." | "Casi todo agua" suena a dato de Wikipedia y resta valor al producto premium (la fruta "es agua"). | "Jugosas y ligeras: refrescan con cada bocado, sin pesar." | MEDIO |
| N6 | `cta.eyebrow` (es) | "Directo de la granja a tu mesa" | Cliché de marketing agroalimentario, muy gastado. Además duplica el mensaje de `products.subtitle` ("Directas del campo a tu mesa"). | "Recién recogidas" — o eliminar el eyebrow y dejar respirar el título. | MEDIO |
| N7 | `values.title` (es) | "Frescas desde el campo" | Título de sección flojo y genérico; no dice nada que no diga ya el subtítulo. La sección habla de propiedades de la fruta, no de frescura. | "Lo que llevan dentro" — o "Por qué saben así". | MEDIO |
| N8 | `about.p2` (es) | "...con la misma paciencia que ella ponía. **Solo el sol, la tierra y el cuidado de nuestras manos.**" | La última frase es buena pero la fórmula "Solo X, Y y Z" es muy usada; correcta, no urgente. Marcada como pulido opcional. | Mantener — o variar: "Nada más que sol, tierra y manos que no tienen prisa." | BAJO |
| N9 | `products.subtitle` vs `hero.subtitle` vs `footer.description` | "Cultivadas sin pesticidas" / "Sin pesticidas" / "sin pesticidas" | "Sin pesticidas" aparece literalmente 6 veces en la web (hero, products, values, cta subtitle, cta badge, footer). Repetición que diluye el mensaje. | Conservar en 2-3 puntos de alta visibilidad (hero + badge CTA); en products/footer variar a "cultivo limpio" o "sin químicos". | BAJO |
| N10 | `cta.title` + `titleEm` (es) | "¿Listo para probar las fresas / de Yaya Mariana?" | Correcto en tono, pero "¿Listo para probar...?" es estructura de anuncio estándar. Aceptable; no es hype. Pulido opcional. | "Las fresas de Yaya Mariana, en tu mesa" (afirmativo, más sereno). | BAJO |
| N11 | `about.title` + `titleEm` (es) | "Lo que ella cultivaba, *seguimos cuidando*" | **Acierto** — registrado como referencia de tono correcto: pasado para ella, presente para la continuación. Sin acción. | — | OK |

### Notas de copy narrativo

- El bloque `about.p1`/`p2` y las dos citas (`hero.quoteText`, `about.quote`) son el núcleo tonal y están **bien**: pasado para Mariana, presente para el proyecto, sin hype. No tocar.
- `about.quoteAuthor` = "J. Elías, fundador" en es/ca/en — **correcto**, identidad del inversor protegida. Verificado en los 3 idiomas.
- El problema de fondo de Values: las descripciones se escribieron como ficha nutricional de e-commerce, no como la voz de Mariana. N1-N3 son la misma raíz y deben reescribirse juntas para no dejar la sección a dos voces.

---

## 3. MICROCOPY

Labels, placeholders, botones/CTAs, mensajes de éxito/error/vacío, aria-labels, chip de trazabilidad, badges, footer.

| # | Ubicación | Texto actual | Problema | Propuesta de reescritura | Sev. |
|---|---|---|---|---|---|
| M1 | `src/components/ui/checkout.tsx` (TODO el componente) | "Finalizar pedido", "Datos personales", "Dirección de envío", "Datos de pago", "Nombre completo", "Resumen del pedido", "Volver", "Volver al inicio", "¡Pedido confirmado!", "Pago seguro gestionado por Stripe...", "Pagar {x}€", "Procesando...", "A calcular", placeholders ("Ana García", "Calle Mayor 1, 3ºA", "Barcelona", "08001", "ana@ejemplo.com") | **CRÍTICO.** El checkout completo está hardcodeado en español. Solo `t.formErrors` usa i18n. Un usuario en CA o EN navega la home y el carrito traducidos y aterriza en un checkout 100% castellano. Rompe la promesa trilingüe del producto en el punto de mayor fricción (el pago). | Migrar todos los strings a un bloque nuevo `checkout` en `translations.ts` (es/ca/en). Ver §4 para el bloque propuesto. | CRÍTICO |
| M2 | `products.tsx` (aria-labels) | `"Foto anterior"`, `"Foto siguiente"`, `` `Ir a la foto ${i+1}` ``, `` `${name} foto ${current+1}` `` (alt) | aria-labels y alt hardcodeados en español — no se traducen. Lector de pantalla en CA/EN oye español. | Mover a `products` i18n: `prevPhoto`, `nextPhoto`, `goToPhoto` (con `{n}`), `photoAlt` (con `{name}` `{n}`). | ALTO |
| M3 | `cta.offSeason.titleEm` (ca) + render en `cta.tsx` | "arriba el" + mes → renderiza **"arriba el maig"** | Errata gramatical en catalán: con mes el artículo correcto es contracto/elidido — "arriba al maig". Además ES dice "llega en" (→ "llega en mayo", correcto) y EN "arrives in" (correcto); solo CA falla. | CA: `titleEm` → "arriba a" para que renderice "arriba al maig"/"arriba a l'abril" — o reformular a "torna al" + mes. Revisar elisión con meses que empiezan por vocal (abril, agost, octubre). | ALTO |
| M4 | `cta.offSeason.consent` (es vs en) | es: "Quiero recibir un único aviso cuando vuelva la cosecha." · en: "I'd like a single notice when the harvest returns." | Registro inconsistente: el ES es declarativo y firme ("Quiero recibir"), el EN es condicional y blando ("I'd like"). En un checkbox de consentimiento RGPD el registro debe ser afirmativo e idéntico en los 3 idiomas. | EN → "I want a single notice when the harvest returns." CA ya está bien ("Vull rebre..."). Alinear los tres en modo declarativo. | MEDIO |
| M5 | Verbos de acción de compra (varias claves) | `hero.btn1` "Ver nuestras fresas" · `products.addToCart` "Añadir al carrito" · `products.viewMore` "Ver más" · `cta.buyNow` "Comprar ahora" · `cart.checkout` "Ir a pagar" · `nav.menu.verTienda` "Ver tienda →" | Sin jerarquía clara de CTA. `products.viewMore` ("Ver más") es un `<a href="/checkout">` — la etiqueta promete "ver detalle de producto" pero lleva al pago: **engañoso**. Y conviven "Ver tienda", "Ver nuestras fresas", "Ver más" (tres "ver" distintos). | Definir 2 niveles: primario alta intención = "Comprar ahora"/"Ir a pagar" (correctos); navegación = "Ver las fresas" (unificar hero+nav). `products.viewMore` → "Comprar" o "Añadir al carrito" (que coincida con el destino real). | ALTO |
| M6 | `checkout.tsx` resumen vs `cart.tsx` | checkout: "Envío" → "A calcular" · cart: `shipping` "Envío" → `shippingNote` "Calculado al pagar" | Dos formulaciones distintas para lo mismo. El usuario ve "Calculado al pagar" en el carrito y luego "A calcular" en el checkout — incoherente, y "A calcular" suena a borrador. | Unificar a "Se calcula en el envío" / o mostrar el coste real. Como mínimo, misma cadena en cart y checkout. | MEDIO |
| M7 | `nav.menu.verTienda` | es "Ver tienda →" · ca "Veure botiga →" · en "See shop →" | La flecha `→` está **dentro** del string traducible. El microcopy no debe llevar caracteres decorativos embebidos (problemas de RTL, de duplicación si el componente añade icono, de mantenimiento). Mismo patrón en `about.contact` "Contactar →" / "Contact →". | Quitar `→` del string i18n; renderizar la flecha como SVG/icono en el componente (como ya se hace en `hero.btn2` que añade " →" en JSX). | MEDIO |
| M8 | `hero.btn2` render en `hero.tsx` | JSX: `{t.hero.btn2} →` (string es "Nuestra historia", flecha añadida en código) | Inconsistente con M7: aquí la flecha está en el JSX, en `verTienda`/`contact` está en el i18n. Decidir un patrón único. | Patrón único: flecha SIEMPRE en el componente, nunca en el string. (Resuelve M7 + M8 juntos.) | BAJO |
| M9 | `contact.tsx` línea 75 (dirección) vs memoria | Componente: "C/ Electrónica, 19, Planta 10, oficina D\n08915, Badalona, España" | La dirección está **hardcodeada en el componente**, no en i18n, y es más detallada que la registrada como placeholder oficial ("C/ Electrónica 19, 08915 Badalona"). Dato sensible fuera del sistema de traducción y posiblemente desincronizado. | Mover a i18n (`contact.addressValue`). Confirmar con Nil la forma canónica de la dirección (la memoria dice que la dirección es dato intencional/legalmente correcto — verificar "Planta 10, oficina D"). | MEDIO |
| M10 | `contact.tsx` placeholder email del form | `placeholder="tu@email.com"` (hardcodeado) | El placeholder del campo email del formulario de contacto está hardcodeado, mientras que `namePlaceholder`, `subjectPlaceholder`, `messagePlaceholder` sí usan i18n. Inconsistencia dentro del mismo formulario. Además `offSeason.emailPlaceholder` usa "tu@correo.com" (con "correo", no "email") — dos placeholders de email distintos en la misma web. | Crear `contact.emailPlaceholder` en i18n. Unificar a "tu@correo.com" en es / "el.teu@correu.com" en ca / "you@email.com" en en. | MEDIO |
| M11 | `formErrors` (es/ca/en) | es: "Este campo es obligatorio." / "Introduce un correo electrónico válido." | Solo cubre `required` y `email`. El checkout tiene campo código postal (`zip`, `inputMode="numeric"`) y no hay mensaje de error de formato (`patternMismatch`/`typeMismatch` numérico) — un CP inválido cae al genérico "Este campo es obligatorio", que es **incorrecto** (el campo no está vacío, está mal). | Añadir `formErrors.invalidZip` ("Introduce un código postal válido.") y, si se valida, `formErrors.invalid` genérico. El checkout `messageFor()` debería distinguir el caso. | MEDIO |
| M12 | `cart.empty` | es "La cesta está vacía" · ca "La cistella és buida" · en "Your basket is empty" | El estado vacío es puramente funcional/frío. Oportunidad perdida de tono cálido en un punto de fricción cero. Menor — el tono tributo no obliga a decorar todo, pero aquí cabría calidez. | Opcional: "Tu cesta está vacía — aún" / "Aquí aparecerán tus fresas". Severidad baja: aceptable dejarlo neutro. | BAJO |
| M13 | `cta.offSeason.sentTitle` (es) | "Casi listo" | Tras enviar el email de aviso, "Casi listo" es ambiguo — el usuario no sabe qué le falta hasta leer el subtítulo. EN "Almost there" / CA "Gairebé fet" mismo problema. El título debe poder leerse solo. | "Revisa tu correo" / "Te falta un paso" — title que ya comunica la acción pendiente (confirmar el doble opt-in). | MEDIO |
| M14 | `checkout.tsx` línea 98, 117 | `throw new Error("No se pudo cargar el formulario de pago")` · `"Error al procesar el pago"` | Mensajes de error de pago hardcodeados en español. Se muestran al usuario (el `error` se pinta en el bloque rojo). No traducidos. | Mover a `checkout` i18n (`errorCardLoad`, `errorPayment`). Parte de M1, pero se lista aparte por ser mensaje de error visible al usuario. | ALTO |
| M15 | `stats.labels` (es) | `["Natural", "Pesticidas", "Del campo a tu mesa", "Variedades"]` | Labels sin cifra son ambiguos sueltos: la cifra "0" + label "Pesticidas" se lee como "0 Pesticidas" (correcto), pero "100" + "Natural" → "100 Natural" (debería ser "100% Natural" — el % está en el value, ok) y "24h" + "Del campo a tu mesa" funciona. El label "Pesticidas" a secas, sin la cifra, es confuso fuera de contexto (lectores de pantalla leen value y label en nodos separados). | Considerar labels autoexplicativos: "Cultivo natural", "Sin pesticidas", "Del campo a tu mesa", "Variedades propias". "Sin pesticidas" + value "0" es redundante pero más claro que "0 / Pesticidas". | MEDIO |
| M16 | `products.harvestLabel` (es) | "Recogida en Tarragona · semana" → renderiza "Recogida en Tarragona · semana 21" | "semana 21" (semana ISO) es jerga logística que el cliente final no interpreta — nadie piensa en número de semana ISO. El chip de trazabilidad pierde su valor de confianza si no se entiende. | "Recogida en Tarragona · esta semana" si el dato es siempre actual, o mostrar fecha legible ("Recogida la semana del 19 de mayo"). Si se mantiene el nº de semana, prefijar: "semana 21 del año". | MEDIO |
| M17 | `cart.checkout` "Ir a pagar" + render `cart.tsx` | Botón renderiza `{t.cart.checkout} · {total}€` → "Ir a pagar · 30.00€" | Correcto y claro. **Acierto** — el botón de pago del carrito muestra el total, buena práctica. Registrado como referencia. | — | OK |
| M18 | `checkout.tsx` botón submit | `` `Pagar ${total}€` `` → "Pagar 30.00€" | Correcto en patrón (importe en el botón, como el carrito). Solo le falta el i18n del verbo "Pagar". Cae dentro de M1. | "Pagar" → clave i18n; mantener el patrón importe-en-botón. | BAJO |
| M19 | `nav.sobreNosotros` (es) | "Sobre nosotros" — clave declarada pero **sin uso aparente** | La clave `nav.sobreNosotros` existe en los 3 idiomas pero el nav del Hero usa `t.nav.menu.items`. Posible string huérfano. No es error de texto pero ensucia el archivo i18n. | Verificar si se usa; si no, eliminar. (Hallazgo de higiene, no de copy.) | BAJO |
| M20 | `about.photoAlt1/2/3` | es: "Caja de fresas Yaya Mariana", "Fresas frescas Yaya Mariana", "Fresas premium Yaya Mariana" | Las tres claves `photoAlt` existen en i18n pero `about-us.tsx` (tras la reescritura de TANDA 1 a slot tipográfico) **ya no renderiza fotos** — usa un slot de texto "Mariana". Alt-texts huérfanos. | Si el slot de retrato seguirá siendo tipográfico, eliminar `photoAlt1/2/3`. Si volverá la foto de archivo familiar, conservar pero revisar el alt (descriptivo de la foto real, no "premium"). | BAJO |

### Notas de microcopy

- **Datos intencionales verificados (NO son defectos):** email `info@yaya-mariana.com` con guion, teléfono `+34 666 777 888`, dominio. Confirmados contra la memoria del proyecto; no se reportan como errata.
- **`cart.tsx` está correctamente internacionalizado** — todo el drawer usa `t.cart.*`. Buen contraste con el checkout (M1).
- **Coherencia de mensajes de éxito:** `contact.sent` "¡Mensaje enviado!" lleva exclamación; `checkout` "¡Pedido confirmado!" también; `offSeason.sentTitle` "Casi listo" no. La regla de tono prohíbe exclamaciones *de hype* — una exclamación de confirmación funcional ("¡Mensaje enviado!") es defendible, pero conviene decidir un patrón único. Recomendación: sin exclamación, tono sereno ("Mensaje enviado", "Pedido confirmado") — coherente con el resto de la web y con el tono tributo.
- **Catalán — revisión adicional:** `cart.ariaOpen` "Obrir la cistella" y `cart.empty` "La cistella és buida" correctos. `offSeason.emailPlaceholder` ca "el.teu@correu.com" — el punto en lugar de espacio es deliberado (es un ejemplo de email), aceptable.

---

## 4. Bloque i18n propuesto para el checkout (resuelve M1, M14, M18)

Añadir a cada idioma en `translations.ts`. Estructura `checkout` paralela a `cart`:

```ts
// ES
checkout: {
  back: "Volver",
  title: "Finalizar pedido",
  subtitle: "Rellena tus datos para completar la compra",
  sectionPersonal: "Datos personales",
  sectionShipping: "Dirección de envío",
  sectionPayment: "Datos de pago",
  nameLabel: "Nombre completo",
  namePlaceholder: "Ana García",
  emailLabel: "Email",
  emailPlaceholder: "ana@correo.com",
  addressLabel: "Dirección",
  addressPlaceholder: "Calle Mayor 1, 3ºA",
  cityLabel: "Ciudad",
  cityPlaceholder: "Barcelona",
  zipLabel: "Código postal",
  zipPlaceholder: "08001",
  securityNote: "Pago seguro gestionado por Stripe. No almacenamos los datos de tu tarjeta.",
  pay: "Pagar",            // el componente añade ` ${total}€`
  processing: "Procesando…",
  summary: "Resumen del pedido",
  subtotal: "Subtotal",
  shipping: "Envío",
  shippingValue: "Se calcula en el envío",
  total: "Total",
  successTitle: "Pedido confirmado",
  successBody: "Gracias por tu compra, {name}. Recibirás un correo de confirmación en {email}.",
  backHome: "Volver al inicio",
  errorCardLoad: "No se pudo cargar el formulario de pago.",
  errorPayment: "No se pudo procesar el pago. Inténtalo de nuevo.",
}
```

Replicar en `ca` y `en` con el mismo registro sereno. El componente `checkout.tsx` pasa a consumir `t.checkout.*` vía `useLanguage()` (ya importa el hook). El interpolado `{name}`/`{email}` se resuelve con `.replace()` o template — coherente con cómo el resto del proyecto maneja variables.

---

## 5. Lista de los 8-10 issues más relevantes (priorizada)

1. **M1 — CRÍTICO — Checkout sin traducir.** Todo `checkout.tsx` está en español hardcodeado. → Migrar a un bloque `checkout` i18n (§4).
2. **N1/N2/N3 — ALTO — Values suena a ficha de suplemento.** "Compromiso con el medio ambiente", "refuerzan el sistema inmunológico", "protegen las células del estrés oxidativo". → Reescribir las 6 descripciones con la voz de Mariana: concretas, cálidas, sin jerga clínica (ej. N1 → "Cada fresa que cultivamos lleva dentro lo que la tierra le dio: sabor, alimento y el respeto con que se cuidó").
3. **M3 — ALTO — Errata gramatical en catalán.** `cta.offSeason.titleEm` ca "arriba el" + mes renderiza "arriba **el** maig" (debe ser "arriba **al** maig"). → CA: `titleEm` → "arriba a" (cuidar elisión con abril/agost/octubre).
4. **M5 — ALTO — `products.viewMore` "Ver más" engaña.** La etiqueta promete ver detalle de producto pero el `<a>` va a `/checkout`. → "Comprar" o "Añadir al carrito" (que coincida con el destino).
5. **M2/M14 — ALTO — aria-labels y errores de pago hardcodeados en español.** Flechas/dots del carousel de Products y mensajes de error de Stripe no se traducen. → Mover a i18n.
6. **N4 — MEDIO — `hero.subtitle` colapsa las dos capas de tono.** "el cariño que le pondría tu abuela" usa la abuela como metáfora genérica bajo una cita firmada "Yaya Mariana". → "...con el cuidado que Mariana ponía en las suyas."
7. **M4 — MEDIO — Registro inconsistente en el consent RGPD.** ES "Quiero recibir" (firme) vs EN "I'd like" (blando). → EN → "I want a single notice when the harvest returns."
8. **M6 — MEDIO — "Envío" inconsistente entre carrito y checkout.** Carrito "Calculado al pagar" vs checkout "A calcular". → Unificar a "Se calcula en el envío".
9. **M13 — MEDIO — `offSeason.sentTitle` "Casi listo" no se entiende solo.** → "Revisa tu correo" (ya comunica el paso pendiente del doble opt-in).
10. **M7/M8 — MEDIO — Flechas decorativas dentro de strings i18n.** `verTienda`/`contact` llevan "→" embebido; `hero.btn2` la añade en JSX. → Patrón único: flecha siempre en el componente, nunca en el string.

---

## 6. Veredicto

**Score de texto: 6.5 / 10.**

El copy narrativo (Hero, About, las dos citas, el cierre del footer) está alineado con el tono tributo y necesita solo poda quirúrgica: 5-6 frases de folleto en Values y una frase en Hero que delatan el origen "abuela genérica" anterior a la reframe de homenaje. El microcopy es donde se concentra la deuda: un checkout entero sin internacionalizar (crítico para una web que se vende como trilingüe), una errata gramatical en catalán, una etiqueta de CTA engañosa, y varias inconsistencias de registro y de patrón entre ES/CA/EN. Nada de esto exige reescritura — la voz de la marca ya existe y es buena; falta consistencia y un repaso de microcopy que nunca se hizo. Tras aplicar los 10 issues prioritarios el texto debería situarse en **8.5-9 / 10**.

**Pendiente de confirmación de Nil:**
- M9 — forma canónica de la dirección de contacto ("Planta 10, oficina D" no coincide con el placeholder registrado en memoria).
- Patrón de exclamaciones en mensajes de éxito (recomendación: eliminarlas, tono sereno).
- M12 — si el estado vacío del carrito debe llevar tono cálido o quedarse neutro.

---

*Auditoría estática — dev server apagado. No se modificó código ni memoria de agencia. Verificación en vivo (render real de los 3 idiomas en checkout) pendiente.*
