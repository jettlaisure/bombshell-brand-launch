/**
 * Shopify Service Layer
 * Fetches live data from Shopify Storefront API via secure edge function proxy.
 */

import type { Product, Collection, ProductImage, ProductVariant } from "@/types/shopify";
import { supabase } from "@/integrations/supabase/client";

// ─── Mappers (Storefront API shape) ─────────────────────────

function mapEdges<T>(edges: any[] | undefined): T[] {
  return (edges || []).map((e: any) => e.node);
}

function mapStorefrontProduct(p: any): Product {
  return {
    id: String(p.id),
    title: p.title,
    handle: p.handle,
    description: p.description || "",
    descriptionHtml: p.descriptionHtml || "",
    images: mapEdges<any>(p.images?.edges).map((img: any): ProductImage => ({
      id: String(img.id),
      src: img.src,
      altText: img.altText || p.title,
    })),
    variants: mapEdges<any>(p.variants?.edges).map((v: any): ProductVariant => ({
      id: String(v.id),
      title: v.title,
      price: v.price?.amount || "0.00",
      compareAtPrice: v.compareAtPrice?.amount || undefined,
      available: v.availableForSale ?? true,
      selectedOptions: v.selectedOptions || [],
    })),
    productType: p.productType || "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    vendor: p.vendor || "",
    availableForSale: p.availableForSale ?? true,
  };
}

function mapStorefrontCollection(c: any, products: Product[] = []): Collection {
  return {
    id: String(c.id),
    title: c.title,
    handle: c.handle,
    description: c.description || "",
    image: c.image
      ? { id: String(c.image.id || c.id), src: c.image.src, altText: c.image.altText || c.title }
      : undefined,
    products,
  };
}

// ─── API Calls ───────────────────────────────────────────────

async function callProxy(body: Record<string, string>): Promise<any> {
  const { data, error } = await supabase.functions.invoke("shopify-proxy", {
    body,
  });
  if (error) throw new Error(`Shopify proxy error: ${error.message}`);
  return data;
}

export async function fetchAllProducts(): Promise<Product[]> {
  const data = await callProxy({ action: "products" });
  return (data.products || []).map(mapStorefrontProduct);
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
  const data = await callProxy({ action: "product_by_handle", handle });
  return data.product ? mapStorefrontProduct(data.product) : undefined;
}

export async function fetchAllCollections(): Promise<Collection[]> {
  const data = await callProxy({ action: "collections" });
  return (data.collections || []).map((c: any) => mapStorefrontCollection(c));
}

export async function fetchCollectionByHandle(handle: string): Promise<Collection | undefined> {
  const data = await callProxy({ action: "collection_by_handle", handle });
  if (data.error) return undefined;
  const products = (data.products || []).map(mapStorefrontProduct);
  return mapStorefrontCollection(data.collection, products);
}

export function getProductTypes(): string[] {
  return [];
}
