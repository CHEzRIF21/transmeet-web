import { ExpediteurForm } from "@/components/forms/ExpediteurForm";

export default function ExpediteursPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Expéditeurs
        </p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Commander un camion pour vos marchandises.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Remplissez ce formulaire pour nous décrire votre besoin. Un membre de
          l&apos;équipe Transmeet vous recontactera rapidement avec une
          proposition adaptée.
        </p>
      </div>
      <div className="mt-6">
        <ExpediteurForm />
      </div>
    </div>
  );
}
