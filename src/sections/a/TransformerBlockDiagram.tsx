import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Bottom → top order (signal flows upward). */
const PANELS = [
  "Token embeddings",
  "Positional information",
  "Attention",
  "Feed-forward network (MLP)",
  "Residual connections and normalization",
];

/**
 * Step 4 centerpiece (segment-a spec): a transformer block — 5 stacked
 * sub-panels connected by an upward flow line — with 2 faded ghost blocks
 * behind (repetition) and a dashed brace reading "A large model may
 * contain dozens or hundreds of transformer blocks." Panels light
 * bottom-to-top on scroll scrub while a signal dot travels the flow line.
 * Reduced motion: all panels lit, dot parked at the top.
 */
export default function TransformerBlockDiagram() {
  const lit = PANELS.length;

  // Rendered top → bottom (reverse of signal order).
  const rendered = [...PANELS].reverse();

  return (
    <div className="mt-8 max-w-[760px] pb-2 pr-3 pt-6 md:pr-6">
      <div className="flex items-stretch gap-3 md:gap-5">
        {/* Block + ghosts */}
        <div className="relative w-full max-w-[440px]">
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-[10px] translate-y-[-10px] rounded-[14px] border-[1.5px] border-line-strong bg-paper-raise opacity-40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-[20px] translate-y-[-20px] rounded-[14px] border-[1.5px] border-line-strong bg-paper-raise opacity-20"
          />
          <div className="relative z-10 rounded-[14px] border-[1.5px] border-line-strong bg-paper-raise p-4 pl-8 md:p-5 md:pl-9">
            {/* Flow line + signal dot */}
            <div aria-hidden="true" className="absolute bottom-6 left-[15px] top-6 w-px bg-line" />
            <div
              aria-hidden="true"
              className="absolute left-[15.5px] h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-ember"
              style={{ bottom: "calc(100% - 24px)" }}
            />
            <div className="flex flex-col">
              {rendered.map((label, ri) => {
                const bottomIndex = PANELS.length - 1 - ri;
                const active = bottomIndex < lit;
                return (
                  <div key={label}>
                    {ri > 0 && (
                      <div className="flex h-5 items-center" aria-hidden="true">
                        <ChevronUp
                          className={cn(
                            "-ml-[24px] size-4 transition-colors duration-300 md:-ml-[28px]",
                            active ? "text-ember" : "text-line-strong"
                          )}
                          strokeWidth={2.5}
                        />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-lg border px-4 py-3 font-mono text-[12.5px] font-medium transition-colors duration-300 md:text-[13.5px]",
                        active
                          ? "border-ember bg-paper text-ink"
                          : "border-line text-ink-faint"
                      )}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dashed brace + caption */}
        <div className="flex items-center gap-3 max-md:hidden" aria-hidden={false}>
          <div aria-hidden="true" className="h-[70%] w-2.5 rounded-r-md border-y border-r border-dashed border-line-strong" />
          <p className="max-w-[150px] font-mono text-[11px] font-medium leading-[1.6] text-ink-faint">
            A large model may contain dozens or hundreds of transformer
            blocks.
          </p>
        </div>
      </div>
      <p className="mt-4 font-mono text-[11px] font-medium leading-[1.6] text-ink-faint md:hidden">
        A large model may contain dozens or hundreds of transformer blocks.
      </p>
    </div>
  );
}
