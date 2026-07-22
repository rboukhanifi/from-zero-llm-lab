import { motion } from "framer-motion";
import { INDEX_ITEMS } from "@/lib/nav";
import { useSmoothScroll } from "@/components/SmoothScroll";

/**
 * S0.5 — Table of Contents (#contents), segment-a spec: paper-deep band,
 * wide column (1080px), kicker + H3, then a numbered index grid — 13 rows
 * in 2 columns (desktop) / 1 column (mobile). Each row = ghost numeral +
 * Fraunces 500 22px title (ink → ember on hover) + dotted leader line.
 * Rows are anchor links scrolled via Lenis.
 */
export default function Contents() {
  const { scrollTo } = useSmoothScroll();

  return (
    <section id="contents" className="border-y border-line bg-paper-deep">
      <div className="wide-col py-[72px] md:py-[120px]">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
          className="kicker"
        >
          What’s inside
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-serif text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] text-ink md:text-[34px]"
        >
          The full story, in order.
        </motion.h3>

        <ol className="mt-10 grid grid-cols-1 gap-x-12 md:grid-cols-2 md:mt-12">
          {INDEX_ITEMS.map((item, i) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                type="button"
                onClick={() => scrollTo(`#${item.id}`)}
                className="group flex w-full items-baseline gap-4 py-3 text-left transition-transform ease-out hover:translate-x-1 [transition-duration:250ms]"
              >
                <span className="shrink-0 font-mono text-[13px] font-medium tracking-[0.1em] text-line-strong transition-colors duration-200 group-hover:text-ember">
                  {item.num}
                </span>
                <span className="font-serif text-[19px] font-medium leading-[1.3] text-ink transition-colors duration-200 group-hover:text-ember md:text-[22px]">
                  {item.title}
                </span>
                <span
                  aria-hidden="true"
                  className="mx-2 flex-1 -translate-y-1 border-b border-dotted border-line-strong transition-colors duration-200 group-hover:border-ember"
                />
              </button>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
