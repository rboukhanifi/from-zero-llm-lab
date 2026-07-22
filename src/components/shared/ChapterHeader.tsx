import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];

export interface ChapterHeaderProps {
  /** Kicker text after the ember square, e.g. "CHAPTER 03" (auto-uppercased). */
  kicker: string;
  /** Chapter title (H2, Fraunces 600). Word-split masked reveal on entry. */
  title: string;
  /** Optional lede paragraph (body, ink-soft, 480–680px). */
  lede?: React.ReactNode;
  /** Optional giant outline numeral (e.g. "03"), top-right, parallax −40px. */
  number?: string;
  className?: string;
}

/**
 * Chapter header block (design.md §6.1): kicker row → H2 serif title →
 * optional lede → 1px hairline with a 48px ember segment at its left end.
 * Optional decorative outline numeral drifts −40px over scroll (GSAP scrub).
 */
export default function ChapterHeader({
  kicker,
  title,
  lede,
  number,
  className,
}: ChapterHeaderProps) {
  const words = title.split(" ");

  return (
    <div className={cn("relative", className)}>
      {number && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-0 select-none font-serif text-[72px] font-bold leading-none text-transparent md:text-[140px]"
          style={{ WebkitTextStroke: "1px #CBBFA8" }}
        >
          {number}
        </span>
      )}

      {/* Kicker — letter-fade in */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.4 }}
        className="kicker"
      >
        {kicker}
      </motion.p>

      {/* Title — word-split masked rise */}
      <h2 className="mt-4 font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-[52px]">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-[0.08em] align-bottom"
          >
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.8,
                delay: i * 0.06,
                ease: EASE_OUT_EXPO,
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </h2>

      {lede && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE_OUT_EXPO }}
          className="mt-5 max-w-[680px] text-ink-soft"
        >
          {lede}
        </motion.div>
      )}

      {/* Hairline with 48px ember segment at left — scaleX from left */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT_EXPO }}
        className="relative mt-8 h-px w-full origin-left bg-line"
      >
        <span className="absolute left-0 top-0 h-px w-12 bg-ember" />
      </motion.div>
    </div>
  );
}
