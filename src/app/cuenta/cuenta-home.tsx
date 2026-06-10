"use client";

import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { PageTitle, CUENTA_BORDER } from "@/components/cuenta/primitives";
import { StatusBadge } from "@/components/cuenta/status-badge";
import { computeTotals, formatEUR, formatDateES } from "@/lib/cuenta/invoice";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Order } from "@/lib/cuenta/types";

export default function CuentaHome({ nombre, orders }: { nombre: string; orders: Order[] }) {
  const { t } = useLanguage();
  const c = t.cuenta;
  const last = orders[0];

  const quick = [
    { href: "/cuenta/pedidos", title: c.home.quickOrders, desc: c.home.quickOrdersDesc },
    { href: "/cuenta/pedidos", title: c.home.quickInvoices, desc: c.home.quickInvoicesDesc },
    { href: "/cuenta/datos", title: c.home.quickData, desc: c.home.quickDataDesc },
  ];

  return (
    <div className="space-y-10">
      <header>
        <PageTitle>
          {c.home.greeting}, {nombre.split(" ")[0]}
        </PageTitle>
      </header>

      {/* Último pedido */}
      <section aria-label={c.home.lastOrderTitle}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#9a8884] mb-3">{c.home.lastOrderTitle}</h2>
        {last ? (
          <div className="rounded-xl bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ border: `1px solid ${CUENTA_BORDER}` }}>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="font-medium text-[#1a0808] numerals-tabular">{last.number}</span>
                <StatusBadge status={last.status} />
              </div>
              <p className="text-sm text-[#7a635f] numerals-tabular">
                {formatDateES(last.createdAt)} · {formatEUR(computeTotals(last).total)}
              </p>
            </div>
            <Link
              href={`/cuenta/pedidos/${last.id}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#c0392b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a93226] shrink-0"
            >
              {c.home.viewOrder}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-6 text-center" style={{ border: `1px solid ${CUENTA_BORDER}` }}>
            <p className="text-sm text-[#7a635f] mb-4">{c.home.noOrders}</p>
            <Link href="/#productos" className="inline-block rounded-lg bg-[#c0392b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a93226] transition-colors">
              {c.home.shopCta}
            </Link>
          </div>
        )}
      </section>

      {/* Accesos rápidos */}
      <section aria-label={c.home.quickTitle}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#9a8884] mb-3">{c.home.quickTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quick.map((q, i) => (
            <Link
              key={i}
              href={q.href}
              className="group rounded-xl bg-white p-5 transition-colors hover:bg-[#fdf0ef]"
              style={{ border: `1px solid ${CUENTA_BORDER}` }}
            >
              <p className="font-medium text-[#1a0808] group-hover:text-[#c0392b] transition-colors">{q.title}</p>
              <p className="text-xs text-[#9a8884] mt-1 leading-relaxed">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Ayuda WhatsApp */}
      <section className="rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ backgroundColor: "#fdf0ef", border: `1px solid ${CUENTA_BORDER}` }}>
        <div>
          <p className="font-medium text-[#1a0808]">{c.home.helpTitle}</p>
          <p className="text-sm text-[#7a635f] mt-0.5">{c.home.helpBody}</p>
        </div>
        <a
          href={buildWhatsAppUrl(t.whatsapp.message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-[#7a3a3a] hover:bg-[#f3ebe9] transition-colors shrink-0"
          style={{ borderColor: CUENTA_BORDER }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          {c.home.helpCta}
        </a>
      </section>
    </div>
  );
}
