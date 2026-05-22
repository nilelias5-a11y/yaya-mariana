"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

/* TANDA 4 (#30) — iconos decorativos: aria-hidden, consistencia con contact/hero. */
/* TANDA 1 — `stroke` literal por icono sustituido por `currentColor`: el
   color de marca lo aporta el contenedor (`.text-[var(--color-brand-primary)]`),
   patrón coherente con el resto de iconos del build. */
const ICONS = [
  // Vitamina C — hoja/planta
  <svg key="leaf" aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M12 22V12" />
    <path d="M12 12C12 7 7 3 3 3c0 5 3 9 9 9z" />
    <path d="M12 12c0-5 5-9 9-9-0 5-3 9-9 9z" />
  </svg>,
  // Hidratación — gota de agua
  <svg key="drop" aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13z" />
  </svg>,
  // Cero pesticidas — escudo con check
  <svg key="shield" aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>,
  // Huella mínima — hoja con círculo
  <svg key="eco" aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 17v-5" />
    <path d="M12 12c0-3 2.5-5 5-5-0 3-2 5-5 5z" />
    <path d="M12 12c0-3-2.5-5-5-5 0 3 2 5 5 5z" />
  </svg>,
  // Antioxidantes — corazón
  <svg key="heart" aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>,
  // Sabor intenso — estrella
  <svg key="star" aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>,
];

export default function Values() {
  const { t } = useLanguage();

  return (
    <section className="section bg-[var(--color-bg-subtle)]">
      <div className="container">
        {/* TANDA 1 (G-2) — receta única de header: `.section-header` fija la
            columna de medida y el ritmo eyebrow mb-4 → título → subtítulo
            mt-4 → contenido mb-12, idéntico a Products/Contact/CTA. */}
        <div className="section-header mb-12">
          <span className="section-header__eyebrow text-overline text-[var(--color-brand-primary)]">
            {t.values.eyebrow}
          </span>
          <h2 className="text-h2 text-[var(--color-text-primary)]">
            {t.values.title}
          </h2>
          {/* TANDA 1 — `mt-3`→`mt-4` (vía `.section-header__sub`): el salto
              título→subtítulo iguala al de eyebrow→título (16px). */}
          <p className="section-header__sub text-[var(--color-text-secondary)] text-[0.9375rem] leading-relaxed">
            {t.values.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.values.benefits.map(({ title, description }, i) => (
            // TANDA 5 (HI-7) — entrada fade-up pura: sin scale:0.92 de pop,
            // distancia reducida a 14px (antes y:60). (ME-8) — lift de hover
            // sobrio -4px con sombra neutra del sistema.
            <motion.div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, boxShadow: "var(--shadow-card-raised)", transition: { duration: 0.2, ease: "easeOut" } }}
            >
              {/* TANDA 5 (ME-10) — rotate-[10deg] juguetón retirado del icono;
                  se conserva solo un scale-105 muy leve, sobrio. */}
              {/* TANDA 1 — el color de marca lo aporta el contenedor; los
                  SVG heredan vía `currentColor`. */}
              <div className="w-12 h-12 flex items-center justify-center mb-4 text-[var(--color-brand-primary)] group-hover:scale-105 transition-transform duration-200">
                {ICONS[i]}
              </div>
              <h3 className="text-h4 text-[var(--color-text-primary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
