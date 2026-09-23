import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useProducts } from "@/hooks/useShopify";
import { getBundleProducts } from "@/lib/combatBundle";
import greyHoodieFeatured from "@/assets/grey-hoodie-featured.jpeg";
import blackHoodieFeatured from "@/assets/black-hoodie-featured.jpeg";
import greenHoodieFeatured from "@/assets/green-hoodie-featured.jpeg";

// Override images for the landing page cards (by handle)
const featuredImageOverrides: Record<string, string> = {
  "combat-zip-up-heather-grey": greyHoodieFeatured,
  "combat-zip-up-heather-gray": greyHoodieFeatured,
  "combat-zip-up-black": blackHoodieFeatured,
  "combat-zip-up-military-green": greenHoodieFeatured,
};

const BundleSection = () => {
  const { data: products = [] } = useProducts();
  const bundleProducts = getBundleProducts(products);
  const cards = bundleProducts.length === 3 ? bundleProducts : products.slice(0, 3);

  return (
    <section id="bundle" className="scroll-mt-20 border-b border-border bg-background py-16 md:py-24 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
          <h2 className="font-heading text-3xl uppercase md:text-5xl">Get All 3. Save $100.</h2>
          <p className="font-heading text-xl md:text-2xl">
            <span className="mr-3 text-muted-foreground line-through">$449.97</span>
            $349.97
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {cards.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group"
            >
              <Link to={`/shop/${product.handle}`} className="block">
                <div className="aspect-[3/4] bg-secondary relative overflow-hidden">
                  <img
                    src={featuredImageOverrides[product.handle] || product.images[0]?.src}
                    alt={product.images[0]?.altText || product.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-foreground text-background p-2.5 rounded-full">
                      <ShoppingBag size={16} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-start justify-between gap-2" style={{ fontFamily: "'Akira Expanded', sans-serif" }}>
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.1em] font-medium text-foreground">
                      {product.title}
                    </p>
                    <p className="text-[9px] md:text-[10px] text-muted-foreground mt-1">
                      ${product.variants[0]?.price}
                    </p>
                  </div>
                  <ShoppingBag size={16} className="text-muted-foreground mt-1 shrink-0 md:hidden" />
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
      </motion.div>
    </section>
  );
};

export default BundleSection;
