import { Metadata } from "next";
import GalleryIntro from "@/components/pages/gallery/gallery-intro";
import GalleryGridMain from "@/components/pages/gallery/gallery-grid-main";

export const metadata: Metadata = {
  title: "School Gallery",
  description: "Explore our vibrant campus life, academic achievements, and memorable events captured through the lens at Dhanbari Collegiate Model School.",
};

export default function GalleryPage() {
  return (
    <main className="flex-1 overflow-hidden bg-background">
      <GalleryIntro />
      <GalleryGridMain />
    </main>
  );
}