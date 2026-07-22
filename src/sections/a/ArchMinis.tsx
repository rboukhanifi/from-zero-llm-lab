import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import TokenChip from "@/components/shared/TokenChip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

const POSITION_LABELS = ["1st", "2nd", "3rd", "…", "nth"];
const POSITION_TOKENS = [
  { label: "The", leadingSpace: false },
  { label: "robot", leadingSpace: true },
  { label: "moved", leadingSpace: true },
  { label: "forward", leadingSpace: true },
  { label: ".", leadingSpace: false },
];
/** Highlight tour: 1st → … → nth, 1s loop ×3, then rest on the last chip. */
const TOUR = [0, 3, 4];

/**
 * Step 4.2 visual (segment-a spec): 5 TokenChips with mono position labels
 * above; the 1st / … / nth labels highlight in sequence (1s loop ×3), then
 * rest on the last. Reduced motion: static highlight on the last chip.
 */
export function PositionChips() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-15% 0px" });
  const [hot, setHot] = useState<number>(reduced ? 4 : -1);

  useEffect(() => {
    if (reduced) {
      setHot(4);
      return;
    }
    if (!inView) return;
    let tick = 0;
    const total = TOUR.length * 3; // 3 loops
    const id = window.setInterval(() => {
      tick += 1;
      if (tick >= total) {
        window.clearInterval(id);
        setHot(4); // rest on last
        return;
      }
      setHot(TOUR[tick % TOUR.length]);
    }, 1000);
    setHot(TOUR[0]);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  return (
    <div ref={rootRef} className="mt-4" role="img" aria-label="Tokens with position labels: first, second, third, and so on to nth">
      <div className="flex flex-wrap items-start gap-2">
        {POSITION_TOKENS.map((tok, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "font-mono text-[10.5px] font-medium uppercase tracking-[0.1em] transition-colors duration-300",
                hot === i ? "text-ember" : "text-ink-faint"
              )}
            >
              {POSITION_LABELS[i]}
            </span>
            <TokenChip
              leadingSpace={tok.leadingSpace}
              className={cn(
                "transition-colors duration-300",
                hot === i && "border-ember bg-ember-tint"
              )}
            >
              {tok.label}
            </TokenChip>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Step 4.4 visual: compact 3-layer MLP SVG (3→5→3), paths draw in. */
export function MlpMini() {
  const cols = [3, 5, 3] as const;
  const W = 200;
  const H = 140;
  const COL_X = [24, 100, 176];
  const yOf = (count: number, i: number) =>
    16 + i * (count > 1 ? (H - 32) / (count - 1) : 0);

  const paths: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  for (let c = 0; c < 2; c++) {
    for (let a = 0; a < cols[c]; a++) {
      for (let b = 0; b < cols[c + 1]; b++) {
        paths.push({
          x1: COL_X[c],
          y1: yOf(cols[c], a),
          x2: COL_X[c + 1],
          y2: yOf(cols[c + 1], b),
          key: `${c}-${a}-${b}`,
        });
      }
    }
  }

  return (
    <motion.svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-4 w-full max-w-[220px]"
      role="img"
      aria-label="A small multilayer perceptron: three inputs, five hidden units, three outputs"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
    >
      {paths.map((p, i) => (
        <motion.line
          key={p.key}
          x1={p.x1}
          y1={p.y1}
          x2={p.x2}
          y2={p.y2}
          className="stroke-line-strong"
          strokeWidth={1}
          variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 0.7 } }}
          transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
        />
      ))}
      {cols.map((count, c) =>
        Array.from({ length: count }, (_, i) => (
          <motion.circle
            key={`m-${c}-${i}`}
            cx={COL_X[c]}
            cy={yOf(count, i)}
            r={5}
            className="fill-paper-raise stroke-ink-soft"
            strokeWidth={1.5}
            variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1 } }}
            transition={{ duration: 0.4, delay: 0.2 + c * 0.25 + i * 0.05 }}
          />
        ))
      )}
    </motion.svg>
  );
}

/**
 * Step 4.5 visual: block mini-diagram with an ember bypass arc (residual
 * skip connection) and a small LayerNorm pill.
 */
export function ResidualMini() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-4"
    >
      <svg
        viewBox="0 0 260 130"
        className="w-full max-w-[280px]"
        role="img"
        aria-label="A residual connection: the input bypasses the block and is added to its output"
      >
        {/* Bypass arc (residual skip) */}
        <motion.path
          d="M30 105 C 30 20, 230 20, 230 105"
          fill="none"
          className="stroke-ember"
          strokeWidth={1.75}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <path d="M224 96 L230 107 L219 103 Z" className="fill-ember" />
        {/* Input / output nodes */}
        <circle cx={30} cy={105} r={5} className="fill-paper-raise stroke-ink-soft" strokeWidth={1.5} />
        <circle cx={230} cy={105} r={5} className="fill-paper-raise stroke-ink-soft" strokeWidth={1.5} />
        {/* Main flow line */}
        <line x1={35} y1={105} x2={85} y2={105} className="stroke-line-strong" strokeWidth={1.5} />
        <line x1={175} y1={105} x2={225} y2={105} className="stroke-line-strong" strokeWidth={1.5} />
        {/* Block */}
        <rect
          x={85}
          y={85}
          width={90}
          height={40}
          rx={10}
          className="fill-paper-raise stroke-line-strong"
          strokeWidth={1.5}
        />
        <text
          x={130}
          y={109}
          textAnchor="middle"
          className="fill-ink font-mono"
          fontSize={11}
        >
          block
        </text>
        {/* LayerNorm pill */}
        <rect
          x={96}
          y={52}
          width={68}
          height={20}
          rx={10}
          className="fill-forest-tint stroke-forest"
          strokeWidth={1}
        />
        <text
          x={130}
          y={66}
          textAnchor="middle"
          className="fill-forest font-mono"
          fontSize={9.5}
        >
          LayerNorm
        </text>
        <text x={130} y={126} textAnchor="middle" className="fill-ink-faint font-mono" fontSize={8.5}>
          + skip
        </text>
      </svg>
    </motion.div>
  );
}
