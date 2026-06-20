import "server-only";
import { getSql } from "@/lib/cuenta/sql";
import { computeTotals, formatDateES } from "@/lib/cuenta/invoice";
import type { Order, OrderItem, Address, OrderStatus } from "@/lib/cuenta/types";

/* TAREA 1 — Capa de datos del panel /admin sobre Neon.
 *
 * Lee los MISMOS pedidos que ve el cliente (cuenta_orders) y las existencias
 * (product_stock). Devuelve filas "magras" ya listas para pintar, calculadas
 * en servidor, para no enviar al cliente objetos pesados (direcciones,
 * facturación, etc.). El dashboard pasa a ser puramente presentacional. */

// ---- pedidos ---------------------------------------------------------------

/** Fila de pedido lista para la tabla del panel. */
export type AdminOrder = {
  id: string; // nº de pedido visible, p. ej. "YM-2026-0001"
  customer: string;
  city: string;
  items: string; // "Mágnum ×2, Dream ×1"
  total: number;
  status: OrderStatus;
  date: string; // dd/mm/yyyy
  createdAt: string; // ISO (para métricas por mes)
};

type AdminOrderRow = {
  number: string;
  items: unknown;
  status: string;
  created_at: unknown;
  shipping_address: unknown;
};

function asJson<T>(v: unknown): T {
  return (typeof v === "string" ? JSON.parse(v) : v) as T;
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT number, items, status, created_at, shipping_address
    FROM cuenta_orders
    ORDER BY created_at DESC
  `) as AdminOrderRow[];

  return rows.map((r) => {
    const items = asJson<OrderItem[]>(r.items);
    const ship = asJson<Address>(r.shipping_address);
    const createdAt = new Date(r.created_at as string).toISOString();
    // computeTotals sólo usa items: construimos un Order parcial seguro.
    const total = computeTotals({ items } as Order).total;
    return {
      id: r.number,
      customer: ship?.recipient ?? "—",
      city: ship?.city ?? "—",
      items: items.map((it) => `${it.variety} ×${it.qty}`).join(", "),
      total,
      status: r.status as OrderStatus,
      date: formatDateES(createdAt),
      createdAt,
    };
  });
}

// ---- stock -----------------------------------------------------------------

export type AdminStock = {
  variety: string; // display: "Fresa Mágnum"
  units: number;
  lowThreshold: number;
  outThreshold: number;
};

type AdminStockRow = {
  display_name: string;
  units: number;
  low_threshold: number;
  out_threshold: number;
};

export async function getAdminStock(): Promise<AdminStock[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT display_name, units, low_threshold, out_threshold
    FROM product_stock
    ORDER BY units ASC
  `) as AdminStockRow[];

  return rows.map((r) => ({
    variety: r.display_name,
    units: r.units,
    lowThreshold: r.low_threshold,
    outThreshold: r.out_threshold,
  }));
}

// ---- admin_users -----------------------------------------------------------

export type AdminCredential = { username: string; passwordHash: string };

/** Busca un admin por usuario. Devuelve null si no existe o ante error
 *  (el login hace fallback a las env vars → no rompemos /admin). */
export async function getAdminUserByUsername(username: string): Promise<AdminCredential | null> {
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT username, password_hash FROM admin_users WHERE username = ${username} LIMIT 1
    `) as { username: string; password_hash: string }[];
    return rows[0] ? { username: rows[0].username, passwordHash: rows[0].password_hash } : null;
  } catch (e) {
    console.warn("[admin:db] getAdminUserByUsername fallback a env:", (e as Error).message);
    return null;
  }
}
