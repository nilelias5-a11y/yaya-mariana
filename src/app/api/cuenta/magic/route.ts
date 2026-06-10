import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/cuenta/db";
import { createMagicToken } from "@/lib/cuenta/auth";
import { sendEmail, magicLinkUrl } from "@/lib/cuenta/email";

/* FASE B — Solicitar magic link (login sin contraseña / recuperación).
 * Responde siempre ok aunque el email no exista (sin enumeración). En
 * desarrollo devuelve el enlace para poder probarlo sin email real. */

export async function POST(req: NextRequest) {
  let email = "";
  let purpose: "login" | "recover" = "login";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
    if (body?.purpose === "recover") purpose = "recover";
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  let devMagicLink: string | undefined;

  if (user) {
    const token = await createMagicToken(email, purpose);
    const link = magicLinkUrl(new URL(req.url).origin, token);
    await sendEmail({ to: email, template: "magic-link", data: { link } });
    if (process.env.NODE_ENV !== "production") devMagicLink = link;
  }

  return NextResponse.json({ ok: true, ...(devMagicLink ? { devMagicLink } : {}) });
}
