/* FASE B — Migración del mock (JSON) a Neon (PostgreSQL).
 *
 * Idempotente: puede ejecutarse varias veces sin romper ni duplicar.
 * - Crea el esquema (CREATE TABLE IF NOT EXISTS).
 * - Siembra el usuario de prueba + sus pedidos + sus facturas.
 * - Si existen los ficheros JSON locales (data/cuenta/*.json) los toma como
 *   fuente (migra ediciones reales); si no, usa el seed de código.
 * - Conserva los mismos IDs (ym-2026-0001…) para no romper URLs.
 * - INSERT … ON CONFLICT DO NOTHING → re-ejecutar no sobrescribe filas.
 *
 * Uso:  npm run db:migrate     (carga .env.local automáticamente)
 */

import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { promises as fs } from "node:fs";
import path from "node:path";
import { SEED_USERS, SEED_ORDERS } from "../src/lib/cuenta/seed";
import type { User, Order } from "../src/lib/cuenta/types";

loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL ausente en .env.local. Aborto.");
  process.exit(1);
}
const sql = neon(url);

async function createSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS cuenta_users (
      id               TEXT PRIMARY KEY,
      email            TEXT UNIQUE NOT NULL,
      email_verified   BOOLEAN NOT NULL DEFAULT false,
      password_hash    TEXT,
      nombre           TEXT NOT NULL,
      telefono         TEXT,
      dni              TEXT,
      addresses        JSONB NOT NULL DEFAULT '[]'::jsonb,
      marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cuenta_orders (
      id               TEXT PRIMARY KEY,
      number           TEXT NOT NULL,
      user_id          TEXT NOT NULL REFERENCES cuenta_users(id) ON DELETE CASCADE,
      items            JSONB NOT NULL,
      status           TEXT NOT NULL,
      created_at       TIMESTAMPTZ NOT NULL,
      shipping_address JSONB NOT NULL,
      billing          JSONB NOT NULL,
      invoice_number   TEXT NOT NULL,
      tracking_url     TEXT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cuenta_invoices (
      invoice_number   TEXT PRIMARY KEY,
      order_id         TEXT NOT NULL REFERENCES cuenta_orders(id) ON DELETE CASCADE,
      issued_at        TIMESTAMPTZ NOT NULL,
      pdf              TEXT,
      pdf_generated_at TIMESTAMPTZ
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_cuenta_orders_user ON cuenta_orders(user_id)`;

  /* 2ª tanda (TAREA 2) — additive, sin tocar las tablas anteriores.
   *
   * payment_ref: referencia del pago (PaymentIntent de Stripe) para que la
   * creación de pedido sea IDEMPOTENTE (endpoint de checkout + webhook pueden
   * disparar ambos; sólo se crea una vez). Índice único parcial. */
  await sql`ALTER TABLE cuenta_orders ADD COLUMN IF NOT EXISTS payment_ref TEXT`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_cuenta_orders_payment_ref
    ON cuenta_orders(payment_ref) WHERE payment_ref IS NOT NULL
  `;

  /* 3ª tanda (panel /admin gestión) — additive. updated_at: marca la última
   * vez que el panel cambió el estado del pedido (NULL = nunca tocado desde
   * el panel). product_stock ya trae su propio updated_at. */
  await sql`ALTER TABLE cuenta_orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ`;

  // admin_users: migra el admin de env var (ADMIN_PASS_HASH) a tabla (bcrypt).
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id            TEXT PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  // cuenta_sessions: store de sesiones de cliente para REVOCACIÓN real en
  // logout (el JWT por sí solo no se puede invalidar antes de expirar).
  await sql`
    CREATE TABLE IF NOT EXISTS cuenta_sessions (
      jti        TEXT PRIMARY KEY,
      user_id    TEXT NOT NULL REFERENCES cuenta_users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      expires_at TIMESTAMPTZ NOT NULL,
      revoked_at TIMESTAMPTZ
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_cuenta_sessions_user ON cuenta_sessions(user_id)`;

  // product_stock: existencias por variedad + umbrales de alerta del panel.
  await sql`
    CREATE TABLE IF NOT EXISTS product_stock (
      variety       TEXT PRIMARY KEY,
      display_name  TEXT NOT NULL,
      units         INTEGER NOT NULL DEFAULT 0,
      low_threshold INTEGER NOT NULL DEFAULT 20,
      out_threshold INTEGER NOT NULL DEFAULT 5,
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  console.log(
    "✓ Esquema listo (cuenta_users, cuenta_orders, cuenta_invoices, " +
      "admin_users, cuenta_sessions, product_stock)",
  );
}

/** Siembra el admin desde las env vars (ADMIN_USER + ADMIN_PASS_HASH). El
 *  hash ya es bcrypt (nunca texto plano). Idempotente: no sobrescribe. */
async function seedAdmins() {
  const username = process.env.ADMIN_USER;
  const passwordHash = process.env.ADMIN_PASS_HASH;
  if (!username || !passwordHash) {
    console.log("  · admin_users: ADMIN_USER/ADMIN_PASS_HASH ausentes, no se siembra");
    return;
  }
  await sql`
    INSERT INTO admin_users (id, username, password_hash)
    VALUES (${`adm_${username}`}, ${username}, ${passwordHash})
    ON CONFLICT (username) DO NOTHING
  `;
  console.log(`✓ admin_users sembrado (${username}, sin sobrescribir)`);
}

/* Variedades placeholder — stock real lo aportará J. Elías. Los valores
 * iniciales replican el panel previo (48 / 12 / 3) para no alterar la vista. */
const SEED_STOCK = [
  { variety: "Mágnum", display_name: "Fresa Mágnum", units: 48 },
  { variety: "Dream", display_name: "Fresa Dream", units: 12 },
  { variety: "1525", display_name: "Fresa Variedad 1525", units: 3 },
];

async function seedStock() {
  for (const s of SEED_STOCK) {
    await sql`
      INSERT INTO product_stock (variety, display_name, units)
      VALUES (${s.variety}, ${s.display_name}, ${s.units})
      ON CONFLICT (variety) DO NOTHING
    `;
  }
  console.log(`✓ product_stock sembrado (${SEED_STOCK.length} variedades, sin sobrescribir)`);
}

/** Lee un JSON local si existe; si no, devuelve el fallback (seed). */
async function source<T>(file: string, fallback: T[]): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "cuenta", file), "utf8");
    const parsed = JSON.parse(raw) as T[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      console.log(`  · fuente ${file}: JSON local (${parsed.length})`);
      return parsed;
    }
  } catch {
    /* no hay JSON local */
  }
  console.log(`  · fuente ${file}: seed de código (${fallback.length})`);
  return fallback;
}

async function seedUsers(users: User[]) {
  for (const u of users) {
    await sql`
      INSERT INTO cuenta_users
        (id, email, email_verified, password_hash, nombre, telefono, dni, addresses, marketing_opt_in, created_at)
      VALUES
        (${u.id}, ${u.email.toLowerCase()}, ${u.emailVerified}, ${u.passwordHash},
         ${u.nombre}, ${u.telefono ?? null}, ${u.dni ?? null},
         ${JSON.stringify(u.addresses ?? [])}::jsonb, ${u.marketingOptIn}, ${u.createdAt}::timestamptz)
      ON CONFLICT (id) DO NOTHING
    `;
  }
  console.log(`✓ Usuarios sembrados (${users.length}, sin sobrescribir existentes)`);
}

async function seedOrders(orders: Order[]) {
  for (const o of orders) {
    await sql`
      INSERT INTO cuenta_orders
        (id, number, user_id, items, status, created_at, shipping_address, billing, invoice_number, tracking_url)
      VALUES
        (${o.id}, ${o.number}, ${o.userId}, ${JSON.stringify(o.items)}::jsonb, ${o.status},
         ${o.createdAt}::timestamptz, ${JSON.stringify(o.shippingAddress)}::jsonb,
         ${JSON.stringify(o.billing)}::jsonb, ${o.invoiceNumber}, ${o.trackingUrl ?? null})
      ON CONFLICT (id) DO NOTHING
    `;
    await sql`
      INSERT INTO cuenta_invoices (invoice_number, order_id, issued_at)
      VALUES (${o.invoiceNumber}, ${o.id}, ${o.createdAt}::timestamptz)
      ON CONFLICT (invoice_number) DO NOTHING
    `;
  }
  console.log(`✓ Pedidos + facturas sembrados (${orders.length}, sin sobrescribir existentes)`);
}

async function main() {
  console.log("→ Migración a Neon iniciada…");
  await createSchema();
  const users = await source<User>("users.json", SEED_USERS);
  const orders = await source<Order>("orders.json", SEED_ORDERS);
  await seedUsers(users);
  await seedOrders(orders);
  await seedAdmins();
  await seedStock();

  const [{ count: nUsers }] = (await sql`SELECT count(*)::int AS count FROM cuenta_users`) as { count: number }[];
  const [{ count: nOrders }] = (await sql`SELECT count(*)::int AS count FROM cuenta_orders`) as { count: number }[];
  console.log(`✓ Migración completa. Total en BD: ${nUsers} usuarios, ${nOrders} pedidos.`);
}

main().catch((e) => {
  console.error("✗ Migración fallida:", e);
  process.exit(1);
});
