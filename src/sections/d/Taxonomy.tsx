import type { ReactNode } from "react";
import { motion } from "framer-motion";
import ChapterHeader from "@/components/shared/ChapterHeader";
import ChipChain from "@/sections/d/ChipChain";
import { cn } from "@/lib/utils";

type Family = "data" | "interaction" | "transfer";

const FAMILY_BAR: Record<Family, string> = {
  data: "bg-ember",
  interaction: "bg-forest",
  transfer: "bg-gold",
};

interface Category {
  title: string;
  family: Family;
  body: ReactNode;
  /** Permanent highlight for the self-supervised card (the site's thesis). */
  foundation?: boolean;
}

function MiniChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-paper px-1.5 py-0.5 align-baseline font-mono text-[12px] font-medium leading-none text-ink">
      {children}
    </span>
  );
}

const CATEGORIES: Category[] = [
  {
    title: "Supervised learning",
    family: "data",
    body: (
      <>
        <p>Learn from labeled examples:</p>
        <ChipChain steps={["image", "defect / no defect"]} className="mt-3" />
        <p className="mt-3">
          Used for <MiniChip>classification</MiniChip>, <MiniChip>regression</MiniChip>,{" "}
          <MiniChip>detection</MiniChip>, and <MiniChip>segmentation</MiniChip>.
        </p>
      </>
    ),
  },
  {
    title: "Self-supervised learning",
    family: "data",
    foundation: true,
    body: (
      <>
        <p>The data generates its own labels:</p>
        <ChipChain steps={["previous tokens", "next token"]} className="mt-3" />
        <ChipChain steps={["masked image region", "missing content"]} className="mt-2" />
        <p className="mt-4 font-serif text-[16px] italic leading-[1.4] text-ember">
          This is the foundation of most large foundation models.
        </p>
      </>
    ),
  },
  {
    title: "Unsupervised learning",
    family: "data",
    body: (
      <>
        <p>Discover structure without explicit labels:</p>
        <span className="mt-3 flex flex-wrap gap-1.5">
          <MiniChip>clustering</MiniChip>
          <MiniChip>dimensionality reduction</MiniChip>
          <MiniChip>density estimation</MiniChip>
        </span>
      </>
    ),
  },
  {
    title: "Reinforcement learning",
    family: "interaction",
    body: <p>Learn actions from rewards and interaction.</p>,
  },
  {
    title: "Imitation learning",
    family: "interaction",
    body: (
      <>
        <p>Learn to imitate demonstrations. For robotics:</p>
        <ChipChain steps={["human demonstration", "robot policy"]} className="mt-3" />
      </>
    ),
  },
  {
    title: "Offline learning",
    family: "interaction",
    body: (
      <p>
        Train from previously collected data without interacting with the
        environment during training.
      </p>
    ),
  },
  {
    title: "Online learning",
    family: "interaction",
    body: <p>Continue learning from new interactions or streaming data.</p>,
  },
  {
    title: "Transfer learning",
    family: "transfer",
    body: (
      <>
        <p>Train on one broad task, then adapt the model to another.</p>
        <p className="mt-4 font-serif text-[16px] italic leading-[1.4] text-ember">
          Pretraining followed by fine-tuning is transfer learning.
        </p>
      </>
    ),
  },
];

/**
 * Chapter 9 — The major categories of machine learning (segment-d spec S9).
 * 4×2 card grid; top accent bar color-codes the family (ember = data-driven,
 * forest = interaction-driven, gold = transfer).
 */
export default function Taxonomy() {
  return (
    <section id="chapter-09" className="border-t border-line bg-paper">
      <div className="page-col py-[72px] md:py-[120px]">
        <ChapterHeader
          kicker="CHAPTER 09"
          title="The major categories of machine learning"
          number="09"
        />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:mt-16">
          {CATEGORIES.map((cat, i) => (
            <motion.article
              key={cat.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: (i % 4) * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-[14px] border border-line p-5 pt-6 transition-all duration-200 hover:-translate-y-[3px] hover:shadow-lift",
                cat.foundation ? "bg-ember-tint/40" : "bg-paper-raise"
              )}
            >
              {/* Family color bar — thickens 2px → 3px on hover */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 top-0 h-[2px] transition-all duration-200 group-hover:h-[3px]",
                  FAMILY_BAR[cat.family]
                )}
              />
              {cat.foundation && (
                <span className="absolute right-4 top-4 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ember">
                  Foundation
                </span>
              )}
              <span
                aria-hidden="true"
                className="font-mono text-[15px] font-medium text-line-strong transition-colors duration-200 group-hover:text-ember"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="mt-3 font-sans text-[19px] font-semibold leading-[1.3] text-ink max-md:text-[17px]">
                {cat.title}
              </h4>
              <div className="mt-3 flex-1 text-[15px] leading-[1.7] text-ink-soft">
                {cat.body}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
