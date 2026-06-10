import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

/* FASE A.5 · T2 — Logout del panel /admin.
 *
 * Borra la cookie de sesión (maxAge 0). Al ser un JWT sin estado en
 * servidor, eliminar la cookie httpOnly cierra la sesión en el navegador;
 * el token deja de viajar y el proxy lo rechaza. Redirección 303 → login
 * (funciona como formulario nativo, sin depender de JS). */

export async function POST(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  const res = NextResponse.redirect(url, 303);
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return res;
}
