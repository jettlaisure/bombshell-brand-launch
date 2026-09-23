import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useShopify";
import { useCart } from "@/contexts/CartContext";
import { getBundleProducts, getCombatColor, getVariantSize } from "@/lib/combatBundle";
import type { ProductVariant } from "@/types/shopify";

const BundleSection = () => {
  const { data: products = [], isLoading } = useProducts();
  const bundleProducts = useMemo(() => getBundleProducts(products), [products]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const { addItems } = useCart();

  useEffect(() => {
    if (bundleProducts.length !== 3) return;
    const sharedSizes = bundleProducts[0].variants
      .filter((variant) => variant.available)
      .map(getVariantSize)
      .filter((size) => bundleProducts.every((product) => product.variants.some((variant) => variant.available && getVariantSize(variant) === size)));
    const defaultSize = sharedSizes[0];
    const defaults = Object.fromEntries(
      bundleProducts.flatMap((product) => {
        const variant = product.variants.find((item) => item.available && getVariantSize(item) === defaultSize)
          ?? product.variants.find((item) => item.available);
        return variant ? [[product.id, variant]] : [];
      }),
    );
    setSelectedVariants(defaults);
  }, [bundleProducts]);

  const ready = bundleProducts.length === 3 && bundleProducts.every((product) => selectedVariants[product.id]?.available);

  return (
    <section id="bundle" className="scroll-mt-20 border-b border-border bg-background py-16 md:py-24 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-6xl"
      >
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-12 md:flex-row md:items-end">
          <h2 className="font-heading text-3xl uppercase md:text-5xl">Get All 3. Save $100.</h2>
          <p className="font-heading text-xl md:text-2xl">
            <span className="mr-3 text-muted-foreground line-through">$449.97</span>
            $349.97
          </p>
        </div>

        {isLoading ? (
          <div className="py-24 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading bundle…</div>
        ) : bundleProducts.length === 3 ? (
          <>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {bundleProducts.map((product) => (
                <article key={product.id} className="min-w-0">
                  <div className="aspect-[3/4] overflow-hidden bg-secondary">
                    <img
                      src={product.images[0]?.src}
                      alt={product.images[0]?.altText || product.title}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <h3 className="mt-3 min-h-8 text-[9px] uppercase leading-4 md:min-h-0 md:text-xs">
                    {getCombatColor(product)}
                  </h3>
                  <label className="mt-2 block">
                    <span className="sr-only">Size for {getCombatColor(product)}</span>
                    <select
                      value={selectedVariants[product.id]?.id ?? ""}
                      onChange={(event) => {
                        const variant = product.variants.find((item) => item.id === event.target.value);
                        if (variant) setSelectedVariants((current) => ({ ...current, [product.id]: variant }));
                      }}
                      className="h-10 w-full appearance-none border border-border bg-background px-2 text-[10px] uppercase tracking-[0.1em] text-foreground outline-none focus:border-foreground md:px-3 md:text-xs"
                    >
                      {product.variants.map((variant) => (
                        <option key={variant.id} value={variant.id} disabled={!variant.available}>
                          {getVariantSize(variant)}{variant.available ? "" : " — Sold out"}
                        </option>
                      ))}
                    </select>
                  </label>
                </article>
              ))}
            </div>
            <Button
              className="mt-8 h-14 w-full rounded-none text-xs uppercase tracking-[0.2em] md:mt-10"
              disabled={!ready}
              onClick={() => addItems(bundleProducts.map((product) => ({ product, variant: selectedVariants[product.id] })))}
            >
              Add All 3 to Cart
            </Button>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              Automatic discount applied at checkout
            </p>
          </>
        ) : (
          <p className="py-16 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">Bundle temporarily unavailable.</p>
        )}
      </motion.div>
    </section>
  );
};

export default BundleSection;