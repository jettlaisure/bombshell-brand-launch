import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useCart } from "@/contexts/CartContext";

interface NavbarProps {
  forceDark?: boolean;
}

const Navbar = ({ forceDark = false }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const { setIsOpen, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = forceDark || scrolled;

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
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <nav className="flex items-center justify-between section-padding py-5">
        <Link to="/">
          <img src={logo} alt="Bombshell" className={`h-24 w-auto transition-all duration-500 ${isDark ? 'invert' : ''}`} />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link to="/shop" className={`text-xs uppercase tracking-[0.2em] transition-colors duration-500 ${isDark ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`}>Shop</Link>
          
          
          <button onClick={() => setIsOpen(true)} className={`text-xs uppercase tracking-[0.2em] transition-colors duration-500 relative ${isDark ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`} aria-label="Cart">
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-[8px] flex items-center justify-center ${isDark ? 'bg-foreground text-background' : 'bg-white text-black'}`}>
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <button onClick={() => setIsOpen(true)} className={`text-xs uppercase tracking-[0.2em] transition-colors duration-500 relative md:hidden ${isDark ? 'text-foreground/70 hover:text-foreground' : 'text-white/70 hover:text-white'}`} aria-label="Cart">
          <ShoppingBag className="w-4 h-4" />
          {totalItems > 0 && (
            <span className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-[8px] flex items-center justify-center ${isDark ? 'bg-foreground text-background' : 'bg-white text-black'}`}>
              {totalItems}
            </span>
          )}
        </button>
      </nav>
    </motion.header>
  );
};

export default Navbar;
