import { Header, Footer } from "@/components/landing/layout";
import { Hero } from "@/components/landing/hero";
import { Advantages } from "@/components/landing/advantages";
import { DataSafety } from "@/components/landing/data-safety";
import { SpamChecker } from "@/components/landing/spam-checker";
import { SharedBot } from "@/components/landing/shared-bot";
import { Pricing } from "@/components/landing/pricing";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Advantages />
        <DataSafety />
        <SpamChecker />
        <SharedBot />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
