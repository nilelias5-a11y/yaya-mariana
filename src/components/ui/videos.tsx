"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

/* T7 — "El cuidado que merecen": apartado sobrio con vídeos del fundador
   (J. Elías). Placeholders 2×2 (1 columna en móvil) a la espera del
   material real: miniatura + título + duración + acción "Ver". Tono
   discreto, sin protagonismo y sin imágenes de personas (HARD RULE).
   Aditivo: sección nueva entre AboutUs y Values, fondo crema canónico. */

const EASE_WARM_LUX: [number, number, number, number] = [0.19, 1, 0.22, 1];

const PlayGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M8 5.14v13.72a1 1 0 0 0 1.5.87l11-6.86a1 1 0 0 0 0-1.74l-11-6.86A1 1 0 0 0 8 5.14z" />
  </svg>
);

export default function Videos() {
  const { t } = useLanguage();

  return (
    <section
      id="el-cuidado"
      className="relative bg-[#fdf6f5] py-20 px-6"
      aria-labelledby="videos-heading"
    >
      {/* Hairline superior — junta entre AboutUs (blanco) y esta sección. */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.10), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-3">
            {t.videos.eyebrow}
          </span>
          <motion.div
            aria-hidden
            className="mx-auto mb-3"
            style={{ width: 40, height: 1, backgroundColor: "rgba(192,57,43,0.22)", transformOrigin: "center" }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.52, ease: EASE_WARM_LUX }}
          />
          <h2
            id="videos-heading"
            className="heading-balanced font-serif text-4xl md:text-5xl text-[#1a0808]"
          >
            {t.videos.title}
          </h2>
          <p className="mt-3 text-[#7a3a3a]/65 max-w-md mx-auto text-[0.9375rem] leading-relaxed">
            {t.videos.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {t.videos.items.map(({ title, duration }, i) => (
            <motion.article
              key={title}
              className="bg-white rounded-2xl overflow-hidden shadow-sm"
              style={{ border: "1px solid rgba(245,198,194,0.6)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Miniatura placeholder — gradiente cálido, sin imágenes de
                  personas. Glifo play decorativo + badge "Próximamente" +
                  chip de duración. */}
              <div
                className="relative aspect-video flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #fdf0ef 0%, #f5c6c2 55%, #e8a090 100%)",
                }}
              >
                <span
                  aria-hidden
                  className="flex items-center justify-center rounded-full text-white shadow-md"
                  style={{ width: 56, height: 56, backgroundColor: "rgba(192,57,43,0.92)", paddingLeft: 3 }}
                >
                  <PlayGlyph className="w-6 h-6" />
                </span>

                {/* Badge próximamente */}
                <span
                  className="absolute top-3 left-3 text-[0.65rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#7a1a1a" }}
                >
                  {t.videos.comingSoon}
                </span>

                {/* Chip duración */}
                <span
                  className="absolute bottom-3 right-3 numerals-tabular text-[0.7rem] font-semibold px-2 py-0.5 rounded-md text-white"
                  style={{ backgroundColor: "rgba(26,8,8,0.55)" }}
                >
                  {duration}
                </span>
              </div>

              {/* Cuerpo */}
              <div className="p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-[1.15rem] text-[#1a0808] leading-snug">
                    {title}
                  </h3>
                  <p className="text-xs text-[#7a3a3a]/50 mt-0.5 numerals-tabular">{duration}</p>
                </div>
                {/* Acción "Ver" — deshabilitada hasta que exista el vídeo. */}
                <button
                  type="button"
                  disabled
                  aria-label={`${t.videos.watch} · ${title} (${t.videos.comingSoon})`}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-full text-sm font-semibold opacity-60 cursor-not-allowed"
                  style={{ color: "#c0392b", border: "1px solid rgba(192,57,43,0.42)" }}
                >
                  <PlayGlyph className="w-3.5 h-3.5" />
                  {t.videos.watch}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
