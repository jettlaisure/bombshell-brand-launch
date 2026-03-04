import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_DOMAIN = "kqskb1-wp.myshopify.com";
const API_VERSION = "2025-01";
const STORAGE_BASE = "https://tlygguppuyrbcsmjiqug.supabase.co/storage/v1/object/public/product-images";

const PRODUCTS = [
  {
    title: "Combat Zip Up — Heather Grey",
    body_html: "400 GSM heavyweight cotton. Cropped fit. Custom patchwork detailing. YKK zippers. Ribbed cuffs and hem.",
    vendor: "Bombshell",
    product_type: "Hoodies",
    tags: "heavyweight, cropped, zip-up",
    variants: [
      { option1: "S", price: "120.00" },
      { option1: "M", price: "120.00" },
      { option1: "L", price: "120.00" },
      { option1: "XL", price: "120.00" },
    ],
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
    images: [
      { src: `${STORAGE_BASE}/grey-hoodie-1.jpeg`, alt: "Combat Zip Up Heather Grey front" },
      { src: `${STORAGE_BASE}/grey-hoodie-2.jpeg`, alt: "Combat Zip Up Heather Grey detail" },
      { src: `${STORAGE_BASE}/grey-hoodie-3.jpeg`, alt: "Combat Zip Up Heather Grey back" },
    ],
  },
  {
    title: "Combat Zip Up — Military Green",
    body_html: "400 GSM heavyweight cotton. Cropped fit. Custom patchwork detailing. YKK zippers. Ribbed cuffs and hem.",
    vendor: "Bombshell",
    product_type: "Hoodies",
    tags: "heavyweight, cropped, zip-up",
    variants: [
      { option1: "S", price: "120.00" },
      { option1: "M", price: "120.00" },
      { option1: "L", price: "120.00" },
      { option1: "XL", price: "120.00" },
    ],
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
    images: [
      { src: `${STORAGE_BASE}/green-hoodie-1.jpeg`, alt: "Combat Zip Up Military Green front" },
      { src: `${STORAGE_BASE}/green-hoodie-2.jpeg`, alt: "Combat Zip Up Military Green detail" },
      { src: `${STORAGE_BASE}/green-hoodie-3.jpeg`, alt: "Combat Zip Up Military Green back" },
    ],
  },
  {
    title: "Combat Zip Up — Black",
    body_html: "400 GSM heavyweight cotton. Cropped fit. Custom patchwork detailing. YKK zippers. Ribbed cuffs and hem.",
    vendor: "Bombshell",
    product_type: "Hoodies",
    tags: "heavyweight, cropped, zip-up",
    variants: [
      { option1: "S", price: "120.00" },
      { option1: "M", price: "120.00" },
      { option1: "L", price: "120.00" },
      { option1: "XL", price: "120.00" },
    ],
    options: [{ name: "Size", values: ["S", "M", "L", "XL"] }],
    images: [
      { src: `${STORAGE_BASE}/black-hoodie-1.jpeg`, alt: "Combat Zip Up Black front" },
      { src: `${STORAGE_BASE}/black-hoodie-2.jpeg`, alt: "Combat Zip Up Black detail" },
      { src: `${STORAGE_BASE}/black-hoodie-3.jpeg`, alt: "Combat Zip Up Black back" },
    ],
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SHOPIFY_ADMIN_API_KEY = Deno.env.get("SHOPIFY_ADMIN_API_KEY");
  if (!SHOPIFY_ADMIN_API_KEY) {
    return new Response(
      JSON.stringify({ error: "SHOPIFY_ADMIN_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const results: any[] = [];

  for (const product of PRODUCTS) {
    try {
      const res = await fetch(
        `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/products.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        results.push({ title: product.title, error: errText, status: res.status });
      } else {
        const data = await res.json();
        results.push({ title: product.title, id: data.product.id, handle: data.product.handle, status: "created" });
      }
    } catch (err) {
      results.push({ title: product.title, error: String(err) });
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
