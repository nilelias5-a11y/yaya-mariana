import { NextRequest, NextResponse } from "next/server";

/* Protección básica del panel /admin (T6) — sin OAuth.
 *
 * Comprueba la cookie de sesión `admin_session` (la emite /api/admin/login
 * tras validar ADMIN_USER / ADMIN_PASS). Sin sesión → redirige al login.
 * Si ya hay sesión y se visita el login, redirige al panel.
 *
 * Es deliberadamente sencillo: preparado para endurecerse (token firmado /
 * NextAuth) cuando se conecte Stripe real. */
const SESSION_COOKIE = "admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get(SESSION_COOKIE)?.value;
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
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
