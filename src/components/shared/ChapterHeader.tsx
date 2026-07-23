import { cn } from "@/lib/utils";

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
  className,
}: ChapterHeaderProps) {
  return (
    <div className={cn("relative", className)}>
      <p className="kicker">{kicker}</p>

      <h2 className="mt-4 max-w-[780px] font-serif text-[31px] font-semibold leading-[1.16] tracking-[-0.015em] text-ink md:text-[42px]">
        {title}
      </h2>

      {lede && (
        <div className="mt-5 max-w-[680px] text-ink-soft">
          {lede}
        </div>
      )}

      <div className="relative mt-7 h-px w-full bg-line">
        <span className="absolute left-0 top-0 h-px w-12 bg-ember" />
      </div>
    </div>
  );
}
