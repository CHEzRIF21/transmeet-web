import { TransporteurForm } from "@/components/forms/TransporteurForm";

export default function TransporteursPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Transporteurs
        </p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Rejoindre le réseau de transporteurs Transmeet.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Indiquez votre profil et les caractéristiques de votre flotte. Nous
          reviendrons vers vous pour valider votre dossier et vous proposer des
          missions adaptées.
        </p>
      </div>
      <div className="mt-6">
        <TransporteurForm />
      </div>
    </div>
  );
}
