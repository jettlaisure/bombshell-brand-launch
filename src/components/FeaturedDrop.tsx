import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useShopify";

const FeaturedDrop = () => {
  const { data: products = [] } = useProducts();
  const featured = products.slice(0, 3);

  return (
    <section id="shop" className="section-padding py-24 md:py-32">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl">
        {featured.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className="product-card group aspect-[3/4] bg-secondary relative overflow-hidden"
          >
            <Link to={`/shop/${product.handle}`}>
              <img
                src={product.images[0]?.src}
                alt={product.images[0]?.altText || product.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="product-info">
                <p className="font-heading text-sm uppercase tracking-[0.1em] text-white">
                  {product.title}
                </p>
                <p className="text-xs text-white/60 mt-1">${product.variants[0]?.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <Link
          to="/shop"
          className="inline-block px-10 py-3 border border-border text-xs uppercase tracking-[0.25em] text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-500"
        >
          View All
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedDrop;
