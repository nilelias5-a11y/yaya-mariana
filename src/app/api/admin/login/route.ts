import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth";

/* FASE A.5 · T2 — Login del panel /admin endurecido.
 *
 * - Verifica usuario contra ADMIN_USER y contraseña contra ADMIN_PASS_HASH
 *   (hash bcrypt; nunca texto plano).
 * - Si es válido, emite un JWT firmado (8h) en cookie httpOnly.
 * - Responde JSON (el formulario es un client component con fetch +
 *   estado de carga). No filtra qué credencial falló.
 *
 * Runtime Node (por defecto en route handlers) — necesario para bcrypt. */

// Hash dummy con el mismo coste: se compara siempre aunque el usuario no
// exista, para que el tiempo de respuesta no revele usuarios válidos.
const DUMMY_HASH = "$2b$12$.....................................dummyDummyDummyD";

export async function POST(req: NextRequest) {
  let user = "";
  let pass = "";

  const contentType = req.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const body = await req.json();
      user = String(body?.user ?? "");
      pass = String(body?.pass ?? "");
    } else {
      const form = await req.formData();
      user = String(form.get("user") ?? "");
      pass = String(form.get("pass") ?? "");
    }
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const okUser = process.env.ADMIN_USER ?? "";
  const okHash = process.env.ADMIN_PASS_HASH ?? "";

  if (okUser === "" || okHash === "") {
    // Configuración incompleta del servidor: no revelar detalles.
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }

  // Comparar siempre un hash (real o dummy) para tiempo constante.
  const userMatches = user === okUser;
  const passOk = await bcrypt.compare(pass, userMatches ? okHash : DUMMY_HASH);
  const valid = userMatches && passOk;

  if (!valid) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 401 });
  }

  const token = await createSessionToken(okUser);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_TTL_SECONDS));
  return res;
}
