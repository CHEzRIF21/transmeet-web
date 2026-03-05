"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";
import { APP_ROUTES } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  staggerContainer,
  fadeUp,
  fadeUpReduced,
  defaultViewport,
  useReducedMotion,
} from "@/lib/motion";

const BULLET_POINTS = [
  "Missions récurrentes adaptées à votre flotte",
  "Visibilité régionale et nouveaux clients",
  "Support logistique et administratif",
];

const fadeRightVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const fadeRightReducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export function TransporteursTeaser() {
  const reduced = useReducedMotion();
  const itemVariants = reduced ? fadeUpReduced : fadeUp;
  const bulletVariants = reduced ? fadeRightReducedVariants : fadeRightVariants;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={staggerContainer}
      >
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-primary/10 bg-muted/30 shadow-lg">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-4">
                  <motion.p
                    variants={itemVariants}
                    className="text-sm font-bold uppercase tracking-[0.22em] text-accent"
                  >
                    Pour les transporteurs
                  </motion.p>
                  <motion.h2
                    variants={itemVariants}
                    className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                  >
                    Boostez votre activité et augmentez vos revenus avec Transmeet.
                  </motion.h2>
                  <motion.p
                    variants={itemVariants}
                    className="text-sm text-muted-foreground sm:text-base"
                  >
                    Accédez à des missions régulières, des clients fiables et une
                    visibilité régionale sur les corridors stratégiques. Nous
                    sécurisons la relation commerciale pour vous concentrer sur
                    l&apos;exploitation.
                  </motion.p>
                  <motion.ul
                    className="mt-4 space-y-1 text-sm text-muted-foreground"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={defaultViewport}
                  >
                    {BULLET_POINTS.map((text) => (
                      <motion.li key={text} variants={bulletVariants}>
                        • {text}
                      </motion.li>
                    ))}
                  </motion.ul>
                  <motion.div variants={itemVariants} className="mt-6">
                    <motion.div
                      animate={
                        reduced
                          ? undefined
                          : {
                              boxShadow: [
                                "0 4px 14px 0 rgba(224, 168, 66, 0.25)",
                                "0 6px 20px 0 rgba(224, 168, 66, 0.35)",
                                "0 4px 14px 0 rgba(224, 168, 66, 0.25)",
                              ],
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              },
                            }
                      }
                      className="inline-block rounded-md"
                    >
                      <Button variant="accent" size="lg" asChild>
                        <Link href={APP_ROUTES.register("transporteur")}>
                          Référencer mon camion
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
                {!reduced && (
                  <motion.div
                    className="hidden flex-shrink-0 sm:flex sm:items-center sm:justify-center"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                      animate={{
                        scale: [1, 1.08, 1],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      <UserCheck className="h-8 w-8" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
