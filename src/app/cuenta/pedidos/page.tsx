import { redirect } from "next/navigation";
import { CuentaShell } from "@/components/cuenta/shell";
import { getCuentaUser } from "@/lib/cuenta/session";
import { getOrdersByUser } from "@/lib/cuenta/db";
import { computeTotals } from "@/lib/cuenta/invoice";
import PedidosList from "./pedidos-list";

export const metadata = {
  title: "Mis pedidos · Mi cuenta",
  robots: { index: false, follow: false },
};

export default async function CuentaPedidosPage() {
  const user = await getCuentaUser();
  if (!user) redirect("/cuenta/login");
  const orders = await getOrdersByUser(user.id);

  // Aplanar a la forma que necesita la tabla (total calculado en servidor).
  const rows = orders.map((o) => ({
    id: o.id,
    number: o.number,
    createdAt: o.createdAt,
    status: o.status,
    total: computeTotals(o).total,
  }));

  return (
    <CuentaShell>
      <PedidosList rows={rows} />
    </CuentaShell>
  );
}
