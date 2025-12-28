import { ThemeProvider } from '@/components/common/ThemeProvider';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import AboutSection from '@/components/sections/AboutSection';
import Footer from '@/components/sections/Footer';

const LandingPage = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#f8f9ff] dark:bg-gray-900 font-sans transition-colors duration-300">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutSection />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;