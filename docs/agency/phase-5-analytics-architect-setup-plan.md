# Fase 5 — Plan de Setup de Analítica · Yaya Mariana

**Agente:** analytics-architect
**Fecha:** 2026-05-22
**Modo:** AUDIT / PLAN — **nada instalado, nada commiteado, sin dependencias añadidas, sin tocar código.**
**Rama:** `clasico`
**Proyecto:** Yaya Mariana — DTC de fresas premium artesanales (Tarragona, ES). Sitio TRIBUTO a la abuela fallecida de Nil.
**Estado del sitio:** sin analítica. Sin consentimiento de cookies. Sin GA4, sin GTM, sin pixel, sin heatmap.
**Dominio destino:** `yayamariana.es` (sin comprar aún).

> **Instrucción explícita de Nil:** preparar el setup, NO instalar todavía. Este documento es el PLAN listo para ejecutar en una fase futura cuando Nil lo autorice. No se ha modificado ningún archivo de `src/`, ni `package.json`, ni memoria de agencia.

---

## 0 · Resumen ejecutivo

El sitio es un single-page DTC con embudo de compra real (añadir al carrito → `/checkout` → Stripe). Hoy lanza **ciego**: nadie sabrá si el embudo convierte, dónde se fuga, ni de dónde llega el tráfico. Pero el sitio es un **homenaje** y maneja RGPD (ES/UE) — la analítica no puede ser invasiva ni traicionar el tono de restraint con un banner de cookies agresivo.

La recomendación central: **analítica cookie-less primero** (Vercel Web Analytics como base, sin cookies y sin banner), y **GA4 e-commerce gateado por un banner de consentimiento mínimo y compliant** solo si Nil quiere el embudo enriquecido y los informes de adquisición. Pixels de marketing: NO — no hay gasto publicitario.

Esto da medición del embudo desde el día 1 **sin** romper el tono del sitio y **sin** riesgo RGPD.

---

## 1 · Stack recomendado

### 1.1 Recomendación

Para un DTC pequeño, RGPD-friendly, con tono de restraint, en Next.js 16 desplegado (previsiblemente) en Vercel:

| Capa | Herramienta | Coste | Cookies / banner | Por qué |
|---|---|---|---|---|
| **Base — tráfico + Web Vitals** | **Vercel Web Analytics + Speed Insights** | Incluido en plan Hobby/Pro | **Cero cookies, sin banner** | Cookie-less por diseño, GDPR-friendly sin consentimiento, 1 paquete (`@vercel/analytics`), cero config, ya en el ecosistema de deploy. Mide visitas, páginas, fuentes, dispositivo — todo sin PII. |
| **Embudo e-commerce + adquisición (opcional, recomendado)** | **GA4** (modo Consent Mode v2) | Gratis | **Requiere banner** — gateado | Único modo gratuito de medir el embudo completo (`view_item → add_to_cart → begin_checkout → purchase`) con valor de transacción, atribución por canal y enlace a Search Console. Se carga **solo tras consentimiento**. |
| **Search Console** | **Google Search Console** | Gratis | Sin cookies en el sitio | Verdad de búsqueda orgánica. Verificación por DNS TXT. Obligatorio en todo proyecto. No instala nada en el sitio (verificación a nivel de dominio). |
| **Despliegue de tags** | **GTM** *(solo si entra GA4)* | Gratis | — | Permite evolucionar la medición sin redeploy y aplicar Consent Mode v2 de forma centralizada. **Opcional**: con un solo destino (GA4) se puede prescindir de GTM e implementar GA4 + Consent Mode directamente; ver §4. |
| **Heatmaps / grabaciones** | **Microsoft Clarity** | Gratis | Requiere banner | **NO recomendado para el lanzamiento.** Un sitio tributo de una sola página no necesita grabaciones de sesión, y añade una segunda herramienta a gatear por consentimiento. Diferir; reconsiderar solo si tras meses de datos el embudo muestra una fuga inexplicable. |
| **Pixels Meta / TikTok** | — | — | — | **NO instalar.** No hay gasto publicitario. Un pixel especulativo viola la necesidad RGPD (regla dura de la red). |

### 1.2 Dos escenarios para que Nil decida

El plan ofrece a Nil **dos niveles**; la decisión es suya en el gate de Fase 5.

- **Escenario A — "Restraint puro" (recomendado para lanzar).**
  Solo **Vercel Web Analytics + Speed Insights + Search Console**.
  - Sin banner de cookies. Sin fricción. Tono intacto.
  - Mide: visitas, páginas vistas, fuentes de tráfico (referrer), país, dispositivo, Web Vitals.
  - **Eventos personalizados de Vercel Analytics** (`track()`) — permite medir el embudo (`add_to_cart`, `begin_checkout`, `purchase`) **sin cookies y sin PII**, porque Vercel Analytics es agregado y anónimo.
  - **Limitación honesta:** sin atribución multi-toque, sin `value`/`currency` agregables como un informe de ingresos nativo, sin enlace con Search Console, sin embudo visual GA4. Suficiente para "¿convierte el sitio? ¿de dónde llega la gente?". Insuficiente para optimización fina de campañas (que hoy no existen).

- **Escenario B — "Embudo completo" (cuando el DTC quiera crecer).**
  Escenario A **+ GA4 con e-commerce mejorado**, gateado por un banner de consentimiento mínimo y compliant.
  - Embudo visual completo, valor de transacción, informes de adquisición, dashboard Looker Studio.
  - Coste: un banner de cookies (diseñado con restraint — ver §3) y el trabajo de Consent Mode v2.

**Recomendación analytics-architect:** lanzar con **Escenario A**. Cubre la pregunta real del lanzamiento ("¿el embudo funciona?") sin banner, sin fricción y sin tocar el tono. Subir a **Escenario B** cuando el negocio empiece a invertir en captación o cuando Nil quiera el informe de ingresos. La arquitectura de eventos (§2) está diseñada para que el salto A→B sea solo "añadir un segundo destino", no rehacer la instrumentación.

### 1.3 Por qué NO el camino habitual de agencia

La spec por defecto de este agente monta GA4 + GTM + Clarity + banner en todo proyecto. Aquí se modula deliberadamente:

- **Es un sitio tributo, no una tienda agresiva.** Un banner de cookies a pantalla completa en la primera visita choca con el tono de restraint (white space, motion lento, baja decoración). El Escenario A lo evita por completo.
- **Es un DTC diminuto sin campañas.** El valor de GTM (evolucionar tags sin redeploy) y de Clarity (diagnóstico de fricción en embudos complejos) es marginal en una single-page con un solo flujo de compra.
- **Vercel Analytics no existía como opción madura en proyectos previos.** Es cookie-less de fábrica: resuelve el 80% de la necesidad sin el coste de compliance del 100%.

---

## 2 · Plan de medición — taxonomía de eventos

Convención de la red: **`verb_noun` en snake_case**, parámetros tipados, sin PII. Los nombres de e-commerce siguen el **estándar GA4 Enhanced Ecommerce** para que, si entra el Escenario B, los eventos ya hablen el idioma de GA4 sin renombrar.

### 2.1 Embudo de compra (conversión primaria)

Conversión primaria del proyecto: **`purchase`** (compra completada vía Stripe).

| # | Evento | Disparador (dónde, en el código) | Parámetros | ¿Conversión / key event? |
|---|---|---|---|---|
| 1 | `view_item_list` | `Products` entra en viewport (la rejilla de producto se ve) | `locale` | NO |
| 2 | `select_item` | clic en el filtro de variedad (`setActive` en `products.tsx`) — ver también §2.2 | `item_variety` (Mágnum/Dream/1525/all), `locale` | NO |
| 3 | `view_item` | una `ProductCard` entra en viewport o se abre su carrusel | `item_name`, `item_variety`, `price`, `currency:"EUR"`, `locale` | NO |
| 4 | `add_to_cart` | `handleAddToCart` en `products.tsx` (botón "Añadir") | `item_name`, `item_variety`, `price`, `currency:"EUR"`, `quantity:1`, `locale` | NO (microconversión clave del embudo) |
| 5 | `view_cart` | apertura del drawer `Cart` | `cart_value`, `currency:"EUR"`, `item_count`, `locale` | NO |
| 6 | `begin_checkout` | navegación a `/checkout` desde los 3 enlaces (`cta.tsx`, `about-us.tsx`, `products.tsx`) o desde el `Cart` | `cart_value`, `currency:"EUR"`, `item_count`, `locale` | **SÍ (key event)** — boca del embudo de pago |
| 7 | `add_payment_info` | el `CardElement` de Stripe alcanza estado `complete` (evento `change` del Stripe Element), o al `submit` del formulario de checkout | `cart_value`, `currency:"EUR"`, `locale` | NO |
| 8 | `purchase` | `paymentIntent.status === "succeeded"` en `checkout.tsx` (rama de éxito) | `transaction_id` (= `paymentIntent.id`), `value`, `currency:"EUR"`, `item_count`, `items[]` (name+variety+quantity+price) | **SÍ — conversión primaria, key event** |

**Nota de fiabilidad sobre `purchase`:** el evento del lado cliente (en la rama `success` de `checkout.tsx`) es suficiente para el Escenario A. Para el Escenario B y máxima fiabilidad, el `purchase` definitivo debería dispararse **server-side desde un webhook de Stripe `payment_intent.succeeded`** (el cliente puede cerrar la pestaña antes del render de éxito). Hoy no hay webhook de Stripe — es un seam a abrir en una fase futura, no un bloqueo de Fase 5.

### 2.2 Microconversiones

| # | Evento | Disparador | Parámetros | Por qué importa |
|---|---|---|---|---|
| 9 | `language_switched` | `setLang` en `language-context.tsx` | `from`, `to` | El sitio es trilingüe ES/CA/EN. Mide la demanda real de CA y EN — alimenta la decisión pendiente de hreflang/routing por locale (issue SEO #4). |
| 10 | `variety_filtered` | `setActive` en `products.tsx` (= mismo disparador que `select_item`, evento de intención) | `variety` (Mágnum/Dream/1525/all), `locale` | Mide qué variedad despierta interés — informa stock y el cluster SEO C4 por variedad. |
| 11 | `waitlist_submitted` | `handleSubmit` de `OffSeasonCTA` en `cta.tsx` (variante off-season) | `locale`, `consent_given:true` | Microconversión primaria **fuera de temporada**. Hoy `season.isOffSeason=false` → no dispara; queda listo para cuando Nil active la temporada baja. **Sin email como parámetro** (PII). |
| 12 | `contact_submitted` | `setSent(true)` en `contact.tsx` | `locale` | Interés blando. **Sin nombre/email/mensaje como parámetros.** |
| 13 | `cart_quantity_changed` | `updateQuantity` en `cart-context.tsx` | `direction` (`increase`/`decrease`), `locale` | Señal de fricción/intención dentro del carrito. **Opcional** — solo si Nil quiere granularidad de carrito. |

### 2.3 Eventos automáticos (sin instrumentación)

Capturados por la herramienta sin tocar código:

- **Page views / visitas** — Vercel Analytics y GA4 los capturan solos. En una single-page, registra `/` y `/checkout` como las dos vistas; los `#anchors` de navegación (`#sobre-nosotros`, etc.) son scroll dentro de `/`, no page views.
- **Web Vitals** (LCP, CLS, INP, FCP, TTFB) — Vercel Speed Insights, automático.
- **Fuentes de tráfico / referrer / país / dispositivo** — ambas herramientas, automático.
- **Scroll y outbound clicks** — Enhanced Measurement de GA4 (solo Escenario B).

### 2.4 Páginas / secciones a vigilar

Single-page: las "secciones" son anclas dentro de `/` (`Hero · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer`), no rutas. Rutas reales: `/` y `/checkout`. No se mide `/api/create-payment-intent` (endpoint, debe quedar fuera y `disallow` en robots — ver SEO #2).

Si en una fase futura se adopta routing por locale (`/es` `/ca` `/en`, Opción A del SEO audit), cada locale pasa a ser una ruta propia y el parámetro `locale` de los eventos se vuelve redundante con la dimensión de página — replantear entonces.

---

## 3 · Consideraciones RGPD

ES/UE → aplican **RGPD + ePrivacy (LSSI-CE)**. La regla dura de la red es absoluta: **ninguna medición no esencial antes del consentimiento.** Pero el plan está diseñado para **minimizar la necesidad de consentimiento**, no para construir un banner grande.

### 3.1 Qué se puede medir SIN banner (cookie-less)

- **Vercel Web Analytics + Speed Insights** son **cookie-less y agregados**: no escriben cookies, no usan identificadores persistentes, no recogen PII, no permiten re-identificar al visitante. Bajo la guía de la AEPD y el EDPB, la analítica estrictamente agregada y sin cookies que **no rastrea individuos** puede operar sin consentimiento previo. → **Escenario A no necesita banner.**
- **Eventos personalizados de Vercel Analytics** (`track('add_to_cart', …)`) heredan esa naturaleza agregada y anónima — siempre que **no se les pase PII** (ver §5).
- **Search Console** no instala nada en el sitio (verificación por DNS TXT a nivel de dominio) → sin impacto de cookies.

→ **El Escenario A se lanza sin banner de cookies y sin fricción.** Es la opción tonalmente coherente con un sitio tributo.

### 3.2 Qué SÍ exige banner (cookies / consentimiento)

- **GA4** usa cookies de cliente (`_ga`) e identificadores → **consentimiento previo, granular y revocable obligatorio.** Solo entra en el **Escenario B**.
- Si entra GA4, el banner debe cumplir el suelo de la red (regla dura, sin excepción):
  - **Gate en la primera carga**, antes de cualquier tag no esencial.
  - **Categorías granulares**: Necesarias (siempre, no togglables) · Analítica · *(Marketing — no aplica, sin pixels)*.
  - **Botones de igual prominencia**: "Aceptar" y "Rechazar" visualmente iguales (enforcement ICO 2023 + CNIL/AEPD). Un "Aceptar" grande con un "Rechazar" en link diminuto = defecto CRITICAL.
  - **Sin opt-ins premarcados.**
  - **Retirada tan fácil como la concesión**: link persistente "Configuración de cookies" en el `Footer`, reabre el banner en un clic.
  - **Registro de consentimiento** con timestamp + alcance (cookie de origen).
  - **Paridad entre locales** ES/CA/EN — el banner se traduce y mantiene la misma postura compliant en los 3 idiomas (clave `cookieBanner` nueva en `translations.ts`).
  - **Diseño con restraint**: si entra el banner, debe ser sobrio — esquina inferior, no modal a pantalla completa, paleta de marca, sin urgencia. Coordinar con `accessibility-perfectionist` (componente interactivo de alto tráfico: foco, teclado, screen-reader) y con el design system (tokens, regla G-1 sin opacidad sobre texto).
  - **Consent Mode v2** de Google: con consentimiento rechazado, GA4 cae a modo cookie-less con conversiones modeladas — cero PII.

### 3.3 Suelo de privacidad (siempre, con o sin consentimiento)

- **Sin PII en ningún evento** — nunca email, nombre, dirección, teléfono, datos de tarjeta como parámetro. Ver §5.
- **Sin fingerprinting** (canvas, audio, hardware) como atajo de tracking.
- **Sin PII en parámetros de URL** que lleguen a analítica. El `/checkout` actual no pone PII en la URL (los datos van por estado React y POST a Stripe) — **PASS**, mantenerlo así. Vigilar que ningún parámetro futuro (`?email=`) llegue al `page_location`.
- **Anonimización de IP** — GA4 la aplica por defecto; verificar y documentar para la política de privacidad (solo Escenario B).
- **Retención de datos minimizada** — GA4 a 14 meses máximo (Escenario B).
- **Stripe** es el procesador de pago: ya recoge PII (nombre, email, dirección, tarjeta) de forma legítima para ejecutar el contrato de compra — eso es base legal "ejecución de contrato", **no** requiere consentimiento de cookies. La analítica **no** debe duplicar esos datos.
- **Datos en la UE** — Vercel Analytics procesa de forma agregada; para GA4 documentar SCCs / Consent Mode (transferencia a Google US).
- **DPA** firmado/documentado con cada proveedor activo (Vercel, y Google si entra B).
- **Política de privacidad** — debe nombrar cada herramienta instalada con finalidad, retención y procesador. El sitio **no tiene hoy página de política de privacidad ni de cookies** — es un entregable legal pendiente (lo redacta el asesor legal del cliente; este agente especifica el contenido). **Bloqueante para el Escenario B**; recomendable también para el A.

### 3.4 Propiedad de las cuentas

- GA4, GTM, Search Console, Looker Studio → bajo la **cuenta Google del cliente** (Yaya Mariana / Nil), no la de la agencia. La agencia tiene acceso de editor durante el encargo; el cliente es dueño tras el handoff.
- Vercel Analytics → bajo el proyecto Vercel del cliente. (Nota: el deploy actual `yaya-mariana.vercel.app` está en la cuenta `nilelias5-1440` como proyecto-borrador desechable; la analítica de producción se configura cuando exista el proyecto Vercel definitivo sobre `yayamariana.es`.)

---

## 4 · Plan de implementación por pasos (para ejecutar cuando Nil autorice)

**Nada de esto se ejecuta ahora.** Es la receta lista para una fase futura.

### FASE 5-A · Escenario A — base cookie-less (recomendado primero)

**Paso A1 — Vercel Web Analytics + Speed Insights**
- Añadir dependencia: `npm i @vercel/analytics @vercel/speed-insights`.
- En `src/app/layout.tsx`, dentro de `<body>`: montar `<Analytics />` y `<SpeedInsights />` (de `@vercel/analytics/next` y `@vercel/speed-insights/next`).
- En el dashboard de Vercel del proyecto definitivo: activar Web Analytics y Speed Insights.
- **Sin env vars.** Sin cookies. Sin banner.

**Paso A2 — instrumentar eventos del embudo con `track()`**
- Importar `track` de `@vercel/analytics`.
- Cablear los disparadores de §2.1 y §2.2 en sus componentes:
  - `add_to_cart` → `handleAddToCart` en `products.tsx`
  - `begin_checkout` → en los 3 enlaces a `/checkout` y en el `Cart`
  - `purchase` → rama `success` de `checkout.tsx`
  - `language_switched` → `setLang` en `language-context.tsx`
  - `variety_filtered` → `setActive` en `products.tsx`
  - `waitlist_submitted` → `handleSubmit` de `OffSeasonCTA`
  - `contact_submitted` → `setSent(true)` en `contact.tsx`
- **Revisar cada payload**: solo los parámetros tipados de §2, **cero PII**.
- Centralizar los nombres de evento en un módulo (p.ej. `src/lib/analytics.ts`) para un único punto de verdad de la taxonomía.

**Paso A3 — Search Console**
- Verificar `yayamariana.es` por **DNS TXT** (preferido) una vez comprado el dominio.
- Enviar `sitemap.xml` — **depende de que el SEO audit (issue #3) cree `src/app/sitemap.ts`**, hoy ausente. Coordinar con `seo-genius`/`frontend-developer`.
- Capturar baseline de cobertura el día de lanzamiento.

**Verificación A:** en DevTools → Network, confirmar que Vercel Analytics no escribe cookies; confirmar que los eventos llegan al dashboard de Vercel; confirmar que ningún payload lleva PII.

### FASE 5-B · Escenario B — embudo GA4 (solo si Nil lo aprueba)

> Prerrequisito de negocio: Nil decide que quiere el embudo visual / informes de ingresos / adquisición. Prerrequisito legal: existe página de política de privacidad y de cookies.

**Paso B1 — banner de consentimiento**
- Implementar un componente de banner compliant (§3.2). Opciones: un CMP ligero open-source (p.ej. un banner propio mínimo con estado en cookie de origen) o una librería de consentimiento. Evitar CMPs pesados/intrusivos — el tono manda.
- Categorías: Necesarias + Analítica. Botones de igual prominencia. Link "Configuración de cookies" en `Footer`. Registro con timestamp.
- Traducir a ES/CA/EN (`translations.ts`).
- Auditoría de `accessibility-perfectionist` sobre el banner antes de continuar.

**Paso B2 — GA4 + Consent Mode v2**
- Crear propiedad GA4 bajo la cuenta Google del cliente; data stream sobre `yayamariana.es`.
- Decisión GTM vs directo: con un único destino (GA4), **implementación directa de GA4 + Consent Mode v2** es suficiente y más ligera; reservar GTM solo si más adelante entran más tags. Recomendación: **directo, sin GTM**, salvo que Nil prevea campañas pronto.
- Estado de consentimiento por defecto: `denied` para `analytics_storage` hasta que el visitante acepte (Consent Mode v2).
- Reutilizar la taxonomía de §2 — los eventos ya están en estándar GA4; añadir un **segundo destino** en `src/lib/analytics.ts` (misma llamada → Vercel + GA4), sin re-instrumentar.
- Marcar `begin_checkout` y `purchase` como **key events**.
- Activar Enhanced Measurement; filtro de IP interna (oficina/agencia); retención 14 meses; anonimización de IP verificada.
- Enlazar GA4 ↔ Search Console.

**Env vars (Escenario B):**

| Variable | Dónde | Notas |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `.env` + Vercel project env | ID `G-XXXXXXX` de GA4. `NEXT_PUBLIC_` porque se usa en cliente. |
| `NEXT_PUBLIC_GTM_ID` | *(solo si se opta por GTM)* | `GTM-XXXXXXX`. Omitir si implementación directa. |

*(El Escenario A no requiere ninguna env var nueva. Las claves de Stripe ya existentes — `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — no son de analítica y no se tocan.)*

**Paso B3 — dashboard Looker Studio**
- Construir dashboard de cliente: KPIs en lenguaje llano (compras/mes, valor medio de pedido, embudo `add_to_cart→begin_checkout→purchase`, adquisición por canal, móvil vs escritorio, mezcla de idioma, top queries de Search Console).
- Branded con la paleta carmín y voz de marca (tono tributo, calmado, sin jerga).
- Informe mensual automático programado al email del cliente.

**Verificación B:** con Tag Assistant — confirmar que GA4 **no dispara antes del consentimiento**; rechazar consentimiento y confirmar el modo cookie-less; verificar paridad del banner en los 3 locales; revisar que ningún evento lleve PII.

---

## 5 · Qué NO medir — límites de privacidad

Límites duros. Cualquiera de estos en producción = defecto CRITICAL, bloqueo de `quality-gate`.

- **NADA antes del consentimiento** en el Escenario B. Cero tags de GA4 en la primera carga si no se ha aceptado.
- **Sin PII en ningún parámetro de evento**, en ninguna herramienta:
  - `purchase` → `transaction_id` (id de Stripe, opaco), `value`, `currency`, `item_count`, `items` (nombre+variedad+cantidad+precio). **NUNCA** email, nombre, dirección, CP, ni datos de tarjeta del comprador.
  - `waitlist_submitted` / `contact_submitted` → solo `locale` y flag de consentimiento. **NUNCA** el email ni el texto del mensaje.
  - El `name` y `email` del éxito de checkout que se renderizan en pantalla **no** se envían a analítica.
- **Sin pixels de marketing** — Meta, TikTok, LinkedIn. No hay gasto publicitario; un pixel especulativo viola la necesidad RGPD.
- **Sin heatmaps / grabaciones de sesión** en el lanzamiento — Clarity/Hotjar diferidos. Si algún día entran, con enmascarado de campos obligatorio (el `/checkout` y el formulario de `Contact` capturan PII en inputs).
- **Sin fingerprinting** como atajo de identificación.
- **Sin PII en parámetros de URL** que lleguen a analítica.
- **Sin tracking cross-site / publicitario de terceros.**
- **Sin medición de la identidad del fundador.** El proyecto rinde homenaje a "la abuela Mariana"; "J. Elías, fundador" se renderiza así por regla de proyecto. La analítica no introduce ningún dato, evento, parámetro ni etiqueta que exponga la identidad real del inversor — ni en eventos, ni en nombres de propiedad GA4, ni en el dashboard, ni en informes compartidos.
- **Sin scope creep de eventos.** Solo los 13 eventos de §2. Más eventos = más ruido, no más señal, en un sitio de una sola página.

---

## 6 · Riesgos / dependencias abiertas

| # | Riesgo / dependencia | Impacto | Resolución |
|---|---|---|---|
| 1 | `sitemap.ts` no existe (SEO issue #3) | Search Console no puede recibir sitemap | Coordinar con `seo-genius`/`frontend-developer`; el sitemap es prerrequisito del Paso A3 |
| 2 | `yayamariana.es` sin comprar | No se puede verificar Search Console por DNS, ni fijar el data stream de GA4 | Setup de analítica se ejecuta **después** de comprar el dominio |
| 3 | Sin página de política de privacidad / cookies | Bloquea el Escenario B legalmente | Entregable del asesor legal del cliente; este agente especifica el contenido de la lista de herramientas |
| 4 | `purchase` solo client-side | Pérdida de conversiones si el usuario cierra la pestaña antes del render de éxito | Seam futuro: webhook Stripe `payment_intent.succeeded` → `purchase` server-side |
| 5 | i18n client-side en una sola URL | Si entra routing por locale, el parámetro `locale` de los eventos se solapa con la dimensión de página | Replantear la taxonomía si el `director` aprueba la Opción A del SEO audit |
| 6 | Proyecto Vercel actual es un borrador desechable | La analítica de producción no debe configurarse sobre `yaya-mariana.vercel.app` | Configurar Vercel Analytics sobre el proyecto definitivo de `yayamariana.es` |

---

## 7 · Estado y handoff

- **Modo:** PLAN / AUDIT. **Nada instalado.** Sin dependencias añadidas, sin código tocado, sin env vars creadas, sin cuentas creadas, sin memoria de agencia modificada.
- **Decisión pendiente de Nil (gate Fase 5):** ¿Escenario A (lanzar sin banner, cookie-less) o A→B (añadir GA4 + banner)? Recomendación del agente: **lanzar con A, subir a B cuando el negocio invierta en captación.**
- **Handoff cuando se autorice ejecutar:** `frontend-developer` instrumenta los eventos (§2, §4); `seo-genius`/`frontend-developer` crean `sitemap.ts` (prerrequisito de Search Console); `accessibility-perfectionist` audita el banner si entra el Escenario B; `director` aprueba el dashboard y el informe mensual como artefactos de cliente; `quality-gate` verifica cero tracking pre-consentimiento y cero PII.
- **Entregable:** este documento — `docs/agency/phase-5-analytics-architect-setup-plan.md`.
