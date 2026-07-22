import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/components/SmoothScroll";

export const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Default editorial reveal (design.md §5): opacity 0→1, y 28→0, 0.7s. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Long-form body copy (design.md §3): Inter 400, 17.5px / 16px mobile. */
export function Body({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-[680px] text-[16px] leading-[1.75] text-ink-soft md:text-[17.5px] [&_strong]:font-semibold [&_strong]:text-ink",
        className
      )}
    >
      {children}
    </p>
  );
}

/** Sub-head H3 — Fraunces 600, 28px (segment spec). */
export function SubHead({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-serif text-[24px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink md:text-[28px]",
        className
      )}
    >
      {children}
    </h3>
  );
}

/** Sub-head H4 — Inter 600 19px, optionally with a Lucide icon chip. */
export function H4({
  children,
  icon: Icon,
  className,
}: {
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <h4
      className={cn(
        "flex items-center gap-3 text-[17px] font-semibold leading-[1.3] text-ink md:text-[19px]",
        className
      )}
    >
      {Icon && (
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-paper-raise text-ember">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      )}
      {children}
    </h4>
  );
}

/** Small inline term chip — mono, ember-tint wash (used inside copy). */
export function TermChip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline rounded-md border border-ember/40 bg-ember-tint px-1.5 py-0.5 align-baseline font-mono text-[0.82em] font-medium leading-none text-ember",
        className
      )}
    >
      {children}
    </span>
  );
}

/** Chapter-closing divider: chip flow + smooth-scroll arrow into the next
 *  chapter (design.md §5 anchors via Lenis). */
export function ArrowDivider({
  target,
  label,
  className,
}: {
  target: string;
  label: string;
  className?: string;
}) {
  const { scrollTo } = useSmoothScroll();
  return (
    <Reveal
      className={cn(
        "mt-16 flex flex-col items-center gap-4 border-t border-line pt-10 md:mt-20",
        className
      )}
    >
      <button
        type="button"
        onClick={() => scrollTo(target)}
        className="group inline-flex items-center gap-3 rounded-full border border-line bg-paper-raise px-5 py-2.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-soft transition-colors duration-200 hover:border-ember hover:text-ember"
      >
        {label}
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ember text-paper transition-transform duration-300 group-hover:translate-y-0.5">
          <ArrowDown className="size-3.5" aria-hidden="true" />
        </span>
      </button>
    </Reveal>
  );
}
