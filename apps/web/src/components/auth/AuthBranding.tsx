"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ACCENT_GLOW = "rgba(224, 168, 66, 0.4)";

export function AuthBranding() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        className="relative inline-flex"
      >
        {/* Halo lumineux derrière le cercle */}
        <motion.div
          className="absolute inset-0 -m-6 rounded-full bg-[#e0a842]/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden
        />
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.02, 1],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Cercle avec bordure soignée */}
          <motion.div
            className="relative flex items-center justify-center rounded-full border-2 border-[#e0a842]/80 bg-[#e0a842] p-4 shadow-inner ring-2 ring-[#012767]/20 sm:p-5"
            animate={{
              boxShadow: [
                `0 0 0 0 ${ACCENT_GLOW}`,
                `0 0 28px 6px ${ACCENT_GLOW}`,
                `0 0 0 0 ${ACCENT_GLOW}`,
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Spotlight animé sur le cheval (centre du logo) */}
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-full"
              aria-hidden
            >
              <motion.div
                className="absolute inset-0 opacity-60"
                style={{
                  background: "radial-gradient(circle at 50% 35%, rgba(224,168,66,0.35) 0%, transparent 55%)",
                }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            {/* Shimmer qui traverse le logo */}
            <motion.div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
              aria-hidden
            >
              <motion.div
                className="absolute top-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/45 to-transparent"
                animate={{ x: ["-100%", "250%"] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.div>
            <motion.div
              className="relative z-10 overflow-hidden rounded-xl"
              animate={{
                filter: [
                  "brightness(1) contrast(1) saturate(1)",
                  "brightness(1.08) contrast(1.08) saturate(1.1)",
                  "brightness(1) contrast(1) saturate(1)",
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/images/logo TRANSMEET.jpeg"
                alt="Transmeet"
                width={200}
                height={60}
                className="h-14 w-auto object-contain rounded-xl drop-shadow-lg sm:h-16"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="font-medium text-white/95 drop-shadow-md sm:text-base"
      >
        La plateforme logistique qui connecte expéditeurs et transporteurs.
      </motion.p>
    </div>
  );
}
