"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
        /* L2 — selector de idioma con tap target ≥44px de alto. */
        className="flex items-center gap-1 min-h-[44px] px-1 cursor-pointer select-none transition-colors duration-200 hover:text-[#962a1f]"
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
                /* L2 — cada opción del desplegable con alto de toque ≥44px. */
                className="w-full px-3 min-h-[44px] flex items-center text-left transition-colors duration-150 cursor-pointer hover:bg-[#fdf0ef]"
                style={{ fontSize: 13, fontWeight: 500, color: lang === code ? "#962a1f" : "#1a0808" }}
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

/* Hamburguesa móvil — autorizada en gate 2.5 (decisión #2).
   Mínima: replica los 3 enlaces de nav + el CTA tienda en un panel
   desplegable bajo la barra. <768px hoy el nav móvil quedaba vacío. */
function MobileNav({
  navLinks,
  verTienda,
  menuLabel,
}: {
  navLinks: { label: string; href: string }[];
  verTienda: string;
  menuLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={menuLabel}
        /* L2 — tap target ≥44px (antes w-9 h-9 = 36px). */
        className="md:hidden flex items-center justify-center w-11 h-11 -mr-1.5 cursor-pointer"
        style={{ color: "#1a0808" }}
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-5 h-5">
          {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden absolute left-0 right-0 top-full bg-white px-6 py-4 flex flex-col"
            style={{ borderBottom: "1px solid #f0e0e0", boxShadow: "0 8px 20px rgba(26,8,8,0.08)" }}
          >
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                /* L2 — cada enlace del panel móvil con alto de toque ≥44px. */
                className="font-sans font-medium flex items-center min-h-[44px]"
                style={{ fontSize: 15, color: "#1a0808" }}
              >
                {label}
              </a>
            ))}
            <a
              href="/checkout"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center font-sans font-semibold text-white"
              /* L2 — minHeight 44px garantiza el tap target del CTA móvil. */
              style={{ backgroundColor: "#962a1f", borderRadius: 8, padding: "11px 20px", minHeight: 44, fontSize: 14 }}
            >
              {verTienda}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Hero() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

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
          {/* L1 — sin `unoptimized`: el logo pasa por el optimizador y se
              sirve en AVIF/WebP. `priority` se mantiene (única imagen
              above-the-fold); `loading="eager"` era redundante con priority. */}
          <Image
            src="/logo-nuevo.jpg"
            alt="Yaya Mariana"
            width={254}
            height={56}
            priority
            className="w-auto"
            style={{ height: 56 }}
          />
        </a>

        {/* Links centrales */}
        <ul className="hidden md:flex items-center list-none m-0 p-0">
          {navLinks.map(({ label, href }, i, arr) => (
            <li key={href} className="flex items-center">
              <motion.a
                href={href}
                className="relative font-sans font-medium pb-[3px]"
                style={{ fontSize: 14 }}
                variants={{ rest: { y: 0, color: "#1a0808" }, hover: { y: -2, color: "#962a1f" } }}
                initial="rest"
                whileHover="hover"
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {label}
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] bg-[#962a1f] w-full block"
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.a>
              {i < arr.length - 1 && (
                <span aria-hidden className="select-none" style={{ color: "#c8b8b8", padding: "0 14px" }}>·</span>
              )}
            </li>
          ))}
        </ul>

        {/* Derecha: idioma + botón */}
        <div className="flex items-center gap-5">
          <LanguageSelector />
          <motion.a
            href="/checkout"
            className="hidden md:inline-flex items-center justify-center font-sans font-semibold text-white overflow-hidden"
            /* Radio de botones unificado a 8px (decisión #3 — antes 6px). */
            style={{ backgroundColor: "#962a1f", borderRadius: 8, padding: "10px 20px", fontSize: 14 }}
            variants={{ rest: { scale: 1, boxShadow: "0 0 0 0px rgba(150,42,31,0)" }, hover: { scale: 1.04, boxShadow: "0 6px 20px rgba(150,42,31,0.35)", backgroundColor: "#7a1f17" } }}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.span
              className="flex items-center gap-1"
              variants={{ rest: { x: 0 }, hover: { x: 3 } }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {t.nav.menu.verTienda}
            </motion.span>
          </motion.a>
          <MobileNav
            navLinks={navLinks}
            verTienda={t.nav.menu.verTienda}
            menuLabel={t.nav.menu.label}
          />
        </div>
      </nav>

      <section className="relative overflow-hidden" style={{ isolation: "isolate", backgroundColor: "#fff5f5" }}>
        <MeshGradient
          colors={["#f5d0c8", "#e8a090", "#f0b8a8", "#ffd0c0", "#e89888"]}
          /* prefers-reduced-motion: speed 0 congela el shader (mantiene el degradado, sin movimiento) */
          speed={reduceMotion ? 0 : 0.5}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

      {/* Hero — 2 columnas */}
      {/* TANDA 1 — padding vertical simétrico (antes pt-16/pb-20 asimétrico). */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-0 px-6 md:px-12 py-20 min-h-[calc(100vh-72px)]">

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
              style={{ color: "var(--strawberry-700)", fontSize: 11, letterSpacing: "0.22em" }}
            >
              {t.hero.eyebrow}
            </p>
          </div>

          {/* Headline — cita = <h1> de la página (SEO). Mismo tratamiento Playfair italic. */}
          <div className="mb-0">
            <h1
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                /* TANDA 2 — strawberry-700: AA sobre el stop más oscuro del Mesh. */
                color: "var(--strawberry-700)",
                lineHeight: 1.3,
                margin: 0,
                fontWeight: 400,
              }}
            >
              "{t.hero.quoteText}"
            </h1>
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                /* TANDA 2 — text-secondary sólido: AA de cuerpo sobre el Mesh. */
                color: "var(--color-text-secondary)",
                marginTop: 8,
              }}
            >
              — {t.hero.quoteAuthor}
            </p>
          </div>

          {/* Línea decorativa */}
          <div
            className="my-6"
            style={{ width: 60, height: 3, backgroundColor: "#962a1f", borderRadius: 2 }}
          />

          {/* Botones */}
          <div className="flex items-center gap-5 flex-wrap">
            <motion.a
              href="#productos"
              className="inline-flex items-center justify-center text-sm font-semibold text-white overflow-hidden"
              style={{ backgroundColor: "#962a1f", borderRadius: 8, paddingLeft: 28, paddingRight: 28, paddingTop: 13, paddingBottom: 13 }}
              variants={{ rest: { scale: 1, boxShadow: "0 0 0 0px rgba(150,42,31,0)" }, hover: { scale: 1.04, boxShadow: "0 8px 24px rgba(150,42,31,0.4)", backgroundColor: "#7a1f17" } }}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <motion.span
                className="flex items-center gap-1.5"
                variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {t.hero.btn1}
                <motion.span
                  variants={{ rest: { opacity: 0, x: -8 }, hover: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >→</motion.span>
              </motion.span>
            </motion.a>
            <motion.a
              href="#sobre-nosotros"
              className="inline-flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "#962a1f" }}
              variants={{ rest: { x: 0, opacity: 1 }, hover: { x: 4, opacity: 0.8 } }}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {t.hero.btn2} →
            </motion.a>
          </div>
        </motion.div>

        {/* Columna derecha — bloque tipográfico Path T.
            Placa con las tres variedades. Sin animación: restraint museístico. */}
        <div className="w-full md:w-[45%] flex items-center justify-center">
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{
              maxWidth: 380,
              width: "100%",
              aspectRatio: "1 / 1",
              backgroundColor: "#ffffff",
              border: "1px solid #f0d0d0",
              padding: "clamp(32px, 6vw, 56px)",
            }}
          >
            <p
              className="font-sans font-semibold uppercase"
              style={{ color: "#962a1f", fontSize: 11, letterSpacing: "0.22em", margin: 0 }}
            >
              Tres variedades
            </p>
            <div
              aria-hidden
              style={{ width: 32, height: 2, backgroundColor: "#f0d0d0", borderRadius: 2, margin: "20px 0 4px" }}
            />
            {["Mágnum", "Dream", "1525"].map((variety, i) => (
              <div key={variety} className="flex flex-col items-center">
                {i > 0 && (
                  <span
                    aria-hidden
                    style={{ color: "#d8b0b0", fontSize: 13, lineHeight: 1, margin: "10px 0" }}
                  >
                    ·
                  </span>
                )}
                <span
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: "clamp(1.7rem, 3.4vw, 2.35rem)",
                    color: "#7a4a42",
                    lineHeight: 1.15,
                  }}
                >
                  {variety}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
      </section>
    </>
  );
}
