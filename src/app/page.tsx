import Hero from "@/components/ui/hero";
import StatsStrip from "@/components/ui/stats-strip";
import Products from "@/components/ui/products";
import AboutUs from "@/components/ui/about-us";
import Videos from "@/components/ui/videos";
import Values from "@/components/ui/values";
import CTA from "@/components/ui/cta";
import Testimonials from "@/components/ui/testimonials";
import FAQ from "@/components/ui/faq";
import Contact from "@/components/ui/contact";
import RouteMap from "@/components/ui/route-map";
import Footer from "@/components/ui/footer";
import Cart from "@/components/ui/cart";
import SkipLink from "@/components/ui/skip-link";
import HtmlLangSync from "@/components/html-lang-sync";
import ConsoleTribute from "@/components/easter-eggs/console-tribute";
import FooterPetal from "@/components/easter-eggs/footer-petal";
import KonamiTribute from "@/components/easter-eggs/konami-tribute";
import QuietudMessage from "@/components/easter-eggs/quietud-message";

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
        <Videos />
        <Values />
        <CTA />
        <Testimonials />
        <FAQ />
        <Contact />
        <RouteMap />
      </main>
      <Footer />
      <Cart />
      {/* ENHANCE-7: easter eggs sutiles montados a nivel raiz. */}
      <ConsoleTribute />
      <FooterPetal />
      {/* ENHANCE-2 T9: EE-02 Konami code tributo, EE-03 Quietud 28s */}
      <KonamiTribute />
      <QuietudMessage />
    </>
  );
}
