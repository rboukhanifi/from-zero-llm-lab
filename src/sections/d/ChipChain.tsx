import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChipChainProps {
  /** Ordered chip labels, joined by ember arrows (or "vs." separators). */
  steps: string[];
  /** arrow (default) renders → between chips; "vs" renders an ember "vs." */
  separator?: "arrow" | "vs";
  className?: string;
}

/**
 * Small inline mono chip chain used inside taxonomy / course cards —
 * a compact sibling of the shared FlowDiagram (segment-d spec S9/S11).
 * Chips pop in left-to-right with a 0.15s stagger.
 */
export default function ChipChain({
  steps,
  separator = "arrow",
  className,
}: ChipChainProps) {
  return (
    <span className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-2", className)}>
      {steps.map((step, i) => (
        <span key={`${step}-${i}`} className="flex items-center gap-1.5">
          {i > 0 &&
            (separator === "arrow" ? (
              <ArrowRight
                className="size-3 shrink-0 text-ember"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            ) : (
              <span className="font-mono text-[11px] font-medium text-ember">
                vs.
              </span>
            ))}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.4,
              delay: i * 0.15,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="inline-flex items-center rounded-md border border-line bg-paper-raise px-2 py-1 font-mono text-[12px] font-medium leading-none text-ink"
          >
            {step}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
