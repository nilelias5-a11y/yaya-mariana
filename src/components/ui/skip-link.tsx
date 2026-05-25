"use client";

import { useLanguage } from "@/context/language-context";

/* Skip-link traducido (#26/#27 a11y). Primer elemento focusable del <body>;
   ancla en `<main id="contenido">`. Cliente porque el texto sigue al idioma
   activo (useLanguage). Visible solo al recibir foco (CSS .skip-link). */
export default function SkipLink() {
  const { t } = useLanguage();
  return (
    <a href="#contenido" className="skip-link">
      {t.skipLink}
    </a>
  );
}
