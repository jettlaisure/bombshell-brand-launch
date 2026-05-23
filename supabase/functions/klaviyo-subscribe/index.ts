import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const KLAVIYO_REVISION = "2024-10-15";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const API_KEY = Deno.env.get("KLAVIYO_API_KEY");
  const LIST_ID = Deno.env.get("KLAVIYO_LIST_ID");
  if (!API_KEY || !LIST_ID) {
    return new Response(JSON.stringify({ error: "Klaviyo not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email } = await req.json();
    const cleanEmail = typeof email === "string" ? email.trim().slice(0, 200) : "";
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const headers = {
      "Authorization": `Klaviyo-API-Key ${API_KEY}`,
      "revision": KLAVIYO_REVISION,
      "Content-Type": "application/json",
      "accept": "application/json",
    };

    // Subscribe profile to list (creates profile if needed, opts into email marketing)
    const res = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs", {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [{
                type: "profile",
                attributes: {
                  email: cleanEmail,
                  subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
                },
              }],
            },
            custom_source: "Bombshell Coming Soon",
          },
          relationships: { list: { data: { type: "list", id: LIST_ID } } },
        },
      }),
    });

    if (!res.ok && res.status !== 202) {
      const text = await res.text();
      console.error("Klaviyo error", res.status, text);
      return new Response(JSON.stringify({ error: `Klaviyo ${res.status}`, detail: text }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
