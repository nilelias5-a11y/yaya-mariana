"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    /* TANDA 1 — ritmo .section; ancho editorial .container-prose (720px). */
    <section id="sobre-nosotros" className="section bg-white">
      <div className="container-prose">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-[var(--color-brand-primary)] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            {t.about.eyebrow}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--color-text-primary)] leading-[1.1] mb-6">
            {t.about.title}{" "}
            <em className="italic text-[var(--color-brand-primary)]">{t.about.titleEm}</em>
          </h2>
          <div className="space-y-4 text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>

          {/* Bloque tributo — slot de retrato + cita.
              Slot de retrato: tratamiento tipográfico (Path fallback).
              Foto de archivo familiar pendiente; NUNCA imagen IA de Mariana. */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch gap-5">
            <div className="shrink-0 w-full sm:w-[160px] h-[150px] sm:h-auto flex items-center justify-center bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] px-5 py-6">
              <span className="font-serif italic text-[1.75rem] leading-tight text-[var(--color-brand-primary)]">
                Mariana
              </span>
            </div>
            <blockquote className="flex-1 pl-5 border-l-[3px] border-[var(--color-brand-primary)] flex flex-col justify-center">
              <p className="font-serif italic text-[var(--color-text-primary)] text-lg leading-relaxed">
                &ldquo;{t.about.quote}&rdquo;
              </p>
              <footer className="mt-2 text-sm text-[var(--color-text-secondary)] not-italic">
                — {t.about.quoteAuthor}
              </footer>
            </blockquote>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <motion.a
              href="/checkout"
              /* rounded-md = 8px — radio de botones unificado (decisión #3). */
              className="inline-flex items-center gap-2 bg-[var(--color-brand-primary)] text-white text-sm font-semibold px-6 py-3 rounded-md"
              whileHover={{ scale: 1.06, boxShadow: "0 8px 24px rgba(150,42,31,0.35)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {t.about.viewStore}
            </motion.a>
            <motion.a
              href="#contacto"
              className="relative inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-primary)] pb-[3px]"
              variants={{ rest: { x: 0 }, hover: { x: 4 } }}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {t.about.contact}
              <motion.span
                className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-brand-primary)] w-full block"
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
