import type { RefObject } from "react";

const TOKENS = ["The", " robot", " moved", " forward", "."];

/**
 * Static hero token field. It preserves the original random-numbers-to-
 * language idea without a permanent animation frame loop or scroll observer.
 */
export default function TokenField({
  heroRef: _heroRef,
}: {
  heroRef: RefObject<HTMLElement | null>;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[60%] z-0 flex -translate-y-1/2 flex-wrap justify-center gap-2 px-6"
    >
      {TOKENS.map((token) => (
        <span
          key={token}
          className="inline-flex items-baseline rounded-lg border border-ember bg-ember-tint px-2.5 py-1.5 font-mono text-[13px] font-medium leading-none text-ink md:text-[14px]"
        >
          {token}
        </span>
      ))}
    </div>
  );
}
