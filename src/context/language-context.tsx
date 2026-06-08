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

/* Idiomas soportados — guard único usado tanto al restaurar como al
   sincronizar el atributo <html lang>. Antes la restauración solo
   contemplaba "es"/"ca" y descartaba silenciosamente "en": al recargar
   o navegar con hard-load el idioma inglés volvía a "es". */
const SUPPORTED: readonly Lang[] = ["es", "ca", "en"];
function isLang(value: string | null): value is Lang {
  return value !== null && (SUPPORTED as readonly string[]).includes(value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    /* Restaura la preferencia: localStorage primero (rápido en el mismo
       dispositivo) y, como respaldo, la cookie `lang` (sobrevive a
       navegaciones con recarga completa y queda disponible para SSR
       futuro). El primero válido gana. */
    const fromStorage = localStorage.getItem("lang");
    if (isLang(fromStorage)) {
      setLangState(fromStorage);
      return;
    }
    const fromCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("lang="))
      ?.split("=")[1];
    if (isLang(fromCookie ?? null)) setLangState(fromCookie as Lang);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
    /* Cookie de 1 año, ruta global. Persiste el idioma entre páginas
       aunque haya una recarga completa (p. ej. enlaces externos o un
       deep-link marcado). SameSite=Lax — no es dato sensible. */
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
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
