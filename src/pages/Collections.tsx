import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchAllCollections } from "@/lib/shopify";
import type { Collection } from "@/types/shopify";

const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    fetchAllCollections().then(setCollections);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24">
        <section className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Explore</p>
            <h1 className="editorial-heading">Collections</h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections
              .filter((c) => !["essentials", "outerwear"].includes(c.handle.toLowerCase()))
              .map((collection, i) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Link
                  to={`/collections/${collection.handle}`}
                  className="group block relative aspect-[3/4] overflow-hidden bg-secondary"
                >
                  {collection.image && (
                    <img
                      src={collection.image.src}
                      alt={collection.image.altText || collection.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-background/50 group-hover:bg-background/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <h2 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">
                      {collection.title}
                    </h2>
                    <p className="text-xs text-foreground/60 mt-3 max-w-xs">{collection.description}</p>
                    <span className="mt-6 text-[10px] uppercase tracking-[0.25em] text-foreground/50 border-b border-foreground/20 pb-0.5 group-hover:text-foreground group-hover:border-foreground/50 transition-all duration-300">
                      View Collection
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collections;
