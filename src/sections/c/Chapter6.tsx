import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, Bot, Check, Terminal } from "lucide-react";
import ChapterHeader from "@/components/shared/ChapterHeader";
import Callout from "@/components/shared/Callout";
import CodeBlock from "@/components/shared/CodeBlock";
import DefCard from "@/components/shared/DefCard";
import TokenChip from "@/components/shared/TokenChip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { ArrowDivider, Body, EASE_OUT, H4, Reveal, TermChip } from "./bits";
import RLLoop from "./RLLoop";

/* ------------------------------------------------------------------ */
/* 6.1 — vocabulary                                                    */
/* ------------------------------------------------------------------ */

const VOCAB: { term: string; alias?: string; def: string }[] = [
  { term: "Agent", def: "the model" },
  { term: "Environment", def: "the world it interacts with" },
  { term: "Observation", def: "what the model sees" },
  { term: "Action", def: "what the model does" },
  { term: "Reward", def: "a score indicating success" },
  { term: "Episode", def: "one complete attempt" },
  { term: "Policy", def: "the model's strategy" },
  {
    term: "Trajectory",
    alias: "rollout",
    def: "the sequence of observations and actions",
  },
];

/* ------------------------------------------------------------------ */
/* 6.3 — signed reward ledger bars                                     */
/* ------------------------------------------------------------------ */

function RewardBar({
  value,
  label,
  barClass,
  width,
  index,
  jagged = false,
}: {
  value: string;
  label: string;
  barClass: string;
  /** 0–100 fill percentage of the track. */
  width: number;
  index: number;
  jagged?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: jagged ? 0 : -8 }}
      whileInView={{ opacity: 1, x: jagged ? [0, -2, 2, -2, 2, 0] : 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={
        jagged
          ? { duration: 0.4, delay: index * 0.15 + 0.7 }
          : { duration: 0.4, delay: index * 0.15 }
      }
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          "w-12 shrink-0 text-right font-mono text-[15px] font-bold tabular-nums",
          value.startsWith("+")
            ? "text-forest"
            : value === "−100"
              ? "text-ember-deep"
              : "text-gold"
        )}
      >
        {value}
      </span>
      <div className="h-[22px] min-w-0 flex-1 rounded-md bg-paper-deep">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${width}%` }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: index * 0.15 }}
          style={
            jagged
              ? {
                  clipPath:
                    "polygon(0 0, 100% 0, 96% 20%, 100% 40%, 96% 60%, 100% 80%, 96% 100%, 0 100%)",
                }
              : undefined
          }
          className={cn("flex h-full items-center justify-end gap-1 rounded-md pr-1.5", barClass)}
        >
          {jagged && <AlertTriangle className="size-3.5 shrink-0 text-paper" aria-hidden="true" />}
        </motion.div>
      </div>
      <span className="w-36 shrink-0 text-[12.5px] font-medium leading-[1.35] text-ink-soft">
        {label}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter 6                                                           */
/* ------------------------------------------------------------------ */

const CODE_ENV_ROWS = [
  { key: "OBSERVATION", value: "Repository, task description, terminal output" },
  { key: "ACTION", value: "Edit a file, run a command, inspect a test" },
] as const;

const ROBOT_OBS = ["camera images", "joint positions", "force measurements", "task description"];
const ROBOT_ACTS = ["move joint", "grasp object", "call inspection tool", "stop", "retry"];

const ALGORITHMS = [
  "policy gradients",
  "PPO",
  "actor-critic methods",
  "Q-learning",
  "offline RL",
  "model-based RL",
  "group-based policy optimization methods",
];

const REASONING_REWARDS = [
  "whether a math answer is correct",
  "whether code passes tests",
  "whether a tool task succeeds",
  "whether a human prefers the answer",
  "whether a verifier accepts the solution",
];

const ROBOT_ENV_KINDS = [
  "simulations",
  "real robots",
  "recorded data",
  "digital twins",
  "combinations of simulation and reality",
];

export default function Chapter6() {
  const reduced = useReducedMotion();
  const rewardRef = useRef<HTMLDivElement>(null);
  const rewardInView = useInView(rewardRef, { once: true, margin: "-15% 0px" });

  return (
    <section id="chapter-06" className="border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-[1200px] px-6 py-[72px] md:px-10 md:py-[120px]">
        <ChapterHeader
          kicker="CHAPTER 06"
          title="Reinforcement learning for LLMs"
          number="06"
          lede={
            <p>
              Reinforcement learning trains a system using outcomes rather than
              only correct demonstrations.
            </p>
          }
        />

        {/* 6.1 The vocabulary */}
        <div className="mt-14 md:mt-16">
          <Reveal>
            <Body>The basic elements are:</Body>
          </Reveal>
          <div
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            style={{ perspective: "800px" }}
          >
            {VOCAB.map((v, i) => (
              <motion.div
                key={v.term}
                initial={{ opacity: 0, rotateX: 18 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.06 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <DefCard term={v.term} alias={v.alias} className="h-full">
                  {v.def}
                </DefCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 6.2 Example: code environment */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <H4 icon={Terminal}>Example: code environment</H4>
          </Reveal>
          <Reveal className="mt-6 max-w-[860px] overflow-hidden rounded-[14px] border border-line bg-paper-raise">
            {CODE_ENV_ROWS.map((row, i) => (
              <motion.div
                key={row.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.1 }}
                className="grid gap-1 border-b border-line p-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-baseline md:px-6"
              >
                <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember">
                  {row.key}
                </span>
                <span className="text-[15.5px] leading-[1.6] text-ink">{row.value}</span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.2 }}
              className="grid gap-2 p-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center md:px-6"
            >
              <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember">
                REWARD
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <motion.span
                  animate={rewardInView && !reduced ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="inline-flex items-baseline gap-2 rounded-lg border border-forest/50 bg-forest-tint px-3 py-1.5"
                >
                  <span className="font-mono text-[18px] font-bold text-forest">+1</span>
                  <span className="text-[13px] text-ink-soft">if tests pass</span>
                </motion.span>
                <span className="inline-flex items-baseline gap-2 rounded-lg border border-line bg-paper-deep px-3 py-1.5">
                  <span className="font-mono text-[18px] font-bold text-ink-faint">0</span>
                  <span className="text-[13px] text-ink-faint">if they fail</span>
                </span>
              </div>
            </motion.div>
          </Reveal>
          <div ref={rewardRef}>
            <Reveal className="mt-6">
              <Body>
                The model tries tasks, receives rewards, and updates its policy to
                make successful actions more likely.
              </Body>
            </Reveal>
          </div>
        </div>

        {/* 6.3 Example: robot environment */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <H4 icon={Bot}>Example: robot environment</H4>
          </Reveal>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Reveal className="rounded-[14px] border border-line bg-paper-raise p-5">
              <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember">
                OBSERVATION
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ROBOT_OBS.map((o) => (
                  <TokenChip key={o}>{o}</TokenChip>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08} className="rounded-[14px] border border-line bg-paper-raise p-5">
              <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember">
                ACTION
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ROBOT_ACTS.map((a) => (
                  <TokenChip key={a}>{a}</TokenChip>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.16} className="rounded-[14px] border border-line bg-paper-raise p-5">
              <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember">
                REWARD
              </p>
              <div className="mt-4 space-y-3">
                <RewardBar value="+10" label="component correctly installed" barClass="bg-forest" width={62} index={0} />
                <RewardBar value="−5" label="component damaged" barClass="bg-gold" width={34} index={1} />
                <RewardBar value="−1" label="unnecessary movement" barClass="bg-gold" width={12} index={2} />
                <RewardBar value="−100" label="safety violation" barClass="bg-ember-deep" width={100} index={3} jagged />
              </div>
              <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
                −100 breaks the scale — off the charts
              </p>
            </Reveal>
          </div>

          <CodeBlock label="environment.api" className="mt-6 max-w-[860px]">
            <span className="block whitespace-pre">
              <span className="text-code-forest">reset()</span>
              <span className="text-code-dim">{"        → initial observation"}</span>
            </span>
            <span className="block whitespace-pre">
              <span className="text-code-forest">step(action)</span>
              <span className="text-code-dim">{"   → observation, reward, done, information"}</span>
            </span>
          </CodeBlock>

          <Reveal className="mt-8">
            <Body>For robotics, environments may be:</Body>
          </Reveal>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {ROBOT_ENV_KINDS.map((k, i) => (
              <motion.span
                key={k}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.07 }}
              >
                <TokenChip>{k}</TokenChip>
              </motion.span>
            ))}
          </div>
        </div>

        {/* 6.4 How RL training works — pinned loop */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <H4>How RL training works</H4>
          </Reveal>
          <div className="mt-6 rounded-[14px] border border-line bg-paper-raise py-6">
            <RLLoop />
          </div>
        </div>

        {/* 6.5 Algorithms & verifiable rewards */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <Body>Algorithms include:</Body>
          </Reveal>
          <div className="mt-4 flex max-w-[860px] flex-wrap gap-2.5">
            {ALGORITHMS.map((a, i) => (
              <motion.span
                key={a}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.06 }}
              >
                <TokenChip variant="highlight">{a}</TokenChip>
              </motion.span>
            ))}
          </div>

          <Reveal className="mt-12">
            <Body>For LLM reasoning, the reward might be:</Body>
          </Reveal>
          <ul className="mt-5 max-w-[680px] space-y-3">
            {REASONING_REWARDS.map((r, i) => (
              <motion.li
                key={r}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.07 }}
                className="flex items-center gap-3 text-[15.5px] leading-[1.6] text-ink"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-forest/50 bg-forest-tint">
                  <Check className="size-3.5 text-forest" aria-hidden="true" />
                </span>
                {r}
              </motion.li>
            ))}
          </ul>

          <Callout variant="insight" kicker="KEY IDEA" className="mt-10 max-w-[680px]">
            This is often called{" "}
            <strong>
              reinforcement learning with verifiable rewards
            </strong>{" "}
            <TermChip>RLVR</TermChip> when correctness can be automatically checked.
          </Callout>
        </div>

        <ArrowDivider target="#chapter-07" label="Chapter 07 — Evaluation" />
      </div>
    </section>
  );
}
