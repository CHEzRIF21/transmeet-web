import Image from "next/image";
import { BTPDevisForm } from "@/components/forms/BTPDevisForm";

export default function BTPPage() {
  return (
    <div className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            BTP &amp; grands projets
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Engins de chantier &amp; transport pour vos projets structurants.
          </h1>
          <p className="max-w-2xl text-sm text-white/90 sm:text-base">
            Décrivez votre projet, les engins nécessaires et votre planning.
            Nous mobilisons notre réseau de transporteurs et de partenaires BTP
            pour une solution clé en main.
          </p>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <BTPDevisForm />
          </div>
          <div className="space-y-4">
            <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/20 bg-white/5 sm:h-72">
              <Image
                src="/images/engin BTP.jpeg"
                alt="Engins BTP - Transmeet"
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>
            <div className="space-y-3 rounded-2xl border border-white/20 bg-white/5 p-4 text-xs sm:p-5 sm:text-sm">
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-accent">
                Galerie d&apos;engins
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Pelleteuses &amp; pelles hydrauliques",
                  "Bulldozers &amp; niveleuses",
                  "Nacelles &amp; plateformes élévatrices",
                  "Grues mobiles",
                  "Camions bennes &amp; toupies",
                  "Porte-chars &amp; low-beds",
                ].map((label) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/20 bg-white/5 p-3"
                  >
                    <p className="text-white/90">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
