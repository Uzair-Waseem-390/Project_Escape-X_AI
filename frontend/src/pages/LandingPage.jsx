import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import StarField from "../components/ui/StarField";
import CrisisTicker from "../components/ui/CrisisTicker";
import HeroSection from "../components/sections/HeroSection";
import StorySection from "../components/sections/StorySection";
import LevelsSection from "../components/sections/LevelsSection";
import AISection from "../components/sections/AISection";
import FeaturesSection from "../components/sections/FeaturesSection";
import EndingCTASection from "../components/sections/EndingCTASection";
import { HUDDivider } from "../components/ui/UIKit";

const Divider = () => (
  <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.75rem" }}>
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
    <main style={{ position:"relative", zIndex:10 }}>
      <HeroSection />
      <CrisisTicker />
      <Divider />
      <StorySection />
      <Divider />
      <LevelsSection />
      <Divider />
      <AISection />
      <Divider />
      <FeaturesSection />
      <Divider />
      <EndingCTASection />
    </main>

    <Footer />
  </>
);
export default LandingPage;
