import type { ReactNode } from "react";
import { motion } from "framer-motion";
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
 * Glossary / vocab tile (design.md §6.10): paper-raise, 1px line border,
 * term + optional alias tag + definition + optional example line.
 * Hover lifts 2px with the soft shadow.
 */
export default function DefCard({
  term,
  alias,
  children,
  example,
  className,
}: DefCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-[14px] border border-line bg-paper-raise p-5 transition-shadow duration-200 hover:shadow-lift",
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
    </motion.article>
  );
}
