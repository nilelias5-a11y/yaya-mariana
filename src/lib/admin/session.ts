import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "@/lib/auth";

/* Panel /admin · gestión — guard de sesión para los route handlers.
 *
 * Las rutas /api/admin/* NO pasan por el proxy (su matcher sólo cubre /admin
 * y /cuenta), así que cada endpoint de gestión verifica el JWT por su cuenta,
 * con el MISMO mecanismo que el login (cookie httpOnly `admin_session`, firma
 * HS256, 8h). Sin sesión válida → el handler responde 401. */
export async function requireAdmin(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}
