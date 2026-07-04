import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

export function TiltCard({ children, className, intensity = 8 }: { children: ReactNode; className?: string; intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rX = useTransform(y, [-0.5, 0.5], [intensity, -intensity]);
  const rY = useTransform(x, [-0.5, 0.5], [-intensity, intensity]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformPerspective: 1200 }}
      className={cn("relative will-change-transform", className)}
    >
      <Glow x={x} y={y} />
      <div style={{ transform: "translateZ(30px)" }} className="relative h-full">{children}</div>
    </motion.div>
  );
}

function Glow({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
  const bg = useTransform([x, y], ([lx, ly]: number[]) =>
    `radial-gradient(400px circle at ${(lx + 0.5) * 100}% ${(ly + 0.5) * 100}%, oklch(0.72 0.19 255 / 0.18), transparent 60%)`
  );
  return <motion.div aria-hidden style={{ background: bg }} className="pointer-events-none absolute inset-0 rounded-[inherit]" />;
}

export function Reveal({ children, delay = 0, y = 28 }: { children: ReactNode; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal>
      <div className="mb-10 flex flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
          <span className="grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-primary to-violet">
            <span className="h-1 w-1 rounded-full bg-white" />
          </span>
          {eyebrow}
        </span>
        <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-gradient sm:text-5xl">{title}</h2>
        {sub && <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{sub}</p>}
      </div>
    </Reveal>
  );
}
