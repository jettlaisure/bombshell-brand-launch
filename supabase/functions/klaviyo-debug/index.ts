import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async () => {
  const apiKey = Deno.env.get("KLAVIYO_API_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "no api key" }), { status: 500 });
  }
  const res = await fetch("https://a.klaviyo.com/api/lists/", {
    headers: {
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      revision: "2024-10-15",
      Accept: "application/json",
    },
  });
  const body = await res.json();
  const lists = (body.data ?? []).map((l: any) => ({ id: l.id, name: l.attributes?.name }));
  return new Response(JSON.stringify({ lists }), {
    headers: { "Content-Type": "application/json" },
  });
});
