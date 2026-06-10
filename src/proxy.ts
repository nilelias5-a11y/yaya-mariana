import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  verifySessionToken,
  sessionCookieOptions,
} from "@/lib/auth";
import {
  CUENTA_COOKIE,
  CUENTA_TTL_SECONDS,
  createCuentaSession,
  verifyCuentaSession,
  cuentaCookieOptions,
} from "@/lib/cuenta/auth";

/* Protección de zonas privadas con JWT firmado (jose, runtime Edge).
 *
 * (Next 16 renombró la convención `middleware` → `proxy`.)
 *
 * Dos zonas AISLADAS, cada una con su cookie y su secreto:
 * - /admin  → equipo interno (FASE A.5 · T2), cookie `admin_session`, 8h.
 * - /cuenta → cliente final (FASE B), cookie `cuenta_session`, 30 días.
 *
 * En ambas: verifica firma+expiración, redirige al login si no hay sesión,
 * redirige al panel si se visita el login ya autenticado, y aplica
 * renovación deslizante en cada visita autenticada. */

// Rutas de /cuenta accesibles sin sesión.
const CUENTA_PUBLIC = new Set(["/cuenta/login", "/cuenta/registro", "/cuenta/recuperar"]);

async function handleAdmin(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    if (session) return redirectTo(req, "/admin");
    return NextResponse.next();
  }
  if (!session) {
    const res = redirectTo(req, "/admin/login");
    if (token) res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
    return res;
  }
  const res = NextResponse.next();
  res.cookies.set(SESSION_COOKIE, await createSessionToken(session.sub), sessionCookieOptions(SESSION_TTL_SECONDS));
  return res;
}

async function handleCuenta(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(CUENTA_COOKIE)?.value;
  const session = await verifyCuentaSession(token);
  const isPublic = CUENTA_PUBLIC.has(pathname);

  if (isPublic) {
    if (session) return redirectTo(req, "/cuenta");
    return NextResponse.next();
  }
  if (!session) {
    const res = redirectTo(req, "/cuenta/login");
    if (token) res.cookies.set(CUENTA_COOKIE, "", cuentaCookieOptions(0));
    return res;
  }
  const res = NextResponse.next();
  res.cookies.set(
    CUENTA_COOKIE,
    await createCuentaSession(session.sub, session.email),
    cuentaCookieOptions(CUENTA_TTL_SECONDS),
  );
  return res;
}

function redirectTo(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) return handleAdmin(req);
  if (req.nextUrl.pathname.startsWith("/cuenta")) return handleCuenta(req);
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/cuenta", "/cuenta/:path*"],
};
