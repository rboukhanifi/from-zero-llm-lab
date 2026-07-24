import { useSmoothScroll } from "@/components/SmoothScroll";

/**
 * Quiet reading bar: a book title and one route back to the contents.
 */
export default function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { scrollTo } = useSmoothScroll();

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-12 border-b border-line bg-paper/95">
      <div className="mx-auto flex h-full w-full max-w-[1080px] items-center justify-between px-6 md:px-10">
        <button
          type="button"
          onClick={() => scrollTo("#hero")}
          className="font-serif text-[16px] font-semibold text-ink"
          aria-label="Back to top"
        >
          From Zero
        </button>

        <button
          type="button"
          onClick={onOpenMenu}
          className="border-b border-ink font-sans text-[13px] font-medium text-ink"
          aria-haspopup="dialog"
        >
          Contents
        </button>
      </div>
    </header>
  );
}
