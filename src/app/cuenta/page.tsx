import { redirect } from "next/navigation";
import { CuentaShell } from "@/components/cuenta/shell";
import { getCuentaUser } from "@/lib/cuenta/session";
import { getOrdersByUser } from "@/lib/cuenta/db";
import CuentaHome from "./cuenta-home";

export const metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

/* FASE B — Inicio de la zona cliente. El proxy ya exige sesión; aquí se
   resuelve el usuario y sus pedidos para pintar el panel. */
export default async function CuentaPage() {
  const user = await getCuentaUser();
  if (!user) redirect("/cuenta/login");
  const orders = await getOrdersByUser(user.id);

  return (
    <CuentaShell>
      <CuentaHome nombre={user.nombre} orders={orders} />
    </CuentaShell>
  );
}
