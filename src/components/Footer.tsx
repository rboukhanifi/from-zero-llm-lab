import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/components/SmoothScroll";

/**
 * A short colophon. The full chapter index already lives in the contents.
 */
export default function Footer() {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer id="footer" className="border-t border-line bg-paper-deep text-ink">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <p className="font-serif text-[20px] font-semibold">From Zero</p>
          <p className="mt-2 max-w-[520px] text-[14px] leading-[1.7] text-ink-soft">
            How a lab trains a model, from random parameters to a working
            system.
          </p>
        </div>

        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="inline-flex w-fit items-center gap-2 border-b border-ink pb-0.5 text-[13px] font-medium text-ink"
        >
          Back to top
          <ArrowUp className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}
