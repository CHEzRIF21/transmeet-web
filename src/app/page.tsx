import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { ExpediteursTeaser } from "@/components/landing/ExpediteursTeaser";
import { TransporteursTeaser } from "@/components/landing/TransporteursTeaser";
import { BTPTeaser } from "@/components/landing/BTPTeaser";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { ContactTeaser } from "@/components/landing/ContactTeaser";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      <HeroSection />
      <AboutSection />
      <ExpediteursTeaser />
      <TransporteursTeaser />
      <BTPTeaser />
      <ServicesSection />
      <TestimonialsSection />
      <ContactTeaser />
    </div>
  );
}
