"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

/* Warm-lux easing — mismo que AboutUs/process-steps */
const EASE_WARM: [number, number, number, number] = [0.19, 1, 0.22, 1];

export default function Timeline() {
  const { t } = useLanguage();
  const items = t.timeline.items;

  return (
    <section
      id="historia"
      aria-labelledby="timeline-heading"
      className="relative bg-[#fdf6f5] py-20 md:py-24 px-6"
    >
      {/* Hairline superior */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.10), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          className="text-center mb-14 md:mb-20 max-w-[640px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.72, ease: EASE_WARM }}
        >
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            {t.timeline.eyebrow}
          </span>
          {/* Divisor decorativo — coherente con AboutUs */}
          <div
            aria-hidden="true"
            className="mx-auto mb-4"
            style={{ width: 40, height: 1, backgroundColor: "rgba(192,57,43,0.22)" }}
          />
          <h2
            id="timeline-heading"
            className="font-serif italic text-[clamp(2rem,5vw,3rem)] text-[#1a0808] leading-[1.1]"
          >
            {t.timeline.title}
          </h2>
          <p className="text-[0.9375rem] text-[#7a3a3a] mt-4 leading-relaxed">
            {t.timeline.subtitle}
          </p>
        </motion.header>

        {/* ─── Desktop: 4 columnas con línea horizontal ─── */}
        <div className="hidden md:block relative">
          {/*
            La línea pasa a 16px desde el top del <li>:
            padding-top del li es 0, el dot tiene h-2 (8px) y está centrado
            en el contenedor flex. Calculamos: el dot vive en la parte alta
            de cada columna; top relativo al grid = 0. Usamos top: 3px para
            cortar exactamente por el centro del círculo de 8px (4px centro).
          */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 h-px pointer-events-none"
            style={{
              top: "3px",
              background: "rgba(192,57,43,0.18)",
            }}
          />
          <ol className="grid grid-cols-4 gap-6 relative" role="list">
            {items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{
                  duration: 0.75,
                  delay: i * 0.15,
                  ease: EASE_WARM,
                }}
                className="flex flex-col items-center text-center px-2"
              >
                {/* Dot terracota con halo al hover */}
                <span
                  aria-hidden="true"
                  className="relative flex h-2 w-2 items-center justify-center"
                >
                  <span
                    className="block h-2 w-2 rounded-full bg-[#c0392b] transition-shadow duration-300 hover:shadow-[0_0_0_5px_rgba(245,198,194,0.5)]"
                    style={{ flexShrink: 0 }}
                  />
                </span>

                <time
                  dateTime={item.year}
                  className="font-serif italic text-[#5c1a1a] mt-3 leading-none select-none"
                  style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)" }}
                >
                  {item.year}
                </time>

                <h3 className="font-serif italic text-[1.1rem] text-[#5c1a1a] mt-2 leading-snug">
                  {item.title}
                </h3>

                <p className="text-[0.875rem] text-[#7a3a3a] mt-2 leading-relaxed max-w-[20ch]">
                  {item.text}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* ─── Mobile: stack vertical con línea izquierda ─── */}
        <div className="md:hidden relative">
          {/* Línea vertical izquierda */}
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 w-px pointer-events-none"
            style={{
              left: "0.6875rem", /* 11px: center del dot de 8px con pl-10 (40px) → left real = 0 + 8px/2 - 0.5px ≈ 3px; ajuste visual */
              background: "rgba(192,57,43,0.18)",
            }}
          />
          <ol className="space-y-10" role="list">
            {items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.12,
                  ease: EASE_WARM,
                }}
                className="pl-9 relative"
              >
                {/* Dot sobre la línea */}
                <span
                  aria-hidden="true"
                  className="absolute h-2 w-2 rounded-full bg-[#c0392b]"
                  style={{ left: "0.4375rem", top: "0.75rem" }} /* 7px left: centra el dot de 8px sobre la línea en left:11px */
                />

                <time
                  dateTime={item.year}
                  className="font-serif italic text-[2rem] text-[#5c1a1a] leading-none block"
                >
                  {item.year}
                </time>

                <h3 className="font-serif italic text-[1.1rem] text-[#5c1a1a] mt-1 leading-snug">
                  {item.title}
                </h3>

                <p className="text-[0.875rem] text-[#7a3a3a] mt-1.5 leading-relaxed">
                  {item.text}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      {/* Hairline inferior */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.10), transparent)",
        }}
      />
    </section>
  );
}
