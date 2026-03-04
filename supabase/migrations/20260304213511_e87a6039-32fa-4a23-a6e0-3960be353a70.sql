CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read site settings
CREATE POLICY "Anyone can read site_settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Only allow inserts/updates via service role (edge function) - no direct client writes
-- We'll use an edge function to toggle the launch state

INSERT INTO public.site_settings (key, value) VALUES ('site_launched', 'false');