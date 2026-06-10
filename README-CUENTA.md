# Zona de cliente `/cuenta` — Yaya Mariana (FASE B)

Panel privado para clientes finales: ver pedidos, descargar facturas PDF,
seguir el envío y gestionar sus datos. Aislado del panel interno `/admin`
(cookie y secreto distintos, sin colisión).

> **Estado:** datos **mock** en JSON (`data/cuenta/`, gitignored). La
> estructura está lista para migrar a PostgreSQL/Neon cuando se conecte
> Stripe real. Los emails son **mock** (se loguean en consola).

## Usuario de prueba

Sembrado automáticamente la primera vez que se accede (si no existe el
fichero de datos):

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

## Simular / editar pedidos

Los pedidos mock viven en dos sitios:

- **Semilla** (`src/lib/cuenta/seed.ts`): se usa para crear el fichero la
  primera vez. Edita aquí para cambiar el estado inicial del repo.
- **Datos en vivo** (`data/cuenta/orders.json`, gitignored): se generan a
  partir del seed y se pueden editar a mano para probar estados. Para
  re-sembrar desde cero, borra la carpeta `data/cuenta/` y recarga.

Estados válidos de un pedido: `pagado`, `preparacion`, `enviado`,
`entregado`, `cancelado`. Añade `trackingUrl` a un pedido para activar el
botón de seguimiento.

## Facturas PDF

- Endpoint: `GET /api/cuenta/factura/[orderId]` (añade `?download=1` para
  forzar descarga). Verifica que el cliente autenticado es **dueño** del
  pedido (si no, 404). Caché en memoria por nº de factura.
- Cumple lo básico de la normativa española B2C: emisor (Holistic Green
  Energy S.L., CIF B67391128), receptor con DNI, nº correlativo
  `FCV-2026-XXXX`, base imponible + IVA 10% + total, forma de pago, pie
  legal. Una página A4.
- Tipografía del PDF: el wordmark usa una serif itálica (aprox. Playfair)
  y los datos una sans (aprox. Inter), con el logo raster embebido arriba.

## Variables de entorno (`.env.local`, gitignored)

| Variable                | Descripción                                                        |
| ----------------------- | ------------------------------------------------------------------ |
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

## Próximos pasos (cuando llegue Stripe real)

1. Sustituir `data/cuenta/*.json` por Postgres/Neon (los tipos en
   `src/lib/cuenta/types.ts` ya replican el esquema).
2. Webhook de Stripe (`STRIPE_WEBHOOK_SECRET`) → auto-registro con el email
   del pedido + creación de la orden + envío de magic link de bienvenida.
3. Conectar Resend en `src/lib/cuenta/email.ts` (la interfaz ya está).
4. Seguimiento real con Sendcloud (rellenar `trackingUrl`).
