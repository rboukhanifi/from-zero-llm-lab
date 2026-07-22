import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import TokenChip from "@/components/shared/TokenChip";
import { SEQ_TOKENS } from "@/sections/a/seqTokens";

/**
 * Stop 5 card visual (segment-a spec): horizontal row of 6 TokenChips with
 * a curved arrow looping chip-to-chip left→right (sequential processing).
 * The last two chips are dashed-ghost with a gold AlertTriangle marker —
 * the long-dependency struggle.
 */
export default function SequenceRow() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      className="mt-4"
      role="img"
      aria-label="Tokens processed one after another; distant tokens fade out"
    >
      <div className="flex flex-wrap items-center gap-y-4">
        {SEQ_TOKENS.map((tok, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <motion.svg
                width="26"
                height="16"
                viewBox="0 0 26 16"
                aria-hidden="true"
                className="mx-1 shrink-0 text-ember"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.12 }}
              >
                <motion.path
                  d="M2 12 Q13 -4 24 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1 } }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                />
                <path
                  d="M20 8.5 L24.5 12.5 L19 13.5 Z"
                  fill="currentColor"
                />
              </motion.svg>
            )}
            <motion.span
              variants={{
                hidden: { opacity: 0, scale: 0.85 },
                show: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 0.4, delay: i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-flex"
            >
              <TokenChip
                variant={tok.ghost ? "ghost" : "token"}
                leadingSpace={tok.leadingSpace}
              >
                {tok.label}
              </TokenChip>
            </motion.span>
          </div>
        ))}
        <motion.span
          variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="ml-2 inline-flex text-gold"
          aria-hidden="true"
        >
          <AlertTriangle className="size-4" />
        </motion.span>
      </div>
      <motion.p
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        transition={{ duration: 0.5, delay: 1 }}
        className="mt-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-faint"
      >
        Sequential — distant context fades
      </motion.p>
    </motion.div>
  );
}
