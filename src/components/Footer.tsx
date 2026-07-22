import { ArrowUp } from "lucide-react";
import { INDEX_ITEMS } from "@/lib/nav";
import { useSmoothScroll } from "@/components/SmoothScroll";

/**
 * Colophon footer (design.md §6.11): full-width code-bg dark band. Left =
 * site mark + one-line description; center = chapter index (mono, 2
 * columns); right = "Back to top" ember pill. Bottom hairline + tiny
 * colophon line.
 */
export default function Footer() {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer id="footer" className="bg-code-bg text-code-text">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-[1.2fr_1fr_auto] md:px-10 md:py-20">
        {/* Left — site mark + description */}
        <div>
          <p className="font-mono text-[13px] font-bold uppercase tracking-[0.14em]">
            From Zero <span className="text-ember">▪</span>
          </p>
          <p className="mt-4 max-w-[320px] text-[14px] leading-[1.7] text-code-dim">
            A scrolling explainer on how a lab trains a model from zero —
            from random numbers to a working stack.
          </p>
        </div>

        {/* Center — chapter index, mono, 2 columns */}
        <nav aria-label="Footer chapter index">
          <ol className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {INDEX_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(`#${item.id}`)}
                  className="group flex items-baseline gap-2 text-left font-mono text-[11.5px] font-medium uppercase tracking-[0.1em] text-code-dim transition-colors duration-150 hover:text-code-ember"
                >
                  <span className="text-ember/80">{item.num}</span>
                  <span className="normal-case tracking-[0.02em]">
                    {item.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        {/* Right — back to top */}
        <div className="md:justify-self-end">
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-paper transition-colors duration-200 hover:bg-ember-deep"
          >
            Back to top
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Bottom hairline + colophon line */}
      <div className="border-t border-code-text/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-2 px-6 py-6 font-mono text-[11px] tracking-[0.06em] text-code-dim md:flex-row md:items-center md:justify-between md:px-10">
          <span>Set in Fraunces, Inter &amp; JetBrains Mono — built as a single scroll.</span>
          <span>■ How a Lab Trains a Model from Zero</span>
        </div>
      </div>
    </footer>
  );
}
