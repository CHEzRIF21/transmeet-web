import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PageTransition } from "@/components/layout/PageTransition";
import { ScrollToHash } from "@/components/layout/ScrollToHash";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col">
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Aller au contenu principal
      </a>
      <PublicHeader />
      <ScrollToHash />
      <main
        id="main-content"
        className="flex-1 w-full min-w-0 max-w-[100vw] pt-12 pb-[env(safe-area-inset-bottom,0px)]"
      >
        <PageTransition>{children}</PageTransition>
      </main>
      <PublicFooter />
    </div>
  );
}
