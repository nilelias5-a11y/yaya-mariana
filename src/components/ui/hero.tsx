"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useFocusTrap } from "@/hooks/use-focus-trap";
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

/* Hamburguesa movil — autorizada en gate 2.5 #2.
   Replica los 3 enlaces de nav + el CTA tienda en un panel desplegable
   bajo la barra. <768px hoy el nav movil queda vacio. focus-trap +
   Escape close + retorno de foco al boton al cerrar. */
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
  const close = useCallback(() => setOpen(false), []);
  const panelRef = useFocusTrap<HTMLDivElement>({ active: open, onClose: close });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={menuLabel}
        className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-[#1a0808]"
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-5 h-5" aria-hidden>
          {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="md:hidden absolute left-0 right-0 top-full bg-white px-6 py-4 flex flex-col"
            style={{ borderBottom: "1px solid #f0e0e0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
          >
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
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
              style={{ backgroundColor: "#c0392b", borderRadius: 6, padding: "11px 20px", fontSize: 14, minHeight: 44 }}
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

  const navLinks = t.nav.menu.items.slice(1).map((item, i) => ({
    label: item.label,
    href: NAV_HREFS[i],
  }));

  return (
    <>
      {/* Nav sticky — relative para que el panel MobileNav (absolute) se
          ancle al borde inferior del propio nav. paddingTop respeta el
          notch / barra de gestos en dispositivos con safe-area-inset-top. */}
      <nav
        aria-label={t.hero.navLabel}
        className="relative flex items-center justify-between px-6 md:px-12 bg-white"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 72,
          paddingTop: "env(safe-area-inset-top)",
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
                variants={{ rest: { y: 0, color: "#1a0808" }, hover: { y: -2, color: "#c0392b" } }}
                initial="rest"
                whileHover="hover"
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {label}
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] bg-[#c0392b] w-full block"
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

        {/* Derecha: idioma + botón desktop + hamburguesa movil */}
        <div className="flex items-center gap-5">
          <LanguageSelector />
          <motion.a
            href="/checkout"
            className="hidden md:inline-flex items-center justify-center font-sans font-semibold text-white overflow-hidden"
            style={{ backgroundColor: "#c0392b", borderRadius: 6, padding: "10px 20px", fontSize: 14 }}
            variants={{ rest: { scale: 1, boxShadow: "0 0 0 0px rgba(192,57,43,0)" }, hover: { scale: 1.04, boxShadow: "0 6px 20px rgba(192,57,43,0.35)", backgroundColor: "#a93226" } }}
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
          speed={0.5}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        {/* ENHANCE-2 — Grano filmográfico 4% sobre MeshGradient. SVG
            feTurbulence inlineado como background-image; mix-blend-multiply
            tinta el grano gris hacia los tonos cream/melocotón de la mesh
            sin introducir nuevos hex. Estático: cero impacto en motion. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            mixBlendMode: "multiply",
            opacity: 0.04,
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")",
            backgroundRepeat: "repeat",
          }}
        />

      {/* Hero — 2 columnas */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-0 px-6 md:px-12 pt-16 pb-20 min-h-[calc(100vh-72px)] min-h-[calc(100dvh-72px)]">

        {/* Columna izquierda */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="flex flex-col items-start w-full md:w-[55%] md:pr-10"
        >
          {/* Eyebrow con línea vertical decorativa.
              ENHANCE-2: línea vertical draw-in (scaleY origin-top 620ms),
              eyebrow letter-spacing settle 0.30→0.22em (880ms warm-lux),
              y hairline-rule horizontal 32×1px bajo el eyebrow (MIXTA
              aprobada por Nil — suma al sistema vertical+horizontal de
              acentos hairline, no toca el existente). */}
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.62, ease: [0.19, 1, 0.22, 1], delay: 0.38 }}
              style={{
                width: 1,
                height: 80,
                backgroundColor: "#f0d0d0",
                flexShrink: 0,
                transformOrigin: "top center",
              }}
            />
            <div className="flex flex-col items-start gap-2">
              <motion.p
                className="font-sans font-semibold uppercase"
                initial={{ letterSpacing: "0.30em", opacity: 0 }}
                animate={{ letterSpacing: "0.22em", opacity: 1 }}
                transition={{ duration: 0.88, ease: [0.19, 1, 0.22, 1], delay: 0.25 }}
                style={{ color: "#c0392b", fontSize: 11 }}
              >
                {t.hero.eyebrow}
              </motion.p>
              <motion.span
                aria-hidden
                className="block"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.72, ease: [0.19, 1, 0.22, 1], delay: 0.6 }}
                style={{
                  width: 32,
                  height: 1,
                  backgroundColor: "rgba(192,57,43,0.28)",
                  transformOrigin: "left center",
                }}
              />
            </div>
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

          {/* Línea decorativa — ENHANCE-2: entrada scaleX origin-left
              720ms warm-lux, delay 500ms (encadenada tras eyebrow). */}
          <motion.div
            className="my-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.72, ease: [0.19, 1, 0.22, 1], delay: 0.5 }}
            style={{
              width: 60,
              height: 3,
              backgroundColor: "#c0392b",
              borderRadius: 2,
              transformOrigin: "left center",
            }}
          />

          {/* Botones */}
          <div className="flex items-center gap-5 flex-wrap">
            <motion.a
              href="#productos"
              className="inline-flex items-center justify-center text-sm font-semibold text-white overflow-hidden"
              style={{ backgroundColor: "#c0392b", borderRadius: 8, paddingLeft: 28, paddingRight: 28, paddingTop: 13, paddingBottom: 13 }}
              variants={{ rest: { scale: 1, boxShadow: "0 0 0 0px rgba(192,57,43,0)" }, hover: { scale: 1.04, boxShadow: "0 8px 24px rgba(192,57,43,0.4)", backgroundColor: "#a93226" } }}
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
              style={{ color: "#c0392b" }}
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

        {/* Columna derecha — logo oficial.
            ENHANCE-2: aura radial cream-rosa (#f5c6c2 35% alpha) detrás
            del logo, blur 40px. Sibling absolute al motion.div del logo
            para que la `mixBlendMode: multiply` del logo no toque el halo. */}
        <div className="w-full md:w-[45%] relative flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
          >
            <div
              style={{
                width: 420,
                height: 420,
                maxWidth: "90%",
                background:
                  "radial-gradient(circle at center, rgba(245,198,194,0.35) 0%, transparent 60%)",
                filter: "blur(40px)",
              }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
            className="relative flex items-center justify-center w-full"
            style={{ filter: "drop-shadow(0 0 0px rgba(0,0,0,0))", mixBlendMode: "multiply" }}
          >
            <div className="logo-blend" style={{ maxWidth: 380, width: "100%", display: "flex", justifyContent: "center" }}>
              <Image
                src="/logo-nuevo.jpg"
                alt="Yaya Mariana"
                width={380}
                height={380}
                priority
                className="h-auto"
                style={{ maxWidth: 380, width: "100%" }}
              />
            </div>
          </motion.div>
        </div>

      </div>

      {/* ENHANCE-2 — Scroll cue idle abajo-centrado (solo md+). Label
          uppercase + chevron drift. MotionConfig reducedMotion="user"
          neutraliza el bounce automáticamente. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-6 z-10 hidden md:flex flex-col items-center gap-2 pointer-events-none"
      >
        <span
          className="font-sans font-semibold uppercase"
          style={{ color: "#c0392b", fontSize: 10, letterSpacing: "0.22em", opacity: 0.7 }}
        >
          {t.hero.scrollCue}
        </span>
        <motion.svg
          viewBox="0 0 16 16"
          width={14}
          height={14}
          fill="none"
          stroke="#c0392b"
          strokeOpacity={0.7}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M4 6l4 4 4-4" />
        </motion.svg>
      </motion.div>
      </section>
    </>
  );
}
