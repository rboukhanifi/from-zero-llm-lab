import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, ChevronRight, X } from "lucide-react";
import ChapterHeader from "@/components/shared/ChapterHeader";
import Callout from "@/components/shared/Callout";
import TokenChip from "@/components/shared/TokenChip";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";
import { ArrowDivider, Body, EASE_OUT, Reveal, SubHead, TermChip } from "./bits";

/* ------------------------------------------------------------------ */
/* 5.1 — mini-demo: ghost completions that type on letter-by-letter    */
/* ------------------------------------------------------------------ */

function TypedChip({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [shown, setShown] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) {
      setShown(text.length);
      return;
    }
    if (!inView) return;
    let i = 0;
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setShown(i);
        if (i >= text.length && interval) window.clearInterval(interval);
      }, 30);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [inView, text, delay, reduced]);

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex min-h-[32px] items-center rounded-lg border border-dashed px-2.5 py-1.5 font-mono text-[13px] font-medium leading-none md:text-[14px]",
        className
      )}
    >
      {text.slice(0, shown)}
      {shown < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-caret-blink bg-current" />
      )}
    </span>
  );
}

function CompletionDemo() {
  return (
    <Reveal className="mt-8 max-w-[680px] rounded-[14px] border border-line bg-paper-raise p-5 md:p-6">
      <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        Base model behavior
      </p>
      <div className="mt-5 space-y-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] text-ink md:text-[14px]">
              The Eiffel Tower is located in
            </span>
            <TypedChip
              text="Paris"
              className="border-forest/50 bg-forest-tint text-forest"
            />
          </div>
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-forest">
            <Check className="size-3.5" aria-hidden="true" /> Completes text
          </p>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] text-ink md:text-[14px]">
              Please summarize this for me
            </span>
            <TypedChip
              text="...more text?"
              delay={500}
              className="border-gold/60 bg-gold-tint text-gold"
            />
          </div>
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-gold">
            <X className="size-3.5" aria-hidden="true" /> Follows instructions
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* 5.3 — ranking podium: A/B/C side by side → B > A > C stacked        */
/* ------------------------------------------------------------------ */

const RANK_CARDS = [
  { id: "A", label: "ANSWER A", medal: "2", medalClass: "border-gold/60 bg-gold-tint text-gold" },
  { id: "B", label: "ANSWER B", medal: "1", medalClass: "border-forest/60 bg-forest-tint text-forest" },
  { id: "C", label: "ANSWER C", medal: "3", medalClass: "border-line bg-paper-deep text-ink-faint" },
] as const;

function RankingStack() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px" });
  const stacked = reduced || inView;

  const order = stacked
    ? [RANK_CARDS[1], RANK_CARDS[0], RANK_CARDS[2]]
    : [RANK_CARDS[0], RANK_CARDS[1], RANK_CARDS[2]];

  return (
    <div ref={ref} className="mt-8">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        {/* Cards: side by side → podium stack (layout-tweened) */}
        <div
          className={cn(
            "flex gap-4",
            stacked ? "max-w-[420px] flex-col" : "flex-col sm:flex-row"
          )}
        >
          {order.map((card, i) => (
            <motion.div
              key={card.id}
              layout="position"
              transition={{ type: "spring", stiffness: 180, damping: 18, delay: reduced ? 0 : i * 0.1 }}
              className={cn(
                "flex-1 rounded-[14px] border bg-paper-raise p-4",
                stacked && i === 0
                  ? "border-forest/50 shadow-lift"
                  : "border-line"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-soft">
                  {card.label}
                </span>
                {stacked && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: reduced ? 0 : 0.5 + i * 0.1, duration: 0.3 }}
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full border font-mono text-[11px] font-bold",
                      card.medalClass
                    )}
                  >
                    {card.medal}
                  </motion.span>
                )}
              </div>
              <div className="mt-3 space-y-2" aria-hidden="true">
                <div className="h-2 w-11/12 rounded-full bg-line" />
                <div className="h-2 w-3/4 rounded-full bg-line" />
                <div className="h-2 w-1/2 rounded-full bg-line" />
              </div>
            </motion.div>
          ))}
        </div>
        {/* Ranking expression draws in after the stack settles */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={stacked ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: reduced ? 0 : 0.9 }}
          className="self-center whitespace-nowrap font-mono text-[15px] font-bold tracking-tight text-ember md:text-[20px]"
        >
          Answer B &gt; Answer A &gt; Answer C
        </motion.p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter 5                                                           */
/* ------------------------------------------------------------------ */

const RAIL = [
  { id: "ch5-pre", label: "01 PRETRAINING" },
  { id: "ch5-sft", label: "02 SUPERVISED FINE-TUNING" },
  { id: "ch5-pref", label: "03 PREFERENCE TRAINING" },
];

const LEARNED = [
  "grammar",
  "facts",
  "code structure",
  "styles of writing",
  "common reasoning patterns",
  "relationships between concepts",
];

const SFT_ALIASES = ["supervised fine-tuning", "SFT", "instruction tuning"];

const METHODS = ["reward modeling", "DPO", "IPO", "other preference-optimization methods"];

export default function Chapter5() {
  const active = useScrollSpy(RAIL.map((r) => r.id));
  const { scrollTo } = useSmoothScroll();

  return (
    <section id="chapter-05" className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[1200px] px-6 py-[72px] md:px-10 md:py-[120px]">
        <ChapterHeader
          kicker="CHAPTER 05"
          title="Pretraining versus post-training"
          number="05"
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14">
          {/* Left-edge breadcrumb rail (desktop) */}
          <div className="relative hidden lg:block">
            <nav
              aria-label="Chapter 5 stages"
              className="sticky top-[120px] border-l border-line pl-4"
            >
              {RAIL.map((r) => (
                <a
                  key={r.id}
                  href={`#${r.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(`#${r.id}`);
                  }}
                  className={cn(
                    "block py-2 font-mono text-[11px] font-medium uppercase leading-[1.5] tracking-[0.12em] transition-colors duration-200",
                    active === r.id ? "text-ember" : "text-ink-faint hover:text-ink-soft"
                  )}
                >
                  <span
                    className={cn(
                      "mr-2 inline-block text-[7px] transition-colors",
                      active === r.id ? "text-ember" : "text-line-strong"
                    )}
                  >
                    ■
                  </span>
                  {r.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            {/* 5.1 Pretraining */}
            <div id="ch5-pre" className="scroll-mt-28">
              <Reveal>
                <SubHead>Pretraining</SubHead>
              </Reveal>
              <Reveal className="mt-5">
                <Body>
                  Pretraining teaches the model general knowledge and language
                  patterns through next-token prediction. It learns things such as:
                </Body>
              </Reveal>
              <div className="mt-6 grid max-w-[680px] grid-cols-2 gap-3 sm:grid-cols-3">
                {LEARNED.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.06 }}
                    className="relative overflow-hidden rounded-[14px] border border-line bg-paper-raise px-4 py-3.5"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-[3px] bg-forest"
                    />
                    <span className="text-[14.5px] font-medium leading-[1.4] text-ink">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
              <Callout variant="note" kicker="NOTE" className="mt-8 max-w-[680px]">
                A pretrained model is often called a <TermChip>base model</TermChip>.
              </Callout>
              <Reveal className="mt-8">
                <Body>
                  It may complete text well but may not follow instructions reliably.
                </Body>
              </Reveal>
              <CompletionDemo />
            </div>

            {/* 5.2 Supervised fine-tuning */}
            <div id="ch5-sft" className="mt-16 scroll-mt-28 md:mt-24">
              <Reveal>
                <SubHead>Supervised fine-tuning</SubHead>
              </Reveal>
              <Reveal className="mt-5">
                <Body>Humans or stronger models create examples:</Body>
              </Reveal>

              {/* Dialogue card */}
              <Reveal className="mt-6 max-w-[720px] overflow-hidden rounded-[14px] border border-line bg-paper-raise">
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ type: "spring", stiffness: 160, damping: 20 }}
                  className="flex gap-4 border-b border-line p-5 md:p-6"
                >
                  <span className="mt-0.5 inline-flex h-fit shrink-0 items-center rounded-md border border-line-strong bg-paper-deep px-2 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink">
                    User
                  </span>
                  <p className="text-[15.5px] leading-[1.7] text-ink">
                    Explain gravity simply.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.15 }}
                  className="flex gap-4 p-5 md:p-6"
                >
                  <span className="mt-0.5 inline-flex h-fit shrink-0 items-center rounded-md border border-ember/40 bg-ember-tint px-2 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-ember">
                    Assistant
                  </span>
                  <p className="text-[15.5px] leading-[1.7] text-ink-soft">
                    Gravity is the attraction between objects with mass…
                  </p>
                </motion.div>
              </Reveal>

              <Reveal className="mt-8">
                <Body>
                  The model is trained to imitate the desired answer. This is called:
                </Body>
              </Reveal>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {SFT_ALIASES.map((alias, i) => (
                  <motion.span
                    key={alias}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.08 }}
                    className="rounded-lg border border-ember/40 bg-ember-tint px-3 py-1.5 font-serif text-[15px] italic text-ink"
                  >
                    {alias}
                  </motion.span>
                ))}
              </div>
              <Reveal className="mt-8">
                <Body>
                  SFT teaches the model the expected interaction format.
                </Body>
              </Reveal>
            </div>

            {/* 5.3 Preference training */}
            <div id="ch5-pref" className="mt-16 scroll-mt-28 md:mt-24">
              <Reveal>
                <SubHead>Preference training</SubHead>
              </Reveal>
              <Reveal className="mt-5">
                <Body>
                  For one prompt, several answers are generated. A human or another
                  model ranks them:
                </Body>
              </Reveal>
              <RankingStack />
              <Reveal className="mt-10">
                <Body>
                  The system learns which responses are preferred. Methods include:
                </Body>
              </Reveal>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {METHODS.map((m, i) => (
                  <motion.span
                    key={m}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.07 }}
                  >
                    <TokenChip variant="highlight">{m}</TokenChip>
                  </motion.span>
                ))}
              </div>
              <Callout variant="insight" kicker="KEY IDEA" className="mt-8 max-w-[680px]">
                Preference training can improve <TermChip>helpfulness</TermChip>,{" "}
                <TermChip>tone</TermChip>, <TermChip>instruction following</TermChip>,
                and <TermChip>safety</TermChip>.
              </Callout>
            </div>

            {/* Chapter-closing divider: flow row, all stages lit ember */}
            <Reveal className="mt-16 flex flex-wrap items-center gap-2 md:mt-20">
              {["PRETRAIN", "SFT", "PREFERENCE"].map((stage, i) => (
                <span key={stage} className="flex items-center gap-2">
                  {i > 0 && (
                    <ChevronRight className="size-4 text-ember" aria-hidden="true" />
                  )}
                  <span className="rounded-lg border border-ember bg-ember-tint px-2.5 py-1.5 font-mono text-[12px] font-medium tracking-[0.08em] text-ember">
                    {stage}
                  </span>
                </span>
              ))}
            </Reveal>
            <ArrowDivider target="#chapter-06" label="Chapter 06 — Reinforcement learning" />
          </div>
        </div>
      </div>
    </section>
  );
}
