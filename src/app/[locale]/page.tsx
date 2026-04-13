import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/pages/landing/hero-section";

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
    </main>
  );
}
