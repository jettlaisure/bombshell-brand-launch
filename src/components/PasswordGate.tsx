import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import logoGif from "@/assets/logo-animated.gif";

const CORRECT_PASSWORD = "Bombshell_Admin";

interface PasswordGateProps {
  children: React.ReactNode;
}

const PasswordGate = ({ children }: PasswordGateProps) => {
  const [unlocked, setUnlocked] = useState(() => {
    return sessionStorage.getItem("bombshell_unlocked") === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [exiting, setExiting] = useState(false);

  // SMS signup state
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [smsSubmitted, setSmsSubmitted] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);

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
    if (!phone.trim()) return;
    setSmsLoading(true);
    const cleanPhone = phone.trim().slice(0, 20);
    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().slice(0, 200);
    await supabase.from("sms_subscribers").insert({
      phone: cleanPhone,
      name: cleanName || null,
      email: cleanEmail || null,
    });
    setSmsLoading(false);
    setSmsSubmitted(true);
  };

  if (unlocked) return <>{children}</>;

  return (
    <>
      <AnimatePresence>
        {!exiting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center bg-background overflow-y-auto"
          >
            {/* Logo pinned near top */}
            <div className="w-full flex justify-center pt-6 md:pt-10">
              <img
                src={logoGif}
                alt="Bombshell"
                className="w-72 md:w-[28rem]"
              />
            </div>

            {/* Centered content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center gap-6 px-6 w-full max-w-md flex-1 justify-center pb-12"
            >
              <h1
                className="text-2xl md:text-4xl uppercase tracking-[0.15em] text-foreground whitespace-nowrap -mt-2"
                style={{ fontFamily: "'Akira Expanded', sans-serif" }}
              >
                Coming Soon
              </h1>

              {/* SMS Signup */}
              <div className="w-full mt-2">
                {smsSubmitted ? (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground"
                    style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                  >
                    You're on the list ✦
                  </motion.p>
                ) : (
                  <form onSubmit={handleSmsSignup} className="flex flex-col items-center gap-4">
                    <p
                      className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground text-center"
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
                        }
                      }}
                      placeholder="Name"
                      maxLength={100}
                      className="w-full bg-transparent border-b border-foreground/20 py-3 text-center text-sm uppercase tracking-[0.15em] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      maxLength={20}
                      required
                      className="w-full bg-transparent border-b border-foreground/20 py-3 text-center text-sm uppercase tracking-[0.15em] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      maxLength={200}
                      className="w-full bg-transparent border-b border-foreground/20 py-3 text-center text-sm uppercase tracking-[0.15em] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    />
                    <button
                      type="submit"
                      disabled={smsLoading}
                      className="w-full py-3 bg-foreground text-background text-xs uppercase tracking-[0.25em] hover:bg-foreground/85 transition-colors disabled:opacity-50"
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
