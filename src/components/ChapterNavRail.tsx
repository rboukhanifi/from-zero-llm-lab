import { NAV_ITEMS } from "@/lib/nav";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useSmoothScroll } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

/**
 * Fixed left-edge chapter markers, visible on wide screens only. Labels stay
 * in accessible names so the compact rail never overlaps the reading column.
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
                title={item.label}
                className="group flex items-center"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full",
                    isActive
                      ? "w-6 bg-ember"
                      : "w-2 bg-line-strong group-hover:bg-ink-faint"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
