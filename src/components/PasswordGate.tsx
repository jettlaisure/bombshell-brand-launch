import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  if (unlocked) return <>{children}</>;

  return (
    <>
      <AnimatePresence>
        {!exiting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center gap-8 px-6 w-full max-w-md"
            >
              <h1
                className="text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.1em] text-foreground"
                style={{ fontFamily: "'Akira Expanded', sans-serif" }}
              >
                Coming Soon
              </h1>

              <img
                src={logoGif}
                alt="Bombshell"
                className="w-48 md:w-64"
              />

              <p
                className="text-xs uppercase tracking-[0.25em] text-muted-foreground"
                style={{ fontFamily: "'Akira Expanded', sans-serif" }}
              >
                Need Password to Enter
              </p>

              <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-transparent border-b border-foreground/20 py-3 text-center text-sm uppercase tracking-[0.15em] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                  style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                  autoFocus
                />

                <motion.div
                  animate={error ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <button
                    type="submit"
                    className="w-full py-3 bg-foreground text-background text-xs uppercase tracking-[0.25em] hover:bg-foreground/85 transition-colors"
                    style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                  >
                    Enter
                  </button>
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-destructive text-[10px] uppercase tracking-[0.2em]"
                      style={{ fontFamily: "'Akira Expanded', sans-serif" }}
                    >
                      Incorrect Password
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {exiting && children}
    </>
  );
};

export default PasswordGate;
