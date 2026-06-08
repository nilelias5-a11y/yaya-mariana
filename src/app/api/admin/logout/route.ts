import { NextRequest, NextResponse } from "next/server";

/* Logout del panel /admin (T6) — borra la cookie de sesión y vuelve al
   login. POST de formulario nativo + redirección 303. */
const SESSION_COOKIE = "admin_session";

export async function POST(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  const res = NextResponse.redirect(url, 303);
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
