import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/cuenta/email";
import { business } from "@/config/business";

/* MEJORA 1 — Formulario de contacto por email.
 *
 * Recibe { name, email, subject, message }, valida en SERVIDOR, y envía el
 * mensaje por email al negocio (`business.contact.email`) con la plantilla
 * `contact` (gateada tras RESEND_API_KEY: real si está, mock si no).
 *
 * Devuelve `{ ok, delivered }`:
 *   · delivered=true  → se entregó de verdad (Resend activo y sin error).
 *   · delivered=false → mock (Resend off, como ahora) o el envío falló.
 * El formulario usa `delivered` para dar un feedback HONESTO (sin "enviado"
 * falso). Best-effort: un fallo de email nunca tumba la petición. */

const LIMITS = { name: 120, email: 200, subject: 160, message: 5000 };
// Validación de email pragmática (no estricta RFC): hay algo@algo.dominio.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const subject = String(body?.subject ?? "").trim();
  const message = String(body?.message ?? "").trim();

  // Validación en servidor (no confiar en el cliente).
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return NextResponse.json({ ok: false, error: "too_long" }, { status: 400 });
  }

  // Envío gateado por Resend. replyTo = email del cliente → J. Elías responde directo.
  const { delivered } = await sendEmail({
    to: business.contact.email,
    template: "contact",
    data: { name, email, subject, message },
    replyTo: email,
  });

  return NextResponse.json({ ok: true, delivered });
}
