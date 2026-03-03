import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  const handleClose = () => setIsOpen(false);

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

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</span>
                  <span className="font-heading text-lg">${totalPrice}</span>
                </div>
                <button
                  className="w-full py-4 bg-foreground text-background text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors duration-300"
                  onClick={() => {
                    // TODO: Replace with Shopify checkout URL
                    alert("Checkout will redirect to Shopify when integrated.");
                  }}
                >
                  Checkout
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
