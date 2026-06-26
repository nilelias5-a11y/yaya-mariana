# 🚀 Guía de lanzamiento — Yaya Mariana

De **demo en modo test** → **producción real**. Pasos en orden, marcando quién
hace cada cosa: **[Nil]** (técnico) o **[J. Elías]** (datos de negocio).

> **Estado actual (demo):** la web funciona en `https://yaya-mariana.vercel.app`
> con Stripe en **modo test**, emails en **mock** (no se envían), datos de
> contacto/fiscales **placeholder**, y un **parche de demo** que muestra el
> magic-link en pantalla. Todo el código está listo; falta meter datos reales y
> cambiar a claves de producción.

> **Orden recomendado:** primero reunir datos (§0) → rellenar config/i18n (§A) →
> dominio + Resend (§C, §E) → Stripe producción (§B) → **revertir parche
> magic-link** (§D, depende de Resend) → secretos (§G) → desplegar y probar (§H).

---

## §0 — Antes de empezar: datos que pedir a **[J. Elías]**

Sin estos datos no se puede lanzar. Reunirlos primero:

- [ ] **Dominio** definitivo (¿`yayamariana.es`? ¿otro?) — y acceso al registrador para el DNS.
- [ ] **Email** de contacto público real.
- [ ] **Teléfono** y **WhatsApp** reales (¿mismo número?).
- [ ] **Dirección** postal/fiscal correcta (hay 4 versiones en histórico, ninguna confirmada).
- [ ] **Entidad legal**: ¿es **Holistic Green Energy S.L.** (CIF `B67391128`) o solo marca? Confirmar razón social + CIF exactos.
- [ ] **Perfiles de redes** reales (Instagram, Facebook, X, Pinterest, LinkedIn — los que tenga).
- [ ] **Descripciones reales** de las 3 fresas (las actuales son provisionales).
- [ ] **Precios reales** y **stock real** (unidades por variedad).
- [ ] **Textos legales** revisados por asesoría (aviso legal, privacidad, cookies, términos, devoluciones).
- [ ] **Testimonios** reales (ahora son de ejemplo) y **vídeos** reales (ahora "Próximamente").
- [ ] **Cuenta de empresa para Stripe** (datos de Holistic Green Energy + IBAN).
- [ ] **Dominio de email verificable** en Resend (para enviar correos).

---

## §A — Datos en el código

### A.1 — `src/config/business.ts` (fuente única; cambiar aquí se propaga a toda la web) — **[Nil]** con datos de **[J. Elías]**

| Dato | Línea | Valor actual (placeholder) |
| --- | --- | --- |
| Dominio (`brand.siteUrl`) | **L37** | `https://yayamariana.es` |
| Email (`contact.email`) | **L43** | `info@yaya-mariana.com` |
| Teléfono visible (`contact.phoneDisplay`) | **L44** | `+34 666 777 888` |
| Teléfono `tel:` (`contact.phoneE164`) | **L45** | `+34666777888` |
| WhatsApp (`contact.whatsapp`) | **L46** | `34666777888` |
| Dirección (`address.*`) | **L53–60** | C/ Electrónica 19, Planta 10, oficina D, 08915 Badalona, Barcelona |
| Razón social (`fiscal.legalName`) | **L64** | `Holistic Green Energy S.L.` |
| CIF (`fiscal.cif`) | **L65** | `B67391128` |
| Redes (`social.*`) | **L70–76** | dominios genéricos (instagram.com, …) |
| Remitente Resend (`email.fromFallback`) | **L82** | `Yaya Mariana <no-reply@yaya-mariana.com>` |
| Precios (`products[].price`) | **L95 / L110 / L125** | `7.5` las tres |
| Peso (`products[].weight`) | **L96 / L111 / L126** | `500g` |

> Tras editar, quitar los comentarios `⚠️ PLACEHOLDER` / `⚠️ PENDIENTE CONFIRMAR`.

### A.2 — Descripciones de producto (i18n) — **[Nil]** con texto de **[J. Elías]**
- `src/i18n/translations.ts` → `products.items[i].description` (corta, tarjeta) y `products.items[i].longDescription` (larga, página de detalle), en **ES, CA y EN**.
- Las `longDescription` están marcadas `// PROVISIONAL` → reemplazar por texto real (y traducir a CA/EN).

### A.3 — Textos legales (i18n) — **[J. Elías → asesoría]**, mete **[Nil]**
- `src/i18n/translations.ts` → `legal.docs.*` (aviso-legal, privacidad, cookies, términos, devoluciones), en ES/CA/EN.
- El email/teléfono/dirección dentro de estos textos se inyectan solos desde config (tokens `{email}`/`{phone}`/`{address}`); **no** hay que tocarlos a mano.

### A.4 — Testimonios y vídeos (i18n) — **[Nil]** con material de **[J. Elías]**
- Testimonios: `translations.ts` → `testimonials.items` (ES **L157**, CA **L685**, EN **L1213**). Ahora son de ejemplo (A.R., J.M.…).
- Vídeos: `translations.ts` → `videos.items` (ES **L114**, CA **L642**, EN **L1170**). Ahora "Próximamente" — meter títulos/duraciones reales y los archivos de vídeo cuando existan.

### A.5 — Stock y fotos reales
- **Stock**: vive en Neon (`product_stock`), NO en el código. Editar unidades desde **/admin → Stock** (o re-sembrar con `SEED_STOCK` en `scripts/migrate-neon.ts`). Valores actuales placeholder: 48 / 12 / 3.
- **Fotos**: las reales van en `public/fresas/<variedad>/` y se referencian en `business.products[].images`. Hay 30 fotos provisionales guardadas en `/_unused-fresas/` (fuera del deploy) por si sirven de referencia.

---

## §B — Stripe a producción (cuenta empresa Holistic Green Energy)

### B.1 — Cuenta y activación — **[J. Elías]** (+ asesoría)
1. Crear/activar cuenta de empresa en [dashboard.stripe.com](https://dashboard.stripe.com) a nombre de **Holistic Green Energy S.L.** (CIF, dirección, actividad).
2. Completar la **verificación** del negocio (documentación que pida Stripe).
3. Conectar el **IBAN** de la empresa para recibir los pagos (Settings → Payouts).
4. Activar el modo **Live** (salir de "test mode").

### B.2 — Cambiar las claves en Vercel — **[Nil]**
Las 3 variables de Stripe pasan de **test** a **live** en
**Vercel → Project `yaya-mariana` → Settings → Environment Variables (Production)**:

| Variable | De (test) | A (live) |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_…` | `sk_live_…` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` | `pk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` (test) | `whsec_…` (live, ver B.3) |

> Las dos primeras se copian del dashboard de Stripe en modo Live
> (Developers → API keys). Actualizar también `.env.local` si se va a probar en local con claves live.

### B.3 — Crear el webhook de producción — **[Nil]**
1. En Stripe (modo **Live**) → Developers → **Webhooks** → *Add endpoint*.
2. URL: `https://<DOMINIO-REAL>/api/stripe/webhook`.
3. Eventos: como mínimo `payment_intent.succeeded` (el que reconstruye el pedido).
4. Copiar el **Signing secret** (`whsec_…`) → ponerlo en `STRIPE_WEBHOOK_SECRET` (Vercel Production).
   > Sin este secret el webhook responde 200 pero **ignora** el evento (está gateado a propósito).

### B.4 — Probar un pago real antes de abrir — **[Nil + J. Elías]**
1. Con todo en live y desplegado, hacer **una compra real** de prueba (importe pequeño) con una tarjeta real.
2. Verificar:
   - [ ] El pago aparece en el dashboard de Stripe (Live).
   - [ ] Se crea el pedido en Neon (visible en **/admin → Pedidos**).
   - [ ] Llega el email de confirmación (requiere Resend activo, §C).
3. **Reembolsar** esa compra de prueba desde Stripe.

---

## §C — Resend (email real) — **[Nil]** con dominio de **[J. Elías]**

Ya documentado en **`README-CUENTA.md` → sección «Emails (Resend)»**. Resumen:
1. Cuenta en [resend.com](https://resend.com).
2. **Verificar el dominio** (registros DNS SPF/DKIM).
3. Añadir en Vercel (Production) y `.env.local`:
   - `RESEND_API_KEY=re_…`
   - `EMAIL_FROM="Yaya Mariana <hola@DOMINIO-VERIFICADO>"` (debe ser del dominio verificado; alinear con `business.email.fromFallback` L82).
4. Sin `RESEND_API_KEY` el envío sigue en **mock**; al añadirla, pasa a real sin tocar código.

> ⚠️ **Resend debe estar activo ANTES de revertir el parche del magic-link (§D)** — si no, nadie podría iniciar sesión en su cuenta (ni email ni link en pantalla).

---

## §D — Revertir el parche del magic-link (DEMO) — **[Nil]**

Durante la demo, el magic-link se muestra en pantalla porque el email es mock.
En producción **no debe exponerse**. El parche está **sin commitear** (solo en
el árbol local), en `magic/route.ts` y `register/route.ts`.

**Precondición:** Resend activo (§C). Si no, los usuarios no podrían loguearse.

**Revertir (descarta los cambios de demo y restaura el guard `NODE_ENV`):**
```bash
git checkout -- src/app/api/cuenta/magic/route.ts src/app/api/cuenta/register/route.ts
```
Esto deja:
- `magic/route.ts`: `if (process.env.NODE_ENV !== "production") devMagicLink = link;`
- `register/route.ts`: `devLink()` devuelve `{}` en producción.

Verificar después: en producción, `POST /api/cuenta/magic` responde `{ ok: true }`
**sin** `devMagicLink`, y el enlace llega por **email**.

---

## §E — Dominio, DNS y SEO — **[Nil]** con dominio de **[J. Elías]**

1. **Comprar el dominio** (si no se tiene) — **[J. Elías]**.
2. **Añadirlo en Vercel**: Project → Settings → **Domains** → add `DOMINIO` → seguir las instrucciones DNS (A/CNAME) en el registrador — **[Nil]**.
3. **Actualizar `business.brand.siteUrl` (L37)** con el dominio real → `robots.txt`, `sitemap.xml`, JSON-LD y canónicos pasan a apuntar al dominio bueno.
4. **Indexación**: ya está resuelta — `next.config.ts` emite `X-Robots-Tag: noindex` en todo lo que **no** sea `VERCEL_ENV=production`. Al desplegar a producción con dominio real, Google **sí** indexa. Tras lanzar: dar de alta el dominio en Google Search Console y enviar el `sitemap.xml`.

---

## §F — Variables de entorno (consolidado) — **[Nil]**

Todas en **Vercel → Settings → Environment Variables (Production)** (y en `.env.local` para pruebas):

| Variable | Para | Acción en lanzamiento |
| --- | --- | --- |
| `DATABASE_URL` | Neon (BD) | ✅ ya está (revisar que sea la BD definitiva) |
| `SESSION_SECRET` | JWT admin | Rotar (§G) |
| `CUENTA_SESSION_SECRET` | JWT cliente | Rotar (§G) |
| `ADMIN_USER` / `ADMIN_PASS_HASH` | Login /admin | Poner contraseña fuerte (§G) |
| `STRIPE_SECRET_KEY` | Stripe | `sk_test_`→`sk_live_` (§B) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe | `pk_test_`→`pk_live_` (§B) |
| `STRIPE_WEBHOOK_SECRET` | Webhook Stripe | `whsec_` live nuevo (§B.3) |
| `RESEND_API_KEY` | Email | Añadir cuando haya dominio (§C) |
| `EMAIL_FROM` | Email | Remitente del dominio verificado (§C) |

> **Nota:** no hay clave de Anthropic en el proyecto (el antiguo "chat IA" se sustituyó por WhatsApp). El pendiente histórico de "rotar API key de Anthropic" **ya no aplica**.

---

## §G — Secretos y seguridad — **[Nil]**

- [ ] **Rotar `SESSION_SECRET` y `CUENTA_SESSION_SECRET`** en producción (valores nuevos, ≥32 chars, distintos de los de desarrollo). Cierra las sesiones de demo.
- [ ] **Contraseña de admin fuerte**: generar hash con `node scripts/hash-password.mjs "NUEVA_PASS"` y ponerlo en `ADMIN_PASS_HASH` (Vercel). Ver `README-ADMIN.md`.
- [ ] Confirmar que `.env.local` **no** está en git (lo está en `.gitignore`) y que ningún secreto se ha commiteado.

---

## §H — Despliegue final y pruebas (smoke test) — **[Nil]**

1. **Mergear/commitear** todo lo de §A (datos reales) en `clasico`. El parche del magic-link queda revertido (§D).
2. **Desplegar a producción:**
   ```bash
   cd C:\proyectos\yaya-mariana
   vercel --prod --yes
   ```
3. **Smoke test en el dominio real:**
   - [ ] Home carga (200), idiomas ES/CA/EN cambian bien.
   - [ ] Páginas de producto `/productos/magnum|dream|1525` cargan; precios/stock correctos.
   - [ ] Añadir al carrito + **compra real de prueba** → pedido en /admin + email recibido (§B.4).
   - [ ] **/admin**: login con la nueva contraseña, cambiar estado de un pedido y editar stock.
   - [ ] **Cuenta**: registro → llega magic link por **email** (no en pantalla) → login.
   - [ ] Factura PDF con razón social/CIF/dirección reales.
   - [ ] Páginas legales con textos revisados; datos de contacto reales en footer/contacto.
   - [ ] `robots.txt` y `sitemap.xml` apuntan al dominio real; la web indexa (no `noindex`).
4. **Reembolsar** la compra de prueba en Stripe.
5. Dar de alta en **Google Search Console** + enviar sitemap.

---

## ✅ Checklist resumen de lanzamiento

- [ ] §0 Datos de J. Elías reunidos
- [ ] §A config/business.ts + i18n con datos reales (descripciones, legales, testimonios, vídeos, precios, stock, fotos)
- [ ] §E Dominio comprado + añadido en Vercel + `siteUrl` actualizado
- [ ] §C Resend activo (dominio verificado, `RESEND_API_KEY` + `EMAIL_FROM`)
- [ ] §B Stripe en live (3 claves + webhook) y pago de prueba OK
- [ ] §D Parche magic-link revertido (después de Resend)
- [ ] §G Secretos rotados + contraseña admin fuerte
- [ ] §H Desplegado a prod + smoke test completo + sitemap en Search Console

> Cuando todo esté ✅, Yaya Mariana está **en producción real**. 🍓
