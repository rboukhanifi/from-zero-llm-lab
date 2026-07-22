import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

/** The 14 harness responsibilities, in verbatim source order. */
export const RESPONSIBILITIES = [
  "loading data",
  "creating batches",
  "distributing work across GPUs",
  "running the forward pass",
  "computing loss",
  "running backpropagation",
  "updating parameters",
  "logging metrics",
  "detecting numerical problems",
  "saving checkpoints",
  "resuming interrupted jobs",
  "changing the learning rate",
  "running evaluations",
  "tracking experiments",
] as const;

const CX = 500;
const CY = 300;
const CR = 72;

interface Slot {
  /** label anchor */
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  /** spoke start (label side) */
  sx: number;
  sy: number;
}

/**
 * Clockwise from top-left: 4 top (left→right), 3 right (top→bottom),
 * 4 bottom (right→left), 3 left (bottom→top).
 */
const SLOTS: Slot[] = [
  // top: 1–4 (labels alternate two rows to avoid collisions)
  { x: 235, y: 116, anchor: "middle", sx: 235, sy: 130 },
  { x: 410, y: 90, anchor: "middle", sx: 410, sy: 104 },
  { x: 590, y: 116, anchor: "middle", sx: 590, sy: 130 },
  { x: 765, y: 90, anchor: "middle", sx: 765, sy: 104 },
  // right: 5–7
  { x: 906, y: 216, anchor: "end", sx: 892, sy: 220 },
  { x: 906, y: 304, anchor: "end", sx: 892, sy: 304 },
  { x: 906, y: 392, anchor: "end", sx: 892, sy: 388 },
  // bottom: 8–11 (right→left, alternating two rows)
  { x: 765, y: 496, anchor: "middle", sx: 765, sy: 478 },
  { x: 590, y: 522, anchor: "middle", sx: 590, sy: 504 },
  { x: 410, y: 496, anchor: "middle", sx: 410, sy: 478 },
  { x: 235, y: 522, anchor: "middle", sx: 235, sy: 504 },
  // left: 12–14 (bottom→top)
  { x: 94, y: 392, anchor: "start", sx: 108, sy: 388 },
  { x: 94, y: 304, anchor: "start", sx: 108, sy: 304 },
  { x: 94, y: 216, anchor: "start", sx: 108, sy: 220 },
];

/** Spoke endpoint on the model circle's edge, along the spoke direction. */
function edgePoint(sx: number, sy: number): { x: number; y: number } {
  const dx = CX - sx;
  const dy = CY - sy;
  const dist = Math.hypot(dx, dy) || 1;
  const t = (dist - (CR + 8)) / dist;
  return { x: sx + dx * t, y: sy + dy * t };
}

/**
 * Ch.4 signature visual — "the machine around the brain": central `model`
 * node inside a dashed TRAINING HARNESS rounded-rect whose inner edge carries
 * all 14 responsibilities, each joined to the center by a thin spoke. On
 * scroll scrub the spokes draw clockwise from top-left (0.3s each) and each
 * label flips ink-faint → ink. Mobile (<md): stacked list fallback.
 */
export default function HarnessDiagram() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(reduced ? RESPONSIBILITIES.length : 0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "center 45%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduced) return;
    setCount(Math.min(RESPONSIBILITIES.length, Math.max(0, Math.round(v * RESPONSIBILITIES.length))));
  });

  return (
    <div ref={ref}>
      {/* Desktop diagram */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:block"
      >
        <svg viewBox="0 0 1000 600" className="w-full" role="img" aria-label="Training harness diagram: the model at the center surrounded by fourteen harness responsibilities">
          {/* Harness boundary */}
          <rect
            x={60}
            y={56}
            width={880}
            height={488}
            rx={28}
            className="fill-paper-raise stroke-line-strong"
            strokeWidth={1.5}
            strokeDasharray="7 7"
          />
          <text x={92} y={88} className="fill-ink-faint font-mono" fontSize={13} letterSpacing={2}>
            TRAINING HARNESS
          </text>

          {/* Spokes */}
          {SLOTS.map((s, i) => {
            const e = edgePoint(s.sx, s.sy);
            const drawn = i < count;
            return (
              <line
                key={`spoke-${i}`}
                x1={s.sx}
                y1={s.sy}
                x2={e.x}
                y2={e.y}
                className="stroke-line-strong"
                strokeWidth={1}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={drawn ? 0 : 1}
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
                aria-hidden="true"
              />
            );
          })}

          {/* Center model node */}
          <circle cx={CX} cy={CY} r={CR} className="fill-paper-raise stroke-ember" strokeWidth={1.5} />
          <text
            x={CX}
            y={CY + 10}
            textAnchor="middle"
            className="fill-ink font-serif"
            fontSize={32}
            fontStyle="italic"
            fontWeight={500}
          >
            model
          </text>

          {/* Responsibility labels */}
          {SLOTS.map((s, i) => {
            const lit = i < count;
            return (
              <text
                key={`label-${i}`}
                x={s.x}
                y={s.y}
                textAnchor={s.anchor}
                fontSize={13.5}
                className={cn(
                  "font-mono transition-colors duration-300",
                  lit ? "fill-ink" : "fill-ink-faint"
                )}
              >
                <tspan className={lit ? "fill-ember" : "fill-ink-faint"} fontSize={11}>
                  {String(i + 1).padStart(2, "0")}
                </tspan>{" "}
                {RESPONSIBILITIES[i]}
              </text>
            );
          })}
        </svg>
      </motion.div>

      {/* Mobile fallback: model pill + 2-col chip grid, same scrub coloring */}
      <div className="md:hidden">
        <div className="mx-auto flex w-fit items-center justify-center rounded-full border-[1.5px] border-ember bg-paper-raise px-8 py-4 font-serif text-[24px] font-medium italic text-ink">
          model
        </div>
        <p className="mt-4 text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          Training harness
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {RESPONSIBILITIES.map((r, i) => (
            <motion.span
              key={r}
              initial={{ opacity: 0.4 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className={cn(
                "rounded-lg border border-line bg-paper-raise px-3 py-2 font-mono text-[12px] font-medium leading-[1.35] transition-colors duration-300",
                i < count ? "text-ink" : "text-ink-faint"
              )}
            >
              <span className={cn("mr-1.5 text-[10px]", i < count ? "text-ember" : "text-ink-faint")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {r}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
