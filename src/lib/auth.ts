import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/* FASE A.5 · T2 — Núcleo de sesión del panel /admin.
 *
 * Sesión basada en JWT firmado (HS256) con SESSION_SECRET, guardado en una
 * cookie httpOnly. Sólo usa `jose`, que funciona en el runtime Edge — por eso
 * este módulo es seguro de importar desde proxy.ts (middleware).
 *
 * El hashing/verificación de contraseña con bcrypt vive aparte (en la ruta
 * /api/admin/login, runtime Node), nunca aquí. */

export const SESSION_COOKIE = "admin_session";
/** Vida de la sesión: 8 horas. */
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET ausente o demasiado corto (mín. 32 caracteres). Revisa .env.local.",
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = JWTPayload & { sub: string };

/** Firma un token de sesión para `user`, con expiración a las 8h. */
export async function createSessionToken(user: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

/** Verifica firma + expiración. Devuelve el payload o `null` si no es válido. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    if (typeof payload.sub !== "string" || payload.sub.length === 0) return null;
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/** Opciones canónicas de la cookie de sesión (set y clear comparten path). */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
    secure: process.env.NODE_ENV === "production",
  };
}
