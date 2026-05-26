"use client";

/* PLACEHOLDER REVIEWS — Replace with real reviews when available.
 *
 * Los 5 testimonios viven en `translations.ts` bajo `testimonials.items`
 * con perfiles genéricos creíbles (iniciales + ciudad + fecha). El UI no
 * mezcla copy con presentación: cuando lleguen reseñas reales (Trustpilot,
 * Google Reviews, etc.) bastará sustituir los strings de `testimonials.items`
 * en es/ca/en — el carrusel, animaciones y a11y se mantienen sin tocar.
 *
 * Layout responsive:
 *   - mobile  (<768px): 1 reseña visible (la central)
 *   - tablet  (768-1023px): 2 reseñas visibles (central + derecha)
 *   - desktop (>=1024px): 3 reseñas visibles (izq + central + der)
 *
 * El slot central queda destacado (scale 1, opacity 1). Los slots laterales
 * más sutiles (scale 0.95, opacity 0.7). Auto-rotate avanza 1 reseña por
 * ciclo (no 3). Dots indicator = total reseñas; cada dot apunta a "esa
 * reseña como central".
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const AUTO_ROTATE_MS = 5000;
const WARM_LUX: [number, number, number, number] = [0.19, 1, 0.22, 1];

type TestimonialItem = {
  quote: string;
  initial: string;
  name: string;
  city: string;
  date: string;
};

function CardContent({ card }: { card: TestimonialItem }) {
  return (
    <div
      className="relative h-full rounded-lg bg-white px-5 py-6 md:px-6 md:py-7 flex flex-col"
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
          fontSize: "0.95rem",
        }}
      >
        {"★".repeat(5)}
      </p>

      {/* Cita */}
      <blockquote
        className="font-serif italic text-center mt-4 leading-relaxed flex-1"
        style={{
          color: "#5c1a1a",
          fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
        }}
      >
        &ldquo;{card.quote}&rdquo;
      </blockquote>

      {/* Separador editorial cream-rosa */}
      <span
        aria-hidden="true"
        className="block mx-auto mt-5 mb-3.5"
        style={{
          width: 36,
          height: 1,
          backgroundColor: "rgba(245,198,194,0.9)",
        }}
      />

      {/* Atribución: iniciales + nombre + ciudad + fecha */}
      <div className="flex items-center justify-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full select-none flex-shrink-0"
          style={{
            backgroundColor: "rgba(245,198,194,0.35)",
            color: "#7a3a3a",
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontSize: "0.85rem",
          }}
        >
          {card.initial}
        </span>
        <div className="text-left min-w-0">
          <p
            className="font-sans font-semibold truncate"
            style={{ color: "#5c1a1a", fontSize: "0.82rem" }}
          >
            {card.name}
            <span className="font-normal" style={{ color: "#7a3a3a" }}>
              {", "}
              {card.city}
            </span>
          </p>
          <p
            className="font-sans"
            style={{ color: "#7a3a3a", opacity: 0.75, fontSize: "0.7rem" }}
          >
            {card.date}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const items = t.testimonials.items;
  const total = items.length;

  const [index, setIndex] = useState(0);
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
      setIndex(normalized);
    },
    [total],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  /* Auto-rotate solo cuando: no touch + no reduced-motion + no pausa hover
     + más de 1 reseña. Avanza 1 reseña por ciclo (no 3). */
  useEffect(() => {
    if (isTouch || reduceMotion || paused || total <= 1) return;
    const id = window.setInterval(() => {
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

  const prevIndex = ((index - 1) % total + total) % total;
  const nextIndex = (index + 1) % total;

  /* Variants para cross-fade. En reduced-motion el slide se reduce a opacity
     puro (sin desplazamiento). */
  const cardVariants = reduceMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { opacity: 0, y: 8 },
        center: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
      };

  /* Definición de slots: visibilidad por breakpoint + estilo reposo
     (escala/opacidad del slot, no de la animación). */
  const slots: Array<{
    key: "left" | "center" | "right";
    cardIndex: number;
    /* Tailwind responsive visibility */
    visibilityClass: string;
    /* Estado de reposo: central destacado, laterales sutiles */
    restStyle: React.CSSProperties;
    isCenter: boolean;
  }> = [
    {
      key: "left",
      cardIndex: prevIndex,
      visibilityClass: "hidden lg:block",
      restStyle: { transform: "scale(0.95)", opacity: 0.7 },
      isCenter: false,
    },
    {
      key: "center",
      cardIndex: index,
      visibilityClass: "block",
      restStyle: { transform: "scale(1)", opacity: 1 },
      isCenter: true,
    },
    {
      key: "right",
      cardIndex: nextIndex,
      visibilityClass: "hidden md:block",
      restStyle: { transform: "scale(0.95)", opacity: 0.7 },
      isCenter: false,
    },
  ];

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

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.header
          className="text-center mb-10 md:mb-12 max-w-2xl mx-auto"
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
          {/* Grid responsive de 3 slots: mobile 1-col, tablet 2-col, desktop 3-col.
              gap-stretch para que las cards laterales mantengan altura coherente
              con la central. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch min-h-[260px] md:min-h-[280px]">
            {slots.map((slot) => (
              <div
                key={slot.key}
                className={slot.visibilityClass}
                aria-hidden={!slot.isCenter ? "true" : undefined}
              >
                <div
                  className="h-full transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={slot.restStyle}
                  aria-live={slot.isCenter ? "polite" : undefined}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slot.cardIndex}
                      variants={cardVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.42, ease: WARM_LUX }}
                      aria-roledescription={slot.isCenter ? t.testimonials.slideLabel : undefined}
                      aria-label={slot.isCenter ? `${slot.cardIndex + 1} / ${total}` : undefined}
                      className="h-full"
                    >
                      <CardContent card={items[slot.cardIndex]} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {/* sr-only para SR — la rating de la card central */}
          <span className="sr-only" aria-live="polite">
            {t.testimonials.starsAria} — {items[index].name}, {items[index].city}
          </span>

          {/* Flechas — siempre visibles. Posición sobre la card central. */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label={t.testimonials.prev}
                className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-4 lg:-left-6 z-10 flex items-center justify-center w-11 h-11 rounded-full text-[#7a3a3a] transition-colors hover:bg-[rgba(192,57,43,0.08)] focus-visible:bg-[rgba(192,57,43,0.10)] bg-[rgba(253,246,245,0.85)]"
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
                className="absolute top-1/2 -translate-y-1/2 -right-2 md:-right-4 lg:-right-6 z-10 flex items-center justify-center w-11 h-11 rounded-full text-[#7a3a3a] transition-colors hover:bg-[rgba(192,57,43,0.08)] focus-visible:bg-[rgba(192,57,43,0.10)] bg-[rgba(253,246,245,0.85)]"
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

          {/* Dots indicator — un dot por reseña total. Activo = la que está
              en el slot central. */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-2.5 mt-8">
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
      </div>
    </section>
  );
}
