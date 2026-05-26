"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

function FocusField({ children }: { children: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      animate={{
        scale: focused ? 1.01 : 1,
        /* AP-04 — focus-glow warm terracota 12% */
        boxShadow: focused
          ? "0 0 0 3px rgba(192,57,43,0.12), 0 1px 6px rgba(192,57,43,0.08)"
          : "none",
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
        boxShadow: {
          duration: 0.22,
          ease: [0.6, 0.04, 0.24, 1],
        },
      }}
      style={{ borderRadius: "0.75rem" }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {children}
    </motion.div>
  );
}

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FieldName = keyof FormState;
type FieldErrors = Partial<Record<FieldName, string>>;

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
  /* AP-08 — chips entrada escalonada: estado que se activa cuando
     el panel de info entra en viewport (via onViewportEnter del
     motion.div padre), para propagar data-revealed a cada chip. */
  const [chipsRevealed, setChipsRevealed] = useState(false);
  /* a11y (#38) — validacion accesible: errores por campo asociados
     via aria-describedby; aria-invalid en los campos que fallan. */
  const [errors, setErrors] = useState<FieldErrors>({});

  /* Traduce el motivo de fallo de la Constraint Validation API a un
     mensaje propio. valueMissing -> required; typeMismatch (email) -> email. */
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
    /* #38 — el error se limpia en cuanto el campo pasa a ser valido. */
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
    /* #38 — Constraint Validation API: recolecta los campos invalidos
       sin reescribir el formulario; el `required` nativo se mantiene. */
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
    /* ENHANCE-5: section `relative` para anclar la capa de grano sutil
       (opacity 0.012, mismo turbulence que Hero pero al limite minimo) y
       el hairline de cierre antes del Footer.
       CP-08 — `section-cool-veil` añade velo maroon 2.5% via ::before. */
    <section id="contacto" className="relative section-cool-veil bg-[#fdf6f5] py-20 px-6">
      {/* Grano filmografico minimo, cose visualmente Hero <-> Contacto. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "multiply",
          opacity: 0.012,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")",
          backgroundRepeat: "repeat",
        }}
      />
      {/* Hairline de cierre antes del Footer (junta cromatica). */}
      <div
        aria-hidden
        className="absolute left-0 right-0 bottom-0 h-px"
        style={{ backgroundColor: "rgba(192,57,43,0.08)" }}
      />
      <div className="relative max-w-6xl mx-auto">
        {/* Divisor vertical decorativo entre columnas info/form (lg+ only).
            Centro horizontal, 70% de la altura del contenedor, color
            `rgba(192,57,43,0.08)`. Solo decorativo. */}
        <div
          aria-hidden
          className="hidden lg:block absolute left-1/2 top-[15%] bottom-[15%] -translate-x-1/2 w-px"
          style={{ backgroundColor: "rgba(192,57,43,0.08)" }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          onViewportEnter={() => setChipsRevealed(true)}
        >
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            {t.contact.eyebrow}
          </span>
          <h2 className="heading-balanced font-serif text-4xl md:text-5xl text-[#1a0808] leading-[1.1] mb-4">
            {t.contact.title}
          </h2>
          <p className="body-pretty text-[#7a3a3a]/65 text-[0.9375rem] leading-relaxed mb-10">
            {t.contact.subtitle}
          </p>

          <div className="space-y-6">
            {contactInfo.map(({ icon, label, value, href }, idx) => (
              /* AP-08 — entrada escalonada: cada chip usa .reveal con
                 transitionDelay 0/100/200ms; data-revealed se activa
                 cuando el panel padre entra en viewport. */
              <div
                key={label}
                className="flex gap-4 reveal"
                data-revealed={chipsRevealed ? "true" : undefined}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* ENHANCE-5: icon chip con borde 1px cream-rosa que lo separa
                    del fondo `#fdf6f5` (antes solo confiaba en bg-[#fdf0ef]
                    casi-igual al de la seccion). */}
                <div
                  className="w-10 h-10 rounded-xl bg-[#fdf0ef] flex items-center justify-center text-[#c0392b] shrink-0"
                  style={{ border: "1px solid #f5c6c2" }}
                >
                  {icon}
                </div>
                <div>
                  {/* TM-10 — label-caps: letter-spacing 0.10em + cpsp
                      (sobrescribe tracking-wide 0.025em de Tailwind) */}
                  <p className="text-xs font-semibold text-[#7a3a3a]/50 uppercase mb-0.5 label-caps">
                    {label}
                  </p>
                  {href ? (
                    /* ENHANCE-5: a[mailto|tel] hover/focus underline hairline
                        scaleX origin-left + tinte terracota en focus-within.
                        Implementado con utility tailwind para mantener todo
                        en la clase y no acoplar a framer-motion. */
                    <a
                      href={href}
                      className="relative inline-block text-[0.9375rem] text-[#7a3a3a] font-medium hover:text-[#c0392b] focus-visible:text-[#c0392b] transition-colors whitespace-pre-line outline-none group/link"
                    >
                      {value}
                      <span
                        aria-hidden
                        className="absolute left-0 right-0 -bottom-0.5 h-px scale-x-0 group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100 transition-transform duration-300 origin-left"
                        style={{ backgroundColor: "rgba(192,57,43,0.7)" }}
                      />
                    </a>
                  ) : (
                    <p className="text-[0.9375rem] text-[#7a3a3a] font-medium whitespace-pre-line">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form — ENHANCE-5: definicion de papeleria. Border cream-rosa
            70% alpha + inset shadow blanco 80% para sensacion impresa. */}
        <motion.div
          className="bg-white rounded-2xl p-8"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            border: "1px solid rgba(245,198,194,0.7)",
            /* CP-06 — segunda capa cream-rosa superior-izquierda +
               capas existentes terracota 4% e inset blanco 80%. */
            boxShadow:
              "0 -1px 8px rgba(245,198,194,0.10), 0 1px 0 rgba(255,255,255,0.8) inset, 0 1px 12px rgba(192,57,43,0.04)",
          }}
        >
          {sent ? (
            /* a11y (#37) — bloque de exito anunciado por lectores de pantalla. */
            <div role="status" aria-live="polite" className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#fdf0ef] flex items-center justify-center text-3xl" aria-hidden>
                ✅
              </div>
              <h3 className="font-serif text-2xl text-[#1a0808]">{t.contact.sent}</h3>
              <p className="text-[#7a3a3a]/65 text-sm max-w-xs">
                {t.contact.sentSubtitle}
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); setErrors({}); }}
                className="text-sm font-semibold text-[#c0392b] hover:text-[#e74c3c] transition-colors mt-2"
              >
                {t.contact.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FocusField>
                  <label htmlFor="name" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase mb-1.5 label-caps">
                    {t.contact.nameLabel} · *
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
                    className="w-full border border-[#f5c6c2] rounded-xl px-4 py-3 text-base text-[#7a3a3a] focus:outline-none focus:border-[#e74c3c] transition-colors bg-[#fdf6f5]"
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-[#b91c1c]">{errors.name}</p>
                  )}
                </FocusField>
                <FocusField>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase mb-1.5 label-caps">
                    {t.contact.emailLabel} · *
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
                    className="w-full border border-[#f5c6c2] rounded-xl px-4 py-3 text-base text-[#7a3a3a] focus:outline-none focus:border-[#e74c3c] transition-colors bg-[#fdf6f5]"
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-[#b91c1c]">{errors.email}</p>
                  )}
                </FocusField>
              </div>
              <FocusField>
                <label htmlFor="subject" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase mb-1.5 label-caps">
                  {t.contact.subjectLabel} · *
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
                  className="w-full border border-[#f5c6c2] rounded-xl px-4 py-3 text-base text-[#7a3a3a] focus:outline-none focus:border-[#e74c3c] transition-colors bg-[#fdf6f5]"
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1.5 text-xs text-[#b91c1c]">{errors.subject}</p>
                )}
              </FocusField>
              <FocusField>
                <label htmlFor="message" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase mb-1.5 label-caps">
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
                  className="w-full border border-[#f5c6c2] rounded-xl px-4 py-2.5 text-sm text-[#7a3a3a] focus:outline-none focus:border-[#e74c3c] transition-colors bg-[#fdf6f5] resize-none"
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-xs text-[#b91c1c]">{errors.message}</p>
                )}
              </FocusField>
              {/* AP-09 — micro-lift: y:-2 + shadow expansion on hover */}
              <motion.button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
                }}
                whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(192,57,43,0.32)" }}
                whileTap={{ scale: 0.98, y: 0 }}
                transition={{ duration: 0.22, ease: [0.6, 0.04, 0.24, 1] }}
              >
                {t.contact.send}
              </motion.button>
            </form>
          )}
        </motion.div>
        </div>
      </div>
    </section>
  );
}
