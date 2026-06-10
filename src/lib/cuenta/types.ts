/* FASE B — Zona de cliente. Tipos de dominio compartidos.
 *
 * Estructura pensada para migrar a PostgreSQL/Neon cuando se conecte Stripe
 * real: los nombres de campo replican lo que serían columnas. Por ahora
 * persisten en JSON (ver db.ts). */

export type OrderStatus =
  | "pagado"
  | "preparacion"
  | "enviado"
  | "entregado"
  | "cancelado";

export type OrderItem = {
  variety: string; // "Mágnum" | "Dream" | "1525"
  name: string; // "Caja fresas Yaya Mariana — Mágnum"
  qty: number;
  unitPrice: number; // PVP por unidad, IVA incluido (€)
  image: string; // ruta en /public
};

export type Address = {
  id: string;
  label: string; // "Casa", "Trabajo"...
  recipient: string;
  street: string;
  city: string;
  postalCode: string;
  region: string;
  country: string;
  phone?: string;
};

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  passwordHash: string | null; // null = cuenta sin contraseña (sólo magic link)
  nombre: string;
  telefono?: string;
  dni?: string; // DNI/NIF para facturas
  addresses: Address[];
  marketingOptIn: boolean;
  createdAt: string; // ISO
};

export type Order = {
  id: string; // slug usado en la URL (= número de pedido en minúsculas)
  number: string; // "YM-2026-0001"
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string; // ISO
  shippingAddress: Address;
  billing: {
    nombre: string;
    dni: string;
    address: Address;
  };
  invoiceNumber: string; // "FCV-2026-0001"
  trackingUrl?: string; // Sendcloud (futuro)
};

/** Forma serializable que se entrega al export RGPD. */
export type UserExport = {
  user: Omit<User, "passwordHash">;
  orders: Order[];
  exportedAt: string;
};
