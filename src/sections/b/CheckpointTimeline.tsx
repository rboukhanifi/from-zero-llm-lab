import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface MarkerProps {
  progress: MotionValue<number>;
  at: number;
  align: "left" | "center" | "right";
  reduced: boolean;
  children: ReactNode;
}

/** One timeline marker: pops in (back-ease) as the scrubbed line reaches it. */
function Marker({ progress, at, align, reduced, children }: MarkerProps) {
  const scale = useTransform(progress, [at - 0.12, at], [0, 1]);
  const opacity = useTransform(progress, [at - 0.12, at], [0, 1]);
  return (
    <motion.div
      style={reduced ? { left: `${at * 100}%` } : { scale, opacity, left: `${at * 100}%` }}
      className={cn(
        "absolute top-1/2 flex w-[150px] -translate-y-1/2 flex-col gap-2 pt-8",
        align === "left" && "-translate-x-2 items-start",
        align === "center" && "-translate-x-1/2 items-center text-center",
        align === "right" && "-translate-x-[calc(100%-8px)] items-end text-right"
      )}
    >
      {children}
    </motion.div>
  );
}

/**
 * Ch.3 — the three-weeks story: a horizontal timeline that draws left-to-right
 * on scroll scrub. DAY 0 (training starts) → DAY 21 (hardware fails — ember-deep
 * AlertTriangle + jagged crack, shakes ±3px when reached) → RESTART from latest
 * checkpoint (forest RotateCcw, pops with back-ease).
 */
export default function CheckpointTimeline() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shaken, setShaken] = useState(reduced);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 30%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const restartScale = useTransform(scrollYProgress, [0.88, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= 0.55 && !shaken) setShaken(true);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[14px] border border-line bg-paper-raise p-6 pb-8 md:p-8 md:pb-10"
    >
      <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        The three-weeks story
      </p>

      <div ref={ref} className="relative mt-6 h-24">
        {/* Track + scrubbed ember line */}
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
        <motion.div
          aria-hidden="true"
          style={reduced ? { transform: "none" } : { scaleX: lineScale }}
          className="absolute inset-x-0 top-1/2 h-[2px] origin-left -translate-y-1/2 bg-ember"
        />

        {/* DAY 0 — training starts */}
        <Marker progress={scrollYProgress} at={0.02} align="left" reduced={reduced}>
          <span className="flex size-8 items-center justify-center rounded-full border-[1.5px] border-ember bg-ember font-mono text-[11px] font-bold text-paper">
            0
          </span>
          <span className="font-mono text-[11px] font-medium uppercase leading-[1.5] tracking-[0.1em] text-ink">
            Day 0
            <span className="block text-ink-faint">training starts</span>
          </span>
        </Marker>

        {/* DAY 21 — hardware fails */}
        <Marker progress={scrollYProgress} at={0.55} align="center" reduced={reduced}>
          <motion.span
            animate={shaken && !reduced ? { x: [0, -3, 3, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex size-9 items-center justify-center rounded-full border-[1.5px] border-ember-deep bg-paper-raise text-ember-deep"
          >
            <AlertTriangle className="size-4" aria-hidden="true" />
          </motion.span>
          <span className="font-mono text-[11px] font-medium uppercase leading-[1.5] tracking-[0.1em] text-ember-deep">
            Day 21
            <span className="flex items-center justify-center gap-1 text-ink-faint">
              hardware fails
              {/* jagged crack glyph */}
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true" className="text-ember-deep">
                <path d="M6 1 L3 5 L6 6 L4 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </Marker>

        {/* RESTART — from latest checkpoint */}
        <Marker progress={scrollYProgress} at={0.98} align="right" reduced={reduced}>
          <motion.span
            style={reduced ? undefined : { scale: restartScale }}
            transition={{ type: "spring", stiffness: 300, damping: 14 }}
            className="flex size-9 items-center justify-center rounded-full border-[1.5px] border-forest bg-forest text-paper"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </motion.span>
          <span className="font-mono text-[11px] font-medium uppercase leading-[1.5] tracking-[0.1em] text-forest">
            Restart
            <span className="block text-ink-faint">from latest checkpoint</span>
          </span>
        </Marker>
      </div>
    </motion.div>
  );
}
