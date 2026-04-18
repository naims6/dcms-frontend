import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/SectionHeader";

export default function ForumAbout() {
  const t = useTranslations("AlumniForumPage");

  return (
    <section className="border-t border-border bg-background py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader badge={t("about.badge")} title={t("about.title")} />

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <p className="text-base leading-7 text-muted-foreground">
              {t("about.paragraph1")}
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              {t("about.paragraph2")}
            </p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-4">
              <p className="text-base leading-7 text-muted-foreground">
                {t("about.trustText")}
              </p>
              <div className="h-px bg-border" />
              <p className="text-base leading-7 text-muted-foreground">
                {t("about.heritageText")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
