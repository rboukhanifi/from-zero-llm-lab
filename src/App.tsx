import { useState } from "react";
import { MotionConfig } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import TopBar from "@/components/TopBar";
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
        <TopBar onOpenMenu={() => setMenuOpen(true)} />
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
      </SmoothScroll>
    </MotionConfig>
  );
}
