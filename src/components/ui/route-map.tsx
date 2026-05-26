"use client";

import { useLanguage } from "@/context/language-context";

export default function RouteMap() {
  const { t } = useLanguage();
  return (
    <section className="relative bg-[#fdf6f5] py-14 md:py-16">
      {/* Hairline top */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.10), transparent)",
        }}
      />

      <div className="max-w-3xl mx-auto px-6 text-center">
        <p
          className="text-[#c0392b]/75 text-xs uppercase font-semibold"
          style={{ letterSpacing: "0.2em" }}
        >
          {t.routeMap.eyebrow}
        </p>
        <h3 className="font-serif italic text-[clamp(1.25rem,2.5vw,1.75rem)] text-[#5c1a1a] mt-3">
          {t.routeMap.title}
        </h3>

        <svg
          viewBox="0 0 800 120"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full max-w-2xl mx-auto mt-6 h-auto"
          aria-label={t.routeMap.svgAria}
          role="img"
        >
          <defs>
            <radialGradient id="route-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(245,198,194,0.6)" />
              <stop offset="100%" stopColor="rgba(245,198,194,0)" />
            </radialGradient>
          </defs>

          {/* Línea Bezier punteada que conecta ambos puntos */}
          <path
            d="M 100 60 Q 400 20 700 60"
            fill="none"
            stroke="rgba(192,57,43,0.45)"
            strokeWidth="1.5"
            strokeDasharray="2 4"
            strokeLinecap="round"
          />

          {/* Punto izquierdo: Tarragona */}
          <circle cx="100" cy="60" r="6" fill="#c0392b" />
          <text
            x="100"
            y="92"
            textAnchor="middle"
            fontFamily="var(--font-playfair)"
            fontStyle="italic"
            fontSize="14"
            fill="#5c1a1a"
          >
            {t.routeMap.tarragona}
          </text>

          {/* Punto derecho: tu mesa — halo difuminado + círculo */}
          <circle cx="700" cy="60" r="22" fill="url(#route-halo)" />
          <circle cx="700" cy="60" r="6" fill="#c0392b" />
          <text
            x="700"
            y="92"
            textAnchor="middle"
            fontFamily="var(--font-playfair)"
            fontStyle="italic"
            fontSize="14"
            fill="#5c1a1a"
          >
            {t.routeMap.yourTable}
          </text>
        </svg>

        <p className="text-[0.875rem] text-[#7a3a3a] mt-5 italic">
          {t.routeMap.delivery}
        </p>
      </div>

      {/* Hairline bottom */}
      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.08), transparent)",
        }}
      />
    </section>
  );
}
