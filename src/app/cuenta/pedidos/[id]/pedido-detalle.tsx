"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { CUENTA_BORDER } from "@/components/cuenta/primitives";
import { StatusBadge } from "@/components/cuenta/status-badge";
import { computeTotals, lineBaseUnit, formatEUR, formatDateES } from "@/lib/cuenta/invoice";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Order, OrderStatus, Address } from "@/lib/cuenta/types";

/* Pasos completados por estado (de 4: compra, preparación, envío, entrega). */
const COMPLETED: Record<OrderStatus, number> = {
  pagado: 1,
  preparacion: 2,
  enviado: 3,
  entregado: 4,
  cancelado: 0,
};

function Timeline({ status }: { status: OrderStatus }) {
  const { t } = useLanguage();
  const steps = [
    t.cuenta.detalle.steps.compra,
    t.cuenta.detalle.steps.preparacion,
    t.cuenta.detalle.steps.envio,
    t.cuenta.detalle.steps.entrega,
  ];
  const done = COMPLETED[status];

  if (status === "cancelado") {
    return (
      <p className="text-sm rounded-lg px-4 py-3" style={{ backgroundColor: "#f4eceb", border: `1px solid ${CUENTA_BORDER}`, color: "#7a5450" }}>
        {t.cuenta.detalle.cancelled}
      </p>
    );
  }

  return (
    <ol className="flex items-center" aria-label={t.cuenta.detalle.stateTitle}>
      {steps.map((label, i) => {
        const complete = i < done;
        return (
          <li key={i} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <span
                aria-hidden
                className="absolute top-[11px] right-1/2 w-full h-0.5"
                style={{ backgroundColor: i <= done - 1 || i < done ? "#c0392b" : CUENTA_BORDER }}
              />
            )}
            <span
              className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
              style={complete ? { backgroundColor: "#c0392b", color: "#fff" } : { backgroundColor: "#fff", color: "#b8a9a5", border: `2px solid ${CUENTA_BORDER}` }}
            >
              {complete ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className="mt-2 text-[0.7rem] sm:text-xs text-center leading-tight" style={{ color: complete ? "#1a0808" : "#9a8884" }}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function AddressBlock({ title, address, extra }: { title: string; address: Address; extra?: string }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[#9a8884] mb-2">{title}</h3>
      <div className="text-sm text-[#4a3d3a] leading-relaxed">
        {extra && <p className="font-medium text-[#1a0808]">{extra}</p>}
        <p className="font-medium text-[#1a0808]">{address.recipient}</p>
        <p>{address.street}</p>
        <p className="numerals-tabular">{address.postalCode} {address.city} ({address.region})</p>
        <p>{address.country}</p>
        {address.phone && <p className="numerals-tabular">{address.phone}</p>}
      </div>
    </div>
  );
}

export default function PedidoDetalle({ order }: { order: Order }) {
  const { t } = useLanguage();
  const c = t.cuenta;
  const totals = computeTotals(order);
  const problemMsg = `${c.detalle.problem} · ${order.number}`;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/cuenta/pedidos" className="inline-flex items-center gap-1.5 text-sm text-[#8a716d] hover:text-[#c0392b] transition-colors mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {c.detalle.backToOrders}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-[1.6rem] font-medium text-[#1a0808] numerals-tabular">{order.number}</h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-[#7a635f] mt-1 numerals-tabular">{c.detalle.orderOf} {formatDateES(order.createdAt)}</p>
      </div>

      {/* Estado / timeline */}
      <section className="rounded-xl bg-white p-5 sm:p-6" style={{ border: `1px solid ${CUENTA_BORDER}` }}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-[#9a8884] mb-5">{c.detalle.stateTitle}</h2>
        <Timeline status={order.status} />
      </section>

      {/* Productos + resumen */}
      <section className="rounded-xl bg-white p-5 sm:p-6" style={{ border: `1px solid ${CUENTA_BORDER}` }}>
        <h2 className="font-serif text-[1.15rem] font-medium text-[#1a0808] mb-4">{c.detalle.products}</h2>
        <ul role="list" className="divide-y" style={{ borderColor: CUENTA_BORDER }}>
          {order.items.map((it, i) => (
            <li key={i} className="flex items-center gap-4 py-3 first:pt-0">
              <Image src={it.image} alt={it.name} width={56} height={56} className="rounded-lg object-cover shrink-0" style={{ width: 56, height: 56 }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1a0808] truncate">{it.name}</p>
                <p className="text-xs text-[#9a8884] numerals-tabular">
                  {c.detalle.qty}: {it.qty} · {c.detalle.unit}: {formatEUR(lineBaseUnit(it.unitPrice))}
                </p>
              </div>
              <span className="text-sm font-medium text-[#1a0808] numerals-tabular shrink-0">
                {formatEUR(lineBaseUnit(it.unitPrice) * it.qty)}
              </span>
            </li>
          ))}
        </ul>

        {/* Resumen */}
        <div className="mt-5 pt-5 ml-auto max-w-xs space-y-1.5" style={{ borderTop: `1px solid ${CUENTA_BORDER}` }}>
          <div className="flex justify-between text-sm text-[#7a635f]">
            <span>{c.detalle.base}</span><span className="numerals-tabular">{formatEUR(totals.base)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#7a635f]">
            <span>{c.detalle.iva}</span><span className="numerals-tabular">{formatEUR(totals.iva)}</span>
          </div>
          <div className="flex justify-between pt-2 mt-1 font-semibold text-[#1a0808]" style={{ borderTop: `1px solid ${CUENTA_BORDER}` }}>
            <span>{c.detalle.total}</span><span className="numerals-tabular text-[#c0392b]">{formatEUR(totals.total)}</span>
          </div>
        </div>
      </section>

      {/* Direcciones */}
      <section className="rounded-xl bg-white p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ border: `1px solid ${CUENTA_BORDER}` }}>
        <AddressBlock title={c.detalle.shipping} address={order.shippingAddress} />
        <AddressBlock title={c.detalle.billing} address={order.billing.address} extra={`${order.billing.nombre} · ${order.billing.dni}`} />
      </section>

      {/* Acciones */}
      <section className="flex flex-wrap gap-3">
        <a
          href={`/api/cuenta/factura/${order.id}?download=1`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#c0392b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#a93226] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          {c.detalle.downloadInvoice}
        </a>

        {order.trackingUrl ? (
          <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-[#7a3a3a] hover:bg-[#f3ebe9] transition-colors" style={{ borderColor: CUENTA_BORDER }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
              <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            {c.detalle.tracking}
          </a>
        ) : (
          <span className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium text-[#b8a9a5] cursor-not-allowed" style={{ borderColor: CUENTA_BORDER }} aria-disabled>
            {c.detalle.trackingSoon}
          </span>
        )}

        <Link href="/#productos" className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-[#7a3a3a] hover:bg-[#f3ebe9] transition-colors" style={{ borderColor: CUENTA_BORDER }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
            <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          {c.detalle.repeat}
        </Link>

        <a href={buildWhatsAppUrl(problemMsg)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold text-[#7a3a3a] hover:bg-[#f3ebe9] transition-colors" style={{ borderColor: CUENTA_BORDER }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          {c.detalle.problem}
        </a>
      </section>
    </div>
  );
}
