import { memo, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/** The five tokens the field resolves into (segment-a S0). */
const TOKENS = ["The", " robot", " moved", " forward", "."];

/** Deterministic PRNG so the scattered field is stable across renders. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Chip {
  x0: number; // base position, % of container
  y0: number;
  float: string; // random float label
  tokenIndex: number;
  slotJitterX: number; // px
  slotJitterY: number;
  threshold: number; // scroll progress at which this chip resolves
  driftAmpX: number;
  driftAmpY: number;
  driftPeriod: number; // seconds
  driftPhase: number;
}

function makeChips(count: number): Chip[] {
  const rand = mulberry32(42);
  const chips: Chip[] = [];
  for (let i = 0; i < count; i++) {
    const signed = rand() > 0.5 ? 1 : -1;
    chips.push({
      x0: 4 + rand() * 92,
      y0: 4 + rand() * 88,
      float: (signed * rand()).toFixed(4),
      tokenIndex: i % TOKENS.length,
      slotJitterX: (rand() - 0.5) * 56,
      slotJitterY: (rand() - 0.5) * 30,
      threshold: 0.05 + (i / count) * 0.75,
      driftAmpX: 6 + rand() * 14,
      driftAmpY: 6 + rand() * 14,
      driftPeriod: 6 + rand() * 4,
      driftPhase: rand() * Math.PI * 2,
    });
  }
  return chips;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => t * t * (3 - 2 * t);

/**
 * Hero ambient token field (segment-a S0): ~60 mono chips scattered across
 * the viewport showing random floats (ink-faint, 60% opacity), drifting
 * slowly. As the user scrolls the first 100vh (GSAP ScrollTrigger scrub,
 * start top top / end +=100%) the chips migrate toward a horizontal row
 * behind the pull line and resolve, one by one, into ember-tint token chips
 * ("The robot moved forward."). Meaning made visible: random numbers →
 * tokens → language. Reduced motion: static resolved token row.
 *
 * Isolated + memoized so the perpetual rAF loop never re-renders the hero.
 */
const TokenField = memo(function TokenField({
  heroRef,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floatRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tokenRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressRef = useRef(0);

  const [count, setCount] = useState(60);
  const chips = useMemo(() => makeChips(count), [count]);

  // Mobile reduces to 28 chips (performance guardrail).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setCount(mq.matches ? 28 : 60);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const hero = heroRef.current;
    const container = containerRef.current;
    if (!hero || !container) return;

    // Scroll progress across the first 100vh, scrubbed.
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "+=100%",
      scrub: 0.3,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    let raf = 0;
    const start = performance.now();
    const ROW_Y = 0.6; // slot row position (fraction of hero height) — behind the pull line
    const SPREAD = 0.13; // horizontal distance between token slots (fraction of width)

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const p = progressRef.current;

      for (let i = 0; i < chips.length; i++) {
        const chip = chips[i];
        const el = chipRefs.current[i];
        if (!el) continue;

        // Idle drift (±20px, 6–10s loops, randomized phase).
        const driftX =
          chip.driftAmpX * Math.sin((t / chip.driftPeriod) * Math.PI * 2 + chip.driftPhase);
        const driftY =
          chip.driftAmpY * Math.cos((t / chip.driftPeriod) * Math.PI * 2 + chip.driftPhase * 1.3);

        const baseX = (chip.x0 / 100) * cw + driftX * (1 - p);
        const baseY = (chip.y0 / 100) * ch + driftY * (1 - p);

        // Target slot on the resolved token row.
        const slotX =
          cw * 0.5 + (chip.tokenIndex - (TOKENS.length - 1) / 2) * cw * SPREAD + chip.slotJitterX;
        const slotY = ch * ROW_Y + chip.slotJitterY;

        const lp = easeInOut(clamp01((p - chip.threshold) / 0.18));
        const x = baseX + (slotX - baseX) * lp;
        const y = baseY + (slotY - baseY) * lp;

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

        // Cross-fade: random float → resolved token chip.
        const f = floatRefs.current[i];
        const tk = tokenRefs.current[i];
        if (f) f.style.opacity = (0.6 * (1 - lp)).toFixed(3);
        if (tk) {
          tk.style.opacity = lp.toFixed(3);
          tk.style.transform = `scale(${(0.9 + 0.1 * lp).toFixed(3)})`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      trigger.kill();
    };
  }, [chips, reduced, heroRef]);

  // Reduced motion: statically render the resolved token row.
  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[60%] z-0 flex -translate-y-1/2 justify-center gap-2"
      >
        {TOKENS.map((tok) => (
          <span
            key={tok}
            className="inline-flex items-baseline rounded-lg border border-ember bg-ember-tint px-2.5 py-1.5 font-mono text-[13px] font-medium leading-none text-ink md:text-[14px]"
          >
            {tok}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0"
      style={{ animation: "tokenfield-in 1.2s ease-out 0.1s forwards" }}
    >
      <style>{`@keyframes tokenfield-in { to { opacity: 1; } }`}</style>
      {chips.map((chip, i) => (
        <div
          key={i}
          ref={(el) => {
            chipRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 will-change-transform"
        >
          <span
            ref={(el) => {
              floatRefs.current[i] = el;
            }}
            className="inline-block font-mono text-[11px] tabular-nums text-ink-faint"
            style={{ opacity: 0.6 }}
          >
            {chip.float}
          </span>
          <span
            ref={(el) => {
              tokenRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-ember bg-ember-tint px-2.5 py-1.5 font-mono text-[12px] font-medium leading-none text-ink"
            style={{ opacity: 0 }}
          >
            {TOKENS[chip.tokenIndex]}
          </span>
        </div>
      ))}
    </div>
  );
});

export default TokenField;
