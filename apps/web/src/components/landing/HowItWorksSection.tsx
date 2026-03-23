"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  FilePenLine,
  Search,
  CircleCheck,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  defaultViewport,
  useReducedMotion,
  springTransition,
} from "@/lib/motion";

interface Step {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
}

const STEPS: Step[] = [
  {
    id: "1",
    icon: FilePenLine,
    title: "Soumettez votre besoin",
    description:
      "Remplissez le formulaire en ligne : origine, destination, type de marchandise, tonnage.",
    href: "/register",
  },
  {
    id: "2",
    icon: Search,
    title: "Recevez des offres",
    description:
      "L'équipe Transmeet sélectionne les meilleurs transporteurs et vous soumet des propositions.",
  },
  {
    id: "3",
    icon: CircleCheck,
    title: "Confirmez la mission",
    description:
      "Acceptez l'offre qui vous convient. Le transporteur est notifié instantanément.",
    href: "/login",
  },
  {
    id: "4",
    icon: MapPin,
    title: "Suivez en temps réel",
    description:
      "Tracking GPS, messagerie intégrée, mise à jour du statut jusqu'à la livraison.",
  },
];

/** Stagger un peu plus marqué pour cette section */
const stepsStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.15,
    },
  },
};

const stepsItemSpring: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 340,
      damping: 26,
      mass: 0.85,
    },
  },
};

const stepsItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/** Avatar d’étape : bleu Transmit, propre, avec halo animé (désactivé si reduced motion) */
function StepIconAvatar({
  Icon,
  reduced,
  index,
}: {
  Icon: LucideIcon;
  reduced: boolean;
  index: number;
}) {
  const floatDuration = 3.1 + index * 0.22;

  return (
    <div className="relative flex shrink-0">
      {/* Halo doux derrière — reste dans les bleus */}
      {!reduced ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-3 rounded-[1.35rem] bg-gradient-to-br from-[#012767]/35 via-primary/25 to-sky-500/20 blur-2xl"
          animate={{
            opacity: [0.35, 0.55, 0.35],
            scale: [0.96, 1.04, 0.96],
          }}
          transition={{
            duration: 2.6 + index * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ) : null}

      <motion.div
        className="relative"
        animate={
          reduced
            ? undefined
            : {
                y: [0, -5, 0],
              }
        }
        transition={{
          duration: floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/25 bg-gradient-to-br from-[#012767]/22 via-primary/14 to-sky-500/10 shadow-[0_8px_30px_-8px_rgba(1,39,103,0.35)] ring-2 ring-primary/20 ring-offset-2 ring-offset-card sm:h-[3.75rem] sm:w-[3.75rem] sm:rounded-[1.15rem]"
          whileHover={
            reduced
              ? undefined
              : {
                  scale: 1.07,
                  boxShadow:
                    "0 14px 40px -10px rgba(1, 39, 103, 0.4), 0 0 0 1px rgba(1, 39, 103, 0.12)",
                }
          }
          transition={springTransition}
        >
          <motion.div
            className="flex items-center justify-center"
            whileHover={reduced ? undefined : { scale: 1.12, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <Icon
              className="h-[1.35rem] w-[1.35rem] text-[#012767] drop-shadow-[0_1px_2px_rgba(1,39,103,0.2)] sm:h-7 sm:w-7"
              strokeWidth={1.65}
              aria-hidden
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const reduced = useReducedMotion();
  const Icon = step.icon;

  const content = (
    <motion.div
      whileHover={
        reduced
          ? undefined
          : {
              y: -8,
              scale: 1.025,
              transition: { type: "spring", stiffness: 380, damping: 22 },
            }
      }
      whileTap={reduced ? undefined : { scale: 0.99 }}
      className="h-full"
    >
      <Card className="group h-full border-primary/10 bg-card transition-[border-color,box-shadow] duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10">
        <CardContent className="flex h-full flex-col space-y-4 p-5 sm:p-6">
          <StepIconAvatar Icon={Icon} reduced={reduced} index={index} />
          <h3 className="text-base font-semibold text-foreground">
            {step.title}
          </h3>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>
          {step.href ? (
            <motion.span
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 group-hover:underline"
              whileHover={reduced ? undefined : { x: 3 }}
              transition={springTransition}
            >
              {step.href === "/register"
                ? "Créer un compte"
                : "Se connecter"}
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </motion.span>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (step.href) {
    return (
      <Link
        href={step.href}
        className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function HowItWorksSection() {
  const reduced = useReducedMotion();
  const itemVariants = reduced ? stepsItemReduced : stepsItemSpring;

  return (
    <section
      id="comment-ca-marche"
      className="mx-auto max-w-6xl scroll-mt-[120px] px-4 py-12 sm:px-6 sm:py-16"
      aria-labelledby="how-it-works-heading"
    >
      <div className="space-y-8 sm:space-y-10">
        <motion.div
          className="space-y-3 text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={defaultViewport}
          transition={
            reduced
              ? { duration: 0.45, ease: "easeOut" }
              : { type: "spring", stiffness: 280, damping: 28, mass: 0.9 }
          }
        >
          <motion.p
            className="text-sm font-bold uppercase tracking-[0.22em] text-accent"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={defaultViewport}
            transition={{ delay: 0.05, ...springTransition }}
          >
            Comment ça marche
          </motion.p>
          <h2
            id="how-it-works-heading"
            className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            En 4 étapes simples
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Du formulaire à la livraison, un parcours clair et accompagné par
            l&apos;équipe Transmeet.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          role="list"
          aria-label="Les quatre étapes du parcours Transmeet"
          variants={stepsStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
        >
          {STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              role="listitem"
              variants={itemVariants}
              className="min-w-0"
            >
              <StepCard step={step} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
