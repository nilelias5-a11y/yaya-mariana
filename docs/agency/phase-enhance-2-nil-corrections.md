# Nil corrections log — FASE 3 (CONTENIDO NUEVO)

> **Formato append-only.** Cada entrada captura una decisión correctiva de Nil
> sobre un commit ya shippeado. Las decisiones se enrutan a `learning-loop-v2`
> cuando `quality-gate` cierra APPROVED.
>
> No tocar entradas anteriores. Añadir nuevas al final.

---

## 2026-05-26 — Revisión visual FASE 3

Tras la revisión de los 6 commits de FASE 3 (HEAD `f96ebbe`), Nil decide
mantener 3 piezas y eliminar otras 3.

### 🟢 MANTIENE (se quedan en producción)

| Commit | Sección | Razón Nil |
|---|---|---|
| `841e8cc` | FAQ accordion (8 preguntas) | Le gusta el diseño y la utilidad. Resuelve dudas reales. |
| `1d6ec38` | RouteMap "De Tarragona a tu mesa" | Le gusta la ilustración mínima y la conexión emocional. |
| `f96ebbe` | Contact ampliado (WhatsApp + horario) | Cubre canales reales, sin inventar. |

### 🔴 ELIMINA (revertidas en commit consolidado)

| Commit original | Sección | Razón Nil | Cuándo se podría retomar |
|---|---|---|---|
| `29fc4f4` | ProcessSteps "Cómo llegan a tu mesa" (4 pasos) | Le gusta el diseño pero **necesita fotos reales primero**. Sin fotos no queda con la calidad que quiere. | Cuando haya fotos reales del proceso (siembra / cuidado / recogida / cadena de frío). |
| `9c1dd8d` | Farmer block (Joan Carles) en AboutUs | **No le ha preguntado a Joan Carles si quiere salir en la web.** Sin su permiso no se publica nada de él. | Cuando Joan Carles confirme explícitamente que acepta aparecer y, idealmente, aporte foto y años exactos. |
| `1e6c183` | Timeline "Historia con calma" (4 hitos) | Le gusta el diseño pero **falta info real**. Las fechas y narrativas son tentativas, no verificadas con familia. | Tras hablar con la familia y confirmar fechas / narrativas reales. |

### 🎯 AÑADE en el mismo commit consolidado

- **Item FAQ en el nav** entre "Sobre nosotros" y "Contacto".
- Label `FAQ` en los 3 idiomas (es/ca/en) — internacional y corto, mantiene el ritmo del nav.
- `NAV_HREFS` actualizado a `["#productos", "#sobre-nosotros", "#faq", "#contacto"]`.
- Subtítulos por idioma:
  - ES: "Resolvemos lo más habitual"
  - CA: "El més habitual, resolt"
  - EN: "Common questions answered"

---

## Patrón confirmado por Nil — "No inventar datos del negocio"

Esta corrección refuerza una regla que ya estaba implícita pero ahora queda
explícita y firmada por Nil:

> **No publicar contenido del proyecto sin que la persona, dato o medio
> referenciado lo haya confirmado explícitamente.** Placeholders dignificados
> son aceptables (ej. "JC" en lugar de foto, "cultiva en Tarragona" sin años),
> pero solo si la pieza completa NO depende de ese dato no confirmado.

**Aplicación práctica para futuros commits:**

- Personas reales (agricultor, familia, fundador, colaboradores) → **requiere
  confirmación explícita** antes de aparecer en la web, aunque sea como
  "JC" / iniciales.
- Fechas históricas → **requiere verificación con la familia** antes de
  publicar timeline o cualquier hito narrativo.
- Procesos reales (siembra, recogida) → **requiere fotos reales o
  documentación visual** antes de publicar como sección destacada.
- Apariciones en prensa → **requiere menciones reales** antes de mostrar
  un "Mencionados en…".
- Datos numéricos (años, kg, precios) → solo placeholders dignificados o
  datos confirmados; nunca inventar números concretos.

**Aprendizaje meta para `learning-loop-v2`:** ampliar la regla "no inventar
datos" a "no exponer datos no confirmados", incluso si son ciertos pero no
firmados por el sujeto.

---

## Commit consolidado de corrección

- Hash: pendiente al cierre del commit
- Cambios:
  - DELETE `src/components/ui/process-steps.tsx`
  - DELETE `src/components/ui/timeline.tsx`
  - EDIT `src/components/ui/about-us.tsx` — quitar `motion.div` farmer block (líneas 151-204 originales); el resto del componente intacto (cita, blockquote, retrato Mariana, drop cap, ornamento ❦, etc.)
  - EDIT `src/app/page.tsx` — quitar imports de `ProcessSteps` y `Timeline`, quitar `<ProcessSteps />` y `<Timeline />` del JSX
  - EDIT `src/components/ui/hero.tsx` — `NAV_HREFS` ahora `["#productos", "#sobre-nosotros", "#faq", "#contacto"]`
  - EDIT `src/i18n/translations.ts`:
    - Quitar bloques `process` y `timeline` en es/ca/en (3 × ~40 líneas)
    - Quitar sub-bloque `about.farmer` en es/ca/en (3 × 6 líneas)
    - Añadir nuevo item `{ label: "FAQ", subtitle: ... }` en `nav.menu.items` en es/ca/en (3 × 1 línea)

Build verde y tsc 0 verificados antes del commit.

---

## 2026-05-26 — Sección de testimonios (placeholders elegantes)

Tras la limpieza de las 3 secciones sin contenido real (HEAD `e4f750a`), Nil
añade una **sección de testimonios** post-CTA estilo La Nonna ReviewsWidget,
pero adaptada al tono restraint editorial de Yaya Mariana (no review-card
comercial).

### Decisión aplicada — patrón "placeholders elegantes hasta tener reseñas reales"

A diferencia de las 3 secciones eliminadas (Process/Farmer/Timeline) que se
quitaron por **falta de contenido real**, los testimonios se shippan **CON
placeholders elegantes y disclaimer visible**. Es una excepción razonada al
patrón "no exponer datos no confirmados":

| Pieza | Por qué los placeholders SÍ encajan aquí |
|---|---|
| **Estructura UI** | El carrusel, las animaciones y la a11y se diseñan una vez. Mientras llegan reseñas reales, el componente vive en producción con copy temporal claramente marcado. |
| **Iniciales + ciudad + fecha** | No identifican a personas reales (M.G./A.R./N.P./L.B./J.M. son iniciales placeholder). No hay foto, no hay nombre completo. |
| **Disclaimer obligatorio** | `testimonials.demo` ("Reseñas de ejemplo — pronto las sustituiremos por valoraciones reales") visible bajo el carrusel. Coherente con el `t("demo")` de La Nonna ReviewsWidget §C-4. |
| **Tono** | Las 5 citas son sobrias, sin marketing, sin exclamaciones. Si suenan creíbles es porque están redactadas con el patrón Yaya, no porque inventen experiencias reales. |
| **Sustitución sin riesgo** | Cuando lleguen reseñas reales (Trustpilot, Google Reviews, etc.) basta sustituir el array `testimonials.items` en `translations.ts` — el componente no cambia. |

### Diferencia con las 3 eliminadas — por qué este SÍ y aquellos NO

- **Process/Farmer/Timeline:** mezclaban afirmaciones DEL PROYECTO (datos
  reales sin confirmar) con diseño. Sin confirmación, exponer "Joan Carles
  cultiva en Tarragona" o "1950 — Mariana siembra" presentaba datos del
  negocio o de personas reales como hechos.
- **Testimonios placeholder:** no afirman datos del proyecto. Son citas
  inventadas de perfiles inventados, marcadas explícitamente como demo.
  Ningún visitante leerá "M.G., Barcelona" y pensará que es real — el
  disclaimer lo cubre.

### Aplicación práctica de este matiz para futuros commits

- **Datos del proyecto / personas reales** (agricultor, familia, fundador,
  fechas históricas, fotos del proceso, prensa) → siguen la regla estricta
  "requiere confirmación explícita antes de publicar".
- **Estructuras UI con copy demo** (testimonios, reseñas, casos de uso,
  ejemplos) → pueden shipparse con placeholders **siempre que el disclaimer
  sea inequívoco y los datos no se atribuyan a personas o entidades reales**.

### Commit consolidado de la sección

- Hash: pendiente al cierre del commit
- Archivos:
  - ADD `src/components/ui/testimonials.tsx` — carrusel 1-card-centrada,
    auto-rotate 5s desktop con pausa en hover/focus, off en touch, off en
    reduced-motion, flechas + dots, keyboard navigation (←/→),
    a11y completa (aria-roledescription, aria-label, aria-live, aria-current,
    sr-only para rating)
  - EDIT `src/i18n/translations.ts` — bloque `testimonials.*` en es/ca/en
    con `eyebrow / title / subtitle / prev / next / goTo / starsAria /
    carouselLabel / slideLabel / demo / items[5]`. Cada item: `quote /
    initial / name / city / date`. Los 5 perfiles son consistentes entre
    idiomas; solo cambia la cita y la fecha (Mayo/Maig/May 2026 etc.).
  - EDIT `src/app/page.tsx` — import + `<Testimonials />` montado entre
    `<CTA />` y `<FAQ />`.

Build verde y tsc 0 verificados antes del commit.
