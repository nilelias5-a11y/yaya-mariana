"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
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

function AnimatedValue({ raw }: { raw: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplay(raw);
      return;
    }
    if (!inView) return;

    const [, numStr, suffix] = match;
    const target = parseInt(numStr, 10);
    const duration = 1400;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * target) + suffix);
      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [inView, raw]);

  return <span ref={ref}>{display}</span>;
}

export default function StatsStrip() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#5c1a1a] text-white py-14 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
        {STATS.map(({ value, icon }, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-2">
            <div className="text-[#e74c3c]">{icon}</div>
            <span className="font-serif text-[3.25rem] font-bold leading-none mt-1">
              <AnimatedValue raw={value} />
            </span>
            <span className="text-sm text-white/65 leading-snug max-w-[14ch]">
              {t.stats.labels[i]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
