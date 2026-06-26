import type { OrderStatus } from "@/lib/cuenta/types";

/* Regla de dominio compartida (TAREA 1): transiciones permitidas del estado
 * de un pedido. Vive aquí —sin `server-only`— para que la valide tanto el
 * route handler (servidor) como el dashboard (cliente, que sólo ofrece en el
 * dropdown los destinos válidos). Una única fuente de verdad. */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pagado: ["preparacion", "cancelado"],
  preparacion: ["enviado", "cancelado"],
  enviado: ["entregado", "cancelado"],
  entregado: [],
  cancelado: [],
};

const ORDER_STATUSES = Object.keys(ORDER_TRANSITIONS) as OrderStatus[];
export function isOrderStatus(v: unknown): v is OrderStatus {
  return typeof v === "string" && (ORDER_STATUSES as string[]).includes(v);
}
