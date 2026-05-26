# ENHANCE-2 — micro-copy-master audit

> **Rama:** `clasico` HEAD `0a53c6c`
> **Modo:** ADDITIVE-ONLY. Este documento no toca `translations.ts`. Propuestas formales para implementación posterior con aprobación de Nil donde sea MIXTA.
> **Referencia tonal:** `nil-design-preferences.md` (CANÓNICO) + reglas de tributo del proyecto.

---

## Contexto y enfoque

Yaya Mariana es un tributo a la abuela fallecida de Nil, no una marca DTC al uso. El copy opera en dos capas que no deben colapsar: Capa A (el amor de abuela como experiencia universal del cliente) y Capa B (la memoria específica de Mariana). Las propuestas de este audit siguen el criterio de que ningún string debe sonar a Instagram ad, que los signos de exclamación son ruido en un contexto de duelo activo, y que la voz de Mariana se activa solo donde su presencia es natural y no forzada. Las reescrituras MIXTA requieren firma de Nil antes de implementar.

---

## Bloque A — Microcopy aditiva pura (ADITIVA, E6)

### MC-A-01 — `cart.emptyHint`
- Clave i18n: `cart.emptyHint`
- ES: "Cuando elijas tus fresas las verás aquí."
- CA: "Quan triïs les teves maduixes les veuràs aquí."
- EN: "Once you pick your strawberries, they'll appear here."
- Sección donde se renderiza: panel del carrito cuando `cart.empty` está visible (debajo del string `cart.empty` existente, como microcopy secundario)
- Capa tonal: A (universal abuela-care — la espera tranquila, sin ansiedad de venta)
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — La Nonna usaría exactamente ese tono de invitación serena
- Por qué: El estado vacío actual (`"La cesta está vacía"`) es funcional pero frío. Esta línea adicional transforma la ausencia en una promesa tranquila sin presionar al usuario. No usa imperativo, no usa "descubre", no usa exclamación. Es Capa A pura: cualquier abuela lo diría.

---

### MC-A-02 — `cart.ariaClose`
- Clave i18n: `cart.ariaClose`
- ES: "Cerrar la cesta"
- CA: "Tancar la cistella"
- EN: "Close basket"
- Sección donde se renderiza: botón de cierre del panel carrito (actualmente ausente en `translations.ts` — solo existe `cart.ariaOpen`)
- Capa tonal: A (funcional, accesibilidad)
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — es una necesidad técnica de a11y, no un toque editorial
- Por qué: `cart.ariaOpen` existe pero no hay equivalente de cierre en las traducciones. Un lector de pantalla que puede abrir la cesta también necesita poder cerrarla con un label traducido. La asimetría es una laguna de accesibilidad, no solo un hueco de copy.

---

### MC-A-03 — `checkout.processing` (microcopy de estado)
- Clave i18n: `checkout.processingHint`
- ES: "Un momento — estamos tramitando tu pedido con cuidado."
- CA: "Un moment — estem tramitant la teva comanda amb cura."
- EN: "One moment — we're carefully processing your order."
- Sección donde se renderiza: debajo del string `checkout.processing` existente (`"Procesando..."`) durante el estado de carga de Stripe, como texto secundario
- Capa tonal: A (la espera con cuidado — Capa A pura, sin referencia directa a Mariana)
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — "con cuidado" es el vocabulario de la casa
- Por qué: `"Procesando..."` es técnicamente correcto pero genera ansiedad. Un segundo string visible bajo el spinner, más cálido, alivia la espera sin ser efusivo. "Con cuidado" conecta con el hilo tonal del proyecto sin invocar directamente la memoria de Mariana. La versión actual de `checkout.processing` no se modifica.

---

### MC-A-04 — `checkout.errors.genericHint`
- Clave i18n: `checkout.errors.genericHint`
- ES: "Puedes volver a intentarlo o escribirnos si el problema persiste."
- CA: "Pots tornar-ho a intentar o escriure'ns si el problema persisteix."
- EN: "You can try again or write to us if the problem persists."
- Sección donde se renderiza: debajo de `checkout.errors.generic` cuando se muestra el error de pago, como texto de apoyo
- Capa tonal: A (acompañamiento — el proyecto está aquí)
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ
- Por qué: `"Error al procesar el pago"` es el string actual — clínico, sin salida. Este hint aditivo da una vía de acción sin sonar a call center. La instrucción `checkout.errors.cardLoad` tampoco tiene un texto de apoyo equivalente — esta clave puede servir para ambos estados de error o se puede especializar en una segunda iteración.

---

### MC-A-05 — `about.photoAlt1` / `photoAlt2` / `photoAlt3` (enriquecimiento de alt)
- Clave i18n: `about.photoAlt1`, `about.photoAlt2`, `about.photoAlt3`
- PROPUESTA DE VALORES ALTERNATIVOS (aditiva como sustitución semántica — ver nota):
  - ES photoAlt1: "Caja de fresas Yaya Mariana, recogidas en el punto que ella enseñó"
  - ES photoAlt2: "Fresas frescas Yaya Mariana — del campo tal como las cuidaba"
  - ES photoAlt3: "Fresas premium Yaya Mariana, cada una elegida a mano"
  - CA photoAlt1: "Caixa de maduixes Yaya Mariana, recollides al punt que ella va ensenyar"
  - CA photoAlt2: "Maduixes fresques Yaya Mariana — del camp tal com les cuidava"
  - CA photoAlt3: "Maduixes premium Yaya Mariana, cada una triada a mà"
  - EN photoAlt1: "Yaya Mariana strawberry box, picked at the moment she taught us"
  - EN photoAlt2: "Fresh Yaya Mariana strawberries — from the field as she tended them"
  - EN photoAlt3: "Premium Yaya Mariana strawberries, each chosen by hand"
- Sección donde se renderiza: sección AboutUs, las tres fotografías de producto/campo
- Capa tonal: B (tributo específico Mariana — pasado verbal "enseñó", "cuidaba", "tendió")
- Tipo: ADITIVA (los alt-text no se ven en la UI visual — son texto oculto para lectores de pantalla y motores de búsqueda; no rompen layout ni apariencia)
- Prioridad: MEDIA
- Test "se vería en La Nonna": NO — La Nonna no tiene esa capa B de memoria personal. Este es un diferencial de tributo.
- Por qué: Los alt-text actuales son puramente funcionales ("Caja de fresas Yaya Mariana"). No saturan la UX visual, pero los usuarios de lectores de pantalla y el propio SEO semántico pierden la dimensión de tributo. Usar pasado en "como las cuidaba ella" es Capa B discreta: solo quien escucha la descripción con un lector de pantalla la recibe, lo cual es exactamente el nivel de subtleza que el proyecto merece. Esta propuesta se clasifica como ADITIVA porque no toca ningún string visible, pero Nil debe confirmar el uso del pasado referido a Mariana en estos contextos.

---

### MC-A-06 — `footer.inMemoryHint` (refinamiento del tooltip existente)
- Clave i18n: `footer.inMemoryHint` (ya existe — propuesta de valor más completo para el tooltip)
- Valores actuales:
  - ES: "En su memoria"
  - CA: "En la seva memòria"
  - EN: "In her memory"
- PROPUESTA ADITIVA (si el tooltip admite texto más largo — verificar UI):
  - ES: "En memoria de Mariana, que cultivaba con paciencia y amor."
  - CA: "En memòria de la Mariana, que cultivava amb paciència i amor."
  - EN: "In memory of Mariana, who tended her crop with patience and love."
- Sección donde se renderiza: tooltip del link `footer.inMemory` en el pie de página
- Capa tonal: B (tributo específico Mariana)
- Tipo: ADITIVA (si el campo ya existe y el tooltip admite más texto — no se modifica el elemento HTML, solo el valor de la clave)
- Prioridad: BAJA
- Test "se vería en La Nonna": NO — específico del tributo
- Por qué: El tooltip actual ("En su memoria") es correcto pero plano. Si el componente que lo renderiza admite una frase más larga, este valor añade la dimensión de quién era Mariana en una sola línea, usando el pasado verbal correcto ("cultivaba"). No satura: es un tooltip, se ve solo si el usuario hace hover o focus deliberado.

---

### MC-A-07 — `hero.quoteAuthorTitle` (tooltip/title del quoteAuthor)
- Clave i18n: `hero.quoteAuthorTitle`
- ES: "Mariana Elías — de quien nació este proyecto"
- CA: "Mariana Elías — de qui va néixer aquest projecte"
- EN: "Mariana Elías — from whom this project was born"
- Sección donde se renderiza: atributo `title` del elemento `<span>` o `<cite>` que contiene `hero.quoteAuthor` ("Yaya Mariana")
- Capa tonal: B (tributo específico Mariana)
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": NO — diferencial de tributo
- Por qué: En E6 del plan original se mencionó un `hero.quoteAuthor` tooltip/glosa. La cita del Hero atribuida a "Yaya Mariana" no da contexto a quien no conoce la historia. Un `title` HTML (accesible via hover desktop y lectores de pantalla) que diga "Mariana Elías — de quien nació este proyecto" ancla la cita a la persona real sin saturar la UX. Es Capa B de baja intrusión. El nombre completo "Mariana Elías" solo se usa aquí — en el resto del sitio se respeta el pseudónimo afectivo "Yaya Mariana".

---

## Bloque B — Reescritura suave (MIXTA, E8)

### MC-B-01 — `contact.sent`
- Clave i18n: `contact.sent`
- ANTES (ES): `"¡Mensaje enviado!"`
- DESPUÉS (ES): `"Mensaje enviado"`
- ANTES (CA): `"Missatge enviat!"`
- DESPUÉS (CA): `"Missatge enviat"`
- ANTES (EN): `"Message sent!"`
- DESPUÉS (EN): `"Message sent"`
- Razón del cambio: La exclamación en un contexto de tributo suena a notificación de marketing. El estado de confirmación ya es positivo por su semántica — no necesita puntuación de entusiasmo. Esta es la corrección más pequeña posible y la más necesaria.
- Tipo: MIXTA (toca string existente)
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — La Nonna tampoco usaría exclamación en el confirm de contacto
- Requiere firma Nil: SÍ

---

### MC-B-02 — `contact.sentSubtitle`
- Clave i18n: `contact.sentSubtitle`
- ANTES (ES): `"Gracias por contactarnos. Te responderemos en menos de 24 horas."`
- DESPUÉS (ES): `"Gracias por escribirnos. Te leeremos pronto, con calma."`
- ANTES (CA): `"Gràcies per contactar-nos. Et respondrem en menys de 24 hores."`
- DESPUÉS (CA): `"Gràcies per escriure'ns. Et llegirem aviat, amb calma."`
- ANTES (EN): `"Thank you for contacting us. We'll get back to you within 24 hours."`
- DESPUÉS (EN): `"Thank you for writing to us. We'll read your message soon, unhurriedly."`
- Razón del cambio: "En menos de 24 horas" es SLA de contact center, no voz de proyecto familiar. "Te leeremos pronto, con calma" tiene tres mejoras: (1) "leeremos" en lugar de "responderemos" — indica atención real, no procesamiento; (2) "con calma" — vocabulario de la casa, sin prisa de fábrica; (3) elimina el plazo cuantitativo que puede crear expectativa rígida. "Escribirnos" en lugar de "contactarnos" baja el registro a algo más personal.
- Tipo: MIXTA (toca string existente)
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ — "Ti leggeremo presto, con calma" es exactamente el tono de un restaurante familiar italiano
- Requiere firma Nil: SÍ

---

### MC-B-03 — `checkout.success.title`
- Clave i18n: `checkout.success.title`
- ANTES (ES): `"¡Pedido confirmado!"`
- DESPUÉS (ES): `"Pedido confirmado"`
- ANTES (CA): `"Comanda confirmada!"`
- DESPUÉS (CA): `"Comanda confirmada"`
- ANTES (EN): `"Order confirmed!"`
- DESPUÉS (EN): `"Order confirmed"`
- Razón del cambio: La exclamación en el estado de éxito de compra es el residuo más visible del tono e-commerce genérico. En un tributo a una persona fallecida, la alegría efusiva choca. El estado ya comunica éxito por su contenido — la puntuación es innecesaria y contradice el tono del proyecto.
- Tipo: MIXTA (toca string existente)
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ
- Requiere firma Nil: SÍ

---

### MC-B-04 — `checkout.success.body`
- Clave i18n: `checkout.success.body`
- ANTES (ES): `"Gracias por tu compra,"`
- DESPUÉS (ES): `"Gracias por confiar en nosotros."`
- ANTES (CA): `"Gràcies per la teva compra,"`
- DESPUÉS (CA): `"Gràcies per confiar en nosaltres."`
- ANTES (EN): `"Thank you for your purchase,"`
- DESPUÉS (EN): `"Thank you for trusting us."`
- Razón del cambio: "Gracias por tu compra" es transaccional — reduce la relación a la transacción económica. "Gracias por confiar en nosotros" eleva el gesto: el cliente no está comprando fresas, está aceptando que este proyecto vale su confianza. Es una diferencia semántica pequeña con impacto tonal grande. El punto final también cierra la frase (el original termina en coma, incompleto, probablemente porque el nombre del cliente se concatena en la UI — verificar implementación antes de aplicar).
- Tipo: MIXTA (toca string existente)
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ
- Requiere firma Nil: SÍ
- Nota de implementación: Si el componente concatena `checkout.success.body + nombre_cliente` (ej. "Gracias por tu compra, Ana"), la nueva versión necesita ajuste en la lógica del componente. Alternativamente, se puede mantener la coma y usar: `"Gracias por confiar en nosotros,"` — verificar antes de aplicar.

---

### MC-B-05 — `checkout.errors.generic`
- Clave i18n: `checkout.errors.generic`
- ANTES (ES): `"Error al procesar el pago"`
- DESPUÉS (ES): `"Algo no ha ido como esperábamos. Por favor, inténtalo de nuevo."`
- ANTES (CA): `"Error en processar el pagament"`
- DESPUÉS (CA): `"Alguna cosa no ha anat com esperàvem. Si us plau, torna-ho a intentar."`
- ANTES (EN): `"Error processing payment"`
- DESPUÉS (EN): `"Something didn't go as expected. Please try again."`
- Razón del cambio: "Error al procesar el pago" es un string de consola trasplantado a la UI. En el contexto de un proyecto de tributo que cuida cada detalle, un error técnico frío rompe el contrato tonal. "Algo no ha ido como esperábamos" reconoce la situación sin tecnicismos, con una leve voz en primera persona del plural (el proyecto reconoce la imperfección). No se usa el genérico "ha habido un problema" — se usa "como esperábamos" que tiene un eco del cuidado.
- Tipo: MIXTA (toca string existente)
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — un restaurante familiar también asumiría el fallo con esta voz
- Requiere firma Nil: SÍ

---

### MC-B-06 — `checkout.errors.cardLoad`
- Clave i18n: `checkout.errors.cardLoad`
- ANTES (ES): `"No se pudo cargar el formulario de pago"`
- DESPUÉS (ES): `"No hemos podido cargar el formulario. Recarga la página e inténtalo de nuevo."`
- ANTES (CA): `"No s'ha pogut carregar el formulari de pagament"`
- DESPUÉS (CA): `"No hem pogut carregar el formulari. Recarrega la pàgina i torna-ho a intentar."`
- ANTES (EN): `"Could not load the payment form"`
- DESPUÉS (EN): `"We couldn't load the payment form. Reload the page and try again."`
- Razón del cambio: El string actual es pasiva técnica sin acción para el usuario. La reescritura: (1) pasa a primera persona del plural ("No hemos podido"), (2) da instrucción concreta ("Recarga la página"), (3) usa voz consistente con el resto del proyecto. Sin exclamaciones, sin alarma.
- Tipo: MIXTA (toca string existente)
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ
- Requiere firma Nil: SÍ

---

### MC-B-07 — `hero.subtitle` (saturación de "abuela" — matiz Capa A)
- Clave i18n: `hero.subtitle`
- ANTES (ES): `"Fresas frescas de Tarragona, cultivadas con el mismo cariño que le pondría tu abuela. Sin pesticidas, naturales y siempre en su punto."`
- DESPUÉS (ES): `"Fresas frescas de Tarragona, cultivadas con el cuidado que se les da a las cosas que importan. Sin pesticidas, naturales, siempre en su punto."`
- ANTES (CA): `"Maduixes fresques de Tarragona, cultivades amb la mateixa cura que li posaria la teva àvia. Sense pesticides, naturals i sempre al seu punt."`
- DESPUÉS (CA): `"Maduixes fresques de Tarragona, cultivades amb la cura que es dona a les coses que importen. Sense pesticides, naturals, sempre al seu punt."`
- ANTES (EN): `"Fresh strawberries from Tarragona, grown with the same care your grandmother would put in. No pesticides, natural and always at their best."`
- DESPUÉS (EN): `"Fresh strawberries from Tarragona, grown with the care given to things that matter. No pesticides, natural and always at their best."`
- Razón del cambio: "Tu abuela" en el subtitle del Hero, cuando `hero.quoteAuthor` es "Yaya Mariana" y la sección About también usa "abuela" en el título y en `about.p1`, crea una saturación del término en los primeros dos scrolls de la página. La propuesta retira la palabra "abuela" del subtitle (donde se usa en sentido universal/Capa A) para reservarla a los contextos donde tiene peso narrativo real (about, quote). La nueva formulación ("lo que se da a las cosas que importan") preserva el tono de cuidado sin la palabra desgastada.
- Tipo: MIXTA (toca string existente)
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — "cultivate con la cura che si dà alle cose che contano" es perfectamente La Nonna
- Requiere firma Nil: SÍ
- Nota adicional: Esta propuesta es la más subjetiva del bloque B. Nil puede preferir mantener "abuela" explícita en el Hero. Se incluye como opción para debate.

---

## Bloque C — Detección de saturaciones y oportunidades (observaciones, no propuestas formales)

**1. El término "abuela" aparece 4 veces en los primeros dos scrolls (es):**
- `hero.subtitle`: "el mismo cariño que le pondría tu abuela"
- `about.title + titleEm`: "El sabor de siempre, cultivado con amor" (aquí no aparece, correcto)
- `about.p1`: "con el mismo amor y dedicación que le pondría tu abuela"
- El Hero quote: atribuida a "Yaya Mariana"

La acumulación en Hero + About p1 (ambos Capa A) puede desgastar el término antes de que el usuario llegue a la sección de Capa B real. MC-B-07 aborda el Hero; `about.p1` queda fuera de este audit pero es candidata para una revisión futura si Nil lo aprueba.

**2. `about.p1` empieza con "Yaya Mariana nació de la pasión" — ambigüedad tonal:**
Leer "Yaya Mariana nació" puede sonar a que el proyecto nació, pero también puede leerse literalmente (la persona nació). En un sitio de tributo, esa ambigüedad es un riesgo. Una revisión futura podría clarificar: "Este proyecto nació de la pasión de Mariana por las fresas de calidad." — pero esto ya fue revisado en fases anteriores; solo se señala como vigilancia.

**3. `nav.menu.items[2].subtitle` = "La historia de la Yaya" (es/ca):**
Este es el único lugar del sitio donde aparece "la Yaya" (con artículo) en lugar de "Yaya Mariana". En castellano, "la Yaya" es más afectivo que "Yaya Mariana" — puede ser intencional o puede ser inconsistencia. En un sitio de tributo vale la pena que Nil confirme si prefiere la forma con artículo (más familiar) o sin (como nombre propio).

**4. `cta.ourStory` = "Conocer nuestra historia" / "Conèixer la nostra història":**
El verbo "conocer" tiene resonancia de call-to-action de marca. En el contexto de tributo sería más fiel "Leer nuestra historia" o simplemente "Nuestra historia" (como ya existe en `hero.btn2`). Duplicidad de CTA funcionalmente idéntica con voces levemente diferentes — se puede unificar en una sola clave si el componente lo permite.

**5. Estados de carga y error sin personalidad de marca:**
`checkout.processing` ("Procesando...") y `checkout.pay` ("Pagar") son funcionales. MC-A-03 añade un hint, pero si se revisa el componente checkout completo, hay oportunidad de revisar el flujo completo de microcopy para que ningún estado muerto (loading, empty, error, success) quede en voz genérica.

**6. `about.photoAlt` usa "premium" como descriptor:**
`about.photoAlt3` = "Fresas premium Yaya Mariana". El uso de "premium" en un alt-text es más SEO que tributo. MC-A-05 propone una alternativa. Vale la pena consistencia: si el objetivo es tributo, los alt-text son la capa más invisible y más sincera — una oportunidad de hablar sin la presión de conversión.

**7. `footer.inMemoryHint` actual ("En su memoria") es correcto y sobrio:**
El valor actual no debe tocarse si el tooltip no puede mostrar texto largo. MC-A-06 solo aplica si la UI admite una frase completa. Si no, el valor actual es mejor: sobriedad > extensión.

**8. Aria-labels de carrito — asimetría abierto/cerrado:**
`cart.ariaOpen` = "Abrir la cesta" existe. No hay `cart.ariaClose` en las traducciones. Ver MC-A-02. Un lector de pantalla que abre el carrito y luego encuentra el botón de cierre sin label traducido es una experiencia rota.

---

*Propuestas totales: 7 ADITIVA (Bloque A) + 7 MIXTA (Bloque B) = 14 propuestas formales.*
*Bloque C: 8 observaciones de vigilancia tonal, sin propuesta formal.*
