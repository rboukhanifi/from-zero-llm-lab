import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DefCardProps {
  /** Glossary term (Fraunces 600, 20px). */
  term: string;
  /** Optional mono alias tag, e.g. an abbreviation or notation. */
  alias?: string;
  /** Definition (body 15px, ink-soft). */
  children: ReactNode;
  /** Optional example line (mono 13px, ember-deep). */
  example?: string;
  className?: string;
}

/**
 * Flat glossary entry separated by a quiet rule.
 */
export default function DefCard({
  term,
  alias,
  children,
  example,
  className,
}: DefCardProps) {
  return (
    <article
      className={cn(
        "border-b border-line py-5",
        className
      )}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <h4 className="font-serif text-[20px] font-semibold leading-[1.3] text-ink">
          {term}
        </h4>
        {alias && (
          <span className="rounded-md border border-line bg-paper-deep px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink-soft">
            {alias}
          </span>
        )}
      </div>
      <p className="mt-2 text-[15px] leading-[1.7] text-ink-soft">{children}</p>
      {example && (
        <p className="mt-3 font-mono text-[13px] leading-[1.5] text-ember-deep">
          {example}
        </p>
      )}
    </article>
  );
}
