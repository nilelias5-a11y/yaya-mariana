import "server-only";
import { cookies } from "next/headers";
import { CUENTA_COOKIE, verifyCuentaSession } from "./auth";
import { isSessionRevoked } from "./sessions";
import { getUserById } from "./db";
import type { User } from "./types";

/* FASE B — Helper para server components: devuelve el usuario autenticado
 * de la zona cliente (o null). El proxy ya protege /cuenta, pero las
 * páginas vuelven a resolver el usuario para pintar sus datos.
 *
 * TAREA 2 — aquí (runtime Node) es donde se aplica la REVOCACIÓN de sesión:
 * si el `jti` está marcado en cuenta_sessions, se trata como no autenticado
 * aunque el JWT siga firmado y vigente. Fail-open si la tabla no existe. */

export async function getCuentaUser(): Promise<User | null> {
  const store = await cookies();
  const session = await verifyCuentaSession(store.get(CUENTA_COOKIE)?.value);
  if (!session) return null;
  if (await isSessionRevoked(session.jti)) return null;
  return getUserById(session.sub);
}
