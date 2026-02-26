"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, Package, Users } from "lucide-react";
import { APP_ROUTES } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AVATARS = [
  { label: "Expéditeur", icon: Package, color: "bg-primary" },
  { label: "Transporteur", icon: Truck, color: "bg-accent" },
  { label: "Partenaire", icon: Users, color: "bg-primary/80" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Transmeet - Transport et partenariat"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#012767]/95 via-[#012767]/80 to-[#012767]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(224,168,66,0.15),_transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center gap-10 px-4 py-20 sm:px-6 md:flex-row md:items-center md:gap-16">
        <div className="max-w-xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#e0a842]/50 bg-[#e0a842]/10 px-3 py-1.5 text-xs font-medium text-[#e0a842]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e0a842] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e0a842]" />
            </span>
            Logistique B2B · Afrique de l&apos;Ouest
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Transmeet — la puissance logistique au service de vos projets.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-balance text-base text-white/90 sm:text-lg"
          >
            Transport poids lourds, engins BTP et solutions logistiques sur
            mesure en Afrique de l&apos;Ouest. Un réseau sécurisé de
            transporteurs, transitaires et partenaires pour vos flux critiques.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="xl"
              className="bg-[#e0a842] text-[#012767] hover:bg-[#e0a842]/90 shadow-lg shadow-[#e0a842]/25"
              asChild
            >
              <a href={APP_ROUTES.register("expediteur")}>
                Commander un camion
              </a>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white/40 bg-white/5 text-white hover:bg-white/10"
              asChild
            >
              <a href={APP_ROUTES.register("transporteur")}>
                Référencer votre camion
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-4 pt-4"
          >
            <div className="flex -space-x-3">
              {AVATARS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="ring-2 ring-[#012767] rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${item.color} text-white`}>
                      <item.icon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
            </div>
            <div className="text-sm text-white/80">
              <span className="font-semibold text-white">500+</span> transporteurs
              <br />
              <span className="font-semibold text-white">98%</span> satisfaction
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex-1"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl border border-white/20 bg-[#012767]/90 p-6 shadow-2xl backdrop-blur-lg"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#e0a842] animate-pulse" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#e0a842]">
                Vue opérationnelle
              </p>
            </div>
            <p className="mt-2 text-sm font-medium text-white/90">
              Chargement en cours — Port de Cotonou
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/20 bg-white/5 p-3">
                <p className="text-[0.65rem] text-white/60">Mission #TR-4821</p>
                <p className="mt-1 font-semibold text-white">Cotonou → Lomé</p>
                <p className="mt-1 text-xs text-white/80">27T · Marchandises générales</p>
              </div>
              <div className="rounded-lg border border-[#e0a842]/30 bg-[#e0a842]/10 p-3">
                <p className="text-[0.65rem] text-[#e0a842]">Engins mobilisés</p>
                <p className="mt-1 font-semibold text-white">Porte-char + Bulldozer</p>
                <p className="mt-1 text-xs text-white/80">Chantier BTP Grand Nord</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-white/20 bg-white/5 px-3 py-2">
              <span className="text-xs text-white/80">Tracking en temps réel activé</span>
              <span className="h-2 w-2 rounded-full bg-[#e0a842] shadow-[0_0_8px_rgba(224,168,66,0.6)]" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
