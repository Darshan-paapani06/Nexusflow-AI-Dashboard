import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Cpu, LineChart, ShieldCheck, TrendingUp, PlayCircle } from "lucide-react";
import { TiltCard } from "./primitives";

export function Hero({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-28 pb-20 sm:pt-36">
      {/* Cinematic backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 grid-bg" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-[32rem] w-[32rem] rounded-full bg-primary/30 blur-[120px] animate-aurora" />
        <div className="absolute right-[-8rem] top-32 h-[34rem] w-[34rem] rounded-full bg-violet/28 blur-[130px] animate-aurora" style={{ animationDelay: "-6s" }} />
        <div className="absolute bottom-[-6rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-cyan/22 blur-[110px] animate-aurora" style={{ animationDelay: "-12s" }} />
        {/* horizon line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs font-medium text-muted-foreground backdrop-blur-xl"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary/80 to-violet/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              <Sparkles className="h-3 w-3" /> New
            </span>
            <span>NexusFlow v4 — Enterprise AI is live</span>
            <ArrowRight className="h-3 w-3" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08 }}
            className="mt-7 text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.75rem]"
          >
            <span className="text-gradient">AI Command Center</span>
            <br />
            <span className="text-foreground/95">for high-performance teams</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.18 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-[1.075rem]"
          >
            Monitor revenue, projects, tasks, risks, and AI-generated insights from one intelligent, three-dimensional dashboard built for founders, operators, and executives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.28 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={onOpenDashboard}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary via-primary to-violet px-7 py-3.5 text-sm font-semibold text-primary-foreground glow-primary transition hover:scale-[1.02]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Open Dashboard</span>
              <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <a href="#ai-insights" className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.08]">
              <PlayCircle className="h-4 w-4 text-primary transition group-hover:scale-110" />
              View Live Insights
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.55 }}
            className="mt-14 grid max-w-lg grid-cols-3 gap-8 border-t border-white/5 pt-8 text-xs text-muted-foreground"
          >
            {[
              { k: "Compliance", v: "SOC 2 · GDPR" },
              { k: "Uptime SLA", v: "99.99%" },
              { k: "Teams shipping", v: "4,200+" },
            ].map((s) => (
              <div key={s.k}>
                <div className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{s.v}</div>
                <div className="mt-1 text-[11px] uppercase tracking-widest">{s.k}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <TiltCard intensity={5} className="rounded-[28px]">
            <div className="glass-strong ring-border relative rounded-[28px] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-primary to-violet shadow-lg glow-primary">
                    <Cpu className="h-4 w-4 text-white" />
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald animate-pulse-glow" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-tight">Nexus AI · Live</div>
                    <div className="text-[11px] text-muted-foreground">Streaming from 14 data sources</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald/25 bg-emerald/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-emerald" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
                  </span>
                  Healthy
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { i: LineChart, l: "Revenue", v: "$1.28M", d: "+18.4%", c: "emerald" },
                  { i: ShieldCheck, l: "Risk", v: "23/100", d: "-8.3%", c: "emerald" },
                ].map((s, i) => (
                  <div key={i} className="glass ring-border relative overflow-hidden rounded-2xl p-4">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="uppercase tracking-widest">{s.l}</span>
                      <s.i className="h-3.5 w-3.5" />
                    </div>
                    <div className="mt-2 text-2xl font-bold tracking-tight">{s.v}</div>
                    <div className={`mt-0.5 inline-flex items-center gap-0.5 text-xs font-semibold text-${s.c}`}>
                      <TrendingUp className="h-3 w-3" /> {s.d} MoM
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 glass ring-border rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Insight stream</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                    <span className="h-1 w-1 rounded-full bg-primary animate-pulse-glow" /> real-time
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    "Enterprise conversions ↑ 27% this week",
                    "Project Atlas ETA slipping — reassign T-238",
                    "APAC usage compounding at 6% weekly",
                  ].map((t, i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.18 }}
                      className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-primary to-violet" />
                      <span className="truncate text-foreground/90">{t}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* corner accent */}
              <div aria-hidden className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full bg-primary/40 blur-2xl" />
            </div>
          </TiltCard>

          <div aria-hidden className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-cyan/50 blur-3xl animate-float" />
          <div aria-hidden className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-violet/50 blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:flex"
      >
        <span>Scroll</span>
        <span className="h-8 w-px bg-gradient-to-b from-primary/60 to-transparent" />
      </motion.div>
    </section>
  );
}
