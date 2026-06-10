import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/* FASE B (migración a Neon) — cliente SQL reutilizable.
 *
 * Usa el driver serverless de Neon (`neon()`, SQL sobre HTTP): edge-safe,
 * sin sockets persistentes; el pooling lo gestiona Neon en el endpoint.
 * El cliente se memoiza en `globalThis` para reutilizarse entre
 * invocaciones y sobrevivir al HMR de `next dev` (evita recrearlo en cada
 * recarga). Las interpolaciones `${}` de los tagged templates se envían
 * SIEMPRE como parámetros vinculados (prepared statements) → sin inyección. */

declare global {
  // eslint-disable-next-line no-var
  var __neonSql: NeonQueryFunction<false, false> | undefined;
}

export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL ausente. Añádela a .env.local (connection string de Neon). Ver README-CUENTA.md.",
    );
  }
  if (!globalThis.__neonSql) {
    globalThis.__neonSql = neon(url);
  }
  return globalThis.__neonSql;
}
