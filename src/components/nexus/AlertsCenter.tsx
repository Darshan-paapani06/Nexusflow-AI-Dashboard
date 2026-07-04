import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";
import { alerts as seed } from "@/lib/mock-data";
import { SectionHeader, Reveal } from "./primitives";

const sevStyle: Record<string, { bar: string; badge: string; ring: string }> = {
  low: { bar: "bg-cyan", badge: "bg-cyan/15 text-cyan", ring: "ring-cyan/30" },
  medium: { bar: "bg-amber", badge: "bg-amber/15 text-amber", ring: "ring-amber/30" },
  high: { bar: "bg-rose", badge: "bg-rose/15 text-rose", ring: "ring-rose/30" },
  critical: { bar: "bg-destructive", badge: "bg-destructive/20 text-destructive-foreground", ring: "ring-destructive/40" },
};

export function AlertsCenter() {
  const [items, setItems] = useState(seed.map((a) => ({ ...a, resolved: false })));
  const active = items.filter((a) => !a.resolved);

  return (
    <section id="alerts" className="relative px-6 py-28 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Smart Alerts Center" title="Nothing critical falls through the cracks" sub="Live anomaly detection across revenue, product, ops, and infra — ranked by business impact." />

        <div className="grid gap-4">
          <AnimatePresence>
            {active.map((a, i) => {
              const s = sevStyle[a.severity];
              return (
                <Reveal key={a.id} delay={i * 0.04}>
                  <motion.div layout exit={{ opacity: 0, x: 40 }} className={`glass relative overflow-hidden rounded-2xl p-5 ring-1 ${s.ring}`}>
                    <div className={`absolute inset-y-0 left-0 w-1 ${s.bar}`} />
                    <div className="flex flex-wrap items-start justify-between gap-4 pl-3">
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-xl ${s.badge}`}>
                          <AlertTriangle className="h-5 w-5" />
                          {a.severity === "critical" && (
                            <span className="absolute inset-0 animate-ping-slow rounded-xl bg-destructive/40" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{a.title}</span>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${s.badge}`}>{a.severity}</span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
                          <div className="mt-2 text-[11px] text-muted-foreground">{a.time}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setItems((prev) => prev.map((x) => x.id === a.id ? { ...x, resolved: true } : x))}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-emerald/15 hover:text-emerald"
                      >
                        <Check className="h-3.5 w-3.5" /> Resolve
                      </button>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </AnimatePresence>
          {active.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald/20 text-emerald"><Check /></div>
              <div className="text-sm font-semibold">All clear</div>
              <div className="text-xs text-muted-foreground">No active alerts across your workspace.</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
