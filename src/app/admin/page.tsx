import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import AdminDashboard from "./admin-dashboard";

export const metadata = {
  title: "Panel · Yaya Mariana",
  robots: { index: false, follow: false },
};

/* Panel interno (T6 → ampliado en FASE A.5/T2). DATOS MOCK: pedidos, stock
   por variedad y estados. El layout (sidebar, header con saludo + hora,
   métricas, filtros, alertas) vive en admin-dashboard.tsx (client).
   Aquí sólo se lee el usuario de la sesión para el saludo. */
export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  const adminUser = session?.sub ?? "admin";

  return <AdminDashboard adminUser={adminUser} />;
}
