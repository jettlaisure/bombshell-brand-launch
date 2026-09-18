import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const pad = (n: number) => n.toString().padStart(2, "0");

const getTimeRemaining = () => {
  const now = new Date();
  let target = new Date(now.getFullYear(), 8, 19, 0, 0, 0); // September 19
  if (target.getTime() < now.getTime()) {
    target = new Date(now.getFullYear() + 1, 8, 19, 0, 0, 0);
  }
  const diff = target.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
};
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
    // Clear any legacy unlock flags so the gate is guaranteed to reappear
    sessionStorage.removeItem("bombshell_unlocked");
    return sessionStorage.getItem("bombshell_unlocked_v2") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Make html/body black while gate is showing so any iOS rubber-band
  // overscroll reveals black instead of the white page background
  useEffect(() => {
    const prevHtml = document.documentElement.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#000";
    document.body.style.backgroundColor = "#000";
    return () => {
      document.documentElement.style.backgroundColor = prevHtml;
      document.body.style.backgroundColor = prevBody;
    };
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

  // Countdown state
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeRemaining()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Hidden password entry via keyboard shortcut
  const [hiddenInput, setHiddenInput] = useState("");

  const bufferRef = { current: "" };
  const bufferTimerRef = { current: null as ReturnType<typeof setTimeout> | null };

  const checkBuffer = (buf: string) => {
    if (buf.includes(CORRECT_PASSWORD)) {
      setExiting(true);
      setTimeout(() => {
        sessionStorage.setItem("bombshell_unlocked_v2", "true");
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

  if (launched === null) return null;
  if (launched || unlocked) return <>{children}</>;

  return (
    <>
      {/* 100lvh normal-flow fills the full physical iPhone screen (including behind notch/home indicator).
          position:fixed only fills the safe-area viewport on iOS Safari. */}
      <div style={{ height: "100lvh", width: "100%", position: "relative", overflow: "hidden", zIndex: 100 }}>
        <AnimatePresence>
          {!exiting && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              style={{ position: "absolute", inset: 0 }}
            >
              {/* Video fills entire container */}
              <div className="absolute inset-0">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full password-gate-video"
                  style={{ objectFit: "cover" }}
                >
                  <source src="/bombshell-bg-video.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="absolute inset-0 bg-black/40 pointer-events-none" />

              {/* Content layer — fills full physical screen including notch/home indicator areas */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Logo above form */}
                <div className="flex justify-center -mb-4 md:-mb-6 mt-[-10vh] md:-mt-[20vh]">
                  <img src={logoImg} alt="Bombshell" className="w-[9.2rem] md:w-72" />
                </div>

                {/* Centered content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex flex-col items-center gap-3 md:gap-5 px-6 w-full max-w-md md:max-w-lg mt-[20vh] md:mt-0"
                >
              <div className="flex items-start justify-center gap-3 md:gap-6 text-white drop-shadow-lg">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hours" },
                  { value: timeLeft.minutes, label: "Minutes" },
                  { value: timeLeft.seconds, label: "Seconds" },
                ].map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <span
                      className="text-4xl md:text-7xl leading-none tracking-[0.05em]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {pad(unit.value)}
                    </span>
                    <span
                      className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-white/80 mt-1"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    >
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

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
                      Sign up to stay in the loop on future drops and discounts. The Sign up closes on the 14th.
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {exiting && children}
    </>
  );
};

export default PasswordGate;
