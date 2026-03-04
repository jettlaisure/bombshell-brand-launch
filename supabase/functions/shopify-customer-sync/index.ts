import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHOPIFY_DOMAIN = "kqskb1-wp.myshopify.com";
const API_VERSION = "2025-01";

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        phone
        firstName
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_SEARCH_QUERY = `
  query searchCustomers($query: String!) {
    customers(first: 1, query: $query) {
      edges {
        node {
          id
          email
          phone
        }
      }
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        email
        phone
        firstName
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function adminFetch(query: string, variables: Record<string, unknown>, token: string) {
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Shopify Admin API error [${res.status}]: ${errText}`);
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

  const SHOPIFY_ADMIN_API_KEY = Deno.env.get("SHOPIFY_ADMIN_API_KEY");
  if (!SHOPIFY_ADMIN_API_KEY) {
    return new Response(
      JSON.stringify({ error: "SHOPIFY_ADMIN_API_KEY is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { name, phone, email } = await req.json();

    if (!phone && !email) {
      return new Response(
        JSON.stringify({ error: "Phone or email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Search for existing customer by phone or email
    const searchQuery = phone ? `phone:${phone}` : `email:${email}`;
    const searchData = await adminFetch(CUSTOMER_SEARCH_QUERY, { query: searchQuery }, SHOPIFY_ADMIN_API_KEY);
    const existingCustomer = searchData.customers?.edges?.[0]?.node;

    let result;

    if (existingCustomer) {
      // Update existing customer with marketing consent
      const input: Record<string, unknown> = {
        id: existingCustomer.id,
      };
      if (name) input.firstName = name;
      if (email && !existingCustomer.email) input.email = email;
      if (phone && !existingCustomer.phone) input.phone = phone;

      if (email) {
        input.emailMarketingConsent = {
          marketingOptInLevel: "SINGLE_OPT_IN",
          marketingState: "SUBSCRIBED",
        };
      }
      if (phone) {
        input.smsMarketingConsent = {
          marketingOptInLevel: "SINGLE_OPT_IN",
          marketingState: "SUBSCRIBED",
        };
      }

      const data = await adminFetch(CUSTOMER_UPDATE_MUTATION, { input }, SHOPIFY_ADMIN_API_KEY);
      result = { customer: data.customerUpdate.customer, userErrors: data.customerUpdate.userErrors, action: "updated" };
    } else {
      // Create new customer with marketing consent
      const input: Record<string, unknown> = {};
      if (name) input.firstName = name;
      if (email) input.email = email;
      if (phone) input.phone = phone;
      input.tags = ["landing-page-signup", "sms-subscriber"];

      if (email) {
        input.emailMarketingConsent = {
          marketingOptInLevel: "SINGLE_OPT_IN",
          marketingState: "SUBSCRIBED",
        };
      }
      if (phone) {
        input.smsMarketingConsent = {
          marketingOptInLevel: "SINGLE_OPT_IN",
          marketingState: "SUBSCRIBED",
        };
      }

      const data = await adminFetch(CUSTOMER_CREATE_MUTATION, { input }, SHOPIFY_ADMIN_API_KEY);
      result = { customer: data.customerCreate.customer, userErrors: data.customerCreate.userErrors, action: "created" };
    }

    if (result.userErrors && result.userErrors.length > 0) {
      console.error("Shopify customer errors:", result.userErrors);
    }

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Shopify customer sync error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
