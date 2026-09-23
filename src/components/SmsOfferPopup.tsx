import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const SEEN_KEY = "bombshell_sms_offer_seen";
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
    if (isLegalPage || window.localStorage.getItem(SEEN_KEY) === "true") return;

    const timer = window.setTimeout(() => {
      window.localStorage.setItem(SEEN_KEY, "true");
      setOpen(true);
    }, DISPLAY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isLegalPage]);

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
    <AnimatePresence>
      {open && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:block sm:p-0">
          <motion.aside
            role="dialog"
            aria-modal="false"
            aria-labelledby="sms-offer-title"
            aria-describedby="sms-offer-description"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-auto relative w-full max-w-sm border border-border bg-background p-5 text-center shadow-2xl sm:w-[22rem] sm:p-6"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close SMS offer"
              className="absolute right-1 top-1 h-9 w-9 rounded-none text-muted-foreground hover:text-foreground"
            >
              <X aria-hidden="true" />
            </Button>

            {submitted ? (
              <div className="py-4">
                <h2 id="sms-offer-title" className="font-heading text-2xl uppercase leading-tight tracking-[0] text-foreground">
                  Check Your Texts
                </h2>
                <p id="sms-offer-description" className="mt-2 text-xs leading-5 text-muted-foreground">
                  Your 15% off code is on its way.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-accent">SMS Exclusive</p>
                <h2 id="sms-offer-title" className="font-heading text-3xl uppercase leading-none tracking-[0] text-foreground">
                  Get 15% Off
                </h2>
                <p id="sms-offer-description" className="mx-auto mt-3 max-w-xs text-xs leading-5 text-muted-foreground">
                  Sign up for texts and we'll send the code to your phone.
                </p>

                <form onSubmit={handleSubmit} className="mt-4 flex">
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
                    className="h-11 min-w-0 flex-1 border border-border bg-secondary px-3 text-xs uppercase tracking-[0.1em] text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 shrink-0 rounded-none px-4 text-[10px] uppercase tracking-[0.15em]"
                  >
                    {isSubmitting ? "Sending" : "Get Code"}
                  </Button>
                </form>
                {error && (
                  <p id="sms-offer-error" className="mt-2 text-[10px] uppercase tracking-[0.1em] text-accent" role="alert">
                    {error}
                  </p>
                )}

                <p className="mt-3 text-[8px] leading-3 text-muted-foreground">
                  By signing up via text, you agree to receive recurring automated marketing messages at the phone number provided. Consent is not a condition of purchase. Reply STOP to unsubscribe, HELP for help. Msg &amp; data rates may apply. Msg frequency varies. View our{" "}
                  <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link> and{" "}
                  <Link to="/sms-terms" className="underline underline-offset-2 hover:text-foreground">SMS Terms</Link>.
                </p>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SmsOfferPopup;