"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUp,
  fadeUpReduced,
  defaultViewport,
  useReducedMotion,
  springTransition,
} from "@/lib/motion";

const TRUCK_TYPES = [
  {
    name: "Conteneur",
    src: "/images/conteneur.png",
    textClass: "text-[#6A8DFF]",
    pulseClass: "from-[#5C7CFF]/45 to-[#2C5BFF]/10",
    animation: { y: [0, -6, 0], rotate: [0, 0.9, 0], transition: { duration: 2.7, repeat: Infinity, ease: "easeInOut" as const } },
  },
  {
    name: "Plateau",
    src: "/images/plateau.png",
    textClass: "text-[#6A8DFF]",
    pulseClass: "from-[#5C7CFF]/45 to-[#2C5BFF]/10",
    animation: { y: [0, -5, 0], rotate: [0, -1.2, 0], transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const } },
  },
  {
    name: "Citerne",
    src: "/images/citerne.png",
    textClass: "text-[#6A8DFF]",
    pulseClass: "from-[#5C7CFF]/45 to-[#2C5BFF]/10",
    animation: { y: [0, -6, 0], rotate: [0, 1, 0], transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const } },
  },
  {
    name: "Benne",
    src: "/images/benne.png",
    textClass: "text-[#6A8DFF]",
    pulseClass: "from-[#8BC5FF]/50 to-[#4A9BFF]/15",
    animation: { y: [0, -6, 0], rotate: [0, -1, 0], transition: { duration: 2.3, repeat: Infinity, ease: "easeInOut" as const } },
  },
  {
    name: "Frigo",
    src: "/images/frigo.png",
    textClass: "text-[#F6BE52]",
    pulseClass: "from-[#F2AE4A]/55 to-[#D98B26]/15",
    animation: { y: [0, -7, 0], scale: [1, 1.03, 1], transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" as const } },
  },
  {
    name: "Marchandise",
    src: "/images/Marchandise.png",
    textClass: "text-[#F6BE52]",
    pulseClass: "from-[#F2AE4A]/55 to-[#D98B26]/15",
    animation: { y: [0, -7, 0], scale: [1, 1.03, 1], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const } },
  },
];

export function TruckTypesSection() {
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
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Nous avons forcément le camion dont vous avez besoin
          </h2>
        </motion.div>
        <motion.div
          className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ ...defaultViewport, amount: 0.3 }}
        >
          {TRUCK_TYPES.map((item) => (
            <motion.div key={item.name} variants={itemVariants} className="flex flex-col items-center text-center">
              <motion.div
                className="relative flex h-28 w-28 items-center justify-center"
                whileHover={reduced ? undefined : { y: -6, scale: 1.05, rotate: -1 }}
                transition={springTransition}
              >
                {!reduced && (
                  <>
                    <motion.span
                      className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${item.pulseClass} blur-md`}
                      animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.55, 0.2, 0.55] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.span
                      className="absolute -right-1 top-2 h-1.5 w-1.5 rounded-full bg-white/70"
                      animate={{ y: [0, -5, 0], opacity: [0.3, 0.9, 0.3] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.span
                      className="absolute left-2 top-1.5 h-1 w-1 rounded-full bg-white/50"
                      animate={{ y: [0, 4, 0], opacity: [0.25, 0.8, 0.25] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                  </>
                )}
                <motion.div
                  className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5 transition-all duration-300 hover:shadow-lg"
                  animate={reduced ? undefined : item.animation}
                  transition={reduced ? undefined : springTransition}
                >
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </motion.div>
              </motion.div>
              <p className={`mt-2 text-lg font-semibold tracking-tight ${item.textClass}`}>
                {item.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
