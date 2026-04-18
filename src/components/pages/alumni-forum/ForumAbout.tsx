import { useTranslations } from "next-intl";
import { Shield, Heart } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

interface TrustCardProps {
  icon: React.ElementType;
  title: string;
  text: string;
  accent: string;
}

function TrustCard({ icon: Icon, title, text, accent }: TrustCardProps) {
  return (
    <div className="flex gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-1">
          {title}
        </p>
        <p className="text-base text-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

export default function ForumAbout() {
  const t = useTranslations("AlumniForumPage");

  return (
    <section className="border-t border-border bg-background py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeader badge={t("about.badge")} title={t("about.title")} />

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Text content */}
          <div className="space-y-5">
            <p className="text-base leading-7 text-muted-foreground">
              {t("about.paragraph1")}
            </p>
            <p className="text-base leading-7 text-muted-foreground">
              {t("about.paragraph2")}
            </p>
          </div>

          {/* Trust cards */}
          <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-sm shadow-primary/5 space-y-8">
            <TrustCard
              icon={Shield}
              title={t("about.trustTitle")}
              text={t("about.trustText")}
              accent="bg-primary/10 text-primary"
            />
            <div className="h-px bg-border" />
            <TrustCard
              icon={Heart}
              title={t("about.heritageTitle")}
              text={t("about.heritageText")}
              accent="bg-secondary/15 text-secondary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
