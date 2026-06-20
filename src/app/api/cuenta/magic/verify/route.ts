import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, updateUser } from "@/lib/cuenta/db";
import {
  verifyMagicToken,
  createCuentaSession,
  newSessionId,
  CUENTA_COOKIE,
  CUENTA_TTL_SECONDS,
  cuentaCookieOptions,
} from "@/lib/cuenta/auth";
import { recordSession } from "@/lib/cuenta/sessions";

/* FASE B — Verificación de magic link. GET ?token=...
 * Si el token es válido (15 min), marca el email como verificado, emite la
 * sesión de cliente y redirige a /cuenta. Si no, vuelve al login con error. */

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? undefined;
  const magic = await verifyMagicToken(token);

  const loginUrl = req.nextUrl.clone();
  loginUrl.search = "";

  if (!magic) {
    loginUrl.pathname = "/cuenta/login";
    loginUrl.searchParams.set("error", "magic");
    return NextResponse.redirect(loginUrl, 303);
  }

  const user = await getUserByEmail(magic.email);
  if (!user) {
    loginUrl.pathname = "/cuenta/login";
    loginUrl.searchParams.set("error", "magic");
    return NextResponse.redirect(loginUrl, 303);
  }

  if (!user.emailVerified) await updateUser(user.id, { emailVerified: true });

  const jti = newSessionId();
  await recordSession(jti, user.id, CUENTA_TTL_SECONDS);
  const sessionToken = await createCuentaSession(user.id, user.email, jti);
  const dest = req.nextUrl.clone();
  dest.pathname = "/cuenta";
  dest.search = "";
  const res = NextResponse.redirect(dest, 303);
  res.cookies.set(CUENTA_COOKIE, sessionToken, cuentaCookieOptions(CUENTA_TTL_SECONDS));
  return res;
}
