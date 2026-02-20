import { FileText, MessageSquare, Truck } from "lucide-react";
import { Section } from "./Section";
import { FeatureCard } from "./FeatureCard";

const steps = [
  {
    icon: FileText,
    title: "Publiez votre besoin",
    description:
      "Décrivez votre demande de transport : origine, destination, type de marchandise. En quelques clics.",
  },
  {
    icon: MessageSquare,
    title: "Recevez des propositions",
    description:
      "Les transporteurs qualifiés vous contactent. Comparez les offres et choisissez le partenaire idéal.",
  },
  {
    icon: Truck,
    title: "Suivez votre livraison",
    description:
      "Suivi en temps réel, messagerie directe et documents centralisés. Votre envoi en toute sérénité.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="comment-ca-marche"
      title="Comment ça marche"
      subtitle="Trois étapes pour organiser votre transport en Afrique de l'Ouest."
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <FeatureCard
            key={step.title}
            icon={step.icon}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </Section>
  );
}
