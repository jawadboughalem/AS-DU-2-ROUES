import { DraftBanner } from "@/components/draft-banner";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { ProcessSteps } from "@/components/process-steps";
import { WhyUs } from "@/components/why-us";
import { Reviews } from "@/components/reviews";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { QuoteCta } from "@/components/quote-cta";
import { Practical } from "@/components/practical";
import { Footer } from "@/components/footer";
import { StickyCall } from "@/components/sticky-call";

export default function Home() {
  return (
    <>
      <DraftBanner />
      <main>
        <Hero />
        <Services />
        <ProcessSteps />
        <WhyUs />
        <Reviews />
        <Pricing />
        <QuoteCta />
        <Practical />
        <Faq />
      </main>
      <Footer />
      <StickyCall />
    </>
  );
}
