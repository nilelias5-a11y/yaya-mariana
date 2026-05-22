/* ============================================================
   Configuración de temporada — Yaya Mariana
   Fuente única que Nil actualiza manualmente cada campaña.
   Alimenta dos elementos del sitio:
     · chip de trazabilidad en las cards de Products  (harvestWeek)
     · variante off-season del CTA con captura de email (isOffSeason, nextHarvestMonth)
   Sustituible por un JSON/CMS ligero en una fase posterior sin
   tocar los componentes que la consumen.
   ============================================================ */

export const season = {
  /** true cuando las fresas están fuera de temporada → el CTA conmuta a captura de email. */
  isOffSeason: false,

  /** Semana ISO de la última recogida. Footnote del chip de trazabilidad (Products). */
  harvestWeek: 21,

  /** Mes (índice 0-11) de la próxima cosecha. Copy de la variante off-season del CTA. */
  nextHarvestMonth: 2, // marzo
} as const;
