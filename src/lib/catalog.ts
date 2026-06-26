import type { OrderItem } from "@/lib/cuenta/types";
import { business } from "@/config/business";

/* TAREA 3 — Catálogo de producto (para construir pedidos).
 *
 * Mapea el nombre que usa la web/carrito (`cartName`) a los datos de pedido
 * (variedad, nombre de línea, PVP IVA incl., imagen). Lo usan el endpoint de
 * checkout y el webhook de Stripe para reconstruir las líneas de un pedido.
 *
 * Los datos salen de la config central `business.products` (única fuente de
 * verdad de precios/variedades, compartida con la web de marketing). */

export type CatalogProduct = {
  cartName: string; // "Fresa Mágnum" (lo que ve el cliente)
  variety: string; // "Mágnum"
  orderName: string; // "Caja fresas Yaya Mariana — Mágnum"
  unitPrice: number; // PVP por unidad, IVA incluido (€)
  image: string; // ruta en /public
};

export const CATALOG: CatalogProduct[] = business.products.map((p) => ({
  cartName: p.cartName,
  variety: p.variety,
  orderName: p.orderName,
  unitPrice: p.price,
  image: p.images[0],
}));

export function findByCartName(name: string): CatalogProduct | undefined {
  return CATALOG.find((p) => p.cartName === name);
}

/** Construye líneas de pedido (OrderItem[]) a partir de pares nombre+cantidad
 *  (lo que envía el carrito). Productos desconocidos se ignoran. */
export function orderItemsFromCart(
  items: { name: string; quantity: number }[],
): OrderItem[] {
  const out: OrderItem[] = [];
  for (const it of items) {
    const p = findByCartName(it.name);
    const qty = Math.max(1, Math.floor(Number(it.quantity) || 0));
    if (!p || qty <= 0) continue;
    out.push({ variety: p.variety, name: p.orderName, qty, unitPrice: p.unitPrice, image: p.image });
  }
  return out;
}
