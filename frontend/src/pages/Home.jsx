import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import HowItWorks from "../components/HowItWorks";
import ProfessionalsSection from "../components/ProfessionalsSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <ServicesSection />

        <HowItWorks />

        <ProfessionalsSection />

        <CTASection />
      </main>

      <Footer />
    </>
  );
}

export default Home;