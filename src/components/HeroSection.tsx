import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Bombshell streetwear campaign"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Logo Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-[0.1em] text-foreground"
        >
          Bombshell
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="editorial-subheading mt-4 text-foreground/60"
        >
          Drop 001 — Now Live
        </motion.p>
        <motion.a
          href="#shop"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-10 px-10 py-3 border border-foreground/30 text-xs uppercase tracking-[0.25em] text-foreground/80 hover:bg-foreground hover:text-background transition-all duration-500"
        >
          Shop Now
        </motion.a>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/30">Scroll</span>
        <div className="w-px h-8 bg-foreground/20 animate-pulse" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
