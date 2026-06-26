/* ───────────────────────────────────────────────────────────────────────────
 * FUENTE ÚNICA DE VERDAD — datos de negocio (estructurados).
 *
 * Cambiar aquí un precio, un teléfono, un email o la dirección se propaga a
 * TODA la web (contacto, footer, JSON-LD, facturas, emails, catálogo).
 *
 * Qué NO vive aquí (a propósito):
 *   · Stock (unidades) → Neon, tabla `product_stock` (es dinámico, /admin).
 *   · Secretos/keys     → `.env` (DATABASE_URL, STRIPE_*, RESEND_API_KEY…).
 *   · Prosa traducible  → `src/i18n/translations.ts` (descripciones, textos
 *     legales, FAQ, testimonios). PERO el email/teléfono/dirección que aparecen
 *     dentro de esa prosa se inyectan DESDE AQUÍ vía `withBusinessVars()` con
 *     los tokens {email} / {phone} / {whatsapp} / {address}.
 *
 * ⚠️ LEYENDA de pendientes (checklist para cuando J. Elías dé los datos):
 *   · ⚠️ PLACEHOLDER         → dato de relleno, hay que sustituirlo por el real.
 *   · ⚠️ PENDIENTE CONFIRMAR → tenemos un valor pero falta que el cliente lo
 *                              confirme (puede cambiar).
 * ─────────────────────────────────────────────────────────────────────────── */

export type BusinessProduct = {
  variety: string; // clave de unión con product_stock (Neon): "Mágnum" | "Dream" | "1525"
  cartName: string; // nombre visible / del carrito: "Fresa Mágnum"
  orderName: string; // nombre de línea en pedido/factura
  category: "Premium";
  price: number; // PVP por unidad, IVA incl. (€)
  weight: string; // peso por caja
  images: string[]; // galería (la 1ª es la principal)
};

export const business = {
  // ── Identidad de marca ────────────────────────────────────────────────────
  brand: {
    name: "Yaya Mariana", // marca pública (la razón social está en `fiscal.legalName`)
    tagline: "Fresas de Tarragona",
    siteUrl: "https://yayamariana.es", // ⚠️ PLACEHOLDER — dominio aún no comprado (el deploy vive en vercel.app)
    logo: "/logo-nuevo.jpg",
  },

  // ── Contacto ──────────────────────────────────────────────────────────────
  contact: {
    email: "info@yaya-mariana.com", // ⚠️ PLACEHOLDER — email de contacto público
    phoneDisplay: "+34 666 777 888", // ⚠️ PLACEHOLDER — teléfono (formato legible)
    phoneE164: "+34666777888", // ⚠️ PLACEHOLDER — teléfono para enlaces tel: (mismo número, sin espacios)
    whatsapp: "34666777888", // ⚠️ PLACEHOLDER — WhatsApp para wa.me (dígitos internacionales, sin "+")
  },

  // ── Dirección (postal / fiscal) ───────────────────────────────────────────
  // ⚠️ PENDIENTE CONFIRMAR — había 4 versiones distintas en el código; se ha
  // elegido la más completa como canónica provisional. Cuando J. Elías confirme
  // la dirección real, se cambia SOLO aquí.
  address: {
    street: "C/ Electrónica 19, Planta 10, oficina D",
    postalCode: "08915",
    city: "Badalona",
    region: "Barcelona",
    country: "ES", // código ISO para JSON-LD
    countryName: "España",
  },

  // ── Datos fiscales (facturas / textos legales) ────────────────────────────
  fiscal: {
    legalName: "Holistic Green Energy S.L.", // ⚠️ PENDIENTE CONFIRMAR — razón social del emisor de facturas
    cif: "B67391128", // ⚠️ PENDIENTE CONFIRMAR — CIF/NIF de la empresa
  },

  // ── Redes sociales ────────────────────────────────────────────────────────
  // ⚠️ PLACEHOLDER — dominios genéricos; faltan los perfiles reales de la marca.
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    x: "https://x.com",
    pinterest: "https://pinterest.com",
    linkedin: "https://linkedin.com",
  },

  // ── Email transaccional (Resend) ──────────────────────────────────────────
  email: {
    // Remitente por defecto si no se define EMAIL_FROM. ⚠️ PLACEHOLDER — debe ser
    // una dirección de un dominio verificado en Resend.
    fromFallback: "Yaya Mariana <no-reply@yaya-mariana.com>",
  },

  // ── Catálogo (HECHOS estáticos del producto) ──────────────────────────────
  // El stock (unidades) NO está aquí: vive en Neon (product_stock). Las
  // DESCRIPCIONES tampoco: son prosa traducible en i18n (t.products.items[].description).
  products: [
    {
      variety: "Mágnum",
      cartName: "Fresa Mágnum",
      orderName: "Caja fresas Yaya Mariana — Mágnum",
      category: "Premium",
      price: 7.5,
      weight: "500g",
      images: [
        "/fresas/magnum/magnum-10.jpeg",
        "/fresas/magnum/magnum-07.jpeg",
        "/fresas/magnum/magnum-08.jpeg",
        "/fresas/magnum/magnum-06.jpeg",
      ],
    },
    {
      variety: "Dream",
      cartName: "Fresa Dream",
      orderName: "Caja fresas Yaya Mariana — Dream",
      category: "Premium",
      price: 7.5,
      weight: "500g",
      images: [
        "/fresas/dream/dream-07.jpeg",
        "/fresas/dream/dream-12.jpeg",
        "/fresas/dream/dream-14.jpeg",
        "/fresas/dream/dream-08.jpeg",
      ],
    },
    {
      variety: "1525",
      cartName: "Fresa Variedad 1525",
      orderName: "Caja fresas Yaya Mariana — Variedad 1525",
      category: "Premium",
      price: 7.5,
      weight: "500g",
      images: [
        "/fresas/variedad1525/variedad1525-10.jpeg",
        "/fresas/variedad1525/variedad1525-11.jpeg",
        "/fresas/variedad1525/variedad1525-12.jpeg",
        "/fresas/variedad1525/variedad1525-09.jpeg",
      ],
    },
  ] as BusinessProduct[],
};

// ── Derivados de conveniencia ───────────────────────────────────────────────

/** Dirección en una línea (JSON-LD, facturas, prosa legal). */
export const fullAddress = `${business.address.street}, ${business.address.postalCode} ${business.address.city}, ${business.address.region}`;

/** Dirección en dos líneas (tarjeta de contacto). */
export const multilineAddress = `${business.address.street}\n${business.address.postalCode}, ${business.address.city}, ${business.address.countryName}`;

/** URLs de redes en orden de relevancia (Instagram primero) — para sameAs JSON-LD. */
export const socialUrls = [
  business.social.instagram,
  business.social.facebook,
  business.social.x,
  business.social.pinterest,
  business.social.linkedin,
];

/* Interpolación de datos de negocio en prosa traducible (i18n). Los textos
 * legales/FAQ guardan tokens {email} / {phone} / {whatsapp} / {address} y aquí
 * se sustituyen por el valor real de config → una sola fuente de verdad. */
const BUSINESS_VARS: Record<string, string> = {
  email: business.contact.email,
  phone: business.contact.phoneDisplay,
  whatsapp: business.contact.phoneDisplay,
  address: fullAddress,
};

export function withBusinessVars(text: string): string {
  return text.replace(/\{(email|phone|whatsapp|address)\}/g, (_, key) => BUSINESS_VARS[key] ?? `{${key}}`);
}
