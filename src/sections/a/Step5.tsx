import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import StepHead from "@/sections/a/StepHead";
import PullLine from "@/sections/a/PullLine";
import ProbBar from "@/components/shared/ProbBar";
import Callout from "@/components/shared/Callout";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const SCRAMBLE_WORDS = [
  "zebra",
  "Tuesday",
  "quantum",
  "muffin",
  "gravity",
  "velvet",
  "hundred",
  "spiral",
];

/**
 * Scramble flourish (segment-a spec): the label cycles through random words
 * for ~0.8s to convey "random output", then locks to the source word.
 * Reduced motion: the final word renders immediately.
 */
function ScrambleText({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [word, setWord] = useState(text);
  const [locked, setLocked] = useState(reduced);

  useEffect(() => {
    if (reduced || !inView || locked) return;
    const interval = window.setInterval(() => {
      setWord(SCRAMBLE_WORDS[Math.floor(Math.random() * SCRAMBLE_WORDS.length)]);
    }, 70);
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
      setWord(text);
      setLocked(true);
    }, 800);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [inView, locked, reduced, text]);

  return (
    <span ref={ref} className={locked ? "text-ink" : "text-ink-faint"}>
      {word}
    </span>
  );
}

/**
 * Step 5 — Randomly initialize the model (#step-5): "knows nothing"
 * framing, the `The sky is` prompt card with blinking caret, the 4 random
 * probabilities (banana 3% / blue 0.01% / factory 8% / running 2% — no
 * winner yet), and the segment handoff into Step 6.
 */
export default function Step5() {
  return (
    <section id="step-5" className="scroll-mt-[60px] pt-10 md:pt-16">
      <StepHead step={5} kicker="STEP 05 — Knowing nothing" title="Randomly initialize the model" />

      <div className="mt-10 max-w-[680px]">
        <PullLine>At the beginning, the model knows nothing.</PullLine>
        <p className="mt-8 text-ink-soft">
          Its billions of parameters contain small random values. Given a
          prompt, its output is essentially random. The model might receive:
        </p>
      </div>

      {/* Prompt card with blinking caret */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-5 max-w-[680px] rounded-[14px] border border-line bg-paper-raise px-6 py-5"
      >
        <p className="font-mono text-[17px] leading-[1.6] text-ink md:text-[20px]">
          The sky is
          <span aria-hidden="true" className="ml-1 inline-block animate-caret-blink text-ember">
            ▌
          </span>
        </p>
      </motion.div>

      <div className="mt-8 max-w-[680px]">
        <p className="text-ink-soft">and assign random probabilities:</p>
      </div>

      {/* ProbBar set — no winner; nothing is sensible yet */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-5 max-w-[760px] space-y-4 rounded-[14px] border border-line bg-paper-raise p-6"
      >
        <ProbBar label={<ScrambleText text="banana" />} value={3} index={0} />
        <ProbBar
          label={<ScrambleText text="blue" />}
          value={0.01}
          index={1}
          warning="the sensible answer, nearly invisible"
        />
        <ProbBar label={<ScrambleText text="factory" />} value={8} index={2} />
        <ProbBar label={<ScrambleText text="running" />} value={2} index={3} showFootnote />
      </motion.div>

      <Callout variant="insight" kicker="KEY IDEA" className="mt-8 max-w-[680px]">
        Training adjusts the weights so that sensible continuations receive
        higher probability.
      </Callout>

      {/* Segment handoff into Step 6 (Segment B) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.6 }}
        className="mt-12 flex items-center gap-4"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-line" />
        <span className="flex items-center gap-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember">
          The loop begins
          <ArrowRight className="size-4" strokeWidth={2.5} />
        </span>
        <span className="h-px flex-1 bg-line" />
      </motion.div>
    </section>
  );
}
