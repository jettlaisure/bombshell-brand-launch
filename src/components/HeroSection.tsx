import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          src="/hero-video.mov"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Logo Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.img
          src={logo}
          alt="Bombshell"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-32 md:h-48 lg:h-60 w-auto"
        />
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

      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-20 p-2 text-foreground/40 hover:text-foreground transition-colors duration-300"
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

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
