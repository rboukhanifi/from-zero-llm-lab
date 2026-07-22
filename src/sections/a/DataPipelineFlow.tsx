import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  "Downloads or receives the data.",
  "Extracts text.",
  "Detects language.",
  "Removes duplicates.",
  "Filters low-quality material.",
  "Removes sensitive information.",
  "Classifies data by domain.",
  "Assigns quality scores.",
  "Mixes the datasets in controlled proportions.",
  "Splits data into training and evaluation sets.",
];

/**
 * Step 2 — the 10-stage data pipeline (segment-a spec): vertical numbered
 * flow; an 8px ember "processing dot" travels down the 1px line on scroll
 * scrub (no pin); each row flips from ink-faint to ink + ember index as
 * the dot passes it. Reduced motion: all rows lit, static dot at the end.
 */
export default function DataPipelineFlow() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (reduced) {
      setLit(STAGES.length);
      return;
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapRef.current,
        start: "top 75%",
        end: "bottom 45%",
        scrub: true,
        onUpdate: (self) => {
          if (dotRef.current) {
            gsap.set(dotRef.current, { top: `${self.progress * 100}%` });
          }
          const count = Math.min(
            STAGES.length,
            Math.floor(self.progress * STAGES.length + 1e-6)
          );
          setLit((prev) => (prev === count ? prev : count));
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={wrapRef} className="relative mt-6 max-w-[680px]">
      {/* Rail line */}
      <div aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
      {/* Processing dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="absolute left-[7.5px] top-3 h-2 w-2 -translate-x-1/2 rounded-full bg-ember"
        style={reduced ? { top: "100%" } : undefined}
      />
      <ol className="space-y-4 pl-8">
        {STAGES.map((stage, i) => {
          const active = i < lit;
          return (
            <li key={stage} className="flex items-baseline gap-4">
              <span
                className={cn(
                  "w-7 shrink-0 font-mono text-[12.5px] font-medium tabular-nums transition-colors duration-300",
                  active ? "text-ember" : "text-ink-faint"
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "text-[15.5px] leading-[1.7] transition-colors duration-300",
                  active ? "text-ink" : "text-ink-faint"
                )}
              >
                {stage}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
