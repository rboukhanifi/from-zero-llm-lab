import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface BitBarProps {
  label: string;
  cells: number;
  fill: string;
  index: number;
  flag?: string;
}

/** One "bit box" bar: N small cells drawing in (scaleX 0→1, origin left). */
function BitBar({ label, cells, fill, index, flag }: BitBarProps) {
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 md:gap-x-4">
      <span className="w-[44px] shrink-0 font-mono text-[12.5px] font-medium text-ink md:w-[52px]">
        {label}
      </span>
      <motion.div
        className="flex origin-left gap-[2px]"
        initial={{ scaleX: reduced ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: reduced ? 0.2 : 0.8, delay: reduced ? 0 : index * 0.15, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        {Array.from({ length: cells }, (_, i) => (
          <span key={i} className={cn("h-5 w-1 rounded-[2px] md:w-2", fill)} />
        ))}
      </motion.div>
      {flag && (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-gold/40 bg-gold-tint px-2 py-1 font-mono text-[11px] font-medium text-gold">
          <Flag className="size-3" aria-hidden="true" />
          {flag}
        </span>
      )}
    </div>
  );
}

/**
 * Ch.3 — mixed-precision bit boxes: FP32 (32 cells, line-strong), BF16 and
 * FP16 (16 cells, ember, half width), plus the gold-flagged FP32 stub for
 * sensitive ops.
 */
export default function MixedPrecision() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 rounded-[14px] border border-line bg-paper-raise p-5 md:p-6"
      role="img"
      aria-label="Bit-width comparison: FP32 uses 32 bits, BF16 and FP16 use 16 bits, sensitive operations stay in FP32"
    >
      <BitBar label="FP32" cells={32} fill="bg-line-strong" index={0} />
      <BitBar label="BF16" cells={16} fill="bg-ember" index={1} />
      <BitBar label="FP16" cells={16} fill="bg-ember" index={2} />
      <div className="mt-1 border-t border-line pt-4">
        <BitBar label="FP32" cells={32} fill="bg-line-strong" index={3} flag="sensitive ops stay FP32" />
      </div>
    </motion.div>
  );
}
