import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VerticalFlowProps {
  /** Ordered node labels, top → bottom. */
  steps: string[];
  /**
   * Optional scroll-driven highlight: nodes with index ≤ activeIndex light up
   * ember; the final node fills forest once reached (final-project spec S12).
   * Omit for a purely staggered reveal (course flows).
   */
  activeIndex?: number;
  className?: string;
}

/**
 * Vertical mono-node chain with ember chevrons (segment-d spec: course
 * agent-harness flows, final-project 11-node stack).
 */
export default function VerticalFlow({
  steps,
  activeIndex,
  className,
}: VerticalFlowProps) {
  const scrubbed = activeIndex !== undefined;
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {steps.map((step, i) => {
        const lit = scrubbed && i <= activeIndex;
        const isFinal = i === steps.length - 1;
        return (
          <div key={`${step}-${i}`} className="flex flex-col items-center gap-2">
            {i > 0 && (
              <ChevronDown
                className={cn(
                  "size-4 transition-colors duration-300",
                  lit ? "text-ember" : "text-line-strong"
                )}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            )}
            <motion.span
              initial={scrubbed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.4,
                delay: scrubbed ? 0 : i * 0.08,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className={cn(
                "inline-flex h-10 items-center whitespace-nowrap rounded-lg border px-4 font-mono text-[13px] font-medium leading-none transition-colors duration-300",
                lit && isFinal
                  ? "border-forest bg-forest text-paper"
                  : lit
                    ? "border-ember bg-ember-tint text-ink"
                    : "border-line bg-paper-raise text-ink"
              )}
            >
              {step}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
