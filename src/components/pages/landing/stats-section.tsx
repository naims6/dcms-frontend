"use client";

import { useTranslations } from "next-intl";
import { Users, BookOpen, Trophy, Award } from "lucide-react";

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
    <div
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/50 p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
      style={{
        animation: `slideUp 0.6s ease both ${delay}s`,
      }}
    >
      {/* Premium gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Animated border light effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(45deg, transparent 30%, rgba(var(--color-primary), 0.1) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Icon Container with premium styling */}
        <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:from-primary/30 group-hover:to-accent/30 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/5">
          {icon}
        </div>

        {/* Value */}
        <div className="space-y-2">
          <p className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-accent group-hover:from-primary/90 group-hover:via-primary group-hover:to-primary/90 transition-all duration-300">
            {value}
          </p>
          <p className="text-sm md:text-base font-bold text-foreground uppercase tracking-wide">
            {label}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
          {description}
        </p>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 rounded-t-full" />

        {/* Hover indicator dot */}
        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-150 transition-all duration-300" />
      </div>
    </div>
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
    <section className="relative w-full py-20 md:py-28 lg:py-36 bg-muted/20 overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Premium Section Header */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 w-fit mx-auto backdrop-blur-sm">
            <svg
              className="h-4 w-4 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Our Excellence
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
              {t("title")}
            </h2>
            <div className="h-1.5 w-32 bg-gradient-to-r from-primary via-primary/70 to-accent rounded-full mx-auto" />
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            {t("subtitle")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-6">
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
