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
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex items-center section-padding text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">The Brand</p>
            <h2 className="editorial-heading mb-8">
              Born from
              <br />
              the streets.
            </h2>
            <p className="font-body text-sm md:text-base leading-relaxed text-white/60 max-w-md">
              Bombshell is more than clothing. It's a statement. 
              Military precision meets underground culture — 
              designed for those who move with intention.
            </p>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default BrandIdentity;
