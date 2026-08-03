import { FeaturedEventsSection } from "@/features/home/components/featured-events-section";
import { HeroSection } from "@/features/home/components/hero-section";
import { HowItWorksSection } from "@/features/home/components/how-it-works-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedEventsSection />
      <HowItWorksSection />
    </>
  );
}