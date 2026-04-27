import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProofStrip } from "@/components/landing/ProofStrip";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { DemoPreview } from "@/components/landing/DemoPreview";
import { Pricing } from "@/components/landing/Pricing";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <HeroSection />
      <ProofStrip />
      <ProblemSection />
      <SolutionSection />
      <DemoPreview />
      <Pricing />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Index;
