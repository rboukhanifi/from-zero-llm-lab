import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

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
 * Lenis smooth-scroll provider (design.md §5): lerp 0.09, smoothWheel,
 * synced into GSAP's ticker so ScrollTrigger stays in lockstep.
 * Disabled entirely under prefers-reduced-motion.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const scrollTo = useCallback((target: string | number) => {
    if (typeof target === "number") {
      if (lenisRef.current) lenisRef.current.scrollTo(target);
      else window.scrollTo({ top: target, behavior: "auto" });
      return;
    }
    const el = document.querySelector(target);
    if (!(el instanceof HTMLElement)) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -72 });
    } else {
      el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
