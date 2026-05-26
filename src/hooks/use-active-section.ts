"use client";

import { useEffect, useState } from "react";

/* VP-09 — IntersectionObserver hook que rastrea cuál sección ancla
   está activa en el viewport. Devuelve el href activo (e.g. "#productos")
   o null si ninguno está visible.

   - Usa threshold 0.25 para considerar una sección activa cuando al menos
     el 25% es visible en el viewport.
   - rootMargin "-10% 0px -70% 0px" da preferencia a la sección superior
     del viewport, comportamiento natural para navegación.
   - `once: false` — el estado se actualiza al entrar Y al salir. */
export function useActiveSection(hrefs: string[]) {
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const elements = hrefs
      .map((href) => {
        const id = href.replace("#", "");
        return { href, el: document.getElementById(id) };
      })
      .filter((item): item is { href: string; el: HTMLElement } => item.el !== null);

    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const found = elements.find((item) => item.el === entry.target);
          if (!found) continue;
          if (entry.isIntersecting) {
            setActiveHref(found.href);
          } else {
            // Limpiar solo si era el activo
            setActiveHref((prev) => (prev === found.href ? null : prev));
          }
        }
      },
      {
        rootMargin: "-10% 0px -70% 0px",
        threshold: 0,
      },
    );

    for (const { el } of elements) io.observe(el);
    return () => io.disconnect();
  }, [hrefs]);

  return activeHref;
}
