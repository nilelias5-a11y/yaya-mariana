"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <section id="sobre-nosotros" className="bg-white py-20 px-6">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
            <a
              href="/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c0392b] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#a93226] transition-colors"
            >
              {t.about.viewStore}
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#c0392b] hover:text-[#e74c3c] transition-colors"
            >
              {t.about.contact}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
