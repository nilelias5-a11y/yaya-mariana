"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const CONSENT_KEY = "cookie-consent";

/* Banner de consentimiento RGPD — bandera inferior elegante.
 *
 * Se muestra hasta que la persona acepta o rechaza las cookies no
 * esenciales; la elección se guarda en localStorage para no repetir el
 * aviso. Renderiza null en SSR y hasta resolver el estado para evitar
 * desajustes de hidratación. i18n ES/CA/EN desde t.cookieBanner. */
export default function CookieBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored !== "accepted" && stored !== "rejected") setVisible(true);
    } catch {
      /* localStorage no disponible (modo privado estricto): mostrar igual. */
      setVisible(true);
    }
  }, []);

  function choose(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignorar si no se puede persistir */
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label={t.cookieBanner.ariaLabel}
          aria-live="polite"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.42, ease: [0.19, 1, 0.22, 1] } }}
          exit={{ y: "110%", opacity: 0, transition: { duration: 0.3, ease: [0.6, 0.04, 0.24, 1] } }}
          className="fixed left-0 right-0 z-[60] px-4 md:px-6"
          style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <div
            className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 md:px-6"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 14,
              borderTop: "3px solid #c0392b",
              border: "1px solid rgba(245,198,194,0.8)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.9) inset, 0 12px 32px rgba(122,26,26,0.16)",
            }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-serif text-[1.05rem] text-[#1a0808] mb-1">
                {t.cookieBanner.title}
              </p>
              <p className="text-[0.85rem] text-[#7a3a3a]/80 leading-relaxed">
                {t.cookieBanner.text}{" "}
                <Link
                  href="/politica-cookies"
                  className="font-semibold text-[#c0392b] underline underline-offset-2 hover:opacity-80 transition-opacity"
                >
                  {t.cookieBanner.moreInfo}
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => choose("rejected")}
                className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-full text-sm font-semibold transition-colors hover:bg-[rgba(245,198,194,0.18)]"
                style={{ color: "#c0392b", border: "1px solid rgba(192,57,43,0.42)" }}
              >
                {t.cookieBanner.reject}
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full text-sm font-bold text-white shadow-md hover:shadow-lg transition-shadow"
                style={{ background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)" }}
              >
                {t.cookieBanner.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
