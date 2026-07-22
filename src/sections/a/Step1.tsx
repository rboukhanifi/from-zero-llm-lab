import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import StepHead from "@/sections/a/StepHead";
import Callout from "@/components/shared/Callout";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const DEFINED_ITEMS = [
  "target capabilities",
  "languages",
  "model size",
  "context length",
  "compute budget",
  "latency requirements",
  "safety requirements",
  "training objective",
];

const GENERAL_NEEDS = [
  "coding",
  "mathematics",
  "multilingual language",
  "reasoning",
  "tool use",
  "conversation abilities",
];

const MANUFACTURING_NEEDS = [
  "robotics documentation",
  "sensor data",
  "action planning",
  "industrial processes",
  "code generation",
  "visual understanding",
  "structured tool calls",
];

/** Contrast card: tilts 1° toward the cursor + lifts 2px (spring 200/20). */
function TiltCard({
  header,
  lead,
  items,
  accent,
  className,
}: {
  header: string;
  lead: string;
  items: string[];
  accent: "ember" | "forest";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 1); // 1° toward cursor
    rx.set(-py * 1);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ y: -2 }}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 800 }}
      className={cn(
        "rounded-[14px] border border-line bg-paper-raise p-6 transition-shadow duration-200 hover:shadow-lift",
        accent === "ember" ? "border-t-4 border-t-ember" : "border-t-4 border-t-forest",
        className
      )}
    >
      <h4 className="font-sans text-[17px] font-semibold leading-[1.3] text-ink md:text-[19px]">
        {header}
      </h4>
      <p className="mt-2 text-[15px] leading-[1.7] text-ink-soft">{lead}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[15px] leading-[1.6] text-ink-soft">
            <Check
              className={cn(
                "mt-1 size-4 shrink-0",
                accent === "ember" ? "text-ember" : "text-forest"
              )}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * Step 1 — Decide what the model should do (#step-1): 8 defined items as a
 * chip grid, two contrast cards (general-purpose vs manufacturing), closing
 * insight callout.
 */
export default function Step1() {
  return (
    <section id="step-1" className="scroll-mt-[60px] pt-10 md:pt-16">
      <StepHead step={1} kicker="STEP 01 — The brief" title="Decide what the model should do" />

      <div className="mt-10 max-w-[680px]">
        <p className="text-ink-soft">Before training, the lab defines:</p>
      </div>

      {/* 8 items — 2×4 chip grid, stagger scale 0.94→1 */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15% 0px" }}
        className="mt-5 grid max-w-[860px] grid-cols-2 gap-3 md:grid-cols-4"
      >
        {DEFINED_ITEMS.map((item, i) => (
          <motion.span
            key={item}
            variants={{
              hidden: { opacity: 0, scale: 0.94 },
              show: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
            className="inline-flex items-center justify-center rounded-lg border border-line bg-paper-raise px-3 py-2.5 text-center font-mono text-[12.5px] font-medium leading-[1.4] text-ink md:text-[13px]"
          >
            {item}
          </motion.span>
        ))}
      </motion.div>

      {/* Contrast cards — slide in from ±40px x-offsets */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <TiltCard
            header="A general-purpose model"
            lead="may need:"
            items={GENERAL_NEEDS}
            accent="ember"
            className="h-full"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <TiltCard
            header="A manufacturing model"
            lead="might instead emphasize:"
            items={MANUFACTURING_NEEDS}
            accent="forest"
            className="h-full"
          />
        </motion.div>
      </div>

      <Callout variant="insight" kicker="KEY IDEA" className="mt-8 max-w-[680px]">
        This decision controls the data, architecture, evaluations, and
        training process.
      </Callout>
    </section>
  );
}
