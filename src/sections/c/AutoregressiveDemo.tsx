import { ChevronRight } from "lucide-react";
import TokenChip from "@/components/shared/TokenChip";
import { cn } from "@/lib/utils";

const PROMPT = "The robot should first";
const NEW_TOKEN = " inspect";
const CAPTIONS = [
  "It predicts one token:",
  "The selected token is added to the sequence.",
  "The new token is appended: The robot should first inspect",
  "Then it predicts another token.",
];

function LoopIndicator() {
  const chips = ["PREDICT", "APPEND", "PREDICT", "APPEND", "…"];
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
      {chips.map((chip, index) => (
        <span key={`${chip}-${index}`} className="flex items-center gap-1.5 md:gap-2">
          {index > 0 && (
            <ChevronRight className="size-3.5 text-line-strong" aria-hidden="true" />
          )}
          <span
            className={cn(
              "rounded-md border px-2 py-1 font-mono text-[10.5px] font-medium tracking-[0.12em] md:text-[11.5px]",
              index < 2
                ? "border-ember bg-ember-tint text-ember"
                : "border-line text-ink-faint"
            )}
          >
            {chip}
          </span>
        </span>
      ))}
    </div>
  );
}

function GenerationLine({ phase }: { phase: number }) {
  return (
    <p className="text-center font-serif text-[22px] font-medium leading-[1.4] tracking-[-0.01em] text-ink md:text-[28px]">
      {PROMPT}
      {phase === 0 && <span className="text-ember"> ___</span>}
      {phase === 1 && (
        <>
          {" "}
          <TokenChip variant="highlight">{NEW_TOKEN}</TokenChip>
        </>
      )}
      {phase >= 2 && <span className="text-ember">{NEW_TOKEN}</span>}
      {phase === 3 && (
        <>
          {" "}
          <TokenChip variant="ghost"> check</TokenChip>
        </>
      )}
    </p>
  );
}

export default function AutoregressiveDemo() {
  return (
    <div className="space-y-8 px-6 py-8">
      {CAPTIONS.map((caption, phase) => (
        <div key={caption} className="space-y-2">
          <GenerationLine phase={phase} />
          <p className="text-center font-mono text-[12.5px] text-ink-soft">
            {caption}
          </p>
        </div>
      ))}
      <LoopIndicator />
    </div>
  );
}
