export default function CTA() {
  return (
    <section
      className="py-20 px-6 text-white text-center"
      style={{
        background: "linear-gradient(135deg, #1a3d1a 0%, #2d7a2d 50%, #3d8a3d 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <span className="inline-block text-[#a8d9a8] text-xs font-bold uppercase tracking-[0.18em] mb-4">
          Directo de la granja a tu mesa
        </span>
        <h2 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-4">
          ¿Lista para la verdura<br />
          <em className="italic text-[#a8e6a8]">más fresca de tu vida?</em>
        </h2>
        <p className="text-white/70 text-[0.9375rem] leading-relaxed mb-8 max-w-md mx-auto">
          Envíos gratis a toda la península · Sin compromiso · Lechuga fresca
          directa de nuestra granja hidropónica a tu cocina.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://yayamariana.com/tienda/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#2d7a2d] text-sm font-bold px-8 py-3.5 rounded-full hover:bg-[#f0faf0] transition-colors shadow-lg"
          >
            Comprar ahora
          </a>
          <a
            href="#sobre-nosotros"
            className="inline-flex items-center gap-2 border-2 border-white/60 text-white text-sm font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Conocer nuestra historia
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex items-center justify-center gap-6 flex-wrap text-sm text-white/60">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#4caf50]">
              <path d="M8 1L10 6h5L11 9l2 5-5-3-5 3 2-5-4-3h5z" />
            </svg>
            Envío gratuito
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#4caf50]">
              <path d="M8 1L10 6h5L11 9l2 5-5-3-5 3 2-5-4-3h5z" />
            </svg>
            Sin pesticidas
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#4caf50]">
              <path d="M8 1L10 6h5L11 9l2 5-5-3-5 3 2-5-4-3h5z" />
            </svg>
            Cosecha propia
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[#4caf50]">
              <path d="M8 1L10 6h5L11 9l2 5-5-3-5 3 2-5-4-3h5z" />
            </svg>
            Devolución en 14 días
          </span>
        </div>
      </div>
    </section>
  );
}
