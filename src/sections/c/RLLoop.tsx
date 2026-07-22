import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** The 7 loop steps — verbatim from the source. */
export const RL_STEPS = [
  "The model attempts tasks.",
  "The system records rollouts.",
  "Each rollout receives a reward.",
  "The algorithm estimates which actions contributed to the result.",
  "The model is updated.",
  "New rollouts are collected.",
  "The process repeats.",
];

const SIZE = 620;
const CENTER = SIZE / 2;
const RADIUS = 218;
const NODE_R = 30;

function nodePos(i: number) {
  const angle = (-90 + i * (360 / RL_STEPS.length)) * (Math.PI / 180);
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

/** Circular arrow path (clockwise, starting at top). */
function ringPath(r: number) {
  return [
    `M ${CENTER} ${CENTER - r}`,
    `A ${r} ${r} 0 1 1 ${CENTER - 0.001} ${CENTER - r}`,
  ].join(" ");
}

function LoopDiagram({
  active,
  progressRef,
  animated,
}: {
  active: number;
  progressRef?: React.RefObject<SVGGElement | null>;
  animated: boolean;
}) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto w-full max-w-[520px]"
      role="img"
      aria-label="The reinforcement learning loop: seven steps connected in a circle"
    >
      <defs>
        <marker
          id="rl-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" className="fill-ember" />
        </marker>
      </defs>

      {/* Base ring */}
      <path
        d={ringPath(RADIUS)}
        fill="none"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={0}
        className="stroke-line-strong"
        strokeWidth={2}
      />
      {/* Ember progress arc — scrubbed by scroll (dashoffset driven by GSAP) */}
      <g ref={progressRef}>
        <path
          d={ringPath(RADIUS)}
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={animated ? 1 : 0}
          className="stroke-ember"
          strokeWidth={3}
          strokeLinecap="round"
          markerEnd="url(#rl-arrow)"
        />
      </g>

      {/* Connector ticks between nodes */}
      {RL_STEPS.map((_, i) => {
        const p = nodePos(i);
        const isActive = animated && i === active;
        const isDone = animated && i < active;
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={NODE_R}
              strokeWidth={isActive ? 2.5 : 1.5}
              className={cn(
                "transition-colors duration-300",
                isActive
                  ? "fill-ember stroke-ember"
                  : isDone
                    ? "fill-ember-tint stroke-ember/60"
                    : "fill-paper-raise stroke-line-strong"
              )}
            />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              className={cn(
                "font-mono text-[15px] font-bold transition-colors duration-300",
                isActive ? "fill-paper" : isDone ? "fill-ember" : "fill-ink-soft"
              )}
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Center loop glyph */}
      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="central"
        className={cn(
          "font-serif text-[64px] italic transition-colors duration-500",
          animated && active === RL_STEPS.length - 1 ? "fill-ember" : "fill-line-strong"
        )}
      >
        ↻
      </text>
    </svg>
  );
}

/** Pinned scroll sequence (GSAP pin, ~175vh scroll length): scroll progress
 *  advances the active node clockwise; node 7 completes the ember ring. */
function PinnedLoop() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGGElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    const arc = progressRef.current?.querySelector("path");
    if (!outer || !stage || !arc) return;

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "+=175%",
      pin: stage,
      scrub: 0.3,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        // Ember arc draws clockwise across the whole scrub.
        arc.setAttribute("stroke-dashoffset", String(1 - p));
        const idx = Math.min(RL_STEPS.length - 1, Math.floor(p * RL_STEPS.length));
        setActive((prev) => (prev === idx ? prev : idx));
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={outerRef} className="relative">
      <div
        ref={stageRef}
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 py-10"
      >
        <LoopDiagram active={active} progressRef={progressRef} animated />
        {/* Active-step caption (crossfade) */}
        <div className="flex min-h-[64px] max-w-[560px] items-start justify-center px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[13.5px] leading-[1.65] text-ink-soft md:text-[15px]"
            >
              <span className="mr-2 font-bold text-ember">{active + 1}.</span>
              {RL_STEPS[active]}
              {active === RL_STEPS.length - 1 && (
                <span className="ml-2 text-ember" aria-hidden="true">
                  ↻
                </span>
              )}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** Reduced-motion fallback: static ring + numbered list (design.md §5). */
function StaticLoop() {
  return (
    <div>
      <LoopDiagram active={-1} animated={false} />
      <ol className="mx-auto mt-8 max-w-[560px] space-y-2.5">
        {RL_STEPS.map((step, i) => (
          <li
            key={i}
            className="flex items-baseline gap-3 font-mono text-[13.5px] leading-[1.6] text-ink-soft"
          >
            <span className="inline-flex h-6 w-6 shrink-0 translate-y-1 items-center justify-center rounded-full border border-line-strong bg-paper-raise text-[11px] font-bold text-ink">
              {i + 1}
            </span>
            {step}
            {i === RL_STEPS.length - 1 && (
              <span className="text-ember" aria-hidden="true">
                ↻
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function RLLoop() {
  const reduced = useReducedMotion();
  return reduced ? <StaticLoop /> : <PinnedLoop />;
}
