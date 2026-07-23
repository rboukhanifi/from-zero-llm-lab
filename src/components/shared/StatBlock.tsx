import { cn } from "@/lib/utils";

export interface StatBlockProps {
  /** Numeric value to count up to (0 → value, 1.2s, ease-out). */
  value: number;
  /** Format the number; default inserts locale thousands separators. */
  format?: (v: number) => string;
  /** Mono uppercase caption beneath the number. */
  caption: string;
  /** Number color: ember (default) or ink. */
  color?: "ember" | "ink";
  /** Optional text before/after the number (e.g. "~", "×"). */
  prefix?: string;
  suffix?: string;
  className?: string;
}

const defaultFormat = (v: number) => Math.round(v).toLocaleString("en-US");

/**
 * Big stat (design.md §6.9): Fraunces 700 number (ember or ink) + mono
 * uppercase caption beneath. The number counts up on viewport entry
 * (0 → value, 1.2s, ease-out).
 */
export default function StatBlock({
  value,
  format = defaultFormat,
  caption,
  color = "ember",
  prefix,
  suffix,
  className,
}: StatBlockProps) {
  return (
    <div className={className}>
      <div
        className={cn(
          "font-serif text-[48px] font-bold leading-none tracking-[-0.02em] md:text-[72px]",
          color === "ember" ? "text-ember" : "text-ink"
        )}
      >
        {prefix}
        <span className="tabular-nums">
          {format(value)}
        </span>
        {suffix}
      </div>
      <div className="mt-3 font-mono text-[12.5px] font-medium uppercase leading-[1.4] tracking-[0.14em] text-ink-faint">
        {caption}
      </div>
    </div>
  );
}
