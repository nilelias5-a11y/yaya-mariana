"use client";

import { useLanguage } from "@/context/language-context";
import type { OrderStatus } from "@/lib/cuenta/types";

/* FASE B — Etiqueta de estado de pedido con colores discretos
 * (sin chillones), coherentes con la estética sobria de la zona cliente. */

const STYLE: Record<OrderStatus, { bg: string; color: string; dot: string }> = {
  pagado: { bg: "#fdf0ef", color: "#9a3a2f", dot: "#c0392b" },
  preparacion: { bg: "#fbf4e6", color: "#8a6d1f", dot: "#b8860b" },
  enviado: { bg: "#eef2f8", color: "#3a5577", dot: "#4a6fa5" },
  entregado: { bg: "#eef5ef", color: "#3a6347", dot: "#4a8a5e" },
  cancelado: { bg: "#f4eceb", color: "#7a5450", dot: "#9a7a76" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { t } = useLanguage();
  const st = STYLE[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: st.bg, color: st.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.dot }} aria-hidden />
      {t.cuenta.status[status]}
    </span>
  );
}
