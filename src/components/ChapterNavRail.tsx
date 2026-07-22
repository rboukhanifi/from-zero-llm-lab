import { NAV_ITEMS } from "@/lib/nav";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

/**
 * Fixed left-edge dot rail, vertically centered, visible ≥1280px only
 * (design.md §5). 14 dots — one per anchor. Idle: 8px line-strong dot with
 * a mono label revealed on hover. Active: 24px ember bar + permanent label.
 * Scroll spy via IntersectionObserver (-45%/-45%), click → Lenis scrollTo.
 */
export default function ChapterNavRail() {
  const active = useScrollSpy();
  const { scrollTo } = useSmoothScroll();

  return (
    <nav
      aria-label="Chapter navigation"
      className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col gap-3">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollTo(`#${item.id}`)}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Go to ${item.label}`}
                className="group flex items-center gap-3"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300",
                    isActive
                      ? "w-6 bg-ember"
                      : "w-2 bg-line-strong group-hover:bg-ink-faint"
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] transition-all duration-200",
                    isActive
                      ? "text-ember opacity-100"
                      : "-translate-x-1 text-ink-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  )}
                >
                  {item.num ? `${item.num} ` : ""}
                  {item.short}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
