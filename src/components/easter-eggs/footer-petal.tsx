"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* ENHANCE-7 · Easter egg #2 — Footer petal.
   La primera vez que el visitante llega al final del `<footer>`
   (IntersectionObserver, una vez por dispositivo via
   `localStorage["ym_footer_v1"]`), un unico petalo SVG cae desde top
   del viewport del footer, 1.4s ease-in, fade-out al tocar baseline.

   Sin texto, sin badge "has llegado al final" (demasiado autorreferencial
   para el tono tributo). Bajo prefers-reduced-motion: no-op total
   (skip; el petalo es 100% movimiento, sin movimiento pierde sentido). */
export default function FooterPetal() {
  const [fall, setFall] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem("ym_footer_v1") === "1") return;
    } catch {
      /* localStorage bloqueado: el petalo cae igualmente esta sesion
         pero no se persistira. */
    }

    /* Busca el <footer> en DOM. Si aun no esta montado, observador
       sobre body fallback con check posterior. */
    const target = document.querySelector("footer");
    if (!target) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setFall(true);
            try {
              window.localStorage.setItem("ym_footer_v1", "1");
            } catch {
              /* ignore */
            }
            io.disconnect();
            window.setTimeout(() => setFall(false), 1600);
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {fall && (
        <motion.div
          aria-hidden
          /* fixed sobre el viewport para que la caida sea visible
             aunque el usuario este scrolleando dentro del footer. */
          className="fixed pointer-events-none z-[60]"
          style={{ left: "calc(50% - 11px)", top: "32%" }}
          initial={{ y: -40, opacity: 0, rotate: -8 }}
          animate={{ y: 280, opacity: [0, 1, 1, 0], rotate: 24 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeIn" }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
            <path
              d="M11 2C16 7 16 14 11 20C6 14 6 7 11 2Z"
              fill="rgba(192,57,43,0.62)"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
