import { useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Filter,
  Hand,
  Minimize2,
  MoveRight,
  Ruler,
  Square,
  Thermometer,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import ChapterHeader from "@/components/shared/ChapterHeader";
import ProbBar from "@/components/shared/ProbBar";
import TokenChip from "@/components/shared/TokenChip";
import { cn } from "@/lib/utils";
import { ArrowDivider, Body, EASE_OUT, Reveal, SubHead } from "./bits";
import AutoregressiveDemo from "./AutoregressiveDemo";

/* ------------------------------------------------------------------ */
/* 8.1 — stop conditions                                               */
/* ------------------------------------------------------------------ */

const STOP_CONDITIONS: { icon: LucideIcon; label: string; text: string }[] = [
  { icon: Square, label: "END TOKEN", text: "an end token is produced" },
  { icon: Ruler, label: "LENGTH LIMIT", text: "a length limit is reached" },
  { icon: Hand, label: "HARNESS STOP", text: "the harness stops generation" },
  { icon: Wrench, label: "TOOL CALL", text: "a tool call is requested" },
];

/* ------------------------------------------------------------------ */
/* 8.2 — sampling control cards                                        */
/* ------------------------------------------------------------------ */

function ControlCard({
  icon: Icon,
  title,
  body,
  index,
  children,
  className,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay: index * 0.1 }}
      className={cn(
        "group rounded-[14px] border border-line bg-paper-raise p-5 md:p-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-paper-deep text-ember">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h4 className="text-[17px] font-semibold text-ink md:text-[18px]">{title}</h4>
      </div>
      <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft">{body}</p>
      <div className="mt-5">{children}</div>
    </motion.div>
  );
}

const TOKEN_POOL = [" inspect", " grasp", " move", " weld", " stop", " retry"];

function TemperatureVisual() {
  const [temp, setTemp] = useState(0.2);
  const low = temp <= 0.4;
  const bucket = Math.round(temp * 5);
  const samples = Array.from({ length: 5 }, (_, i) =>
    low ? " inspect" : TOKEN_POOL[(bucket * 3 + i * 5) % TOKEN_POOL.length]
  );

  return (
    <div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-11 font-mono text-[11px] font-medium tracking-[0.12em] text-ink-faint">
            LOW
          </span>
          <span className="rounded-md border border-forest/50 bg-forest-tint px-2 py-1 text-[12.5px] font-medium text-forest">
            more deterministic
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-11 font-mono text-[11px] font-medium tracking-[0.12em] text-ink-faint">
            HIGH
          </span>
          <span className="rounded-md border border-ember/50 bg-ember-tint px-2 py-1 text-[12.5px] font-medium text-ember">
            more varied
          </span>
        </div>
      </div>
      <div className="mt-5">
        <label
          htmlFor="temperature-slider"
          className="flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint"
        >
          temperature
          <span className="text-ember tabular-nums">{temp.toFixed(1)}</span>
        </label>
        <input
          id="temperature-slider"
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={temp}
          onChange={(e) => setTemp(Number(e.target.value))}
          className="mt-2 w-full accent-ember"
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {samples.map((s, i) => (
            <TokenChip key={`${s}-${i}`} variant={s === " inspect" ? "highlight" : "ghost"}>
              {s}
            </TokenChip>
          ))}
        </div>
        <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
          illustrative — 5 sample draws
        </p>
      </div>
    </div>
  );
}

const TOP_P_BARS = [
  { label: "inspect", value: 40 },
  { label: "grasp", value: 25 },
  { label: "move", value: 15 },
  { label: "weld", value: 8 },
  { label: "stop", value: 6 },
  { label: "retry", value: 6 },
];

function TopPVisual() {
  return (
    <div className="space-y-2">
      {TOP_P_BARS.slice(0, 3).map((b, i) => (
        <ProbBar
          key={b.label}
          label={b.label}
          value={b.value}
          variant={i === 0 ? "winner" : "default"}
          index={i}
          showFootnote={i === 0}
        />
      ))}
      {/* Cutoff line */}
      <div className="flex items-center gap-2 py-0.5" aria-hidden="true">
        <span className="h-px flex-1 border-t border-dashed border-ember/60" />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ember">
          cutoff
        </span>
        <span className="h-px flex-1 border-t border-dashed border-ember/60" />
      </div>
      <div className="space-y-2 opacity-20 transition-opacity duration-300 md:opacity-100 md:group-hover:opacity-20">
        {TOP_P_BARS.slice(3).map((b, i) => (
          <ProbBar key={b.label} label={b.label} value={b.value} index={i + 3} />
        ))}
      </div>
      <p className="pt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
        tokens below the cutoff are dropped
      </p>
    </div>
  );
}

function KVCacheVisual() {
  const cached = [" The", " robot", " should", " first"];
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {cached.map((t) => (
          <TokenChip key={t}>
            {t}
            <span className="ml-1.5 rounded border border-forest/40 bg-forest-tint px-1 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-forest">
              cached
            </span>
          </TokenChip>
        ))}
        <TokenChip variant="highlight"> inspect</TokenChip>
      </div>
      <p className="mt-3 font-mono text-[11px] tracking-[0.06em] text-ink-faint">
        recomputed: <span className="text-ember">just this one</span>
      </p>
    </div>
  );
}

function QuantizationVisual() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="font-mono text-[11px] font-bold tracking-[0.12em] text-ink-soft">
            FP32
          </p>
          <div className="mt-1.5 grid w-[104px] grid-cols-8 gap-[3px]">
            {Array.from({ length: 32 }).map((_, i) => (
              <span key={i} className="h-3 rounded-[2px] bg-line-strong" />
            ))}
          </div>
        </div>
        <MoveRight className="size-5 shrink-0 text-ember" aria-hidden="true" />
        <div>
          <p className="font-mono text-[11px] font-bold tracking-[0.12em] text-ember">
            INT8
          </p>
          <div className="mt-1.5 grid w-[104px] grid-cols-8 gap-[3px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="h-3 rounded-[2px] bg-ember" />
            ))}
          </div>
        </div>
        <span className="rounded-md border border-gold/50 bg-gold-tint px-2 py-1 font-mono text-[10.5px] font-medium text-gold">
          small quality trade-off
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter 8                                                           */
/* ------------------------------------------------------------------ */

export default function Chapter8() {
  return (
    <section id="chapter-08" className="border-t border-line bg-paper-deep">
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
        <ChapterHeader
          kicker="CHAPTER 08"
          title="Inference: using the trained model"
          number="08"
          lede={<p>Once trained, the model generates text autoregressively.</p>}
        />
      </div>

      {/* 8.1 Pinned autoregressive walkthrough (wide) */}
      <div className="mx-auto max-w-[1200px] px-2 md:px-6">
        <div className="rounded-[14px] border border-line bg-paper-raise">
          <AutoregressiveDemo />
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 pb-[72px] md:px-10 md:pb-[120px]">
        <Reveal className="mt-12">
          <Body>This continues until:</Body>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STOP_CONDITIONS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.08 }}
              className="group rounded-[14px] border border-line bg-paper-raise p-5"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-paper-deep text-ink-soft transition-colors duration-200 group-hover:border-ember group-hover:bg-ember group-hover:text-paper">
                <s.icon className="size-4" aria-hidden="true" />
              </span>
              <p className="mt-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
                {s.label}
              </p>
              <p className="mt-2 text-[15px] leading-[1.6] text-ink">{s.text}</p>
            </motion.div>
          ))}
        </div>

        {/* 8.2 Sampling controls */}
        <div className="mt-16 md:mt-20">
          <Reveal>
            <SubHead>Sampling controls</SubHead>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <ControlCard
              icon={Thermometer}
              title="Temperature"
              body="Controls randomness."
              index={0}
            >
              <TemperatureVisual />
            </ControlCard>
            <ControlCard
              icon={Filter}
              title="Top-p or top-k"
              body="Restricts generation to sufficiently likely tokens."
              index={1}
            >
              <TopPVisual />
            </ControlCard>
            <ControlCard
              icon={Database}
              title="KV cache"
              body="Stores previous attention computations so the model does not recompute the entire sequence for every new token."
              index={2}
            >
              <KVCacheVisual />
            </ControlCard>
            <ControlCard
              icon={Minimize2}
              title="Quantization"
              body="Stores weights using fewer bits to reduce memory and increase speed, sometimes with a small quality reduction."
              index={3}
            >
              <QuantizationVisual />
            </ControlCard>
          </div>
        </div>

        {/* Chapter-closing pull line */}
        <Reveal className="mt-16 rounded-[14px] border border-line bg-paper-raise px-6 py-10 text-center md:mt-20 md:py-14">
          <p className="mx-auto max-w-[720px] font-serif text-[23px] font-medium italic leading-[1.3] tracking-[-0.01em] text-ink md:text-[30px]">
            Training is the labor. Inference is the voice.
          </p>
        </Reveal>

        <ArrowDivider target="#chapter-09" label="Chapter 09 — The major categories of ML" />
      </div>
    </section>
  );
}
