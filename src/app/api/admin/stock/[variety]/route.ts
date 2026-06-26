import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/session";
import { updateStock } from "@/lib/admin/db";

/* TAREA 2 — Editar existencias desde el panel /admin.
 *
 * PATCH /api/admin/stock/[variety]  (variety = PK, p. ej. "Mágnum")
 * Body JSON: { units: number }  (entero ≥ 0)
 *
 * Protegido por la sesión JWT del admin (cookie httpOnly `admin_session`).
 * Sin sesión → 401. Rechaza unidades negativas / no enteras (400) y sella
 * updated_at. Additive: no toca el flujo de Stripe/pagos. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ variety: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const { variety } = await params;
  const varietyKey = decodeURIComponent(variety);

  let units: unknown;
  try {
    units = (await req.json())?.units;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  if (typeof units !== "number") {
    return NextResponse.json({ ok: false, error: "invalid_units" }, { status: 400 });
  }

  const result = await updateStock(varietyKey, units);
  if (!result.ok) {
    if (result.code === "not_found") {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: "invalid_units" }, { status: 400 });
  }

  revalidatePath("/admin");
  return NextResponse.json({
    ok: true,
    units: result.units,
    lowThreshold: result.lowThreshold,
    outThreshold: result.outThreshold,
    updatedAt: result.updatedAt,
  });
}
