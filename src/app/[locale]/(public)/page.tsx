import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { HeroSection } from "@/components/pages/landing/hero-section";
// import { QuickInfoBar } from "@/components/pages/landing/quick-info-bar";
import { AboutSection } from "@/components/pages/landing/about-section";
import { StatsSection } from "@/components/pages/landing/stats-section";
import { LeadershipSection } from "@/components/pages/landing/leadership-section";
import { NoticeBoardSection } from "@/components/pages/landing/notice-board-section";
import { GallerySection } from "@/components/pages/landing/gallery-section";
import { ContactSection } from "@/components/pages/landing/contact-section";
import { getNoticeFeedApi, PUBLIC_FEED_DEFAULTS } from "@/services/notice.service";

export const revalidate = 60;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const initialFeed = await getNoticeFeedApi(PUBLIC_FEED_DEFAULTS);

  return (
    <main className="flex min-h-screen flex-col">
      {/* <QuickInfoBar /> */}
      <HeroSection />
      <NoticeBoardSection initialFeed={initialFeed} />
      <AboutSection />
      <StatsSection />
      <LeadershipSection />
      <GallerySection />
      <ContactSection />
    </main>
  );
}