import HeroSection from "@/components/home/HeroSection";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import HowItWorks from "@/components/home/HowItWorks";
import AuctionTeaser from "@/components/home/AuctionTeaser";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCollection />
        <HowItWorks />
        <AuctionTeaser />
      </main>
      <Footer />
    </>
  );
}
