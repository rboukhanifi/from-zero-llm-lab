import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ChapterHeader from "@/components/shared/ChapterHeader";
import ChipChain from "@/sections/d/ChipChain";
import VerticalFlow from "@/sections/d/VerticalFlow";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ---------------------------------- bits --------------------------------- */

function ListKicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-faint">
      {children}
    </p>
  );
}

function CheckList({
  items,
  marker,
  numbered = false,
}: {
  items: string[];
  marker: "ink" | "ember";
  numbered?: boolean;
}) {
  return (
    <ul className={cn("space-y-1.5", numbered && "space-y-2")}>
      {items.map((item, i) => {
        const numMatch = numbered ? item.match(/^(\d+)\.\s(.*)$/s) : null;
        return (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.3, delay: 0.35 + i * 0.03 }}
            className="flex items-start gap-2 text-[14px] leading-[1.6] text-ink-soft"
          >
            {numbered && numMatch ? (
              <span className="shrink-0 font-mono text-[13px] font-medium text-ember">
                {numMatch[1]}.
              </span>
            ) : (
              <span
                aria-hidden="true"
                className={cn(
                  "mt-[7px] size-[6px] shrink-0",
                  marker === "ember" ? "bg-ember" : "bg-ink-soft/50"
                )}
              />
            )}
            <span>{numbered && numMatch ? numMatch[2] : item}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 border-t border-line pt-4 font-serif text-[15px] italic leading-[1.5] text-ember-deep">
      {children}
    </div>
  );
}

/* --------------------------------- modules -------------------------------- */

interface ModuleSpec {
  n: number;
  title: string;
  learn: string[];
  build?: string[];
  buildIntro?: string;
  buildNumbered?: boolean;
  bodyLine?: string;
  note?: ReactNode;
  /** Custom footer block (compare chain / Mortar sub-card …). */
  footer?: ReactNode;
  /** Fully custom content rendered after LEARN (module 8). */
  extra?: ReactNode;
}

const MODULES: ModuleSpec[] = [
  {
    n: 1,
    title: "Mathematical and programming foundations",
    learn: [
      "Python",
      "NumPy",
      "vectors and matrices",
      "derivatives",
      "probability",
      "basic optimization",
      "Git and Linux",
    ],
    build: [
      "linear regression from scratch",
      "logistic regression from scratch",
      "gradient descent without PyTorch",
    ],
    note: "You should understand exactly why changing parameters reduces loss.",
  },
  {
    n: 2,
    title: "Neural networks and PyTorch",
    learn: [
      "tensors",
      "layers",
      "activation functions",
      "forward passes",
      "loss functions",
      "backpropagation",
      "automatic differentiation",
      "optimizers",
      "batching",
    ],
    build: [
      "a neural network classifier",
      "a training loop",
      "train/validation/test splits",
      "experiment logging",
    ],
    note: "Do not use a high-level trainer yet. Write the loop yourself.",
  },
  {
    n: 3,
    title: "Language modeling and tokens",
    learn: [
      "text datasets",
      "tokenization",
      "vocabulary",
      "embeddings",
      "context windows",
      "next-token prediction",
      "cross-entropy loss",
      "perplexity",
    ],
    build: [
      "a character-level tokenizer",
      "a subword tokenizer",
      "a small n-gram language model",
      "a simple neural language model",
    ],
    note: (
      <>
        <p>
          At the end, text should enter as strings and leave as token IDs.
        </p>
        <ChipChain steps={["string", "token IDs"]} className="mt-2.5" />
      </>
    ),
  },
  {
    n: 4,
    title: "Transformer from scratch",
    learn: [
      "query, key, and value",
      "causal attention",
      "attention masks",
      "multi-head attention",
      "positional encoding",
      "MLP blocks",
      "residual connections",
      "normalization",
    ],
    build: [
      "single-head attention",
      "multi-head attention",
      "one transformer block",
      "a miniature GPT",
    ],
    bodyLine: "Train it on a small dataset and generate text.",
    note: (
      <p>
        The model can be small—perhaps{" "}
        <span className="font-serif text-[17px] font-semibold not-italic text-ember">
          10 million to 100 million
        </span>{" "}
        parameters. The point is understanding the complete system.
      </p>
    ),
  },
  {
    n: 5,
    title: "Training systems and the harness",
    learn: [
      "data loaders",
      "gradient accumulation",
      "mixed precision",
      "checkpointing",
      "learning-rate schedules",
      "gradient clipping",
      "distributed training concepts",
      "experiment tracking",
      "failure recovery",
    ],
    buildIntro: "Build a training harness that can:",
    build: [
      "start training",
      "save checkpoints",
      "resume training",
      "log metrics",
      "run validation",
      "generate samples",
      "detect NaNs",
    ],
    note: "This module teaches the difference between a model implementation and a functioning lab training system.",
  },
  {
    n: 6,
    title: "Evaluation",
    learn: [
      "validation loss",
      "benchmark design",
      "contamination",
      "capability evaluations",
      "reliability evaluations",
      "calibration",
      "ablations",
      "statistical significance",
    ],
    buildIntro: "Build an evaluation harness for your miniature model. Include:",
    build: [
      "held-out text loss",
      "completion accuracy",
      "simple reasoning questions",
      "memorization tests",
      "latency and memory measurement",
    ],
  },
  {
    n: 7,
    title: "Post-training",
    learn: [
      "supervised fine-tuning",
      "instruction datasets",
      "chat templates",
      "preference data",
      "reward models",
      "DPO",
      "safety tuning",
      "synthetic data generation",
    ],
    buildNumbered: true,
    build: [
      "1. A small instruction dataset.",
      "2. An SFT pipeline.",
      "3. A preference dataset.",
      "4. A basic DPO-style post-training experiment.",
    ],
    footer: (
      <div className="mt-5 border-t border-line pt-4">
        <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          Compare:
        </p>
        <ChipChain
          separator="vs"
          steps={["base model", "instruction-tuned model", "preference-tuned model"]}
          className="mt-3"
        />
      </div>
    ),
  },
  {
    n: 8,
    title: "Agents and reinforcement learning",
    learn: [
      "states and observations",
      "actions",
      "rewards",
      "episodes",
      "policies",
      "rollouts",
      "value functions",
      "policy gradients",
      "PPO",
      "verifiable rewards",
      "tool-use loops",
    ],
    extra: (
      <>
        <div className="mt-5">
          <ListKicker>BUILD</ListKicker>
          <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
            Build a simple environment:
          </p>
          <dl className="mt-3 space-y-2 rounded-xl border border-line bg-paper-deep/60 p-3.5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="w-[92px] shrink-0 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                Observation:
              </dt>
              <dd className="text-[14px] leading-[1.6] text-ink-soft">
                arithmetic or coding task
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="w-[92px] shrink-0 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                Actions:
              </dt>
              <dd className="text-[14px] leading-[1.6] text-ink-soft">
                answer, use calculator, run code
              </dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="w-[92px] shrink-0 font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink-faint">
                Reward:
              </dt>
              <dd className="text-[14px] leading-[1.6] text-ink-soft">
                <span className="font-mono font-semibold text-forest">1</span> if
                correct, <span className="font-mono text-ink-faint">0</span>{" "}
                otherwise
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-[14px] leading-[1.6] text-ink-soft">
            Then build an agent harness:
          </p>
          <VerticalFlow
            className="mt-3 items-start"
            steps={[
              "prompt",
              "model action",
              "environment response",
              "next model action",
              "reward",
              "recorded trajectory",
            ]}
          />
        </div>
        <div className="mt-6 rounded-xl border border-forest/25 bg-forest-tint/70 p-4">
          <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-forest">
            For Mortar — the later version
          </p>
          <VerticalFlow
            className="mt-3 items-start"
            steps={[
              "task instruction",
              "perception",
              "robot skill selection",
              "tool execution",
              "inspection",
              "reward",
              "retry or completion",
            ]}
          />
        </div>
      </>
    ),
  },
];

/* --------------------------------- section -------------------------------- */

/**
 * Course plan — From basic ML to training a miniature LLM (segment-d spec S11).
 * 2-col grid of 8 module cards with verbatim LEARN / BUILD lists, ghost
 * numerals, and a scrub-drawn dashed diagonal behind the grid (desktop only).
 */
export default function Course() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 85%", "end 60%"],
  });
  const dashLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="course" className="border-t border-line bg-paper">
      <div className="page-col py-[72px] md:py-[120px]">
        <ChapterHeader
          kicker="SMALL COURSE PLAN"
          title="From basic ML to training a miniature LLM"
          lede={
            <p className="text-[17.5px] leading-[1.75] max-md:text-[16px]">
              This can be completed in approximately eight modules. The
              objective is not merely to use libraries, but to understand and
              build each layer.
            </p>
          }
        />

        <div ref={gridRef} className="relative mt-12 md:mt-16">
          {/* Decorative dashed diagonal connecting module numerals (desktop) */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="2"
              y1="2"
              x2="98"
              y2="98"
              className="stroke-line-strong"
              strokeWidth="1"
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: dashLength, opacity: 0.6 }}
            />
          </svg>

          <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-2">
            {MODULES.map((m) => (
              <motion.article
                key={m.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="relative flex flex-col rounded-[14px] border border-line bg-paper-raise p-6 md:p-7"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-5 top-4 select-none font-serif text-[64px] font-bold leading-none text-line-strong"
                  style={{
                    WebkitTextStroke: "1px currentColor",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {m.n}
                </span>
                <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember">
                  Module {m.n}
                </p>
                <h4 className="mt-2 max-w-[85%] font-sans text-[19px] font-semibold leading-[1.3] text-ink max-md:text-[17px]">
                  {m.title}
                </h4>

                <div className="mt-5">
                  <ListKicker>LEARN</ListKicker>
                  <div className="mt-2.5">
                    <CheckList items={m.learn} marker="ink" />
                  </div>
                </div>

                {m.build && (
                  <div className="mt-5">
                    <ListKicker>BUILD</ListKicker>
                    {m.buildIntro && (
                      <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
                        {m.buildIntro}
                      </p>
                    )}
                    <div className="mt-2.5">
                      <CheckList
                        items={m.build}
                        marker="ember"
                        numbered={m.buildNumbered}
                      />
                    </div>
                  </div>
                )}

                {m.bodyLine && (
                  <p className="mt-4 text-[14px] leading-[1.6] text-ink-soft">
                    {m.bodyLine}
                  </p>
                )}

                {m.extra}

                {(m.note || m.footer) && (
                  <div className="mt-auto pt-1">
                    {m.note && <Note>{m.note}</Note>}
                    {m.footer}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
