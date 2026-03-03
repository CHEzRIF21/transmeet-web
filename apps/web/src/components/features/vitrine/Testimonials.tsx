import { Section } from "./Section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Amadou Diallo",
    role: "Expéditeur, Cotonou",
    quote:
      "Transmeet a simplifié nos envois vers le Togo. Réactivité et professionnalisme.",
  },
  {
    name: "Fatou Ndiaye",
    role: "Transporteur, Lomé",
    quote:
      "Une plateforme fiable qui nous apporte des missions régulières.",
  },
  {
    name: "Ibrahim Traoré",
    role: "Responsable logistique",
    quote:
      "Le suivi en temps réel et la messagerie nous font gagner un temps précieux.",
  },
];

export function Testimonials() {
  return (
    <Section
      id="temoignages"
      title="Ils nous font confiance"
      subtitle="Témoignages de nos utilisateurs."
    >
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <Card
            key={t.name}
            className="border-border bg-card transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <Quote className="h-8 w-8 text-primary/60" />
              <p className="text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
