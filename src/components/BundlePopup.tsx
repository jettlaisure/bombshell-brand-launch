import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useShopify";
import { useCart } from "@/contexts/CartContext";
import { getBundleProducts, getCombatColor } from "@/lib/combatBundle";
import type { Product } from "@/types/shopify";

const VISITED_KEY = "bombshell_bundle_visited";
const SEEN_KEY = "bombshell_bundle_popup_seen";

const BundlePopup = () => {
  const [open, setOpen] = useState(false);
  const [eligible] = useState(() => localStorage.getItem(VISITED_KEY) === "true" && localStorage.getItem(SEEN_KEY) !== "true");
  const { data: products = [] } = useProducts();
  const bundleProducts = useMemo(() => getBundleProducts(products), [products]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem(VISITED_KEY, "true");
    if (!eligible) return;

    const reveal = () => {
      if (localStorage.getItem(SEEN_KEY) === "true") return;
      localStorage.setItem(SEEN_KEY, "true");
      setOpen(true);
    };
    const timer = window.setTimeout(reveal, 10_000);
    const onExit = (event: MouseEvent) => {
      if (window.matchMedia("(min-width: 768px)").matches && event.clientY <= 0) reveal();
    };
    document.addEventListener("mouseleave", onExit);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseleave", onExit);
    };
  }, [eligible]);

  const close = () => setOpen(false);
  const goToBundle = () => {
    close();
    if (location.pathname !== "/") navigate("/");
    window.setTimeout(() => document.getElementById("bundle")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <AnimatePresence>
      {open && bundleProducts.length === 3 && (
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          className="fixed bottom-4 left-4 right-4 z-[60] border border-border bg-background shadow-xl md:left-auto md:w-[420px]"
          aria-label="Combat Zip Up bundle offer"
        >
          <Button variant="ghost" size="icon" onClick={close} aria-label="Close offer" className="absolute right-2 top-2 z-10 h-9 w-9 rounded-none bg-background/90">
            <X />
          </Button>
          <div className="grid grid-cols-3">
            {bundleProducts.map((product) => (
              <img key={product.id} src={product.images[0]?.src} alt={getCombatColor(product)} className="aspect-square h-full w-full object-cover object-top" />
            ))}
          </div>
          <div className="p-5">
            <p className="font-heading text-xl uppercase">Get All 3 for $349.97 — Save $100</p>
            <Button onClick={goToBundle} className="mt-4 h-11 w-full rounded-none text-[10px] uppercase tracking-[0.2em]">
              Shop the Bundle
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default BundlePopup;