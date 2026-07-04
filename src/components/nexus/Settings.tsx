import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader, Reveal } from "./primitives";

export function Settings() {
  const [dark, setDark] = useState(true);
  const [notif, setNotif] = useState({ email: true, push: true, weekly: false });
  const [freq, setFreq] = useState<"realtime" | "hourly" | "daily">("hourly");
  const [ws, setWs] = useState("NexusFlow HQ");

  return (
    <section id="settings" className="relative px-6 py-28 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Settings" title="Configure your workspace" sub="Personalize theme, notifications, AI cadence, and workspace metadata." />

        <Reveal>
          <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <div className="space-y-8">
              <Row title="Workspace name" sub="Displayed to your team and in exported reports.">
                <input value={ws} onChange={(e) => setWs(e.target.value)} className="w-full max-w-sm rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-primary" />
              </Row>

              <Row title="Theme" sub="Dark futuristic mode is optimized for OLED displays.">
                <Toggle on={dark} onChange={setDark} label={dark ? "Dark" : "Light"} />
              </Row>

              <Row title="AI insight frequency" sub="How often Nexus proactively surfaces recommendations.">
                <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                  {(["realtime", "hourly", "daily"] as const).map((f) => (
                    <button key={f} onClick={() => setFreq(f)} className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${freq === f ? "bg-gradient-to-r from-primary to-violet text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>
                  ))}
                </div>
              </Row>

              <Row title="Notification preferences" sub="Control how alerts reach you.">
                <div className="space-y-2.5">
                  {([
                    ["email", "Email digest"],
                    ["push", "Push notifications"],
                    ["weekly", "Weekly executive summary"],
                  ] as const).map(([k, l]) => (
                    <div key={k} className="flex items-center justify-between gap-6 rounded-xl bg-white/[0.03] px-4 py-2.5">
                      <span className="text-sm">{l}</span>
                      <Toggle on={notif[k]} onChange={(v) => setNotif({ ...notif, [k]: v })} />
                    </div>
                  ))}
                </div>
              </Row>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-b border-white/5 pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[1fr_1.2fr] sm:items-start">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button onClick={() => onChange(!on)} className="inline-flex items-center gap-3">
      <span className={`relative h-6 w-11 rounded-full transition ${on ? "bg-gradient-to-r from-primary to-violet glow-primary" : "bg-white/10"}`}>
        <motion.span layout className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" style={{ left: on ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
      </span>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </button>
  );
}
