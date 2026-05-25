"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { season } from "@/lib/season";
import { Button } from "@/components/ui/button";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Variante en temporada — oferta comercial habitual. */
function InSeasonCTA() {
  const { t } = useLanguage();

  return (
    <>
      {/* TANDA 1 — `#f5c6c2` (drift de paleta) → `--color-accent-on-deep`,
          token nuevo para el acento cream sobre superficie maroon. */}
      <span className="inline-block text-overline text-[var(--color-accent-on-deep)] mb-4">
        {t.cta.eyebrow}
      </span>
      {/* TANDA 5 (HI-7) — el H2 ya no crece desde scale:0.85 (pop de
          anuncio); entra en fade-up discreto translateY 14px. El subtítulo
          reduce su barrido de y:40 a 14px. */}
      <motion.h2
        className="text-h2 leading-[1.1] mb-4"
        style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        {t.cta.title}<br />
        <em className="italic text-[var(--color-accent-on-deep)]">{t.cta.titleEm}</em>
      </motion.h2>
      {/* TANDA 1 — subtítulo a la columna de medida única `--measure-header`
          (G-2) en lugar del `max-w-md` suelto. Banda oscura: el ritmo
          eyebrow mb-4 → H2 mb-4 → subtítulo mb-8 se mantiene (el salto
          H2→subtítulo lo aporta el `mb-4` del H2; menos aire por diseño en
          superficie deep — no se aplica `.section-header__sub` para no
          duplicar el margen superior). */}
      <motion.p
        className="text-body text-[var(--color-text-on-brand)] mb-8 mx-auto"
        style={{ maxWidth: "var(--measure-header)" }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.12, ease: EASE_OUT }}
      >
        {t.cta.subtitle}
      </motion.p>
      {/* TANDA 2 — jerarquía resuelta (D6): el primario es el botón invertido
          (blanco sólido sobre la banda roja); el secundario, antes un outline
          `border-2` que competía con peso casi idéntico, baja a ghost real
          (texto + subrayado scaleX, sin borde). Un único CTA domina.
          E1 — "Comprar ahora" re-apuntado a `#productos` (antes /checkout
          directo: el visitante caía en un checkout vacío). */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Button as="a" href="#productos" variant="primary-inverse" size="md">
          {t.cta.buyNow}
        </Button>
        <Button as="a" href="#sobre-nosotros" variant="ghost" onDeep>
          {t.cta.ourStory}
        </Button>
      </div>

      {/* M4 — micro-bloque cold-chain: trazabilidad logística de la entrega. */}
      {/* TANDA 1 — `mt-7`(28px)→`mt-8`(32px): unifica el ritmo de los dos
          micro-bloques inferiores (cold-chain y trust badges ahora ambos
          `mt-8`). `gap-2.5`(10px)→`gap-3`(12px): snap a la escala base-4. */}
      <div className="mt-8 flex items-center justify-center gap-3 flex-wrap text-xs text-[var(--color-text-on-brand)]">
        {t.cta.coldChain.map((item, i) => (
          <span key={item} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden className="text-white/30">·</span>}
            {item}
          </span>
        ))}
      </div>

      {/* Trust badges */}
      <div className="mt-8 flex items-center justify-center gap-6 flex-wrap text-sm text-[var(--color-text-on-brand)]">
        {[t.cta.badges.freeShipping, t.cta.badges.noPesticides, t.cta.badges.ownHarvest, t.cta.badges.returns].map((badge) => (
          <span key={badge} className="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-[var(--color-brand-hover)]">
              <path d="M8 1L10 6h5L11 9l2 5-5-3-5 3 2-5-4-3h5z" />
            </svg>
            {badge}
          </span>
        ))}
      </div>
    </>
  );
}

/* M5 — variante off-season: la oferta comercial se sustituye por una
   captura de email para avisar de la próxima cosecha.
   · consentimiento DESMARCADO por defecto (RGPD).
   · double opt-in: el envío aquí es el primer paso; la página de
     confirmación por email es entregable de una fase posterior. */
function OffSeasonCTA() {
  const { t } = useLanguage();
  const o = t.cta.offSeason;
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      /* TANDA 4 (#36) — bloque de éxito off-season anunciado por el SR. */
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-3 py-4">
        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
          {/* TANDA 1 — stroke `#f5c6c2` → token `--color-accent-on-deep`. */}
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-on-deep)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h2 className="text-h2" style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
          {o.sentTitle}
        </h2>
        <p className="text-body text-[var(--color-text-on-brand)] max-w-md mx-auto">
          {o.sentSubtitle}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* TANDA 1 — `#f5c6c2` → token `--color-accent-on-deep`. */}
      <span className="inline-block text-overline text-[var(--color-accent-on-deep)] mb-4">
        {o.eyebrow}
      </span>
      {/* TANDA 5 (HI-7) — entrada fade-up discreta: sin scale:0.85 de pop;
          barrido del subtítulo reducido de y:40 a 14px. */}
      <motion.h2
        className="text-h2 leading-[1.1] mb-4"
        style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        {o.title}<br />
        <em className="italic text-[var(--color-accent-on-deep)]">
          {o.titleEm} {t.months[season.nextHarvestMonth]}
        </em>
      </motion.h2>
      {/* TANDA 1 — subtítulo a la columna de medida única `--measure-header`
          (G-2); banda oscura: ritmo eyebrow mb-4 → H2 mb-4 → subtítulo mb-8. */}
      <motion.p
        className="text-body text-[var(--color-text-on-brand)] mb-8 mx-auto"
        style={{ maxWidth: "var(--measure-header)" }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.12, ease: EASE_OUT }}
      >
        {o.subtitle}
      </motion.p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* TANDA 4 — text-base (16px) anti auto-zoom iOS (#CR-12);
              inputmode/autocomplete/enterkeyhint de email (#CR-13). */}
          <input
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            enterKeyHint="send"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={o.emailPlaceholder}
            aria-label={o.emailLabel}
            className="flex-1 rounded-full bg-[var(--color-bg-surface)] px-5 py-3 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-white/70"
          />
          {/* TANDA 2 — "Avísame": mismo botón del sistema que "Comprar ahora"
              (primario invertido) — son el mismo CTA en dos estaciones, ahora
              idénticos (D17). D18 — el hover deja de ser un crecimiento de
              sombra (lectura de anuncio) y pasa al cambio de superficie sobrio
              del sistema. */}
          <Button type="submit" variant="primary-inverse" size="md">
            {o.notify}
          </Button>
        </div>
        {/* TANDA 1 — `gap-2.5`(10px)→`gap-3`(12px) y `mt-0.5`(2px)→`mt-1`(4px):
            snap a la escala base-4. */}
        <label className="mt-4 flex items-start gap-3 text-left text-xs text-[var(--color-text-on-brand)] leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 w-4 h-4 shrink-0 accent-[var(--color-brand-primary)] cursor-pointer"
          />
          <span>{o.consent}</span>
        </label>
      </form>
    </>
  );
}

export default function CTA() {
  return (
    /* TANDA 1 — banda oscura: ritmo .section-deep; ancho editorial .container-prose. */
    /* TANDA 5 (ME-21) — fondo aplanado: el gradiente diagonal 3-stop
       rojo→naranja se sustituye por superficie sólida --color-bg-deep,
       coherente con la banda oscura de StatsStrip y dentro de la
       disciplina 2-color. */
    <section
      className="section-deep text-white text-center"
      style={{ backgroundColor: "var(--color-bg-deep)" }}
    >
      <div className="container-prose">
        {season.isOffSeason ? <OffSeasonCTA /> : <InSeasonCTA />}
      </div>
    </section>
  );
}
