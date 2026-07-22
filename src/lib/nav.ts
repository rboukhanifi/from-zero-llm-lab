/**
 * Shared navigation model — the 14 scroll anchors of the single-page site
 * (design.md §1, §5). Used by TopBar, ChapterNavRail, ChapterMenu, Footer,
 * and the Contents section.
 */
export interface NavItem {
  /** anchor id without '#' */
  id: string;
  /** full display label (chapter title) */
  label: string;
  /** short label for compact chrome (top bar / rail) */
  short: string;
  /** display number in menus ("01"…"13"), undefined for hero/contents */
  num?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Start", short: "Start" },
  { id: "contents", label: "Contents", short: "Contents" },
  { id: "chapter-01", label: "The conceptual path from basic ML to LLMs", short: "The conceptual path", num: "01" },
  { id: "chapter-02", label: "The complete LLM training pipeline", short: "The training pipeline", num: "02" },
  { id: "chapter-03", label: "What the training infrastructure does", short: "Training infrastructure", num: "03" },
  { id: "chapter-04", label: "What is a training harness?", short: "Training harness", num: "04" },
  { id: "chapter-05", label: "Pretraining versus post-training", short: "Pre vs post-training", num: "05" },
  { id: "chapter-06", label: "Reinforcement learning for LLMs", short: "Reinforcement learning", num: "06" },
  { id: "chapter-07", label: "Evaluation", short: "Evaluation", num: "07" },
  { id: "chapter-08", label: "Inference: using the trained model", short: "Inference", num: "08" },
  { id: "chapter-09", label: "The major categories of machine learning", short: "ML taxonomy", num: "09" },
  { id: "chapter-10", label: "Important concepts you should understand", short: "Key concepts", num: "10" },
  { id: "course", label: "Course plan: from basic ML to a miniature LLM", short: "Course plan", num: "11" },
  { id: "final-project", label: "Recommended final project", short: "Final project", num: "12" },
];

/** The 13 numbered index rows (chapters 01–10 + course + final project + colophon) */
export const INDEX_ITEMS: { id: string; num: string; title: string }[] = [
  { id: "chapter-01", num: "01", title: "The conceptual path from basic ML to LLMs" },
  { id: "chapter-02", num: "02", title: "The complete LLM training pipeline" },
  { id: "chapter-03", num: "03", title: "What the training infrastructure does" },
  { id: "chapter-04", num: "04", title: "What is a training harness?" },
  { id: "chapter-05", num: "05", title: "Pretraining versus post-training" },
  { id: "chapter-06", num: "06", title: "Reinforcement learning for LLMs" },
  { id: "chapter-07", num: "07", title: "Evaluation" },
  { id: "chapter-08", num: "08", title: "Inference: using the trained model" },
  { id: "chapter-09", num: "09", title: "The major categories of machine learning" },
  { id: "chapter-10", num: "10", title: "Important concepts you should understand" },
  { id: "course", num: "11", title: "Course plan: from basic ML to a miniature LLM" },
  { id: "final-project", num: "12", title: "Recommended final project" },
  { id: "footer", num: "13", title: "Colophon" },
];

/** Pipeline steps 1–10 (chapter-02 sub-anchors) — labels per segment A/B specs */
export const PIPELINE_STEPS: { id: string; step: number; label: string }[] = [
  { id: "step-1", step: 1, label: "The brief" },
  { id: "step-2", step: 2, label: "Collect data" },
  { id: "step-3", step: 3, label: "Tokenizer" },
  { id: "step-4", step: 4, label: "Architecture" },
  { id: "step-5", step: 5, label: "Random init" },
  { id: "step-6", step: 6, label: "Training examples" },
  { id: "step-7", step: 7, label: "Forward pass" },
  { id: "step-8", step: 8, label: "Loss" },
  { id: "step-9", step: 9, label: "Backprop" },
  { id: "step-10", step: 10, label: "Optimizer" },
];
