import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Servir AVIF (con WebP de reserva) a partir de los JPEG locales —
       el optimizador de Next se encarga de la conversion en build/runtime.
       Pure additive: no se borra ningun pattern. */
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yayamariana.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
