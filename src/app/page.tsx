import { HeroPanorama } from "@/components/home/HeroPanorama/HeroPanorama";
import { AboutStrip } from "@/components/home/AboutStrip/AboutStrip";
import { SignatureDestinations } from "@/components/home/SignatureDestinations/SignatureDestinations";
import { FeaturedPackages } from "@/components/home/FeaturedPackages/FeaturedPackages";
import { HowItWorks } from "@/components/home/HowItWorks/HowItWorks";
import { QuoteStrip } from "@/components/home/QuoteStrip/QuoteStrip";
export default function HomePage() {
  return (
    <>
      <HeroPanorama />
      <AboutStrip />
      <SignatureDestinations />
      <FeaturedPackages />
      <HowItWorks />
      <QuoteStrip />
    </>
  );
}
