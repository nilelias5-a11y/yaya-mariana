import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // L1 — pipeline WebP/AVIF: el optimizador de Next sirve AVIF (y WebP
    // de reserva) a partir de los JPEG locales, sin convertir ficheros a mano.
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/**" },
    ],
    // remotePatterns retirado (L1): el único host era yayamariana.com — dominio
    // legacy abandonado; ya no queda ningún hot-link a ese origen en el código.
  },
};

export default nextConfig;
