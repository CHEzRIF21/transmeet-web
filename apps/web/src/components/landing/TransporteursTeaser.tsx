"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HERO_IMAGE = {
  src: "/images/transporteur-professionnel.png",
  alt: "Transporteur professionnel - Transmeet",
};

const BULLET_POINTS = [
  "Missions récurrentes adaptées à votre flotte",
  "Visibilité régionale et nouveaux clients",
  "Support logistique et administratif",
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

/** Image en losange - même affichage que la section expéditeurs */
function DiamondImage({
  src,
  alt,
  size = "default",
}: {
  src: string;
  alt: string;
  size?: "default" | "sm" | "lg";
}) {
  const base =
    size === "sm"
      ? "h-24 w-24"
      : size === "lg"
        ? "h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96"
        : "h-36 w-36 md:h-44 md:w-44 lg:h-48 lg:w-48";
  return (
    <div
      className={`relative ${base} rotate-45 overflow-hidden border-4 border-white shadow-2xl`}
    >
      <div
        className="absolute left-1/2 top-1/2 h-[141%] w-[141%] -translate-x-1/2 -translate-y-1/2 -rotate-45"
        style={{ minWidth: "141%", minHeight: "141%" }}
      >
        <div className="relative size-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={
              size === "sm"
                ? "96px"
                : size === "lg"
                  ? "(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                  : "(max-width: 1024px) 176px, 192px"
            }
          />
        </div>
      </div>
    </div>
  );
}

export function TransporteursTeaser() {
  return (
    <section id="transporteurs" className="relative scroll-mt-[120px] overflow-hidden bg-gradient-to-br from-[#021e4a] via-[#01306e] to-[#012767] py-16">
      {/* Decorative diagonal shapes - gold accent */}
      <div
        className="hidden md:block absolute -left-20 -bottom-20 h-64 w-64 rotate-45 border-2 border-[#e0a842]/40"
        aria-hidden
      />
      <div
        className="hidden md:block absolute -top-16 -right-16 h-48 w-48 rotate-45 border-2 border-[#e0a842]/30"
        aria-hidden
      />
      
      {/* Diagonales or en fond des losanges */}
      <div 
        className="hidden md:block absolute right-[25%] top-0 h-full w-4 rotate-45 bg-[#e0a842]/80"
        aria-hidden
      />
      <div 
        className="hidden md:block absolute right-[45%] top-0 h-full w-2 rotate-45 bg-[#e0a842]/60"
        aria-hidden
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 md:grid-cols-2 md:gap-16">
        {/* Left column */}
        <div className="flex max-w-xl flex-col space-y-6">
          <motion.p
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-sm font-bold uppercase tracking-[0.22em] text-[#e0a842]"
          >
            Pour les transporteurs
          </motion.p>
          <motion.h2
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Boostez votre activité et augmentez vos revenus avec Transmeet.
          </motion.h2>
          <motion.p
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-balance text-base text-white/90 sm:text-lg"
          >
            Accédez à des missions régulières, des clients fiables et une visibilité régionale sur les corridors stratégiques. Nous sécurisons la relation commerciale pour vous concentrer sur l&apos;exploitation.
          </motion.p>
          
          <motion.ul
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            className="space-y-2 text-base text-white/90"
          >
            {BULLET_POINTS.map((text, idx) => (
              <motion.li
                key={idx}
                variants={{
                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 },
                }}
                className="flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#e0a842]" />
                {text}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 inline-block"
          >
            <Button
              size="xl"
              variant="accent"
              className="shadow-lg shadow-[#e0a842]/30"
              asChild
            >
              <Link href="/transporteurs">
                Référencer mon camion
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Right column - Losange (même affichage que la section expéditeurs) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative hidden min-h-[360px] md:flex lg:min-h-[420px] md:items-center md:justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center"
          >
            <DiamondImage
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              size="lg"
            />
          </motion.div>
        </motion.div>

        {/* Mobile: single image below text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center md:hidden py-4 overflow-hidden"
        >
          <DiamondImage
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            size="lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
