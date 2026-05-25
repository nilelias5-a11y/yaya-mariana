"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ENHANCE-7 · Easter egg #3 — Halo en quoteAuthor.
   Hover sostenido >=1.5s sobre el nombre "Yaya Mariana" del Hero:
   halo calido melocoton -> cream se expande 12px alrededor del texto,
   fade-in 600ms / fade-out 900ms al salir o tras 1.5s sostenido.
   Una vez por sesion (sessionStorage `ym_halo_v1`). Sin click, sin
   tooltip, sin texto extra. Respeta prefers-reduced-motion:
   render estatico one-frame al 40% opacidad. */
export default function QuoteAuthorHalo({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem("ym_halo_v1") === "1") {
        fired.current = true;
      }
    } catch {
      /* sessionStorage bloqueado: el halo disparara igual */
    }
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  function start() {
    if (fired.current) return;
    hoverTimer.current = setTimeout(() => {
      setShow(true);
      fired.current = true;
      try {
        window.sessionStorage.setItem("ym_halo_v1", "1");
      } catch {
        /* ignore */
      }
      /* Auto-hide tras 1.5s sostenido del halo (anyway). */
      window.setTimeout(() => setShow(false), 1500);
    }, 1500);
  }
  function cancel() {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }

  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={start}
      onMouseLeave={cancel}
      onFocus={start}
      onBlur={cancel}
    >
      <AnimatePresence>
        {show && (
          <motion.span
            aria-hidden
            initial={
              reduceMotion ? { opacity: 0 } : { scale: 0.7, opacity: 0 }
            }
            animate={
              reduceMotion ? { opacity: 0.4 } : { scale: 1.35, opacity: 1 }
            }
            exit={
              reduceMotion ? { opacity: 0 } : { scale: 1.5, opacity: 0 }
            }
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            style={{
              position: "absolute",
              left: "-12px",
              right: "-12px",
              top: "-8px",
              bottom: "-8px",
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(245,198,194,0.55) 0%, rgba(253,246,245,0.25) 50%, transparent 80%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
}
