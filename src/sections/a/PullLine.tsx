import { cn } from "@/lib/utils";

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
    <blockquote
      className={cn(
        "border-y border-line px-4 py-6 text-center font-serif text-[23px] font-medium italic leading-[1.3] tracking-[-0.01em] text-ink md:text-[30px]",
        className
      )}
    >
      {children}
    </blockquote>
  );
}
