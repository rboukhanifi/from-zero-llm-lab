import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

interface SmoothScrollContextValue {
  /** Smooth-scroll to an anchor ("#chapter-02", "#hero", …) with the -72px
   *  top-bar offset (design.md §5). Falls back to a native jump under
   *  reduced motion (anchors carry scroll-margin-top). */
  scrollTo: (target: string | number) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: () => {},
});

export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}

/**
 * Lightweight anchor-navigation provider. Native instant scrolling matches
 * the site's calmer motion direction and avoids a permanent animation loop.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const scrollTo = useCallback((target: string | number) => {
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "auto" });
      return;
    }
    const el = document.querySelector(target);
    if (!(el instanceof HTMLElement)) return;
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
