import { NextRequest, NextResponse } from "next/server";
import { CUENTA_COOKIE, verifyCuentaSession } from "@/lib/cuenta/auth";
import { getUserById, getOrdersByUser } from "@/lib/cuenta/db";
import type { UserExport } from "@/lib/cuenta/types";

/* FASE B — Exportar datos personales (RGPD, derecho de portabilidad).
 * Descarga un JSON con el usuario (sin el hash de contraseña) y sus pedidos. */

export async function GET(req: NextRequest) {
  const session = await verifyCuentaSession(req.cookies.get(CUENTA_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });

  const user = await getUserById(session.sub);
  if (!user) return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });

  const orders = await getOrdersByUser(user.id);
  const { passwordHash: _omit, ...safeUser } = user;
  void _omit;

  const payload: UserExport = {
    user: safeUser,
    orders,
    exportedAt: new Date().toISOString(),
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="yaya-mariana-datos-${user.id}.json"`,
    },
  });
}
