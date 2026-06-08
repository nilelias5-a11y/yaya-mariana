"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

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

        {/* CTA chat IA — al final de las FAQ, para quien no encuentre su pregunta.
            Estilo secundario (border terracota 40%, no botón sólido) para no
            competir con los CTAs principales "Ver tienda" del nav/Hero. Hover
            halo cream-rosa (mismo patrón socials footer). */}
        <div className="mt-12 md:mt-14 text-center">
          <p
            className="font-serif italic"
            style={{ fontSize: "0.95rem", color: "#7a3a3a" }}
          >
            {t.faq.chatPrompt}
          </p>
          <a
            href={buildWhatsAppUrl(t.whatsapp.message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.whatsapp.cta}
            className="mt-4 inline-flex items-center justify-center gap-2 px-5 min-h-[44px] rounded-md text-sm font-semibold transition-all duration-200 hover:bg-[rgba(245,198,194,0.18)] focus-visible:bg-[rgba(245,198,194,0.25)] motion-safe:hover:shadow-[0_0_0_5px_rgba(232,196,191,0.22)]"
            style={{
              color: "#c0392b",
              border: "1px solid rgba(192,57,43,0.42)",
              backgroundColor: "transparent",
            }}
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
            </svg>
            {t.whatsapp.cta}
          </a>
        </div>
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
