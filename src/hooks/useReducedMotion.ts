/**
 * The editorial experience uses its calm motion mode by default. Components
 * still keep their reduced-motion branches so content remains fully visible
 * without ambient loops, pinned movement, or smooth-scroll effects.
 */
export function useReducedMotion(): boolean {
  return true;
}
