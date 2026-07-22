import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";
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
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-15% 0px" });

  useEffect(() => {
    if (!inView || !numRef.current) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (numRef.current) numRef.current.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, format]);

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <div
        className={cn(
          "font-serif text-[48px] font-bold leading-none tracking-[-0.02em] md:text-[72px]",
          color === "ember" ? "text-ember" : "text-ink"
        )}
      >
        {prefix}
        <span ref={numRef} className="tabular-nums">
          {format(0)}
        </span>
        {suffix}
      </div>
      <div className="mt-3 font-mono text-[12.5px] font-medium uppercase leading-[1.4] tracking-[0.14em] text-ink-faint">
        {caption}
      </div>
    </motion.div>
  );
}
