import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import TokenChip from "@/components/shared/TokenChip";
import { cn } from "@/lib/utils";

const WORDS = ["Manufacturing", "robots", "are", "useful."];

const TOKENS: { label: string; leadingSpace: boolean }[] = [
  { label: "Manufact", leadingSpace: false },
  { label: "uring", leadingSpace: false },
  { label: "robots", leadingSpace: true },
  { label: "are", leadingSpace: true },
  { label: "useful", leadingSpace: true },
  { label: ".", leadingSpace: false },
];
const IDS = ["18241", "392", "7812", "527", "5505", "13"];

/** Mono-labeled arrow divider (TOKENIZE / LOOKUP). */
function ArrowDivider({ label }: { label: string }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3"
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-line" />
      <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ember">
        {label}
        <ChevronDown className="size-3.5" strokeWidth={2.5} />
      </span>
      <span className="h-px flex-1 bg-line" />
    </motion.div>
  );
}

/**
 * Step 3 signature interactive (segment-a spec): sentence → 6 tokens →
 * 6 IDs. Words light up left-to-right on entry; chips pop in with a back-
 * ease stagger; each token chip is linked to its ID chip by a thin
 * connector line and a hover pair-pulse. Replay button restarts the
 * stagger sequence.
 */
export default function TokenizationDemo() {
  const [round, setRound] = useState(0);
  const sentenceRef = useRef<HTMLParagraphElement>(null);
  const sentenceInView = useInView(sentenceRef, { once: true, margin: "-15% 0px" });

  const panelRef = useRef<HTMLDivElement>(null);
  const tokRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const idRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [links, setLinks] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  const measure = useCallback(() => {
    const box = panelRef.current?.getBoundingClientRect();
    if (!box) return;
    const next = TOKENS.map((_, i) => {
      const t = tokRefs.current[i]?.getBoundingClientRect();
      const d = idRefs.current[i]?.getBoundingClientRect();
      if (!t || !d) return null;
      return {
        x1: t.left - box.left + t.width / 2,
        y1: t.bottom - box.top,
        x2: d.left - box.left + d.width / 2,
        y2: d.top - box.top,
      };
    });
    if (next.every(Boolean)) setLinks(next as typeof links);
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
  }, [measure, round]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 rounded-[14px] border border-line bg-paper-raise p-6 md:p-8"
    >
      <div ref={panelRef} className="relative">
        {/* Token ↔ ID connector lines */}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full">
          {links.map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              strokeWidth={1}
              className="stroke-line-strong opacity-60"
            />
          ))}
        </svg>

        <motion.div
          key={round}
          initial="hidden"
          animate="show"
          className="relative z-10 space-y-6"
        >
          {/* Row 1 — source sentence, words light up left-to-right */}
          <p
            ref={sentenceRef}
            className="font-serif text-[20px] leading-[1.4] text-ink md:text-[24px]"
          >
            {WORDS.map((w, i) => (
              <span
                key={`${round}-${w}`}
                style={{ transitionDelay: `${i * 200}ms` }}
                className={cn(
                  "transition-colors duration-500",
                  sentenceInView ? "text-ink" : "text-ink-faint"
                )}
              >
                {w}
                {i < WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </p>

          <ArrowDivider label="TOKENIZE" />

          {/* Row 2 — 6 token chips */}
          <div className="flex flex-wrap items-center gap-2">
            {TOKENS.map((tok, i) => (
              <motion.span
                key={tok.label + i}
                ref={(el) => {
                  tokRefs.current[i] = el;
                }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  show: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.45, delay: 0.3 + i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
                className="inline-flex"
              >
                <TokenChip pairId={`tok-${i}`} leadingSpace={tok.leadingSpace}>
                  {tok.label}
                </TokenChip>
              </motion.span>
            ))}
          </div>

          <ArrowDivider label="LOOKUP" />

          {/* Row 3 — 6 ID chips */}
          <div className="flex flex-wrap items-center gap-2">
            {IDS.map((id, i) => (
              <motion.span
                key={id}
                ref={(el) => {
                  idRefs.current[i] = el;
                }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  show: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.45, delay: 0.9 + i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
                className="inline-flex"
              >
                <TokenChip variant="id" pairId={`tok-${i}`}>
                  {id}
                </TokenChip>
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={() => setRound((r) => r + 1)}
        className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ember underline decoration-ember/50 underline-offset-4 hover:decoration-ember"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Replay
      </button>
    </motion.div>
  );
}
