import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlowDiagramProps {
  /** Ordered stage labels, e.g. ["pixels", "edges", "shapes", "objects"]. */
  steps: string[];
  /** Optional mono kicker label on the left (e.g. "FOR VISION"). */
  label?: string;
  className?: string;
}

/**
 * Horizontal chain of mono-labeled boxes (TokenChip-styled, 40px tall)
 * joined by 16px ember arrows; wraps to a vertical chain on mobile with
 * rotated arrows (design.md §6.8). Boxes pop in sequence (scale 0.9→1,
 * 0.4s, stagger 0.15s) with arrows drawing in between them.
 */
export default function FlowDiagram({ steps, label, className }: FlowDiagramProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      className={cn(
        "flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center md:gap-2",
        className
      )}
    >
      {label && (
        <motion.span
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          transition={{ duration: 0.4 }}
          className="mr-3 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-faint"
        >
          {label}
        </motion.span>
      )}
      {steps.map((step, i) => (
        <div key={`${step}-${i}`} className="flex items-center gap-2 max-md:flex-col">
          {i > 0 && (
            <motion.span
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                show: { opacity: 1, scaleX: 1 },
              }}
              transition={{ duration: 0.35, delay: i * 0.15 - 0.05 }}
              className="origin-left text-ember max-md:origin-top"
              aria-hidden="true"
            >
              <ArrowRight className="size-4 max-md:hidden" strokeWidth={2.5} />
              <ChevronDown className="size-4 md:hidden" strokeWidth={2.5} />
            </motion.span>
          )}
          <motion.span
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.4, delay: i * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex h-10 items-center rounded-lg border border-line bg-paper-raise px-3.5 font-mono text-[13px] font-medium leading-none text-ink md:text-[14px]"
          >
            {step}
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
}
