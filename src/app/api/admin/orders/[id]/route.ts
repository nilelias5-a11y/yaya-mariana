import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { isOrderStatus, updateOrderStatus, getAdminOrderDetail } from "@/lib/admin/db";

/* PARTE 1 — Detalle de un pedido para el drawer del panel (lazy: lo pide al
 * abrir). GET /api/admin/orders/[id]  (id = número, p. ej. "YM-2026-0001").
 * Protegido por la sesión JWT del admin. Sin sesión → 401; inexistente → 404. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const detail = await getAdminOrderDetail(decodeURIComponent(id));
  if (!detail) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, detail });
}

/* TAREA 1 — Cambiar estado de un pedido desde el panel /admin.
 *
 * PATCH /api/admin/orders/[id]  (id = número de pedido, p. ej. "YM-2026-0001")
 * Body JSON: { status: "preparacion" | "enviado" | ... }
 *
 * Protegido por la sesión JWT del admin (cookie httpOnly `admin_session`,
 * misma del login). Sin sesión → 401. Valida la transición contra
 * ORDER_TRANSITIONS (422 si no es lógica) y sella updated_at. Additive:
 * no toca el flujo de Stripe/pagos. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const orderNumber = decodeURIComponent(id);

  let next: unknown;
  try {
    next = (await req.json())?.status;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (!isOrderStatus(next)) {
    return NextResponse.json({ ok: false, error: "invalid_status" }, { status: 400 });
  }

  const result = await updateOrderStatus(orderNumber, next);
  if (!result.ok) {
    if (result.code === "not_found") {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return NextResponse.json(
      { ok: false, error: "invalid_transition", from: result.from, allowed: result.allowed },
      { status: 422 },
    );
  }

  revalidatePath("/admin");
  return NextResponse.json({ ok: true, status: result.status, updatedAt: result.updatedAt });
}
