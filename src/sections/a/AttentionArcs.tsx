import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface Arc {
  d: string;
  labelX: number;
  labelY: number;
}

/**
 * Step 4.3 interactive (segment-a spec): the sentence card "The robot
 * picked up the component because **it** was misaligned." — hovering or
 * focusing the interactive token "it" draws curved SVG arcs back to
 * "the component" (ember, strong) and "The robot" (gold, weak) with mono
 * weight labels.
 */
export default function AttentionArcs() {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLSpanElement>(null);
  const compRef = useRef<HTMLSpanElement>(null);
  const itRef = useRef<HTMLSpanElement>(null);
  const [hover, setHover] = useState(false);
  const [arcs, setArcs] = useState<{ strong: Arc; weak: Arc } | null>(null);

  const show = hover || reduced;

  const measure = useCallback(() => {
    const box = cardRef.current?.getBoundingClientRect();
    const it = itRef.current?.getBoundingClientRect();
    const comp = compRef.current?.getBoundingClientRect();
    const robot = robotRef.current?.getBoundingClientRect();
    if (!box || !it || !comp || !robot) return;

    const ix = it.left - box.left + it.width / 2;
    const iy = it.top - box.top;
    const build = (target: DOMRect, lift: number): Arc => {
      const tx = target.left - box.left + target.width / 2;
      const ty = target.top - box.top;
      const cx = (ix + tx) / 2;
      const cy = Math.min(iy, ty) - lift;
      const labelX = 0.25 * ix + 0.5 * cx + 0.25 * tx;
      const labelY = 0.25 * iy + 0.5 * cy + 0.25 * ty;
      return { d: `M ${ix} ${iy - 4} Q ${cx} ${cy} ${tx} ${ty - 4}`, labelX, labelY };
    };
    setArcs({ strong: build(comp, 44), weak: build(robot, 72) });
  }, []);

  useEffect(() => {
    measure();
    const t = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      window.cancelAnimationFrame(t);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div
      ref={cardRef}
      className="relative mt-4 rounded-[14px] border border-line bg-paper-raise px-6 pb-8 pt-12"
    >
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full">
        {arcs && (
          <>
            {/* Weak arc: it → The robot (gold) */}
            <motion.path
              d={arcs.weak.d}
              fill="none"
              className="stroke-gold"
              strokeWidth={1.25}
              strokeDasharray="4 4"
              initial={false}
              animate={{ pathLength: show ? 1 : 0, opacity: show ? 0.9 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {/* Strong arc: it → the component (ember) */}
            <motion.path
              d={arcs.strong.d}
              fill="none"
              className="stroke-ember"
              strokeWidth={2}
              initial={false}
              animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.text
              x={arcs.strong.labelX}
              y={arcs.strong.labelY - 6}
              textAnchor="middle"
              className="fill-ember font-mono"
              fontSize={10}
              initial={false}
              animate={{ opacity: show ? 1 : 0 }}
              transition={{ duration: 0.3, delay: show ? 0.3 : 0 }}
            >
              strong
            </motion.text>
            <motion.text
              x={arcs.weak.labelX}
              y={arcs.weak.labelY - 6}
              textAnchor="middle"
              className="fill-gold font-mono"
              fontSize={10}
              initial={false}
              animate={{ opacity: show ? 1 : 0 }}
              transition={{ duration: 0.3, delay: show ? 0.35 : 0 }}
            >
              weak
            </motion.text>
          </>
        )}
      </svg>

      <p className="font-serif text-[19px] leading-[1.9] text-ink md:text-[22px]">
        <span ref={robotRef} className="rounded-sm transition-colors duration-200">
          The robot
        </span>{" "}
        picked up{" "}
        <span ref={compRef} className="rounded-sm transition-colors duration-200">
          the component
        </span>{" "}
        because{" "}
        <span
          ref={itRef}
          role="button"
          tabIndex={0}
          aria-label="it — hover to see what this token attends to"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          className={cn(
            "cursor-pointer rounded-md border px-1.5 py-0.5 font-semibold transition-colors duration-200",
            show ? "border-ember bg-ember-tint text-ember-deep" : "border-line-strong text-ink"
          )}
        >
          it
        </span>{" "}
        was misaligned.
      </p>
      <p className="mt-2 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint">
        Hover "it" — attention reaches back to earlier tokens
      </p>
    </div>
  );
}
