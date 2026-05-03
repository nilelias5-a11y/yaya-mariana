"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Sobre nosotros", href: "#sobre-nosotros" },
];

const MENU_ITEMS = [
  {
    label: "Inicio",
    subtitle: "Volver al principio",
    href: "#",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M7 18v-5h6v5" />
      </svg>
    ),
  },
  {
    label: "Productos",
    subtitle: "Nuestras fresas premium",
    href: "#productos",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M6 2L3 6v12a2 2 0 002 2h10a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="17" y2="6" />
        <path d="M13 10a3 3 0 01-6 0" />
      </svg>
    ),
  },
  {
    label: "Sobre nosotros",
    subtitle: "La historia de la Yaya",
    href: "#sobre-nosotros",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
      </svg>
    ),
  },
  {
    label: "Contacto",
    subtitle: "Escríbenos",
    href: "#contacto",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-5 h-5">
        <rect x="2" y="5" width="16" height="12" rx="2" />
        <path d="M2 7l8 5.5L18 7" />
      </svg>
    ),
  },
];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const panelVariants = {
  hidden: { opacity: 0, scale: 0.9, y: -10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 320, damping: 28, staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit: {
    opacity: 0, scale: 0.92, y: -8,
    transition: { duration: 0.18, ease: "easeIn" as const, staggerChildren: 0.04, staggerDirection: -1 as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
  exit: { opacity: 0, y: 4, transition: { duration: 0.12 } },
};

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

function MenuDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2.5 bg-white/75 backdrop-blur-md text-[#c0392b] text-sm font-semibold px-4 py-2.5 rounded-full cursor-pointer select-none hover:bg-white/95 transition-all duration-200 shadow-sm"
        style={{ border: "1px solid rgba(192,57,43,0.2)" }}
      >
        {/* Hamburger → X */}
        <div className="w-4 h-3.5 flex flex-col justify-between shrink-0">
          <motion.span
            className="block h-[2px] bg-[#c0392b] rounded-full"
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          />
          <motion.span
            className="block h-[2px] bg-[#c0392b] rounded-full"
            animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block h-[2px] bg-[#c0392b] rounded-full"
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          />
        </div>
        Menú
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-[calc(100%+12px)] w-[300px] rounded-3xl z-50 bg-white overflow-hidden"
            style={{
              boxShadow: "0 32px 80px rgba(192,57,43,0.15), 0 8px 24px rgba(0,0,0,0.06)",
              border: "1px solid rgba(192,57,43,0.1)",
            }}
          >
            {/* Logo */}
            <motion.div variants={itemVariants} className="px-5 pt-5 pb-2">
              <Image
                src="https://yayamariana.com/wp-content/uploads/2024/11/YAYA_MARIANA_VECTORIAL-01.png"
                alt="Yaya Mariana"
                width={120}
                height={34}
                className="h-10 w-auto"
                unoptimized
              />
            </motion.div>

            {/* Nav items */}
            <div className="px-3 pb-3 space-y-0.5">
              {MENU_ITEMS.map(({ label, subtitle, href, icon }) => (
                <motion.div key={label} variants={itemVariants}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="group relative flex items-center gap-3.5 px-3 py-2.5 rounded-2xl overflow-hidden"
                  >
                    {/* Hover bg */}
                    <span className="absolute inset-0 rounded-2xl bg-[#fdf0ef] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                    {/* Icon box */}
                    <span className="relative w-9 h-9 rounded-xl bg-[#fdf0ef] group-hover:bg-[#f5c6c2] flex items-center justify-center text-[#c0392b] shrink-0 transition-colors duration-200">
                      {icon}
                    </span>
                    {/* Labels */}
                    <span className="relative flex flex-col">
                      <span className="text-[0.9375rem] font-semibold text-[#1a0808] leading-snug">{label}</span>
                      <span className="text-xs text-[#7a3a3a]/55">{subtitle}</span>
                    </span>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Separator */}
            <div className="mx-4 h-px bg-[#f5c6c2]/60" />

            {/* Tienda button */}
            <div className="p-3">
              <motion.div variants={itemVariants}>
                <motion.a
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative flex items-center justify-between w-full px-5 py-3.5 overflow-hidden text-white text-sm font-bold"
                  style={{ background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)", borderRadius: 16 }}
                >
                  {/* Shimmer */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 w-16 skew-x-[-20deg] pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                    animate={{ x: [-60, 320] }}
                    transition={{ duration: 2.2, ease: "linear", repeat: Infinity, repeatDelay: 1 }}
                  />
                  <span className="relative">Ver tienda →</span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="relative w-4 h-4">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  // Texto sube más lento que el fondo → efecto parallax
  const textY = useTransform(scrollY, [0, 600], [0, -110]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Fondo fijo — el texto se mueve más lento que él */}
      <MeshGradient
        colors={["#fdf6f5", "#c0392b", "#e74c3c", "#fdf0ef", "#f5c6c2"]}
        speed={0.4}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <div style={{ position: "absolute", inset: 0, opacity: 0.2, mixBlendMode: "soft-light" }}>
        <MeshGradient
          colors={["#ffffff", "#c0392b", "#e74c3c", "#fdf0ef"]}
          speed={0.18}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Nav — sin parallax para que quede fijo */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5">
        <Image
          src="https://yayamariana.com/wp-content/uploads/2024/11/YAYA_MARIANA_VECTORIAL-01.png"
          alt="Yaya Mariana"
          width={160}
          height={44}
          priority
          unoptimized
          className="h-[44px] w-auto"
        />
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className="text-sm font-medium text-[#4a1515]/80 hover:text-[#c0392b] transition-colors duration-200">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <MenuDropdown />
      </nav>

      {/* Contenido con parallax */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-10 pb-24 max-w-4xl mx-auto gap-5"
      >
        <motion.h1
          {...fadeUp(0.1)}
          className="font-serif leading-[0.88] tracking-tight"
          style={{ fontSize: "clamp(4.5rem, 13vw, 9.5rem)" }}
        >
          <span
            className="block"
            style={{
              background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Fresas
          </span>
          <span className="block font-black text-[#1a0808]">Yaya</span>
          <span className="block italic text-white" style={{ textShadow: "0 3px 28px rgba(0,0,0,0.22)" }}>
            Mariana
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.22)}
          className="max-w-[26rem] text-[0.9375rem] leading-relaxed text-[#7a3a3a]/75"
        >
          Fresas frescas del Maresme, cultivadas con el mismo cariño que le pondría tu abuela. Sin pesticidas, naturales y siempre en su punto.
        </motion.p>

        <motion.div
          {...fadeUp(0.33)}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <a
            href="#productos"
            className="text-sm font-semibold px-7 py-3 rounded-full border-2 border-[#c0392b] text-[#c0392b] bg-transparent hover:bg-[#c0392b]/10 transition-colors"
          >
            Ver nuestras fresas
          </a>
          <a
            href="#sobre-nosotros"
            className="text-sm font-semibold px-7 py-3 rounded-full text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)" }}
          >
            Nuestra historia
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
