"use client";

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { season } from "@/lib/season";

type Variety = "Mágnum" | "Dream" | "1525";
type Filter = "all" | Variety;

const FILTERS: Filter[] = ["all", "Mágnum", "Dream", "1525"];

const PRODUCTS_BASE = [
  {
    name: "Fresa Mágnum",
    variety: "Mágnum" as const,
    price: 7.5,
    images: [
      "/fresas/magnum/magnum-10.jpeg",
      "/fresas/magnum/magnum-07.jpeg",
      "/fresas/magnum/magnum-08.jpeg",
      "/fresas/magnum/magnum-06.jpeg",
    ],
  },
  {
    name: "Fresa Dream",
    variety: "Dream" as const,
    price: 7.5,
    images: [
      "/fresas/dream/dream-07.jpeg",
      "/fresas/dream/dream-12.jpeg",
      "/fresas/dream/dream-14.jpeg",
      "/fresas/dream/dream-08.jpeg",
    ],
  },
  {
    name: "Fresa Variedad 1525",
    variety: "1525" as const,
    price: 7.5,
    images: [
      "/fresas/variedad1525/variedad1525-10.jpeg",
      "/fresas/variedad1525/variedad1525-11.jpeg",
      "/fresas/variedad1525/variedad1525-12.jpeg",
      "/fresas/variedad1525/variedad1525-09.jpeg",
    ],
  },
];

// M7 — detección de dispositivo sin hover (táctil). useSyncExternalStore:
// reactivo, SSR-safe (snapshot de servidor = false), sin setState en efecto.
function useIsTouch() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(hover: none)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(hover: none)").matches,
    () => false,
  );
}

function ProductCarousel({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  // M7 — en dispositivos sin hover el carousel no se rota solo.
  const isTouch = useIsTouch();
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    // En touch o con el puntero encima: sin auto-rotate.
    if (hovered || isTouch) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, 3000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hovered, isTouch, next]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setImgOffset({
      x: ((e.clientX - r.left) / r.width - 0.5) * 14,
      y: ((e.clientY - r.top) / r.height - 0.5) * 10,
    });
  }

  // Flechas visibles al hover o, en touch, siempre (sin hover el carousel
  // quedaría solo navegable por puntos).
  const controlsVisible = hovered || isTouch;

  return (
    <div
      ref={containerRef}
      className="relative h-60 overflow-hidden rounded-t-2xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setImgOffset({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Images */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute"
            style={{ top: "-8%", left: "-8%", right: "-8%", bottom: "-8%" }}
            animate={{ x: imgOffset.x, y: imgOffset.y }}
            transition={{ type: "spring", stiffness: 110, damping: 22 }}
          >
            <Image
              src={images[current]}
              alt={`${name} foto ${current + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-black/25 to-transparent z-[1]" />

      {/* Arrows */}
      <button
        type="button"
        aria-label="Foto anterior"
        onClick={(e) => {
          e.preventDefault();
          prev();
        }}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all duration-200 ${controlsVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 pointer-events-none"}`}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-[#962a1f]"
        >
          <path d="M10 4L6 8l4 4" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Foto siguiente"
        onClick={(e) => {
          e.preventDefault();
          next();
        }}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all duration-200 ${controlsVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1 pointer-events-none"}`}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-[#962a1f]"
        >
          <path d="M6 4l4 4-4 4" />
        </svg>
      </button>

      {/* Dot indicators — L2: la barra visible se mantiene fina, pero cada
          punto vive dentro de un botón de 44px de alto (tap target). */}
      <div className="absolute inset-x-0 bottom-0 h-11 flex items-center justify-center gap-1.5 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir a la foto ${i + 1}`}
            onClick={() => setCurrent(i)}
            className="group/dot flex h-11 items-center px-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-4 bg-white" : "w-1.5 bg-white/50 group-hover/dot:bg-white/80"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  index,
  addToCartLabel,
  addedLabel,
  viewMoreLabel,
  harvestLabel,
}: {
  product: (typeof PRODUCTS_BASE)[0] & { description: string };
  index: number;
  addToCartLabel: string;
  addedLabel: string;
  viewMoreLabel: string;
  harvestLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // L4 — easter egg: hover (escritorio) o pulsación larga (táctil) sobre la
  // imagen de la fresa Mágnum hace caer un único pétalo, 1s, una sola vez.
  // Bajo prefers-reduced-motion no se arma ni se dispara.
  const reduceMotion = useReducedMotion();
  const isMagnum = product.variety === "Mágnum";
  const [petal, setPetal] = useState(false);
  const petalFired = useRef(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function firePetal() {
    if (reduceMotion || petalFired.current) return;
    petalFired.current = true;
    setPetal(true);
  }
  function startPress() {
    if (!isMagnum || reduceMotion || petalFired.current) return;
    pressTimer.current = setTimeout(firePetal, 460);
  }
  function cancelPress() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }
  useEffect(() => () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  }, []);

  function handleAddToCart() {
    addToCart({ name: product.name, price: product.price, image: product.images[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 56 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -8,
        boxShadow:
          "0 28px 64px rgba(150,42,31,0.17), 0 8px 24px rgba(0,0,0,0.09)",
      }}
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer"
      style={{
        boxShadow:
          "0 2px 18px rgba(150,42,31,0.07), 0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Carousel */}
      <div
        className="relative overflow-hidden rounded-t-2xl"
        onMouseEnter={isMagnum ? firePetal : undefined}
        onTouchStart={isMagnum ? startPress : undefined}
        onTouchEnd={isMagnum ? cancelPress : undefined}
        onTouchMove={isMagnum ? cancelPress : undefined}
        onTouchCancel={isMagnum ? cancelPress : undefined}
      >
        <ProductCarousel images={product.images} name={product.name} />

        {/* L4 — pétalo del easter egg Mágnum: cae una vez, 1s, y se desmonta. */}
        {petal && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 z-30"
            initial={{ y: -16, x: -8, rotate: -12, opacity: 0 }}
            animate={{ y: 250, x: 18, rotate: 78, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1, ease: "easeIn" }}
            onAnimationComplete={() => setPetal(false)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2C16 7 16 14 11 20C6 14 6 7 11 2Z" fill="#e8a090" />
            </svg>
          </motion.div>
        )}

        {/* Badge de variedad (M3 — sustituye al genérico "Premium") */}
        <div className="absolute top-3 left-3 z-20">
          <span className="relative inline-flex items-center overflow-hidden px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#7a1f17] bg-white/92 backdrop-blur-sm rounded-full shadow-sm">
            <motion.span
              aria-hidden
              className="absolute inset-y-0 w-6 skew-x-[-18deg] rounded-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
              }}
              animate={{ x: [-24, 90] }}
              transition={{
                duration: 1.8,
                ease: "linear",
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
            <span className="relative">{product.variety}</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-4">
        <div>
          <h3 className="font-serif text-[1.25rem] text-[#1a0808] leading-snug mb-2">
            {product.name}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Chip de trazabilidad (M1 — gate 2.5 #3: vive en Products, no en Hero).
            Origen + semana ISO de recogida. Footnote, sin animación. */}
        <p className="flex items-center gap-1.5 text-[0.6875rem] font-medium text-[#6e3232]">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3 shrink-0" aria-hidden>
            <circle cx="8" cy="8" r="5" />
            <path d="M8 1v2.5M8 12.5V15M1 8h2.5M12.5 8H15" strokeLinecap="round" />
          </svg>
          {harvestLabel} {season.harvestWeek}
        </p>

        <div className="pt-3 border-t border-[#f5c6c2]/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-[#1a0808]">{product.price.toFixed(2)}€</span>
              <span className="text-xs text-[var(--color-text-muted)] ml-1.5">/ 500g</span>
            </div>
            <a
              href="/checkout"
              className="group/btn inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-brand-primary)] hover:text-[#7a1f17] transition-colors duration-200"
            >
              {viewMoreLabel}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
          <button
            onClick={handleAddToCart}
            /* py-3 → alto de toque ≥44px (L2); rounded-md = 8px (decisión #3). */
            className={`w-full py-3 rounded-md text-sm font-bold transition-all duration-300 ${
              added
                ? "bg-green-500 text-white"
                : "text-white hover:shadow-lg"
            }`}
            style={added ? undefined : { background: "linear-gradient(125deg, #962a1f 0%, #b5341f 100%)" }}
          >
            {added ? (
              <span className="flex items-center justify-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M3 8l4 4 6-6" />
                </svg>
                {addedLabel}
              </span>
            ) : (
              addToCartLabel
            )}
          </button>
        </div>
      </div>

      {/* Bottom accent line — slides in on card hover */}
      <div
        className="h-[3px] w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{
          background: "linear-gradient(90deg, #962a1f 0%, #b5341f 50%, #962a1f 100%)",
        }}
      />
    </motion.div>
  );
}

export default function Products() {
  const { t } = useLanguage();
  const [active, setActive] = useState<Filter>("all");

  const products = PRODUCTS_BASE.map((p, i) => ({
    ...p,
    description: t.products.items[i].description,
  }));

  const filtered = active === "all" ? products : products.filter((p) => p.variety === active);

  return (
    <section
      id="productos"
      className="section relative"
      style={{
        backgroundColor: "#fdf6f5",
        backgroundImage:
          "radial-gradient(circle, rgba(150,42,31,0.10) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            className="inline-block text-[#962a1f] text-xs font-bold uppercase tracking-[0.18em] mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.products.eyebrow}
          </motion.span>
          {/* Decisión #2 (gate Fase 3): typewriter retirado → fade-up estándar. */}
          <motion.h2
            className="font-serif text-4xl md:text-5xl text-[#1a0808]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {t.products.title}
          </motion.h2>
          <motion.p
            className="mt-3 text-[var(--color-text-secondary)] max-w-md mx-auto text-[0.9375rem] leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {t.products.subtitle}
          </motion.p>
        </div>

        {/* Filtro por variedad (M9 — Mágnum / Dream / 1525) */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={active === f}
              onClick={() => setActive(f)}
              /* min-h 44px → tap target (L2); rounded-md = 8px (decisión #3). */
              className={`inline-flex items-center justify-center px-5 py-3 min-h-[44px] rounded-md text-sm font-semibold border-2 transition-all duration-200 cursor-pointer ${
                active === f
                  ? "bg-[#962a1f] border-[#962a1f] text-white shadow-sm"
                  : "border-[#962a1f]/30 text-[#962a1f] hover:border-[#962a1f] bg-white/60"
              }`}
            >
              {f === "all" ? t.products.all : f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProductCard
                key={p.name}
                product={p}
                index={i}
                addToCartLabel={t.products.addToCart}
                addedLabel={t.products.added}
                viewMoreLabel={t.products.viewMore}
                harvestLabel={t.products.harvestLabel}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
