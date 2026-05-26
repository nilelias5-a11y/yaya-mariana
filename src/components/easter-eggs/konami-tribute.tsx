"use client";

import { useEffect } from "react";

/**
 * EE-02 — Konami code tribute.
 * Secuencia: Up Up Down Down Left Right Left Right B A
 * (códigos físicos via event.code — agnóstico al layout del teclado).
 * Dedup: sessionStorage["ym_konami_v1"].
 * Al disparar: overlay fixed centrado, fade-in 500ms, 2.2s visible,
 * fade-out 500ms, luego destroy.
 * Reduced-motion: aparece y desaparece instantáneamente.
 */

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

const DEDUP_KEY = "ym_konami_v1";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createOverlay(): HTMLDivElement {
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 55;
    background: rgba(253,246,245,0.92);
    padding: 2.5rem 3rem;
    border-radius: 12px;
    border-left: 2px solid #c0392b;
    pointer-events: none;
    font-family: var(--font-playfair), Georgia, serif;
    font-style: italic;
    font-size: 1.15rem;
    color: #7a1a1a;
    line-height: 1.5;
    max-width: min(90vw, 420px);
    text-align: center;
    box-shadow: 0 8px 32px rgba(122,26,26,0.10);
  `;
  el.textContent = "Ella estaría orgullosa de lo que has construido.";
  return el;
}

export default function KonamiTribute() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const buffer: string[] = [];

    function handleKeyDown(e: KeyboardEvent) {
      buffer.push(e.code);
      if (buffer.length > KONAMI_SEQUENCE.length) {
        buffer.shift();
      }
      if (
        buffer.length === KONAMI_SEQUENCE.length &&
        buffer.every((key, i) => key === KONAMI_SEQUENCE[i])
      ) {
        // Match — check dedup
        if (sessionStorage.getItem(DEDUP_KEY)) return;
        sessionStorage.setItem(DEDUP_KEY, "1");

        const overlay = createOverlay();
        const reduced = prefersReducedMotion();

        if (reduced) {
          // Instantaneous: show then remove after 2.2s
          document.body.appendChild(overlay);
          setTimeout(() => {
            document.body.removeChild(overlay);
          }, 2200);
        } else {
          // Fade-in 500ms → 2200ms visible → fade-out 500ms → destroy
          overlay.style.opacity = "0";
          overlay.style.transition = "opacity 500ms ease";
          document.body.appendChild(overlay);
          // Trigger fade-in
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              overlay.style.opacity = "1";
            });
          });
          // After 500ms (fade-in) + 2200ms (visible) = 2700ms, start fade-out
          setTimeout(() => {
            overlay.style.opacity = "0";
            // After 500ms fade-out, remove
            setTimeout(() => {
              if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
              }
            }, 500);
          }, 2700);
        }

        buffer.length = 0;
      }
    }

    window.addEventListener("keydown", handleKeyDown, { passive: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
