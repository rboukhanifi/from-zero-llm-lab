import { cn } from "@/lib/utils";

export interface StepBadgeProps {
  /** Step number (rendered in mono). */
  step: number | string;
  /** Active/passed state: ember fill with paper number (§6.2). */
  active?: boolean;
  /** md = 44px (rail + step heads default), lg = 56px (large step heads). */
  size?: "md" | "lg";
  className?: string;
}

/**
 * Pipeline step badge (design.md §6.2): circle with 1.5px line-strong
 * border and mono step number; when active/passed, fills ember with a
 * paper number.
 */
export default function StepBadge({
  step,
  active = false,
  size = "md",
  className,
}: StepBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border-[1.5px] font-mono font-medium tabular-nums transition-colors duration-300",
        size === "md" ? "h-11 w-11 text-[14px]" : "h-14 w-14 text-[17px]",
        active
          ? "border-ember bg-ember text-paper"
          : "border-line-strong bg-transparent text-ink-soft",
        className
      )}
    >
      {step}
    </span>
  );
}
