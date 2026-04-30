import Hero from "@/components/ui/hero";
import StatsStrip from "@/components/ui/stats-strip";
import Products from "@/components/ui/products";
import AboutUs from "@/components/ui/about-us";
import Values from "@/components/ui/values";
import CTA from "@/components/ui/cta";
import Contact from "@/components/ui/contact";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <Products />
      <AboutUs />
      <Values />
      <CTA />
      <Contact />
      <Footer />
    </>
  );
}
