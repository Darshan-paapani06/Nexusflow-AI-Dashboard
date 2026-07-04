import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, CartesianGrid, Legend } from "recharts";
import { revenueData, teamPerf, taskDonut, deptCompare } from "@/lib/mock-data";
import { SectionHeader, Reveal } from "./primitives";

const filters = ["Today", "7 Days", "30 Days", "Quarter"] as const;

function ChartCard({ title, sub, badge, children }: { title: string; sub?: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="glass ring-border group relative overflow-hidden rounded-3xl p-6 transition duration-500 hover:-translate-y-1">
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 opacity-0 blur-3xl transition duration-700 group-hover:opacity-100" />
      <div className="relative mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold tracking-tight">{title}</div>
          {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
        </div>
        {badge && <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{badge}</span>}
      </div>
      <div className="relative h-[260px] w-full">{children}</div>
    </div>
  );
}

const tooltipStyle = {
  contentStyle: { background: "oklch(0.19 0.03 265)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, color: "white", fontSize: 12 },
  labelStyle: { color: "oklch(0.7 0.03 260)" },
};

export function Analytics() {
  const [filter, setFilter] = useState<typeof filters[number]>("30 Days");
  const rev = useMemo(() => {
    const slice = filter === "Today" ? 2 : filter === "7 Days" ? 4 : filter === "30 Days" ? 6 : 9;
    return revenueData.slice(-slice);
  }, [filter]);

  return (
    <section id="analytics" className="relative px-6 py-28 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader eyebrow="Advanced Analytics" title="Deep signals across every function" sub="Aggregated revenue, team, task, and department performance charts, cross-filtered by timeframe." />
          <Reveal>
            <div className="glass flex gap-1 rounded-full p-1.5">
              {filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${filter === f ? "bg-gradient-to-r from-primary to-violet text-primary-foreground glow-primary" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <ChartCard title="Revenue growth" sub="Actual vs. forecast ($k)" badge="Live">
              <ResponsiveContainer>
                <AreaChart data={rev}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.19 255)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="oklch(0.72 0.19 255)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.68 0.22 300)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.68 0.22 300)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="month" stroke="oklch(0.7 0.03 260)" fontSize={11} />
                  <YAxis stroke="oklch(0.7 0.03 260)" fontSize={11} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="forecast" stroke="oklch(0.68 0.22 300)" fill="url(#fc)" strokeWidth={2} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="revenue" stroke="oklch(0.72 0.19 255)" fill="url(#rev)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>

          <Reveal delay={0.05}>
            <ChartCard title="Team performance" sub="Productivity score by function">
              <ResponsiveContainer>
                <BarChart data={teamPerf}>
                  <defs>
                    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.82 0.16 210)" />
                      <stop offset="100%" stopColor="oklch(0.68 0.22 300)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                  <XAxis dataKey="name" stroke="oklch(0.7 0.03 260)" fontSize={11} />
                  <YAxis stroke="oklch(0.7 0.03 260)" fontSize={11} />
                  <Tooltip {...tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
                  <Bar dataKey="value" fill="url(#bar)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>

          <Reveal delay={0.1}>
            <ChartCard title="Task distribution" sub="Across all active projects">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={taskDonut} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={4} stroke="none">
                    {taskDonut.map((e) => <Cell key={e.name} fill={`var(--${e.color.replace("var(--","").replace(")","")})`} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "oklch(0.7 0.03 260)" }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>

          <Reveal delay={0.15}>
            <ChartCard title="Department comparison" sub="Quarterly delivery velocity">
              <ResponsiveContainer>
                <RadarChart data={deptCompare}>
                  <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
                  <PolarAngleAxis dataKey="dept" stroke="oklch(0.7 0.03 260)" fontSize={11} />
                  <Tooltip {...tooltipStyle} />
                  <Radar name="Q1" dataKey="q1" stroke="oklch(0.82 0.16 210)" fill="oklch(0.82 0.16 210)" fillOpacity={0.15} />
                  <Radar name="Q2" dataKey="q2" stroke="oklch(0.68 0.22 300)" fill="oklch(0.68 0.22 300)" fillOpacity={0.2} />
                  <Radar name="Q3" dataKey="q3" stroke="oklch(0.72 0.19 255)" fill="oklch(0.72 0.19 255)" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "oklch(0.7 0.03 260)" }} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
