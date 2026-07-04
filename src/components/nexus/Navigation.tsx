import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Search, LayoutDashboard, Sparkles, BarChart3, Kanban, Bell, Users, Settings2, LogIn, Cpu, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth/use-auth";
import { ROLE_LABELS } from "@/lib/auth/roles";

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, alias: ["dashboard", "kpi"] },
  { id: "ai-insights", label: "AI Insights", icon: Sparkles, alias: ["ai", "insight", "nexus"] },
  { id: "analytics", label: "Analytics", icon: BarChart3, alias: ["charts", "revenue"] },
  { id: "projects", label: "Projects", icon: Kanban, alias: ["tasks", "kanban", "board"] },
  { id: "alerts", label: "Alerts", icon: Bell, alias: ["notifications"] },
  { id: "team", label: "Team", icon: Users, alias: ["people"] },
  { id: "settings", label: "Settings", icon: Settings2, alias: ["profile", "preferences"] },
];

export function TopBar({ onLogin }: { onLogin: () => void }) {
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const k = q.toLowerCase().trim();
    if (!k) return;
    const match = sections.find((s) => s.id.includes(k) || s.label.toLowerCase().includes(k) || s.alias.some((a) => a.includes(k)));
    if (match) {
      document.getElementById(match.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setQ("");
    }
  };

  return (
    <div className={`fixed inset-x-0 top-0 z-40 transition-all ${scrolled ? "backdrop-blur-xl" : ""}`}>
      <div className={`mx-auto flex max-w-7xl items-center gap-3 px-6 py-3 transition ${scrolled ? "" : ""}`}>
        <a href="#top" className="flex shrink-0 items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet glow-primary">
            <Cpu className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-none">NexusFlow</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">AI Command Center</div>
          </div>
        </a>

        <form onSubmit={submit} className="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to tasks, analytics, alerts, team…"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </form>

        <AccountMenu onLogin={onLogin} />
      </div>
    </div>
  );
}

function AccountMenu({ onLogin }: { onLogin: () => void }) {
  const { session, isAuthenticated, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const on = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", on);
    return () => window.removeEventListener("mousedown", on);
  }, [open]);

  if (!isAuthenticated || !session) {
    return (
      <button onClick={onLogin} className="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-white/10 sm:inline-flex">
        <LogIn className="h-3.5 w-3.5" /> Sign in
      </button>
    );
  }

  const initials = session.profile.display_name.slice(0, 2).toUpperCase();
  return (
    <div ref={menuRef} className="relative shrink-0">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 text-xs font-semibold text-foreground transition hover:bg-white/10">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-violet text-[11px] text-white">{initials}</span>
        <span className="hidden sm:inline">{session.profile.display_name}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass-strong absolute right-0 mt-2 w-64 rounded-2xl p-3 text-sm"
          >
            <div className="border-b border-white/5 px-2 pb-3">
              <div className="truncate font-semibold">{session.profile.display_name}</div>
              <div className="truncate text-[11px] text-muted-foreground">{session.user.email}</div>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-widest">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-primary">{ROLE_LABELS[role ?? "member"]}</span>
                <span className="text-muted-foreground">· {session.workspace.name}</span>
              </div>
            </div>
            <button
              onClick={async () => { await signOut(); setOpen(false); }}
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-semibold text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SideNav() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav aria-label="Section navigation" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
      <div className="glass flex flex-col gap-1 rounded-full p-1.5">
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`group relative grid h-10 w-10 place-items-center rounded-full transition ${on ? "bg-gradient-to-br from-primary to-violet text-primary-foreground glow-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
              title={s.label}
            >
              <s.icon className="h-4 w-4" />
              <AnimatePresence>
                {on && (
                  <motion.span
                    initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}
                    className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur"
                  >
                    {s.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
