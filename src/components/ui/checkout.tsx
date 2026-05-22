"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCart } from "@/context/cart-context";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CARD_STYLE = {
  style: {
    base: {
      fontSize: "15px",
      color: "#1a0808",
      fontFamily: "Inter, system-ui, sans-serif",
      "::placeholder": { color: "#6e3232" },
      iconColor: "#962a1f",
    },
    invalid: { color: "#b5341f", iconColor: "#b5341f" },
  },
};

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          items: items.map((i) => ({ name: i.name, quantity: i.quantity })),
        }),
      });

      const { clientSecret, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("No se pudo cargar el formulario de pago");

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
            address: { line1: address, city, postal_code: zip, country: "ES" },
          },
        },
      });

      if (stripeError) throw new Error(stripeError.message);
      if (paymentIntent?.status === "succeeded") {
        clearCart();
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al procesar el pago");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-success-surface)] flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-[var(--color-text-primary)] mb-3">¡Pedido confirmado!</h1>
          <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
            Gracias por tu compra, {name}. Recibirás un email de confirmación en{" "}
            <span className="font-semibold text-[var(--color-text-primary)]">{email}</span>.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-md text-white font-bold shadow-lg"
            style={{ background: "linear-gradient(125deg, #962a1f 0%, #b5341f 100%)" }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16" style={{ backgroundColor: "var(--color-bg-base)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors mb-10"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M10 4L6 8l4 4" />
          </svg>
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-[var(--color-text-primary)] mb-1">Finalizar pedido</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">Rellena tus datos para completar la compra</p>
            </div>

            {/* Personal info */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)] mb-3">
                Datos personales
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre completo" required>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ana García"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ana@ejemplo.com"
                    className={inputClass}
                  />
                </Field>
              </div>
            </fieldset>

            {/* Shipping */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)] mb-3">
                Dirección de envío
              </legend>
              <Field label="Dirección" required>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle Mayor 1, 3ºA"
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ciudad" required>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Barcelona"
                    className={inputClass}
                  />
                </Field>
                <Field label="Código postal" required>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="08001"
                    className={inputClass}
                  />
                </Field>
              </div>
            </fieldset>

            {/* Payment */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)] mb-3">
                Datos de pago
              </legend>
              <div className="rounded-xl border-2 border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-3 focus-within:border-[var(--color-brand-primary)] transition-colors">
                <CardElement options={CARD_STYLE} />
              </div>
              <p className="text-[0.72rem] text-[var(--color-text-muted)] flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-[var(--color-brand-primary)] shrink-0">
                  <path d="M8 1a5 5 0 100 10A5 5 0 008 1zm0 9a4 4 0 110-8 4 4 0 010 8zm0-6a1 1 0 00-1 1v2a1 1 0 002 0V5a1 1 0 00-1-1z" />
                </svg>
                Pago seguro gestionado por Stripe. No almacenamos datos de tu tarjeta.
              </p>
            </fieldset>

            {error && (
              <div className="rounded-xl bg-[var(--color-error-surface)] border border-[var(--color-error)]/30 px-4 py-3 text-sm text-[var(--color-error)]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!stripe || loading}
              /* rounded-md = 8px — radio de botones unificado (decisión #3). */
              className="w-full py-4 rounded-md text-white font-bold text-base shadow-xl hover:shadow-2xl transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(125deg, #962a1f 0%, #b5341f 100%)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Procesando...
                </span>
              ) : (
                `Pagar ${total.toFixed(2)}€`
              )}
            </button>
          </form>

          {/* Order summary */}
          <aside className="bg-[var(--color-bg-surface)] rounded-2xl p-6 shadow-sm border border-[var(--color-border-subtle)] h-fit sticky top-8">
            <h2 className="font-serif text-lg text-[var(--color-text-primary)] mb-4">Resumen del pedido</h2>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    {item.name}{" "}
                    <span className="text-[var(--color-text-muted)]">×{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {(item.price * item.quantity).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--color-border-subtle)] pt-4 space-y-2">
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                <span>Subtotal</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                <span>Envío</span>
                <span>A calcular</span>
              </div>
              <div className="flex justify-between font-bold text-[var(--color-text-primary)] pt-1">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
        {label}
        {required && <span className="text-[var(--color-brand-primary)] ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
