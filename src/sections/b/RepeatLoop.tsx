import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const NODES = [
  "Batch of tokens",
  "forward pass",
  "loss",
  "backpropagation",
  "optimizer update",
  "next batch",
];

const LAP_SECONDS = 1.8;
const LAPS = 2;

interface Pt {
  x: number;
  y: number;
}

/**
 * Step 10 — the repeat cycle: a vertical loop of 6 rounded nodes with ember
 * chevron connectors and a curved dashed return arrow (labeled REPEAT) from
 * "next batch" back to "Batch of tokens". On scroll entry a pulse dot travels
 * the loop twice (1.8s/lap), lighting each node ember as it passes; the loop
 * then rests with a slow 4s idle pulse. Reduced motion: fully static.
 */
export default function RepeatLoop() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const started = useInView(wrapRef, { once: true, margin: "-25% 0px" });
  const [path, setPath] = useState<Pt[]>([]);
  const [returnD, setReturnD] = useState("");
  const [lit, setLit] = useState(-1);
  const [idle, setIdle] = useState(reduced);

  // Measure node centers and build the lap path (down the column, back up the
  // curved return lane on the right).
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const centers: Pt[] = [];
    for (const el of nodeRefs.current) {
      if (!el) return;
      const er = el.getBoundingClientRect();
      centers.push({ x: er.left - r.left + er.width / 2, y: er.top - r.top + er.height / 2 });
    }
    if (centers.length !== NODES.length) return;
    const pts: Pt[] = [...centers];
    // Return curve: quadratic bezier from last node back to first, bulging right.
    const from = centers[NODES.length - 1];
    const to = centers[0];
    const ctrl: Pt = { x: r.width - 28, y: (from.y + to.y) / 2 };
    for (let i = 1; i <= 8; i++) {
      const t = i / 8;
      const x = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * ctrl.x + t * t * to.x;
      const y = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * ctrl.y + t * t * to.y;
      pts.push({ x, y });
    }
    setPath(pts);
    setReturnD(
      `M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`
    );
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Light each node as the dot passes: 6 nodes per lap, two laps.
  useEffect(() => {
    if (!started || reduced) return;
    let step = 0;
    setLit(0);
    const per = (LAP_SECONDS * 1000) / NODES.length;
    const iv = window.setInterval(() => {
      step += 1;
      if (step >= NODES.length * LAPS) {
        window.clearInterval(iv);
        setLit(-1);
        setIdle(true);
        return;
      }
      setLit(step % NODES.length);
    }, per);
    return () => window.clearInterval(iv);
  }, [started, reduced]);

  const times = path.map((_, i) => i / (path.length - 1));

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full max-w-[560px] rounded-[14px] border border-line bg-paper-raise/60 px-6 py-8 md:px-10"
    >
      {/* Return lane: curved dashed arrow from "next batch" to "Batch of tokens" */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="none"
      >
        {returnD && (
          <motion.path
            d={returnD}
            className="stroke-line-strong"
            strokeWidth={1.5}
            strokeDasharray="5 6"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
            animate={started || reduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 1.2, delay: reduced ? 0 : 0.4, ease: "easeInOut" }}
          />
        )}
      </svg>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint md:right-5">
        Repeat
      </span>

      {/* Traveling pulse dot (two laps, then rests) */}
      {!reduced && path.length > 0 && started && !idle && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute z-10 h-2.5 w-2.5 rounded-full bg-ember"
          initial={{ x: path[0].x - 5, y: path[0].y - 5 }}
          animate={{
            x: path.map((p) => p.x - 5),
            y: path.map((p) => p.y - 5),
          }}
          transition={{
            duration: LAP_SECONDS,
            ease: "linear",
            times,
            repeat: LAPS - 1,
            repeatType: "loop",
          }}
        />
      )}

      {/* Node column */}
      <motion.div
        animate={idle && !reduced ? { opacity: [1, 0.82, 1] } : { opacity: 1 }}
        transition={
          idle && !reduced ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }
        }
        className="relative mx-auto flex w-fit flex-col items-center"
      >
        {NODES.map((label, i) => (
          <div key={label} className="flex flex-col items-center">
            {i > 0 && (
              <ChevronDown
                className={cn("my-1.5 size-4 transition-colors duration-300", lit === i || (idle && !reduced) ? "text-ember" : "text-ember/60")}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            )}
            <motion.div
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.4, delay: i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
              className={cn(
                "flex h-12 items-center justify-center whitespace-nowrap rounded-xl border bg-paper-raise px-6 font-mono text-[13.5px] font-medium transition-colors duration-300 md:text-[14px]",
                i === 0 ? "text-ink" : "text-ink-soft",
                lit === i
                  ? "border-ember bg-ember-tint text-ink"
                  : "border-line"
              )}
            >
              {label}
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
