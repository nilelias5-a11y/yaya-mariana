"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import OrnamentBreath from "@/components/easter-eggs/ornament-breath";

/* Ver tienda → /checkout vía Next <Link> (navegación cliente; evita la
   recarga completa que vaciaba el carrito y reiniciaba el idioma). */
const MotionLink = motion.create(Link);

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    /* ENHANCE-3 — `relative` para anclar la capa de textura de papel
       absoluta sobre la seccion sin tocar fondo bg-white.
       CP-07 — `section-warm-veil` añade velo terracota 2% via ::before. */
    <section id="sobre-nosotros" className="relative section-warm-veil bg-white py-20 px-6">
      {/* ENHANCE-3 — Overlay textura de papel envejecido. SVG turbulence
          tintando hacia ink-warm (#7a3a3a) via mix-blend-multiply al 3%.
          Da sensacion de carta de receta, no de marketing. Cero impacto
          en motion ni interaccion (pointer-events: none). */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          mixBlendMode: "multiply",
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.478  0 0 0 0 0.227  0 0 0 0 0.227  0 0 0 1 0'/></filter><rect width='200' height='200' filter='url(%23p)'/></svg>\")",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative max-w-[720px] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ENHANCE-3 — Divisor decorativo superior 60x1px (#f5c6c2)
              centrado: marca de "abre-capitulo" antes del eyebrow. */}
          <div
            aria-hidden
            className="mx-auto mb-8"
            style={{ width: 60, height: 1, backgroundColor: "#f5c6c2" }}
          />

          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            {t.about.eyebrow}
          </span>
          <h2 className="heading-balanced font-serif text-4xl md:text-5xl text-[#1a0808] leading-[1.1] mb-6">
            {t.about.title}{" "}
            {/* ENHANCE-3 — Highlight wipe terracota sobre <em> del titulo
                (capa abs detras del texto, scaleX origin-left 820ms warm-lux
                al entrar en viewport). em mantiene su markup canonico. */}
            <em
              className="text-[#c0392b] not-italic italic"
              style={{ position: "relative", display: "inline-block" }}
            >
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.82, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
                style={{
                  position: "absolute",
                  inset: "0 -0.08em",
                  backgroundColor: "rgba(192,57,43,0.08)",
                  transformOrigin: "left center",
                  zIndex: 0,
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>
                {t.about.titleEm}
              </span>
            </em>
          </h2>
          {/* ENHANCE-3 — Drop cap en la primera letra del primer parrafo.
              Activado por .about-dropcap (regla en globals.css §ENHANCE-3).
              Solo afecta a `p:first-of-type`. */}
          <div className="about-dropcap body-pretty body-hyphens space-y-4 text-[#7a3a3a]/72 text-[0.9375rem] leading-relaxed">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>

          {/* ENHANCE-3 — Blockquote draw: el "border-l-[3px]" se sustituye
              por un motion.div absoluto que dibuja scaleY 0->1 origin-top
              al entrar el bloque, y la cita aparece con fade encadenado.
              Comillas tipograficas reales (curly) en lugar de straight. */}
          <blockquote className="relative mt-8 pl-5">
            <motion.div
              aria-hidden
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.76, ease: [0.19, 1, 0.22, 1] }}
              className="absolute left-0 top-0 bottom-0"
              style={{
                width: 3,
                backgroundColor: "#e74c3c",
                transformOrigin: "top center",
              }}
            />
            <motion.p
              className="italic text-[#7a3a3a] text-base leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.19, 1, 0.22, 1] }}
            >
              &ldquo;{t.about.quote}&rdquo;
            </motion.p>
            <footer className="mt-2 text-sm text-[#7a3a3a]/50 not-italic">
              — {t.about.quoteAuthor}
            </footer>
          </blockquote>

          {/* EE-01 — Glifo ornamental ❦ con aliento sostenido (hover/focus
              >=1.8s): rotación + fade warm-lux 2.2s, dedup sessionStorage.
              Extraído a OrnamentBreath para mantener el estado fuera del
              árbol de motion ya existente. */}
          <OrnamentBreath />

          <div className="mt-8 flex items-center gap-4">
            <MotionLink
              href="/checkout"
              className="inline-flex items-center gap-2 bg-[#c0392b] text-white text-sm font-semibold px-6 py-3 rounded-full"
              whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(192,57,43,0.35)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {t.about.viewStore}
            </MotionLink>
            <motion.a
              href="#contacto"
              className="relative inline-flex items-center gap-2 text-sm font-semibold text-[#c0392b] pb-[3px]"
              variants={{ rest: { x: 0 }, hover: { x: 4 } }}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {t.about.contact}
              <motion.span
                className="absolute bottom-0 left-0 h-[2px] bg-[#c0392b] w-full block"
                variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
