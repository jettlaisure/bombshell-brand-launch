import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHOPIFY_DOMAIN = "bombshell-9199.myshopify.com";
const API_VERSION = "2024-01";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SHOPIFY_ADMIN_API_KEY = Deno.env.get("SHOPIFY_ADMIN_API_KEY");
  if (!SHOPIFY_ADMIN_API_KEY) {
    return new Response(
      JSON.stringify({ error: "SHOPIFY_ADMIN_API_KEY is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { action, handle } = await req.json();

    let endpoint = "";

    switch (action) {
      case "products":
        endpoint = `/admin/api/${API_VERSION}/products.json?status=active`;
        break;
      case "product_by_handle":
        endpoint = `/admin/api/${API_VERSION}/products.json?handle=${handle}`;
        break;
      case "collections":
        endpoint = `/admin/api/${API_VERSION}/custom_collections.json`;
        break;
      case "collection_by_handle":
        endpoint = `/admin/api/${API_VERSION}/custom_collections.json?handle=${handle}`;
        break;
      case "collection_products": {
        // First get the collection ID, then its products
        const colRes = await fetch(
          `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/custom_collections.json?handle=${handle}`,
          {
            headers: {
              "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        const colData = await colRes.json();
        const collection = colData.custom_collections?.[0];
        if (!collection) {
          return new Response(
            JSON.stringify({ error: "Collection not found" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        const prodsRes = await fetch(
          `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/products.json?collection_id=${collection.id}`,
          {
            headers: {
              "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        const prodsData = await prodsRes.json();
        return new Response(
          JSON.stringify({ collection, products: prodsData.products || [] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const response = await fetch(`https://${SHOPIFY_DOMAIN}${endpoint}`, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Shopify API error [${response.status}]: ${errText}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
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
