import { Metadata } from "next";
import AboutFacilities from "@/components/pages/about-us/about-facilities";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Dhanbari Collegiate Model School, our history, mission, vision, and core responsibilities toward our students.",
};
import AboutHistory from "@/components/pages/about-us/about-history";
import AboutIntro from "@/components/pages/about-us/about-intro";
import AboutMission from "@/components/pages/about-us/about-mission";
import AboutResponsiblities from "@/components/pages/about-us/about-responsibilities";

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AboutUsPage() {
  return (
    <main className="flex-1 overflow-hidden">
      {/* ══════════════════════════════════════════════════════════════
          1. INTRO
      ══════════════════════════════════════════════════════════════ */}
      <AboutIntro />

      {/* ══════════════════════════════════════════════════════════════
          2. MISSION & VISION
      ══════════════════════════════════════════════════════════════ */}
      <AboutMission />

      {/* ══════════════════════════════════════════════════════════════
          3. CORE RESPONSIBILITIES
      ══════════════════════════════════════════════════════════════ */}
      <AboutResponsiblities />

      {/* ══════════════════════════════════════════════════════════════
          4. HISTORY TIMELINE
      ══════════════════════════════════════════════════════════════ */}
      <AboutHistory />

      {/* ══════════════════════════════════════════════════════════════
          5. FACILITIES
      ══════════════════════════════════════════════════════════════ */}
      <AboutFacilities />
    </main>
  );
}
