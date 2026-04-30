import Image from "next/image";

const BASE = "https://yayamariana.com/wp-content/uploads/2024/11/";

const photos = [
  { src: BASE + "DSC00085_YayaMariana-scaled.jpg", alt: "Cultivo hidropónico Yaya Mariana" },
  { src: BASE + "DSC00131_YayaMariana-scaled.jpg", alt: "Lechugas frescas cosechadas" },
  { src: BASE + "DSC00187_YayaMariana-scaled.jpg", alt: "Detalle de lechuga hidropónica" },
];

export default function AboutUs() {
  return (
    <section id="sobre-nosotros" className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Text column */}
        <div>
          <span className="inline-block text-[#2d7a2d] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            Nuestra historia
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#0e1e0e] leading-[1.1] mb-6">
            El legado de la{" "}
            <em className="text-[#2d7a2d] not-italic italic">abuela Mariana</em>
          </h2>
          <div className="space-y-4 text-[#2a4a2a]/72 text-[0.9375rem] leading-relaxed">
            <p>
              Yaya Mariana nació del recuerdo de una abuela que cultivaba sus propias verduras con
              paciencia, amor y respeto por la tierra. Hoy llevamos ese mismo espíritu a un sistema
              de cultivo hidropónico que usa un <strong className="text-[#2d7a2d]">90% menos de agua</strong> que la
              agricultura tradicional.
            </p>
            <p>
              Sin pesticidas, sin químicos artificiales. Solo agua, luz y el cuidado que merece
              cada planta. Nuestras lechugas crecen en instalaciones controladas en Badalona y
              llegan frescas a tu mesa en menos de 24 horas.
            </p>
            <p>
              Porque todo lo bueno en la vida requiere paciencia, trabajo y amor — y eso es
              exactamente lo que ponemos en cada lechuga que cultivamos.
            </p>
          </div>

          <blockquote className="mt-8 pl-5 border-l-[3px] border-[#4caf50]">
            <p className="italic text-[#1a3d1a] text-base leading-relaxed">
              "Todo lo bueno de la vida requiere paciencia, trabajo y amor. Hoy aplicamos esos
              valores en cada lechuga que cultivamos."
            </p>
            <footer className="mt-2 text-sm text-[#2a4a2a]/50 not-italic">
              — J. Elías, fundador de Yaya Mariana
            </footer>
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="https://yayamariana.com/tienda/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2d7a2d] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#3a8a3a] transition-colors"
            >
              Ver tienda
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2d7a2d] hover:text-[#4caf50] transition-colors"
            >
              Contactar →
            </a>
          </div>
        </div>

        {/* Photo mosaic */}
        <div className="grid grid-cols-2 gap-3 h-[440px]">
          {/* Large left photo */}
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src={photos[0].src}
              alt={photos[0].alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              unoptimized
            />
          </div>
          {/* Right column: 2 stacked photos */}
          <div className="flex flex-col gap-3">
            <div className="relative flex-1 overflow-hidden rounded-2xl">
              <Image
                src={photos[1].src}
                alt={photos[1].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                unoptimized
              />
            </div>
            <div className="relative flex-1 overflow-hidden rounded-2xl">
              <Image
                src={photos[2].src}
                alt={photos[2].alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
