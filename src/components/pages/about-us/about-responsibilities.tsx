import { SectionHeader } from "@/components/shared/SectionHeader";
import { Crown, Heart, Lightbulb, Shield, Star, Users } from "lucide-react";
import { useTranslations } from "next-intl";

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

function ValueCard({ icon, title, description, delay = 0 }: ValueCardProps) {
  return (
    <div
      className="group relative p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:bg-card/80 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

const AboutResponsiblities = () => {
  const t = useTranslations("AboutPage");

  const values: { icon: React.ReactNode; titleKey: string; descKey: string }[] =
    [
      {
        icon: <Star className="h-5 w-5" />,
        titleKey: "value1Title",
        descKey: "value1Desc",
      },
      {
        icon: <Shield className="h-5 w-5" />,
        titleKey: "value2Title",
        descKey: "value2Desc",
      },
      {
        icon: <Users className="h-5 w-5" />,
        titleKey: "value3Title",
        descKey: "value3Desc",
      },
      {
        icon: <Lightbulb className="h-5 w-5" />,
        titleKey: "value4Title",
        descKey: "value4Desc",
      },
      {
        icon: <Crown className="h-5 w-5" />,
        titleKey: "value5Title",
        descKey: "value5Desc",
      },
      {
        icon: <Heart className="h-5 w-5" />,
        titleKey: "value6Title",
        descKey: "value6Desc",
      },
    ];

  return (
    <section className="w-full py-20 md:py-32 bg-muted/30 border-b border-border/40">
      {/* Decorative bg blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full bg-primary/3 blur-3xl dark:bg-primary/5" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative">
        <SectionHeader
          title={t("valuesTitle")}
          subtitle={t("valuesSubtitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, idx) => (
            <ValueCard
              key={v.titleKey}
              icon={v.icon}
              title={t(v.titleKey as Parameters<typeof t>[0])}
              description={t(v.descKey as Parameters<typeof t>[0])}
              delay={idx * 0.07}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutResponsiblities;
