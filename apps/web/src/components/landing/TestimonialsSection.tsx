"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import {
  staggerContainer,
  fadeUp,
  fadeUpReduced,
  scaleIn,
  scaleInReduced,
  defaultViewport,
  useReducedMotion,
  springTransition,
} from "@/lib/motion";

const TESTIMONIALS = [
  {
    quote:
      "Transmeet nous a permis de fiabiliser nos flux vers le Niger avec des transporteurs sélectionnés et un suivi opérationnel en temps réel.",
    name: "Kofi Mensah",
    role: "Responsable logistique",
    company: "Groupe agroalimentaire",
    initials: "KM",
  },
  {
    quote:
      "En tant que transporteur, nous apprécions la clarté des missions et la qualité de la relation avec les expéditeurs partenaires.",
    name: "Amadou Diallo",
    role: "Dirigeant flotte poids lourds",
    company: "Société de transport",
    initials: "AD",
  },
  {
    quote:
      "Pour nos chantiers BTP, la mobilisation des engins et des camions est devenue beaucoup plus fluide et prévisible.",
    name: "Seydou Traoré",
    role: "Directeur de projet",
    company: "Entreprise de construction",
    initials: "ST",
  },
];

const quoteBlurFade = {
  hidden: { opacity: 0, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const figureSlideUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.2 },
  },
};

export function TestimonialsSection() {
  const reduced = useReducedMotion();
  const itemVariants = reduced ? fadeUpReduced : fadeUp;
  const quoteVariants = reduced ? scaleInReduced : scaleIn;

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
            Témoignages
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ils nous font confiance.
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Entreprises industrielles, importateurs, acteurs BTP et transporteurs
            s&apos;appuient sur Transmeet pour sécuriser leurs opérations.
          </p>
        </motion.div>
        <motion.div
          className="grid gap-4 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={itemVariants}>
              <motion.div
                whileHover={
                  reduced ? undefined : { y: -4, scale: 1.02 }
                }
                transition={springTransition}
              >
                <Card className="group border-primary/10 bg-card hover:shadow-lg">
                  <CardContent className="flex flex-col justify-between p-5 h-full">
                    <div className="space-y-3">
                      <motion.div
                        variants={quoteVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={defaultViewport}
                        className="inline-flex"
                      >
                        <motion.span
                          animate={
                            reduced
                              ? undefined
                              : {
                                  rotate: [0, -2, 0],
                                  transition: {
                                    duration: 0.5,
                                    delay: 0.2,
                                  },
                                }
                          }
                        >
                          <Quote className="h-5 w-5 text-accent" />
                        </motion.span>
                      </motion.div>
                      <motion.blockquote
                        className="text-sm text-muted-foreground leading-relaxed"
                        variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : quoteBlurFade}
                        initial="hidden"
                        whileInView="visible"
                        viewport={defaultViewport}
                      >
                        &ldquo;{t.quote}&rdquo;
                      </motion.blockquote>
                    </div>
                    <motion.figure
                      className="mt-5 flex items-center gap-3"
                      variants={reduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : figureSlideUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={defaultViewport}
                    >
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                        {!reduced && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-primary/40"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 0, 0.5],
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              },
                            }}
                          />
                        )}
                        <motion.div
                          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-white"
                          whileHover={
                            reduced ? undefined : { scale: 1.1 }
                          }
                          transition={springTransition}
                        >
                          {t.initials}
                        </motion.div>
                      </div>
                      <figcaption className="text-xs">
                        <div className="font-semibold text-foreground">
                          {t.name}
                        </div>
                        <div className="text-muted-foreground">{t.role}</div>
                        <div className="text-muted-foreground/70">
                          {t.company}
                        </div>
                      </figcaption>
                    </motion.figure>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
