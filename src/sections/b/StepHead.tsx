import { motion } from "framer-motion";
import StepBadge from "@/components/shared/StepBadge";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];

export interface StepHeadProps {
  /** Pipeline step number (6–10). */
  step: number;
  /** Kicker text after the auto ember square, e.g. "STEP 06 — EVERY POSITION IS A QUESTION". */
  kicker: string;
  /** Step title (H3, Fraunces 600). */
  title: string;
}

/**
 * Pipeline step head (segment B): StepBadge + mono kicker + H3 title with a
 * large ghost numeral top-right (design.md §7.3). Each step block carries its
 * own anchor + 60px scroll-margin (set on the wrapping <section>).
 */
export default function StepHead({ step, kicker, title }: StepHeadProps) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-0 select-none font-serif text-[72px] font-bold leading-none text-line-strong/30 md:text-[112px]"
      >
        {String(step).padStart(2, "0")}
      </span>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        className="flex items-center gap-4"
      >
        <StepBadge step={step} active />
        <p className="kicker">{kicker}</p>
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT_EXPO }}
        className="mt-5 font-serif text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink md:text-[34px]"
      >
        {title}
      </motion.h3>
    </div>
  );
}
