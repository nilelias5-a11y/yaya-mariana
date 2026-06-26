"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { OrderStatus } from "@/lib/cuenta/types";
import type { AdminOrder, AdminStock, AdminOrderDetail } from "@/lib/admin/db";
import { ORDER_TRANSITIONS, isBackwardTransition } from "@/lib/admin/status";

/* FASE A.5 · T2 — Dashboard del panel /admin (cliente).
 *
 * TAREA 1 — los datos ahora son REALES (Neon): los pedidos (cuenta_orders) y
 * el stock (product_stock) llegan como props desde el server component
 * (admin/page.tsx); aquí sólo se presentan. Layout responsive con:
 * - Sidebar (Pedidos · Stock · Configuración · Cerrar sesión); en móvil
 *   se colapsa en un drawer con botón hamburguesa.
 * - Header con saludo del admin + reloj en vivo.
 * - Métricas clave (ventas del mes, pendientes, stock crítico).
 * - Tabla de pedidos con filtros (estado, fecha).
 * - Stock con alertas visuales por umbral (de la propia fila product_stock).
 *
 * Paleta canónica respetada. Logout = formulario nativo a /api/admin/logout. */

/* Estados de dominio (cuenta_orders) → estilo del badge, en el registro
 * cromático cálido del panel. */
const STATUS_STYLE: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  pagado: { bg: "#eef2fb", color: "#2c5282", label: "Pagado" },
  preparacion: { bg: "#fdf5e6", color: "#b8860b", label: "En preparación" },
  enviado: { bg: "#eef7fb", color: "#2c7a93", label: "Enviado" },
  entregado: { bg: "#eaf7ee", color: "#1f7a43", label: "Entregado" },
  cancelado: { bg: "#f3f0f0", color: "#7a3a3a", label: "Cancelado" },
};
const STATUS_ORDER: OrderStatus[] = ["pagado", "preparacion", "enviado", "entregado", "cancelado"];
/* Estados que cuentan como "pendientes de gestión" en la métrica. */
const PENDING_STATUSES: OrderStatus[] = ["pagado", "preparacion"];

/* Umbrales de stock por fila (product_stock): verde > low, amarillo
 * out..low, rojo < out. */
type StockLevel = "ok" | "low" | "out";
function stockLevel(units: number, low: number, out: number): StockLevel {
  if (units < out) return "out";
  if (units <= low) return "low";
  return "ok";
}
const STOCK_STYLE: Record<StockLevel, { color: string; label: string }> = {
  ok: { color: "#1f7a43", label: "Disponible" },
  low: { color: "#b8860b", label: "Stock bajo" },
  out: { color: "#c0392b", label: "Stock crítico" },
};

type SectionKey = "pedidos" | "stock" | "config";
const NAV: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "pedidos",
    label: "Pedidos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    key: "stock",
    label: "Stock",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="m3.27 6.96 8.73 5.04 8.73-5.04M12 22.08V12" />
      </svg>
    ),
  },
  {
    key: "config",
    label: "Configuración",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

function greeting(hour: number): string {
  if (hour < 6) return "Buenas noches";
  if (hour < 14) return "Buenos días";
  if (hour < 21) return "Buenas tardes";
  return "Buenas noches";
}

function LiveClock({ adminUser }: { adminUser: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Hydration-safe: la hora solo existe en cliente; init al montar (intencional).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hour = now?.getHours() ?? 12;
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-[#1a0808] leading-tight">
        {greeting(hour)}, <span className="capitalize">{adminUser}</span>
      </h1>
      <p className="text-sm text-[#7a3a3a]/55 numerals-tabular mt-0.5" suppressHydrationWarning>
        {now
          ? now.toLocaleString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          : "—"}
      </p>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(245,198,194,0.7)" }}>
      <p className="text-xs font-semibold text-[#7a3a3a]/55 uppercase tracking-wide mb-1">{label}</p>
      <p className="font-serif text-2xl" style={{ color: accent ?? "#1a0808" }}>{value}</p>
    </div>
  );
}

/* TAREA 1 — Selector de estado por pedido. Sólo ofrece las transiciones
 * válidas (ORDER_TRANSITIONS); si el estado es terminal (sólo `cancelado`)
 * muestra el badge estático. Separa avances de correcciones (retroceso) en dos
 * grupos del desplegable. Llama al endpoint protegido y avisa al padre para
 * refrescar la fila sin recargar la página. */
function OrderStatusControl({
  order,
  onUpdated,
}: {
  order: AdminOrder;
  onUpdated: (status: OrderStatus) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const st = STATUS_STYLE[order.status];
  const allowed = ORDER_TRANSITIONS[order.status];
  // Avances (incluye cancelar) vs correcciones hacia atrás.
  const forward = allowed.filter((s) => !isBackwardTransition(order.status, s));
  const backward = allowed.filter((s) => isBackwardTransition(order.status, s));

  async function change(next: OrderStatus) {
    if (next === order.status) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(order.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; status?: string };
      if (!res.ok || !data.ok) {
        setError(res.status === 422 ? "Transición no permitida" : "No se pudo actualizar");
        return;
      }
      onUpdated((data.status as OrderStatus) ?? next);
    } catch {
      setError("Error de red");
    } finally {
      setPending(false);
    }
  }

  if (allowed.length === 0) {
    return (
      <span
        className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: st.bg, color: st.color }}
        title="Estado final"
      >
        {st.label}
      </span>
    );
  }

  return (
    <span className="flex flex-col gap-1 md:justify-self-start justify-self-end">
      <select
        value={order.status}
        disabled={pending}
        onChange={(e) => change(e.target.value as OrderStatus)}
        aria-label={`Estado del pedido ${order.id}`}
        className="rounded-full text-xs font-bold pl-2.5 pr-7 py-1 cursor-pointer focus:outline-none disabled:opacity-60 appearance-none bg-no-repeat"
        style={{
          backgroundColor: st.bg,
          color: st.color,
          border: `1px solid ${st.color}40`,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237a3a3a' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          backgroundPosition: "right 0.5rem center",
        }}
      >
        <option value={order.status}>{st.label}</option>
        {forward.length > 0 && (
          <optgroup label="Avanzar">
            {forward.map((s) => (
              <option key={s} value={s}>
                {s === "cancelado" ? "✕" : "→"} {STATUS_STYLE[s].label}
              </option>
            ))}
          </optgroup>
        )}
        {backward.length > 0 && (
          <optgroup label="Corregir (un paso atrás)">
            {backward.map((s) => (
              <option key={s} value={s}>
                ↩ {STATUS_STYLE[s].label}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      {error && <span className="text-[11px] font-semibold text-[#c0392b]">{error}</span>}
    </span>
  );
}

/* TAREA 2 — Ajuste de existencias por variedad. Stepper +/- e input directo
 * (entero ≥ 0). El semáforo previsualiza el borrador en vivo; "Guardar" llama
 * al endpoint protegido y persiste. */
function StockControl({
  item,
  onUpdated,
}: {
  item: AdminStock;
  onUpdated: (units: number) => void;
}) {
  const [draft, setDraft] = useState(item.units);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resincroniza si el valor guardado cambia (p. ej. tras guardar). Intencional.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setDraft(item.units), [item.units]);

  const level = stockLevel(draft, item.lowThreshold, item.outThreshold);
  const st = STOCK_STYLE[level];
  const dirty = draft !== item.units;

  function setClamped(n: number) {
    setDraft(Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0);
  }

  async function save() {
    if (!dirty || pending) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/stock/${encodeURIComponent(item.key)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ units: draft }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; units?: number };
      if (!res.ok || !data.ok) {
        setError("No se pudo guardar");
        return;
      }
      onUpdated(data.units ?? draft);
    } catch {
      setError("Error de red");
    } finally {
      setPending(false);
    }
  }

  const stepBtn =
    "w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-lg font-bold text-[#7a3a3a] disabled:opacity-40 transition-colors hover:bg-[rgba(245,198,194,0.25)]";

  return (
    <div
      className="rounded-2xl bg-white p-5"
      style={{ border: "1px solid rgba(245,198,194,0.7)", borderLeft: `4px solid ${st.color}` }}
    >
      <p className="font-semibold text-[#1a0808] mb-3">{item.variety}</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Restar una unidad"
          onClick={() => setClamped(draft - 1)}
          disabled={pending || draft <= 0}
          className={stepBtn}
          style={{ border: "1px solid rgba(245,198,194,0.7)" }}
        >
          −
        </button>
        <input
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={draft}
          disabled={pending}
          onChange={(e) => setClamped(e.target.valueAsNumber)}
          aria-label={`Unidades de ${item.variety}`}
          className="w-20 text-center text-2xl font-bold numerals-tabular rounded-xl py-1 focus:outline-none focus:border-[#c0392b]"
          style={{ color: st.color, border: "1px solid rgba(245,198,194,0.7)" }}
        />
        <button
          type="button"
          aria-label="Sumar una unidad"
          onClick={() => setClamped(draft + 1)}
          disabled={pending}
          className={stepBtn}
          style={{ border: "1px solid rgba(245,198,194,0.7)" }}
        >
          +
        </button>
        <span className="text-sm text-[#7a3a3a]/50 ml-1">cajas 500g</span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${st.color}1a`, color: st.color }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.color }} aria-hidden />
          {st.label}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || pending}
          className="text-xs font-bold px-3.5 min-h-[36px] rounded-xl text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: "#c0392b" }}
        >
          {pending ? "Guardando…" : "Guardar"}
        </button>
      </div>
      {error && <p className="text-[11px] font-semibold text-[#c0392b] mt-2">{error}</p>}
    </div>
  );
}

/* PARTE 1 — Detalle de pedido (drawer lateral). Lazy: pide el detalle al abrir
 * (GET /api/admin/orders/[id], protegido). Solo lectura; el estado se gestiona
 * desde la tabla. Botón a la factura PDF (ruta admin). */
function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-[#7a3a3a]/55 mb-2">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[#7a3a3a]/60">{label}</span>
      <span className="text-[#1a0808] text-right">{value}</span>
    </div>
  );
}

/* PARTE 2 — formulario de edición de la dirección de envío (dentro del drawer). */
type AddrForm = {
  recipient: string;
  street: string;
  city: string;
  postalCode: string;
  region: string;
  country: string;
  phone: string;
};
const EMPTY_ADDR: AddrForm = {
  recipient: "",
  street: "",
  city: "",
  postalCode: "",
  region: "",
  country: "",
  phone: "",
};
function AddrInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold text-[#7a3a3a]/55 uppercase tracking-wide mb-1">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#f5c6c2] bg-white px-3 py-2 text-sm text-[#1a0808] focus:outline-none focus:border-[#c0392b]"
      />
    </label>
  );
}

function OrderDetailDrawer({
  orderNumber,
  onClose,
  onAddressSaved,
}: {
  orderNumber: string;
  onClose: () => void;
  onAddressSaved?: (recipient: string, city: string) => void;
}) {
  const [detail, setDetail] = useState<AdminOrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loading = !detail && !error;
  // PARTE 2 — edición de dirección
  const [editing, setEditing] = useState(false);
  const [addr, setAddr] = useState<AddrForm>(EMPTY_ADDR);
  const [saving, setSaving] = useState(false);
  const [addrMsg, setAddrMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Solo editable antes de enviar.
  const addressEditable = detail?.status === "pagado" || detail?.status === "preparacion";

  function startEditAddress() {
    if (!detail) return;
    const a = detail.shippingAddress;
    setAddr({
      recipient: a.recipient ?? "",
      street: a.street ?? "",
      city: a.city ?? "",
      postalCode: a.postalCode ?? "",
      region: a.region ?? "",
      country: a.country ?? "",
      phone: a.phone ?? "",
    });
    setAddrMsg(null);
    setEditing(true);
  }

  async function saveAddress() {
    if (!addr.recipient.trim() || !addr.street.trim() || !addr.city.trim() || !addr.postalCode.trim()) {
      setAddrMsg({ ok: false, text: "Rellena nombre, calle, ciudad y código postal." });
      return;
    }
    setSaving(true);
    setAddrMsg(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}/address`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addr),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; shippingAddress?: AdminOrderDetail["shippingAddress"] };
      if (!res.ok || !data.ok || !data.shippingAddress) {
        setAddrMsg({
          ok: false,
          text:
            res.status === 422
              ? "Este pedido ya no se puede editar (ya enviado)."
              : "No se pudo guardar. Revisa los campos.",
        });
        return;
      }
      const saved = data.shippingAddress;
      setDetail((prev) => (prev ? { ...prev, shippingAddress: saved } : prev));
      onAddressSaved?.(saved.recipient, saved.city);
      setEditing(false);
      setAddrMsg({ ok: true, text: "Dirección actualizada." });
    } catch {
      setAddrMsg({ ok: false, text: "Error de red." });
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.ok && data.detail) setDetail(data.detail as AdminOrderDetail);
        else setError("No se pudo cargar el pedido.");
      })
      .catch(() => {
        if (!cancelled) setError("Error de red.");
      });
    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sa = detail?.shippingAddress;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Pedido ${orderNumber}`}>
      <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute inset-0 bg-[#1a0808]/30" />
      <div
        className="relative w-full max-w-md h-full bg-white overflow-y-auto"
        style={{ borderLeft: "1px solid rgba(245,198,194,0.7)" }}
      >
        <div
          className="sticky top-0 bg-white flex items-start justify-between px-5 py-4 z-10"
          style={{ borderBottom: "1px solid rgba(245,198,194,0.7)" }}
        >
          <div>
            <p className="font-serif text-lg text-[#1a0808] leading-none">{orderNumber}</p>
            {detail && (
              <span
                className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-2"
                style={{ backgroundColor: STATUS_STYLE[detail.status].bg, color: STATUS_STYLE[detail.status].color }}
              >
                {STATUS_STYLE[detail.status].label}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-[#7a3a3a] hover:bg-[rgba(245,198,194,0.25)] transition-colors"
            style={{ border: "1px solid rgba(245,198,194,0.7)" }}
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-5 space-y-5 text-sm">
          {loading && <p className="text-[#7a3a3a]/55 text-center py-10">Cargando…</p>}
          {error && <p className="text-[#c0392b] text-center py-10">{error}</p>}
          {detail && sa && (
            <>
              <DetailSection title="Cliente">
                <DetailRow label="Nombre" value={detail.customer.nombre} />
                <DetailRow label="Email" value={detail.customer.email} />
                <DetailRow label="Teléfono" value={detail.customer.telefono ?? "—"} />
              </DetailSection>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#7a3a3a]/55">Dirección de envío</p>
                  {addressEditable && !editing && (
                    <button
                      type="button"
                      onClick={startEditAddress}
                      className="text-xs font-semibold text-[#c0392b] hover:text-[#e74c3c] transition-colors"
                    >
                      Editar
                    </button>
                  )}
                </div>
                {!editing ? (
                  <div className="space-y-1">
                    <p className="text-[#1a0808] font-medium">{sa.recipient}</p>
                    <p className="text-[#7a3a3a]/75">{sa.street}</p>
                    <p className="text-[#7a3a3a]/75 numerals-tabular">{sa.postalCode} {sa.city}{sa.region ? `, ${sa.region}` : ""}</p>
                    {sa.country && <p className="text-[#7a3a3a]/75">{sa.country}</p>}
                    {sa.phone && <p className="text-[#7a3a3a]/75 numerals-tabular">{sa.phone}</p>}
                    {!addressEditable && (
                      <p className="text-[11px] text-[#7a3a3a]/45 mt-1.5 italic">
                        No editable: el pedido ya está {STATUS_STYLE[detail.status].label.toLowerCase()}.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AddrInput label="Nombre *" value={addr.recipient} onChange={(v) => setAddr({ ...addr, recipient: v })} />
                    <AddrInput label="Calle y número *" value={addr.street} onChange={(v) => setAddr({ ...addr, street: v })} />
                    <div className="grid grid-cols-2 gap-2">
                      <AddrInput label="Cód. postal *" value={addr.postalCode} onChange={(v) => setAddr({ ...addr, postalCode: v })} />
                      <AddrInput label="Ciudad *" value={addr.city} onChange={(v) => setAddr({ ...addr, city: v })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <AddrInput label="Provincia" value={addr.region} onChange={(v) => setAddr({ ...addr, region: v })} />
                      <AddrInput label="País" value={addr.country} onChange={(v) => setAddr({ ...addr, country: v })} />
                    </div>
                    <AddrInput label="Teléfono" value={addr.phone} onChange={(v) => setAddr({ ...addr, phone: v })} />
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={saveAddress}
                        disabled={saving}
                        className="flex-1 py-2 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-50"
                        style={{ background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)" }}
                      >
                        {saving ? "Guardando…" : "Guardar dirección"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditing(false); setAddrMsg(null); }}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-[#7a3a3a] transition-colors hover:bg-[rgba(245,198,194,0.25)]"
                        style={{ border: "1px solid rgba(245,198,194,0.7)" }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
                {addrMsg && (
                  <p className={`text-xs mt-2 font-semibold ${addrMsg.ok ? "text-[#1f7a43]" : "text-[#c0392b]"}`}>
                    {addrMsg.text}
                  </p>
                )}
              </div>

              <DetailSection title="Facturación">
                <DetailRow label="Nombre" value={detail.billing.nombre} />
                <DetailRow label="DNI / NIF" value={detail.billing.dni} />
              </DetailSection>

              <DetailSection title="Productos">
                <ul className="space-y-1.5">
                  {detail.items.map((it, i) => (
                    <li key={i} className="flex justify-between gap-3">
                      <span className="text-[#7a3a3a]">
                        {it.variety} <span className="text-[#7a3a3a]/55 numerals-tabular">× {it.qty}</span>
                      </span>
                      <span className="numerals-tabular text-[#1a0808]">{(it.unitPrice * it.qty).toFixed(2)}€</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 space-y-1" style={{ borderTop: "1px solid rgba(245,198,194,0.5)" }}>
                  <DetailRow label={`Base (IVA ${Math.round(detail.totals.ivaRate * 100)}% incl.)`} value={`${detail.totals.base.toFixed(2)}€`} />
                  <DetailRow label="IVA" value={`${detail.totals.iva.toFixed(2)}€`} />
                  <div className="flex justify-between font-bold text-[#1a0808] pt-1">
                    <span>Total</span>
                    <span className="numerals-tabular">{detail.totals.total.toFixed(2)}€</span>
                  </div>
                </div>
              </DetailSection>

              <DetailSection title="Pedido">
                <DetailRow label="Fecha" value={detail.date} />
                <DetailRow label="Nº factura" value={detail.invoiceNumber} />
              </DetailSection>

              <a
                href={`/api/admin/orders/${encodeURIComponent(orderNumber)}/invoice?download=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)" }}
              >
                Descargar factura
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({
  adminUser,
  orders,
  stock,
}: {
  adminUser: string;
  orders: AdminOrder[];
  stock: AdminStock[];
}) {
  const [section, setSection] = useState<SectionKey>("pedidos");
  const [navOpen, setNavOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"todos" | OrderStatus>("todos");
  const [dateFilter, setDateFilter] = useState<string>("todas");
  const [detailNumber, setDetailNumber] = useState<string | null>(null);

  // Props → estado local: las mutaciones del panel actualizan estas listas en
  // sitio (feedback inmediato), sin recargar. El servidor revalida /admin en
  // paralelo, de modo que una recarga muestra exactamente lo mismo.
  const [orderList, setOrderList] = useState(orders);
  const [stockList, setStockList] = useState(stock);

  function applyOrderStatus(orderId: string, status: OrderStatus) {
    setOrderList((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }
  function applyOrderAddress(orderId: string, recipient: string, city: string) {
    setOrderList((prev) => prev.map((o) => (o.id === orderId ? { ...o, customer: recipient, city } : o)));
  }
  function applyStockUnits(key: string, units: number) {
    setStockList((prev) => prev.map((s) => (s.key === key ? { ...s, units } : s)));
  }

  const dates = useMemo(() => Array.from(new Set(orderList.map((o) => o.date))), [orderList]);
  const filteredOrders = useMemo(
    () =>
      orderList.filter(
        (o) =>
          (statusFilter === "todos" || o.status === statusFilter) &&
          (dateFilter === "todas" || o.date === dateFilter),
      ),
    [orderList, statusFilter, dateFilter],
  );

  // Ventas del mes en curso (excluye cancelados).
  const ingresos = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    return orderList
      .filter((o) => o.status !== "cancelado")
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getFullYear() === y && d.getMonth() === m;
      })
      .reduce((s, o) => s + o.total, 0);
  }, [orderList]);
  const pendientes = orderList.filter((o) => PENDING_STATUSES.includes(o.status)).length;
  const criticos = stockList.filter(
    (s) => stockLevel(s.units, s.lowThreshold, s.outThreshold) !== "ok",
  ).length;

  function selectSection(key: SectionKey) {
    setSection(key);
    setNavOpen(false);
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#fdf6f5" }}>
      {/* Overlay móvil cuando el drawer está abierto */}
      {navOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setNavOpen(false)}
          className="fixed inset-0 z-30 bg-[#1a0808]/30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 flex flex-col bg-white transition-transform duration-300 md:translate-x-0 md:static md:z-auto ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ borderRight: "1px solid rgba(245,198,194,0.7)" }}
      >
        <div className="h-[72px] flex items-center px-5" style={{ borderBottom: "1px solid rgba(245,198,194,0.7)" }}>
          <Image src="/logo-nuevo.jpg" alt="Yaya Mariana" width={34} height={34} priority className="w-auto" style={{ height: 34 }} />
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Secciones del panel">
          {NAV.map((item) => {
            const active = section === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => selectSection(item.key)}
                aria-current={active ? "page" : undefined}
                className="w-full flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-semibold transition-colors"
                style={
                  active
                    ? { backgroundColor: "#fdf0ef", color: "#c0392b" }
                    : { color: "#7a3a3a" }
                }
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(245,198,194,0.7)" }}>
          <form method="post" action="/api/admin/logout">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-semibold text-[#c0392b] transition-colors hover:bg-[rgba(245,198,194,0.2)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Contenido */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header
          className="flex items-center gap-4 px-5 md:px-10 py-4"
          style={{ borderBottom: "1px solid rgba(245,198,194,0.7)", backgroundColor: "#ffffff" }}
        >
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Abrir menú"
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-[#7a3a3a]"
            style={{ border: "1px solid rgba(245,198,194,0.7)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-5 h-5" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <LiveClock adminUser={adminUser} />
        </header>

        <main className="flex-1 px-5 md:px-10 py-8 max-w-5xl w-full">
          {/* Métricas — visibles en todas las secciones */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Ventas del mes" value={`${ingresos.toFixed(2)}€`} />
            <StatCard label="Pedidos pendientes" value={String(pendientes)} accent={pendientes > 0 ? "#c0392b" : undefined} />
            <StatCard label="Stock crítico" value={String(criticos)} accent={criticos > 0 ? "#c0392b" : undefined} />
            <StatCard label="Pedidos totales" value={String(orderList.length)} />
          </div>

          {section === "pedidos" && (
            <section aria-labelledby="sec-pedidos">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
                <h2 id="sec-pedidos" className="font-serif text-xl text-[#1a0808]">Pedidos recientes</h2>
                {/* Filtros */}
                <div className="flex flex-wrap gap-3">
                  <label className="text-sm">
                    <span className="block text-xs font-semibold text-[#7a3a3a]/55 uppercase tracking-wide mb-1">Estado</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                      className="rounded-xl border border-[#f5c6c2] bg-white px-3 py-2 text-sm text-[#1a0808] focus:outline-none focus:border-[#c0392b] min-h-[44px]"
                    >
                      <option value="todos">Todos</option>
                      {STATUS_ORDER.map((s) => (
                        <option key={s} value={s}>{STATUS_STYLE[s].label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm">
                    <span className="block text-xs font-semibold text-[#7a3a3a]/55 uppercase tracking-wide mb-1">Fecha</span>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="rounded-xl border border-[#f5c6c2] bg-white px-3 py-2 text-sm text-[#1a0808] focus:outline-none focus:border-[#c0392b] min-h-[44px] numerals-tabular"
                    >
                      <option value="todas">Todas</option>
                      {dates.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid rgba(245,198,194,0.7)" }}>
                <div
                  className="hidden md:grid grid-cols-[1fr_1.4fr_1.4fr_0.8fr_1fr] gap-3 px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#7a3a3a]/55"
                  style={{ borderBottom: "1px solid rgba(245,198,194,0.5)" }}
                >
                  <span>Pedido</span>
                  <span>Cliente</span>
                  <span>Productos</span>
                  <span>Total</span>
                  <span>Estado</span>
                </div>
                {filteredOrders.length === 0 ? (
                  <p className="px-5 py-8 text-sm text-[#7a3a3a]/55 text-center">No hay pedidos con esos filtros.</p>
                ) : (
                  <ul role="list">
                    {filteredOrders.map((o) => (
                      <li
                        key={o.id}
                        className="grid grid-cols-2 md:grid-cols-[1fr_1.4fr_1.4fr_0.8fr_1fr] gap-x-3 gap-y-1 px-5 py-4 items-center text-sm"
                        style={{ borderBottom: "1px solid rgba(245,198,194,0.35)" }}
                      >
                        <button
                          type="button"
                          onClick={() => setDetailNumber(o.id)}
                          className="font-semibold text-[#1a0808] text-left hover:text-[#c0392b] transition-colors underline decoration-transparent hover:decoration-[#c0392b] underline-offset-2 focus:outline-none focus-visible:text-[#c0392b]"
                          aria-label={`Ver detalle del pedido ${o.id}`}
                        >
                          {o.id}
                          <span className="block text-xs font-normal text-[#7a3a3a]/45 md:hidden numerals-tabular">{o.date}</span>
                        </button>
                        <span className="text-[#7a3a3a] text-right md:text-left">
                          {o.customer}
                          <span className="block text-xs text-[#7a3a3a]/45">{o.city}</span>
                        </span>
                        <span className="text-[#7a3a3a]/80 hidden md:block">{o.items}</span>
                        <span className="font-semibold text-[#1a0808] numerals-tabular hidden md:block">{o.total.toFixed(2)}€</span>
                        <OrderStatusControl order={o} onUpdated={(s) => applyOrderStatus(o.id, s)} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          )}

          {section === "stock" && (
            <section aria-labelledby="sec-stock">
              <h2 id="sec-stock" className="font-serif text-xl text-[#1a0808] mb-4">Stock por variedad</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stockList.map((s) => (
                  <StockControl key={s.key} item={s} onUpdated={(u) => applyStockUnits(s.key, u)} />
                ))}
              </div>
              <p className="text-xs text-[#7a3a3a]/50 mt-4">
                Umbrales: <span className="text-[#1f7a43] font-semibold">verde &gt;20</span> ·{" "}
                <span className="text-[#b8860b] font-semibold">amarillo 5–20</span> ·{" "}
                <span className="text-[#c0392b] font-semibold">rojo &lt;5</span>
              </p>
            </section>
          )}

          {section === "config" && (
            <section aria-labelledby="sec-config">
              <h2 id="sec-config" className="font-serif text-xl text-[#1a0808] mb-4">Configuración</h2>
              <div className="rounded-2xl bg-white p-6 space-y-4" style={{ border: "1px solid rgba(245,198,194,0.7)" }}>
                <div>
                  <p className="text-xs font-semibold text-[#7a3a3a]/55 uppercase tracking-wide mb-1">Usuario admin</p>
                  <p className="text-[#1a0808] font-medium capitalize">{adminUser}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#7a3a3a]/55 uppercase tracking-wide mb-1">Contraseña</p>
                  <p className="text-sm text-[#7a3a3a]/70">
                    Para cambiarla, ejecuta{" "}
                    <code className="px-1.5 py-0.5 rounded bg-[#fdf0ef] text-[#c0392b] text-xs">
                      node scripts/hash-password.mjs &quot;nueva-pass&quot;
                    </code>{" "}
                    y actualiza <code className="text-xs">ADMIN_PASS_HASH</code> en el entorno. Ver README-ADMIN.md.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#7a3a3a]/55 uppercase tracking-wide mb-1">Sesión</p>
                  <p className="text-sm text-[#7a3a3a]/70">
                    JWT firmado (HS256), expira a las 8h de inactividad con renovación automática mientras navegas.
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {detailNumber && (
        <OrderDetailDrawer
          key={detailNumber}
          orderNumber={detailNumber}
          onClose={() => setDetailNumber(null)}
          onAddressSaved={(recipient, city) => applyOrderAddress(detailNumber, recipient, city)}
        />
      )}
    </div>
  );
}
