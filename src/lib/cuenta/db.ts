import "server-only";
import { getSql } from "./sql";
import type { User, Order, Address, OrderItem, OrderStatus } from "./types";

/* FASE B (migración a Neon) — capa de datos de la zona cliente sobre
 * PostgreSQL (Neon). Sustituye al mock en JSON manteniendo EXACTAMENTE la
 * misma interfaz pública, de modo que el resto del código (rutas API,
 * server components) no cambia.
 *
 * Tablas: cuenta_users · cuenta_orders · cuenta_invoices (ver
 * scripts/migrate-neon.ts). Direcciones, items, dirección de envío y
 * facturación se guardan como JSONB (replican los tipos de types.ts).
 *
 * Predecesor: implementación en JSON (data/cuenta/*.json). Para volver a
 * ella temporalmente, revertir el commit de migración (ver README-CUENTA.md
 * §Rollback). */

/* Log de depuración SOLO en desarrollo: no aparece en producción (evita ruido
 * y no filtra ids/emails en los logs de prod). Los console.error/warn de
 * errores se mantienen siempre. */
function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV !== "production") console.log(...args);
}

// ---- helpers de mapeo (snake_case fila → camelCase tipo) -------------------

/** JSONB llega ya parseado por el driver; si llega como texto, lo parseamos. */
function asJson<T>(v: unknown): T {
  return (typeof v === "string" ? JSON.parse(v) : v) as T;
}

/** timestamptz puede llegar como Date o string → ISO normalizado. */
function asIso(v: unknown): string {
  return new Date(v as string).toISOString();
}

type UserRow = {
  id: string;
  email: string;
  email_verified: boolean;
  password_hash: string | null;
  nombre: string;
  telefono: string | null;
  dni: string | null;
  addresses: unknown;
  marketing_opt_in: boolean;
  created_at: unknown;
};

function rowToUser(r: UserRow): User {
  return {
    id: r.id,
    email: r.email,
    emailVerified: r.email_verified,
    passwordHash: r.password_hash,
    nombre: r.nombre,
    telefono: r.telefono ?? undefined,
    dni: r.dni ?? undefined,
    addresses: asJson<Address[]>(r.addresses) ?? [],
    marketingOptIn: r.marketing_opt_in,
    createdAt: asIso(r.created_at),
  };
}

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
  tracking_carrier: string | null;
  tracking_number: string | null;
  tracking_note: string | null;
};

function rowToOrder(r: OrderRow): Order {
  return {
    id: r.id,
    number: r.number,
    userId: r.user_id,
    items: asJson<OrderItem[]>(r.items),
    status: r.status as OrderStatus,
    createdAt: asIso(r.created_at),
    shippingAddress: asJson<Address>(r.shipping_address),
    billing: asJson<Order["billing"]>(r.billing),
    invoiceNumber: r.invoice_number,
    trackingUrl: r.tracking_url ?? undefined,
    trackingCarrier: r.tracking_carrier ?? undefined,
    trackingNumber: r.tracking_number ?? undefined,
    trackingNote: r.tracking_note ?? undefined,
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ---- usuarios --------------------------------------------------------------

export async function getUserByEmail(email: string): Promise<User | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM cuenta_users WHERE email = ${normalizeEmail(email)} LIMIT 1
  `) as UserRow[];
  return rows[0] ? rowToUser(rows[0]) : null;
}

export async function getUserById(id: string): Promise<User | null> {
  const sql = getSql();
  const rows = (await sql`SELECT * FROM cuenta_users WHERE id = ${id} LIMIT 1`) as UserRow[];
  return rows[0] ? rowToUser(rows[0]) : null;
}

export async function createUser(
  data: Pick<User, "email" | "nombre"> & Partial<User>,
): Promise<User> {
  const sql = getSql();
  const email = normalizeEmail(data.email);

  const existing = (await sql`SELECT 1 FROM cuenta_users WHERE email = ${email} LIMIT 1`) as unknown[];
  if (existing.length > 0) throw new Error("EMAIL_TAKEN");

  const id = `usr_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
  const addresses = JSON.stringify(data.addresses ?? []);

  const rows = (await sql`
    INSERT INTO cuenta_users
      (id, email, email_verified, password_hash, nombre, telefono, dni, addresses, marketing_opt_in)
    VALUES
      (${id}, ${email}, ${data.emailVerified ?? false}, ${data.passwordHash ?? null},
       ${data.nombre}, ${data.telefono ?? null}, ${data.dni ?? null}, ${addresses}::jsonb,
       ${data.marketingOptIn ?? false})
    RETURNING *
  `) as UserRow[];

  devLog(`[db:neon] createUser id=${id} email=${email}`);
  return rowToUser(rows[0]);
}

export async function updateUser(
  id: string,
  patch: Partial<Omit<User, "id" | "email" | "createdAt">>,
): Promise<User | null> {
  const sql = getSql();
  const current = await getUserById(id);
  if (!current) return null;

  // Read-modify-write: fusionamos en JS y reescribimos las columnas mutables.
  const next: User = { ...current, ...patch };
  const rows = (await sql`
    UPDATE cuenta_users SET
      email_verified = ${next.emailVerified},
      password_hash = ${next.passwordHash},
      nombre = ${next.nombre},
      telefono = ${next.telefono ?? null},
      dni = ${next.dni ?? null},
      addresses = ${JSON.stringify(next.addresses ?? [])}::jsonb,
      marketing_opt_in = ${next.marketingOptIn}
    WHERE id = ${id}
    RETURNING *
  `) as UserRow[];

  devLog(`[db:neon] updateUser id=${id}`);
  return rows[0] ? rowToUser(rows[0]) : null;
}

export async function deleteUser(id: string): Promise<void> {
  const sql = getSql();
  // ON DELETE CASCADE elimina también pedidos y facturas del usuario.
  await sql`DELETE FROM cuenta_users WHERE id = ${id}`;
  devLog(`[db:neon] deleteUser id=${id}`);
}

// ---- pedidos ---------------------------------------------------------------

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM cuenta_orders WHERE user_id = ${userId} ORDER BY created_at DESC
  `) as OrderRow[];
  return rows.map(rowToOrder);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const sql = getSql();
  const rows = (await sql`SELECT * FROM cuenta_orders WHERE id = ${orderId} LIMIT 1`) as OrderRow[];
  return rows[0] ? rowToOrder(rows[0]) : null;
}

// ---- facturas (caché del PDF en BD) ---------------------------------------

/** Devuelve el PDF cacheado (si existe) para una factura. */
export async function getInvoicePdf(invoiceNumber: string): Promise<Uint8Array | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT pdf FROM cuenta_invoices WHERE invoice_number = ${invoiceNumber} LIMIT 1
  `) as { pdf: string | null }[];
  const b64 = rows[0]?.pdf;
  return b64 ? new Uint8Array(Buffer.from(b64, "base64")) : null;
}

/** Guarda (cachea) el PDF generado de una factura. */
export async function saveInvoicePdf(invoiceNumber: string, pdf: Uint8Array): Promise<void> {
  const sql = getSql();
  const b64 = Buffer.from(pdf).toString("base64");
  await sql`
    UPDATE cuenta_invoices
    SET pdf = ${b64}, pdf_generated_at = now()
    WHERE invoice_number = ${invoiceNumber}
  `;
  devLog(`[db:neon] saveInvoicePdf ${invoiceNumber} (${pdf.length} bytes)`);
}
