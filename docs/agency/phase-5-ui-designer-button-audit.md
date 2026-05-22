# FASE 5 — Auditoría EXHAUSTIVA de Botones · Yaya Mariana
## Entregable del agente `ui-designer` · Fase 5 (Optimización)

**Proyecto:** Yaya Mariana — sitio HOMENAJE, DTC de fresas premium (Tarragona) · rama `clasico` · modo **AUDIT**
**Stack:** Next.js 16 · React 19 · Tailwind v4 · Framer Motion · single-page + `/checkout`
**Fecha:** 2026-05-22 · **Encargo central de Nil:** «Los botones están mal en algunos sitios — revisa estados, padding, alineación, jerarquía.»

> Modo AUDIT: se detecta y se propone, NO se modifica código. Dev server apagado — auditoría estática contra el código real de `src/components/ui/*.tsx` + `src/app/globals.css`.

---

## 0. Resumen ejecutivo

Tras la Fase 4.5 los botones ya cumplen lo **visible** que Nil ratificó en gate: radio 8px, sin gradientes, color plano de marca, sin `scale` en hover. Pero Nil reporta que "siguen mal en sitios", y la auditoría confirma **por qué**: las correcciones de Fase 4.5 fueron de **token y color**, no de **sistema de componente**. Cada botón sigue siendo un nodo `<a>`/`<button>` artesanal con clases inline distintas. El resultado es un sitio con **~33 elementos accionables y ninguna primitiva de botón compartida** — el `button.tsx` (ahora base-ui, no shadcn) existe pero **ningún componente de UI lo usa**.

Los 3 problemas raíz, en orden de gravedad:

1. **NO HAY PRIMITIVA. Cada botón se reinventa.** 8 variantes de padding distintas para el mismo rol "primario" (`13px 28px`, `10px 20px`, `11px 20px`, `py-3`, `py-4`, `px-8 py-3`, `px-6 py-3`, `px-7 py-3`). El radio nominal es 8px en todos, pero unos lo escriben `borderRadius: 8`, otros `rounded-md`, otros `rounded-lg` — y `rounded-md` en Tailwind v4 **no es 8px**, es 6px. El sitio NO tiene los botones al radio que el gate ratificó.
2. **ESTADOS INCOMPLETOS E INCOHERENTES.** El estado `active` (pressed) que la spec §3.1 exige (`translateY(1px)`) **no existe en ningún botón inline** — solo en el `button.tsx` muerto. Hay **hovers muertos** (botón secundario del Hero usa `→` literal con `transition` que no anima nada; el carousel `transition-all` sin transform; el "ver más" mueve una flecha que la spec §3.1 prohíbe). Focus depende 100% del `:focus-visible` global de `globals.css` — coherente, pero ningún botón tiene `disabled` salvo el de checkout.
3. **JERARQUÍA ROTA EN CTA Y EN CARD.** En la sección CTA el botón "primario" (Comprar) es **blanco sobre fondo rojo** y el "secundario" (Conocer historia) es **outline blanco** — visualmente **compiten**: dos botones de peso casi idéntico. En la Product Card el primario "Añadir" (`bg` rojo, `w-full`) y el terciario "Ver más" (link rojo + flecha) están **en el mismo bloque**, y el "Ver más" lleva una flecha animada que lo hace leer como un secundario fuerte, no como un link terciario.

**Score de coherencia de botones del sitio: 4.5 / 10.** La capa de color/token está sana (Fase 4.5 cumplió). La capa de **sistema** no existe: padding, radio real, estados y jerarquía están resueltos botón a botón, a mano, con resultados divergentes. Es exactamente lo que Nil ve: "mal en algunos sitios".

---

## 1. Inventario completo de elementos accionables

33 elementos accionables, 9 secciones + `/checkout` + Cart. Clasificados por rol semántico.

| # | Botón / CTA | Archivo:línea | Rol | Elemento |
|---|---|---|---|---|
| B1 | Logo (enlace a `/`) | hero.tsx:225 | navegación | `<a>` |
| B2 | Nav-link "Productos/Sobre/Contacto" ×3 | hero.tsx:247 | nav-link | `<motion.a>` |
| B3 | Trigger selector de idioma | hero.tsx:68 | icon+text | `<button>` |
| B4 | Opción de idioma ES/CA/EN ×3 | hero.tsx:102 | menu-item | `<button>` |
| B5 | CTA nav "Ver tienda" (desktop) | hero.tsx:275 | **primario** | `<motion.a>` |
| B6 | Hamburguesa móvil | hero.tsx:142 | icon-only | `<button>` |
| B7 | Enlace de nav móvil ×3 | hero.tsx:170 | nav-link | `<a>` |
| B8 | CTA "Ver tienda" en panel móvil | hero.tsx:181 | **primario** | `<a>` |
| B9 | Hero CTA "Ver fresas" (btn1) | hero.tsx:374 | **primario** | `<motion.a>` |
| B10 | Hero CTA "Nuestra historia" (btn2) | hero.tsx:384 | secundario/ghost | `<a>` |
| B11 | Filtro de variedad ×4 (all/Mágnum/Dream/1525) | products.tsx:484 | toggle/segmented | `<button>` |
| B12 | Flecha carousel anterior | products.tsx:164 | icon-only | `<button>` |
| B13 | Flecha carousel siguiente | products.tsx:185 | icon-only | `<button>` |
| B14 | Dot del carousel ×4 | products.tsx:212 | icon-only/indicador | `<button>` |
| B15 | "Ver más" (Product Card) ×3 | products.tsx:382 | **terciario/link** | `<a>` |
| B16 | "Añadir al carrito" (Product Card) ×3 | products.tsx:392 | **primario** | `<button>` |
| B17 | AboutUs CTA "Ver tienda" | about-us.tsx:61 | **primario** | `<motion.a>` |
| B18 | AboutUs enlace "Contactar" | about-us.tsx:72 | secundario/ghost | `<motion.a>` |
| B19 | CTA in-season "Comprar ahora" | cta.tsx:46 | **primario** (invertido) | `<a>` |
| B20 | CTA in-season "Conocer historia" | cta.tsx:53 | secundario/outline | `<a>` |
| B21 | CTA off-season "Avísame" (notify) | cta.tsx:169 | **primario** (invertido) | `<button>` |
| B22 | Contact "Enviar" (submit) | contact.tsx:315 | **primario** | `<button>` |
| B23 | Contact "Enviar otro mensaje" | contact.tsx:206 | terciario/link | `<button>` |
| B24 | Footer social ×5 (FB/IG/X/Pin/LI) | footer.tsx:122 | icon-only | `<a>` |
| B25 | Footer nav-link ×12 (3 columnas) | footer.tsx:153 | nav-link | `<motion.a>` |
| B26 | Footer "Okawa" (crédito) | footer.tsx:182 | link inline | `<a>` |
| B27 | Cart FAB (abrir cesta) | cart.tsx:37 | icon-only / FAB | `<motion.button>` |
| B28 | Cart cerrar (×) | cart.tsx:106 | icon-only | `<button>` |
| B29 | Cart cantidad − | cart.tsx:147 | icon-only | `<button>` |
| B30 | Cart cantidad + | cart.tsx:156 | icon-only | `<button>` |
| B31 | Cart "Eliminar" | cart.tsx:170 | terciario/link | `<button>` |
| B32 | Cart "Finalizar compra" | cart.tsx:196 | **primario** | `<button>` |
| B33 | Checkout "Volver" | checkout.tsx:154 | terciario/link | `<button>` |
| B34 | Checkout "Pagar X€" (submit) | checkout.tsx:297 | **primario** | `<button>` |
| B35 | Checkout "Volver al inicio" (éxito) | checkout.tsx:139 | **primario** | `<button>` |
| B36 | `button.tsx` (primitiva base-ui) | button.tsx:43 | — | NO USADA por ningún componente |

**Total auditado: 35 patrones de botón** (33 visibles en runtime + el FAB B27 + la primitiva muerta B36). Multiplicidad real en pantalla ≈ 33 botones renderizados.

**Hallazgo de inventario:** el rol "primario" se materializa **9 veces** (B5, B8, B9, B16, B17, B19, B21, B22, B32, B34, B35 — 11 instancias de código) y **ninguna de las 11 comparte clase**. No hay una sola fuente de verdad para "botón primario".

---

## 2. MAPA DE DEFECTOS DE BOTONES

Severidad: **CRÍTICO** = el usuario lo ve mal o no funciona · **ALTO** = incoherencia visible que rompe el sistema · **MEDIO** = inconsistencia perceptible al comparar · **BAJO** = refinamiento.

| # | Botón / archivo:línea | Categoría | Problema | Sev. | Fix concreto |
|---|---|---|---|---|---|
| D1 | B16 Añadir products.tsx:397 · B22 contact.tsx:318 · B32 cart.tsx:201 · B34 checkout.tsx:301 · B35 checkout.tsx:141 · B19 cta.tsx:49 · B21 cta.tsx:172 | consistencia | `rounded-md` en Tailwind v4 = `--radius-md`. El bridge mapea `--radius-md` a `--primitive-radius-md` = **0.5rem = 8px** ✓ — PERO el Hero/Nav usan `borderRadius: 8` inline. El radio coincide por casualidad, no por sistema: si alguien recalibra `--primitive-radius-md`, 7 botones cambian y 4 no. | ALTO | Todos los botones deben tomar el radio del **mismo token** (`var(--radius-button)`), nunca `rounded-md` ni `borderRadius: 8` literal. Idealmente vía primitiva. |
| D2 | B5 hero.tsx:279 · B8 hero.tsx:186 · B9 hero.tsx:376 · B16 products.tsx:397 · B17 about-us.tsx:64 · B19 cta.tsx:49 · B21 cta.tsx:172 · B22 contact.tsx:318 · B32 cart.tsx:201 · B34 checkout.tsx:301 | padding | **8 paddings distintos para el rol primario**: `10px 20px` (B5), `11px 20px` (B8), `13px 28px` (B9), `py-3`=12px vert + `w-full` (B16/B22/B32), `px-6 py-3` (B17), `px-8 py-3` (B19), `px-7 py-3` (B21), `py-4`=16px (B34). No hay tamaño de botón definido. | **CRÍTICO** | Definir 2 tamaños: `md` (default, `padding: 13px 28px`, alto ~46px) y `sm` (nav/compacto, `11px 20px`). Todos los primarios a uno de los dos. `w-full` es ortogonal al tamaño — el padding vertical debe ser el mismo (`13px`) aunque el ancho sea 100%. |
| D3 | B9 Hero "Ver fresas" hero.tsx:374-383 · B5 nav hero.tsx:275 | consistencia | Dos botones primarios en la **misma pantalla** (nav + hero) con padding distinto (`10/20` vs `13/28`) y `fontSize` distinto vía clase (`text-sm`=13px vs `fontSize:14`). Botones hermanos del mismo rol no se ven iguales. | ALTO | El CTA de nav puede ser `size=sm`; el del hero `size=md`. Pero ambos del **mismo sistema** y con el mismo `font-size` resuelto del token. Hoy uno es 13px y otro 14px sin razón. |
| D4 | Todos los primarios inline (B5, B8, B9, B16, B17, B19, B21, B22, B32, B34, B35) | estado | **Falta el estado `active`/pressed.** La ui-spec §3.1 exige `active: translateY(1px)` con `--dur-instant`. Ningún botón inline lo implementa. Solo `button.tsx:7` (muerto) tiene `active:...translate-y-px`. El click no da feedback táctil. | ALTO | Añadir `active:translate-y-px` (o `whileTap={{ y:1 }}` en los `motion.a`) a todos los botones de acción. Es el feedback de "se siente, no se mira" que la Dirección B pide. |
| D5 | B10 Hero "Nuestra historia" hero.tsx:384 | estado / consistencia | Botón secundario incoherente con el secundario de AboutUs (B18). B10 usa `→` **carácter literal** en el texto + `transition-colors` que solo cambia color; **no tiene subrayado** `scaleX`. B18 (mismo rol) **sí** tiene el subrayado animado y **no** tiene flecha. El mismo rol "ghost" se ve de dos formas. La spec §3.2 manda subrayado, sin flecha. | ALTO | Unificar el ghost a UN patrón: texto rojo + subrayado `scaleX:0→1` desde la izquierda, **sin flecha**, sin cambio de color en hover (spec §3.2/§3.12). Quitar el `→` literal de B10. |
| D6 | B19 "Comprar" cta.tsx:46 + B20 "Conocer historia" cta.tsx:53 | jerarquía | Los dos botones del CTA **compiten**: B19 = blanco sólido sobre rojo (`shadow-lg`), B20 = outline blanco `border-2`. Sobre fondo rojo oscuro un outline blanco de 2px tiene casi tanto peso visual como el sólido. No hay un primario que domine — leen como dos opciones iguales. | **CRÍTICO** | Degradar B20 a ghost real: sin borde, solo texto blanco + subrayado al hover (como el ghost de Hero/AboutUs corregido). El sólido blanco queda como único foco. Mantiene la regla "un CTA dominante por pantalla" del brief. |
| D7 | B16 "Añadir" + B15 "Ver más" products.tsx:382-413 | jerarquía | Dentro de la Product Card conviven el primario (B16, `w-full`, rojo sólido) y el terciario "Ver más" (B15, link rojo). Pero B15 lleva una **flecha que se desplaza en hover** (`group-hover/btn:translate-x-1`), lo que le da peso de secundario fuerte. Resultado: 3 niveles mal escalonados — el terciario grita. | ALTO | "Ver más" debe ser link terciario discreto: quitar la flecha animada (o dejar flecha estática sin `translate-x`). La spec §3.1 prohíbe la flecha deslizante. El único elemento con peso en la card es "Añadir". |
| D8 | B12/B13 flechas carousel products.tsx:171,192 | estado | `transition-all duration-200` sobre un botón que en hover solo cambia `bg-white/85 → bg-white`. `transition-all` además anima la aparición `opacity/translate-x` de `controlsVisible` — es un **hover medio-muerto**: el `transition-all` es genérico y arrastra propiedades no intencionadas. | MEDIO | Cambiar a `transition-[background-color,opacity,transform]` explícito o `transition-colors`. La aparición controls-visible debe tener su propia transición. Evitar `transition-all`. |
| D9 | B15 "Ver más" products.tsx:382 · B33 "Volver" checkout.tsx:154 · B23 "Enviar otro" contact.tsx:206 · B31 "Eliminar" cart.tsx:170 | consistencia | 4 botones terciarios/link, 4 tratamientos: B15 con flecha + `text-xs` 12px; B33 con icono chevron + `text-sm`; B23 sin icono `text-sm`; B31 sin icono `text-[0.65rem]` ≈ 10.4px. Tamaño de fuente entre 10.4px y 14px para el mismo rol. | ALTO | Definir UN estilo de "link de acción terciario": `text-sm` (13px), `font-semibold`, color `--color-brand-primary`, hover → `--color-brand-pressed`, sin icono o icono estático opcional. B31 a 10.4px es ilegible como acción. |
| D10 | B31 "Eliminar" cart.tsx:170 | jerarquía / alineación | "Eliminar" usa `text-[0.65rem]` (10.4px) y color `--color-text-muted`. Es una **acción destructiva** disfrazada de metadato. Además los offsets negativos (`-my-2.5 -mr-1 pl-3`) hacen su hit-area de 44px invisible y descuadran la alineación respecto al precio que tiene encima. | ALTO | Subir a `text-xs` (12px) mínimo, color `--color-text-secondary` en reposo y `--color-error` o `--color-brand-primary` en hover. La acción de borrado debe ser legible. Revisar que el hit-area de 44px no rompa la columna derecha. |
| D11 | B5/B9/B17 (`motion.a` primarios) hero.tsx:275,374 · about-us.tsx:61 | estado | El hover se hace con `variants` de Framer Motion (`rest`/`hover` sobre `backgroundColor`). Funciona, pero **no hay `:hover` CSS de respaldo** — si el JS de Motion falla o tarda, el botón no tiene hover. Y el `whileHover` de Motion **no cubre el foco por teclado**: un usuario que tabula al botón y pulsa Enter no ve el cambio de `background`. | MEDIO | Mover el hover a CSS (`hover:bg-[var(--color-brand-pressed)]` como ya hacen B16/B22/B32/B34). El hover de color no necesita Motion. Coherencia: 4 primarios usan CSS, 3 usan Motion variants. |
| D12 | B16 "Añadir al carrito" products.tsx:392-413 | estado / alineación | Al añadir, el botón cambia a estado `added` (verde + check + texto "Añadido"). El texto cambia de longitud ("Añadir al carrito" → "Añadido") **sin ancho fijo** — micro layout-shift. Además el `transition-colors` no cubre el swap rojo→verde de forma anunciada. La spec §3.1 exige ancho fijo en cambios de label. | MEDIO | Fijar `min-height` y considerar `min-width`/ancho estable; el `w-full` ya estabiliza el ancho aquí, así que el riesgo real es vertical: garantizar que el contenido `added` (con icono) no cambie la altura. Verificar línea de base. |
| D13 | B11 filtros de variedad products.tsx:484-498 | estado | El filtro inactivo usa `border-[var(--color-brand-primary)]/30` — **opacidad sobre el borde** (no sobre texto, así que no viola G-1), pero el borde queda a ~2.4:1 sobre cream, por debajo del 3:1 de UI. El filtro activo tiene `shadow-sm`, el inactivo no — coherente. Falta estado `active`/pressed. `transition-all` genérico otra vez. | MEDIO | Borde inactivo a un token sólido que pase 3:1 (p. ej. `--color-border-default` `#ac807b` ya calibrado en globals.css). Cambiar `transition-all` por `transition-colors`. |
| D14 | B3 selector idioma hero.tsx:68 · B6 hamburguesa hero.tsx:142 | alineación / consistencia | B3 tiene `min-h-[44px]` pero `px-1` (4px) — el área de toque vertical es correcta, la horizontal queda en ~30px. B6 es `w-11 h-11` (44×44 perfecto). Dos icon-only del **mismo nav** con criterio de hit-area distinto. El `-mr-1.5` de B6 y el `px-1` de B3 los descuadran ópticamente respecto al borde derecho. | MEDIO | Unificar icon-only del nav a caja `44×44` (`w-11 h-11`), centrado, con offset negativo idéntico para alinear el contenido visible al borde de la barra. |
| D15 | B27 Cart FAB cart.tsx:37 | estado | El FAB solo anima `boxShadow` en `whileHover`. **No tiene estado `active`** ni focus visible propio más allá del global. Para un control flotante persistente, el feedback de pulsación importa. Además `shadow-xl` es clase Tailwind, pero `whileHover` usa `var(--shadow-modal)` — mezcla sistema de sombras Tailwind con tokens. | MEDIO | Añadir `whileTap`. Unificar la sombra: reposo y hover deben venir del mismo sistema (ambos tokens `--shadow-*`, no `shadow-xl` Tailwind + token). |
| D16 | B29/B30 ± cantidad cart.tsx:147-163 | alineación | El `−` (U+2212) y el `+` están dentro de un `<span>` de 32px con `text-sm leading-none`. El menos matemático y el más no tienen el mismo ancho óptico ni la misma altura-x; centrados con `items-center justify-center` pero el `−` queda ópticamente alto. Botones hermanos que no se ven idénticos. | BAJO | Usar SVG para ambos signos (como las flechas del carousel) o forzar `line-height`/`translateY` para igualar el centrado óptico. Mismo glifo-sistema para `+` y `−`. |
| D17 | B19/B21 CTA invertidos cta.tsx:46,169 | consistencia | B19 "Comprar" es `px-8 py-3`; B21 "Avísame" es `px-7 py-3`. Ambos son el primario invertido (blanco sobre rojo) del **mismo bloque CTA** (uno in-season, otro off-season, nunca a la vez) — pero divergen 4px en el padding horizontal sin razón. | MEDIO | Igualar a un solo padding. Son el mismo botón en dos estaciones; deben ser idénticos. |
| D18 | B21 "Avísame" cta.tsx:169-176 | estado | B21 usa `hover:shadow-xl transition-shadow` — el ÚNICO botón del sitio cuyo hover es un **cambio de sombra**. Todos los demás primarios cambian `background-color`. Incoherente, y un crecimiento de sombra lee ligeramente "anuncio" para la Dirección B. | ALTO | Alinear el hover de B21 al patrón del sitio: cambio de superficie (p. ej. `hover:bg-[var(--color-bg-subtle)]` como B19) en lugar de `shadow-xl`. |
| D19 | B19 "Comprar" cta.tsx:46 vs B16/B32 primarios rojos | jerarquía / consistencia | B19 es un primario **invertido** (blanco sobre rojo) por estar sobre banda oscura — decisión correcta. Pero NO está documentado como variante: es un "primario" que no comparte ni color ni los `hover` con los otros 8 primarios. Sin variante nombrada, el próximo dev no sabe si es intencional. | MEDIO | Documentar formalmente la variante `primary-inverse` (para superficies oscuras): bg `--color-bg-surface`, texto `--color-brand-primary`, hover `--color-bg-subtle`. Es legítima — pero debe ser una variante del sistema, no un one-off. |
| D20 | B2 nav-link hero.tsx:247 vs B25 footer nav-link footer.tsx:153 | consistencia | Ambos son "nav-link". B2 (header): subrayado `scaleX` desde la izquierda, **sin** desplazamiento, sin cambio de color (corregido en 4.5 según §3.12). B25 (footer): `whileHover={{ x:4, color:... }}` — **se desplaza 4px y cambia de color**, exactamente lo que §3.12 eliminó del header. El mismo rol, dos motion opuestos. | ALTO | Aplicar a B25 la misma corrección que recibió B2: quitar `x:4`. El desplazamiento lateral en hover es el "motion de anuncio" que la Dirección B y la memoria del rol prohíben. El cambio de color a `brand-primary` puede conservarse en footer (es link sobre fondo oscuro) pero el `x:4` no. |
| D21 | B23 "Enviar otro mensaje" contact.tsx:206 | estado / jerarquía | Es la única acción tras el éxito del formulario, pero está estilada como link terciario minúsculo (`text-sm`, sin fondo, sin borde). Tras enviar, esa es LA acción — su jerarquía es demasiado baja para su importancia en ese estado. | MEDIO | Subir a botón secundario/ghost con más presencia (borde fino o peso), o al menos alinear su tratamiento con el ghost de Hero/AboutUs. No debe leer como un footnote. |
| D22 | B33 "Volver" checkout.tsx:154 | alineación | El icono chevron (`w-4 h-4`) y el texto "Volver" se alinean con `gap-1.5` e `items-center`. El chevron tiene `strokeWidth=2` y el viewBox 16; el texto es `text-sm`. El icono queda ópticamente algo bajo respecto a la altura-x del texto. Menor, pero comparado con B12/B13 (que centran bien) se nota. | BAJO | Verificar centrado óptico del icono+texto; un `translateY(-0.5px)` en el SVG o `items-baseline` ajustado. |
| D23 | B24 social footer footer.tsx:122 | estado | Los 5 iconos sociales son `w-8 h-8` (32×32) — **por debajo del tap target de 44px** que el resto del sitio respeta (carousel, ±, cerrar Cart, hamburguesa todos a 44). Inconsistencia de hit-area en el mismo sitio. Hover solo cambia `bg`. | MEDIO | Llevar el hit-area a 44×44 (el círculo visible puede seguir siendo 32px dentro de una caja de 44, patrón ya usado en B14 dots y B29/B30 ±). |
| D24 | B36 `button.tsx` button.tsx (todo el archivo) | consistencia / deuda | La primitiva de botón (ahora `@base-ui/react`, antes shadcn) define variantes, tamaños, estados `active`, `disabled`, `focus-visible`, `aria-invalid` — TODO lo que falta en los botones inline. Pero **ningún componente de UI la importa**. Es código muerto que además contradice el sistema: usa `rounded-lg`, `h-8`/`h-9` (32/36px, por debajo de 44px), variant `default` con `hover:bg-primary/80` (opacidad). | ALTO | Decisión de director: o se **adopta** `button.tsx` como la primitiva única (recalibrando sus tamaños a 44px+ y su radio al token), o se **elimina**. Hoy es deuda: existe, no se usa, y diverge del sistema. La adopción resolvería D1-D5, D11, D17 de raíz. |
| D25 | B1 logo hero.tsx:225 | estado | El logo enlace a `/` no tiene ningún estado hover/focus propio más allá del `:focus-visible` global. Aceptable para un logo, pero no hay indicación de que sea clicable. | BAJO | Opcional: un `hover:opacity-90` muy leve, o dejarlo (un logo-home es convención reconocible). No bloqueante. |
| D26 | B14 dots carousel products.tsx:212 | estado | El dot activo es `w-4 bg-white`, el inactivo `w-1.5 bg-white/50` con `group-hover/dot:bg-white/80`. El hover sube la opacidad del dot — pero el dot vive sobre imágenes de fresa de luminosidad variable; `white/50` puede no verse sobre una foto clara. Estado de foco: hereda el global (ok). | BAJO | Considerar un fondo/sombra sutil para el track de dots para garantizar contraste del dot sobre cualquier foto. Menor. |
| D27 | B7 enlaces nav móvil hero.tsx:170 | estado | Los 3 enlaces del panel móvil (`min-h-[44px]`, `fontSize:15`) **no tienen hover ni active visible** — en móvil el hover es discutible, pero el `active`/`:active` (feedback al tocar) sí importa y no está. | BAJO | Añadir un `active:bg-[var(--color-bg-subtle)]` o cambio de color al pulsar, para feedback táctil en el panel. |
| D28 | B5 desktop CTA + B8 panel-móvil CTA hero.tsx:275,181 | consistencia | Son el MISMO botón ("Ver tienda") en dos breakpoints. B5: `padding 10px 20px`, `fontSize 14`. B8: `padding 11px 20px`, `minHeight 44`, `fontSize 14`. El padding vertical difiere (10 vs 11px) y solo B8 garantiza 44px. El mismo CTA no es idéntico entre desktop y móvil. | MEDIO | Igualar: ambos al mismo padding y ambos con `min-height:44px` (el desktop también debería cumplir el tap target). |

**Recuento de defectos: 28 hallazgos.**
- **CRÍTICO: 2** (D2 padding del primario sin sistema · D6 jerarquía rota en CTA)
- **ALTO: 11** (D1, D3, D4, D5, D7, D9, D10, D18, D20, D24, y el agregado de inventario)
- **MEDIO: 10** (D8, D11, D12, D13, D14, D15, D17, D19, D21, D23, D28)
- **BAJO: 5** (D16, D22, D25, D26, D27)

(El total de filas es 28; algunas filas agrupan varias instancias del mismo defecto.)

---

## 3. Auditoría por estado — ¿están todos diseñados?

| Estado | Cobertura actual | Veredicto |
|---|---|---|
| **Default** | Definido en los 33 botones. Color/token sano tras Fase 4.5. | OK — pero padding/radio divergentes (§2 D1-D3). |
| **Hover** | Presente en casi todos. PERO: 3 patrones distintos (Motion variants, `hover:bg-*` CSS, `hover:shadow-*`). Hovers cuestionables: B21 sombra, B25 desplazamiento, B15 flecha. | INCOHERENTE — D11, D18, D20, D5, D7. |
| **Focus-visible** | Coherente y bueno: el `:focus-visible` global de `globals.css:292` cubre TODO elemento focusable (outline 2px marca + offset 2px). | OK — único estado verdaderamente sistémico. |
| **Active (pressed)** | **AUSENTE en los 33 botones inline.** Solo existe en `button.tsx` muerto. La spec §3.1 lo exige (`translateY(1px)`). | FALLO SISTÉMICO — D4. El click no da feedback. |
| **Disabled** | Solo B34 (checkout "Pagar", `disabled:opacity-60`). B22 (Contact submit), B21, etc. no tienen estado disabled aunque podrían necesitarlo. | INCOMPLETO — aceptable para botones sin estado disabled real; el patrón debe estandarizarse para cuando se conecte backend. |
| **Loading** | Solo B34 (spinner + "Procesando..."). B22 Contact no lo tiene (no hay backend aún). | OK para el estado actual del proyecto. |

**Conclusión de estados:** el sitio tiene 1 estado sistémico (focus), 1 estado roto/ausente (active), y el resto resuelto botón a botón con divergencias. El `active` ausente es lo que más contradice la Dirección B: el motion "se siente, no se mira" necesita exactamente ese micro-feedback de 120ms.

---

## 4. Diagnóstico de jerarquía

El sitio tiene **4 roles** de botón pero solo 1 está bien diferenciado:

- **Primario** (acción comercial): bien identificable cuando es rojo sólido sobre cream (B9, B16, B17, B22, B32, B34) — domina correctamente. **Roto** cuando es invertido sobre banda oscura (B19/B21) por convivir con un secundario de peso casi igual (D6).
- **Secundario/Ghost** (B10, B18, B20): tres tratamientos distintos — texto+flecha (B10), texto+subrayado (B18), outline `border-2` (B20). No hay UN secundario. El de CTA (B20) pesa demasiado y compite con el primario.
- **Terciario/Link** (B15, B23, B31, B33): cuatro tamaños de fuente (10.4–14px), con/sin icono, con/sin flecha animada. "Eliminar" (B31) está tan apagado que parece metadato; "Ver más" (B15) tan animado que parece secundario. La escala está **invertida** en sitios.
- **Icon-only** (B3, B6, B12-14, B24, B27-30): hit-areas divergentes (32px footer vs 44px resto — D23, D14).

**Veredicto:** la jerarquía existe en intención pero no en ejecución. El ojo NO puede ordenar los botones de forma consistente entre secciones porque el mismo rol cambia de aspecto. Esto es, literalmente, lo que Nil reporta.

---

## 5. Recomendación estructural (para el director)

El score no sube arreglando los 28 defectos uno a uno — volverían a divergir. La corrección de raíz es **una primitiva de botón única**:

1. **Adoptar `button.tsx` como primitiva** (o crear una nueva equivalente), recalibrada al sistema: tamaños `md` (alto ≥44px, padding `13px 28px`) y `sm` (≥44px, padding `11px 20px`); radio `var(--radius-button)`; variantes `primary`, `primary-inverse`, `ghost`, `icon`; estados `default/hover/focus/active/disabled` todos definidos UNA vez.
2. **Migrar los 11 primarios, 3 ghost, 4 terciarios y los icon-only** a la primitiva. Esto cierra D1-D5, D7, D9, D11, D17-D19, D23-D24 de golpe.
3. **CTA**: degradar B20 a ghost real (cierra D6).
4. **Footer**: quitar el `x:4` de B25 (cierra D20).

Este es trabajo de la **Fase 5 (Optimización)**: no es deuda nueva, es consolidar lo que Fase 4.5 dejó a medias (corrigió color, no sistema). Decisión de gate para Nil: ¿se autoriza crear/adoptar la primitiva de botón? Es un cambio de arquitectura de componente — requiere su aprobación (gobernanza §6 del design system: "duplicar un componente / cambio al design system tras Fase 4").

---

## 6. Score de coherencia de botones

### **4.5 / 10**

**Desglose:**
- Color / token / contraste: **8/10** — Fase 4.5 lo resolvió bien (sin gradientes, color plano, AA sano).
- Radio: **5/10** — nominalmente 8px, pero por dos mecanismos distintos (`rounded-md` vs `borderRadius:8`); frágil.
- Padding / tamaño: **2/10** — 8 paddings para un rol; sin escala de tamaños.
- Estados: **4/10** — focus sistémico, active ausente, hover en 3 patrones.
- Jerarquía: **4/10** — intención clara, ejecución divergente; CTA con jerarquía rota.
- Consistencia inter-sección: **3/10** — el mismo rol se ve distinto en casi cada sección.
- Sistema / primitiva: **1/10** — no existe; primitiva disponible sin usar.

El sitio NO está "roto" — está **artesanal**. Cada botón funciona aislado; juntos no forman un sistema. Por eso Nil ve botones "mal en sitios": son comparaciones lo que falla, no botones individuales.

---

## 7. Trazabilidad y hard rules

- Modo AUDIT respetado: **cero ficheros de `src/` modificados**, cero cambios en memoria de agencia.
- Cada defecto traza a la ui-spec de Fase 3 (§3.1-3.3 Button), al design system (§Button, gobernanza §6), o al encargo de Nil (estados/padding/alineación/jerarquía/consistencia).
- Firewall narrativo: la auditoría no introduce nombres, identidad de inversor ni referencias a `J. Elías`/`yayamariana.com`. Los botones son agnósticos de copy. Sin hallazgos.
- Tono homenaje: las recomendaciones mantienen el restraint — `active:translateY(1px)` y subrayado `scaleX` son micro-feedback "felt not seen"; se rechazan explícitamente sombras crecientes (D18) y desplazamientos laterales (D20) por leer como anuncio.

---

## 8. Handoff

| Hacia | Qué recibe |
|---|---|
| director | Score 4.5/10 · decisión de gate: ¿autorizar la primitiva de botón única? (§5) · los 2 CRÍTICOS (D2, D6) |
| design-system-manager | Necesidad de tokens de tamaño de botón (`--btn-pad-md/sm`, alto mínimo 44px) y de que `--radius-button` sea la ÚNICA fuente del radio |
| frontend-developer (si Fase 5 ejecuta) | Mapa de defectos §2 como lista de trabajo; la primitiva §5 como objetivo |
| accessibility-perfectionist | D10 (acción destructiva ilegible), D14/D23 (hit-areas <44px), D4 (feedback de active) |
