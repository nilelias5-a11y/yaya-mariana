import { NextRequest, NextResponse } from "next/server";
import { getCuentaUser } from "@/lib/cuenta/session";
import { updateUser } from "@/lib/cuenta/db";
import { buildShippingAddress } from "@/lib/cuenta/orders";

/* Guarda una dirección en el perfil del cliente (checkbox "Guardar esta
 * dirección" del checkout). Endpoint ADDITIVE e INDEPENDIENTE del flujo de
 * pago: no toca Stripe, ni el PaymentIntent, ni la creación de pedido. El
 * checkout lo llama de forma no bloqueante tras un pago correcto.
 *
 * Requiere sesión de cliente. Idempotente: si la dirección ya existe
 * (mismo street+ciudad+CP) no la duplica.
 *
 * Runtime Node (sesión + Neon). */

export const runtime = "nodejs";

const norm = (s: string) => s.trim().toLowerCase();

export async function POST(req: NextRequest) {
  const user = await getCuentaUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauth" }, { status: 401 });

  let body: { street?: string; city?: string; postalCode?: string; recipient?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const street = String(body.street ?? "").trim();
  const city = String(body.city ?? "").trim();
  const postalCode = String(body.postalCode ?? "").trim();
  const recipient = String(body.recipient ?? "").trim() || user.nombre;
  if (!street || !city || !postalCode) {
    return NextResponse.json({ ok: false, error: "incomplete" }, { status: 400 });
  }

  const current = user.addresses ?? [];
  const dup = current.some(
    (a) => norm(a.street) === norm(street) && norm(a.city) === norm(city) && norm(a.postalCode) === norm(postalCode),
  );
  if (dup) return NextResponse.json({ ok: true, duplicate: true });

  const address = buildShippingAddress({ recipient, street, city, postalCode });
  const updated = await updateUser(user.id, { addresses: [...current, address] });
  return NextResponse.json({ ok: Boolean(updated), id: address.id });
}
