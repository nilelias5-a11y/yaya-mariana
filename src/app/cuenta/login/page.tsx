import LoginForm from "./login-form";

export const metadata = {
  title: "Acceder · Mi cuenta",
  robots: { index: false, follow: false },
};

/* Sanea el destino post-login: SÓLO rutas internas relativas. Rechaza
   absolutas y protocol-relative ("//evil.com", "/\\evil.com") para evitar
   open-redirect. Por defecto, el panel de cuenta. */
function safeRedirect(raw: string | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return "/cuenta";
  }
  return raw;
}

/* FASE B — Acceso de cliente. Server component sólo para metadata noindex
   y para leer el error del magic link; el formulario es client.
   T4 — admite ?redirect= (p. ej. desde el checkout) para volver tras login. */
export default async function CuentaLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const { error, redirect } = await searchParams;
  return <LoginForm magicError={error === "magic"} redirectTo={safeRedirect(redirect)} />;
}
