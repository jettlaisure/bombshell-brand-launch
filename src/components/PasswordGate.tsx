import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import logoGif from "@/assets/logo-animated.gif";
import bombshellBg from "@/assets/bombshell-bg-dark.jpeg";

const CORRECT_PASSWORD = "Bombshell_Admin";
const LAUNCH_PASSWORD = "Bombshell_Launch";

interface PasswordGateProps {
  children: React.ReactNode;
}

const PasswordGate = ({ children }: PasswordGateProps) => {
  const [launched, setLaunched] = useState<boolean | null>(null);
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem("bombshell_unlocked") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Check for preview mode on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "true") {
      setIsPreview(true);
    }
  }, []);

  // Check if site has been globally launched
  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "site_launched")
      .single()
      .then(({ data }) => {
        setLaunched(data?.value === "true");
      });
  }, []);

  // SMS signup state
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(false);
  const [smsSubmitted, setSmsSubmitted] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    // Remove leading 1 for formatting, add back later
    const national = digits.startsWith("1") ? digits.slice(1) : digits;
    if (national.length <= 3) return national;
    if (national.length <= 6) return `(${national.slice(0, 3)}) ${national.slice(3)}`;
    return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6, 10)}`;
  };

  const toE164 = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.startsWith("1") && digits.length === 11) return `+${digits}`;
    if (digits.length === 10) return `+1${digits}`;
    return `+${digits}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    setPhoneError("");
  };

  const validatePhone = (): boolean => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setPhoneError("Enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError(false);
      setExiting(true);
      setTimeout(() => {
        sessionStorage.setItem("bombshell_unlocked", "true");
        setUnlocked(true);
      }, 800);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  const handleSmsSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;
    if (!consent) return;
    setSmsLoading(true);
    const e164Phone = toE164(phone);
    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().slice(0, 200);

    // Save to database and sync to Shopify in parallel
    await Promise.all([
      supabase.from("sms_subscribers").insert({
        phone: e164Phone,
        name: cleanName || null,
        email: cleanEmail || null,
      }),
      supabase.functions.invoke("shopify-customer-sync", {
        body: {
          name: cleanName || null,
          phone: e164Phone,
          email: cleanEmail || null,
        },
      }),
    ]);

    setSmsLoading(false);
    setSmsSubmitted(true);
  };

  // Show nothing while checking launch status (unless in preview mode)
  if (launched === null && !isPreview) return null;
  if (launched || unlocked || isPreview) return <>{children}</>;

  return (
    <>
      <AnimatePresence>
        {!exiting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center bg-white overflow-y-auto"
          >
            {/* Background that scrolls with content */}
            <div
              className="absolute top-0 left-0 right-0 bg-position-mobile bg-position-desktop"
              style={{
                backgroundImage: `url(${bombshellBg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                height: "150vh",
                maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
              }}
            />
            {/* Overlay covers everything */}
            <div className="fixed inset-0 bg-white/40 pointer-events-none z-[1]" />
            {/* Logo pinned near top */}
            <div className="relative z-10 w-full flex justify-center pt-6 md:pt-14">
              <img
                src={logoGif}
                alt="Bombshell"
                className="w-72 md:w-[38rem]"
              />
            </div>

            {/* Centered content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-10 flex flex-col items-center gap-6 md:gap-10 px-6 w-full max-w-md md:max-w-lg flex-1 justify-center pb-12 md:pb-20"
            >
              <h1
                className="text-2xl md:text-5xl uppercase tracking-[0.15em] text-foreground whitespace-nowrap -mt-2 md:-mt-4"
                style={{ fontFamily: "'Akira Expanded', sans-serif" }}
              >
                Coming Soon
              </h1>

              {/* SMS Signup */}
              <div className="w-full mt-2 md:mt-6">
                {smsSubmitted ? (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xs md:text-sm uppercase tracking-[0.2em] text-muted-foreground"
                    style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                  >
                    You're on the list ✦
                  </motion.p>
                ) : (
                  <form onSubmit={handleSmsSignup} className="flex flex-col items-center gap-4 md:gap-6">
                    <p
                      className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-foreground/70 text-center"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    >
                      Sign up for exclusive drops & updates
                    </p>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value === CORRECT_PASSWORD) {
                          setExiting(true);
                          setTimeout(() => {
                            sessionStorage.setItem("bombshell_unlocked", "true");
                            setUnlocked(true);
                          }, 800);
                        } else if (e.target.value === LAUNCH_PASSWORD) {
                          supabase.functions.invoke("toggle-launch", {
                            body: { password: LAUNCH_PASSWORD },
                          });
                          setExiting(true);
                          setTimeout(() => {
                            setLaunched(true);
                          }, 800);
                        }
                      }}
                      placeholder="Name"
                      maxLength={100}
                      className="w-full bg-transparent border-b border-foreground/30 py-3 md:py-4 text-center text-sm md:text-base uppercase tracking-[0.15em] text-foreground placeholder:text-foreground/85 focus:outline-none focus:border-foreground transition-colors"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="(555) 555-5555"
                      maxLength={14}
                      required
                      className="w-full bg-transparent border-b border-foreground/30 py-3 md:py-4 text-center text-sm md:text-base uppercase tracking-[0.15em] text-foreground placeholder:text-foreground/85 focus:outline-none focus:border-foreground transition-colors"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    />
                    {phoneError && (
                      <p
                        className="text-destructive text-[9px] md:text-[11px] uppercase tracking-[0.15em] -mt-2"
                        style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                      >
                        {phoneError}
                      </p>
                    )}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      maxLength={200}
                      className="w-full bg-transparent border-b border-foreground/30 py-3 md:py-4 text-center text-sm md:text-base uppercase tracking-[0.15em] text-foreground placeholder:text-foreground/85 focus:outline-none focus:border-foreground transition-colors"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    />
                    <label className="flex items-start gap-3 cursor-pointer mt-1 md:mt-2">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 accent-foreground md:w-4 md:h-4"
                        required
                      />
                      <span
                        className="text-[8px] md:text-[10px] leading-relaxed text-foreground/85 text-left"
                        style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                      >
                        By signing up, you agree to receive recurring marketing texts & emails. Msg & data rates may apply. Reply STOP to cancel.
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={smsLoading || !consent}
                      className="w-full py-3 md:py-4 bg-foreground text-background text-xs md:text-sm uppercase tracking-[0.25em] hover:bg-foreground/85 transition-colors disabled:opacity-50"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    >
                      {smsLoading ? "..." : "Join the List"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {exiting && children}
    </>
  );
};

export default PasswordGate;
