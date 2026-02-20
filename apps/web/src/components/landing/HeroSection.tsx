"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-background text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.12),_transparent_60%)]" />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 md:flex-row md:items-center md:gap-12">
        <div className="relative z-10 max-w-xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Logistique B2B · Afrique de l&apos;Ouest</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            Transmeet — la puissance logistique au service de vos projets.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-balance text-sm text-slate-200 sm:text-base"
          >
            Transport poids lourds, engins BTP et solutions logistiques sur
            mesure en Afrique de l&apos;Ouest. Un réseau sécurisé de
            transporteurs, transitaires et partenaires pour vos flux critiques.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href="/expediteurs"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-accent/90"
            >
              Commander un camion
            </Link>
            <Link
              href="/transporteurs"
              className="inline-flex items-center justify-center rounded-full border border-slate-600/80 px-6 py-2.5 text-sm font-semibold text-slate-50 transition hover:border-slate-300 hover:bg-slate-900/60"
            >
              Référencer votre camion
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 pt-6 text-xs sm:grid-cols-4 sm:text-sm"
          >
            <div>
              <dt className="text-slate-400">Transporteurs partenaires</dt>
              <dd className="text-base font-semibold text-white sm:text-lg">
                500+
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Années d&apos;expérience</dt>
              <dd className="text-base font-semibold text-white sm:text-lg">
                10+
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Satisfaction client</dt>
              <dd className="text-base font-semibold text-white sm:text-lg">
                98%
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Couverture</dt>
              <dd className="text-base font-semibold text-white sm:text-lg">
                Afrique de l&apos;Ouest
              </dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-10 mt-4 h-64 flex-1 overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-900/70 shadow-2xl shadow-black/40 sm:h-80"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0,_rgba(56,189,248,0.25),_transparent_55%),radial-gradient(circle_at_80%_100%,_rgba(249,115,22,0.35),_transparent_55%)]" />
          <div className="relative flex h-full flex-col justify-between p-5 text-xs text-slate-100 sm:p-6 sm:text-sm">
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-slate-300">
                Vue opérationnelle
              </p>
              <p className="mt-1 text-sm font-semibold">
                Chargement en cours — Port de Cotonou
              </p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-[0.7rem] sm:text-xs">
                <div className="rounded-lg border border-slate-700/70 bg-slate-900/80 p-3">
                  <p className="text-[0.65rem] text-slate-400">
                    Mission #TR-4821
                  </p>
                  <p className="mt-1 font-semibold">Cotonou → Lomé</p>
                  <p className="mt-1 text-slate-300">
                    27T · Marchandises générales
                  </p>
                </div>
                <div className="rounded-lg border border-slate-700/70 bg-slate-900/80 p-3">
                  <p className="text-[0.65rem] text-slate-400">
                    Engins mobilisés
                  </p>
                  <p className="mt-1 font-semibold">Porte-char + Bulldozer</p>
                  <p className="mt-1 text-slate-300">Chantier BTP Grand Nord</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2">
                <span className="text-[0.7rem] text-slate-300">
                  Tracking en temps réel activé
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.25)]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

