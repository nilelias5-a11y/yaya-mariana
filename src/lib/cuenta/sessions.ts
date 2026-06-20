import "server-only";
import { getSql } from "./sql";

/* TAREA 2 — Store de sesiones de cliente para REVOCACIÓN real.
 *
 * El JWT de sesión (cookie `cuenta_session`) no se puede invalidar por sí
 * solo antes de expirar: borrar la cookie sólo afecta al navegador, no a un
 * token copiado. Para revocar de verdad (logout, robo) registramos cada
 * sesión por su `jti` y comprobamos su estado al resolver el usuario.
 *
 * Diseño deliberado:
 * - La comprobación vive en el runtime Node (getCuentaUser, rutas API), NO en
 *   el proxy Edge (que sólo verifica firma+expiración y renueva, sin BD).
 * - FAIL-OPEN ante error/tabla ausente: si la 2ª tanda aún no se ha migrado,
 *   las sesiones siguen funcionando (no rompemos /cuenta). Sólo se BLOQUEA
 *   cuando hay constancia explícita de revocación.
 * - Las sesiones legacy (sin `jti`) no son revocables; expiran solas. */

/** Registra una sesión recién emitida (en login / magic-link). */
export async function recordSession(jti: string, userId: string, ttlSeconds: number): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO cuenta_sessions (jti, user_id, expires_at)
      VALUES (${jti}, ${userId}, now() + ${`${ttlSeconds} seconds`}::interval)
      ON CONFLICT (jti) DO NOTHING
    `;
  } catch (e) {
    // No bloquear el login si la tabla aún no existe (migración pendiente).
    console.warn("[cuenta:sessions] recordSession omitido:", (e as Error).message);
  }
}

/** Marca una sesión como revocada (logout). Idempotente. */
export async function revokeSession(jti: string): Promise<void> {
  try {
    const sql = getSql();
    await sql`
      UPDATE cuenta_sessions SET revoked_at = now()
      WHERE jti = ${jti} AND revoked_at IS NULL
    `;
  } catch (e) {
    console.warn("[cuenta:sessions] revokeSession omitido:", (e as Error).message);
  }
}

/** ¿Está esta sesión revocada? Fail-open: ante cualquier duda, NO revocada. */
export async function isSessionRevoked(jti: string | undefined): Promise<boolean> {
  if (!jti) return false; // sesión legacy sin jti → no revocable
  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT 1 FROM cuenta_sessions WHERE jti = ${jti} AND revoked_at IS NOT NULL LIMIT 1
    `) as unknown[];
    return rows.length > 0;
  } catch (e) {
    console.warn("[cuenta:sessions] isSessionRevoked fail-open:", (e as Error).message);
    return false;
  }
}
