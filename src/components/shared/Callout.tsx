import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Flame, Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutVariant = "insight" | "success" | "correct" | "warning" | "note";

export interface CalloutProps {
  /**
   * insight = ember (Flame) · success/correct = forest (CheckCircle2) ·
   * warning = gold (AlertTriangle) · note = ink (Info).
   */
  variant?: CalloutVariant;
  /** Small mono kicker in the variant color, e.g. "WATCH OUT". */
  kicker?: string;
  /** Override the default Lucide icon, or pass null to hide it. */
  icon?: LucideIcon | null;
  children: ReactNode;
  className?: string;
}

const VARIANTS: Record<
  string,
  { bar: string; text: string; icon: LucideIcon }
> = {
  insight: { bar: "bg-ember", text: "text-ember", icon: Flame },
  success: { bar: "bg-forest", text: "text-forest", icon: CheckCircle2 },
  correct: { bar: "bg-forest", text: "text-forest", icon: CheckCircle2 },
  warning: { bar: "bg-gold", text: "text-gold", icon: AlertTriangle },
  note: { bar: "bg-ink-soft", text: "text-ink-soft", icon: Info },
};

/**
 * Left-accent callout card (design.md §6.7): paper-raise bg, 1px line
 * border, 3px left bar in the variant color, 20px padding, 12px radius.
 * Title row = small mono kicker in the variant color + Lucide icon.
 */
export default function Callout({
  variant = "note",
  kicker,
  icon,
  children,
  className,
}: CalloutProps) {
  const v = VARIANTS[variant] ?? VARIANTS.note;
  const Icon = icon === undefined ? v.icon : icon;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-xl border border-line bg-paper-raise p-5",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 w-[3px]", v.bar)}
      />
      {(kicker || Icon) && (
        <div className={cn("mb-2 flex items-center gap-2", v.text)}>
          {Icon && <Icon className="size-4" aria-hidden="true" />}
          {kicker && (
            <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.14em]">
              {kicker}
            </span>
          )}
        </div>
      )}
      <div className="text-[16px] leading-[1.7] text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </motion.aside>
  );
}
