import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/cuenta/db";
import { hashPassword } from "@/lib/cuenta/password";
import { createMagicToken } from "@/lib/cuenta/auth";
import { sendEmail, magicLinkUrl } from "@/lib/cuenta/email";

/* FASE B — Registro de cliente.
 * Crea la cuenta (contraseña opcional para reducir fricción) y envía un
 * magic link de verificación. No revela si el email ya existía con detalle
 * que permita enumerar (responde genérico). */

export async function POST(req: NextRequest) {
  let email = "";
  let nombre = "";
  let password = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
    nombre = String(body?.nombre ?? "").trim();
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!emailOk || nombre.length < 2) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    // No filtrar la existencia: responder ok y (si acaso) reenviar magic link.
    const token = await createMagicToken(email, "login");
    const link = magicLinkUrl(new URL(req.url).origin, token);
    await sendEmail({ to: email, template: "magic-link", data: { link } });
    return NextResponse.json({ ok: true, ...devLink(link) });
  }

  const passwordHash = password.length >= 8 ? await hashPassword(password) : null;
  await createUser({ email, nombre, passwordHash, emailVerified: false });

  const token = await createMagicToken(email, "register");
  const link = magicLinkUrl(new URL(req.url).origin, token);
  await sendEmail({ to: email, template: "welcome", data: { nombre } });
  await sendEmail({ to: email, template: "magic-link", data: { link } });

  return NextResponse.json({ ok: true, ...devLink(link) });
}

/** En desarrollo, devolver el magic link para poder probarlo sin email real. */
function devLink(link: string) {
  return process.env.NODE_ENV === "production" ? {} : { devMagicLink: link };
}
