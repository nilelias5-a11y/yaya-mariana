import LoginForm from "./login-form";

export const metadata = {
  title: "Acceder · Mi cuenta",
  robots: { index: false, follow: false },
};

/* FASE B — Acceso de cliente. Server component sólo para metadata noindex
   y para leer el error del magic link; el formulario es client. */
export default async function CuentaLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return <LoginForm magicError={error === "magic"} />;
}
