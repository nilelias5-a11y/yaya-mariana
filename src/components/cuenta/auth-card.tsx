"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { CUENTA_BORDER } from "./primitives";

/* FASE B — Tarjeta centrada para las páginas públicas de acceso
 * (login / registro / recuperar). Sobria: logo, título Playfair regular
 * discreto, mucho aire, borde hairline. */

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12" style={{ backgroundColor: "#fbf8f7" }}>
      <div className="w-full max-w-[26rem]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#8a716d] hover:text-[#c0392b] transition-colors mb-6 min-h-[40px]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {t.cuenta.common.backHome}
        </Link>

        <div
          className="rounded-2xl bg-white p-8 sm:p-9"
          style={{ border: `1px solid ${CUENTA_BORDER}`, boxShadow: "0 1px 2px rgba(26,8,8,0.04)" }}
        >
          <div className="mb-7">
            {/* Logo clickable → home pública (mismo destino que "Volver al
                inicio"). hover:opacity-80 como afford sutil; resto idéntico. */}
            <Link
              href="/"
              aria-label={t.cuenta.common.homeAria}
              className="inline-block mb-6 transition-opacity hover:opacity-80"
            >
              <Image src="/logo-nuevo.jpg" alt="Yaya Mariana" width={150} height={34} priority className="w-auto" style={{ height: 34 }} />
            </Link>
            <h1 className="font-serif text-[1.5rem] font-medium text-[#1a0808] tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm text-[#7a635f] leading-relaxed">{subtitle}</p>}
          </div>
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-[#7a635f]">{footer}</div>}
      </div>
    </div>
  );
}
