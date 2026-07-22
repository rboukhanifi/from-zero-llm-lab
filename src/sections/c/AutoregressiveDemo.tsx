import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TokenChip from "@/components/shared/TokenChip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const PROMPT = "The robot should first";
const NEW_TOKEN = " inspect";
const GHOST_CANDIDATES = [" grasp", " move", " check"];

/** Caption beneath the growing line — verbatim beats from the source. */
const CAPTIONS = [
  "it predicts one token:",
  "it predicts one token:",
  "The new token is appended: The robot should first inspect",
  "Then it predicts another token.",
];

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block h-[0.95em] w-[2.5px] translate-y-[0.12em] animate-caret-blink bg-ember"
    />
  );
}

/** Ghost next-token chip flickering 2–3 candidates (0.3s cycle). Isolated +
 *  memoized so the interval never resets parent renders. */
const GhostCandidates = memo(function GhostCandidates() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setI((v) => (v + 1) % GHOST_CANDIDATES.length),
      300
    );
    return () => window.clearInterval(id);
  }, []);
  return (
    <TokenChip variant="ghost" className="opacity-70">
      {GHOST_CANDIDATES[i]}
    </TokenChip>
  );
});

/** Bottom looping indicator: PREDICT → APPEND → … with the active pair lit. */
function LoopIndicator({ phase }: { phase: number }) {
  const activeKind = phase % 2 === 0 ? "PREDICT" : "APPEND";
  const chips = ["PREDICT", "APPEND", "PREDICT", "APPEND", "…"];
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
      {chips.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5 md:gap-2">
          {i > 0 && (
            <ChevronRight className="size-3.5 text-line-strong" aria-hidden="true" />
          )}
          <span
            className={cn(
              "rounded-md border px-2 py-1 font-mono text-[10.5px] font-medium tracking-[0.12em] transition-colors duration-300 md:text-[11.5px]",
              c === activeKind
                ? "border-ember bg-ember-tint text-ember"
                : "border-line text-ink-faint"
            )}
          >
            {c}
          </span>
        </span>
      ))}
    </div>
  );
}

function GenerationLine({ phase, animated }: { phase: number; animated: boolean }) {
  return (
    <p className="text-center font-serif text-[22px] font-medium leading-[1.4] tracking-[-0.01em] text-ink md:text-[28px]">
      {PROMPT}
      {phase === 0 && <Caret />}
      {phase === 1 && (
        <>
          {" "}
          <motion.span
            initial={animated ? { opacity: 0, scale: 0.7, y: -6 } : false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="inline-block align-baseline"
          >
            <TokenChip variant="highlight">{NEW_TOKEN}</TokenChip>
          </motion.span>
          <Caret />
        </>
      )}
      {phase >= 2 && (
        <>
          <span className="text-ember">{NEW_TOKEN}</span>
          <Caret />
          {phase === 3 && (
            <>
              {" "}
              <GhostCandidates />
            </>
          )}
        </>
      )}
    </p>
  );
}

/** Pinned generation demo (GSAP pin, 200vh — design.md §5 pinned moment). */
function PinnedDemo() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;

    const trigger = ScrollTrigger.create({
      trigger: outer,
      start: "top top",
      end: "+=200%",
      pin: stage,
      scrub: 0.3,
      anticipatePin: 1,
      onUpdate: (self) => {
        const idx = Math.min(3, Math.floor(self.progress * 4));
        setPhase((prev) => (prev === idx ? prev : idx));
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={outerRef} className="relative">
      <div
        ref={stageRef}
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-10 px-6 py-10"
      >
        <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          Autoregressive generation
        </p>

        <GenerationLine phase={phase} animated />

        {/* Caption crossfade */}
        <div className="flex min-h-[56px] max-w-[680px] items-start justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[13px] leading-[1.65] text-ink-soft md:text-[14.5px]"
            >
              {CAPTIONS[phase]}
            </motion.p>
          </AnimatePresence>
        </div>

        <LoopIndicator phase={phase} />
      </div>
    </div>
  );
}

/** Reduced-motion fallback: the full sequence laid out statically. */
function StaticDemo() {
  return (
    <div className="space-y-8 px-6 py-8">
      {[0, 1, 2, 3].map((phase) => (
        <div key={phase} className="space-y-2">
          <GenerationLine phase={phase} animated={false} />
          <p className="text-center font-mono text-[12.5px] text-ink-soft">
            {CAPTIONS[phase]}
          </p>
        </div>
      ))}
      <LoopIndicator phase={0} />
    </div>
  );
}

export default function AutoregressiveDemo() {
  const reduced = useReducedMotion();
  return reduced ? <StaticDemo /> : <PinnedDemo />;
}
