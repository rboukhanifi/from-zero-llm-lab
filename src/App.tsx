import { useState } from "react";
import { MotionConfig } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import TopBar from "@/components/TopBar";
import ChapterNavRail from "@/components/ChapterNavRail";
import ChapterMenu from "@/components/ChapterMenu";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import Contents from "@/sections/Contents";
import SegmentA from "@/sections/SegmentA";
import Chapter02 from "@/sections/Chapter02";
import SegmentB from "@/sections/SegmentB";
import SegmentC from "@/sections/SegmentC";
import SegmentD from "@/sections/SegmentD";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="always">
      <SmoothScroll>
        <ScrollProgressBar />
        <TopBar onOpenMenu={() => setMenuOpen(true)} />
        <ChapterNavRail />
        <ChapterMenu open={menuOpen} onOpenChange={setMenuOpen} />
        <main>
          <Hero />
          <Contents />
          <SegmentA />
          <Chapter02 />
          <SegmentB />
          <SegmentC />
          <SegmentD />
        </main>
        <Footer />
        {/* Paper grain overlay — fixed full-page SVG noise (design.md §7.6) */}
        <div className="paper-grain" aria-hidden="true" />
      </SmoothScroll>
    </MotionConfig>
  );
}
