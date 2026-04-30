const benefits = [
  {
    emoji: "💧",
    title: "95% agua",
    description:
      "Nuestras lechugas tienen un contenido de agua del 95%, perfectas para mantenerte hidratado y cuidar tu piel.",
  },
  {
    emoji: "🥦",
    title: "Vitaminas A, C y K",
    description:
      "Ricas en vitaminas esenciales, ácido fólico y minerales que refuerzan el sistema inmunológico.",
  },
  {
    emoji: "🚫",
    title: "Cero pesticidas",
    description:
      "Cultivadas sin ningún tipo de pesticida ni químico artificial. Solo agua, luz y cuidado.",
  },
  {
    emoji: "🌍",
    title: "90% menos agua",
    description:
      "Nuestro sistema hidropónico consume un 90% menos de agua que la agricultura convencional.",
  },
  {
    emoji: "🛡️",
    title: "Antioxidantes",
    description:
      "Altas concentraciones de antioxidantes que protegen las células del estrés oxidativo.",
  },
  {
    emoji: "🌿",
    title: "Fibra natural",
    description:
      "Fuente de fibra dietética que favorece la digestión y contribuye a una dieta equilibrada.",
  },
];

export default function Values() {
  return (
    <section className="bg-[#eaf7ea] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-[#2d7a2d] text-xs font-bold uppercase tracking-[0.18em] mb-3">
            Por qué elegirnos
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#0e1e0e]">
            Salud desde la raíz
          </h2>
          <p className="mt-3 text-[#2a4a2a]/65 max-w-md mx-auto text-[0.9375rem] leading-relaxed">
            Cada lechuga que cultivamos lleva consigo nutrición, sabor y compromiso con el
            medio ambiente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(({ emoji, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#eaf7ea] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {emoji}
              </div>
              <h3 className="font-serif text-xl text-[#0e1e0e] mb-2">{title}</h3>
              <p className="text-sm text-[#2a4a2a]/65 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
