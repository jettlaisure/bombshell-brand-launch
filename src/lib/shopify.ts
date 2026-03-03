/**
 * Shopify Service Layer
 * Fetches live data from Shopify Admin API via secure edge function proxy.
 */

import type { Product, Collection, ProductImage, ProductVariant } from "@/types/shopify";
import { supabase } from "@/integrations/supabase/client";

// ─── Mappers ─────────────────────────────────────────────────

function mapShopifyProduct(p: any): Product {
  return {
    id: String(p.id),
    title: p.title,
    handle: p.handle,
    description: p.body_html?.replace(/<[^>]*>/g, "") || "",
    descriptionHtml: p.body_html || "",
    images: (p.images || []).map((img: any): ProductImage => ({
      id: String(img.id),
      src: img.src,
      altText: img.alt || p.title,
    })),
    variants: (p.variants || []).map((v: any): ProductVariant => ({
      id: String(v.id),
      title: v.title,
      price: v.price,
      compareAtPrice: v.compare_at_price || undefined,
      available: v.inventory_quantity > 0,
      selectedOptions: (v.option1 ? [{ name: "Size", value: v.option1 }] : [])
        .concat(v.option2 ? [{ name: "Color", value: v.option2 }] : [])
        .concat(v.option3 ? [{ name: "Material", value: v.option3 }] : []),
    })),
    productType: p.product_type || "",
    tags: typeof p.tags === "string" ? p.tags.split(", ").filter(Boolean) : (p.tags || []),
    vendor: p.vendor || "",
    availableForSale: p.status === "active",
  };
}

function mapShopifyCollection(c: any, products: Product[] = []): Collection {
  return {
    id: String(c.id),
    title: c.title,
    handle: c.handle,
    description: c.body_html?.replace(/<[^>]*>/g, "") || "",
    image: c.image
      ? { id: String(c.image.id || c.id), src: c.image.src, altText: c.image.alt || c.title }
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
  return (data.products || []).map(mapShopifyProduct);
}

export async function fetchProductByHandle(handle: string): Promise<Product | undefined> {
  const data = await callProxy({ action: "product_by_handle", handle });
  const products = (data.products || []).map(mapShopifyProduct);
  return products[0];
}

export async function fetchAllCollections(): Promise<Collection[]> {
  const data = await callProxy({ action: "collections" });
  return (data.custom_collections || []).map((c: any) => mapShopifyCollection(c));
}

export async function fetchCollectionByHandle(handle: string): Promise<Collection | undefined> {
  const data = await callProxy({ action: "collection_products", handle });
  if (data.error) return undefined;
  const products = (data.products || []).map(mapShopifyProduct);
  return mapShopifyCollection(data.collection, products);
}

export function getProductTypes(): string[] {
  // This now needs to be called after products are fetched
  return [];
}
