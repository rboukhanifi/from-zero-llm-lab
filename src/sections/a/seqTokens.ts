/**
 * The 6-chip token row shared by Chapter-1 stops 5 and 6 (segment-a spec):
 * the source sequence ["The", " robot", " moved", " forward"] as solid
 * chips plus two dashed-ghost chips standing in for distant context the
 * sequential models struggled to reach.
 */
export interface SeqToken {
  label: string;
  leadingSpace: boolean;
  ghost: boolean;
}

export const SEQ_TOKENS: SeqToken[] = [
  { label: "The", leadingSpace: false, ghost: false },
  { label: "robot", leadingSpace: true, ghost: false },
  { label: "moved", leadingSpace: true, ghost: false },
  { label: "forward", leadingSpace: true, ghost: false },
  { label: "…", leadingSpace: false, ghost: true },
  { label: "…", leadingSpace: false, ghost: true },
];
