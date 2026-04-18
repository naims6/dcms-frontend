import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForumCTA() {
  const t = useTranslations("AlumniForumPage");

  return (
    <section
      id="join"
      className="border-t border-border bg-background py-16 md:py-20"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-background to-secondary/10 p-10 shadow-xl shadow-primary/5 md:p-14">
          {/* Decorative blobs */}
          <div
            className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
                <Users className="h-4 w-4" />
                {t("cta.badge")}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {t("cta.title")}{" "}
                <span className="text-primary">{t("cta.titleHighlight")}</span>
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {t("cta.description")}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row shrink-0">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-transform"
                asChild
              >
                <Link href="/register">{t("cta.button")}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 hover:-translate-y-0.5 transition-transform"
                asChild
              >
                <Link href="#categories">{t("cta.secondaryButton")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
