/**
 * Textbook-style opening: a compact title page, a concise premise, and the
 * central learning objective. No ambient layer or entrance choreography.
 */
export default function Hero() {
  return (
    <section
      id="hero"
      className="border-b border-line bg-paper px-6 pb-16 pt-28 md:pb-20 md:pt-36"
    >
      <div className="mx-auto w-full max-w-[820px]">
        <p className="kicker">A practical textbook</p>
        <h1 className="mt-5 max-w-[760px] font-serif text-[42px] font-semibold leading-[1.08] tracking-[-0.02em] text-ink md:text-[62px]">
          How a Lab Trains a Model <span className="italic text-ember">from Zero</span>
        </h1>
        <div className="mt-8 max-w-[680px] space-y-4 text-[16.5px] leading-[1.8] text-ink-soft md:text-[18px]">
          <p>
            A model starts as a mathematical function with billions of
            randomly initialized numbers called{" "}
            <span className="font-mono text-[0.92em] text-ember-deep">
              parameters
            </span>{" "}
            or{" "}
            <span className="font-mono text-[0.92em] text-ember-deep">
              weights
            </span>
            . Training gradually changes those numbers until the function
            produces useful outputs.
          </p>
          <p>For an LLM, the central task is surprisingly simple:</p>
        </div>
        <blockquote className="mt-8 max-w-[680px] border-l-[3px] border-ember bg-paper-deep px-6 py-5">
          <p className="font-serif text-[22px] font-medium italic leading-[1.4] text-ink md:text-[27px]">
            “Given previous tokens, predict the next token.”
          </p>
        </blockquote>
        <div className="mt-8 max-w-[680px] text-[16.5px] leading-[1.8] text-ink-soft md:text-[18px]">
          <p>
            Almost everything else—reasoning, writing, coding, tool
            use—emerges from training this prediction system on enormous
            amounts of data, followed by specialized post-training.
          </p>
        </div>
      </div>
    </section>
  );
}
