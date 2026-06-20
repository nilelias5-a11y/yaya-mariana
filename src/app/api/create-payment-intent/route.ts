import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

/* Crea el PaymentIntent del checkout.
 *
 * TAREA 4 (additive) — además del importe e items, guarda en `metadata` los
 * datos mínimos del cliente y del envío para que el WEBHOOK pueda reconstruir
 * el pedido por sí solo (red de seguridad si el endpoint de checkout no se
 * ejecutara). Los valores de metadata se acotan a 480 chars (límite de
 * Stripe: 500). Sigue funcionando con sólo { amount, items }. */

/** Recorta un valor de metadata al límite de Stripe. */
function clamp(s: string): string {
  return s.length > 480 ? s.slice(0, 480) : s;
}

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      items,
      email,
      nombre,
      dni,
      shipping,
    } = (await req.json()) as {
      amount: number;
      items: { name: string; quantity: number }[];
      email?: string;
      nombre?: string;
      dni?: string;
      shipping?: { address?: string; city?: string; zip?: string };
    };

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Importe inválido" }, { status: 400 });
    }

    const metadata: Record<string, string> = {
      items: clamp(items?.map((i) => `${i.name} x${i.quantity}`).join(", ") ?? ""),
    };
    if (email) metadata.email = clamp(email);
    if (nombre) metadata.nombre = clamp(nombre);
    if (dni) metadata.dni = clamp(dni);
    // Líneas compactas para reconstruir el pedido en el webhook (vía catálogo).
    if (Array.isArray(items) && items.length > 0) {
      metadata.line_items = clamp(
        JSON.stringify(items.map((i) => ({ n: i.name, q: i.quantity }))),
      );
    }
    if (shipping) {
      metadata.shipping = clamp(
        JSON.stringify({ s: shipping.address ?? "", c: shipping.city ?? "", z: shipping.zip ?? "" }),
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
