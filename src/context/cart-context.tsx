"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { business } from "@/config/business";

/* Carrito de compra (cliente). Persiste en localStorage para sobrevivir a
 * recargas / cierres de pestaña.
 *
 * INTEGRIDAD DE PRECIOS: en localStorage se guarda SOLO { name, quantity } —
 * el precio y la imagen se recalculan SIEMPRE desde `config/business.ts` al
 * restaurar. Así el carrito nunca arrastra precios viejos y el importe que se
 * cobra (total del carrito) coincide con el pedido reconstruido en el webhook.
 *
 * HIDRATACIÓN: el primer render (SSR y cliente) es un carrito vacío; la
 * restauración ocurre en un efecto tras montar (mismo patrón hydration-safe
 * que language-context.tsx). Un flag `hydrated` evita escribir [] encima del
 * carrito guardado antes de restaurarlo. */

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
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "ym_cart_v1";
const CART_VERSION = 1;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

type StoredCart = {
  version: number;
  savedAt: number;
  items: { name: string; quantity: number }[];
};

/** Restaura el carrito desde localStorage revalidando contra config:
 *  - caducado (>7 días) o versión distinta → carrito vacío;
 *  - cada item se reconstruye con precio/imagen ACTUALES de config;
 *  - items de productos inexistentes se descartan. */
function restoreCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<StoredCart>;
    if (parsed?.version !== CART_VERSION || !Array.isArray(parsed.items)) return [];
    if (typeof parsed.savedAt !== "number" || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      return [];
    }
    const out: CartItem[] = [];
    for (const it of parsed.items) {
      const qty = Math.max(1, Math.floor(Number(it?.quantity) || 0));
      if (!it?.name || qty <= 0) continue;
      const product = business.products.find((p) => p.cartName === it.name);
      if (!product) continue; // producto retirado/renombrado → descartar
      out.push({ name: product.cartName, price: product.price, image: product.images[0], quantity: qty });
    }
    return out;
  } catch {
    return [];
  }
}

/** Persiste solo name+quantity (+ versión y timestamp). Carrito vacío → borra
 *  la clave (limpieza tras pagar / al vaciar). */
function persistCart(items: CartItem[]) {
  try {
    if (items.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const payload: StoredCart = {
      version: CART_VERSION,
      savedAt: Date.now(),
      items: items.map((i) => ({ name: i.name, quantity: i.quantity })),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* localStorage no disponible (modo privado estricto): el carrito sigue
       funcionando en memoria, solo no persiste. */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restaurar al montar (hydration-safe: SSR/primer render = carrito vacío).
  useEffect(() => {
    const restored = restoreCart();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(restored);
    setHydrated(true);
  }, []);

  // Persistir tras cada cambio, pero NUNCA antes de restaurar (evita clobber).
  useEffect(() => {
    if (!hydrated) return;
    persistCart(items);
  }, [items, hydrated]);

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
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}
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
