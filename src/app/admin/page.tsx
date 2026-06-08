import Image from "next/image";

export const metadata = {
  title: "Panel · Yaya Mariana",
  robots: { index: false, follow: false },
};

/* Panel interno mínimo viable (T6). DATOS MOCK: pedidos, stock por
   variedad y estados. Preparado para sustituir el mock por datos reales
   cuando se conecte Stripe. Server component (sin estado de cliente);
   el logout es un formulario nativo a /api/admin/logout. */

type OrderStatus = "pendiente" | "enviado" | "entregado";

const ORDERS: {
  id: string;
  customer: string;
  city: string;
  items: string;
  total: number;
  status: OrderStatus;
  date: string;
}[] = [
  { id: "YM-1045", customer: "Jordi Vila", city: "Girona", items: "1525 ×3", total: 22.5, status: "pendiente", date: "08/06/2026" },
  { id: "YM-1044", customer: "Lucía Romero", city: "Sitges", items: "Mágnum ×1", total: 7.5, status: "pendiente", date: "07/06/2026" },
  { id: "YM-1043", customer: "Marc Pujol", city: "Tarragona", items: "Dream ×1, 1525 ×1", total: 15.0, status: "enviado", date: "06/06/2026" },
  { id: "YM-1042", customer: "Ana García", city: "Barcelona", items: "Mágnum ×2", total: 15.0, status: "entregado", date: "05/06/2026" },
];

const STOCK: { variety: string; units: number; level: "ok" | "low" | "out" }[] = [
  { variety: "Fresa Mágnum", units: 48, level: "ok" },
  { variety: "Fresa Dream", units: 12, level: "low" },
  { variety: "Fresa Variedad 1525", units: 0, level: "out" },
];

const STATUS_STYLE: Record<OrderStatus, { bg: string; color: string; label: string }> = {
  pendiente: { bg: "#fdf0ef", color: "#c0392b", label: "Pendiente" },
  enviado: { bg: "#eef2fb", color: "#2c5282", label: "Enviado" },
  entregado: { bg: "#eaf7ee", color: "#1f7a43", label: "Entregado" },
};

const STOCK_STYLE: Record<"ok" | "low" | "out", { color: string; label: string }> = {
  ok: { color: "#1f7a43", label: "Disponible" },
  low: { color: "#b8860b", label: "Stock bajo" },
  out: { color: "#c0392b", label: "Agotado" },
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl bg-white p-5"
      style={{ border: "1px solid rgba(245,198,194,0.7)" }}
    >
      <p className="text-xs font-semibold text-[#7a3a3a]/55 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="font-serif text-2xl text-[#1a0808]">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const pendientes = ORDERS.filter((o) => o.status === "pendiente").length;
  const ingresos = ORDERS.reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fdf6f5" }}>
      {/* Cabecera */}
      <header
        className="flex items-center justify-between px-6 md:px-10"
        style={{ height: 72, borderBottom: "1px solid rgba(245,198,194,0.7)", backgroundColor: "#ffffff" }}
      >
        <div className="flex items-center gap-3">
          <Image
            src="/logo-nuevo.jpg"
            alt="Yaya Mariana"
            width={160}
            height={36}
            priority
            className="w-auto"
            style={{ height: 36 }}
          />
          <span className="hidden sm:inline text-sm font-semibold text-[#7a3a3a]/60 border-l border-[#f5c6c2] pl-3">
            Panel interno
          </span>
        </div>
        <form method="post" action="/api/admin/logout">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-full text-sm font-semibold text-[#c0392b] transition-colors hover:bg-[rgba(245,198,194,0.2)]"
            style={{ border: "1px solid rgba(192,57,43,0.42)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión
          </button>
        </form>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-[#1a0808] mb-1">Resumen</h1>
          <p className="text-sm text-[#7a3a3a]/55">
            Datos de demostración — se conectarán a pedidos reales cuando se integre Stripe.
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Pedidos" value={String(ORDERS.length)} />
          <StatCard label="Pendientes" value={String(pendientes)} />
          <StatCard label="Variedades" value={String(STOCK.length)} />
          <StatCard label="Ingresos" value={`${ingresos.toFixed(2)}€`} />
        </div>

        {/* Stock por variedad */}
        <section className="mb-12">
          <h2 className="font-serif text-xl text-[#1a0808] mb-4">Stock por variedad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STOCK.map((s) => {
              const st = STOCK_STYLE[s.level];
              return (
                <div
                  key={s.variety}
                  className="rounded-2xl bg-white p-5"
                  style={{ border: "1px solid rgba(245,198,194,0.7)" }}
                >
                  <p className="font-semibold text-[#1a0808] mb-1">{s.variety}</p>
                  <p className="text-2xl font-bold text-[#1a0808] numerals-tabular">
                    {s.units}
                    <span className="text-sm font-normal text-[#7a3a3a]/50 ml-1.5">cajas 500g</span>
                  </p>
                  <span
                    className="inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${st.color}1a`, color: st.color }}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pedidos */}
        <section>
          <h2 className="font-serif text-xl text-[#1a0808] mb-4">Pedidos recientes</h2>
          <div
            className="rounded-2xl bg-white overflow-hidden"
            style={{ border: "1px solid rgba(245,198,194,0.7)" }}
          >
            {/* Cabecera tabla (md+) */}
            <div className="hidden md:grid grid-cols-[1fr_1.4fr_1.4fr_0.8fr_1fr] gap-3 px-5 py-3 text-xs font-bold uppercase tracking-wide text-[#7a3a3a]/55"
              style={{ borderBottom: "1px solid rgba(245,198,194,0.5)" }}>
              <span>Pedido</span>
              <span>Cliente</span>
              <span>Productos</span>
              <span>Total</span>
              <span>Estado</span>
            </div>
            <ul role="list">
              {ORDERS.map((o) => {
                const st = STATUS_STYLE[o.status];
                return (
                  <li
                    key={o.id}
                    className="grid grid-cols-2 md:grid-cols-[1fr_1.4fr_1.4fr_0.8fr_1fr] gap-x-3 gap-y-1 px-5 py-4 items-center text-sm"
                    style={{ borderBottom: "1px solid rgba(245,198,194,0.35)" }}
                  >
                    <span className="font-semibold text-[#1a0808]">
                      {o.id}
                      <span className="block text-xs font-normal text-[#7a3a3a]/45 md:hidden">{o.date}</span>
                    </span>
                    <span className="text-[#7a3a3a] text-right md:text-left">
                      {o.customer}
                      <span className="block text-xs text-[#7a3a3a]/45">{o.city}</span>
                    </span>
                    <span className="text-[#7a3a3a]/80 hidden md:block">{o.items}</span>
                    <span className="font-semibold text-[#1a0808] numerals-tabular hidden md:block">
                      {o.total.toFixed(2)}€
                    </span>
                    <span className="md:justify-self-start justify-self-end">
                      <span
                        className="inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
