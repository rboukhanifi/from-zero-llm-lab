# Shared components (design.md §6)

Built once by the scaffold builder; all four segment builders import from here.
Every component is a default export. All colors come from the Tailwind design
tokens in `tailwind.config.js` (`paper`, `ink`, `ember`, `forest`, `gold`,
`code-*`, …) — do not hard-code hex values in segments.

All reveal animations use Framer Motion `whileInView` with
`viewport={{ once: true, margin: "-15%" }}` and are safe under
`prefers-reduced-motion` (global CSS collapses transitions/animations).

## Component APIs

### `ChapterHeader`
```tsx
<ChapterHeader kicker="CHAPTER 03" title="What the training infrastructure does"
  lede={<p>…</p>} number="03" />
```
- `kicker: string` — rendered as `■ KICKER` mono ember (auto style).
- `title: string` — H2 Fraunces; word-split masked reveal.
- `lede?: ReactNode` — optional body lede (max 680px).
- `number?: string` — optional giant outline numeral, top-right, GSAP parallax −40px.

### `StepBadge`
```tsx
<StepBadge step={3} active size="md" />   // md = 44px, lg = 56px
```

### `StepperRail` (Ch.2 only)
```tsx
<StepperRail steps={[{ id: "step-1", step: 1, label: "The brief" }, …]}
  activeId?="step-3" progress?={0.4} />
```
- Defaults to the 10 pipeline steps from `@/lib/nav` (`PIPELINE_STEPS`).
- Without `activeId` it runs its own scroll-spy over the step anchors.
- Desktop: sticky vertical rail (`top: 120px`). Mobile (<1024px): sticky top
  chip (`STEP 4 / 10 — Architecture`). Both render from one component — place
  it once in the chapter's left column / above the prose column.

### `TokenChip`
```tsx
<TokenChip variant="token" pairId="tok-3" leadingSpace> robot</TokenChip>
```
- Variants: `token` (default) · `id` · `highlight` · `ghost`.
- `pairId`: chips sharing a key pulse each other on hover (token ↔ ID pairing).
- `leadingSpace`: renders a visible `␣` glyph before the label.

### `ProbBar`
```tsx
<ProbBar label="banana" value={3} variant="default" index={0}
  warning="the sensible answer, nearly invisible" showFootnote />
```
- `variant`: `default` (line-strong fill) · `winner` (ember) · `correct` (forest).
- `index` drives the 0.12s stagger. Values animate 0 → value% (min width 2%).
- Render `showFootnote` on exactly one bar per set.

### `CodeBlock`
```tsx
<CodeBlock label="rules.txt" code={`If message contains "invoice"…`} />
// or manually colored:
<CodeBlock label="embed.py"><span className="text-code-ember">18241</span> → …</CodeBlock>
```
- Syntax coloring limited to palette tokens: `text-code-ember` (numbers/keywords),
  `text-code-forest` (strings/success), `text-code-dim` (comments).

### `Callout`
```tsx
<Callout variant="insight" kicker="KEY IDEA">…</Callout>
```
- Variants: `insight` (ember/Flame) · `success`/`correct` (forest/CheckCircle2) ·
  `warning` (gold/AlertTriangle) · `note` (ink/Info). `icon` prop overrides or
  (`null`) hides the icon.

### `FlowDiagram`
```tsx
<FlowDiagram label="FOR VISION" steps={["pixels", "edges", "shapes", "objects"]} />
```
- Horizontal chain on desktop, vertical on mobile; boxes pop with stagger.

### `StatBlock`
```tsx
<StatBlock value={10} suffix="B" caption="Gradients per step" color="ember" />
```
- Counts up 0 → value on entry (1.2s). `format` overrides the readout;
  `prefix`/`suffix` for "~", "×", "%", ranges (pass `value` as the displayable
  number; for ranges like "20M–100M" use `format={() => "20–100"} suffix="M"`).

### `DefCard`
```tsx
<DefCard term="Perplexity" alias="PPL" example="lower = better">Definition…</DefCard>
```

### `Footer` (§6.11, lives at `src/components/Footer.tsx`)
Dark colophon band — already mounted once in `App.tsx`; do not re-mount.

## Navigation model
`@/lib/nav` exports `NAV_ITEMS` (14 anchors), `INDEX_ITEMS` (13 numbered rows),
and `PIPELINE_STEPS` (10 step anchors). Use `useSmoothScroll().scrollTo("#id")`
for anchor jumps (Lenis, offset −72).
