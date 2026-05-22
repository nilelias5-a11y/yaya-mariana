"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { translations } from "@/i18n/translations";
import type { Lang } from "@/i18n/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (typeof translations)[Lang];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    /* Fase 4.5 · TANDA 4 (#35) — rehidratación: aceptar también "en"
       (antes solo "es"|"ca"); sincronizar <html lang> con lo rehidratado. */
    const stored = localStorage.getItem("lang");
    if (stored === "es" || stored === "ca" || stored === "en") {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
    /* #35 — <html lang> sigue al idioma activo (fonética SR correcta). */
    document.documentElement.lang = l;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
