import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getAdminOrders, getAdminStock } from "@/lib/admin/db";
import AdminDashboard from "./admin-dashboard";

export const metadata = {
  title: "Panel · Yaya Mariana",
  robots: { index: false, follow: false },
};

/* Panel interno (T6 → ampliado en FASE A.5/T2 → TAREA 1: datos REALES).
   Los pedidos (cuenta_orders) y el stock (product_stock) se leen de Neon
   aquí, en el server component, y se pasan al dashboard (client) ya
   resueltos. El layout (sidebar, header con saludo + hora, métricas,
   filtros, alertas) vive en admin-dashboard.tsx. */
export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const adminUser = session?.sub ?? "admin";

  const [orders, stock] = await Promise.all([getAdminOrders(), getAdminStock()]);

  return <AdminDashboard adminUser={adminUser} orders={orders} stock={stock} />;
}
