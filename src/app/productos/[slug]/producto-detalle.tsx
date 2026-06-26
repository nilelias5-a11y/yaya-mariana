"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/context/language-context";
import { business, findProductBySlug } from "@/config/business";
import type { Lang } from "@/i18n/translations";
import Footer from "@/components/ui/footer";
import Cart from "@/components/ui/cart";
import HtmlLangSync from "@/components/html-lang-sync";

/* Página de detalle de producto (cliente). Lee los HECHOS del producto de
 * `config/business.ts` (nombre, precio, peso, imágenes) y la prosa de i18n
 * (t.products.items[i].longDescription). Diseño con la paleta de la marca,
 * coherente con el resto. El carrito flotante <Cart/> se monta aquí para que
 * "Añadir al carrito" sea visible y permita ir al checkout. */

const LANGS: { code: Lang; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "ca", label: "CA" },
  { code: "en", label: "EN" },
];

export default function ProductoDetalle({ slug }: { slug: string }) {
  const { t, lang, setLang } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();

  const found = findProductBySlug(slug);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (!found) return null; // el server ya hace notFound(); guard de tipos.
  const { product, index } = found;
  const description = t.products.items[index].longDescription;
  const cartProduct = { name: product.cartName, price: product.price, image: product.images[0] };

  function handleAdd() {
    addToCart(cartProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }
  function handleBuyNow() {
    addToCart(cartProduct);
    router.push("/checkout");
  }

  const others = business.products.filter((p) => p.slug !== product.slug);

  return (
    <div className="min-h-full flex flex-col bg-[#fdf6f5]">
      <HtmlLangSync />

      {/* Barra superior — logo a inicio + selector de idioma. */}
      <header
        className="flex items-center justify-between px-6 md:px-12"
        style={{ height: 72, borderBottom: "1px solid rgba(245,198,194,0.6)" }}
      >
        <Link href="/" aria-label="Yaya Mariana — inicio" className="shrink-0 transition-opacity duration-200 hover:opacity-80">
          <Image src="/logo-nuevo.jpg" alt="Yaya Mariana" width={44} height={44} priority className="w-auto" style={{ height: 44 }} />
        </Link>
        <div className="flex items-center gap-1" role="group" aria-label="Idioma">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              className="px-2.5 py-1 rounded-full text-xs font-bold transition-colors"
              style={
                lang === code
                  ? { backgroundColor: "#fdf0ef", color: "#c0392b" }
                  : { color: "#7a3a3a" }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main id="contenido" className="flex-1 px-6 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Migas de pan" className="mb-6 text-sm text-[#7a3a3a]/60">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><Link href="/" className="hover:text-[#c0392b] transition-colors">{t.productDetail.breadcrumbHome}</Link></li>
              <li aria-hidden className="text-[#7a3a3a]/35">/</li>
              <li><Link href="/#productos" className="hover:text-[#c0392b] transition-colors">{t.productDetail.breadcrumbProducts}</Link></li>
              <li aria-hidden className="text-[#7a3a3a]/35">/</li>
              <li aria-current="page" className="text-[#1a0808] font-semibold">{product.cartName}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Galería */}
            <div>
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid rgba(245,198,194,0.7)" }}>
                <Image
                  src={product.images[activeImg]}
                  alt={`${product.cartName} — ${t.products.a11y.photo} ${activeImg + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex gap-2.5 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`${t.products.a11y.goToPhoto} ${i + 1}`}
                    aria-current={i === activeImg}
                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all duration-200"
                    style={{
                      border: i === activeImg ? "2px solid #c0392b" : "1px solid rgba(245,198,194,0.7)",
                      opacity: i === activeImg ? 1 : 0.7,
                    }}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Panel */}
            <div>
              <span className="inline-block text-[0.65rem] font-bold uppercase tracking-widest text-[#7a1a1a] bg-white px-3 py-1 rounded-full shadow-sm mb-3" style={{ border: "1px solid rgba(245,198,194,0.7)" }}>
                {product.category}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-[#1a0808] leading-tight mb-2">{product.cartName}</h1>
              <div className="flex items-baseline gap-1.5 mb-5">
                <span className="numerals-tabular text-2xl font-bold text-[#1a0808]">{product.price.toFixed(2)}€</span>
                <span className="text-sm text-[#7a3a3a]/50">/ {product.weight}</span>
              </div>

              <p className="text-[0.95rem] text-[#7a3a3a]/80 leading-relaxed mb-6">{description}</p>

              {/* Botones */}
              <div className="flex flex-col gap-3 mb-7">
                <button
                  onClick={handleAdd}
                  className={`w-full py-3 rounded-full text-sm font-bold transition-all duration-300 ${added ? "bg-green-500 text-white" : "text-white hover:shadow-lg"}`}
                  style={added ? undefined : { background: "linear-gradient(125deg, #c0392b 0%, #e74c3c 100%)" }}
                >
                  {added ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M3 8l4 4 6-6" /></svg>
                      {t.products.added}
                    </span>
                  ) : (
                    t.products.addToCart
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 rounded-full text-sm font-bold transition-colors duration-200"
                  style={{ border: "1px solid rgba(192,57,43,0.42)", color: "#c0392b", backgroundColor: "transparent" }}
                >
                  {t.productDetail.buyNow} →
                </button>
              </div>

              {/* Info de envío */}
              <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid rgba(245,198,194,0.7)" }}>
                <p className="text-xs font-bold uppercase tracking-wide text-[#7a3a3a]/55 mb-3">{t.productDetail.shippingTitle}</p>
                <ul className="space-y-2">
                  {t.productDetail.shippingItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#7a3a3a]/80">
                      <svg viewBox="0 0 16 16" fill="none" stroke="#c0392b" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 shrink-0"><path d="M3 8l4 4 6-6" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Otras variedades */}
          <section className="mt-16" aria-labelledby="otras">
            <h2 id="otras" className="font-serif text-2xl text-[#1a0808] mb-5">{t.productDetail.otherVarieties}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/productos/${p.slug}`}
                  className="group flex items-center gap-4 rounded-2xl bg-white p-3 transition-shadow hover:shadow-md"
                  style={{ border: "1px solid rgba(245,198,194,0.7)" }}
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image src={p.images[0]} alt={p.cartName} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-lg text-[#1a0808] leading-tight">{p.cartName}</p>
                    <p className="text-sm text-[#7a3a3a]/60">
                      <span className="numerals-tabular font-semibold text-[#1a0808]">{p.price.toFixed(2)}€</span>
                      <span className="ml-1">/ {p.weight}</span>
                    </p>
                  </div>
                  <motion.span aria-hidden className="ml-auto text-[#c0392b]/70 group-hover:text-[#c0392b]" whileHover={{ x: 3 }}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                  </motion.span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <Cart />
    </div>
  );
}
