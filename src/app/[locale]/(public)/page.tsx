import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/pages/landing/hero-section";
// import { QuickInfoBar } from "@/components/pages/landing/quick-info-bar";
import { AboutSection } from "@/components/pages/landing/about-section";
import { StatsSection } from "@/components/pages/landing/stats-section";
import { LeadershipSection } from "@/components/pages/landing/leadership-section";
import { NoticeBoardSection } from "@/components/pages/landing/notice-board-section";
import { GallerySection } from "@/components/pages/landing/gallery-section";
import { ContactSection } from "@/components/pages/landing/contact-section";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col">
      {/* <QuickInfoBar /> */}
      <HeroSection />
      <NoticeBoardSection />
      <AboutSection />
      <StatsSection />
      <LeadershipSection />
      <GallerySection />
      <ContactSection />
    </main>
  );
}
