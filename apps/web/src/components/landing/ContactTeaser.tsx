"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  staggerContainer,
  fadeUp,
  fadeUpReduced,
  defaultViewport,
  useReducedMotion,
} from "@/lib/motion";

export function ContactTeaser() {
  const reduced = useReducedMotion();
  const itemVariants = reduced ? fadeUpReduced : fadeUp;

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={staggerContainer}
      >
        <motion.div
          variants={itemVariants}
          initial={reduced ? undefined : { opacity: 0, y: 24, scale: 0.97 }}
          whileInView={
            reduced
              ? undefined
              : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
          }
          viewport={defaultViewport}
        >
          <Card className="relative overflow-hidden border-primary/20 bg-primary shadow-lg">
            <CardContent className="flex flex-col gap-4 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-10">
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
                    Contact &amp; accompagnement
                  </p>
                  <h2 className="text-balance text-xl font-semibold tracking-tight sm:text-2xl">
                    Un projet, une urgence ou un besoin récurrent ?
                  </h2>
                  <p className="max-w-xl text-sm text-white/90 sm:text-base">
                    Parlez-nous de vos flux et de vos contraintes, nous vous
                    proposerons une approche sur-mesure pour vos opérations
                    logistiques.
                  </p>
                </div>
                {!reduced && (
                  <motion.div
                    className="hidden flex-shrink-0 sm:flex sm:items-center sm:justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
                      <MessageCircle className="h-7 w-7" />
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <motion.div
                  animate={
                    reduced
                      ? undefined
                      : {
                          rotate: [0, -1, 1, -1, 0],
                          transition: {
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                        }
                  }
                  className="inline-block"
                >
                  <Button
                    variant="accent"
                    size="lg"
                    className="text-accent-foreground"
                    asChild
                  >
                    <Link href="/contact">Nous contacter</Link>
                  </Button>
                </motion.div>
                <p className="text-xs text-white/70">
                  Ou en direct via WhatsApp et téléphone.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
