"use client";

import { useEffect, useRef } from "react";

/* IntersectionObserver hook que añade `data-revealed="true"` a un
   elemento cuando entra en viewport. Útil con la clase `.reveal`
   de globals.css (ENHANCE-1) para revelar elementos aditivos sin
   acoplar framer-motion.

   Convive con framer: framer gobierna las secciones canónicas;
   este hook se usa solo para piezas nuevas (hairlines, ornamentos,
   capas decorativas) que el usuario aprobó añadir.

   - `once: true` por defecto — el reveal no se "deshace" al salir.
   - `rootMargin` 60px de margen inferior para que dispare un punto
     antes del borde, igual que `useInView` framer en el resto. */
export function useReveal<T extends HTMLElement>({
  once = true,
  rootMargin = "0px 0px -60px 0px",
}: { once?: boolean; rootMargin?: string } = {}) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-revealed", "true");
            if (once) io.unobserve(el);
          } else if (!once) {
            el.removeAttribute("data-revealed");
          }
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin]);
  return ref;
}
