import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const DISMISSED_KEY = "bombshell_sms_offer_dismissed";
const DISPLAY_DELAY_MS = 10_000;

const normalizePhone = (value: string) => {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (trimmed.startsWith("+") && digits.length >= 10 && digits.length <= 15) return `+${digits}`;

  return null;
};

const SmsOfferPopup = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLegalPage = pathname === "/privacy" || pathname === "/sms-terms";

  useEffect(() => {
    if (isLegalPage || window.localStorage.getItem(DISMISSED_KEY) === "true") return;

    const timer = window.setTimeout(() => setOpen(true), DISPLAY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isLegalPage]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) window.localStorage.setItem(DISMISSED_KEY, "true");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      setError("Enter a valid phone number.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error: submitError } = await supabase.functions.invoke<{ success?: boolean; error?: string }>(
        "klaviyo-subscribe",
        { body: { phone: normalizedPhone } },
      );

      if (submitError) throw submitError;
      if (data?.error) throw new Error(data.error);

      window.localStorage.setItem(DISMISSED_KEY, "true");
      setSubmitted(true);
      setPhone("");
    } catch (submitError) {
      console.error("SMS offer signup failed:", submitError);
      setError("Couldn't sign you up right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLegalPage) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-none border-border bg-background px-6 py-12 text-center shadow-2xl sm:px-10 sm:py-14 [&>button]:rounded-none">
        {submitted ? (
          <div className="py-5">
            <DialogTitle className="font-heading text-3xl uppercase leading-tight tracking-[0] text-foreground sm:text-4xl">
              Check Your Texts
            </DialogTitle>
            <DialogDescription className="mt-4 text-sm leading-6 text-muted-foreground">
              Your 15% off code is on its way.
            </DialogDescription>
          </div>
        ) : (
          <>
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-accent">SMS Exclusive</p>
              <DialogTitle className="font-heading text-4xl uppercase leading-none tracking-[0] text-foreground sm:text-5xl">
                Get 15% Off
              </DialogTitle>
              <DialogDescription className="mt-5 text-sm leading-6 text-muted-foreground">
                Sign up for texts and we'll send your discount code straight to your phone.
              </DialogDescription>
            </div>

            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="PHONE NUMBER"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  if (error) setError(null);
                }}
                required
                maxLength={32}
                aria-label="Phone number"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "sms-offer-error" : undefined}
                className="h-12 w-full border border-border bg-secondary px-4 text-center text-xs uppercase tracking-[0.15em] text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-none text-xs uppercase tracking-[0.2em]"
              >
                {isSubmitting ? "Sending" : "Send My 15% Off"}
              </Button>
              {error && (
                <p id="sms-offer-error" className="text-[10px] uppercase tracking-[0.15em] text-accent" role="alert">
                  {error}
                </p>
              )}
            </form>

            <p className="mt-2 text-[9px] leading-4 text-muted-foreground">
              By signing up via text, you agree to receive recurring automated marketing messages at the phone number provided. Consent is not a condition of purchase. Reply STOP to unsubscribe, HELP for help. Msg &amp; data rates may apply. Msg frequency varies. View our{" "}
              <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link> and{" "}
              <Link to="/sms-terms" className="underline underline-offset-2 hover:text-foreground">SMS Terms</Link>.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SmsOfferPopup;