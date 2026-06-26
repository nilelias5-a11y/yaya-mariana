import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { business, findProductBySlug } from "@/config/business";
import { translations } from "@/i18n/translations";
import ProductoDetalle from "./producto-detalle";

/* Página de detalle de producto: /productos/[slug].
 *
 * Server component → SEO (metadata + JSON-LD Product + BreadcrumbList) y SSG
 * (generateStaticParams). La interactividad (galería, carrito, idioma) vive en
 * el componente cliente. Todo lee de `config/business.ts` (hechos) + i18n
 * (descripciones). La metadata canónica va en ES, coherente con la arquitectura
 * de URL única del sitio (el contenido visible cambia de idioma en cliente). */

const SITE = business.brand.siteUrl;

export function generateStaticParams() {
  return business.products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = findProductBySlug(slug);
  if (!found) return {};
  const { product, index } = found;
  const description = translations.es.products.items[index].description;
  const url = `/productos/${product.slug}`;
  return {
    title: product.cartName, // el template del layout añade " · Yaya Mariana"
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${product.cartName} · ${business.brand.name}`,
      description,
      images: [{ url: `${SITE}${product.images[0]}`, alt: product.cartName }],
    },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = findProductBySlug(slug);
  if (!found) notFound();
  const { product, index } = found;
  const description = translations.es.products.items[index].description;

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.cartName,
    description,
    image: `${SITE}${product.images[0]}`,
    brand: { "@type": "Brand", name: business.brand.name },
    category: "Strawberries",
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE}/productos/${product.slug}`,
      priceValidUntil: `${new Date().getFullYear()}-12-31`,
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Variedad", value: product.variety },
      { "@type": "PropertyValue", name: "Peso", value: product.weight },
      { "@type": "PropertyValue", name: "Origen", value: "Tarragona, España" },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
      { "@type": "ListItem", position: 2, name: "Productos", item: `${SITE}/#productos` },
      { "@type": "ListItem", position: 3, name: product.cartName, item: `${SITE}/productos/${product.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <ProductoDetalle slug={product.slug} />
    </>
  );
}
