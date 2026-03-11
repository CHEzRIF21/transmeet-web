"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  staggerContainer,
  fadeUp,
  fadeUpReduced,
  defaultViewport,
  useReducedMotion,
} from "@/lib/motion";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  WHATSAPP_NUMBER,
} from "@/lib/config";

const FACEBOOK_URL = "https://facebook.com/transmeet";
const TIKTOK_URL = "https://tiktok.com/@transmeet_officiel";

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.865 9.865 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IconTikTok({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const CONTACT_CARDS = [
  {
    icon: IconWhatsApp,
    title: "WhatsApp",
    subtitle: "Réponse en quelques minutes",
    detail: "Bénin / Togo",
    buttonLabel: "Discuter",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    iconColor: "text-[#25D366]",
  },
  {
    icon: Phone,
    title: "Téléphone",
    subtitle: CONTACT_PHONE,
    detail: "Profil Transmeet",
    buttonLabel: "Appeler",
    href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`,
    iconColor: "text-primary",
  },
  {
    icon: Facebook,
    title: "Facebook",
    subtitle: "Profil Transmeet",
    detail: "",
    buttonLabel: "Suivre",
    href: FACEBOOK_URL,
    iconColor: "text-[#1877F2]",
  },
  {
    icon: IconTikTok,
    title: "TikTok",
    subtitle: "@transmeet_officiel",
    detail: "",
    buttonLabel: "Suivre",
    href: TIKTOK_URL,
    iconColor: "text-foreground",
  },
];

export function ContactTeaser() {
  const reduced = useReducedMotion();
  const itemVariants = reduced ? fadeUpReduced : fadeUp;

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const nom = formData.get("nom")?.toString() || "";
    const entreprise = formData.get("entreprise")?.toString() || "";
    const typeMarchandise = formData.get("typeMarchandise")?.toString() || "";
    const message = formData.get("message")?.toString() || "";
    const subject = `[Transmeet] Demande depuis l'accueil - ${entreprise || nom}`;
    const body = `Nom: ${nom}\nEntreprise: ${entreprise}\nType de marchandise: ${typeMarchandise}\n\nMessage:\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="contact"
      className="relative mx-auto max-w-6xl scroll-mt-[120px] overflow-hidden px-4 pb-12 sm:px-6 sm:pb-16"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={staggerContainer}
        className="space-y-0"
      >
        {/* Hero bandeau */}
        <motion.div
          variants={itemVariants}
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          whileInView={
            reduced
              ? undefined
              : { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }
          viewport={defaultViewport}
          className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-[#012767] via-[#01306e] to-[#021e4a] px-6 py-12 text-white sm:px-10 sm:py-16"
        >
          <div className="relative z-10 mx-auto max-w-4xl space-y-6">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
              Contact &amp; accompagnement
            </p>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Un projet logistique ? Parlons-en.
            </h2>
            <p className="max-w-2xl text-base text-white/90 sm:text-lg">
              Nous accompagnons expéditeurs et transporteurs dans
              l&apos;optimisation de leurs flux logistiques.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="accent"
                size="lg"
                className="text-accent-foreground shadow-lg"
                asChild
              >
                <Link href="/contact">Demander un devis</Link>
              </Button>
              <Button
                size="lg"
                className="bg-[#25D366] text-white hover:bg-[#20BD5A]"
                asChild
              >
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <IconWhatsApp className="h-5 w-5" />
                  WhatsApp rapide
                </a>
              </Button>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <p className="text-xs text-white/70">Suivez-nous :</p>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#25D366]"
                  aria-label="WhatsApp"
                >
                  <IconWhatsApp className="h-5 w-5" />
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#1877F2]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-black"
                  aria-label="TikTok"
                >
                  <IconTikTok className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          {/* Vague décorative vers le bas */}
          <div
            className="absolute -bottom-px left-0 right-0 z-20 h-12 w-full"
            aria-hidden
          >
            <svg
              viewBox="0 0 1440 48"
              preserveAspectRatio="none"
              className="h-full w-full"
            >
              <path
                d="M0,48 L0,24 Q720,0 1440,24 L1440,48 Z"
                fill="white"
              />
            </svg>
          </div>
        </motion.div>

        {/* Zone contact directe - fond blanc */}
        <motion.div
          variants={itemVariants}
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          whileInView={
            reduced
              ? undefined
              : { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
          }
          viewport={defaultViewport}
          className="-mt-1 rounded-b-2xl border border-t-0 border-primary/10 bg-white px-6 py-10 shadow-lg sm:px-10"
        >
          <h3 className="mb-8 text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Contactez-nous directement
          </h3>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* Formulaire à gauche */}
            <div className="space-y-4">
              <p className="text-base font-semibold text-foreground">
                Besoin d&apos;un transport ?
              </p>
              <form
                onSubmit={handleFormSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Input
                    name="nom"
                    placeholder="Nom"
                    className="border-muted-foreground/30 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    name="entreprise"
                    placeholder="Entreprise"
                    className="border-muted-foreground/30 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <select
                    name="typeMarchandise"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Type de marchandise
                    </option>
                    <option value="cereales">Céréales</option>
                    <option value="btp">Engins BTP</option>
                    <option value="conteneurs">Conteneurs</option>
                    <option value="divers">Divers</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Textarea
                    name="message"
                    placeholder="Votre message"
                    rows={4}
                    className="border-muted-foreground/30 bg-white resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="text-accent-foreground w-full sm:w-auto"
                >
                  Envoyer la demande
                </Button>
              </form>
            </div>

            {/* Cartes de contact à droite */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {CONTACT_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.title}
                    className="border-muted-foreground/20 bg-white shadow-sm"
                  >
                    <CardContent className="p-4">
                      <div
                        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 ${card.iconColor}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-foreground">
                        {card.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {card.subtitle}
                      </p>
                      {card.detail && (
                        <p className="text-xs text-muted-foreground">
                          {card.detail}
                        </p>
                      )}
                      <Button
                        variant="default"
                        size="sm"
                        className="mt-3"
                        asChild
                      >
                        <a
                          href={card.href}
                          target={card.href.startsWith("http") ? "_blank" : undefined}
                          rel={
                            card.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {card.buttonLabel}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Couverture géographique */}
          <div className="mt-8 flex items-center justify-center gap-2 border-t border-muted/50 pt-6">
            <MapPin className="h-5 w-5 text-accent" />
            <p className="text-sm text-muted-foreground">
              Couverture : Bénin - Togo - Afrique de l&apos;Ouest
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
