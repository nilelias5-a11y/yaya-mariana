"use client";

import { useLanguage } from "@/context/language-context";

/* Fase 4.5 · TANDA 4 (#26/#27) — skip-link traducido.
   Primer elemento focusable del <body>; ancla en <main id="contenido">.
   Cliente porque el texto sigue al idioma activo (useLanguage). */
export default function SkipLink() {
  const { t } = useLanguage();
  return (
    <a href="#contenido" className="skip-link">
      {t.skipLink}
    </a>
  );
}
