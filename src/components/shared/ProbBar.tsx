import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];

export interface ProbBarProps {
  /** Token/label text (mono, fixed 90px column). */
  label: React.ReactNode;
  /** Exact percentage value (e.g. 3 means 3%). */
  value: number;
  /**
   * Fill color: "default" = line-strong (no winner), "winner" = ember
   * (predicted/winner bar), "correct" = forest (context marks correct).
   */
  variant?: "default" | "winner" | "correct";
  /** Row index used for the 0.12s stagger when several bars animate together. */
  index?: number;
  /** Optional warning marker (gold ⚠) with a hover tooltip, e.g. "the
   *  sensible answer, nearly invisible". */
  warning?: string;
  /** Format the right-aligned value; default renders a trimmed "%" number. */
  formatValue?: (v: number) => string;
  /** Render the log-ish footnote once per set ("bar lengths are
   *  illustrative; percentages are exact"). */
  showFootnote?: boolean;
  className?: string;
}

const FILL_CLASSES = {
  default: "bg-line-strong",
  winner: "bg-ember",
  correct: "bg-forest",
} as const;

const defaultFormat = (v: number) =>
  `${Number.isInteger(v) ? v : v.toFixed(2).replace(/\.?0+$/, "")}%`;

/**
 * Probability bar row (design.md §6.5): mono label (90px) + 8px rounded
 * track + fill + right-aligned mono value. Fill animates 0 → value% on
 * viewport entry (1s ease-out-expo, stagger 0.12s/row) and the value counts
 * up with the same timing. Bars use a log-ish minimum width of 2% so tiny
 * probabilities stay visible.
 */
export default function ProbBar({
  label,
  value,
  variant = "default",
  index = 0,
  warning,
  formatValue = defaultFormat,
  showFootnote = false,
  className,
}: ProbBarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-15% 0px" });
  const delay = index * 0.12;
  const widthPct = Math.max(2, Math.min(100, value));

  // Count-up of the value readout, timed with the fill.
  useEffect(() => {
    if (!inView || !valueRef.current) return;
    const controls = animate(0, value, {
      duration: 1,
      delay,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => {
        if (valueRef.current) valueRef.current.textContent = formatValue(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, delay, formatValue]);

  return (
    <div ref={rootRef} className={className}>
      <div className="flex min-w-[320px] items-center gap-4">
        <span className="flex w-[90px] shrink-0 items-center gap-1.5 font-mono text-[13px] font-medium text-ink">
          {label}
          {warning && (
            <span
              className="group relative inline-flex cursor-help text-gold"
              role="img"
              aria-label={warning}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[200px] -translate-x-1/2 rounded-md border border-line bg-paper-raise px-2 py-1 font-sans text-[11.5px] font-medium normal-case tracking-normal text-ink-soft opacity-0 shadow-lift transition-opacity duration-150 group-hover:opacity-100">
                {warning}
              </span>
            </span>
          )}
        </span>
        <span className="h-2 flex-1 overflow-hidden rounded-full bg-paper-deep">
          <motion.span
            className={cn("block h-full rounded-full", FILL_CLASSES[variant])}
            initial={{ width: "0%" }}
            animate={inView ? { width: `${widthPct}%` } : { width: "0%" }}
            transition={{ duration: 1, delay, ease: EASE_OUT_EXPO }}
          />
        </span>
        <span
          ref={valueRef}
          className="w-[72px] shrink-0 text-right font-mono text-[13px] font-medium tabular-nums text-ink-soft"
        >
          {formatValue(0)}
        </span>
      </div>
      {showFootnote && (
        <p className="mt-3 text-[12.5px] font-medium leading-[1.5] tracking-[0.01em] text-ink-faint">
          Bar lengths are illustrative; percentages are exact.
        </p>
      )}
    </div>
  );
}
