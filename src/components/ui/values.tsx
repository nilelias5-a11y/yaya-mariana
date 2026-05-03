const benefits = [
  {
    emoji: "🍓",
    title: "Vitamina C natural",
    description:
      "Nuestras fresas son una fuente excepcional de vitamina C, antioxidantes y ácido fólico que refuerzan el sistema inmunológico.",
  },
  {
    emoji: "💧",
    title: "Hidratación máxima",
    description:
      "Con un 90% de contenido en agua, las fresas te ayudan a mantenerte hidratado y a cuidar tu piel desde dentro.",
  },
  {
    emoji: "🚫",
    title: "Cero pesticidas",
    description:
      "Cultivadas sin ningún tipo de pesticida ni químico artificial. Solo agua, luz y el cuidado que merece cada fruta.",
  },
  {
    emoji: "🌍",
    title: "Huella mínima",
    description:
      "Nuestro sistema de cultivo controlado minimiza el impacto ambiental y reduce drásticamente el uso de recursos hídricos.",
  },
  {
    emoji: "🛡️",
    title: "Antioxidantes",
    description:
      "Alto contenido en antocianinas y polifenoles que protegen las células del estrés oxidativo y favorecen la salud cardiovascular.",
  },
  {
    emoji: "✨",
    title: "Sabor intenso",
    description:
      "El cultivo controlado y el punto óptimo de cosecha garantizan un sabor dulce e intenso en cada fresa que llega a tu mesa.",
  },
];

export default function Values() {
  return (
    <section className="bg-[#fdf0ef] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-3">
            Por qué elegirnos
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1a0808]">
            Frescas desde el campo
          </h2>
          <p className="mt-3 text-[#7a3a3a]/65 max-w-md mx-auto text-[0.9375rem] leading-relaxed">
            Cada fresa que cultivamos lleva consigo nutrición, sabor y compromiso con el
            medio ambiente.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map(({ emoji, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#fdf0ef] flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {emoji}
              </div>
              <h3 className="font-serif text-xl text-[#1a0808] mb-2">{title}</h3>
              <p className="text-sm text-[#7a3a3a]/65 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
