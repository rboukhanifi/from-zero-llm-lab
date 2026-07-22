import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];

/** Single probability bar for the loss cards (gold = high loss, forest = low). */
function LossBar({ value, fill, delay }: { value: number; fill: "bg-gold" | "bg-forest"; delay: number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-15% 0px" });
  const widthPct = Math.max(2, Math.min(100, value));

  useEffect(() => {
    if (!inView || !valueRef.current) return;
    const controls = animate(0, value, {
      duration: 1,
      delay,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => {
        if (valueRef.current)
          valueRef.current.textContent = `${Number.isInteger(v) ? v : v.toFixed(2).replace(/\.?0+$/, "")}%`;
      },
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  return (
    <div ref={rootRef} className="mt-5 flex items-center gap-4">
      <span className="w-[52px] shrink-0 font-mono text-[13px] font-medium italic text-ink">
        blue
      </span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-paper-deep">
        <motion.span
          className={cn("block h-full rounded-full", fill)}
          initial={{ width: "0%" }}
          animate={inView ? { width: `${widthPct}%` } : { width: "0%" }}
          transition={{ duration: 1, delay, ease: EASE_OUT_EXPO }}
        />
      </span>
      <span
        ref={valueRef}
        className="w-[64px] shrink-0 text-right font-mono text-[13px] font-medium tabular-nums text-ink-soft"
      >
        0%
      </span>
    </div>
  );
}

interface ScenarioCardProps {
  tone: "high" | "low";
  fromX: number;
}

function ScenarioCard({ tone, fromX }: ScenarioCardProps) {
  const reduced = useReducedMotion();
  const high = tone === "high";
  const Icon = high ? AlertTriangle : CheckCircle2;

  return (
    <motion.div
      initial={{ opacity: 0, x: reduced ? 0 : fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-[14px] border border-line border-t-[3px] bg-paper-raise p-6",
        high ? "border-t-ember-deep" : "border-t-forest"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          high ? "text-ember-deep" : "text-forest"
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <p className="mt-3 text-[16px] leading-[1.7] text-ink">
        {high ? (
          <>
            If the correct token was <em className="font-serif italic">blue</em> but the model
            assigned it only <strong className="font-semibold">0.01%</strong> probability, the loss
            is high.
          </>
        ) : (
          <>
            If it assigned <em className="font-serif italic">blue</em>{" "}
            <strong className="font-semibold">90%</strong> probability, the loss is low.
          </>
        )}
      </p>

      <LossBar value={high ? 0.01 : 90} fill={high ? "bg-gold" : "bg-forest"} delay={0.35} />

      {/* Ghost tag stamps in after the bar settles (scale 1.4→1, back-ease) */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, scale: reduced ? 1 : 1.4 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{
          duration: reduced ? 0.2 : 0.35,
          delay: reduced ? 0 : 1.45,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className={cn(
          "pointer-events-none absolute bottom-4 right-5 select-none font-mono text-[26px] font-bold uppercase tracking-[0.08em]",
          high ? "text-ember-deep/15" : "text-forest/15"
        )}
      >
        {high ? "High loss" : "Low loss"}
      </motion.span>
    </motion.div>
  );
}

/**
 * Step 8 — two-scenario loss comparison: 0.01% (high loss, ember-deep/gold)
 * vs 90% (low loss, forest). Cards slide in from ±40px.
 */
export default function LossScenarios() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ScenarioCard tone="high" fromX={-40} />
      <ScenarioCard tone="low" fromX={40} />
    </div>
  );
}
