import type { OrderItem } from "@/lib/cuenta/types";

/* TAREA 3 — Catálogo de producto (fuente única para construir pedidos).
 *
 * Mapea el nombre que usa la web/carrito (`cartName`) a los datos fiscales
 * y de pedido (variedad, nombre de línea, PVP IVA incl., imagen). Lo usan el
 * endpoint de checkout y el webhook de Stripe para reconstruir las líneas de
 * un pedido a partir de lo que llega del pago.
 *
 * NOTA: replica los productos de components/ui/products.tsx (parte de
 * marketing, intocable aquí). Si cambian precios/variedades, actualizar
 * ambos — o, en una iteración futura, mover el catálogo a product_stock. */

export type CatalogProduct = {
  cartName: string; // "Fresa Mágnum" (lo que ve el cliente)
  variety: string; // "Mágnum"
  orderName: string; // "Caja fresas Yaya Mariana — Mágnum"
  unitPrice: number; // PVP por unidad, IVA incluido (€)
  image: string; // ruta en /public
};

export const CATALOG: CatalogProduct[] = [
  {
    cartName: "Fresa Mágnum",
    variety: "Mágnum",
    orderName: "Caja fresas Yaya Mariana — Mágnum",
    unitPrice: 7.5,
    image: "/fresas/magnum/magnum-10.jpeg",
  },
  {
    cartName: "Fresa Dream",
    variety: "Dream",
    orderName: "Caja fresas Yaya Mariana — Dream",
    unitPrice: 7.5,
    image: "/fresas/dream/dream-07.jpeg",
  },
  {
    cartName: "Fresa Variedad 1525",
    variety: "1525",
    orderName: "Caja fresas Yaya Mariana — Variedad 1525",
    unitPrice: 7.5,
    image: "/fresas/variedad1525/variedad1525-10.jpeg",
  },
];

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
