import { NextRequest, NextResponse } from "next/server";

/* Login del panel /admin (T6). Valida las credenciales contra
   ADMIN_USER / ADMIN_PASS (env, placeholder) y, si son correctas, emite
   una cookie de sesión httpOnly. Recibe un POST de formulario nativo
   (funciona sin JS) y responde con redirección 303 → GET. */
const SESSION_COOKIE = "admin_session";
const EIGHT_HOURS = 60 * 60 * 8;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const user = String(form.get("user") ?? "");
  const pass = String(form.get("pass") ?? "");

  const okUser = process.env.ADMIN_USER ?? "";
  const okPass = process.env.ADMIN_PASS ?? "";
  const url = req.nextUrl.clone();

  const valid = okUser !== "" && okPass !== "" && user === okUser && pass === okPass;

  if (!valid) {
    url.pathname = "/admin/login";
    url.search = "?error=1";
    return NextResponse.redirect(url, 303);
  }

  url.pathname = "/admin";
  url.search = "";
  const res = NextResponse.redirect(url, 303);
  res.cookies.set(SESSION_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: EIGHT_HOURS,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
