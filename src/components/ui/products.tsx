"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Todos", "Verde", "Roja", "Roble"] as const;
type Category = (typeof CATEGORIES)[number];

const BASE = "https://yayamariana.com/wp-content/uploads/2024/11/";

const PRODUCTS = [
  {
    name: "Lechuga Batavia",
    category: "Verde" as const,
    description: "Textura ligeramente crujiente con sabor suave y equilibrado. Rica en antioxidantes y vitamina K.",
    image: BASE + "DSC00010_YayaMariana-scaled.jpg",
  },
  {
    name: "Lechuga Lollo Verde",
    category: "Verde" as const,
    description: "Hojas rizadas de color verde intenso. Perfecta para ensaladas y guarniciones.",
    image: BASE + "DSC00010-1-scaled.jpg",
  },
  {
    name: "Lechuga Trocadero Verde",
    category: "Verde" as const,
    description: "Textura mantecosa y sabor delicado, muy versátil en cualquier receta de cocina.",
    image: BASE + "DSC00041_YayaMariana-scaled.jpg",
  },
  {
    name: "Lechuga Lollo Rojo",
    category: "Roja" as const,
    description: "Color burdeos intenso para dar vida a tus platos. Llena de antioxidantes y vitamina C.",
    image: BASE + "DSC00070_YayaMariana-scaled.jpg",
  },
  {
    name: "Lechuga Trocadero Roja",
    category: "Roja" as const,
    description: "Suave y mantecosa con un tono rojizo que conquista la vista y el paladar.",
    image: BASE + "DSC00019_YayaMariana-scaled.jpg",
  },
  {
    name: "Lechuga Hoja de Roble",
    category: "Roble" as const,
    description: "Hojas tiernas con forma de roble, sabor suave y refinado. Ideal para ensaladas gourmet.",
    image: BASE + "DSC00229_YayaMariana-scaled.jpg",
  },
];

const BADGE: Record<string, string> = {
  Verde: "bg-[#dcf0dc] text-[#1e5c1e]",
  Roja: "bg-[#fce8e8] text-[#7f1d1d]",
  Roble: "bg-[#fdf3e7] text-[#78350f]",
};

export default function Products() {
  const [active, setActive] = useState<Category>("Todos");

  const filtered =
    active === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <section id="productos" className="bg-[#f5f9f0] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-[#2d7a2d] text-xs font-bold uppercase tracking-[0.18em] mb-3">
            Nuestra cosecha
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#0e1e0e]">
            Nuestras lechugas
          </h2>
          <p className="mt-3 text-[#2a4a2a]/65 max-w-md mx-auto text-[0.9375rem] leading-relaxed">
            Cultivadas sin pesticidas en instalaciones hidropónicas. Directas de la granja a tu
            mesa en menos de 24 horas.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 cursor-pointer ${
                active === cat
                  ? "bg-[#2d7a2d] border-[#2d7a2d] text-white shadow-sm"
                  : "border-[#2d7a2d]/30 text-[#2d7a2d] hover:border-[#2d7a2d] bg-white/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.28 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <span
                    className={`absolute top-3 left-3 text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${BADGE[p.category]}`}
                  >
                    {p.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-[1.2rem] text-[#0e1e0e] mb-1.5">{p.name}</h3>
                  <p className="text-sm text-[#2a4a2a]/65 leading-relaxed mb-4">
                    {p.description}
                  </p>
                  <a
                    href="https://yayamariana.com/tienda/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#2d7a2d] hover:gap-2 transition-all duration-200"
                  >
                    Ver producto
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-3.5 h-3.5"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
