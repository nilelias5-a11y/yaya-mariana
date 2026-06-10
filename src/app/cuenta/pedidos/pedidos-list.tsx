"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { PageTitle, Input, CUENTA_BORDER, INPUT_CLASS } from "@/components/cuenta/primitives";
import { StatusBadge } from "@/components/cuenta/status-badge";
import { formatEUR, formatDateES } from "@/lib/cuenta/invoice";
import type { OrderStatus } from "@/lib/cuenta/types";

type Row = { id: string; number: string; createdAt: string; status: OrderStatus; total: number };

const SELECT_CLASS = `${INPUT_CLASS} pr-8 cursor-pointer`;

export default function PedidosList({ rows }: { rows: Row[] }) {
  const { t } = useLanguage();
  const c = t.cuenta;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [date, setDate] = useState("all");

  const dates = useMemo(
    () => Array.from(new Set(rows.map((r) => formatDateES(r.createdAt)))),
    [rows],
  );

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (date === "all" || formatDateES(r.createdAt) === date) &&
          (query.trim() === "" || r.number.toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [rows, status, date, query],
  );

  return (
    <div className="space-y-6">
      <PageTitle>{c.pedidos.title}</PageTitle>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a8884]" aria-hidden>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={c.pedidos.search}
            aria-label={c.pedidos.search}
            className="!pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          aria-label={c.pedidos.filterStatus}
          className={`${SELECT_CLASS} sm:w-44`}
          style={{ borderColor: CUENTA_BORDER }}
        >
          <option value="all">{c.pedidos.filterStatus}: {c.pedidos.all}</option>
          <option value="pagado">{c.status.pagado}</option>
          <option value="preparacion">{c.status.preparacion}</option>
          <option value="enviado">{c.status.enviado}</option>
          <option value="entregado">{c.status.entregado}</option>
          <option value="cancelado">{c.status.cancelado}</option>
        </select>
        <select
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label={c.pedidos.filterDate}
          className={`${SELECT_CLASS} sm:w-44 numerals-tabular`}
          style={{ borderColor: CUENTA_BORDER }}
        >
          <option value="all">{c.pedidos.filterDate}: {c.pedidos.allDates}</option>
          {dates.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="rounded-xl bg-white overflow-hidden" style={{ border: `1px solid ${CUENTA_BORDER}` }}>
        <div
          className="hidden md:grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#9a8884]"
          style={{ borderBottom: `1px solid ${CUENTA_BORDER}` }}
        >
          <span>{c.pedidos.colNumber}</span>
          <span>{c.pedidos.colDate}</span>
          <span>{c.pedidos.colTotal}</span>
          <span>{c.pedidos.colStatus}</span>
          <span className="sr-only">{c.pedidos.view}</span>
        </div>

        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-sm text-[#7a635f] text-center">{c.pedidos.empty}</p>
        ) : (
          <ul role="list">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="grid grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-x-3 gap-y-2 px-5 py-4 items-center"
                style={{ borderBottom: `1px solid ${CUENTA_BORDER}` }}
              >
                <span className="font-medium text-[#1a0808] numerals-tabular">{r.number}</span>
                <span className="text-sm text-[#7a635f] numerals-tabular text-right md:text-left">{formatDateES(r.createdAt)}</span>
                <span className="text-sm font-medium text-[#1a0808] numerals-tabular hidden md:block">{formatEUR(r.total)}</span>
                <span className="justify-self-end md:justify-self-start"><StatusBadge status={r.status} /></span>
                <Link
                  href={`/cuenta/pedidos/${r.id}`}
                  className="col-span-2 md:col-span-1 justify-self-stretch md:justify-self-end inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-medium text-[#7a3a3a] hover:bg-[#f3ebe9] transition-colors mt-1 md:mt-0"
                  style={{ borderColor: CUENTA_BORDER }}
                >
                  {c.pedidos.view}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
