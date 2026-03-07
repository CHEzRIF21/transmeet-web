"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CAROUSEL_IMAGES = [
  { src: "/images/engin btp2.jpg", alt: "Engins BTP" },
  { src: "/images/3def2e57faeadd9ec2a121303618a34a.jpg", alt: "Logistique et Transport" },
  { src: "/images/cereale 1.jpg", alt: "Transport de céréales" },
  { src: "/images/794f43aa25c5663703725cb1332e7a74.jpg", alt: "Camions sur la route" },
];

const CAROUSEL_INTERVAL_MS = 5000;

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Carousel background */}
      <div className="absolute inset-0 z-0">
        {CAROUSEL_IMAGES.map((img, i) => (
          <div
            key={img.src + i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === currentIndex ? 1 : 0 }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
        {/* Overlay léger côté gauche uniquement pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center gap-10 px-4 py-20 sm:px-6 md:flex-row md:items-center md:gap-16">
        <div className="max-w-xl space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
          >
            Transmeet : Votre partenaire en transport et logistique lourde
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-balance text-base text-white/90 sm:text-lg"
          >
            Commandez votre camion
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <Button
              size="xl"
              variant="accent"
              className="shadow-lg shadow-accent/25"
              asChild
            >
              <Link href="/expediteurs">
                Commander un camion
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-white/40 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/transporteurs">
                Référencer votre camion
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Floating info card */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex-1"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl border border-white/20 bg-[#012767]/90 p-6 shadow-2xl backdrop-blur-lg"
          >
            <p className="text-sm font-medium text-white/95 sm:text-base">
              Plateforme digitale de mise en relation entre expéditeurs et
              transporteurs professionnels.
            </p>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-white/20 bg-white/5 px-3 py-2">
              <span className="text-xs text-white/90">Tracking en temps réel</span>
              <span className="h-2 w-2 rounded-full bg-[#e0a842] shadow-[0_0_8px_rgba(224,168,66,0.6)]" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Carousel indicators — accessible 44px touch targets */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1} sur ${CAROUSEL_IMAGES.length}`}
            aria-pressed={i === currentIndex}
            className="flex h-11 w-11 items-center justify-center"
            onClick={() => setCurrentIndex(i)}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "h-2 w-6 bg-accent"
                  : "h-2 w-2 bg-white/50 hover:bg-white/75"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
