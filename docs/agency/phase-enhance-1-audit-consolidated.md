# Fase ENHANCE-1 — Auditoría consolidada de oportunidades

> **Modo:** AUDIT (sin tocar código). 9 auditores en paralelo proponen enhancements al estilo La Nonna sobre la base canónica de Nil (rama `clasico` HEAD `e536bc5`).
>
> **Reglas vigentes:** `docs/agency/nil-design-preferences.md` es CANÓNICO. Additive-only. Prohibido modificar fondos / paleta / tipografía base / layouts / estructura. Permitido añadir microtexturas / micro-animaciones / decorativos secundarios.
>
> **Referencia visual:** `C:\proyectos\la-nonna\` (los 9 agentes lo recorrieron como inspiración).

## Conteo global

- **91 propuestas** totales (70 ADITIVA, 20 MIXTA, 1 BUG flagged as no-enhance).
- Por prioridad: ~28 ALTA · ~37 MEDIA · ~26 BAJA.
- 9 secciones tocadas: Global · Hero · Nav · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer · Cart/Checkout · Devtools.

## Origen (códigos para la tabla)

- **CD** = creative-director (sistema motion tokens, hairlines reutilizables, dropcap, link-underline, etc.)
- **VP** = visual-perfection (micro-bordes, sombras, separadores edge-to-edge)
- **HS** = hero-specialist (grano, scroll-cue, drop-cap quote, halo logo, polvo)
- **FA** = footer-architect (wordmark, hairline editorial, accent headings, link tributo, bug legacy `yayamariana.com`)
- **AP** = animation-premium (curva warm-lux, reveal hairlines, settle counters, highlight wipe)
- **TM** = typography-master (font-feature-settings, tabular-nums, dropcap, label ornament)
- **CP** = color-psychologist (grano filmográfico, halo cream-rosa, paper texture, vignettes — TODO INTERNO a la paleta)
- **EE** = easter-egg-creator (halo Yaya hover, console tribute, footer petal)
- **MC** = micro-copy (empty cart espera, processing Stripe, success "te leemos pronto", quitar exclamaciones)

## Reglas de filtrado del quality-gate

- **ADITIVA** pasa automáticamente.
- **MIXTA** queda fuera del filtro automático. Requiere firma explícita de Nil caso por caso (`docs/agency/phase-X-Nil-override-request.md`).
- **BUG** (no enhance) escala a flujo de fix, no de enhance.
- **Test La Nonna** obligatorio: si una propuesta no pasaría como "elegante" allí, se descarta.

## Sinergias entre agentes (propuestas que se refuerzan)

| Propuesta unificada | Auditores que la proponen | Notas |
|---|---|---|
| Grano filmográfico Hero 1-2% | HS-P1 + CP-#1 | Mismo gesto, dos implementaciones (SVG turbulence HS / radial-dots CP). Implementar **una sola vez**. |
| Halo cálido detrás del logo/título Hero | HS-P2 + CP-#2 | Idéntico. Implementar una vez. |
| Drop cap AboutUs p1 (Playfair `#c0392b`) | CD-#6 + TM-#4 | Mismo elemento, mismo color. Implementar una vez. |
| Hairlines edge en bandas oscuras (StatsStrip + CTA) | VP-#3 + VP-#11 + CD-#9 + AP | "Tape cinematográfico" sobre `#5c1a1a` y `#c0392b`. |
| Curva warm-lux como sistema | CD-#1 + AP (toda la auditoría) | Tokenizar `--ease-warm-lux: cubic-bezier(0.19,1,0.22,1)` y `--dur-reveal: 760ms` UNA vez en `globals.css`. |
| Sistema reveal opt-in (no useInView por componente) | CD-#3 | Convive con framer-motion existente sin reemplazarlo. |

## Recomendación de orden de implementación

**Tanda E1 (fundación de sistema)** — todas ALTA-prioridad y casi-todas ADITIVAS:
1. Tokenizar curvas warm-lux + duration tokens en `globals.css` (CD-#1).
2. `font-feature-settings` global para serif + Inter (TM-#1).
3. `prefers-reduced-motion` gate global para nuevas adiciones (CD-#4).
4. `.hairline-accent` utility class (CD-#2).
5. `tabular-nums` en StatsStrip + precios Products (TM-#2, TM-#8).

**Tanda E2 (Hero polishing)** — ALTA visible:
6. Grano filmográfico Hero (HS-P1 / CP-#1 unificadas).
7. Scroll-cue idle abajo del Hero (HS-P1).
8. Aura/halo logo central (HS-P2 / CP-#2 unificadas).
9. Hairline-rule horizontal bajo eyebrow Hero (HS-P2 MIXTO — requiere firma).
10. Letter-spacing settle del eyebrow Hero (AP).

**Tanda E3 (AboutUs editorial)** — ALTA emotivo:
11. Drop cap AboutUs p1 (CD-#6 / TM-#4 unificadas).
12. Blockquote ornament + comilla decorativa (CD-#7 + AP).
13. Highlight wipe terracota sobre `&lt;em&gt;` (AP).
14. Glifo ornamental tras blockquote `❦` (CD-#7).

**Tanda E4 (secciones intermedias)** — MEDIA:
15. StatsStrip hairlines edge top/bottom + divisor entre stats (VP-#3, VP-#4).
16. Stats letter-spacing settle sincronizado con count-up (AP MIXTO).
17. Stats hairline acento `#e74c3c` 12% (CD-#9).
18. Products card stroke `#f5c6c2` 60% (VP-#6).
19. Products patrón puntos con mask radial atenuado en bordes (VP-#5).

**Tanda E5 (Contact + Footer refinement)** — MEDIA/BAJA:
20. Contact form-card border + inset shadow (VP-#12).
21. Contact icon chips border (VP-#13).
22. Contact divisor vertical columnas (VP-#14).
23. Contact a/mailto/tel underline hairline (AP).
24. Footer brand description max-w-prose (FA — desahogar copy).
25. Footer headings accent terracota desaturado (FA MIXTO).
26. Footer hairline editorial doble fina (FA).
27. Footer line tributo opcional bottom-row (FA — requiere copy de Nil).
28. Footer socials halo radial hover (FA + AP).

**Tanda E6 (microcopy ADITIVA pura)**:
29. `cart.emptyHint` nuevo (MC).
30. `footer.inMemoryHint` tooltip (MC).
31. `hero.quoteAuthor` tooltip glosa (MC).

**Tanda E7 (easter eggs)**:
32. Halo hover sostenido en `quoteAuthor` (EE — sessionStorage).
33. Console tribute message (EE).
34. Pétalo single-shot al llegar al footer la primera vez (EE — localStorage).

**Tanda E8 (microcopy MIXTA — requiere firma)**:
35. Reescritura empty cart → "La cesta espera" (MC MIXTO).
36. Reescritura processing → "Un momento, hablamos con Stripe..." (MC MIXTO).
37. Reescritura success body → "Gracias. Te leemos pronto," (MC MIXTO).
38. Reescritura contact sentSubtitle → "Gracias. Te leemos pronto, con calma." (MC MIXTO).
39. Quitar exclamación success checkout (MC MIXTO).

**Tanda E9 (BUG fix, no enhance)**:
40. 6 enlaces footer apuntan a dominio legacy `yayamariana.com` (lechugas abandonada). FA marcó como CRÍTICO — flujo de fix, no de enhance.

**Diferido a debate explícito con Nil (todas MIXTA en secciones BLOQUEADAS):**
- Outline 1px en cards Values (VP-#9, CP-#4).
- Hairlines edge inset en CTA rojo (VP-#11, CD-#12 sheen mixto).
- Mancha decorativa en Products (CP-#6 MIXTO).
- Shimmer rosa en hover CTA rojo (CP-#7 MIXTO).

## Tabla completa por sección

Ver bloque de tablas más abajo. El doc completo tiene los 91 ítems con auditor de origen, test La Nonna y razón de MIXTA cuando aplica.

---

(Tablas detalladas se entregaron en el chat al usuario en el mismo turno. Este archivo sirve de referencia indexable para el `quality-gate` cuando Nil apruebe propuestas concretas.)
