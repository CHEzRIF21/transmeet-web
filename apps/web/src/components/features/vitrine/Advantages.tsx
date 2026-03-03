import {
  ShieldCheck,
  Clock,
  Lock,
  DollarSign,
  Headphones,
} from "lucide-react";
import { Section } from "./Section";

const advantages = [
  {
    icon: ShieldCheck,
    title: "Transporteurs vérifiés",
    description: "Professionnels identifiés et qualifiés pour des prestations fiables.",
  },
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Mise en relation rapide, suivi en temps réel et messagerie intégrée.",
  },
  {
    icon: Lock,
    title: "Sécurité",
    description: "Documents centralisés, traçabilité et bonnes pratiques logistiques.",
  },
  {
    icon: DollarSign,
    title: "Prix compétitifs",
    description: "Comparez les offres et choisissez le meilleur rapport qualité-prix.",
  },
  {
    icon: Headphones,
    title: "Support dédié",
    description: "Une équipe à votre écoute pour vous accompagner au quotidien.",
  },
];

export function Advantages() {
  return (
    <Section
      title="Nos avantages"
      subtitle="Pourquoi choisir Transmeet pour vos transports."
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {advantages.map((item) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
