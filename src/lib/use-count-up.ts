import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    started.current = true;
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

export function formatNum(n: number, prefix = "", suffix = "") {
  const abs = Math.abs(n);
  let str: string;
  if (abs >= 1_000_000) str = (n / 1_000_000).toFixed(2) + "M";
  else if (abs >= 10_000) str = (n / 1_000).toFixed(1) + "k";
  else str = Math.round(n).toLocaleString();
  return `${prefix}${str}${suffix}`;
}
