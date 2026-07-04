import { team } from "@/lib/mock-data";
import { SectionHeader, Reveal, TiltCard } from "./primitives";

const statusStyle: Record<string, { dot: string; label: string }> = {
  online: { dot: "bg-emerald", label: "Available" },
  focus: { dot: "bg-amber", label: "Deep focus" },
  away: { dot: "bg-muted-foreground", label: "Away" },
};

function CircularScore({ value }: { value: number }) {
  const r = 26, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth="5" fill="none" />
        <circle
          cx="32" cy="32" r={r} fill="none" strokeWidth="5" strokeLinecap="round"
          stroke="url(#scoreG)"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <defs>
          <linearGradient id="scoreG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.16 210)" />
            <stop offset="100%" stopColor="oklch(0.68 0.22 300)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm font-bold">{value}</div>
    </div>
  );
}

function initials(n: string) { return n.split(" ").map((x) => x[0]).slice(0, 2).join(""); }

export function TeamPerformance() {
  return (
    <section id="team" className="relative px-6 py-28 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Team Performance" title="High-signal talent view" sub="Live productivity, workload, and availability across your entire org." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => {
            const s = statusStyle[m.status];
            return (
              <Reveal key={m.name} delay={i * 0.04}>
                <TiltCard intensity={5} className="rounded-2xl">
                  <div className="glass card-3d-hover rounded-2xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/70 to-violet/70 text-sm font-bold text-white shadow-lg">
                        {initials(m.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{m.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{m.role}</div>
                      </div>
                      <CircularScore value={m.score} />
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                      <Stat label="Completed" value={m.tasks} />
                      <Stat label="Project" value={m.project} />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{s.label}
                      </span>
                      <span className="font-mono">score {m.score}/100</span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/[0.03] px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}
