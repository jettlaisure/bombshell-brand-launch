import type { Product, Collection } from "@/types/shopify";

import greyHoodie1 from "@/assets/grey-hoodie-1.jpeg";
import greyHoodie2 from "@/assets/grey-hoodie-2.jpeg";
import greyHoodie3 from "@/assets/grey-hoodie-3.jpeg";
import greenHoodie1 from "@/assets/green-hoodie-1.jpeg";
import greenHoodie2 from "@/assets/green-hoodie-2.jpeg";
import greenHoodie3 from "@/assets/green-hoodie-3.jpeg";
import blackHoodie1 from "@/assets/black-hoodie-1.jpeg";
import blackHoodie2 from "@/assets/black-hoodie-2.jpeg";
import blackHoodie3 from "@/assets/black-hoodie-3.jpeg";

const sizes = ["S", "M", "L", "XL"];

function makeVariants(price: string) {
  return sizes.map((size, i) => ({
    id: `variant-${size}-${i}`,
    title: size,
    price,
    available: true,
    selectedOptions: [{ name: "Size", value: size }],
  }));
}

export const products: Product[] = [
  {
    id: "1",
    title: "Combat Zip Up — Heather Grey",
    handle: "combat-zip-up-heather-grey",
    description: "400 GSM heavyweight cotton. Cropped fit. Custom patchwork detailing. YKK zippers. Ribbed cuffs and hem.",
    descriptionHtml: "",
    images: [
      { id: "g1", src: greyHoodie1, altText: "Combat Zip Up Heather Grey front" },
      { id: "g2", src: greyHoodie2, altText: "Combat Zip Up Heather Grey detail" },
      { id: "g3", src: greyHoodie3, altText: "Combat Zip Up Heather Grey back" },
    ],
    variants: makeVariants("120.00"),
    productType: "Hoodies",
    tags: ["heavyweight", "cropped", "zip-up"],
    vendor: "Bombshell",
    availableForSale: true,
  },
  {
    id: "2",
    title: "Combat Zip Up — Military Green",
    handle: "combat-zip-up-military-green",
    description: "400 GSM heavyweight cotton. Cropped fit. Custom patchwork detailing. YKK zippers. Ribbed cuffs and hem.",
    descriptionHtml: "",
    images: [
      { id: "gr1", src: greenHoodie1, altText: "Combat Zip Up Military Green front" },
      { id: "gr2", src: greenHoodie2, altText: "Combat Zip Up Military Green detail" },
      { id: "gr3", src: greenHoodie3, altText: "Combat Zip Up Military Green back" },
    ],
    variants: makeVariants("120.00"),
    productType: "Hoodies",
    tags: ["heavyweight", "cropped", "zip-up"],
    vendor: "Bombshell",
    availableForSale: true,
  },
  {
    id: "3",
    title: "Combat Zip Up — Black",
    handle: "combat-zip-up-black",
    description: "400 GSM heavyweight cotton. Cropped fit. Custom patchwork detailing. YKK zippers. Ribbed cuffs and hem.",
    descriptionHtml: "",
    images: [
      { id: "b1", src: blackHoodie1, altText: "Combat Zip Up Black front" },
      { id: "b2", src: blackHoodie2, altText: "Combat Zip Up Black detail" },
      { id: "b3", src: blackHoodie3, altText: "Combat Zip Up Black back" },
    ],
    variants: makeVariants("120.00"),
    productType: "Hoodies",
    tags: ["heavyweight", "cropped", "zip-up"],
    vendor: "Bombshell",
    availableForSale: true,
  },
];

export const collections: Collection[] = [
  {
    id: "col-1",
    title: "Combat Collection",
    handle: "combat-collection",
    description: "Our signature Combat Zip Up in every colorway.",
    image: { id: "col-img-1", src: blackHoodie1, altText: "Combat Collection" },
    products,
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductByHandle(handle: string): Product | undefined {
  return products.find((p) => p.handle === handle);
}

export function getAllCollections(): Collection[] {
  return collections;
}

export function getCollectionByHandle(handle: string): Collection | undefined {
  return collections.find((c) => c.handle === handle);
}

export function getProductTypes(): string[] {
  return [...new Set(products.map((p) => p.productType).filter(Boolean))];
}
