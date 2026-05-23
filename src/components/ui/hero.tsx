"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { Button } from "@/components/ui/button";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  /* TANDA 4 (#25) — refs de las opciones para navegación con flechas. */
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  /* #25 — al abrir, foco en la opción seleccionada. */
  useEffect(() => {
    if (!open) return;
    const idx = LANG_OPTIONS.findIndex((o) => o.code === lang);
    optionRefs.current[idx >= 0 ? idx : 0]?.focus();
  }, [open, lang]);

  function close(returnFocus = true) {
    setOpen(false);
    /* #25 — retorno de foco al trigger al cerrar. */
    if (returnFocus) triggerRef.current?.focus();
  }

  /* #25 — Escape cierra; flechas ↑/↓ navegan entre opciones. */
  function handleListKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const current = optionRefs.current.findIndex((el) => el === document.activeElement);
      const delta = e.key === "ArrowDown" ? 1 : -1;
      const nextIdx = (current + delta + LANG_OPTIONS.length) % LANG_OPTIONS.length;
      optionRefs.current[nextIdx]?.focus();
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && open) {
            e.preventDefault();
            close();
          }
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        /* L2 — selector de idioma con tap target ≥44px de alto. */
        className="flex items-center gap-1 min-h-[44px] px-1 cursor-pointer select-none transition-colors duration-200 hover:text-[var(--color-brand-primary)]"
        style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}
      >
        <span>{lang.toUpperCase()}</span>
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-2.5 h-2.5" aria-hidden>
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
            onKeyDown={handleListKeyDown}
            /* TANDA 1 — borde/sombra tokenizados: `#f0e0e0` →
               `--color-border-subtle`, `boxShadow` inline → `--shadow-dropdown`. */
            className="absolute right-0 top-[calc(100%+8px)] w-20 bg-[var(--color-bg-surface)] rounded-lg overflow-hidden z-50"
            style={{ border: "1px solid var(--color-border-subtle)", boxShadow: "var(--shadow-dropdown)" }}
          >
            {LANG_OPTIONS.map(({ code, label }, i) => (
              <button
                key={code}
                ref={(el) => { optionRefs.current[i] = el; }}
                role="option"
                aria-selected={lang === code}
                onClick={() => { setLang(code); close(); }}
                /* L2 — cada opción del desplegable con alto de toque ≥44px. */
                className="w-full px-3 min-h-[44px] flex items-center text-left transition-colors duration-150 cursor-pointer hover:bg-[var(--color-bg-subtle)]"
                style={{ fontSize: 13, fontWeight: 500, color: lang === code ? "var(--color-brand-primary)" : "var(--color-text-primary)" }}
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
  /* TANDA 4 (#25) — focus-trap del panel móvil + Escape-close +
     retorno de foco al botón hamburguesa al cerrar. */
  const closePanel = useCallback(() => setOpen(false), []);
  const panelRef = useFocusTrap<HTMLDivElement>({ active: open, onClose: closePanel });

  return (
    <>
      {/* TANDA 2 — hamburguesa: botón icon-only del sistema (.btn-icon),
          caja 44×44 coherente con el resto de iconos del sitio. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={menuLabel}
        className="btn-icon md:hidden -mr-1.5 text-[var(--color-text-primary)]"
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
            /* TANDA 1 — borde/sombra tokenizados: `#f0e0e0` →
               `--color-border-subtle`, `boxShadow` inline → `--shadow-dropdown`. */
            className="md:hidden absolute left-0 right-0 top-full bg-[var(--color-bg-surface)] px-6 py-4 flex flex-col"
            style={{ borderBottom: "1px solid var(--color-border-subtle)", boxShadow: "var(--shadow-dropdown)" }}
          >
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                /* L2 — cada enlace del panel móvil con alto de toque ≥44px. */
                className="font-sans font-medium flex items-center min-h-[44px]"
                style={{ fontSize: 15, color: "var(--color-text-primary)" }}
              >
                {label}
              </a>
            ))}
            {/* TANDA 2 — CTA del sistema (Button primario, size sm).
                E1 — destino re-apuntado a `#productos`: la compra empieza
                por "Añadir al carrito", no en un /checkout vacío. */}
            <Button
              as="a"
              href="#productos"
              variant="primary"
              size="sm"
              block
              className="mt-3"
              onClick={() => setOpen(false)}
            >
              {verTienda}
            </Button>
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
      {/* TANDA 4 — aria-label traducible (#ME-19); padding-top respeta
          env(safe-area-inset-top) en dispositivos con notch (#ME-16). */}
      {/* TANDA 1 — borde y sombra del nav tokenizados (antes `#f0e0e0` y un
          `boxShadow` inline crudo): `--color-border-subtle` + `--shadow-nav`. */}
      <nav
        aria-label={t.hero.navLabel}
        className="flex items-center justify-between px-6 md:px-12 bg-[var(--color-bg-surface)]"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 72,
          paddingTop: "env(safe-area-inset-top)",
          borderBottom: "1px solid var(--color-border-subtle)",
          boxShadow: "var(--shadow-nav)",
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
              {/* TANDA 5 (HI-6) — motion de tributo: el nav-link ya no sube
                  (y:-2) ni cambia de color en hover; solo el subrayado
                  scaleX señala el hover, conforme a ui-spec §3.12. */}
              <motion.a
                href={href}
                className="relative font-sans font-medium pb-[3px]"
                style={{ fontSize: 14, color: "var(--color-text-primary)" }}
                initial="rest"
                whileHover="hover"
              >
                {label}
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] bg-[var(--color-brand-primary)] w-full block"
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.a>
              {i < arr.length - 1 && (
                /* TANDA 1 — separador decorativo `#c8b8b8` → token `--cream-400`. */
                <span aria-hidden className="select-none" style={{ color: "var(--cream-400)", padding: "0 14px" }}>·</span>
              )}
            </li>
          ))}
        </ul>

        {/* Derecha: idioma + botón */}
        <div className="flex items-center gap-5">
          <LanguageSelector />
          {/* TANDA 2 — CTA de nav: Button del sistema, size sm (nav/compacto).
              El hover (cambio de superficie, sin scale/glow) lo da el CSS del
              sistema — además focusable por teclado (D11). E1 — destino
              re-apuntado a `#productos` (antes /checkout directo: el visitante
              caía en un checkout vacío). */}
          <Button
            as="a"
            href="#productos"
            variant="primary"
            size="sm"
            className="hidden md:inline-flex"
          >
            {t.nav.menu.verTienda}
          </Button>
          <MobileNav
            navLinks={navLinks}
            verTienda={t.nav.menu.verTienda}
            menuLabel={t.nav.menu.label}
          />
        </div>
      </nav>

      <section className="relative overflow-hidden" style={{ isolation: "isolate", backgroundColor: "var(--color-bg-base)" }}>
        {/* TANDA 5 (ME-21) — MeshGradient dentro de la disciplina 2-color:
            el shader de 5 rosas-melocotón ajenos al sistema se reduce a 3
            tonos cream de la paleta de marca (cream-100/200/300). Conserva
            un susurro de calidez en el Hero sin romper el restraint. */}
        <MeshGradient
          colors={["#fdf6f5", "#fdf0ef", "#ead7d4"]}
          /* prefers-reduced-motion: speed 0 congela el shader (mantiene el degradado, sin movimiento) */
          speed={reduceMotion ? 0 : 0.5}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />

      {/* Hero — 2 columnas */}
      {/* TANDA 1 — padding vertical simétrico (antes pt-16/pb-20 asimétrico). */}
      {/* TANDA 1 (Fase 5) — gutter SIMÉTRICO entre columnas: el canal central
          lo aporta ahora un `md:gap-16` real en el flex padre (antes el
          espacio era unilateral — `md:pr-10` solo en la columna izquierda,
          sin `pl` simétrico en la derecha). */}
      {/* TANDA 4 (#HI-14) — 100dvh evita el salto por la barra de URL de iOS;
          100vh queda como fallback para navegadores sin soporte de dvh. */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16 px-6 md:px-12 py-20 min-h-[calc(100vh-72px)] min-h-[calc(100dvh-72px)]">

        {/* Columna izquierda */}
        {/* TANDA 5 (HI-22) — entrada de barrido x:-40 sustituida por
            fade-up discreto translateY 14px: movimiento corto y digno. */}
        {/* TANDA 1 (Fase 5) — `md:pr-10` retirado: el canal entre columnas lo
            gobierna el `md:gap-16` del padre, simétrico para ambas. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="flex flex-col items-start w-full md:w-[55%]"
        >
          {/* Eyebrow con línea vertical decorativa */}
          {/* TANDA 1 — `mb-5`(20px)→`mb-6`(24px): el eyebrow del Hero alinea
              su ritmo de separación al resto de la pila. Línea decorativa
              `#f0d0d0` → token `--cream-300`. */}
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: 1, height: 80, backgroundColor: "var(--cream-300)", flexShrink: 0 }} />
            {/* Issue #6 — eyebrow unificado a .text-overline (11px/600/0.18em). */}
            <p className="text-overline" style={{ color: "var(--color-brand-pressed)" }}>
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
                /* TANDA 2 — brand-pressed (strawberry-700): AA sobre el stop más oscuro del Mesh. */
                color: "var(--color-brand-pressed)",
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
            style={{ width: 60, height: 3, backgroundColor: "var(--color-brand-primary)", borderRadius: 2 }}
          />

          {/* Botones */}
          {/* TANDA 2 — botones del sistema: primario size md (foco del Hero)
              + ghost (subrayado scaleX, sin la flecha literal `→` que lo hacía
              competir con el primario — D5). El hover sobrio lo da el CSS. */}
          <div className="flex items-center gap-5 flex-wrap">
            <Button as="a" href="#productos" variant="primary" size="md">
              {t.hero.btn1}
            </Button>
            <Button as="a" href="#sobre-nosotros" variant="ghost">
              {t.hero.btn2}
            </Button>
          </div>
        </motion.div>

        {/* Columna derecha — bloque tipográfico Path T.
            Placa con las tres variedades. Sin animación: restraint museístico.
            Issue #3 — placa demotada a soporte: sin borde (fondo --color-bg-subtle
            sin contorno) y nombres reducidos para que la cita <h1> gane el squint. */}
        {/* TANDA 1 (Fase 5) — `maxWidth` 380→440: la placa cuadrada gana
            altura para acercarse a la masa vertical de la columna de texto
            (antes era visiblemente más baja a desktop ancho y "flotaba" con
            aire muerto arriba y abajo). */}
        <div className="w-full md:w-[45%] flex items-center justify-center">
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{
              maxWidth: 440,
              width: "100%",
              aspectRatio: "1 / 1",
              backgroundColor: "var(--color-bg-subtle)",
              padding: "clamp(32px, 6vw, 56px)",
            }}
          >
            <p className="text-overline" style={{ color: "var(--color-brand-primary)", margin: 0 }}>
              Tres variedades
            </p>
            {/* TANDA 1 (Fase 5) — divisor con margen simétrico (12px arriba y
                abajo, antes "20px 0 4px" asimétrico): la pila interna queda
                ópticamente centrada dentro del cuadrado. Hex `#f0d0d0` → token. */}
            <div
              aria-hidden
              style={{ width: 32, height: 2, backgroundColor: "var(--cream-400)", borderRadius: 2, margin: "12px 0" }}
            />
            {["Mágnum", "Dream", "1525"].map((variety, i) => (
              <div key={variety} className="flex flex-col items-center">
                {i > 0 && (
                  /* TANDA 1 — separador decorativo `#d8b0b0` → token `--cream-400`. */
                  <span
                    aria-hidden
                    style={{ color: "var(--cream-400)", fontSize: 13, lineHeight: 1, margin: "10px 0" }}
                  >
                    ·
                  </span>
                )}
                <span
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontSize: "clamp(1.35rem, 2.6vw, 1.75rem)",
                    color: "var(--color-text-secondary)",
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
