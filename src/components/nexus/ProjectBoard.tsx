import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { initialTasks, type Task } from "@/lib/mock-data";
import { SectionHeader, Reveal } from "./primitives";

const columns: { id: Task["status"]; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "violet" },
  { id: "progress", label: "In Progress", color: "cyan" },
  { id: "review", label: "Review", color: "amber" },
  { id: "completed", label: "Completed", color: "emerald" },
];

const priorityStyles: Record<Task["priority"], string> = {
  low: "bg-white/10 text-muted-foreground",
  medium: "bg-cyan/15 text-cyan",
  high: "bg-amber/15 text-amber",
  critical: "bg-rose/20 text-rose",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

function TaskCard({ task }: { task: Task }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="group glass rounded-xl p-4 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold leading-snug">{task.title}</div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${priorityStyles[task.priority]}`}>{task.priority}</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Due {task.due}</span>
        <div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-primary/60 to-violet/60 text-[10px] font-bold text-white">
          {initials(task.owner)}
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${task.progress}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-violet"
        />
      </div>
    </motion.div>
  );
}

export function ProjectBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", owner: "", priority: "medium" as Task["priority"], due: "", status: "backlog" as Task["status"] });

  const submit = () => {
    if (!form.title.trim()) return;
    setTasks((t) => [{ id: `t${Date.now()}`, ...form, owner: form.owner || "Unassigned", due: form.due || "TBD", progress: 0 }, ...t]);
    setForm({ title: "", owner: "", priority: "medium", due: "", status: "backlog" });
    setOpen(false);
  };

  return (
    <section id="projects" className="relative px-6 py-28 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="Project Command Board" title="Ship without missing a beat" sub="A live kanban of every task across every project, owner, and deadline." />
          <Reveal>
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-violet px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-primary transition hover:scale-[1.02]">
              <Plus className="h-4 w-4" /> Add Task
            </button>
          </Reveal>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col, i) => {
            const items = tasks.filter((t) => t.status === col.id);
            return (
              <Reveal key={col.id} delay={i * 0.05}>
                <div className="glass-strong flex h-full flex-col rounded-2xl p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: `var(--${col.color})` }} />
                      <span className="text-sm font-semibold">{col.label}</span>
                    </div>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-mono text-muted-foreground">{items.length}</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <AnimatePresence>
                      {items.map((t) => <TaskCard key={t.id} task={t} />)}
                      {items.length === 0 && (
                        <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-muted-foreground">No tasks here yet</div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-md rounded-2xl p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">New task</h3>
                <button onClick={() => setOpen(false)} className="rounded-full p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-3">
                <Field label="Title"><input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Ship enterprise SSO" /></Field>
                <Field label="Owner"><input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="input" placeholder="Amara Okafor" /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Priority">
                    <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })} className="input">
                      {(["low","medium","high","critical"] as const).map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </Field>
                  <Field label="Due"><input value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} className="input" placeholder="Dec 12" /></Field>
                </div>
                <Field label="Status">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Task["status"] })} className="input">
                    {columns.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </Field>
              </div>
              <button onClick={submit} className="mt-5 w-full rounded-xl bg-gradient-to-r from-primary to-violet py-2.5 text-sm font-semibold text-primary-foreground glow-primary">Create task</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`.input{width:100%;border-radius:0.75rem;background:oklch(1 0 0 / 0.04);border:1px solid oklch(1 0 0 / 0.1);padding:0.55rem 0.75rem;font-size:0.875rem;color:inherit;outline:none;transition:border-color .2s}.input:focus{border-color:var(--primary)}`}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
