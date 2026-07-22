import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import TokenChip from "@/components/shared/TokenChip";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const INPUT = ["The", " robot", " moved", " forward"];
const TARGET = [" robot", " moved", " forward", "."];

function Chip({ label, variant }: { label: string; variant?: "token" | "highlight" | "ghost" }) {
  const leading = label.startsWith(" ");
  return (
    <TokenChip variant={variant ?? "token"} leadingSpace={leading}>
      {leading ? label.slice(1) : label}
    </TokenChip>
  );
}

/**
 * Step 6 — shifted input/target demo (segment-b spec): the TARGET row is the
 * same chip set shifted one position left. The dropped first chip ("The")
 * rests faded in the left margin lane; the gained last chip (".") highlights
 * ember. On scroll entry (30% viewport) the TARGET row slides left by one
 * chip-width (0.8s ease-in-out), then curved arrows draw from each input chip
 * to its target chip below (stroke draw 0.5s, stagger 0.1s).
 */
export default function ShiftDemo() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const targetRowRef = useRef<HTMLDivElement>(null);
  const inputChipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const targetChipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [dx, setDx] = useState(0);
  const [arrows, setArrows] = useState<{ x1: number; x2: number }[]>([]);
  const started = useInView(wrapRef, { once: true, margin: "-30% 0px" });
  const startedRef = useRef(false);
  useEffect(() => {
    startedRef.current = started;
  }, [started]);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const row = targetRowRef.current;
    if (!wrap || !row) return;
    // Width of one chip slot = dropped ghost chip + flex gap.
    const ghost = row.children[0] as HTMLElement | undefined;
    if (!ghost) return;
    const gap = parseFloat(getComputedStyle(row).columnGap || "8") || 8;
    const shift = ghost.offsetWidth + gap;
    setDx(shift);

    const wrapRect = wrap.getBoundingClientRect();
    const next: { x1: number; x2: number }[] = [];
    for (let i = 0; i < INPUT.length; i++) {
      const inEl = inputChipRefs.current[i];
      const tgEl = targetChipRefs.current[i];
      if (!inEl || !tgEl) continue;
      const inR = inEl.getBoundingClientRect();
      const tgR = tgEl.getBoundingClientRect();
      next.push({
        x1: inR.left - wrapRect.left + inR.width / 2,
        // Rest position of the target chip is `shift` px left of its
        // pre-shift layout spot (already applied once the row has slid).
        x2: tgR.left - wrapRect.left + tgR.width / 2 - (startedRef.current ? 0 : shift),
      });
    }
    setArrows(next);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const shifted = reduced || started;

  return (
    <div className="overflow-hidden rounded-[14px] border border-line bg-paper-raise p-5 md:p-8">
      {/* Left margin lane (pl-20) holds the dropped "The" after the shift. */}
      <div ref={wrapRef} className="relative pl-16 md:pl-20">
        {/* INPUT row */}
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          Input
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {INPUT.map((t, i) => (
            <span
              key={`in-${i}`}
              ref={(el) => {
                inputChipRefs.current[i] = el;
              }}
              className="inline-flex"
            >
              <Chip label={t} />
            </span>
          ))}
        </div>

        {/* Curved arrows: input chip → its target chip below */}
        <svg
          aria-hidden="true"
          className="my-1 block h-12 w-full overflow-visible"
          fill="none"
        >
          {arrows.map((a, i) => (
            <motion.path
              key={i}
              d={`M ${a.x1} 4 C ${a.x1} 26, ${a.x2} 22, ${a.x2} 42`}
              className="stroke-line-strong"
              strokeWidth={1.5}
              strokeLinecap="round"
              initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
              animate={
                shifted
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                pathLength: {
                  duration: reduced ? 0 : 0.5,
                  delay: reduced ? 0 : 0.9 + i * 0.1,
                  ease: "easeInOut",
                },
                opacity: { duration: 0.2, delay: reduced ? 0 : 0.9 + i * 0.1 },
              }}
            />
          ))}
        </svg>

        {/* TARGET row — slides left by one chip-width on entry */}
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          Target
        </p>
        <motion.div
          ref={targetRowRef}
          className="mt-2 flex items-center gap-2"
          initial={false}
          animate={{ x: shifted ? -dx : 0 }}
          transition={{ duration: reduced ? 0 : 0.8, ease: "easeInOut" }}
        >
          <TokenChip variant="ghost" className="opacity-70">
            The
          </TokenChip>
          {TARGET.map((t, i) => (
            <span
              key={`tg-${i}`}
              ref={(el) => {
                targetChipRefs.current[i] = el;
              }}
              className="inline-flex"
            >
              <Chip label={t} variant={i === TARGET.length - 1 ? "highlight" : "token"} />
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
