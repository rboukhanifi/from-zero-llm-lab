import { useRef } from "react";
import { motion } from "framer-motion";
import TokenField from "@/sections/TokenField";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Title words with the "from Zero" accent moment (italic ember). */
const TITLE_WORDS: { word: string; accent: boolean }[] = [
  { word: "How", accent: false },
  { word: "a", accent: false },
  { word: "Lab", accent: false },
  { word: "Trains", accent: false },
  { word: "a", accent: false },
  { word: "Model", accent: false },
  { word: "from", accent: true },
  { word: "Zero", accent: true },
];

/**
 * S0 — Hero (#hero), segment-a spec. 100dvh (min 640px) opening on paper,
 * centered 760px column, ambient token field behind the text, scroll cue
 * at the bottom edge.
 */
export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-[100dvh] min-h-[640px] flex-col overflow-hidden bg-paper"
    >
      {/* Ambient token field (z-0), text above (z-10) */}
      <TokenField heroRef={heroRef} />

      <div className="relative z-10 mx-auto flex w-full max-w-[760px] flex-1 flex-col items-center justify-center px-6 pb-24 pt-32 text-center">
        {/* 1. Kicker */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="kicker"
        >
          A long-form explainer
        </motion.p>

        {/* 2. Title — word-split masked rise, "from Zero" italic ember */}
        <h1 className="mt-6 font-serif text-[44px] font-semibold leading-[1.02] tracking-[-0.025em] text-ink md:text-[84px]">
          {TITLE_WORDS.map(({ word, accent }, i) => (
            <span
              key={`${word}-${i}`}
              className="inline-block overflow-hidden pb-[0.1em] align-bottom"
            >
              <motion.span
                className={
                  accent
                    ? "inline-block italic text-ember will-change-transform"
                    : "inline-block will-change-transform"
                }
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.9,
                  delay: 0.35 + i * 0.07,
                  ease: EASE,
                }}
              >
                {word}
                {i < TITLE_WORDS.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* 3–5. Ledes + pull line — fade-rise, stagger 0.12s from 1.0s */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
          className="mt-8 max-w-[560px] space-y-4 text-left text-[16px] leading-[1.75] text-ink-soft md:text-[17.5px]"
        >
          <p>
            A model starts as a mathematical function with billions of
            randomly initialized numbers called{" "}
            <span className="font-mono text-[0.92em] text-ember-deep">
              parameters
            </span>{" "}
            or{" "}
            <span className="font-mono text-[0.92em] text-ember-deep">
              weights
            </span>
            . Training gradually changes those numbers until the function
            produces useful outputs.
          </p>
          <p>For an LLM, the central task is surprisingly simple:</p>
        </motion.div>

        {/* 4. Center pull line in a hairline frame */}
        <motion.blockquote
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.12, ease: EASE }}
          className="mt-8 w-full border-y border-line px-4 py-6"
        >
          <p className="font-serif text-[23px] font-medium italic leading-[1.3] tracking-[-0.01em] text-ink md:text-[30px]">
            “Given previous tokens, predict the next token.”
          </p>
        </motion.blockquote>

        {/* 5. Final lede */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.24, ease: EASE }}
          className="mt-8 max-w-[560px] text-left text-[16px] leading-[1.75] text-ink-soft md:text-[17.5px]"
        >
          <p>
            Almost everything else—reasoning, writing, coding, tool
            use—emerges from training this prediction system on enormous
            amounts of data, followed by specialized post-training.
          </p>
        </motion.div>
      </div>

      {/* 6. Scroll cue — mono 11px SCROLL + 48px hairline, ember segment loop */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.36, ease: EASE }}
        className="relative z-10 flex flex-col items-center gap-3 pb-8"
        aria-hidden="true"
      >
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-faint">
          Scroll
        </span>
        <span className="relative block h-12 w-px overflow-hidden bg-line">
          <span className="scroll-cue-segment absolute left-0 top-0 block h-3 w-px bg-ember" />
        </span>
      </motion.div>
    </section>
  );
}
