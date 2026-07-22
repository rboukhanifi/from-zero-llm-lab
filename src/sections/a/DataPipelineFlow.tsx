import { cn } from "@/lib/utils";

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
  const lit = STAGES.length;

  return (
    <div className="relative mt-6 max-w-[680px]">
      {/* Rail line */}
      <div aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
      {/* Processing dot */}
      <div
        aria-hidden="true"
        className="absolute left-[7.5px] top-3 h-2 w-2 -translate-x-1/2 rounded-full bg-ember"
        style={{ top: "100%" }}
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
