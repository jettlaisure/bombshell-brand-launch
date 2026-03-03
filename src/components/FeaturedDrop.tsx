import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products = [
  { id: 1, name: "Stealth Hoodie", handle: "stealth-hoodie", price: "$185", image: product1 },
  { id: 2, name: "Warfare Tee", handle: "warfare-tee", price: "$95", image: product2 },
  { id: 3, name: "Tactical Vest", handle: "tactical-vest", price: "$240", image: product3 },
  { id: 4, name: "Cargo Joggers", handle: "cargo-joggers", price: "$145", image: product4 },
];

const FeaturedDrop = () => {
  return (
    <section id="shop" className="section-padding py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Latest</p>
        <h2 className="editorial-heading">Coming Soon</h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="product-card group aspect-[3/4] bg-secondary"
          >
            <Link to={`/shop/${product.handle}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="product-info">
                <p className="font-heading text-sm uppercase tracking-[0.1em] text-foreground">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{product.price}</p>
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
        className="mt-12 text-center"
      >
        <Link
          to="/shop"
          className="inline-block px-10 py-3 border border-border text-xs uppercase tracking-[0.25em] text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-500"
        >
          View All Products
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedDrop;
