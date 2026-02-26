import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Transmeet — Plateforme logistique Afrique de l'Ouest",
  description:
    "Transmeet connecte expéditeurs, transporteurs et projets BTP pour des solutions logistiques premium en Afrique de l'Ouest.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#012767",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased bg-background text-foreground">
        <div className="flex min-h-screen flex-col">
          <PublicHeader />
          <main className="flex-1">{children}</main>
          <PublicFooter />
        </div>
      </body>
    </html>
  );
}
