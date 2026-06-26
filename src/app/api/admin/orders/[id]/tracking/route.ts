import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { updateOrderTracking } from "@/lib/admin/db";

/* MEJORA 4 — Editar el seguimiento de envío de un pedido (manual, universal).
 *
 * PATCH /api/admin/orders/[id]/tracking  (id = número, p. ej. "YM-2026-0001")
 * Body JSON: { carrier?, number?, url?, note? } (todos opcionales/vaciables)
 *
 * Protegido por la sesión JWT del admin (requireAdmin). Validación en SERVIDOR
 * (URL bien formada si se rellena, longitudes) y RESTRICCIÓN de estado: solo
 * editable en preparacion/enviado/entregado → 422 si no. Sella updated_at. */
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
    carrier: String(body?.carrier ?? ""),
    number: String(body?.number ?? ""),
    url: String(body?.url ?? ""),
    note: String(body?.note ?? ""),
  };

  const result = await updateOrderTracking(orderNumber, input);
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
  return NextResponse.json({ ok: true, tracking: result.tracking });
}
