import { useCallback, useEffect, useRef, useState } from "react";
import TokenChip from "@/components/shared/TokenChip";
import { SEQ_TOKENS } from "@/sections/a/seqTokens";
import { cn } from "@/lib/utils";

interface Pt {
  x: number;
  y: number;
}

const PAIRS: [number, number][] = [];
for (let i = 0; i < SEQ_TOKENS.length; i++) {
  for (let j = i + 1; j < SEQ_TOKENS.length; j++) PAIRS.push([i, j]);
}

/**
 * Stop 6 card visual (segment-a spec): the same 6-chip row, but every chip
 * has straight connector lines to every other chip (full mesh, line-strong
 * at 40%). Hovering/focusing a chip turns its connectors ember while the
 * rest dim to 15% — "examine other tokens", interactive.
 */
export default function AttentionMesh() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [centers, setCenters] = useState<Pt[]>([]);
  const [hot, setHot] = useState<number | null>(null);

  const measure = useCallback(() => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;
    setCenters(
      chipRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
      })
    );
  }, []);

  useEffect(() => {
    measure();
    const t = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      window.cancelAnimationFrame(t);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div className="mt-4">
      <div ref={containerRef} className="relative">
        {/* Full-mesh connectors behind the chips */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        >
          {centers.length === SEQ_TOKENS.length &&
            PAIRS.map(([a, b]) => {
              const active = hot !== null && (a === hot || b === hot);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={centers[a].x}
                  y1={centers[a].y}
                  x2={centers[b].x}
                  y2={centers[b].y}
                  strokeWidth={active ? 1.75 : 1.25}
                  strokeLinecap="round"
                  className={cn(
                    "transition-all duration-200",
                    active ? "stroke-ember opacity-90" : "stroke-line-strong",
                    hot === null ? "opacity-40" : active ? "opacity-90" : "opacity-15"
                  )}
                />
              );
            })}
        </svg>
        <div className="relative z-10 flex flex-wrap items-center gap-x-2 gap-y-3">
          {SEQ_TOKENS.map((tok, i) => (
            <span
              key={i}
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              className="inline-flex cursor-default"
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => setHot(i)}
              onBlur={() => setHot(null)}
              tabIndex={0}
              aria-label={`Token ${tok.label}: attends to every other token`}
            >
              <TokenChip
                variant={tok.ghost ? "ghost" : "token"}
                leadingSpace={tok.leadingSpace}
              >
                {tok.label}
              </TokenChip>
            </span>
          ))}
        </div>
      </div>
      <p
        className="mt-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint"
      >
        Attention — every token examines every other token
      </p>
    </div>
  );
}
