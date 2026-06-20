import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, getOrdersByUser } from "@/lib/cuenta/db";
import { verifyPassword } from "@/lib/cuenta/password";
import { createCuentaSession, newSessionId, CUENTA_COOKIE, CUENTA_TTL_SECONDS, cuentaCookieOptions } from "@/lib/cuenta/auth";
import { recordSession } from "@/lib/cuenta/sessions";

/* FASE B — Login de cliente. Dos modos:
 *  - { email, password }            → contraseña permanente.
 *  - { email, orderNumber }         → invitado, acceso por nº de pedido.
 * Error genérico, sin enumeración de usuarios. */

export async function POST(req: NextRequest) {
  let email = "";
  let password = "";
  let orderNumber = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
    password = String(body?.password ?? "");
    orderNumber = String(body?.orderNumber ?? "").trim();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const user = await getUserByEmail(email);

  let valid = false;
  if (orderNumber) {
    // Acceso invitado: el email debe corresponder a un pedido con ese número.
    if (user) {
      const orders = await getOrdersByUser(user.id);
      valid = orders.some((o) => o.number.toLowerCase() === orderNumber.toLowerCase());
    }
  } else {
    // Comparar siempre (hash real o dummy) → tiempo constante.
    const passOk = await verifyPassword(password, user?.passwordHash ?? null);
    valid = Boolean(user && user.passwordHash && passOk);
  }

  if (!valid || !user) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  }

  const jti = newSessionId();
  await recordSession(jti, user.id, CUENTA_TTL_SECONDS);
  const token = await createCuentaSession(user.id, user.email, jti);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUENTA_COOKIE, token, cuentaCookieOptions(CUENTA_TTL_SECONDS));
  return res;
}
