const stats = [
  {
    value: "90%",
    label: "menos agua vs. cultivo tradicional",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z" />
      </svg>
    ),
  },
  {
    value: "0",
    label: "pesticidas ni químicos añadidos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <circle cx="12" cy="12" r="9" />
        <line x1="5.64" y1="5.64" x2="18.36" y2="18.36" />
      </svg>
    ),
  },
  {
    value: "6",
    label: "variedades de lechuga fresca",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <path d="M12 22V12M12 12C12 7 7 4 3 3c1 4 3 8 9 9zM12 12c0-5 5-8 9-9-1 4-3 8-9 9z" />
      </svg>
    ),
  },
  {
    value: "24h",
    label: "envío fresco a toda la península",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8">
        <rect x="2" y="7" width="14" height="11" rx="1" />
        <path d="M16 10h3l3 4v4h-6V10z" />
        <circle cx="6.5" cy="18.5" r="1.5" />
        <circle cx="18.5" cy="18.5" r="1.5" />
      </svg>
    ),
  },
];

export default function StatsStrip() {
  return (
    <section className="bg-[#1a3d1a] text-white py-14 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
        {stats.map(({ value, label, icon }) => (
          <div key={value} className="flex flex-col items-center text-center gap-2">
            <div className="text-[#4caf50]">{icon}</div>
            <span className="font-serif text-[3.25rem] font-bold leading-none mt-1">{value}</span>
            <span className="text-sm text-white/65 leading-snug max-w-[14ch]">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
