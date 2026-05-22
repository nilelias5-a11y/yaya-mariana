"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

function FocusField({ children }: { children: React.ReactNode }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      animate={{ scale: focused ? 1.01 : 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="contacto" className="bg-[#fdf6f5] py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-[#962a1f] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            {t.contact.eyebrow}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1a0808] leading-[1.1] mb-4">
            {t.contact.title}
          </h2>
          <p className="text-[#7a3a3a]/65 text-[0.9375rem] leading-relaxed mb-10">
            {t.contact.subtitle}
          </p>

          <div className="space-y-6">
            {contactInfo.map(({ icon, label, value, href }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#fdf0ef] flex items-center justify-center text-[#962a1f] shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#7a3a3a]/50 uppercase tracking-wide mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="text-[0.9375rem] text-[#7a3a3a] font-medium hover:text-[#962a1f] transition-colors whitespace-pre-line"
                    >
                      {value}
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

        {/* Form */}
        <motion.div
          className="bg-white rounded-2xl p-8 shadow-sm"
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#fdf0ef] flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#962a1f"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                  aria-hidden
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-[#1a0808]">{t.contact.sent}</h3>
              <p className="text-[#7a3a3a]/65 text-sm max-w-xs">
                {t.contact.sentSubtitle}
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="text-sm font-semibold text-[#962a1f] hover:text-[#b5341f] transition-colors mt-2"
              >
                {t.contact.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FocusField>
                  <label htmlFor="name" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase tracking-wide mb-1.5">
                    {t.contact.nameLabel} *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t.contact.namePlaceholder}
                    className="w-full border border-[#d8b8b4] rounded-xl px-4 py-2.5 text-sm text-[#7a3a3a] placeholder:text-[#7a3a3a]/35 focus:outline-none focus:ring-2 focus:ring-[#b5341f]/40 focus:border-[#b5341f] transition-colors bg-white"
                  />
                </FocusField>
                <FocusField>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase tracking-wide mb-1.5">
                    {t.contact.emailLabel} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full border border-[#d8b8b4] rounded-xl px-4 py-2.5 text-sm text-[#7a3a3a] placeholder:text-[#7a3a3a]/35 focus:outline-none focus:ring-2 focus:ring-[#b5341f]/40 focus:border-[#b5341f] transition-colors bg-white"
                  />
                </FocusField>
              </div>
              <FocusField>
                <label htmlFor="subject" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase tracking-wide mb-1.5">
                  {t.contact.subjectLabel} *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder={t.contact.subjectPlaceholder}
                  className="w-full border border-[#d8b8b4] rounded-xl px-4 py-2.5 text-sm text-[#7a3a3a] placeholder:text-[#7a3a3a]/35 focus:outline-none focus:ring-2 focus:ring-[#b5341f]/40 focus:border-[#b5341f] transition-colors bg-white"
                />
              </FocusField>
              <FocusField>
                <label htmlFor="message" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase tracking-wide mb-1.5">
                  {t.contact.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full border border-[#d8b8b4] rounded-xl px-4 py-2.5 text-sm text-[#7a3a3a] placeholder:text-[#7a3a3a]/35 focus:outline-none focus:ring-2 focus:ring-[#b5341f]/40 focus:border-[#b5341f] transition-colors bg-white resize-none"
                />
              </FocusField>
              <button
                type="submit"
                /* rounded-md = 8px — radio de botones unificado (decisión #3). */
                className="w-full py-3 rounded-md text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #962a1f 0%, #b5341f 100%)",
                }}
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
