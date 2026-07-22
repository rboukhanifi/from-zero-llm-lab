import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TermChipProps {
  children: ReactNode;
  /** ember (default) · forest · gold */
  tone?: "ember" | "forest" | "gold";
  className?: string;
}

const TONES = {
  ember: "border-ember/30 bg-ember-tint text-ember-deep",
  forest: "border-forest/30 bg-forest-tint text-forest",
  gold: "border-gold/40 bg-gold-tint text-gold",
} as const;

/** Inline mono term chip for key vocabulary inside body copy (logits, BF16…). */
export default function TermChip({ children, tone = "ember", className }: TermChipProps) {
  return (
    <span
      className={cn(
        "mx-0.5 inline-flex items-baseline whitespace-nowrap rounded-md border px-1.5 py-0.5 align-baseline font-mono text-[0.8em] font-medium leading-[1.2]",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
