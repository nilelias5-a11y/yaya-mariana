import Hero from "@/components/ui/hero";
import StatsStrip from "@/components/ui/stats-strip";
import Products from "@/components/ui/products";
import AboutUs from "@/components/ui/about-us";
import Values from "@/components/ui/values";
import CTA from "@/components/ui/cta";
import Contact from "@/components/ui/contact";
import Footer from "@/components/ui/footer";
import Cart from "@/components/ui/cart";

export default function Home() {
  return (
    /* TANDA 4 (#26) — landmark de contenido principal; ancla del skip-link.
       El nav vive dentro de Hero (sticky) y precede al contenido scrolleable;
       <main> envuelve el contenido para que el SR ofrezca "saltar al contenido". */
    <>
      <Hero />
      {/* tabIndex={-1} — el foco aterriza realmente en <main> al usar el
          skip-link (un landmark no es focusable por defecto). */}
      <main id="contenido" tabIndex={-1}>
        <StatsStrip />
        <Products />
        <AboutUs />
        <Values />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <Cart />
    </>
  );
}
