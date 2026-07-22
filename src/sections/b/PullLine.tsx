import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];

/**
 * Chapter-closing pull line (design.md §3): Fraunces 500 italic, wide,
 * centered, framed by 1px line hairlines that scaleX in from the left.
 */
export function PullLine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      className={cn("relative py-10 md:py-14", className)}
    >
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-line"
      />
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-line"
      />
      <blockquote className="mx-auto max-w-[860px] px-2 text-center font-serif text-[23px] font-medium italic leading-[1.3] tracking-[-0.01em] text-ink md:text-[30px]">
        {children}
      </blockquote>
    </motion.figure>
  );
}

/** Small centered arrow divider leading into the next chapter. */
export function ArrowDivider({ label, className }: { label?: string; className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6 }}
      className={cn("flex items-center justify-center gap-4 py-6 md:py-8", className)}
    >
      <span className="h-px w-16 bg-line md:w-24" />
      <span className="flex items-center gap-2">
        {label && (
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
            {label}
          </span>
        )}
        <ChevronDown className="size-5 text-ember" strokeWidth={2} />
      </span>
      <span className="h-px w-16 bg-line md:w-24" />
    </motion.div>
  );
}
