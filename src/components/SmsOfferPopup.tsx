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
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(min-width: 640px)").matches,
  );
  const isLegalPage = pathname === "/privacy" || pathname === "/sms-terms";

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)] sm:bottom-5 sm:right-5 sm:left-auto">
          <motion.aside
            role="dialog"
            aria-modal="false"
            aria-labelledby="sms-offer-title"
            aria-describedby="sms-offer-description"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-auto relative w-full border-y border-border bg-background px-3 pb-2 pt-2.5 text-left shadow-2xl sm:w-[20rem] sm:border sm:p-5 sm:text-center"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close SMS offer"
              className="absolute right-0.5 top-0.5 h-6 w-6 rounded-none text-muted-foreground hover:text-foreground sm:h-8 sm:w-8"
            >
              <X aria-hidden="true" />
            </Button>

            {submitted ? (
              <div className="flex items-baseline justify-center gap-2 py-1 sm:block sm:py-2">
                <h2 id="sms-offer-title" className="font-heading text-lg uppercase leading-none tracking-[0] text-foreground sm:text-3xl">
                  Check Your Texts
                </h2>
                <p id="sms-offer-description" className="text-[9px] leading-4 text-muted-foreground sm:mt-2 sm:text-xs">
                  Your 15% off code is on its way.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-1 hidden text-[9px] uppercase tracking-[0.25em] text-accent sm:block">SMS Exclusive</p>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 pr-6 sm:gap-3 sm:block sm:pr-0">
                  <div className="min-w-0">
                    <h2 id="sms-offer-title" className="whitespace-nowrap font-heading text-sm uppercase leading-none tracking-[0] text-foreground sm:text-3xl">
                      Get 15% Off
                    </h2>
                    <p id="sms-offer-description" className="sr-only text-muted-foreground sm:not-sr-only sm:mt-2 sm:text-xs">
                      Sign up for texts and we'll send the code to your phone.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex shrink-0 sm:mt-3 sm:w-full">
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={isDesktop ? "PHONE NUMBER" : "PHONE"}
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
                      className="h-8 min-w-0 flex-1 border border-border bg-secondary px-2 text-[9px] uppercase tracking-[0.05em] text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none sm:h-10 sm:text-[10px] sm:tracking-[0.08em]"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-8 shrink-0 rounded-none px-2 text-[9px] uppercase tracking-[0.12em] sm:h-10 sm:px-3"
                    >
                      {isSubmitting ? "Sending" : "Get Code"}
                    </Button>
                  </form>
                </div>
                {error && (
                  <p id="sms-offer-error" className="mt-1 text-[9px] uppercase tracking-[0.1em] text-accent sm:mt-2 sm:text-[10px]" role="alert">
                    {error}
                  </p>
                )}

                <p className="mt-1.5 pr-5 text-[7px] leading-[9px] text-muted-foreground sm:mt-2 sm:pr-0 sm:text-[8px] sm:leading-3">
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