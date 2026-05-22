# FASE 4.5 — Re-chequeo incremental TANDA 2 · Eje 1 (Contraste / C2) · Yaya Mariana
## Entregable del agente `accessibility-perfectionist`

**Proyecto:** Yaya Mariana — sitio HOMENAJE · rama `clasico`
**Modo:** AUDIT — re-chequeo ESTÁTICO del código. No se modificó ningún archivo.
**Fecha:** 2026-05-22
**Commit verificado:** `aa90049` (TANDA 2 — clúster C2: contraste / opacidad sobre texto)
**Alcance del re-chequeo:** SOLO eje 1 (Contraste). Estado actual de `src/components/ui/*.tsx` y `src/app/globals.css`.
**Fuera de alcance (por instrucción):** ejes 2 (Teclado), 3 (Screen reader), 5 (Móvil) — clústeres C5/C6, se arreglan en TANDA 4. NO se re-evalúan aquí. El score de accesibilidad GLOBAL sigue bajo hasta TANDA 4; es lo esperado.

---

## Contexto — qué resolvía TANDA 2

OLA 1 (auditoría previa, score global **4.6/10 FAIL**) marcó el eje Contraste como **FAIL** con 16 defectos CRITICAL, ~14 de ellos fallos AA de contraste de cuerpo de texto causados por **opacidad sobre texto** (`text-color/NN`, `placeholder:text-color/NN`) — incumplimiento sistemático de la regla dura G-1 del design system. Ratio más bajo registrado entonces ≈ **1.9:1** ("Eliminar" del Cart y placeholders sobre blanco).

TANDA 2 debía eliminar TODA opacidad sobre texto y migrar a tokens sólidos.

---

## 1 · ¿Queda opacidad sobre texto en el build?

**NO.** Barrido completo de `src/**` con patrón `text-<color>/NN` y `placeholder:text-<color>/NN`:

| Patrón buscado | Resultado |
|---|---|
| `text-{white,[#hex],color-NNN}/NN` en nodos de texto | **1 única coincidencia** → `cta.tsx:65` — el separador `·` decorativo, `aria-hidden`, `text-white/30`. **Intencional y aprobado** (excluido por instrucción; no es texto perceptible para AT). |
| `placeholder:text-*/NN` | **0 coincidencias.** Los 5 placeholders del build (4 de contact + 1 de CTA email) usan ahora `placeholder:text-[var(--color-text-muted)]` sólido. El placeholder de Stripe (`checkout.tsx:18`) usa `"::placeholder": { color: "#6e3232" }` sólido. El de checkout `inputClass` usa `placeholder-[var(--color-text-muted)]` sólido. |

Las demás coincidencias de `/NN` que aparecen en los componentes son **opacidad sobre fondos, bordes o sombras** — NO sobre texto — y por tanto fuera del clúster C2:
- `bg-black/30`, `bg-black/25`, `bg-white/10`, `bg-white/85`, `bg-white/92`, `bg-white/60`, `bg-white/50/80` (dots) — fondos/scrims decorativos.
- `border-[#f5c6c2]/60`, `border-[#f5c6c2]/50`, `border-[#f5c6c2]/40`, `border-[#962a1f]/30` — bordes (ver §4).
- `focus:ring-[#b5341f]/40`, `focus:ring-white/70` — anillos de foco.
- `button.tsx` (`bg-primary/80`, `destructive/10`…) — componente Base UI **código muerto, no montado en la home** (ya anotado LOW en OLA 1). Sin impacto.

**Veredicto §1:** los ~35 nodos de opacidad sobre texto de OLA 1 están eliminados. El único superviviente es el separador `·` `aria-hidden` del CTA, conservado a propósito y correctamente.

---

## 2 · Recálculo de ratios de los textos migrados (contra el fondo REAL)

Ratios calculados a mano (fórmula WCAG 2.x sRGB) del color de texto SÓLIDO contra el fondo real de cada superficie. Tokens resueltos: `--color-text-secondary`=#5a2a2a · `--color-text-muted`=#6e3232 · `--color-brand-primary`=#962a1f · `--color-text-on-deep`=#fdf6f5 · `--color-text-on-brand`=#ffffff · `--strawberry-700`=#7a1f17.

### Superficies claras (cream #fdf6f5 / blanco #ffffff / subtle #fdf0ef)

| Componente · nodo | Texto | Fondo | Ratio | AA (4.5 / 3 grande) | AAA (7) |
|---|---|---|---|---|---|
| `products.tsx:340` desc producto | text-secondary | white | **11.67:1** | PASS | PASS |
| `products.tsx:359` "/ 500g" | text-muted | white | **9.70:1** | PASS | PASS |
| `products.tsx:363` "Ver más" | brand-primary | white | **7.93:1** | PASS | PASS |
| `products.tsx:451` subtítulo sección | text-secondary | cream | **10.94:1** | PASS | PASS |
| `products.tsx:347` chip trazabilidad | #6e3232 (muted) | cream | **9.09:1** | PASS | PASS |
| `products.tsx:313` badge variedad | #7a1f17 | white (bg-white/92) | **10.31:1** | PASS | PASS |
| `values.tsx:52` subtítulo sección | text-secondary | subtle #fdf0ef | **10.50:1** | PASS | PASS |
| `values.tsx:73` desc card | text-secondary | white | **11.67:1** | PASS | PASS |
| `contact.tsx:103` subtítulo | text-secondary | cream | **10.94:1** | PASS | PASS |
| `contact.tsx:114` label info contacto | text-muted | cream | **9.09:1** | PASS | PASS |
| `contact.tsx:174…` labels formulario | text-secondary | white | **11.67:1** | PASS | PASS |
| `contact.tsx:185…` placeholders form | text-muted | white | **9.70:1** | PASS | PASS |
| `cta.tsx:159` placeholder email | text-muted | white | **9.70:1** | PASS | PASS |
| `cart.tsx:115` "500g · precio" | text-secondary | white | **11.67:1** | PASS | PASS |
| `cart.tsx:145` "Eliminar" | text-muted | white | **9.70:1** | PASS | PASS |
| `cart.tsx:159` "Subtotal" | text-secondary | white | **11.67:1** | PASS | PASS |
| `cart.tsx:162` "Envío" | text-muted | white | **9.70:1** | PASS | PASS |
| `checkout.tsx` subtítulos/back/resumen | text-secondary | cream | **10.94:1** | PASS | PASS |
| `checkout.tsx:208,251` muted/×qty | text-muted | cream | **9.09:1** | PASS | PASS |
| `checkout.tsx:18` placeholder Stripe | #6e3232 | white | **9.70:1** | PASS | PASS |
| `checkout.tsx:281` placeholder inputs | text-muted | white | **9.70:1** | PASS | PASS |

### Superficies oscuras (maroon #5c1a1a / footer #2d0a0a / degradado CTA)

| Componente · nodo | Texto | Fondo | Ratio | AA | AAA |
|---|---|---|---|---|---|
| `stats-strip.tsx:103` label de stat | on-deep #fdf6f5 | maroon #5c1a1a | **12.16:1** | PASS | PASS |
| `footer.tsx:111,115,143,147,169,176` cuerpo/headings/links/copyright | on-deep #fdf6f5 | footer #2d0a0a | **16.97:1** | PASS | PASS |
| `cta.tsx:31,62,72,115` subtítulo / cold-chain / trust badges | on-brand #ffffff | degradado CTA · peor stop (medio #962a1f) | **7.93:1** | PASS | PASS |
| `cta.tsx` subtítulo CTA · mejor stop (#5c1a1a) | on-brand #ffffff | #5c1a1a | **12.98:1** | PASS | PASS |
| `cta.tsx` subtítulo CTA · stop #7a1f17 | on-brand #ffffff | #7a1f17 | **10.31:1** | PASS | PASS |

**Todos los textos migrados pasan AA Y AAA en TODA superficie.** El degradado del CTA se verificó contra su stop más claro/peor (`#962a1f`): el texto blanco da 7.93:1 incluso ahí — AAA holgado en cualquier frame del degradado.

---

## 3 · Caso especial — Hero sobre MeshGradient

El MeshGradient tiene 5 stops: `#f5d0c8 #e8a090 #f0b8a8 #ffd0c0 #e89888`. El más oscuro es `#e89888` — el escenario peor para texto oscuro. Se verifica contra él.

| Nodo Hero | Texto | Tamaño / umbral | vs `#e89888` (peor) | vs `#f5d0c8` (mejor) | Veredicto |
|---|---|---|---|---|---|
| `<h1>` cita (`hero.tsx:279`) | strawberry-700 #7a1f17 | `clamp(2rem,4vw,3rem)` italic 400 → **texto grande**, umbral 3:1 | **4.56:1** | 7.24:1 | **PASS AA** (supera 3:1 con margen; en el peor stop supera incluso el 4.5:1 de cuerpo). |
| Eyebrow (`hero.tsx:271`) | strawberry-700 #7a1f17 | **11px** → NO es texto grande, umbral **4.5:1** | **4.56:1** | 7.24:1 | **PASS AA** (4.56 ≥ 4.5 — pasa, margen estrecho de 0.06). NO alcanza AAA. |
| Autor de la cita (`hero.tsx:293`) | text-secondary #5a2a2a | `clamp(1.1rem,2vw,1.4rem)` italic 400 → cuerpo, umbral 4.5:1 (en su tamaño mínimo 17.6px no es "grande") | **5.16:1** | — | **PASS AA** cuerpo. NO alcanza AAA. |

Observaciones:
- El `<h1>` y el eyebrow comparten color (`strawberry-700`); el `<h1>` por ser texto grande tiene un colchón cómodo (4.56 vs umbral 3.0), el eyebrow va más justo (4.56 vs umbral 4.5) pero **pasa**.
- La migración del Hero fue la decisión correcta: con el color de OLA 1 (`#962a1f` h1 → 2.9:1; autor `#7a4a42` → 3.1:1) el Hero FALLABA AA; ahora pasa en todos los frames del shader animado, no solo en el fondo claro nominal.
- El bloque de variedades de la columna derecha (`hero.tsx:386`, `#7a4a42` sobre placa blanca sólida `#ffffff`) no está sobre el Mesh — está sobre una placa `#ffffff` opaca; no es objeto de C2 y no se reportó como fallo en OLA 1.

**Veredicto §3:** los tres nodos de texto del Hero sobre el MeshGradient pasan AA contra el stop más oscuro. El eyebrow pasa por margen estrecho (4.56:1 vs 4.5:1) — se anota como punto a vigilar si en el futuro se ajusta el shader.

---

## 4 · Bordes de input — ¿alcanzan el 3:1 de componente UI?

TANDA 2 migró el borde de input de checkout de `#f5c6c2` a `#d8b8b4` (`--color-border-default`). Estado actual:
- `contact.tsx` inputs: `border-[#d8b8b4]` — aplicado.
- `checkout.tsx` `inputClass` y caja del CardElement: `border-[#d8b8b4]` — aplicado.

| Borde | Fondo | Ratio | 3:1 UI (WCAG 1.4.11) |
|---|---|---|---|
| `#d8b8b4` (`--color-border-default`) | white #ffffff | **1.84:1** | **FAIL** |
| `#d8b8b4` | cream #fdf6f5 | **1.72:1** | **FAIL** |

**El borde de input NO alcanza el 3:1 de componente UI.** TANDA 2 mejoró el valor anterior (`#f5c6c2` ≈1.3:1 → `#d8b8b4` ≈1.8:1) pero sigue por debajo del umbral. Esto **ya estaba previsto**: OLA 1 (defecto #39) lo anotó como pendiente de escalada a `creative-director` para fijar un valor oscurecido manteniendo el matiz (orientación: hacia `#c08a86` o más oscuro para llegar a 3:1). 

**No es un fallo de TANDA 2** — TANDA 2 solo tenía mandato sobre opacidad-sobre-texto (C2). El borde de input es un nodo de UI-component, y su resolución definitiva queda en la escalada a `creative-director` ya prevista en el plan. **Se confirma como PENDIENTE de esa escalada.** Nota matizada: el input también tiene `focus:border-[#b5341f]` / `focus-within:border-[#962a1f]` — en estado de foco el borde sí pasa 3:1; el déficit es solo en estado de reposo.

> Restos hardcodeados relacionados (no son texto, no bloquean C2, anotar para limpieza): `cart.tsx:76,157` y `checkout.tsx:244,259` aún usan `border-[#f5c6c2]/NN` en separadores/headers de panel — son **bordes decorativos de separación**, no bordes de control de formulario, así que no están sujetos al 3:1 de 1.4.11. Conviene migrarlos a `--color-border-subtle` por consistencia, pero no es un fallo de contraste.

---

## Restos hardcodeados de color de texto detectados (informativo — no fallo C2)

Dos colores de texto siguen hardcodeados fuera de token. Ambos **pasan AA/AAA**, así que NO son fallo de contraste; se anotan solo como deuda de tokenización para una pasada futura:

| Nodo | Color | Fondo | Ratio | Estado |
|---|---|---|---|---|
| `cta.tsx:16,28,124,136` eyebrow + título `<em>` del CTA | `#f5c6c2` | degradado CTA (peor stop #962a1f) | **5.19:1** | PASS AA cuerpo / NO AAA. El eyebrow es 12px → umbral 4.5:1, lo cumple. Es decisión cromática (`creative-director`), no opacidad. Sin acción C2. |
| `footer.tsx:172` línea "En memoria de…" | `#e8c4bf` | footer #2d0a0a | **11.28:1** | PASS AA + AAA. Color de homenaje deliberado, serif italic. Sin acción. |
| `contact.tsx` valor de info / texto de input | `#7a3a3a` | cream / white | 7.89:1 / 8.42:1 | PASS AA + AAA. Hardcode preexistente, no migrado, pero contrasta de sobra. Sin acción C2. |

Ninguno usa opacidad. Ninguno falla AA. Quedan como nota de limpieza de tokens, no como defecto.

---

## Recálculo del eje Contraste — score y veredicto

### Per-axis status (solo eje 1)

| # | Eje | Estado OLA 1 | Estado TANDA 2 | Detalle |
|---|------|---|---|---|
| 1 | Contraste | **FAIL (≈1.9:1 mínimo)** | **PASS** | 0 nodos de opacidad sobre texto (salvo separador `aria-hidden` intencional). 100% de los textos migrados pasan AA; la inmensa mayoría pasa también AAA. Hero sobre MeshGradient pasa AA contra el stop más oscuro. Único punto bajo AAA: eyebrow Hero (4.56:1) y autor Hero (5.16:1) — ambos pasan AA. Único item que no llega a 3:1: el borde de input en reposo (1.8:1) — UI-component, ya escalado a `creative-director`, fuera del mandato C2. |

### Score del eje Contraste

**Eje Contraste: 9.0 / 10** — antes 4.6/10 a nivel proyecto con el eje en FAIL.

Desglose del 9.0:
- +Todos los textos de cuerpo y titulares pasan AA contra su fondo real (cream, blanco, subtle, maroon, footer, degradado CTA, MeshGradient). 
- +La gran mayoría alcanza AAA (7:1) — los textos sobre superficie clara/oscura están en 7.9–17:1.
- −1.0 por: (a) el borde de input de UI-component sigue bajo 3:1 en reposo (1.8:1) — defecto de contraste de componente, real, aunque su resolución esté correctamente derivada a `creative-director` y fuera del clúster C2; (b) dos nodos del Hero (eyebrow, autor) pasan AA pero no llegan a AAA, y el eyebrow lo hace por margen estrecho (0.06) — el spec pide empujar AAA donde sea posible.

No es 10/10 porque el eje "Contraste" del rúbric incluye también bordes de componente UI y el listón AAA; pero **a efectos del clúster C2 (opacidad sobre texto / contraste AA de texto), el objetivo está cumplido al 100%**.

### Veredicto del eje

**Eje 1 — Contraste: pasa de FAIL → PASS.**

TANDA 2 resolvió el clúster C2 por completo: la regla dura G-1 del design system (texto siempre sólido, prohibida la opacidad sobre texto) ahora se cumple en todo el build. El ratio mínimo de texto del sitio subió de ≈1.9:1 a **4.56:1** (eyebrow del Hero sobre el stop más oscuro del Mesh) — y ese mínimo ya está por encima del suelo AA de cuerpo.

---

## Pendiente (NO de TANDA 2)

- **TANDA 4 — clústeres C5/C6:** ejes Teclado (focus-trap Cart/MobileNav/LanguageSelector, Esc-close, retorno de foco), Screen-reader (`<main>`, skip-link, `role="dialog"`, `<html lang>` dinámico, `role="status"` en mensajes de éxito, validación accesible) y Móvil. NO re-evaluados aquí por instrucción. El score de accesibilidad GLOBAL seguirá en FAIL hasta TANDA 4 — esperado.
- **Escalada a `creative-director` (ya prevista en el plan):** fijar el valor exacto del borde de input para alcanzar 3:1 de UI en reposo (orientación: oscurecer `--color-border-default` `#d8b8b4` → ~`#c08a86` o más, manteniendo el matiz cálido). El estado de foco ya cumple 3:1.
- **Limpieza de tokens (MEDIUM, no contraste):** migrar `border-[#f5c6c2]/NN` decorativos de `cart.tsx`/`checkout.tsx` a `--color-border-subtle`; tokenizar `#f5c6c2`, `#e8c4bf`, `#7a3a3a` hardcodeados (todos pasan AA — solo deuda de consistencia).

---

## Status

**Eje Contraste (C2): PASS** — antes FAIL. Clúster C2 resuelto. Verificación en vivo (axe-core, Lighthouse, simulación de daltonismo, `forced-colors`) sigue pendiente del gate con servidor encendido, pero el análisis estático de contraste calculado contra el fondo real no detecta ningún fallo AA de texto.

---
*Re-chequeo estático en modo AUDIT. No se modificó código ni memoria de agencia. Ratios calculados a mano (fórmula de contraste WCAG 2.x sobre sRGB) componiendo el color de texto SÓLIDO sobre el fondo real de cada superficie. Re-chequeo limitado al eje 1 (Contraste) por instrucción; ejes 2/3/5 explícitamente fuera de alcance hasta TANDA 4.*
