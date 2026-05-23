"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* TANDA 1 — `CARD_STYLE` con hex literales: el CardElement de Stripe es un
   iframe cross-origin y NO acepta `var()` en runtime (limitación del SDK),
   así que los valores deben ir crudos. Cada literal coincide 1:1 con un
   primitivo del design system — la equivalencia se documenta para que el
   próximo desarrollador no lo lea como drift de paleta:
     #1a0808 = --ink-900        (--color-text-primary)
     #6e3232 = --ink-500        (--color-text-muted, placeholder)
     #962a1f = --strawberry-600 (--color-brand-primary, iconColor)
     #b5341f = --strawberry-500 (--color-brand-hover, estado inválido) */
const CARD_STYLE = {
  style: {
    base: {
      /* TANDA 4 (#CR-12) — 16px: el CardElement de Stripe tampoco debe
         disparar el auto-zoom de iOS Safari (antes 15px). */
      fontSize: "16px",
      color: "#1a0808",
      fontFamily: "Inter, system-ui, sans-serif",
      "::placeholder": { color: "#6e3232" },
      iconColor: "#962a1f",
    },
    invalid: { color: "#b5341f", iconColor: "#b5341f" },
  },
};

type CheckoutField = "name" | "email" | "address" | "city" | "zip";
type CheckoutErrors = Partial<Record<CheckoutField, string>>;

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  /* TANDA 4 (#38) — validación accesible por campo (aria-invalid + describedby). */
  const [fieldErrors, setFieldErrors] = useState<CheckoutErrors>({});

  function messageFor(field: HTMLInputElement): string | null {
    if (field.validity.valid) return null;
    if (field.validity.valueMissing) return t.formErrors.required;
    if (field.validity.typeMismatch) return t.formErrors.email;
    return t.formErrors.required;
  }

  function clearFieldError(fieldName: CheckoutField, el: HTMLInputElement) {
    if (fieldErrors[fieldName] && el.validity.valid) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    /* #38 — Constraint Validation API: marca los campos vacíos/erróneos
       sin reescribir el formulario; el required nativo se conserva. */
    const fields = e.currentTarget.querySelectorAll<HTMLInputElement>("input[name]");
    const nextErrors: CheckoutErrors = {};
    fields.forEach((field) => {
      const msg = messageFor(field);
      if (msg) nextErrors[field.name as CheckoutField] = msg;
    });
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }
    setFieldErrors({});
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
        {/* TANDA 4 (#37) — confirmación de pedido anunciada por el SR. */}
        <div role="status" aria-live="polite" className="max-w-md w-full text-center">
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
          {/* TANDA 2 — botón "Volver al inicio" del sistema (primario md). */}
          <Button variant="primary" size="md" onClick={() => router.push("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  /* E2 (CRÍTICO) — guard de carrito vacío. Antes /checkout renderizaba el
     formulario completo con "Pagar 0.00€" aunque no hubiera ítems (importe
     que la API rechaza por < 0,50€). Si la cesta está vacía se muestra un
     estado vacío digno con un enlace de vuelta al catálogo (`/#productos`)
     en lugar de un checkout inutilizable. El éxito de pago se comprueba
     ANTES (clearCart vacía la cesta tras pagar — no debe disparar este
     guard, por eso va después del bloque `success`). */
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-bg-subtle)] flex items-center justify-center mx-auto mb-6 text-[var(--color-text-muted)]">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10" aria-hidden>
              <path d="M12 4L6 12v28a4 4 0 004 4h28a4 4 0 004-4V12l-6-8z" />
              <line x1="6" y1="12" x2="42" y2="12" />
              <path d="M32 20a8 8 0 01-16 0" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-[var(--color-text-primary)] mb-3">{t.cart.empty}</h1>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            {/* Vuelve al catálogo del single-page: la compra empieza por
                "Añadir al carrito". El ancla `/#productos` funciona tanto
                desde /checkout como tras una recarga directa. */}
            <Button as="a" href="/#productos" variant="primary" size="md">
              {t.about.viewStore}
            </Button>
            <Button as="a" href="/" variant="ghost">
              {t.nav.menu.items[0].label}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    /* TANDA 1 — el checkout comparte el sistema de spacing del single-page:
       `.container` aporta el ancho `--container-max` (1152px) y el gutter
       responsive `--space-container-pad` (antes `px-6` plano + `max-w-5xl`
       1024px, que hacían "saltar" el ancho al navegar desde la home). */
    <div className="min-h-screen py-16" style={{ backgroundColor: "var(--color-bg-base)" }}>
      <div className="container">
        {/* Back button */}
        {/* TANDA 2 — "Volver": link de acción terciario del sistema
            (.btn-link, 13px — antes 14px suelto). */}
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-link mb-10"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M10 4L6 8l4 4" />
          </svg>
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Form */}
          {/* #38 — noValidate: validación accesible en lugar del bubble nativo. */}
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
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
                <Field label="Nombre completo" required htmlFor="co-name" error={fieldErrors.name}>
                  <input
                    id="co-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    enterKeyHint="next"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearFieldError("name", e.target); }}
                    placeholder="Ana García"
                    aria-invalid={fieldErrors.name ? true : undefined}
                    aria-describedby={fieldErrors.name ? "co-name-error" : undefined}
                    className={inputClass}
                  />
                </Field>
                <Field label="Email" required htmlFor="co-email" error={fieldErrors.email}>
                  <input
                    id="co-email"
                    name="email"
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearFieldError("email", e.target); }}
                    placeholder="ana@ejemplo.com"
                    aria-invalid={fieldErrors.email ? true : undefined}
                    aria-describedby={fieldErrors.email ? "co-email-error" : undefined}
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
              <Field label="Dirección" required htmlFor="co-address" error={fieldErrors.address}>
                <input
                  id="co-address"
                  name="address"
                  type="text"
                  required
                  autoComplete="street-address"
                  enterKeyHint="next"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); clearFieldError("address", e.target); }}
                  placeholder="Calle Mayor 1, 3ºA"
                  aria-invalid={fieldErrors.address ? true : undefined}
                  aria-describedby={fieldErrors.address ? "co-address-error" : undefined}
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ciudad" required htmlFor="co-city" error={fieldErrors.city}>
                  <input
                    id="co-city"
                    name="city"
                    type="text"
                    required
                    autoComplete="address-level2"
                    enterKeyHint="next"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); clearFieldError("city", e.target); }}
                    placeholder="Barcelona"
                    aria-invalid={fieldErrors.city ? true : undefined}
                    aria-describedby={fieldErrors.city ? "co-city-error" : undefined}
                    className={inputClass}
                  />
                </Field>
                <Field label="Código postal" required htmlFor="co-zip" error={fieldErrors.zip}>
                  <input
                    id="co-zip"
                    name="zip"
                    type="text"
                    required
                    inputMode="numeric"
                    autoComplete="postal-code"
                    enterKeyHint="done"
                    value={zip}
                    onChange={(e) => { setZip(e.target.value); clearFieldError("zip", e.target); }}
                    placeholder="08001"
                    aria-invalid={fieldErrors.zip ? true : undefined}
                    aria-describedby={fieldErrors.zip ? "co-zip-error" : undefined}
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

            {/* TANDA 2 — botón "Pagar": botón primario del sistema
                (.btn .btn--md .btn--block). El estado disabled (mientras
                Stripe carga / procesa el pago) lo da el sistema. */}
            <button
              type="submit"
              disabled={!stripe || loading}
              className="btn btn--md btn--block btn--primary"
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
          {/* TANDA 1 — `p-6`(24px)→`p-8`(32px): el resumen del pedido y el
              formulario de Contact son los dos paneles-formulario del sitio;
              ahora comparten padding de superficie (tier "panel grande"). */}
          <aside className="bg-[var(--color-bg-surface)] rounded-2xl p-8 shadow-sm border border-[var(--color-border-subtle)] h-fit sticky top-8">
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

/* TANDA 4 (#CR-12) — text-base = 16px: anti auto-zoom iOS (antes text-sm). */
const inputClass =
  "w-full rounded-xl border-2 border-[var(--color-border-default)] bg-[var(--color-bg-surface)] px-4 py-3 text-base text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors";

function Field({
  label,
  required,
  htmlFor,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  /* #38 — id del input asociado: permite label htmlFor + error describedby. */
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    /* TANDA 1 — `space-y-1.5`(6px)→`space-y-2`(8px) y `ml-0.5`(2px)→`ml-1`(4px):
       snap a la escala base-4 (mismo patrón que los labels de Contact). */
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide"
      >
        {label}
        {required && <span className="text-[var(--color-brand-primary)] ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs text-[var(--color-error)]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
