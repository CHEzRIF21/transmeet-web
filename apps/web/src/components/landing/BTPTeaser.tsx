"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  staggerContainer,
  fadeLeft,
  fadeLeftReduced,
  fadeUp,
  fadeUpReduced,
  defaultViewport,
  useReducedMotion,
  springTransition,
} from "@/lib/motion";

const ENGIN_LIST = [
  {
    name: "Pelleteuse",
    detail: "Terrassement & excavation",
    tag: "Terrassement",
    src: "/images/63996c3791404e0921a6a737d1d89fcc.jpg",
  },
  {
    name: "Bulldozer",
    detail: "Décapage & nivellement",
    tag: "Nivellement",
    src: "/images/Bulldozer.jpg",
  },
  {
    name: "Compacteur",
    detail: "Compactage des sols",
    tag: "Compactage",
    src: "/images/14b4d163199b80aa2464502e8f149040.jpg",
  },
  {
    name: "Camion toupie",
    detail: "Transport de béton",
    tag: "Béton",
    src: "/images/e523cbfe01b13f34a7e07bb5af9a5fc1.jpg",
  },
  {
    name: "Chariot élévateur",
    detail: "Manutention de charges",
    tag: "Manutention",
    src: "/images/2c74333ebe9b9898b95cd8f9dee244f5.jpg",
  },
  {
    name: "Flotte BTP",
    detail: "Mobilisation lourde",
    tag: "Flotte",
    src: "/images/engin btp2.jpg",
  },
];

const badgeSlideUp = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.2 },
  },
};

export function BTPTeaser() {
  const reduced = useReducedMotion();
  const leftVariants = reduced ? fadeLeftReduced : fadeLeft;
  const itemVariants = reduced ? fadeUpReduced : fadeUp;

  return (
    <section id="btp" className="relative overflow-hidden bg-primary py-14 text-white">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(224,168,66,0.12),_transparent_55%)]"
        animate={
          reduced
            ? undefined
            : {
                opacity: [0.9, 1, 0.9],
                transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              }
        }
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <motion.div
            className="lg:col-span-5 space-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainer}
          >
            <motion.p
              variants={leftVariants}
              className="text-sm font-bold uppercase tracking-[0.22em] text-accent"
            >
              BTP &amp; grands projets
            </motion.p>
            <motion.h2
              variants={leftVariants}
              className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Location et transport d&apos;engins de chantier pour vos projets
              BTP.
            </motion.h2>
            <motion.p
              variants={leftVariants}
              className="text-sm text-white/90 sm:text-base"
            >
              Efficacité, rapidité et sécurité garanties sur vos chantiers
              routiers, industriels et immobiliers. Nous gérons la mobilisation
              des engins, le transport et la coordination logistique.
            </motion.p>
            <motion.div variants={leftVariants}>
              <Button
                variant="accent"
                size="lg"
                className="text-accent-foreground"
                asChild
              >
                <Link href="/btp">Demander un devis BTP</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {ENGIN_LIST.map((engin) => (
                <motion.div key={engin.name} variants={itemVariants}>
                  <motion.div
                    whileHover={
                      reduced ? undefined : { y: -4, scale: 1.02 }
                    }
                    transition={springTransition}
                  >
                    <Card className="group overflow-hidden border-white/20 bg-white/5 backdrop-blur hover:bg-white/10 hover:shadow-lg hover:shadow-primary/20">
                      <motion.div
                        className="relative aspect-[4/3] w-full overflow-hidden bg-white/10"
                        whileHover={
                          reduced ? undefined : { scale: 1.1 }
                        }
                        transition={springTransition}
                      >
                        <Image
                          src={engin.src}
                          alt={engin.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                        <motion.div
                          className="absolute bottom-2 left-2"
                          variants={badgeSlideUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={defaultViewport}
                        >
                          <span className="rounded-full bg-accent/90 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-primary">
                            {engin.tag}
                          </span>
                        </motion.div>
                      </motion.div>
                      <CardContent className="p-4">
                        <p className="text-base font-semibold text-white">
                          {engin.name}
                        </p>
                        <p className="mt-1 text-sm text-white/70 line-clamp-2">
                          {engin.detail}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
