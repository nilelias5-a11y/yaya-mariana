"use client";

import { useEffect, useRef } from "react";

/* Fase 4.5 · TANDA 4 (C5) — hook compartido de accesibilidad para overlays.
   Cubre los tres patrones que piden los defectos #24 y #25:
     1. focus-trap: Tab / Shift+Tab circulan dentro del contenedor.
     2. cierre con Escape.
     3. retorno de foco al disparador (trigger) al cerrar.
   Lo usan el Cart drawer, el MobileNav y el LanguageSelector. */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface UseFocusTrapOptions {
  /* Cuando es true, el trap está activo (overlay abierto). */
  active: boolean;
  /* Se invoca al pulsar Escape dentro del overlay. */
  onClose: () => void;
}

export function useFocusTrap<T extends HTMLElement>({
  active,
  onClose,
}: UseFocusTrapOptions) {
  const containerRef = useRef<T>(null);
  /* Elemento que tenía el foco antes de abrir — se le devuelve al cerrar. */
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    /* Guarda el disparador y mueve el foco dentro del overlay. */
    triggerRef.current = document.activeElement as HTMLElement | null;
    const container = containerRef.current;
    if (!container) return;

    const focusables = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const initial = focusables();
    if (initial.length > 0) {
      initial[0].focus();
    } else {
      container.focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const els = focusables();
      if (els.length === 0) {
        e.preventDefault();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      const activeEl = document.activeElement;

      if (e.shiftKey) {
        if (activeEl === first || !container?.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (activeEl === last || !container?.contains(activeEl)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      /* Retorno de foco al trigger al cerrar / desmontar. */
      triggerRef.current?.focus?.();
    };
  }, [active, onClose]);

  return containerRef;
}
