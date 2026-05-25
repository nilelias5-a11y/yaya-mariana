"use client";

import { MotionConfig } from "framer-motion";
import { CartProvider } from "@/context/cart-context";
import { LanguageProvider } from "@/context/language-context";
import type { ReactNode } from "react";

/* `MotionConfig reducedMotion="user"` gatea TODO framer-motion al
   `prefers-reduced-motion` del sistema operativo. Animaciones de
   scroll/hover/pago quedan reducidas a ~0.01ms cuando el usuario tiene
   activado el ajuste de accesibilidad. Aditivo: no cambia el comportamiento
   por defecto, solo respeta la preferencia declarada del SO. */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <CartProvider>{children}</CartProvider>
      </LanguageProvider>
    </MotionConfig>
  );
}
