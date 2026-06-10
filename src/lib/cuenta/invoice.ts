import type { Order } from "./types";

/* FASE B — Cálculos de factura. IVA reducido 10% (productos alimentarios).
 * Los precios de línea son PVP con IVA incluido; aquí se desglosa la base
 * imponible y la cuota de IVA (criterio B2C estándar en España). */

export const IVA_RATE = 0.1;

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export type InvoiceTotals = {
  /** Base imponible (sin IVA). */
  base: number;
  /** Cuota de IVA. */
  iva: number;
  /** Total con IVA (= suma de PVP). */
  total: number;
  ivaRate: number;
};

export function computeTotals(order: Order): InvoiceTotals {
  const total = round2(order.items.reduce((s, it) => s + it.qty * it.unitPrice, 0));
  const base = round2(total / (1 + IVA_RATE));
  const iva = round2(total - base);
  return { base, iva, total, ivaRate: IVA_RATE };
}

/** Base imponible de una línea (PVP sin IVA), por unidad. */
export function lineBaseUnit(unitPrice: number): number {
  return round2(unitPrice / (1 + IVA_RATE));
}

export function formatEUR(n: number): string {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

export function formatDateES(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/** Datos fiscales del emisor (constantes legales de la empresa). */
export const ISSUER = {
  brand: "Yaya Mariana",
  legalName: "Holistic Green Energy S.L.",
  cif: "B67391128",
  address: "Audax — Badalona, Barcelona, España",
} as const;
