"use client";

import { useEffect, useRef } from "react";

/* Hook accesible: encierra el foco del teclado dentro de un contenedor
   mientras `active` sea true. Util para diálogos / drawers / overlays.

   - Captura el elemento que tenía el foco al activarse → restaura al cerrar.
   - Lleva el foco al primer elemento focusable del contenedor (o al
     propio contenedor si no hay ninguno, requiere tabIndex={-1}).
   - Atrapa el Tab/Shift+Tab dentro del rango de focusables.
   - Escape invoca el callback `onClose`.

   No es propietario de aria-modal/role=dialog: el consumidor los pone
   en el elemento contenedor. */
export function useFocusTrap<T extends HTMLElement>({
  active,
  onClose,
}: {
  active: boolean;
  onClose?: () => void;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const container = ref.current;
    if (!container) return;

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getFocusables(): HTMLElement[] {
      if (!container) return [];
      return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => !el.hasAttribute("inert"),
      );
    }

    /* Foco inicial: primer focusable del contenedor, o el contenedor mismo
       (necesita tabIndex={-1} en el consumidor para ser focusable). */
    const focusables = getFocusables();
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      container.focus();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const activeEl = document.activeElement as HTMLElement;
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      /* Restaura el foco al elemento previo al activarse el trap. */
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };
  }, [active, onClose]);

  return ref;
}
