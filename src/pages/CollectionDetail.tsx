import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCollectionByHandle } from "@/lib/products";
import { useCart } from "@/contexts/CartContext";

const CollectionDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const collection = handle ? getCollectionByHandle(handle) : undefined;
  const { addItem } = useCart();

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar forceDark />
        <div className="pt-40 section-padding text-center text-muted-foreground">Collection not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar forceDark />
      <main className="pt-32 pb-24">
        <section className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link to="/collections" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
              ← Collections
            </Link>
            <h1 className="editorial-heading mt-4">{collection.title}</h1>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {collection.products.map((product, i) => (
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
                    className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors shrink-0 mt-0.5"
                  >
                    + Add
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

export default CollectionDetail;
