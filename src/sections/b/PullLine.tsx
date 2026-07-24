import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Chapter-closing pull line (design.md §3): Fraunces 500 italic, wide,
 * centered, framed by 1px line hairlines that scaleX in from the left.
 */
export function PullLine({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <figure
      className={cn("relative py-10 md:py-14", className)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-line"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-line"
      />
      <blockquote className="mx-auto max-w-[860px] px-2 text-center font-serif text-[23px] font-medium italic leading-[1.3] tracking-[-0.01em] text-ink md:text-[30px]">
        {children}
      </blockquote>
    </figure>
  );
}

/** Small centered arrow divider leading into the next chapter. */
export function ArrowDivider({ label, className }: { label?: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center justify-center gap-4 py-6 md:py-8", className)}
    >
      <span className="h-px w-16 bg-line md:w-24" />
      <span className="flex items-center gap-2">
        {label && (
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">
            {label}
          </span>
        )}
        <ChevronDown className="size-5 text-ember" strokeWidth={2} />
      </span>
      <span className="h-px w-16 bg-line md:w-24" />
    </div>
  );
}
