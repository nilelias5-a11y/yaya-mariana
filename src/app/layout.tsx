import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { ChatWidget } from "@/components/chat-widget";

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

/* Dominio canonico `yayamariana.es` — placeholder, dominio aun no comprado.
   El deploy `yaya-mariana.vercel.app` es solo para revision visual familiar.
   Cuando se compre el dominio real este string se mantiene; basta apuntar el DNS. */
const SITE = "https://yayamariana.es";
const SITE_NAME = "Yaya Mariana";
const SITE_TAGLINE = "Fresas de Tarragona";
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
  logo: `${SITE}/logo-nuevo.jpg`,
  description: SITE_DESCRIPTION,
  email: "info@yaya-mariana.com",
  telephone: "+34 666 777 888",
  address: {
    "@type": "PostalAddress",
    streetAddress: "C/ Electrónica 19, Planta 10, oficina D",
    addressLocality: "Badalona",
    postalCode: "08915",
    addressRegion: "Barcelona",
    addressCountry: "ES",
  },
  sameAs: [
    "https://facebook.com",
    "https://instagram.com",
    "https://x.com",
    "https://pinterest.com",
    "https://linkedin.com",
  ],
};

const PRODUCTS = [
  {
    name: "Fresa Mágnum",
    variety: "Mágnum",
    description:
      "Fresa de gran tamaño y sabor intenso, cultivada en Tarragona. Recogida en su punto óptimo de madurez, sin pesticidas.",
    image: "/fresas/magnum/magnum-10.jpeg",
  },
  {
    name: "Fresa Dream",
    variety: "Dream",
    description:
      "Variedad Dream de sabor dulce y textura firme. Cultivo propio de Tarragona, directa del campo a tu mesa.",
    image: "/fresas/dream/dream-07.jpeg",
  },
  {
    name: "Fresa Variedad 1525",
    variety: "1525",
    description:
      "Variedad exclusiva 1525, seleccionada por su calidad y dulzura excepcional. Sin químicos ni pesticidas.",
    image: "/fresas/variedad1525/variedad1525-10.jpeg",
  },
];

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
    price: "7.50",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${SITE}/#productos`,
    priceValidUntil: `${new Date().getFullYear()}-12-31`,
  },
  additionalProperty: [
    { "@type": "PropertyValue", name: "Variedad", value: p.variety },
    { "@type": "PropertyValue", name: "Peso", value: "500 g" },
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
        <Providers>{children}</Providers>
        <ChatWidget />
      </body>
    </html>
  );
}
