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

// ─── Mock Data ───────────────────────────────────────────────

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Bombshell Cropped Heavyweight Hoodie — Light Grey",
    handle: "bombshell-cropped-hoodie-light-grey",
    description: "400 GSM cropped heavyweight hoodie. 100% cotton construction. Custom patchwork",
    images: [
      { id: "img1a", src: greyHoodie1, altText: "Bombshell Cropped Heavyweight Hoodie in Light Grey — Front" },
      { id: "img1b", src: greyHoodie2, altText: "Bombshell Cropped Heavyweight Hoodie in Light Grey — Detail" },
      { id: "img1c", src: greyHoodie3, altText: "Bombshell Cropped Heavyweight Hoodie in Light Grey — Side" },
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
    title: "Bombshell Cropped Heavyweight Hoodie — Military Green",
    handle: "bombshell-cropped-hoodie-military-green",
    description: "400 GSM cropped heavyweight hoodie. 100% cotton construction. Custom patchwork",
    images: [
      { id: "img2a", src: greenHoodie1, altText: "Bombshell Cropped Heavyweight Hoodie in Military Green — Front" },
      { id: "img2b", src: greenHoodie2, altText: "Bombshell Cropped Heavyweight Hoodie in Military Green — Full" },
      { id: "img2c", src: greenHoodie3, altText: "Bombshell Cropped Heavyweight Hoodie in Military Green — Detail" },
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
