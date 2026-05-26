"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ENHANCE-2 T8 · Easter egg EE-01 — Ornamento ❦ respira.
   Hover o focus sostenido >=1.8s sobre el glifo ornamental de AboutUs:
   rotación + fade warm-lux de 2.2s. Una vez por sesión
   (sessionStorage `ym_ornament_v1`). Respeta prefers-reduced-motion:
   solo opacity sin rotate. */

/** Easing warm-lux canónico. */
const EASE_WARM_LUX = [0.19, 1, 0.22, 1] as const;

export default function OrnamentBreath() {
  const [animate, setAnimate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem("ym_ornament_v1") === "1") {
        fired.current = true;
      }
    } catch {
      /* sessionStorage bloqueado: el ornamento animará igualmente esta carga */
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function start() {
    if (fired.current) return;
    timerRef.current = setTimeout(() => {
      setAnimate(true);
      fired.current = true;
      try {
        window.sessionStorage.setItem("ym_ornament_v1", "1");
      } catch {
        /* ignore */
      }
      /* Reset: vuelve al estado base tras que la animación termina */
      window.setTimeout(() => setAnimate(false), 2400);
    }, 1800);
  }

  function cancel() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  return (
    <div
      aria-hidden
      className="mt-6 text-center"
      style={{ color: "rgba(192,57,43,0.4)", fontSize: "1.1rem", lineHeight: 1 }}
      onMouseEnter={start}
      onMouseLeave={cancel}
      onFocus={start}
      onBlur={cancel}
      /* tabIndex -1: focusable via script pero fuera del tab-order natural */
      tabIndex={-1}
    >
      <motion.span
        aria-hidden
        style={{ display: "inline-block", originX: "50%", originY: "50%" }}
        animate={
          animate
            ? reduceMotion
              ? { opacity: [0.40, 0.72, 0.40] }
              : { rotate: [0, 8, -5, 0], opacity: [0.40, 0.72, 0.40] }
            : { rotate: 0, opacity: 0.40 }
        }
        transition={{
          duration: 2.2,
          ease: EASE_WARM_LUX,
        }}
      >
        ❦
      </motion.span>
    </div>
  );
}
