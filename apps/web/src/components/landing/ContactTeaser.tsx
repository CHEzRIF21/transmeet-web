import Link from "next/link";

export function ContactTeaser() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
      <div className="rounded-3xl bg-slate-900 px-6 py-8 text-slate-50 shadow-lg sm:px-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
              Contact &amp; accompagnement
            </p>
            <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">
              Un projet, une urgence ou un besoin récurrent ?
            </h2>
            <p className="max-w-xl text-sm text-slate-200 sm:text-base">
              Parlez-nous de vos flux et de vos contraintes, nous vous
              proposerons une approche sur-mesure pour vos opérations
              logistiques.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90"
            >
              Nous contacter
            </Link>
            <p className="text-xs text-slate-300">
              Ou en direct via WhatsApp et téléphone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

