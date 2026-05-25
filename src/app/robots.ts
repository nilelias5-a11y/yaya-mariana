import type { MetadataRoute } from "next";

/* Fase 5 · TANDA 4 — robots.txt vía la convención App Router.
   El sitemap apunta al dominio destino `yayamariana.es` (aún no comprado:
   placeholder canónico; el deploy actual `yaya-mariana.vercel.app` es solo
   para revisión visual familiar — no para SEO). `/api/` y `/checkout` se
   desindexan: la API es interna, el checkout es superficie transaccional
   sin valor de búsqueda. */
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
