import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Services } from "@/components/home/Services";
import { Advantages } from "@/components/home/Advantages";
import { CTAExpediteurs } from "@/components/home/CTAExpediteurs";
import { CTATransporteurs } from "@/components/home/CTATransporteurs";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/home/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <Advantages />
      <CTAExpediteurs />
      <CTATransporteurs />
      <Testimonials />
      <Footer />
    </main>
  );
}
