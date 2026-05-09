"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const ICONS = [
  // Vitamina C — hoja/planta
  <svg key="leaf" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M12 22V12" />
    <path d="M12 12C12 7 7 3 3 3c0 5 3 9 9 9z" />
    <path d="M12 12c0-5 5-9 9-9-0 5-3 9-9 9z" />
  </svg>,
  // Hidratación — gota de agua
  <svg key="drop" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z" />
  </svg>,
  // Cero pesticidas — escudo con check
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>,
  // Huella mínima — hoja con círculo
  <svg key="eco" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 17v-5" />
    <path d="M12 12c0-3 2.5-5 5-5-0 3-2 5-5 5z" />
    <path d="M12 12c0-3-2.5-5-5-5 0 3 2 5 5 5z" />
  </svg>,
  // Antioxidantes — corazón
  <svg key="heart" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>,
  // Sabor intenso — estrella
  <svg key="star" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>,
];

export default function Values() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#fdf0ef] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-3">
            {t.values.eyebrow}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1a0808]">
            {t.values.title}
          </h2>
          <p className="mt-3 text-[#7a3a3a]/65 max-w-md mx-auto text-[0.9375rem] leading-relaxed">
            {t.values.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.values.benefits.map(({ title, description }, i) => (
            <motion.div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(192,57,43,0.18)", transition: { duration: 0.2, ease: "easeOut" } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-[10deg] transition-transform duration-200">
                {ICONS[i]}
              </div>
              <h3 className="font-serif text-xl text-[#1a0808] mb-2">{title}</h3>
              <p className="text-sm text-[#7a3a3a]/65 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
