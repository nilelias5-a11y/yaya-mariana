"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    {
      heading: t.footer.shop,
      items: [
        { label: "Fresa Mágnum", href: "/checkout" },
        { label: "Fresa Dream", href: "/checkout" },
        { label: "Fresa Variedad 1525", href: "/checkout" },
        { label: t.footer.viewAllProducts, href: "/checkout" },
      ],
    },
    {
      heading: t.footer.company,
      // blog/envíos → stub "#": las páginas del dominio legacy yayamariana.com
      // están abandonadas; se reapuntarán a páginas reales cuando existan.
      items: [
        { label: t.footer.aboutUs, href: "#sobre-nosotros" },
        { label: t.footer.blog, href: "#" },
        { label: t.footer.shipping, href: "#" },
        { label: t.footer.contact, href: "#contacto" },
      ],
    },
    {
      heading: t.footer.legal,
      // Páginas legales pendientes de redacción → stub "#" (no enlazar al dominio legacy).
      items: [
        { label: t.footer.privacy, href: "#" },
        { label: t.footer.returns, href: "#" },
        { label: t.footer.legalNotice, href: "#" },
        { label: t.footer.myAccount, href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#2d0a0a] text-white pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Wordmark tipográfico (Path T) — sustituye el hot-link al dominio legacy. */}
              <span className="block font-serif italic text-white text-[1.75rem] leading-none mb-4">
                Yaya Mariana
              </span>
            </motion.div>
            <p className="text-sm text-white/50 leading-relaxed max-w-[18ch]">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-3 mt-5">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#c0392b] flex items-center justify-center transition-colors duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navLinks.map(({ heading, items }, colIdx) => (
            <motion.div
              key={heading}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: colIdx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <motion.a
                      href={href}
                      className="text-sm text-white/65 inline-block"
                      whileHover={{ x: 4, color: "#c0392b" }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-7 text-xs text-white/35">
          <p>© {new Date().getFullYear()} Yaya Mariana. {t.footer.rights}</p>
          <p>
            {t.footer.designBy}{" "}
            <a
              href="https://okawa.es"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              Okawa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
