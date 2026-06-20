import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrderFromPayment, buildShippingAddress } from "@/lib/cuenta/orders";
import { orderItemsFromCart } from "@/lib/catalog";
import { createMagicToken } from "@/lib/cuenta/auth";
import { sendEmail, magicLinkUrl } from "@/lib/cuenta/email";

/* TAREA 4 — Webhook de Stripe (escrito; se PROBARÁ con las claves test).
 *
 * Flujo: pago completado → crear pedido en Neon (idempotente por payment_ref)
 * → auto-registro del usuario si no existe → magic link de bienvenida.
 *
 * Seguridad/diseño:
 * - GATEADO tras STRIPE_WEBHOOK_SECRET: si no está configurado, responde 200
 *   y no hace nada (no rompe nada mientras no haya claves).
 * - Verifica la FIRMA del evento (constructEvent) con el secreto `whsec_`.
 * - Reconstruye el pedido desde `metadata` del PaymentIntent (lo rellena
 *   create-payment-intent). Es la RED DE SEGURIDAD del endpoint de checkout:
 *   ambos convergen en el mismo pedido gracias a la idempotencia.
 *
 * Runtime Node: Stripe SDK + lectura del cuerpo crudo para verificar firma. */

export const runtime = "nodejs";

const KEY = process.env.STRIPE_SECRET_KEY ?? "";
const stripe = new Stripe(KEY);

type CompactItem = { n: string; q: number };
type CompactShip = { s?: string; c?: string; z?: string };

function safeParse<T>(raw: string | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Crea el pedido a partir de la metadata de un pago. Devuelve un resumen
 *  para el log; no lanza si faltan datos (sólo registra y se ignora). */
async function handlePaid(paymentRef: string, metadata: Record<string, string>, origin: string) {
  const email = (metadata.email ?? "").trim();
  if (!email) {
    console.warn(`[stripe:webhook] ${paymentRef} sin email en metadata; se ignora`);
    return;
  }
  const nombre = (metadata.nombre ?? "").trim() || email;
  const dni = metadata.dni?.trim() || undefined;

  const compact = safeParse<CompactItem[]>(metadata.line_items) ?? [];
  const items = orderItemsFromCart(compact.map((c) => ({ name: c.n, quantity: c.q })));
  if (items.length === 0) {
    console.warn(`[stripe:webhook] ${paymentRef} sin líneas reconstruibles; se ignora`);
    return;
  }

  const ship = safeParse<CompactShip>(metadata.shipping) ?? {};
  const shippingAddress = buildShippingAddress({
    recipient: nombre,
    street: ship.s ?? "",
    city: ship.c ?? "",
    postalCode: ship.z ?? "",
  });

  const { order, created, userCreated } = await createOrderFromPayment({
    email,
    nombre,
    dni,
    items,
    shippingAddress,
    paymentRef,
    status: "pagado",
  });

  if (created) {
    await sendEmail({ to: email, template: "order-confirmation", data: { number: order.number } });
    if (userCreated) {
      const token = await createMagicToken(email, "login");
      await sendEmail({ to: email, template: "welcome", data: { nombre } });
      await sendEmail({ to: email, template: "magic-link", data: { link: magicLinkUrl(origin, token) } });
    }
    console.log(`[stripe:webhook] pedido ${order.number} creado desde ${paymentRef}`);
  } else {
    console.log(`[stripe:webhook] ${paymentRef} ya tenía pedido (${order.number}); idempotente`);
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  // Gateado: sin secreto configurado, no procesamos (no rompe sin claves).
  if (!secret) {
    console.warn("[stripe:webhook] STRIPE_WEBHOOK_SECRET ausente; evento ignorado");
    return NextResponse.json({ received: true, skipped: true });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.warn("[stripe:webhook] firma inválida:", (e as Error).message);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const origin = req.nextUrl.origin;
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handlePaid(pi.id, (pi.metadata ?? {}) as Record<string, string>, origin);
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const ref = (session.payment_intent as string) || session.id;
        const metadata = { ...(session.metadata ?? {}) } as Record<string, string>;
        if (!metadata.email && session.customer_details?.email) {
          metadata.email = session.customer_details.email;
        }
        await handlePaid(ref, metadata, origin);
        break;
      }
      default:
        // Otros eventos: reconocidos pero sin acción.
        break;
    }
  } catch (e) {
    // No devolver 5xx por errores de negocio: evitaría reintentos infinitos
    // de Stripe. Registramos para diagnóstico.
    console.error(`[stripe:webhook] error procesando ${event.type}:`, (e as Error).message);
  }

  return NextResponse.json({ received: true });
}
