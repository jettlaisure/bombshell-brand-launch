import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { CartItem, Product, ProductVariant } from "@/types/shopify";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, variant: ProductVariant) => void;
  addItems: (items: { product: Product; variant: ProductVariant }[]) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: string;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product: Product, variant: ProductVariant) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variant.id);
      if (existing) {
        return prev.map((i) =>
          i.variantId === variant.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { variantId: variant.id, product, variant, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const addItems = useCallback((newItems: { product: Product; variant: ProductVariant }[]) => {
    setItems((current) => {
      const next = [...current];
      newItems.forEach(({ product, variant }) => {
        const index = next.findIndex((item) => item.variantId === variant.id);
        if (index >= 0) {
          next[index] = { ...next[index], quantity: next[index].quantity + 1 };
        } else {
          next.push({ variantId: variant.id, product, variant, quantity: 1 });
        }
      });
      return next;
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity < 1) return removeItem(variantId);
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items
    .reduce((sum, i) => sum + parseFloat(i.variant.price) * i.quantity, 0)
    .toFixed(2);

  return (
    <CartContext.Provider
      value={{ items, isOpen, setIsOpen, addItem, addItems, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
