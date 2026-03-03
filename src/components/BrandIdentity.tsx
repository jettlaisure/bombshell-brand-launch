import { motion } from "framer-motion";
import editorialBg from "@/assets/editorial-bg.jpg";

const BrandIdentity = () => {
  return (
    <section id="about" className="relative">
      {/* Editorial Image */}
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <img
          src={editorialBg}
          alt="Bombshell editorial campaign"
          className="w-full h-full object-cover object-[center_15%]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

    </section>
  );
};

export default BrandIdentity;
