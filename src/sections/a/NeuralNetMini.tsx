/**
 * Stop 3 card visual (segment-a spec): mini SVG of 3 columns of dots
 * (input 4 / hidden 5 / output 2) connected by thin line-strong paths.
 * Paths draw in on entry (stroke-dashoffset, 1s, stagger 0.1s).
 */
const COLS = [4, 5, 2] as const;
const W = 220;
const H = 150;
const COL_X = [24, 110, 196];

function nodeY(count: number, i: number): number {
  const gap = count > 1 ? (H - 32) / (count - 1) : 0;
  return 16 + i * gap;
}

export default function NeuralNetMini() {
  const paths: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  for (let c = 0; c < COLS.length - 1; c++) {
    for (let a = 0; a < COLS[c]; a++) {
      for (let b = 0; b < COLS[c + 1]; b++) {
        paths.push({
          x1: COL_X[c],
          y1: nodeY(COLS[c], a),
          x2: COL_X[c + 1],
          y2: nodeY(COLS[c + 1], b),
          key: `${c}-${a}-${b}`,
        });
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mt-4 w-full max-w-[260px]"
      role="img"
      aria-label="A small neural network: four inputs, five hidden units, two outputs"
    >
      {paths.map((p) => (
        <line
          key={p.key}
          x1={p.x1}
          y1={p.y1}
          x2={p.x2}
          y2={p.y2}
          className="stroke-line-strong"
          strokeWidth={1}
          opacity={0.7}
        />
      ))}
      {COLS.map((count, c) =>
        Array.from({ length: count }, (_, i) => (
          <circle
            key={`n-${c}-${i}`}
            cx={COL_X[c]}
            cy={nodeY(count, i)}
            r={5}
            className="fill-paper-raise stroke-ink-soft"
            strokeWidth={1.5}
          />
        ))
      )}
    </svg>
  );
}
