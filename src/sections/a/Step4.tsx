import { motion } from "framer-motion";
import StepHead from "@/sections/a/StepHead";
import TransformerBlockDiagram from "@/sections/a/TransformerBlockDiagram";
import AttentionArcs from "@/sections/a/AttentionArcs";
import { PositionChips, MlpMini, ResidualMini } from "@/sections/a/ArchMinis";
import CodeBlock from "@/components/shared/CodeBlock";
import Callout from "@/components/shared/Callout";
import TokenChip from "@/components/shared/TokenChip";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Detail block wrapper — alternating text/visual rows on desktop. */
function DetailRow({
  title,
  flip = false,
  wide = false,
  children,
  visual,
}: {
  title: string;
  flip?: boolean;
  wide?: boolean;
  children: React.ReactNode;
  visual: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className={cn(
        "border-t border-line pt-8",
        wide ? "" : "grid gap-6 md:grid-cols-2 md:gap-10"
      )}
    >
      <div className={cn(wide ? "max-w-[680px]" : flip ? "md:order-2" : "")}>
        <h4 className="font-sans text-[17px] font-semibold leading-[1.3] text-ink md:text-[19px]">
          {title}
        </h4>
        <div className="mt-3 space-y-4 text-[16px] leading-[1.75] text-ink-soft [&_strong]:font-semibold [&_strong]:text-ink">
          {children}
        </div>
      </div>
      <div className={cn(wide ? "mt-5" : flip ? "md:order-1" : "")}>{visual}</div>
    </motion.div>
  );
}

/**
 * Step 4 — Define the model architecture (#step-4): transformer block
 * diagram + five matched detail blocks (embeddings, positional info,
 * attention, MLP, residual/normalization).
 */
export default function Step4() {
  return (
    <section id="step-4" className="scroll-mt-[60px] pt-10 md:pt-16">
      <StepHead step={4} kicker="STEP 04 — The machine" title="Define the model architecture" />

      <div className="mt-10 max-w-[680px]">
        <p className="text-ink-soft">
          A transformer LLM mainly contains repeated transformer blocks. Each
          block includes:
        </p>
      </div>

      <TransformerBlockDiagram />

      <div className="mt-8 space-y-10 md:space-y-12">
        {/* 1 — Token embeddings */}
        <DetailRow
          title="Token embeddings"
          visual={
            <CodeBlock label="embedding">
              {"Token "}
              <span className="text-code-ember">18241</span>
              {" → ["}
              <span className="text-code-ember">0.13, -0.82, 0.04, ...</span>
              {"]"}
            </CodeBlock>
          }
        >
          <p>Each token ID is converted into a vector of numbers.</p>
          <p>
            The embedding gives the model a mathematical representation of
            that token.
          </p>
        </DetailRow>

        {/* 2 — Positional information */}
        <DetailRow
          title="Positional information"
          flip
          visual={<PositionChips />}
        >
          <p>
            The model must know whether a token is first, fifth, or thousandth
            in the sequence.
          </p>
          <p>
            Position information is added using mechanisms such as positional
            embeddings or rotary position embeddings.
          </p>
        </DetailRow>

        {/* 3 — Attention (wide) */}
        <DetailRow
          title="Attention"
          wide
          visual={<AttentionArcs />}
        >
          <p>
            Attention lets each token decide which previous tokens are
            relevant.
          </p>
        </DetailRow>
        <div className="max-w-[680px] space-y-4 text-[16px] leading-[1.75] text-ink-soft">
          <p>
            The model must determine what "it" refers to. Attention helps
            connect related tokens across the sequence.
          </p>
          <div>
            <p>Technically, the model creates:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <TokenChip>queries</TokenChip>
              <TokenChip>keys</TokenChip>
              <TokenChip>values</TokenChip>
            </div>
          </div>
          <p>
            It compares queries with keys and uses the resulting scores to
            combine values.
          </p>
          <Callout variant="note" kicker="CONCEPTUALLY" icon={null}>
            <p className="font-serif text-[18px] italic leading-[1.5] text-ink">
              "For this token, which earlier information should I retrieve?"
            </p>
          </Callout>
        </div>

        {/* 4 — Feed-forward network */}
        <DetailRow
          title="Feed-forward network"
          visual={<MlpMini />}
        >
          <p>
            After attention, each token passes through a multilayer
            perceptron, or MLP. This performs additional computation on the
            token representation.
          </p>
        </DetailRow>

        {/* 5 — Residual connections and normalization */}
        <DetailRow
          title="Residual connections and normalization"
          flip
          visual={<ResidualMini />}
        >
          <p>
            These stabilize training and allow information to flow through
            many layers.
          </p>
        </DetailRow>
      </div>
    </section>
  );
}
