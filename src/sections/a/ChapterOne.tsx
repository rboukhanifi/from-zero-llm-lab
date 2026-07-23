import type { ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import ChapterHeader from "@/components/shared/ChapterHeader";
import CodeBlock from "@/components/shared/CodeBlock";
import Callout from "@/components/shared/Callout";
import FlowDiagram from "@/components/shared/FlowDiagram";
import TokenChip from "@/components/shared/TokenChip";
import DeepLearningCascade from "@/sections/a/DeepLearningCascade";
import NeuralNetMini from "@/sections/a/NeuralNetMini";
import SequenceRow from "@/sections/a/SequenceRow";
import AttentionMesh from "@/sections/a/AttentionMesh";
import PullLine from "@/sections/a/PullLine";

/** Spine node: 12px circle, line-strong border, paper fill → ember when passed. */
function SpineNode() {
  return (
    <span
      aria-hidden="true"
      className="absolute left-5 top-7 z-10 block h-3 w-3 -translate-x-1/2 rounded-full border-[1.5px] border-ember bg-ember"
    />
  );
}

function TimelineCard({
  side: _side,
  label,
  children,
}: {
  side: "left" | "right";
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="ml-12">
      <div className="flex">
        <div className="w-full max-w-[720px] rounded-lg border border-line bg-paper-raise p-6 md:p-7">
          <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember">
            {label}
          </p>
          <div className="mt-3 space-y-4 text-[15.5px] leading-[1.7] text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Ember chevron-down bouncing in a 1.4s loop (static under reduced motion). */
function BouncingChevron() {
  return (
    <div aria-hidden="true" className="flex justify-center text-ember">
      <ChevronDown className="size-6" strokeWidth={2.5} />
    </div>
  );
}

/** The France fill-in-the-blank card with shimmering ghost blank. */
function BlankCard() {
  return (
    <div
      className="mx-auto w-full max-w-[720px] rounded-[14px] border border-line bg-paper-raise px-6 py-10 text-center md:py-12"
    >
      <p className="flex flex-wrap items-baseline justify-center gap-2 font-mono text-[17px] leading-[1.6] text-ink md:text-[22px]">
        <span>The capital of France is</span>
        <TokenChip variant="ghost" className="px-4">
          <span aria-label="blank to fill in">
            ___
          </span>
        </TokenChip>
      </p>
      <p className="mx-auto mt-5 max-w-[480px] text-[15px] leading-[1.7] text-ink-soft">
        The correct continuation already exists in the source text. No human
        has to label it manually.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex items-center rounded-full border border-ember bg-ember-tint px-4 py-1.5 font-serif text-[16px] italic text-ink">
          self-supervised learning
        </span>
      </div>
      <p className="mt-4 text-[15.5px] leading-[1.7] text-ink-soft">
        This is called <strong className="font-semibold text-ink">self-supervised learning</strong>.
      </p>
    </div>
  );
}

/**
 * S1 — Chapter 1 (#chapter-01), segment-a spec: `paper` band, ChapterHeader
 * + vertical timeline of 7 stops (spine scaleY scrub, alternating cards),
 * including the pinned deep-learning cascade at stop 4.
 */
export default function ChapterOne() {
  return (
    <section id="chapter-01" className="border-t border-line bg-paper">
      <div className="page-col py-14 md:py-20">
        <ChapterHeader
          kicker="CHAPTER 01"
          title="The conceptual path from basic ML to LLMs"
          lede={<p>The progression was roughly:</p>}
          number="01"
        />

        <div className="relative mt-16 md:mt-24">
          {/* Spine: faint full-height base + scrubbed draw overlay */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-5 top-0 w-[2px] -translate-x-1/2 bg-line/50"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-5 top-0 w-[2px] origin-top -translate-x-1/2 bg-line-strong"
          />

          {/* Stop 1 — Rule-based software */}
          <div className="relative pb-16 md:pb-24">
            <SpineNode />
            <TimelineCard side="left" label="STOP 01 — Rule-based software">
              <p>Humans explicitly wrote instructions:</p>
              <CodeBlock
                label="rules.txt"
                code={`If message contains "invoice", classify it as finance.`}
              />
              <div aria-hidden="true" className="space-y-1 font-mono text-[11.5px] leading-[1.6] text-ink-soft">
                <p>+ if message contains "billing", classify it as finance.</p>
                <p>+ if message contains "payment", classify it as finance.</p>
                <p>+ … 2,412 more rules</p>
              </div>
              <p>
                This works for narrow, predictable tasks but fails when the
                rules become too complicated.
              </p>
            </TimelineCard>
          </div>

          {/* Stop 2 — Classical machine learning */}
          <div className="relative pb-16 md:pb-24">
            <SpineNode />
            <TimelineCard side="right" label="STOP 02 — Classical machine learning">
              <p>
                Instead of writing every rule, humans provided examples and
                selected features:
              </p>
              <FlowDiagram
                steps={["Input features", "statistical model", "prediction"]}
              />
              <p className="flex flex-wrap items-center gap-1.5">
                <span>Examples include</span>
                <TokenChip>linear regression</TokenChip>
                <TokenChip>decision trees</TokenChip>
                <TokenChip>support vector machines</TokenChip>
                <span>and</span>
                <TokenChip>random forests</TokenChip>
                <span>.</span>
              </p>
              <Callout variant="note" kicker="THE LIMITATION">
                The limitation was that humans still had to decide which
                features mattered.
              </Callout>
            </TimelineCard>
          </div>

          {/* Stop 3 — Neural networks */}
          <div className="relative pb-16 md:pb-24">
            <SpineNode />
            <TimelineCard side="left" label="STOP 03 — Neural networks">
              <p>Neural networks learned both:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="mt-1 size-4 shrink-0 text-forest" aria-hidden="true" />
                  <span>which features matter</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-1 size-4 shrink-0 text-forest" aria-hidden="true" />
                  <span>how to combine them into a prediction</span>
                </li>
              </ul>
              <p>
                A neural network is a large collection of simple mathematical
                operations whose parameters are adjusted using data.
              </p>
              <NeuralNetMini />
            </TimelineCard>
          </div>

          {/* Stop 4 — Deep learning (pinned cascade follows the card) */}
          <div className="relative">
            <SpineNode />
            <TimelineCard side="right" label="STOP 04 — Deep learning">
              <p>
                Researchers discovered that larger neural networks, more data,
                and more compute could learn increasingly abstract
                representations.
              </p>
            </TimelineCard>
            <DeepLearningCascade />
          </div>

          {/* Stop 5 — Sequence models */}
          <div className="relative pb-16 md:pb-24">
            <SpineNode />
            <TimelineCard side="left" label="STOP 05 — Sequence models">
              <p>
                Language is ordered, so early language models used recurrent
                neural networks and LSTMs. These processed text sequentially,
                but they were difficult to scale and struggled with very long
                dependencies.
              </p>
              <SequenceRow />
            </TimelineCard>
          </div>

          {/* Stop 6 — Attention and transformers */}
          <div className="relative pb-16 md:pb-24">
            <SpineNode />
            <TimelineCard side="right" label="STOP 06 — Attention and transformers">
              <p>
                The transformer allowed every token to examine other relevant
                tokens in the context through attention.
              </p>
              <p>
                Instead of processing language strictly one word at a time,
                transformers could efficiently process sequences in parallel
                during training.
              </p>
              <AttentionMesh />
            </TimelineCard>
          </div>

          {/* Stop 7 — Scaling and self-supervised learning */}
          <div className="relative">
            <SpineNode />
            <TimelineCard side="left" label="STOP 07 — Scaling and self-supervised learning">
              <p>
                The major breakthrough was realizing that text itself provides
                its own labels.
              </p>
            </TimelineCard>
          </div>
        </div>

        {/* Stop 7 wide moments */}
        <div className="mt-6">
          <BlankCard />
        </div>
        <p className="prose-col mt-12">
          Larger models trained on more tokens and compute became increasingly
          capable. Post-training then turned raw language models into
          assistants.
        </p>

        {/* Chapter-closing pull line + arrow divider into Chapter 2 */}
        <div className="prose-col mt-14">
          <PullLine>Text provides its own labels.</PullLine>
        </div>
        <div className="mt-8">
          <BouncingChevron />
        </div>
      </div>
    </section>
  );
}
