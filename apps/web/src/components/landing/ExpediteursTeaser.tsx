"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { APP_ROUTES } from "@/lib/config";
import { Button } from "@/components/ui/button";

const DIAMOND_IMAGES = [
  { src: "/images/cereale 1.jpg", alt: "Transport de céréales" },
  { src: "/images/3def2e57faeadd9ec2a121303618a34a.jpg", alt: "Logistique et Transport" },
  { src: "/images/794f43aa25c5663703725cb1332e7a74.jpg", alt: "Camions sur la route" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

function DiamondImage({
  src,
  alt,
  size = "default",
}: {
  src: string;
  alt: string;
  size?: "default" | "sm";
}) {
  const base = size === "sm" ? "h-24 w-24" : "h-36 w-36 md:h-44 md:w-44 lg:h-48 lg:w-48";
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
            sizes={size === "sm" ? "96px" : "(max-width: 1024px) 176px, 192px"}
          />
        </div>
      </div>
    </div>
  );
}

export function ExpediteursTeaser() {
  return (
    <section id="expediteurs" className="relative scroll-mt-[120px] overflow-hidden bg-gradient-to-br from-[#012767] via-[#01306e] to-[#021e4a] py-16">
      {/* Decorative diagonal shapes - gold accent */}
      <div
        className="hidden md:block absolute -left-20 -top-20 h-64 w-64 rotate-45 border-2 border-[#e0a842]/40"
        aria-hidden
      />
      <div
        className="hidden md:block absolute -bottom-16 -right-16 h-48 w-48 rotate-45 border-2 border-[#e0a842]/30"
        aria-hidden
      />
      
      {/* Diagonales or en fond des losanges */}
      <div 
        className="hidden md:block absolute right-[15%] top-0 h-full w-4 rotate-45 bg-[#e0a842]/80"
        aria-hidden
      />
      <div 
        className="hidden md:block absolute right-[35%] top-0 h-full w-2 rotate-45 bg-[#e0a842]/60"
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
            Pour les expéditeurs
          </motion.p>
          <motion.h2
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Expéditeurs, profitez d&apos;une communauté de transporteurs fiables et rigoureux pour vos besoins en transport.
          </motion.h2>
          <motion.p
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-balance text-base text-white/90 sm:text-lg"
          >
            Inscrivez-vous et votre équipe vous recontactera dans les meilleurs délais.
          </motion.p>
          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 inline-block"
          >
            <Button
              size="xl"
              variant="accent"
              className="shadow-lg shadow-[#e0a842]/30"
              asChild
            >
              <Link href={APP_ROUTES.register("expediteur")}>
                Commander votre camion
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Right column - Diamond image layout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative hidden min-h-[360px] md:block lg:min-h-[420px]"
        >
          {/* Diamond 1 - top-left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute left-[15%] top-[15%] -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <DiamondImage src={DIAMOND_IMAGES[0].src} alt={DIAMOND_IMAGES[0].alt} />
          </motion.div>
          {/* Diamond 2 - center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <DiamondImage src={DIAMOND_IMAGES[1].src} alt={DIAMOND_IMAGES[1].alt} />
          </motion.div>
          {/* Diamond 3 - bottom-right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute left-[85%] top-[85%] -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <DiamondImage src={DIAMOND_IMAGES[2].src} alt={DIAMOND_IMAGES[2].alt} />
          </motion.div>
        </motion.div>

        {/* Mobile: diamonds below text in a row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-6 md:hidden py-4 overflow-hidden"
        >
          {DIAMOND_IMAGES.map((img, i) => (
            <DiamondImage
              key={img.src}
              src={img.src}
              alt={img.alt}
              size="sm"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
