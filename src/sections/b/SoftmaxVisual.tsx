import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import CodeBlock from "@/components/shared/CodeBlock";
import ProbBar from "@/components/shared/ProbBar";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LOGITS = `# illustrative values
blue    2.83
clear   0.85
large  -0.35
robot  -3.71`;

/**
 * Step 7 — logits → softmax handoff (wide column): dark CodeBlock of raw
 * scores on the left, pulsing SOFTMAX arrow in the middle, ProbBars
 * (72 / 10 / 3 / 0.1, winner ember) on a paper-raise panel on the right.
 * Entrance animation per spec (no pin — pin budget kept for Ch.6/Ch.8).
 */
export default function SoftmaxVisual() {
  const reduced = useReducedMotion();

  return (
    <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-8">
      <CodeBlock label="logits" code={LOGITS} className="w-full" />

      <div className="flex items-center justify-center gap-3 md:flex-col md:gap-2">
        <motion.span
          initial={false}
          whileInView={{ scale: [1, 1.1, 1] }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.7 }}
          className="inline-flex text-ember"
          aria-hidden="true"
        >
          <ArrowRight className="size-6 max-md:hidden" strokeWidth={2.25} />
          <ArrowDown className="size-6 md:hidden" strokeWidth={2.25} />
        </motion.span>
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          Softmax
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full rounded-[14px] border border-line bg-paper-raise p-5 md:p-6"
      >
        <div className="flex flex-col gap-4">
          <ProbBar label="blue" value={72} variant="winner" index={0} />
          <ProbBar label="clear" value={10} variant="default" index={1} />
          <ProbBar label="large" value={3} variant="default" index={2} />
          <ProbBar label="robot" value={0.1} variant="default" index={3} showFootnote />
        </div>
      </motion.div>
    </div>
  );
}
