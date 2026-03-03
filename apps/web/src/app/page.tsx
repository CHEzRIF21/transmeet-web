import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { TruckTypesSection } from "@/components/landing/TruckTypesSection";
import { ExpediteursTeaser } from "@/components/landing/ExpediteursTeaser";
import { TransporteursTeaser } from "@/components/landing/TransporteursTeaser";
import { BTPTeaser } from "@/components/landing/BTPTeaser";
import { ValuesSection } from "@/components/landing/ValuesSection";
import { ContactTeaser } from "@/components/landing/ContactTeaser";

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      <HeroSection />
      <AboutSection />
      <TruckTypesSection />
      <ExpediteursTeaser />
      <TransporteursTeaser />
      <BTPTeaser />
      <ValuesSection />
      <ContactTeaser />
    </div>
  );
}
