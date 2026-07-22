import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { Check } from "lucide-react";
import ChapterHeader from "@/components/shared/ChapterHeader";
import VerticalFlow from "@/sections/d/VerticalFlow";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const STACK = [
  "Raw text",
  "data cleaning",
  "tokenizer",
  "transformer",
  "pretraining",
  "checkpointing",
  "evaluation harness",
  "instruction tuning",
  "tool-use environment",
  "reinforcement learning",
  "inference server",
];

const CHECKLIST = [
  "20M–100M parameter transformer",
  "custom tokenizer",
  "training harness",
  "several checkpoints",
  "evaluation dashboard",
  "instruction fine-tuning",
  "one tool",
  "one RL environment",
  "reproducible experiment configuration",
];

/** Verbatim closing line, split around the phrase that gets the ember underline. */
const QUOTE_PRE =
  "After completing this, a billion-parameter or trillion-token training run is";
const QUOTE_PHRASE = "conceptually the same system";
const QUOTE_POST =
  "—just with far more engineering, compute, data, and failure modes.";

function MaskedWord({ word, index }: { word: string; index: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className="relative inline-block will-change-transform"
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, delay: index * 0.04, ease: EASE }}
      >
        {word}
      </motion.span>
    </span>
  );
}

function ClosingLine() {
  const pre = QUOTE_PRE.split(" ");
  const phrase = QUOTE_PHRASE.split(" ");
  const post = QUOTE_POST.split(" ");
  let i = 0;
  return (
    <div className="mt-20 md:mt-28">
      {/* Hairline frame with ember end segments */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative h-px w-full origin-left bg-line"
      >
        <span className="absolute left-0 top-0 h-px w-12 bg-ember" />
      </motion.div>
      <blockquote className="mx-auto max-w-[880px] px-2 py-12 text-center font-serif text-[26px] font-medium italic leading-[1.3] tracking-[-0.01em] text-ink md:py-16 md:text-[34px]">
        {pre.map((w) => (
          <MaskedWord key={`pre-${i}`} word={w} index={i++} />
        ))}{" "}
        <span className="relative inline-block">
          {phrase.map((w, j) => (
            <span key={`ph-${j}`}>
              <MaskedWord word={w} index={i++} />
              {j < phrase.length - 1 ? " " : ""}
            </span>
          ))}
          {/* Slow ember underline sweeping beneath the whole phrase */}
          <motion.span
            aria-hidden="true"
            className="absolute -bottom-[0.02em] left-0 h-[2px] w-full origin-left bg-ember"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
          />
        </span>{" "}
        {post.map((w) => (
          <MaskedWord key={`post-${i}`} word={w} index={i++} />
        ))}
      </blockquote>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="relative h-px w-full origin-right bg-line"
      >
        <span className="absolute right-0 top-0 h-px w-12 bg-ember" />
      </motion.div>
    </div>
  );
}

/**
 * Recommended final project (segment-d spec S12): paper-raise "FINAL BRIEF"
 * frame, scrub-lit 11-node stack flow, verbatim body + 9-item checklist,
 * and the site's closing line with a word-split reveal and ember underline.
 */
export default function FinalProject() {
  const flowRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: flowRef,
    offset: ["start 80%", "end 55%"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STACK.length - 1, Math.floor(v * (STACK.length + 1)) - 1));
  });

  const activeIndex = reduceMotion ? STACK.length - 1 : active;

  return (
    <section id="final-project" className="border-t border-line bg-paper">
      <div className="page-col py-[72px] md:py-[120px]">
        {/* FINAL BRIEF frame */}
        <div className="relative rounded-[18px] border-[1.5px] border-line-strong bg-paper-raise p-6 pt-10 md:p-8 md:pt-12">
          <span className="absolute -top-[13px] left-6 rounded-md border-[1.5px] border-line-strong bg-paper-raise px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft md:left-8">
            Final brief
          </span>

          <ChapterHeader
            kicker="RECOMMENDED FINAL PROJECT"
            title="Build one small complete AI lab stack"
            number="12"
          />

          {/* 11-node stack flow — a pulse travels the chain on scrub */}
          <div ref={flowRef} className="mt-12 flex justify-center md:mt-16">
            <VerticalFlow steps={STACK} activeIndex={activeIndex} />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto mt-12 max-w-[680px] text-center text-[17.5px] leading-[1.75] text-ink max-md:text-[16px]"
          >
            The model itself can remain small. What matters is that you{" "}
            <span className="font-serif italic text-ember">understand and own</span>{" "}
            the entire pipeline.
          </motion.p>

          <div className="mx-auto mt-14 max-w-[860px]">
            <h4 className="font-sans text-[19px] font-semibold leading-[1.3] text-ink max-md:text-[17px]">
              A good final system would include:
            </h4>
            <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {CHECKLIST.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                  className="flex items-start gap-2.5 text-[15px] leading-[1.6] text-ink-soft"
                >
                  <Check
                    className="mt-[3px] size-4 shrink-0 text-forest"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <ClosingLine />
      </div>
    </section>
  );
}
