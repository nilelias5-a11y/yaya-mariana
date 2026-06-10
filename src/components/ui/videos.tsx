"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

/* T7 — "El cuidado que merecen": apartado sobrio con vídeos del fundador
   (J. Elías). Placeholders a la espera del material real.
   Tono discreto, sin protagonismo y sin imágenes de personas (HARD RULE).
   Aditivo: sección entre AboutUs y Values, fondo crema canónico.

   FASE A.5 · T1 — Reducción de protagonismo: pasa de una rejilla 2×2 de
   tarjetas grandes a una fila compacta de 4 miniaturas pequeñas
   (1 col móvil → 2 col sm → 4 col lg), contenedor más estrecho (max-w-4xl)
   y cabecera más sobria. Mismo contenido e i18n, sólo redistribuido para
   que se sienta como "un detalle más", no como una sección protagonista. */

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
      className="relative bg-[#fdf6f5] py-14 px-6"
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

      <div className="max-w-4xl mx-auto">
        {/* Cabecera compacta — más sobria que la versión anterior
            (eyebrow + título reducido + subtítulo en una línea discreta). */}
        <div className="text-center mb-8">
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-2.5">
            {t.videos.eyebrow}
          </span>
          <motion.div
            aria-hidden
            className="mx-auto mb-2.5"
            style={{ width: 36, height: 1, backgroundColor: "rgba(192,57,43,0.22)", transformOrigin: "center" }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.52, ease: EASE_WARM_LUX }}
          />
          <h2
            id="videos-heading"
            className="heading-balanced font-serif text-2xl md:text-3xl text-[#1a0808]"
          >
            {t.videos.title}
          </h2>
          <p className="mt-2 text-[#7a3a3a]/60 max-w-md mx-auto text-sm leading-relaxed">
            {t.videos.subtitle}
          </p>
        </div>

        {/* Fila compacta de miniaturas — 1 col en móvil (se mantiene),
            2 col en sm, 4 col en lg. Cada tarjeta es pequeña y discreta. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.videos.items.map(({ title, duration }, i) => (
            <motion.article
              key={title}
              aria-label={`${title} · ${duration} (${t.videos.comingSoon})`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm"
              style={{ border: "1px solid rgba(245,198,194,0.6)" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: EASE_WARM_LUX }}
            >
              {/* Miniatura placeholder — gradiente cálido, sin imágenes de
                  personas. Glifo play decorativo (más pequeño) + chip de
                  duración. Badge "Próximamente" sólo en la primera para no
                  recargar la fila. */}
              <div
                className="relative aspect-video flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #fdf0ef 0%, #f5c6c2 55%, #e8a090 100%)",
                }}
              >
                <span
                  aria-hidden
                  className="flex items-center justify-center rounded-full text-white shadow-md transition-transform duration-300 group-hover:scale-105"
                  style={{ width: 38, height: 38, backgroundColor: "rgba(192,57,43,0.92)", paddingLeft: 2 }}
                >
                  <PlayGlyph className="w-4 h-4" />
                </span>

                {i === 0 && (
                  <span
                    className="absolute top-2 left-2 text-[0.6rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#7a1a1a" }}
                  >
                    {t.videos.comingSoon}
                  </span>
                )}

                {/* Chip duración */}
                <span
                  className="absolute bottom-2 right-2 numerals-tabular text-[0.65rem] font-semibold px-1.5 py-0.5 rounded text-white"
                  style={{ backgroundColor: "rgba(26,8,8,0.55)" }}
                >
                  {duration}
                </span>
              </div>

              {/* Pie compacto — sólo título + duración, sin botón "Ver"
                  (el glifo play ya comunica el formato vídeo). */}
              <div className="px-3 py-2.5">
                <h3 className="font-serif text-[0.95rem] text-[#1a0808] leading-snug">
                  {title}
                </h3>
                <p className="text-[0.7rem] text-[#7a3a3a]/50 mt-0.5 numerals-tabular flex items-center gap-1">
                  <PlayGlyph className="w-2.5 h-2.5 text-[#c0392b]/70" />
                  {t.videos.watch} · {duration}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
