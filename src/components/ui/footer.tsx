"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

/* Enlaces internos del footer vía Next <Link> (navegación cliente:
   preserva el carrito en memoria y el contexto de idioma). Cubre rutas
   (páginas legales) y anclas de misma página (#sección). */
const MotionLink = motion.create(Link);

/* ENHANCE-5 socials reorder: Instagram primero (orden de relevancia
   visual para una marca de fresa premium). El resto sigue por uso. */
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

/* FA-02: Underline draw-in variants para motion.a nav links */
const navLinkVariants = {
  rest: { x: 0, color: "rgba(255,255,255,0.65)" },
  hover: { x: 4, color: "#c0392b" },
};
const underlineVariants = {
  rest: { scaleX: 0, transformOrigin: "left center" as const },
  hover: { scaleX: 1, transformOrigin: "left center" as const },
};

export default function Footer() {
  const { t } = useLanguage();

  /* Enlaces legales: ahora apuntan a las paginas internas reales
     (T5: aviso-legal, privacidad, cookies, terminos, devoluciones).
     blog -> #sobre-nosotros (lo mas cercano a "story" sin pagina propia);
     shipping -> #contacto (preguntar por envios via contacto).
     shop -> #productos (seccion de fresas de la home): "ver/explorar
     producto" nunca lleva directo al pago; el checkout real solo desde el
     carrito y el boton "Comprar". */
  const navLinks = [
    {
      heading: t.footer.shop,
      items: [
        { label: "Fresa Mágnum", href: "#productos" },
        { label: "Fresa Dream", href: "#productos" },
        { label: "Fresa Variedad 1525", href: "#productos" },
        { label: t.footer.viewAllProducts, href: "#productos" },
      ],
    },
    {
      heading: t.footer.company,
      items: [
        { label: t.footer.aboutUs, href: "#sobre-nosotros" },
        { label: t.footer.blog, href: "#sobre-nosotros" },
        { label: t.footer.shipping, href: "#contacto" },
        { label: t.footer.contact, href: "#contacto" },
      ],
    },
    {
      heading: t.footer.legal,
      items: [
        { label: t.footer.legalNotice, href: "/aviso-legal" },
        { label: t.footer.privacy, href: "/politica-privacidad" },
        { label: t.footer.cookies, href: "/politica-cookies" },
        { label: t.footer.terms, href: "/terminos-condiciones" },
        { label: t.footer.returns, href: "/politica-devoluciones" },
      ],
    },
  ];

  return (
    /* ENHANCE-5: footer `relative` para anclar el gradient borde superior
       (hilo ink-warm). bg `#2d0a0a` y padding intactos. */
    <footer className="relative bg-[#2d0a0a] text-white pt-16 pb-8 px-6 overflow-hidden">
      {/* Gradient borde superior — transparent → rgba(122,58,58,0.25) →
          transparent (ink-warm hilo dignificante, no caja). */}
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(122,58,58,0.25), transparent)",
        }}
      />

      {/* FA-07 — Micro-grano 0.8% turbulence. SVG feTurbulence
          baseFrequency 0.65 / numOctaves 3 / stitchTiles stitch.
          mix-blend-mode: screen → grano de luz sobre fondo oscuro.
          z-0 → contenido interior en z-10. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          mixBlendMode: "screen",
          opacity: 0.08,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='fg'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23fg)'/></svg>\")",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top row.
            ENHANCE-5: hairline editorial doble fina en separacion top/bottom
            del bloque (1px solida + 1px 6% alpha con 2px de gap). Mantiene
            color del borde, solo eleva la "impresion" tipografica. */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 3px 0 -2px rgba(255,255,255,0.06)",
          }}
        >
          {/* Brand */}
          <div className="md:col-span-1">
            {/* FA-04 — Halo cream-rosa hover logo: wrapper relativo
                con div aria-hidden absolute radial-gradient opacity 0→1. */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative inline-block group/logo"
            >
              {/* FA-04: halo radial cream-rosa */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out opacity-0 group-hover/logo:opacity-100"
                style={{
                  background:
                    "radial-gradient(ellipse 80px 28px at center, rgba(232,196,191,0.12) 0%, transparent 70%)",
                }}
              />
              {/* E9 (BUG fix): src antes apuntaba al PNG vectorial alojado
                  en `yayamariana.com` (dominio legacy lechugas) — riesgo
                  de servir el logo de la marca abandonada o un 404. Ahora
                  usa el asset local del Hero. `brightness-0 invert` lo
                  blanquea sobre el footer maroon. */}
              <Image
                src="/logo-nuevo.jpg"
                alt="Yaya Mariana"
                width={38}
                height={38}
                className="h-[38px] w-auto brightness-0 invert mb-3 relative"
              />
              {/* ENHANCE-5: wordmark caligrafico secundario (Playfair italic).
                  ONE script element of the footer viewport — refuerza tono
                  tributo bajo el lockup principal. Tooltip discreto Capa B. */}
              <span
                className="block font-serif italic text-white/55 text-[0.95rem] mb-4 relative"
                style={{ letterSpacing: "0.01em" }}
                title={t.footer.inMemoryHint}
              >
                Yaya Mariana
              </span>
            </motion.div>
            {/* ENHANCE-5: brand description max-w-[18ch] (truncaba media
                frase) → max-w-[28ch] / ~prose para dejar respirar el alma
                del tributo. */}
            <p className="body-pretty body-hyphens text-sm text-white/50 leading-relaxed max-w-[28ch]">
              {t.footer.description}
            </p>
            {/* Socials.
                ENHANCE-5: reordenados Instagram primero. aria-label contextual
                ("Yaya Mariana en {plataforma}"). Hover halo radial via box-shadow
                terracota 12% alpha (calidez, no negro) + fill terracota.
                FA-05: focus ring doble capa terracota (anillo 3px + 1px) en
                lugar del fill rojo entero. */}
            <div className="flex items-center gap-3 mt-5">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Yaya Mariana — ${label}`}
                  className="group/social w-8 h-8 rounded-full bg-white/10 hover:bg-[#c0392b] flex items-center justify-center transition-all duration-200 outline-none footer-social-focus"
                  style={{
                    transitionProperty: "background-color, box-shadow",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(192,57,43,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns — FA-01+VP-12 divisores verticales inter-columna md+ */}
          {navLinks.map(({ heading, items }, colIdx) => (
            /* AP-10: easing warm-lux [0.19,1,0.22,1], delay 0.15 + colIdx*0.1,
               initial.y 18 (desde 30). */
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.75,
                delay: 0.15 + colIdx * 0.1,
                ease: [0.19, 1, 0.22, 1],
              }}
              /* FA-01+VP-12: divisor vertical 1px antes de columnas 2ª y 3ª (md+).
                 Pseudo-elemento izquierdo vía border-left en las cols no-primeras. */
              className={
                colIdx > 0
                  ? "md:border-l md:border-l-[rgba(255,255,255,0.06)] md:pl-6"
                  : ""
              }
            >
              {/* ENHANCE-5: headings de columna en accent terracota desaturado
                  (MIXTA aprobada por Nil) — antes `text-white/40`, ahora
                  `rgba(192,57,43,0.75)` que mezclado opticamente con el
                  fondo `#2d0a0a` da el tono mas legible y editorial. Tracking
                  0.18→0.20em. OpenType caps cpsp (capital spacing). */}
              <h4
                className="text-xs font-bold uppercase mb-4"
                style={{
                  color: "rgba(192,57,43,0.75)",
                  letterSpacing: "0.20em",
                  fontFeatureSettings: "'ss01', 'case', 'cpsp'",
                }}
              >
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    {/* FA-02: underline draw-in con span aria-hidden scaleX 0→1
                        usando motion variants en el padre whileHover. */}
                    <MotionLink
                      href={href}
                      className="text-sm inline-block relative"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                      variants={navLinkVariants}
                      initial="rest"
                      whileHover="hover"
                      animate="rest"
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {label}
                      {/* FA-02: underline hairline 1px scaleX draw-in */}
                      <motion.span
                        aria-hidden
                        className="absolute bottom-0 left-0 w-full"
                        variants={underlineVariants}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{
                          height: "1px",
                          backgroundColor: "rgba(192,57,43,0.55)",
                          transformOrigin: "left center",
                          display: "block",
                        }}
                      />
                    </MotionLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FA-03: Hairline separador 1px rgba(255,255,255,0.08) antes del
            bottom-row. Dentro del max-w-6xl, ancho completo. */}
        <div
          aria-hidden
          className="w-full"
          style={{
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.08)",
            marginBottom: "0",
          }}
        />

        {/* Bottom row.
            ENHANCE-5: bullet `▪` color de marca antes del copyright (firma
            de oficio) + linea de tributo italic capa B en col izquierda.
            FA-03: border-top eliminado del div (reemplazado por el hairline
            div anterior). pt-7 conservado para espaciado. */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-7 text-xs text-white/35">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p>
              <span
                aria-hidden
                style={{ color: "rgba(192,57,43,0.5)", marginRight: "0.4em" }}
              >▪</span>
              {/* FA-08: fleuron ❦ tras el año copyright */}
              © {new Date().getFullYear()}{" "}
              <span aria-hidden className="mx-1.5" style={{ color: "rgba(192,57,43,0.40)" }}>❦</span>
              Yaya Mariana. {t.footer.rights}
            </p>
            {/* FA-06: inMemory con tribute-line OT (TM-11) + inMemoryHint
                micro-fade inline. El tooltip nativo del wordmark se mantiene
                en el wordmark; aquí la línea-tributo no lleva title= (la
                versión inline lo reemplaza). */}
            <p
              className="tribute-line group/memory cursor-default"
              style={{ color: "rgba(232,196,191,0.55)", fontSize: "0.78rem" }}
            >
              {t.footer.inMemory}
              {/* FA-06: inMemoryHint micro-fade: opacity 0 → 0.38 en hover
                  del p padre. translateY 4px → 0. */}
              <span
                aria-hidden
                className="ml-2 inline-block transition-all duration-[400ms] ease-[cubic-bezier(0.19,1,0.22,1)] opacity-0 translate-y-1 group-hover/memory:opacity-[0.38] group-hover/memory:translate-y-0"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  color: "rgba(232,196,191,1)",
                }}
              >
                — {t.footer.inMemoryHint}
              </span>
            </p>
          </div>
          <p>
            {t.footer.designBy}{" "}
            {/* FA-09: link Okawa underline permanente sutil + hover draw-in */}
            <a
              href="https://okawa.es"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors okawa-link"
              style={{
                textDecoration: "underline",
                textDecorationColor: "rgba(255,255,255,0.15)",
                textUnderlineOffset: "3px",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.textDecorationColor =
                  "rgba(192,57,43,0.50)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.textDecorationColor =
                  "rgba(255,255,255,0.15)";
              }}
            >
              Okawa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
