"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { CUENTA_BORDER } from "./primitives";

/* FASE B — Chrome de la zona cliente autenticada (Inicio / Pedidos /
 * Datos / Cerrar sesión). Sidebar en escritorio, drawer en móvil.
 * Estética sobria, coherente con el resto de /cuenta. */

const ICONS = {
  inicio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden>
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  ),
  pedidos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  datos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  ),
};

export function CuentaShell({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/cuenta", label: t.cuenta.nav.inicio, icon: ICONS.inicio, exact: true },
    { href: "/cuenta/pedidos", label: t.cuenta.nav.pedidos, icon: ICONS.pedidos, exact: false },
    { href: "/cuenta/datos", label: t.cuenta.nav.datos, icon: ICONS.datos, exact: true },
  ];

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  }

  const nav = (
    <nav className="flex-1 px-3 py-5 space-y-0.5" aria-label={t.cuenta.brand}>
      {items.map((it) => {
        const active = isActive(it.href, it.exact);
        return (
          <Link
            key={it.href}
            href={it.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className="flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors"
            style={active ? { backgroundColor: "#fdf0ef", color: "#c0392b" } : { color: "#6b5350" }}
          >
            {it.icon}
            {it.label}
          </Link>
        );
      })}
    </nav>
  );

  const logout = (
    <div className="px-3 py-4" style={{ borderTop: `1px solid ${CUENTA_BORDER}` }}>
      <form method="post" action="/api/cuenta/logout">
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm font-medium text-[#7a635f] transition-colors hover:bg-[#f3ebe9]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {t.cuenta.nav.salir}
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#fbf8f7" }}>
      {open && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-[#1a0808]/25 md:hidden"
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 flex flex-col bg-white transition-transform duration-300 md:translate-x-0 md:static md:z-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ borderRight: `1px solid ${CUENTA_BORDER}` }}
      >
        <div className="h-16 flex items-center px-5" style={{ borderBottom: `1px solid ${CUENTA_BORDER}` }}>
          <Image src="/logo-nuevo.jpg" alt="Yaya Mariana" width={140} height={32} priority className="w-auto" style={{ height: 32 }} />
        </div>
        {nav}
        {logout}
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="md:hidden flex items-center gap-3 px-4 h-14 bg-white"
          style={{ borderBottom: `1px solid ${CUENTA_BORDER}` }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#6b5350]"
            style={{ border: `1px solid ${CUENTA_BORDER}` }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-5 h-5" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="font-serif text-[1.05rem] text-[#1a0808]">{t.cuenta.brand}</span>
        </header>

        <main className="flex-1 px-5 md:px-10 py-8 md:py-10 max-w-4xl w-full">{children}</main>
      </div>
    </div>
  );
}
