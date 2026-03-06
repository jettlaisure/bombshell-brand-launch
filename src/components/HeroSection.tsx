import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          src="/hero-video.mov"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Logo Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.img
          src={logo}
          alt="Bombshell"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-56 md:h-80 lg:h-96 w-auto"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="editorial-subheading mt-4 text-white/60"
        >
          Combat — Now Live
        </motion.p>
        <motion.a
          href="#shop"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-10 px-10 py-3 border border-white/30 text-xs uppercase tracking-[0.25em] text-white/80 hover:bg-white hover:text-black transition-all duration-500"
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
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
        <div className="w-px h-8 bg-white/20 animate-pulse" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
