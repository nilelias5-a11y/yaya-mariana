"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* El CardElement de Stripe es un iframe cross-origin y NO acepta `var()`
   en runtime (limitacion del SDK). Los valores son los hex de marca crudos:
     #1a0808 = ink primario  |  #c0a0a0 = placeholder
     #c0392b = brand primary |  #e74c3c = invalid/error */
const CARD_STYLE = {
  style: {
    base: {
      /* mobile: 16px evita el auto-zoom de iOS Safari (antes 15px lo
         disparaba). El CardElement no acepta var() — valor crudo. */
      fontSize: "16px",
      color: "#1a0808",
      fontFamily: "Inter, system-ui, sans-serif",
      "::placeholder": { color: "#c0a0a0" },
      iconColor: "#c0392b",
    },
    invalid: { color: "#e74c3c", iconColor: "#e74c3c" },
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
  /* C4-deferred (a11y #38) — validacion accesible por campo
     (aria-invalid + aria-describedby). */
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
      if (!cardElement) throw new Error(t.checkout.errors.cardLoad);

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
      setError(err instanceof Error ? err.message : t.checkout.errors.generic);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#fdf6f5" }}>
        {/* a11y (#37) — confirmacion de pedido anunciada por el SR. */}
        <div role="status" aria-live="polite" className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-[#1a0808] mb-3">{t.checkout.success.title}</h1>
          <p className="text-[#7a3a3a]/70 mb-8 leading-relaxed">
            {t.checkout.success.body} {name}. {t.checkout.success.emailHint}{" "}
            <span className="font-semibold text-[#1a0808]">{email}</span>.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold shadow-lg"
            style={{ background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)" }}
          >
            {t.checkout.success.backHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16" style={{ backgroundColor: "#fdf6f5" }}>
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[#7a3a3a]/60 hover:text-[#c0392b] transition-colors mb-10"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
            <path d="M10 4L6 8l4 4" />
          </svg>
          {t.checkout.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Form — accessible validation con Constraint Validation API. */}
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-[#1a0808] mb-1">{t.checkout.title}</h1>
              <p className="text-sm text-[#7a3a3a]/60">{t.checkout.subtitle}</p>
            </div>

            {/* Personal info */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-3">
                {t.checkout.sections.personal}
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t.checkout.fields.name} required htmlFor="co-name" error={fieldErrors.name}>
                  <input
                    id="co-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    enterKeyHint="next"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearFieldError("name", e.target); }}
                    placeholder={t.checkout.fields.namePlaceholder}
                    aria-invalid={fieldErrors.name ? true : undefined}
                    aria-describedby={fieldErrors.name ? "co-name-error" : undefined}
                    className={inputClass}
                  />
                </Field>
                <Field label={t.checkout.fields.email} required htmlFor="co-email" error={fieldErrors.email}>
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
                    placeholder={t.checkout.fields.emailPlaceholder}
                    aria-invalid={fieldErrors.email ? true : undefined}
                    aria-describedby={fieldErrors.email ? "co-email-error" : undefined}
                    className={inputClass}
                  />
                </Field>
              </div>
            </fieldset>

            {/* Shipping */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-3">
                {t.checkout.sections.shipping}
              </legend>
              <Field label={t.checkout.fields.address} required htmlFor="co-address" error={fieldErrors.address}>
                <input
                  id="co-address"
                  name="address"
                  type="text"
                  required
                  autoComplete="street-address"
                  enterKeyHint="next"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); clearFieldError("address", e.target); }}
                  placeholder={t.checkout.fields.addressPlaceholder}
                  aria-invalid={fieldErrors.address ? true : undefined}
                  aria-describedby={fieldErrors.address ? "co-address-error" : undefined}
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label={t.checkout.fields.city} required htmlFor="co-city" error={fieldErrors.city}>
                  <input
                    id="co-city"
                    name="city"
                    type="text"
                    required
                    autoComplete="address-level2"
                    enterKeyHint="next"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); clearFieldError("city", e.target); }}
                    placeholder={t.checkout.fields.cityPlaceholder}
                    aria-invalid={fieldErrors.city ? true : undefined}
                    aria-describedby={fieldErrors.city ? "co-city-error" : undefined}
                    className={inputClass}
                  />
                </Field>
                <Field label={t.checkout.fields.zip} required htmlFor="co-zip" error={fieldErrors.zip}>
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
                    placeholder={t.checkout.fields.zipPlaceholder}
                    aria-invalid={fieldErrors.zip ? true : undefined}
                    aria-describedby={fieldErrors.zip ? "co-zip-error" : undefined}
                    className={inputClass}
                  />
                </Field>
              </div>
            </fieldset>

            {/* Payment */}
            <fieldset className="space-y-4">
              <legend className="text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-3">
                {t.checkout.sections.payment}
              </legend>
              <div className="rounded-xl border-2 border-[#f5c6c2] bg-white px-4 py-3.5 focus-within:border-[#c0392b] transition-colors">
                <CardElement options={CARD_STYLE} />
              </div>
              <p className="text-[0.72rem] text-[#7a3a3a]/50 flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-[#c0392b]/60 shrink-0" aria-hidden>
                  <path d="M8 1a5 5 0 100 10A5 5 0 008 1zm0 9a4 4 0 110-8 4 4 0 010 8zm0-6a1 1 0 00-1 1v2a1 1 0 002 0V5a1 1 0 00-1-1z" />
                </svg>
                {t.checkout.securePayment}
              </p>
            </fieldset>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!stripe || loading}
              className="w-full py-4 rounded-full text-white font-bold text-base shadow-xl hover:shadow-2xl transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  {t.checkout.processing}
                </span>
              ) : (
                `${t.checkout.pay} ${total.toFixed(2)}€`
              )}
            </button>
          </form>

          {/* Order summary */}
          <aside className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5c6c2]/40 h-fit sticky top-8">
            <h2 className="font-serif text-lg text-[#1a0808] mb-4">{t.checkout.summary.title}</h2>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="text-[#7a3a3a]/80">
                    {item.name}{" "}
                    <span className="text-[#7a3a3a]/40">×{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-[#1a0808]">
                    {(item.price * item.quantity).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#f5c6c2]/50 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-[#7a3a3a]/60">
                <span>{t.checkout.summary.subtotal}</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm text-[#7a3a3a]/60">
                <span>{t.checkout.summary.shipping}</span>
                <span>{t.checkout.summary.shippingNote}</span>
              </div>
              <div className="flex justify-between font-bold text-[#1a0808] pt-1">
                <span>{t.checkout.summary.total}</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* mobile: text-base (16px) anti auto-zoom iOS (antes text-sm = 13px). */
const inputClass =
  "w-full rounded-xl border-2 border-[#f5c6c2] bg-white px-4 py-3 text-base text-[#1a0808] placeholder-[#c0a0a0] focus:outline-none focus:border-[#c0392b] transition-colors";

function Field({
  label,
  required,
  htmlFor,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  /* C4-deferred (#38) — id del input asociado: permite label htmlFor +
     error describedby. */
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-[#7a3a3a]/80 uppercase tracking-wide"
      >
        {label}
        {required && <span className="text-[#c0392b] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs text-[#b91c1c]">
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
