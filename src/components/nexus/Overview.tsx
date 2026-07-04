import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { kpis } from "@/lib/mock-data";
import { TiltCard, SectionHeader, Reveal } from "./primitives";
import { formatNum, useCountUp } from "@/lib/use-count-up";

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 120, h = 36;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(" ");
  const id = `g-${color}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`var(--${color})`} stopOpacity="0.4" />
          <stop offset="100%" stopColor={`var(--${color})`} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={`var(--${color})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KpiCard({ kpi, i }: { kpi: typeof kpis[number]; i: number }) {
  const val = useCountUp(kpi.value);
  const up = kpi.delta >= 0;
  return (
    <Reveal delay={i * 0.06}>
      <TiltCard className="h-full rounded-3xl">
        <div className="glass ring-border card-3d-hover group relative h-full overflow-hidden rounded-3xl p-6">
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-25 blur-3xl transition duration-700 group-hover:opacity-50" style={{ background: `var(--${kpi.accent})` }} />
          <div aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent" style={{ backgroundImage: `linear-gradient(90deg, transparent, var(--${kpi.accent}) 50%, transparent)`, opacity: 0.6 }} />

          <div className="flex items-start justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{kpi.label}</div>
            <span className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${up ? "border-emerald/25 bg-emerald/10 text-emerald" : "border-emerald/25 bg-emerald/10 text-emerald"}`}>
              {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(kpi.delta)}%
            </span>
          </div>
          <div className="mt-6 flex items-end justify-between gap-3">
            <div>
              <div className="text-4xl font-bold tracking-tight sm:text-[2.75rem]">
                {formatNum(val, kpi.prefix, kpi.suffix)}
              </div>
              <div className="mt-1.5 text-[11px] text-muted-foreground">vs. prior period</div>
            </div>
            <div className="opacity-90 transition group-hover:opacity-100"><Sparkline data={kpi.spark} color={kpi.accent} /></div>
          </div>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 1.3, delay: 0.25 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 h-[3px] origin-left rounded-full"
            style={{ background: `linear-gradient(90deg, var(--${kpi.accent}), transparent)` }}
          />
        </div>
      </TiltCard>
    </Reveal>
  );
}

export function Overview() {
  return (
    <section id="overview" className="relative px-6 py-28 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Overview" title="Business health, at a glance" sub="Six mission-critical KPIs streaming from your warehouse, product, and ops stack in real-time." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k, i) => <KpiCard key={k.id} kpi={k} i={i} />)}
        </div>
      </div>
    </section>
  );
}
