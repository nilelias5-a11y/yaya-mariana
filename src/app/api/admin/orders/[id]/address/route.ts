import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { updateOrderShippingAddress } from "@/lib/admin/db";

/* PARTE 2 — Editar la dirección de envío de un pedido desde el panel.
 *
 * PATCH /api/admin/orders/[id]/address  (id = número, p. ej. "YM-2026-0001")
 * Body JSON: { recipient, street, city, postalCode, region?, country?, phone? }
 *
 * Protegido por la sesión JWT del admin (requireAdmin). Validación en SERVIDOR
 * (obligatorios + longitudes) y RESTRICCIÓN de estado: solo editable en
 * pagado/preparacion (antes de enviar) → 422 si no. Sella updated_at. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const orderNumber = decodeURIComponent(id);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const input = {
    recipient: String(body?.recipient ?? ""),
    street: String(body?.street ?? ""),
    city: String(body?.city ?? ""),
    postalCode: String(body?.postalCode ?? ""),
    region: String(body?.region ?? ""),
    country: String(body?.country ?? ""),
    phone: String(body?.phone ?? ""),
  };

  const result = await updateOrderShippingAddress(orderNumber, input);
  if (!result.ok) {
    if (result.code === "not_found") {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    if (result.code === "not_editable") {
      return NextResponse.json(
        { ok: false, error: "not_editable", status: result.status },
        { status: 422 },
      );
    }
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  revalidatePath("/admin");
  return NextResponse.json({ ok: true, shippingAddress: result.shippingAddress });
}
