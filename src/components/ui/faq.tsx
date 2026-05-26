"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";

const ChevronDown = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="w-5 h-5"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function FAQ() {
  const { t } = useLanguage();
  const items = t.faq.items;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative bg-[#fdf6f5] py-20 md:py-24"
      aria-labelledby="faq-heading"
    >
      {/* Hairline top */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.10), transparent)",
        }}
      />

      <div className="max-w-3xl mx-auto px-6">
        <header className="text-center mb-12">
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-3">
            {t.faq.eyebrow}
          </span>
          <div
            aria-hidden
            className="mx-auto mb-3"
            style={{
              width: 40,
              height: 1,
              backgroundColor: "rgba(192,57,43,0.22)",
            }}
          />
          <h2
            id="faq-heading"
            className="font-serif italic text-[clamp(2rem,5vw,3rem)] text-[#1a0808] leading-[1.1] mt-3"
          >
            {t.faq.title}
          </h2>
          <p className="text-[0.95rem] text-[#7a3a3a] mt-3 leading-relaxed">
            {t.faq.subtitle}
          </p>
        </header>

        <ul className="space-y-3" role="list">
          {items.map((item, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <li
                key={i}
                className="rounded-lg bg-white"
                style={{ border: "1px solid rgba(245,198,194,0.6)" }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${id}-panel`}
                  id={`${id}-trigger`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 min-h-[44px] text-[#1a0808] hover:bg-[rgba(245,198,194,0.12)] transition-colors rounded-lg"
                >
                  <span className="font-serif italic text-[1.05rem] leading-snug">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={`flex-shrink-0 motion-safe:transition-transform motion-safe:duration-200 ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "#c0392b" }}
                  >
                    <ChevronDown />
                  </span>
                </button>

                {/* Panel collapsible — grid-template-rows 1fr/0fr trick */}
                <div
                  id={`${id}-panel`}
                  role="region"
                  aria-labelledby={`${id}-trigger`}
                  className="grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[0.9375rem] text-[#5c1a1a] leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Hairline bottom */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.10), transparent)",
        }}
      />
    </section>
  );
}
