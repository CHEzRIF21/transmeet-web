"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  staggerContainer,
  fadeLeft,
  fadeRight,
  fadeLeftReduced,
  fadeRightReduced,
  floatAnimation,
  defaultViewport,
  useReducedMotion,
} from "@/lib/motion";

const PARAGRAPHS = [
  "Transmeet est une plateforme digitale de logistique lourde dédiée au transport de marchandises et à la mise à disposition d'engins BTP. Nous combinons expertise terrain et innovation technologique pour offrir des solutions logistiques fiables, structurées et adaptées aux exigences des professionnels.",
  "Grâce à notre solution de suivi en temps réel (tracking), nos clients bénéficient d'une visibilité complète sur leurs opérations, renforçant ainsi la sécurité, la maîtrise des délais et la transparence.",
  "Notre mission est de fournir des solutions logistiques personnalisées alliant efficacité opérationnelle, sécurité, transparence et conformité réglementaire.",
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
            L&apos;appli pour commander vos camions et engins BTP
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
            <Card className="overflow-hidden border-primary/20 bg-muted/30 shadow-lg">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/QUI_SOMME_NOUS.jpg"
                  alt="Équipe Transmeet - Réseau Afrique de l'Ouest"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
