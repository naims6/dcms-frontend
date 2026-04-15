"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  GraduationCap,
  Target,
  Eye,
  Star,
  Shield,
  Users,
  Lightbulb,
  Crown,
  Heart,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  Dumbbell,
  Monitor,
  Music,
  Lock,
  UtensilsCrossed,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── Value Card ───────────────────────────────────────────────────────────────
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

// ─── Timeline Item ─────────────────────────────────────────────────────────────
interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLeft: boolean;
  delay?: number;
}

function TimelineItem({
  year,
  title,
  description,
  isLeft,
  delay = 0,
}: TimelineItemProps) {
  return (
    <div
      className={`relative flex items-start gap-6 md:gap-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Content */}
      <div
        className={`flex-1 md:max-w-[calc(50%-2rem)] ${isLeft ? "md:pr-10 md:text-right" : "md:pl-10"}`}
      >
        <div
          className={`group p-5 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300 ${
            isLeft ? "md:ml-auto" : ""
          }`}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {year}
          </span>
          <h3 className="text-base font-bold text-foreground mb-1.5">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex md:w-16 shrink-0 items-start justify-center pt-5">
        <div className="relative">
          <div className="h-4 w-4 rounded-full bg-primary ring-4 ring-primary/20 shadow-md shadow-primary/30" />
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
        </div>
      </div>

      {/* Empty right */}
      <div className="hidden md:block flex-1" />

      {/* Mobile left dot */}
      <div className="md:hidden shrink-0 mt-5">
        <div className="relative">
          <div className="h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
        </div>
      </div>
    </div>
  );
}

// ─── Facility Item ─────────────────────────────────────────────────────────────
interface FacilityItemProps {
  icon: React.ReactNode;
  label: string;
}

function FacilityItem({ icon, label }: FacilityItemProps) {
  return (
    <div className="group flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80 hover:-translate-y-0.5 transition-all duration-300">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
        {icon}
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────────
function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center flex flex-col items-center mb-14">
      {badge && (
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 dark:bg-primary/12 px-4 py-1.5 text-sm font-semibold text-primary mb-4 tracking-wide">
          {badge}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground uppercase mb-4">
        {title}
      </h2>
      <div className="w-16 h-1.5 bg-primary rounded-full mb-5" />
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AboutUsPage() {
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

  const timeline = [
    {
      yearKey: "history1Year",
      titleKey: "history1Title",
      descKey: "history1Desc",
    },
    {
      yearKey: "history2Year",
      titleKey: "history2Title",
      descKey: "history2Desc",
    },
    {
      yearKey: "history3Year",
      titleKey: "history3Title",
      descKey: "history3Desc",
    },
    {
      yearKey: "history4Year",
      titleKey: "history4Title",
      descKey: "history4Desc",
    },
    {
      yearKey: "history5Year",
      titleKey: "history5Title",
      descKey: "history5Desc",
    },
  ];

  const facilities: { icon: React.ReactNode; labelKey: string }[] = [
    { icon: <FlaskConical className="h-5 w-5" />, labelKey: "facility1" },
    { icon: <BookOpen className="h-5 w-5" />, labelKey: "facility2" },
    { icon: <Dumbbell className="h-5 w-5" />, labelKey: "facility3" },
    { icon: <Monitor className="h-5 w-5" />, labelKey: "facility4" },
    { icon: <Music className="h-5 w-5" />, labelKey: "facility5" },
    { icon: <Lock className="h-5 w-5" />, labelKey: "facility6" },
    { icon: <UtensilsCrossed className="h-5 w-5" />, labelKey: "facility7" },
    { icon: <Stethoscope className="h-5 w-5" />, labelKey: "facility8" },
  ];

  const introStats = [
    {
      value: t("heroStat1Value"),
      label: t("heroStat1Label"),
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      value: t("heroStat2Value"),
      label: t("heroStat2Label"),
      icon: <Users className="h-4 w-4" />,
    },
    {
      value: t("heroStat3Value"),
      label: t("heroStat3Label"),
      icon: <Star className="h-4 w-4" />,
    },
  ];

  return (
    <main className="flex-1 overflow-hidden">
      {/* ══════════════════════════════════════════════════════════════
          1. INTRO
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-background border-b border-border/40">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute left-1/2 -top-32 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-55 dark:opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, oklch(from var(--border) l c h / 0.7) 1px, transparent 1px),
                linear-gradient(to bottom, oklch(from var(--border) l c h / 0.7) 1px, transparent 1px)
              `,
              backgroundSize: "26px 26px",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 20%, #000 35%, transparent 100%)",
              maskImage:
                "radial-gradient(circle at 50% 20%, #000 35%, transparent 100%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-18 md:py-24 xl:py-28 relative z-10">
          <div className="">
            <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-8 xl:gap-12 items-center">
              <div className="space-y-6 text-center xl:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  <GraduationCap className="h-4 w-4" />
                  {t("heroBadge")}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl lg:text-6xl xl:text-[3.45rem]">
                  <span className="text-foreground">{t("heroTitle")}</span>{" "}
                  <span className="text-primary">
                    {t("heroTitleHighlight")}
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed xl:mx-0 xl:max-w-xl">
                  {t("heroSubtitle")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr] items-stretch xl:gap-8">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card max-h-[400px]">
              <Image
                src="/images/hero-school2.png"
                alt="Dhanbari Collegiate Model School"
                width={1200}
                height={800}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xs uppercase tracking-[0.16em] text-white/85 font-semibold">
                  Legacy of excellence
                </p>
                <p className="mt-2 text-sm md:text-base font-semibold">
                  Building confident learners and responsible leaders since
                  1972.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-border/60 bg-muted/40 p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-primary font-semibold mb-2">
                  Mission Snapshot
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("missionText")}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-primary font-semibold mb-2">
                  Vision Snapshot
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t("visionText")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 xl:justify-start">
            <Link href="/admissions">
              <Button
                size="lg"
                className="h-12 px-8 rounded-xl gap-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-xl font-semibold border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all duration-300"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          2. MISSION & VISION
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-32 bg-background border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title={t("missionTitle")}
            subtitle={t("missionSubtitle")}
          />

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-8 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              {/* Accent corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[80px]" />
              <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-[60px]" />

              <div className="flex items-start gap-4 mb-5">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {t("missionHeading")}
                  </h3>
                </div>
              </div>
              <div className="w-12 h-1 bg-primary rounded-full mb-5 group-hover:w-20 transition-all duration-500" />
              <p className="text-muted-foreground leading-relaxed">
                {t("missionText")}
              </p>
            </div>

            {/* Vision */}
            <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-8 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[80px]" />
              <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-[60px]" />

              <div className="flex items-start gap-4 mb-5">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Eye className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {t("visionHeading")}
                  </h3>
                </div>
              </div>
              <div className="w-12 h-1 bg-primary rounded-full mb-5 group-hover:w-20 transition-all duration-500" />
              <p className="text-muted-foreground leading-relaxed">
                {t("visionText")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. CORE VALUES
      ══════════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════════
          4. HISTORY TIMELINE
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-32 bg-background border-b border-border/40 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title={t("historyTitle")}
            subtitle={t("historySubtitle")}
          />

          {/* Timeline */}
          <div className="relative">
            {/* Central line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2" />

            <div className="flex flex-col gap-10 md:gap-12">
              {timeline.map((item, idx) => (
                <TimelineItem
                  key={item.yearKey}
                  year={t(item.yearKey as Parameters<typeof t>[0])}
                  title={t(item.titleKey as Parameters<typeof t>[0])}
                  description={t(item.descKey as Parameters<typeof t>[0])}
                  isLeft={idx % 2 === 0}
                  delay={idx * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. FACILITIES
      ══════════════════════════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-32 bg-muted/30 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title={t("facilitiesTitle")}
            subtitle={t("facilitiesSubtitle")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {facilities.map((f) => (
              <FacilityItem
                key={f.labelKey}
                icon={f.icon}
                label={t(f.labelKey as Parameters<typeof t>[0])}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
