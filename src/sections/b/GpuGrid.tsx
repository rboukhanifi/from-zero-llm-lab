import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TokenChip from "@/components/shared/TokenChip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Pattern = "data" | "tensor" | "pipeline" | "sequence";

const COLS = 8;
const ROWS = 4;

interface Technique {
  id: Pattern;
  num: string;
  title: string;
  body: string;
}

const TECHNIQUES: Technique[] = [
  {
    id: "data",
    num: "01",
    title: "Data parallelism",
    body: "Multiple workers hold copies of the model and process different data batches. Their gradients are combined.",
  },
  {
    id: "tensor",
    num: "02",
    title: "Tensor parallelism",
    body: "Individual matrix operations are divided across multiple GPUs.",
  },
  {
    id: "pipeline",
    num: "03",
    title: "Pipeline parallelism",
    body: "Different layers of the model run on different machines.",
  },
  {
    id: "sequence",
    num: "04",
    title: "Sequence parallelism",
    body: "Long token sequences are divided across devices.",
  },
];

/** Tint class for a big-grid cell under the active pattern ("" = untinted). */
function tintFor(pattern: Pattern, r: number, c: number): string {
  switch (pattern) {
    case "data":
      return "bg-ember";
    case "tensor":
      // one matrix, quartered across 4 adjacent cells (row 1, cols 2–5)
      return r === 1 && c >= 2 && c <= 5 ? "bg-ember" : "";
    case "pipeline":
      if (c < 2) return "bg-ember";
      if (c < 4) return "bg-gold";
      if (c < 6) return "bg-forest";
      return "bg-ember/40";
    case "sequence":
      return r === 2 ? "bg-ember-tint" : "";
  }
}

/** Dashed cut-line overlay for sequence parallelism (cols split into 4 slices). */
function hasCut(pattern: Pattern, r: number, c: number): boolean {
  return pattern === "sequence" && r === 2 && (c === 2 || c === 4 || c === 6);
}

/** Static mini 4×2 pattern diagram inside each card. */
function MiniPattern({ id }: { id: Pattern }) {
  if (id === "sequence") {
    return (
      <div className="flex flex-wrap items-center gap-1" aria-hidden="true">
        {["The", " robot", " moved", " forward", "."].map((t, i) => (
          <span
            key={i}
            className={cn(
              "inline-flex items-center rounded-md border border-line bg-paper-raise px-1.5 py-1 font-mono text-[11px] font-medium text-ink",
              i === 1 && "border-l-2 border-dashed border-l-ember",
              i === 3 && "border-l-2 border-dashed border-l-ember",
              i === 4 && "border-l-2 border-dashed border-l-ember"
            )}
          >
            {t}
          </span>
        ))}
      </div>
    );
  }
  const cells: string[] = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      if (id === "data") cells.push("bg-ember");
      else if (id === "tensor") cells.push(r === 0 ? "bg-ember" : "bg-paper-deep");
      else cells.push(c === 0 ? "bg-ember" : c === 1 ? "bg-gold" : c === 2 ? "bg-forest" : "bg-ember/40");
    }
  }
  return (
    <div aria-hidden="true">
      <div
        className={cn(
          "grid grid-cols-4",
          id === "tensor" ? "gap-[3px]" : "gap-1"
        )}
      >
        {cells.map((cls, i) => (
          <span
            key={i}
            className={cn(
              "h-3.5 rounded-[3px]",
              cls,
              id === "tensor" && i > 0 && i < 4 && "border-l border-dashed border-paper-raise"
            )}
          />
        ))}
      </div>
      {id === "data" && (
        <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] font-medium text-ink-faint">
          <ArrowRight className="size-3 rotate-45 text-ember" aria-hidden="true" />
          ∑ gradients
        </div>
      )}
      {id === "pipeline" && (
        <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] font-medium text-ink-faint">
          <ArrowRight className="size-3 text-ember" aria-hidden="true" />
          layers 1–n
        </div>
      )}
    </div>
  );
}

/**
 * Ch.3 signature visual — 8×4 GPU grid whose cells re-tint to the parallelism
 * pattern of the hovered/tapped card (crossfade + 0.02s stagger), above the
 * interactive 4-card technique row (verbatim bodies).
 */
export default function GpuGrid() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Pattern>("data");

  return (
    <div>
      {/* Big grid */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[14px] border border-line bg-paper-raise/60 p-4 md:p-6"
      >
        <div className="grid grid-cols-8 gap-1.5 md:gap-2" role="img" aria-label={`Grid of 32 GPUs showing the ${active} parallelism pattern`}>
          {Array.from({ length: ROWS * COLS }, (_, i) => {
            const r = Math.floor(i / COLS);
            const c = i % COLS;
            const tint = tintFor(active, r, c);
            const cut = hasCut(active, r, c);
            return (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-[4px] border border-line bg-paper-raise md:rounded-md"
              >
                <motion.span
                  aria-hidden="true"
                  className={cn("absolute inset-0", tint || "bg-transparent")}
                  initial={false}
                  animate={{ opacity: tint ? 1 : 0 }}
                  transition={{ duration: reduced ? 0.15 : 0.4, delay: reduced ? 0 : i * 0.02 }}
                />
                {cut && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 border-l-2 border-dashed border-ember"
                    initial={false}
                    animate={{ opacity: 1 }}
                  />
                )}
                <span className="absolute inset-0 hidden items-center justify-center font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-ink-faint opacity-0 transition-opacity duration-150 group-hover:opacity-100 md:flex">
                  GPU
                </span>
              </div>
            );
          })}
        </div>

        {/* Per-pattern annotation under the grid */}
        <div className="mt-4 flex min-h-[32px] items-center justify-center">
          <AnimatePresence mode="wait">
            {active === "data" && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3 font-mono text-[12px] font-medium text-ink-soft"
              >
                <svg width="72" height="22" viewBox="0 0 72 22" fill="none" aria-hidden="true" className="text-line-strong">
                  <path d="M6 2 L34 18 M36 2 L36 18 M66 2 L38 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="rounded-md border border-line bg-paper-raise px-2 py-1">∑ gradients</span>
              </motion.div>
            )}
            {active === "pipeline" && (
              <motion.div
                key="pipeline"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2 font-mono text-[12px] font-medium text-ink-soft"
              >
                <ArrowRight className="size-4 text-ember" aria-hidden="true" />
                layers 1–n
              </motion.div>
            )}
            {active === "sequence" && (
              <motion.div
                key="sequence"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex flex-wrap items-center justify-center gap-1.5"
              >
                {["The", " robot", " moved", " forward", "."].map((t, i) => (
                  <TokenChip key={i} leadingSpace={t.startsWith(" ")} className="!text-[12px]">
                    {t.trim()}
                  </TokenChip>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Technique cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
        {TECHNIQUES.map((t, i) => (
          <motion.button
            key={t.id}
            type="button"
            onMouseEnter={() => setActive(t.id)}
            onFocus={() => setActive(t.id)}
            onClick={() => setActive(t.id)}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
            className={cn(
              "flex flex-col rounded-[14px] border bg-paper-raise p-5 text-left transition-colors duration-200 hover:shadow-lift",
              active === t.id ? "border-ember" : "border-line"
            )}
            aria-pressed={active === t.id}
          >
            <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember">
              Technique {t.num}
            </span>
            <span className="mt-2 font-sans text-[19px] font-semibold leading-[1.3] text-ink">
              {t.title}
            </span>
            <span className="mt-2 text-[14.5px] leading-[1.65] text-ink-soft">{t.body}</span>
            <span className="mt-4 block">
              <MiniPattern id={t.id} />
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
