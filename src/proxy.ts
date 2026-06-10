import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  verifySessionToken,
  sessionCookieOptions,
} from "@/lib/auth";

/* FASE A.5 · T2 — Protección del panel /admin con JWT firmado.
 *
 * (Next 16 renombró la convención `middleware` → `proxy`.)
 *
 * - Verifica el JWT de la cookie `admin_session` (firma + expiración) con
 *   `jose`, compatible con el runtime Edge.
 * - Sesión inválida/expirada → redirige al login.
 * - Sesión válida visitando el login → redirige al panel.
 * - Renovación deslizante: en cada visita autenticada al panel se re-emite
 *   un token nuevo (8h), de modo que la sesión sólo expira tras 8h de
 *   inactividad. */

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    if (session) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    const res = NextResponse.redirect(url);
    // Limpia cualquier cookie caducada/manipulada que siga presente.
    if (token) res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
    return res;
  }

  // Sesión válida → renovación deslizante (sliding expiration).
  const res = NextResponse.next();
  const refreshed = await createSessionToken(session.sub);
  res.cookies.set(SESSION_COOKIE, refreshed, sessionCookieOptions(SESSION_TTL_SECONDS));
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
