import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/nav";

/**
 * Scroll spy across the 14 page anchors via IntersectionObserver with
 * rootMargin "-45% 0px -45%" (design.md §5): the section crossing the
 * viewport's middle band is "current". Returns the active anchor id.
 */
export function useScrollSpy(ids: string[] = NAV_ITEMS.map((i) => i.id)): string {
  const [active, setActive] = useState<string>(ids[0] ?? "hero");

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        // Pick the first (topmost in document order) currently-visible anchor.
        for (const id of ids) {
          if (visible.has(id)) {
            setActive(id);
            break;
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  return active;
}
