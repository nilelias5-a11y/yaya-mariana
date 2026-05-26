"use client";

import { useEffect } from "react";

/**
 * EE-03 — Quietud 28s.
 * Si el usuario ha scrolleado ≥20% de la página y completa 28s de
 * inactividad (sin scroll, mousemove, keydown ni touchmove) → dispara.
 * Dedup: sessionStorage["ym_quietud_v1"].
 * Al disparar: mensaje fixed bottom-left, fade-in 800ms, 4s visible,
 * fade-out 600ms, destroy.
 * Reduced-motion: aparece y desaparece instantáneamente.
 */

const DEDUP_KEY = "ym_quietud_v1";
const IDLE_MS = 28_000;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasScrolledEnough(): boolean {
  const scrollY = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return false;
  return scrollY / docHeight >= 0.2;
}

function createMessage(): HTMLDivElement {
  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText = `
    position: fixed;
    bottom: 28px;
    left: 32px;
    z-index: 40;
    pointer-events: none;
    font-family: var(--font-playfair), Georgia, serif;
    font-style: italic;
    font-size: 0.72rem;
    color: rgba(122,26,26,0.52);
    line-height: 1.4;
    letter-spacing: 0.01em;
  `;
  el.textContent = "gracias por leer despacio.";
  return el;
}

export default function QuietudMessage() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check dedup early
    if (sessionStorage.getItem(DEDUP_KEY)) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    function resetTimer() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      // Only arm timer if scroll threshold already met
      if (!hasScrolledEnough()) return;

      timer = setTimeout(() => {
        // Re-check dedup in case another tab fired
        if (sessionStorage.getItem(DEDUP_KEY)) return;
        sessionStorage.setItem(DEDUP_KEY, "1");

        const msg = createMessage();
        const reduced = prefersReducedMotion();

        if (reduced) {
          document.body.appendChild(msg);
          setTimeout(() => {
            if (msg.parentNode) msg.parentNode.removeChild(msg);
          }, 4000);
        } else {
          // Fade-in 800ms → 4000ms visible → fade-out 600ms → destroy
          msg.style.opacity = "0";
          msg.style.transition = "opacity 800ms ease";
          document.body.appendChild(msg);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              msg.style.opacity = "1";
            });
          });
          // After fade-in (800ms) + visible (4000ms) = 4800ms, start fade-out
          setTimeout(() => {
            msg.style.transition = "opacity 600ms ease";
            msg.style.opacity = "0";
            setTimeout(() => {
              if (msg.parentNode) msg.parentNode.removeChild(msg);
            }, 600);
          }, 4800);
        }

        // Remove all listeners after firing
        cleanup();
      }, IDLE_MS);
    }

    function handleActivity() {
      resetTimer();
    }

    function cleanup() {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchmove", handleActivity);
    }

    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("mousemove", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity, { passive: true });
    window.addEventListener("touchmove", handleActivity, { passive: true });

    // Don't arm timer on mount — wait for first activity (scroll threshold)
    return cleanup;
  }, []);

  return null;
}
