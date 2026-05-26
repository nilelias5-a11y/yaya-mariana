# ENHANCE-2 — color-psychologist audit

## Contexto y enfoque

Todo lo propuesto aquí opera exclusivamente como capas transparentes derivadas de la paleta base de 13 hex ya definida — sin ningún hex nuevo. Los mecanismos son rgba a alpha ≤ 12%, blend modes sobre superficies existentes, gradient stops de paleta, y propiedades CSS de micro-interfaz (caret, selection, scrollbar, placeholder) que usan los mismos tonos. El objetivo es cerrar los "puntos fríos" que aún existen en la temperatura tonal del sitio y añadir coherencia de marca a los microestados de UI que hoy siguen en sus defaults del sistema operativo o del navegador.

---

## Propuestas

### CP-01 — Selection color de marca
- Sección: Global (toda la página)
- Descripción: Cuando el usuario selecciona texto para copiarlo, el resaltado nativo azul del navegador rompe el registro cromático cálido. Reemplazar con un wash terracota muy bajo.
- Color exacto: `::selection { background: rgba(192, 57, 43, 0.18); color: #7a3a3a; }`
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ
- Por qué: Cero impacto en lectura (18% de opacidad mantiene texto visible), pero el gesto de "seleccionar" pasa a ser cromáticamente coherente con la marca. En un sitio tributo donde el texto es el corazón emocional, que el usuario resalte una frase y vea terracota es un detalle que registra subliminalmente la voz de la abuela.

---

### CP-02 — Caret color en inputs del formulario de contacto
- Sección: Contact
- Descripción: El cursor de texto (caret) en los campos del formulario es negro del sistema por defecto. Un caret terracota cierra el loop entre el branding y el momento de escritura.
- Color exacto: `caret-color: #c0392b;`
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ
- Por qué: El momento en que alguien escribe su nombre o mensaje en el formulario es el punto más personal de toda la interacción con el sitio. El caret rojo-terracota actúa como un recordatorio silencioso de que están escribiendo a alguien. Micro-gesto sin coste visual.

---

### CP-03 — Focus-visible outline tonal (sustituye el azul nativo)
- Sección: Global — todos los elementos interactivos (botones, links, inputs)
- Descripción: El outline de foco por defecto del navegador es azul o negro, ajeno a la paleta. Reemplazar con un outline derivado de terracota a alpha bajo, para que la navegación por teclado sea tonal.
- Color exacto: `outline: 2px solid rgba(192, 57, 43, 0.55); outline-offset: 3px;` aplicado a `:focus-visible` sobre todos los interactivos.
- Tipo: ADITIVA
- Prioridad: ALTA
- Test "se vería en La Nonna": SÍ
- Por qué: Accesibilidad y coherencia tonal no son contradictorias. Un outline terracota al 55% mantiene contraste suficiente para usuarios de teclado y lectores de pantalla, y simultáneamente no rompe el registro visual cuando aparece. El azul nativo actúa como un objeto extraño en una paleta tan trabajada.

---

### CP-04 — Placeholder color refinado en inputs
- Sección: Contact (formulario)
- Descripción: El color placeholder por defecto es un gris neutro frío. Reemplazar con maroon muy atenuado, tonal con la paleta.
- Color exacto: `color: rgba(122, 58, 58, 0.45);` en `::placeholder`
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ
- Por qué: El gris neutro frío del placeholder es el único punto genuinamente "frío" que queda en el formulario de contacto. Un placeholder con tinte warm maroon al 45% mantiene la legibilidad como hint sin forzar contraste de texto real, y el campo de escritura respira completamente dentro de la paleta.

---

### CP-05 — Scrollbar custom cromática (webkit + firefox)
- Sección: Global
- Descripción: En navegadores que exponen la scrollbar (Chrome/Edge/Safari), el track y el thumb son grises neutros del sistema. Una scrollbar con thumb terracota muy suave y track cream es un detalle editorial de alta categoría.
- Color exacto: thumb `rgba(192, 57, 43, 0.22)` / thumb hover `rgba(192, 57, 43, 0.40)` / track `rgba(245, 198, 194, 0.30)`. Firefox: `scrollbar-color: rgba(192,57,43,0.30) rgba(245,198,194,0.25);`
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ
- Por qué: Es un detalle que solamente lo notan usuarios atentos al diseño — exactamente el perfil de quien compra fresas DTC premium o visita un sitio tributo. La scrollbar en terracota desaturado sugiere que el cuidado editorial llega hasta los extremos del viewport.

---

### CP-06 — Warm shadow tinted en cards del formulario Contact
- Sección: Contact
- Descripción: La sombra exterior del form-card (ya aplicada en E5 como terracota 4%) tiene un par de coordenadas: la sombra inferior-derecha de "elevación" y la sombra tonal de "calidez". Añadir una segunda capa de sombra con tinte rosa pálido para el flanco superior-izquierdo, simulando luz cálida entrando desde arriba.
- Color exacto: Segunda capa de box-shadow: `0 -1px 8px rgba(245, 198, 194, 0.10)` (complementa, no sustituye la existente)
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ
- Por qué: Los cards con una sola sombra unidireccional sugieren luz artificial. Una sombra cálida secundaria en el cuadrante superior (rosa pálido 10%) crea la ilusión de luz de tarde — coherente con el storytelling de una tarde en la huerta de la abuela. Invisiblemente visible.

---

### CP-07 — Temperatura seccional AboutUs: velo warm muy suave
- Sección: AboutUs (Nuestra Historia)
- Descripción: La sección AboutUs es el corazón emocional y narrativo del sitio — la historia de la abuela. Añadir un pseudo-elemento de fondo con velo levísimo rosa-terracota que caliente un punto más esa sección frente al cream base, para que la transición de temperatura entre secciones apoye el storytelling.
- Color exacto: pseudo-elemento `::before` con `background: rgba(192, 57, 43, 0.02)` inset 0, z-index 0 (opacidad 2%, invisible individualmente pero suma al canvas)
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ — con matiz: en La Nonna sería igualmente válido para la sección historia del chef
- Por qué: La diferencia de temperatura seccional a 2% de opacidad no es visible como "color diferente" — opera a nivel de sensación. La neurociencia del color documenta que diferencias de temperatura por debajo del umbral de percepción consciente aún influyen en la respuesta emocional. AboutUs debe sentirse más cálida que el resto, no verse más cálida.

---

### CP-08 — Temperatura seccional Contact: velo neutro-fresco muy suave
- Sección: Contact
- Descripción: La sección de contacto es el momento de "acción" — escribir, enviar. Una temperatura ligeramente más fresca (maroon muy atenuado en lugar de terracota) separa sensorialmente el "leer la historia" del "hablar con nosotros", sin romper la paleta.
- Color exacto: pseudo-elemento con `background: rgba(122, 58, 58, 0.025)` — maroon #7a3a3a al 2.5% en lugar de terracota puro, que es cromáticamente más frío dentro de la misma familia.
- Tipo: ADITIVA
- Prioridad: BAJA
- Test "se vería en La Nonna": SÍ
- Por qué: En narrativa de diseño, el ritmo seccional es temperatura. Hero (warm) → AboutUs (más warm, CP-07) → Contact (leve bajada: invita a la acción deliberada, no al soñar). Este contraste de 0.5° de temperatura entre secciones es lo que separa un sitio "flat" de uno que tiene arco emocional.

---

### CP-09 — Link visited y active states tonal (sustituye azul nativo)
- Sección: Global — links de texto (footer, contact, aboutus)
- Descripción: Los links visitados muestran el morado estándar del navegador, completamente ajeno a la paleta. Los states active pueden mostrar azul en algunos contextos. Reemplazar ambos con tonos derivados de la paleta.
- Color exacto: `:visited { color: rgba(122, 58, 58, 0.80); }` — maroon al 80%, más suave que el activo pero aún legible. `:active { color: #7a1a1a; }` — maroon oscuro del sistema para el estado pulsado.
- Tipo: ADITIVA
- Prioridad: MEDIA
- Test "se vería en La Nonna": SÍ
- Por qué: En un sitio con abundante texto (AboutUs, Footer, Contact) los links visitados en morado son el equivalente cromático de un papel manchado. El maroon visitado al 80% comunica "ya leíste esto" en el mismo idioma de la paleta, sin romper el registro digno del homenaje.

---

### CP-10 — Gradient mesh en fondo del Nav (mobile drawer / sticky state)
- Sección: Nav — fondo del menú mobile y/o fondo sticky en scroll
- Descripción: El fondo del Nav en estado sticky o del drawer mobile probablemente es un blanco o cream plano. Añadir un gradiente mesh muy sutil: cream base con terminación en rosa pálido al extremo derecho, simulando que la calidez del Hero "sangra" hacia arriba.
- Color exacto: `background: linear-gradient(135deg, #fdf6f5 78%, rgba(245, 198, 194, 0.35) 100%)` — los dos stops son exclusivamente de paleta.
- Tipo: ADITIVA
- Prioridad: BAJA
- Test "se vería en La Nonna": SÍ
- Por qué: El Nav en sticky desconectado visualmente del Hero crea una sensación de "header prestado". Un gradiente de terminación rosa al 35% en el extremo derecho es invisible como elemento pero actúa como hilo conductor de temperatura entre el Hero y cualquier posición de scroll. Confirmar que el fondo actual es plano antes de implementar.
