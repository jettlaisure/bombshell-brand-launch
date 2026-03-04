import { useQuery } from "@tanstack/react-query";
import {
  fetchAllProducts,
  fetchProductByHandle,
  fetchAllCollections,
  fetchCollectionByHandle,
} from "@/lib/shopify";

export function useProducts() {
  return useQuery({
    queryKey: ["shopify", "products"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductByHandle(handle: string | undefined) {
  return useQuery({
    queryKey: ["shopify", "product", handle],
    queryFn: () => fetchProductByHandle(handle!),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["shopify", "collections"],
    queryFn: fetchAllCollections,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCollectionByHandle(handle: string | undefined) {
  return useQuery({
    queryKey: ["shopify", "collection", handle],
    queryFn: () => fetchCollectionByHandle(handle!),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });
}
