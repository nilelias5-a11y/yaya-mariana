# Zona de cliente `/cuenta` — Yaya Mariana (FASE B)

Panel privado para clientes finales: ver pedidos, descargar facturas PDF,
seguir el envío y gestionar sus datos. Aislado del panel interno `/admin`
(cookie y secreto distintos, sin colisión).

> **Estado:** los datos viven en **PostgreSQL (Neon)** desde la migración
> de FASE B. La capa `src/lib/cuenta/db.ts` usa el driver serverless de
> Neon manteniendo la misma interfaz (el resto del código no cambió). Los
> emails siguen siendo **mock** (se loguean en consola).

## Usuario de prueba

Sembrado por el script de migración (`npm run db:migrate`):

- **Email:** `cliente@test.yaya-mariana.com`
- **Contraseña:** `HLH2-NTvR-gLNC-yFe5`
- **3 pedidos** en distintos estados: entregado (`YM-2026-0001`), enviado
  con seguimiento (`YM-2026-0002`) y en preparación (`YM-2026-0003`).

Con esto puedes recorrer todo el flujo sin Stripe: inicio, pedidos,
detalle con timeline, descarga de factura PDF, datos personales y RGPD.

## Cómo acceder

1. `npm run dev`
2. Ve a `http://localhost:3000/cuenta` → te redirige al login.
3. Modos de acceso:
   - **Con contraseña:** email + contraseña del usuario de prueba.
   - **Invitado:** email + número de pedido (p. ej. `YM-2026-0001`).
   - **Magic link / recuperar:** introduce el email; en desarrollo **no se
     envía correo**, el enlace se muestra en pantalla (y se loguea en
     consola del servidor con prefijo `[email:mock]`). Pulsa el enlace
     para entrar.

## Crear un usuario nuevo

Desde `/cuenta/registro` (nombre + email, contraseña opcional). Se crea la
cuenta y se genera un magic link de verificación (en dev, visible en la
pantalla de confirmación).

## Base de datos (Neon / PostgreSQL)

La capa de datos (`src/lib/cuenta/db.ts`) habla con **Neon** vía el driver
`@neondatabase/serverless` (SQL sobre HTTP, edge-safe, prepared statements).

**Tablas** (creadas por la migración): `cuenta_users`, `cuenta_orders`
(items / dirección / facturación como **JSONB**), `cuenta_invoices`
(nº correlativo + caché del PDF en base64). El esquema replica los tipos de
`src/lib/cuenta/types.ts`.

2ª tanda (TAREA 2, additive):

- `cuenta_orders.payment_ref` — referencia del pago (PaymentIntent de Stripe).
  Índice único parcial → la creación de pedido es **idempotente**.
- `cuenta_sessions` — store de sesiones de cliente (`jti`) para **revocación
  real** en logout (ver más abajo).
- `admin_users` — credenciales del panel `/admin` (ver README-ADMIN.md).
- `product_stock` — existencias por variedad + umbrales (panel `/admin`).

### Conectar a Neon

1. Crea un proyecto en [neon.tech](https://neon.tech) y copia la
   **connection string** (formato `postgresql://usuario:pass@host/db?sslmode=require`).
2. Pégala en `.env.local`:
   ```
   DATABASE_URL=postgresql://…
   ```
   > Si la string contiene `$`, escápalos como `\$` (el loader de Next,
   > `dotenv-expand`, los expandiría). Las de Neon normalmente no llevan.
3. Ejecuta la migración (crea el esquema + siembra el usuario de prueba):
   ```
   npm run db:migrate
   ```

El script (`scripts/migrate-neon.ts`) es **idempotente** (puede correrse
varias veces sin duplicar; usa `INSERT … ON CONFLICT DO NOTHING`), conserva
los IDs (`ym-2026-0001`…) y toma como fuente los JSON de `data/cuenta/` si
existen, o el seed de código en su defecto.

## Simular / editar pedidos

- **Semilla** (`src/lib/cuenta/seed.ts`): fuente de la siembra inicial.
  Edita aquí (o `data/cuenta/orders.json` si existe) y re-ejecuta
  `npm run db:migrate` para añadir nuevos pedidos.
- **En la BD:** se pueden editar filas directamente desde el SQL editor de
  Neon. Estados válidos: `pagado`, `preparacion`, `enviado`, `entregado`,
  `cancelado`. Añade `tracking_url` a un pedido para activar el botón de
  seguimiento.

> `data/cuenta/*.json` (gitignored) ya **no lo lee la app** tras la
> migración: queda como fuente del migrador y como respaldo para rollback.

## Facturas PDF

- Endpoint: `GET /api/cuenta/factura/[orderId]` (añade `?download=1` para
  forzar descarga). Verifica que el cliente autenticado es **dueño** del
  pedido (si no, 404). El PDF se **cachea en `cuenta_invoices`** (base64)
  para no regenerarlo en cada descarga.
- Cumple lo básico de la normativa española B2C: emisor (Holistic Green
  Energy S.L., CIF B67391128), receptor con DNI, nº correlativo
  `FCV-2026-XXXX`, base imponible + IVA 10% + total, forma de pago, pie
  legal. Una página A4.
- Tipografía del PDF: el wordmark usa una serif itálica (aprox. Playfair)
  y los datos una sans (aprox. Inter), con el logo raster embebido arriba.

## Pedidos reales (checkout → Neon)

Un pago con tarjeta ahora **crea el pedido** en `cuenta_orders` (antes el
checkout sólo mostraba una pantalla de éxito sin guardar nada). Dos caminos
que convergen en el mismo pedido (idempotente por `payment_ref`):

1. **Endpoint de checkout** — `POST /api/checkout/complete`. Lo llama el
   formulario al quedar el PaymentIntent en `succeeded`. Verifica el pago
   contra Stripe (si la clave es real) y crea el pedido.
2. **Webhook de Stripe** — `POST /api/stripe/webhook` (red de seguridad).
   Verifica la firma (`STRIPE_WEBHOOK_SECRET`) y, ante `payment_intent.
   succeeded`, reconstruye el pedido desde la `metadata` del pago. Gateado:
   sin el secreto configurado responde 200 y no hace nada.

Ambos usan el creador compartido `src/lib/cuenta/orders.ts`
(`createOrderFromPayment`): **auto-registro** del usuario si el email no tiene
cuenta, asignación de nº correlativo `YM-AAAA-NNNN` + factura `FCV-AAAA-NNNN`,
y email de bienvenida (mock) en cuentas nuevas. El catálogo de producto vive
en `src/lib/catalog.ts`.

## Revocación de sesión (logout real)

Cada sesión de cliente lleva un `jti` y se registra en `cuenta_sessions`. El
**logout marca el `jti` como revocado**: un token ya emitido (incluso copiado)
deja de dar acceso, sin esperar a que expire. La comprobación vive en
`getCuentaUser` (runtime Node); el proxy Edge sólo verifica firma y **preserva
el `jti`** al renovar. *Fail-open*: si la tabla no existe (migración
pendiente) las sesiones siguen funcionando. Las sesiones legacy sin `jti` no
son revocables (expiran solas).

## Variables de entorno (`.env.local`, gitignored)

| Variable                | Descripción                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`          | Connection string de Neon (PostgreSQL). **Requerida** para la zona cliente. |
| `CUENTA_SESSION_SECRET` | Firma del JWT de sesión de cliente (HS256). Mín. 32 caracteres.   |
| `STRIPE_SECRET_KEY`     | Clave secreta de Stripe. Si es **real** (`sk_test`/`sk_live`), el endpoint de checkout **verifica** el pago antes de crear el pedido. |
| `STRIPE_WEBHOOK_SECRET` | Secreto `whsec_` del webhook. **Sin él, el webhook no procesa** (gateado). Se obtiene al crear el endpoint en el panel de Stripe / `stripe listen`. |
| `EMAIL_FROM`            | Remitente de los emails (mock por ahora).                          |
| `RESEND_API_KEY`        | *(placeholder, comentado)* clave de Resend cuando se conecte.      |

> La sesión de cliente dura **30 días** (cookie `cuenta_session`, httpOnly,
> con renovación deslizante). El panel `/admin` usa su propia cookie y
> secreto — no hay colisión.

## RGPD

- **Exportar datos:** `GET /api/cuenta/export` → descarga un JSON con el
  usuario (sin el hash de contraseña) y sus pedidos.
- **Borrar cuenta:** botón en `/cuenta/datos` → elimina usuario y pedidos
  y cierra la sesión.
- **Marketing opt-in:** desactivado por defecto; editable en `/cuenta/datos`.
- **Verificación de email:** el magic link marca el email como verificado.

## Rollback (volver al mock JSON temporalmente)

La migración a Neon es **un solo commit**. Si algo falla y necesitas volver
al mock en JSON sin perder nada:

1. Identifica el commit: `git log --oneline | grep "migrar mock data a Neon"`.
2. Revierte: `git revert <hash>` (restaura la versión de `db.ts` que lee
   `data/cuenta/*.json` y elimina la dependencia de `DATABASE_URL`).
3. Si la carpeta `data/cuenta/` ya no existe, se vuelve a sembrar sola desde
   `src/lib/cuenta/seed.ts` en el primer acceso.

> El revert sólo afecta al código; **no borra** nada en Neon. Para limpiar
> la BD, hazlo desde el panel de Neon (`DROP TABLE cuenta_users CASCADE`).

## Próximos pasos (cuando llegue Stripe real)

1. ✅ ~~Sustituir `data/cuenta/*.json` por Postgres/Neon~~ — **hecho** en
   FASE B (migración a Neon).
2. ✅ ~~Tablas `admin_users`, `cuenta_sessions` (revocación) y
   `product_stock`~~ — **hecho** (2ª tanda, TAREA 2).
3. ✅ ~~Webhook de Stripe → auto-registro + creación de la orden + magic
   link de bienvenida~~ — **escrito** (TAREA 4); falta **probarlo** con las
   claves test reales y configurar `STRIPE_WEBHOOK_SECRET`.
4. Conectar Resend en `src/lib/cuenta/email.ts` (la interfaz ya está).
5. Seguimiento real con Sendcloud (rellenar `tracking_url`).
