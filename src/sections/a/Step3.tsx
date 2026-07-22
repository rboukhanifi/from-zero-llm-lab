import { motion } from "framer-motion";
import StepHead from "@/sections/a/StepHead";
import PullLine from "@/sections/a/PullLine";
import TokenizationDemo from "@/sections/a/TokenizationDemo";
import TokenChip from "@/components/shared/TokenChip";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const TOKEN_KINDS = [
  "complete words",
  "parts of words",
  "punctuation",
  "spaces",
  "code fragments",
  "individual characters",
];

const AFFECTS = [
  "training cost",
  "context length",
  "multilingual performance",
  "coding performance",
  "numerical reasoning",
  "inference speed",
];

const FRAGMENTS = ["M", "an", "uf", "act", "ur", "ing"];

/** 1-token vs 6-token cost comparison with ProbBar-style width fills. */
function CostComparison() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      className="mt-6 grid gap-4 sm:grid-cols-2"
    >
      {/* Left: common word, 1 token */}
      <div className="rounded-[14px] border border-line bg-paper-raise p-5">
        <div className="flex flex-wrap gap-1.5">
          <TokenChip>the</TokenChip>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-paper-deep">
          <motion.span
            variants={{ hidden: { width: "0%" }, show: { width: `${(1 / 6) * 100}%` } }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="block h-full rounded-full bg-forest"
          />
        </div>
        <p className="mt-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-forest">
          1 token
        </p>
      </div>
      {/* Right: uncommon technical term, 6 tokens */}
      <div className="rounded-[14px] border border-line bg-paper-raise p-5">
        <div className="flex flex-wrap gap-1.5">
          {FRAGMENTS.map((f, i) => (
            <motion.span
              key={f + i}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                show: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.35, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-flex"
            >
              <TokenChip>{f}</TokenChip>
            </motion.span>
          ))}
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-paper-deep">
          <motion.span
            variants={{ hidden: { width: "0%" }, show: { width: "100%" } }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="block h-full rounded-full bg-gold"
          />
        </div>
        <p className="mt-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-gold">
          6 tokens
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Step 3 — Train a tokenizer (#step-3): pull line, tokenization demo,
 * token kinds, vocabulary sentence, why-it-matters + 1-vs-6 example,
 * affected factors.
 */
export default function Step3() {
  return (
    <section id="step-3" className="scroll-mt-[60px] pt-10 md:pt-16">
      <StepHead step={3} kicker="STEP 03 — Text becomes numbers" title="Train a tokenizer" />

      <div className="mt-10 max-w-[680px]">
        <PullLine>Models do not directly read words. They read integers.</PullLine>
        <p className="mt-8 text-ink-soft">
          A tokenizer converts text into units called tokens. For example:
        </p>
      </div>

      <div className="mt-2 max-w-[860px]">
        <TokenizationDemo />
      </div>

      <div className="mt-10 max-w-[680px] space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="text-ink-soft">Tokens may be:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOKEN_KINDS.map((k) => (
              <TokenChip key={k}>{k}</TokenChip>
            ))}
          </div>
        </motion.div>

        <p className="text-ink-soft">
          The tokenizer vocabulary might contain tens of thousands or hundreds
          of thousands of possible tokens.
        </p>

        <h4 className="pt-2 font-sans text-[17px] font-semibold leading-[1.3] text-ink md:text-[19px]">
          Why tokenization matters
        </h4>
        <p className="text-ink-soft">
          A poor tokenizer can make certain languages, code, or mathematical
          notation unnecessarily expensive. For example, a common English word
          may require one token, while an uncommon technical term might
          require six tokens.
        </p>
      </div>

      <div className="max-w-[860px]">
        <CostComparison />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mt-10 max-w-[680px]"
      >
        <p className="text-ink-soft">Tokenization affects:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {AFFECTS.map((a) => (
            <span
              key={a}
              className={cn(
                "inline-flex items-center rounded-lg border border-ember bg-ember-tint px-2.5 py-1.5",
                "font-mono text-[13px] font-medium leading-none text-ink"
              )}
            >
              {a}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
