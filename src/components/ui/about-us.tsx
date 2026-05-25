"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <section id="sobre-nosotros" className="bg-white py-20 px-6">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            {t.about.eyebrow}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1a0808] leading-[1.1] mb-6">
            {t.about.title}{" "}
            <em className="text-[#c0392b] not-italic italic">{t.about.titleEm}</em>
          </h2>
          <div className="space-y-4 text-[#7a3a3a]/72 text-[0.9375rem] leading-relaxed">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>

          <blockquote className="mt-8 pl-5 border-l-[3px] border-[#e74c3c]">
            <p className="italic text-[#7a3a3a] text-base leading-relaxed">
              "{t.about.quote}"
            </p>
            <footer className="mt-2 text-sm text-[#7a3a3a]/50 not-italic">
              — {t.about.quoteAuthor}
            </footer>
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <motion.a
              href="/checkout"
              className="inline-flex items-center gap-2 bg-[#c0392b] text-white text-sm font-semibold px-6 py-3 rounded-full"
              whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(192,57,43,0.35)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {t.about.viewStore}
            </motion.a>
            <motion.a
              href="#contacto"
              className="relative inline-flex items-center gap-2 text-sm font-semibold text-[#c0392b] pb-[3px]"
              variants={{ rest: { x: 0 }, hover: { x: 4 } }}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {t.about.contact}
              <motion.span
                className="absolute bottom-0 left-0 h-[2px] bg-[#c0392b] w-full block"
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
