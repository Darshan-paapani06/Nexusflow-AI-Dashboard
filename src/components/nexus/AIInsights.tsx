import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, AlertTriangle, Wand2, Brain } from "lucide-react";
import { insightSamples } from "@/lib/mock-data";
import { SectionHeader, Reveal } from "./primitives";

type Mode = keyof typeof insightSamples;

function useTyping(text: string, active: boolean) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) return;
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 12);
    return () => clearInterval(id);
  }, [text, active]);
  return out;
}

export function AIInsights() {
  const [mode, setMode] = useState<Mode>("generate");
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);
  const text = insightSamples[mode][idx % insightSamples[mode].length];
  const typed = useTyping(text, !loading);

  const trigger = (m: Mode) => {
    setMode(m);
    setLoading(true);
    setIdx((i) => i + 1);
    setKey((k) => k + 1);
    setTimeout(() => setLoading(false), 700);
  };

  const actions = [
    { id: "generate" as const, label: "Generate Insight", icon: Sparkles },
    { id: "risk" as const, label: "Explain Risk", icon: AlertTriangle },
    { id: "next" as const, label: "Suggest Next Action", icon: Wand2 },
  ];

  return (
    <section id="ai-insights" className="relative px-6 py-28 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Nexus AI Analyst" title="AI that reasons about your business" sub="Contextual, source-linked insights generated across revenue, product, and operational signals." />
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_320px]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-violet glow-primary">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-semibold">Nexus AI Analyst</div>
                    <div className="text-xs text-muted-foreground">Model: nexus-r2 · Confidence 96%</div>
                  </div>
                </div>

                <div className="mt-6 min-h-[180px] rounded-2xl border border-white/10 bg-black/30 p-5 font-mono text-[13px] leading-relaxed text-foreground/90">
                  {loading ? (
                    <div className="space-y-2">
                      {[90, 75, 60].map((w) => (
                        <div key={w} className="h-3 rounded" style={{ width: `${w}%`, background: "linear-gradient(90deg, oklch(1 0 0 / 0.06), oklch(1 0 0 / 0.14), oklch(1 0 0 / 0.06))", backgroundSize: "1000px 100%", animation: "shimmer 1.4s linear infinite" }} />
                      ))}
                      <div className="pt-3 text-xs text-muted-foreground">Nexus is reasoning across 14 sources…</div>
                    </div>
                  ) : (
                    <motion.div key={key} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span className="mr-2 text-primary">›</span>{typed}
                      <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-primary" />
                    </motion.div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {actions.map((a) => {
                    const active = mode === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => trigger(a.id)}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${active ? "bg-gradient-to-r from-primary to-violet text-primary-foreground glow-primary" : "border border-white/10 bg-white/5 text-foreground hover:bg-white/10"}`}
                      >
                        <a.icon className="h-3.5 w-3.5" />{a.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Sources</div>
                {[
                  { l: "Snowflake · fct_revenue", c: "emerald" },
                  { l: "Segment · product_events", c: "cyan" },
                  { l: "Jira · atlas_project", c: "violet" },
                  { l: "Stripe · invoices", c: "amber" },
                  { l: "Salesforce · opportunities", c: "primary" },
                ].map((s) => (
                  <div key={s.l} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs">
                    <span className="h-2 w-2 rounded-full" style={{ background: `var(--${s.c})` }} />
                    <span className="truncate">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
