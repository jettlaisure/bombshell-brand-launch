import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import greyHoodie1 from "@/assets/grey-hoodie-1.jpeg";
import greenHoodie1 from "@/assets/green-hoodie-1.jpeg";
import blackHoodie1 from "@/assets/black-hoodie-1.jpeg";

const products = [
  { id: 1, name: "Heather Grey", handle: "combat-zip-up-heather-grey", price: "$120", image: greyHoodie1 },
  { id: 2, name: "Military Green", handle: "combat-zip-up-military-green", price: "$120", image: greenHoodie1 },
  { id: 3, name: "Black", handle: "combat-zip-up-black", price: "$120", image: blackHoodie1 },
];

const FeaturedDrop = () => {
  return (
    <section id="shop" className="section-padding py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Coming Soon</p>
        <h2 className="editorial-heading">Combat Zip Up</h2>
        <p className="text-sm text-muted-foreground mt-4 max-w-md leading-relaxed">
          400 GSM · 100% Cotton · Cropped Heavyweight Fit
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60">$249</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl">
        {products.map((product, i) => (
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
                src={product.image}
                alt={`Bombshell Cropped Heavyweight Hoodie — ${product.name}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="product-info">
                <p className="font-heading text-sm uppercase tracking-[0.1em] text-white">
                  {product.name}
                </p>
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
