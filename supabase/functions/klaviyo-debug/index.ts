import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async () => {
  const apiKey = Deno.env.get("KLAVIYO_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "no api key" }), { status: 500 });
  }
  const res = await fetch(
    "https://a.klaviyo.com/api/lists/VqkTmC/profiles/?fields[profile]=phone_number",
    {
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        revision: "2024-10-15",
        Accept: "application/vnd.api+json",
      },
    },
  );
  const body = await res.json();
  const phones = (body.data ?? []).map((p: any) => p.attributes?.phone_number).filter(Boolean);
  return new Response(JSON.stringify({ phones }), {
    headers: { "Content-Type": "application/json" },
  });
});
