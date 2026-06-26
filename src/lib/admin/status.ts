import type { OrderStatus } from "@/lib/cuenta/types";

/* Regla de dominio compartida (TAREA 1): transiciones permitidas del estado
 * de un pedido. Vive aquí —sin `server-only`— para que la valide tanto el
 * route handler (servidor) como el dashboard (cliente, que sólo ofrece en el
 * dropdown los destinos válidos). Una única fuente de verdad.
 *
 * Avance: pagado→preparacion→enviado→entregado. Más:
 * - cancelar desde cualquier estado NO terminal,
 * - un único paso de RETROCESO para corregir errores manuales
 *   (preparacion→pagado, enviado→preparacion, entregado→enviado).
 * `cancelado` es el único estado terminal (no se deshace). */
export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pagado: ["preparacion", "cancelado"],
  preparacion: ["enviado", "pagado", "cancelado"],
  enviado: ["entregado", "preparacion", "cancelado"],
  entregado: ["enviado"],
  cancelado: [],
};

const ORDER_STATUSES = Object.keys(ORDER_TRANSITIONS) as OrderStatus[];
export function isOrderStatus(v: unknown): v is OrderStatus {
  return typeof v === "string" && (ORDER_STATUSES as string[]).includes(v);
}

/* Posición en la cadena lineal de avance. `cancelado` queda fuera (es un
 * desvío, no un paso de la cadena). Sirve para que la UI distinga un avance
 * de una corrección hacia atrás. */
const STATUS_RANK: Record<OrderStatus, number> = {
  pagado: 0,
  preparacion: 1,
  enviado: 2,
  entregado: 3,
  cancelado: 99,
};

/** ¿La transición from→to es un retroceso (corrección) en la cadena lineal?
 *  Cancelar nunca cuenta como retroceso. */
export function isBackwardTransition(from: OrderStatus, to: OrderStatus): boolean {
  return to !== "cancelado" && STATUS_RANK[to] < STATUS_RANK[from];
}
