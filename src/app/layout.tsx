import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import CookieBanner from "@/components/cookie-banner";
import { business, socialUrls } from "@/config/business";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

/* Identidad de marca: fuente única en `src/config/business.ts`.
   El dominio `yayamariana.es` es placeholder (aún no comprado); el deploy vive
   en vercel.app. Cuando se compre el dominio, se cambia en config y basta
   apuntar el DNS. La descripción SEO (ES) se mantiene aquí (prosa). */
const SITE = business.brand.siteUrl;
const SITE_NAME = business.brand.name;
const SITE_TAGLINE = business.brand.tagline;
const SITE_DESCRIPTION =
  "Fresas frescas de Tarragona, cultivadas sin pesticidas con el cuidado de siempre. Tres variedades — Mágnum, Dream y 1525 — directas del campo a tu mesa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${SITE_NAME} – ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "fresas",
    "fresas frescas",
    "Tarragona",
    "sin pesticidas",
    "Mágnum",
    "Dream",
    "1525",
    "cultivo artesanal",
    "fresas premium",
    "fresas DTC",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["ca_ES", "en_US"],
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} – ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    /* La OG image la sirve la convencion `opengraph-image.tsx` — Next la
       inyecta automaticamente con dimensiones y alt; no hace falta listarla
       aqui (si se duplica, Next sirve dos og:image, lo cual confunde a los
       crawlers). */
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /* No `authors`/`creator`/`publisher`: el fundador de registro no aparece
     en superficies publicas (HARD RULE de project memory). La marca
     "Yaya Mariana" es la unica autoridad visible. */
};

/* JSON-LD — Organization + 3 Products. La clausula `founder` queda
   deliberadamente fuera del schema por la HARD RULE; el resto refleja
   los datos publicos ya visibles en la home. */
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "Yaya Mariana SL",
  url: SITE,
  logo: `${SITE}${business.brand.logo}`,
  description: SITE_DESCRIPTION,
  email: business.contact.email,
  telephone: business.contact.phoneDisplay,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    postalCode: business.address.postalCode,
    addressRegion: business.address.region,
    addressCountry: business.address.country,
  },
  sameAs: socialUrls,
};

/* Descripciones SEO (ES) del JSON-LD de producto. Son prosa (no se centralizan
   en config); el resto de hechos —nombre, precio, imagen, peso— salen de
   `business.products`. Indexadas por variedad. */
const PRODUCT_SEO_DESCRIPTIONS: Record<string, string> = {
  "Mágnum":
    "Fresa de gran tamaño y sabor intenso, cultivada en Tarragona. Recogida en su punto óptimo de madurez, sin pesticidas.",
  Dream:
    "Variedad Dream de sabor dulce y textura firme. Cultivo propio de Tarragona, directa del campo a tu mesa.",
  "1525":
    "Variedad exclusiva 1525, seleccionada por su calidad y dulzura excepcional. Sin químicos ni pesticidas.",
};

const PRODUCTS = business.products.map((p) => ({
  name: p.cartName,
  variety: p.variety,
  price: p.price,
  weight: p.weight,
  description: PRODUCT_SEO_DESCRIPTIONS[p.variety] ?? "",
  image: p.images[0],
}));

const jsonLdProducts = PRODUCTS.map((p) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.name,
  description: p.description,
  image: `${SITE}${p.image}`,
  brand: { "@type": "Brand", name: SITE_NAME },
  category: "Strawberries",
  offers: {
    "@type": "Offer",
    price: p.price.toFixed(2),
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${SITE}/#productos`,
    priceValidUntil: `${new Date().getFullYear()}-12-31`,
  },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Variedad", value: p.variety },
    { "@type": "PropertyValue", name: "Peso", value: p.weight },
    { "@type": "PropertyValue", name: "Origen", value: "Tarragona, España" },
  ],
}));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          /* `dangerouslySetInnerHTML` es el patron estandar Next.js para
             inyectar `<script type="application/ld+json">` en SSR sin que
             React lo escape; los datos vienen de constantes locales, no de
             input de usuario — sin riesgo de XSS. */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        {/* JSON-LD: 3 Products (uno por script) */}
        {jsonLdProducts.map((product) => (
          <script
            key={product.name}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(product) }}
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col bg-[#fdf6f5]">
        {/* WhatsAppWidget dentro de Providers para acceder al idioma activo
            (mensaje pre-escrito i18n). Sustituye al antiguo chat IA. */}
        <Providers>
          {children}
          <WhatsAppWidget />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
