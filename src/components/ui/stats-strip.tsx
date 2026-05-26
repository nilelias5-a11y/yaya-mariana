"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const STATS = [
  {
    value: "100%",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z" />
      </svg>
    ),
  },
  {
    value: "0",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <circle cx="12" cy="12" r="9" />
        <line x1="5.64" y1="5.64" x2="18.36" y2="18.36" />
      </svg>
    ),
  },
  {
    value: "24h",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
      </svg>
    ),
  },
  {
    value: "+",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <rect x="2" y="7" width="14" height="11" rx="1" />
        <path d="M16 10h3l3 4v4h-6V10z" />
        <circle cx="6.5" cy="18.5" r="1.5" />
        <circle cx="18.5" cy="18.5" r="1.5" />
      </svg>
    ),
  },
];

/** Warm-lux easing canónico para los enhancements aditivos. */
const EASE_WARM_LUX: [number, number, number, number] = [0.19, 1, 0.22, 1];

/**
 * Parsea un string de valor numérico y devuelve { numeric, suffix }.
 * "100%" → { numeric: "100", suffix: "%" }
 * "24h"  → { numeric: "24",  suffix: "h" }
 * "0"    → { numeric: "0",   suffix: "" }
 * "+"    → { numeric: "",    suffix: "+" }
 */
function parseValue(raw: string): { numeric: string; suffix: string } {
  const match = raw.match(/^(\d+)([%h]?)(.*)$/);
  if (!match) return { numeric: "", suffix: raw };
  const [, numeric, unitSuffix, rest] = match;
  return { numeric, suffix: unitSuffix + rest };
}

function AnimatedValue({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [displayNum, setDisplayNum] = useState("0");

  const { numeric, suffix } = parseValue(raw);
  const isStyledSuffix = suffix === "%" || suffix === "h";

  useEffect(() => {
    if (!numeric) {
      setDisplayNum("");
      return;
    }
    if (!inView) return;

    const target = parseInt(numeric, 10);
    const duration = 1400;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayNum(String(Math.round(eased * target)));
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [inView, numeric]);

  return (
    <span ref={ref}>
      {numeric ? displayNum : ""}
      {suffix ? (
        isStyledSuffix ? (
          <span className="unit-suffix">{suffix}</span>
        ) : (
          suffix
        )
      ) : null}
    </span>
  );
}

export default function StatsStrip() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#5c1a1a] text-white py-14 px-6">
      {/* CD-02 — Hairline top edge: gradiente luz blanca, entrada animada */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
          transformOrigin: "center",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.62, ease: EASE_WARM_LUX }}
      />

      {/* CD-02 — Hairline bottom edge */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)",
          transformOrigin: "center",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.62, delay: 0.08, ease: EASE_WARM_LUX }}
      />

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
        {STATS.map(({ value, icon }, i) => (
          <div key={i} className="relative">
            {/* VP-02 — Divisor vertical interno (md+, excepto último ítem) */}
            {i < STATS.length - 1 && (
              <span
                aria-hidden
                className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px"
                style={{
                  height: "50%",
                  background: "rgba(255,255,255,0.07)",
                }}
              />
            )}

            {/* AP-05 — motion.div con easing warm-lux y delay refinado */}
            <motion.div
              className="flex flex-col items-center text-center gap-2"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: i * 0.12, ease: EASE_WARM_LUX }}
              whileHover={{ scale: 1.08, filter: "brightness(1.3)" }}
              style={{ cursor: "default" }}
            >
              {/* AP-05 — Icono con entrada escalonada 150ms tras el contenedor */}
              <motion.div
                className="text-[#e74c3c]"
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.12 + 0.15,
                  ease: EASE_WARM_LUX,
                }}
              >
                {icon}
              </motion.div>

              <span className="numerals-tabular font-serif text-[3.25rem] font-bold leading-none mt-1">
                <AnimatedValue raw={value} />
              </span>
              <span className="text-sm text-white/65 leading-snug max-w-[14ch]">
                {t.stats.labels[i]}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
