import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminOrderForInvoice } from "@/lib/admin/db";
import { getInvoicePdf, saveInvoicePdf } from "@/lib/cuenta/db";
import { InvoicePDF } from "@/lib/cuenta/invoice-pdf";

/* PARTE 1 — Factura PDF de un pedido desde el panel /admin.
 *
 * GET /api/admin/orders/[id]/invoice  (id = número, p. ej. "YM-2026-0001")
 * Protegido por la sesión JWT del admin (requireAdmin). Reutiliza el mismo
 * `InvoicePDF` y la caché en cuenta_invoices que la descarga del cliente.
 * `?download=1` fuerza descarga; por defecto se muestra inline. */

export const runtime = "nodejs";

const LOGO_PATH = path.join(process.cwd(), "public", "logo-nuevo.jpg");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const order = await getAdminOrderForInvoice(decodeURIComponent(id));
  if (!order) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  // Caché en BD: si ya se generó, se reutiliza (igual que la factura del cliente).
  let pdf = await getInvoicePdf(order.invoiceNumber);
  if (!pdf) {
    pdf = await renderToBuffer(InvoicePDF({ order, logoPath: LOGO_PATH }));
    await saveInvoicePdf(order.invoiceNumber, pdf);
  }

  const download = req.nextUrl.searchParams.get("download") === "1";
  const disposition = download ? "attachment" : "inline";

  return new NextResponse(pdf as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${order.invoiceNumber}.pdf"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
