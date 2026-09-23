import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { createShopifyCart } from "@/lib/shopify";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useShopify";
import { getBundleProducts, getCombatColor, isCombatZipUp } from "@/lib/combatBundle";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, addItem, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const { data: products = [] } = useProducts();
  const bundleProducts = getBundleProducts(products);
  const combatQuantity = items.filter((item) => isCombatZipUp(item.product)).reduce((sum, item) => sum + item.quantity, 0);
  const bundleUnlocked = combatQuantity >= 3;
  const missingCount = Math.max(0, 3 - combatQuantity);
  const colorsInCart = new Set(items.filter((item) => isCombatZipUp(item.product)).map((item) => getCombatColor(item.product)));
  const missingProducts = bundleProducts.filter((product) => !colorsInCart.has(getCombatColor(product)));

  const handleClose = () => setIsOpen(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    try {
      const lines = items.map((item) => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      }));
      const { checkoutUrl } = await createShopifyCart(lines);
      setIsOpen(false);
      // Same-tab redirect. window.open() runs after an await here, so it has lost
      // user activation and popup blockers silently return null — the customer
      // never reaches checkout. Shopify shows its own confirmation page once
      // payment completes, so we must not route to /order-confirmation ourselves.
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout. Please try again.");
      setCheckingOut(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-[51] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-heading text-xl uppercase tracking-[0.1em]">
                Cart ({totalItems})
              </h2>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center mt-12">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex gap-4">
                    <div className="w-20 h-24 bg-secondary shrink-0 overflow-hidden">
                      <img
                        src={item.product.images[0]?.src}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-sm uppercase tracking-[0.05em] truncate">
                        {item.product.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {item.variant.title} — ${item.variant.price}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="ml-auto text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-destructive transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {combatQuantity > 0 && (
              <div className="border-t border-border bg-secondary/50 px-6 py-4">
                <p className="text-xs uppercase tracking-[0.12em]">
                  {bundleUnlocked
                    ? "Bundle unlocked — you’re saving $100"
                    : `Add ${missingCount} more Combat Zip Up to save $100`}
                </p>
                {!bundleUnlocked && missingProducts.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {missingProducts.map((product) => {
                      const variant = product.variants.find((item) => item.available);
                      if (!variant) return null;
                      return (
                        <Button
                          key={product.id}
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-none px-3 text-[9px] uppercase tracking-[0.1em]"
                          onClick={() => addItem(product, variant)}
                        >
                          + {getCombatColor(product)}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</span>
                  <span className="font-heading text-lg">${totalPrice}</span>
                </div>
                {bundleUnlocked && (
                  <div className="flex items-center justify-between text-accent">
                    <span className="text-[10px] uppercase tracking-[0.15em]">Bundle discount at checkout</span>
                    <span className="font-heading text-sm">−$100.00</span>
                  </div>
                )}
                <button
                  className="w-full py-4 bg-foreground text-background text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    "Checkout"
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
