import Hero from "@/components/ui/hero";
import StatsStrip from "@/components/ui/stats-strip";
import Products from "@/components/ui/products";
import AboutUs from "@/components/ui/about-us";
import Values from "@/components/ui/values";
import CTA from "@/components/ui/cta";
import Contact from "@/components/ui/contact";
import Footer from "@/components/ui/footer";
import Cart from "@/components/ui/cart";
import SkipLink from "@/components/ui/skip-link";
import HtmlLangSync from "@/components/html-lang-sync";
import ConsoleTribute from "@/components/easter-eggs/console-tribute";
import FooterPetal from "@/components/easter-eggs/footer-petal";

export default function Home() {
  /* a11y: landmark de contenido principal y skip-link.
     El <nav> sticky vive dentro de Hero y precede al contenido
     scrolleable; <main> envuelve lo demas para que el SR ofrezca
     "saltar al contenido" desde el skip-link.
     tabIndex={-1} → el foco aterriza realmente en <main> al activar
     el skip-link (un landmark no es focusable por defecto).
     HtmlLangSync sincroniza <html lang> cuando el usuario cambia idioma. */
  return (
    <>
      <SkipLink />
      <HtmlLangSync />
      <Hero />
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
      {/* ENHANCE-7: easter eggs sutiles montados a nivel raiz. */}
      <ConsoleTribute />
      <FooterPetal />
    </>
  );
}
