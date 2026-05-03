"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const CONTACT_INFO = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    label: "Dirección",
    value: "C/ Electrónica, 19, Planta 10, oficina D\n08915, Badalona, España",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "info@yaya-mariana.com",
    href: "mailto:info@yaya-mariana.com",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4 2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Teléfono",
    value: "+34 666 777 888",
    href: "tel:+34666777888",
  },
];

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

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
        <div>
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            Hablemos
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1a0808] leading-[1.1] mb-4">
            Contacta con nosotros
          </h2>
          <p className="text-[#7a3a3a]/65 text-[0.9375rem] leading-relaxed mb-10">
            ¿Tienes preguntas sobre nuestros productos, envíos o quieres hacer un pedido
            especial? Estamos aquí para ayudarte.
          </p>

          <div className="space-y-6">
            {CONTACT_INFO.map(({ icon, label, value, href }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#fdf0ef] flex items-center justify-center text-[#c0392b] shrink-0">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#7a3a3a]/50 uppercase tracking-wide mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="text-[0.9375rem] text-[#7a3a3a] font-medium hover:text-[#c0392b] transition-colors whitespace-pre-line"
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
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#fdf0ef] flex items-center justify-center text-3xl">
                ✅
              </div>
              <h3 className="font-serif text-2xl text-[#1a0808]">¡Mensaje enviado!</h3>
              <p className="text-[#7a3a3a]/65 text-sm max-w-xs">
                Gracias por contactarnos. Te responderemos en menos de 24 horas.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="text-sm font-semibold text-[#c0392b] hover:text-[#e74c3c] transition-colors mt-2"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase tracking-wide mb-1.5">
                    Nombre *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full border border-[#f5c6c2] rounded-xl px-4 py-2.5 text-sm text-[#7a3a3a] placeholder:text-[#7a3a3a]/35 focus:outline-none focus:ring-2 focus:ring-[#e74c3c]/40 focus:border-[#e74c3c] transition-colors bg-[#fdf6f5]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase tracking-wide mb-1.5">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full border border-[#f5c6c2] rounded-xl px-4 py-2.5 text-sm text-[#7a3a3a] placeholder:text-[#7a3a3a]/35 focus:outline-none focus:ring-2 focus:ring-[#e74c3c]/40 focus:border-[#e74c3c] transition-colors bg-[#fdf6f5]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase tracking-wide mb-1.5">
                  Asunto *
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full border border-[#f5c6c2] rounded-xl px-4 py-2.5 text-sm text-[#7a3a3a] placeholder:text-[#7a3a3a]/35 focus:outline-none focus:ring-2 focus:ring-[#e74c3c]/40 focus:border-[#e74c3c] transition-colors bg-[#fdf6f5]"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-[#7a3a3a]/60 uppercase tracking-wide mb-1.5">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full border border-[#f5c6c2] rounded-xl px-4 py-2.5 text-sm text-[#7a3a3a] placeholder:text-[#7a3a3a]/35 focus:outline-none focus:ring-2 focus:ring-[#e74c3c]/40 focus:border-[#e74c3c] transition-colors bg-[#fdf6f5] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)",
                }}
              >
                Enviar mensaje
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
