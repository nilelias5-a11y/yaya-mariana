import { NextRequest, NextResponse } from "next/server";
import { CUENTA_COOKIE, cuentaCookieOptions, verifyCuentaSession } from "@/lib/cuenta/auth";
import { revokeSession } from "@/lib/cuenta/sessions";

/* FASE B — Logout de cliente. Borra la cookie de sesión y vuelve al login.
 * POST de formulario nativo + redirección 303 (funciona sin JS).
 *
 * TAREA 2 — revocación real: además de borrar la cookie, marca el `jti` de
 * la sesión como revocado en cuenta_sessions, de modo que un token ya
 * emitido (incluso copiado) deje de dar acceso aunque siga sin expirar. */
export async function POST(req: NextRequest) {
  const token = req.cookies.get(CUENTA_COOKIE)?.value;
  const session = await verifyCuentaSession(token);
  if (session?.jti) await revokeSession(session.jti);

  const url = req.nextUrl.clone();
  url.pathname = "/cuenta/login";
  url.search = "";
  const res = NextResponse.redirect(url, 303);
  res.cookies.set(CUENTA_COOKIE, "", cuentaCookieOptions(0));
  return res;
}
