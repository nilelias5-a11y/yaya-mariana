"use client";

import { CartProvider } from "@/context/cart-context";
import { LanguageProvider } from "@/context/language-context";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>{children}</CartProvider>
    </LanguageProvider>
  );
}
