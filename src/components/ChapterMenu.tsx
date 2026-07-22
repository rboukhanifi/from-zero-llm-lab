import { motion } from "framer-motion";
import { X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { INDEX_ITEMS } from "@/lib/nav";
import { useSmoothScroll } from "@/components/SmoothScroll";

/**
 * Full-screen chapter menu (design.md §5): paper overlay, numbered list of
 * all chapters in Fraunces 34px with mono numbers; staggered rise-in
 * (y 24→0, opacity 0→1, 0.5s, stagger 0.05s). Radix Dialog supplies the
 * focus trap and Esc-to-close; selection scrolls via Lenis and closes.
 */
export default function ChapterMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { scrollTo } = useSmoothScroll();

  const go = (id: string) => {
    onOpenChange(false);
    // Wait a beat for the dialog to unmount so scroll measurements are stable.
    window.setTimeout(() => scrollTo(`#${id}`), 60);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 left-0 top-0 z-50 flex h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col overflow-y-auto rounded-none border-0 bg-paper p-0 shadow-none"
      >
        <DialogDescription className="sr-only">
          Jump to any chapter of the explainer.
        </DialogDescription>

        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 pt-5 md:px-10">
          <DialogTitle className="font-mono text-[12.5px] font-medium uppercase tracking-[0.14em] text-ember">
            <span className="mr-2 inline-block text-[8px] align-[2px]">■</span>
            Contents
          </DialogTitle>
          <DialogClose
            className="rounded-full border border-line-strong bg-paper-raise p-2 text-ink transition-colors hover:border-ember hover:bg-ember-tint hover:text-ember-deep"
            aria-label="Close menu"
          >
            <X className="size-4" />
          </DialogClose>
        </div>

        <nav
          aria-label="Chapters"
          className="mx-auto w-full max-w-[1200px] flex-1 px-6 pb-16 pt-10 md:px-10 md:pt-16"
        >
          <ol className="flex flex-col">
            {INDEX_ITEMS.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{
                  duration: 0.5,
                  delay: 0.08 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  className="group flex w-full items-baseline gap-5 border-b border-line py-4 text-left md:py-5"
                >
                  <span className="font-mono text-[13px] font-medium tracking-[0.14em] text-ember">
                    {item.num}
                  </span>
                  <span className="font-serif text-[26px] font-medium leading-[1.15] tracking-[-0.015em] text-ink transition-colors duration-200 group-hover:text-ember md:text-[34px]">
                    {item.title}
                  </span>
                </button>
              </motion.li>
            ))}
          </ol>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
