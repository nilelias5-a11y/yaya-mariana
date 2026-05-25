import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Servir AVIF (con WebP de reserva) a partir de los JPEG locales —
       el optimizador de Next se encarga de la conversion en build/runtime. */
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/**" },
    ],
    /* E9 (BUG fix): remotePatterns para `yayamariana.com` retirado —
       el unico hot-link al dominio legacy (logo PNG del footer) se
       ha reemplazado por `/logo-nuevo.jpg` local. Sin remotePatterns
       el optimizador rechaza por defecto cualquier intento futuro de
       cargar imagenes de origen externo no autorizado. */
  },
};

export default nextConfig;
