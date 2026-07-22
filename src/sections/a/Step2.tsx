import { motion } from "framer-motion";
import StepHead from "@/sections/a/StepHead";
import Callout from "@/components/shared/Callout";
import DataPipelineFlow from "@/sections/a/DataPipelineFlow";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const SOURCES = [
  "websites",
  "books",
  "research papers",
  "source code",
  "documentation",
  "conversations",
  "mathematical material",
  "licensed datasets",
  "synthetic data",
  "human-written examples",
];

/** Deterministic mixed-size pattern for the source cloud. */
const SIZE_CLASSES = [
  "px-4 py-2.5 text-[14px]",
  "px-3 py-2 text-[12px]",
  "px-3.5 py-2 text-[13px]",
  "px-3 py-2 text-[12.5px]",
  "px-4 py-2.5 text-[14.5px]",
  "px-3.5 py-2 text-[13px]",
  "px-3 py-2 text-[12px]",
  "px-3.5 py-2.5 text-[13.5px]",
  "px-3 py-2 text-[12.5px]",
  "px-4 py-2 text-[13.5px]",
];

const PROBLEMS = [
  "duplicates",
  "spam",
  "broken formatting",
  "private information",
  "low-quality content",
  "malicious instructions",
  "contradictory examples",
];

function GoldChip({ children }: { children: string }) {
  return (
    <span className="mx-0.5 inline-flex items-center rounded-md border border-gold/40 bg-gold-tint px-1.5 py-0.5 font-mono text-[0.82em] font-medium leading-[1.4] text-ink">
      {children}
    </span>
  );
}

/**
 * Step 2 — Collect data (#step-2): 10 source chips in a wrapping cloud,
 * raw-data warning callout (7 problem nouns as gold-tint chips), the
 * 10-stage data pipeline flow, and the data-mixture insight callout.
 */
export default function Step2() {
  return (
    <section id="step-2" className="scroll-mt-[60px] pt-10 md:pt-16">
      <StepHead step={2} kicker="STEP 02 — The raw material" title="Collect data" />

      <div className="mt-10 max-w-[680px]">
        <p className="text-ink-soft">An LLM may be trained on combinations of:</p>
      </div>

      {/* 10 sources — wrapping cloud, mixed sizes, stagger in */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="mt-5 flex max-w-[860px] flex-wrap items-center gap-2.5"
      >
        {SOURCES.map((src, i) => (
          <motion.span
            key={src}
            variants={{
              hidden: { opacity: 0, scale: 0.92 },
              show: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
            className={cn(
              "inline-flex items-center rounded-lg border border-line bg-paper-raise font-mono font-medium leading-none text-ink",
              SIZE_CLASSES[i]
            )}
          >
            {src}
          </motion.span>
        ))}
      </motion.div>

      <Callout variant="warning" kicker="WATCH OUT" className="mt-8 max-w-[760px]">
        <p>
          Raw data is not immediately usable. It contains{" "}
          {PROBLEMS.map((p, i) => (
            <span key={p}>
              <GoldChip>{p}</GoldChip>
              {i < PROBLEMS.length - 2 ? ", " : i === PROBLEMS.length - 2 ? ", and " : ""}
            </span>
          ))}
          .
        </p>
      </Callout>

      {/* The 10-stage data pipeline */}
      <div className="mt-10 max-w-[680px]">
        <p className="text-ink-soft">The lab builds a data pipeline that:</p>
      </div>
      <DataPipelineFlow />

      <Callout variant="insight" kicker="KEY IDEA" className="mt-10 max-w-[680px]">
        The data mixture is extremely important. A model trained mostly on
        casual internet text behaves differently from one trained heavily on
        mathematics, code, or scientific literature.
      </Callout>
    </section>
  );
}
