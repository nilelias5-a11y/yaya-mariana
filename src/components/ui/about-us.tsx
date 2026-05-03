"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const photos = [
  { src: "/fresas-1.jpg", alt: "Caja de fresas Yaya Mariana" },
  { src: "/fresas-2.jpg", alt: "Fresas frescas Yaya Mariana" },
  { src: "/fresas-3.jpg", alt: "Fresas premium Yaya Mariana" },
];

export default function AboutUs() {
  return (
    <section id="sobre-nosotros" className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Text column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-4">
            Nuestra historia
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1a0808] leading-[1.1] mb-6">
            El sabor de siempre,{" "}
            <em className="text-[#c0392b] not-italic italic">cultivado con amor</em>
          </h2>
          <div className="space-y-4 text-[#7a3a3a]/72 text-[0.9375rem] leading-relaxed">
            <p>
              Yaya Mariana nació de la pasión por las fresas de calidad. Cultivamos fresas frescas
              en el Maresme con el mismo amor y dedicación que le pondría tu abuela. Cada fresa
              recogida en su punto óptimo de madurez, directa del campo a tu mesa.
            </p>
            <p>
              Trabajamos con variedades seleccionadas — Mágnum, Dream y 1525 — por su sabor,
              textura y dulzura. Sin pesticidas, sin químicos artificiales. Solo el sol, la tierra
              y el cuidado de nuestras manos.
            </p>
          </div>

          <blockquote className="mt-8 pl-5 border-l-[3px] border-[#e74c3c]">
            <p className="italic text-[#7a3a3a] text-base leading-relaxed">
              "Mi abuela me enseñó que las mejores fresas son las que se recogen con amor y se comen el mismo día."
            </p>
            <footer className="mt-2 text-sm text-[#7a3a3a]/50 not-italic">
              — J. Elías, fundador de Yaya Mariana
            </footer>
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            <a
              href="/checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#c0392b] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#a93226] transition-colors"
            >
              Ver tienda
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#c0392b] hover:text-[#e74c3c] transition-colors"
            >
              Contactar →
            </a>
          </div>
        </motion.div>

        {/* Photo mosaic — aparición escalonada al hacer scroll */}
        <div className="grid grid-cols-2 gap-3 h-[440px]">
          {/* Foto grande izquierda */}
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: 0, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={photos[0].src}
              alt={photos[0].alt}
              fill
              sizes="(max-width: 1024px) 50vw, 320px"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* Columna derecha: 2 fotos apiladas con retraso */}
          <div className="flex flex-col gap-3">
            <motion.div
              className="relative flex-1 overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={photos[1].src}
                alt={photos[1].alt}
                fill
                sizes="(max-width: 1024px) 50vw, 320px"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            <motion.div
              className="relative flex-1 overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={photos[2].src}
                alt={photos[2].alt}
                fill
                sizes="(max-width: 1024px) 50vw, 320px"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
