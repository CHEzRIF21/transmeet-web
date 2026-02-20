import Link from "next/link";

export function TransporteursTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid gap-8 rounded-3xl border bg-slate-50 p-6 shadow-sm sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:p-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Pour les transporteurs
          </p>
          <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">
            Boostez votre activité et augmentez vos revenus avec Transmeet.
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Accédez à des missions régulières, des clients fiables et une
            visibilité régionale sur les corridors stratégiques. Nous
            sécurisons la relation commerciale pour vous concentrer sur
            l&apos;exploitation.
          </p>
          <ul className="space-y-1 text-sm">
            <li>• Missions récurrentes adaptées à votre flotte</li>
            <li>• Visibilité régionale et nouveaux clients</li>
            <li>• Support logistique et administratif</li>
          </ul>
          <Link
            href="/transporteurs"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
          >
            Rejoindre le réseau
          </Link>
        </div>
        <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-xs text-slate-700">
          <p className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-500">
            Profils recherchés
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-slate-50 p-3">
              <p className="text-[0.7rem] text-slate-500">Propriétaires</p>
              <p className="mt-1 text-sm font-semibold">
                Camions plateau, bennes, citernes
              </p>
            </div>
            <div className="rounded-xl border bg-slate-50 p-3">
              <p className="text-[0.7rem] text-slate-500">Sociétés</p>
              <p className="mt-1 text-sm font-semibold">
                Flotte structurée, exploitation régionale
              </p>
            </div>
          </div>
          <p className="text-[0.7rem] text-slate-500">
            Nous valorisons les transporteurs sérieux, à jour de leurs
            documents et engagés sur la qualité de service.
          </p>
        </div>
      </div>
    </section>
  );
}

