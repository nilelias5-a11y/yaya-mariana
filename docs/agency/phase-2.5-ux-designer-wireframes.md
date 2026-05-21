# Fase 2.5 — Wireframes UX (capa IA / estructura / flujos)
**Proyecto:** Yaya Mariana · Branch `clasico` · Modo AUDIT
**Agente:** ux-designer
**Dirección visual heredada:** B "En su Punto" · Hero Path T (tipografía-only) como default, slot 380×380 swappable
**Tono:** HOMENAJE — el sesgo por defecto de este entregable es MANTENER.

---

## ⚑ RATIFICACIÓN DEL DIRECTOR (gate Nil — 2026-05-21)

Este entregable refleja el trabajo del ux-designer. El gate de Nil ratificó 4 decisiones que **enmiendan** partes de este documento; donde haya divergencia, manda el gate (ver `phase-2.5-report.md §2`):

1. Los 9 wireframes — **APROBADOS**.
2. Nav móvil — **hamburguesa mínimo autorizado** (resuelve el flag §5.1 / M9).
3. Chip de trazabilidad — **solo en Products**, retirado del Hero (enmienda M1 → absorbido en M3; ver §5.2).
4. Filtro Products `[Todas][Premium]` — **reetiquetar por variedad** Mágnum/Dream/1525 (resuelve el flag §5.4 / L5).

---

> **Nota de alcance:** este documento aporta la **capa estructural / IA / flujos**. Los wireframes ASCII pixel-layout los entrega `prototype-designer` (ver `phase-2.5-prototype-designer-wireframes.md`).

## 1. SITEMAP + FLUJOS DE CONVERSIÓN (modo AUDIT)

### 1.1 Sitemap real

El sitio es **single-page**. La "navegación" es scroll por anclas dentro de `page.tsx`.

```
## Sitemap — Yaya Mariana (single-page)
### Ruta canónica
- /                       Home (single-page: 9 secciones en orden fijo)
### Anclas de navegación interna (scroll, no rutas)
- #productos · #sobre-nosotros · #contacto    (NAV_HREFS en hero.tsx)
### Rutas reales separadas
- /checkout               Página de pago (Stripe en Fase 4.5)
### Navegación móvil
- ACTUAL: los 3 nav-links y el botón "Ver tienda" se ocultan bajo md:.
  En móvil el nav queda con logo + LanguageSelector solamente.
- GATE 2026-05-21: hamburguesa mínimo autorizado → el nav móvil gana menú.
```

### 1.2 Flujo primario — Compra

Fuga CRITICAL verificada: el mismo destino `/checkout` se alcanza por DOS comportamientos — `router.push` (misma pestaña, desde Cart) y `<a target="_blank">` (pestaña nueva, desde Products/AboutUs/CTA). El cart context (estado React en memoria del SPA) NO sobrevive a una pestaña nueva → usuario llega a `/checkout` con carrito potencialmente vacío. Además "Ver más" promete detalle de producto y entrega checkout (false affordance).

Punto de fuga adicional: el primer add-to-cart NO abre el carrito; solo el badge del FAB lo señala → coste de descubrimiento.

### 1.3 Flujo secundario — Waitlist off-season

Hoy NO EXISTE. La sección CTA muestra copy comercial year-round. Propuesto (Beat-them #15, dentro de la sección CTA — no sección nueva): chip Hero/Products muestra "Próxima cosecha"; CTA conmuta a registro estacional + campo email con double-opt-in y consentimiento desmarcado. Copy: "primeras Mágnum estén listas", NUNCA "Mariana esté en temporada" (trataría a Mariana como producto).

### 1.4 Flujo de re-entrada

Verificar si `cart-context` persiste en `localStorage` — si no, el visitante que vuelve pierde el carrito (→ L8, frontend-developer).

## 2. TABLA MAESTRA DE CLASIFICACIÓN POR SECCIÓN

| # | Sección | Veredicto | Tipo | Capa | Qué NO se debe perder | Qué cambia |
|---|---|---|---|---|---|---|
| 1 | Hero | REORGANIZAR | — | A | Entrada por la cita Playfair italic; grid 55/45; eyebrow; 2 botones | Logo duplicado → slot 380×380 P/T; línea de variedades; hamburguesa móvil (gate #2). Chip de trazabilidad → a Products (gate #3) |
| 2 | StatsStrip | REORGANIZAR | — | Neither | Banda oscura como quiebre de ritmo; count-up; 4 slots | Stat `"+"` roto; labels CA→ES; numéricos craft; peso visual suavizado |
| 3 | Products | REORGANIZAR | — | A | Carousel, grid 1/2/3-col, controles cantidad, parallax/shine | Chips variedad/finca/sensorial; `target=_blank` fuera; filtro reetiquetado por variedad (gate #4); carousel touch-aware |
| 4 | AboutUs | REESCRIBIR | tonal + estructural | **B** | Contenedor 720px; blockquote; atribución "J. Elías, fundador" | Copy 1ª persona/pasado; slot retrato; `target=_blank` fuera |
| 5 | Values | MANTENER | — | A | Grid 6-card, iconos sobrios | Solo gating reduced-motion |
| 6 | CTA | REESCRIBIR | tonal | A | Quiebre oscuro, H2 grande, trust badges, 2 botones | H2 fuera registro-anuncio; cold-chain; variante off-season; `target=_blank` fuera |
| 7 | Contact | REESCRIBIR | tonal | A | Layout 2-col; datos de contacto (untouchables) | Copy success interino; emoji `✅`→SVG |
| 8 | Footer | REORGANIZAR | — | A + 1 línea B | Estructura dark 4-col, socials, crédito Okawa | Logo hot-link→local; links legacy; press-strip; línea "En memoria de Mariana" |
| 9 | Cart | REESCRIBIR | estructural (i18n) | Neither | El sheet completo; `handleCheckout` misma pestaña | i18n de strings hardcoded; `role=dialog` + focus-trap |

**Resumen:** 1 MANTENER · 4 REORGANIZAR · 4 REESCRIBIR. Ningún REESCRIBIR es rediseño de arquitectura.

## 3. WIREFRAMES TEXTUALES POR SECCIÓN

Los wireframes textuales completos (estado ACTUAL → PROPUESTO, comportamiento mobile, conversion notes, aterrizaje de Beat-them) están integrados en el reporte consolidado `phase-2.5-report.md §3`, ya con las 4 decisiones del gate aplicadas. Puntos clave por sección:

- **Hero:** jerarquía vertical = eyebrow → cita `<h1>` → atribución → línea variedades → deco → botones. Chip de trazabilidad NO entra (gate #3). Slot 380×380 P/T en la columna derecha. Hamburguesa móvil (gate #2).
- **StatsStrip:** 4 numéricos craft; suavizar font/hover/count-up; ES limpio.
- **Products:** card gana badge variedad + descriptor + chip finca; filtro por variedad; `target=_blank` fuera.
- **AboutUs:** Capa B — copy 1ª persona/pasado; slot retrato (ilustración o tipografía, NUNCA IA).
- **Values:** sin cambio estructural; solo reduced-motion.
- **CTA:** H2 tonal; cold-chain; variante off-season.
- **Contact:** copy success interino; emoji→SVG.
- **Footer:** logo local; links legacy resueltos; press-strip; línea Capa B.
- **Cart:** i18n; `role=dialog`.

## 4. MAPA DE CAMBIOS PARA FASE 4

Ver tabla consolidada y final en `phase-2.5-report.md §4.4` (3 CRITICAL · 6 HIGH · 8 MED · 8 LOW). El mapa integra los hallazgos de ux-designer y prototype-designer y aplica las 4 decisiones del gate.

## 5. CONTRADICCIONES Y DECISIONES — ESTADO POST-GATE

1. **[M9 — nav móvil]** RESUELTA por gate #2: hamburguesa mínimo. Construir usando `t.nav.menu` (datos ya presentes, hoy sin usar).
2. **[chip Hero]** RESUELTA por gate #3: el chip de trazabilidad sale del Hero y vive solo en Products. El Hero queda Capa-A pura (cita + variedades).
3. **[Beat-them #15 vs scope]** La captura de email off-season vive dentro del contenedor del CTA (no es sección nueva); la página de confirmación double-opt-in SÍ es ruta nueva → entregable de fullstack-developer en Fase 4.5 (coherente con el patrón "success pages = rutas reales guarded" de La Nonna).
4. **[L5 — filtro Products]** RESUELTA por gate #4: reetiquetar a Mágnum/Dream/1525 (funcional + cluster SEO C4).
5. **[L8 — persistencia cart]** Verificación pendiente para frontend-developer.

## 6. VERIFICACIÓN DE RESTRICCIONES

- **Modo AUDIT:** 0 secciones nuevas · 0 reescrituras de plataforma · 1 MANTENER, 4 REORGANIZAR, 4 REESCRIBIR · cada cambio trazado a dolor o Beat-them.
- **Firewall narrativo:** cero expansiones de "J. Elías" · cero identidad de inversor · "en memoria" SOLO en Footer, excluido de title/meta/OG/schema/alt/H1-H3.
- **Tono homenaje:** Capa A/B asignada por sección; AboutUs = único slot B.
- **Dirección B / Hero Path T:** slot 380×380 swappable reflejado; Path P fuera de ruta crítica.
