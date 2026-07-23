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
      <div className="wide-col py-14 md:py-20">
        <p className="kicker">Table of contents</p>
        <h2 className="mt-4 font-serif text-[28px] font-semibold leading-[1.2] text-ink md:text-[36px]">
          The full story, in order.
        </h2>

        <ol className="mt-8 grid grid-cols-1 gap-x-12 md:grid-cols-2">
          {INDEX_ITEMS.map((item) => (
            <li key={item.id} className="border-b border-line">
              <button
                type="button"
                onClick={() => scrollTo(`#${item.id}`)}
                className="group flex w-full items-baseline gap-4 py-3 text-left"
              >
                <span className="w-7 shrink-0 font-mono text-[12px] font-medium tracking-[0.1em] text-ember">
                  {item.num}
                </span>
                <span className="text-[15px] font-medium leading-[1.45] text-ink group-hover:text-ember-deep md:text-[16px]">
                  {item.title}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
