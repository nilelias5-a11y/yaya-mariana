import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/* FASE B — Sesión de la zona cliente (/cuenta).
 *
 * Mismo patrón que el panel admin pero AISLADO:
 * - Cookie distinta (`cuenta_session`) → no colisiona con `admin_session`.
 * - Secreto distinto (`CUENTA_SESSION_SECRET`).
 * - Sesión más larga (30 días) porque es cliente final.
 *
 * Sólo usa `jose` → seguro de importar desde proxy.ts (runtime Edge).
 * El hashing de contraseña (bcrypt) vive aparte en password.ts (Node). */

export const CUENTA_COOKIE = "cuenta_session";
/** Sesión del cliente: 30 días. */
export const CUENTA_TTL_SECONDS = 60 * 60 * 24 * 30;
/** Magic link: 15 minutos. */
export const MAGIC_TTL_SECONDS = 60 * 15;

function getSecretKey(): Uint8Array {
  const secret = process.env.CUENTA_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "CUENTA_SESSION_SECRET ausente o demasiado corto (mín. 32 caracteres). Revisa .env.local.",
    );
  }
  return new TextEncoder().encode(secret);
}

export type CuentaSession = JWTPayload & { sub: string; email: string };

/** Firma un token de sesión de cliente (30 días). */
export async function createCuentaSession(userId: string, email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${CUENTA_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyCuentaSession(
  token: string | undefined,
): Promise<CuentaSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return payload as CuentaSession;
  } catch {
    return null;
  }
}

/** Firma un magic-link token (15 min) con el propósito declarado. */
export async function createMagicToken(
  email: string,
  purpose: "login" | "register" | "recover",
): Promise<string> {
  return new SignJWT({ email, purpose, kind: "magic" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAGIC_TTL_SECONDS}s`)
    .sign(getSecretKey());
}

export type MagicPayload = { email: string; purpose: "login" | "register" | "recover" };

export async function verifyMagicToken(token: string | undefined): Promise<MagicPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    if (payload.kind !== "magic" || typeof payload.email !== "string") return null;
    return { email: payload.email, purpose: payload.purpose as MagicPayload["purpose"] };
  } catch {
    return null;
  }
}

export function cuentaCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
    secure: process.env.NODE_ENV === "production",
  };
}
