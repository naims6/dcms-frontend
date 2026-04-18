import { useTranslations } from "next-intl";
import { ArrowRight, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Badge } from "@/components/ui/badge";

interface PostItem {
  titleKey: string;
  authorKey: string;
  dateKey: string;
  previewKey: string;
  categoryKey: string;
}

const POST_KEYS: PostItem[] = [
  {
    titleKey: "posts.items.0.title",
    authorKey: "posts.items.0.author",
    dateKey: "posts.items.0.date",
    previewKey: "posts.items.0.preview",
    categoryKey: "posts.items.0.category",
  },
  {
    titleKey: "posts.items.1.title",
    authorKey: "posts.items.1.author",
    dateKey: "posts.items.1.date",
    previewKey: "posts.items.1.preview",
    categoryKey: "posts.items.1.category",
  },
  {
    titleKey: "posts.items.2.title",
    authorKey: "posts.items.2.author",
    dateKey: "posts.items.2.date",
    previewKey: "posts.items.2.preview",
    categoryKey: "posts.items.2.category",
  },
];

export default function ForumPosts() {
  const t = useTranslations("AlumniForumPage");

  return (
    <section
      id="recent-posts"
      className="border-t border-border bg-background py-16 md:py-20"
    >
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader
          badge={t("posts.badge")}
          title={t("posts.title")}
          subtitle={t("posts.subtitle")}
        />

        <div className="space-y-4">
          {POST_KEYS.map((post) => (
            <Card
              key={post.titleKey}
              className="group transition-all duration-300 hover:-translate-y-0.5"
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {t(post.categoryKey)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {t(post.dateKey)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t(post.titleKey)}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {t(post.previewKey)}
                    </p>
                  </div>
                  <ArrowRight className="hidden sm:block h-5 w-5 shrink-0 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 mt-1" />
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {t(post.authorKey)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
