"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { season } from "@/lib/season";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Variante en temporada — oferta comercial habitual. */
function InSeasonCTA() {
  const { t } = useLanguage();

  return (
    <>
      <span className="inline-block text-[#f5c6c2] text-xs font-bold uppercase tracking-[0.18em] mb-4">
        {t.cta.eyebrow}
      </span>
      <motion.h2
        className="font-serif text-4xl md:text-5xl leading-[1.1] mb-4"
        style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: EASE_OUT }}
      >
        {t.cta.title}<br />
        <em className="italic text-[#f5c6c2]">{t.cta.titleEm}</em>
      </motion.h2>
      <motion.p
        className="text-[var(--color-text-on-brand)] text-[0.9375rem] leading-relaxed mb-8 max-w-md mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, delay: 0.15, ease: EASE_OUT }}
      >
        {t.cta.subtitle}
      </motion.p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <motion.a
          href="/checkout"
          /* rounded-md = 8px — radio de botones unificado (decisión #3). */
          className="inline-flex items-center gap-2 bg-white text-[#962a1f] text-sm font-bold px-8 py-3 rounded-md shadow-lg"
          whileHover={{ scale: 1.04, boxShadow: "0 12px 32px rgba(0,0,0,0.25)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {t.cta.buyNow}
        </motion.a>
        <motion.a
          href="#sobre-nosotros"
          className="inline-flex items-center gap-2 border-2 border-white/60 text-white text-sm font-semibold px-8 py-3 rounded-md"
          whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.12)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {t.cta.ourStory}
        </motion.a>
      </div>

      {/* M4 — micro-bloque cold-chain: trazabilidad logística de la entrega. */}
      <div className="mt-7 flex items-center justify-center gap-2.5 flex-wrap text-xs text-[var(--color-text-on-brand)]">
        {t.cta.coldChain.map((item, i) => (
          <span key={item} className="flex items-center gap-2.5">
            {i > 0 && <span aria-hidden className="text-white/30">·</span>}
            {item}
          </span>
        ))}
      </div>

      {/* Trust badges */}
      <div className="mt-8 flex items-center justify-center gap-6 flex-wrap text-sm text-[var(--color-text-on-brand)]">
        {[t.cta.badges.freeShipping, t.cta.badges.noPesticides, t.cta.badges.ownHarvest, t.cta.badges.returns].map((badge) => (
          <span key={badge} className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#b5341f]">
              <path d="M8 1L10 6h5L11 9l2 5-5-3-5 3 2-5-4-3h5z" />
            </svg>
            {badge}
          </span>
        ))}
      </div>
    </>
  );
}

/* M5 — variante off-season: la oferta comercial se sustituye por una
   captura de email para avisar de la próxima cosecha.
   · consentimiento DESMARCADO por defecto (RGPD).
   · double opt-in: el envío aquí es el primer paso; la página de
     confirmación por email es entregable de una fase posterior. */
function OffSeasonCTA() {
  const { t } = useLanguage();
  const o = t.cta.offSeason;
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="#f5c6c2" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
          {o.sentTitle}
        </h2>
        <p className="text-[var(--color-text-on-brand)] text-[0.9375rem] leading-relaxed max-w-md mx-auto">
          {o.sentSubtitle}
        </p>
      </div>
    );
  }

  return (
    <>
      <span className="inline-block text-[#f5c6c2] text-xs font-bold uppercase tracking-[0.18em] mb-4">
        {o.eyebrow}
      </span>
      <motion.h2
        className="font-serif text-4xl md:text-5xl leading-[1.1] mb-4"
        style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, ease: EASE_OUT }}
      >
        {o.title}<br />
        <em className="italic text-[#f5c6c2]">
          {o.titleEm} {t.months[season.nextHarvestMonth]}
        </em>
      </motion.h2>
      <motion.p
        className="text-[var(--color-text-on-brand)] text-[0.9375rem] leading-relaxed mb-8 max-w-md mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.75, delay: 0.15, ease: EASE_OUT }}
      >
        {o.subtitle}
      </motion.p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={o.emailPlaceholder}
            aria-label={o.emailLabel}
            className="flex-1 rounded-full bg-white px-5 py-3 text-sm text-[#1a0808] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-white/70"
          />
          <button
            type="submit"
            /* rounded-md = 8px — radio de botones unificado (decisión #3). */
            className="inline-flex items-center justify-center bg-white text-[#962a1f] text-sm font-bold px-7 py-3 rounded-md shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            {o.notify}
          </button>
        </div>
        <label className="mt-4 flex items-start gap-2.5 text-left text-xs text-[var(--color-text-on-brand)] leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 w-4 h-4 shrink-0 accent-[#962a1f] cursor-pointer"
          />
          <span>{o.consent}</span>
        </label>
      </form>
    </>
  );
}

export default function CTA() {
  return (
    /* TANDA 1 — banda oscura: ritmo .section-deep; ancho editorial .container-prose. */
    <section
      className="section-deep text-white text-center"
      style={{
        background: "linear-gradient(135deg, #5c1a1a 0%, #962a1f 50%, #7a1f17 100%)",
      }}
    >
      <div className="container-prose">
        {season.isOffSeason ? <OffSeasonCTA /> : <InSeasonCTA />}
      </div>
    </section>
  );
}
