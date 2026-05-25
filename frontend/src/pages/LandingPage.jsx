import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import StarField from "../components/ui/StarField";
import CrisisTicker from "../components/ui/CrisisTicker";
import HeroSection from "../components/sections/HeroSection";
import StorySection from "../components/sections/StorySection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import LevelsSection from "../components/sections/LevelsSection";
import AISection from "../components/sections/AISection";
import SubjectsSection from "../components/sections/SubjectsSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import { AnalyticsSection, CTASection } from "../components/sections/AnalyticsCTASections";
import EndingCTASection from "../components/sections/EndingCTASection";
import { HUDDivider } from "../components/ui/UIKit";

const Divider = () => (
  <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.75rem" }}>
    <HUDDivider />
  </div>
);

const LandingPage = () => (
  <>
    {/* Ambient layers */}
    <StarField />
    <div className="noise-overlay" />

    {/* Navigation */}
    <Navbar />

    {/* Page content */}
    <main style={{ position: "relative", zIndex: 10 }}>
      <HeroSection />
      <CrisisTicker />
      <Divider />
      <StorySection />
      <Divider />
      <HowItWorksSection />
      <Divider />
      <LevelsSection />
      <Divider />
      <AISection />
      <Divider />
      <SubjectsSection />
      <Divider />
      <FeaturesSection />
      <Divider />
      <AnalyticsSection />
      <Divider />
      <EndingCTASection />
    </main>

    <Footer />
  </>
);
export default LandingPage;