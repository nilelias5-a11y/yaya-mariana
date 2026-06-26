import "server-only";
import { getSql } from "@/lib/cuenta/sql";
import { computeTotals, formatDateES } from "@/lib/cuenta/invoice";
import type { Order, OrderItem, Address, OrderStatus } from "@/lib/cuenta/types";
import { ORDER_TRANSITIONS, isOrderStatus } from "./status";
import { getOrderById } from "@/lib/cuenta/db";
import type { InvoiceTotals } from "@/lib/cuenta/invoice";

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

// ---- detalle de pedido (PARTE 1 — drawer) ----------------------------------

/** Detalle completo de un pedido para el drawer del panel. Incluye datos del
 *  cliente (JOIN cuenta_users). Todo lo demás ya vive en cuenta_orders. */
export type AdminOrderDetail = {
  number: string;
  status: OrderStatus;
  date: string; // dd/mm/yyyy
  createdAt: string; // ISO
  updatedAt: string | null;
  items: OrderItem[];
  totals: InvoiceTotals;
  shippingAddress: Address;
  billing: { nombre: string; dni: string; address: Address };
  invoiceNumber: string;
  trackingUrl: string | null;
  customer: { email: string; nombre: string; telefono: string | null };
};

type AdminOrderDetailRow = {
  number: string;
  status: string;
  created_at: unknown;
  updated_at: unknown;
  items: unknown;
  shipping_address: unknown;
  billing: unknown;
  invoice_number: string;
  tracking_url: string | null;
  customer_email: string | null;
  customer_nombre: string | null;
  customer_telefono: string | null;
};

export async function getAdminOrderDetail(orderNumber: string): Promise<AdminOrderDetail | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT o.number, o.status, o.created_at, o.updated_at, o.items, o.shipping_address,
           o.billing, o.invoice_number, o.tracking_url,
           u.email AS customer_email, u.nombre AS customer_nombre, u.telefono AS customer_telefono
    FROM cuenta_orders o
    LEFT JOIN cuenta_users u ON u.id = o.user_id
    WHERE o.number = ${orderNumber}
    LIMIT 1
  `) as AdminOrderDetailRow[];
  if (!rows[0]) return null;

  const r = rows[0];
  const items = asJson<OrderItem[]>(r.items);
  const createdAt = new Date(r.created_at as string).toISOString();
  return {
    number: r.number,
    status: r.status as OrderStatus,
    date: formatDateES(createdAt),
    createdAt,
    updatedAt: r.updated_at ? new Date(r.updated_at as string).toISOString() : null,
    items,
    totals: computeTotals({ items } as Order),
    shippingAddress: asJson<Address>(r.shipping_address),
    billing: asJson<{ nombre: string; dni: string; address: Address }>(r.billing),
    invoiceNumber: r.invoice_number,
    trackingUrl: r.tracking_url ?? null,
    customer: {
      email: r.customer_email ?? "—",
      nombre: r.customer_nombre ?? "—",
      telefono: r.customer_telefono ?? null,
    },
  };
}

/** Pedido completo (tipo Order) por número, para generar la factura PDF en el
 *  panel. Reutiliza el mapeo de cuenta/db (getOrderById, por `id`/slug). */
export async function getAdminOrderForInvoice(orderNumber: string): Promise<Order | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id FROM cuenta_orders WHERE number = ${orderNumber} LIMIT 1
  `) as { id: string }[];
  if (!rows[0]) return null;
  return getOrderById(rows[0].id);
}

// ---- stock -----------------------------------------------------------------

export type AdminStock = {
  key: string; // PK real (product_stock.variety): "Mágnum" | "Dream" | "1525"
  variety: string; // display: "Fresa Mágnum"
  units: number;
  lowThreshold: number;
  outThreshold: number;
};

type AdminStockRow = {
  variety: string;
  display_name: string;
  units: number;
  low_threshold: number;
  out_threshold: number;
};

export async function getAdminStock(): Promise<AdminStock[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT variety, display_name, units, low_threshold, out_threshold
    FROM product_stock
    ORDER BY units ASC
  `) as AdminStockRow[];

  return rows.map((r) => ({
    key: r.variety,
    variety: r.display_name,
    units: r.units,
    lowThreshold: r.low_threshold,
    outThreshold: r.out_threshold,
  }));
}

// ---- mutaciones de gestión (panel /admin) ----------------------------------

/* TAREA 1 — transiciones de estado permitidas: regla de dominio compartida en
 * @/lib/admin/status (la usa también el dashboard cliente). Se re-exporta aquí
 * para que los route handlers la consuman desde un único módulo de datos. */
export { ORDER_TRANSITIONS, isOrderStatus };

export type UpdateOrderResult =
  | { ok: true; from: OrderStatus; status: OrderStatus; updatedAt: string }
  | { ok: false; code: "not_found" }
  | { ok: false; code: "invalid_transition"; from: OrderStatus; allowed: OrderStatus[] };

/** Cambia el estado de un pedido (identificado por su `number`, p. ej.
 *  "YM-2026-0001") validando la transición. Sella `updated_at`. */
export async function updateOrderStatus(
  orderNumber: string,
  next: OrderStatus,
): Promise<UpdateOrderResult> {
  const sql = getSql();
  const current = (await sql`
    SELECT status FROM cuenta_orders WHERE number = ${orderNumber} LIMIT 1
  `) as { status: OrderStatus }[];
  if (!current[0]) return { ok: false, code: "not_found" };

  const from = current[0].status;
  const allowed = ORDER_TRANSITIONS[from] ?? [];
  if (!allowed.includes(next)) {
    return { ok: false, code: "invalid_transition", from, allowed };
  }

  const updated = (await sql`
    UPDATE cuenta_orders
    SET status = ${next}, updated_at = now()
    WHERE number = ${orderNumber}
    RETURNING status, updated_at
  `) as { status: OrderStatus; updated_at: unknown }[];
  return {
    ok: true,
    from,
    status: updated[0].status,
    updatedAt: new Date(updated[0].updated_at as string).toISOString(),
  };
}

/* PARTE 2 — editar la dirección de envío de un pedido.
 *
 * Solo editable ANTES de enviar (estados pagado/preparacion); en
 * enviado/entregado/cancelado se rechaza. Valida campos obligatorios y
 * longitudes. Preserva id/label de la dirección original. */
export const ADDRESS_EDITABLE_STATUSES: OrderStatus[] = ["pagado", "preparacion"];

export type ShippingAddressInput = {
  recipient: string;
  street: string;
  city: string;
  postalCode: string;
  region?: string;
  country?: string;
  phone?: string;
};

export type UpdateAddressResult =
  | { ok: true; shippingAddress: Address }
  | { ok: false; code: "not_found" }
  | { ok: false; code: "not_editable"; status: OrderStatus }
  | { ok: false; code: "invalid" };

const ADDR_LIMITS = {
  recipient: 120,
  street: 200,
  city: 80,
  postalCode: 16,
  region: 80,
  country: 56,
  phone: 32,
};

export async function updateOrderShippingAddress(
  orderNumber: string,
  input: ShippingAddressInput,
): Promise<UpdateAddressResult> {
  const sql = getSql();
  const rows = (await sql`
    SELECT status, shipping_address FROM cuenta_orders WHERE number = ${orderNumber} LIMIT 1
  `) as { status: OrderStatus; shipping_address: unknown }[];
  if (!rows[0]) return { ok: false, code: "not_found" };

  const status = rows[0].status;
  if (!ADDRESS_EDITABLE_STATUSES.includes(status)) {
    return { ok: false, code: "not_editable", status };
  }

  const recipient = (input.recipient ?? "").trim();
  const street = (input.street ?? "").trim();
  const city = (input.city ?? "").trim();
  const postalCode = (input.postalCode ?? "").trim();
  const region = (input.region ?? "").trim();
  const country = (input.country ?? "").trim();
  const phone = (input.phone ?? "").trim();

  // Obligatorios.
  if (!recipient || !street || !city || !postalCode) return { ok: false, code: "invalid" };
  // Longitudes razonables.
  if (
    recipient.length > ADDR_LIMITS.recipient ||
    street.length > ADDR_LIMITS.street ||
    city.length > ADDR_LIMITS.city ||
    postalCode.length > ADDR_LIMITS.postalCode ||
    region.length > ADDR_LIMITS.region ||
    country.length > ADDR_LIMITS.country ||
    phone.length > ADDR_LIMITS.phone
  ) {
    return { ok: false, code: "invalid" };
  }

  const existing = asJson<Address>(rows[0].shipping_address);
  const next: Address = {
    ...existing, // preserva id y label
    recipient,
    street,
    city,
    postalCode,
    region: region || existing.region,
    country: country || existing.country,
    phone: phone || undefined,
  };

  await sql`
    UPDATE cuenta_orders
    SET shipping_address = ${JSON.stringify(next)}::jsonb, updated_at = now()
    WHERE number = ${orderNumber}
  `;
  return { ok: true, shippingAddress: next };
}

/* TAREA 2 — ajuste de existencias (product_stock.units). */
export type UpdateStockResult =
  | { ok: true; units: number; lowThreshold: number; outThreshold: number; updatedAt: string }
  | { ok: false; code: "not_found" | "invalid_units" };

/** Fija las unidades de una variedad (PK `variety`). Rechaza no-enteros y
 *  negativos. Sella `updated_at`. */
export async function updateStock(variety: string, units: number): Promise<UpdateStockResult> {
  if (!Number.isInteger(units) || units < 0) return { ok: false, code: "invalid_units" };
  const sql = getSql();
  const rows = (await sql`
    UPDATE product_stock
    SET units = ${units}, updated_at = now()
    WHERE variety = ${variety}
    RETURNING units, low_threshold, out_threshold, updated_at
  `) as { units: number; low_threshold: number; out_threshold: number; updated_at: unknown }[];
  if (!rows[0]) return { ok: false, code: "not_found" };
  return {
    ok: true,
    units: rows[0].units,
    lowThreshold: rows[0].low_threshold,
    outThreshold: rows[0].out_threshold,
    updatedAt: new Date(rows[0].updated_at as string).toISOString(),
  };
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
