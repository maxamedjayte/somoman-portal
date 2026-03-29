import Footer from "./components/ui/Footer";
import HeroSection from "./components/ui/HeroSection";
import ServiceSection from "./components/ui/ServiceSection";
import WhatsAppButton from "./components/ui/WhatsAppButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <HeroSection />
      <ServiceSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}