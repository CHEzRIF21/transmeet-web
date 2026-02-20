import Link from "next/link";

const ENGIN_LIST = [
  { name: "Pelleteuse", detail: "Terrassement & excavation" },
  { name: "Bulldozer", detail: "Décapage & nivellement" },
  { name: "Nacelle", detail: "Travaux en hauteur" },
  { name: "Grue", detail: "Levage lourd" },
  { name: "Camion benne", detail: "Évacuation déblais" },
  { name: "Porte-char", detail: "Transport engins lourds" },
];

export function BTPTeaser() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-14 text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.12),_transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
              BTP &amp; grands projets
            </p>
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Location et transport d&apos;engins de chantier pour vos projets
              BTP.
            </h2>
            <p className="text-sm text-slate-200 sm:text-base">
              Efficacité, rapidité et sécurité garanties sur vos chantiers
              routiers, industriels et immobiliers. Nous gérons la mobilisation
              des engins, le transport et la coordination logistique.
            </p>
            <Link
              href="/btp"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
            >
              Demander un devis BTP
            </Link>
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-3">
            {ENGIN_LIST.map((engin) => (
              <div
                key={engin.name}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-xs shadow-sm"
              >
                <p className="text-[0.7rem] text-slate-400">Engin</p>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  {engin.name}
                </p>
                <p className="mt-1 text-slate-300">{engin.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

