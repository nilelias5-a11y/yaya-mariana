import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { CUENTA_COOKIE, verifyCuentaSession } from "@/lib/cuenta/auth";
import { getOrderById, getInvoicePdf, saveInvoicePdf } from "@/lib/cuenta/db";
import { InvoicePDF } from "@/lib/cuenta/invoice-pdf";

/* FASE B — Descarga de factura PDF.
 * Verifica que el cliente autenticado es el dueño del pedido antes de
 * generar nada. Cachea el PDF en la tabla cuenta_invoices (Neon) para no
 * regenerarlo en cada descarga. */

export const runtime = "nodejs";

const LOGO_PATH = path.join(process.cwd(), "public", "logo-nuevo.jpg");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const session = await verifyCuentaSession(req.cookies.get(CUENTA_COOKIE)?.value);
  if (!session) return NextResponse.json({ ok: false, error: "auth" }, { status: 401 });

  const { orderId } = await params;
  const order = await getOrderById(orderId);

  // 404 también si no es suyo: no revelar la existencia de pedidos ajenos.
  if (!order || order.userId !== session.sub) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  // Caché en BD: si ya se generó la factura, se reutiliza.
  let pdf = await getInvoicePdf(order.invoiceNumber);
  if (!pdf) {
    // InvoicePDF devuelve un <Document>; lo invocamos directamente (sin hooks)
    // para obtener el elemento que renderToBuffer espera.
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
