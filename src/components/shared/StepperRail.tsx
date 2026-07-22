import { useEffect, useState } from "react";
import StepBadge from "@/components/shared/StepBadge";
import { PIPELINE_STEPS } from "@/lib/nav";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

export interface StepperRailStep {
  /** anchor id without '#', e.g. "step-3" */
  id: string;
  /** step number shown in the badge */
  step: number;
  /** mono label, e.g. "Tokenizer" */
  label: string;
}

export interface StepperRailProps {
  /** Steps to list; defaults to the 10 pipeline steps. */
  steps?: StepperRailStep[];
  /**
   * Optional externally-controlled active step id. When omitted, the rail
   * runs its own IntersectionObserver over the step anchors (-40%/-55%).
   */
  activeId?: string;
  /**
   * Optional ember progress fill, 0–1. When omitted, derived from the
   * active step index.
   */
  progress?: number;
  className?: string;
}

/**
 * Sticky pipeline stepper (design.md §6.3, Ch.2 only): vertical list of
 * StepBadge + mono label rows connected by a thin line with an ember
 * scaleY progress overlay. Sticky at top 120px on ≥1024px; on smaller
 * screens it collapses to a sticky top chip ("STEP 4 / 10 — Architecture").
 */
export default function StepperRail({
  steps = PIPELINE_STEPS,
  activeId,
  progress,
  className,
}: StepperRailProps) {
  const { scrollTo } = useSmoothScroll();
  const [spiedId, setSpiedId] = useState<string | null>(null);

  // Internal scroll spy (used only when activeId is not provided).
  useEffect(() => {
    if (activeId !== undefined) return;
    const els = steps
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        for (const s of steps) {
          if (visible.has(s.id)) {
            setSpiedId(s.id);
            break;
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, steps.map((s) => s.id).join("|")]);

  const currentId = activeId ?? spiedId ?? steps[0]?.id;
  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === currentId)
  );
  const fill =
    progress ?? (steps.length > 1 ? activeIndex / (steps.length - 1) : 1);
  const activeStep = steps[activeIndex] ?? steps[0];

  return (
    <>
      {/* Desktop rail (≥1024px) */}
      <div className={cn("sticky top-[120px] hidden self-start lg:block", className)}>
        <ol className="relative flex flex-col gap-5">
          {/* connecting line + ember progress overlay */}
          <span
            aria-hidden="true"
            className="absolute left-[21px] top-2 h-[calc(100%-16px)] w-px bg-line"
          />
          <span
            aria-hidden="true"
            className="absolute left-[21px] top-2 h-[calc(100%-16px)] w-px origin-top bg-ember transition-transform duration-500"
            style={{ transform: `scaleY(${Math.min(1, Math.max(0, fill))})` }}
          />
          {steps.map((s, i) => {
            const isActive = s.id === currentId;
            const isPassed = i < activeIndex;
            return (
              <li key={s.id} className="relative">
                <button
                  type="button"
                  onClick={() => scrollTo(`#${s.id}`)}
                  aria-current={isActive ? "step" : undefined}
                  className="group flex items-center gap-3 text-left"
                >
                  <StepBadge step={s.step} active={isActive || isPassed} />
                  <span
                    className={cn(
                      "font-mono text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-200",
                      isActive
                        ? "text-ink"
                        : "text-ink-faint group-hover:text-ink-soft"
                    )}
                  >
                    {String(s.step).padStart(2, "0")} {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile sticky chip (<1024px) */}
      <div className="sticky top-16 z-30 lg:hidden">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-raise px-4 py-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink shadow-lift">
          <span className="inline-block text-[7px] text-ember">■</span>
          Step {activeStep?.step} / {steps.length} — {activeStep?.label}
        </span>
      </div>
    </>
  );
}
