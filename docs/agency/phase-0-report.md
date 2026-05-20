# Fase 0 — Investigación · Reporte Consolidado
**Proyecto:** Yaya Mariana (premium strawberry DTC, Tarragona)
**Branch auditada:** `clasico` (SHA `19dabf2`, backup en `clasico-backup-pre-agents`)
**Modo:** AUDIT (mejoras quirúrgicas, no rebuild)
**Fecha:** 2026-05-20
**Director:** Nil
**Agentes ejecutados:** web-researcher · market-analyst · competitor-analyst · competitor-killer (Phase 1)

---

## 1. Constraints activos para todas las fases siguientes

- **AUDIT MODE:** preservar lo que funciona; mejoras quirúrgicas dentro de las 9 secciones existentes (Hero · StatsStrip · Products · AboutUs · Values · CTA · Contact · Footer · Cart). Sin secciones nuevas salvo flag MAJOR con aprobación previa del director.
- **Firewall narrativo:** la historia es exclusivamente "Yaya Mariana" (la abuela). El fundador se renderiza siempre como `"J. Elías, fundador"`. **Identidad real del inversor PROHIBIDA en cualquier superficie pública** (código, OG, schema, alt, copy desplegado, JSON-LD). Los `docs/agency/` internos pueden contener notas de investigación.
- **Deploy target:** `yayamariana.es` (no comprado todavía). El legacy `yayamariana.com` es Audax/Linverd abandonado — **sin migración, sin 301/410, SEO desde cero**.
- **Intocables** (placeholders intencionales o legalmente correctos): teléfono `+34 666 777 888`, email `info@yaya-mariana.com` (con guion intencional), dirección Badalona (HQ fiscal Audax), precios 7.50€/500g, links sociales raíz, contact-form fake submit, logo artwork.
- **Major change threshold:** redesign Hero/paleta/tipografía base, reestructura IA, añadir/eliminar secciones, cambio stack, integraciones pago/CMS, deploy → confirmación previa Nil.

---

## 2. Hallazgos clave de la auditoría inicial

### Web-researcher — Dossier del cliente
- El `clasico` está bien construido (8.2/10): hero mesh-gradient, contadores animados, carrusel parallax, paridad trilingüe ES/CA/EN.
- Brand digital actual = una sola red (Instagram `@layayamariana`, baja visibilidad). No hay reviews indexadas → marca en **launch phase**.
- Marca tiene prensa positiva reciente (El Mira 2026-05-10, Diari de Tarragona, ElEspañol) — útil como social proof Press-strip en Footer.
- **Bugs concretos identificados** (ya triagados por Nil, ver §5).
- Dossier completo: `docs/agency/phase-0-web-researcher-dossier.md`

### Market-analyst — Contexto sectorial
- España = ~400.000 t fresas/año, ~50% de la producción UE. Huelva domina con ~97% de la producción nacional. **Tarragona/Catalunya es la #2 región, nicho premium defensible**.
- **62% de consumidores españoles priorizan "sin pesticidas" sobre precio** (PwC 2025) — valida el claim core.
- 61% busca activamente producto nacional + temporada (AECOC). 9 de cada 10 prefieren empresas que venden producto nacional fresco.
- E-commerce alimentación español rebote +1.8% Dec 2025 tras dos años inflacionarios.
- **Coyuntura favorable:** la tormenta 2025/26 ha cortado ~50% de la producción de Huelva (ItalianBerry) → ventana de oxígeno mediático para growers catalanes boutique.
- **Amenazas principales:** (1) private label premium (Carrefour Bio, El Corte Inglés, Eroski Eco) — defensa = no commodificarse; (2) gravity de Crowdfarming (350K compradores UE).
- Reporte completo: `docs/agency/phase-0-market-analyst-report.md`

### Competitor-analyst — Landscape competitivo
5 competidores auditados (6 dimensiones cada uno):
| # | Competidor | Tipo | Design |
|---|---|---|---|
| 1 | Crowdfarming | Direct (marketplace) | 7.5/10 |
| 2 | Naranjas del Carmen | Direct (single-producer) | 7/10 |
| 3 | Fruteva | Direct (Huelva DTC) | 6.5/10 |
| 4 | Frutos Rojos Los Conventos | Direct (artisanal berries) | 6/10 |
| 5 | Joselito | Aspirational (premium food) | 8/10 |

**5 referencias award-winning relevantes:** Farm Minerals (Awwwards SOTD Feb-2026) · Post Familiar Wine (SOTD 2024) · Le Fruit Studio (SOTD 2023) · Beerenberg Farm · Swiss Organic Farm.

Patrón común que premia Awwwards food: **2-color discipline + scroll-driven motion + product-as-hero**. Encaja sin tocar la arquitectura actual de Yaya Mariana.

**Gestión de expectativas:** Crowdfarming está estructuralmente arriba en multilingual depth, per-farmer SEO scaffolding, y subscription model. **NO se persigue** — moats de plataforma, meses de eng, diluyen single-producer story. Joselito tiene polish visual y volumen de assets imbatible este ciclo — apuntamos a **restraint+craft signal**, no a volumen.

Reporte completo: `docs/agency/phase-0-competitor-analyst-report.md`

---

## 3. Plan competitivo (competitor-killer Phase 1)

### Winning angle
> Yaya Mariana es la única marca premium-DTC de fresa que combina (a) storytelling a nivel de variedad (Mágnum/Dream/1525), (b) narrativa real de abuela catalana como ancla emocional, y (c) micro-origen Camp de Tarragona — todo sostenido dentro de un restraint Awwwards-tier de 2 colores, con microcopy de trazabilidad que supera a Crowdfarming en una sola página.

### Las 3 Killers (todas dentro del Hero existente)

**Killer Feature** · Hero traceability chip
> **"Recogidas en Tarragona · Mágnum · semana 18"** (auto-updating).
Ningún competidor surface variedad + finca + semana de cosecha en Hero.

**Killer Message** · Hero subtitle slot
> **"Las únicas fresas Mágnum, Dream y 1525 cultivadas con paciencia de abuela en el Camp de Tarragona."**
(Paridad CA + EN en archivo.) Combina 3 claims incopiables en una frase.

**Killer Visual** · Hero 380×380 slot, single image swap
> Manos de la yaya Mariana (reales, gastadas) sosteniendo una sola fresa Mágnum sobre cream `#fdf6f5`, profundidad superficial, sin gloss de estudio. Composición sobre manos + fruta (cara fuera de cuadro o desenfocada — no surface investor identity).

⚠️ **Esta foto NO EXISTE todavía.** Ver §6 Banderas para Fase 1.

### Beat-them Plan — 18 puntos quirúrgicos
**0 secciones nuevas · 0 rewrites de plataforma · 0 intocables tocados · 0 movimientos de migración · 0 expansiones de iniciales.**

| # | Punto | Vence a quién en qué | Impact | Effort | Owner | Sección |
|---|---|---|---|---|---|---|
| 1 | Badge variedad + descriptor sensorial 1-línea por card | CF/NdC/FT/FR en variety storytelling | CRIT | LOW | copywriter | Products |
| 2 | "Recogidas en Tarragona · {variedad} · semana {ISO}" bajo H1 Hero | CF en trazabilidad moat | CRIT | LOW | hero-specialist + copywriter | Hero |
| 3 | StatsStrip numerics craft-specific (Brix · 24h · 3 variedades · 0 pesticidas) | Joselito silent-proof; Fruteva genérico | HIGH | LOW | copywriter + visual-perfection | StatsStrip |
| 4 | AboutUs first-person narrative abuela Mariana + retrato premium | Los 5 en founder anchor emocional | CRIT | MED | copywriter + image-curator | AboutUs |
| 5 | Disciplina 2-color en globals.css | Farm Minerals/Post Familiar restraint; FT/FR weakness | HIGH | MED | visual-perfection + style-guide-enforcer | globals.css |
| 6 | IntersectionObserver entradas (SIN scroll-jacking) + reduced-motion | CF/NdC mid-tier motion-craft | HIGH | MED | animation-premium + accessibility-perfectionist | Todas secciones |
| 7 | Chip finca + cosecha + variedad en product cards | Beerenberg "Provenance Pathway"; CF sin friction | HIGH | LOW | copywriter + visual-perfection | Products |
| 8 | Hero typography statement "Mágnum · Dream · 1525" línea restrained | Le Fruit Studio typography-first | HIGH | LOW | typography-master + hero-specialist | Hero |
| 9 | Logo WebP/AVIF, drop unoptimized, priority hero only | CF/Joselito en LCP polish | HIGH | LOW | performance-optimizer + lighthouse-auditor | Hero/Footer |
| 10 | Audit contraste contra cream `#fdf6f5` | FT/FR a11y weakness | HIGH | LOW | accessibility-perfectionist | globals.css + Hero |
| 11 | Mobile pass + tap targets ≥44px | FR mobile weak; cierra gap Joselito | HIGH | LOW | mobile-obsessor | Hero/Products/Cart |
| 12 | Cerrar `target="_blank"` checkout (leak de cart context) | CF/NdC en funnel coherence | HIGH | LOW | conversion-funnel-optimizer + frontend-developer | Products/AboutUs/CTA/Footer/Cart |
| 13 | SEO H1/H2 long-tail + JSON-LD + sitemap/robots + hreflang ES/CA/EN | CF/NdC/Joselito en structured-data | HIGH | MED | seo-genius | layout.tsx + app/sitemap.ts + app/robots.ts |
| 14 | Microcopy cold-chain cerca CTA (24-48h península · refrigerado) | CF en shipping-clarity | HIGH | LOW | conversion-funnel-optimizer + copywriter | CTA |
| 15 | Off-season próxima-cosecha countdown + "te avisamos" capture | CF/NdC seasonal narrative sin su friction | MED | MED | conversion-funnel-optimizer + copywriter | CTA |
| 16 | Press-strip en Footer (El Mira · Diari Tarragona · ElEspañol) | FR void social-proof; CF press-led trust | MED | LOW | copywriter + visual-perfection | Footer |
| 17 | Drop Yellowtail; Playfair italic founder signature en AboutUs | Le Fruit Studio/Joselito typography restraint | MED | LOW | typography-master + performance-optimizer | layout.tsx + AboutUs |
| 18 | Reduced-motion easter egg hover Mágnum (single petal/leaf bloom) | Los 5 en craft signal único sin romper restraint | MED | MED | easter-egg-creator + animation-premium | Products |

### Counter-attacks (5 leapfrogs quirúrgicos)
1. **Si Crowdfarming abre una página Tarragona** → amplificar #1 + #8; estarían copiándonos, no liderando.
2. **Si Naranjas del Carmen añade cara fundador** → profundizar #4 con duo multi-generacional abuela + nieto + loop video manos yaya en AboutUs.
3. **Si Fruteva/Frutos Rojos adoptan nombres variedad** → contra-atacar con #2 + Brix en StatsStrip (#3); la moat es la *data concreta*, no el lexicón.
4. **Si Joselito entra en fruta** → CA-native UX (#13) + vocabulario Camp de Tarragona terroir en AboutUs. CA-native UX = moat de meses.
5. **Si supermarket private label lanza fresa premium catalana** → trío simultáneo named-variety + named-grandmother + finca-week chip. Private label no puede fingir abuela ni nombrar una finca por SKU.

### Victory checklist (para Fase 8 quality-gate)
Win threshold: ≥12/18 SUPERADO · 0 CRITICAL en INFERIOR. Plan completo en `docs/agency/phase-0-competitor-killer-plan.md`.

---

## 4. Forecast de carga por fase (basado en owners del Beat-them plan)

| Fase | Agentes que cargan trabajo real |
|---|---|
| 1 (Briefing) | requirements-analyst (decisiones cliente §6), ux-researcher (validar journey), seo-analyst (long-tail Camp de Tarragona) |
| 1.5 (Mood board) | mood-board-creator, creative-director, color-psychologist (validar paleta cream + fresa-red 2-color) |
| 2 (Análisis profundo) | comparison-engine (sintetiza Awwwards refs) |
| 2.5 (Wireframe) | ux-designer, prototype-designer (mostrar dónde van los 18 puntos en wireframe overlay) |
| 3 (Propuesta técnica) | software-recommender (¿stack actual basta?), cms-builder (¿headless ligero o stay-static?), payment-genius (¿Stripe stays?) |
| **4 (Construcción quirúrgica)** | frontend-developer · backend-developer · fullstack-developer · api-developer · hero-specialist · footer-architect · animation-premium · typography-master · image-curator · spacing-perfectionist · hierarchy-master · copywriter · seo-writer · content-strategist · social-media-manager · translator |
| **4.5 (QA visual — peso alto)** | visual-perfection · quality-reviewer · accessibility-perfectionist · mobile-obsessor |
| **5 (Optimización — peso alto)** | performance-optimizer · lighthouse-auditor · core-web-vitals-specialist · caching-specialist · conversion-funnel-optimizer · urgency-architect · style-guide-enforcer · seo-genius |
| 5.5 (Pulido) | iteration-agent · easter-egg-creator |
| 6 (Cliente) | client-simulator |
| 7 (Deploy) | devops-engineer · ci-cd-specialist · hosting-manager · security-auditor · security-guardian · monitoring-specialist · analytics-architect |
| 8 (Quality gate) | quality-gate (target ≥ 8.5/10) + competitor-killer Phase 2 (audita 18 puntos vs live, threshold ≥12 SUPERADO) |

8 agentes faltantes de la lista original (ecom-payments/catalog/cart/orders/support, micro-copy-master, trust-builder, preference-tracker, global-memory-manager) **omitidos** — se crearán otro día. Trabajo distribuido entre los 69 existentes.

---

## 5. Bugs pre-aprobados para Fase 4 (triage Nil 2026-05-20)

| Bug | Fix | Owner |
|---|---|---|
| `<title>` "Lechugas hidropónicas" en layout.tsx:25 | Cambiar a copy fresas | seo-genius |
| StatsStrip `value: "+"` regex no matchea | Dar value real (e.g., "12m") | frontend-developer |
| Catalán contaminando ES `stats.labels` | Reemplazar 2 strings con ES limpio | copywriter / translator |
| `<em className="not-italic italic">` en about-us.tsx:23 | Decidir una sola clase | frontend-developer |
| Yellowtail font cargada nunca usada en layout.tsx | Eliminar import + variable | typography-master |
| Logo `unoptimized` JPG | Convertir WebP/AVIF, mantener `priority` solo en hero | image-curator + performance-optimizer |

**Se mantienen como placeholders intencionales:** social links raíz, contact-form `setSent(true)` (hasta Resend), phone/email/address (per Nil), precios (per Joan Carles).

---

## 6. Banderas para Fase 1 (requirements-analyst — decisiones cliente)

1. **Killer Visual depende de una foto que no existe.** "Manos de la yaya Mariana" — ¿photoshoot real? ¿IA con consistencia de marca? ¿alternativa con assets existentes (e.g., fresa Mágnum sobre lino crudo)? **Bloquea Hero quirúrgico hasta resolverlo.**

2. **AboutUs retrato premium abuela** (#4 del Beat-them plan) — misma dependencia que (1). Decisión cliente: ¿hay foto disponible de la yaya Mariana real? ¿reconstruimos AboutUs con foto que sí existe (manos en tierra/canasta)?

3. **Footer press-strip** (#16) — confirmar permisos de mención: El Mira, Diari de Tarragona, ElEspañol. ¿Tenemos derecho a poner sus logos? ¿O solo cita textual?

4. **Off-season "te avisamos" capture** (#15) — requiere lista de email. ¿Resend / Mailchimp / propia? Decisión técnica + RGPD opt-in.

5. **Hero chip semana ISO auto-updating** (#2) — pequeño workflow operacional (¿quién actualiza la variedad+semana? ¿API/CMS ligero o hardcoded por fase de temporada?).

6. **Decisión narrativa de la abuela real** — ¿existe Mariana como persona viva accesible? El narrative funciona sea ficción o real, pero define qué assets (foto, voz, firma) pueden materializarse.

---

## 7. Deliverables guardados

```
C:\proyectos\yaya-mariana\docs\agency\
├── phase-0-web-researcher-dossier.md       (23KB)
├── phase-0-market-analyst-report.md        (31KB)
├── phase-0-competitor-analyst-report.md    (20KB)
├── phase-0-competitor-killer-plan.md       (30KB)
└── phase-0-report.md                       (este reporte)
```

## 8. Memory updates

```
~/.claude/agencia-web-v2/memory/
├── web-researcher-memory.md         (creado — sector berry DTC + audit framing)
├── market-analyst-memory.md         (creado — mercado fresa ES + premium DTC patterns)
├── competitor-analyst-memory.md     (creado — landscape ES + Awwwards food refs)
└── competitor-killer-memory.md      (actualizado — pattern firewall narrativo + 3 killers a validar post-launch)
```

```
C:\Users\8nill\.claude\projects\C--WINDOWS-System32\memory\
├── project_yaya-mariana.md          (creado — proyecto real, narrativa abuela, untouchables)
└── MEMORY.md                        (índice actualizado)
```

---

## 9. Siguiente fase

**Fase 1 — Briefing** está bloqueada hasta resolver §6 banderas 1-2 (foto abuela). Una vez decidido:
- **requirements-analyst** procesa decisiones cliente (incluyendo §6)
- **ux-researcher** valida user journeys actuales
- **seo-analyst** prepara long-tail Camp de Tarragona

Esperando confirmación del director.
