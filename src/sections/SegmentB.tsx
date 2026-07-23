import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Bot,
  Check,
  ClipboardCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import ChapterHeader from "@/components/shared/ChapterHeader";
import CodeBlock from "@/components/shared/CodeBlock";
import StatBlock from "@/components/shared/StatBlock";
import TokenChip from "@/components/shared/TokenChip";
import Callout from "@/components/shared/Callout";
import StepHead from "@/sections/b/StepHead";
import TermChip from "@/sections/b/TermChip";
import ShiftDemo from "@/sections/b/ShiftDemo";
import SoftmaxVisual from "@/sections/b/SoftmaxVisual";
import LossScenarios from "@/sections/b/LossScenarios";
import GradientStat from "@/sections/b/GradientStat";
import RepeatLoop from "@/sections/b/RepeatLoop";
import GpuGrid from "@/sections/b/GpuGrid";
import MixedPrecision from "@/sections/b/MixedPrecision";
import CheckpointTimeline from "@/sections/b/CheckpointTimeline";
import HarnessDiagram from "@/sections/b/HarnessDiagram";
import { PullLine, ArrowDivider } from "@/sections/b/PullLine";
import { cn } from "@/lib/utils";

const asTrillions = () => "trillions";
const asMillions = () => "millions";

/** Pipeline step sub-block: anchor id + 60px scroll-margin (segment spec). */
function Step({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[60px] py-10 md:py-16">
      {children}
    </section>
  );
}

function Body({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mt-5 leading-[1.75] text-ink", className)}
    >
      {children}
    </motion.p>
  );
}

function H4({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.h4
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn("font-sans text-[17px] font-semibold leading-[1.3] text-ink md:text-[19px]", className)}
    >
      {children}
    </motion.h4>
  );
}

/** Chapter 2 continuation (Steps 6–10) — paper-deep band, seamless with Builder A. */
export function PipelineSteps() {
  return (
    <div className="pb-[72px] md:pb-[120px]">
      {/* ————— Step 6 — Create training examples ————— */}
      <Step id="step-6">
        <div className="prose-col">
          <StepHead step={6} kicker="STEP 06 — EVERY POSITION IS A QUESTION" title="Create training examples" />
          <Body>Suppose the token sequence is:</Body>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 flex flex-wrap items-center gap-2"
          >
            <TokenChip>The</TokenChip>
            <TokenChip leadingSpace>robot</TokenChip>
            <TokenChip leadingSpace>moved</TokenChip>
            <TokenChip leadingSpace>forward</TokenChip>
            <TokenChip>.</TokenChip>
          </motion.div>
          <Body>The input and target are shifted:</Body>
        </div>
        <div className="wide-col mt-6">
          <ShiftDemo />
        </div>
        <div className="prose-col mt-8">
          <Body className="mt-0">At every position, the model predicts the next token.</Body>
          <div className="mt-8">
            <StatBlock
              value={4000}
              prefix="~"
              caption="Prediction problems per 4,000-token sequence"
            />
          </div>
          <Body>
            For a sequence containing 4,000 tokens, the model receives approximately 4,000
            prediction problems simultaneously.
          </Body>
        </div>
      </Step>

      {/* ————— Step 7 — Run the forward pass ————— */}
      <Step id="step-7">
        <div className="prose-col">
          <StepHead step={7} kicker="STEP 07 — SCORES FOR EVERYTHING" title="Run the forward pass" />
          <Body>
            The input tokens pass through the transformer. The final layer produces a score for
            every possible next token. These scores are called <TermChip>logits</TermChip>.
          </Body>
          <Body>Softmax converts the logits into probabilities:</Body>
        </div>
        <div className="wide-col mt-8">
          <SoftmaxVisual />
        </div>
        <div className="prose-col mt-8">
          <Body className="mt-0">
            The model&rsquo;s prediction is compared with the actual next token.
          </Body>
        </div>
      </Step>

      {/* ————— Step 8 — Calculate the loss ————— */}
      <Step id="step-8">
        <div className="prose-col">
          <StepHead step={8} kicker="STEP 08 — GRADING THE GUESS" title="Calculate the loss" />
          <Body>
            The loss function measures how incorrect the prediction was. LLMs generally use{" "}
            <TermChip>cross-entropy loss</TermChip>.
          </Body>
        </div>
        <div className="wide-col mt-8">
          <LossScenarios />
        </div>
        <div className="prose-col mt-8">
          <Body className="mt-0">
            Training tries to minimize average loss across{" "}
            <span className="font-serif italic text-ember">billions or trillions</span> of token
            predictions.
          </Body>
        </div>
      </Step>

      {/* ————— Step 9 — Backpropagation ————— */}
      <Step id="step-9">
        <div className="prose-col">
          <StepHead step={9} kicker="STEP 09 — ASSIGNING BLAME" title="Backpropagation" />
          <Body>
            Backpropagation determines how each parameter contributed to the error. It calculates a
            gradient for every parameter:
          </Body>
          <div className="mt-6 flex flex-col gap-4">
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3"
            >
              <ArrowUp className="mt-1.5 size-4 shrink-0 text-forest" aria-hidden="true" />
              <p className="font-serif text-[19px] italic leading-[1.5] text-ink">
                Changing this weight slightly upward would reduce the loss.
              </p>
            </motion.blockquote>
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3"
            >
              <ArrowDown className="mt-1.5 size-4 shrink-0 text-ember-deep" aria-hidden="true" />
              <p className="font-serif text-[19px] italic leading-[1.5] text-ink">
                Changing that weight downward would reduce the loss.
              </p>
            </motion.blockquote>
          </div>
        </div>
        <div className="wide-col mt-8">
          <GradientStat />
        </div>
        <div className="prose-col">
          <Body className="mt-0">
            For a model with 10 billion parameters, training calculates approximately 10 billion
            gradients during each update.
          </Body>
        </div>
      </Step>

      {/* ————— Step 10 — Optimizer update ————— */}
      <Step id="step-10">
        <div className="prose-col">
          <StepHead step={10} kicker="STEP 10 — ONE STEP OF MILLIONS" title="Optimizer update" />
          <Body>
            An optimizer such as <strong className="font-semibold">AdamW</strong> uses the gradients
            to update the weights. Conceptually:
          </Body>
          <CodeBlock
            label="update.rule"
            className="mt-6 [&_code]:text-[16px] [&_pre]:text-center md:[&_code]:text-[18px]"
          >
            <span>new_weight = old_weight - </span>
            <span className="text-code-ember">learning_rate</span>
            <span> × </span>
            <span className="text-code-forest">gradient</span>
          </CodeBlock>
          <Body>
            Real optimizers are more sophisticated. They track <TermChip>moving averages</TermChip>,{" "}
            <TermChip>momentum</TermChip>, <TermChip>weight decay</TermChip>, and{" "}
            <TermChip>numerical stability</TermChip>.
          </Body>
          <Body>This cycle repeats:</Body>
        </div>
        <div className="wide-col mt-6">
          <RepeatLoop />
        </div>
        <div className="prose-col mt-10">
          <div className="grid grid-cols-2 gap-6">
            <StatBlock value={1} format={asTrillions} caption="Of tokens" />
            <StatBlock value={1} format={asMillions} caption="Of training steps" />
          </div>
          <Body>The model may process trillions of tokens over millions of training steps.</Body>
        </div>
        <div className="wide-col mt-12">
          <PullLine>
            Batch → forward → loss → backward → update. Again. And again. And again.
          </PullLine>
          <ArrowDivider />
        </div>
      </Step>
    </div>
  );
}

const CHECKPOINT_SAVES = [
  "model weights",
  "optimizer state",
  "learning-rate state",
  "training step",
  "data position",
  "random state",
];

/** Chapter 3 — What the training infrastructure does (paper band). */
function InfrastructureChapter() {
  return (
    <section id="chapter-03" className="border-t border-line bg-paper py-14 md:py-20">
      <div className="page-col">
        <ChapterHeader
          kicker="CHAPTER 03"
          title="What the training infrastructure does"
          number="03"
          lede={
            <>
              <p>
                A large model cannot normally fit on one GPU. Training is distributed across
                hundreds or thousands of accelerators.
              </p>
              <p className="mt-3">The system divides the work using several techniques.</p>
            </>
          }
        />
      </div>

      <div className="wide-col mt-12 md:mt-16">
        <GpuGrid />
      </div>

      {/* Mixed-precision training */}
      <div className="prose-col mt-16 md:mt-24">
        <H4>Mixed-precision training</H4>
        <Body>
          Instead of storing every number in full 32-bit precision, training uses formats such as{" "}
          <TermChip>BF16</TermChip> or <TermChip>FP16</TermChip> to reduce memory and increase
          speed.
        </Body>
        <Body>Some sensitive operations remain at higher precision.</Body>
      </div>
      <div className="wide-col mt-6">
        <MixedPrecision />
      </div>

      {/* Checkpointing */}
      <div className="prose-col mt-16 md:mt-24">
        <H4>Checkpointing</H4>
        <Body>The lab periodically saves:</Body>
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2"
        >
          {CHECKPOINT_SAVES.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-[15px] text-ink">
              <Check className="size-4 shrink-0 text-forest" strokeWidth={2.5} aria-hidden="true" />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>
      <div className="wide-col mt-8">
        <CheckpointTimeline />
      </div>
      <div className="prose-col mt-8">
        <Body className="mt-0">
          If hardware fails after three weeks, training can restart from a recent checkpoint instead
          of starting over.
        </Body>
      </div>
    </section>
  );
}

interface HarnessCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  index: number;
}

function HarnessCard({ icon: Icon, title, body, index }: HarnessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      className="group rounded-[14px] border border-line bg-paper-raise p-6 transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <motion.span
        variants={{ hover: { rotate: 8 } }}
        transition={{ duration: 0.25 }}
        className="inline-flex size-10 items-center justify-center rounded-lg bg-ember-tint text-ember"
      >
        <Icon className="size-5" aria-hidden="true" />
      </motion.span>
      <h4 className="mt-4 inline-block font-sans text-[19px] font-semibold leading-[1.3] text-ink">
        <span className="relative">
          {title}
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-300 group-hover:scale-x-100"
          />
        </span>
      </h4>
      <p className="mt-2 text-[15px] leading-[1.7] text-ink-soft">{body}</p>
    </motion.div>
  );
}

/** Chapter 4 — What is a training harness? (paper-deep band). */
function HarnessChapter() {
  return (
    <section id="chapter-04" className="border-t border-line bg-paper-deep py-14 md:py-20">
      <div className="page-col">
        <ChapterHeader
          kicker="CHAPTER 04"
          title="What is a training harness?"
          number="04"
          lede={<p>A harness is the software system surrounding the model.</p>}
        />
      </div>

      <div className="prose-col mt-12 md:mt-16">
        <Body className="mt-0">The model architecture might only define:</Body>
        <CodeBlock
          label="model.py"
          className="mt-4 [&_code]:text-[18px] [&_pre]:text-center md:[&_code]:text-[20px]"
        >
          <span>output = model(tokens)</span>
        </CodeBlock>
        <Body>The training harness handles everything else:</Body>
      </div>

      <div className="wide-col mt-8">
        <HarnessDiagram />
      </div>

      <div className="prose-col mt-10">
        <Callout variant="warning">
          A serious training harness must handle <TermChip tone="gold">machine failures</TermChip>,{" "}
          <TermChip tone="gold">corrupted data</TermChip>,{" "}
          <TermChip tone="gold">network interruptions</TermChip>,{" "}
          <TermChip tone="gold">slow workers</TermChip>,{" "}
          <TermChip tone="gold">unstable gradients</TermChip>, and{" "}
          <TermChip tone="gold">reproducibility</TermChip>.
        </Callout>
      </div>

      <div className="prose-col mt-12">
        <Body className="mt-0">There are also other kinds of harnesses.</Body>
      </div>
      <div className="wide-col mt-6">
        <div className="grid gap-5 md:grid-cols-3">
          <HarnessCard
            icon={ClipboardCheck}
            title="Evaluation harness"
            body="Runs the model on standardized tasks and calculates scores."
            index={0}
          />
          <HarnessCard
            icon={Bot}
            title="Agent harness"
            body="Controls the loop between a model, tools, memory, and an environment."
            index={1}
          />
          <HarnessCard
            icon={Zap}
            title="Inference harness"
            body="Handles model serving, batching, caching, token generation, and request routing."
            index={2}
          />
        </div>
      </div>

      <div className="wide-col mt-16 md:mt-20">
        <PullLine>
          The model is the <span className="text-ink">brain-like function</span>. The harness is the{" "}
          <span className="text-ember">operating machinery</span> around it.
        </PullLine>
        <ArrowDivider />
      </div>
    </section>
  );
}

/**
 * Segment B — Pipeline Steps 6–10 (paper-deep, seamless with Builder A's
 * Chapter 2 shell), Chapter 3 Infrastructure (paper), Chapter 4 Training
 * Harness (paper-deep). StepperRail is wired by the main agent at integration.
 */
export default function SegmentB() {
  return (
    <>
      <InfrastructureChapter />
      <HarnessChapter />
    </>
  );
}
