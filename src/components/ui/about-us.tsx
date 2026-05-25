"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    /* TANDA 1 — ritmo .section; ancho editorial .container-prose (720px). */
    <section id="sobre-nosotros" className="section bg-white">
      <div className="container-prose">
        {/* TANDA 5 (HI-7) — entrada de la sección de tributo: el barrido
            lateral x:-60 se sustituye por un fade-up discreto translateY
            14px. Movimiento corto y digno en la sección más solemne. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-overline text-[var(--color-brand-primary)] mb-4">
            {t.about.eyebrow}
          </span>
          <h2 className="text-h2 text-[var(--color-text-primary)] leading-[1.1] mb-6">
            {t.about.title}{" "}
            <em className="italic text-[var(--color-brand-primary)]">{t.about.titleEm}</em>
          </h2>
          {/* TANDA 3 (Fase 5) — `.text-body` (token unificado, 15px/1.65) +
              `max-w-[60ch]` (G-2 / hierarchy-master): el `container-prose`
              (720px) deja líneas de ~90 chars, fuera del rango cómodo de
              lectura. La columna del cuerpo se constriñe a ~60 chars sin
              tocar el ancho del eyebrow/h2/bloque de tributo. */}
          <div className="space-y-4 text-body text-[var(--color-text-secondary)] max-w-[60ch]">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
          </div>

          {/* Bloque tributo — slot de retrato + cita.
              Slot de retrato: tratamiento tipográfico (Path fallback).
              Foto de archivo familiar pendiente; NUNCA imagen IA de Mariana. */}
          {/* TANDA 1 — el bloque pasa de `items-stretch` a `items-start`: la
              placa de tributo ya no se estira a la altura variable del
              blockquote. */}
          <div className="mt-8 flex flex-col sm:flex-row items-start gap-5">
            {/* Issue #10 — placa = soporte (etiqueta de autoría): su nombre se
                reduce a text-lg para no exceder el peso del blockquote, que es
                el protagonista del bloque tributo. */}
            {/* TANDA 1 — la placa con el nombre de la homenajeada tiene ahora
                una FORMA ESTABLE: `aspect-[4/5]` se mantiene idéntica en móvil
                y desktop (antes `h-[150px] sm:h-auto` cambiaba de proporción
                entre viewports). Ancho `sm:w-[160px]`→`sm:w-[220px]`: ratio
                ~2:3 frente al blockquote, la presencia que su carga emocional
                pide. El `aspect-ratio` fijo deja además reservado el slot
                anti-CLS para el futuro swap por la foto familiar de archivo. */}
            <div className="shrink-0 w-full sm:w-[220px] aspect-[4/5] flex items-center justify-center bg-[var(--color-bg-subtle)] border border-[var(--color-border-subtle)] px-5 py-6">
              <span className="font-serif italic text-lg leading-tight text-[var(--color-brand-primary)]">
                Mariana
              </span>
            </div>
            <blockquote className="flex-1 pl-5 border-l-[3px] border-[var(--color-brand-primary)] flex flex-col justify-center self-stretch">
              <p className="font-serif italic text-[var(--color-text-primary)] text-lg leading-relaxed">
                &ldquo;{t.about.quote}&rdquo;
              </p>
              <footer className="mt-2 text-sm text-[var(--color-text-secondary)] not-italic">
                — {t.about.quoteAuthor}
              </footer>
            </blockquote>
          </div>

          {/* TANDA 2 — botones del sistema: primario (size md) + ghost
              (subrayado scaleX, tratamiento único de secundario). El hover
              sobrio lo da el CSS del sistema. E1 — "Ver tienda" re-apuntado
              a `#productos` (antes /checkout: checkout vacío). */}
          <div className="mt-8 flex items-center gap-4">
            <Button as="a" href="#productos" variant="primary" size="md">
              {t.about.viewStore}
            </Button>
            <Button as="a" href="#contacto" variant="ghost">
              {t.about.contact}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
