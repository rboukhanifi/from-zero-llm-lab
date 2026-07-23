import StepBadge from "@/components/shared/StepBadge";

/**
 * Step head row (segment-a spec): StepBadge (large, 56px) + kicker
 * `STEP n — LABEL` + H3 step title, plus a decorative ghost numeral
 * (01–10) top-right with a −30px parallax drift.
 */
export default function StepHead({
  step,
  kicker,
  title,
}: {
  step: number;
  kicker: string;
  title: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-4 md:gap-5">
        <StepBadge step={step} active size="lg" />
        <div>
          <p className="kicker">{kicker}</p>
          <h3 className="mt-2 font-serif text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink md:text-[34px]">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
}
