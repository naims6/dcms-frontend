import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Trophy } from "lucide-react";
import {
  HERO_STATS,
  HERO_PASS_RATE_CARD,
  HERO_FOUNDED_YEAR,
} from "@/constants/heroStats";

export function HeroSection() {
  const t = useTranslations("Hero");

  return (
    <section className="relative w-full min-h-200 overflow-hidden bg-background flex items-center border-b border-border/40">
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 1st layer  */}
        <div className="absolute right-[28%] top-0 hidden h-37.5 w-50 rotate-12 rounded-3xl bg-linear-to-l from-blue-600 to-sky-400 opacity-15 blur-3xl filter dark:block dark:opacity-20 lg:top-44 lg:-right-20 lg:h-72 lg:w-87.5 xl:h-80 xl:w-112.5"></div>

        {/* 2nd linear  */}
        <div className="absolute bottom-44 -left-64 hidden h-37.5 w-225 -rotate-45 rounded-3xl bg-linear-to-r from-violet-600 to-indigo-800 opacity-15 blur-3xl filter dark:block lg:bottom-24 lg:-left-20 lg:h-28 lg:w-62.5 lg:-rotate-12 lg:opacity-20 xl:h-40 xl:w-100"></div>

        {/* 3rd linear */}
        <div className="absolute left-[28%] top-28 hidden rotate-12 rounded-3xl bg-sky-800 opacity-60 blur-3xl filter dark:opacity-20 lg:h-32 lg:w-112.5 dark:lg:block xl:h-44 xl:w-150"></div>

        <div className="min-h-full w-full relative">
          {/* Top Fade Grid Background */}
          <div
            className="absolute inset-0 z-0 dark:opacity-5 opacity-55"
            style={{
              backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
              backgroundSize: "20px 30px",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-6 py-16 md:py-28 relative z-10 ">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 xl:gap-20 items-center">
          {/* ── Left: Text Content ── */}
          <div
            className="flex flex-col justify-center space-y-8"
            style={{ animation: "heroFadeUp 0.7s ease both" }}
          >
            {/* Badge — glassmorphism pill */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/8 dark:bg-primary/12 px-4 py-1.5 text-sm font-medium text-primary shadow-sm shadow-primary/10 backdrop-blur-md dark:backdrop-blur-xl">
              <GraduationCap className="h-4 w-4" />
              {t("badge")}
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl lg:text-6xl xl:text-[4rem] 2xl:text-[4.5rem]">
                <span className="text-foreground">{t("headline")}</span>
              </h1>

              <p className="max-w-135 text-muted-foreground text-base md:text-lg leading-relaxed">
                {t("subheading")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="h-12 px-8 rounded-xl gap-2 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
              >
                {t("applyNow")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-xl font-semibold border-primary/20 bg-primary/5 dark:bg-primary/8 backdrop-blur-md hover:bg-primary/10 dark:hover:bg-primary/15 transition-all duration-300"
              >
                {t("learnMore")}
              </Button>
            </div>

            {/* Stats Row — values from constants, labels from i18n */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/40">
              {HERO_STATS.map(({ icon: Icon, value, labelKey }) => (
                <div key={labelKey} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary/70" />
                    <span className="text-2xl font-extrabold text-primary leading-none">
                      {value}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {t(labelKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Rectangular Image Block ── */}
          <div
            className="relative w-full"
            style={{ animation: "heroFadeUp 0.9s 0.15s ease both" }}
          >
            {/* Multi-layer glow behind image */}
            <div className="absolute -inset-6 rounded-3xl bg-primary/8 blur-3xl z-0" />
            <div className="absolute -inset-2 rounded-3xl bg-primary/12 blur-xl z-0" />

            {/* Main rectangular image card — glassmorphism border */}
            <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-white/30 dark:border-primary/25  bg-card ring-1 ring-primary/10">
              {/* linear overlay on image */}
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-transparent z-10 pointer-events-none" />

              {/* Top shimmer line */}
              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent z-20" />

              <Image
                src="/images/hero-school2.png"
                alt={t("imageAlt")}
                width={900}
                height={600}
                className="w-full h-auto object-cover aspect-3/2 transition-transform duration-700 hover:scale-[1.03]"
                priority
              />

              {/* Bottom linear caption bar */}
              <div className="absolute bottom-0 inset-x-0 z-20 h-28 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-5 left-5 z-20 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                  <GraduationCap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-white text-sm font-semibold drop-shadow">
                  {t("captionText", { year: HERO_FOUNDED_YEAR })}
                </span>
              </div>
            </div>

            {/* Floating "Pass Rate" card — glassmorphism */}
            <div
              className="absolute -bottom-5 -right-4 md:-right-8 z-20 px-5 py-4 rounded-2xl border border-primary/20 dark:border-primary/30 bg-white/85 dark:bg-[oklch(0.18_0.04_260)]/90 backdrop-blur-2xl shadow-2xl shadow-primary/15 hidden sm:block ring-1 ring-primary/10"
              style={{ animation: "heroFloat 3s ease-in-out infinite" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                  <Trophy className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-foreground leading-none">
                    {HERO_PASS_RATE_CARD.value}
                  </p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mt-0.5">
                    {t(HERO_PASS_RATE_CARD.labelKey)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
