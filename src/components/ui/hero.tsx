"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/language-context";
import type { Lang } from "@/i18n/translations";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "ca", label: "CA" },
  { code: "en", label: "EN" },
];

const NAV_HREFS = ["#productos", "#sobre-nosotros", "#contacto"];

function LanguageSelector() {
  const { lang, setLang } = useLanguage();
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
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1 cursor-pointer select-none transition-colors duration-200 hover:text-[#c0392b]"
        style={{ fontSize: 13, fontWeight: 500, color: "#1a0808" }}
      >
        <span>{lang.toUpperCase()}</span>
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-2.5 h-2.5">
          <path d="M2 4.5l4 4 4-4" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute right-0 top-[calc(100%+8px)] w-20 bg-white rounded-lg overflow-hidden z-50"
            style={{ border: "1px solid #f0e0e0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
          >
            {LANG_OPTIONS.map(({ code, label }) => (
              <button
                key={code}
                role="option"
                aria-selected={lang === code}
                onClick={() => { setLang(code); setOpen(false); }}
                className="w-full px-3 py-2 text-left transition-colors duration-150 cursor-pointer hover:bg-[#fdf0ef]"
                style={{ fontSize: 13, fontWeight: 500, color: lang === code ? "#c0392b" : "#1a0808" }}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();

  const navLinks = t.nav.menu.items.slice(1).map((item, i) => ({
    label: item.label,
    href: NAV_HREFS[i],
  }));

  return (
    <>
      {/* Nav sticky */}
      <nav
        className="flex items-center justify-between px-6 md:px-12 bg-white"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 72,
          borderBottom: "1px solid #f0e0e0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo */}
        <a href="/" className="shrink-0">
          <Image
            src="/logo-nuevo.jpg"
            alt="Yaya Mariana"
            width={254}
            height={56}
            priority
            loading="eager"
            unoptimized
            className="w-auto"
            style={{ height: 56 }}
          />
        </a>

        {/* Links centrales */}
        <ul className="hidden md:flex items-center list-none m-0 p-0">
          {navLinks.map(({ label, href }, i, arr) => (
            <li key={href} className="flex items-center">
              <a
                href={href}
                className="font-sans font-medium transition-colors duration-200 hover:text-[#c0392b]"
                style={{ fontSize: 14, color: "#1a0808" }}
              >
                {label}
              </a>
              {i < arr.length - 1 && (
                <span aria-hidden className="select-none" style={{ color: "#c8b8b8", padding: "0 14px" }}>·</span>
              )}
            </li>
          ))}
        </ul>

        {/* Derecha: idioma + botón */}
        <div className="flex items-center gap-5">
          <LanguageSelector />
          <a
            href="/checkout"
            className="hidden md:inline-flex items-center justify-center font-sans font-semibold text-white transition-colors duration-200 hover:bg-[#a93226]"
            style={{
              backgroundColor: "#c0392b",
              borderRadius: 6,
              padding: "10px 20px",
              fontSize: 14,
            }}
          >
            {t.nav.menu.verTienda}
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden" style={{ isolation: "isolate", backgroundColor: "#fff5f5" }}>
        <MeshGradient
          colors={["#f5d0c8", "#e8a090", "#f0b8a8", "#ffd0c0", "#e89888"]}
          speed={0.5}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1, pointerEvents: "none" }}
        />

      {/* Hero — 2 columnas */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-0 px-6 md:px-12 pt-16 pb-20 min-h-[calc(100vh-72px)]">

        {/* Columna izquierda */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="flex flex-col items-start w-full md:w-[55%] md:pr-10"
        >
          {/* Eyebrow con línea vertical decorativa */}
          <div className="flex items-center gap-3 mb-5">
            <div style={{ width: 1, height: 80, backgroundColor: "#f0d0d0", flexShrink: 0 }} />
            <p
              className="font-sans font-semibold uppercase"
              style={{ color: "#c0392b", fontSize: 11, letterSpacing: "0.22em" }}
            >
              Tarragona · Qualitat premium
            </p>
          </div>

          {/* Headline — cita en Yellowtail */}
          <div className="mb-0">
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#c0392b",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              "{t.hero.quoteText}"
            </p>
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                color: "#7a4a42",
                marginTop: 8,
              }}
            >
              — {t.hero.quoteAuthor}
            </p>
          </div>

          {/* Línea decorativa */}
          <div
            className="my-6"
            style={{ width: 60, height: 3, backgroundColor: "#c0392b", borderRadius: 2 }}
          />

          {/* Botones */}
          <div className="flex items-center gap-5 flex-wrap">
            <motion.a
              href="#productos"
              className="inline-flex items-center justify-center text-sm font-semibold text-white"
              style={{
                backgroundColor: "#c0392b",
                borderRadius: 8,
                paddingLeft: 28,
                paddingRight: 28,
                paddingTop: 13,
                paddingBottom: 13,
                boxShadow: "0 0 0 0px rgba(192,57,43,0)",
                transition: "background-color 0.2s, box-shadow 0.25s",
              }}
              whileHover={{
                backgroundColor: "#a93226",
                boxShadow: "0 0 0 4px rgba(192,57,43,0.22)",
              }}
            >
              {t.hero.btn1}
            </motion.a>
            <a
              href="#sobre-nosotros"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-70"
              style={{ color: "#c0392b" }}
            >
              {t.hero.btn2} →
            </a>
          </div>
        </motion.div>

        {/* Columna derecha — logo oficial */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
          className="w-full md:w-[45%] flex items-center justify-center"
          style={{ filter: "drop-shadow(0 0 0px rgba(0,0,0,0))", mixBlendMode: "multiply" }}
        >
          <div className="logo-blend" style={{ maxWidth: 380, width: "100%", display: "flex", justifyContent: "center" }}>
            <Image
              src="/logo-nuevo.jpg"
              alt="Yaya Mariana"
              width={380}
              height={380}
              unoptimized
              priority
              className="h-auto"
              style={{ maxWidth: 380, width: "100%" }}
            />
          </div>
        </motion.div>

      </div>
      </section>
    </>
  );
}
