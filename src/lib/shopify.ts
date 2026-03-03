/**
 * Shopify Service Abstraction
 * 
 * Currently returns mock data. To integrate with Shopify Storefront API:
 * 
 * 1. Add your Storefront API access token
 * 2. Replace mock functions with GraphQL queries to:
 *    https://{store}.myshopify.com/api/2024-01/graphql.json
 * 3. Map Storefront API responses to the types in src/types/shopify.ts
 * 
 * Storefront API docs: https://shopify.dev/docs/api/storefront
 */

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

// ─── Mock Data ───────────────────────────────────────────────

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Combat Zip Up — Heather Grey",
    handle: "combat-zip-up-heather-grey",
    description: "400 GSM cropped heavyweight hoodie. 100% cotton construction. Custom patchwork",
    images: [
      { id: "img1a", src: greyHoodie1, altText: "Combat Zip Up in Heather Grey — Front" },
      { id: "img1b", src: greyHoodie2, altText: "Combat Zip Up in Heather Grey — Detail" },
      { id: "img1c", src: greyHoodie3, altText: "Combat Zip Up in Heather Grey — Side" },
    ],
    variants: [
      { id: "v1-s", title: "S", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "v1-m", title: "M", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "v1-l", title: "L", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "L" }] },
      { id: "v1-xl", title: "XL", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "XL" }] },
    ],
    productType: "Hoodies",
    tags: ["hoodie", "heavyweight", "new", "cropped"],
    vendor: "Bombshell",
    availableForSale: true,
  },
  {
    id: "2",
    title: "Combat Zip Up — Military Green",
    handle: "combat-zip-up-military-green",
    description: "400 GSM cropped heavyweight hoodie. 100% cotton construction. Custom patchwork",
    images: [
      { id: "img2a", src: greenHoodie1, altText: "Combat Zip Up in Military Green — Front" },
      { id: "img2b", src: greenHoodie2, altText: "Combat Zip Up in Military Green — Full" },
      { id: "img2c", src: greenHoodie3, altText: "Combat Zip Up in Military Green — Detail" },
    ],
    variants: [
      { id: "v2-s", title: "S", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "v2-m", title: "M", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "v2-l", title: "L", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "L" }] },
      { id: "v2-xl", title: "XL", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "XL" }] },
    ],
    productType: "Hoodies",
    tags: ["hoodie", "heavyweight", "new", "cropped"],
    vendor: "Bombshell",
    availableForSale: true,
  },
  {
    id: "3",
    title: "Combat Zip Up — Black",
    handle: "combat-zip-up-black",
    description: "400 GSM cropped heavyweight hoodie. 100% cotton construction. Custom patchwork",
    images: [
      { id: "img3a", src: blackHoodie1, altText: "Combat Zip Up in Black — Front" },
      { id: "img3b", src: blackHoodie2, altText: "Combat Zip Up in Black — Detail" },
      { id: "img3c", src: blackHoodie3, altText: "Combat Zip Up in Black — Back" },
    ],
    variants: [
      { id: "v3-s", title: "S", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "v3-m", title: "M", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "v3-l", title: "L", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "L" }] },
      { id: "v3-xl", title: "XL", price: "249.00", available: true, selectedOptions: [{ name: "Size", value: "XL" }] },
    ],
    productType: "Hoodies",
    tags: ["hoodie", "heavyweight", "new", "cropped"],
    vendor: "Bombshell",
    availableForSale: true,
  },
];

const mockCollections: Collection[] = [
  {
    id: "c1",
    title: "Drop 001",
    handle: "drop-001",
    description: "The inaugural collection. Military precision meets streetwear edge.",
    image: { id: "ci1", src: greyHoodie1, altText: "Drop 001" },
    products: mockProducts,
  },
];

// ─── Service Functions ───────────────────────────────────────

export async function fetchAllProducts(): Promise<Product[]> {
  return mockProducts;
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
  return mockProducts.find((p) => p.handle === handle);
}

export async function fetchAllCollections(): Promise<Collection[]> {
  return mockCollections;
}

export async function fetchCollectionByHandle(handle: string): Promise<Collection | undefined> {
  return mockCollections.find((c) => c.handle === handle);
}

export function getProductTypes(): string[] {
  return [...new Set(mockProducts.map((p) => p.productType))];
}
