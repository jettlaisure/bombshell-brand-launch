import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const normalizePhone = (value: string) => {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (trimmed.startsWith("+") && digits.length >= 10 && digits.length <= 15) return `+${digits}`;

  return null;
};

const Newsletter = () => {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err) {
      console.error("SMS signup failed:", err);
      setError("Couldn't sign you up right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding py-24 md:py-32 border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Community</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight text-foreground mb-4">
          Get Early Access
        </h2>
        <p className="text-sm text-muted-foreground mb-10">
          Be the first to know about drops, restocks, and exclusives.
        </p>

        {submitted ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-accent uppercase tracking-[0.15em]"
          >
            You're in. Stay ready.
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-0">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="PHONE NUMBER"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError(null);
              }}
              required
              aria-label="Phone number"
              className="flex-1 bg-secondary border border-border px-5 py-3 text-xs uppercase tracking-[0.15em] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-foreground text-background text-xs uppercase tracking-[0.2em] font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Joining" : "Join"}
            </button>
          </form>
        )}
        {error && !submitted && (
          <p className="mt-4 text-[10px] uppercase tracking-[0.15em] text-accent" role="alert">
            {error}
          </p>
        )}
        <p className="mx-auto mt-5 max-w-lg text-[10px] leading-5 text-muted-foreground">
          By signing up via text, you agree to receive recurring automated marketing messages at the phone number provided. Consent is not a condition of purchase. Reply STOP to unsubscribe, HELP for help. Msg &amp; data rates may apply. Msg frequency varies. View our <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</Link> and <Link to="/sms-terms" className="underline underline-offset-2 hover:text-foreground">SMS Terms</Link>.
        </p>
      </motion.div>
    </section>
  );
};

export default Newsletter;
