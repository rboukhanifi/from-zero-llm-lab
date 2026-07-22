import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type TokenChipVariant = "token" | "id" | "highlight" | "ghost";

export interface TokenChipProps {
  children: ReactNode;
  /**
   * token (default ink) · id (ember text on ember-tint) · highlight
   * (ember-tint bg + ember border) · ghost (dashed border, ink-faint —
   * for unknown/blank tokens).
   */
  variant?: TokenChipVariant;
  /**
   * Pairing key: chips sharing a pairId pulse each other on hover
   * (scale 1→1.06→1, 0.3s), e.g. a token chip ↔ its ID chip (§6.4).
   */
  pairId?: string;
  /** Show a visible ␣ glyph (ink-faint) before the label — for tokens
   *  with leading spaces. */
  leadingSpace?: boolean;
  className?: string;
}

const VARIANT_CLASSES: Record<TokenChipVariant, string> = {
  token: "border-line bg-paper-raise text-ink",
  id: "border-ember/40 bg-ember-tint text-ember tabular-nums",
  highlight: "border-ember bg-ember-tint text-ink",
  ghost: "border-dashed border-line-strong bg-transparent text-ink-faint",
};

/**
 * Inline mono token pill (design.md §6.4): paper-raise bg, 1px line border,
 * 6px/10px padding, 8px radius. Hover lifts 1px and darkens the border;
 * paired chips pulse each other via a lightweight DOM event bus.
 */
export default function TokenChip({
  children,
  variant = "token",
  pairId,
  leadingSpace = false,
  className,
}: TokenChipProps) {
  const selfId = useId();
  const [pulsing, setPulsing] = useState(false);
  const timer = useRef<number | null>(null);

  // Listen for partner hovers.
  useEffect(() => {
    if (!pairId) return;
    const onPairHover = (e: Event) => {
      const detail = (e as CustomEvent<{ pairId: string; self: string }>).detail;
      if (detail.pairId !== pairId || detail.self === selfId) return;
      setPulsing(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setPulsing(false), 300);
    };
    window.addEventListener("tokenchip:hover", onPairHover);
    return () => {
      window.removeEventListener("tokenchip:hover", onPairHover);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [pairId, selfId]);

  const announce = () => {
    if (!pairId) return;
    window.dispatchEvent(
      new CustomEvent("tokenchip:hover", { detail: { pairId, self: selfId } })
    );
  };

  return (
    <motion.span
      onHoverStart={announce}
      onFocus={announce}
      animate={pulsing ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -1 }}
      tabIndex={pairId ? 0 : undefined}
      className={cn(
        "inline-flex items-baseline gap-0.5 rounded-lg border px-2.5 py-1.5 font-mono text-[13px] font-medium leading-none transition-colors duration-200 hover:border-line-strong md:text-[14px]",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {leadingSpace && (
        <span aria-hidden="true" className="text-ink-faint">
          ␣
        </span>
      )}
      {children}
    </motion.span>
  );
}
