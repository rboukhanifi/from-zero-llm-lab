import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ROWS: { label: string; stages: string[] }[] = [
  { label: "For vision", stages: ["pixels", "edges", "shapes", "objects"] },
  {
    label: "For language",
    stages: ["characters", "words", "grammar", "concepts", "relationships"],
  },
];
const TOTAL = ROWS.reduce((n, r) => n + r.stages.length, 0); // 9
/** Stages light over the first 85% of pinned progress; the final 15% holds
 *  both rows fully lit before unpinning (segment-a spec). */

/**
 * Stop 4 pinned moment (segment-a spec): GSAP pin, 175vh. Two cascade rows
 * light stage-by-stage with scroll progress; the active stage becomes a
 * solid ember chip with an ember-tint halo and a 1→1.08 pulse. Reduced
 * motion / no-pin fallback: static rows, all stages lit.
 */
export default function DeepLearningCascade() {
  const lit = TOTAL;

  let stageOffset = 0;

  return (
    <div className="mt-10">
      <div className="flex min-h-[100dvh] flex-col justify-center py-16">
        <p className="kicker text-center">Increasingly abstract representations</p>
        <div className="mt-10 space-y-10 md:space-y-14">
          {ROWS.map((row) => {
            const rowStart = stageOffset;
            stageOffset += row.stages.length;
            return (
              <div key={row.label}>
                <p className="mb-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                  {row.label}
                </p>
                <div className="flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:gap-2">
                  {row.stages.map((stage, i) => {
                    const idx = rowStart + i;
                    const active = idx < lit;
                    const arrowLit = idx + 1 < lit;
                    return (
                      <div key={stage} className="flex items-center gap-2 max-md:flex-col">
                        {i > 0 && (
                          <span
                            aria-hidden="true"
                            className={cn(
                              "origin-left transition-colors duration-300 max-md:origin-top",
                              arrowLit ? "text-ember" : "text-line-strong"
                            )}
                          >
                            <ArrowRight className="size-4 max-md:hidden" strokeWidth={2.5} />
                            <ChevronDown className="size-4 md:hidden" strokeWidth={2.5} />
                          </span>
                        )}
                        <motion.span
                          animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                          transition={{ duration: 0.45 }}
                          className={cn(
                            "inline-flex h-10 items-center rounded-lg border px-3.5 font-mono text-[13px] font-medium leading-none transition-colors duration-300 md:text-[14px]",
                            active
                              ? "border-ember bg-ember text-paper ring-8 ring-ember-tint"
                              : "border-dashed border-line-strong bg-transparent text-ink-faint"
                          )}
                        >
                          {stage}
                        </motion.span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
