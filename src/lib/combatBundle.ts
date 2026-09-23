import type { Product, ProductVariant } from "@/types/shopify";

export const COMBAT_BUNDLE_HANDLES = [
  "combat-zip-up-black",
  "combat-zip-up-military-green",
  "combat-zip-up-heather-grey",
  "combat-zip-up-heather-gray",
] as const;

export const isCombatZipUp = (product: Product) =>
  product.handle.includes("combat-zip-up") || product.title.toLowerCase().includes("combat zip up");

export const getCombatColor = (product: Product) => {
  const value = `${product.handle} ${product.title}`.toLowerCase();
  if (value.includes("black")) return "Black";
  if (value.includes("military-green") || value.includes("military green")) return "Military Green";
  if (value.includes("heather-grey") || value.includes("heather-gray") || value.includes("heather grey") || value.includes("heather gray")) {
    return "Heather Gray";
  }
  return product.title.replace(/combat zip up/gi, "").replace(/[—-]/g, "").trim();
};

export const getVariantSize = (variant: ProductVariant) =>
  variant.selectedOptions.find((option) => option.name.toLowerCase() === "size")?.value ?? variant.title;

export const getBundleProducts = (products: Product[]) => {
  const order = ["Black", "Military Green", "Heather Gray"];
  return products
    .filter(isCombatZipUp)
    .filter((product, index, all) => all.findIndex((item) => getCombatColor(item) === getCombatColor(product)) === index)
    .sort((a, b) => order.indexOf(getCombatColor(a)) - order.indexOf(getCombatColor(b)))
    .slice(0, 3);
};