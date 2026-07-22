import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/**
 * Pull line (segment-a spec): Fraunces 500 italic centered inside a 1px
 * `line` top+bottom hairline frame, 24px padding. Used for chapter-closing
 * lines and step pull quotes.
 */
export default function PullLine({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className={cn(
        "border-y border-line px-4 py-6 text-center font-serif text-[23px] font-medium italic leading-[1.3] tracking-[-0.01em] text-ink md:text-[30px]",
        className
      )}
    >
      {children}
    </motion.blockquote>
  );
}
