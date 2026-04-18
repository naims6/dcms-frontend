import { GraduationCap, Users, Sparkles, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageIntro from "@/components/shared/PageIntro";

interface StatItem {
  value: string;
  label: string;
  icon: React.ElementType;
  accent: string;
}

function StatCard({ value, label, icon: Icon, accent }: StatItem) {
  return (
    <Card className="transition hover:-translate-y-1 hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ForumHero() {
  const t = useTranslations("AlumniForumPage");

  const stats: StatItem[] = [
    {
      value: t("hero.stats.alumniCount"),
      label: t("hero.stats.alumniCountLabel"),
      icon: Users,
      accent: "bg-primary/10 text-primary",
    },
    {
      value: t("hero.stats.eventsCount"),
      label: t("hero.stats.eventsCountLabel"),
      icon: Sparkles,
      accent: "bg-secondary/15 text-secondary",
    },
    {
      value: t("hero.stats.discussionsCount"),
      label: t("hero.stats.discussionsCountLabel"),
      icon: MessageSquare,
      accent: "bg-primary/10 text-primary",
    },
  ];

  return (
    <PageIntro
      badgeIcon={<GraduationCap className="h-4 w-4" />}
      badgeText={t("hero.badge")}
      title={t("hero.title")}
      titleHighlight={t("hero.titleHighlight")}
      description={t("hero.description")}
    >
      {/* CTA Buttons */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          size="lg"
          className="rounded-full px-8 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform"
          asChild
        >
          <Link href="#join">{t("hero.primaryCTA")}</Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full px-8 hover:-translate-y-0.5 transition-transform"
          asChild
        >
          <Link href="#categories">{t("hero.secondaryCTA")}</Link>
        </Button>
      </div>

      {/* Stats Row */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </PageIntro>
  );
}
