"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import type { Translations } from "@/i18n/translations";
import Footer from "@/components/ui/footer";

type LegalDoc = keyof Translations["legal"]["docs"];

/* Plantilla compartida de página legal. Contenido placeholder i18n
   (ES/CA/EN) servido desde t.legal.docs[doc]. Diseño coherente con la
   marca: fondo crema, título Playfair, acento terracota y el Footer
   común para mantener la navegación entre documentos. */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const { t } = useLanguage();
  const data = t.legal.docs[doc];

  return (
    <div className="min-h-full flex flex-col bg-[#fdf6f5]">
      {/* Barra superior — logo a inicio + volver. */}
      <header
        className="flex items-center justify-between px-6 md:px-12"
        style={{ height: 72, borderBottom: "1px solid rgba(245,198,194,0.6)" }}
      >
        <Link
          href="/"
          className="shrink-0 transition-opacity duration-200 hover:opacity-80"
        >
          <Image
            src="/logo-nuevo.jpg"
            alt="Yaya Mariana"
            width={200}
            height={44}
            priority
            className="w-auto"
            style={{ height: 44 }}
          />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c0392b] hover:opacity-80 transition-opacity"
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
            aria-hidden
          >
            <path d="M10 4L6 8l4 4" />
          </svg>
          {t.legal.backHome}
        </Link>
      </header>

      <main id="contenido" className="flex-1 px-6 py-14 md:py-20">
        <article className="max-w-[720px] mx-auto">
          {/* Eyebrow + hairline + título */}
          <span className="inline-block text-[#c0392b] text-xs font-bold uppercase tracking-[0.18em] mb-3">
            Yaya Mariana · Legal
          </span>
          <div
            aria-hidden
            className="mb-4"
            style={{ width: 40, height: 1, backgroundColor: "rgba(192,57,43,0.22)" }}
          />
          <h1 className="font-serif text-4xl md:text-5xl text-[#1a0808] leading-[1.1] mb-3">
            {data.title}
          </h1>
          <p className="text-sm text-[#7a3a3a]/60 mb-4">{t.legal.lastUpdated}</p>

          {/* Nota de placeholder — banda sutil cream-rosa */}
          <p
            className="text-[0.875rem] text-[#7a3a3a] italic rounded-lg px-4 py-3 mb-10"
            style={{
              backgroundColor: "#fdf0ef",
              border: "1px solid rgba(245,198,194,0.7)",
              fontFamily: "var(--font-playfair)",
            }}
          >
            {t.legal.placeholderNote}
          </p>

          {/* Secciones */}
          <div className="space-y-8">
            {data.sections.map((section, i) => (
              <section key={i}>
                <h2 className="font-serif text-xl md:text-2xl text-[#1a0808] mb-2">
                  {section.heading}
                </h2>
                <p className="body-pretty body-hyphens text-[0.9375rem] text-[#7a3a3a]/80 leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
