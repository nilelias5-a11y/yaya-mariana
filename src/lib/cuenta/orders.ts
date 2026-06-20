import "server-only";
import { getSql } from "./sql";
import { getUserByEmail, createUser } from "./db";
import type { Order, OrderItem, Address, OrderStatus } from "./types";

/* TAREA 3/4 — Creación de pedido tras un pago. Fuente ÚNICA usada tanto por
 * el endpoint de checkout (/api/checkout/complete) como por el webhook de
 * Stripe (/api/stripe/webhook), para que ambos converjan en el mismo pedido.
 *
 * Propiedades clave:
 * - IDEMPOTENTE por `payment_ref` (id del PaymentIntent): si ya existe un
 *   pedido para ese pago, lo devuelve sin duplicar. Así el endpoint y el
 *   webhook pueden dispararse ambos sin crear dos pedidos.
 * - AUTO-REGISTRO: si el email no tiene cuenta, la crea (sin contraseña,
 *   email sin verificar) para que el cliente pueda ver el pedido en /cuenta.
 * - Asigna nº correlativo YM-AAAA-NNNN + factura FCV-AAAA-NNNN y crea su
 *   fila en cuenta_invoices (el PDF se genera/cachea bajo demanda). */

export type CreateOrderInput = {
  email: string;
  nombre: string;
  dni?: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentRef?: string;
  status?: OrderStatus; // por defecto "pagado"
};

export type CreateOrderResult = {
  order: Order;
  created: boolean; // false si era idempotente (ya existía)
  userCreated: boolean; // true si se auto-registró el usuario
};

type OrderRow = {
  id: string;
  number: string;
  user_id: string;
  items: unknown;
  status: string;
  created_at: unknown;
  shipping_address: unknown;
  billing: unknown;
  invoice_number: string;
  tracking_url: string | null;
};

function asJson<T>(v: unknown): T {
  return (typeof v === "string" ? JSON.parse(v) : v) as T;
}

function rowToOrder(r: OrderRow): Order {
  return {
    id: r.id,
    number: r.number,
    userId: r.user_id,
    items: asJson<OrderItem[]>(r.items),
    status: r.status as OrderStatus,
    createdAt: new Date(r.created_at as string).toISOString(),
    shippingAddress: asJson<Address>(r.shipping_address),
    billing: asJson<Order["billing"]>(r.billing),
    invoiceNumber: r.invoice_number,
    trackingUrl: r.tracking_url ?? undefined,
  };
}

function pad4(n: number): string {
  return String(n).padStart(4, "0");
}

/** Mayor correlativo ya usado para el año (a partir del nº de pedido). */
async function maxSeqForYear(year: number): Promise<number> {
  const sql = getSql();
  const rows = (await sql`
    SELECT number FROM cuenta_orders WHERE number LIKE ${`YM-${year}-%`}
  `) as { number: string }[];
  let max = 0;
  for (const r of rows) {
    const m = /-(\d+)$/.exec(r.number);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return max;
}

async function findByPaymentRef(paymentRef: string): Promise<Order | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM cuenta_orders WHERE payment_ref = ${paymentRef} LIMIT 1
  `) as OrderRow[];
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function createOrderFromPayment(input: CreateOrderInput): Promise<CreateOrderResult> {
  const sql = getSql();
  const status = input.status ?? "pagado";

  // 1) Idempotencia: ¿ya existe un pedido para este pago?
  if (input.paymentRef) {
    const existing = await findByPaymentRef(input.paymentRef);
    if (existing) return { order: existing, created: false, userCreated: false };
  }

  // 2) Usuario: buscar o auto-registrar.
  let user = await getUserByEmail(input.email);
  let userCreated = false;
  if (!user) {
    user = await createUser({
      email: input.email,
      nombre: input.nombre,
      dni: input.dni,
      passwordHash: null,
      emailVerified: false,
      addresses: [input.shippingAddress],
    });
    userCreated = true;
  }

  const billing: Order["billing"] = {
    nombre: input.nombre,
    dni: input.dni ?? "",
    address: input.shippingAddress,
  };
  const year = new Date().getFullYear();

  // 3) Asignar correlativo + insertar. Reintenta ante colisión de id
  //    (carrera por el mismo nº) y resuelve a idempotente ante colisión de
  //    payment_ref (índice único parcial).
  const base = await maxSeqForYear(year);
  for (let attempt = 1; attempt <= 5; attempt++) {
    const seq = base + attempt;
    const number = `YM-${year}-${pad4(seq)}`;
    const id = number.toLowerCase();
    const invoiceNumber = `FCV-${year}-${pad4(seq)}`;
    const createdAt = new Date().toISOString();
    try {
      const rows = (await sql`
        INSERT INTO cuenta_orders
          (id, number, user_id, items, status, created_at, shipping_address, billing, invoice_number, tracking_url, payment_ref)
        VALUES
          (${id}, ${number}, ${user.id}, ${JSON.stringify(input.items)}::jsonb, ${status},
           ${createdAt}::timestamptz, ${JSON.stringify(input.shippingAddress)}::jsonb,
           ${JSON.stringify(billing)}::jsonb, ${invoiceNumber}, ${null}, ${input.paymentRef ?? null})
        RETURNING *
      `) as OrderRow[];
      await sql`
        INSERT INTO cuenta_invoices (invoice_number, order_id, issued_at)
        VALUES (${invoiceNumber}, ${id}, ${createdAt}::timestamptz)
        ON CONFLICT (invoice_number) DO NOTHING
      `;
      console.log(`[orders] creado ${number} (user=${user.id}, pago=${input.paymentRef ?? "—"})`);
      return { order: rowToOrder(rows[0]), created: true, userCreated };
    } catch (e) {
      const msg = (e as Error).message ?? "";
      // Colisión por pago concurrente → devolver el pedido ya creado.
      if (input.paymentRef && /payment_ref/.test(msg)) {
        const existing = await findByPaymentRef(input.paymentRef);
        if (existing) return { order: existing, created: false, userCreated };
      }
      // Colisión por id/nº correlativo → reintentar con el siguiente.
      if (/duplicate key|already exists|cuenta_orders_pkey/i.test(msg) && attempt < 5) continue;
      throw e;
    }
  }
  throw new Error("No se pudo asignar número de pedido tras varios intentos");
}

/** Construye una dirección de envío a partir de campos sueltos del checkout. */
export function buildShippingAddress(fields: {
  recipient: string;
  street: string;
  city: string;
  postalCode: string;
  region?: string;
  country?: string;
  phone?: string;
}): Address {
  return {
    id: `addr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    label: "Envío",
    recipient: fields.recipient,
    street: fields.street,
    city: fields.city,
    postalCode: fields.postalCode,
    region: fields.region || fields.city,
    country: fields.country || "España",
    phone: fields.phone,
  };
}
