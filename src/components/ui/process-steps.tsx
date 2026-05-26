"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/language-context";

/* SVG icons — sobrios, stroke 1.5, 24×24, color de marca al 60%. */
const ICONS = [
  /* 1. Siembra — semilla con brote */
  <svg key="seed" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.6)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-6 h-6">
    <ellipse cx="12" cy="15" rx="5" ry="3.5" />
    <path d="M12 11.5V5" />
    <path d="M9.5 7.5C9.5 5.5 11 4 12 4c1 0 2.5 1.5 2.5 3.5" />
  </svg>,
  /* 2. Cuidado natural — hoja simple */
  <svg key="leaf" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.6)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-6 h-6">
    <path d="M12 21V11" />
    <path d="M12 11C12 6 7 3 3 3c0 5 3 9.5 9 8z" />
    <path d="M12 11c0-5 5-8 9-8 0 5-3 9.5-9 8z" />
  </svg>,
  /* 3. Recogida en su punto — mano abierta */
  <svg key="hand" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.6)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-6 h-6">
    <path d="M18 11V8a2 2 0 0 0-4 0" />
    <path d="M14 10.5V7a2 2 0 0 0-4 0v1" />
    <path d="M10 10V6a2 2 0 0 0-4 0v5" />
    <path d="M6 11v2a6 6 0 0 0 12 0v-3a2 2 0 0 0-4 0" />
  </svg>,
  /* 4. Cadena de frío — copo de nieve */
  <svg key="snowflake" viewBox="0 0 24 24" fill="none" stroke="rgba(192,57,43,0.6)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-6 h-6">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>,
];

export default function ProcessSteps() {
  const { t } = useLanguage();
  const listRef = useRef<HTMLOListElement>(null);

  /* Reveal escalonado: IntersectionObserver sobre la <ol>;
     cuando entra en viewport activa data-revealed en cada <li>
     con el delay inline ya definido. Reduced-motion gateado en CSS. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>("li.reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            items.forEach((item) => item.setAttribute("data-revealed", "true"));
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 },
    );
    io.observe(list);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section-warm-veil relative bg-[#fdf6f5] py-20 px-6" id="proceso">
      {/* Hairline superior de sección */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.10), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-3">
            {t.process.eyebrow}
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
          <h2 className="heading-balanced font-serif text-4xl md:text-5xl text-[#1a0808]">
            {t.process.title}
          </h2>
          <p className="mt-3 text-[#7a3a3a]/65 max-w-md mx-auto text-[0.9375rem] leading-relaxed body-pretty">
            {t.process.subtitle}
          </p>
        </div>

        {/* Steps grid */}
        <ol
          ref={listRef}
          className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6"
        >
          {t.process.steps.map((step, i) => (
            <li
              key={i}
              className="reveal flex flex-col items-center text-center"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Número grande Playfair italic, tenue */}
              <span
                aria-hidden="true"
                className="font-serif italic leading-none select-none"
                style={{
                  fontSize: "clamp(4rem, 8vw, 6rem)",
                  color: "rgba(192,57,43,0.22)",
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icono SVG sobrio */}
              <span className="mb-3 mt-1">{ICONS[i]}</span>

              {/* Título Playfair italic */}
              <h3 className="serif-italic-quote font-serif text-xl text-[#1a0808] mb-2">
                {step.title}
              </h3>

              {/* Descripción Inter */}
              <p className="text-sm text-[#7a3a3a]/65 leading-relaxed body-pretty max-w-[22ch] mx-auto">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        {/* Hairline divisor sutil al final */}
        <div
          aria-hidden
          className="mt-16 mx-auto"
          style={{
            height: 1,
            maxWidth: "30rem",
            background:
              "linear-gradient(to right, transparent, rgba(192,57,43,0.12), transparent)",
          }}
        />
      </div>

      {/* Hairline inferior de sección */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.10), transparent)",
          zIndex: 1,
        }}
      />
    </section>
  );
}
