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
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";

// ─── Mock Data ───────────────────────────────────────────────

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Stealth Hoodie",
    handle: "stealth-hoodie",
    description: "Oversized hoodie with military-grade detailing. Heavyweight 450gsm cotton.",
    images: [{ id: "img1", src: product1, altText: "Stealth Hoodie" }],
    variants: [
      { id: "v1-s", title: "S", price: "185.00", available: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "v1-m", title: "M", price: "185.00", available: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "v1-l", title: "L", price: "185.00", available: true, selectedOptions: [{ name: "Size", value: "L" }] },
      { id: "v1-xl", title: "XL", price: "185.00", available: false, selectedOptions: [{ name: "Size", value: "XL" }] },
    ],
    productType: "Hoodies",
    tags: ["hoodie", "essentials", "new"],
    vendor: "Bombshell",
    availableForSale: true,
  },
  {
    id: "2",
    title: "Warfare Tee",
    handle: "warfare-tee",
    description: "Distressed graphic tee with vintage wash. 100% organic cotton.",
    images: [{ id: "img2", src: product2, altText: "Warfare Tee" }],
    variants: [
      { id: "v2-s", title: "S", price: "95.00", available: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "v2-m", title: "M", price: "95.00", available: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "v2-l", title: "L", price: "95.00", available: true, selectedOptions: [{ name: "Size", value: "L" }] },
    ],
    productType: "T-Shirts",
    tags: ["tee", "graphic", "new"],
    vendor: "Bombshell",
    availableForSale: true,
  },
  {
    id: "3",
    title: "Tactical Vest",
    handle: "tactical-vest",
    description: "Utility vest with multiple cargo pockets. Water-resistant nylon shell.",
    images: [{ id: "img3", src: product3, altText: "Tactical Vest" }],
    variants: [
      { id: "v3-s", title: "S", price: "240.00", available: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "v3-m", title: "M", price: "240.00", available: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "v3-l", title: "L", price: "240.00", available: false, selectedOptions: [{ name: "Size", value: "L" }] },
    ],
    productType: "Outerwear",
    tags: ["vest", "tactical", "new"],
    vendor: "Bombshell",
    availableForSale: true,
  },
  {
    id: "4",
    title: "Cargo Joggers",
    handle: "cargo-joggers",
    description: "Slim-fit cargo joggers with zippered pockets. Stretch twill fabric.",
    images: [{ id: "img4", src: product4, altText: "Cargo Joggers" }],
    variants: [
      { id: "v4-s", title: "S", price: "145.00", available: true, selectedOptions: [{ name: "Size", value: "S" }] },
      { id: "v4-m", title: "M", price: "145.00", available: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "v4-l", title: "L", price: "145.00", available: true, selectedOptions: [{ name: "Size", value: "L" }] },
    ],
    productType: "Bottoms",
    tags: ["joggers", "cargo", "essentials"],
    vendor: "Bombshell",
    availableForSale: true,
  },
  {
    id: "5",
    title: "Blackout Cap",
    handle: "blackout-cap",
    description: "Structured six-panel cap with embroidered logo. Adjustable strap.",
    images: [{ id: "img5", src: product5, altText: "Blackout Cap" }],
    variants: [
      { id: "v5-os", title: "One Size", price: "55.00", available: true, selectedOptions: [{ name: "Size", value: "One Size" }] },
    ],
    productType: "Accessories",
    tags: ["cap", "accessories"],
    vendor: "Bombshell",
    availableForSale: true,
  },
  {
    id: "6",
    title: "Stealth Hoodie — Smoke",
    handle: "stealth-hoodie-smoke",
    description: "Smoke grey variant of the signature Stealth Hoodie.",
    images: [{ id: "img6", src: product1, altText: "Stealth Hoodie Smoke" }],
    variants: [
      { id: "v6-m", title: "M", price: "185.00", available: true, selectedOptions: [{ name: "Size", value: "M" }] },
      { id: "v6-l", title: "L", price: "185.00", available: true, selectedOptions: [{ name: "Size", value: "L" }] },
    ],
    productType: "Hoodies",
    tags: ["hoodie", "essentials"],
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
    image: { id: "ci1", src: product1, altText: "Drop 001" },
    products: mockProducts.filter((p) => p.tags.includes("new")),
  },
  {
    id: "c2",
    title: "Essentials",
    handle: "essentials",
    description: "Wardrobe staples built to last. No compromises.",
    image: { id: "ci2", src: product4, altText: "Essentials" },
    products: mockProducts.filter((p) => p.tags.includes("essentials")),
  },
  {
    id: "c3",
    title: "Outerwear",
    handle: "outerwear",
    description: "Engineered for the elements. Functional. Formidable.",
    image: { id: "ci3", src: product3, altText: "Outerwear" },
    products: mockProducts.filter((p) => ["Outerwear", "Hoodies"].includes(p.productType)),
  },
];

// ─── Service Functions ───────────────────────────────────────
// Replace these with Shopify Storefront API GraphQL queries

export async function fetchAllProducts(): Promise<Product[]> {
  // TODO: Replace with Storefront API query
  return mockProducts;
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
  // TODO: Replace with Storefront API query
  return mockProducts.find((p) => p.handle === handle);
}

export async function fetchAllCollections(): Promise<Collection[]> {
  // TODO: Replace with Storefront API query
  return mockCollections;
}

export async function fetchCollectionByHandle(handle: string): Promise<Collection | undefined> {
  // TODO: Replace with Storefront API query
  return mockCollections.find((c) => c.handle === handle);
}

export function getProductTypes(): string[] {
  return [...new Set(mockProducts.map((p) => p.productType))];
}
