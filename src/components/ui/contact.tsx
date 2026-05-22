"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

/* TANDA 5 (ME-10) — FocusField sin scale:1.01 en focus: el campo ya no
   se agranda al enfocar; el único indicador de foco es el anillo de marca
   (focus:ring del input). Se conserva como wrapper neutro de layout. */
function FocusField({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FieldName = keyof FormState;
type FieldErrors = Partial<Record<FieldName, string>>;

/* TANDA 4 (#CR-12) — text-base = 16px: evita el auto-zoom de iOS Safari
   al enfocar el campo (antes text-sm ≈ 13px). */
const inputClass =
  "w-full border border-[var(--color-border-default)] rounded-xl px-4 py-3 text-base text-[var(--color-text-secondary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-hover)]/40 focus:border-[var(--color-brand-hover)] transition-colors bg-[var(--color-bg-surface)]";

const ADDRESS_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const EMAIL_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PHONE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4 2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  /* TANDA 4 (#38) — validación accesible: errores por campo asociados
     vía aria-describedby; aria-invalid en los campos que fallan. */
  const [errors, setErrors] = useState<FieldErrors>({});

  /* Traduce el motivo de fallo de la Constraint Validation API a un
     mensaje propio. valueMissing → required; typeMismatch (email) → email. */
  function messageFor(field: HTMLInputElement | HTMLTextAreaElement): string | null {
    if (field.validity.valid) return null;
    if (field.validity.valueMissing) return t.formErrors.required;
    if (field.validity.typeMismatch) return t.formErrors.email;
    return t.formErrors.required;
  }

  const contactInfo = [
    {
      icon: ADDRESS_ICON,
      label: t.contact.addressLabel,
      value: "C/ Electrónica, 19, Planta 10, oficina D\n08915, Badalona, España",
    },
    {
      icon: EMAIL_ICON,
      label: t.contact.emailLabel,
      value: "info@yaya-mariana.com",
      href: "mailto:info@yaya-mariana.com",
    },
    {
      icon: PHONE_ICON,
      label: t.contact.phoneLabel,
      value: "+34 666 777 888",
      href: "tel:+34666777888",
    },
  ];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.target;
    setForm((prev) => ({ ...prev, [field.name]: field.value }));
    /* #38 — el error se limpia en cuanto el campo pasa a ser válido. */
    if (errors[field.name as FieldName] && field.validity.valid) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field.name as FieldName];
        return next;
      });
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    /* #38 — Constraint Validation API: recolecta los campos inválidos
       sin reescribir el formulario; el required nativo se mantiene. */
    const fields = e.currentTarget.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input[name], textarea[name]",
    );
    const nextErrors: FieldErrors = {};
    fields.forEach((field) => {
      const msg = messageFor(field);
      if (msg) nextErrors[field.name as FieldName] = msg;
    });
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSent(true);
  }

  return (
    <section id="contacto" className="section bg-[var(--color-bg-base)]">
      {/* Issue #8 — formulario protagonista: su columna (2ª) más ancha que la info. */}
      <div className="container grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12">
        {/* Info */}
        {/* TANDA 5 (HI-7) — barrido lateral x:-80 sustituido por fade-up
            discreto translateY 14px. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-overline text-[var(--color-brand-primary)] mb-4">
            {t.contact.eyebrow}
          </span>
          <h2 className="text-h2 text-[var(--color-text-primary)] leading-[1.1] mb-4">
            {t.contact.title}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed mb-10">
            {t.contact.subtitle}
          </p>

          <div className="space-y-6">
            {contactInfo.map(({ icon, label, value, href }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-subtle)] flex items-center justify-center text-[var(--color-brand-primary)] shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="text-[0.9375rem] text-[var(--color-text-secondary)] font-medium hover:text-[var(--color-brand-primary)] transition-colors whitespace-pre-line"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-[0.9375rem] text-[var(--color-text-secondary)] font-medium whitespace-pre-line">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        {/* TANDA 5 (HI-7) — barrido lateral x:80 sustituido por fade-up
            discreto translateY 14px. */}
        <motion.div
          className="bg-[var(--color-bg-surface)] rounded-2xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {sent ? (
            /* TANDA 4 (#37) — bloque de éxito anunciado por el lector de pantalla. */
            <div role="status" aria-live="polite" className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[var(--color-bg-subtle)] flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-brand-primary)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                  aria-hidden
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-h3 text-[var(--color-text-primary)]">{t.contact.sent}</h3>
              <p className="text-[var(--color-text-secondary)] text-sm max-w-xs">
                {t.contact.sentSubtitle}
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); setErrors({}); }}
                className="text-sm font-semibold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-hover)] transition-colors mt-2"
              >
                {t.contact.sendAnother}
              </button>
            </div>
          ) : (
            /* #38 — noValidate: la validación nativa se sustituye por la
               accesible (aria-invalid + aria-describedby); required se mantiene. */
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FocusField>
                  <label htmlFor="name" className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                    {t.contact.nameLabel} *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    enterKeyHint="next"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t.contact.namePlaceholder}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClass}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-[var(--color-error)]">
                      {errors.name}
                    </p>
                  )}
                </FocusField>
                <FocusField>
                  <label htmlFor="email" className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                    {t.contact.emailLabel} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputClass}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-[var(--color-error)]">
                      {errors.email}
                    </p>
                  )}
                </FocusField>
              </div>
              <FocusField>
                <label htmlFor="subject" className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                  {t.contact.subjectLabel} *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  enterKeyHint="next"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder={t.contact.subjectPlaceholder}
                  aria-invalid={errors.subject ? true : undefined}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  className={inputClass}
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1.5 text-xs text-[var(--color-error)]">
                    {errors.subject}
                  </p>
                )}
              </FocusField>
              <FocusField>
                <label htmlFor="message" className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  enterKeyHint="send"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t.contact.messagePlaceholder}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`${inputClass} resize-none`}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-xs text-[var(--color-error)]">
                    {errors.message}
                  </p>
                )}
              </FocusField>
              {/* TANDA 5 (HI-8) — botón submit: color de marca plano (antes
                  gradiente rojo→naranja); hover sobrio de color, sin opacidad. */}
              <button
                type="submit"
                /* rounded-md = 8px — radio de botones unificado (decisión #3). */
                className="w-full py-3 rounded-md text-sm font-bold text-white bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-pressed)] transition-colors duration-200 cursor-pointer"
              >
                {t.contact.send}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
