import Taxonomy from "@/sections/d/Taxonomy";
import Glossary from "@/sections/d/Glossary";
import Course from "@/sections/d/Course";
import FinalProject from "@/sections/d/FinalProject";

/**
 * Segment D — Ch.9 ML taxonomy · Ch.10 glossary · course plan · final project
 * (design.md §1; segment-d spec S9–S12). The Footer is mounted globally in
 * App.tsx and intentionally not rendered here.
 */
export default function SegmentD() {
  return (
    <>
      <Taxonomy />
      <Glossary />
      <Course />
      <FinalProject />
    </>
  );
}
