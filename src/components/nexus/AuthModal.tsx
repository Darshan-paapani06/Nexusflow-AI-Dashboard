import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, Mail, Lock, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/use-auth";

export function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [ws, setWs] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") await signIn(email, pw);
      else await signUp(email, pw, ws || "New workspace");
      toast.success(mode === "signin" ? "Welcome back to NexusFlow" : "Workspace provisioned — welcome aboard");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally { setBusy(false); }
  };

  const google = async () => {
    setBusy(true);
    try { await signInWithGoogle(); toast.success("Signed in with Google"); onClose(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Google sign-in failed"); }
    finally { setBusy(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-md" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl p-8"
          >
            <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-violet/25 blur-3xl" />

            <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"><X className="h-4 w-4" /></button>

            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-violet glow-primary">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{mode === "signin" ? "Welcome back" : "Create your workspace"}</h3>
                  <p className="text-xs text-muted-foreground">Enterprise SSO available on the Business plan.</p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <IconInput icon={Mail} value={email} onChange={setEmail} placeholder="you@company.com" type="email" required />
                <IconInput icon={Lock} value={pw} onChange={setPw} placeholder="Password" type="password" required minLength={6} />
                {mode === "signup" && <IconInput icon={Building2} value={ws} onChange={setWs} placeholder="Workspace name" required />}

                <button type="submit" disabled={busy} className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-violet py-2.5 text-sm font-semibold text-primary-foreground glow-primary transition hover:scale-[1.01] disabled:opacity-60">
                  {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create workspace"}
                </button>
              </form>

              <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
              </div>
              <button
                onClick={google} disabled={busy}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-white/10 disabled:opacity-60"
              >
                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.3 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.7-.2-3.3-.5-4.9H24v9.3h12.7c-.5 3-2.2 5.6-4.7 7.3l7.4 5.7c4.3-4 6.8-9.8 6.8-17.4z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.2 0 24s.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.8-5.9l-7.4-5.7c-2.1 1.4-4.8 2.2-8.4 2.2-6.4 0-11.8-4.3-13.7-10.1l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
                Continue with Google
              </button>

              <div className="mt-5 text-center text-xs text-muted-foreground">
                {mode === "signin" ? "New to NexusFlow?" : "Already have an account?"}{" "}
                <button className="font-semibold text-foreground underline-offset-4 hover:underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
                  {mode === "signin" ? "Create workspace" : "Sign in"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type IconInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
};

function IconInput({ icon: Icon, value, onChange, ...rest }: IconInputProps) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 transition focus-within:border-primary">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
    </label>
  );
}
