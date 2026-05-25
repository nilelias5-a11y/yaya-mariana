"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section
      className="py-20 px-6 text-white text-center"
      style={{
        background: "linear-gradient(135deg, #5c1a1a 0%, #c0392b 50%, #a93226 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
          <span className="inline-block text-[#f5c6c2] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            {t.cta.eyebrow}
          </span>
          <motion.h2
            className="font-serif text-4xl md:text-5xl leading-[1.1] mb-4"
            style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {t.cta.title}<br />
            <em className="italic text-[#f5c6c2]">{t.cta.titleEm}</em>
          </motion.h2>
          <motion.p
            className="text-white/70 text-[0.9375rem] leading-relaxed mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {t.cta.subtitle}
          </motion.p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <motion.a
            href="/checkout"
            className="inline-flex items-center gap-2 bg-white text-[#c0392b] text-sm font-bold px-8 py-3.5 rounded-full shadow-lg"
            whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(0,0,0,0.25)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {t.cta.buyNow}
          </motion.a>
          <motion.a
            href="#sobre-nosotros"
            className="inline-flex items-center gap-2 border-2 border-white/60 text-white text-sm font-semibold px-8 py-3.5 rounded-full"
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.12)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {t.cta.ourStory}
          </motion.a>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex items-center justify-center gap-6 flex-wrap text-sm text-white/60">
          {[t.cta.badges.freeShipping, t.cta.badges.noPesticides, t.cta.badges.ownHarvest, t.cta.badges.returns].map((badge) => (
            <span key={badge} className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#e74c3c]">
                <path d="M8 1L10 6h5L11 9l2 5-5-3-5 3 2-5-4-3h5z" />
              </svg>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
