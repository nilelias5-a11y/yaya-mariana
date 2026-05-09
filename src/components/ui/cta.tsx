"use client";

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
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-4" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
          {t.cta.title}<br />
          <em className="italic text-[#f5c6c2]">{t.cta.titleEm}</em>
        </h2>
        <p className="text-white/70 text-[0.9375rem] leading-relaxed mb-8 max-w-md mx-auto">
          {t.cta.subtitle}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="/checkout"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#c0392b] text-sm font-bold px-8 py-3.5 rounded-full hover:bg-[#fdf0ef] transition-colors shadow-lg"
          >
            {t.cta.buyNow}
          </a>
          <a
            href="#sobre-nosotros"
            className="inline-flex items-center gap-2 border-2 border-white/60 text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
          >
            {t.cta.ourStory}
          </a>
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
