"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const STATS = [
  {
    value: "100%",
    icon: (
      /* TANDA 4 (#29) — SVG decorativo: aria-hidden para consistencia con values/contact. */
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8" aria-hidden>
        <path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z" />
      </svg>
    ),
  },
  {
    value: "0",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <line x1="5.64" y1="5.64" x2="18.36" y2="18.36" />
      </svg>
    ),
  },
  {
    value: "24h",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8" aria-hidden>
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
      </svg>
    ),
  },
  {
    value: "3",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden>
        <path d="M12 21v-9" />
        <path d="M12 12c0-3.3-2.7-6-6-6-.6 0-1 .4-1 1 0 3.3 2.7 6 6 6 .6 0 1-.4 1-1z" />
        <path d="M12 13c0-3.3 2.7-6 6-6 .6 0 1 .4 1 1 0 3.3-2.7 6-6 6-.6 0-1-.4-1-1z" />
      </svg>
    ),
  },
];

function AnimatedValue({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplay(raw);
      return;
    }
    if (!inView) return;
    // prefers-reduced-motion: salta el count-up, muestra el valor final.
    if (reduceMotion) {
      setDisplay(raw);
      return;
    }

    const [, numStr, suffix] = match;
    const target = parseInt(numStr, 10);
    /* TANDA 5 (ME-11) — count-up más lento y sereno: 1400 → 2200ms.
       Una cuenta pausada lee como reposo, no como reclamo comercial. */
    const duration = 2200;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * target) + suffix);
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [inView, raw, reduceMotion]);

  return <span ref={ref}>{display}</span>;
}

export default function StatsStrip() {
  const { t } = useLanguage();

  return (
    /* TANDA 1 — banda oscura: ritmo .section-deep (56→72px); ancho .container. */
    <section className="section-deep bg-[var(--color-bg-deep)] text-white">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
        {STATS.map(({ value, icon }, i) => (
          // TANDA 5 — entrada fade-up uniforme: distancia discreta 14px.
          <motion.div
            key={i}
            className="flex flex-col items-center text-center gap-2"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="text-[var(--color-brand-hover)]">{icon}</div>
            {/* TANDA 4 (#ME-12) — cifra responsive: en móvil (375px) baja a
                ~32px; escala fluida hasta 41.6px en escritorio. */}
            <span
              className="font-serif font-semibold leading-none mt-1"
              style={{ fontSize: "clamp(2rem, 6vw, 2.6rem)" }}
            >
              <AnimatedValue raw={value} />
            </span>
            <span className="text-sm text-[var(--color-text-on-deep)] leading-snug max-w-[14ch]">
              {t.stats.labels[i]}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
