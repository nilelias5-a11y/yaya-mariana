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

## Variables de entorno (`.env.local`, gitignored)

| Variable                | Descripción                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`          | Connection string de Neon (PostgreSQL). **Requerida** para la zona cliente. |
| `CUENTA_SESSION_SECRET` | Firma del JWT de sesión de cliente (HS256). Mín. 32 caracteres.   |
| `EMAIL_FROM`            | Remitente de los emails (mock por ahora).                          |
| `RESEND_API_KEY`        | *(placeholder, comentado)* clave de Resend cuando se conecte.      |
| `STRIPE_WEBHOOK_SECRET` | *(placeholder, comentado)* para auto-registro tras checkout real.  |

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
   FASE B (migración a Neon). Pendiente en una 2ª tanda: tablas
   `admin_users`, `cuenta_sessions` (revocación) y `product_stock`.
2. Webhook de Stripe (`STRIPE_WEBHOOK_SECRET`) → auto-registro con el email
   del pedido + creación de la orden + envío de magic link de bienvenida.
3. Conectar Resend en `src/lib/cuenta/email.ts` (la interfaz ya está).
4. Seguimiento real con Sendcloud (rellenar `tracking_url`).
