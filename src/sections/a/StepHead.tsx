import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StepBadge from "@/components/shared/StepBadge";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Step head row (segment-a spec): StepBadge (large, 56px) + kicker
 * `STEP n — LABEL` + H3 step title, plus a decorative ghost numeral
 * (01–10) top-right with a −30px parallax drift.
 */
export default function StepHead({
  step,
  kicker,
  title,
}: {
  step: number;
  kicker: string;
  title: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const numeralRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const numeral = numeralRef.current;
    const root = rootRef.current;
    if (!numeral || !root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        numeral,
        { y: 0 },
        {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const num = String(step).padStart(2, "0");

  return (
    <div ref={rootRef} className="relative">
      <span
        ref={numeralRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-0 select-none font-serif text-[64px] font-bold leading-none text-transparent md:text-[110px]"
        style={{ WebkitTextStroke: "1px #CBBFA8" }}
      >
        {num}
      </span>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="flex items-center gap-4 md:gap-5"
      >
        <StepBadge step={step} active size="lg" />
        <div>
          <p className="kicker">{kicker}</p>
          <h3 className="mt-2 font-serif text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink md:text-[34px]">
            {title}
          </h3>
        </div>
      </motion.div>
    </div>
  );
}
