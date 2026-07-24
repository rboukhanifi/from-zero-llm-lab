import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutVariant = "insight" | "success" | "correct" | "warning" | "note";

export interface CalloutProps {
  variant?: CalloutVariant;
  kicker?: string;
  icon?: LucideIcon | null;
  children: ReactNode;
  className?: string;
}

/**
 * Textbook note: a label, a fine rule, and supporting text.
 */
export default function Callout({
  kicker,
  children,
  className,
}: CalloutProps) {
  return (
    <aside className={cn("border-l-2 border-ink pl-5", className)}>
      {kicker && (
        <p className="mb-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink">
          {kicker}
        </p>
      )}
      <div className="text-[16px] leading-[1.7] text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </aside>
  );
}
