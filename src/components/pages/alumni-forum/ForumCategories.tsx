import { Megaphone, CalendarDays, Briefcase, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/SectionHeader";

interface CategoryItem {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

function CategoryCard({
  title,
  description,
  icon: Icon,
  accent,
}: CategoryItem) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function ForumCategories() {
  const t = useTranslations("AlumniForumPage");

  const categories: CategoryItem[] = [
    {
      title: t("categories.items.announcements.title"),
      description: t("categories.items.announcements.description"),
      icon: Megaphone,
      accent: "bg-primary/10 text-primary",
    },
    {
      title: t("categories.items.events.title"),
      description: t("categories.items.events.description"),
      icon: CalendarDays,
      accent: "bg-secondary/10 text-secondary",
    },
    {
      title: t("categories.items.jobs.title"),
      description: t("categories.items.jobs.description"),
      icon: Briefcase,
      accent: "bg-accent/10 text-accent-foreground",
    },
    {
      title: t("categories.items.stories.title"),
      description: t("categories.items.stories.description"),
      icon: BookOpen,
      accent: "bg-primary/10 text-primary",
    },
  ];

  return (
    <section
      id="categories"
      className="border-t border-border bg-muted/30 py-16 md:py-20"
    >
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          badge={t("categories.badge")}
          title={t("categories.title")}
          subtitle={t("categories.subtitle")}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => (
            <CategoryCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
