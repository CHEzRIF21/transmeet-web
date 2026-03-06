"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  staggerContainer,
  fadeLeft,
  fadeRight,
  fadeLeftReduced,
  fadeRightReduced,
  scaleIn,
  scaleInReduced,
  floatAnimation,
  defaultViewport,
  useReducedMotion,
  springTransition,
} from "@/lib/motion";

const PARAGRAPHS = [
  "Transmeet est une plateforme digitale de logistique lourde dédiée au transport de marchandises et à la mise à disposition d'engins BTP. Nous combinons expertise terrain et innovation technologique pour offrir des solutions logistiques fiables, structurées et adaptées aux exigences des professionnels.",
  "Grâce à notre solution de suivi en temps réel (tracking), nos clients bénéficient d'une visibilité complète sur leurs opérations, renforçant ainsi la sécurité, la maîtrise des délais et la transparence.",
  "Notre mission est de fournir des solutions logistiques personnalisées alliant efficacité opérationnelle, sécurité, transparence et conformité réglementaire.",
];

const BADGES = [
  { label: "Hinterland", value: "Niger · Burkina · Mali" },
  { label: "Portuaire", value: "Cotonou · Lomé" },
];

export function AboutSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 15, 0]);
  const leftVariants = reduced ? fadeLeftReduced : fadeLeft;
  const rightVariants = reduced ? fadeRightReduced : fadeRight;
  const badgeVariants = reduced ? scaleInReduced : scaleIn;

  return (
    <section
      ref={sectionRef}
      id="qui-sommes-nous"
      className="mx-auto max-w-6xl scroll-mt-[120px] px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
        <motion.div
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          <motion.p
            variants={leftVariants}
            className="text-sm font-bold uppercase tracking-[0.22em] text-accent"
          >
            Qui sommes-nous ?
          </motion.p>
          <motion.h2
            variants={leftVariants}
            className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Une plateforme logistique dédiée aux projets ambitieux.
          </motion.h2>
          {PARAGRAPHS.map((text, i) => (
            <motion.p
              key={i}
              variants={leftVariants}
              className="text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
        <motion.div
          style={reduced ? undefined : { y: cardY }}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={rightVariants}
        >
          <motion.div animate={reduced ? undefined : floatAnimation}>
            <Card className="border-primary/20 bg-muted/30">
              <CardContent className="p-6 text-base">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Réseau Afrique de l&apos;Ouest
                </p>
                <p className="mt-2 text-muted-foreground">
                  Nous opérons sur les principaux corridors logistiques de
                  l&apos;UEMOA et de la CEDEAO, avec un ancrage fort au Bénin et au
                  Togo.
                </p>
                <motion.div
                  className="mt-4 grid grid-cols-2 gap-3 text-sm"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                >
                  {BADGES.map((badge) => (
                    <motion.div
                      key={badge.label}
                      variants={badgeVariants}
                      whileHover={reduced ? undefined : { scale: 1.03, y: -2 }}
                      transition={springTransition}
                      className="rounded-2xl border border-primary/10 bg-background px-3 py-2 text-foreground shadow-sm cursor-default"
                    >
                      <p className="text-[0.7rem] text-muted-foreground">{badge.label}</p>
                      <p className="mt-1 font-semibold">{badge.value}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
