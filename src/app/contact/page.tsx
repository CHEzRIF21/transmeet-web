import { ContactForm } from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Contact
        </p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Discutons de vos besoins logistiques.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Laissez-nous quelques informations, nous reviendrons vers vous dans
          les meilleurs délais. Pour les urgences, privilégiez l&apos;appel
          téléphonique ou WhatsApp.
        </p>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <ContactForm />
        </div>
        <div className="space-y-2 rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Coordonnées
          </p>
          <p>Cotonou, Bénin</p>
          <p>Tél. : +229 XX XX XX XX</p>
          <p>Email : contact@transmeet.com</p>
        </div>
      </div>
    </div>
  );
}
