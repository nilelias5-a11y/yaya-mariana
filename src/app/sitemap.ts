import type { MetadataRoute } from "next";

/* Fase 5 · TANDA 4 — sitemap.xml vía la convención App Router.
   La home es la única URL pública (single-page application: Hero ·
   StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer · Cart).
   /checkout es transaccional → fuera del sitemap (también disallow en
   robots.ts).

   hreflang: el i18n es client-side (lang switcher en el Hero, traducciones
   en `translations.ts`). Sin rutas `/[lang]` distintas, Google ve una sola
   variante por URL — añadir `<xhtml:link rel="alternate" hreflang>` para
   3 langs apuntando a la misma `/` sería incoherente. Cuando se acometa
   la restructuración `/[lang]` (escalada al director, no autónoma), este
   sitemap se ampliará a 3 entradas (es/ca/en) con hreflang correcto. */
const SITE = "https://yayamariana.es";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
