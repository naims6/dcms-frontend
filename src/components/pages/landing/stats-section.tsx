import { useTranslations } from "next-intl";
import { Users, BookOpen, Trophy, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
  delay?: number;
}

function StatCard({
  icon,
  value,
  label,
  description,
  delay = 0,
}: StatCardProps) {
  return (
    <Card
      className="group bg-card/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-border/40 hover:border-primary/50"
      style={{
        animation: `slideUp 0.6s ease both ${delay}s`,
      }}
    >
      <CardContent className="p-6">
        <div className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {icon}
          </div>
        </div>
        
        <div className="pt-4 space-y-2">
          <p className="text-4xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {value}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsSection() {
  const t = useTranslations("Stats");

  const stats: StatCardProps[] = [
    {
      icon: <Users className="h-6 w-6" />,
      value: t("students.value"),
      label: t("students.label"),
      description: t("students.description"),
      delay: 0,
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      value: t("courses.value"),
      label: t("courses.label"),
      description: t("courses.description"),
      delay: 0.1,
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      value: t("passRate.value"),
      label: t("passRate.label"),
      description: t("passRate.description"),
      delay: 0.2,
    },
    {
      icon: <Award className="h-6 w-6" />,
      value: t("awards.value"),
      label: t("awards.label"),
      description: t("awards.description"),
      delay: 0.3,
    },
  ];

  return (
    <section className="w-full py-20 md:py-32 bg-background border-y border-border/40">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mb-4">
            {t("title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 text-base md:text-lg">
            {t("subtitle")}
          </p>
          <div className="w-16 h-1.5 bg-primary mx-auto rounded-full" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
