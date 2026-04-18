import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ForumHero from "@/components/pages/alumni-forum/ForumHero";
import ForumAbout from "@/components/pages/alumni-forum/ForumAbout";
import ForumCategories from "@/components/pages/alumni-forum/ForumCategories";
import ForumPosts from "@/components/pages/alumni-forum/ForumPosts";
import ForumEvents from "@/components/pages/alumni-forum/ForumEvents";
import ForumCTA from "@/components/pages/alumni-forum/ForumCTA";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "AlumniForumPage.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function AlumniForumPage() {
  return (
    <main className="flex-1 overflow-hidden">
      <ForumHero />
      <ForumAbout />
      <ForumCategories />
      <ForumPosts />
      <ForumEvents />
      <ForumCTA />
    </main>
  );
}
