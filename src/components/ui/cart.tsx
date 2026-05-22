"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";

export default function Cart() {
  const [open, setOpen] = useState(false);
  const { items, count, total, removeFromCart, updateQuantity } = useCart();
  const { t } = useLanguage();
  const router = useRouter();

  function handleCheckout() {
    setOpen(false);
    router.push("/checkout");
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl"
        style={{ background: "linear-gradient(135deg, #962a1f 0%, #b5341f 100%)" }}
        aria-label={t.cart.ariaOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[#962a1f] text-[0.65rem] font-black flex items-center justify-center shadow"
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed right-0 top-0 h-full w-full max-w-[22rem] bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#f5c6c2]/60">
                <h2 className="font-serif text-xl text-[#1a0808]">{t.cart.title}</h2>
                <button
                  onClick={() => setOpen(false)}
                  /* L2 — tap target ≥44px (antes w-8 h-8 = 32px). */
                  className="w-11 h-11 -mr-2 rounded-full flex items-center justify-center hover:bg-[#fdf0ef] transition-colors text-[#7a3a3a]"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
                    <path d="M4 4l12 12M16 4L4 16" />
                  </svg>
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-[#7a3a3a]/50">
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 opacity-40">
                      <path d="M12 4L6 12v28a4 4 0 004 4h28a4 4 0 004-4V12l-6-8z" />
                      <line x1="6" y1="12" x2="42" y2="12" />
                      <path d="M32 20a8 8 0 01-16 0" />
                    </svg>
                    <p className="text-sm">{t.cart.empty}</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.name}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3 items-center"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1a0808] truncate">{item.name}</p>
                        <p className="text-xs text-[#7a3a3a]/60">500g · {item.price.toFixed(2)}€</p>
                        {/* Quantity controls — L2: el botón es un tap target
                            de 44px; el círculo visible (32px) va dentro. */}
                        <div className="flex items-center gap-1 mt-1 -ml-1.5">
                          <button
                            onClick={() => updateQuantity(item.name, -1)}
                            className="group/qty flex h-11 w-11 items-center justify-center"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#962a1f]/30 text-[#962a1f] text-sm leading-none transition-colors group-hover/qty:bg-[#fdf0ef]">
                              −
                            </span>
                          </button>
                          <span className="text-sm font-semibold text-[#1a0808] w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.name, +1)}
                            className="group/qty flex h-11 w-11 items-center justify-center"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#962a1f]/30 text-[#962a1f] text-sm leading-none transition-colors group-hover/qty:bg-[#fdf0ef]">
                              +
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#1a0808]">
                          {(item.price * item.quantity).toFixed(2)}€
                        </p>
                        <button
                          onClick={() => removeFromCart(item.name)}
                          /* py-1.5 amplía el área de toque del enlace de borrado (L2). */
                          className="text-[0.65rem] text-[#7a3a3a]/40 hover:text-[#962a1f] transition-colors mt-0.5 py-1.5"
                        >
                          {t.cart.remove}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-5 py-4 border-t border-[#f5c6c2]/60 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#7a3a3a]/70">{t.cart.subtotal}</span>
                    <span className="font-bold text-[#1a0808]">{total.toFixed(2)}€</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#7a3a3a]/50">
                    <span>{t.cart.shipping}</span>
                    <span>{t.cart.shippingNote}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    /* rounded-md = 8px — radio de botones unificado (decisión #3). */
                    className="w-full py-3 rounded-md text-white text-sm font-bold shadow-lg hover:shadow-xl transition-shadow"
                    style={{ background: "linear-gradient(125deg, #962a1f 0%, #b5341f 100%)" }}
                  >
                    {t.cart.checkout} · {total.toFixed(2)}€
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
