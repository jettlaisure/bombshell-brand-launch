import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import logoImg from "@/assets/bombshell-logo.png";

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "true") {
      setIsPreview(true);
    }
  }, []);

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

  // Email signup state
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hidden password entry via keyboard shortcut
  const [hiddenInput, setHiddenInput] = useState("");

  const bufferRef = { current: "" };
  const bufferTimerRef = { current: null as ReturnType<typeof setTimeout> | null };

  const checkBuffer = (buf: string) => {
    if (buf.includes(CORRECT_PASSWORD)) {
      setExiting(true);
      setTimeout(() => {
        sessionStorage.setItem("bombshell_unlocked", "true");
        setUnlocked(true);
      }, 800);
      return true;
    } else if (buf.includes(LAUNCH_PASSWORD)) {
      supabase.functions.invoke("toggle-launch", {
        body: { password: LAUNCH_PASSWORD },
      });
      setExiting(true);
      setTimeout(() => {
        setLaunched(true);
      }, 800);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      bufferRef.current += e.key;
      if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
      bufferTimerRef.current = setTimeout(() => { bufferRef.current = ""; }, 2000);
      checkBuffer(bufferRef.current);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    const cleanEmail = email.trim().slice(0, 200);
    if (!cleanEmail) return;
    setLoading(true);

    await Promise.all([
      supabase.from("sms_subscribers").insert({
        phone: "email-only",
        email: cleanEmail,
      }),
      supabase.functions.invoke("shopify-customer-sync", {
        body: { email: cleanEmail },
      }),
    ]);

    setLoading(false);
    setSubmitted(true);
  };

  if (launched === null && !isPreview) return null;
  if (launched || unlocked || isPreview) return <>{children}</>;

  return (
    <>
      {/* Video is outside motion.div so framer-motion's transform never
          becomes its containing block — position:fixed resolves to the viewport */}
      {!exiting && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="password-gate-video"
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 99 }}
        >
          <source src="/bombshell-bg-video.mp4" type="video/mp4" />
        </video>
      )}
      <AnimatePresence>
        {!exiting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="z-[100] flex w-full flex-col items-center justify-center bg-black"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingRight: "env(safe-area-inset-right, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              paddingLeft: "env(safe-area-inset-left, 0px)",
              boxSizing: "border-box",
            }}
          >
            <div className="absolute inset-0 bg-black/60 pointer-events-none z-[1]" />

            {/* Logo above form */}
            <div className="relative z-[2] flex justify-center -mb-4 md:-mb-6 mt-[-10vh] md:-mt-[20vh]">
              <img src={logoImg} alt="Bombshell" className="w-[9.2rem] md:w-72" />
            </div>

            {/* Centered content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative z-[2] flex flex-col items-center gap-3 md:gap-5 px-6 w-full max-w-md md:max-w-lg mt-[20vh] md:mt-0"
            >
              <h1
                className="text-3xl md:text-6xl uppercase tracking-[0.15em] text-white whitespace-nowrap drop-shadow-lg"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Coming Soon
              </h1>

              <div className="w-full mt-1 md:mt-3">
                {submitted ? (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xs md:text-sm uppercase tracking-[0.2em] text-white/80"
                    style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                  >
                    You're on the list ✦
                  </motion.p>
                ) : (
                  <form onSubmit={handleEmailSignup} className="flex flex-col items-center gap-2 md:gap-4">
                    <p
                      className="text-[10px] md:text-sm uppercase tracking-[0.2em] text-white/70 text-center drop-shadow"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    >
                      Sign up for early access and future discounts
                    </p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                        if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
                        bufferRef.current = val;
                        bufferTimerRef.current = setTimeout(() => { bufferRef.current = ""; }, 2000);
                        checkBuffer(val);
                      }}
                      placeholder="Email"
                      maxLength={200}
                      required
                      className="w-full bg-transparent border-b border-white/30 py-2 md:py-3 text-center text-sm md:text-base uppercase tracking-[0.15em] text-white placeholder:text-white/70 focus:outline-none focus:border-white transition-colors"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    />
                    <label className="flex items-start gap-3 cursor-pointer mt-0 md:mt-1">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 accent-white md:w-4 md:h-4"
                        required
                      />
                      <span
                        className="text-[8px] md:text-[10px] leading-relaxed text-white/80 text-left"
                        style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                      >
                        By signing up, you agree to receive recurring marketing emails. Msg & data rates may apply.
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={loading || !consent}
                      className="w-full py-2.5 md:py-3 bg-white text-black text-xs md:text-sm uppercase tracking-[0.25em] hover:bg-white/85 transition-colors disabled:opacity-50"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    >
                      {loading ? "..." : "Join the List"}
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
