import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrderFromPayment, buildShippingAddress } from "@/lib/cuenta/orders";
import { orderItemsFromCart } from "@/lib/catalog";
import { createMagicToken } from "@/lib/cuenta/auth";
import { sendEmail, magicLinkUrl } from "@/lib/cuenta/email";

/* TAREA 3 — Persistencia del pedido tras un pago con tarjeta.
 *
 * Lo llama el checkout (cliente) cuando el PaymentIntent queda en
 * `succeeded`. Verifica el pago contra Stripe (si hay clave REAL) y crea el
 * pedido en Neon mediante el creador idempotente compartido. El webhook
 * (TAREA 4) es la red de seguridad: si este endpoint no llegara a ejecutarse,
 * el webhook crea el mismo pedido (idempotente por payment_ref).
 *
 * Runtime Node (Stripe SDK). */

const KEY = process.env.STRIPE_SECRET_KEY ?? "";
const KEY_IS_REAL = KEY !== "" && !KEY.includes("placeholder");
const stripe = new Stripe(KEY);

export async function POST(req: NextRequest) {
  let body: {
    paymentIntentId?: string;
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    zip?: string;
    items?: { name: string; quantity: number }[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const paymentIntentId = String(body.paymentIntentId ?? "").trim();
  const email = String(body.email ?? "").trim();
  const name = String(body.name ?? "").trim();
  const items = Array.isArray(body.items) ? body.items : [];

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!paymentIntentId || !emailOk || !name) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Verificación del pago: sólo posible con clave real (en dev placeholder se
  // omite porque el pago no llega a realizarse de verdad).
  if (KEY_IS_REAL) {
    try {
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== "succeeded") {
        return NextResponse.json({ ok: false, error: "unpaid" }, { status: 402 });
      }
    } catch {
      return NextResponse.json({ ok: false, error: "verify" }, { status: 400 });
    }
  }

  const orderItems = orderItemsFromCart(items);
  if (orderItems.length === 0) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  const shippingAddress = buildShippingAddress({
    recipient: name,
    street: String(body.address ?? ""),
    city: String(body.city ?? ""),
    postalCode: String(body.zip ?? ""),
  });

  try {
    const { order, created, userCreated } = await createOrderFromPayment({
      email,
      nombre: name,
      items: orderItems,
      shippingAddress,
      paymentRef: paymentIntentId,
      status: "pagado",
    });

    // Emails (mock por ahora): confirmación siempre que el pedido sea nuevo;
    // bienvenida + magic link sólo si la cuenta se acaba de crear.
    if (created) {
      await sendEmail({
        to: email,
        template: "order-confirmation",
        data: { number: order.number },
      });
      if (userCreated) {
        const token = await createMagicToken(email, "login");
        const link = magicLinkUrl(new URL(req.url).origin, token);
        await sendEmail({ to: email, template: "welcome", data: { nombre: name } });
        await sendEmail({ to: email, template: "magic-link", data: { link } });
      }
    }

    return NextResponse.json({ ok: true, orderNumber: order.number, created });
  } catch (e) {
    console.error("[checkout/complete] error:", (e as Error).message);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
