import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";

const OrderConfirmation = () => {
  const { clearCart } = useCart();

  // Clear the cart on mount since the order was completed
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar forceDark />
      <main className="pt-32 pb-24 section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <CheckCircle className="w-16 h-16 text-foreground" strokeWidth={1} />
          </motion.div>

          <h1
            className="text-2xl md:text-4xl uppercase tracking-[0.1em] text-foreground mb-4"
            style={{ fontFamily: "'Akira Expanded', sans-serif" }}
          >
            Order Confirmed
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Thank you for your order. You'll receive a confirmation email with your tracking details shortly.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shop"
              className="inline-block px-10 py-3 border border-border text-xs uppercase tracking-[0.25em] text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-500"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="inline-block px-10 py-3 bg-foreground text-background text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors duration-300"
            >
              Home
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
