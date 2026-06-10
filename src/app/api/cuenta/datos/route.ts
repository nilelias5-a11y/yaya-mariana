import { NextRequest, NextResponse } from "next/server";
import { CUENTA_COOKIE, verifyCuentaSession } from "@/lib/cuenta/auth";
import { getUserById, updateUser } from "@/lib/cuenta/db";
import { hashPassword, verifyPassword } from "@/lib/cuenta/password";
import type { Address } from "@/lib/cuenta/types";

/* FASE B — Editar datos personales del cliente.
 * Campos editables: nombre, teléfono, DNI, direcciones, marketing opt-in y
 * contraseña. El email NO se cambia aquí (requeriría re-verificación;
 * pendiente para cuando exista email real). */

export async function PATCH(req: NextRequest) {
  const session = await verifyCuentaSession(req.cookies.get(CUENTA_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });

  const user = await getUserById(session.sub);
  if (!user) return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const patch: Parameters<typeof updateUser>[1] = {};

  if (typeof body.nombre === "string" && body.nombre.trim().length >= 2) patch.nombre = body.nombre.trim();
  if (typeof body.telefono === "string") patch.telefono = body.telefono.trim();
  if (typeof body.dni === "string") patch.dni = body.dni.trim().toUpperCase();
  if (typeof body.marketingOptIn === "boolean") patch.marketingOptIn = body.marketingOptIn;
  if (Array.isArray(body.addresses)) patch.addresses = body.addresses as Address[];

  // Cambio de contraseña.
  if (typeof body.newPassword === "string" && body.newPassword.length > 0) {
    if (body.newPassword.length < 8) {
      return NextResponse.json({ ok: false, error: "weak_password" }, { status: 400 });
    }
    // Si ya tenía contraseña, exigir la actual.
    if (user.passwordHash) {
      const currentOk = await verifyPassword(String(body.currentPassword ?? ""), user.passwordHash);
      if (!currentOk) {
        return NextResponse.json({ ok: false, error: "wrong_password" }, { status: 400 });
      }
    }
    patch.passwordHash = await hashPassword(body.newPassword);
  }

  await updateUser(user.id, patch);
  return NextResponse.json({ ok: true });
}
