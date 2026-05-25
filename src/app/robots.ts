import type { MetadataRoute } from "next";

/* App Router robots.txt — convencion Next.js.
   Sitemap apunta al dominio canonico `yayamariana.es` (placeholder, dominio
   aun no comprado). El deploy `yaya-mariana.vercel.app` es solo para
   revision visual familiar, no para SEO. `/api/` y `/checkout` desindexados:
   la API es interna y el checkout es superficie transaccional sin valor
   de busqueda. */
const SITE = "https://yayamariana.es";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
