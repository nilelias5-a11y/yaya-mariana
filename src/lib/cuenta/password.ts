import "server-only";
import bcrypt from "bcryptjs";

/* FASE B — Hashing de contraseñas del cliente. Runtime Node (bcrypt).
 * Separado de auth.ts para que el proxy (Edge) nunca importe bcrypt. */

// Hash dummy del mismo coste: se compara siempre aunque el usuario no
// exista o no tenga contraseña, para no revelar cuentas por temporización.
const DUMMY_HASH = "$2b$12$.....................................dummyDummyDummyD";

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export function verifyPassword(plain: string, hash: string | null): Promise<boolean> {
  return bcrypt.compare(plain, hash ?? DUMMY_HASH);
}
