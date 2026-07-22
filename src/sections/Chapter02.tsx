import StepperRail from "@/components/shared/StepperRail";
import ChapterTwo from "@/sections/a/ChapterTwo";
import { PipelineSteps } from "@/sections/SegmentB";

/**
 * Chapter 2 — The complete LLM training pipeline (#chapter-02).
 * Integration composition (design.md §6.3): the sticky StepperRail spans
 * the whole chapter — Builder A's intro + steps 1–5 and Builder B's
 * steps 6–10 — in a left column on desktop (≥1024px); on smaller screens
 * the rail's sticky top chip sticks for the full chapter scroll range.
 */
export default function Chapter02() {
  return (
    <section id="chapter-02" className="border-t border-line bg-paper-deep">
      <div className="page-col lg:grid lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-x-10">
        <StepperRail />
        <div className="min-w-0">
          <ChapterTwo />
          <PipelineSteps />
        </div>
      </div>
    </section>
  );
}
