import ChapterOne from "@/sections/a/ChapterOne";

/**
 * Segment A (builder A scope, segment-a spec):
 *  - Chapter 1 — The conceptual path from basic ML to LLMs (#chapter-01):
 *    7-stop timeline including the pinned deep-learning cascade.
 * Chapter 2 (intro + steps 1–5) is composed by src/sections/Chapter02.tsx
 * together with Segment B's steps 6–10 and the shared StepperRail.
 *
 * The Hero (#hero) and Contents (#contents) sections already exist and are
 * not part of this component. The StepperRail is wired by the main agent
 * across all of Chapter 2 at integration time.
 */
export default function SegmentA() {
  return (
    <>
      <ChapterOne />
    </>
  );
}
