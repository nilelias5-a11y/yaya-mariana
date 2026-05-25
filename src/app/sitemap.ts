import type { MetadataRoute } from "next";

/* App Router sitemap.xml — convencion Next.js.
   La home es la unica URL publica (single-page application).
   `/checkout` es transaccional, fuera del sitemap (tambien disallow en
   robots.ts).

   hreflang: el i18n es client-side (lang switcher en Hero + traducciones
   en `translations.ts`). Sin rutas `/[lang]` distintas, no procede
   declarar alternate hreflang sobre una misma URL. Cuando se restructure
   a `/[lang]/...`, este sitemap se amplia a 3 entradas con hreflang
   correcto. */
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
