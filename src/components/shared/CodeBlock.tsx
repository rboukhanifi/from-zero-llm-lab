import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as [number, number, number, number];

export interface CodeBlockProps {
  /** Raw code text. Lines stagger-fade the first time the block enters view.
   *  For manual syntax coloring use `children` instead. */
  code?: string;
  /** Pre-colored content (spans using text-code-ember / text-code-forest /
   *  text-code-dim). Takes precedence over `code`. */
  children?: ReactNode;
  /** Optional header tab: filename/label (mono 11px, code-dim) with three
   *  decorative 8px dots on the right. */
  label?: string;
  className?: string;
}

/**
 * Dark warm code panel (design.md §6.6): code-bg background, code-text
 * text, 12px radius, 20px padding, mono 15px. Horizontal scroll on
 * overflow; no line numbers. Block rises 24px + fades in (0.7s); internal
 * lines stagger-fade (0.05s) only on first entry.
 */
export default function CodeBlock({
  code,
  children,
  label,
  className,
}: CodeBlockProps) {
  const lines = useMemo(() => (code !== undefined ? code.split("\n") : null), [code]);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
      className={cn(
        "overflow-hidden rounded-xl bg-code-bg text-code-text",
        className
      )}
    >
      {label && (
        <figcaption className="flex items-center justify-between border-b border-code-text/10 px-5 py-3">
          <span className="font-mono text-[11px] font-medium tracking-[0.08em] text-code-dim">
            {label}
          </span>
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-line-strong/60" />
            <span className="h-2 w-2 rounded-full bg-line-strong/60" />
            <span className="h-2 w-2 rounded-full bg-line-strong/60" />
          </span>
        </figcaption>
      )}
      <pre className="overflow-x-auto p-5 font-mono text-[13.5px] leading-[1.65] md:text-[15px]">
        <code>
          {children !== undefined
            ? children
            : lines?.map((line, i) => (
                <motion.span
                  key={i}
                  className="block min-h-[1.65em] whitespace-pre"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                >
                  {line === "" ? " " : line}
                </motion.span>
              ))}
        </code>
      </pre>
    </motion.figure>
  );
}
