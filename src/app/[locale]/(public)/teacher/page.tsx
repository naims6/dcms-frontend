import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import PageIntro from "@/components/shared/PageIntro";
import { TeacherGrid } from "@/components/pages/teacher";

const TeacherPage = () => {
  const t = useTranslations("TeacherPage");

  return (
    <main className="flex-1 overflow-hidden">
      <PageIntro
        badgeIcon={<Users className="h-4 w-4" />}
        badgeText={t("heroBadge")}
        title={t("heroTitle")}
        titleHighlight={t("heroTitleHighlight")}
        description={t("heroSubtitle")}
      >
      </PageIntro>

      <section className="container mx-auto px-4 py-6 pb-20">
        <TeacherGrid />
      </section>
    </main>
  );
};

export default TeacherPage;