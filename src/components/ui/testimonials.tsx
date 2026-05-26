"use client";

/* PLACEHOLDER REVIEWS — Replace with real reviews when available.
 *
 * Los 5 testimonios viven en `translations.ts` bajo `testimonials.items`
 * con perfiles genéricos creíbles (iniciales + ciudad + fecha). El UI no
 * mezcla copy con presentación: cuando lleguen reseñas reales (Trustpilot,
 * Google Reviews, etc.) bastará sustituir los strings de `testimonials.items`
 * en es/ca/en — el carrusel, animaciones y a11y se mantienen sin tocar.
 *
 * Disclaimer "reseñas de ejemplo" visible bajo el carrusel
 * (`testimonials.demo`) — coherente con el patrón La Nonna ReviewsWidget
 * y con el principio Nil "no exponer datos no confirmados".
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const AUTO_ROTATE_MS = 5000;
const WARM_LUX: [number, number, number, number] = [0.19, 1, 0.22, 1];

export default function Testimonials() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const items = t.testimonials.items;
  const total = items.length;

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* Detectar input principal sin hover (móvil/tablet). Si no hay hover,
     no auto-rotate (Nil: "auto-rotate gateado en touch, mismo patrón
     que Products"). */
  useEffect(() => {
    const mql = window.matchMedia("(hover: none)");
    const update = () => setIsTouch(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const go = useCallback(
    (next: number) => {
      const normalized = ((next % total) + total) % total;
      setDirection(normalized >= index ? 1 : -1);
      setIndex(normalized);
    },
    [index, total],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  /* Auto-rotate solo cuando: no touch + no reduced-motion + no pausa hover
     + más de 1 reseña. Cualquiera de esos blockers detiene el loop. */
  useEffect(() => {
    if (isTouch || reduceMotion || paused || total <= 1) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % total);
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [isTouch, reduceMotion, paused, total]);

  /* Keyboard navigation: ←/→ avanzan/retroceden cuando el carrusel tiene foco. */
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  const current = items[index];

  /* Variants para slide. En reduced-motion el slide se reduce a opacity
     puro (sin desplazamiento). */
  const slideVariants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
      };

  return (
    <section
      id="resenas"
      aria-labelledby="testimonials-heading"
      className="relative bg-[#fdf6f5] py-20 md:py-24"
    >
      {/* Hairline top — coherente con el resto de secciones FASE 3 (FAQ/RouteMap) */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(192,57,43,0.10), transparent)",
        }}
      />

      {/* Ornamento decorativo de fondo: comillas Playfair gigantes muy tenues,
          opacity ~4%, posición absoluta detrás del carrusel. Solo md+. */}
      <span
        aria-hidden="true"
        className="hidden md:block absolute pointer-events-none select-none font-serif italic"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -52%)",
          fontSize: "clamp(12rem, 22vw, 20rem)",
          lineHeight: 1,
          color: "rgba(192,57,43,0.04)",
        }}
      >
        &ldquo;
      </span>

      <div className="relative max-w-2xl mx-auto px-6">
        <motion.header
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: WARM_LUX }}
        >
          <p
            className="text-[0.7rem] font-semibold uppercase"
            style={{ color: "rgba(192,57,43,0.85)", letterSpacing: "0.22em" }}
          >
            {t.testimonials.eyebrow}
          </p>
          <span
            aria-hidden="true"
            className="block mx-auto mt-3"
            style={{
              width: 40,
              height: 1,
              backgroundColor: "rgba(192,57,43,0.22)",
            }}
          />
          <h2
            id="testimonials-heading"
            className="font-serif italic mt-3 text-[#1a0808] heading-balanced"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15 }}
          >
            {t.testimonials.title}
          </h2>
          <p
            className="text-[#7a3a3a] mt-3 leading-relaxed body-pretty"
            style={{ fontSize: "0.9375rem" }}
          >
            {t.testimonials.subtitle}
          </p>
        </motion.header>

        <div
          ref={containerRef}
          role="region"
          aria-roledescription={t.testimonials.carouselLabel}
          aria-label={t.testimonials.title}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="relative"
        >
          {/* Card actual con AnimatePresence */}
          <div className="relative min-h-[260px] md:min-h-[280px]" aria-live="polite">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.article
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.42, ease: WARM_LUX }}
                aria-roledescription={t.testimonials.slideLabel}
                aria-label={`${index + 1} / ${total}`}
                className="relative rounded-lg bg-white px-6 py-7 md:px-9 md:py-9"
                style={{
                  border: "1px solid rgba(245,198,194,0.6)",
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.85) inset, 0 6px 18px rgba(192,57,43,0.05)",
                }}
              >
                {/* Estrellas — terracota desaturado, NO amarillo */}
                <p
                  aria-hidden="true"
                  className="select-none text-center"
                  style={{
                    color: "rgba(192,57,43,0.55)",
                    letterSpacing: "0.08em",
                    fontSize: "1rem",
                  }}
                >
                  {"★".repeat(5)}
                </p>
                <span className="sr-only">{t.testimonials.starsAria}</span>

                {/* Cita */}
                <blockquote
                  className="font-serif italic text-center mt-5 leading-relaxed"
                  style={{
                    color: "#5c1a1a",
                    fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                  }}
                >
                  &ldquo;{current.quote}&rdquo;
                </blockquote>

                {/* Separador editorial cream-rosa */}
                <span
                  aria-hidden="true"
                  className="block mx-auto mt-6 mb-4"
                  style={{
                    width: 40,
                    height: 1,
                    backgroundColor: "rgba(245,198,194,0.9)",
                  }}
                />

                {/* Atribución: iniciales + nombre + ciudad + fecha */}
                <div className="flex items-center justify-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full select-none"
                    style={{
                      backgroundColor: "rgba(245,198,194,0.35)",
                      color: "#7a3a3a",
                      fontFamily: "var(--font-playfair)",
                      fontStyle: "italic",
                      fontSize: "0.95rem",
                    }}
                  >
                    {current.initial}
                  </span>
                  <div className="text-left">
                    <p
                      className="font-sans font-semibold"
                      style={{ color: "#5c1a1a", fontSize: "0.875rem" }}
                    >
                      {current.name}
                      <span className="font-normal" style={{ color: "#7a3a3a" }}>
                        {", "}
                        {current.city}
                      </span>
                    </p>
                    <p
                      className="font-sans"
                      style={{ color: "#7a3a3a", opacity: 0.75, fontSize: "0.72rem" }}
                    >
                      {current.date}
                    </p>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Flechas — siempre visibles md+. En mobile aparecen también para
              soportar interacción explícita además del swipe (no implementado:
              touch nativo es suficiente; las flechas son la palanca accesible). */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label={t.testimonials.prev}
                className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-4 lg:-left-12 flex items-center justify-center w-11 h-11 rounded-full text-[#7a3a3a] transition-colors hover:bg-[rgba(192,57,43,0.08)] focus-visible:bg-[rgba(192,57,43,0.10)]"
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={t.testimonials.next}
                className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-4 lg:-right-12 flex items-center justify-center w-11 h-11 rounded-full text-[#7a3a3a] transition-colors hover:bg-[rgba(192,57,43,0.08)] focus-visible:bg-[rgba(192,57,43,0.10)]"
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Dots indicator */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2.5 mt-7">
              {items.map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${t.testimonials.goTo} ${i + 1}`}
                    aria-current={active ? "true" : undefined}
                    className="flex items-center justify-center"
                    style={{ width: 28, height: 28, padding: 0 }}
                  >
                    <span
                      aria-hidden="true"
                      className="block rounded-full transition-all duration-200"
                      style={{
                        width: active ? 18 : 6,
                        height: 2,
                        backgroundColor: active
                          ? "#c0392b"
                          : "rgba(192,57,43,0.30)",
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Demo disclaimer — visible. Coherente con La Nonna Phase 5b §C-4
            y con el patrón Nil "no exponer datos no confirmados". */}
        <p
          className="text-center mt-8 italic"
          style={{
            color: "rgba(122,58,58,0.55)",
            fontSize: "0.78rem",
            fontFamily: "var(--font-playfair)",
          }}
        >
          {t.testimonials.demo}
        </p>
      </div>
    </section>
  );
}
