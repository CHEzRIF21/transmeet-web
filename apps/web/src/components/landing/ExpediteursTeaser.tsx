import Link from "next/link";

export function ExpediteursTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid gap-8 rounded-3xl border bg-white/60 p-6 shadow-sm backdrop-blur sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] sm:p-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Pour les expéditeurs
          </p>
          <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">
            Trouvez rapidement des transporteurs fiables pour vos marchandises.
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Décrivez votre besoin, nous activons notre réseau de transporteurs
            vérifiés pour vous proposer la meilleure solution : type de camion,
            capacité, corridor, contraintes douanières.
          </p>
          <ol className="space-y-2 text-sm">
            <li>1. Décrivez votre besoin</li>
            <li>2. Nous trouvons le transporteur adapté</li>
            <li>3. Livraison sécurisée et suivie</li>
          </ol>
          <Link
            href="/expediteurs"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Commander votre transport
          </Link>
        </div>
        <div className="space-y-3 rounded-2xl bg-slate-950 p-5 text-xs text-slate-100">
          <p className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-400">
            Exemple de demande
          </p>
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-[0.7rem] text-slate-400">Expéditeur</p>
            <p className="mt-1 text-sm font-semibold">
              30T de ciment — Cotonou → Niamey
            </p>
            <p className="mt-1 text-slate-300">
              Type camion : semi-remorque bâché · Départ sous 72h.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <p className="text-[0.7rem] text-emerald-300">Proposition</p>
            <p className="mt-1 text-sm font-semibold">
              Transporteur certifié, documents à jour, tracking activé.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

