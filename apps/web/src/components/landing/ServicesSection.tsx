"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileCheck,
  ArrowLeftRight,
  Anchor,
  Globe,
  Handshake,
  BarChart3,
} from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  fadeUpReduced,
  defaultViewport,
  useReducedMotion,
  springTransition,
} from "@/lib/motion";

const SERVICES = [
  {
    icon: FileCheck,
    title: "Formalités douanières",
    desc: "Préparation et suivi des dossiers, conformité réglementaire sur les principaux corridors.",
    animation: { rotate: [0, -3, 0, 3, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } },
  },
  {
    icon: ArrowLeftRight,
    title: "Transit marchandises",
    desc: "Gestion des flux import / export, coordination avec transitaires et entrepôts.",
    animation: { x: [-3, 3, -3], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const } },
  },
  {
    icon: Anchor,
    title: "Logistique portuaire",
    desc: "Coordination des sorties portuaires, rendez-vous camions, optimisation temps de séjour.",
    animation: { rotate: [-5, 5, -5], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const } },
  },
  {
    icon: Globe,
    title: "Transport inter-pays",
    desc: "Opérations multi-pays au sein de l'UEMOA / CEDEAO, gestion des frontières.",
    animation: { rotate: [0, 360], transition: { duration: 20, repeat: Infinity, ease: "linear" as const } },
  },
  {
    icon: Handshake,
    title: "Coordination commerciale",
    desc: "Interface sécurisée entre acheteurs, vendeurs et transporteurs pour les flux sensibles.",
    animation: { scale: [1, 1.05, 1], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const } },
  },
  {
    icon: BarChart3,
    title: "Suivi & reporting",
    desc: "Traçabilité des missions, notifications et tableaux de bord pour vos équipes.",
    animation: { y: [2, -2, 2], scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const } },
  },
];

export function ServicesSection() {
  const reduced = useReducedMotion();
  const itemVariants = reduced ? fadeUpReduced : fadeUp;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="space-y-8">
        <motion.div
          className="space-y-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Services complémentaires
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Bien plus qu&apos;un simple transport.
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Transmeet se positionne comme un intermédiaire logistique
            intelligent, capable de piloter l&apos;ensemble de la chaîne :
            formalités, transit, coordination commerciale et opérations terrain.
          </p>
        </motion.div>
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.title} variants={itemVariants}>
                <motion.div
                  whileHover={reduced ? undefined : { y: -6, scale: 1.02 }}
                  transition={springTransition}
                  onHoverStart={() => !reduced && setHoveredCard(service.title)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className="group border-primary/10 bg-card overflow-visible">
                    <CardContent className="p-5 space-y-3">
                      <motion.div
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"
                        animate={
                          reduced
                            ? undefined
                            : hoveredCard === service.title
                              ? { ...service.animation, scale: 1.15 }
                              : service.animation
                        }
                        transition={springTransition}
                      >
                        <Icon className="h-4 w-4 text-primary" />
                      </motion.div>
                      <h3 className="text-sm font-semibold text-foreground">
                        {service.title}
                      </h3>
                      <p className="text-xs text-muted-foreground sm:text-sm leading-relaxed">
                        {service.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
