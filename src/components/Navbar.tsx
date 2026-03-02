import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between section-padding py-5">
        <a href="/">
          <img src={logo} alt="Bombshell" className="h-20 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-10">
          <a href="#shop" className="nav-link">Shop</a>
          <a href="#collections" className="nav-link">Collections</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#" className="nav-link" aria-label="Cart">
            <ShoppingBag className="w-4 h-4" />
          </a>
        </div>

        <button className="md:hidden nav-link" aria-label="Cart">
          <ShoppingBag className="w-4 h-4" />
        </button>
      </nav>
    </motion.header>
  );
};

export default Navbar;
