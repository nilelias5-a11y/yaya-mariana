import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { User, Order } from "./types";
import { SEED_USERS, SEED_ORDERS } from "./seed";

/* FASE B — Mock DB de la zona cliente (JSON en disco).
 *
 * Patrón idéntico en espíritu al panel admin: datos mock con estructura
 * lista para migrar a PostgreSQL/Neon al conectar Stripe. NO usar en
 * runtime Edge (usa `node:fs`); sólo route handlers / server components.
 *
 * Los ficheros viven en `data/cuenta/` (gitignored). Si no existen, se
 * siembran desde seed.ts en el primer acceso. Las escrituras (registro,
 * edición de perfil, borrado) mutan esos ficheros locales. */

const DATA_DIR = path.join(process.cwd(), "data", "cuenta");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function readJSON<T>(file: string, seed: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(file, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

async function writeJSON<T>(file: string, data: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

const readUsers = () => readJSON<User[]>(USERS_FILE, SEED_USERS);
const readOrders = () => readJSON<Order[]>(ORDERS_FILE, SEED_ORDERS);

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await readUsers();
  const target = normalizeEmail(email);
  return users.find((u) => u.email.toLowerCase() === target) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await readUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function createUser(
  data: Pick<User, "email" | "nombre"> & Partial<User>,
): Promise<User> {
  const users = await readUsers();
  const email = normalizeEmail(data.email);
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("EMAIL_TAKEN");
  }
  const user: User = {
    id: `usr_${Date.now().toString(36)}_${users.length + 1}`,
    email,
    emailVerified: data.emailVerified ?? false,
    passwordHash: data.passwordHash ?? null,
    nombre: data.nombre,
    telefono: data.telefono,
    dni: data.dni,
    addresses: data.addresses ?? [],
    marketingOptIn: data.marketingOptIn ?? false,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeJSON(USERS_FILE, users);
  return user;
}

export async function updateUser(
  id: string,
  patch: Partial<Omit<User, "id" | "email" | "createdAt">>,
): Promise<User | null> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  await writeJSON(USERS_FILE, users);
  return users[idx];
}

export async function deleteUser(id: string): Promise<void> {
  const users = await readUsers();
  await writeJSON(USERS_FILE, users.filter((u) => u.id !== id));
  const orders = await readOrders();
  await writeJSON(ORDERS_FILE, orders.filter((o) => o.userId !== id));
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const orders = await readOrders();
  return orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const orders = await readOrders();
  return orders.find((o) => o.id === orderId) ?? null;
}
