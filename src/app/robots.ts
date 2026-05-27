import type { MetadataRoute } from "next";

/* App Router robots.txt — convencion Next.js.
   Sitemap apunta al dominio canonico `yayamariana.es` (placeholder, dominio
   aun no comprado). Solo el deploy de produccion debe ser indexable; cualquier
   preview (`VERCEL_ENV === 'preview'`) o build local emite disallow / para
   evitar que un enlace compartido al cliente se filtre a buscadores. */
const SITE = "https://yayamariana.es";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

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
