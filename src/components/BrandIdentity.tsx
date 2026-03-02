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
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-background/60" />

        <div className="absolute inset-0 flex items-center section-padding">
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
            <p className="font-body text-sm md:text-base leading-relaxed text-foreground/60 max-w-md">
              Bombshell is more than clothing. It's a statement. 
              Military precision meets underground culture — 
              designed for those who move with intention.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="section-padding py-16 grid grid-cols-3 gap-4 border-t border-border">
        {[
          { label: "Founded", value: "2025" },
          { label: "Drops", value: "001" },
          { label: "Culture", value: "∞" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center"
          >
            <p className="font-heading text-3xl md:text-5xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BrandIdentity;
