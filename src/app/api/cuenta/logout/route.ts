import { NextRequest, NextResponse } from "next/server";
import { CUENTA_COOKIE, cuentaCookieOptions } from "@/lib/cuenta/auth";

/* FASE B — Logout de cliente. Borra la cookie de sesión y vuelve al login.
 * POST de formulario nativo + redirección 303 (funciona sin JS). */
export async function POST(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/cuenta/login";
  url.search = "";
  const res = NextResponse.redirect(url, 303);
  res.cookies.set(CUENTA_COOKIE, "", cuentaCookieOptions(0));
  return res;
}
