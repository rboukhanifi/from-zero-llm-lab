import { NAV_ITEMS } from "@/lib/nav";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

/**
 * Fixed 56px top bar (design.md §5): site mark left, scroll-spy current
 * chapter label center (desktop), Contents button right. Paper at 90%
 * opacity + 12px backdrop blur over a bottom hairline.
 */
export default function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const active = useScrollSpy();
  const { scrollTo } = useSmoothScroll();
  const current = NAV_ITEMS.find((i) => i.id === active) ?? NAV_ITEMS[0];
  const centerLabel =
    current.num !== undefined
      ? `CHAPTER ${current.num} — ${current.short.toUpperCase()}`
      : current.short.toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-line bg-paper/90 backdrop-blur-[12px]">
      <div className="relative mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-6 md:px-10">
        {/* Site mark */}
        <button
          type="button"
          onClick={() => scrollTo("#hero")}
          className="font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-ink no-underline"
          aria-label="Back to top"
        >
          From Zero <span className="text-ember">▪</span>
        </button>

        {/* Scroll-spy current chapter label (desktop only) */}
        <div
          aria-live="polite"
          className="absolute left-1/2 hidden -translate-x-1/2 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-ink-faint md:block"
        >
          <span className="mr-2 inline-block text-[7px] text-ember">■</span>
          {centerLabel}
        </div>

        {/* Contents button */}
        <button
          type="button"
          onClick={onOpenMenu}
          className={cn(
            "font-mono text-[12px] font-medium uppercase tracking-[0.14em]",
            "rounded-full border border-line-strong bg-paper-raise px-4 py-1.5 text-ink",
            "transition-colors duration-200 hover:border-ember hover:bg-ember-tint hover:text-ember-deep"
          )}
          aria-haspopup="dialog"
        >
          Contents
        </button>
      </div>
    </header>
  );
}
