import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const KLAVIYO_REVISION = "2024-10-15";

const BodySchema = z
  .object({
    email: z.string().trim().email().max(200).optional(),
    phone: z.string().trim().min(10).max(32).optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "Email or phone is required",
  });

const normalizePhone = (value: string) => {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (trimmed.startsWith("+") && digits.length >= 10 && digits.length <= 15) return `+${digits}`;

  return null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const API_KEY = Deno.env.get("KLAVIYO_API_KEY");
  const LIST_ID = Deno.env.get("KLAVIYO_LIST_ID");
  if (!API_KEY || !LIST_ID) {
    return new Response(JSON.stringify({ error: "Klaviyo not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Valid email or phone required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, phone } = parsed.data;
    const normalizedPhone = phone ? normalizePhone(phone) : null;

    if (phone && !normalizedPhone) {
      return new Response(JSON.stringify({ error: "Valid phone number required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subscriptions: Record<string, unknown> = {};
    const profileAttributes: Record<string, unknown> = {};

    if (email) {
      profileAttributes.email = email;
      subscriptions.email = { marketing: { consent: "SUBSCRIBED" } };
    }

    if (normalizedPhone) {
      profileAttributes.phone_number = normalizedPhone;
      subscriptions.sms = { marketing: { consent: "SUBSCRIBED" } };
    }

    profileAttributes.subscriptions = subscriptions;

    const res = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${API_KEY}`,
        "revision": KLAVIYO_REVISION,
        "Content-Type": "application/vnd.api+json",
        "accept": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [{
                type: "profile",
                attributes: profileAttributes,
              }],
            },
            custom_source: "Bombshell Homepage Signup",
          },
          relationships: { list: { data: { type: "list", id: LIST_ID } } },
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Klaviyo error", res.status, text);
      return new Response(JSON.stringify({ error: "Klaviyo subscription failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Klaviyo subscribe error:", err);
    return new Response(JSON.stringify({ error: "Subscription failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
