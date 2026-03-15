import { Truck, HardHat, FileCheck, MapPin } from "lucide-react";
import { Section } from "./Section";
import { FeatureCard } from "./FeatureCard";

const services = [
  {
    icon: Truck,
    title: "Transport routier",
    description:
      "Convoyage de marchandises sur les axes Bénin, Togo, Niger et pays limitrophes. Camions et véhicules adaptés.",
  },
  {
    icon: HardHat,
    title: "Transport BTP",
    description:
      "Matériaux, engins et équipements pour le secteur du bâtiment et des travaux publics.",
  },
  {
    icon: FileCheck,
    title: "Formalités douanières",
    description:
      "Accompagnement et documents pour le passage des frontières et le dédouanement.",
  },
  {
    icon: MapPin,
    title: "Logistique régionale",
    description:
      "Solutions logistiques complètes en Afrique de l'Ouest : stockage, distribution, last mile.",
  },
];

export function Services() {
  return (
    <Section
      id="services"
      title="Nos services"
      subtitle="Une offre adaptée aux besoins des expéditeurs et transporteurs."
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {services.map((service) => (
          <FeatureCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </Section>
  );
}
