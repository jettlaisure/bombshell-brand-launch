CREATE TABLE public.sms_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sms_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts so visitors can sign up without auth
CREATE POLICY "Allow anonymous inserts" ON public.sms_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
