import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Image
              src="/images/logo-transmeet.jpeg"
              alt="Transmeet"
              width={180}
              height={54}
              className="h-14 w-auto object-contain"
            />
            <p className="text-sm text-muted-foreground">
              La plateforme logistique qui connecte expéditeurs et transporteurs.
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
