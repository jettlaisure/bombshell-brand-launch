import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BundleSection from "@/components/BundleSection";
import FeaturedDrop from "@/components/FeaturedDrop";
import BrandIdentity from "@/components/BrandIdentity";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <BundleSection />
        <FeaturedDrop />
        <BrandIdentity />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
