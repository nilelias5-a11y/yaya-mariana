"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type CartProduct = {
  name: string;
  price: number;
  image: string;
};

export type CartItem = CartProduct & { quantity: number };

type CartContextType = {
  items: CartItem[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (name: string) => void;
  updateQuantity: (name: string, delta: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  /* Fase 5 · TANDA 2 (E6) — el estado abierto/cerrado del drawer del Cart
     vive en el contexto: así "Añadir al carrito" puede abrir la cesta y
     poner el paso "Ir a pagar" delante del visitante (microconversión). */
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

// L8 — clave de persistencia de la cesta en localStorage.
const STORAGE_KEY = "yaya-mariana-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  // Estado inicial vacío: coincide con el render del servidor → sin desajuste
  // de hidratación. La cesta guardada se carga en un efecto tras montar.
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  /* E6 — drawer del Cart: estado elevado al contexto (antes local en Cart). */
  const [isOpen, setIsOpen] = useState(false);

  // L8 — rehidratación: leer la cesta guardada una vez en el cliente.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = (parsed as CartItem[]).filter(
            (i) =>
              !!i &&
              typeof i.name === "string" &&
              typeof i.price === "number" &&
              typeof i.image === "string" &&
              typeof i.quantity === "number" &&
              i.quantity > 0,
          );
          if (valid.length) setItems(valid);
        }
      }
    } catch {
      /* localStorage no disponible o JSON corrupto → se ignora, cesta vacía. */
    }
    setHydrated(true);
  }, []);

  // L8 — persistencia: guardar tras cada cambio, pero solo una vez hidratado
  // (evita que el array vacío inicial pise la cesta guardada).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* cuota excedida o storage bloqueado → se ignora. */
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addToCart = useCallback((product: CartProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.name === product.name);
      if (existing) {
        return prev.map((i) =>
          i.name === product.name ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    /* E6 — al añadir, el drawer se abre: el paso "Ir a pagar" aparece solo. */
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((name: string) => {
    setItems((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const updateQuantity = useCallback((name: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.name === name ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        count,
        isOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
