import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ShieldAlert, X } from "lucide-react";
import ChapterHeader from "@/components/shared/ChapterHeader";
import Callout from "@/components/shared/Callout";
import StatBlock from "@/components/shared/StatBlock";
import { cn } from "@/lib/utils";
import { ArrowDivider, Body, EASE_OUT, H4, Reveal } from "./bits";

const DIMENSIONS = [
  "factual knowledge",
  "mathematics",
  "coding",
  "reasoning",
  "instruction following",
  "multilingual ability",
  "latency",
  "tool use",
  "hallucination rate",
  "safety",
  "robustness",
  "long-context performance",
];

/** Predefined "random-feel" stagger order over the 12 tiles. */
const STAGGER_ORDER = [0, 5, 2, 9, 1, 7, 11, 3, 6, 10, 4, 8];

const MFG_EVALS = [
  "identifying defects",
  "selecting the correct tool",
  "recovering from failure",
  "generating robot programs",
  "planning an assembly sequence",
  "completing tasks under changing conditions",
  "avoiding unsafe actions",
];

const RELIABILITY = [
  { term: "average performance", tag: "MEAN" },
  { term: "worst-case performance", tag: "MIN" },
  { term: "consistency", tag: "VAR" },
  { term: "calibration", tag: "CONF" },
  { term: "failure severity", tag: "SEV" },
  { term: "performance under distribution shift", tag: "SHIFT" },
];

/* ------------------------------------------------------------------ */
/* 7.3 — contamination visual: TRAIN / EVAL overlap animates to clean  */
/* ------------------------------------------------------------------ */

function ContaminationVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });

  return (
    <div
      ref={ref}
      className="relative h-[220px] select-none rounded-[14px] border border-line bg-paper-raise p-4"
      aria-label="Animation: the EVAL document slides out of the TRAIN document until they no longer overlap"
      role="img"
    >
      {/* TRAIN document */}
      <div className="absolute left-6 top-10 h-[130px] w-[52%] rounded-lg border border-line-strong bg-paper-deep">
        <span className="absolute left-3 top-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
          TRAIN
        </span>
      </div>
      {/* Overlap hatch (gold) — shrinks away as EVAL slides out */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={inView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.4 }}
        style={{ originX: 1 }}
        className="absolute left-[26%] top-10 h-[130px] w-[26%] overflow-hidden rounded-r-lg"
        aria-hidden="true"
      >
        <svg className="h-full w-full text-gold">
          <defs>
            <pattern
              id="hatch-gold"
              width="9"
              height="9"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="9" height="9" className="fill-gold-tint" />
              <line x1="0" y1="0" x2="0" y2="9" className="stroke-gold" strokeWidth="2.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hatch-gold)" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <X className="size-6 text-gold" strokeWidth={3} />
        </span>
      </motion.div>
      {/* EVAL document — slides from full overlap to zero overlap */}
      <motion.div
        initial={{ x: "0%" }}
        animate={inView ? { x: "62%" } : { x: "0%" }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.4 }}
        className="absolute left-[26%] top-16 h-[130px] w-[52%] rounded-lg border-2 border-ember bg-paper-raise shadow-lift"
      >
        <span className="absolute left-3 top-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ember">
          EVAL
        </span>
      </motion.div>
      {/* Clean state check */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.4, delay: 1.5 }}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-forest/50 bg-forest-tint px-3 py-1.5"
      >
        <Check className="size-4 text-forest" aria-hidden="true" />
        <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-forest">
          Separate data
        </span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter 7                                                           */
/* ------------------------------------------------------------------ */

export default function Chapter7() {
  return (
    <section id="chapter-07" className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[1200px] px-6 py-[72px] md:px-10 md:py-[120px]">
        <ChapterHeader
          kicker="CHAPTER 07"
          title="Evaluation"
          number="07"
          lede={
            <>
              <p>
                Training loss alone does not tell the lab whether a model is useful.
              </p>
              <p className="mt-3">
                The model must be evaluated on separate data it did not train on.
              </p>
            </>
          }
        />

        {/* 7.1 What evaluations measure */}
        <div className="mt-14 md:mt-16">
          <Reveal>
            <Body>Evaluations may measure:</Body>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {DIMENSIONS.map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{
                  duration: 0.5,
                  ease: EASE_OUT,
                  delay: STAGGER_ORDER.indexOf(i) * 0.05,
                }}
                className="group rounded-[14px] border border-line bg-paper-raise p-4 transition-colors duration-200 hover:border-ember"
              >
                <span className="font-mono text-[10.5px] font-medium tracking-[0.14em] text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-[14.5px] font-medium leading-[1.4] text-ink">
                  {d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 7.2 Manufacturing evals */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <Body>For a manufacturing model, evaluations might include:</Body>
          </Reveal>
          <ul className="mt-6 grid max-w-[860px] gap-x-10 gap-y-3.5 sm:grid-cols-2">
            {MFG_EVALS.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.06 }}
                className="flex items-center gap-3 text-[15.5px] leading-[1.6] text-ink"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ember/40 bg-ember-tint">
                  <Check className="size-3.5 text-ember" aria-hidden="true" />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* 7.3 Contamination */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <H4>Contamination</H4>
          </Reveal>
          <div className="mt-6 grid items-center gap-6 lg:grid-cols-2">
            <Callout variant="warning" kicker="WATCH OUT" icon={ShieldAlert}>
              Evaluation data must not appear in the training set. Otherwise, the
              model may memorize answers and appear more capable than it really is.
            </Callout>
            <ContaminationVisual />
          </div>
        </div>

        {/* 7.4 Capability versus reliability */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <H4>Capability versus reliability</H4>
          </Reveal>
          <div className="mt-8 grid items-center gap-10 rounded-[14px] border border-line bg-paper-raise p-6 md:p-10 lg:grid-cols-2">
            <StatBlock
              value={60}
              suffix="%"
              caption="OF THE TIME, THE TASK IS SOLVED"
              color="ember"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.7 }}
              className="font-serif text-[23px] font-medium italic leading-[1.3] tracking-[-0.01em] text-ink md:text-[30px]"
            >
              …but still{" "}
              <span className="text-ember-deep">commercially unusable</span>.
            </motion.p>
          </div>
          <Reveal className="mt-6">
            <Body>
              A model may solve a task 60% of the time but still be commercially
              unusable.
            </Body>
          </Reveal>

          <Reveal className="mt-12">
            <Body>Labs therefore measure:</Body>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RELIABILITY.map((r, i) => (
              <motion.div
                key={r.tag}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.08 }}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-[14px] border border-line bg-paper-raise p-5",
                  "transition-shadow duration-200 hover:shadow-lift"
                )}
              >
                <span className="font-serif text-[18px] font-semibold leading-[1.3] text-ink">
                  {r.term}
                </span>
                <span className="shrink-0 font-mono text-[11px] font-medium tracking-[0.12em] text-ink-faint">
                  {r.tag}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <ArrowDivider target="#chapter-08" label="Chapter 08 — Inference" />
      </div>
    </section>
  );
}
