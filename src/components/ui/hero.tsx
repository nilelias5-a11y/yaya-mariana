"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Productos", href: "#productos" },
  { label: "Sobre nosotros", href: "#sobre-nosotros" },
  { label: "Contacto", href: "#contacto" },
];

const MENU_ITEMS = [
  {
    label: "Inicio",
    href: "#",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" className="w-4 h-4">
        <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M7 18v-5h6v5" />
      </svg>
    ),
  },
  {
    label: "Productos",
    href: "#productos",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-4 h-4">
        <path d="M10 2C6.5 7.5 4 11 4 14a6 6 0 0012 0c0-3-2.5-6.5-6-12z" />
      </svg>
    ),
  },
  {
    label: "Sobre nosotros",
    href: "#sobre-nosotros",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-4 h-4">
        <circle cx="10" cy="7" r="3" />
        <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" />
      </svg>
    ),
  },
  {
    label: "Contacto",
    href: "#contacto",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-4 h-4">
        <rect x="2" y="5" width="16" height="12" rx="2" />
        <path d="M2 7l8 5.5L18 7" />
      </svg>
    ),
  },
];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const panelVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: {
      duration: 0.22, ease: EASE_OUT,
      staggerChildren: 0.07, delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0, y: -8, scale: 0.96,
    transition: { duration: 0.15, ease: "easeIn" as const, staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: EASE_OUT } },
  exit: { opacity: 0, x: -6, transition: { duration: 0.12 } },
};

const CIRCLE_TEXT =
  "Yaya Mariana • Lechugas frescas • Sin pesticidas • Cultivo hidropónico • ";

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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button — glass style */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/40 text-white text-sm font-semibold px-5 py-2.5 rounded-full cursor-pointer select-none hover:bg-white/30 hover:border-white/60 transition-all duration-200"
      >
        <motion.svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="w-4 h-4 shrink-0"
          animate={open ? { rotate: 90, opacity: 0.7 } : { rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="15" x2="17" y2="15" />
        </motion.svg>
        Menú
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-[calc(100%+14px)] w-[260px] rounded-3xl overflow-hidden z-50"
            style={{
              background: "linear-gradient(160deg, #0c1f0e 0%, #163220 45%, #1f4f25 100%)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(76,175,80,0.25)",
            }}
          >
            {/* Nav links */}
            <div className="p-3 space-y-0.5">
              {MENU_ITEMS.map(({ label, href, icon }) => (
                <motion.div key={label} variants={itemVariants}>
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className="group relative flex items-center gap-3 px-4 py-2.5 rounded-xl overflow-hidden text-white/75 hover:text-white transition-colors duration-200"
                  >
                    {/* Hover highlight slide */}
                    <span className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/8 transition-colors duration-200" />
                    {/* Left accent bar on hover */}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 group-hover:h-5 bg-[#4caf50] rounded-full transition-all duration-200" />
                    <span className="relative text-[#4caf50] shrink-0">{icon}</span>
                    <span className="relative text-sm font-medium">{label}</span>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Separator */}
            <div className="mx-4 h-px bg-white/10" />

            {/* Tienda — highlighted with shimmer */}
            <div className="p-3">
              <motion.div variants={itemVariants}>
                <a
                  href="https://yayamariana.com/tienda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="relative flex items-center justify-between w-full px-5 py-3 rounded-2xl overflow-hidden text-white text-sm font-bold"
                  style={{ background: "linear-gradient(125deg, #2d7a2d 0%, #4caf50 100%)" }}
                >
                  {/* Shimmer sweep */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 w-16 skew-x-[-20deg] rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
                    animate={{ x: [-60, 300] }}
                    transition={{ duration: 2.4, ease: "linear", repeat: Infinity, repeatDelay: 0.8 }}
                  />
                  <span className="relative">Tienda</span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative w-4 h-4"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Primary MeshGradient background */}
      <MeshGradient
        colors={["#f5f9f0", "#2d7a2d", "#4caf50", "#eaf7ea", "#c8e6c9"]}
        speed={0.4}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Wireframe MeshGradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.2,
          mixBlendMode: "soft-light",
        }}
      >
        <MeshGradient
          colors={["#ffffff", "#2d7a2d", "#4caf50", "#eaf7ea"]}
          speed={0.18}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Nav */}
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
              <a
                href={href}
                className="text-sm font-medium text-[#1b3d1b]/80 hover:text-[#2d7a2d] transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <MenuDropdown />
      </nav>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-10 pb-24 max-w-4xl mx-auto gap-5">
        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="font-serif leading-[0.88] tracking-tight"
          style={{ fontSize: "clamp(4.5rem, 13vw, 9.5rem)" }}
        >
          <span
            className="block"
            style={{
              background: "linear-gradient(125deg, #2d7a2d 0%, #4caf50 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Frescas
          </span>
          <span className="block font-black text-[#0e1e0e]">Yaya</span>
          <span
            className="block italic text-white"
            style={{ textShadow: "0 3px 28px rgba(0,0,0,0.22)" }}
          >
            Mariana
          </span>
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          {...fadeUp(0.22)}
          className="max-w-[26rem] text-[0.9375rem] leading-relaxed text-[#2a4a2a]/75"
        >
          Cultivadas con el mismo cariño y cuidado que le pondría tu abuela.
          Frescas, naturales y directas a tu mesa. Sin pesticidas, sin químicos.
        </motion.p>

        {/* Buttons */}
        <motion.div
          {...fadeUp(0.33)}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <a
            href="#productos"
            className="text-sm font-semibold px-7 py-3 rounded-full border-2 border-[#2d7a2d] text-[#2d7a2d] bg-transparent hover:bg-[#2d7a2d]/10 transition-colors"
          >
            Ver productos
          </a>
          <a
            href="#sobre-nosotros"
            className="text-sm font-semibold px-7 py-3 rounded-full text-white hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(125deg, #2d7a2d 0%, #4caf50 100%)" }}
          >
            Nuestra historia
          </a>
        </motion.div>
      </div>
    </section>
  );
}
