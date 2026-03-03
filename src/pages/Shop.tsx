import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAllProducts, getProductTypes } from "@/lib/shopify";
import type { Product } from "@/types/shopify";
import { useCart } from "@/contexts/CartContext";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("All");
  const [types, setTypes] = useState<string[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    fetchAllProducts().then(setProducts);
    setTypes(getProductTypes());
  }, []);

  const filtered = filter === "All" ? products : products.filter((p) => p.productType === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <section className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Browse</p>
            <h1 className="editorial-heading">Shop All</h1>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {["All", ...types].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 text-xs uppercase tracking-[0.2em] border transition-all duration-300 ${
                  filter === type
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </motion.div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group"
              >
                <Link to={`/shop/${product.handle}`} className="block">
                  <div className="product-card aspect-[3/4] bg-secondary overflow-hidden">
                    <img
                      src={product.images[0]?.src}
                      alt={product.images[0]?.altText || product.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/shop/${product.handle}`}>
                      <h3 className="font-heading text-sm uppercase tracking-[0.1em] text-foreground hover:text-foreground/70 transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">${product.variants[0]?.price}</p>
                  </div>
                  <button
                    onClick={() => {
                      const variant = product.variants.find((v) => v.available);
                      if (variant) addItem(product, variant);
                    }}
                    disabled={!product.availableForSale}
                    className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
                  >
                    {product.availableForSale ? "+ Add" : "Sold Out"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
