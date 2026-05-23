"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { Button } from "@/components/ui/button";

export default function Cart() {
  /* E6 — el estado abierto/cerrado vive ahora en el cart-context: "Añadir
     al carrito" abre el drawer (microconversión) desde fuera de Cart. */
  const { items, count, total, removeFromCart, updateQuantity, isOpen, openCart, closeCart } =
    useCart();
  const { t } = useLanguage();
  const router = useRouter();
  /* TANDA 5 (#ME-21) — el slide del drawer y el scale del badge se gatean
     explícitamente con useReducedMotion (además del MotionConfig global). */
  const reduceMotion = useReducedMotion();

  /* TANDA 4 (#24) — focus-trap del drawer + Escape-close + retorno
     de foco al FAB al cerrar (el hook devuelve el foco al trigger). */
  const panelRef = useFocusTrap<HTMLDivElement>({ active: isOpen, onClose: closeCart });

  function handleCheckout() {
    closeCart();
    router.push("/checkout");
  }

  return (
    <>
      {/* Floating button */}
      {/* TANDA 4 (#ME-16) — el FAB respeta env(safe-area-inset-*): en
          dispositivos con notch / barra de gestos no cae sobre el sistema. */}
      {/* TANDA 5 (HI-8/ME-7) — FAB de tributo: fondo de marca plano (antes
          gradiente rojo→naranja); hover sube la sombra, sin scale. */}
      {/* TANDA 2 — icon-only del sistema: caja 44×44 (.btn-icon) sobre la que
          se pinta el círculo de 56px de marca. whileTap añade el feedback
          de pulsación que faltaba (D15). */}
      <motion.button
        onClick={openCart}
        whileHover={{ boxShadow: "var(--shadow-modal)" }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed z-40 w-14 h-14 rounded-full text-white flex items-center justify-center"
        style={{
          backgroundColor: "var(--color-brand-primary)",
          boxShadow: "var(--shadow-modal)",
          bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
          right: "calc(1.5rem + env(safe-area-inset-right))",
        }}
        aria-label={t.cart.ariaOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <AnimatePresence>
          {count > 0 && (
            /* TANDA 5 — bajo reduced-motion el badge aparece sin scale
               (solo fade); con motion conserva el pop discreto del contador. */
            <motion.span
              key="badge"
              initial={reduceMotion ? { opacity: 0 } : { scale: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-bg-surface)] text-[var(--color-brand-primary)] text-[0.65rem] font-black flex items-center justify-center shadow"
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={closeCart}
            />

            {/* Panel — diálogo modal accesible (#24). */}
            {/* TANDA 5 (ME-9) — el drawer ya no usa física de muelle
                (type:spring rebotaba); entra con una curva ease-in-out y
                duración explícita. Bajo reduced-motion el slide se sustituye
                por un fade simple (sin desplazamiento). */}
            <motion.div
              key="panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              tabIndex={-1}
              initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              className="fixed right-0 top-0 h-full w-full max-w-[22rem] bg-[var(--color-bg-surface)] shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              {/* TANDA 1 — `py-4`(16px)→`py-5`(20px): más aire vertical para
                  separar header/items/footer del drawer (el `px-5` lateral se
                  mantiene — drawer estrecho de 22rem). */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-[var(--color-border-subtle)]">
                <h2 id="cart-title" className="font-serif text-xl text-[var(--color-text-primary)]">{t.cart.title}</h2>
                {/* TANDA 2 — botón cerrar del sistema icon-only (.btn-icon):
                    caja 44×44 coherente con el resto de iconos. */}
                <button
                  type="button"
                  onClick={closeCart}
                  className="btn-icon -mr-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="w-4 h-4">
                    <path d="M4 4l12 12M16 4L4 16" />
                  </svg>
                </button>
              </div>

              {/* Items */}
              {/* TANDA 1 — `py-4`→`py-5`: aire vertical del drawer. */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--color-text-muted)]">
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
                        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">{item.name}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">500g · {item.price.toFixed(2)}€</p>
                        {/* Quantity controls — TANDA 2: botones icon-only del
                            sistema (.btn-icon, caja 44px); el círculo visible
                            de 32px va dentro. D16 — `−` (U+2212) y `+` con
                            `leading-none` y centrado óptico igualados. */}
                        <div className="flex items-center gap-1 mt-1 -ml-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.name, -1)}
                            className="btn-icon group/qty"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-brand-primary)]/40 text-[var(--color-brand-primary)] text-base leading-none transition-colors group-hover/qty:bg-[var(--color-bg-subtle)]">
                              −
                            </span>
                          </button>
                          <span className="text-sm font-semibold text-[var(--color-text-primary)] w-4 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.name, +1)}
                            className="btn-icon group/qty"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-brand-primary)]/40 text-[var(--color-brand-primary)] text-base leading-none transition-colors group-hover/qty:bg-[var(--color-bg-subtle)]">
                              +
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">
                          {(item.price * item.quantity).toFixed(2)}€
                        </p>
                        {/* TANDA 2 — "Eliminar" pasa a link de acción del
                            sistema (.btn-link, 13px legible — antes 10.4px
                            ilegible, D10). Hit-area ≥44px preservada. */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.name)}
                          className="btn-link h-11 -my-2.5 -mr-1 pl-3 justify-end"
                        >
                          {t.cart.remove}
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              {/* TANDA 1 — `py-4`→`py-5`: aire vertical del drawer. */}
              {items.length > 0 && (
                <div className="px-5 py-5 border-t border-[var(--color-border-subtle)] space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">{t.cart.subtotal}</span>
                    <span className="font-bold text-[var(--color-text-primary)]">{total.toFixed(2)}€</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span>{t.cart.shipping}</span>
                    <span>{t.cart.shippingNote}</span>
                  </div>
                  {/* TANDA 2 — botón primario del sistema. Sí va a /checkout:
                      el carrito tiene ítems, es el "Ir a pagar" legítimo. */}
                  <Button variant="primary" block onClick={handleCheckout}>
                    {t.cart.checkout} · {total.toFixed(2)}€
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
