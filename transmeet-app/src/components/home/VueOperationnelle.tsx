import { Package, Truck } from "lucide-react";

export function VueOperationnelle() {
  return (
    <div className="rounded-xl border border-white/20 bg-primary/60 p-6 backdrop-blur-sm lg:w-[380px] xl:w-[420px]">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
        Vue opérationnelle
      </h3>
      <p className="mt-1 text-xs text-white/70">
        Chargement en cours — Port de Cotonou
      </p>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-white/80">
              Mission #TR-4821
            </span>
          </div>
          <p className="text-sm font-medium text-white">
            Cotonou → Lomé
          </p>
          <p className="text-xs text-white/70">
            27T Marchandises générales
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium text-white/80">
              Engins mobilisés
            </span>
          </div>
          <p className="text-sm font-medium text-white">
            Porte-char + Bulldozer
          </p>
          <p className="text-xs text-white/70">
            Chantier BTP Grand Nord
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-white/20 pt-4">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs font-medium text-white/90">
          Tracking en temps réel activé
        </span>
      </div>
    </div>
  );
}
