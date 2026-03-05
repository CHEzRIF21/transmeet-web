"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star, Lightbulb } from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  fadeUpReduced,
  defaultViewport,
  useReducedMotion,
  springTransition,
} from "@/lib/motion";

const VALUES = [
  {
    icon: Shield,
    title: "Éthique",
    description:
      "Une transparence totale avec les clients, ce qui permet d'instaurer un climat de confiance nécessaire à la bonne marche de nos relations.",
    color: "bg-primary/10 text-primary",
    animation: {
      scale: [1, 1.05, 1],
      transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
    },
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "Un engagement à l'excellence dans l'exécution de nos services, en établissant des normes élevées pour la qualité, les performances et la satisfaction du client.",
    color: "bg-accent/15 text-accent",
    animation: {
      rotate: [0, 15, 0],
      scale: [1, 1.08, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const },
    },
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Mettre la technologie au service de la satisfaction client, en développant des outils digitaux adaptés aux réalités du terrain en Afrique de l'Ouest.",
    color: "bg-primary/10 text-primary",
    animation: {
      opacity: [0.8, 1, 0.8],
      scale: [1, 1.03, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    },
  },
];

export function ValuesSection() {
  const reduced = useReducedMotion();
  const itemVariants = reduced ? fadeUpReduced : fadeUp;

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
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
            Nos valeurs
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ce qui nous guide au quotidien
          </h2>
        </motion.div>
        <motion.div
          className="grid gap-4 sm:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <motion.div key={value.title} variants={itemVariants}>
                <motion.div
                  whileHover={
                    reduced ? undefined : { y: -6, scale: 1.02 }
                  }
                  transition={springTransition}
                >
                  <Card className="group border-primary/10 bg-card hover:shadow-lg">
                    <CardContent className="p-5 space-y-3">
                      <motion.div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${value.color}`}
                        initial={reduced ? undefined : { scale: 0.8, opacity: 0.5 }}
                        whileInView={
                          reduced
                            ? undefined
                            : { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
                        }
                        viewport={defaultViewport}
                        animate={reduced ? undefined : value.animation}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>
                      <h3 className="text-base font-semibold text-foreground">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
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
