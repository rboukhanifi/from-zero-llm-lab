import StepBadge from "@/components/shared/StepBadge";

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
      <div className="flex items-center gap-4">
        <StepBadge step={step} active />
        <p className="kicker">{kicker}</p>
      </div>
      <h3 className="mt-4 font-serif text-[25px] font-semibold leading-[1.2] text-ink md:text-[32px]">
        {title}
      </h3>
    </div>
  );
}
