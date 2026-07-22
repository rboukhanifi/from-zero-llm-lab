import ChapterHeader from "@/components/shared/ChapterHeader";
import Step1 from "@/sections/a/Step1";
import Step2 from "@/sections/a/Step2";
import Step3 from "@/sections/a/Step3";
import Step4 from "@/sections/a/Step4";
import Step5 from "@/sections/a/Step5";

/**
 * Chapter 2 intro + pipeline steps 1–5. The #chapter-02 section wrapper,
 * paper-deep band, and sticky StepperRail grid are applied by the main
 * agent in src/sections/Chapter02.tsx at integration.
 */
export default function ChapterTwo() {
  return (
    <div className="pt-[72px] md:pt-[120px]">
        <ChapterHeader
          kicker="CHAPTER 02"
          title="The complete LLM training pipeline"
          lede={
            <p>
              Ten steps from a blank function to a trained model — each one
              below, in order.
            </p>
          }
          number="02"
        />
        <Step1 />
        <Step2 />
        <Step3 />
        <Step4 />
        <Step5 />
    </div>
  );
}
