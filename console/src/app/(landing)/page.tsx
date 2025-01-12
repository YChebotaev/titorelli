import { Footer } from "@/components/landing/layout";
import { AppHeader } from "@/components/site/header";
import { Hero } from "@/components/landing/hero";
import { Advantages } from "@/components/landing/advantages";
import { DataSafety } from "@/components/landing/data-safety";
import { SpamChecker } from "@/components/landing/spam-checker";
import { SharedBot } from "@/components/landing/shared-bot";
import { Pricing } from "@/components/landing/pricing";
import { getUserNotificationService } from "@/lib/server/services/instances";

export default function LandingPage() {
  // getUserNotificationService().pushGenericToast(1, {
  //   type: "default",
  //   message: "Hello",
  //   description: "World",
  // });

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
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
