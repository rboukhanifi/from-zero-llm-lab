import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const TARGET = 10_000_000_000;

/** Sparse drifting field of tiny up/down arrows behind the stat. */
function ArrowField() {
  const reduced = useReducedMotion();
  const fieldRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: fieldRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -20]);

  // Deterministic pseudo-random layout: 36 arrows, half up / half down.
  const arrows = useRef(
    Array.from({ length: 36 }, (_, i) => ({
      left: (i * 37 + 11) % 100,
      top: (i * 53 + 7) % 100,
      up: i % 2 === 0,
      size: 10 + ((i * 7) % 3) * 2,
    }))
  );

  return (
    <motion.div
      ref={fieldRef}
      aria-hidden="true"
      style={reduced ? undefined : { y }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {arrows.current.map((a, i) => {
        const Icon = a.up ? ArrowUp : ArrowDown;
        return (
          <Icon
            key={i}
            className="absolute text-line-strong/30"
            style={{ left: `${a.left}%`, top: `${a.top}%`, width: a.size, height: a.size }}
            strokeWidth={2}
          />
        );
      })}
    </motion.div>
  );
}

/**
 * Step 9 — big stat moment: 10,000,000,000 counts up (1.4s, comma-formatted),
 * then collapses to "10B" with a subtle scale pulse. Caption below.
 */
export default function GradientStat() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-30% 0px" });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCollapsed(true);
      return;
    }
    const controls = animate(0, TARGET, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => {
        if (numRef.current)
          numRef.current.textContent = Math.round(v).toLocaleString("en-US");
      },
      onComplete: () => setCollapsed(true),
    });
    return () => controls.stop();
  }, [inView, reduced]);

  return (
    <div ref={rootRef} className="relative py-10 md:py-14">
      <ArrowField />
      <div className="relative text-center">
        <div className="font-serif text-[48px] font-bold leading-none tracking-[-0.02em] text-ember md:text-[72px]">
          {collapsed ? (
            <motion.span
              key="10b"
              initial={{ scale: reduced ? 1 : 1.12 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="inline-block tabular-nums"
            >
              10B
            </motion.span>
          ) : (
            <span ref={numRef} className="tabular-nums">
              0
            </span>
          )}
        </div>
        <div
          className={cn(
            "mx-auto mt-4 max-w-[520px] font-mono text-[12.5px] font-medium uppercase",
            "leading-[1.6] tracking-[0.14em] text-ink-faint"
          )}
        >
          Parameters → ≈10 billion gradients per update
        </div>
      </div>
    </div>
  );
}
