import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductByHandle } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";
import type { ProductVariant } from "@/types/shopify";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const product = handle ? getProductByHandle(handle) : undefined;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants.find((v) => v.available) ?? product?.variants[0] ?? null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();

  if (!product || !selectedVariant) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar forceDark />
        <div className="pt-40 section-padding text-center text-muted-foreground">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar forceDark />
      <main className="pt-32 pb-24">
        <section className="section-padding">
          <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            ← Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8">
            {/* Images */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="aspect-[3/4] bg-secondary overflow-hidden"
              >
                <img
                  src={product.images[selectedImageIndex]?.src}
                  alt={product.images[selectedImageIndex]?.altText || product.title}
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-[3/4] w-20 overflow-hidden border-2 transition-all duration-300 ${
                        selectedImageIndex === idx ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.src} alt={img.altText} className="w-full h-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
                {product.productType}
              </p>
              <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-tight">
                {product.title}
              </h1>
              <p className="font-heading text-2xl text-foreground/80 mt-4">
                ${selectedVariant.price}
              </p>

              <ul className="mt-6 space-y-3 max-w-md">
                {product.description.split('. ').filter(Boolean).map((point, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="block w-1.5 h-1.5 rounded-[2px] bg-muted-foreground shrink-0" />
                    {point.replace(/\.$/, '')}
                  </li>
                ))}
              </ul>

              {/* Size Selector */}
              {product.variants.length > 1 && (
                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.available}
                        className={`w-12 h-12 text-xs uppercase tracking-wider border transition-all duration-300 ${
                          selectedVariant.id === variant.id
                            ? "bg-foreground text-background border-foreground"
                            : variant.available
                            ? "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                            : "border-border/50 text-muted-foreground/30 cursor-not-allowed line-through"
                        }`}
                      >
                        {variant.selectedOptions[0]?.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={() => addItem(product, selectedVariant)}
                disabled={!selectedVariant.available}
                className="mt-10 w-full max-w-md py-4 bg-foreground text-background text-xs uppercase tracking-[0.25em] hover:bg-foreground/90 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {selectedVariant.available ? "Add to Cart" : "Sold Out"}
              </button>

              {/* Tags */}
              <div className="flex gap-2 mt-8">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground border border-border px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
