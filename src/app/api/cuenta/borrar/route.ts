import { NextRequest, NextResponse } from "next/server";
import { CUENTA_COOKIE, verifyCuentaSession, cuentaCookieOptions } from "@/lib/cuenta/auth";
import { deleteUser } from "@/lib/cuenta/db";

/* FASE B — Borrar cuenta (RGPD, derecho de supresión).
 * Elimina el usuario y todos sus pedidos del mock, y cierra la sesión. */

export async function POST(req: NextRequest) {
  const session = await verifyCuentaSession(req.cookies.get(CUENTA_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });

  await deleteUser(session.sub);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUENTA_COOKIE, "", cuentaCookieOptions(0));
  return res;
}
