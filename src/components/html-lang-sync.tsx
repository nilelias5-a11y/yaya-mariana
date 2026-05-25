"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/language-context";

/* Sincroniza el atributo `<html lang>` con el idioma activo.

   SSR renderiza `<html lang="es">` (default del layout). Tras la
   hidratacion, si el usuario cambia el idioma (selector del Hero),
   este efecto refleja el cambio en el atributo `lang` del root, para
   que lectores de pantalla y motores de busqueda anuncien el idioma
   correcto en cada momento.

   Aditivo: sin este sync, el lang se queda en "es" aunque la UI muestre
   CA/EN — incumple WCAG 3.1.1/3.1.2. */
export default function HtmlLangSync() {
  const { lang } = useLanguage();
  useEffect(() => {
    if (lang === "es" || lang === "ca" || lang === "en") {
      document.documentElement.lang = lang;
    }
  }, [lang]);
  return null;
}
