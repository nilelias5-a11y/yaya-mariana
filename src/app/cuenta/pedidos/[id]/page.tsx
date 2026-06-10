import { notFound, redirect } from "next/navigation";
import { CuentaShell } from "@/components/cuenta/shell";
import { getCuentaUser } from "@/lib/cuenta/session";
import { getOrderById } from "@/lib/cuenta/db";
import PedidoDetalle from "./pedido-detalle";

export const metadata = {
  title: "Detalle del pedido · Mi cuenta",
  robots: { index: false, follow: false },
};

export default async function CuentaPedidoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCuentaUser();
  if (!user) redirect("/cuenta/login");

  const { id } = await params;
  const order = await getOrderById(id);
  // 404 también si no es suyo: no revelar pedidos ajenos.
  if (!order || order.userId !== user.id) notFound();

  return (
    <CuentaShell>
      <PedidoDetalle order={order} />
    </CuentaShell>
  );
}
