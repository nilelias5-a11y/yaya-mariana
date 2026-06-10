import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import { renderToBuffer } from "@react-pdf/renderer";
import { CUENTA_COOKIE, verifyCuentaSession } from "@/lib/cuenta/auth";
import { getOrderById } from "@/lib/cuenta/db";
import { InvoicePDF } from "@/lib/cuenta/invoice-pdf";

/* FASE B — Descarga de factura PDF.
 * Verifica que el cliente autenticado es el dueño del pedido antes de
 * generar nada. Cachea el buffer por nº de factura para no regenerar en
 * cada descarga (mock: caché en memoria del proceso). */

export const runtime = "nodejs";

const cache = new Map<string, Uint8Array>();
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

  let pdf = cache.get(order.invoiceNumber);
  if (!pdf) {
    // InvoicePDF devuelve un <Document>; lo invocamos directamente (sin hooks)
    // para obtener el elemento que renderToBuffer espera.
    pdf = await renderToBuffer(InvoicePDF({ order, logoPath: LOGO_PATH }));
    cache.set(order.invoiceNumber, pdf);
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
