// Shopify-compatible types — mirrors Storefront API object shapes
// When integrating Shopify, map API responses to these types

export interface ProductImage {
  id: string;
  src: string;
  altText: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  available: boolean;
  selectedOptions: { name: string; value: string }[];
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  productType: string;
  tags: string[];
  vendor: string;
  availableForSale: boolean;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ProductImage;
  products: Product[];
}

export interface CartItem {
  variantId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalPrice: string;
}
