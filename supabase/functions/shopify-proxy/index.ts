import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHOPIFY_DOMAIN = "kqskb1-wp.myshopify.com";
const API_VERSION = "2025-01";

const PRODUCTS_QUERY = `
  query ($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          productType
          vendor
          tags
          availableForSale
          images(first: 10) {
            edges {
              node {
                id
                src: url
                altText
              }
            }
          }
          variants(first: 30) {
            edges {
              node {
                id
                title
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                availableForSale
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query ($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      vendor
      tags
      availableForSale
      images(first: 10) {
        edges {
          node {
            id
            src: url
            altText
          }
        }
      }
      variants(first: 30) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            availableForSale
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query ($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          image {
            id
            src: url
            altText
          }
        }
      }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  query ($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        id
        src: url
        altText
      }
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            productType
            vendor
            tags
            availableForSale
            images(first: 10) {
              edges {
                node {
                  id
                  src: url
                  altText
                }
              }
            }
            variants(first: 30) {
              edges {
                node {
                  id
                  title
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                  availableForSale
                  selectedOptions { name value }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount { amount currencyCode }
          subtotalAmount { amount currencyCode }
          totalTaxAmount { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product { title handle }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function storefrontFetch(query: string, variables: Record<string, unknown>, token: string) {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Shopify Storefront API error [${res.status}]: ${errText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SHOPIFY_STOREFRONT_TOKEN = Deno.env.get("SHOPIFY_STOREFRONT_TOKEN");
  if (!SHOPIFY_STOREFRONT_TOKEN) {
    return new Response(
      JSON.stringify({ error: "SHOPIFY_STOREFRONT_TOKEN is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { action, handle, lines } = await req.json();
    let result: unknown;

    switch (action) {
      case "products": {
        const data = await storefrontFetch(PRODUCTS_QUERY, { first: 50 }, SHOPIFY_STOREFRONT_TOKEN);
        result = { products: data.products.edges.map((e: any) => e.node) };
        break;
      }
      case "product_by_handle": {
        const data = await storefrontFetch(PRODUCT_BY_HANDLE_QUERY, { handle }, SHOPIFY_STOREFRONT_TOKEN);
        result = { product: data.productByHandle };
        break;
      }
      case "collections": {
        const data = await storefrontFetch(COLLECTIONS_QUERY, { first: 50 }, SHOPIFY_STOREFRONT_TOKEN);
        result = { collections: data.collections.edges.map((e: any) => e.node) };
        break;
      }
      case "collection_by_handle": {
        const data = await storefrontFetch(COLLECTION_BY_HANDLE_QUERY, { handle }, SHOPIFY_STOREFRONT_TOKEN);
        const col = data.collectionByHandle;
        if (!col) {
          return new Response(
            JSON.stringify({ error: "Collection not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = {
          collection: { ...col, products: undefined },
          products: col.products.edges.map((e: any) => e.node),
        };
        break;
      }
      case "create_cart": {
        if (!lines || !Array.isArray(lines) || lines.length === 0) {
          return new Response(
            JSON.stringify({ error: "lines array is required for create_cart" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const data = await storefrontFetch(
          CART_CREATE_MUTATION,
          { input: { lines } },
          SHOPIFY_STOREFRONT_TOKEN
        );
        const cart = data.cartCreate;
        if (cart.userErrors && cart.userErrors.length > 0) {
          return new Response(
            JSON.stringify({ error: cart.userErrors[0].message, userErrors: cart.userErrors }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        result = { cart: cart.cart };
        break;
      }
      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Shopify proxy error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
