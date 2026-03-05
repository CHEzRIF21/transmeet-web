"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BTPDevisForm } from "@/components/forms/BTPDevisForm";
import {
  useReducedMotion,
  staggerContainer,
  fadeUp,
  fadeUpReduced,
  springTransition,
  defaultViewport,
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

export default function BTPPage() {
  const reduced = useReducedMotion();
  const itemVariants = reduced ? fadeUpReduced : fadeUp;

  return (
    <section className="relative overflow-hidden bg-primary py-14 text-white">
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
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
            BTP &amp; grands projets
          </p>
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Engins BTP
          </h1>
          <p className="max-w-2xl text-base text-white/90 sm:text-lg">
            Engins de chantier &amp; transport pour vos projets structurants.
            Décrivez votre projet, les engins nécessaires et votre planning.
          </p>
        </div>
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
          <div className="lg:col-span-5">
            <BTPDevisForm />
          </div>
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
                    whileHover={reduced ? undefined : { y: -4, scale: 1.02 }}
                    transition={springTransition}
                  >
                    <Card className="group overflow-hidden border-white/20 bg-white/5 backdrop-blur hover:bg-white/10 hover:shadow-lg hover:shadow-primary/20">
                      <motion.div
                        className="relative aspect-[4/3] w-full overflow-hidden bg-white/10"
                        whileHover={reduced ? undefined : { scale: 1.1 }}
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

