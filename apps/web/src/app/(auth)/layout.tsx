import Image from "next/image";
import { PageTransition } from "@/components/layout/PageTransition";
import { AuthBranding } from "@/components/auth/AuthBranding";

const AUTH_COVER_IMAGE = "/images/794f43aa25c5663703725cb1332e7a74.jpg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden font-display">
      {/* Fond hero plein écran */}
      <div className="absolute inset-0 z-0">
        <Image
          src={AUTH_COVER_IMAGE}
          alt="Camions sur la route"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#012767]/70 to-[#012767]/80" />
      </div>

      {/* Bloc auth centré */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          <AuthBranding />
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </div>
  );
}
