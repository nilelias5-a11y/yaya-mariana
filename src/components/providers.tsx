"use client";

import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/context/cart-context";
import { LanguageProvider } from "@/context/language-context";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user" — framer-motion consulta matchMedia(prefers-reduced-motion)
    // y desactiva las animaciones de transform/layout (conserva opacidad/color) en
    // TODOS los componentes motion del sitio. Los motores JS no-framer (MeshGradient,
    // count-up, typewriter) se gatean individualmente con useReducedMotion().
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <CartProvider>{children}</CartProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
