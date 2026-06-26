import "server-only";
import type { Order } from "@/lib/cuenta/types";

/* MEJORA 4 · CAPA B — Esqueleto de integración con un proveedor de envíos
 * (mensajería) gateado tras credenciales. INACTIVO.
 *
 * Hoy el seguimiento se gestiona A MANO desde el panel (Capa A), que funciona
 * con CUALQUIER mensajería o reparto propio. Esta capa es solo la estructura
 * por si en el futuro se automatiza con un proveedor.
 *
 * Env vars GENÉRICAS (aún no se ha decidido la mensajería; el primer candidato
 * es Sendcloud, pero el nombre es agnóstico para no renombrar si cambia):
 *   - SHIPPING_PROVIDER_PUBLIC_KEY
 *   - SHIPPING_PROVIDER_SECRET_KEY
 *
 * Sin credenciales → `createParcelTracking` devuelve `{ configured: false }` y
 * manda el tracking manual. Con credenciales → aquí encajaría la llamada real
 * al API del proveedor (crear envío → obtener nº + URL de seguimiento) para
 * guardarlos en los MISMOS campos de la Capa A (vía updateOrderTracking).
 *
 * ⚠️ NO está conectado a ninguna acción de UI. Activarlo requiere decisiones de
 * negocio (mensajería, tarifas, packaging) que aún no tenemos. Ver LANZAMIENTO.md. */

export type ShippingTracking = { carrier: string; number: string; url: string };

export type CreateParcelResult =
  | { configured: false }
  | { configured: true; ok: true; tracking: ShippingTracking }
  | { configured: true; ok: false; error: string };

/** ¿Hay credenciales del proveedor de envíos configuradas? (gateo, como Resend) */
export function isShippingConfigured(): boolean {
  return Boolean(
    process.env.SHIPPING_PROVIDER_PUBLIC_KEY && process.env.SHIPPING_PROVIDER_SECRET_KEY,
  );
}

/** STUB. Sin credenciales → `{ configured: false }` (manda el tracking manual).
 *  Con credenciales → punto de integración real (aún no implementado). */
export async function createParcelTracking(order: Order): Promise<CreateParcelResult> {
  if (!isShippingConfigured()) return { configured: false };

  /* TODO (activación): llamar al API del proveedor con los datos del pedido
   * (order.shippingAddress, order.items, order.number) para crear el envío y
   * obtener nº + URL de seguimiento. Mapear la respuesta a ShippingTracking y
   * persistirla con updateOrderTracking(order.number, { ...tracking }). */
  void order;
  return { configured: true, ok: false, error: "not_implemented" };
}
