export const RL_STEPS = [
  "The model attempts tasks.",
  "The system records rollouts.",
  "Each rollout receives a reward.",
  "The algorithm estimates which actions contributed to the result.",
  "The model is updated.",
  "New rollouts are collected.",
  "The process repeats.",
];

const SIZE = 620;
const CENTER = SIZE / 2;
const RADIUS = 218;
const NODE_R = 30;

function nodePos(index: number) {
  const angle = (-90 + index * (360 / RL_STEPS.length)) * (Math.PI / 180);
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

function ringPath(radius: number) {
  return [
    `M ${CENTER} ${CENTER - radius}`,
    `A ${radius} ${radius} 0 1 1 ${CENTER - 0.001} ${CENTER - radius}`,
  ].join(" ");
}

function LoopDiagram() {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto w-full max-w-[520px]"
      role="img"
      aria-label="The reinforcement learning loop: seven steps connected in a circle"
    >
      <defs>
        <marker
          id="rl-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" className="fill-ember" />
        </marker>
      </defs>
      <path
        d={ringPath(RADIUS)}
        fill="none"
        className="stroke-ember"
        strokeWidth={3}
        strokeLinecap="round"
        markerEnd="url(#rl-arrow)"
      />
      {RL_STEPS.map((_, index) => {
        const position = nodePos(index);
        return (
          <g key={index}>
            <circle
              cx={position.x}
              cy={position.y}
              r={NODE_R}
              strokeWidth={1.5}
              className="fill-paper-raise stroke-ember"
            />
            <text
              x={position.x}
              y={position.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-ember font-mono text-[15px] font-bold"
            >
              {index + 1}
            </text>
          </g>
        );
      })}
      <text
        x={CENTER}
        y={CENTER}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-ember font-serif text-[64px] italic"
      >
        ↻
      </text>
    </svg>
  );
}

export default function RLLoop() {
  return (
    <div>
      <LoopDiagram />
      <ol className="mx-auto mt-8 max-w-[560px] space-y-2.5">
        {RL_STEPS.map((step, index) => (
          <li
            key={step}
            className="flex items-baseline gap-3 font-mono text-[13.5px] leading-[1.6] text-ink-soft"
          >
            <span className="inline-flex h-6 w-6 shrink-0 translate-y-1 items-center justify-center rounded-full border border-line-strong bg-paper-raise text-[11px] font-bold text-ink">
              {index + 1}
            </span>
            {step}
            {index === RL_STEPS.length - 1 && (
              <span className="text-ember" aria-hidden="true">
                ↻
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
