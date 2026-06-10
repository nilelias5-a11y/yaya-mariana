import "server-only";
import { cookies } from "next/headers";
import { CUENTA_COOKIE, verifyCuentaSession } from "./auth";
import { getUserById } from "./db";
import type { User } from "./types";

/* FASE B — Helper para server components: devuelve el usuario autenticado
 * de la zona cliente (o null). El proxy ya protege /cuenta, pero las
 * páginas vuelven a resolver el usuario para pintar sus datos. */

export async function getCuentaUser(): Promise<User | null> {
  const store = await cookies();
  const session = await verifyCuentaSession(store.get(CUENTA_COOKIE)?.value);
  if (!session) return null;
  return getUserById(session.sub);
}
