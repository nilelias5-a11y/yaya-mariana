import { redirect } from "next/navigation";
import { CuentaShell } from "@/components/cuenta/shell";
import { getCuentaUser } from "@/lib/cuenta/session";
import DatosForm from "./datos-form";

export const metadata = {
  title: "Mis datos · Mi cuenta",
  robots: { index: false, follow: false },
};

export default async function CuentaDatosPage() {
  const user = await getCuentaUser();
  if (!user) redirect("/cuenta/login");

  return (
    <CuentaShell>
      <DatosForm
        initial={{
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono ?? "",
          dni: user.dni ?? "",
          addresses: user.addresses,
          marketingOptIn: user.marketingOptIn,
          hasPassword: user.passwordHash !== null,
        }}
      />
    </CuentaShell>
  );
}
