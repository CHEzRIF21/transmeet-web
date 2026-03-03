"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";
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

export function ExpediteursTeaser() {
  const reduced = useReducedMotion();
  const itemVariants = reduced ? fadeUpReduced : fadeUp;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={staggerContainer}
      >
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-primary/20 bg-white shadow-lg">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <motion.div
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                >
                  <motion.p
                    variants={itemVariants}
                    className="text-xs font-semibold uppercase tracking-[0.22em] text-accent"
                  >
                    Pour les expéditeurs
                  </motion.p>
                  <motion.h2
                    variants={itemVariants}
                    className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                  >
                    Expéditeurs, profitez d&apos;une communauté de transporteurs
                    fiables et rigoureux pour vos besoins en transport.
                  </motion.h2>
                  <motion.p
                    variants={itemVariants}
                    className="text-sm text-muted-foreground sm:text-base"
                  >
                    Inscrivez-vous et votre équipe vous recontactera dans les
                    meilleurs délais.
                  </motion.p>
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
                        <Link href={APP_ROUTES.register("expediteur")}>
                          Commander votre camion
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
                {!reduced && (
                  <motion.div
                    className="hidden flex-shrink-0 sm:flex sm:items-center sm:justify-center"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
                      animate={{
                        x: [0, 8, 0],
                        transition: {
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                          transition: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }}
                      >
                        <Truck className="h-8 w-8" />
                      </motion.div>
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
